# aXe accessibility checks

This package provides functions that allow you to run accessibility checks provided by the
[aXe accessibility engine](https://github.com/dequelabs/axe-core/).

## `gpii.test.webdriver.axe.runAxe(axeOptions)`
* `axeOptions` `{Object}` - Optional configuration options to be passed to aXe.  [See their documentation for supported values](https://github.com/dequelabs/axe-core/blob/master/doc/API.md#api-name-axeconfigure).
* Returns: An `{Object}` representing the results of the accessibility check.

A function to run aXe in a browser and then return the results.  Should be used with `executeAsyncScript` (see examples).
Requires the library to have already been loaded (for example, by using `executeScript` to pass
its source to the browser.

## `gpii.test.webdriver.axe.checkResults(results, shouldHaveFailures)`
* `results` `{Object}` - The raw results returned by `gpii.test.webdriver.axe.runAxe` (see above).
* `shouldHaveFailures` `{Boolean}` - Whether or not to expect failures.  Set to `false` by default.

A function that examines the results of an aXe scan.  If `shouldHaveFailures` is `false` or `undefined`, test failure(s)
will be triggered if there are any violations reported by aXe.

If `shouldHaveFailures` is `true`, a test failure will be triggered if there are no violations reported by aXe.


## Example usage

You might use a test like the following to open the page `http://my.host/good-page.html`, run the checks, and trigger
test failures if there are violations:

```
{
    name: "Run the report against my page...",
    type: "test",
    sequence: [
        {
            func: "{testEnvironment}.webdriver.get",
            args: ["http://my.host/good-page.html"]
        },
        {
            event:    "{testEnvironment}.webdriver.events.onGetComplete",
            listener: "{testEnvironment}.webdriver.executeAsyncScript",
            args:     [gpii.test.webdriver.axe.runAxe]
        },
        {
            event:    "{testEnvironment}.webdriver.events.onExecuteAsyncScriptComplete",
            listener: "gpii.test.webdriver.axe.checkResults",
            args:     ["{arguments}.0"]
        }
    ]
},
```

## Using custom aXe configuration options

There are times when you might want to change the default configuration of aXe.  For example, you might satisfy the
requirement for high enough text/background contrast by "[providing a control with a sufficient contrast ratio that
allows users to switch to a presentation that uses sufficient contrast](https://www.w3.org/TR/WCAG20-TECHS/G174.html)".
One way to do this is by using the
[Fluid UIOptions component](http://docs.fluidproject.org/infusion/development/UserInterfaceOptionsAPI.html)

Since you have satisfied the requirement via other means, you might disable the check using test sequence steps like:

```
{
    name: "Check everything but contrast using aXe...",
    type: "test",
    sequence: [
        {
            func: "{testEnvironment}.webdriver.get",
            args: ["http://my.host/page-with-contrast-controls.html"]
        },
        {
            event:    "{testEnvironment}.webdriver.events.onGetComplete",
            listener: "{testEnvironment}.webdriver.executeAsyncScript",
            args:     [gpii.test.webdriver.axe.runAxe, { rules: [{ id: "color-contrast", enabled: false }]}]
        },
        {
            event:    "{testEnvironment}.webdriver.events.onExecuteAsyncScriptComplete",
            listener: "gpii.test.webdriver.axe.checkResults",
            args:     ["{arguments}.0"]
        }
    ]
},
```

[See the aXe documentation for supported configuration options](https://github.com/dequelabs/axe-core/blob/master/doc/API.md#api-name-axeconfigure).
For the required rule IDs, you can either run the tests once and examine the violations, or look at
[the list of rules in the aXe GitHub repo](https://github.com/dequelabs/axe-core/tree/master/lib/rules).


# Accessibility developer tools checks

This package also provides functions that allow you to run the accessibility checks provided by the
[accessibility developer tools](https://github.com/GoogleChrome/accessibility-developer-tools).

## `gpii.test.webdriver.axs.runAxs(axsOptions)`
* `axsOptions` `{Object}` - Optional configuration options to be passed to the Accessibility Developer Toolkit.  [See their documentation for supported values](https://github.com/GoogleChrome/accessibility-developer-tools#configuring-the-audit).
* Returns: An `{Object}` representing the results of the accessibility check.

A function to run the Accessibility Developer Toolkit checks in a browser and then return the results.  Should be used
with `executeAsyncScript` (see examples). Requires the library to have already been loaded (for example, by using
`executeScript` to pass its source to the browser.


## `gpii.test.webdriver.axs.checkResults(results, shouldHaveFailures)`
* `results` `{Object}` - The raw results returned by `gpii.test.webdriver.axe.runAxs` (see above).
* `shouldHaveFailures` `{Boolean}` - Whether or not to expect failures.  Set to `false` by default.

A function that examines the results of an Accessibility Developer Toolkit scan.  If `shouldHaveFailures` is `false` or
`undefined`, test failure(s) will be triggered if there are any violations reported by the Accessibility Developer
Toolkit.

If `shouldHaveFailures` is `true`, a test failure will be triggered if there are no violations reported by the
Accessibility Developer Toolkit.

## Example Usage

Here's the same basic test we performed with aXe (see above), but using the Accessibility Developer Toolkit instead:

```
{
    name: "Run the accessibility developer tools on a good page...",
    type: "test",
    sequence: [
        {
            func: "{testEnvironment}.webdriver.get",
            args: ["@expand:gpii.test.webdriver.resolveFileUrl({that}.options.goodUrl)"]
        },
        {
            event:    "{testEnvironment}.webdriver.events.onGetComplete",
            listener: "{testEnvironment}.webdriver.executeScript",
            args:     [gpii.test.webdriver.axs.runAxs]
        },
        {
            event:    "{testEnvironment}.webdriver.events.onExecuteScriptComplete",
            listener: "gpii.test.webdriver.axs.checkResults",
            args:     ["{arguments}.0"]
        }
    ]
},
```

## Using custom configurations

Let's use the same example we used with aXe above, disabling just the contrast checks.  To do this with the
Accessibility Developer Toolkit, you might use test sequence steps like:

```
{
    name: "Check everything but contrast using the Accessibility Developer Toolkit...",
    type: "test",
    sequence: [
        {
            func: "{testEnvironment}.webdriver.get",
            args: ["@expand:gpii.test.webdriver.resolveFileUrl({that}.options.badUrl)"]
        },
        {
            event:    "{testEnvironment}.webdriver.events.onGetComplete",
            listener: "{testEnvironment}.webdriver.executeScript",
            args:     [gpii.test.webdriver.axs.runAxs, { auditRulesToIgnore: ["lowContrastElements"]}]
        },
        {
            event:    "{testEnvironment}.webdriver.events.onExecuteScriptComplete",
            listener: "gpii.test.webdriver.axs.checkResults",
            args:     ["{arguments}.0"]
        }
    ]
},
```

[See the Accessibility Developer Toolkit documentation for supported configuration options](https://github.com/GoogleChrome/accessibility-developer-tools#configuring-the-audit).
For the required audit name, you can either run the tests once and examine the violations, or look at
[the list of audits in the Accessibility Developer Toolkit GitHub repo](https://github.com/GoogleChrome/accessibility-developer-tools/tree/master/src/audits).
