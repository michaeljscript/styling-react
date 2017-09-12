'use strict';

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var chromeLauncher = require('lighthouse/chrome-launcher');
var lighthouse = require('lighthouse');
var path = require('path');
var fs = require('fs');

var argv = require('yargs').argv;

// arguments from console
var REPEAT_TIMES = argv['repeat-times'] || 100; // the amount of times the test will be repeated
var LIBRARY = argv['library']; // name of the library

// custom log messages
var log = function log() {
    var _console;

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
    }

    return (_console = console).log.apply(_console, ['[TEST]'].concat(args));
};

// make sure library name is passed
if (!LIBRARY) {
    log('You need to pass argument library to test a specific library.\n    Example: npm run test:paint -- --library=glamorous\n    Other libraries you can test: css, glamorous, inline, radium, sass, styled-components');
    process.exit(0);
}

// test start time - replaced forbidden characters
var startTimeStr = new Date().toLocaleString().replace(/:/g, '-');

// will launch chrome at this url
var URL = 'file:///' + path.join(__dirname, LIBRARY, 'index.html');

// results will be written here
var OUTPUT_DIRECTORY = path.join(__dirname, '..', 'results');
var RESULT_FILE = path.join(OUTPUT_DIRECTORY, 'audit_' + LIBRARY + '_' + startTimeStr + '_result.json');

// launch chrome performance test on a website
var launchTests = function () {
    var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee() {
        var _ref2 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
            url = _ref2.url,
            _ref2$times = _ref2.times,
            times = _ref2$times === undefined ? 10 : _ref2$times,
            _ref2$outputFile = _ref2.outputFile,
            outputFile = _ref2$outputFile === undefined ? './results.json' : _ref2$outputFile;

        var chrome, flags, config, results, i, result, audits, paint, time;
        return _regenerator2.default.wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:

                        log('launching chrome instance');
                        _context.next = 3;
                        return chromeLauncher.launch();

                    case 3:
                        chrome = _context.sent;


                        // disable defaults slowing down the device
                        flags = {
                            disableNetworkThrottling: true,
                            disableCpuThrottling: true,
                            disableDeviceEmulation: true,
                            port: chrome.port
                        };

                        // test only performance - to run the tests faster

                        config = {
                            extends: "lighthouse:default",
                            settings: {
                                onlyCategories: ["performance"]
                            }
                        };
                        results = [];
                        i = 0;

                    case 8:
                        if (!(i < times)) {
                            _context.next = 20;
                            break;
                        }

                        _context.next = 11;
                        return lighthouse(url, flags, config);

                    case 11:
                        result = _context.sent;
                        audits = result.audits;
                        paint = audits['first-meaningful-paint'];
                        time = new Date();


                        log(i + 1 + ' / ' + times + ' | finished at ' + time.toLocaleTimeString() + ' with the evaluation time ' + paint.displayValue);
                        results.push(paint.displayValue);

                    case 17:
                        i++;
                        _context.next = 8;
                        break;

                    case 20:

                        log('finished - writing results');

                        fs.writeFileSync(outputFile, (0, _stringify2.default)(results));
                        log('Results can be found here ' + outputFile);

                        log('killing chrome instance');
                        _context.next = 26;
                        return chrome.kill();

                    case 26:

                        log('done');

                    case 27:
                    case 'end':
                        return _context.stop();
                }
            }
        }, _callee, undefined);
    }));

    return function launchTests() {
        return _ref.apply(this, arguments);
    };
}();

launchTests({
    url: URL,
    times: REPEAT_TIMES,
    outputFile: RESULT_FILE
}).catch(function (error) {
    return log('ERROR', error);
});
