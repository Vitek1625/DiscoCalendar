const ACB = require('./commands/addCommandBuilder');
const DCB = require('./commands/display');
const CC = require('./commands/commandCenter')
const {Client, Events, SlashCommandBuilder, InteractionType} = require('discord.js');
const {token} = require('./config.json');
const db = require('./database-accesspoint')

// Database connection
const sqlite3 = require('sqlite3').verbose();

// db.serialize(() => {
//     db.run("CREATE TABLE lorem (info TEXT)");

//     const stmt = db.prepare("INSERT INTO lorem VALUES (?)");
//     for (let i = 0; i < 10; i++) {
//         stmt.run("Ipsum " + i);
//     }
//     stmt.finalize();

//     db.each("SELECT rowid AS id, info FROM lorem", (err, row) => {
//         console.log(row.id + ": " + row.info);
//     });
// });

const client = new Client({intents: []});

client.once(Events.ClientReady, c => {
    console.log(`Logged in as ${c.user.username}`);

    const ping = new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Replies with pong!");

    const dailies = new SlashCommandBuilder()
    .setName("dailies")
    .setDescription("Informs user about progress that should be done today");

    // client.application.commands.create(ping);
    // client.application.commands.create(dailies);
    const guild = client.guilds.cache.get('665992765594665001');
    if (guild) {
        guild.commands.create(ping);
        guild.commands.create(dailies);
        guild.commands.create(ACB.addCommandsBuilder());
        guild.commands.create(DCB.displayPlanCB());

        console.log('✅ Registered command in this guild');
    }
});

client.on(Events.InteractionCreate, async interaction => {
    console.log(interaction);
    if(interaction.type === InteractionType.ApplicationCommand) {
        CC.handleCommandInteraction(interaction);
    }

    // if(interaction.type === InteractionType.ModalSubmit) {
        
    // }
});

client.login(token);
// db.close();

// node index.js