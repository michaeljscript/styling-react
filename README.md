# The performance of styled React components
Performance tests of some styling packages for React.

You can read about the perofrmance tests at http://@todo/.

The following libraries were tested: styled-components, glamorous, radium and css, sass and inline styles.

## Awailable scripts
In the main directory you can run following scripts. Make sure you run `npm install` after cloning this repository.

### `npm run build`
To create a production builds for app testing packages.


### `npm run test:paint -- --library=*library_name*`

To test the First meaningful paint with chrome and lighthouse.

Instead of _\*library_name\*_ you can write any of: _css, sass, inline, styled-components, glamorous and radium_
to start the test.

You can also use an option `--repeat-times=50` to run the tests 50 times. By default the test will run 100 times and it may take a long time.

If you are receiving error `ERR_FILE_NOT_FOUND` make sure you have created your builds and not misspeled the library name.

When the test finishes you can see the results in the directory `./results`.

## React scripting time test
 - Measures the time between `componentWillMount` and `componentDidMount`


To run this test you need to create the build, `npm run build` and open index.html file from the `./src/*package*` directory.
Add "?measure\_render\_time" into the url to start the test.

A copy button will appear after the test finishes.

You can also use parameter table\_size and repeat\_times.

Example: ?table\_size=5&repeat\_times=5&measure\_render\_time
