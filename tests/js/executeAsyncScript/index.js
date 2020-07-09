/*

    Test the "executeAsyncScript" function with a function that waits to return a value.

 */
/* eslint-env node */
"use strict";
var fluid = require("infusion");

fluid.require("%fluid-webdriver");
fluid.webdriver.loadTestingSupport();

fluid.registerNamespace("fluid.tests.webdriver.executeAsyncScript");
fluid.tests.webdriver.executeAsyncScript.getAsyncValue = function () {
    var callback = arguments[arguments.length - 1];
    callback("Not all that asynchronous.");
};

fluid.tests.webdriver.executeAsyncScript.getAsyncValueViaTimeout = function () {
    var callback = arguments[arguments.length - 1];
    setTimeout(function () { callback("Fairly asynchronous."); }, 4000);
};

fluid.defaults("fluid.tests.webdriver.executeAsyncScript.caseHolder", {
    gradeNames: ["fluid.test.webdriver.caseHolder"],
    fileUrl: "%fluid-webdriver/tests/js/executeScript/html/executeScript.html",
    rawModules: [{
        name: "Testing the driver's `executeAsyncScript` function...",
        tests: [
            {
                name: "Get a value from an asynchronous call that immediately resolves...",
                type: "test",
                sequence: [
                    {
                        func: "{testEnvironment}.webdriver.get",
                        args: ["@expand:fluid.test.webdriver.resolveFileUrl({that}.options.fileUrl)"]
                    },
                    {
                        event:    "{testEnvironment}.webdriver.events.onGetComplete",
                        listener: "{testEnvironment}.webdriver.executeAsyncScript",
                        args:     [fluid.tests.webdriver.executeAsyncScript.getAsyncValue]
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
                        args: ["@expand:fluid.test.webdriver.resolveFileUrl({that}.options.fileUrl)"]
                    },
                    {
                        event:    "{testEnvironment}.webdriver.events.onGetComplete",
                        listener: "{testEnvironment}.webdriver.executeAsyncScript",
                        args:     [fluid.tests.webdriver.executeAsyncScript.getAsyncValueViaTimeout]
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

fluid.defaults("fluid.tests.webdriver.executeAsyncScript.environment", {
    gradeNames: ["fluid.test.webdriver.testEnvironment"],
    components: {
        caseHolder: {
            type: "fluid.tests.webdriver.executeAsyncScript.caseHolder"
        }
    }
});

fluid.test.webdriver.allBrowsers({ baseTestEnvironment: "fluid.tests.webdriver.executeAsyncScript.environment" });
