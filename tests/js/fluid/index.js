/*

    Test our wrapper around `fluid.invokeGlobalFunction`.

 */
/* eslint-env node */
"use strict";
var fluid = require("infusion");
var gpii = fluid.registerNamespace("gpii");

fluid.require("%gpii-webdriver");
gpii.webdriver.loadTestingSupport();

fluid.defaults("gpii.tests.webdriver.fluid.caseHolder", {
    gradeNames: ["gpii.test.webdriver.caseHolder", "gpii.test.webdriver.hasFluidContent"],
    fileUrl: "%gpii-webdriver/tests/js/fluid/html/index.html",
    rawModules: [{
        name: "Testing our wrapper around fluid.invokeGlobalFunction...",
        tests: [
            {
                name: "Call a global function with no arguments...",
                type: "test",
                sequence: [
                    {
                        func: "{testEnvironment}.webdriver.get",
                        args: ["@expand:gpii.test.webdriver.resolveFileUrl({that}.options.fileUrl)"]
                    },
                    {
                        event:    "{testEnvironment}.webdriver.events.onGetComplete",
                        listener: "{testEnvironment}.webdriver.executeScript",
                        args:     [gpii.test.webdriver.invokeGlobal, "gpii.tests.webdriver.fluid.existingGlobalFunction"]
                    },
                    {
                        event:    "{testEnvironment}.webdriver.events.onExecuteScriptComplete",
                        listener: "jqUnit.assertEquals",
                        args:     ["The global function should have returned a true value...", true, "{arguments}.0"]
                    }
                ]
            },
            {
                name: "Call a global function with arguments...",
                type: "test",
                sequence: [
                    {
                        func: "{testEnvironment}.webdriver.get",
                        args: ["@expand:gpii.test.webdriver.resolveFileUrl({that}.options.fileUrl)"]
                    },
                    {
                        event:    "{testEnvironment}.webdriver.events.onGetComplete",
                        listener: "{testEnvironment}.webdriver.executeScript",
                        args:     [gpii.test.webdriver.invokeGlobal, "gpii.tests.webdriver.fluid.existingGlobalFunctionWithArgs", ["foo", "bar"]]
                    },
                    {
                        event:    "{testEnvironment}.webdriver.events.onExecuteScriptComplete",
                        listener: "jqUnit.assertEquals",
                        args:     ["The global function should have received the correct number of arguments..", 2, "{arguments}.0"]
                    }
                ]
            }
        ]
    }]
});

fluid.defaults("gpii.tests.webdriver.fluid.environment", {
    gradeNames: ["gpii.test.webdriver.testEnvironment"],
    components: {
        caseHolder: {
            type: "gpii.tests.webdriver.fluid.caseHolder"
        },
        webdriver: {
            options: {
                listener: {
                    "onError.log": {
                        funcName: "console.log"
                    }
                }
            }
        }
    }
});

gpii.test.webdriver.allBrowsers({ baseTestEnvironment: "gpii.tests.webdriver.fluid.environment" });
