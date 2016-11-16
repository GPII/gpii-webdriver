/*

    Test the Accessibility Developer Tools in combination with this package:

    https://github.com/GoogleChrome/accessibility-developer-tools

 */
/* eslint-env node */
"use strict";
var fluid = require("infusion");
var gpii = fluid.registerNamespace("gpii");

require("../../../");
gpii.webdriver.loadTestingSupport();

fluid.defaults("gpii.tests.webdriver.axs.caseHolder", {
    gradeNames: ["gpii.test.webdriver.caseHolder", "gpii.test.webdriver.hasAxsContent"],
    goodUrl: "%gpii-webdriver/tests/js/axs/html/good.html",
    badUrl: "%gpii-webdriver/tests/js/axs/html/bad.html",
    injectUrl: "%gpii-webdriver/tests/js/axs/html/injection.html",
    rawModules: [{
        name: "Testing accessibility developer tools...",
        tests: [
            {
                name: "Run the accessibility developer tools on a good page...",
                type: "test",
                sequence: [
                    {
                        func: "{testEnvironment}.webdriver.get",
                        args: ["@expand:gpii.test.webdriver.resolveFileUrl({that}.options.goodUrl)"]
                    },
                    {
                        event:    "{testEnvironment}.webdriver.events.onGetComplete",
                        listener: "{testEnvironment}.webdriver.executeScript",
                        args:     [gpii.test.webdriver.axs.runAxs]
                    },
                    {
                        event:    "{testEnvironment}.webdriver.events.onExecuteScriptComplete",
                        listener: "gpii.test.webdriver.axs.checkResults",
                        args:     ["{arguments}.0"]
                    }
                ]
            },
            {
                name: "Run the accessibility developer tools on a bad page...",
                type: "test",
                sequence: [
                    {
                        func: "{testEnvironment}.webdriver.get",
                        args: ["@expand:gpii.test.webdriver.resolveFileUrl({that}.options.badUrl)"]
                    },
                    {
                        event:    "{testEnvironment}.webdriver.events.onGetComplete",
                        listener: "{testEnvironment}.webdriver.executeScript",
                        args:     [gpii.test.webdriver.axs.runAxs]
                    },
                    {
                        event:    "{testEnvironment}.webdriver.events.onExecuteScriptComplete",
                        listener: "gpii.test.webdriver.axs.checkResults",
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
                        args: ["@expand:gpii.test.webdriver.resolveFileUrl({that}.options.badUrl)"]
                    },
                    {
                        event:    "{testEnvironment}.webdriver.events.onGetComplete",
                        listener: "{testEnvironment}.webdriver.executeScript",
                        args:     [gpii.test.webdriver.axs.runAxs, { auditRulesToIgnore: ["humanLangMissing"]}]
                    },
                    {
                        event:    "{testEnvironment}.webdriver.events.onExecuteScriptComplete",
                        listener: "gpii.test.webdriver.axs.checkResults",
                        args:     ["{arguments}.0"]
                    }
                ]
            },
            {
                name: "Inject Axs into a page and run the accessibility developer tools...",
                type: "test",
                sequence: [
                    {
                        func: "{testEnvironment}.webdriver.get",
                        args: ["@expand:gpii.test.webdriver.resolveFileUrl({that}.options.injectUrl)"]
                    },
                    {
                        event:    "{testEnvironment}.webdriver.events.onGetComplete",
                        listener: "{testEnvironment}.webdriver.executeScript",
                        args:     ["{that}.options.scriptContent.axs"]
                    },
                    {
                        event:    "{testEnvironment}.webdriver.events.onExecuteScriptComplete",
                        listener: "{testEnvironment}.webdriver.executeScript",
                        args:     [gpii.test.webdriver.axs.runAxs]
                    },
                    {
                        event:    "{testEnvironment}.webdriver.events.onExecuteScriptComplete",
                        listener: "gpii.test.webdriver.axs.checkResults",
                        args:     ["{arguments}.0"]
                    }
                ]
            }
        ]
    }]
});

fluid.defaults("gpii.tests.webdriver.axs.environment", {
    gradeNames: ["gpii.test.webdriver.testEnvironment"],
    components: {
        caseHolder: {
            type: "gpii.tests.webdriver.axs.caseHolder"
        }
    }
});

gpii.test.webdriver.allBrowsers({ baseTestEnvironment: "gpii.tests.webdriver.axs.environment" });
