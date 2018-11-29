const chalk = require("chalk");

// chalk logging
const { log } = console;
const chalkSuccess = chalk.bold.green.bgWhite;
const chalkFailure = chalk.bold.red.bgBlack;
const chalkWarning = chalk.underline.orange;
const chalkInfo = chalk.blue.bgBlack;

module.exports = {
  log,
  chalkSuccess,
  chalkFailure,
  chalkWarning,
  chalkInfo,
};
