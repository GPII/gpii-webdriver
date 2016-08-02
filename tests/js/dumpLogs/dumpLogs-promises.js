/*

    Test the "get" function with a local file.

 */
/* eslint-env node */
"use strict";
var fluid = require("infusion");
var gpii = fluid.registerNamespace("gpii");

require("../../../");
gpii.webdriver.loadTestingSupport();

var jqUnit = require("node-jqunit");

fluid.registerNamespace("gpii.tests.dumpLogs.promises");

gpii.tests.dumpLogs.promises.runTests = function (browser) {
    if (browser === "ie") {
        jqUnit.assert("We know dumpLog doesn't work with IE.")
    }
    else {
        jqUnit.module("(" + browser + ") Testing the `dumpLogs` function...");
        jqUnit.test("Test browser logging...", function () {
            jqUnit.stop();

            var driver = gpii.webdriver.syncInit();
            driver.get(gpii.test.webdriver.resolveFileUrl("%gpii-webdriver/tests/js/dumpLogs/html/index.html")).then(function() {
                // We cannot generate and then check for more detailed messages at the moment, so we generate an error on the client side that we can look for in the logs.
                driver.dumpLogs().then(function (logOutput)  {
                    jqUnit.start();
                    jqUnit.assertTrue("The logs should contain the expected error...", logOutput.indexOf("TypeError") !== -1);
                    driver.quit();
                });
            });
        });

        // Chrome does not produce any "driver" logs, so we can't test this across a range of browsers. TODO:  Revisit this test when the WebDriver logging API is formalized.
        // jqUnit.test("Test driver logging...", function () {
        //     jqUnit.stop();
        //
        //     var driver = gpii.webdriver.syncInit();
        //     driver.get(gpii.test.webdriver.resolveFileUrl("%gpii-webdriver/tests/js/dumpLogs/html/index.html")).then(function () {
        //         driver.dumpLogs("driver").then(function (logOutput)  {
        //             jqUnit.start();
        //             jqUnit.assertTrue("The driver logs should have registered at least one call to getLog...", logOutput.indexOf("Received command: getLog") !== -1)
        //             driver.quit();
        //         });
        //     })
        // });
    }
};

fluid.defaults("gpii.tests.dumpLogs.promises.runner", {
    gradeNames: ["gpii.test.webdriver.allBrowsers"],
    invokers: {
        "runTestsInSingleBrowser": {
            funcName: "gpii.tests.dumpLogs.promises.runTests",
            args:     ["{arguments}.0"]
        }
    }
});

gpii.tests.dumpLogs.promises.runner();