/*

    A wrapper around the `selenium-webdriver` package.  See the documentation for details:

    https://github.com/GPII/gpii-webdriver/blob/master/docs/webdriver.md

 */
/* eslint-env node */
"use strict";
var fluid = require("infusion");
var gpii = fluid.registerNamespace("gpii");

var process = require("process");

fluid.registerNamespace("gpii.webdriver");

var webdriver = require("selenium-webdriver");

gpii.webdriver.By           = webdriver.By;
gpii.webdriver.until        = webdriver.until;
gpii.webdriver.Key          = webdriver.Key;
gpii.webdriver.Capabilities = require("selenium-webdriver/lib/capabilities").Capabilities;

/**
 *
 * A function that configures the driver to ensure that asynchronous scripts are given enough time to execute by
 * default.  Also ensures that `onDriverReady` is fired regardless of whether `that.driver` is initialized
 * synchronously or asynchronously.
 *
 * @param that - The component itself.
 *
 */
gpii.webdriver.configureDriver = function (that) {
    that.driver.manage().timeouts().setScriptTimeout(that.options.asyncScriptTimeout).then(that.events.onDriverReady.fire);
};

/**
 *
 * The initialization routine called when the component is created.  This starts the process of building the driver,
 * and ensures that:
 *
 * 1. The driver is configured properly once it's available.
 * 2. The `onDriverReady` event is fired once the driver is available.
 *
 * @param that - The component itself
 *
 */
gpii.webdriver.init = function (that) {
    var browserName = that.options.browser;
    var capabilities = gpii.webdriver.Capabilities[browserName]();
    var browserOptions = (process.env.HEADLESS && that.options.headlessBrowserOptions[browserName]) || that.options.browserOptions[browserName];
    fluid.each(browserOptions, function (value, key) {
        capabilities.set(key, value);
    });

    var builder = new webdriver.Builder().withCapabilities(capabilities);
    that.builderPromise = builder.build();

    that.builderPromise.then(function (result) {
        that.driver = result;
        gpii.webdriver.configureDriver(that);
    })["catch"](that.events.onError.fire);
};

/**
 *
 * A function that passes information to the individual driver functions, and which ensures that:
 *
 * 1. The event `eventName` is fired with the results if execution succeeds.
 * 2. The event `onError` is fired if execution fails.
 * 3. A promise is returned that will be resolved when execution finishes, or rejected on failure.
 *
 * @param that - The component itself.
 * @param fnName {String} - The driver function to execute.
 * @param eventName {String} - The event to fire on successful completion.
 * @param fnArgs {Array} - The arguments (if any) to pass to `fnName`.
 * @returns a Promise that will be resolved when execution is complete, or rejected if there is an error.
 *
 */
gpii.webdriver.execute = function (that, fnName, eventName, fnArgs) {
    var promise = that.driver[fnName].apply(that.driver, fnArgs);
    promise.then(that.events[eventName].fire)["catch"](that.events.onError.fire);
    return promise;
};

/**
 *
 * A helper function to assist in navigating from a single Fluid IoC test sequence step.  See the docs for details.
 *
 * @param that - The component itself
 * @param args {Array} - An array representing a series of function names and arguments.  Each array's first element is a function name. The remaining arguments are passed to the function.
 * @returns a Promise that will be resolved when navigation is complete, or rejected if there is an error.
 *
 */
gpii.webdriver.navigateHelper = function (that, args) {
    var argsArray = fluid.makeArray(args);
    var navFnName = argsArray[0];
    var navFnArgs = argsArray.slice(1);
    var navigate = that.driver.navigate();

    if (navigate[navFnName]) {
        var promise = navigate[navFnName].apply(navigate, navFnArgs);
        promise.then(that.events.onNavigateHelperComplete.fire)["catch"](that.events.onError.fire);
        return promise;
    }
    else {
        var failurePromise = new Promise();
        failurePromise["catch"](that.events.onError.fire);
        failurePromise.reject("Navigation function `" + navFnName + "` does not exist...");
        return failurePromise;
    }
};

/**
 *
 * A helper function to assist in performing a sequence of actions from a single Fluid IoC test sequence step.  See the
 * docs for details.
 *
 * @param that - The component itself
 * @param actions {Object} - An array of action definitions.  Each element is an object with a `functionName` and `args` element.
 * @returns a Promise that will be resolved when the actions are complete, or rejected if there is an error.
 *
 */
