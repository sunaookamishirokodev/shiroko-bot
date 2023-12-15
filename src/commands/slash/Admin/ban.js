const { SlashCommandBuilder, ChatInputCommandInteraction, PermissionsBitField } = require("discord.js");
const ExtendedClient = require("../../../class/ExtendedClient");
const config = require("../../../config");

module.exports = {
  structure: new SlashCommandBuilder()
    .setName("ban")
    .setDescription("Ban user from guild")
    .addUserOption((opt) => opt.setName("target").setDescription("Mention the user who needs ban").setRequired(true))
    .addStringOption((opt) => opt.setName("reason").setDescription("Why do you want to ban this user?"))
    .setDefaultMemberPermissions(PermissionsBitField.Flags.BanMembers)
    .setDMPermission(false),
  /**
   * @param {ExtendedClient} client
   * @param {ChatInputCommandInteraction} interaction
   */
  run: async (client, interaction) => {
    const target = interaction.options.getMember("target");
    const reason = interaction.options.getString("reason") ?? config.messageSettings.noReasonMessage;

    await target.ban({
      reason: reason
    });
    try {
      await interaction.reply(`Ban \`${target.username}\` successfully with reason: \`${reason}\``);
    } catch (err) {
      await interaction.reply(config.messageSettings.errorMessage);
    }
  },
};
