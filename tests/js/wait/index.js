/*

    Test the "wait" function.

 */
/* eslint-env node */
"use strict";
var fluid = require("infusion");
var gpii = fluid.registerNamespace("gpii");

require("../../../");
gpii.webdriver.loadTestingSupport();

fluid.registerNamespace("gpii.tests.webdriver.wait");

gpii.tests.webdriver.wait.displayAlert = function () {
    setTimeout(function () { window.alert("Danger! Intruders among us!"); }, 1000);
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

fluid.test.runTests("gpii.tests.webdriver.wait.environment");
