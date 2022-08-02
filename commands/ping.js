// commands/ping.js
module.exports = {
    config: {
        setName: 'ping',
        setDescription: 'Get ping of the bot'
    },
    async run (client,interaction,args) {
        interaction.reply({ content: "My ping is \`" + bot.ws.ping + " ms\`", ephemeral: true });
    }
};