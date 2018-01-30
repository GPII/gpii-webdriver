/*

    A harness to capture all QUnit output.  See the documentation for details:

    https://github.com/GPII/gpii-webdriver/blob/master/docs/qunit-harness.md

 */
/* eslint-env node */
"use strict";
var fluid = fluid || require("infusion");
var gpii = fluid.registerNamespace("gpii");

var QUnit = QUnit || false;
if (!QUnit) {
    require("node-jqunit");
}

fluid.registerNamespace("gpii.webdriver.QUnitHarness");

fluid.registerNamespace("gpii.webdriver.QUnitHarness.transforms");

/**
 *
 * A simple fluid transformation function to ensure cleaner output than Object.prototype.toString produces.
 *
 * @param value - The value to be transformed.
 * @return {String} - returns `JSON.stringify(value)` for objects, or `value.toString()` otherwise.
 *
 */
gpii.webdriver.QUnitHarness.transforms.stringValue = function (value) {
    return typeof value === "object" ? JSON.stringify(value) : value.toString();
};

fluid.defaults("gpii.webdriver.QUnitHarness.transforms.stringValue", {
    gradeNames: ["fluid.standardTransformFunction"]
});

/**
 *
 * A function to intercept all QUnit events and store the information in the `results` member array.
 *
 * @param that - The component itself.
 * @param type {String} - The QUnit event we are handling ("start", "done", "log", etc., see below for full details).
 * @param data - The event data to be preserved.
 */
gpii.webdriver.QUnitHarness.captureTestResults = function (that, type, data) {
    that.events[type].fire();
    that.results.push({ type: type, data: data});
};

/**
 *
 * A function to convert `that.results` into textual output.  See the documentation for full details.
 *
 * @param that - The component itself.
 * @param outputFormat {String} - The output format.  Currently "tap" and "text" are supported.
 * @return {String} - A string representing the test results.
 *
 */
gpii.webdriver.QUnitHarness.outputResults = function (that, outputFormat) {
    outputFormat = outputFormat || that.options.defaultOutputFormat;
    var lines = [];

    // TODO:  This causes executeScript to never return when generating TAP output.  Investigate.
    if (that.options.preamble[outputFormat] !== undefined) {
        lines = lines.concat(that.options.preamble[outputFormat]);
    }

    fluid.each(that.results, function (result) {
        if (that.options.outputTemplates[outputFormat][result.type]) {
            var data = that.options.outputRules[result.type] ? fluid.model.transformWithRules(result.data, that.options.outputRules[result.type]) : result.data;
            var output = fluid.stringTemplate(that.options.outputTemplates[outputFormat][result.type], data);
            lines.push(output);

            if (result.type === "log" && !result.data.result && that.options.extendedOutputTemplates && that.options.extendedOutputTemplates[outputFormat] && that.options.extendedOutputTemplates[outputFormat][result.type]) {
                var extendedOutput = fluid.stringTemplate(that.options.extendedOutputTemplates[outputFormat][result.type], data);
                lines.push(extendedOutput);
            }
        }
    });

    if (that.options.postscript[outputFormat] !== undefined) {
        lines = lines.concat(that.options.postscript[outputFormat]);
    }

    return lines.join("\n");
};

