const { Client, MessageEmbed } = require('discord.js');

module.exports = {
  name: "test", 
  alias: [],
  timeout: 2000, 
async execute (client, message, args){

if (message.author.id !== '379347892479066123') return;

      let embed = new MessageEmbed()
      .setDescription("Simulando Entrada al Servidor " + message.author.username)
      .setColor("RANDOM")
      message.channel.send({ embeds: [embed] });
  
    client.emit(
      "guildMemberAdd",
      message.member || (await message.guild.fetchMember(message.author))
    );

  }

}