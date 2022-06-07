"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const app_1 = require("./app");
init();
function init() {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        try {
            app_1.app.listen(3001, () => {
                console.log('Express App Listening on Port 3001');
            });
        }
        catch (error) {
            console.error(`An error occurred: ${JSON.stringify(error)}`);
            process.exit(1);
        }
    });
}
//# sourceMappingURL=server.js.map