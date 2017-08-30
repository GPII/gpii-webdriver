// TODO: These fail with Firefox 57 and geckodriver 0.18.0
/*

    Test the "findElement" function with a single element.

 */
/* eslint-env node */
"use strict";
var fluid = require("infusion");
var gpii = fluid.registerNamespace("gpii");

fluid.require("%gpii-webdriver");
gpii.webdriver.loadTestingSupport();

var jqUnit = require("node-jqunit");

fluid.registerNamespace("gpii.tests.webdriver.navigation.browser.refresh");
gpii.tests.webdriver.navigation.browser.refresh.isHidden = function (message, element, shouldBeDisplayed) {
    jqUnit.stop();
    element.isDisplayed().then(function (result) {
        jqUnit.start();
        jqUnit.assertEquals(message, shouldBeDisplayed, result);
    });
};

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
                        listener: "{testEnvironment}.webdriver.findElement",
                        args:     [{ id: "message"}]
                    },
                    {
                        event:    "{testEnvironment}.webdriver.events.onFindElementComplete",
                        listener: "gpii.tests.webdriver.navigation.browser.refresh.isHidden",
                        args:     ["The message should be visible...", "{arguments}.0", true] // message, element, shouldBeDisplayed
                    },
                    {
                        func: "{testEnvironment}.webdriver.findElement",
                        args: [{ id: "message-toggle"}]
                    },
                    {
                        event:    "{testEnvironment}.webdriver.events.onFindElementComplete",
                        listener: "{testEnvironment}.webdriver.actionsHelper",
                        args:     [{fn: "click", args: ["{arguments}.0"]}]
                    },
                    {
                        event:    "{testEnvironment}.webdriver.events.onActionsHelperComplete",
                        listener: "{testEnvironment}.webdriver.findElement",
                        args:     [{ id: "message"}]
                    },
                    {
                        event:    "{testEnvironment}.webdriver.events.onFindElementComplete",
                        listener: "gpii.tests.webdriver.navigation.browser.refresh.isHidden",
                        args:     ["The message should no longer be visible...", "{arguments}.0", false] // message, element, shouldBeDisplayed
                    },
                    {
                        func: "{testEnvironment}.webdriver.navigateHelper",
                        args: ["refresh"]
                    },
                    {
                        event:    "{testEnvironment}.webdriver.events.onNavigateHelperComplete",
                        listener: "{testEnvironment}.webdriver.findElement",
                        args:     [{ id: "message"}]
                    },
                    {
                        event:    "{testEnvironment}.webdriver.events.onFindElementComplete",
                        listener: "gpii.tests.webdriver.navigation.browser.refresh.isHidden",
                        args:     ["The message should be visible again...", "{arguments}.0", true] // message, element, shouldBeDisplayed
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
