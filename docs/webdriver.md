# `gpii.webdriver`

This component wraps a [WebDriver driver](http://seleniumhq.github.io/selenium/docs/api/javascript/module/selenium-webdriver/lib/webdriver_exports_WebDriver.html).
A driver can be used to control a browser installed on the system.  On startup, a webdriver instance is built.  When the
driver is ready, the `onDriverReady` event is fired.

## Component Options

| Option          | Type       | Description |
| --------------- | ---------- | ----------- |
| `browser`       | `{String}` | A lowercase string identifying which [supported browser](http://seleniumhq.github.io/selenium/docs/api/javascript/module/selenium-webdriver/lib/capabilities_exports_Browser.html) to use.  The `SELENIUM_BROWSER` environment variable will always take precedence over this value. Defaults to "firefox". |

## Component Invokers

# `{that}.actions()`

Retrieves an `actions` instance that can be used to perform one or more actions in the current browser.  This value is
passed as the result of `onActionsComplete`.  Returns a promise that is resolved with the same value.

Typically you will use `{that}.actionsHelper` rather than calling this directly.  If you choose to use this directly,
be aware that you must explicitly call [`perform`](http://seleniumhq.github.io/selenium/docs/api/javascript/module/selenium-webdriver/lib/actions_exports_ActionSequence.html#perform)
to complete your action sequence.

[See the docs for more details](http://seleniumhq.github.io/selenium/docs/api/javascript/module/selenium-webdriver/lib/webdriver_exports_WebDriver.html#actions)

# `{that}.actionsHelper(actionsArray)`

A helper which constructs an entire sequence of actions and executes them in order (including adding the final `perform`
step to indicate that the sequence is complete).  Fires `onActionsHelperComplete` when all actions have been performed.
Returns a promise that is resolved when all actions have been performed.

Each element in `actionsArray` is expected to be keyed by the function name to be executed.  The map values are the
arguments to be passed to the function.  For example:

```
var driver = gpii.webdriver.initSync();
driver.actions([{ sendKeys: [gpii.webdriver.Key.TAB, gpii.webdriver.Key.TAB]}]);
```

The range of supported actions and options can be found in [the WebDriver documentation](http://seleniumhq.github.io/selenium/docs/api/javascript/module/selenium-webdriver/lib/actions_exports_ActionSequence.html).

# `{that}.call(fn, opt_scope, var_args)`

This function is not used or tested in this module, but is exposed for future developers to explore and extend as desired.

[See the docs for more details](http://seleniumhq.github.io/selenium/docs/api/javascript/module/selenium-webdriver/lib/webdriver_exports_WebDriver.html#call)


# `{that}.close()`

Close the current window.

[See the docs for more details](http://seleniumhq.github.io/selenium/docs/api/javascript/module/selenium-webdriver/lib/webdriver_exports_WebDriver.html#close)


# `{that}.executeAsyncScript(script, var_args)`

Execute `script` on the client side with `var_args` arguments.  A final implicit `callback` argument is provided, the
callback must be executed before a result will be returned.  The callback may be called with a return value.

[See the docs for more details](http://seleniumhq.github.io/selenium/docs/api/javascript/module/selenium-webdriver/lib/webdriver_exports_WebDriver.html#executeAsyncScript)


# `{that}.executeScript(script, var_args)`

Execute `script` immediately with `var_args` arguments.

[See the docs for more details](http://seleniumhq.github.io/selenium/docs/api/javascript/module/selenium-webdriver/lib/webdriver_exports_WebDriver.html#executeScript)


# `{that}.findElement(locator)`

Find and return a particular element using `locator`, which is typically defined using `gpii.webdriver.By` (see below).
If there are multiple elements, only the first is returned.  If there are no matching elements, the `onError` event will
be fired.

[See the docs for more details](http://seleniumhq.github.io/selenium/docs/api/javascript/module/selenium-webdriver/lib/webdriver_exports_WebDriver.html#findElement)


# `{that}.findElements(locator)`

Find and return a particular element using `locator`, which is typically defined using `gpii.webdriver.By` (see below).
Returns an array of matching elements, or an empty array if no matching elements are found.

[See the docs for more details](http://seleniumhq.github.io/selenium/docs/api/javascript/module/selenium-webdriver/lib/webdriver_exports_WebDriver.html#findElements)


# `{that}.get(url)`

Instructs the browser to navigate to `url`.  Fires the `onGetComplete` event when the page has finished loading.  Returns
a promise that is resolved once the page has finished loading.

[See the docs for more details](http://seleniumhq.github.io/selenium/docs/api/javascript/module/selenium-webdriver/lib/webdriver_exports_WebDriver.html#get)


# `{that}.getAllWindowHandles()`

This function is not used or tested in this module, but is exposed for future developers to explore and extend as desired.

[See the docs for more details](http://seleniumhq.github.io/selenium/docs/api/javascript/module/selenium-webdriver/lib/webdriver_exports_WebDriver.html#getAllWindowHandles)


# `{that}.getCapabilities()`

This function is not used or tested in this module, but is exposed for future developers to explore and extend as desired.

[See the docs for more details](http://seleniumhq.github.io/selenium/docs/api/javascript/module/selenium-webdriver/lib/webdriver_exports_WebDriver.html#getCapabilities)


# `{that}.getCurrentUrl()`

Retrieve the current effective URL of the browser window.  The event `onGetCurrentUrlComplete` is fired with the value.
Returns a promise that will be resolved with the current URL.

[See the docs for more details](http://seleniumhq.github.io/selenium/docs/api/javascript/module/selenium-webdriver/lib/webdriver_exports_WebDriver.html#getCurrentUrl)


# `{that}.getPageSource()`

Retrieve the current browser window's page source.  The event 'onGetPageSource' is fired with the result of this call.
Returns a promise that will be resolved with the value of the page source.

[See the docs for more details](http://seleniumhq.github.io/selenium/docs/api/javascript/module/selenium-webdriver/lib/webdriver_exports_WebDriver.html#getPageSource)


# `{that}.getSession()`

This function is not used or tested in this module, but is exposed for future developers to explore and extend as desired.

[See the docs for more details](http://seleniumhq.github.io/selenium/docs/api/javascript/module/selenium-webdriver/lib/webdriver_exports_WebDriver.html#getSession)


# `{that}.getTitle()`

Retrieve the current browser window's title.  The event 'onGetTitle' is fired with the result of this call.  Returns a
promise that will be resolved with the value of the page title.

[See the docs for more details](http://seleniumhq.github.io/selenium/docs/api/javascript/module/selenium-webdriver/lib/webdriver_exports_WebDriver.html#getTitle)


# `{that}.getWindowHandle()`

This function is not used or tested in this module, but is exposed for future developers to explore and extend as desired.

[See the docs for more details](http://seleniumhq.github.io/selenium/docs/api/javascript/module/selenium-webdriver/lib/webdriver_exports_WebDriver.html#getWindowHandle)


# `{that}.isElementPresent(locator)`

Confirm whether an element that matches `locator` exists.  `locator` is typically defined using `gpii.webdriver.By`
(see below).  The event `onIsElementPresentComplete` is fired with the result.  Returns a promise that will be resolved
with the result.

[See the docs for more details](http://seleniumhq.github.io/selenium/docs/api/javascript/module/selenium-webdriver/lib/webdriver_exports_WebDriver.html#isElementPresent)


# `{that}.manage()`

This function is not used or tested in this module, but is exposed for future developers to explore and extend as desired.

[See the docs for more details](http://seleniumhq.github.io/selenium/docs/api/javascript/module/selenium-webdriver/lib/webdriver_exports_WebDriver.html#manage)

# `{that}.navigate()`

Retrieves an `navigate` instance that can be used to navigate using the current browser .  This value is
passed as the result of `onNavigateComplete`.  Returns a promise that is resolved with the same value.

Typically you will use `{that}.navigateHelper` rather than calling this directly.

[See the docs for more details](http://seleniumhq.github.io/selenium/docs/api/javascript/module/selenium-webdriver/lib/webdriver_exports_WebDriver.html#navigate)

# `{that}.navigateHelper(fnName, args)`

A convenience helper to make it easier to work with `navigate`.  Instantiates a navigator and then executes its `fnName`
function with `args` arguments.  Fires `onNavigateHelperComplete` when navigation is completed.  Returns a promise that
is resolved when navigation is completed.

See [the WebDriver documentation](http://seleniumhq.github.io/selenium/docs/api/javascript/module/selenium-webdriver/lib/webdriver_exports_Navigation.html)
for details regarding the supported navigation functions and their arguments.

# `{that}.quit()`

Instruct the current browser to quit.  Fires the event `onQuitComplete` once the browser has finished shutting down.
Returns a promise that is resolved when the browser has finished shutting down.

[See the docs for more details](http://seleniumhq.github.io/selenium/docs/api/javascript/module/selenium-webdriver/lib/webdriver_exports_WebDriver.html#quit)


# `{that}.schedule(command, description)`

This function is not used or tested in this module, but is exposed for future developers to explore and extend as desired.

[See the docs for more details](http://seleniumhq.github.io/selenium/docs/api/javascript/module/selenium-webdriver/lib/webdriver_exports_WebDriver.html#schedule)


# `{that}.setFileDetector(detector)`

This function is not used or tested in this module, but is exposed for future developers to explore and extend as desired.

[See the docs for more details](http://seleniumhq.github.io/selenium/docs/api/javascript/module/selenium-webdriver/lib/webdriver_exports_WebDriver.html#setFileDetector)


# `{that}.sleep(ms)`

Instructs the browser to sleep for `ms` milliseconds.  Fires an `onSleepComplete` event once the browser has slept for
the specified time.  Returns a promise that will be resolved once the browser has slept for the specified time.

[See the docs for more details](http://seleniumhq.github.io/selenium/docs/api/javascript/module/selenium-webdriver/lib/webdriver_exports_WebDriver.html#sleep)


# `{that}.switchTo()`

This function is not used or tested in this module, but is exposed for future developers to explore and extend as desired.

[See the docs for more details](http://seleniumhq.github.io/selenium/docs/api/javascript/module/selenium-webdriver/lib/webdriver_exports_WebDriver.html#switchTo)


# `{that}.takeScreenshot()`

Take a screenshot of the current browser window.  The `onTakeScreenshotComplete` event is fired with the results.
Returns a promise that will be resolved with the results once the screenshot has been taken.  The results in this case
are base64 encoded binary data in PNG format.

[See the docs for more details](http://seleniumhq.github.io/selenium/docs/api/javascript/module/selenium-webdriver/lib/webdriver_exports_WebDriver.html#takeScreenshot)


# `{that}.touchActions()`

This function is not used or tested in this module, but is exposed for future developers to explore and extend as desired.

[See the docs for more details](http://seleniumhq.github.io/selenium/docs/api/javascript/module/selenium-webdriver/lib/webdriver_exports_WebDriver.html#touchActions)


# `{that}.wait(condition, opt_timeout, opt_message)`

Instruct the browser to wait until `condition` is true.  `condition` is typically defined using `gpii.webdriver.until`
(see below).  Fires `onWaitComplete` when the condition has been met, or `onError` if the request times out.  Returns
a promise that will be resolved when the condition is true.

// TODO:  Add a test for a timeout and confirm that `onError` is fired.

[See the docs for more details](http://seleniumhq.github.io/selenium/docs/api/javascript/module/selenium-webdriver/lib/webdriver_exports_WebDriver.html#wait)

## Error Handling

In addition to the "wrapped" events mentioned above, this component has a unique event (`onError` that is fired
whenever any of the promises created by a "wrapped" function encounter an error.

# `gpii.webdriver.syncInit`

An alternate version of the grade that is built synchronously, and which does not fire an `onDriverReady` event.  This
is meant for use when promises are preferred over the normal event-driven IoC method.  One advantage of this grade
is that it can be used almost verbatim with examples from the
[WebDriver documentation](http://seleniumhq.github.io/selenium/docs/api/javascript/index.html).  Here's an example of
using the library directly:

```
var webdriver = require('selenium-webdriver'),
    By = require('selenium-webdriver').By,
    until = require('selenium-webdriver').until;

var driver = new webdriver.Builder()
    .forBrowser('firefox')
    .build();

driver.get('http://www.google.com/ncr');
driver.findElement(By.name('q')).sendKeys('webdriver');
driver.findElement(By.name('btnG')).click();
driver.wait(until.titleIs('webdriver - Google Search'), 1000);
driver.quit();
```

Here's the equivalent using this grade:

```
var driver = gpii.webdriver.initSync();

driver.get('http://www.google.com/ncr');
driver.findElement(By.name('q')).sendKeys('webdriver');
driver.findElement(By.name('btnG')).click();
driver.wait(until.titleIs('webdriver - Google Search'), 1000);
driver.quit();
```

Note that although the synchronous version does not fire an event to indicate that it is ready, it does fire all of the
other events inherited from the base grade (see above).

# `gpii.webdriver.By`

The `By` object provided by the webdriver library is available under this global name.  It is used to construct
selectors for use with invokers like `findElement` (see above).

[See the docs for more details](http://seleniumhq.github.io/selenium/docs/api/javascript/module/selenium-webdriver/index_exports_By.html)

# `gpii.webdriver.until`
The `until` object provided by the webdriver library is available under this global name.  It is used to construct
conditions for use with the `wait` invoker (see above).

[See the docs for more details](http://seleniumhq.github.io/selenium/docs/api/javascript/module/selenium-webdriver/lib/until.html)

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