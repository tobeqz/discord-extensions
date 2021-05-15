"use strict";
exports.__esModule = true;
var path = require("path");
function get_config_dir() {
    var home = process.env.HOME;
    return path.join(home, ".config");
}
exports["default"] = get_config_dir;
//# sourceMappingURL=get_config_dir.js.map