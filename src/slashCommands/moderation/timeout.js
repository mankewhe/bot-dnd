const { Client, Interaction, ApplicationCommandOptionType, PermissionFlagsBits } = require('discord.js');
const ms = require('ms');

module.exports = {
  /**
   *
   * @param {Client} client
   * @param {Interaction} interaction
   */

  callback: async (client, interaction) => {
    const mentionable = interaction.options.get('target-user').value;
    const duration = interaction.options.get('duration').value; // 1d, 1 day, 1s 5s, 5m
    const reason = interaction.options.get('reason')?.value || 'Razon no otorgada';

    await interaction.deferReply();

    const targetUser = await interaction.guild.members.fetch(mentionable);
    if (!targetUser) {
      await interaction.editReply("Usuario no encontrado");
      return;
    }

    if (targetUser.user.bot) {
      await interaction.editReply("Este usuario es un bot");
      return;
    }

    const msDuration = ms(duration);
    if (isNaN(msDuration)) {
      await interaction.editReply('Tiempo o formato de tiempo no valido');
      return;
    }

    if (msDuration < 5000 || msDuration > 2.419e9) {
      await interaction.editReply('El tiempo no puede ser menor a 5s o mayor a 28 dias');
      return;
    }

    const targetUserRolePosition = targetUser.roles.highest.position; // Highest role of the target user
    const requestUserRolePosition = interaction.member.roles.highest.position; // Highest role of the user running the cmd
    const botRolePosition = interaction.guild.members.me.roles.highest.position; // Highest role of the bot

    if (targetUserRolePosition >= requestUserRolePosition) {
      await interaction.editReply("No puedes silenciar a este usuario");
      return;
    }

    if (targetUserRolePosition >= botRolePosition) {
      await interaction.editReply("No puedo silenciar a este usuario");
      return;
    }

    // Timeout the user
    try {
      const { default: prettyMs } = await import('pretty-ms');

      if (targetUser.isCommunicationDisabled()) {
        await targetUser.timeout(msDuration, reason);
        await interaction.editReply(`**${targetUser}** ha sido silenciado durante ${prettyMs(msDuration, { verbose: true })}\nRazon: ${reason}`);
        return;
      }

      await targetUser.timeout(msDuration, reason);
      await interaction.editReply(`**${targetUser}** Ha sido silenciado durante ${prettyMs(msDuration, { verbose: true })}.\nRazon: ${reason}`);
    } catch (error) {
      console.log(`There was an error when timing out: ${error}`);
    }
  },

  name: 'timeout',
  description: 'Silencia a un usuario',
  options: [
    {
      name: 'target-user',
      description: 'Usuario',
      type: ApplicationCommandOptionType.Mentionable,
      required: true,
    },
    {
      name: 'duration',
      description: 'Duracion (30m, 1h, 1 day).',
      type: ApplicationCommandOptionType.String,
      required: true,
    },
    {
      name: 'reason',
      description: 'Razon',
      type: ApplicationCommandOptionType.String,
    },
  ],
  permissionsRequired: [PermissionFlagsBits.MuteMembers],
  botPermissions: [PermissionFlagsBits.MuteMembers],
};