/* Currency Conversion Utility
* This utility function can be used for converting currency related values within metamask.
* The caller should be able to pass it a value, along with information about the value's
* numeric base, denomination and currency, and the desired numeric base, denomination and
* currency. It should return a single value.
*
* @param {(number | string | BN)} value - The value to convert.
* @param {Object} [options] Options to specify details of the conversion
* @param {string} [options.fromCurrency = 'ETH' | 'USD'] The currency of the passed value
* @param {string} [options.toCurrency = 'ETH' | 'USD'] The desired currency of the result
* @param {string} [options.fromNumericBase = 'hex' | 'dec' | 'BN'] The numeric basic of the passed value.
* @param {string} [options.toNumericBase = 'hex' | 'dec' | 'BN'] The desired numeric basic of the result.
* @param {string} [options.fromDenomination = 'WEI'] The denomination of the passed value
* @param {string} [options.numberOfDecimals] The desired number of decimals in the result
* @param {string} [options.roundDown] The desired number of decimals to round down to
* @param {number} [options.conversionRate] The rate to use to make the fromCurrency -> toCurrency conversion
* @returns {(number | string | BN)}
*
* The utility passes value along with the options as a single object to the `converter` function.
* `converter` conditional modifies the supplied `value` property, depending
* on the accompanying options.
*/

import BigNumber from 'bignumber.js'

import ethUtil, { stripHexPrefix } from 'ethereumjs-util'

const BN = ethUtil.BN

// Big Number Constants
const BIG_NUMBER_WEI_MULTIPLIER = new BigNumber('1000000000000000000')
const BIG_NUMBER_GWEI_MULTIPLIER = new BigNumber('1000000000')
const BIG_NUMBER_ETH_MULTIPLIER = new BigNumber('1')

// Setter Maps
const toBigNumber = {
  hex: (n) => new BigNumber(stripHexPrefix(n), 16),
  dec: (n) => new BigNumber(String(n), 10),
  BN: (n) => new BigNumber(n.toString(16), 16),
}
const toNormalizedDenomination = {
  WEI: (bigNumber) => bigNumber.div(BIG_NUMBER_WEI_MULTIPLIER),
  GWEI: (bigNumber) => bigNumber.div(BIG_NUMBER_GWEI_MULTIPLIER),
  ETH: (bigNumber) => bigNumber.div(BIG_NUMBER_ETH_MULTIPLIER),
}
const toSpecifiedDenomination = {
  WEI: (bigNumber) => bigNumber.times(BIG_NUMBER_WEI_MULTIPLIER).round(),
  GWEI: (bigNumber) => bigNumber.times(BIG_NUMBER_GWEI_MULTIPLIER).round(9),
  ETH: (bigNumber) => bigNumber.times(BIG_NUMBER_ETH_MULTIPLIER).round(9),
}
const baseChange = {
  hex: (n) => n.toString(16),
  dec: (n) => (new BigNumber(n)).toString(10),
  BN: (n) => new BN(n.toString(16)),
}

/**
 * Defines the base type of numeric value
 * @typedef {('hex' | 'dec' | 'BN')} NumericBase
 */

/**
 * Defines which type of denomination a value is in
 * @typedef {('WEI' | 'GWEI' | 'ETH')} EthDenomination
 */

/**
 * Utility method to convert a value between denominations, formats and currencies.
 * @param {Object} input
 * @param {string | BigNumber} input.value
 * @param {NumericBase} input.fromNumericBase
 * @param {EthDenomination} [input.fromDenomination]
 * @param {string} [input.fromCurrency]
 * @param {NumericBase} input.toNumericBase
 * @param {EthDenomination} [input.toDenomination]
 * @param {string} [input.toCurrency]
 * @param {number} [input.numberOfDecimals]
 * @param {number} [input.conversionRate]
 * @param {boolean} [input.invertConversionRate]
 * @param {string} [input.roundDown]
 */
