import * as path from 'path'
import * as fs from "fs/promises"
import * as os from "os"
import { nanoid } from "nanoid"
import * as asar from "asar"

import get_config_dir from "./get_config_dir"
import get_version_dirs from "./get_version_dirs"

async function get_temp_dir(): Promise<string> {
    const temp_dir = path.join(os.tmpdir(), "discord-extensions")

    let dir_exists = false

    try {
        await fs.stat(temp_dir)
        dir_exists = true
    } catch {}

    if (!dir_exists) {
        fs.mkdir(path.join(temp_dir))
    }

    const random_patch_id = nanoid()
    const patch_dir = path.join(temp_dir, random_patch_id)
    await fs.mkdir(patch_dir)

    return patch_dir
}

export default async function patch() {
    const config_dir = get_config_dir()
    const own_config_dir = path.join(config_dir, "discord-extensions")
    const discord_version_dirs = await get_version_dirs()

    
    const patch = `_electron.app.whenReady().then(async () => {
        const config_dir = "${own_config_dir}" 
        const main_session = mainWindow.webContents.session
        _fs.default.readdir(config_dir, async (err, dirs) => {
            if (err) { throw err }
            for (const dir_name of dirs) {
                const full_dir_name = _path.default.join(config_dir, dir_name) 
                await main_session.loadExtension(full_dir_name)
            }
        })
    })
    `
    // Patch each installed version
    dirLoop: for (const version_dir of discord_version_dirs) {
        console.log("Patching", version_dir)
        // Get disocrd binary (asar)
        const discord_pkg_path = path.join(version_dir, "modules", "discord_desktop_core", "core.asar")

        // Get dedicated directory for this patch
        const temp_dir = await get_temp_dir()

        // Extract the binary to temp_dir/core
        asar.extractAll(discord_pkg_path, path.join(temp_dir, "core"))
        const extracted_archive = path.join(temp_dir, "core")
        
        const mainscreen_path = path.join(extracted_archive, "app", "mainScreen.js")
        const old_mainscreen = await fs.readFile(mainscreen_path, 'utf8')
        const old_mainscreen_lines = old_mainscreen.split("\n")
        let line_to_insert_patch: number;

        // Find correct line
        for (let line_num = 0; line_num < old_mainscreen_lines.length; line_num++) {
            const line_content = old_mainscreen_lines[line_num].trim()

            if (line_content == "_electron.screen.on('display-added', handleDisplayChange);") {
                line_to_insert_patch = line_num

                // Check if this was already patched
                const previous_line = old_mainscreen_lines[line_to_insert_patch - 1] 
                if (previous_line.trim() == "}") {
                    console.warn(version_dir, "was already patched")
                    continue dirLoop
                }

                break
            }
        }

        if (!line_to_insert_patch) {
            throw new Error("Could not find line to insert patch at, please contact the maintainers of this program.")
        }

        const old_first_slice = old_mainscreen_lines.slice(0, line_to_insert_patch)                
        const old_last_slice = old_mainscreen_lines.slice(line_to_insert_patch, old_mainscreen_lines.length)
        
        let patched_mainscreen = ""

        // Turn first half back into string and insert
        patched_mainscreen += old_first_slice.reduce((prev, curr) => prev += curr + "\n", "")

        // Insert patch
        patched_mainscreen += patch

        // Turn latter half back into string and insert
        patched_mainscreen += old_last_slice.reduce((prev, curr) => prev += curr + '\n', "")

        // Write this patched package to the one discord will load
        await fs.writeFile(mainscreen_path, patched_mainscreen)

        // Repackage the patched archive and overwrite the default core.asar
        await asar.createPackage(extracted_archive, discord_pkg_path)

        console.log("Successfully patched", version_dir)
    }
}

