# `gpii.test.webdriver.allBrowsers`

This grade helps you run your tests against a range of browsers.  The defaults are designed for use with
[Fluid IoC tests](http://docs.fluidproject.org/infusion/development/IoCTestingFramework.html#how-to-use-the-ioc-testing-framework).
By default, a new test environment is generated for each browser, and then queued up using `fluid.test.runTests`.

## Component options

| Option                    | Type       | Description |
| ------------------------- | ---------- | ----------- |
| `baseTestEnvironment`     | `{String}` | The base testEnvironment that we will extend and configure to use a particular browser. |
| `browsers`                | `{Array}`  | The list of browsers to run the tests against (see below for the order of precedence). |

## Component Invokers

### `{that}.runTestsInSingleBrowser(browser)`

An invoker which runs the tests in a single `browser`.  By default, this generates a test environment for each browser,
based on `baseTestEnvironment` (see above), and then runs the tests using `fluid.tests.runTests`.  See below for details
on using this grade with non-IoC tests.

## Configuring the List of Browsers

This grade will run tests against a list of browsers, which is defined based on whichever of the following is found
first:

1. The `BROWSERS` environment variable (see below).
2. `that.options.browsers` (see above)
3. `gpii.test.webdriver.allBrowsers.defaultPlatformBrowsers`, the platform-specific list of "verified working" browsers (see below).

The `BROWSERS` environment variable should be a space or comma-delimited list of browsers, as in the following example
for a unix-like system:

```
export BROWSERS="firefox chrome"
```

If you're working with Windows PowerShell, the syntax is something like:

```
$env:BROWSERS = "chrome"
```

Note that you can run the tests for a single browser by setting `BROWSERS` to a single value, as in the previous example.

## Using this Grade with IoC Tests

To use this grade with IoC tests, you must define a base `testEnvironment`, and then instantiate this grade as in the
following example:

```
fluid.defaults("my.tests.testRunner", {
    gradeNames: ["gpii.test.webdriver.allBrowsers"],
    baseTestEnvironment: "gpii.tests.webdriver.executeScript.args.environment"
});

my.tests.testRunner();
```

## Using this Grade with Non-IoC Tests

If you want to use this grade to run tests that do not use the Fluid IoC test framework, override the
`runTestsInSingleBrowser` invoker (see above) with your own function that runs the tests for a single browser.  See
the "syncInit" and "dumpLogs" tests in this package for examples.

# `gpii.test.webdriver.allBrowsers.defaultPlatformBrowsers`

A static list of the default (confirmed working) browsers, by platform.  Only OS X, Windows, and Linux have any browsers
at all, as the other platforms [are not supported by Selenium itself](http://www.seleniumhq.org/about/platforms.jsp).
The "firefox" and "edge" browsers are not yet confirmed working on Windows.  See the README for details on running
tests with "ie", which works, but cannot currently be run in combination with any other browser.