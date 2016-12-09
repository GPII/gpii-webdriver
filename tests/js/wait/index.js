/*

    Test the "wait" function.

 */
/* eslint-env node */
"use strict";
var fluid = require("infusion");
var gpii = fluid.registerNamespace("gpii");

fluid.require("%gpii-webdriver");
gpii.webdriver.loadTestingSupport();

fluid.registerNamespace("gpii.tests.webdriver.wait");

var jqUnit = require("node-jqunit");

gpii.tests.webdriver.wait.displayAlert = function () {
    setTimeout(function () { window.alert("Danger! Intruders among us!"); }, 1000);
};

gpii.tests.webdriver.wait.confirmTimeoutMessage = function (message, expectedText) {
    jqUnit.assertTrue("The message should contain our custom text...", message.indexOf(expectedText) !== -1);
};

fluid.defaults("gpii.tests.webdriver.wait.caseHolder", {
    gradeNames: ["gpii.test.webdriver.caseHolder"],
    fileUrl: "%gpii-webdriver/tests/js/executeScript/html/executeScript.html",
    rawModules: [{
        name: "Testing the driver's `wait` function...",
        tests: [
            {
                name: "Wait for an alert to appear...",
                type: "test",
                sequence: [
                    {
                        func: "{testEnvironment}.webdriver.get",
                        args: ["@expand:gpii.test.webdriver.resolveFileUrl({that}.options.fileUrl)"]
                    },
                    {
                        event:    "{testEnvironment}.webdriver.events.onGetComplete",
                        listener: "{testEnvironment}.webdriver.executeScript",
                        args:     [gpii.tests.webdriver.wait.displayAlert]
                    },
                    {
                        func: "{testEnvironment}.webdriver.wait",
                        args: [gpii.webdriver.until.alertIsPresent()]
                    },
                    {
                        event:    "{testEnvironment}.webdriver.events.onWaitComplete",
                        listener: "jqUnit.assert",
                        args:     ["The browser should fire an event once an alert is displayed."]
                    }
                ]
            },
            {
                name: "Test wait timeouts...",
                type: "test",
                sequence: [
                    {
                        func: "{testEnvironment}.webdriver.get",
                        args: ["@expand:gpii.test.webdriver.resolveFileUrl({that}.options.fileUrl)"]
                    },
                    {
                        event:    "{testEnvironment}.webdriver.events.onGetComplete",
                        listener: "{testEnvironment}.webdriver.wait",
                        args:     [gpii.webdriver.until.alertIsPresent(), 250, "Custom Message."]
                    },
                    {
                        event:    "{testEnvironment}.webdriver.events.onError",
                        listener: "gpii.tests.webdriver.wait.confirmTimeoutMessage",
                        args:     ["{arguments}.0.message", "Custom Message."]
                    }
                ]
            },
            {
                name: "Wait for an element to appear...",
                type: "test",
                sequence: [
                    {
                        func: "{testEnvironment}.webdriver.get",
                        args: ["@expand:gpii.test.webdriver.resolveFileUrl({that}.options.fileUrl)"]
                    },
                    {
                        event:    "{testEnvironment}.webdriver.events.onGetComplete",
                        listener: "{testEnvironment}.webdriver.wait",
                        args:     [gpii.webdriver.until.elementLocated(gpii.webdriver.By.css("body"))]
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

fluid.defaults("gpii.tests.webdriver.wait.environment", {
    gradeNames: ["gpii.test.webdriver.testEnvironment"],
    components: {
        caseHolder: {
            type: "gpii.tests.webdriver.wait.caseHolder"
        }
    }
});

gpii.test.webdriver.allBrowsers({ baseTestEnvironment: "gpii.tests.webdriver.wait.environment" });
