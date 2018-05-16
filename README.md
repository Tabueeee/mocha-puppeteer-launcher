# mocha-puppeteer-launcher
[![Build Status](https://travis-ci.org/Tabueeee/mocha-puppeteer-launcher.svg?branch=master)](https://travis-ci.org/Tabueeee/mocha-puppeteer-launcher)
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
````             
It's also possible to require the register script directly when calling mocha.

````bash
mocha --require mocha-puppeteer-launcher/register my/test/path/*.spec.js
````    
The register script will start puppeteer, expose a newPage function to the global scope and create a global
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
launch on your local machine, you may need to increase the global before test timeout by calling mocha with 
`--timeout timeoutInMs` option. 


the following global constants are exposed by the register script:

- newPage(emulateOptions?) for details refer to API browserLauncher.newPage
- closeBrowser(keepAlive?) for details refer to API browserLauncher.closeBrowser
- mplConfig: MplConfig for details refer to Config below

## Configuring mocha-puppeteer-launcher

to configure mocha-puppeteer-launcher, create a `mplconfig.json` file with the following properties:

- browserOptions: options for puppeteer's launch call [launch options](https://github.com/GoogleChrome/puppeteer/blob/master/docs/api.md#puppeteerlaunchoptions).
- autoClose: disables the register script from closing the browser with mocha's after hook.
- keepAlive: delay closing the browser for x ms, after tests execution is finished.

a different config file can be loaded by passing the path to the test-call with `--mplconfig path`.

````bash
mocha --require mocha-puppeteer-launcher/register my/test/path/*.spec.js --mplconfig ./settings.json
````    

Without a configuration file or missing properties the following default configuration will be used:
````json
{
  "browserOptions": {
    "headless": true,
    "ignoreHTTPSErrors": true,
    "timeout": 30000
  },
  "autoClose": true,
  "keepAlive": 0
}
````    
Note
> If `keepAlive` causes mocha to run into a timeout, try calling mocha with `--timeout x` option; with x >= the keepAlive ms specified. 

## Alternate API-Usage before After Hooks                    
mocha-puppeteer-launcher can also be used without exposing constants to the global namespace by using
the exported browseLauncher.

````js
const mpl = require('mocha-puppeteer-launcher');

// global scope of any included test file

before(async () => {
    await mpl.browserLauncher.start(config); // config uses the format specified above
});

after(async () => {
    await mpl.browserLauncher.closeBrowser(5000); // closes browser after 5 seconds delay 
});
````

in test file:
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

#### newPage(emulateOptions?)
- `emulateOptions`: <\EmulateOptions> for details refer to [puppeteer API](https://github.com/GoogleChrome/puppeteer/blob/master/docs/api.md#pageemulateoptions)
- returns: Promise\<Page>

creates a new Page and sets Viewport and UserAgent if the option object was passed to the call. 
 
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
