# discord-extensions
Easily add chrome extensions to your discord install. Currently only supports linux, although windows support is coming soon.

## Installing
I'll upload this package to npm some time, I want to support windows first, though. In the meantime this will work fine.
```
git clone https://github.com/tobeqz/discord-extensions.git
cd discord-extensions
npm install
npm run build
npm link
```

## How to use
First, follow the instructions above.
Create a folder called `discord-extensions` in your config folder
```
mkdir ~/.config/discord-extensions
```
Then place any extensions you want discord to load in that folder.

To patch discord to load your extensions, you will need to run the following command:
```
discord-extensions patch
```
You will need to rerun this command when discord updates.

### Commands
```
discord-extensions patch
```
This will patch your discord installation to load the extensions under ~/.config/discord-extensions.


```
discord-extensions unpatch
```
This will remove the patch from your discord installation, in fact, discord will do a clean reinstall after you run this command and restart.
