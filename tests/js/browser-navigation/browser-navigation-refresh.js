/*

    Test the "findElement" function with a single element.

 */
/* eslint-env node */
"use strict";
var fluid = require("infusion");
var gpii = fluid.registerNamespace("gpii");

require("../../../");
gpii.webdriver.loadTestingSupport();

fluid.defaults("gpii.tests.webdriver.navigation.browser.refresh.caseHolder", {
    gradeNames: ["gpii.test.webdriver.caseHolder"],
    fileUrl: "%gpii-webdriver/tests/js/browser-navigation/html/refresh.html",
    rawModules: [{
        name: "Testing the browser's `refresh` function...",
        tests: [
            {
                name: "Refresh the browser to clear out the content...",
                type: "test",
                sequence: [
                    {
                        func: "{testEnvironment}.webdriver.get",
                        args: ["@expand:gpii.test.webdriver.resolveFileUrl({that}.options.fileUrl)"]
                    },
                    {
                        event:    "{testEnvironment}.webdriver.events.onGetComplete",
                        listener: "{testEnvironment}.webdriver.actionsHelper",
                        args:     [{ sendKeys: ["a simple string"]}]
                    },
                    {
                        event:    "{testEnvironment}.webdriver.events.onActionsHelperComplete",
                        listener: "{testEnvironment}.webdriver.findElement",
                        args:     [{ id: "text-field"}]
                    },
                    {
                        event:    "{testEnvironment}.webdriver.events.onFindElementComplete",
                        listener: "gpii.webdriver.test.testElementValue",
                        args:     ["Our text should have been entered...", "{arguments}.0", "a simple string"] // message, element, expectedValue, jqUnitFn
                    },
                    {
                        func: "{testEnvironment}.webdriver.navigateHelper",
                        args: ["refresh"]
                    },
                    {
                        event:    "{testEnvironment}.webdriver.events.onNavigateHelperComplete",
                        listener: "{testEnvironment}.webdriver.findElement",
                        args:     [{ id: "text-field"}]
                    },
                    {
                        event:    "{testEnvironment}.webdriver.events.onFindElementComplete",
                        listener: "gpii.webdriver.test.testElementValue",
                        args:     ["Our text should have been entered...", "{arguments}.0", ""] // message, element, expectedValue, jqUnitFn
                    }
                ]
            }
        ]
    }]
});

fluid.defaults("gpii.tests.webdriver.navigation.browser.refresh.environment", {
    gradeNames: ["gpii.test.webdriver.testEnvironment"],
    components: {
        caseHolder: {
            type: "gpii.tests.webdriver.navigation.browser.refresh.caseHolder"
        }
    }
});

gpii.test.webdriver.allBrowsers({ baseTestEnvironment: "gpii.tests.webdriver.navigation.browser.refresh.environment" });
