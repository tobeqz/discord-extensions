import * as fs from "fs/promises"
import * as path from "path"
import get_config_dir from "./get_config_dir"

export default async function get_version_dirs() {
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
    
    return discord_version_dirs
}
