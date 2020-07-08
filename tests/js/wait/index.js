/*

    Test the "wait" function.

 */
/* eslint-env node */
"use strict";
var fluid = require("infusion");
fluid.setLogging(true);

fluid.require("%fluid-webdriver");
fluid.webdriver.loadTestingSupport();

require("../lib/globalErrorHandler");

fluid.registerNamespace("fluid.tests.webdriver.wait");

var jqUnit = require("node-jqunit");

fluid.tests.webdriver.wait.displayAlert = function () {
    setTimeout(function () { window.alert("Danger! Intruders among us!");}, 10);
};

fluid.tests.webdriver.wait.confirmTimeoutMessage = function (message, expectedText) {
    jqUnit.assertTrue("The message should contain our custom text...", message.indexOf(expectedText) !== -1);
};

fluid.defaults("fluid.tests.webdriver.wait.caseHolder", {
    gradeNames: ["fluid.test.webdriver.caseHolder"],
    fileUrl: "%fluid-webdriver/tests/js/executeScript/html/executeScript.html",
    rawModules: [{
        name: "Testing the driver's `wait` function...",
        tests: [
            // Alerts are automatically clicked in "headless" mode, at least in chromedriver 2.31.488774
            // TODO: Reenable this test once the fix for this bug is included in a chromedriver release: https://bugs.chromium.org/p/chromium/issues/detail?id=718235
            // {
            //     name: "Wait for an alert to appear...",
            //     type: "test",
            //     sequence: [
            //         {
            //             func: "{testEnvironment}.webdriver.get",
            //             args: ["@expand:fluid.test.webdriver.resolveFileUrl({that}.options.fileUrl)"]
            //         },
            //         {
            //             event:    "{testEnvironment}.webdriver.events.onGetComplete",
            //             listener: "{testEnvironment}.webdriver.executeScript",
            //             args:     [fluid.tests.webdriver.wait.displayAlert]
            //         },
            //         {
            //             func: "{testEnvironment}.webdriver.wait",
            //             args: [fluid.webdriver.until.alertIsPresent()]
            //         },
            //         {
            //             event:    "{testEnvironment}.webdriver.events.onWaitComplete",
            //             listener: "jqUnit.assert",
            //             args:     ["The browser should fire an event once an alert is displayed."]
            //         }
            //     ]
            // },
            {
                name: "Test wait timeouts...",
                type: "test",
                sequence: [
                    {
                        func: "{testEnvironment}.webdriver.get",
                        args: ["@expand:fluid.test.webdriver.resolveFileUrl({that}.options.fileUrl)"]
                    },
                    {
                        event:    "{testEnvironment}.webdriver.events.onGetComplete",
                        listener: "fluid.test.webdriver.pushInstrumentedErrors"
                    },
                    // This will result in a global error.
                    {
                        func: "{testEnvironment}.webdriver.wait",
                        args: [fluid.webdriver.until.alertIsPresent(), 250, "Custom Message."]
                    },
                    {
                        event: "{fluid.test.webdriver.globalFailureHandler}.events.onError",
                        listener: "fluid.test.webdriver.awaitGlobalFailure"
                    },
                    {
                        funcName: "kettle.test.popInstrumentedErrors"
                    }
                ]
            },
            {
                name: "Wait for an element to appear...",
                type: "test",
                sequence: [
                    {
                        func: "{testEnvironment}.webdriver.get",
                        args: ["@expand:fluid.test.webdriver.resolveFileUrl({that}.options.fileUrl)"]
                    },
                    {
                        event:    "{testEnvironment}.webdriver.events.onGetComplete",
                        listener: "{testEnvironment}.webdriver.wait",
                        args:     [fluid.webdriver.until.elementLocated(fluid.webdriver.By.css("body"))]
                    },
                    {
                        event:    "{testEnvironment}.webdriver.events.onWaitComplete",
                        listener: "jqUnit.assert",
                        args:     ["We should be able to wait for a DOM element..."]
                    }
                ]
            }
        ]
    }]
});

fluid.defaults("fluid.tests.webdriver.wait.environment", {
    gradeNames: ["fluid.test.webdriver.testEnvironment"],
    components: {
        caseHolder: {
            type: "fluid.tests.webdriver.wait.caseHolder"
        }
    }
});

fluid.test.webdriver.allBrowsers({ baseTestEnvironment: "fluid.tests.webdriver.wait.environment" });
