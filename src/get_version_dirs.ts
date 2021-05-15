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

    // Get discord version directory
    const items_in_discord_cfg = await fs.readdir(discord_config_dir)

    const discord_version_dirs: string[] = []
    // Find directory with another directory called modules in it
    for (const item of items_in_discord_cfg) {
        const full_path = path.join(discord_config_dir, item)
        const stats = await fs.stat(full_path) 
        
        if (!stats.isDirectory()) {
            continue
        }
        
        const inner_items = await fs.readdir(full_path)

        if (inner_items[0] !== "modules") {
            continue
        }

        discord_version_dirs.push(full_path)
    }

    if (discord_version_dirs.length === 0) {
        throw new Error("Could not find discord installs in" + path.join(discord_config_dir))
    }
    
    return discord_version_dirs
}
