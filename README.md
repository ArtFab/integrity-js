# Integrity check

This library provides a simple way of performing runtime checks, with the following features:

* The building of the error messages is delayed until the check fails
* You can pass any variables to make the error message out of
* Truncation (configurable) is used to make sure the error message does not get stupidly long 
* You can optionally do substitution with {} if you want to control how the message is built
* You don't have to provide anything for the error message in which case a default is used
* Default error messages will provide spot NaN, Infinity, null, undefined etc. and provide meaningful information
* This is part of a similar set of libraries for other languages which are based on the same API

General language independent informaiton about 'Integrity checking' can be found here: https://risingtyde.github.io/

# Usage

This library can be used in:
* Node (plain javascript)
* Node (typescript)
* Browser (plain javascript)
* Browser (typescript)

## Use with Node (plain JavaScript)

Use npm to install it:

cd into the root directory of yuor project, where the json.package file is, and do:
```
> npm install integrity-check --save
```
import it into your code

```JavaScript
const { Integrity } = require('integrity-check')

function myFunc(a) {
    Integrity.checkIsValidNumber(a, "a is not a number, it was {}", a)
}
```
## Use with Node (TypeScript)
Use npm to install it:

cd into the root directory of yuor project, where the json.package file is, and do:
```
> npm install integrity-check --save
```
import it into your code

```JavaScript
import { Integrity } from "integrity-check"

function myFunc(a) {
    Integrity.checkIsValidNumber(a, "a is not a number, it was {}", a)
}
```

## Use in browser

### How to obtain the integrity-check-X-X-X.js file

You have several options:
* grab from git hub: https://github.com/RisingTyde/integrity-js/tree/master/dist/browser
* use npm to install integrity-check then grab from dist/browser folder
* use this link directly in your html or use it to grab the file: https://risingtyde.github.io/scripts/integrity-check.js

#### Using npm

If you use npm, create a folder and do
```
> npm install integrity-check
```
The relevant file can be found in the installed package. Look in 
yourfolder\node_modules\integrity-check\browser\integrity-check-X-X-X.js

### How to use inside your browser side script
Copy the file to the area on your server where you serve up scripts.
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

# Integrity API

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
## Exceptions

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