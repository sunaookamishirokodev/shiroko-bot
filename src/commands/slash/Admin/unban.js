const { SlashCommandBuilder, ChatInputCommandInteraction, PermissionsBitField } = require("discord.js");
const ExtendedClient = require("../../../class/ExtendedClient");
const config = require("../../../config");

module.exports = {
  structure: new SlashCommandBuilder()
    .setName("unban")
    .setDescription("Unban certain user")
    .addNumberOption((opt) => opt.setName("id").setDescription("Type if of the user who needs unban").setRequired(true))
    .addStringOption((opt) => opt.setName("reason").setDescription("Why do you want to ban this user?"))
    .setDefaultMemberPermissions(PermissionsBitField.Flags.BanMembers)
    .setDMPermission(false),
  /**
   * @param {ExtendedClient} client
   * @param {ChatInputCommandInteraction} interaction
   */
  run: async (client, interaction) => {
    const target = interaction.options.getUser("target");
    const reason = interaction.options.getString("reason") ?? config.messageSettings.noReasonMessage;

    await interaction.guild.members.unban(target, reason);
    try {
      await interaction.reply(`Unban \`${target.username}\` successfully`);
    } catch (err) {
      await interaction.reply(config.messageSettings.errorMessage);
    }
  },
};
