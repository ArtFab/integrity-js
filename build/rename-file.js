const fs = require('fs')
const pjson = require('../package.json')
const { Integrity } = require("../dist/cjs/integrity")


function main() {
    const args = process.argv;
    Integrity.check(args.length > 1, "Expected first two args to be exe and script")
    Integrity.check(args[0].endsWith('.exe'), "Expected first arg to be node exe")
    Integrity.check(args[1].endsWith('rename-file'), "Expected second arg to be this script")

    const targetFile = args[2]

    Integrity.checkNotNull(targetFile, "No target file specified")

    if (!targetFile.endsWith('.min.js')) {
        throw Error("Target file must end in .min.js: " + targetFile)
    }

    if (!fs.existsSync(targetFile)) {
        throw Error("Target file does not exist: " + targetFile)
    }

    Integrity.checkNotNull(pjson.version)

    let version = pjson.version.replace(/\./g, '-')

    let newName = targetFile.replace(".min.js", version + ".min.js");

    fs.copyFileSync(targetFile, newName); // this will throw an exception if an error occurs
} 

try {
    main()
}
catch (e) {
    console.log(e.message);
    process.exit(-1)
}