# STREAM

`tail -f test.txt | node filemon.js`

## in debug mode
`tail -f test.txt | node filemon.js --debug`

# How to test

* Run `tail -f test.txt | node filemon.js` in first terminal window
* Run `yarn test` in second terminal window
* Observe output in first terminal window
