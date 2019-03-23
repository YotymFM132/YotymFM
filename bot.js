const discord = require("discord.js");
const botConfig = require("./botconfig.json");

const fs = require("fs");

const active = new Map();

const bot = new discord.Client();
bot.commands = new discord.Collection();


fs.readdir("./commands/", (err, files) => {

  if (err) console.log(err);

  var jsFiles = files.filter(f => f.split(".").pop() === "js");

  if (jsFiles.length <= 0) {
    console.log("Kon geen files vinden");
    return;
  }

  jsFiles.forEach((f, i) => {

    var fileGet = require(`./commands/${f}`);
    console.log(`De file ${f} is geladen`);

    bot.commands.set(fileGet.help.name, fileGet);

  })

 bot.on("guildMemberAdd", member => {

        var role = member.guild.roles.find("name", "Yotym - Members");
        
        if (!role) return;
       
     
        member.addRole(role);
     
        const channel = member.guild.channels.find("name", "welkom");
     
        if(!channel) return;
     
        channel.send(`Hey, ${member} Welkom in Yotym!`);
    });


});


bot.on("ready", async () => {

  console.log(`${bot.user.username} is online!`)

  bot.user.setActivity("https://www.twitch.tv/YotymFM", { type: "STREAMING" });

})

bot.on("message", async message => { 

  // Als een bot bericht stuurt stuur dan return
  if (message.author.bot) return;

  if (message.channel.type === "dm") return;

  var prefix = botConfig.prefix;

  var messageArray = message.content.split(" ");

  var command = messageArray[0];

  var arguments = messageArray.slice(1);

  var commands = bot.commands.get(command.slice(prefix.length));


  var options = {
    active: active
  }


  if (commands) commands.run(bot, message, arguments, options);

});

bot.login(process.env.BOT_TOKEN);