const converter = ({
  value,
  fromNumericBase,
  fromDenomination,
  fromCurrency,
  toNumericBase,
  toDenomination,
  toCurrency,
  numberOfDecimals,
  conversionRate,
  invertConversionRate,
  roundDown,
}) => {
  let convertedValue = fromNumericBase ? toBigNumber[fromNumericBase](value) : value

  if (fromDenomination) {
    convertedValue = toNormalizedDenomination[fromDenomination](convertedValue)
  }

  if (fromCurrency !== toCurrency) {
    if (conversionRate === null || conversionRate === undefined) {
      throw new Error(`Converting from ${fromCurrency} to ${toCurrency} requires a conversionRate, but one was not provided`)
    }
    let rate = toBigNumber.dec(conversionRate)
    if (invertConversionRate) {
      rate = new BigNumber(1.0).div(conversionRate)
    }
    convertedValue = convertedValue.times(rate)
  }

  if (toDenomination) {
    convertedValue = toSpecifiedDenomination[toDenomination](convertedValue)
  }

  if (numberOfDecimals) {
    convertedValue = convertedValue.round(numberOfDecimals, BigNumber.ROUND_HALF_DOWN)
  }

  if (roundDown) {
    convertedValue = convertedValue.round(roundDown, BigNumber.ROUND_DOWN)
  }

  if (toNumericBase) {
    convertedValue = baseChange[toNumericBase](convertedValue)
  }
  return convertedValue
}

const conversionUtil = (value, {
  fromCurrency = null,
  toCurrency = fromCurrency,
  fromNumericBase,
  toNumericBase,
  fromDenomination,
  toDenomination,
  numberOfDecimals,
  conversionRate,
  invertConversionRate,
}) => converter({
  fromCurrency,
  toCurrency,
  fromNumericBase,
  toNumericBase,
  fromDenomination,
  toDenomination,
  numberOfDecimals,
  conversionRate,
  invertConversionRate,
  value: value || '0',
})

const addCurrencies = (a, b, options = {}) => {
  const {
    aBase,
    bBase,
    ...conversionOptions
  } = options
  const value = (new BigNumber(a.toString(), aBase)).add(b.toString(), bBase)

  return converter({
    value,
    ...conversionOptions,
  })
}

const subtractCurrencies = (a, b, options = {}) => {
  const {
    aBase,
    bBase,
    ...conversionOptions
  } = options
  const value = (new BigNumber(String(a), aBase)).minus(b, bBase)

  return converter({
    value,
    ...conversionOptions,
  })
}

const multiplyCurrencies = (a, b, options = {}) => {
  const {
    multiplicandBase,
    multiplierBase,
    ...conversionOptions
  } = options

  const bigNumberA = new BigNumber(String(a), multiplicandBase)
  const bigNumberB = new BigNumber(String(b), multiplierBase)

  const value = bigNumberA.times(bigNumberB)

  return converter({
    value,
    ...conversionOptions,
  })
}

const conversionGreaterThan = (
  { ...firstProps },
  { ...secondProps },
) => {
  const firstValue = converter({ ...firstProps })
  const secondValue = converter({ ...secondProps })

  return firstValue.gt(secondValue)
}

const conversionLessThan = (
  { ...firstProps },
  { ...secondProps },
) => {
  const firstValue = converter({ ...firstProps })
  const secondValue = converter({ ...secondProps })

  return firstValue.lt(secondValue)
}

const conversionMax = (
  { ...firstProps },
  { ...secondProps },
) => {
  const firstIsGreater = conversionGreaterThan(
    { ...firstProps },
    { ...secondProps },
  )

  return firstIsGreater ? firstProps.value : secondProps.value
}

const conversionGTE = (
  { ...firstProps },
  { ...secondProps },
) => {
  const firstValue = converter({ ...firstProps })
  const secondValue = converter({ ...secondProps })
  return firstValue.greaterThanOrEqualTo(secondValue)
}

const conversionLTE = (
  { ...firstProps },
  { ...secondProps },
) => {
  const firstValue = converter({ ...firstProps })
  const secondValue = converter({ ...secondProps })
  return firstValue.lessThanOrEqualTo(secondValue)
}

const toNegative = (n, options = {}) => {
  return multiplyCurrencies(n, -1, options)
}

export {
  conversionUtil,
  addCurrencies,
  multiplyCurrencies,
  conversionGreaterThan,
  conversionLessThan,
  conversionGTE,
  conversionLTE,
  conversionMax,
  toNegative,
  subtractCurrencies,
}
