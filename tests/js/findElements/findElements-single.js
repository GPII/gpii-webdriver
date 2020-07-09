/*

    Test the "findElements" function with a single element.

 */
/* eslint-env node */
"use strict";
var fluid = require("infusion");

fluid.require("%fluid-webdriver");
fluid.webdriver.loadTestingSupport();

fluid.defaults("fluid.tests.webdriver.findElements.single.caseHolder", {
    gradeNames: ["fluid.test.webdriver.caseHolder"],
    fileUrl: "%fluid-webdriver/tests/js/findElement/html/index.html",
    rawModules: [{
        name: "Testing the driver's `findElements` function (single)...",
        tests: [
            {
                name: "Retrieve a single element...",
                type: "test",
                sequence: [
                    {
                        func: "{testEnvironment}.webdriver.get",
                        args: ["@expand:fluid.test.webdriver.resolveFileUrl({that}.options.fileUrl)"]
                    },
                    {
                        event:    "{testEnvironment}.webdriver.events.onGetComplete",
                        listener: "{testEnvironment}.webdriver.findElements",
                        args:     [{ id: "single"}]
                    },
                    {
                        event:    "{testEnvironment}.webdriver.events.onFindElementsComplete",
                        listener: "fluid.test.webdriver.inspectElements",
                        args:     ["We should have found a single element", "{arguments}.0", "getText", ["One of a kind."]] // message, elements, elementFn, expectedValue
                    }
                ]
            }
        ]
    }]
});

fluid.defaults("fluid.tests.webdriver.findElements.single.environment", {
    gradeNames: ["fluid.test.webdriver.testEnvironment"],
    components: {
        caseHolder: {
            type: "fluid.tests.webdriver.findElements.single.caseHolder"
        }
    }
});

fluid.test.webdriver.allBrowsers({ baseTestEnvironment: "fluid.tests.webdriver.findElements.single.environment" });
