plugdj-node-basicbot
==============

A [Plug.dj](https://plug.dj/) bot which allow you to do multiple moderations actions faster. It also moderate the room when no admins are here. It is open-source so you can edit it like you want.

## How to use it ?

### Using Github:
* The bot needs [Node.js](http://nodejs.org/) to work.
* The bot uses [PlugAPI](https://github.com/plugCubed/plugAPI) so you'll need it before running the bot.
* After that, you need to download the bot repository. nodebot.js and config.json are necessary. 
* Now, open the EXAMPLEconfig.json file and add the name of your room (only the name __without the /__ ), the email of the bot account and it password.
* Rename EXAMPLEconfig.json to config.json and save. You can use *node nodebot.js* or the included .bat file to start the bot.
* The bot should now be connected to your room and will detect commands starting by __!__

_IMPORTANT_: Make sure you've edited the config.json to add the bot's account informations and the room name
```
{
    "email": "",
    "password": "",
    "room": "" // Room name here (https://plug.dj/crazy-kiwix will be crazy-kiwix)
}
// If you have a HTTP 401 error, your user/pass is incorrect
```

___Note___: If you want to automatically restart the bot on crash, you can use [forever](https://github.com/indexzero/forever) or [pm2](https://github.com/Unitech/pm2).


## License
__This bot is under GNU GENERAL PUBLIC LICENSE, more informations [here](https://github.com/Moutard3/plugdj-nodebot/blob/master/LICENSE)__
