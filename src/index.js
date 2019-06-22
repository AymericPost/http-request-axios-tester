/**
 * A request tester with evaluation using Axios.
 * 
 * Needs a configuration JSON file in scipt's root direcory "parameters.json". See "params" constant for JSON properties to use.
 * @file
 * @author AymericPost
 * @requires Script
 * @see module:Script~params
 */

/**
 * @module Script
 * @requires Axios
 */
 
import axios from "axios";

/** 
 * @constant {Object[]} params - Imported array of objects from JSON "parameters.json".
 * @property {Object} param - One of the test details imported from .json file given to this script as parameter.
 * @property {String} param.title - Text to be displayed next to test number log.
 * @property {String} param.method - HTTP verb to use ("get", "put", "post", "delete" or "patch")
 * @property {String} param.url - URL to make a request on.
 * @property {Object} [param.body] - Request's body.
 * @property {Object} [param.options] - Axios' options object (see link below).
 * @property {Any} [param.expect] - Value to test Axios request's response against.
 * @property {String} [param.operator] - How the response should be compared to test ("eq", "ne", "gt", "gte", "lt", "lte"). If no operator property is present, "eq" will be assumed.
 */
import params from "../parameters.json";

/** 
 * @var {Number} i - Iteration counter, increased after each test in asyncForEach's callback. 
 * @see module:Script~asyncForEach
 */
let i = 1;

asyncForEach(params, async (param) => {
    console.log("\n\n\t**************************************************");
    console.log("\nTEST #" + i + (param.title ? " - " + param.title : "") );
    if(param.method && param.url) console.log(`${param.method.toUpperCase()} ${param.url}`);
    if(param.body) console.log(param.body);
    console.log("");

    await testing(param);
    i++;
})

/**
 * Home-made "forEach" function to iterate on an array in a more asynchronous way than the classic "forEach".
 * @function asyncForEach
 * @param {Array} arr - Array to iterate on.
 * @param {Function} cb - Callback function to execute on each element of "arr" array.
 * @returns {Promise<void>} No returns.
 */
async function asyncForEach(arr, cb) {
    for(let i = 0 ; i < arr.length ; i++) {
        await cb(arr[i]);
    }
}
/**
 * Axios request test function. Checks if test's parameters are valid, then runs an axios request based on specified http verb and url, then if a test is given, checks response against given expected value and operator. Finally, logs result to stdout/stderr.
 * @function testing
 * @param {Object} test - One of the test details imported from .json file given to this script as parameter.
 * @param {String} [test.title] - Text to be displayed next to test number log.
 * @param {String} test.method - HTTP verb to use ("get", "put", "post", "delete" or "patch")
 * @param {String} test.url - URL to make a request on.
 * @param {Object} [test.body] - Request's body.
 * @param {Object} [test.options] - Axios' options object (see link below).
 * @param {Any} [test.expect] - Value to test Axios request's response against.
 * @param {String} [test.operator] - How the response should be compared to test ("eq", "ne", "gt", "gte", "lt", "lte"). If no operator property is present, "eq" will be assumed.
 * @returns {Number} Status code similar in spirit to C's "int main()" return value. 0: test ran fine. 1: test encountered an error or could not be run.
 * @see https://kapeli.com/cheat_sheets/Axios.docset/Contents/Resources/Documents/index
 */
async function testing(test) {
    // Check if "method" is a valid HTTP verb.
    if(!test.method) {
        console.error("Test aborted!");
        console.log("\nNo \"method\" field.");
        return 1;
    } else if(!["get", "put", "post", "delete", "patch"].includes(test.method.toLowerCase())) {
        console.error("Test aborted!");
        console.error("\nUnknowned Method : " + test.method.toUpperCase());
        return 1;
    }

    // if "operator" is present, checks if it conforms to BJSON standards (without "$" sign before each operator though).
    if(test.operator && !["eq", "ne", "gt", "gte", "lt", "lte"].includes(test.operator)) {
        console.error("Test aborted!");
        console.error("\nUnknowned Operator : " + test.operator);
        return 1;
    }

    // Call Axios method given by test and give Axios parameters in a correct order.
    return await axios[test.method.toLowerCase()](
        test.url,
        (test.body ? 
            test.body
            :
            (test.options ? 
                test.options
                :
                null
            )
        ),
        (test.body && test.options ? test.options : null)
    ).then(resp => {
        // If there is a test :
        if(test.expect) {
            // Big if with ternary operators to switch to desired comparison operator.
            if( 
                // Operator "eq" (default if no propery "operator" in test) checks if response and test are equals.
                (!test.operator || test.operator == "eq") ? (
                    (typeof resp.data == "object" ? JSON.stringify(resp.data) : resp.data)
                    ==
                    (typeof test.expect == "object" ? JSON.stringify(test.expect) : test.expect)
                ) 
                // Operator "ne" checks if response and test are not equals.
                : ( test.operator == "ne" ? (
                    (typeof resp.data == "object" ? JSON.stringify(resp.data) : resp.data)
                    !=
                    (typeof test.expect == "object" ? JSON.stringify(test.expect) : test.expect)
                // Operator "gt" checks if response is greater than test.
                ) : ( test.operator == "gt" ? (
                    (typeof resp.data == "object" ? JSON.stringify(resp.data) : resp.data)
                    >
                    (typeof test.expect == "object" ? JSON.stringify(test.expect) : test.expect)
                // Operator "lt" checks if response is lower than test.
                ) : ( test.operator == "lt" ? (
                    (typeof resp.data == "object" ? JSON.stringify(resp.data) : resp.data)
                    <
                    (typeof test.expect == "object" ? JSON.stringify(test.expect) : test.expect)
                // Operator "gte" checks if response is greater than or equals to test.
                ) : ( test.operator == "gte" ? (
                    (typeof resp.data == "object" ? JSON.stringify(resp.data) : resp.data)
                    >=
                    (typeof test.expect == "object" ? JSON.stringify(test.expect) : test.expect)
                ) : 
                // Operator "lte" checks if response is lower than or equals to test. "Ultimate else" of this chain of ternary operators.
                    (typeof resp.data == "object" ? JSON.stringify(resp.data) : resp.data)
                    <=
                    (typeof test.expect == "object" ? JSON.stringify(test.expect) : test.expect)
                ))))
            ) {
                console.log("Test Succeeded!\n")
                console.log(`Response was [${test.operator || "eq"}] ${["lt", "gt"].includes(test.operator) ? "than" : "to"} \"expect\" test.`)
            } else {
                console.error("Test failed!")
                console.error(`\nExpected response to be [${test.operator || "eq"}] ${["lt", "gt"].includes(test.operator) ? "than" : "to"} :`);
                console.error(typeof test.expect == "object" ? JSON.stringify(test.expect) : test.expect);
                console.error("\nGot :")
                console.error(JSON.stringify(resp.data))
            }
        // If no expected value is given in test, test succeeds if there is a response.
        } else {
            console.warn("[WARN] No \"expect\" test. \n")
            console.log("Test Succeeded!\n");
            console.log("Response :")
            console.log(resp.data)
        }
        return 0;
    // Test fails if request failed.
    }).catch(err => {
        console.error("Test failed!")
        console.error(err.message);
        return 1;
    });
}
