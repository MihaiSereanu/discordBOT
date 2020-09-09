// http://discord.js.org/documentation
require("dotenv").config();
const { Client, WebhookClient } = require('discord.js')

const client = new Client({
  partials: ["MESSAGE", "REACTION"]
})
const PREFIX = "$" // commands

const webhookClient = new WebhookClient(
  process.env.WEBHOOK_ID, 
  process.env.WEBHOOK_TOKEN
)

client.on('ready', () => {
  console.log(`${client.user.username} working.`)
})

client.on('message', async (message) => {
  if (message.author.bot) return;
  if (message.content.startsWith(PREFIX)) {
    const [command, ...args] = message.content
      .trim()
      .substring(PREFIX.length)
      .split(/\s+/);
    if (command === 'kick') {
      if (!message.member.hasPermission('KICK_MEMBERS')) 
        return message.reply("You do not have permissions to use that command");
      if (args.length === 0) 
        return message.reply("Please provide an ID")
      const member = message.guild.members.cache.get(args[0])
      if (member) {
        member.kick()
              .then(member => message.channel.send(`${member} was kicked`))
              .catch(err => message.channel.send("I can't ;("))
      } else {
        message.channel.send("Member not found")
      }
    } else if (command === 'ban') {
      if (!message.member.hasPermission('BAN_MEMBERS')) 
        return message.reply("You do not have permissions to use that command");
      if (args.length === 0) return message.reply("Please provide an ID")
      try {
        const user = await message.guild.members.ban(args[0])
        console.log(user.tag)
        message.channel.send(`${user.tag} banned successfully`)
      } catch (err) {
        console.log(err)
      }
    } else if (command === 'announce') {
      const msg = args.join(' ');
      webhookClient.send(msg)
    }
  }
  // if (message.content.includes('pepe')) {
  //   message.channel.send(`nice`)
  // }
})

client.on('messageReactionAdd', (reaction, user) => {
  const { name } = reaction.emoji;
  const member = reaction.message.guild.members.cache.get(user.id)
  if (reaction.message.id === '753204012068634654') {
    switch (name) {
      case '🆒':
        member.roles.add('753198757750767658') // verified
        break;
      case '🛋️':
        member.roles.add('753205634752839740') // member
        break;
      case '🍑':
        member.roles.add('753205693497999360') // guest
        break;
    }
  }
})

client.on('messageReactionRemove', (reaction, user) => {
  const { name } = reaction.emoji;
  const member = reaction.message.guild.members.cache.get(user.id)
  if (reaction.message.id === '753204012068634654') {
    switch (name) {
      case '🆒':
        member.roles.remove('753198757750767658') // verified
        break;
      case '🛋️':
        member.roles.remove('753205634752839740') // member
        break;
      case '🍑':
        member.roles.remove('753205693497999360') // guest
        break;
    }
  }
})

client.login(process.env.DISCORDJS_BOT_TOKEN)