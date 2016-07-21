// TODO:  Review with Antranig and discuss the options for producing TAP output on the node side.
// Tests for the new QUnit log interceptor from within node.  These fail horribly, as the current harness does not appear to be able to capture test output from the QUnit stub produced by jqUnit.
/* eslint-env node */
"use strict";
var fluid = require("infusion");
var gpii  = fluid.registerNamespace("gpii");

require("../../../src/js/qunit-harness");

require("./helper-functions");

var jqUnit = require("node-jqunit");

//  We can only issue positive assertions, as they will be part of our results.  TODO:  Discuss whether it's possible to expand this.

jqUnit.module("Testing the new QUnit result harness from node...");
jqUnit.test("A test that should pass, should pass...", function () {
    jqUnit.assert("Normal things should be normal...");
});

// Make a copy of the current test output at the global level so that subsequent trapped events don't skew the results.
var tapOutput  = gpii.webdriver.QUnitHarness.instance.outputResults();
var textOutput = gpii.webdriver.QUnitHarness.instance.outputResults("text");

jqUnit.test("The TAP output should be correct...", function () {
    gpii.tests.webdriver.qunit.checkOutput(tapOutput, /^ok/mg, 1, /^not ok/mg, 0, "1..1");
});

jqUnit.test("The text output should be correct...", function () {
    gpii.tests.webdriver.qunit.checkOutput(textOutput, /PASS$/mg, 1, /FAIL$/mg, 0, "All tests concluded: 1/1");
});
