const fs = require('fs')

// can't use Integrity at this stage in the build process

function check(condition, message) {
    if (!condition) {
        throw Error(message)
    }
}

function main() {

    const targetFile = '../src/ts/integrity.ts'

    let data = fs.readFileSync(targetFile, 'utf8')

    check(data.length != 0, "File has no data in it: " + targetFile)

    check(data.indexOf("export ") != -1, "Source file has no export?")

    data = data.replace("export ", "")

    fs.writeFileSync("../src/plain/integrity-check.ts", data, 'utf8')
} 

try {
    main()
}
catch (e) {
    console.log(e.message);
    process.exit(-1)
}