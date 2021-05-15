#!/usr/bin/env node
"use strict";
exports.__esModule = true;
var yargs = require("yargs");
var patch_1 = require("./patch");
var unpatch_1 = require("./unpatch");
yargs
    .scriptName("discord-extensions")
    .usage("$0 <cmd> [args]")
    .command("patch", "patch discord to load extensions in config directory", patch_1["default"])
    .command("unpatch", "unpatch to go back to stock discord", unpatch_1["default"])
    .help()
    .argv;
//# sourceMappingURL=main.js.map