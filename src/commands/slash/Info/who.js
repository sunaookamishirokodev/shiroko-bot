const { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const ExtendedClient = require("../../../class/ExtendedClient");
const { time } = require("../../../functions");
const config = require("../../../config");

module.exports = {
  structure: new SlashCommandBuilder()
    .setName("who")
    .setDescription("Get a user's information")
    .addUserOption((opt) =>
      opt.setName("target").setDescription("Leave blank if you want to consider yourself").setRequired(false)
    )
    .setDMPermission(false),
  /**
   * @param {ExtendedClient} client
   * @param {ChatInputCommandInteraction} interaction
   */
  run: async (client, interaction) => {
    const user = interaction.options.getUser("target") || interaction.user;

    const member = interaction.guild.members.cache.get(user.id);

    if (!member) {
      return await interaction.reply({
        content: "That user is not on the guild.",
      });
    }

    const roles = [];
    const perms = [];

    if (member.roles) {
      member.roles.cache.forEach((role) => {
        if (role.id !== interaction.guild.roles.everyone.id) roles.push(`${role.toString()}`);
      });
    }

    if (member.permissions) {
      member.permissions.toArray().forEach((perm) => {
        perms.push(perm.replace(/([a-z])([A-Z])/g, "$1 $2").toLowerCase());
      });
    }

    const arr = [
      `**Username**: ${user.username}`,
      `**Display name**: ${member.nickname || user.displayName}`,
      `**ID**: ${user.id}`,
      `**Joined Discord**: ${time(user.createdTimestamp, "d")} (${time(user.createdTimestamp, "R")})`,
      `**Joined server**: ${time(member.joinedTimestamp, "d")} (${time(member.joinedTimestamp, "R")})`,
      `**Roles** [${roles.length - 1}]: ${roles.join(", ")}`,
      `**Permission** [${perms.length - 1}]: ${perms.join(", ")}`,
    ];

    const embed = new EmbedBuilder()
      .setTitle("User info - " + user.tag)
      .setAuthor({
        name: interaction.user.tag,
        iconURL: interaction.user.displayAvatarURL(),
      })
      .setThumbnail(member.displayAvatarURL())
      .setDescription(`${arr.join("\n")}`)
      .setColor(config.embedSettings.color.default)
      .setTimestamp(new Date())
      .setFooter({
        text: `copyright @${client.application.owner.username}`,
        iconURL: client.user.displayAvatarURL(),
      });

    await interaction.reply({
      embeds: [embed],
    });
  },
};
