/*

    Confirm that we can retrieve the results of jqUnit tests.
 */
/* eslint-env node */
"use strict";
var fluid = require("infusion");
var gpii = fluid.registerNamespace("gpii");


fluid.require("%gpii-webdriver");
gpii.webdriver.loadTestingSupport();

require("./helper-functions");

// TODO: Work with Antranig on the IPC bridge so that we can get the test results once the tests fire the `done` event.

fluid.defaults("gpii.tests.webdriver.qunit.jqUnit.caseHolder", {
    gradeNames: ["gpii.test.webdriver.caseHolder"],
    fileUrl: "%gpii-webdriver/tests/js/qunit/html/qunit.html",
    rawModules: [{
        name: "Confirming that we can retrieve jqUnit results from a standalone web page...",
        tests: [
            {
                name: "Open a page with jqUnit results...",
                type: "test",
                sequence: [
                    {
                        func: "{testEnvironment}.webdriver.get",
                        args: ["@expand:gpii.test.webdriver.resolveFileUrl({that}.options.fileUrl)"]
                    },
                    {
                        event:    "{testEnvironment}.webdriver.events.onGetComplete",
                        listener: "{testEnvironment}.webdriver.executeScript",
                        args:     [gpii.test.webdriver.invokeGlobal, "gpii.webdriver.QUnitHarness.instance.outputResults", "text"]
                    },
                    {
                        event:    "{testEnvironment}.webdriver.events.onExecuteScriptComplete",
                        listener: "gpii.tests.webdriver.qunit.checkTextOutput",
                        args:     ["{arguments}.0"]
                    },
                    // TODO: Get these working again
                    // {
                    //     func: "{testEnvironment}.webdriver.executeScript",
                    //     args: [gpii.test.webdriver.invokeGlobal, "gpii.webdriver.QUnitHarness.instance.outputResults"]
                    // },
                    // {
                    //     event:    "{testEnvironment}.webdriver.events.onExecuteScriptComplete",
                    //     listener: "gpii.tests.webdriver.qunit.checkTapOutput",
                    //     args:     ["{arguments}.0"]
                    // }
                ]
            }
        ]
    }]
});

fluid.defaults("gpii.tests.webdriver.qunit.jqUnit.environment", {
    gradeNames: ["gpii.test.webdriver.testEnvironment"],
    components: {
        caseHolder: {
            type: "gpii.tests.webdriver.qunit.jqUnit.caseHolder"
        }
    }
});

gpii.test.webdriver.allBrowsers({ baseTestEnvironment: "gpii.tests.webdriver.qunit.jqUnit.environment" });
