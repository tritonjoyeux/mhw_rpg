# MHW RPG


#### Requirements
Packages|Version
---|---
nodejs|9.2.0
npm|6.1.0
pm2(optional)|2.8.0 

#### Installation

`git clone https://github.com/tritonjoyeux/mhw_rpg.git` in the folder you want.

`cd mhw_rpg`

`npm i`

#### Setting up

- Create a `bckp` folder at the root of the project and create a `game.txt` file in this folder.
- Rename the `config.dist.json` in `config.json` and update it with your bot information. 
- To get your bot token go to `https://discordapp.com/developers/applications/me` and create or select your bot.
- If you have created a new one, make sure the app is now a bot by clicking on the button.
- Your token is at the end of the page

#### Run your bot

`node index.js` or `pm2 start index.js --name="mhw"`

#### Then ?

Enjoy :)

Features|Status
---|---
Fight|Done
Timer|Done
Expe|Done
Drop|Done
Buy|Done
Leveling|Done
Monsters Implementation|Todo
Armors and Weapons implementations|Todo