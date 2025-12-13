const {SlashCommandBuilder, SlashCommandSubcommandsOnlyBuilder} = require('discord.js');

module.exports = {
  addCommandsBuilder,
}

/**
 * @returns {SlashCommandSubcommandsOnlyBuilder}
 */
function addCommandsBuilder() {
    const addCommandsBuilder = new SlashCommandBuilder()
    .setName("add-object")
    .setDescription("Add new object to database")
    .addSubcommand(subcommand =>
        subcommand.setName("task")
        .setDescription("Create a new task")
        .addStringOption(option =>
            option.setName('title')
            .setDescription('Name of the task')
            .setRequired(true))
        .addStringOption(option =>
            option.setName('description')
            .setDescription('e.g., Outline key points for proposal... (max 100 characters)')
            .setMinLength(1)
            .setMaxLength(100)
            .setRequired(true))
        .addIntegerOption(option =>
            option.setName('expected_minutes')
            .setDescription('e.g. 90')
            .setRequired(true))
        .addStringOption(option =>
            option.setName('due_date')
            .setDescription('Due Date (YYYY-MM-DD) — optional')
            .setRequired(false))
    )
    .addSubcommand(subcommand =>
        subcommand.setName("schedule")
        .setDescription("Create a new schedule")
        .addStringOption(option =>
            option.setName('title')
            .setDescription('Name of the schedu;e')
            .setRequired(true))
        .addStringOption(option =>
            option.setName('description')
            .setDescription('e.g., Outline key points for proposal... (max 100 characters)')
            .setMinLength(1)
            .setMaxLength(100)
            .setRequired(true))
        .addIntegerOption(option =>
            option.setName('expected_minutes')
            .setDescription('e.g. 90')
            .setRequired(true))
        .addIntegerOption(option =>
            option.setName('day_of_week')
            .setDescription('Input number of a week day where 1 is Monday and 7 is Sunday')
            .setRequired(true))
        .addStringOption(option =>
            option.setName('hour_from')
            .setDescription('Beggining hour (HH:MM:SS | HH:MM)')
            .setRequired(true))
        .addStringOption(option =>
            option.setName('hour_to')
            .setDescription('Ending hour (HH:MM:SS | HH:MM)')
            .setRequired(true))
        .addBooleanOption(option =>
            option.setName('fixed_schedule')
            .setDescription('e.g. True')
            .setRequired(true))
        .addStringOption(option =>
            option.setName('due_date')
            .setDescription('Due Date (YYYY-MM-DD) — optional')
            .setRequired(false))
    )
    .addSubcommand(subcommand =>
        subcommand.setName("tag")
        .setDescription("Create a new tag")
        .addStringOption(option =>
            option.setName('name')
            .setDescription('Name of the tag')
            .setRequired(true))
        .addStringOption(option =>
            option.setName('icon')
            .setDescription('Icon of the tag')
            .setRequired(false))
    );
    
    return addCommandsBuilder;
}