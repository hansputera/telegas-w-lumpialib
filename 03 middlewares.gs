/**
 * Mock context middleware.
 */
function mockContext(ctx, next) {
  const entities = ctx.message.entities;

  if (entities && entities.length) {
    const botEntityCommand = entities.find((entity) => entity.type === 'bot_command');
    if (botEntityCommand && entities[0] === botEntityCommand) {
      const sliced = ctx.message.text.slice(botEntityCommand.offset, botEntityCommand.length);
      
      if (sliced.split(/\@/g)[1] && sliced.split(/\@/g)[1] === getUserDetails().username) {
        ctx.command = sliced.slice(1).split(/\@/g)[0].trim();
      } else {
        ctx.command = sliced.slice(1).trim();
      }

      ctx.command_instance = commandUtil.find(ctx.command);
      ctx.args = ctx.message.text.replace(sliced, '')
        .trim().split(/ +/g).filter((a) => a.length);
    } 
  }
  next();
}

/**
 * Cooldown middleware.
 */
function cooldownMiddleware(ctx, next) {
  if (ctx.command) {
    const cooldownUser = scriptsCache.get('cooldown-' + ctx.from.id);
    if (cooldownUser && !JSON.parse(cooldownUser).warned && JSON.parse(cooldownUser).date > Date.now()) {
      ctx.replyWithMarkdown('Mohon tunggu ya, kau ini kena cooldown >:(\nJadi sabar lah ya kalau mau pakek.'); // you can change it.
      scriptsCache.put('cooldown-' + ctx.from.id, JSON.stringify({
        ...JSON.parse(cooldownUser),
        'date': JSON.parse(cooldownUser).date,
        'warned': true,
      }), ((Date.now() - JSON.parse(cooldownUser).date) / 1000).toFixed(0));
    } else if (cooldownUser && JSON.parse(cooldownUser).date <= Date.now()) {
      scriptsCache.remove('cooldown-' + ctx.from.id);
      next();
    } else if (!cooldownUser) {
      scriptsCache.put('cooldown-' + ctx.from.id, JSON.stringify({
        'date': Date.now() + ctx.command_instance.cooldown,
        'warned': false,
      }), ctx.command_instance.cooldown / 1000);
      next();
    }
  } else {
    next();
  }
}

/**
 * Owner only middleware
 */
function ownerOnlyMiddleware(ctx, next) {
  if (ctx.command && ctx.command_instance) {
    if (ctx.command_instance.ownerOnly && !Config.owners.includes(ctx.from.id)) {
      ctx.reply('Only owner can execute this command!');
    } else {
      next();
    }
  } else {
    next();
  }
}

client.use(mockContext);
client.use(cooldownMiddleware);
client.use(ownerOnlyMiddleware);
