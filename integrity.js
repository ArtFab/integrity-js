class NullPointerException extends Error {
    constructor(...params) {
        super(...params);

        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, NullPointerException);
        }
    }
}

class IntegrityException extends Error {
    constructor(...params) {
        super(...params);

        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, IntegrityException);
        }
    }
}

class IllegalTypeException extends Error {
    constructor(...params) {
        super(...params);

        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, IllegalTypeException);
        }
    }
}

class BlankStringException extends Error {
    constructor(...params) {
        super(...params);

        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, BlankStringException);
        }
    }
}

class Integrity {

    static check(test, ...msg) {
        if (!test) {
            throw new IntegrityException(Integrity._msg(...msg));
        }
    }

    static checkNotNull(test, ...msg) {
        if (test === undefined || test === null) {
            throw new NullPointerException(Integrity._msg(...msg));
        }
    }

    static checkIsStringOrNull(s, ...msg) {
        if (s === undefined || s === null || typeof s === 'string') {
            return;
        }

        throw new IllegalTypeException(Integrity._msg(...msg));
    }

    static checkIsString(s, ...msg) {
        if (typeof s === 'string') {
            return;
        }

        throw new IllegalTypeException(Integrity._msg(...msg));
    }

    static checkNotNullOrBlank(s, ...msg) {
        if (s === undefined || s === null) {
            throw new NullPointerException(Integrity._msg(...msg));
        }

        if (typeof s !== 'string') {
            throw new IllegalTypeException(Integrity._msg(...msg));
        }

        if (s === '') {
            throw new BlankString(Integrity._msg(...msg));
        }
    }

    static _msg(...msg) {
        if (!msg) {
            return '<< no message >>';
        }

        try {
            //console.log(msg);
            var s = msg[0];
            if (msg.length > 1) {
                for (var i = 1; i < msg.length; i++) {
                    s = s.replace('{}', '' + msg[i]);
                }
            }
        } catch (x) {
            return msg[0] + ' << exception while replacing parameters >>';
        }

        return s;
    }
}

Integrity.NullPointerException = NullPointerException;
Integrity.IllegalTypeException = IllegalTypeException;
Integrity.IntegrityException = IntegrityException;

module.exports = Integrity;
