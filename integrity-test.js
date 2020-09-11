var Integrity = require('./integrity');

function fail(msg, optionalException) {
    console.log('******************************************');
    console.log('*                                        *');
    console.log('*               FAIL                     *');
    console.log('*                                        *');
    console.log('******************************************');
    console.log(msg);

    if (optionalException) {
        console.log(optionalException.message);
    }

    process.exit(1);
}

function expectException(f, exceptionType, exceptionMessage) {
    try {
        f();
    } catch (e) {
        if (exceptionType) {

            if (!(e instanceof exceptionType)) {
                console.log("function is: " + f);
                fail('Expected exception ' + new exceptionType().constructor.name + ' but got ' + e.constructor.name + ' instead');
            }
        } 

        if (exceptionMessage !== undefined) {
            if ('' + e.message != exceptionMessage) {
                console.log("function is: " + f);
                fail('Expected message "' + exceptionMessage + '" but got "' + e.message + '" instead');
            }
        }

        return; // success
    }

    var xName = exceptionType ? (' ' + new exceptionType().constructor.name) : '';

    console.log("function is: " + f);
    fail('Expected exception' + xName + ' but no exception thrown');
}

const one = 1;

try {
    var undefinedVar;
    const notNull = 'a not null variable';

    Integrity.check(one == 1);
    Integrity.check(one == '1');
    Integrity.checkNotNull(notNull);
    Integrity.checkStringNotNullOrEmpty('a');
    Integrity.checkStringNotNullOrEmpty('0'); // should not throw as '0' is a valid string
    Integrity.checkIsString(''); // should be ok as is a valid string
    Integrity.checkIsString(' '); // should be ok as is a valid string
    Integrity.checkIsString('abc');
    Integrity.checkIsStringOrNull(null);
    Integrity.checkIsStringOrNull(undefinedVar); // 'null' is short for NullOrUndefined
    Integrity.checkIsStringOrNull(''); // should be ok as is a valid string
    Integrity.checkIsStringOrNull(' '); // should be ok as is a valid string
    Integrity.checkIsStringOrNull('abc');
    Integrity.checkIsValidNumber(1);
    Integrity.checkIsValidNumber(1.1);
    Integrity.checkIsValidNumber(0);
    Integrity.checkIsValidNumber(-0);
    Integrity.checkIsValidNumberOrNull(null);
    Integrity.checkIsValidNumberOrNull(undefinedVar);

} catch (x) {
    console.log(x);
    fail('Unexpected exception: ' + x, x);
}

/*
 * Series of tests to try catch the situation where the developer meant == but did = by accident in the check
 * Basically, anything which does not evaluate to boolean as the first parameter should raise an IllegalTypeException.
 * Note that the one case which cannot be caught is where a boolean is assigned i.e.
 * Integrity.check(someBool = someOtherBool)
 * Ideally this would raise an exception to highlight the accidental = instead of ==, but this is not possible
*/
expectException(() => {
    let a1 = 1;
    Integrity.check(a1 = one);
}, Integrity.IllegalTypeException, "Expected boolean, but was number, value was '1'");

expectException(() => {
    let a1 = 1;
    let a2 = 2;
    Integrity.check(a1 = a2); // simulate an error where the developer meant == but did = by accident 
}, Integrity.IllegalTypeException, "Expected boolean, but was number, value was '2'");

expectException(() => {
    let a1 = 1;
    Integrity.check(a1 = null);
}, Integrity.NullPointerException, "Expected boolean, but was null");

expectException(() => {
    Integrity.check(one == 2, 'expected 2 but got {}', one);
}, Integrity.IntegrityException, 'expected 2 but got 1');

expectException(() => {
    const zero = 0;
    Integrity.check(zero == 2, 'expected 2 but got {}', zero);
}, Integrity.IntegrityException, 'expected 2 but got 0');

/* Integrity.checkIsBool tests -------------------------------------------------- */

expectException(() => {
    Integrity.checkIsBool(1); // expect to throw as 1 is not a boolean
}, Integrity.IllegalTypeException, "Expected boolean, but was number, value was '1'");

