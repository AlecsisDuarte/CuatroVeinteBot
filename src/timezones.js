const Timezones = require('../config/timezones.json');
const MAX_BUTTONS_HORIZONTAL = 3;

/**
 * Creates the buttons of the named buttons
 * @returns {Array<Array<String>>} Array of named buttons
 */
exports.getNamedButtons = function() {
  const allRegionButtons = Object.keys(Timezones.Regions);
  const namedButtons = {};
  for (let index = 0; index < allRegionButtons.length; index++) {
    const region = allRegionButtons[index];
    const button = {
      label: region,
      command: '/region'
    };
    namedButtons[region.toLowerCase()] = button;
  }
  return namedButtons;
}

/**
 * @returns {Object} Creates the named region buttons
 */
exports.getRegionButtons = function () {
  const allRegionButtons = Object.keys(Timezones.Regions);
  const verticalArrangedButtons = [];

  let row = [];
  for (let index = 0; index < allRegionButtons.length; index++) {
    row.push(allRegionButtons[index]);

    if ((index + 1) % MAX_BUTTONS_HORIZONTAL === 0) {
      verticalArrangedButtons.push([...row]);
      row = [];
    }
  }
  if (row.length > 0) {
    verticalArrangedButtons.push([...row]);
  }

  return verticalArrangedButtons;
}

/**
 * Check whether or not the specified region exists
 * @param {String} region Region to verify
 * @returns {Boolean} Whether it exists or not
 */
exports.hasRegion = function(region) {
  return Timezones.Regions[region] !== undefined;
}

/**
 * Check whether or not the specified region exists
 * @param {String} region Region to verify
 * @returns {Array<Array<String>>} 
 */
exports.getRegionAreasButtons = function (region) {
  const allAreas = Timezones.Regions[region];
  const verticalArrangedButtons = [];

  let row = [];
  for (let index = 0; index < allAreas.length; index++) {
    row.push(allAreas[index]);

    if ((index + 1) % MAX_BUTTONS_HORIZONTAL === 0) {
      verticalArrangedButtons.push([...row]);
      row = [];
    }
  }
  if (row.length > 0) {
    verticalArrangedButtons.push([...row]);
  }

  return verticalArrangedButtons;
}