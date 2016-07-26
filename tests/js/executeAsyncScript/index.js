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
    callback("Not all that asynchronous.");
};

gpii.tests.webdriver.executeAsyncScript.getAsyncValueViaTimeout = function () {
    var callback = arguments[arguments.length - 1];
    setTimeout(function () { callback("Fairly asynchronous."); }, 4000);
};

fluid.defaults("gpii.tests.webdriver.executeAsyncScript.caseHolder", {
    gradeNames: ["gpii.test.webdriver.caseHolder"],
    fileUrl: "%gpii-webdriver/tests/js/executeScript/html/executeScript.html",
    rawModules: [{
        name: "Testing the driver's `executeAsyncScript` function...",
        tests: [
            {
                name: "Get a value from an asynchronous call that immediately resolves...",
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
                        args:     ["The sample function should have returned the correct value...", "Not all that asynchronous.", "{arguments}.0"]
                    }
                ]
            },
            // The docs are misleading, this test demonstrates how to use the `executeAsyncScriptHelper` to ensure the
            // script actually has time to respond.
            //
            // see: https://github.com/SeleniumHQ/selenium/issues/2503
            {
                name: "Get a value from an asynchronous call that takes time to respond...",
                type: "test",
                sequence: [
                    {
                        func: "{testEnvironment}.webdriver.get",
                        args: ["@expand:gpii.test.webdriver.resolveFileUrl({that}.options.fileUrl)"]
                    },
                    {
                        event:    "{testEnvironment}.webdriver.events.onGetComplete",
                        listener: "{testEnvironment}.webdriver.executeAsyncScript",
                        args:     [gpii.tests.webdriver.executeAsyncScript.getAsyncValueViaTimeout]
                    },
                    {
                        event:    "{testEnvironment}.webdriver.events.onExecuteAsyncScriptComplete",
                        listener: "jqUnit.assertEquals",
                        args:     ["The sample function should have returned the correct value...", "Fairly asynchronous.", "{arguments}.0"]
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