gpii.webdriver.actionsHelper = function (that, actionDefs) {
    var actions = that.driver.actions();
    fluid.each(fluid.makeArray(actionDefs), function (actionDef) {
        var actionFnName = actionDef.fn;
        var actionArgs   = actionDef.args;

        if (actions[actionFnName]) {
            actions[actionFnName].apply(actions, actionArgs);
        }
        else {
            var failurePromise = new Promise();
            failurePromise["catch"](that.events.onError.fire);
            failurePromise.reject("Cannot perform unknown action '" + actionFnName + "'...");
            return failurePromise;
        }
    });
    var promise = actions.perform();
    promise.then(that.events.onActionsHelperComplete.fire)["catch"](that.events.onError.fire);
    return promise;
};

/**
 *
 * Dump the webdriver logs that have accumulated since the last dump, optionally filtered by `type`. See
 * http://seleniumhq.github.io/selenium/docs/api/javascript/module/selenium-webdriver/lib/logging_exports_Type.html
 * for the list of valid string values, although apparently only "browser" and "driver" are supported.
 *
 * Note that the WebDriver Logging API is not yet final, and even in limited testing the current functions don't do all
 * that much.  This function is untested, and provided to assist in troubleshooting errors with WebDriver itself.  It
 * is unlikely to help in confirming things like what console log output is generated by your components.
 *
 * See: http://seleniumhq.github.io/selenium/docs/api/javascript/module/selenium-webdriver/lib/logging.html
 *
 * @param that - The Component itself.
 * @param type {String} - The type of log entries to return, i.e. "browser" or "driver".
 */
/* istanbul ignore next */
gpii.webdriver.dumpLogs = function (that, type) {
    type = type || "browser";

    var promise = new Promise();

    that.driver.manage().logs().get(type)
        .then(function (logEntries) {
            var logOutput = "";
            fluid.each(logEntries, function (logEntry) {
                logOutput += new Date(logEntry.timestamp) + " " + logEntry.level + ": " + logEntry.message + "\n";
            });

            promise.resolve(logOutput);
            that.events.onDumpLogsComplete.fire(logOutput);
        })
        ["catch"](that.events.onError.fire);

    return promise;
};

fluid.defaults("gpii.webdriver", {
    gradeNames: ["fluid.component"],
    browser: "firefox", // The driver to use Firefox is available by default on all platforms, hence it is the default.
    async: true,
    asyncScriptTimeout: 10000,
    listeners: {
        "onCreate.init": {
            funcName: "gpii.webdriver.init",
            args:     ["{that}"]
        }
    },
    headlessBrowserOptions: {
        chrome: {
            nativeEvents: true,
            chromeOptions: {
                args: ["disable-gpu", "headless"]
            }
        }
    },
    browserOptions: {
        ie: {
            nativeEvents: false
        },
        firefox: {
            // This flag introduced in geckodriver 0.19 would seem to be intended to help with our "click" woes in FF, but does not seem to.
            // See the release notes for details: https://github.com/mozilla/geckodriver/releases/tag/v0.19.0
            "moz:webdriverClick": true
        },
        chrome: {
            nativeEvents: true
        },
        opera: {
            nativeEvents: false
        }
    },
    events: {
        // Our own unique actions
        onActionsHelperComplete: null,
        onDriverReady: null,
        onDumpLogsComplete: null,
        onError: null,
        onNavigateHelperComplete: null,

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
        // "helpers" to simplify the use of key underlying driver functions
        actionsHelper: {
            funcName: "gpii.webdriver.actionsHelper",
            args:     ["{that}", "{arguments}.0"] // actionArray
        },
        dumpLogs: {
            funcName: "gpii.webdriver.dumpLogs",
            args:     ["{that}", "{arguments}.0"] // type
        },
        navigateHelper: {
            funcName: "gpii.webdriver.navigateHelper",
            args:     ["{that}", "{arguments}"]
        },

        // Invokers to wrap the underlying driver functions
        actions: {
            funcName: "gpii.webdriver.execute",
            args:     ["{that}", "actions", "onActionsComplete", "{arguments}"]
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
            funcName: "gpii.webdriver.execute",
            args:     ["{that}", "navigate", "onNavigateComplete", "{arguments}"]
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
    }
});
