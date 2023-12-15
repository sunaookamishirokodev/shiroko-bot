const { Client, Partials, Collection, GatewayIntentBits, PresenceUpdateStatus, ActivityType } = require("discord.js");
const config = require("../config");
const commands = require("../handlers/commands");
const events = require("../handlers/events");
const deploy = require("../handlers/deploy");
const mongoose = require("../handlers/mongoose");
const components = require("../handlers/components");

module.exports = class extends Client {
  collection = {
    interactioncommands: new Collection(),
    prefixcommands: new Collection(),
    aliases: new Collection(),
    components: {
      buttons: new Collection(),
      selects: new Collection(),
      modals: new Collection(),
    },
  };
  applicationcommandsArray = [];

  constructor() {
    super({
      intents: [Object.keys(GatewayIntentBits)],
      partials: [Object.keys(Partials)],
    });
  }

  start = async () => {
    commands(this);
    events(this);
    components(this);

    if (config.handler.mongodb.toggle) mongoose();
    await this.login(process.env.CLIENT_TOKEN || config.client.token);
    await this.application.fetch();
    this.user.setUsername("Sunaookami Shiroko");
    this.user.setActivity("Cùng xem Shiroko code ngu đến cỡ nào:()", { type: ActivityType.Custom });
    this.user.setStatus(PresenceUpdateStatus.DoNotDisturb);

    if (config.handler.deploy) deploy(this, config);
  };
};
