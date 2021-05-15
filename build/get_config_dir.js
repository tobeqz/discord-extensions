"use strict";
exports.__esModule = true;
var path = require("path");
var os = require("os");
function get_config_dir() {
    var home = os.homedir();
    return path.join(home, ".config");
}
exports["default"] = get_config_dir;
//# sourceMappingURL=get_config_dir.js.map