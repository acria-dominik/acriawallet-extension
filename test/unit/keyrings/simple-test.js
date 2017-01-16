const assert = require('assert')
const extend = require('xtend')
const ethUtil = require('ethereumjs-util')
const SimpleKeyring = require('../../../app/scripts/keyrings/simple')
const TYPE_STR = 'Simple Key Pair'

// Sample account:
const privKeyHex = 'b8a9c05beeedb25df85f8d641538cbffedf67216048de9c678ee26260eb91952'

describe('simple-keyring', function() {

  let keyring
  beforeEach(function() {
    keyring = new SimpleKeyring()
  })

  describe('Keyring.type', function() {
    it('is a class property that returns the type string.', function() {
      const type = SimpleKeyring.type
      assert.equal(type, TYPE_STR)
    })
  })

  describe('#type', function() {
    it('returns the correct value', function() {
      const type = keyring.type
      assert.equal(type, TYPE_STR)
    })
  })

  describe('#serialize empty wallets.', function() {
    it('serializes an empty array', function(done) {
      keyring.serialize()
      .then((output) => {
        assert.deepEqual(output, [])
        done()
      })
    })
  })

  describe('#deserialize a private key', function() {
    it('serializes what it deserializes', function() {
      keyring.deserialize([privKeyHex])
      .then(() => {
        assert.equal(keyring.wallets.length, 1, 'has one wallet')
        const serialized = keyring.serialize()
        assert.equal(serialized[0], privKeyHex)
      })
    })
  })

  describe('#addAccounts', function() {
    describe('with no arguments', function() {
      it('creates a single wallet', function() {
        keyring.addAccounts()
        .then(() => {
          assert.equal(keyring.wallets.length, 1)
        })
      })
    })

    describe('with a numeric argument', function() {
      it('creates that number of wallets', function() {
        keyring.addAccounts(3)
        .then(() => {
          assert.equal(keyring.wallets.length, 3)
        })
      })
    })
  })

  describe('#getAccounts', function() {
    it('calls getAddress on each wallet', function(done) {

      // Push a mock wallet
      const desiredOutput = '0x18a3462427bcc9133bb46e88bcbe39cd7ef0e761'
      keyring.wallets.push({
        getAddress() {
          return ethUtil.toBuffer(desiredOutput)
        }
      })

      keyring.getAccounts()
      .then((output) => {
        assert.equal(output[0], desiredOutput)
        assert.equal(output.length, 1)
        done()
      })
    })
  })
})
