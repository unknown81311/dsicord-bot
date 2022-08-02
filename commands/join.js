// commands/join.js
const { joinVoiceChannel } = require('@discordjs/voice');
const {Collection} = require('discord.js');
module.exports = {
    config: {
        setName: 'join',
        setDescription: 'join the vc of the message author'
    },
    async run (client,interaction,args) {
        const channel = interaction.member.voice.channel
        console.log(channel)
        joinVoiceChannel({
            channelId: channel.id,
            guildId: channel.guild.id,
            adapterCreator: channel.guild.voiceAdapterCreator,
        });
        const guild = channel.guild
        guild.voiceQueue = new Collection()||guild.voiceQueue;
        console.log("guild.voiceQueue",guild.voiceQueue)
        const connection = guild.voiceQueue.get("connection");
        if(!connection){
            guild.voiceQueue.set("connection",joinVoiceChannel({
                channelId: channel.id,
                guildId: guild.id,
                adapterCreator: guild.voiceAdapterCreator,
            }))
        }
        const config = guild.voiceQueue.get("config");
        if(!config){
            guild.voiceQueue.set("config",{
                loop: "none",
                volume: 100
            })
        }
    }
}