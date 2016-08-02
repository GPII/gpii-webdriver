/*

    Test the aXe accessibility checker against a page: https://github.com/dequelabs/axe-core

 */
/* eslint-env node */
"use strict";
var fluid = require("infusion");
var gpii = fluid.registerNamespace("gpii");

require("../../../");
gpii.webdriver.loadTestingSupport();

fluid.defaults("gpii.tests.webdriver.axe.caseHolder", {
    gradeNames: ["gpii.test.webdriver.caseHolder", "gpii.test.webdriver.hasAxeContent"],
    goodUrl: "%gpii-webdriver/tests/js/axe/html/good.html",
    badUrl: "%gpii-webdriver/tests/js/axe/html/bad.html",
    injectUrl: "%gpii-webdriver/tests/js/axe/html/injection.html",
    rawModules: [{
        name: "Testing aXe reporting...",
        tests: [
            {
                name: "Run the report on a good page...",
                type: "test",
                sequence: [
                    {
                        func: "{testEnvironment}.webdriver.get",
                        args: ["@expand:gpii.test.webdriver.resolveFileUrl({that}.options.goodUrl)"]
                    },
                    {
                        event:    "{testEnvironment}.webdriver.events.onGetComplete",
                        listener: "{testEnvironment}.webdriver.executeAsyncScript",
                        args:     [gpii.test.webdriver.axe.runAxe]
                    },
                    {
                        event:    "{testEnvironment}.webdriver.events.onExecuteAsyncScriptComplete",
                        listener: "gpii.test.webdriver.axe.checkResults",
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
                        args: ["@expand:gpii.test.webdriver.resolveFileUrl({that}.options.badUrl)"]
                    },
                    {
                        event:    "{testEnvironment}.webdriver.events.onGetComplete",
                        listener: "{testEnvironment}.webdriver.executeAsyncScript",
                        args:     [gpii.test.webdriver.axe.runAxe]
                    },
                    {
                        event:    "{testEnvironment}.webdriver.events.onExecuteAsyncScriptComplete",
                        listener: "gpii.test.webdriver.axe.checkResults",
                        args:     ["{arguments}.0", true]
                    }
                ]
            },
            {
                name: "Inject aXe into a page and run the tests...",
                type: "test",
                sequence: [
                    {
                        func: "{testEnvironment}.webdriver.get",
                        args: ["@expand:gpii.test.webdriver.resolveFileUrl({that}.options.injectUrl)"]
                    },
                    {
                        event:    "{testEnvironment}.webdriver.events.onGetComplete",
                        listener: "{testEnvironment}.webdriver.executeScript",
                        args:     ["{that}.options.scriptContent.axe"]
                    },
                    {
                        event:    "{testEnvironment}.webdriver.events.onExecuteScriptComplete",
                        listener: "{testEnvironment}.webdriver.executeAsyncScript",
                        args:     [gpii.test.webdriver.axe.runAxe]
                    },
                    {
                        event:    "{testEnvironment}.webdriver.events.onExecuteAsyncScriptComplete",
                        listener: "gpii.test.webdriver.axe.checkResults",
                        args:     ["{arguments}.0"]
                    }
                ]
            }
        ]
    }]
});

fluid.defaults("gpii.tests.webdriver.axe.environment", {
    gradeNames: ["gpii.test.webdriver.testEnvironment"],
    components: {
        caseHolder: {
            type: "gpii.tests.webdriver.axe.caseHolder"
        }
    }
});

gpii.test.webdriver.allBrowsers({ baseTestEnvironment: "gpii.tests.webdriver.axe.environment" });
