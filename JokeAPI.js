// 🔹 JokeAPI v2 by Sv443 🔹
//
// GitHub:    https://github.com/Sv443/JokeAPI
// API Docs:  https://sv443.net/jokeapi/v2
// ️
// ⚠️ Please read the LICENSE.txt file before redistributing JokeAPI.
// ⚠️ Thanks :)


const debug = require("./src/verboseLogging");
const wrap = require("node-wrap");
const jsl = require("svjsl");
const settings = require("./settings");


function initJokeAPI()
{
    debug("PreInit", "Called InitJokeAPI");
    // the debugger and child processes don't get along together so only wrap JokeAPI if the debugger is not active:
    if(!jsl.inDebugger() && !settings.wrapper.skipWrapping)
        return wrap(settings.wrapper.mainFilePath, settings.wrapper.wrapperSettings);
    else return require(settings.wrapper.mainFilePath);
}

initJokeAPI();