fluid.defaults("gpii.webdriver.QUnitHarness", {
    gradeNames: ["fluid.component"],
    members: {
        results: []
    },
    defaultOutputFormat: "tap",
    preamble: {
        tap: "TAP version 13"
    },
    postscript: {
        tap:  "",
        text: ""
    },
    outputRules: {
        log: {
            name: {
                transform: {
                    type: "fluid.transforms.value",
                    input: "(no name)",
                    inputPath: "name"
                }
            },
            module: {
                transform: {
                    type: "fluid.transforms.value",
                    input: "(no module)",
                    inputPath: "module"
                }
            },
            message: {
                transform: {
                    type: "fluid.transforms.value",
                    input: "(no message)",
                    inputPath: "message"
                }
            },
            ok: {
                transform: {
                    type: "fluid.transforms.valueMapper",
                    inputPath: "result",
                    match: {
                        true: "ok",
                        false: "not ok"
                    }
                }
            },
            result: "result",
            actual: {
                transform: {
                    type: "gpii.webdriver.QUnitHarness.transforms.stringValue",
                    inputPath: "actual",
                    input: "-"
                }
            },
            expected: {
                transform: {
                    type: "gpii.webdriver.QUnitHarness.transforms.stringValue",
                    inputPath: "expected",
                    input: "-"
                }
            }
        },
        testDone: {
            name: {
                transform: {
                    type: "fluid.transforms.value",
                    input: "(no name)",
                    inputPath: "name"
                }
            },
            module: {
                transform: {
                    type: "fluid.transforms.value",
                    input: "(no module)",
                    inputPath: "module"
                }
            },
            duration: "duration",
            failed:   "failed",
            passed:   "passed",
            total:    "total",
            pass: {
                transform: {
                    type:          "fluid.transforms.condition",
                    conditionPath: "failed",
                    true:          "FAIL",
                    false:         "PASS"
                }
            }
        },
        done: {
            "": ""
        }
    },
    extendedOutputTemplates: {
        tap: {
            log: " ---\n message:  %message\n expected: %expected\n actual:   %actual\n ...\n"
        }
    },
    outputTemplates: {
        tap: {
            log:  "%ok %module - %name",
            done: "1..%total"
        },
        text: {
            testDone: "Test concluded - Module \"%module\" Test name \"%name\": %passed/%total passed - %pass",
            done: "***************\n All tests concluded: %passed/%total passed in %runtimems \n***************"
        }
    },
    events: {
        begin:       null,
        done:        null,
        log:         null,
        moduleStart: null,
        moduleDone:  null,
        testStart:   null,
        testDone:    null
    },
    invokers: {
        outputResults: {
            funcName: "gpii.webdriver.QUnitHarness.outputResults",
            args:     ["{that}", "{arguments}.0"]
        },
        // Functions to capture output from QUnit.
        begin: {
            funcName: "gpii.webdriver.QUnitHarness.captureTestResults",
            args:     ["{that}", "begin", "{arguments}.0"]
        },
        done: {
            funcName: "gpii.webdriver.QUnitHarness.captureTestResults",
            args:     ["{that}", "done", "{arguments}.0"]
        },
        log: {
            funcName: "gpii.webdriver.QUnitHarness.captureTestResults",
            args:     ["{that}", "log", "{arguments}.0"]
        },
        moduleStart: {
            funcName: "gpii.webdriver.QUnitHarness.captureTestResults",
            args:     ["{that}", "moduleStart", "{arguments}.0"]
        },
        moduleDone: {
            funcName: "gpii.webdriver.QUnitHarness.captureTestResults",
            args:     ["{that}", "moduleDone", "{arguments}.0"]
        },
        testStart: {
            funcName: "gpii.webdriver.QUnitHarness.captureTestResults",
            args:     ["{that}", "testStart", "{arguments}.0"]
        },
        testDone: {
            funcName: "gpii.webdriver.QUnitHarness.captureTestResults",
            args:     ["{that}", "testDone", "{arguments}.0"]
        }
    },
    listeners: {
        "onCreate.wireBegin": {
            funcName: "QUnit.begin",
            args: ["{that}.begin"]
        },
        "onCreate.wireDone": {
            funcName: "QUnit.done",
            args: ["{that}.done"]
        },
        "onCreate.wireLog": {
            funcName: "QUnit.log",
            args: ["{that}.log"]
        },
        "onCreate.wireModuleStart": {
            funcName: "QUnit.moduleStart",
            args: ["{that}.moduleStart"]
        },
        "onCreate.wireModuleDone": {
            funcName: "QUnit.moduleDone",
            args: ["{that}.moduleDone"]
        },
        "onCreate.wireTestStart": {
            funcName: "QUnit.testStart",
            args: ["{that}.testStart"]
        },
        "onCreate.wireTestDone": {
            funcName: "QUnit.testDone",
            args: ["{that}.testDone"]
        }
    }
});

gpii.webdriver.QUnitHarness.instance = gpii.webdriver.QUnitHarness();
