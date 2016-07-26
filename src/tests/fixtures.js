/*

 Fluid IoC test fixtures for use with `gpii.webdriver`.  See the documentation for details:

 https://github.com/GPII/gpii-webdriver/blob/master/docs/fixtures.md

 */
/* eslint-env node */
"use strict";
var fluid = require("infusion");
fluid.loadTestingSupport();

var gpii  = fluid.registerNamespace("gpii");

require("gpii-express");
gpii.express.loadTestingSupport();

fluid.registerNamespace("gpii.test.webdriver.caseHolder");

/**
 *
 * A function to prepend the value of `that.options.browser` to each module and test name.  Helps to distinguish tests
 * run using `allBrowsers` from one another.
 *
 * @param that - The caseHolder component
 * @param module - The individual test module.
 * @returns A copy of the original module with updated `name` values for all modules and tests.
 *
 */
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

/**
 *
 * A function that transforms each module using `that.prepareModule` and then prepends and appends standard sequences
 * using the static function `gpii.test.express.helpers.addRequiredSequences` from the `gpii-express` package.
 *
 * @param that (The caseHolder component).
 * @returns {Object} A copy of the original modules, updated with the standard start and end sequences and transformed using `that.prepareModule`
 */
gpii.test.webdriver.caseHolder.prepareModules = function (that) {
    var modulesWithStartAndEnd = gpii.test.express.helpers.addRequiredSequences(that.options.rawModules, that.options.sequenceStart, that.options.sequenceEnd);
    return fluid.transform(modulesWithStartAndEnd, that.prepareModule);
};

/*
 A caseHolder that makes use of the above functions to generate its final module content based on:

 1. that.options.rawModules
 2. that.options.startSequence (goes at the start of each set of test sequences.
 3. that.options.endSequence (goes at the end of each set of test sequences.
 4. that.options.browser (Prepended to the name of each module and test, including those added in steps 2 and 3).

 */
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

/* same as the above, but with the standard start and end sequences use in most of the tests in this package. */
fluid.defaults("gpii.test.webdriver.caseHolder", {
    gradeNames: ["gpii.test.webdriver.caseHolder.base"],
    sequenceStart: gpii.test.express.standardSequenceStart,
    sequenceEnd: [
        { func: "{testEnvironment}.webdriver.quit", args: [] },
        { listener: "fluid.identity", event: "{testEnvironment}.events.onFixturesStopped"}
    ]
});

/* A testEnvironment designed for use with the standard start and end steps above. */
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
