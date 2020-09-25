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

class Integrity_NullPointerException extends IntegrityException {
	constructor(message, clipFunction) {
		super(message, clipFunction);
	}
}

class Integrity_IllegalArgumentException extends IntegrityException {
	constructor(message, clipFunction) {
		super(message, clipFunction);
	}
}

class Integrity_EmptyStringException extends IntegrityException {
	constructor(message, clipFunction) {
		super(message, clipFunction);
	}
}

class Integrity_IllegalTypeException extends IntegrityException {
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

class Integrity_BlankStringException extends IntegrityException {
	constructor(message, clipFunction) {
		super(message, clipFunction);
	}
}

class Integrity {
	/**
	 * Check an assumption
	 * @param {boolean} test assumption to check; if false then exception will be raised
	 * @param {...any} msg optional arguments for exception message. First argument can contain {} for substitution of following args e.g. check(a==b, "{} not equal to {}", a, b) . Otherwise params are just appended
	 * @throws Integrity_IllegalTypeException if first argument does not evaluate to a boolean
	 * @throws Integrity_IntegrityException if first argument evaluates to false
	 */
	static check(test, ...msg) {

		Integrity.checkIsBool(test);

		if (!test) {
			throw new IntegrityException(Integrity._msg("Integrity test failed", msg), Integrity.check);
		}
	}

	/**
	 * Check that something is a boolean 
	 * @param {boolean} test item to check
	 * @param {...any} msg optional arguments for exception message. First argument can contain {} for substitution of following args e.g. check(a==b, "{} not equal to {}", a, b) . Otherwise params are just appended
	 * @throws Integrity_NullPointerException if test is exactly null or exactly undefined
	 * @throws Integrity_IllegalTypeException if test is not a boolean
	 */
	static checkIsBool(test, ...msg) {

		if (typeof test !== "boolean") {
			let text = '';
			if (msg.length == 0) {
				text = Integrity_IllegalTypeException.defaultMessage("boolean", test);
			} else {
				text = Integrity._msg('', msg);
			}

			if (test === undefined || test === null) {
				throw new Integrity_NullPointerException(text, Integrity.checkIsBool);
			}

			throw new Integrity_IllegalTypeException(text, Integrity.checkIsBool);
		}
	}

	/**
	* Check that something is either a boolean or exactly null or exactly undefined
	* @param {boolean} test item to check
	* @param {...any} msg optional arguments for exception message. First argument can contain {} for substitution of following args e.g. check(a==b, "{} not equal to {}", a, b) . Otherwise params are just appended
	* @throws Integrity_IllegalTypeException
	*/
	static checkIsBoolOrNull(test, ...msg) {

		if (test === null || test === undefined) {
			return;
		}

		Integrity.checkIsBool(test, ...msg);
	}

	/**
	* Check that something is neither exactly null nor exactly undefined
	* @param {any} test item to check
	* @param {...any} msg optional arguments for exception message. First argument can contain {} for substitution of following args e.g. check(a==b, "{} not equal to {}", a, b) . Otherwise params are just appended
	* @throws Integrity_IllegalTypeException
	*/
	static checkNotNull(test, ...msg) {
		if (test === undefined) {
			throw new Integrity_NullPointerException(Integrity._msg('Integrity test failed: Undefined encountered', msg), this.checkNotNull);
		} else if (test === null) {
			throw new Integrity_NullPointerException(Integrity._msg('Integrity test failed: Null encountered', msg), this.checkNotNull);
		}
	}

	/**
	* Check that something is of type number and is not NaN and is not Infinity
	* @param {number} test item to check
	* @param {...any} msg optional arguments for exception message. First argument can contain {} for substitution of following args e.g. check(a==b, "{} not equal to {}", a, b) . Otherwise params are just appended
	* @throws Integrity_NullPointerException if test is exactly null or exactly undefined
	* @throws Integrity_IllegalTypeException
	*/
	static checkIsValidNumber(test, ...msg) {

		if ((typeof test !== 'number') || !isFinite(test)) { // isFinite tests for NaN, +Inifinity, -Infinity

			let text = '';
			if (msg.length == 0) {
				text = Integrity_IllegalTypeException.defaultMessage("number", test);
			} else {
				text = Integrity._msg('', msg);
			}

			if (test === undefined || test === null) {
				throw new Integrity_NullPointerException(text, Integrity.checkIsBool);
			}

			throw new Integrity_IllegalTypeException(text, Integrity.checkIsValidNumber);
		}
	}

	/**
	* Check that something is of type number and is not NaN and is not Infinity or is null or is undefined
	* @param {number} test item to check
	* @param {...any} msg optional arguments for exception message. First argument can contain {} for substitution of following args e.g. check(a==b, "{} not equal to {}", a, b) . Otherwise params are just appended
	* @throws Integrity_IllegalTypeException
	*/
	static checkIsValidNumberOrNull(test, ...msg) {

		if (test === null || test === undefined) {
			return;
		}

		Integrity.checkIsValidNumber(test, ...msg);
	}

	/**
	* Check that something is of type string and not null or undefined
	* @param {string} s item to check
	* @param {...any} msg optional arguments for exception message. First argument can contain {} for substitution of following args e.g. check(a==b, "{} not equal to {}", a, b) . Otherwise params are just appended
    * @throws Integrity_NullPointerException if test is exactly null or exactly undefined
	* @throws Integrity_IllegalTypeException
	*/
	static checkIsString(s, ...msg) {
		if (typeof s === 'string') {
			return;
		}
		let text = '';
		if (msg.length == 0) {
			text = Integrity_IllegalTypeException.defaultMessage("string", s);
		} else {
			text = Integrity._msg('', msg);
		}

		if (s === undefined || s === null) {
			throw new Integrity_NullPointerException(text, Integrity.checkIsBool);
		}

		throw new Integrity_IllegalTypeException(text, Integrity.checkIsString);
	}

	/**
	* Check that something is of type string or null or undefined
	* @param {string} s item to check
	* @param {...any} msg optional arguments for exception message. First argument can contain {} for substitution of following args e.g. check(a==b, "{} not equal to {}", a, b) . Otherwise params are just appended
	* @throws Integrity_IllegalTypeException
	*/
	static checkIsStringOrNull(s, ...msg) {
		if (s === undefined || s === null) {
			return;
		}

		Integrity.checkIsString(s, ...msg);
	}

	/**
	* Check that something is of type string, neither null or undefined, and not empty
	* @param {string} s item to check
	* @param {...any} msg optional arguments for exception message. First argument can contain {} for substitution of following args e.g. check(a==b, "{} not equal to {}", a, b) . Otherwise params are just appended
	* @throws Integrity_IllegalTypeException
	*/
	static checkStringNotNullOrEmpty(s, ...msg) {

		Integrity.checkIsString(s, ...msg);

		if (s === '') {
			throw new Integrity_EmptyStringException(Integrity._msg('Empty string', msg), Integrity.checkStringNotNullOrEmpty);
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
