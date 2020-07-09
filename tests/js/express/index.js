// Test the `fluid.test.webdriver.testEnvironment.withExpress` environment provided by this package.
/* eslint-env node */
"use strict";
var fluid = require("infusion");

fluid.require("%fluid-webdriver");
fluid.webdriver.loadTestingSupport();

fluid.defaults("fluid.tests.webdriver.express.caseHolder", {
    gradeNames: ["fluid.test.webdriver.caseHolder"],
    rawModules: [{
        name: "Testing integration with fluid-express...",
        tests: [
            {
                name: "Retrieve content from fluid-express...",
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
                        listener: "fluid.test.webdriver.inspectElement",
                        args:     ["We should have received the expected response from fluid-express...", "{arguments}.0", "getText", "Hello, World"] // message, element, elementFn, expectedValue, jqUnitFn
                    }
                ]
            }
        ]
    }]
});

fluid.defaults("fluid.tests.webdriver.express.environment", {
    gradeNames: ["fluid.test.webdriver.testEnvironment.withExpress"],
    components: {
        caseHolder: {
            type: "fluid.tests.webdriver.express.caseHolder"
        },
        express: {
            options: {
                components: {
                    helloMiddleware: {
                        type: "fluid.test.express.middleware.hello"
                    }
                }
            }
        }
    }
});

fluid.test.webdriver.allBrowsers({
    baseTestEnvironment: "fluid.tests.webdriver.express.environment"
});
