const chromeLauncher = require('lighthouse/chrome-launcher');
const lighthouse = require('lighthouse');
const path = require('path');
const fs = require('fs');

const PROJECT_TEST = process.env.CHROME_PAINT_TEST || 'index';

// https://github.com/GoogleChrome/lighthouse/blob/HEAD/docs/readme.md#using-programmatically
// launch chrome audit
const launchChromeAndRunLighthouse = (url, flags = {}, config = null) => {
    return chromeLauncher.launch().then(chrome => {
        flags.port = chrome.port;
        return lighthouse(url, flags, config).then(results => chrome.kill().then(() => results));
    });
}

const URL = `file:///${path.join(__dirname, PROJECT_TEST, 'index.html')}`;
const OUTPUT_DIRECTORY = path.join(__dirname, '..', 'results');


// write aggregated results into file audit_results.json
const finishTest = (results) => fs.writeFileSync(path.join(OUTPUT_DIRECTORY, 'audit_result.json'), JSON.stringify(results));

// launch chrome performance test on a website
const launchTests = (url, times = 10, resultsMs = []) => new Promise((resolve, reject) => {

    // disable defaults slowing down the device
    const flags = {
        disableNetworkThrottling: true,
        disableCpuThrottling: true,
        disableDeviceEmulation: true
    };

    // test only performance - to run the tests faster
    const config = {
        extends: "lighthouse:default",
        settings: {
            onlyCategories: ["performance"]
        }
    };

    console.log('[TEST] launching chrome session');

    // start the test
    return launchChromeAndRunLighthouse(url, flags, config).then(results => {
        const { audits } = results;
        const paint = audits['first-meaningful-paint'];
        const time = new Date();

        console.log(`[TEST] finished at ${time.toLocaleTimeString()} with the evaluation time ${paint.displayValue}`);

        // save audit result
        fs.writeFileSync(path.join(OUTPUT_DIRECTORY, `audit_${time.getTime()}.json`), JSON.stringify(audits['first-meaningful-paint']));
        return paint;

    }).then(paint => times - 1 > 0 ? launchTests(url, times - 1, [...resultsMs, paint.displayValue]) : finishTest([...resultsMs, paint.displayValue]));
});


launchTests(URL, 100).catch(error => console.log({ error }));