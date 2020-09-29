# Integrity check

## Use with Node

Use npm to install it:

cd into the root directory of yuor project, where the json.package file is, and do:
```
> npm install integrity-check --save
```
import it into your code

```JavaScript
const Integrity = require('integrity-check')

function myFunc(a) {
    Integrity.checkIsValidNumber(a, "a is not a number, it was {}", a)
}
```

## Use in browser

### How to obtain the integrity-check-X-X-X.js file

You can use npm to fetch the integrity-check module and extract the script from there. Otherwise you can go to github and get the file:

https://github.com/ArtFab/integrity-js/tree/master/browser
(the file will be called integrity-X-X-X.js)

If you use npm, create a folder and do
```
> npm install integrity-check
```
The relevant file can be found in the installed package. Look in 
yourfolder\node_modules\integrity-check\browser\integrity-check-X-X-X.js

### How to use inside your browser side script
Copy this file to the area on your server where you serve up scripts.
In your html file, at the following into the head section:

```html
<html>
    <head>
        <!-- other stuff-->
        <script src="/pathtoyourscripts/integrity-check.js"></script>
    </head>
    <!-- other stuff-->
</html>
```

Then inside one of your JavaScript scripts you can do (for example):
```JavaScript
function myFunc(a) {
    Integrity.checkIsValidNumber(a, "a is not a number, it was {}", a)
}
```

## Integrity API

The full set of functions is:

```JavaScript
    Integrity.check(condition, *msg)
    Integrity.checkNotNull(test, *msg)
    Integrity.checkIsBool(test, *msg)
    Integrity.checkIsBoolOrNull(test, *msg)
    Integrity.checkIsString(test, *msg)
    Integrity.checkIsStringOrNull(test, *msg)
    Integrity.checkStringNotNullOrEmpty(test, *msg)
    Integrity.checkIsValidNumber(test, *msg)
    Integrity.checkIsValidNumberOrNull(test, *msg)
    Integrity.checkIsFunction(test, *msg)
    Integrity.checkIsFunctionOrNull(test, *msg)

    Integrity.fail(*msg)
```
### Exceptions

The following exceptions are thrown:
* TypeError - when the test is not the right type (which may include null if not allowed)
* ReferenceError - when test is undefined (and it is not allowed to be undefined)
* Error - to indicate a check failed

## Examples

```JavaScript
// const Integrity = require('integrity-check'); // needed for node scripts, not browser side ones

function extractByAgeRange(students, ageMin, ageMax) {
    Integrity.checkNotNull(students);
    Integrity.checkIsValidNumber(ageMin);
    Integrity.checkIsValidNumber(ageMax);
    Integrity.check(ageMin <= ageMax, "ageMin must be <= ageMax, was {} and {}", ageMin, ageMax);

    const retArray = [];

    for (let student in students) {
        Integrity.checkNotNull(student);
        Integrity.checkNotNull(student.age, "Student item not a student? Missing age. {}", student);
        Integrity.checkIsValidNumber(student.age);

        if (student.age >= ageMin && student.age <= ageMax) {
            retArray.push(student);
        }
    }

    return retArray;
}
```