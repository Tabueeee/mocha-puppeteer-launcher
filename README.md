# mocha-puppeteer-launcher
[![Build Status](https://travis-ci.org/Tabueeee/mocha-puppeteer-launcher.svg?branch=master)](https://travis-ci.org/Tabueeee/mocha-puppeteer-launcher)
[![Coverage Status](https://coveralls.io/repos/github/Tabueeee/mocha-puppeteer-launcher/badge.svg?branch=master)](https://coveralls.io/github/Tabueeee/mocha-puppeteer-launcher?branch=master)
> write end-to-end tests with mocha and puppeteer without any setup code

## Install
                            
````bash
npm install mocha-puppeteer-launcher --save-dev
````

## Usage

Mocha-puppeteer-launcher can be used simply by importing the register file contained in this module.
Require the script in any or all tests using puppeteer.  

````js
require('mocha-puppeteer-launcher/register');
// or
require('mocha-puppeteer-launcher').register();
````             
It's also possible to require the register script directly when calling mocha.

````bash
mocha --require mocha-puppeteer-launcher/register my/test/path/*.spec.js
````    
The register script will start puppeteer, expose a `newPage` function to the global scope and create a global
mocha after hook to close the browser after test execution automatically.

````js
describe('my-test', function () {
    this.timeout(20000);
    
    it('my-test-case', async () => {
        let page = await newPage({viewport: {height: 1000, width: 1000}});   
        // test code here
    });    
});
````

Note
> to avoid timeouts, remember to call this.timeout() in tests using puppeteer. Depending on the time chrome takes to 
launch on your local machine, you may also need to increase the global before test timeout by calling mocha with 
`--timeout timeoutInMs` option. 


the following global constants are exposed by the register script:

- newPage(emulateOptions?) for details refer to API [browserLauncher.newPage](#newPage)
- closeBrowser(keepAlive?) for details refer to API [browserLauncher.closeBrowser](#closeBrowser)

## Configuring mocha-puppeteer-launcher

Mocha-puppeteer-launcher can be configured by, creating a `mplconfig.json` file with the following properties:

- browserOptions: options for puppeteer's launch call [launch options](https://github.com/GoogleChrome/puppeteer/blob/master/docs/api.md#puppeteerlaunchoptions).
- autoClose: disables the register script from closing the browser with mocha's after hook.
- keepAlive: delay closing the browser for x ms, after tests execution is finished.

Different config files can be loaded by passing the path to the test call with `--mplconfig path`.

````bash
mocha --require mocha-puppeteer-launcher/register my/test/path/*.spec.js --mplconfig ./settings.json
````    

Without a configuration file or missing properties the following default configuration will be used:
````json
{
  "browserOptions": {
    "headless": true,
    "timeout": 30000
  },
  "autoClose": true,
  "keepAlive": 0
}
````    
Note
> If `keepAlive` causes mocha to run into a timeout, try calling mocha with `--timeout x` option; with x >= the keepAlive ms specified. 

## Alternative API-Usage                  
Mocha-puppeteer-launcher can also be used without exposing constants to the global namespace by using
the exported constant `browseLauncher`. It's still possible to use a `mplconfig.json` file when using the browserLauncher directly.
You can access the exported config object with default settings overwritten by any settings specified in `mplconfig.json`. 

````js
const mpl = require('mocha-puppeteer-launcher');

// global scope

before(async () => {
    await mpl.browserLauncher.start(mpl.config); // config uses the format specified above
});

after(async () => {
    await mpl.browserLauncher.closeBrowser(5000); // closes the browser after 5s delay (optional) 
});
````
The global `before` and `after` hooks can be placed in a separate file containing no tests,
 so it's included when calling mocha with different patterns.

The browserLauncher allows you to create new `Page` objects in your test files:
````js
const browserLauncher = require('mocha-puppeteer-launcher').browserLauncher;

it('my-test-case', async () => {
    let page = await browserLauncher.newPage({viewport: {width: 1000, height: 1000}});
    // test code here
});
````
      
## API
### class: BrowserLauncher

#### start(config)
- `config`: MplConfig        
- returns: Promise\<void> When the browser finishes loading, the promise is resolved

starts the browser.

<a name="newPage"></a>
#### newPage(emulateOptions?)
- `emulateOptions`: <\EmulateOptions> for details refer to [puppeteer API](https://github.com/GoogleChrome/puppeteer/blob/master/docs/api.md#pageemulateoptions)
- returns: Promise\<Page>

creates a new Page and sets Viewport and UserAgent if the option object was passed to the call. 

<a name="closeBrowser"></a> 
#### closeBrowser(keepAlive?)
- `keepAlive`: number  optional time in ms        
- returns: Promise\<void>

close the browser. When using register, this function does not need to be called unless autoClose is disabled.
                
#### getPuppeteerLoadedPromise()
- returns: Promise\<void> When the browser finishes loading, the promise is resolved

#### getBrowser()
- returns: Browser getter for created browser instance

## Related
 - [puppeteer](https://github.com/GoogleChrome/puppeteer) - Control chrome in headless mode with puppeteer for automated testing.

## License
MIT
