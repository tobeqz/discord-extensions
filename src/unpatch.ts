import * as fs from "fs/promises"
import * as process from "process"

import get_version_dirs from "./get_version_dirs"
import kill_discord from "./kill_discord"
import start_discord from "./start_discord"

function returnTimeout(timeout: number): Promise<void> {
    return new Promise(resolve => {
        setTimeout(resolve, timeout)
    })
}

export default async function unpatch() {
    await kill_discord()
    const versions = await get_version_dirs()

    for (const version_dir of versions) {
        console.log("Deleting", version_dir, "in 5 seconds")
        console.log("5")
        await returnTimeout(1000)
        console.log("4")
        await returnTimeout(1000)
        console.log("3")
        await returnTimeout(1000)
        console.log("2")
        await returnTimeout(1000)
        console.log("1")
        await returnTimeout(1000)
        await fs.rm(version_dir, { recursive: true })
        console.log("Successfully deleted")
    }

    start_discord()
    process.exit(0)
}
