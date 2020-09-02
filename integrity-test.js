var Integrity = require('./integrity');
var stackTrace = require('stack-trace');

function getJustFilename(path) {
    return path.split('\\').pop().split('/').pop();
}

function fail(msg, optionalException) {
    console.log('******************************************');
    console.log('*                                        *');
    console.log('*               FAIL                     *');
    console.log('*                                        *');
    console.log('******************************************');
    console.log(msg);

    if (optionalException) {
        if (optionalException instanceof Error) {
            var trace = stackTrace.parse(optionalException);
            var inIntegrityFile = false;
            for (var i = 0; i < trace.length; i++) {
                if (!trace[i].fileName.endsWith('integrity.js')) {
                    const fileName = getJustFilename(trace[i].fileName);
                    const inMethod = trace[i].methodName == null ? '(in main file)' : '(' + trace[i].methodName + ')';
                    console.log(fileName + ' line ' + trace[i].lineNumber + ' ' + inMethod);
                    //console.log(trace[i].fileName);
                    break;
                }
            }
        }
    }

    process.exit(1);
}

function expectException(f, exceptionType, exceptionMessage) {
    try {
        f();
    } catch (e) {
        if (exceptionType) {
            //console.log('e.name=' + e.name);
            //console.log('e.message=' + e.message);
            //console.log(exceptionType);

            if (!(e instanceof exceptionType)) {
                console.log(f);
                fail('Expected exception ' + new exceptionType().constructor.name + ' but got ' + e.constructor.name + ' instead');
            }
        } else {
            //console.log('exceptionType not provided');
        }

        if (exceptionMessage) {
            if ('' + e.message != exceptionMessage) {
                fail('Expected message "' + exceptionMessage + '" but got "' + e.message + '" instead');
            }
        }

        return; // success
    }

    var xName = exceptionType ? (' ' + new exceptionType().constructor.name) : '';

    console.log(f);
    fail('Expected exception' + xName + ' but no exception thrown');
}

const one = 1;

try {
    var undefinedVar;
    const notNull = 'a not null variable';

    Integrity.check(one == 1, 'testing equality');
    Integrity.check(one == '1', 'testing equality');
    Integrity.checkNotNull(notNull);
    Integrity.checkNotNullOrBlank('a');
    Integrity.checkNotNullOrBlank('0'); // should not throw as '0' is a valid string
    Integrity.checkIsString(''); // should be ok as is a valid string
    Integrity.checkIsString(' '); // should be ok as is a valid string
    Integrity.checkIsString('abc');
    Integrity.checkIsStringOrNull(null);
    Integrity.checkIsStringOrNull(undefinedVar); // 'null' is short for NullOrUndefined
    Integrity.checkIsStringOrNull(''); // should be ok as is a valid string
    Integrity.checkIsStringOrNull(' '); // should be ok as is a valid string
    Integrity.checkIsStringOrNull('abc');

} catch (x) {
    console.log(x);
    fail('Unexpected exception: ' + x, x);
}

expectException(function () {
    Integrity.check(one == 2, 'expected 2 but got {}', one);
}, Integrity.IntegrityException, 'expected 2 but got 1');

expectException(function () {
    const zero = 0;
    Integrity.check(zero == 2, 'expected 2 but got {}', zero);
}, Integrity.IntegrityException, 'expected 2 but got 0');

expectException(function () {
    var undefinedVariable;
    Integrity.checkNotNull(undefinedVariable, 'undefinedVariable is null');
}, Integrity.NullPointerException, 'undefinedVariable is null');

expectException(function () {
    Integrity.checkNotNull(null);
}, Integrity.NullPointerException);

expectException(function () {
    Integrity.checkNotNullOrBlank('');
}, Integrity.BlankStringException);

expectException(function () {
    Integrity.checkNotNullOrBlank(0); // expect to throw as 0 is not a string
}, Integrity.IllegalTypeException);

expectException(function () {
    Integrity.checkNotNullOrBlank(1); // expect to throw as 1 is not a string
}, Integrity.IllegalTypeException);

console.log('All tests passed');
