# `gpii.test.webdriver.allBrowsers`

This grade helps you run your tests against a range of browsers by creating a series of browser-specific
[Fluid IoC `testEnvironment`](http://docs.fluidproject.org/infusion/development/IoCTestingFramework.html#how-to-use-the-ioc-testing-framework)
grades from a single "base" `testEnvironment`, and then queuing up each of those using `fluid.test.runTests`.

You will typically use this grade instead of calling `fluid.test.runTests` yourself, as in:

```
gpii.test.webdriver.allBrowsers({ baseTestEnvironment: "gpii.tests.webdriver.executeScript.args.environment" });
```

Note that this grade is only meant for use with grades that extend the built-in [fixtures](./fixtures.md).

## Component options

| Option                    | Type       | Description |
| ------------------------- | ---------- | ----------- |
| `baseTestEnvironment`     | `{String}` | The base testEnvironment that we will extend by adding a browser option.  |
| `defaultPlatformBrowsers` | `{Object}` | The list of browsers for each platform, keyed by the legal string values returned by Node's `os.platform()` function. See below.|

In addition to the `defaultPlatformBrowsers` option above, you can use the `BROWSERS` environment variable to control
which browsers are tested.  That option should be a space or comma-delimited list of browsers, as in the following
example for a unix-like system:

```
export BROWSERS="firefox chrome"
```

If you're working with Windows PowerShell, the syntax is something like:

```
$env:BROWSERS = "ie"
```

Note that you can run the tests for a single browser by setting `BROWSERS` to a single value, as in the previous example.
