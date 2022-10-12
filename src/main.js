'use strict';
const help = require('./helper');


/**
 * @description use the shell js module to execute the vcc-lint.sh script to create a JSON Representation of an ESLintRun
 */

async function main() {
    const json = help.createJSON();
    const eslintResults = help.getEslintResults(json, ['ruleId', 'severity', 'line', 'message']);
    await help.convertToCSV(eslintResults);
}

module.exports = {
    main
}
