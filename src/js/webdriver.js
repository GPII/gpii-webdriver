/* eslint-env node */
"use strict";
var fluid = require("infusion");
var gpii = fluid.registerNamespace("gpii");

fluid.registerNamespace("gpii.webdriver");

var webdriver = require("selenium-webdriver");

gpii.webdriver.by    = webdriver.By;
gpii.webdriver.until = webdriver.until;

gpii.webdriver.init = function (that) {
    new webdriver.Builder()
        .forBrowser(that.options.browser)
        .usingServer("http://localhost:4444/wd/hub/")
        .buildAsync().then(function (result) {
            that.driver = result;
            that.events.onDriverReady.fire();
        })["catch"](that.events.onError.fire);
};

gpii.webdriver.execute = function (that, fnName, eventName, fnArgs) {
    if (that.driver) {
        that.driver[fnName].apply(that.driver, fnArgs).then(function (result) {
            that.events[eventName].fire(result);
        })["catch"](that.events.onError.fire);
    }
    else {
        fluid.fail("Cannot call function `" + fnName + "` because no driver exists...");
    }
};

fluid.defaults("gpii.webdriver", {
    gradeNames: ["fluid.component"],
    browser: "chrome",
    events: {
        // Actions associated with our own setup and teardown
        onDriverReady: null,
        onError: null,

        // Actions associated with wrapped functions completing their work
        onActionsComplete: null,
        onCallComplete: null,
        onCloseComplete: null,
        onExecuteAsyncScriptComplete: null,
        onExecuteScriptComplete: null,
        onFindElementComplete: null,
        onFindElementsComplete: null,
        onGetComplete: null,
        onGetAllWindowHandlesComplete: null,
        onGetCapabilitiesComplete: null,
        onGetCurrentUrlComplete: null,
        onGetPageSourceComplete: null,
        onGetSessionComplete: null,
        onGetTitleComplete: null,
        onGetWindowHandleComplete: null,
        onIsElementPresentComplete: null,
        onManageComplete: null,
        onNavigateComplete: null,
        onQuitComplete: null,
        onScheduleComplete: null,
        onSetFileDetectorComplete: null,
        onSleepComplete: null,
        onSwitchToComplete: null,
        onScreenshotComplete: null,
        onTouchActionsComplete: null,
        onWaitComplete: null
    },
    invokers: {
        // Invokers to wrap the underlying driver functions
        actions: {
            funcName: "gpii.webdriver.execute",
            args:     ["{that}", "actions", "onActionsComplete", "{arguments}"]
        },
        call: {
            funcName: "gpii.webdriver.execute",
            args:     ["{that}", "call", "onCallComplete", "{arguments}"]
        },
        close: {
            funcName: "gpii.webdriver.execute",
            args:     ["{that}", "close", "onCloseComplete", "{arguments}"]
        },
        executeAsyncScript: {
            funcName: "gpii.webdriver.execute",
            args:     ["{that}", "executeAsyncScript", "onExecuteAsyncScriptComplete", "{arguments}"]
        },
        executeScript: {
            funcName: "gpii.webdriver.execute",
            args:     ["{that}", "executeScript", "onExecuteScriptComplete", "{arguments}"]
        },
        findElement: {
            funcName: "gpii.webdriver.execute",
            args:     ["{that}", "findElement", "onFindElementComplete", "{arguments}"]
        },
        findElements: {
            funcName: "gpii.webdriver.execute",
            args:     ["{that}", "findElements", "onFindElementsComplete", "{arguments}"]
        },
        get: {
            funcName: "gpii.webdriver.execute",
            args:     ["{that}", "get", "onGetComplete", "{arguments}"]
        },
        getAllWindowHandles: {
            funcName: "gpii.webdriver.execute",
            args:     ["{that}", "getAllWindowHandles", "onGetAllWindowHandlesComplete", "{arguments}"]
        },
        getCapabilities: {
            funcName: "gpii.webdriver.execute",
            args:     ["{that}", "getCapabilities", "onGetCapabilitiesComplete", "{arguments}"]
        },
        getCurrentUrl: {
            funcName: "gpii.webdriver.execute",
            args:     ["{that}", "getCurrentUrl", "onGetCurrentUrlComplete", "{arguments}"]
        },
        getPageSource: {
            funcName: "gpii.webdriver.execute",
            args:     ["{that}", "getPageSource", "onGetPageSourceComplete", "{arguments}"]
        },
        getSession: {
            funcName: "gpii.webdriver.execute",
            args:     ["{that}", "getSession", "onGetSessionComplete", "{arguments}"]
        },
        getTitle: {
            funcName: "gpii.webdriver.execute",
            args:     ["{that}", "getTitle", "onGetTitleComplete", "{arguments}"]
        },
        getWindowHandle: {
            funcName: "gpii.webdriver.execute",
            args:     ["{that}", "getWindowHandle", "onGetWindowHandleComplete", "{arguments}"]
        },
        isElementPresent: {
            funcName: "gpii.webdriver.execute",
            args:     ["{that}", "isElementPresent", "onIsElementPresentComplete", "{arguments}"]
        },
        manage: {
            funcName: "gpii.webdriver.execute",
            args:     ["{that}", "manage", "onManageComplete", "{arguments}"]
        },
        navigate: {
            funcName: "gpii.webdriver.execute",
            args:     ["{that}", "navigate", "onNavigateComplete", "{arguments}"]
        },
        quit: {
            funcName: "gpii.webdriver.execute",
            args:     ["{that}", "quit", "onQuitComplete", "{arguments}"]
        },
        schedule: {
            funcName: "gpii.webdriver.execute",
            args:     ["{that}", "schedule", "onScheduleComplete", "{arguments}"]
        },
        setFileDetector: {
            funcName: "gpii.webdriver.execute",
            args:     ["{that}", "setFileDetector", "onSetFileDetectorComplete", "{arguments}"]
        },
        sleep: {
            funcName: "gpii.webdriver.execute",
            args:     ["{that}", "sleep", "onSleepComplete", "{arguments}"]
        },
        switchTo: {
            funcName: "gpii.webdriver.execute",
            args:     ["{that}", "switchTo", "onSwitchToComplete", "{arguments}"]
        },
        takeScreenshot: {
            funcName: "gpii.webdriver.execute",
            args:     ["{that}", "takeScreenshot", "onScreenshotComplete", "{arguments}"]
        },
        touchActions: {
            funcName: "gpii.webdriver.execute",
            args:     ["{that}", "touchActions", "onTouchActionsComplete", "{arguments}"]
        },
        wait: {
            funcName: "gpii.webdriver.execute",
            args:     ["{that}", "wait", "onWaitComplete", "{arguments}"]
        }
    },
    listeners: {
        "onCreate.init": {
            funcName: "gpii.webdriver.init",
            args:     ["{that}"]
        },
        "onError.log": {
            funcName: "fluid.log",
            args:     ["BROWSER ERROR:", "{arguments}.0"]
        },
        "onDriverReady.log": {
            funcName: "fluid.log",
            args: ["Browser started..."]
        },
        "onDestroy.quitDriver": {
            func: "{that}.quit"
        }
    }
});
