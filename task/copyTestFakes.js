const fs = require('fs');

try {
    fs.createReadStream('test/common/mplconfigFake.json').pipe(fs.createWriteStream('build/test/common/mplconfigFake.json'));
} catch (error) {
    console.error(error);
    process.exit(1);
}
