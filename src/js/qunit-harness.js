// A harness to capture all QUnit output.  Should be instantiated after Fluid and QUnit are loaded, but before tests
// are run.  You are expected to interrogate this from the node side using the `executeScript` function.
/* eslint-env node */
"use strict";
var fluid = fluid || require("infusion");
var gpii = fluid.registerNamespace("gpii");
fluid.registerNamespace("gpii.webdriver.client.QUnitHarness");

fluid.registerNamespace("gpii.webdriver.client.QUnitHarness.transforms");
gpii.webdriver.client.QUnitHarness.transforms.stringValue = function (value) {
    return typeof value === "object" ? JSON.stringify(value) : value.toString();
};

fluid.defaults("gpii.webdriver.client.QUnitHarness.transforms.stringValue", {
    gradeNames: ["fluid.standardTransformFunction"]
});

gpii.webdriver.client.QUnitHarness.captureTestResults = function (that, type, obj) {
    that.results.push({ type: type, data: obj});
};

gpii.webdriver.client.QUnitHarness.outputResults = function (that, outputFormat) {
    outputFormat = outputFormat || that.options.defaultOutputFormat;
    var lines = [];

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

fluid.defaults("gpii.webdriver.client.QUnitHarness", {
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
                    options: {
                        true: "ok",
                        false: "not ok"
                    }
                }
            },
            result: "result",
            actual: {
                transform: {
                    type: "gpii.webdriver.client.QUnitHarness.transforms.stringValue",
                    inputPath: "actual",
                    input: "-"
                }
            },
            expected: {
                transform: {
                    type: "gpii.webdriver.client.QUnitHarness.transforms.stringValue",
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
    invokers: {
        outputResults: {
            funcName: "gpii.webdriver.client.QUnitHarness.outputResults",
            args:     ["{that}", "{arguments}.0"]
        },
        // Functions to capture output from QUnit.
        begin: {
            funcName: "gpii.webdriver.client.QUnitHarness.captureTestResults",
            args:     ["{that}", "begin", "{arguments}.0"]
        },
        done: {
            funcName: "gpii.webdriver.client.QUnitHarness.captureTestResults",
            args:     ["{that}", "done", "{arguments}.0"]
        },
        log: {
            funcName: "gpii.webdriver.client.QUnitHarness.captureTestResults",
            args:     ["{that}", "log", "{arguments}.0"]
        },
        moduleStart: {
            funcName: "gpii.webdriver.client.QUnitHarness.captureTestResults",
            args:     ["{that}", "moduleStart", "{arguments}.0"]
        },
        moduleDone: {
            funcName: "gpii.webdriver.client.QUnitHarness.captureTestResults",
            args:     ["{that}", "moduleDone", "{arguments}.0"]
        },
        testStart: {
            funcName: "gpii.webdriver.client.QUnitHarness.captureTestResults",
            args:     ["{that}", "testStart", "{arguments}.0"]
        },
        testDone: {
            funcName: "gpii.webdriver.client.QUnitHarness.captureTestResults",
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

gpii.webdriver.client.QUnitHarness.instance = gpii.webdriver.client.QUnitHarness();
