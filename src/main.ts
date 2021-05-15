import * as yargs from 'yargs'
import patch from './patch'
import unpatch from "./unpatch"

yargs
    .scriptName("discord-extensions")
    .usage("$0 <cmd> [args]")
    .command(
        "patch",
        "patch discord to load extensions in config directory",
        patch
    )
    .command(
        "unpatch",
        "unpatch to go back to stock discord",
        unpatch
    )
    .help()
    .argv
