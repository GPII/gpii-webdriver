/*

    Confirm that we can retrieve the results of jqUnit tests.
 */
/* eslint-env node */
"use strict";
var fluid = require("infusion");

fluid.require("%fluid-webdriver");
fluid.webdriver.loadTestingSupport();

require("./helper-functions");

// TODO: Work with Antranig on the IPC bridge so that we can get the test results once the tests fire the `done` event.

fluid.defaults("fluid.tests.webdriver.qunit.jqUnit.caseHolder", {
    gradeNames: ["fluid.test.webdriver.caseHolder"],
    fileUrl: "%fluid-webdriver/tests/js/qunit/html/qunit.html",
    rawModules: [{
        name: "Confirming that we can retrieve jqUnit results from a standalone web page...",
        tests: [
            {
                name: "Open a page with jqUnit results...",
                type: "test",
                sequence: [
                    {
                        func: "{testEnvironment}.webdriver.get",
                        args: ["@expand:fluid.test.webdriver.resolveFileUrl({that}.options.fileUrl)"]
                    },
                    // Wait until the test results appear.
                    {
                        event:    "{testEnvironment}.webdriver.events.onGetComplete",
                        listener: "{testEnvironment}.webdriver.wait",
                        args:     [fluid.webdriver.until.elementLocated(fluid.webdriver.By.css("#qunit-testresult"))]
                    },
                    {
                        event:    "{testEnvironment}.webdriver.events.onWaitComplete",
                        listener: "{testEnvironment}.webdriver.executeScript",
                        args:     [fluid.test.webdriver.invokeGlobal, "fluid.webdriver.QUnitHarness.instance.outputResults", "text"]
                    },
                    {
                        event:    "{testEnvironment}.webdriver.events.onExecuteScriptComplete",
                        listener: "fluid.tests.webdriver.qunit.checkTextOutput",
                        args:     ["{arguments}.0"]
                    }
                    // TODO: Get these working again
                    // {
                    //     func: "{testEnvironment}.webdriver.executeScript",
                    //     args: [fluid.test.webdriver.invokeGlobal, "fluid.webdriver.QUnitHarness.instance.outputResults"]
                    // },
                    // {
                    //     event:    "{testEnvironment}.webdriver.events.onExecuteScriptComplete",
                    //     listener: "fluid.tests.webdriver.qunit.checkTapOutput",
                    //     args:     ["{arguments}.0"]
                    // }
                ]
            }
        ]
    }]
});

fluid.defaults("fluid.tests.webdriver.qunit.jqUnit.environment", {
    gradeNames: ["fluid.test.webdriver.testEnvironment"],
    components: {
        caseHolder: {
            type: "fluid.tests.webdriver.qunit.jqUnit.caseHolder"
        }
    }
});

fluid.test.webdriver.allBrowsers({ baseTestEnvironment: "fluid.tests.webdriver.qunit.jqUnit.environment" });
