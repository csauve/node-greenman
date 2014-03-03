greenman
========
An IRC bot built on node-irc and inspired by [phenny](https://github.com/sbp/phenny) and [DEEbot](https://github.com/DEElekgolo/DEEbot).

This project is still a work in progress.

### To-Do
* Make sure all modules work in a sane way across multiple channels
* Add more modules, get feedback on existing ones from our channel
* Introduce anti-spam measures on both input and output side
* Allow greenman to ignore certain IRC users (bots)
* Figure out how to reload dependent modules when a dependency module is reloaded
* Improve rcon module
* Add logging and web interface

### Installation
1. Clone or export this repository
2. Edit config.js and any module-specific configuration (such as modules/rcon.js)
3. npm install
4. node greenman.js

### Remote Control
Greenman can be issued commands over private message if the rcon module is enabled (it is by default). The rcon password is configured near the head of rcon.js. Private message commands take the general form: .rcon <password> <command>. Here are some examples:
* .rcon <password> load reminders *(loads or reloads the reminders module)*
* .rcon <password> unload tell *(unloads the tell module)*
* .rcon <password> join #channel *(joins the channel on the currently connected server)*
* .rcon <password> getconfig cmdPrefix *(returns the value of a configuration path)*
* .rcon <password> setconfig rcon.password newpassword *(sets the value of a configuration path)*
