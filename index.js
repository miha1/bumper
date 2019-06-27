const fs = require('fs');
const util = require('util');
const castArray = require('lodash.castarray');
const { gitCommitPush } = require("git-commit-push-via-github-api");


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
//     await bump(context.nextRelease.version, pluginConfig.file);
// }

async function prepare(pluginConfig, context) {
    await bump(context.nextRelease.version, pluginConfig.file);
    gitCommitPush({
        // todo change owner and repo
        owner: "miha1",
        repo: "semantic-release-test",
        // commit files
        files: [
            { path: pluginConfig.file, content: fs.readFileSync(__dirname + "/" + pluginConfig.file, "utf-8") }
        ],
        fullyQualifiedRef: "heads/master",
        forceUpdate: false, // optional default = false
        commitMessage: "Release " + context.nextRelease.version
    })
        .then(res => {
            console.log("success", res);
        })
        .catch(err => {
            console.error(err);
        });

}

module.exports = {prepare};
