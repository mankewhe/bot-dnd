const Discord = require('discord.js')
const { Client, IntentsBitField, Collection } = require('discord.js');

const eventHandler = require('./handlers/eventHandler');
const fs = require('node:fs')
const path = require('path');

require('dotenv').config();

const client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMembers,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.MessageContent,
  ],
});

// Global Variables
client.commands = new Collection();
client.categories = fs.readdirSync("src/commands/");
["command"].forEach(handler => {
    require(`./handlers/${handler}`)(client, Discord);
}); 

// Handlers
eventHandler(client);

// DB
require('./configs/db');

// Models
const schema = require('./models/schema');

// Economi
client.bal = (id) => new Promise(async ful => {
  const data = await schema.findOne({ id });
  if (!data) return ful(0);
  ful(data.coins);
})

client.add = async (id, coins) => {
  let data = await schema.findOne({ id });
    
  if (data) {
    data.coins += coins;
  } else {
    data = new schema({ id, coins })
  }
  await data.save();
}

client.rmv = async (id, coins) => {
  let data = await schema.findOne({ id });
    
  if (data) {
    data.coins -= coins;
  } else {
    data = new schema({ id, coins: -coins })
  }
  await data.save();
}

client.login(process.env.token);