# `gpii.webdriver`

This component wraps a [WebDriver driver](http://seleniumhq.github.io/selenium/docs/api/javascript/module/selenium-webdriver/lib/webdriver_exports_WebDriver.html).
A driver can be used to control a browser installed on the system.


// TODO:  Document that SELENIUM_REMOTE_URL can be used to use a remote selenium.

## 404 and other errors

The WebDriver API [does not provide any mechanism to trap HTTP response codes or errors[(https://github.com/seleniumhq/selenium-google-code-issue-archive/issues/141),
for example that result when trying to open a page that doesn't exist.  However, it also does not interfere with the
browser's continued operation following an error.  So, you can (for example) confirm that your site provides an
error message when a page isn't found, but you couldn't confirm that it sends the correct status code.