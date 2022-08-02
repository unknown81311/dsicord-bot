// commands/q.js
const { EmbedBuilder } = require('discord.js');
module.exports = {
    config: {
        setName: 'queue',
        setDescription: 'show the queue'
    },
    async run (client,interaction,args) {
        const channel = interaction.member.voice.channel
        const guild = channel.guild
        const playList = guild.voiceQueue.get("list")
        const playListPos = guild.voiceQueue.get("pos")

        console.log(playList,playListPos)

        const returnEmbed = new EmbedBuilder()
            .setColor(0x0099FF)
            .setTitle('playlist')
        newDescription = 'currently playing: ' + playList[playListPos-1],"\n upcoming: "
        playList.forEach(url=>{
            newDescription+="\n"+url
        })
        returnEmbed.setDescription(newDescription);
        interaction.reply({ embeds: [returnEmbed], ephemeral: true });
    }
}