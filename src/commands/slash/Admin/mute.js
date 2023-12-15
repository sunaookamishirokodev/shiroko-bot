const { SlashCommandBuilder, ChatInputCommandInteraction, PermissionsBitField } = require("discord.js");
const ExtendedClient = require("../../../class/ExtendedClient");
const config = require("../../../config");

module.exports = {
  structure: new SlashCommandBuilder()
    .setName("mute")
    .setDescription("Mute user in this guild")
    .addUserOption((opt) => opt.setName("target").setDescription("Mention the user who needs mute").setRequired(true))
    .addNumberOption((opt) =>
      opt
        .setName("number")
        .setDescription("How long do you want to mute the user?")
        .setRequired(true)
        .setMinValue(1)
        .setMaxValue(59)
    )
    .addStringOption((opt) =>
      opt
        .setName("type")
        .setDescription("What unit do you want to mute the user with?")
        .setRequired(true)
        .setChoices(
          { name: "Minute(s)", value: "min" },
          { name: "Hour(s)", value: "hour" },
          { name: "Day(s)", value: "day" }
        )
    )
    .addStringOption((opt) => opt.setName("reason").setDescription("Why do you want to mute this user?"))
    .setDefaultMemberPermissions(PermissionsBitField.Flags.MuteMembers)
    .setDMPermission(false),
  /**
   * @param {ExtendedClient} client
   * @param {ChatInputCommandInteraction} interaction
   */
  run: async (client, interaction) => {
    const target = interaction.options.getMember("target");
    const timeNum = interaction.options.getNumber("number");
    const timeType = interaction.options.getString("type");
    const reason = interaction.options.getString("reason") ?? config.messageSettings.noReasonMessage;

    let timeout;
    switch (timeType) {
      case "min":
        timeout = timeNum * 1000 * 60;
        break;
      case "hour":
        timeout = timeNum * 1000 * 60 * 60;
        break;
      case "day":
        timeout = timeNum * 1000 * 60 * 60 * 24;
        break;
      default:
        return interaction.reply(`Invalid \`${timeType}\` type. Please choose the suggested options!`);
    }

    await target.timeout(timeout, reason);
    try {
      await interaction.reply(
        `Time \`${target.username}\` for \`${timeNum} ${timeType}\` successfully with reason: \`${reason}\``
      );
    } catch (err) {
      await interaction.reply(config.messageSettings.errorMessage);
    }
  },
};
