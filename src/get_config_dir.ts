import * as path from "path"
import * as os from "os"

export default function get_config_dir() {
    const home = os.homedir();

    return path.join(home, ".config")
}
