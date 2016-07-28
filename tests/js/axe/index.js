/*

    Test the aXe accessibility checker against a page: https://github.com/dequelabs/axe-core

 */
/* eslint-env node */
"use strict";
var fluid = require("infusion");
var gpii = fluid.registerNamespace("gpii");

require("../../../");
gpii.webdriver.loadTestingSupport();

var fs = require("fs");

fluid.registerNamespace("gpii.tests.webdriver.axe");

gpii.tests.webdriver.axe.runAxe = function (callback) {
    /* globals axe */
    axe.a11yCheck(document, callback);
};

var jqUnit = require("node-jqunit");
gpii.tests.webdriver.axe.checkResults = function (message, results, hasFailures) {
    jqUnit.assertTrue("There should always be at least one passing rule...", results.passes.length > 0);
    if (hasFailures) {
        jqUnit.assertTrue("There should be at least one violation...", results.violations.length > 0);
    }
    else {
        jqUnit.assertTrue("There should be no violations...", results.violations.length === 0);
    }
};

fluid.defaults("gpii.tests.webdriver.axe.caseHolder", {
    gradeNames: ["gpii.test.webdriver.caseHolder"],
    goodUrl: "%gpii-webdriver/tests/js/axe/html/good.html",
    badUrl: "%gpii-webdriver/tests/js/axe/html/bad.html",
    injectUrl: "%gpii-webdriver/tests/js/axe/html/injection.html",
    rawAxePath: "%gpii-webdriver/node_modules/axe-core/axe.js",
    resolvedAxePath: "@expand:fluid.module.resolvePath({that}.options.rawAxePath)",
    axeContent: {
        expander: {
            func: fs.readFileSync,
            args: ["{that}.options.resolvedAxePath", "utf8"]
        }
    },
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
                        args:     [gpii.tests.webdriver.axe.runAxe]
                    },
                    {
                        event:    "{testEnvironment}.webdriver.events.onExecuteAsyncScriptComplete",
                        listener: "gpii.tests.webdriver.axe.checkResults",
                        args:     ["The page should pass the tests...", "{arguments}.0"]
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
                        args:     [gpii.tests.webdriver.axe.runAxe]
                    },
                    {
                        event:    "{testEnvironment}.webdriver.events.onExecuteAsyncScriptComplete",
                        listener: "gpii.tests.webdriver.axe.checkResults",
                        args:     ["There should be at least one violation reported...", "{arguments}.0", true]
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
                        args:     ["{that}.options.axeContent"]
                    },
                    {
                        event:    "{testEnvironment}.webdriver.events.onExecuteScriptComplete",
                        listener: "{testEnvironment}.webdriver.executeAsyncScript",
                        args:     [gpii.tests.webdriver.axe.runAxe]
                    },
                    {
                        event:    "{testEnvironment}.webdriver.events.onExecuteAsyncScriptComplete",
                        listener: "gpii.tests.webdriver.axe.checkResults",
                        args:     ["The page should pass the tests...", "{arguments}.0"]
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
