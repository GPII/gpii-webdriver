/*

    Test the "get" function with an external URL.

 */
/* eslint-env node */
"use strict";
var fluid = require("infusion");
fluid.loadTestingSupport();

var gpii = fluid.registerNamespace("gpii");

require("../../");
gpii.webdriver.loadTestingSupport();

fluid.defaults("gpii.tests.webdriver.get.remote.caseHolder", {
    gradeNames: ["fluid.test.testCaseHolder"],
    modules: [{
        name: "Testing the driver's `get` function (remote)...",
        tests: [
            {
                name: "Retrieve a remote page (requires network access)...",
                type: "test",
                sequence: [
                    {
                        event:    "{that}.webdriver.events.onDriverReady",
                        listener: "{that}.webdriver.get",
                        args:     ["http://www.google.com/ncr"]
                    },
                    {
                        event:    "{that}.webdriver.events.onGetComplete",
                        listener: "{that}.webdriver.getPageSource",
                        args:     []
                    },
                    {
                        event:    "{that}.webdriver.events.onGetPageSourceComplete",
                        listener: "jqUnit.assertNotUndefined",
                        args:     ["There should be page content...", "{arguments}.0"]
                    }
                ]
            }
        ]
    }],
    components: {
        webdriver: {
            type: "gpii.webdriver"
        }
    }
});


fluid.defaults("gpii.tests.webdriver.get.remote.environment", {
    gradeNames: ["fluid.test.testEnvironment"],
    components: {
        remoteCaseHolder: {
            type: "gpii.tests.webdriver.get.remote.caseHolder"
        }
    }
});

// TODO: Review with Antranig, the only safe way to run multiple tests appears to be to only use one browser per environment.
fluid.test.runTests("gpii.tests.webdriver.get.remote.environment");
