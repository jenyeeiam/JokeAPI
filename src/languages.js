const fs = require("fs");
const Fuse = require("fuse.js");

const settings = require("../settings");


/**
 * Initializes the language module
 */
function init()
{
    return new Promise((resolve, reject) => {
        fs.readFile(settings.languages.langFilePath, (err, data) => {
            if(err)
                return reject(err);
            else
            {
                let languages = JSON.parse(data.toString());
                process.languages = languages;
                return resolve(languages);
            }
        });
    });
}

/**
 * Checks whether or not a provided language code is ISO 639-1 or ISO 639-2 compatible
 * @param {String} langCode Two-character language code
 * @returns {Boolean|String} Returns `true` if code exists, string with error message if not
 */
function isValidLang(langCode)
{
    if(process.languages == undefined)
        return "INTERNAL_ERROR: Language module was not correctly initialized (yet)";

    if(typeof langCode !== "string" || langCode.length !== 2)
        return "Language code is not a string or not two characters in length";

    let requested = process.languages[langCode.toLowerCase()];

    if(typeof requested === "string")
        return true;
    else
        return "Language code doesn't exist";
}

/**
 * Converts a language name (fuzzy) into an ISO 639-1 or ISO 639-2 compatible lang code
 * @param {String} language
 * @returns {Boolean|String} Returns `false` if no matching language code was found, else returns string with language code
 */
function languageToCode(language)
{
    if(process.languages == undefined)
        throw new Error("INTERNAL_ERROR: Language module was not correctly initialized (yet)");

    if(typeof language !== "string" || language.length <= 1)
        throw new TypeError("Language is not a string or not two characters in length");

    let searchObj = [];

    Object.keys(process.languages).forEach(key => {
        searchObj.push({
            code: key,
            lang: process.languages[key].toLowerCase()
        });
    });

    let fuzzy = new Fuse(searchObj, {
        includeScore: true,
        keys: ["code", "lang"],
        threshold: 0.5
    });

    return fuzzy.search(language)[0].item.code;
}

module.exports = { init, isValidLang, languageToCode };