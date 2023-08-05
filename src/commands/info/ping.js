const { MessageEmbed } = require('discord.js');

module.exports = {
  name: "ping",
  description: "Muestra el tiempo de respuesta del bot",
  timeout: 2000,
  async execute(client, message, args) {

    let pingemj = function(ping, options) {
      let values = {
        "high": 350,
        "medium": 150,
        "low": 50
      }
      values = {
        ...values,
        ...options
      }
      if (ping > values.high) {
        return '🔴'
      } else if (ping > values.medium) {
        return '🟡'
      } else {
        return '🟢'
      }
    }

    const embed = new MessageEmbed()
      .setDescription("Calculando...")
      .setColor("a900ff")

    message.channel.send({ embeds: [embed] }).then(async m => {
      setTimeout(() => {
        let ping = Math.round(client.ws.ping);

        const embed = new MessageEmbed()
          .setTitle("Pong 🏓 ")
          .setDescription(`Mi ping es: ${pingemj(ping)} ${ping}ms`)
          .setColor('a900ff')

        m.edit({ embeds: [embed] })
      }, 2000);
    })

  }

} 