expectException(() => {
    Integrity.checkIsBool(1, "check message works"); // check the provided message propogates through
}, Integrity.IllegalTypeException, "check message works");

expectException(() => {
    Integrity.checkIsBool(1, "check message works {} {}", 1, 2); // check the provided message propogates through
}, Integrity.IllegalTypeException, "check message works 1 2");

expectException(() => {
    Integrity.checkIsBool(''); // expect to throw as string is not a boolean
}, Integrity.IllegalTypeException, "Expected boolean, but was string, value was ''");

expectException(() => {
    Integrity.checkIsBool(NaN); // expect to throw as NaN is not a boolean
}, Integrity.IllegalTypeException, "Expected boolean, but was NaN");

expectException(() => {
    Integrity.checkIsBool(Infinity); // expect to throw as Infinity is not a boolean
}, Integrity.IllegalTypeException, "Expected boolean, but was Infinity");

expectException(() => {
    Integrity.checkIsBool([true]); // expect to throw as array is not a boolean
}, Integrity.IllegalTypeException, "Expected boolean, but was Array, value was 'true'");

expectException(() => {
    Integrity.checkIsBool([true, false]); // expect to throw as array is not a boolean
}, Integrity.IllegalTypeException, "Expected boolean, but was Array, value was 'true,false'");

expectException(() => {
    Integrity.checkIsBool({}); // expect to throw as object is not a boolean
}, Integrity.IllegalTypeException, "Expected boolean, but was object, value was '{}'");

expectException(() => {
    Integrity.checkIsBool({a1: true}); // expect to throw as object is not a boolean
}, Integrity.IllegalTypeException, "Expected boolean, but was object, value was '{\"a1\":true}'");

/* Integrity.checkIsBoolOrNull tests -------------------------------------------------- */

expectException(() => {
    Integrity.checkIsBoolOrNull(1); // expect to throw as 1 is not a boolean
}, Integrity.IllegalTypeException, "Expected boolean, but was number, value was '1'");

expectException(() => {
    Integrity.checkIsBoolOrNull(1, "check message works"); // check the provided message propogates through
}, Integrity.IllegalTypeException, "check message works");

expectException(() => {
    Integrity.checkIsBoolOrNull(1, "check message works {} {}", 1, 2); // check the provided message propogates through
}, Integrity.IllegalTypeException, "check message works 1 2");

expectException(() => {
    Integrity.checkIsBoolOrNull(''); // expect to throw as string is not a boolean
}, Integrity.IllegalTypeException, "Expected boolean, but was string, value was ''");

expectException(() => {
    Integrity.checkIsBoolOrNull(NaN); // expect to throw as NaN is not a boolean
}, Integrity.IllegalTypeException, "Expected boolean, but was NaN");

expectException(() => {
    Integrity.checkIsBoolOrNull(Infinity); // expect to throw as Infinity is not a boolean
}, Integrity.IllegalTypeException, "Expected boolean, but was Infinity");

expectException(() => {
    Integrity.checkIsBoolOrNull([true]); // expect to throw as array is not a boolean
}, Integrity.IllegalTypeException, "Expected boolean, but was Array, value was 'true'");

expectException(() => {
    Integrity.checkIsBoolOrNull([true, false]); // expect to throw as array is not a boolean
}, Integrity.IllegalTypeException, "Expected boolean, but was Array, value was 'true,false'");

expectException(() => {
    Integrity.checkIsBoolOrNull({}); // expect to throw as object is not a boolean
}, Integrity.IllegalTypeException, "Expected boolean, but was object, value was '{}'");

expectException(() => {
    Integrity.checkIsBoolOrNull({ a1: true }); // expect to throw as object is not a boolean
}, Integrity.IllegalTypeException, "Expected boolean, but was object, value was '{\"a1\":true}'");

/* Integrity.checkNotNull tests -------------------------------------------------- */

expectException(() => {
    var undefinedVariable;
    Integrity.checkNotNull(undefinedVariable, 'undefinedVariable is null');
}, Integrity.NullPointerException, 'undefinedVariable is null');

expectException(() => {
    var undefinedVariable;
    Integrity.checkNotNull(undefinedVariable);
}, Integrity.NullPointerException, 'Integrity test failed: Undefined encountered');

