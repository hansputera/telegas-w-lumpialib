const commandUtil = new CommandUtil();

class PingCommand extends Command {
  constructor() {
    super('ping', 'Ping Pong', ['pong']);
  }
  async execute(ctx) {
    ctx.reply('Pong!');
  }
}

class AboutMeCommand extends Command {
  constructor() {
    super('aboutme', 'Show an information about me!', ['about']);
  }

  async execute(ctx) {
    ctx.reply('Halo, aku bot!');
  }
}

class IDCommand extends Command {
  constructor() {
    super('id', 'Show current chat id', ['chatid']);
  }

  async execute(ctx) {
    ctx.replyWithMarkdown(`Current Chat ID: \`${ctx.chat.id}\` \nYour ID: \`${ctx.from.id}\``);
  }
}

commandUtil.register(
  new PingCommand(),
  new AboutMeCommand(),
  new IDCommand(),
);
