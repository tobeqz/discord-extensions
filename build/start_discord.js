"use strict";
exports.__esModule = true;
var child_process = require("child_process");
function start_discord() {
    child_process.spawn("discord &", { shell: true, detached: true });
}
exports["default"] = start_discord;
//# sourceMappingURL=start_discord.js.map