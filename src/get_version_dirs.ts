import * as os from "os"
import * as fs from "fs/promises"
import * as path from "path"

import * as sqlite from "sqlite3"

import get_config_dir from "./get_config_dir"

export default function get_version_dirs(): Promise<string[]> {
    return new Promise(async (resolve, reject) => {
        if (os.platform() == 'linux') {
            const config_dir = get_config_dir()
            const discord_config_dir = path.join(config_dir, "discord")

            // Create config dir if it does not exist
            try {
                await fs.stat(config_dir)
            } catch (err) {
                await fs.mkdir(config_dir)
            }

            // Check if config dir is a dir
            const own_config_stat = await fs.stat(config_dir)
            if (!own_config_stat.isDirectory()) {
                throw new Error("Config directory is not a directory at: " + config_dir)
            }

            // Get discord build info
            // TODO: This does not work on windows
            const build_info_raw = await fs.readFile("/usr/lib/discord/build_info.json", "utf8")
            // TODO: Check for Canary and ask which install the user wants to patch
            const build_info = JSON.parse(build_info_raw) as { releaseChannel: string, version: string }

            const discord_version_dirs: string[] = [
                path.join(discord_config_dir, build_info.version)
            ]

            resolve(discord_version_dirs)
        } else if (os.platform() == "win32") {
            // Get discord install directory
            const home_dir = os.homedir()
            const install_dir = path.join(home_dir, "AppData", "Local", "Discord")
            const installer_db = path.join(install_dir, "installer.db")
            console.log(installer_db)

            // Load database
            const db = new sqlite.Database(installer_db, sqlite.OPEN_READONLY)

            // Read database to find latest version
            // TODO: THIS IS SHAKY AS HELL LOL
            db.each("SELECT * FROM key_values", function(err, row) {
                const key = (row as {key: string, value: string}).key
                const raw_json = (row as {key: string, value: string}).value

                if (key == "host/app/stable/win/x86") {
                    const version_data = JSON.parse(raw_json) as any
                    
                    const version_array = version_data[0].host_version.version
                    let version_string: string = version_array.reduce((prev:string, curr:number) => prev + curr.toString() + ".", "app-")
                    version_string = version_string.substring(0, version_string.length-1)
                    const version_dir = path.join(install_dir, `${version_string}`)

                    console.log(version_array,version_string,version_dir)
                    resolve([version_dir])
                }
            })

        } else {
            throw new Error("Unsupported platform")
        }
    })    
}
