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

fluid.defaults("gpii.tests.webdriver.dumpLogs.caseHolder", {
    gradeNames: ["gpii.test.webdriver.caseHolder"],
    fileUrl: "%gpii-webdriver/tests/js/dumpLogs/html/index.html",
    rawModules: [{
        name: "Testing the driver's `dumpLogs` function within the IoC test framework...",
        tests: [
            {
                name: "Dump the browser logs...",
                type: "test",
                sequence: [
                    {
                        func: "{testEnvironment}.webdriver.get",
                        args: ["@expand:gpii.test.webdriver.resolveFileUrl({that}.options.fileUrl)"]
                    },
                    {
                        event:    "{testEnvironment}.webdriver.events.onGetComplete",
                        listener: "{testEnvironment}.webdriver.dumpLogs",
                        args:     []
                    },
                    {
                        event:    "{testEnvironment}.webdriver.events.onDumpLogsComplete",
                        listener: "gpii.tests.webdriver.dumpLogs.checkLogOutput",
                        args:     ["The log output should contain a known browser error...", "{arguments}.0", "window.bogus"]
                    }
                ]
            },
            {
                name: "Dump the driver logs...",
                type: "test",
                sequence: [
                    {
                        func: "{testEnvironment}.webdriver.get",
                        args: ["@expand:gpii.test.webdriver.resolveFileUrl({that}.options.fileUrl)"]
                    },
                    {
                        event:    "{testEnvironment}.webdriver.events.onGetComplete",
                        listener: "{testEnvironment}.webdriver.dumpLogs",
                        args:     ["driver"]
                    },
                    {
                        event:    "{testEnvironment}.webdriver.events.onDumpLogsComplete",
                        listener: "gpii.tests.webdriver.dumpLogs.checkLogOutput",
                        args:     ["The log output should contain a known browser error...", "{arguments}.0", "Received command: getLog"]
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

gpii.test.webdriver.allBrowsers({ baseTestEnvironment: "gpii.tests.webdriver.dumpLogs.environment" });