expectException(() => {
    var undefinedVariable;
    Integrity.checkNotNull(undefinedVariable, "m1 {} {}", 1, undefinedVariable);
}, Integrity.NullPointerException, 'm1 1 undefined');

expectException(() => {
    var nullVar = null;
    Integrity.checkNotNull(nullVar);
}, Integrity.NullPointerException, 'Integrity test failed: Null encountered');

expectException(() => {
    var nullVar = null;
    Integrity.checkNotNull(nullVar, "{}", nullVar);
}, Integrity.NullPointerException, 'null');

expectException(() => {
    Integrity.checkNotNull(null);
}, Integrity.NullPointerException);

/* Integrity.checkNotNullOrBlank tests -------------------------------------------------- */

expectException(() => {
    Integrity.checkStringNotNullOrEmpty('');
}, Integrity.BlankStringException, 'Empty string');

expectException(() => {
    Integrity.checkStringNotNullOrEmpty('', "m1 {}", 1);
}, Integrity.BlankStringException, 'm1 1');

expectException(() => {
    Integrity.checkStringNotNullOrEmpty(null);
}, Integrity.BlankStringException, 'Expected string, but was null');

expectException(() => {
    Integrity.checkStringNotNullOrEmpty(undefined);
}, Integrity.BlankStringException, 'Expected string, but was undefined');

expectException(() => {
    Integrity.checkStringNotNullOrEmpty(NaN);
}, Integrity.BlankStringException, "Expected string, but was NaN");

expectException(() => {
    Integrity.checkStringNotNullOrEmpty(1);
}, Integrity.BlankStringException, "Expected string, but was number, value was '1'");

expectException(() => {
    Integrity.checkStringNotNullOrEmpty({});
}, Integrity.BlankStringException, "Expected string, but was object, value was '{}'");

expectException(() => {
    Integrity.checkStringNotNullOrEmpty(0); // expect to throw as 0 is not a string
}, Integrity.IllegalTypeException);

expectException(() => {
    Integrity.checkStringNotNullOrEmpty(1); // expect to throw as 1 is not a string
}, Integrity.IllegalTypeException);

expectException(() => {
    Integrity.checkStringNotNullOrEmpty(1, "a {}", 1); // expect to throw as 1 is not a string
}, Integrity.IllegalTypeException, 'a 1');

/* Integrity.checkIsValidNumber tests -------------------------------------------------- */

expectException(() => {
    Integrity.checkIsValidNumber(NaN);
}, Integrity.IllegalTypeException, "Expected number, but was NaN");

expectException(() => {
    Integrity.checkIsValidNumber(undefined);
}, Integrity.NullPointerException, "Expected number, but was undefined");

expectException(() => {
    Integrity.checkIsValidNumber(Infinity);
}, Integrity.IllegalTypeException, "Expected number, but was Infinity");

expectException(() => {
    Integrity.checkIsValidNumber("1");
}, Integrity.IllegalTypeException, "Expected number, but was string, value was '1'");

expectException(() => {
    Integrity.checkIsValidNumber(null);
}, Integrity.NullPointerException, "Expected number, but was null");

expectException(() => {
    Integrity.checkIsValidNumber(1 == 1);
}, Integrity.IllegalTypeException, "Expected number, but was boolean, value was 'true'");

/* Integrity.checkIsValidNumberOrNull tests -------------------------------------------------- */

expectException(() => {
    Integrity.checkIsValidNumberOrNull(NaN);
}, Integrity.IllegalTypeException, "Expected number, but was NaN");

expectException(() => {
    Integrity.checkIsValidNumberOrNull(Infinity);
}, Integrity.IllegalTypeException, "Expected number, but was Infinity");

expectException(() => {
    Integrity.checkIsValidNumberOrNull("1");
}, Integrity.IllegalTypeException, "Expected number, but was string, value was '1'");

expectException(() => {
    Integrity.checkIsValidNumberOrNull(1 == 1);
}, Integrity.IllegalTypeException, "Expected number, but was boolean, value was 'true'");


console.log('All tests passed');
