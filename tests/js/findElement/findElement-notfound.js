/*

    Test the "findElement" function with a bad selector.

 */
/* eslint-env node */
"use strict";
var fluid = require("infusion");
var gpii = fluid.registerNamespace("gpii");

require("../../../");
gpii.webdriver.loadTestingSupport();

fluid.defaults("gpii.tests.webdriver.findElement.notFound.caseHolder", {
    gradeNames: ["gpii.test.webdriver.caseHolder"],
    fileUrl: "%gpii-webdriver/tests/js/findElement/html/index.html",
    rawModules: [{
        name: "Testing the driver's `findElement` function (single)...",
        tests: [
            {
                name: "Retrieve a single element...",
                type: "test",
                sequence: [
                    {
                        func: "{testEnvironment}.webdriver.get",
                        args: ["@expand:gpii.test.webdriver.resolveFileUrl({that}.options.fileUrl)"]
                    },
                    {
                        event:    "{testEnvironment}.webdriver.events.onGetComplete",
                        listener: "{testEnvironment}.webdriver.findElement",
                        args:     [{ id: "notfound"}]
                    },
                    {
                        event:    "{testEnvironment}.webdriver.events.onError",
                        listener: "jqUnit.assert",
                        args:     ["An error should be thrown if we try to use a bad selector..."]
                    }
                ]
            }
        ]
    }]
});

fluid.defaults("gpii.tests.webdriver.findElement.notFound.environment", {
    gradeNames: ["gpii.test.webdriver.testEnvironment"],
    components: {
        caseHolder: {
            type: "gpii.tests.webdriver.findElement.notFound.caseHolder"
        }
    }
});

gpii.test.webdriver.allBrowsers({ baseTestEnvironent: "gpii.tests.webdriver.findElement.notFound.environment" });
