/*

    Test the "get" function with a local file.

 */
/* eslint-env node */
"use strict";
var fluid = require("infusion");
fluid.loadTestingSupport();

fluid.setLogging(true);

var gpii = fluid.registerNamespace("gpii");

require("../../");
gpii.webdriver.loadTestingSupport();

// TODO:  Add documentation about required JAVA_OPTS for standalone server.

// TODO: Make this launch its own selenium server using a common startSequence and tear it down using a standard endSequence
// TODO: Ensure that this runs on a range of browsers.

fluid.defaults("gpii.tests.webdriver.caseHolder.localGet", {
    gradeNames: ["fluid.test.testCaseHolder"],
    fileUrl: "%gpii-webdriver/tests/get/html/index.html",
    modules: [{
        name: "Testing the driver's `get` function (local)...",
        tests: [
            {
                name: "Retrieve a local page...",
                type: "test",
                sequence: [
                    {
                        event:    "{that}.webdriver.events.onDriverReady",
                        listener: "{that}.webdriver.get",
                        args:     ["@expand:gpii.test.webdriver.resolveFileUrl({that}.options.fileUrl)"]
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

fluid.defaults("gpii.tests.webdriver.environment.localGet", {
    gradeNames: ["fluid.test.testEnvironment"],
    components: {
        localCaseHolder: {
            type: "gpii.tests.webdriver.caseHolder.localGet"
        }
    }
});

// TODO: Review with Antranig, the only safe way to run multiple tests appears to be to only use one browser per environment.
fluid.test.runTests("gpii.tests.webdriver.environment.localGet");

/*

    driver.get('http://www.google.com/ncr');
    driver.findElement(By.name('q')).sendKeys('webdriver');
    driver.findElement(By.name('btnG')).click();
    driver.wait(until.titleIs('webdriver - Google Search'), 1000);
    driver.quit();

*/
