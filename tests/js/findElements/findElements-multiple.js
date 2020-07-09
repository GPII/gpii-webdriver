/*

    Test the "findElements" function with a single element.

 */
/* eslint-env node */
"use strict";
var fluid = require("infusion");

fluid.require("%fluid-webdriver");
fluid.webdriver.loadTestingSupport();

fluid.defaults("fluid.tests.webdriver.findElements.multiple.caseHolder", {
    gradeNames: ["fluid.test.webdriver.caseHolder"],
    fileUrl: "%fluid-webdriver/tests/js/findElement/html/index.html",
    rawModules: [{
        name: "Testing the driver's `findElements` function (multiple)...",
        tests: [
            {
                name: "Use `findElements` when there are multiple elements matching the selector...",
                type: "test",
                sequence: [
                    {
                        func: "{testEnvironment}.webdriver.get",
                        args: ["@expand:fluid.test.webdriver.resolveFileUrl({that}.options.fileUrl)"]
                    },
                    {
                        event:    "{testEnvironment}.webdriver.events.onGetComplete",
                        listener: "{testEnvironment}.webdriver.findElements",
                        args:     [{ className: "multiple"}]
                    },
                    {
                        event:    "{testEnvironment}.webdriver.events.onFindElementsComplete",
                        listener: "fluid.test.webdriver.inspectElements",
                        args:     ["We should receive an array of values...", "{arguments}.0", "getText", ["One of many.", "Yet another."]] // message, element, elementFn, expectedValue, jqUnitFn
                    }
                ]
            }
        ]
    }]
});

fluid.defaults("fluid.tests.webdriver.findElements.multiple.environment", {
    gradeNames: ["fluid.test.webdriver.testEnvironment"],
    components: {
        caseHolder: {
            type: "fluid.tests.webdriver.findElements.multiple.caseHolder"
        }
    }
});

fluid.test.webdriver.allBrowsers({ baseTestEnvironment: "fluid.tests.webdriver.findElements.multiple.environment" });
