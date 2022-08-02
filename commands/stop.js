// commands/next.js
const { getVoiceConnection } = require('@discordjs/voice');
module.exports = {
    config: {
        setName: 'stop',
        setDescription: 'stops the music and leaves the voice channel'
    },
    async run (client,interaction,args) {
        const guild = interaction.member.voice.channel.guild
        guild.voiceQueue.get("player").stop()
        guild.voiceQueue.set("player",null)
        getVoiceConnection(guild.id).disconnect()
    }
}