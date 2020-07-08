// TODO: These fail with Firefox 57 and geckodriver 0.18.0
/*

    Test the "findElement" function with a single element.

 */
/* eslint-env node */
"use strict";
var fluid = require("infusion");

fluid.require("%fluid-webdriver");
fluid.webdriver.loadTestingSupport();

var jqUnit = require("node-jqunit");

fluid.registerNamespace("fluid.tests.webdriver.navigation.browser.refresh");
fluid.tests.webdriver.navigation.browser.refresh.isHidden = function (message, element, shouldBeDisplayed) {
    jqUnit.stop();
    element.isDisplayed().then(function (result) {
        jqUnit.start();
        jqUnit.assertEquals(message, shouldBeDisplayed, result);
    });
};

fluid.defaults("fluid.tests.webdriver.navigation.browser.refresh.caseHolder", {
    gradeNames: ["fluid.test.webdriver.caseHolder"],
    fileUrl: "%fluid-webdriver/tests/js/browser-navigation/html/refresh.html",
    rawModules: [{
        name: "Testing the browser's `refresh` function...",
        tests: [
            {
                name: "Refresh the browser to clear out the content...",
                type: "test",
                sequence: [
                    {
                        func: "{testEnvironment}.webdriver.get",
                        args: ["@expand:fluid.test.webdriver.resolveFileUrl({that}.options.fileUrl)"]
                    },
                    {
                        event:    "{testEnvironment}.webdriver.events.onGetComplete",
                        listener: "{testEnvironment}.webdriver.findElement",
                        args:     [{ id: "message"}]
                    },
                    {
                        event:    "{testEnvironment}.webdriver.events.onFindElementComplete",
                        listener: "fluid.tests.webdriver.navigation.browser.refresh.isHidden",
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
                        listener: "fluid.tests.webdriver.navigation.browser.refresh.isHidden",
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
                        listener: "fluid.tests.webdriver.navigation.browser.refresh.isHidden",
                        args:     ["The message should be visible again...", "{arguments}.0", true] // message, element, shouldBeDisplayed
                    }
                ]
            }
        ]
    }]
});

fluid.defaults("fluid.tests.webdriver.navigation.browser.refresh.environment", {
    gradeNames: ["fluid.test.webdriver.testEnvironment"],
    components: {
        caseHolder: {
            type: "fluid.tests.webdriver.navigation.browser.refresh.caseHolder"
        }
    }
});

fluid.test.webdriver.allBrowsers({ baseTestEnvironment: "fluid.tests.webdriver.navigation.browser.refresh.environment" });
