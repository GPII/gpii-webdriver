/*

 Fluid IoC test fixtures for use with `gpii.webdriver`.  See the documentation for details:

 https://github.com/GPII/gpii-webdriver/blob/master/docs/fixtures.md

 */
/* eslint-env node */
"use strict";
var fluid = require("infusion");
var gpii  = fluid.registerNamespace("gpii");

var fs = require("fs");

require("gpii-express");
gpii.express.loadTestingSupport();

fluid.registerNamespace("gpii.test.webdriver.caseHolder");

/**
 *
 * A function to prepend the value of `that.options.browser` to each module and test name.  Helps to distinguish tests
 * run using `allBrowsers` from one another.
 *
 * @param {Object} that - The caseHolder component
 * @param {Object} module - The individual test module.
 * @return {Object} A copy of the original module with updated `name` values for all modules and tests.
 *
 */
gpii.test.webdriver.caseHolder.prepareModule = function (that, module) {
    var processedModule = fluid.copy(module);
    processedModule.name = that.options.browser + ": " + module.name;
    var processedTests = [];
    fluid.each(module.tests, function (testDef) {
        var processedTest = fluid.copy(testDef);
        processedTest.name = that.options.browser + ": " + testDef.name;
        processedTests.push(processedTest);
    });
    processedModule.tests = processedTests;
    return processedModule;
};

/**
 *
 * A function that transforms each module using `that.prepareModule` and then prepends and appends standard sequences
 * using the static function `gpii.test.express.helpers.addRequiredSequences` from the `gpii-express` package.
 *
 * @param {Object} that - The caseHolder component itself.
 * @return {Object} A copy of the original modules, updated with the standard start and end sequences and transformed using `that.prepareModule`
 *
 */
gpii.test.webdriver.caseHolder.prepareModules = function (that) {
    var modulesWithStartAndEnd = gpii.test.express.helpers.addRequiredSequences(that.options.rawModules, that.options.sequenceStart, that.options.sequenceEnd);
    return fluid.transform(modulesWithStartAndEnd, that.prepareModule);
};

fluid.registerNamespace("gpii.tests.webDriver.hasScriptContent");

gpii.tests.webDriver.hasScriptContent.cacheContent = function (scriptPaths) {
    var scriptContent = {};
    fluid.each(scriptPaths, function (scriptPath, key) {
        var resolvedPath = fluid.module.resolvePath(scriptPath);
        scriptContent[key] = fs.readFileSync(resolvedPath, "utf8");
    });
    return scriptContent;
};

// A mix-in grade that caches script content so that it can be injected into a page using `executeScript`.
fluid.defaults("gpii.tests.webDriver.hasScriptContent", {
    gradeNames: ["fluid.component"],
    scriptContent: "@expand:gpii.tests.webDriver.hasScriptContent.cacheContent({that}.options.scriptPaths)"
});

// TODO:  Discuss future-proofing this strategy, which will not work in dependent packages post npm 3 / yarn.
// A mix-in grade that adds aXe script content available at `{that}.scriptContent.axe` that can be injected into a
// page using `executeScript`.
fluid.defaults("gpii.test.webdriver.hasAxeContent", {
    gradeNames: ["gpii.tests.webDriver.hasScriptContent"],
    scriptPaths: {
        axe: "%gpii-webdriver/node_modules/axe-core/axe.js"
    }
});

// TODO:  Discuss future-proofing this strategy, which will not work in dependent packages post npm 3 / yarn.
// A mix-in grade that adds accessibility developer toolkit script content available at `{that}.scriptContent.axs` that
// can be injected into a page using `executeScript`.
fluid.defaults("gpii.test.webdriver.hasAxsContent", {
    gradeNames: ["gpii.tests.webDriver.hasScriptContent"],
    scriptPaths: {
        axs: "%gpii-webdriver/node_modules/accessibility-developer-tools/dist/js/axs_testing.js"
    }
});

// A mix-in grade that caches Fluid itself at `{that}.scriptContent.fluid` so that it can be injected into a page
// using `executeScript`.
fluid.defaults("gpii.test.webdriver.hasFluidContent", {
    gradeNames: ["gpii.tests.webDriver.hasScriptContent"],
    scriptPaths: {
        fluid:  "%infusion/src/framework/core/js/Fluid.js",
        jQuery: "%infusion/src/lib/jquery/core/js/jquery.js"
    }
});

