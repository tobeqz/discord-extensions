import * as psList from "ps-list"
import * as fkill from "fkill"
import * as os from "os"

export default async function kill_discord(): Promise<void> {

    const procs = await psList() 
    const electron_procs = procs.filter(proc => proc.name == "electron")
    const regex_q = /[d|D]iscord/

    for (const proc of electron_procs) {
        if (proc.cmd.match(regex_q)) {
            try {
                await fkill(proc.pid)
            } catch {}
        }
    }
}
