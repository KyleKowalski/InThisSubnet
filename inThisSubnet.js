let inquirer = require('inquirer'); // used for the prompt system
let fs = require('fs'); // used for file system
let ipAddressValidator = require('./services/ipAddressValidator.js');
let loadFile = './assets/IPsToCheck.txt' // this is a simple static import, we could get more creative --- that is outside of the scope here so pardon the crudeness

mainPrompt();

function mainPrompt() {
    inquirer.prompt([
        {
            type: "list",
            message: "\n\n=====\nWelcome to IP Validator - please make a selection:\n=====",
            choices: ["Enter IP/Subnet Manually", "Grab Load File", "Quit"],
            name: "mainPromptChoice"
        }
    ]).then((response) => { 
        if (response.mainPromptChoice === 'Enter IP/Subnet Manually') {
            enterIpAndSubnetManually();
        }
        else if (response.mainPromptChoice === 'Grab Load File') {
            grabTheLoadFile();
        }
        else if (response.mainPromptChoice === 'Quit') {
            quit();
        }
        else {
            console.log("We've escaped the main prompt choice somehow - log an error")
        }
    })
}

function quit() {
    console.log("\n=====\nHave a great day!\n\nGood Bye!\n=====");
    process.exit();
}

function grabTheLoadFile() {    
    console.log('Ok then, grabbing the load file.');
    // ok, ok, this load file isn't very dynamic - that part can be added easy enough
    console.log('\n')
    fs.readFile(loadFile, "utf8", function(error, data) {
        if (error) {
            return console.log(error);
        }
        console.log(data);
        let dataArray = data.split("\r\n");
        
        dataArray.forEach((item) => {
            let itemArray = item.split(",");
            let results = ipAddressValidator(itemArray[0], itemArray[1].trim());
            console.log('Results: ' + results);
        });
    });
    setTimeout(() => mainPrompt(), 3000); // 3 second delay - send to main area again
}

function enterIpAndSubnetManually() {
    inquirer.prompt([
        {
            type: "input",
            message: "Please enter the target IP (32-bit unsigned int):",
            name: "hexIp"
        },
        {
            type: "input",
            message: "Please enter the target subnet(#.#.#.#/#):",
            name: "subnetMask"
        }
    ]).then(function(response){
        if (response.hexIp === "") {
            console.log("Target IP was empty, let's try again");
            enterIpAndSubnetManually();
            return;
        }
        else if (response.subnetMask === "") {
            console.log("Subnet mask was empty, let's try again");
            enterIpAndSubnetManually();
            return;
        }
        let result = ipAddressValidator(response.hexIp, response.subnetMask);
        console.log(result);
        setTimeout(() => mainPrompt(), 3000); // 3 second delay - send to main area again
    });
}