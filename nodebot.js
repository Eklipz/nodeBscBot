var PlugAPI = require('plugapi');
var config = require('./config.json');
var bot = new PlugAPI({"email": config.email, "password": config.password});// If you have a HTTP 401 error, your user/pass is incorrect

/***************************************************************************
******************************** SETTINGS **********************************
***************************************************************************/

var botName = "NodeBot";
var botVersion = "1.66";
var VoteSkip = 0;
var Skippers = "";
var currentDj = null;
var cmdCooldown = 0;
var cmdDeletion = true;
var userCommand = true;
var crashOnRestart = false;
var chatPrefix = "/me ";
var autoWoot = true;
var gamesEnable = true; // I'll expand on this more later
var consoleReLog = true; // Enable to have online console viewer. http://console.re/
var launchTime = null;
var maximumAfk = 120;

// Auto Messages
var autoDisable = false;
var autoDiscord = false;
var autoFav = false;
var autoRoulette = false;
var autoRules = false;

bot.multiline = true;
var consolere = require('console-remote-client').connect('console.re',config.consolePort,config.consoleExt);

bot.connect(config.room);

/* === Events Handling === */
bot.on('roomJoin', function(room) {
    console.re.log("Succefully joined "+config.room);
    bot.sendChat(botName+" v"+botVersion+" loaded.");
    if (launchTime === null) {
        launchTime = Date.now();
    }

    setInterval(function () { if(autoDisable === true) { bot.sendChat("!afkdisable"); }}, 1000 * 60 * 60);
    setInterval(function () { if(autoDisable === true) { bot.sendChat("!joindisable"); }}, 1000 * 60 * 61);
    setInterval(function () { if(autoRoulette === true) { bot.sendChat("!roulette"); }}, 1000 * 60 * 10);
    setInterval(function () { if(autoFav === true) { bot.sendChat("!fav"); }}, 1000 * 60 * 12);
    setInterval(function () { if(autoRules === true) { bot.sendChat("!rules"); }}, 1000 * 60 * 14);
    setInterval(function () { if(autoDiscord === true) { bot.sendChat("!discord"); }}, 1000 * 60 * 16);


});
bot.on('close', function(){
    bot.connect(config.room);
    if(consoleReLog){
        console.re.log("Connection Closed.");
    }
});
bot.on('error', function(){
    bot.connect(config.room);
    if(consoleReLog){
        console.re.log("An Error Occured!");
    }
});

bot.on('chat', function (msg) {
    if(msg.command !== undefined) {
        command(msg.command, msg.args, msg.from.username, msg.from.id, msg.id, msg.from.role);
        if(consoleReLog){
            console.re.log("Command Issued: "+msg.from.username+" used "+msg.command);
        }
    }
});
bot.on('advance', function(dj) {
    VoteSkip = 0;
    Skippers = "";
    if(autoWoot === true) {bot.woot();}
});
bot.on('userLeave', function(usr) {
    if(Skippers.indexOf(usr.id) != -1) {
        Skippers.replace(" "+usr.id, "");
        VoteSkip--;
    }
    if(consoleReLog){
        console.re.log(usr+" left.");
    }
});

/*This doesn't work. Not sure why... v_v
bot.on('userJoin', function(usr) {
    if(consoleReLog){
        console.re.log(usr+" joined."); 
    }
});
*/
bot.on('modBan', function(ban) {
    switch(ban.duration) {
        case 60:
            strTime = "an hour";
            break;
        case 1440:
            strTime = "a day";
            break;
        default:
            strTime = "permanent";
    }
    switch(ban.reason) {
        case 2:
            strReason = "offensive/abusive language";
            break;
        case 3:
            strReason = "bad quality songs";
            break;
        case 4:
            strReason = "bad theme songs";
            break;
        case 5:
            strReason = "negative attitude";
            break;
        default:
            strReason = "Spam/Troll";
    }
    bot.sendChat(ban.username+" has been banned "+strTime+" because of "+strReason+".");
    if(consoleReLog){
        console.re.log(ban.username+" has been banned "+strTime+" because of "+strReason+".");
    }
});

