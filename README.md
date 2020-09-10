# integrity-js
Runtime integrity checking for node.js programs
Use npm to fetch it:

npm install integrity-check
or
npm install integrity-check --save

Example of use:
--------------

const Integrity = require('integrity-check');

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
