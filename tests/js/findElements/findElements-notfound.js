/*

    Test the "findElements" function with a single element.

 */
/* eslint-env node */
"use strict";
var fluid = require("infusion");

fluid.require("%fluid-webdriver");
fluid.webdriver.loadTestingSupport();

fluid.defaults("fluid.tests.webdriver.findElements.notFound.caseHolder", {
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
                        args:     [{ id: "notfound"}]
                    },
                    {
                        event:    "{testEnvironment}.webdriver.events.onFindElementsComplete",
                        listener: "jqUnit.assertDeepEq",
                        args:     ["We should receive an empty array if we use a bad selector...", [], "{arguments}.0"]
                    }
                ]
            }
        ]
    }]
});

fluid.defaults("fluid.tests.webdriver.findElements.notFound.environment", {
    gradeNames: ["fluid.test.webdriver.testEnvironment"],
    components: {
        caseHolder: {
            type: "fluid.tests.webdriver.findElements.notFound.caseHolder"
        }
    }
});

fluid.test.webdriver.allBrowsers({ baseTestEnvironment: "fluid.tests.webdriver.findElements.notFound.environment" });
