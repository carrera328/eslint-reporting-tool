'use strict';
// imports
const fs = require('fs');
const shell = require('shelljs');
const converter = require('json-2-csv')
const csvtoexcelconverter = require('csvtoxlsxconverter');
const os = require("os");
const openExplorer = require('open-file-explorer');

/**
 * @description Creates a JSON representation of an eslint run
 * @returns JSON of eslint run
 */

function createJSON() {
    try {
        // runs shell script that creates a JSON file out of an es lint run
        shell.exec('./vcc-lint.sh');
        // reading the file and capturing the json in this variables
        const json = JSON.parse(fs.readFileSync('result.json'))
        // deleting the json file then returning the variable above
        fs.unlinkSync('result.json');
        return json;

    } catch (error) {
        console.error(error);
    } finally {
        console.log('create JSON method finished executing');
    }
}
/**
 * 
 * @param {*} list list of eslint messages to iterate through 
 * @param {*} properties Properties of the eslint message object we want to surface
 * @returns Formatted eslint warnings/errors
 */
function getEslintResults(list, properties) {
    const rules = [];
    
    list.forEach(listEntry => {
        const fileName = listEntry?.filePath.split('/').slice(-2).join('/'); 

        listEntry.messages = listEntry.messages.map(lintResult => {     
            const obj = {fileName: fileName};
            
            for (const i of properties) {
                obj[i] = lintResult[i]
            }
            return obj;
        });

        rules.push(...listEntry.messages);
    })
    return rules;
}
/**
 * @description takes in eslint JSON and writes a csv representation
 * @param {*} json to convert into a CSV 
 */
async function convertToCSV(json) {    
    try {
        // convert JSON array to CSV string
    converter.json2csv(json, (err, csv) => {
        if (err) {throw err}
        // write CSV to a file
        fs.writeFileSync('eslint-results.csv', csv)
    })
    } catch (error) {
        console.warn(error)
    }
}

// TODO: make this work
/**
 * 
 * @param {*} csv 
 * 
 */
function convertToExcel(csv) {
    try {
        csvtoexcelconverter(csv, './eslint-report.xlsx', function(){
            console.log("converted");
        });
    } catch(error) {
        console.warn(error);
    }
    
}

function openFileExplorer() {
    const userHomeDir = os.homedir();
    
    openExplorer(userHomeDir, err => {
        if(err) {
            console.log(err);
        }
        else {
            //Do Something
        }
    });

    console.log(userHomeDir);

}


// exports
module.exports = {
    createJSON,
    getEslintResults,
    convertToCSV,
    convertToExcel,
    openFileExplorer
}
