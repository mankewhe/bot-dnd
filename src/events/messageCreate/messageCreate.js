const { EmbedBuilder, Collection, Guild } = require('discord.js');

// Configs
const Timeout = new Collection();
const ms = require('ms');
const p = process.env.prefix;

module.exports = async (client, message) => {

    // Say Prefix
    if (!message.content.startsWith(p)) {
        let RegMention = new RegExp(`^<@!?${client.user.id}>( |)$`);
        if (message.content.match(RegMention)) {
            message.channel.send(`El prefix que tengo definido en "${message.guild.name}" es **${p}**`);

        }
        return;
    }

    // Conditionals
    if (message.author.bot || !message.guild || !message.content.startsWith(p)) return;

    const args = message.content.slice(p.length).trim().split(/ +/g);
    const cmd = args.shift().toLowerCase();

    if (!cmd) return;
    if (cmd.length == 0) return;
    let command = client.commands.find((c) => c.name === cmd || c.alias && c.alias.includes(cmd));

    if (command) {
        if (command.timeout) {
            if (Timeout.has(`${command.name}${message.author.id}`)) return message.channel.send(`Debes esperar \`${ms(Timeout.get(`${command.name}${message.author.id}`) - Date.now())}\`.`)
            command.execute(client, message, args)
            Timeout.set(`${command.name}${message.author.id}`, Date.now() + command.timeout)
            setTimeout(() => {
                Timeout.delete(`${command.name}${message.author.id}`)
            }, command.timeout)
        }

        if (!command) return console.log("Error");
    }

};