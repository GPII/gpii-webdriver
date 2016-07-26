/*

    Test the "executeAsyncScript" function with a function that waits to return a value.

 */
/* eslint-env node */
"use strict";
var fluid = require("infusion");
var gpii = fluid.registerNamespace("gpii");

require("../../../");
gpii.webdriver.loadTestingSupport();

fluid.registerNamespace("gpii.tests.webdriver.executeAsyncScript");
gpii.tests.webdriver.executeAsyncScript.getAsyncValue = function () {
    var callback = arguments[arguments.length - 1];
    callback("Better late than never.");

    // TODO:  Review this with Antranig to confirm why it doesn't work
    // setTimeout(function () { callback("Better late than never."); }, 500);
};

fluid.defaults("gpii.tests.webdriver.executeAsyncScript.caseHolder", {
    gradeNames: ["gpii.test.webdriver.caseHolder"],
    fileUrl: "%gpii-webdriver/tests/js/executeScript/html/executeScript.html",
    rawModules: [{
        name: "Testing the driver's `executeAsyncScript` function...",
        tests: [
            {
                name: "Get a value from an asynchronous call on the client side...",
                type: "test",
                sequence: [
                    {
                        func: "{testEnvironment}.webdriver.get",
                        args: ["@expand:gpii.test.webdriver.resolveFileUrl({that}.options.fileUrl)"]
                    },
                    {
                        event:    "{testEnvironment}.webdriver.events.onGetComplete",
                        listener: "{testEnvironment}.webdriver.executeAsyncScript",
                        args:     [gpii.tests.webdriver.executeAsyncScript.getAsyncValue]
                    },
                    {
                        event:    "{testEnvironment}.webdriver.events.onExecuteAsyncScriptComplete",
                        listener: "jqUnit.assertEquals",
                        args:     ["The sample function should have returned the correct value...", "Better late than never.", "{arguments}.0"]
                    }
                ]
            }
        ]
    }]
});

fluid.defaults("gpii.tests.webdriver.executeAsyncScript.environment", {
    gradeNames: ["gpii.test.webdriver.testEnvironment"],
    components: {
        caseHolder: {
            type: "gpii.tests.webdriver.executeAsyncScript.caseHolder"
        }
    }
});

gpii.test.webdriver.allBrowsers({ baseTestEnvironment: "gpii.tests.webdriver.executeAsyncScript.environment" });
