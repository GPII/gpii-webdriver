// Helper functions for use in the tests in this directory.
/* eslint-env node */
"use strict";
var fluid = require("infusion");
var gpii  = fluid.registerNamespace("gpii");

fluid.registerNamespace("gpii.tests.webdriver.qunit");

gpii.tests.webdriver.qunit.getResults = function (outputFormat) {
    return gpii.webdriver.client.QUnitHarness.instance.outputResults(outputFormat);
};

var jqUnit = require("node-jqunit");
gpii.tests.webdriver.qunit.checkTapOutput = function (output) {
    jqUnit.assertTrue("There should be a TAP header...", output.indexOf("TAP version") !== -1);
    jqUnit.assertTrue("There should be six passing tests...", output.match(/^ok/mg).length === 6);
    jqUnit.assertTrue("There should be six failures...", output.match(/^not ok/mg).length === 6);
    jqUnit.assertTrue("There should be a TAP footer...", output.indexOf("1..12") !== -1);
};

gpii.tests.webdriver.qunit.checkTextOutput = function (output) {
    jqUnit.assertTrue("There should be six passing tests...", output.match(/PASS$/mg).length === 6);
    jqUnit.assertTrue("There should be six failures...", output.match(/FAIL$/mg).length === 6);
    jqUnit.assertTrue("The summary should be correct...", output.indexOf("All tests concluded: 6/12") !== -1);
};