bot.on("advance", function(data) {
    if (data.media !== null) {
        bot.getHistory(function(history) {
            for (var i in history) {
                if (history.hasOwnProperty(i)) {
                    if (history[i].id == data.media.id) {
                        var skippedDJ = bot.getDJ();
                        bot.moderateForceSkip();
                        bot.sendChat("/me Song skipped because it was in history!");
                        if(consoleReLog){
                            console.re.log(skippedDJ+" tried to play a recent song.");
                        }
                    }
                }
            }
        });
    }


/***************************************************************************
******************************** COMMANDS **********************************
***************************************************************************/

function command(cmd,args,un,uid,cid, rank) {
    
    var currentDj = bot.getDJ();
    if (cmdDeletion === true){
        bot.moderateDeleteChat(cid);
    }
    /*###################################
    ######## Informative Commands #######
    ###################################*/

                                                                                    /* I DEFININTELY WANT TO MOVE
                                                                                    MOST OF THIS TEXT TO AN EXTERNAL
                                                                                    FILE FOR EASIER EDITING AND
                                                                                    LESS CLUTTER. TODO */

        //////////////////// ABUSE \\\\\\\\\\\\\\\\\\\\
        if (cmd.toLowerCase() === "abuse" && userCommand === true) {
            bot.sendChat(chatPrefix+"Please do not abuse the !dc command. !dc is for when you have internet issues; Not for when you leave to go to another community and or leave to go do something else.");
            userCommand = false;
            setTimeout(function(){ userCommand = true; }, cmdCooldown * 1000);
        }
        //////////////////// ADMIN \\\\\\\\\\\\\\\\\\\\
        if (cmd.toLowerCase() === "admin" && userCommand === true) {
            bot.sendChat(chatPrefix+"Admin is a rank on plug.dj that only a few select people have, they are developers for plug.dj that work on the site.");
            userCommand = false;
            setTimeout(function(){ userCommand = true; }, cmdCooldown * 1000);
        }
        //////////////////// ALLBOTSTUFF \\\\\\\\\\\\\\\\\\\\
        if (cmd.toLowerCase() === "allbotstuff" && userCommand === true) {
            bot.sendChat(chatPrefix+"Everything to do with the room and bot: https://goo.gl/At5qWh");
            userCommand = false;
            setTimeout(function(){ userCommand = true; }, cmdCooldown * 1000);
        }
        //////////////////// APPEAR \\\\\\\\\\\\\\\\\\\\
        if (cmd.toLowerCase() === "appear" && userCommand === true) {
            bot.sendChat(chatPrefix+"Feel like talking with us, maybe showing your face, join here: https://appear.in/its-a-trap-and-edm");
            userCommand = false;
            setTimeout(function(){ userCommand = true; }, cmdCooldown * 1000);
        }
        //////////////////// AUTO WOOT \\\\\\\\\\\\\\\\\\\\
        if (cmd.toLowerCase() === "autowoot" && userCommand === true) {
            bot.sendChat(chatPrefix+"We recommend using RCS for auto wooting. You can find out more here: https://rcs.radiant.dj/");
            userCommand = false;
            setTimeout(function(){ userCommand = true; }, cmdCooldown * 1000);
        }
        //////////////////// BRAND AMBASSADOR \\\\\\\\\\\\\\\\\\\\
        if (cmd.toLowerCase() === "ba" && userCommand === true) {
            bot.sendChat(chatPrefix+"A Brand Ambassador is the voice of the plug.dj users. They promote events, engage the community, and share the plug.dj message around the world. For more info: https://plug.dj/ba");
            userCommand = false;
            setTimeout(function(){ userCommand = true; }, cmdCooldown * 1000);
        }
        //////////////////// COMMANDS \\\\\\\\\\\\\\\\\\\\
        else if (cmd.toLowerCase() === "commands" && cmdCooldown === 0) {
            bot.sendChat(chatPrefix+"The commands are available here: https://git.io/ve1L9");
            userCommand = false;
            setTimeout(function(){ userCommand = true; }, cmdCooldown * 1000);
        }
        //////////////////// DCINFO \\\\\\\\\\\\\\\\\\\\
        else if (cmd.toLowerCase() === "dcinfo" && cmdCooldown === 0) {
            bot.sendChat(chatPrefix+"Do !dc if you have recently disconnected to get your position on the waitlist back!");
            userCommand = false;
            setTimeout(function(){ userCommand = true; }, cmdCooldown * 1000);
        }
        //////////////////// DISCORD \\\\\\\\\\\\\\\\\\\\
        else if (cmd.toLowerCase() === "discord" && cmdCooldown === 0) {
            bot.sendChat(chatPrefix+"We have a discord room! You can come and chat with us here: https://discord.gg/0oAkP2A4t9ryA7Yh");
            userCommand = false;
            setTimeout(function(){ userCommand = true; }, cmdCooldown * 1000);
        }
        //////////////////// DJCYCLEINFO \\\\\\\\\\\\\\\\\\\\
        else if (cmd.toLowerCase() === "djcycleinfo" && cmdCooldown === 0) {
            bot.sendChat(chatPrefix+"Djcycle is a setting that automatically adds you back onto the waitlist after playing a song. If it's disabled you will have to manually add yourself back.");
            userCommand = false;
            setTimeout(function(){ userCommand = true; }, cmdCooldown * 1000);
        }
        //////////////////// DUBTRACK \\\\\\\\\\\\\\\\\\\\
        else if (cmd.toLowerCase() === "dubtrack" && cmdCooldown === 0) {
            bot.sendChat(chatPrefix+"Remember to bookmark our Dubtrack room so if Plug.dj is down you can still hang out with us, it can be found here: https://www.dubtrack.fm/join/its-a-trap-and-edm");
            userCommand = false;
            setTimeout(function(){ userCommand = true; }, cmdCooldown * 1000);
        }
        //////////////////// EMOJI \\\\\\\\\\\\\\\\\\\\
        else if (cmd.toLowerCase() === "emoji" && cmdCooldown === 0) {
            bot.sendChat(chatPrefix+"Emoji list: http://www.emoji-cheat-sheet.com/");
            userCommand = false;
            setTimeout(function(){ userCommand = true; }, cmdCooldown * 1000);
        }
        //////////////////// FAV \\\\\\\\\\\\\\\\\\\\
        else if (cmd.toLowerCase() === "fav" && cmdCooldown === 0) {
            bot.sendChat(chatPrefix+"Remember to click the star in the top bar to favorite this room!! http://i.imgur.com/chNflCb.png");
            userCommand = false;
            setTimeout(function(){ userCommand = true; }, cmdCooldown * 1000);
        }
        //////////////////// HELP \\\\\\\\\\\\\\\\\\\\
        else if (cmd.toLowerCase() === "help" && cmdCooldown === 0) {
            bot.sendChat(chatPrefix+"The commands are available here: https://git.io/vKvpm");
            userCommand = false;
            setTimeout(function(){ userCommand = true; }, cmdCooldown * 1000);
        }
        //////////////////// GUIDELINES \\\\\\\\\\\\\\\\\\\\
        else if (cmd.toLowerCase() === "guidelines" && cmdCooldown === 0) {
            bot.sendChat(chatPrefix+"Staff Guidelines: http://git.io/vGZFx");
            userCommand = false;
            setTimeout(function(){ userCommand = true; }, cmdCooldown * 1000);
        }
        //////////////////// OP \\\\\\\\\\\\\\\\\\\\
        else if (cmd.toLowerCase() === "op" && cmdCooldown === 0) {
            bot.sendChat(chatPrefix+"OP list: https://git.io/vKG8m");
            userCommand = false;
            setTimeout(function(){ userCommand = true; }, cmdCooldown * 1000);
        }
        //////////////////// PING \\\\\\\\\\\\\\\\\\\\
        else if (cmd.toLowerCase() === "ping" && cmdCooldown === 0) {
            bot.sendChat(chatPrefix+"@"+un+" Pong!");
            userCommand = false;
            setTimeout(function(){ userCommand = true; }, cmdCooldown * 1000);
        }
        //////////////////// QUESTION \\\\\\\\\\\\\\\\\\\\
        else if (cmd.toLowerCase() === "question" && cmdCooldown === 0) {
            bot.sendChat(chatPrefix+"Want to give input to our community, feel free to answer our weekly question: http://www.questionpro.com/t/ALh4WZU4FE");
            userCommand = false;
            setTimeout(function(){ userCommand = true; }, cmdCooldown * 1000);
        }
        //////////////////// REF \\\\\\\\\\\\\\\\\\\\
        else if (cmd.toLowerCase() === "ref" && cmdCooldown === 0) {
            bot.sendChat(chatPrefix+"Having a problem or issue with plug.dj? Try refreshing =)");
            userCommand = false;
            setTimeout(function(){ userCommand = true; }, cmdCooldown * 1000);
        }
        //////////////////// ROULETTEINFO \\\\\\\\\\\\\\\\\\\\
        else if (cmd.toLowerCase() === "rouletteinfo" && cmdCooldown === 0) {
            bot.sendChat(chatPrefix+"Roulette is run every 60 mins, do !join to join when it starts. If you win you get first on the waitlist!");
            userCommand = false;
            setTimeout(function(){ userCommand = true; }, cmdCooldown * 1000);
        }
        //////////////////// RULES \\\\\\\\\\\\\\\\\\\\
        else if (cmd.toLowerCase() === "rules" && cmdCooldown === 0) {
            bot.sendChat(chatPrefix+"The room rules can be found here: https://git.io/vJDsk");
            userCommand = false;
            setTimeout(function(){ userCommand = true; }, cmdCooldown * 1000);
        }
        //////////////////// RULE8 \\\\\\\\\\\\\\\\\\\\
        else if (cmd.toLowerCase() === "rule8" && cmdCooldown === 0) {
            bot.sendChat(chatPrefix+"http://goo.gl/5SNSgo Rule 8: Please don't beg to be part of the community staff.");
            userCommand = false;
            setTimeout(function(){ userCommand = true; }, cmdCooldown * 1000);
        }
        //////////////////// SHUFFLE \\\\\\\\\\\\\\\\\\\\
        else if (cmd.toLowerCase() === "shuffle" && cmdCooldown === 0) {
            bot.sendChat(chatPrefix+"Like other genres than EDM? Then you better be here Monday and Friday Shuffle, any genre is allowed! Shuffle time is run 12am EST till 12am PDT");
            userCommand = false;
            setTimeout(function(){ userCommand = true; }, cmdCooldown * 1000);
        }
        //////////////////// STAFF \\\\\\\\\\\\\\\\\\\\
        else if (cmd.toLowerCase() === "staff" && cmdCooldown === 0) {
            bot.sendChat(chatPrefix+"Tips for trying to get staff: http://git.io/vG7Wj");
            userCommand = false;
            setTimeout(function(){ userCommand = true; }, cmdCooldown * 1000);
        }
        //////////////////// STEAM \\\\\\\\\\\\\\\\\\\\
        else if (cmd.toLowerCase() === "steam" && cmdCooldown === 0) {
            bot.sendChat(chatPrefix+"Use Steam at all? Come join our Steam community: http://steamcommunity.com/groups/plugdjitsaTRAPandEDM");
            userCommand = false;
            setTimeout(function(){ userCommand = true; }, cmdCooldown * 1000);
        }
        //////////////////// SUBINFO \\\\\\\\\\\\\\\\\\\\
        else if (cmd.toLowerCase() === "subinfo" && cmdCooldown === 0) {
            bot.sendChat(chatPrefix+"What are subscriptions? http://goo.gl/Lcw6wX");
            userCommand = false;
            setTimeout(function(){ userCommand = true; }, cmdCooldown * 1000);
        }
        //////////////////// THEME \\\\\\\\\\\\\\\\\\\\
        else if (cmd.toLowerCase() === "theme" && cmdCooldown === 0) {
            bot.sendChat(chatPrefix+"Community Theme: http://en.wikipedia.org/wiki/List_of_electronic_music_genres");
            userCommand = false;
            setTimeout(function(){ userCommand = true; }, cmdCooldown * 1000);
        }
        //////////////////// TWITCH \\\\\\\\\\\\\\\\\\\\
        else if (cmd.toLowerCase() === "twitch" && cmdCooldown === 0) {
            bot.sendChat(chatPrefix+"http://www.twitch.tv/theqtpi");
            userCommand = false;
            setTimeout(function(){ userCommand = true; }, cmdCooldown * 1000);
        }
        //////////////////// TWITCHLIVE \\\\\\\\\\\\\\\\\\\\
        else if (cmd.toLowerCase() === "twitchlive" && cmdCooldown === 0) {
            bot.sendChat(chatPrefix+"TheQTpi is live right now! Come watch her stream with us here: http://www.twitch.tv/theqtpi");
            userCommand = false;
            setTimeout(function(){ userCommand = true; }, cmdCooldown * 1000);
        }
        //////////////////// VERSION \\\\\\\\\\\\\\\\\\\\
        else if (cmd.toLowerCase() === "version" && cmdCooldown === 0) {
            bot.sendChat(chatPrefix+botName+" v"+botVersion+" | Language: Node.js | Authors: Chrisinajar, Benzi, Yemasthui, ureadmyname, N8te");
            userCommand = false;
            setTimeout(function(){ userCommand = true; }, cmdCooldown * 1000);
        }

    /*###################################
    ######### Functional Commands #######
    ###################################*/


        //////////////////// ADD
        else if (cmd.toLowerCase() === "add" && rank>2) {
            if(typeof args[0] === "string" && checkForUser(args[0])) {
                bot.moderateAddDJ(getUser(args[0]).id);
            }
        }
        //////////////////// AFKLIMIT <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< TEST
        else if (cmd.toLowerCase() === "afklimit" && rank>3) {
            if(typeof args[0] === "string" && checkForUser(args[0])) {
                var msg = chat.message;
                if (!args) {
                    bot.sendChat(chatPrefix+"Invalid time supplied.");
                }
                if (!isNaN(args[0])) {
                    maximumAfk = parseInt(limit, 10);
                    bot.sendChat(chatPrefix+"Maximum afk duration set to "+maximumAfk+" minutes.");
                }
                else {
                    bot.sendChat(chatPrefix+"Invalid time supplied.");
                }
            }
        }
        //////////////////// AUTO DISABLE
        else if (cmd.toLowerCase() === "autodisable" && rank>2) {
            if(args[0] === "on") {
                autoDisable = true;
                bot.sendChat(chatPrefix+"AutoDisable Enabled!");
            } else if(args[0] === "off") {
                autoDisable = false;
                bot.sendChat(chatPrefix+"AutoDisable Disabled!");
            } else {
                bot.sendChat(chatPrefix+"Invalid Arguments");
            }
        }
        //////////////////// AUTO DISCORD
        else if (cmd.toLowerCase() === "autodiscord" && rank>2) {
            if(args[0] === "on") {
                autoDiscord = true;
                bot.sendChat(chatPrefix+"AutoDiscord Enabled!");
            } else if(args[0] === "off") {
                autoDiscord = false;
                bot.sendChat(chatPrefix+"AutoDiscord Disabled!");
            } else {
                bot.sendChat(chatPrefix+"Invalid Arguments");
            }
        }
        //////////////////// AUTO FAV
        else if (cmd.toLowerCase() === "autofav" && rank>2) {
            if(args[0] === "on") {
                autoFav = true;
                bot.sendChat(chatPrefix+"AutoFav Enabled!");
            } else if(args[0] === "off") {
                autoFav = false;
                bot.sendChat(chatPrefix+"AutoFav Disabled!");
            } else {
                bot.sendChat(chatPrefix+"Invalid Arguments");
            }
        }

        //////////////////// AUTO ROULETTE
        else if (cmd.toLowerCase() === "autoroulette" && rank>2) {
            if(args[0] === "on") {
                autoRoulette = true;
                bot.sendChat(chatPrefix+"AutoRoulette Enabled!");
            } else if(args[0] === "off") {
                autoRoulette = false;
                bot.sendChat(chatPrefix+"AutoRoulette Disabled!");
            } else {
                bot.sendChat(chatPrefix+"Invalid Arguments");
            }
        }

        //////////////////// AUTO RULES
        else if (cmd.toLowerCase() === "autorules" && rank>2) {
            if(args[0] === "on") {
                autoRules = true;
                bot.sendChat(chatPrefix+"AutoRules Enabled!");
            } else if(args[0] === "off") {
                autoRules = false;
                bot.sendChat(chatPrefix+"AutoRules Disabled!");
            } else {
                bot.sendChat(chatPrefix+"Invalid Arguments");
            }
        }

        //////////////////// BAN (username, time, reason)
        else if(cmd.toLowerCase() === "ban" && rank>2) {
            var time = "f";
            var reason = 1;
            if(typeof args[0] === "string" && checkForUser(args[0])) {
                t = args[1];
                if(t != "f" && t != "d" && t != "h") {
                    time = "f";
                } else {
                    time = t;
                }
                
                if(typeof(args[2]) == "number" && args[2]<6 && args[2]>0) {
                    reason = args[2];
                } else if(typeof(args[2]) === "string") {
                    r = args[2].toLowerCase();
                    if(r === "abuse" || r === "offensive") {
                        reason = 2;
                    } else if(r === "badsong") {
                        reason = 3
                    } else if(r === "badtheme") {
                        reason = 4;
                    } else if(r === "negative") {
                        reason = 5;
                    } else {
                        reason = 1;
                    }
                }
                
                bot.moderateBanUser(getUser(args[0]).id, reason, time);
            }
        }
        //////////////////// LINK
        else if(cmd.toLowerCase() === "link") {
            if(currentDj === uid || rank>0) {
                media = bot.getMedia();
                if(media.format === 1) {
                    var linkToSong = "https://www.youtube.com/watch?v=" + media.cid;
                    bot.sendChat("Current song link: "+linkToSong);
                }
                else if(media.format === 2) {
                    SC.get('/tracks/' + media.cid, function (sound) {
                        bot.sendChat("Current song link: "+sound.permalink_url);
                    });
                }
            }
        }
        //////////////////// RESTART
        else if(cmd.toLowerCase() === "restart" && rank>2) {
            bot.close();
            bot.connect(config.room);
                
            if(crashOnRestart === true) {
                throw "Triggering restart";
            }
        }
        //////////////////// ROCK PAPER SCISSORS *Going to try and minimize this when I figure out how. D:
        else if(cmd.toLowerCase() === "rps" && cmdCooldown === 0) {
            if(!args[0]){
                bot.sendChat(chatPrefix+"[Guide: https://git.io/vKfj8 ] To play Rock Paper Scissors Lizard Spock, use !rps {Choice}");
            } else {
                var choices = ["rock", "paper", "scissors", "lizard", "spock"];
                var botChoice = choices[Math.floor(Math.random()*choices.length)];
                var userChoice = args[0];
                if(botChoice == userChoice){
                    bot.sendChat(chatPrefix+"chose "+botChoice+"! It's a draw!");
                } else if(botChoice == choices[0] && userChoice == choices[1]){
                    bot.sendChat(chatPrefix+"chose "+botChoice+"!");
                } else if(botChoice == choices[0] && userChoice == choices[2]){
                    bot.sendChat(chatPrefix+"chose "+botChoice+"!");
                } else if(botChoice == choices[0] && userChoice == choices[3]){
                    bot.sendChat(chatPrefix+"chose "+botChoice+"!");
                } else if(botChoice == choices[0] && userChoice == choices[4]){
                    bot.sendChat(chatPrefix+"chose "+botChoice+"!");
                } else if(botChoice == choices[1] && userChoice == choices[0]){
                    bot.sendChat(chatPrefix+"chose "+botChoice+"!");
                } else if(botChoice == choices[1] && userChoice == choices[2]){
                    bot.sendChat(chatPrefix+"chose "+botChoice+"!");
                } else if(botChoice == choices[1] && userChoice == choices[3]){
                    bot.sendChat(chatPrefix+"chose "+botChoice+"!");
                } else if(botChoice == choices[1] && userChoice == choices[4]){
                    bot.sendChat(chatPrefix+"chose "+botChoice+"!");
                } else if(botChoice == choices[2] && userChoice == choices[0]){
                    bot.sendChat(chatPrefix+"chose "+botChoice+"!");
                } else if(botChoice == choices[2] && userChoice == choices[1]){
                    bot.sendChat(chatPrefix+"chose "+botChoice+"!");
                } else if(botChoice == choices[2] && userChoice == choices[3]){
                    bot.sendChat(chatPrefix+"chose "+botChoice+"!");
                } else if(botChoice == choices[2] && userChoice == choices[4]){
                    bot.sendChat(chatPrefix+"chose "+botChoice+"!");
                } else if(botChoice == choices[3] && userChoice == choices[0]){
                    bot.sendChat(chatPrefix+"chose "+botChoice+"!");
                } else if(botChoice == choices[3] && userChoice == choices[1]){
                    bot.sendChat(chatPrefix+"chose "+botChoice+"!");
                } else if(botChoice == choices[3] && userChoice == choices[2]){
                    bot.sendChat(chatPrefix+"chose "+botChoice+"!");
                } else if(botChoice == choices[3] && userChoice == choices[4]){
                    bot.sendChat(chatPrefix+"chose "+botChoice+"!");
                } else if(botChoice == choices[4] && userChoice == choices[0]){
                    bot.sendChat(chatPrefix+"chose "+botChoice+"!");
                } else if(botChoice == choices[4] && userChoice == choices[1]){
                    bot.sendChat(chatPrefix+"chose "+botChoice+"!");
                } else if(botChoice == choices[4] && userChoice == choices[2]){
                    bot.sendChat(chatPrefix+"chose "+botChoice+"!");
                } else if(botChoice == choices[4] && userChoice == choices[3]){
                    bot.sendChat(chatPrefix+"chose "+botChoice+"!");
                } else {
                    bot.sendChat(chatPrefix+"Please select between Rock, Paper, Scissors, Lizard, or Spock.");
                }
            }
            
            userCommand = false;
            setTimeout(function(){ userCommand = true; }, cmdCooldown * 1000);
        }
        //////////////////// SKIP
        else if(cmd.toLowerCase() === "skip" && currentDj !== null) {
            if(rank>1 || uid === currentDj.id) {
                bot.moderateForceSkip();
            } else if(bot.getUsers().length>4) {
                if(Skippers.indexOf(uid) === -1) {
                    VoteSkip++;
                    Skippers = Skippers+" "+uid;
                    bot.sendChat(getUser(uid).username+" voted to skip. ("+VoteSkip+"/"+ceil(bot.getUsers().length/2)+").");
                }
                if(VoteSkip>=ceil(bot.getUsers().length/2)) {
                    bot.moderateForceSkip();
                    bot.sendChat("Music skipped by vote.");
                }
            }
        }

        //////////////////// UNBAN
        else if(cmd.toLowerCase() === "unban" && rank>2) {
            if(typeof args[0] === "string" && checkForBannedUser(args[0])) {
                bot.moderateUnbanUser(getBannedUser(args[0]).id);
            }
        }
}

/***************************************************************************
******************************* FUNCTIONS **********************************
***************************************************************************/

// Check if user is in room by username
function checkForUser(u) {
    for (var key in bot.getUsers()) {
        if(bot.getUsers()[key].username.toLowerCase().indexOf(u.toLowerCase()) !== -1) {
            return true;
        }
    }
    return false;
}
// Check if user is banned by username
function checkForBannedUser(u) {
    for (var key in API.getBannedUsers()) {
        if(API.getBannedUsers()[key].username.toLowerCase().indexOf(u.toLowerCase()) !== -1) {
            return true;
        }
    }
    return false;
}
// Get user info by username
function getUser(u) {
    for (var key in bot.getUsers()) {
        if(bot.getUsers()[key].username.toLowerCase().indexOf(u.toLowerCase()) !== -1) {
            return bot.getUsers()[key];
        }
    }
    return null;
}
// Get banned user info by username
function getBannedUser(u) {
    for (var key in API.getBannedUsers()) {
        if(API.getBannedUsers()[key].username.toLowerCase().indexOf(u.toLowerCase()) !== -1) {
            return API.getBannedUsers()[key];
        }
    }
    return null;
}
// AFK and Join Disable
function autoDisableFunc() {
    if (status && autodisable) {
        bot.sendChat('!afkdisable');
        bot.sendChat('!joindisable');
    }
}