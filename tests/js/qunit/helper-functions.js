// Helper functions for use in the tests in this directory.
/* eslint-env node */
"use strict";
var fluid = require("infusion");
var gpii  = fluid.registerNamespace("gpii");

fluid.registerNamespace("gpii.tests.webdriver.qunit");

gpii.tests.webdriver.qunit.getResults = function (outputFormat) {
    return gpii.webdriver.QUnitHarness.instance.outputResults(outputFormat);
};

var jqUnit = require("node-jqunit");
gpii.tests.webdriver.qunit.checkTapOutput = function (output) {
    jqUnit.assertTrue("There should be a TAP header...", output.indexOf("TAP version") !== -1);
    gpii.tests.webdriver.qunit.checkOutput(output, /^ok/mg, 6, /^not ok/mg, 6, "1..12");
};

gpii.tests.webdriver.qunit.checkTextOutput = function (output) {
    gpii.tests.webdriver.qunit.checkOutput(output, /PASS$/mg, 6, /FAIL$/mg, 6, "All tests concluded: 6/12");
};

gpii.tests.webdriver.qunit.checkOutput = function (output, passingTestPattern, passingTestCount, failingTestPattern, failingTestCount, footerString) {
    jqUnit.assertEquals("There should be the correct number of passing tests...", passingTestCount, output.match(passingTestPattern).length);
    jqUnit.assertEquals("There should be the correct number of failures...", failingTestCount, output.match(failingTestPattern).length);
    jqUnit.assertTrue("The footer should be correct...", output.indexOf(footerString) !== -1);
};
