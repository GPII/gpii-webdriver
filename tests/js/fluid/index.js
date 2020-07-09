/*

    Test our wrapper around `fluid.invokeGlobalFunction`.

 */
/* eslint-env node */
"use strict";
var fluid = require("infusion");

fluid.require("%fluid-webdriver");
fluid.webdriver.loadTestingSupport();

fluid.defaults("fluid.tests.webdriver.fluid.caseHolder", {
    gradeNames: ["fluid.test.webdriver.caseHolder", "fluid.test.webdriver.hasFluidContent"],
    fileUrl: "%fluid-webdriver/tests/js/fluid/html/index.html",
    rawModules: [{
        name: "Testing our wrapper around fluid.invokeGlobalFunction...",
        tests: [
            {
                name: "Call a global function with no arguments...",
                type: "test",
                sequence: [
                    {
                        func: "{testEnvironment}.webdriver.get",
                        args: ["@expand:fluid.test.webdriver.resolveFileUrl({that}.options.fileUrl)"]
                    },
                    {
                        event:    "{testEnvironment}.webdriver.events.onGetComplete",
                        listener: "{testEnvironment}.webdriver.executeScript",
                        args:     [fluid.test.webdriver.invokeGlobal, "fluid.tests.webdriver.fluid.existingGlobalFunction"]
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
                        args: ["@expand:fluid.test.webdriver.resolveFileUrl({that}.options.fileUrl)"]
                    },
                    {
                        event:    "{testEnvironment}.webdriver.events.onGetComplete",
                        listener: "{testEnvironment}.webdriver.executeScript",
                        args:     [fluid.test.webdriver.invokeGlobal, "fluid.tests.webdriver.fluid.existingGlobalFunctionWithArgs", ["foo", "bar"]]
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

fluid.defaults("fluid.tests.webdriver.fluid.environment", {
    gradeNames: ["fluid.test.webdriver.testEnvironment"],
    components: {
        caseHolder: {
            type: "fluid.tests.webdriver.fluid.caseHolder"
        }
    }
});

fluid.test.webdriver.allBrowsers({ baseTestEnvironment: "fluid.tests.webdriver.fluid.environment" });
