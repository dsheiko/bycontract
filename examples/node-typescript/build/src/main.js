"use strict";
const { validate, config } = require("bycontract");
validate(1, "number|string");
console.log(`validate( 1, "number|string" ); - fine`);
try {
    validate(null, "number|string");
}
catch (err) {
    console.log(`validate( null, "number|string" ); - throws ${err.message}`);
}
config({ enable: false });
try {
    validate(null, "number|string");
    console.log(`validate( null, "number|string" ); `
        + `- throws nothing when validate.isEnabled = false`);
}
catch (err) {
    console.log(`fail`);
}
//# sourceMappingURL=main.js.map