/*

    A caseHolder that makes use of the above functions to generate its final module content based on:

        1. that.options.rawModules
        2. that.options.startSequence (goes at the start of each set of test sequences.
        3. that.options.endSequence (goes at the end of each set of test sequences.
        4. that.options.browser (Prepended to the name of each module and test, including those added in steps 2 and 3).

    The caseHolder also resolves and stores copies of the aXe and Accessibility Developer Toolkits, for use in tests.

 */
fluid.defaults("gpii.test.webdriver.caseHolder.base", {
    gradeNames: ["gpii.test.express.caseHolder.base"],
    browser: "{testEnvironment}.options.browser",
    moduleSource: {
        funcName: "gpii.test.webdriver.caseHolder.prepareModules",
        args:     ["{that}"]
    },
    invokers: {
        prepareModule: {
            funcName: "gpii.test.webdriver.caseHolder.prepareModule",
            args:     ["{that}", "{arguments}.0"]
        }
    }
});

/* same as the above, but with the standard start and end sequences use in most of the tests in this package. */
fluid.defaults("gpii.test.webdriver.caseHolder", {
    gradeNames: ["gpii.test.webdriver.caseHolder.base"],
    sequenceStart: gpii.test.express.standardSequenceStart,
    sequenceEnd: [
        { func: "{testEnvironment}.events.stopFixtures.fire", args: [] },
        { listener: "fluid.identity", event: "{testEnvironment}.events.onFixturesStopped"}
    ]
});

/* A testEnvironment designed for use with the standard start and end steps above. */
fluid.defaults("gpii.test.webdriver.testEnvironment", {
    gradeNames: ["fluid.test.testEnvironment"],
    events: {
        constructFixtures: null,
        onDriverReady: null,
        onDriverStopped: null,
        onFixturesConstructed: {
            events: {
                onDriverReady: "onDriverReady"
            }
        },
        onFixturesStopped: {
            events: {
                onDriverStopped: "onDriverStopped"
            }
        },
        stopFixtures: null
    },
    components: {
        webdriver: {
            createOnEvent: "constructFixtures",
            type: "gpii.webdriver",
            options: {
                browser: "{testEnvironment}.options.browser",
                events: {
                    onDriverReady: "{testEnvironment}.events.onDriverReady",
                    stopFixtures:  "{testEnvironment}.events.stopFixtures"
                },
                listeners: {
                    onQuitComplete: { func: "{testEnvironment}.events.onDriverStopped.fire" },
                    "stopFixtures.quit": { func: "{that}.quit" }
                }
            }
        }
    }
});

fluid.defaults("gpii.test.webdriver.testEnvironment.withExpress", {
    gradeNames: ["gpii.test.webdriver.testEnvironment"],
    port: 6984,
    path: "",
    url: {
        expander: {
            funcName: "fluid.stringTemplate",
            args: ["http://localhost:%port/%path", { port: "{that}.options.port", path: "{that}.options.path"}]
        }
    },
    events: {
        onExpressDone:  null,
        onExpressReady: null,

        onFixturesConstructed: {
            events: {
                onDriverReady:  "onDriverReady",
                onExpressReady: "onExpressReady"
            }
        },
        onFixturesStopped: {
            events: {
                onDriverStopped: "onDriverStopped",
                onExpressDone:    "onExpressDone"
            }
        }
    },
    components: {
        express: {
            type: "gpii.express",
            createOnEvent: "constructFixtures",
            options: {
                events: {
                    stopFixtures:  "{testEnvironment}.events.stopFixtures"
                },
                port: "{gpii.test.webdriver.testEnvironment.withExpress}.options.port",
                baseUrl: {
                    expander: {
                        funcName: "fluid.stringTemplate",
                        args: ["http://localhost:%port/", { port: "{that}.options.port"}]
                    }
                },
                invokers: {
                    "stopServer": {
                        funcName: "gpii.express.stopServer",
                        args:     ["{that}"]
                    }
                },
                listeners: {
                    "onStarted.notifyEnvironment": {
                        func: "{gpii.test.webdriver.testEnvironment.withExpress}.events.onExpressReady.fire"
                    },
                    "onStopped.notifyEnvironment": {
                        func: "{gpii.test.webdriver.testEnvironment.withExpress}.events.onExpressDone.fire"
                    },
                    "stopFixtures.stopServer": { func: "{that}.stopServer" },
                    // Disable the onDestroy listener inherited from gpii.express, as it will not result in a notification when the server is finally stopped.
                    "onDestroy.stopServer": { funcName: "fluid.identity" }
                }
            }
        }
    }
});
