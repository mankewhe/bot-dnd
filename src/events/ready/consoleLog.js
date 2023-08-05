const { ActivityType } = require('discord.js');

module.exports = (client) => {
  console.log(`${client.user.tag} is online.`);

  function presence() {
    client.user.setActivity("CaféPoints", {
      type: ActivityType.Playing
    });
  }

  presence();
};