// commands/next.js
const { joinVoiceChannel } = require('@discordjs/voice');
module.exports = {
    config: {
        setName: 'skip',
        setDescription: 'skip to the next song in the queue'
    },
    async run (client,interaction,args) {
        const guild = interaction.member.voice.channel.guild
        guild.voiceQueue.set("pos",guild.voiceQueue.get("pos")+1)
        guild.voiceQueue.set("list",guild.voiceQueue.get("list").shift())
        if(guild.voiceQueue.get("pos")>=guild.voiceQueue.get("list").length && guild.voiceQueue.get("config").loop=="all"){
            guild.voiceQueue.set("pos",0)
        }
        guild.voiceQueue.get("player").stop()
    }
}