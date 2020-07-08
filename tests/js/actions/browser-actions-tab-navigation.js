// TODO: These fail with Firefox 57 and geckodriver 0.18.0
/*

    Test the "findElement" function with a single element.

 */
/* eslint-env node */
"use strict";
var fluid = require("infusion");

fluid.require("%fluid-webdriver");
fluid.webdriver.loadTestingSupport();

fluid.defaults("fluid.tests.webdriver.actions.tabs.caseHolder", {
    gradeNames: ["fluid.test.webdriver.caseHolder"],
    fileUrl: "%fluid-webdriver/tests/js/actions/html/tabs.html",
    rawModules: [{
        name: "Testing keyboard navigation...",
        tests: [
            {
                name: "Use the tab key to navigate to a particular field...",
                type: "test",
                sequence: [
                    {
                        func: "{testEnvironment}.webdriver.get",
                        args: ["@expand:fluid.test.webdriver.resolveFileUrl({that}.options.fileUrl)"]
                    },
                    {
                        event:    "{testEnvironment}.webdriver.events.onGetComplete",
                        listener: "{testEnvironment}.webdriver.actionsHelper",
                        args:     [{ fn: "sendKeys", args: [fluid.webdriver.Key.TAB, fluid.webdriver.Key.TAB]}]
                    },
                    {
                        event:    "{testEnvironment}.webdriver.events.onActionsHelperComplete",
                        listener: "{testEnvironment}.webdriver.findElement",
                        args:     [{ id: "text-field-2"}]
                    },
                    {
                        event:    "{testEnvironment}.webdriver.events.onFindElementComplete",
                        listener: "fluid.test.webdriver.testElementSelected",
                        args:     ["The second form input should be selected...", "{arguments}.0", true] // message, element, selected
                    }
                ]
            }
        ]
    }]
});

fluid.defaults("fluid.tests.webdriver.actions.tabs.environment", {
    gradeNames: ["fluid.test.webdriver.testEnvironment"],
    components: {
        caseHolder: {
            type: "fluid.tests.webdriver.actions.tabs.caseHolder"
        }
    }
});

fluid.test.webdriver.allBrowsers({ baseTestEnvironment: "fluid.tests.webdriver.actions.tabs.environment" });
