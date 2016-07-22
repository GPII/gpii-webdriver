/* eslint-env node */
"use strict";
var fluid = require("infusion");
var gpii = fluid.registerNamespace("gpii");

fluid.registerNamespace("gpii.webdriver");

var webdriver = require("selenium-webdriver");

gpii.webdriver.By    = webdriver.By;
gpii.webdriver.until = webdriver.until;
gpii.webdriver.Key   = webdriver.Key;

gpii.webdriver.init = function (that) {
    that.builderPromise = new webdriver.Builder()
        // .usingServer("http://localhost:4444/wd/hub/")
        .forBrowser(that.options.browser)
        .buildAsync();

    that.builderPromise.then(function (result) {
        that.driver = result;
        that.events.onDriverReady.fire();
    })["catch"](that.events.onError.fire);
};

gpii.webdriver.execute = function (that, fnName, eventName, fnArgs) {
    if (that.driver) {
        var promise = that.driver[fnName].apply(that.driver, fnArgs);
        promise.then(that.events[eventName].fire)["catch"](that.events.onError.fire);
        return promise;
    }
    else {
        fluid.fail("Can't execute function because the driver isn't ready yet...");
    }
};

// TODO:  The shutdown cycle for Windows does not appear to actually "quit" the window at least in IE.  Research.
// TODO:  Add a harness for browser settings and versions
gpii.webdriver.logError = function (error) {
    fluid.log("BROWSER ERROR:", error.name, error.message, error.stack);
};

gpii.webdriver.navigate = function (that, args) {
    var navFnName = args[0];
    var navFnArgs = fluid.makeArray(args).slice(1);
    var navigate = that.driver.navigate();

    if (navigate[navFnName]) {
        var promise = navigate[navFnName].apply(navigate, navFnArgs);
        promise.then(that.events.onNavigateComplete.fire)["catch"](that.events.onError.fire);
        return promise;
    }
    else {
        fluid.fail("Navigation function `" + navFnName + "` does not exist...");
    }
};

// TODO: When we document this, describe the syntax in full and the fact that `perform` is implicit
gpii.webdriver.actions = function (that, actionMap) {
    var actions = that.driver.actions();
    fluid.each(actionMap, function (actionArgs, actionFnName) {
        if (actions[actionFnName]) {
            actions[actionFnName].apply(actions, actionArgs);
        }
        else {
            fluid.fail("Cannot perform unknown action '" + actionFnName + "'...");
        }
    });
    actions.perform().then(that.events.onActionsComplete.fire)["catch"](that.events.onError.fire);
};

fluid.defaults("gpii.webdriver", {
    gradeNames: ["fluid.component"],
    browser: "chrome", // "chrome", "firefox", and "ie" have been tested informally.  You must have the respective drivers installed and in your path.
    events: {
        // Our own unique actions
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
        onTakeScreenshotComplete: null,
        onTouchActionsComplete: null,
        onWaitComplete: null
    },
    invokers: {
        // Invokers to wrap the underlying driver functions
        actions: {
            funcName: "gpii.webdriver.actions",
            args:     ["{that}", "{arguments}.0"] // actionArray
        },
        // TODO:  Test this once we have a use case for it in our own tests.
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
        // TODO:  Test this once we have a use case for it in our own tests.
        getAllWindowHandles: {
            funcName: "gpii.webdriver.execute",
            args:     ["{that}", "getAllWindowHandles", "onGetAllWindowHandlesComplete", "{arguments}"]
        },
        // TODO:  Test this once we have a use case for it in our own tests.
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
        // TODO:  Test this once we have a use case for it in our own tests.
        getWindowHandle: {
            funcName: "gpii.webdriver.execute",
            args:     ["{that}", "getWindowHandle", "onGetWindowHandleComplete", "{arguments}"]
        },
        isElementPresent: {
            funcName: "gpii.webdriver.execute",
            args:     ["{that}", "isElementPresent", "onIsElementPresentComplete", "{arguments}"]
        },
        // TODO:  Test this once we have a use case for it in our own tests.
        manage: {
            funcName: "gpii.webdriver.execute",
            args:     ["{that}", "manage", "onManageComplete", "{arguments}"]
        },
        navigate: {
            funcName: "gpii.webdriver.navigate",
            args:     ["{that}", "{arguments}"]
        },
        quit: {
            funcName: "gpii.webdriver.execute",
            args:     ["{that}", "quit", "onQuitComplete", "{arguments}"]
        },
        // TODO:  Test this once we have a use case for it in our own tests.
        schedule: {
            funcName: "gpii.webdriver.execute",
            args:     ["{that}", "schedule", "onScheduleComplete", "{arguments}"]
        },
        // TODO:  Test this once we have a use case for it in our own tests.
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
        // TODO:  Test this ASAP
        takeScreenshot: {
            funcName: "gpii.webdriver.execute",
            args:     ["{that}", "takeScreenshot", "onTakeScreenshotComplete", "{arguments}"]
        },
        // TODO:  Test this once we have at least one mobile platform available.
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
        "onDriverReady.log": {
            funcName: "fluid.log",
            args: ["Browser started..."]
        }
    }
});

fluid.defaults("gpii.webdriver.debug", {
    gradeNames: ["gpii.webdriver"],
    listeners: {
        "onError.log": {
            funcName: "gpii.webdriver.logError",
            args:     ["{arguments}.0"]
        }
    }
});
