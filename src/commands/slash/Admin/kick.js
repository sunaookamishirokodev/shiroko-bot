const {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  PermissionsBitField,
} = require("discord.js");
const ExtendedClient = require("../../../class/ExtendedClient");
const config = require("../../../config");

module.exports = {
  structure: new SlashCommandBuilder()
    .setName("kick")
    .setDescription("Kick user from guild")
    .addUserOption((opt) => opt.setName("target").setDescription("Mention the user who needs kick").setRequired(true))
    .addStringOption((opt) => opt.setName("reason").setDescription("Why do you want to kick this user?"))
    .setDefaultMemberPermissions(PermissionsBitField.Flags.KickMembers)
    .setDMPermission(false),
  /**
   * @param {ExtendedClient} client
   * @param {ChatInputCommandInteraction} interaction
   */
  run: async (client, interaction) => {
    const target = interaction.options.getMember("target");
    const reason = interaction.options.getString("reason") ?? config.messageSettings.noReasonMessage;

    await target.kick({
      reason: reason
    });
    try {
      await interaction.reply(`Kick \`${target.username}\` successfully for reason: \`${reason}\``);
    } catch (err) {
      await interaction.reply(config.messageSettings.errorMessage);
    }
  },
};
