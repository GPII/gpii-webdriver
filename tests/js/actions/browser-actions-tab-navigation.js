/*

    Test the "findElement" function with a single element.

 */
/* eslint-env node */
"use strict";
var fluid = require("infusion");
var gpii = fluid.registerNamespace("gpii");

require("../../../");
gpii.webdriver.loadTestingSupport();

fluid.defaults("gpii.tests.webdriver.actions.tabs.caseHolder", {
    gradeNames: ["gpii.test.webdriver.caseHolder"],
    fileUrl: "%gpii-webdriver/tests/js/actions/html/tabs.html",
    rawModules: [{
        name: "Testing the browser's `refresh` function...",
        tests: [
            {
                name: "Use the tab key to navigate to a particular field...",
                type: "test",
                sequence: [
                    {
                        func: "{testEnvironment}.webdriver.get",
                        args: ["@expand:gpii.test.webdriver.resolveFileUrl({that}.options.fileUrl)"]
                    },
                    {
                        event:    "{testEnvironment}.webdriver.events.onGetComplete",
                        listener: "{testEnvironment}.webdriver.actions",
                        args:     [{ sendKeys: [gpii.webdriver.Key.TAB, gpii.webdriver.Key.TAB]}]
                    },
                    {
                        event:    "{testEnvironment}.webdriver.events.onActionsComplete",
                        listener: "{testEnvironment}.webdriver.findElement",
                        args:     [{ id: "text-field-2"}]
                    },
                    {
                        event:    "{testEnvironment}.webdriver.events.onFindElementComplete",
                        listener: "gpii.webdriver.test.testElementSelected",
                        args:     ["The second form input should be selected...", "{arguments}.0", true] // message, element, selected
                    }
                ]
            }
        ]
    }]
});

fluid.defaults("gpii.tests.webdriver.actions.tabs.environment", {
    gradeNames: ["gpii.test.webdriver.testEnvironment"],
    components: {
        caseHolder: {
            type: "gpii.tests.webdriver.actions.tabs.caseHolder"
        }
    }
});

gpii.test.webdriver.allBrowsers({ baseTestEnvironent: "gpii.tests.webdriver.actions.tabs.environment" });
