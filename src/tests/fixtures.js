/*

 Fluid IoC test fixtures for use with `gpii.webdriver`.  See the documentation for details:

 https://github.com/GPII/gpii-webdriver/blob/master/docs/fixtures.md

 */
/* eslint-env node */
// TODO:  NEEDS JSDocs
"use strict";
var fluid = require("infusion");
fluid.loadTestingSupport();

var gpii  = fluid.registerNamespace("gpii");

require("gpii-express");
gpii.express.loadTestingSupport();

fluid.registerNamespace("gpii.test.webdriver.caseHolder");

gpii.test.webdriver.caseHolder.prepareModule = function (that, module) {
    var processedModule = fluid.copy(module);
    processedModule.name = that.options.browser + ": " + module.name;
    var processedTests = [];
    fluid.each(module.tests, function (testDef) {
        var processedTest = fluid.copy(testDef);
        processedTest.name = that.options.browser + ": " + testDef.name;
        processedTests.push(processedTest);
    });
    processedModule.tests = processedTests;
    return processedModule;
};

gpii.test.webdriver.caseHolder.prepareModules = function (that) {
    var preparedModules = fluid.transform(that.options.rawModules, that.prepareModule);
    return gpii.test.express.helpers.addRequiredSequences(preparedModules, that.options.sequenceStart, that.options.sequenceEnd);
};

/* A caseholder that provides common startup sequence steps for all tests. */
fluid.defaults("gpii.test.webdriver.caseHolder.base", {
    gradeNames: ["gpii.test.express.caseHolder.base"],
    browser: "{testEnvironment}.options.browser",
    moduleSource: {
        funcName: "gpii.test.webdriver.caseHolder.prepareModules",
        args:     ["{that}"]
    },
    invokers: {
        prepareModule: {
            funcName: "gpii.test.webdriver.caseHolder.prepareModule",
            args:     ["{that}", "{arguments}.0"]
        }
    }
});

fluid.defaults("gpii.test.webdriver.caseHolder", {
    gradeNames: ["gpii.test.webdriver.caseHolder.base"],
    sequenceStart: gpii.test.express.standardSequenceStart,
    sequenceEnd: [
        { func: "{testEnvironment}.webdriver.quit", args: [] },
        { listener: "fluid.identity", event: "{testEnvironment}.events.onFixturesStopped"}
    ]
});

fluid.defaults("gpii.test.webdriver.testEnvironment", {
    gradeNames: ["fluid.test.testEnvironment"],
    events: {
        constructFixtures: null,
        onDriverReady: null,
        onDriverStopped: null,
        onFixturesConstructed: {
            events: {
                onDriverReady: "onDriverReady"
            }
        },
        onFixturesStopped: {
            events: {
                onDriverStopped: "onDriverStopped"
            }
        }
    },
    components: {
        webdriver: {
            createOnEvent: "constructFixtures",
            type: "gpii.webdriver",
            options: {
                events: {
                    onDriverReady: "{testEnvironment}.events.onDriverReady",
                },
                listeners: {
                    onQuitComplete: { func: "{testEnvironment}.events.onDriverStopped.fire" }
                }
            }
        }
    }
});
