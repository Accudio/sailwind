module.exports.error = (message) => {
  console.error('ERROR sailwind: ' + message)
  return {}
}

module.exports.getScreen = (screen) => {
  if (screen.min) return screen.min
  if (screen.max) return screen.max
  return screen
}

module.exports.unitsMatch = (units) => {
  return [...new Set(units)].length === 1
}
