// Helper functions for use in the tests in this directory.
/* eslint-env node */
"use strict";
var fluid = require("infusion");

fluid.registerNamespace("fluid.tests.webdriver.qunit");

var jqUnit = require("node-jqunit");
fluid.tests.webdriver.qunit.checkTapOutput = function (output) {
    jqUnit.assertTrue("There should be a TAP header...", output.indexOf("TAP version") !== -1);
    fluid.tests.webdriver.qunit.checkOutput(output, /^ok/mg, 6, /^not ok/mg, 6, "1..12");
};

fluid.tests.webdriver.qunit.checkTextOutput = function (output) {
    fluid.tests.webdriver.qunit.checkOutput(output, /PASS$/mg, 6, /FAIL$/mg, 6, "All tests concluded: 6/12");
};

fluid.tests.webdriver.qunit.checkOutput = function (output, passingTestPattern, passingTestCount, failingTestPattern, failingTestCount, footerString) {
    var passingTestMatches = output.match(passingTestPattern);
    jqUnit.assertEquals("There should be the correct number of passing tests...", passingTestCount, passingTestMatches && passingTestMatches.length);

    var failingTestMatches = output.match(failingTestPattern);
    jqUnit.assertEquals("There should be the correct number of failures...", failingTestCount, failingTestMatches && failingTestMatches.length);

    jqUnit.assertTrue("The footer should be correct...", output.indexOf(footerString) !== -1);
};
