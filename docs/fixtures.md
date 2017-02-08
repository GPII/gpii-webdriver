# `gpii.test.webdriver.caseHolder`

This caseHolder does three key things:

1. It tells the test environment to create a driver, and waits for the driver to be ready before starting the tests.
2. It automatically prepends the current browser to the `name` of each test module and test sequence.
3. It tells the test environment to clean up the driver after each test sequence is complete.

Note that the wiring that creates and cleans up the driver assumes that your caseholder will be loaded from an
instance of `gpii.test.webdriver.testEnvironment` (see below).

## Component Options

| Option          | Type     | Description |
| --------------- | -------- | ----------- |
| `browser`       | `{String}` | A [browser supported by the WebDriver API](http://seleniumhq.github.io/selenium/docs/api/javascript/module/selenium-webdriver/lib/capabilities_exports_Browser.html), in lower case.|
| `sequenceStart` | `Object`   | A series of test sequence steps to execute at the beginning of each test sequence. |
| `sequenceEnd`   | `Object`   | A series of test sequence steps to execute at the end of each test sequence. |
| `rawModules`    | `Object`   | The raw test modules to "evolve" as outlined above. |


# `gpii.test.webdriver.testEnvironment`

A Fluid IoC test environment that creates a webdriver instance when its `constructFixtures` event is fired.  Provides
all of the required events and listeners to work with a `gpii.test.webdriver.caseHolder` instance (see above).