const EthQuery = require('ethjs-query')
const assert = require('assert')
const Mutex = require('await-semaphore').Mutex

class NonceTracker {

  constructor ({ provider, getPendingTransactions, getConfirmedTransactions }) {
    this.provider = provider
    this.ethQuery = new EthQuery(provider)
    this.getPendingTransactions = getPendingTransactions
    this.getConfirmedTransactions = getConfirmedTransactions
    this.lockMap = {}
  }

  async getGlobalLock () {
    const globalMutex = this._lookupMutex('global')
    // await global mutex free
    const releaseLock = await globalMutex.acquire()
    return { releaseLock }
  }

  // releaseLock must be called
  // releaseLock must be called after adding signed tx to pending transactions (or discarding)
  async getNonceLock (address) {
    // await global mutex free
    await this._globalMutexFree()
    // await lock free, then take lock
    const releaseLock = await this._takeMutex(address)
    // evaluate multiple nextNonce strategies
    const nonceDetails = {}
    const networkNonceResult = await this._getNetworkNextNonce(address)
    const highestLocallyConfirmed = this._getHighestLocallyConfirmed(address)
    const highestConfirmed = Math.max(networkNonceResult.nonce, highestLocallyConfirmed)
    const pendingTxs = this.getPendingTransactions(address)
    const localNonceResult = this._getHighestContinuousFrom(pendingTxs, highestConfirmed) || 0

    nonceDetails.local = localNonceResult.details
    nonceDetails.network = networkNonceResult.details
    const nextNonce = Math.max(networkNonceResult.nonce, localNonceResult.nonce)
    assert(Number.isInteger(nextNonce), `nonce-tracker - nextNonce is not an integer - got: (${typeof nextNonce}) "${nextNonce}"`)

    // return nonce and release cb
    return { nextNonce, nonceDetails, releaseLock }
  }

  async _getCurrentBlock () {
    const blockTracker = this._getBlockTracker()
    const currentBlock = blockTracker.getCurrentBlock()
    if (currentBlock) return currentBlock
    return await Promise((reject, resolve) => {
      blockTracker.once('latest', resolve)
    })
  }

  async _globalMutexFree () {
    const globalMutex = this._lookupMutex('global')
    const release = await globalMutex.acquire()
    release()
  }

  async _takeMutex (lockId) {
    const mutex = this._lookupMutex(lockId)
    const releaseLock = await mutex.acquire()
    return releaseLock
  }

  _lookupMutex (lockId) {
    let mutex = this.lockMap[lockId]
    if (!mutex) {
      mutex = new Mutex()
      this.lockMap[lockId] = mutex
    }
    return mutex
  }

  async _getNetworkNextNonce (address) {
    // calculate next nonce
    // we need to make sure our base count
    // and pending count are from the same block
    const currentBlock = await this._getCurrentBlock()
    const blockNumber = currentBlock.blockNumber
    const baseCountHex = await this.ethQuery.getTransactionCount(address, blockNumber)
    const baseCount = parseInt(baseCountHex, 16)
    assert(Number.isInteger(baseCount), `nonce-tracker - baseCount is not an integer - got: (${typeof baseCount}) "${baseCount}"`)
    const nonceDetails = { blockNumber, baseCount }
    return { name: 'network', nonce: baseCount, details: nonceDetails }
  }

  _getHighestLocallyConfirmed (address) {
    const confirmedTransactions = this.getConfirmedTransactions(address)
    const highest = this._getHighestNonce(confirmedTransactions)
    return highest
  }

  _reduceTxListToUniqueNonces (txList) {
    const reducedTxList = txList.reduce((reducedList, txMeta, index) => {
      if (!index) return [txMeta]
      const nonceMatches = txList.filter((txData) => {
        return txMeta.txParams.nonce === txData.txParams.nonce
      })
      if (nonceMatches.length > 1) return reducedList
      reducedList.push(txMeta)
      return reducedList
    }, [])
    return reducedTxList
  }

  _getHighestNonce (txList) {
    const nonces = txList.map((txMeta) => parseInt(txMeta.txParams.nonce, 16))
    const highestNonce = Math.max.apply(null, nonces)
    return highestNonce
  }

  _getHighestContinuousFrom (txList, startPoint) {
    const nonces = txList.map((txMeta) => parseInt(txMeta.txParams.nonce, 16))

    let highest = startPoint
    while (nonces.includes(highest + 1)) {
      highest++
    }

    const haveHighestNonce = Number.isInteger(highest) && highest > 0
    const nonce = haveHighestNonce ? highest + 1 : 0

    return { name: 'local', nonce }
  }

  // this is a hotfix for the fact that the blockTracker will
  // change when the network changes
  _getBlockTracker () {
    return this.provider._blockTracker
  }
}

module.exports = NonceTracker
