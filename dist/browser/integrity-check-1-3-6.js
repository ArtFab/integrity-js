"use strict";
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
var Integrity = /** @class */ (function () {
    function Integrity() {
    }
    /**
    * Check an assumption
    * @param {boolean} condition The condition which should be true
    * @param {...any} msg zero or more arguments, see comment for getDeferredString
    * @throws {IllegalTypeException} if condition is not a boolean
    * @throws {IntegrityException} if condition is false
    */
    Integrity.check = function (condition) {
        var msg = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            msg[_i - 1] = arguments[_i];
        }
        Integrity.checkIsBool(condition);
        if (!condition) {
            Integrity._raiseError(new Error(Integrity._msg("Integrity test failed", msg)), Integrity.check);
        }
    };
    /**
    * Raise an IntegrityException exception
    * @param {...any} msg zero or more arguments, see comment for getDeferredString
    */
    Integrity.fail = function () {
        var msg = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            msg[_i] = arguments[_i];
        }
        Integrity._raiseError(new Error(Integrity._msg("Integrity test failed", msg)), Integrity.check);
    };
    /**
     * Check that something is a boolean
     * @param {any} test item to check
     * @param {...any} msg zero or more arguments, see comment for getDeferredString
     * @throws {ReferenceError} if test is exactly undefined
     * @throws {TypeError} if test is exactly null or is not a boolean
     *
     * If no message arguments are given, the exceptions will have the following default messages:
     *
     * if test is null: "Expected boolean, but was null"
     * if test is undefined: "Expected boolean, but was undefined"
     * if test is an int with value 1: "Expected boolean, but was number, value was '1'"
     * if test is a string with value 'a': "Expected boolean, but was string, value was 'a'"
     * ... and other types will have similar messages
     */
    Integrity.checkIsBool = function (test) {
        var msg = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            msg[_i - 1] = arguments[_i];
        }
        if (typeof test !== "boolean") {
            var text = '';
            if (msg.length == 0) {
                text = Integrity._defaultMessage("boolean", test);
            }
            else {
                text = Integrity._msg('', msg);
            }
            if (test === undefined) {
                Integrity._raiseError(new ReferenceError(text), Integrity.checkIsBool);
            }
            if (test === null) {
                Integrity._raiseError(new TypeError(text), Integrity.checkIsBool);
            }
            Integrity._raiseError(new TypeError(text), Integrity.checkIsBool);
        }
    };
    /**
    * Check that something is either a boolean or exactly null or exactly undefined
    * @param {any} test item to check
    * @param {...any} msg zero or more arguments, see comment for getDeferredString
    * @throws {TypeError} if test is not of type boolean (but null or undefined is ok)
    *
    * See comment for checkIsBool for information on default message
    */
    Integrity.checkIsBoolOrNull = function (test) {
        var msg = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            msg[_i - 1] = arguments[_i];
        }
        if (test === null || test === undefined) {
            return;
        }
        Integrity.checkIsBool.apply(Integrity, __spreadArrays([test], msg));
    };
    /**
    * Check that something is neither exactly null nor exactly undefined
    * @param {any} test item to check
    * @param {...any} msg zero or more arguments, see comment for getDeferredString
    * @throws {TypeError} if test is null
    * @throws {ReferenceError} if test is undefined
    */
    Integrity.checkNotNull = function (test) {
        var msg = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            msg[_i - 1] = arguments[_i];
        }
        if (test === undefined) {
            Integrity._raiseError(new ReferenceError(Integrity._msg('Integrity test failed: Undefined encountered', msg)), this.checkNotNull);
        }
        else if (test === null) {
            Integrity._raiseError(new TypeError(Integrity._msg('Integrity test failed: Null encountered', msg)), this.checkNotNull);
        }
    };
    /**
     * If test is null, undefined, NaN or +/- Infinity, or not type number, an exception will be raised with default or optional message
     * @param {any} test item to check
     * @param {...any} msg zero or more arguments, see comment for getDeferredString
     * @throws {ReferenceError} if test is undefined
     * @throws {TypeError} if test is null, or not a number (int, float), or is NaN or +/-Infinity. Note that "1" is not of type number (it is a string)
     */
    Integrity.checkIsValidNumber = function (test) {
        var msg = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            msg[_i - 1] = arguments[_i];
        }
        if ((typeof test !== 'number') || !isFinite(test)) { // isFinite tests for NaN, +Inifinity, -Infinity
            var text = '';
            if (msg.length == 0) {
                text = Integrity._defaultMessage("number", test);
            }
            else {
                text = Integrity._msg('', msg);
            }
            if (test === undefined) {
                Integrity._raiseError(new ReferenceError(text), Integrity.checkIsValidNumber);
            }
            Integrity._raiseError(new TypeError(text), Integrity.checkIsValidNumber);
        }
    };
    /**
    * Check that something is of type number and is not NaN and is not Infinity or is null or is undefined
    * @param {any} test item to check
    * @param {...any} msg zero or more arguments, see comment for getDeferredString
    * @throws {TypeError} if test is not a number (int, float), or is NaN or +/-Infinity. Note that "1" is not of type number
    */
    Integrity.checkIsValidNumberOrNull = function (test) {
        var msg = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            msg[_i - 1] = arguments[_i];
        }
        if (test === null || test === undefined) {
            return;
        }
        Integrity.checkIsValidNumber.apply(Integrity, __spreadArrays([test], msg));
    };
    /**
    *  Check that something is of type string and not null or undefined
    * @param {any} s item to check
    * @param {...any} msg zero or more arguments, see comment for getDeferredString
    * @throws {ReferenceError} if s is undefined
    * @throws {TypeError} if s is null or not of type string
    */
    Integrity.checkIsString = function (s) {
        var msg = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            msg[_i - 1] = arguments[_i];
        }
        if (typeof s === 'string') {
            return;
        }
        var text = '';
        if (msg.length == 0) {
            text = Integrity._defaultMessage("string", s);
        }
        else {
            text = Integrity._msg('', msg);
        }
        if (s === undefined) {
            Integrity._raiseError(new ReferenceError(text), Integrity.checkIsString);
        }
        Integrity._raiseError(new TypeError(text), Integrity.checkIsString);
    };
    /**
    * Check that something is of type string, or null or undefined
    * @param {any} s item to check
    * @param {...any} msg zero or more arguments, see comment for getDeferredString
    * @throws {TypeError} if s is not of type string
    */
    Integrity.checkIsStringOrNull = function (s) {
        var msg = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            msg[_i - 1] = arguments[_i];
        }
        if (s === undefined || s === null) {
            return;
        }
        Integrity.checkIsString.apply(Integrity, __spreadArrays([s], msg));
    };
    /**
    * Check that something is of type string, neither null nor undefined, and not empty
    * @param {any} s item to check
    * @param {...any} msg zero or more arguments, see comment for getDeferredString
    * @throws {ReferenceError} if s is undefined
    * @throws {TypeError} if s is null or not of type string
    * @throws {Error} if s is a string of length 0
    */
    Integrity.checkStringNotNullOrEmpty = function (s) {
        var msg = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            msg[_i - 1] = arguments[_i];
        }
        Integrity.checkIsString.apply(Integrity, __spreadArrays([s], msg));
        if (s === '') {
            Integrity._raiseError(new Error(Integrity._msg('Empty string', msg)), Integrity.checkStringNotNullOrEmpty);
        }
    };
    /**
    *  Check that something is a function
    * @param {any} test item to check
    * @param {...any} msg zero or more arguments, see comment for getDeferredString
    * @throws {ReferenceError} if test is undefined
    * @throws {TypeError} if test is null or not of type function
    */
    Integrity.checkIsFunction = function (test) {
        var msg = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            msg[_i - 1] = arguments[_i];
        }
        if (typeof test === 'function') {
            return;
        }
        var text = '';
        if (msg.length == 0) {
            text = Integrity._defaultMessage("function", test);
        }
        else {
            text = Integrity._msg('', msg);
        }
        if (test === undefined) {
            Integrity._raiseError(new ReferenceError(text), Integrity.checkIsFunction);
        }
        Integrity._raiseError(new TypeError(text), Integrity.checkIsFunction);
    };
    /**
    *  Check that something is a function, or null or undefined
    * @param {any} test item to check
    * @param {...any} msg zero or more arguments, see comment for getDeferredString
    * @throws {TypeError} if test is not of type function (null and undefined are ok)
    */
    Integrity.checkIsFunctionOrNull = function (test) {
        var msg = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            msg[_i - 1] = arguments[_i];
        }
        if (test === undefined || test === null) {
            return;
        }
        Integrity.checkIsFunction.apply(Integrity, __spreadArrays([test], msg));
    };
    /**
     * Builds from an abritary mix of items, using {} substitution or adding after a comma
     * @param {...any} messageArray variable arguments which get concatenated as strings (comma separated) or substituted into {}
     *
     * Examples:
     *
     * getDeferredString("abc")                   returns "abc"
     * getDeferredString("abc {} def", 1)         returns "abc 1 def"
     * getDeferredString(1, "one", True)          returns "1, one, True"
     * getDeferredString(123, "and now {} ", 345) returns "123, and now 345"
     * getDeferredString("{} {} {}", 1, 2, 3, 4)  returns "1 2 3, 4"
     */
    Integrity.getDeferredString = function () {
        var messageArray = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            messageArray[_i] = arguments[_i];
        }
        return Integrity._msg("", messageArray);
    };
    Integrity._prettyType = function (thing) {
        if (thing === null) {
            return "null";
        }
        else if (thing !== thing) {
            return "NaN";
        }
        else if (thing === undefined) {
            return "undefined";
        }
        else if (thing == Infinity) {
            return "Infinity";
        }
        else if (Array.isArray(thing)) {
            return "Array";
        }
        else {
            return typeof thing;
        }
    };
    Integrity._raiseError = function (x, clipFunction) {
        if (Error.captureStackTrace) {
            Error.captureStackTrace(x, clipFunction);
        }
        throw x;
    };
    Integrity._msg = function (defaultMessage, messageArray) {
        if (!messageArray || messageArray.length == 0) {
            return defaultMessage;
        }
        else {
            return Integrity._expandMessageArray.apply(Integrity, messageArray);
        }
    };
    Integrity._expandMessageArray = function () {
        var ma = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            ma[_i] = arguments[_i];
        }
        if (arguments.length == 0) {
            return 'Integrity test failed';
        }
        try {
            //console.log(msg);
            var s = Integrity._stringValue(arguments[0]);
            if (arguments.length > 1) {
                for (var i = 1; i < arguments.length; i++) {
                    if (s.indexOf('{}') == -1) {
                        s += ", '" + Integrity._stringValue(arguments[i]) + "'";
                    }
                    else {
                        s = s.replace('{}', '' + Integrity._stringValue(arguments[i]));
                    }
                }
            }
        }
        catch (x) {
            return arguments[0] + ' << exception while replacing parameters >>';
        }
        return s;
    };
    Integrity._stringValue = function (actualThing) {
        var valueOfThing = '' + actualThing;
        if (Array.isArray(actualThing) || valueOfThing == '[object Object]') {
            valueOfThing = JSON.stringify(actualThing);
        }
        if (valueOfThing.length > Integrity.stringTruncationLimit) {
            valueOfThing = valueOfThing.substring(0, Integrity.stringTruncationLimit) + "...";
        }
        return valueOfThing;
    };
    Integrity._defaultMessage = function (expectedType, actualThing) {
        var valueOfThing = Integrity._stringValue(actualThing);
        var defaultMessage = "Expected " + expectedType + ", but was " + Integrity._prettyType(actualThing);
        var prettyType = Integrity._prettyType(actualThing);
        if (prettyType.toUpperCase() != valueOfThing.toUpperCase()) {
            defaultMessage += ", value was '" + valueOfThing + "'";
        }
        return defaultMessage;
    };
    Integrity.stringTruncationLimit = 30;
    return Integrity;
}());
//# sourceMappingURL=integrity-check-1-3-6.js.map