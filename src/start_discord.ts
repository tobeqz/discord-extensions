import * as child_process from "child_process"

export default function start_discord() {
    child_process.spawn("discord &", {shell: true, detached: true})
}
