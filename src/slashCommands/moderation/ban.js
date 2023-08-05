const {
  Client,
  Interaction,
  ApplicationCommandOptionType,
  PermissionFlagsBits,
} = require('discord.js');

module.exports = {
  /**
   *
   * @param {Client} client
   * @param {Interaction} interaction
   */

  callback: async (client, interaction) => {
    const targetUserId = interaction.options.get('target-user').value;
    const reason =
      interaction.options.get('reason')?.value || 'No se ha dado una razon';

    await interaction.deferReply();

    const targetUser = await interaction.guild.members.fetch(targetUserId);

    if (!targetUser) {
      await interaction.editReply("Usuario no encontrado");
      return;
    }

    if (targetUser.id === interaction.guild.ownerId) {
      await interaction.editReply(
        "No puedes banear al propietario del servidor"
      );
      return;
    }

    const targetUserRolePosition = targetUser.roles.highest.position; // Highest role of the target user
    const requestUserRolePosition = interaction.member.roles.highest.position; // Highest role of the user running the cmd
    const botRolePosition = interaction.guild.members.me.roles.highest.position; // Highest role of the bot

    if (targetUserRolePosition >= requestUserRolePosition) {
      await interaction.editReply(
        "No puedes banear a este usuario"
      );
      return;
    }

    if (targetUserRolePosition >= botRolePosition) {
      await interaction.editReply(
        "No puedo banear a este usuario"
      );
      return;
    }

    // Ban the targetUser
    try {
      await targetUser.ban({ reason });
      await interaction.editReply(
        `Usuario: **${targetUser}** Ha sido baneado\nRazon: ${reason}`
      );
    } catch (error) {
      console.log(`There was an error when banning: ${error}`);
    }
  },

  name: 'ban',
  description: 'Banea a un usuario de este servidor',
  options: [
    {
      name: 'target-user',
      description: 'Usuario a banear',
      type: ApplicationCommandOptionType.Mentionable,
      required: true,
    },
    {
      name: 'reason',
      description: 'Razon del ban',
      type: ApplicationCommandOptionType.String,
    },
  ],
  permissionsRequired: [PermissionFlagsBits.BanMembers],
  botPermissions: [PermissionFlagsBits.BanMembers],
};