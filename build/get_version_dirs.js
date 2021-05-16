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
var os = require("os");
var fs = require("fs/promises");
var path = require("path");
var sqlite = require("sqlite3");
var get_config_dir_1 = require("./get_config_dir");
function get_version_dirs() {
    var _this = this;
    return new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
        var config_dir, discord_config_dir, err_1, own_config_stat, build_info_raw, build_info, discord_version_dirs, home_dir, install_dir_1, installer_db, db;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!(os.platform() == 'linux')) return [3, 8];
                    config_dir = get_config_dir_1["default"]();
                    discord_config_dir = path.join(config_dir, "discord");
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 5]);
                    return [4, fs.stat(config_dir)];
                case 2:
                    _a.sent();
                    return [3, 5];
                case 3:
                    err_1 = _a.sent();
                    return [4, fs.mkdir(config_dir)];
                case 4:
                    _a.sent();
                    return [3, 5];
                case 5: return [4, fs.stat(config_dir)];
                case 6:
                    own_config_stat = _a.sent();
                    if (!own_config_stat.isDirectory()) {
                        throw new Error("Config directory is not a directory at: " + config_dir);
                    }
                    return [4, fs.readFile("/usr/lib/discord/build_info.json", "utf8")];
                case 7:
                    build_info_raw = _a.sent();
                    build_info = JSON.parse(build_info_raw);
                    discord_version_dirs = [
                        path.join(discord_config_dir, build_info.version)
                    ];
                    resolve(discord_version_dirs);
                    return [3, 9];
                case 8:
                    if (os.platform() == "win32") {
                        home_dir = os.homedir();
                        install_dir_1 = path.join(home_dir, "AppData", "Local", "Discord");
                        installer_db = path.join(install_dir_1, "installer.db");
                        console.log(installer_db);
                        db = new sqlite.Database(installer_db, sqlite.OPEN_READONLY);
                        db.each("SELECT * FROM key_values", function (err, row) {
                            var key = row.key;
                            var raw_json = row.value;
                            if (key == "host/app/stable/win/x86") {
                                var version_data = JSON.parse(raw_json);
                                var version_array = version_data[0].host_version.version;
                                var version_string = version_array.reduce(function (prev, curr) { return prev + curr.toString() + "."; }, "app-");
                                version_string = version_string.substring(0, version_string.length - 1);
                                var version_dir = path.join(install_dir_1, "" + version_string);
                                console.log(version_array, version_string, version_dir);
                                resolve([version_dir]);
                            }
                        });
                    }
                    else {
                        throw new Error("Unsupported platform");
                    }
                    _a.label = 9;
                case 9: return [2];
            }
        });
    }); });
}
exports["default"] = get_version_dirs;
//# sourceMappingURL=get_version_dirs.js.map