// commands/loop.js
module.exports = {
    config: {
        setName: 'loop',
        setDescription: 'set the loop method for the music queue',
        addStringOption: (option) => option.setName('type')
            .setDescription('the loop method to use')
            .setRequired(false)
            .addChoices(
                { name: 'all', value: 'all' },
                { name: 'current', value: 'current' },
                { name: 'none', value: 'none' }
            )
    },
    async run (client,interaction,args) {
        const channel = interaction.member.voice.channel
        const guild = channel.guild
        if(!guild.voiceQueue){
            return interaction.reply({content:"No music queue found",ephemeral:true});
        }
        if(args.get("type")){
            const type = args.get("type").value;
            // console.log(type)
            let config = guild.voiceQueue.get("config");
            config.loop=args.get("type").value;
            guild.voiceQueue.set("config",config)
            interaction.reply({content:"Looping: " + type,ephemeral:true});
        }else{
            interaction.reply({content:"Looping: " + guild.voiceQueue.get("config").loop,ephemeral:true});
        }
    }
}