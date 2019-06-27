const fs = require('fs');
const util = require('util');
const castArray = require('lodash.castarray');

const writeFile = util.promisify(fs.writeFile);

const parseFileOption = option => {
    const file = typeof option === 'string' ? option : option.file;
    return { file };
};

async function bump(version, out) {
    if (!out) return;
    return Promise.all(
        castArray(out).map(async out => {
            const {file} = parseFileOption(out);
            return writeFile(file, version);
        })
    );
}

// async function generateNotes(pluginConfig, context) {
//     bump(context.nextRelease.version, pluginConfig.file);
// }

async function prepare(pluginConfig, context) {
    bump(context.nextRelease.version, pluginConfig.file);
}

module.exports = {prepare};
