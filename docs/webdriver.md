# `gpii.webdriver`

This component wraps a [WebDriver driver](http://seleniumhq.github.io/selenium/docs/api/javascript/module/selenium-webdriver/lib/webdriver_exports_WebDriver.html).
A driver can be used to control a browser installed on the system.  On startup, a webdriver instance is built.  When the
driver is ready, the `onDriverReady` event is fired.

## Component Options

| Option               | Type        | Description |
| -------------------- | ----------- | ----------- |
| `async`              | `{Boolean}` | Whether to initialize the underlying webdriver asynchronously.  Defaults to `true`. See `gpii.webdriver.syncInit` below for details about the implications of setting this to `false`. |
| `asyncScriptTimeout` | `{Integer}` | The number of milliseconds to wait before timing out calls to `executeAsyncScript` (see below).  Defaults to `10000` (10 seconds). |
| `browser`            | `{String}`  | A lowercase string identifying which [supported browser](http://seleniumhq.github.io/selenium/docs/api/javascript/module/selenium-webdriver/lib/capabilities_exports_Browser.html) to use.  The `SELENIUM_BROWSER` environment variable will always take precedence over this value. Defaults to `"firefox"`. |
| `logOnQuit`          | `{Boolean}` | Whether to dump the webdriver log output to console.log when the browser is quit. Defaults to `false`. |

## Component Invokers

# `{that}.actions()`

Retrieves an `actions` instance that can be used to perform one or more actions in the current browser.  This value is
passed as the result of `onActionsComplete`.  Returns a promise that is resolved with the same value.

Typically you will use `{that}.actionsHelper` (see below) rather than calling this directly.  If you choose to use this directly,
be aware that you must explicitly call [`perform`](http://seleniumhq.github.io/selenium/docs/api/javascript/module/selenium-webdriver/lib/actions_exports_ActionSequence.html#perform)
to complete your action sequence.

View the WebDriver API documentation for more [details on the underlying `actions` function.](http://seleniumhq.github.io/selenium/docs/api/javascript/module/selenium-webdriver/lib/webdriver_exports_WebDriver.html#actions)

# `{that}.actionsHelper(actionsArray)`

A helper which constructs an entire sequence of actions and executes them in order (including adding the final `perform`
step to indicate that the sequence is complete).  Fires `onActionsHelperComplete` when all actions have been performed.
Returns a promise that is resolved when all actions have been performed.

Each element in `actionsArray` is expected to be keyed by the function name to be executed.  The map values are the
arguments to be passed to the function.  For example:

```
var driver = gpii.webdriver.syncInit();
driver.actions([{ sendKeys: [gpii.webdriver.Key.TAB, gpii.webdriver.Key.TAB]}]);
```

The range of supported actions and options can be found in [the WebDriver documentation](http://seleniumhq.github.io/selenium/docs/api/javascript/module/selenium-webdriver/lib/actions_exports_ActionSequence.html).

# `{that}.call(fn, opt_scope, var_args)`

This function is not used or tested in this module, but is exposed for future developers to explore and extend as desired.

View the WebDriver API documentation for more [details on the underlying `call` function.](http://seleniumhq.github.io/selenium/docs/api/javascript/module/selenium-webdriver/lib/webdriver_exports_WebDriver.html#call)


# `{that}.close()`

Close the current window.

View the WebDriver API documentation for more [details on the underlying `close` function.](http://seleniumhq.github.io/selenium/docs/api/javascript/module/selenium-webdriver/lib/webdriver_exports_WebDriver.html#close)

# `{that}.dumpLogs(type)`

Dump all WebDriver logs that have accumulated since the last call to this function.  The required `type` variable
filters the results by [type](http://seleniumhq.github.io/selenium/docs/api/javascript/module/selenium-webdriver/lib/logging_exports_Type.html).
Based on informal testing, it appears that only "browser" and "driver" are supported by the underlying function.

# `{that}.executeAsyncScript(script, var_args)`

Execute `script` on the client side with `var_args` arguments.  A final implicit `callback` argument is provided, the
callback must be executed before a result will be returned.  Fires the `onExecuteAsyncScript` event when the script has
finished executing.  Returns a promise that is resolved once the supplied callback is called.  The results will contain
the return value passed to the callback.

View the WebDriver API documentation for more [details on the underlying `executeAsyncScript` function.](http://seleniumhq.github.io/selenium/docs/api/javascript/module/selenium-webdriver/lib/webdriver_exports_WebDriver.html#executeAsyncScript)


# `{that}.executeScript(script, var_args)`

Execute `script` immediately with `var_args` arguments.  Fires the `onExecuteScript` event when the script has
finished executing.  Returns a promise that is resolved once the script is executed.  The results will contain the
return value of `script`.

View the WebDriver API documentation for more [details on the underlying `executeScript` function.](http://seleniumhq.github.io/selenium/docs/api/javascript/module/selenium-webdriver/lib/webdriver_exports_WebDriver.html#executeScript)


# `{that}.findElement(locator)`

Find and return a particular element using `locator`, which is typically defined using `gpii.webdriver.By` (see below).

Fires the `onFindElement` event when the search is complete.  Returns a promise that is resolved once the search is
complete.  If an element is found, the element itself will be the result.  If there are multiple elements, the result
will be the first matching element.  If there are no matching elements, the `onError` event will be fired.

View the WebDriver API documentation for more [details on the underlying `findElement` function.](http://seleniumhq.github.io/selenium/docs/api/javascript/module/selenium-webdriver/lib/webdriver_exports_WebDriver.html#findElement)


# `{that}.findElements(locator)`

Find and return a particular element using `locator`, which is typically defined using `gpii.webdriver.By` (see below).

Fires the `onFindElements` event when the search is complete.  Returns a promise that is resolved once the search is
complete.  The results contain an array of matching elements, or an empty array if no matching elements are found.

View the WebDriver API documentation for more [details on the underlying `findElements` function.](http://seleniumhq.github.io/selenium/docs/api/javascript/module/selenium-webdriver/lib/webdriver_exports_WebDriver.html#findElements)


# `{that}.get(url)`

Instructs the browser to navigate to `url`.  Fires the `onGetComplete` event when the page has finished loading.  Returns
a promise that is resolved once the page has finished loading.

View the WebDriver API documentation for more [details on the underlying `get` function.](http://seleniumhq.github.io/selenium/docs/api/javascript/module/selenium-webdriver/lib/webdriver_exports_WebDriver.html#get)


# `{that}.getAllWindowHandles()`

This function is not used or tested in this module, but is exposed for future developers to explore and extend as desired.

View the WebDriver API documentation for more [details on the underlying `getAllWindowHandles` function.](http://seleniumhq.github.io/selenium/docs/api/javascript/module/selenium-webdriver/lib/webdriver_exports_WebDriver.html#getAllWindowHandles)


# `{that}.getCapabilities()`

This function is not used or tested in this module, but is exposed for future developers to explore and extend as desired.

View the WebDriver API documentation for more [details on the underlying `getCapabilities` function.](http://seleniumhq.github.io/selenium/docs/api/javascript/module/selenium-webdriver/lib/webdriver_exports_WebDriver.html#getCapabilities)


# `{that}.getCurrentUrl()`

Retrieve the current effective URL of the browser window.  The event `onGetCurrentUrlComplete` is fired with the value.
Returns a promise that will be resolved with the current URL.

View the WebDriver API documentation for more [details on the underlying `getCurrentUrl` function.](http://seleniumhq.github.io/selenium/docs/api/javascript/module/selenium-webdriver/lib/webdriver_exports_WebDriver.html#getCurrentUrl)


# `{that}.getPageSource()`

Retrieve the current browser window's page source.  The event 'onGetPageSource' is fired with the result of this call.
Returns a promise that will be resolved with the value of the page source.

View the WebDriver API documentation for more [details on the underlying `getPageSource` function.](http://seleniumhq.github.io/selenium/docs/api/javascript/module/selenium-webdriver/lib/webdriver_exports_WebDriver.html#getPageSource)


# `{that}.getSession()`

This function is not used or tested in this module, but is exposed for future developers to explore and extend as desired.

View the WebDriver API documentation for more [details on the underlying `getSession` function.](http://seleniumhq.github.io/selenium/docs/api/javascript/module/selenium-webdriver/lib/webdriver_exports_WebDriver.html#getSession)


# `{that}.getTitle()`

Retrieve the current browser window's title.  The event 'onGetTitle' is fired with the result of this call.  Returns a
promise that will be resolved with the value of the page title.

View the WebDriver API documentation for more [details on the underlying `getTitle` function.](http://seleniumhq.github.io/selenium/docs/api/javascript/module/selenium-webdriver/lib/webdriver_exports_WebDriver.html#getTitle)


# `{that}.getWindowHandle()`

This function is not used or tested in this module, but is exposed for future developers to explore and extend as desired.

View the WebDriver API documentation for more [details on the underlying `getWindowHandle` function.](http://seleniumhq.github.io/selenium/docs/api/javascript/module/selenium-webdriver/lib/webdriver_exports_WebDriver.html#getWindowHandle)


# `{that}.isElementPresent(locator)`

Confirm whether an element that matches `locator` exists.  `locator` is typically defined using `gpii.webdriver.By`
(see below).  The event `onIsElementPresentComplete` is fired with the result.  Returns a promise that will be resolved
with the result.

View the WebDriver API documentation for more [details on the underlying `isElementPresent` function.](http://seleniumhq.github.io/selenium/docs/api/javascript/module/selenium-webdriver/lib/webdriver_exports_WebDriver.html#isElementPresent)


# `{that}.manage()`

This function is not used or tested in this module, but is exposed for future developers to explore and extend as desired.

View the WebDriver API documentation for more [details on the underlying `manage` function.](http://seleniumhq.github.io/selenium/docs/api/javascript/module/selenium-webdriver/lib/webdriver_exports_WebDriver.html#manage)

# `{that}.navigate()`

Retrieves an `navigate` instance that can be used to navigate using the current browser .  This value is
passed as the result of `onNavigateComplete`.  Returns a promise that is resolved with the same value.

Typically you will use `{that}.navigateHelper` rather than calling this directly.

View the WebDriver API documentation for more [details on the underlying `navigate` function.](http://seleniumhq.github.io/selenium/docs/api/javascript/module/selenium-webdriver/lib/webdriver_exports_WebDriver.html#navigate)

# `{that}.navigateHelper(fnName, args)`

A convenience helper to make it easier to work with `navigate`.  Instantiates a navigator and then executes its `fnName`
function with `args` arguments.  Fires `onNavigateHelperComplete` when navigation is completed.  Returns a promise that
is resolved when navigation is completed.

See the WebDriver API documentation for [details regarding the supported navigation functions and their arguments](http://seleniumhq.github.io/selenium/docs/api/javascript/module/selenium-webdriver/lib/webdriver_exports_Navigation.html).

# `{that}.quit()`

Instruct the current browser to quit.  Fires the event `onQuitComplete` once the browser has finished shutting down.
Returns a promise that is resolved when the browser has finished shutting down.

View the WebDriver API documentation for more [details on the underlying `quit` function.](http://seleniumhq.github.io/selenium/docs/api/javascript/module/selenium-webdriver/lib/webdriver_exports_WebDriver.html#quit)


# `{that}.schedule(command, description)`

This function is not used or tested in this module, but is exposed for future developers to explore and extend as desired.

View the WebDriver API documentation for more [details on the underlying `schedule` function.](http://seleniumhq.github.io/selenium/docs/api/javascript/module/selenium-webdriver/lib/webdriver_exports_WebDriver.html#schedule)


# `{that}.setFileDetector(detector)`

This function is not used or tested in this module, but is exposed for future developers to explore and extend as desired.

View the WebDriver API documentation for more [details on the underlying `setFileDetector` function.](http://seleniumhq.github.io/selenium/docs/api/javascript/module/selenium-webdriver/lib/webdriver_exports_WebDriver.html#setFileDetector)


# `{that}.sleep(ms)`

Instructs the browser to sleep for `ms` milliseconds.  Fires an `onSleepComplete` event once the browser has slept for
the specified time.  Returns a promise that will be resolved once the browser has slept for the specified time.

View the WebDriver API documentation for more [details on the underlying `sleep` function.](http://seleniumhq.github.io/selenium/docs/api/javascript/module/selenium-webdriver/lib/webdriver_exports_WebDriver.html#sleep)


# `{that}.switchTo()`

This function is not used or tested in this module, but is exposed for future developers to explore and extend as desired.

View the WebDriver API documentation for more [details on the underlying `switchTo` function.](http://seleniumhq.github.io/selenium/docs/api/javascript/module/selenium-webdriver/lib/webdriver_exports_WebDriver.html#switchTo)


# `{that}.takeScreenshot()`

Take a screenshot of the current browser window.  The `onTakeScreenshotComplete` event is fired with the results.
Returns a promise that will be resolved with the results once the screenshot has been taken.  The results in this case
are base64 encoded binary data in PNG format.

View the WebDriver API documentation for more [details on the underlying `takeScreenshot` function.](http://seleniumhq.github.io/selenium/docs/api/javascript/module/selenium-webdriver/lib/webdriver_exports_WebDriver.html#takeScreenshot)


# `{that}.touchActions()`

This function is not used or tested in this module, but is exposed for future developers to explore and extend as desired.

View the WebDriver API documentation for more [details on the underlying `touchActions` function.](http://seleniumhq.github.io/selenium/docs/api/javascript/module/selenium-webdriver/lib/webdriver_exports_WebDriver.html#touchActions)


# `{that}.wait(condition, opt_timeout, opt_message)`

Instruct the browser to wait until `condition` is true.  `condition` is typically defined using `gpii.webdriver.until`
(see below).  Fires `onWaitComplete` when the condition has been met, or `onError` if the request times out.  Returns
a promise that will be resolved when the condition is true.  The optional `opt_timeout` parameter represents the number
of milliseconds to wait for `condition` before timing out.  The optional `opt_message` parameter is a custom message
that will be used when rejecting the promise.  This message will appear near the beginning of the `message` element of
[a Javascript `Error`](https://developer.mozilla.org/nl/docs/Web/JavaScript/Reference/Global_Objects/Error).

Note that Javascript `Error` objects cannot be serialized properly using `JSON.stringify`.  To see the error details,
you'll need to either inspect individual elements (such as `message`), or to call the Error object's `toString` method.
Here are sample sequence steps with a comment regarding the probably value.

```
{
    func: "{testEnvironment}.webdriver.wait",
    args: [gpii.webdriver.until.alertIsPresent(), 500, "Custom message."]
},
{
    listener: "console.log",
    args: ["{arguments}.message"
}
/*

    Outputs something like:

    Error: Custom message.
    Wait timed out after 2264ms

*/
```

Note that the leading text "Error: " and the trailing details are not configurable, and will always appear in the message.

View the WebDriver API documentation for more [details on the underlying `wait` function.](http://seleniumhq.github.io/selenium/docs/api/javascript/module/selenium-webdriver/lib/webdriver_exports_WebDriver.html#wait)

## Error Handling

In addition to the "wrapped" events mentioned above, this component has a unique event (`onError` that is fired
whenever any of the promises created by a "wrapped" function encounter an error.

# `gpii.webdriver.syncInit`

An alternate version of the grade that is built synchronously, and which is meant for use when promises are preferred
over the event-driven IoC method.  The key distinction is that the driver can start queueing future requests
immediately rather than having to wait for the driver to finish starting up.

As a result, this grade can be used almost verbatim with examples from the
[WebDriver documentation](http://seleniumhq.github.io/selenium/docs/api/javascript/index.html).  Here's an example taken
from the WebDriver API that demonstrates using the library directly:

```
var webdriver = require("selenium-webdriver"),
    By = require("selenium-webdriver").By,
    until = require("selenium-webdriver").until;

var driver = new webdriver.Builder()
    .forBrowser("firefox")
    .build();

driver.get("http://www.google.com/ncr");
driver.findElement(By.name("q")).sendKeys("webdriver");
driver.findElement(By.name("btnG")).click();
driver.wait(until.titleIs("webdriver - Google Search"), 1000);
driver.quit();
```

Here's the same example using the `gpii.webdriver.syncInit` grade:

```
var driver = gpii.webdriver.syncInit({ browser: "firefox"});

driver.get("http://www.google.com/ncr");
driver.findElement(gpii.webdriver.By.name("q")).sendKeys("webdriver");
driver.findElement(gpii.webdriver.By.name("btnG")).click();
driver.wait(gpii.webdriver.until.titleIs("webdriver - Google Search"), 1000);
driver.quit();
```

This grade fires all of the normal events, so you can use it in IoC tests (although there is no benefit to doing so).

# `gpii.webdriver.By`

The `By` object provided by the webdriver library is available under this global name.  It is used to construct
selectors for use with invokers like `findElement` (see above).

View the WebDriver API documentation for more [details on the `By` object.](http://seleniumhq.github.io/selenium/docs/api/javascript/module/selenium-webdriver/index_exports_By.html)

# `gpii.webdriver.until`
The `until` object provided by the webdriver library is available under this global name.  It is used to construct
conditions for use with the `wait` invoker (see above).

View the WebDriver API documentation for more [details on the `until` object.](http://seleniumhq.github.io/selenium/docs/api/javascript/module/selenium-webdriver/lib/until.html)

# Key environment variables used by these grades

The underlying WebDriver driver allows you to override two key pieces of information using environment variables:

1. The browser to be used.
2. The external Selenium server to be used (if any).

By default, this grade uses Firefox to run tests (as the driver required is included with our runner).  You can change
this by passing `options.browser` in your component options (see below), or you can set the `SELENIUM_BROWSER`
environment variable to one of [the supported browsers](http://seleniumhq.github.io/selenium/docs/api/javascript/module/selenium-webdriver/lib/capabilities_exports_Browser.html)
(in lowercase form).  Note that this option is not compatible with the use of the [multi-browser harness](allBrowsers.md),
if you are using that, you should use the `BROWSERS` option instead.

By default, this package will work without a Selenium instance.  If you have your own Selenium server, you can use it
by setting the `SELENIUM_REMOTE_URL` environment variable to the URL of your server.

# 404 and other errors

The WebDriver API [does not provide any mechanism to trap HTTP response codes or errors[(https://github.com/seleniumhq/selenium-google-code-issue-archive/issues/141),
for example that result when trying to open a page that doesn't exist.  However, it also does not interfere with the
browser's continued operation following an error.  So, you can (for example) confirm that your site provides an
error message when a page isn't found, but you couldn't confirm that it sends the correct status code.