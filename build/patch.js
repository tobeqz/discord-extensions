"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var path = require("path");
var fs = require("fs/promises");
var os = require("os");
var nanoid_1 = require("nanoid");
var asar = require("asar");
var process = require("process");
var get_config_dir_1 = require("./get_config_dir");
var get_version_dirs_1 = require("./get_version_dirs");
var kill_discord_1 = require("./kill_discord");
var start_discord_1 = require("./start_discord");
function get_temp_dir() {
    return __awaiter(this, void 0, void 0, function () {
        var temp_dir, dir_exists, _a, random_patch_id, patch_dir;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    temp_dir = path.join(os.tmpdir(), "discord-extensions");
                    dir_exists = false;
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 3, , 4]);
                    return [4, fs.stat(temp_dir)];
                case 2:
                    _b.sent();
                    dir_exists = true;
                    return [3, 4];
                case 3:
                    _a = _b.sent();
                    return [3, 4];
                case 4:
                    if (!dir_exists) {
                        fs.mkdir(path.join(temp_dir));
                    }
                    random_patch_id = nanoid_1.nanoid();
                    patch_dir = path.join(temp_dir, random_patch_id);
                    return [4, fs.mkdir(patch_dir)];
                case 5:
                    _b.sent();
                    return [2, patch_dir];
            }
        });
    });
}
function patch() {
    return __awaiter(this, void 0, void 0, function () {
        var config_dir, own_config_dir, discord_version_dirs, double_escaped_path, patch, _i, discord_version_dirs_1, version_dir, discord_pkg_path, temp_dir, extracted_archive, mainscreen_path, old_mainscreen, old_mainscreen_lines, line_to_insert_patch, line_num, line_content, previous_line, old_first_slice, old_last_slice, patched_mainscreen;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4, kill_discord_1["default"]()];
                case 1:
                    _a.sent();
                    config_dir = get_config_dir_1["default"]();
                    own_config_dir = path.join(config_dir, "discord-extensions");
                    return [4, get_version_dirs_1["default"]()];
                case 2:
                    discord_version_dirs = _a.sent();
                    console.log(discord_version_dirs);
                    double_escaped_path = own_config_dir.split("\\").reduce(function (prev, curr) { return prev + curr + "\\\\"; }, "");
                    patch = "_electron.app.whenReady().then(async () => {\n        const config_dir = \"" + double_escaped_path + "\"\n        const main_session = mainWindow.webContents.session\n        _fs.default.readdir(config_dir, async (err, dirs) => {\n            if (err) { throw err }\n            for (const dir_name of dirs) {\n                const full_dir_name = _path.default.join(config_dir, dir_name) \n                await main_session.loadExtension(full_dir_name)\n            }\n        })\n    })\n    ";
                    _i = 0, discord_version_dirs_1 = discord_version_dirs;
                    _a.label = 3;
                case 3:
                    if (!(_i < discord_version_dirs_1.length)) return [3, 9];
                    version_dir = discord_version_dirs_1[_i];
                    console.log("Patching", version_dir);
                    discord_pkg_path = void 0;
                    if (os.platform() === 'linux') {
                        discord_pkg_path = path.join(version_dir, "modules", "discord_desktop_core", "core.asar");
                    }
                    else if (os.platform() === 'win32') {
                        discord_pkg_path = path.join(version_dir, "modules", "discord_desktop_core-1", "discord_desktop_core", "core.asar");
                    }
                    return [4, get_temp_dir()];
                case 4:
                    temp_dir = _a.sent();
                    asar.extractAll(discord_pkg_path, path.join(temp_dir, "core"));
                    extracted_archive = path.join(temp_dir, "core");
                    mainscreen_path = path.join(extracted_archive, "app", "mainScreen.js");
                    return [4, fs.readFile(mainscreen_path, 'utf8')];
                case 5:
                    old_mainscreen = _a.sent();
                    old_mainscreen_lines = old_mainscreen.split("\n");
                    line_to_insert_patch = void 0;
                    for (line_num = 0; line_num < old_mainscreen_lines.length; line_num++) {
                        line_content = old_mainscreen_lines[line_num].trim();
                        if (line_content == "_electron.screen.on('display-added', handleDisplayChange);") {
                            line_to_insert_patch = line_num;
                            previous_line = old_mainscreen_lines[line_to_insert_patch - 1];
                            if (previous_line.trim() == "}") {
                                console.warn(version_dir, "was already patched");
                                return [3, 8];
                            }
                            break;
                        }
                    }
                    if (!line_to_insert_patch) {
                        throw new Error("Could not find line to insert patch at, please contact the maintainers of this program.");
                    }
                    old_first_slice = old_mainscreen_lines.slice(0, line_to_insert_patch);
                    old_last_slice = old_mainscreen_lines.slice(line_to_insert_patch, old_mainscreen_lines.length);
                    patched_mainscreen = "";
                    patched_mainscreen += old_first_slice.reduce(function (prev, curr) { return prev += curr + "\n"; }, "");
                    patched_mainscreen += patch;
                    patched_mainscreen += old_last_slice.reduce(function (prev, curr) { return prev += curr + '\n'; }, "");
                    return [4, fs.writeFile(mainscreen_path, patched_mainscreen)];
                case 6:
                    _a.sent();
                    return [4, asar.createPackage(extracted_archive, discord_pkg_path)];
                case 7:
                    _a.sent();
                    console.log("Successfully patched", version_dir);
                    start_discord_1["default"]();
                    process.exit(0);
                    _a.label = 8;
                case 8:
                    _i++;
                    return [3, 3];
                case 9: return [2];
            }
        });
    });
}
exports["default"] = patch;
//# sourceMappingURL=patch.js.map