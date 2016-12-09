// Test the `gpii.test.webdriver.testEnvironment.withExpress` environment provided by this package.
/* eslint-env node */
"use strict";
var fluid = require("infusion");
var gpii  = fluid.registerNamespace("gpii");

fluid.require("%gpii-webdriver");
gpii.webdriver.loadTestingSupport();

fluid.defaults("gpii.tests.webdriver.express.caseHolder", {
    gradeNames: ["gpii.test.webdriver.caseHolder"],
    rawModules: [{
        name: "Testing integration with gpii-express...",
        tests: [
            {
                name: "Retrieve content from gpii-express...",
                type: "test",
                sequence: [
                    {
                        func: "{testEnvironment}.webdriver.get",
                        args: ["{testEnvironment}.options.url"]
                    },
                    {
                        event:    "{testEnvironment}.webdriver.events.onGetComplete",
                        listener: "{testEnvironment}.webdriver.findElement",
                        args:     [{ tagName: "body"}]
                    },
                    {
                        event:    "{testEnvironment}.webdriver.events.onFindElementComplete",
                        listener: "gpii.test.webdriver.inspectElement",
                        args:     ["We should have received the expected response from gpii-express...", "{arguments}.0", "getText", "Hello, World"] // message, element, elementFn, expectedValue, jqUnitFn
                    }
                ]
            }
        ]
    }]
});

fluid.defaults("gpii.tests.webdriver.express.environment", {
    gradeNames: ["gpii.test.webdriver.testEnvironment.withExpress"],
    components: {
        caseHolder: {
            type: "gpii.tests.webdriver.express.caseHolder"
        },
        express: {
            options: {
                components: {
                    helloMiddleware: {
                        type: "gpii.test.express.middleware.hello"
                    }
                }
            }
        }
    }
});

gpii.test.webdriver.allBrowsers({
    baseTestEnvironment: "gpii.tests.webdriver.express.environment"
});
