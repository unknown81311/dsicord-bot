// commands/join.js
const ytdl = require('ytdl-core');
const { createAudioPlayer, joinVoiceChannel, createAudioResource, AudioPlayerStatus } = require('@discordjs/voice');
const {Collection} = require('discord.js');

function addToQueue(guild, url) {
    const list = guild.voiceQueue.get("list")||[]
    list.push(url)
    guild.voiceQueue.set("list",list)
    return list;
}

async function beginPlaying(guild,interaction){
    console.log("guild.voiceQueue.get",guild.voiceQueue.get)
    const playList = guild.voiceQueue.get("list") || []
    const playListPos = guild.voiceQueue.get("pos") || 0
    const config = guild.voiceQueue.get("config")
    if (playList.length === 0) return;
    
    const url = playList[playListPos];

    if (config.loop && (config.loop != "current" && playList.length >= playListPos)){
        if(config.loop == "none"){
            guild.voiceQueue.set("pos",playListPos+1);
        }else if(config.loop == "all" && playList.length == playListPos){
            guild.voiceQueue.set("pos",0);
        }
    }


    const res = await handleAudioResource(url,guild.voiceQueue)
    guild.voiceQueue.set("resource",res)
    const player = guild.voiceQueue.get("player")
    console.log(player)
    guild.voiceQueue.get("connection")
        .subscribe(player);
    
    player.play(res)
    interaction.reply("Now playing: " + url)

    player.on('end', () => {
        console.log("ended")
        beginPlaying(guild,interaction)
    })
}

async function handleAudioResource(url,voiceQ) {
    let res;
    if (/youtu(\.?)be/.test(url)) {
        res = await createAudioResource(ytdl(url, {
            filter: 'audioonly',
            highWaterMark: 10485760,
            dlChunkSize: 0
        }));
    } else {
        res = await createAudioResource(url);
    }
    return res;
}


module.exports = {
    config: {
        setName: 'play',
        setDescription: 'join the vc of the message author',
        addStringOption: (option) => option.setName('url-or-search')
                .setDescription('The url or search term to play')
                .setRequired(false)

    },
    async run (client, interaction, args) {
        try{
            const channel = interaction.member.voice.channel
            const guild = channel.guild
            console.log("guild.voiceQueue",guild.voiceQueue)
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
            const player = guild.voiceQueue.get("player");
            if(!player){
                guild.voiceQueue.set("player",createAudioPlayer({}));
            }
            console.log(guild.voiceQueue.get("player"))
            addToQueue(guild, args.get("url-or-search").value);
            beginPlaying(guild,interaction);
        }catch(e){
            console.error(e)
            interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
        }
    }
}