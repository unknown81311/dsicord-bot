//index.js
const {Client,Collection,GatewayIntentBits, SlashCommandBuilder, Routes} = require('discord.js');
const { REST } = require('@discordjs/rest');
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildVoiceStates
    ]
});
const config = require('./config.json');
const fs = require('fs');
const token = config.token;

function creatCommand(config){
    console.log(config)
    let command = new SlashCommandBuilder()
    const keys = Object.keys(config)
    for(let key in keys){
        command[keys[key]](config[keys[key]])
    }
    return command
}

const commands = new Collection()
fs.readdir('./commands/', (err, files) => {
    if (err) return console.error(err);
    files.forEach(file => {
        if (!file.endsWith('.js')) return;
        const props = require(`./commands/${file}`);
        console.log(`Attempting to load command ${file}`);
        let newCommand = creatCommand(props.config);
        console.log(newCommand)
        commands.set(props.config.setName,[newCommand,props.run]);
    });
    loadCommands()
})

loadCommands=()=>{
    //use REST to create the slash commands
    const rest = new REST({version:"10"}).setToken(token);
    const commandList = commands.map(e=>e[0])
    console.log("commands",JSON.parse(JSON.stringify(commands)))
    rest.put(Routes.applicationGuildCommands("1003141876523737128", "930888236472103002"), { body: commandList })
    .then(() => console.log('Successfully registered application commands.'))
    .catch(console.error);
}


client.on('ready',() => {
    console.log(`${client.user.tag} is online!`);
    client.user.setActivity('/help');
})

client.on('interactionCreate', async interaction => {
	if (!interaction.isChatInputCommand()) return;

	const { commandName } = interaction;
    try{
        await commands.get(commandName)[1](client,interaction,interaction.options)
    } catch (error) {
        console.error(error);
        await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
    }
});

client.login(token);