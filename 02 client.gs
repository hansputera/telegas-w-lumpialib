const scriptsCache = CacheService.getScriptCache();

const client = new lumpia.init(
  Config.token,
);

/**
 * Use this function if you want get the user details
 * @return {Object}
 */
function getUserDetails() {
  let u = scriptsCache.get('userDetails');
  if (u) u = JSON.parse(u);
  else {
    u = client.telegram.getMe().result;
    scriptsCache.put('userDetails', JSON.stringify(u), 60 * 10); // save it for 10 minutes.
  }

  client.options = { ...client.options, username: u.username };
  return u;
}

/**
 * @class Command
 */
class Command {
  /**
   * @param {string} name
   * @param {string} desc
   * @param {string[]} alias
   * @param {?number} cooldown
   * @param {?boolean} ownerOnly
   */
  constructor(name, desc, alias, cooldown = 5000, ownerOnly = false) {
    this.name = name;
    this.description = desc;
    this.alias = Array.isArray(alias) ? alias : [];
    this.ownerOnly = ownerOnly || false;
    this.cooldown = cooldown || 5000;

    if (typeof this.execute === 'function') {
      if (this.alias.length > 0) this.alias.forEach((alias) => {
        client.cmd(alias, this.execute.bind(this));
      });
      client.cmd(this.name, this.execute.bind(this));
    }
  }
}

function clean() {
  scriptsCache.removeAll([
    'userDetails'
  ]);
  Logger.log('ScriptsCache cleared');
}

function setDeploy() {
  const user = getUserDetails();
  Logger.log('Detected as: ' + user.username || user.id);
  const response = client.telegram.setWebhook('YOUR PROJECT DEPLOYMENT WEB URL');
  Logger.log(response.ok ? 'Webhook set sucess' : 'Webhook set fail');
}
