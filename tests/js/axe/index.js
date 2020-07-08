/*

    Test the aXe accessibility checker against a page: https://github.com/dequelabs/axe-core

 */
/* eslint-env node */
"use strict";
var fluid = require("infusion");

fluid.require("%fluid-webdriver");
fluid.webdriver.loadTestingSupport();

fluid.defaults("fluid.tests.webdriver.axe.caseHolder", {
    gradeNames: ["fluid.test.webdriver.caseHolder", "fluid.test.webdriver.hasAxeContent"],
    goodUrl: "%fluid-webdriver/tests/js/axe/html/good.html",
    badUrl: "%fluid-webdriver/tests/js/axe/html/bad.html",
    injectUrl: "%fluid-webdriver/tests/js/axe/html/injection.html",
    rawModules: [{
        name: "Testing aXe reporting...",
        tests: [
            {
                name: "Run the report on a good page...",
                type: "test",
                sequence: [
                    {
                        func: "{testEnvironment}.webdriver.get",
                        args: ["@expand:fluid.test.webdriver.resolveFileUrl({that}.options.goodUrl)"]
                    },
                    {
                        event:    "{testEnvironment}.webdriver.events.onGetComplete",
                        listener: "{testEnvironment}.webdriver.executeAsyncScript",
                        args:     [fluid.test.webdriver.axe.runAxe]
                    },
                    {
                        event:    "{testEnvironment}.webdriver.events.onExecuteAsyncScriptComplete",
                        listener: "fluid.test.webdriver.axe.checkResults",
                        args:     ["{arguments}.0"]
                    }
                ]
            },
            {
                name: "Run the report on a bad page...",
                type: "test",
                sequence: [
                    {
                        func: "{testEnvironment}.webdriver.get",
                        args: ["@expand:fluid.test.webdriver.resolveFileUrl({that}.options.badUrl)"]
                    },
                    {
                        event:    "{testEnvironment}.webdriver.events.onGetComplete",
                        listener: "{testEnvironment}.webdriver.executeAsyncScript",
                        args:     [fluid.test.webdriver.axe.runAxe]
                    },
                    {
                        event:    "{testEnvironment}.webdriver.events.onExecuteAsyncScriptComplete",
                        listener: "fluid.test.webdriver.axe.checkResults",
                        args:     ["{arguments}.0", true]
                    }
                ]
            },
            {
                name: "Disable a check with configuration options...",
                type: "test",
                sequence: [
                    {
                        func: "{testEnvironment}.webdriver.get",
                        args: ["@expand:fluid.test.webdriver.resolveFileUrl({that}.options.badUrl)"]
                    },
                    {
                        event:    "{testEnvironment}.webdriver.events.onGetComplete",
                        listener: "{testEnvironment}.webdriver.executeAsyncScript",
                        args:     [fluid.test.webdriver.axe.runAxe, { rules: [{ id: "html-has-lang", enabled: false }, { id: "page-has-heading-one", enabled: false}]}]
                    },
                    {
                        event:    "{testEnvironment}.webdriver.events.onExecuteAsyncScriptComplete",
                        listener: "fluid.test.webdriver.axe.checkResults",
                        args:     ["{arguments}.0"]
                    }
                ]
            },
            {
                name: "Inject aXe into a page and run the tests...",
                type: "test",
                sequence: [
                    {
                        func: "{testEnvironment}.webdriver.get",
                        args: ["@expand:fluid.test.webdriver.resolveFileUrl({that}.options.injectUrl)"]
                    },
                    {
                        event:    "{testEnvironment}.webdriver.events.onGetComplete",
                        listener: "{testEnvironment}.webdriver.executeScript",
                        args:     ["{that}.options.scriptContent.axe"]
                    },
                    {
                        event:    "{testEnvironment}.webdriver.events.onExecuteScriptComplete",
                        listener: "{testEnvironment}.webdriver.executeAsyncScript",
                        args:     [fluid.test.webdriver.axe.runAxe]
                    },
                    {
                        event:    "{testEnvironment}.webdriver.events.onExecuteAsyncScriptComplete",
                        listener: "fluid.test.webdriver.axe.checkResults",
                        args:     ["{arguments}.0"]
                    }
                ]
            }
        ]
    }]
});

fluid.defaults("fluid.tests.webdriver.axe.environment", {
    gradeNames: ["fluid.test.webdriver.testEnvironment"],
    components: {
        caseHolder: {
            type: "fluid.tests.webdriver.axe.caseHolder"
        }
    }
});

fluid.test.webdriver.allBrowsers({ baseTestEnvironment: "fluid.tests.webdriver.axe.environment" });
