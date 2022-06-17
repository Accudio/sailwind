const plugin = require('tailwindcss/plugin')
const parse = require('parse-unit')
const convertLength = require('convert-css-length')

const { error, getScreen, unitsMatch } = require('./utils.js')
const defaultConfig = require('./config.js')

/**
 * fluidGenerator
 *
 * @param {Object} config   configuration object
 * @param {String} value    string from Tailwind JIT, eg. '10px@320px,100px@1024px'
 * @returns {String}        clamp output for use in CSS value
 */
const fluidGenerator = (config, value) => {
  // set default for viewport
  let viewportMin = config.min
  let viewportMax = config.max

  // format value string into parts
  const valParts = value.split(',')
  let valueMin = valParts[0]
  let valueMax = valParts[1]

  // check there are two provided values
  if (!valueMin || !valueMax) {
    return error('provide two valid values')
  }

  // check if first value has custom viewport
  if (valueMin.includes('@')) {
    const parts = valueMin.split('@')
    valueMin = parts[0]
    viewportMin = parts[1]
  }

  // check if second value has custom viewport
  if (valueMax.includes('@')) {
    const parts = valueMax.split('@')
    valueMax = parts[0]
    viewportMax = parts[1]
  }

  // check if custom viewports are references to tailwind breakpoints, if so pull those
  const minScreen = config.screens[viewportMin]
  const maxScreen = config.screens[viewportMax]
  if (minScreen) viewportMin = getScreen(minScreen)
  if (maxScreen) viewportMax = getScreen(maxScreen)

  // parse value and viewports to separate value and unit
  let valMin = parse(valueMin)
  let valMax = parse(valueMax)
  let vwMin = parse(viewportMin)
  let vwMax = parse(viewportMax)

  // if anything doesn't have a unit, have a fallback of defaults
  valMin[1] = valMin[1] || valMax[1] || 'px'
  valMax[1] = valMax[1] || valMin[1]
  vwMin[1] = vwMin[1] || vwMax[1] || valMin[1]
  vwMin[1] = vwMax[1] || vwMin[1]

  // check that value units match
  if (!unitsMatch([valMin[1], valMax[1]])) {
    return error('value units do not match')
  }

  // check that viewport units match
  if (!unitsMatch([vwMin[1], vwMax[1]])) {
    return error('viewport units do not match')
  }

  const unit = valMin[1]

  // if value units don't match viewport units, perform common conversion
  if (!unitsMatch([unit, vwMin[1]])) {
    // if converting has been disabled in config error instead
    if (!config.convertUnit) {
      return error(
        'value and viewport units do not match. Change units or enable `convertUnit`'
      )
    }

    const convert = convertLength(config.rootFontSize || '16px')
    vwMin = parse(convert(viewportMin, unit))
    vwMax = parse(convert(viewportMax, unit))
  }

  // work out the gradient, or vw / 100
  // (y2 - y1) / (x2 - x1)
  const m = (valMax[0] - valMin[0]) / (vwMax[0] - vwMin[0])
  // round to 3 decimal places and convert from m [0-1] to vw [0-100]
  const mRounded = Math.round(m * 10000) / 100

  // work out the y-intercept, or offset of line
  // c = y - m*x
  const c = valMax[0] - m * vwMax[0]
  // round to 2 decimal places
  const cRounded = Math.round(c * 100) / 100

  // order the parameters
  let lower = valMin[0]
  let higher = valMax[0]
  if (lower > higher) {
    lower = valMax[0]
    higher = valMin[0]
  }

  // generate output
  // eg, clamp(16px, calc(10vw - 24px), 120px)
  return `clamp(${lower}${unit}, calc(${mRounded}vw + ${cRounded}${unit}), ${higher}${unit})`
}

// caching object used in getFluid
let cache = {}

/**
 * getFluid
 *
 * adds a caching layer to fluidGenerator so we don't need to compute every time
 *
 * @param {Object} config   configuration from theme.fluid
 * @param {String} value    string from Tailwind JIT, eg. '10px@320px,100px@1024px'
 * @returns {String}        clamp output for use in CSS value, either generated or from cache
 */
const getFluid = (config, value) => {
  // if this has been generated before, return the cached copy
  if (cache[value]) return cache[value]

  // otherwise generate it, cache it and return
  const output = fluidGenerator(config, value)
  cache[value] = output
  return output
}

/**
 * fluidProperties
 *
 * @param {Object} config     configuration from theme.fluid
 * @param {String} value      string from Tailwind JIT, eg. '10px@320px,100px@1024px'
 * @param {Array}  properties  array of CSS properties to assign
 * @returns {Object}          object of 'CSS property': fluid
 */
const fluidProperties = (config, value, properties = []) => {
  const attVals = properties.map((prop) => [prop, getFluid(config, value)])

  return Object.fromEntries(attVals)
}

/**
 * fluidPlugin
 *
 * function passed into Tailwind's plugin generator, loop through configured
 * utilities and declare function to generate for each property
 *
 * @param {Object}   tw                 Tailwind plugin object
 * @param {function} tw.matchUtilities  declare new dynamic utilities
 * @param {function} tw.theme           pull config from theme
 */
const fluidPlugin = ({ matchUtilities, theme }) => {
  const config = {
		...defaultConfig,
    ...theme('fluid'),
    screens: theme('screens')
  }

  for (let utility in config.utilities) {
    matchUtilities({
      [`${config.prefix}${utility}`]: (value) =>
        fluidProperties(config, value, config.utilities[utility]),
    })
  }
}

// loop through configured utilities and generate for each
const fluid = plugin(fluidPlugin)

module.exports = fluid
