/*

    Test the "findElement" function with a single element.

 */
/* eslint-env node */
"use strict";
var fluid = require("infusion");
var gpii = fluid.registerNamespace("gpii");

require("../../../");
gpii.webdriver.loadTestingSupport();

fluid.registerNamespace("gpii.tests.webdriver.dumpLogs");

var jqUnit = require("node-jqunit");
gpii.tests.webdriver.dumpLogs.checkLogOutput = function (message, logOutput, expectedToContain) {
    jqUnit.assertTrue(message, logOutput.indexOf(expectedToContain) !== -1);
};

gpii.tests.webdriver.dumpLogs.runTestsInSingleBrowser = function (that, browser) {
    if (that.browser === "ie") {
        jqUnit.test("Skip the broken IE test...", function () {
            jqUnit.assert("We intentionally skip IE tests as the Logging API doesn't work there.");
        });
    }
    else {
        gpii.test.webdriver.allBrowsers.generateAndRunTestEnvironment(that, browser);
    }
};

fluid.defaults("gpii.tests.webdriver.dumpLogs.caseHolder", {
    gradeNames: ["gpii.test.webdriver.caseHolder"],
    fileWithBrowserError: "%gpii-webdriver/tests/js/dumpLogs/html/index.html",
    fileWithNoError: "%gpii-webdriver/tests/js/get/html/index.html",
    rawModules: [{
        name: "Testing the driver's `dumpLogs` function within the IoC test framework...",
        tests: [
            // Chrome does not produce any "driver" logs.  TODO:  Revisit this test when the WebDriver logging API is formalized.
            // {
            //     name: "Dump the driver logs...",
            //     type: "test",
            //     sequence: [
            //         {
            //             func: "{testEnvironment}.webdriver.get",
            //             args: ["@expand:gpii.test.webdriver.resolveFileUrl({that}.options.fileWithNoError)"]
            //         },
            //         {
            //             event:    "{testEnvironment}.webdriver.events.onGetComplete",
            //             listener: "{testEnvironment}.webdriver.dumpLogs",
            //             args:     ["driver"]
            //         },
            //         {
            //             event:    "{testEnvironment}.webdriver.events.onDumpLogsComplete",
            //             listener: "gpii.tests.webdriver.dumpLogs.checkLogOutput",
            //             args:     ["The log output should indicate that we have been asked to do work...", "{arguments}.0", "Received command: getLog"]
            //         }
            //     ]
            // },
            {
                name: "Dump the browser logs...",
                type: "test",
                sequence: [
                    {
                        func: "{testEnvironment}.webdriver.get",
                        args: ["@expand:gpii.test.webdriver.resolveFileUrl({that}.options.fileWithBrowserError)"]
                    },
                    {
                        event:    "{testEnvironment}.webdriver.events.onGetComplete",
                        listener: "{testEnvironment}.webdriver.dumpLogs",
                        args:     []
                    },
                    {
                        event:    "{testEnvironment}.webdriver.events.onDumpLogsComplete",
                        listener: "gpii.tests.webdriver.dumpLogs.checkLogOutput",
                        args:     ["The log output should contain a browser error...", "{arguments}.0", "TypeError"] // The messages are different in chrome and firefox, but "TypeError" is found in both.
                    }
                ]
            }
        ]
    }]
});

fluid.defaults("gpii.tests.webdriver.dumpLogs.environment", {
    gradeNames: ["gpii.test.webdriver.testEnvironment"],
    components: {
        caseHolder: {
            type: "gpii.tests.webdriver.dumpLogs.caseHolder"
        }
    }
});

gpii.test.webdriver.allBrowsers({
    baseTestEnvironment: "gpii.tests.webdriver.dumpLogs.environment",
    invokers: {
        runTestsInSingleBrowser: {
            funcName: "gpii.tests.webdriver.dumpLogs.runTestsInSingleBrowser",
            args:     ["{that}", "{arguments}.0"] // browser
        }
    }
});
