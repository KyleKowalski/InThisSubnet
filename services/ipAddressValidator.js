let ipSubnetCalculator = require( 'ip-subnet-calculator' );
let ipRangeCheck = require("ip-range-check");

// let thisSubnetMask = "98.210.237.70/24";
// let thisHexIP = "0x62D2ED4B"; // 98.210.237.75
// let thisHexIP = "0xAC17A008";  // 172.23.160.8
// let results = validateIpVsSubnet(thisHexIP, thisSubnetMask);

// let backToIP = intToIP(thisHexIP);
// console.log(backToIP);

// console.log(results);

// Pulled from: https://stackoverflow.com/questions/8105629/ip-addresses-stored-as-int-results-in-overflow?utm_medium=organic&utm_source=google_rich_qa&utm_campaign=google_rich_qa
function intToIP(int) {
    var part1 = int & 255;
    var part2 = ((int >> 8) & 255);
    var part3 = ((int >> 16) & 255);
    var part4 = ((int >> 24) & 255);

    return part4 + "." + part3 + "." + part2 + "." + part1;
}

function validateIpVsSubnet(sourceIpHex,subnetString) {
    console.log(`received IP (hex): ${sourceIpHex} Subnet: ${subnetString}`)
    let result = {};
    // get our target IP
    let thisIP = intToIP(sourceIpHex);
    result.ip = thisIP;
    result.isIp = `Is this an IP?  ${ipSubnetCalculator.isIp(thisIP)}`;

    // validate it's good (or throw error)
    if (ipSubnetCalculator.isIp(thisIP) && thisIP !== "0.0.0.0") {
        // split the mask to ip/prefix
        let subnetArray = subnetString.split("/");
        let subnetIp = subnetArray[0];
        let prefixSize = subnetArray[1];
        result.subnet = `Subnet IP: ${subnetIp} - prefix: ${prefixSize}`
        // calc statistics on the subnet
        let subnetStatistics = ipSubnetCalculator.calculateSubnetMask(subnetIp, prefixSize);
        if (subnetStatistics !== null) {
            result.subnetLow = `Subnet Low End:  ${subnetStatistics.ipLowStr}`;
            result.subnetHigh = `Subnet High End:  ${subnetStatistics.ipHighStr}`;
            // the nuts and bolts of what was asked - is it in the subnet?
            result.endResult = ipRangeCheck(thisIP, subnetString);
        }
        else {
            // throw error -  bad subnet
            result.error = `BAD SUBNET OR MASK!`;
        }
    }
    else {
        // throw error - bad IP
        result.error = `IP IS NOT VALID`;
    }
    return result;
}

module.exports = validateIpVsSubnet