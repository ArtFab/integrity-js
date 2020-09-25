"use strict";

class IntegrityException extends Error {
    constructor(message, clipFunction) {
        super(message);
        this.name = this.constructor.name;

        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, clipFunction);
        }
    }
}

class NullPointerException extends IntegrityException {
    constructor(message, clipFunction) {
        super(message, clipFunction);
    }
}

class IllegalArgumentException extends IntegrityException {
    constructor(message, clipFunction) {
        super(message, clipFunction);
    }
}

class EmptyStringException extends IntegrityException {
    constructor(message, clipFunction) {
        super(message, clipFunction);
    }
}

class IllegalTypeException extends IntegrityException {
    constructor(message, clipFunction) {
        super(message, clipFunction);
    }

    static defaultMessage(expectedType, actualThing) {


        let valueOfThing = '' + actualThing;
        if (!Array.isArray(actualThing) && valueOfThing == '[object Object]') {
            valueOfThing = JSON.stringify(actualThing);
        }
        if (valueOfThing.length > 30) {
            valueOfThing = valueOfThing.substring(0, 30);
        }

        let defaultMessage = "Expected " + expectedType + ", but was " + Integrity._prettyType(actualThing);
        
        let prettyType = Integrity._prettyType(actualThing);

        if (prettyType.toUpperCase() != valueOfThing.toUpperCase()) {
            defaultMessage += ", value was '" + valueOfThing + "'"; 
        }

        return defaultMessage;
    }
}

class BlankStringException extends IntegrityException {
    constructor(message, clipFunction) {
        super(message, clipFunction);
    }
}

class Integrity {

    static check(test, ...msg) {

        Integrity.checkIsBool(test);

        if (!test) {
            throw new IntegrityException(Integrity._msg("Integrity test failed", msg), Integrity.check);
        }
    }

    static checkIsBool(test, ...msg) {

        if (typeof test !== "boolean") {
            let text = '';
            if (msg.length == 0) {
                text = IllegalTypeException.defaultMessage("boolean", test);
            } else {
                text = Integrity._msg('', msg);
            }

            if (test === undefined || test === null) {
                throw new NullPointerException(text, Integrity.checkIsBool);
            }

            throw new IllegalTypeException(text, Integrity.checkIsBool);
        }
    }

    static checkIsBoolOrNull(test, ...msg) {

        if (test === null || test === undefined) {
            return;
        }

        Integrity.checkIsBool(test, ...msg);
    }

    static checkNotNull(test, ...msg) {
        if (test === undefined) {
            throw new NullPointerException(Integrity._msg('Integrity test failed: Undefined encountered', msg), this.checkNotNull);
        } else if(test === null) {
            throw new NullPointerException(Integrity._msg('Integrity test failed: Null encountered', msg), this.checkNotNull);
        }
    }

    static checkIsValidNumber(test, ...msg) {

        if ((typeof test !== 'number') || !isFinite(test)) { // isFinite tests for NaN, +Inifinity, -Infinity
            
            let text = '';
            if (msg.length == 0) {
                text = IllegalTypeException.defaultMessage("number", test);
            } else {
                text = Integrity._msg('', msg);
            }

            if (test === undefined || test === null) {
                throw new NullPointerException(text, Integrity.checkIsBool);
            }

            throw new IllegalTypeException(text, Integrity.checkIsValidNumber);
        }
    }

    static checkIsValidNumberOrNull(test, ...msg) {

        if (test === null || test === undefined) {
            return;
        }

        Integrity.checkIsValidNumber(test, ...msg);
    }

    static checkIsString(s, ...msg) {
        if (typeof s === 'string') {
            return;
        }
        let text = '';
        if (msg.length == 0) {
            text = IllegalTypeException.defaultMessage("string", s);
        } else {
            text = Integrity._msg('', msg);
        }

        if (s === undefined || s === null) {
            throw new NullPointerException(text, Integrity.checkIsBool);
        }

        throw new IllegalTypeException(text, Integrity.checkIsString);
    }

    static checkIsStringOrNull(s, ...msg) {
        if (s === undefined || s === null) {
            return;
        }

        Integrity.checkIsString(s, ...msg);
    }

    static checkStringNotNullOrEmpty(s, ...msg) {

        Integrity.checkIsString(s, ...msg);

        if (s === '') {
            throw new EmptyStringException(Integrity._msg('Empty string', msg), Integrity.checkStringNotNullOrEmpty);
        }
    }

    static _prettyType(thing) {
        if (thing === null) {
            return "null";
        } else if (thing !== thing) {
            return "NaN";
        } else if (thing === undefined) {
            return "undefined";
        } else if (thing == Infinity) {
            return "Infinity";
        } else if (Array.isArray(thing)) {
            return "Array";
        } else {
            return typeof thing;
        }
    }

    static _msg(defaultMessage, messageArray) {
        if (!messageArray || messageArray.length == 0) {
            return defaultMessage;
        } else {
            return Integrity._expandMessageArray(...messageArray)
        }
    }

    static _expandMessageArray() {
        if (arguments.length == 0) {
            return 'Integrity test failed';
        }

        try {
            //console.log(msg);
            var s = '' + arguments[0];
            if (arguments.length > 1) {
                for (var i = 1; i < arguments.length; i++) {
                    if (s.indexOf('{}') == -1) {
                        s += ", '" + arguments[i] + "'";
                    } else {
                        s = s.replace('{}', '' + arguments[i]);
                    }
                }
            }
        } catch (x) {
            return arguments[0] + ' << exception while replacing parameters >>';
        }

        return s;
    }
}

Integrity.NullPointerException = NullPointerException;
Integrity.IllegalTypeException = IllegalTypeException;
Integrity.IntegrityException = IntegrityException;
Integrity.EmptyStringException = EmptyStringException;

module.exports = Integrity;
