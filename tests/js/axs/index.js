// TODO: These fail with Firefox 57 and geckodriver 0.18.0
/*

    Test the Accessibility Developer Tools in combination with this package:

    https://github.com/GoogleChrome/accessibility-developer-tools

 */
/* eslint-env node */
"use strict";
var fluid = require("infusion");

fluid.require("%fluid-webdriver");
fluid.webdriver.loadTestingSupport();

fluid.defaults("fluid.tests.webdriver.axs.caseHolder", {
    gradeNames: ["fluid.test.webdriver.caseHolder", "fluid.test.webdriver.hasAxsContent"],
    goodUrl: "%fluid-webdriver/tests/js/axs/html/good.html",
    badUrl: "%fluid-webdriver/tests/js/axs/html/bad.html",
    injectUrl: "%fluid-webdriver/tests/js/axs/html/injection.html",
    rawModules: [{
        name: "Testing accessibility developer tools...",
        tests: [
            {
                name: "Run the accessibility developer tools on a good page...",
                type: "test",
                sequence: [
                    {
                        func: "{testEnvironment}.webdriver.get",
                        args: ["@expand:fluid.test.webdriver.resolveFileUrl({that}.options.goodUrl)"]
                    },
                    {
                        event:    "{testEnvironment}.webdriver.events.onGetComplete",
                        listener: "{testEnvironment}.webdriver.executeScript",
                        args:     [fluid.test.webdriver.axs.runAxs]
                    },
                    {
                        event:    "{testEnvironment}.webdriver.events.onExecuteScriptComplete",
                        listener: "fluid.test.webdriver.axs.checkResults",
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
                        args: ["@expand:fluid.test.webdriver.resolveFileUrl({that}.options.badUrl)"]
                    },
                    {
                        event:    "{testEnvironment}.webdriver.events.onGetComplete",
                        listener: "{testEnvironment}.webdriver.executeScript",
                        args:     [fluid.test.webdriver.axs.runAxs]
                    },
                    {
                        event:    "{testEnvironment}.webdriver.events.onExecuteScriptComplete",
                        listener: "fluid.test.webdriver.axs.checkResults",
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
                        listener: "{testEnvironment}.webdriver.executeScript",
                        args:     [fluid.test.webdriver.axs.runAxs, { auditRulesToIgnore: ["badAriaRole"]}]
                    },
                    {
                        event:    "{testEnvironment}.webdriver.events.onExecuteScriptComplete",
                        listener: "fluid.test.webdriver.axs.checkResults",
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
                        args: ["@expand:fluid.test.webdriver.resolveFileUrl({that}.options.injectUrl)"]
                    },
                    {
                        event:    "{testEnvironment}.webdriver.events.onGetComplete",
                        listener: "{testEnvironment}.webdriver.executeScript",
                        args:     ["{that}.options.scriptContent.axs"]
                    },
                    {
                        event:    "{testEnvironment}.webdriver.events.onExecuteScriptComplete",
                        listener: "{testEnvironment}.webdriver.executeScript",
                        args:     [fluid.test.webdriver.axs.runAxs]
                    },
                    {
                        event:    "{testEnvironment}.webdriver.events.onExecuteScriptComplete",
                        listener: "fluid.test.webdriver.axs.checkResults",
                        args:     ["{arguments}.0"]
                    }
                ]
            }
        ]
    }]
});

fluid.defaults("fluid.tests.webdriver.axs.environment", {
    gradeNames: ["fluid.test.webdriver.testEnvironment"],
    components: {
        caseHolder: {
            type: "fluid.tests.webdriver.axs.caseHolder"
        }
    }
});

fluid.test.webdriver.allBrowsers({ baseTestEnvironment: "fluid.tests.webdriver.axs.environment" });
