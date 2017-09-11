# styling-react
Performance test of some styling packages for react.

You can read about the perofrmance issues of the styling libraries at http://@todo/.
All tests on this page have been made on chrome (v 60)

## awailable scripts
in the main directory you can run

### `npm run build`
to create a production builds for app testing packages


### `npm run test:chrome -- --library=*library_name*`
instead of _\*library_name\*_ you can write any of: _css, sass, inline, styled-components, glamorous and radium_
to start a first meaningful paint test using chrome and lighthouse.
This test will run 100 times and may take a long time.

You can also use an option `--repeat-times=50` to run the tests 50 times. By default the test will run 100 times.

## render tests
To test render time of the packages you need to create the build,
`npm run build` and open index.html file from the `src/*package*` directory. Add "?measure\_render\_time" into the url to start the test. A copy button will appear after the test finishes. 

You can also use parameter table\_size and repeat\_times.
Example: ?table\_size=5&repeat\_times=5&measure\_render\_time