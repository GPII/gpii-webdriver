# gpii-webdriver

This package provides a series of [Fluid components](http://docs.fluidproject.org/infusion/development/UnderstandingInfusionComponents.html)
to assist in writing tests that use the [WebDriver API](https://www.w3.org/TR/2013/WD-webdriver-20130117/) to control a
real browser and to examine the browser's state.

The main goals of this package are to:

1. Make it possible to test complex keyboard navigation.
2. Make it possible to test browser navigation (moving back and forward in the browser's history, and reloading the page).
3. Provide the ability to write tests that need to be aware of both the server and browser state.
4. Do all of the above across a range of browsers.

# Keyboard Navigation

Many approaches to testing keyboard navigation send individual keystrokes directly to a single named component and
examine the results.  While this does confirm the behavior of the component, it does not provide a good means of testing
navigation between components.  Sending keys directly to a known component also assumes that the component can already
be reached using keyboard navigation.

With this package, you can test sending keys directly to a component, navigation between components, and using keyboard
navigation to focus on an element.  This allows for much more realistic user-focused test scenarios like:

1. Hitting "Tab" once to display a "Skip to Content" control.
2. Hitting "Enter" to skip to the main content.
3. Hitting "Tab" to focus on a search control in the content area.
4. Typing search terms into the search control.
5. Hitting "Enter" to perform a search.

Using this package, the above scenario can be tested even if javascript is completely disabled.

# Browser Navigation

This package provides the ability to change the browser's state in exactly the same manner as would happen if a user hit
the "back", "next", and "refresh" buttons or shortcut keys.  You might use this to:

1. Confirm that the parts of your page that should preserve their state on a refresh actually do so.
2. Confirm that the parts of your page that should reset their state on a refresh actually do so.
3. Confirm that a warning is displayed when a user attempts to refresh or navigate away after entering form data.

# Passing Code between the Server and Browser

This package makes use of the IPC bridge built into WebDriverJS to send code to the browser, have that code be executed,
and to receive the results of the code's execution.  Among many other things, this allows you to:

1. Inspect the current browser DOM.
2. Check the value of a named element.
3. Pass in scripts to be executed in the browser before the tests are run, for example, scripts to report test or code coverage information.

# Running the Tests

To run the tests locally, you will need to [install the drivers for each browser](http://www.seleniumhq.org/download/)
you want to test.  Once you have done this, you can use the command `npm test` to run the tests.

You can also use the command `vagrant up` to provision a linux box and run the Chrome and Firefox tests there.

# Using this Package to Write Your Own Tests

To make use of this package in your own tests, you will typically need to add code like the following:

```
var fluid = require("infusion");
var gpii  = fluid.registerNamespace("gpii");
require("gpii-webdriver");
gpii.webdriver.loadTestingSupport();
```

Note that although the last line is not required to simply use the webdriver itself, you'll need it if you want to use
the caseHolder, testEnvironment or cross-browser test runner including with this package.

# Running Under Windows

# Internet Explorer

There is a known problem with [very slow text input](https://github.com/seleniumhq/selenium-google-code-issue-archive/issues/5116)
when using the 64-bit IEDriverServer.  If you are on a 64-bit Windows machine and seeing extreme
slowness in tests that supply text input, you should:

1. [Download the 32-bit version of IEDriverServer](http://www.seleniumhq.org/download/).
2. Unzip and launch the server.
3. Configure your `SELENIUM_REMOTE_URL` environment variable to point to `http://localhost:5555`
4. Configure your `BROWSERS` environment variable and set it to `ie`

Note that once you do this, the `BROWSERS` and `SELENIUM_BROWSER` variables will no longer be meaningful, and tests will
only run in Internet Explorer.  The fourth step above simply avoids running the IE tests multiple times (once expecting
to run using Chrome, once expecting to run using Internet Explorer, etc.).

# Edge



# More Information

For more information, check out the individual docs for:

* [The driver component](./docs/webdriver.md)
* [The helper functions](./docs/helper-functions.md)
* [The browser-side QUnit harness](./docs/qunit-harness.md)
* [The test fixtures included with this package](./docs/fixtures.md)
* [The multi-browser test runner](./docs/allBrowsers.md)
