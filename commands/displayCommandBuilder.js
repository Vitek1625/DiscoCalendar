const {SlashCommandBuilder, SlashCommandSubcommandsOnlyBuilder} = require('discord.js');

module.exports = {
  displayPlanCB,
}

/**
 * @returns {SlashCommandSubcommandsOnlyBuilder}
 */

function displayPlanCB() {
    // return an image or message presenting plan for current day/week
    const displayTasksCB = new SlashCommandBuilder()
    .setName("tasks")
    .setDescription("See tasks based on category")
    .addSubcommand(subcommand =>
        subcommand.setName("today")
        .setDescription("Tasks for today")
    )
    .addSubcommand(subcommand =>
        subcommand.setName("week")
        .setDescription("Tasks for a current week")
    )
    .addSubcommand(subcommand =>
        subcommand.setName("month")
        .setDescription("Tasks for a current month")
    )
    .addSubcommand(subcommand =>
        subcommand.setName("all")
        .setDescription("View all tasks")
    );

    return displayTasksCB;
}

function viewData(table) {
    // table = 'tag' | 'task' | 'schedule'
    // return message with data related to chosen table
}

function dailies() {
    // return user a list of tasks for today
    // Also can ping user in threads related to dailies
}

function tasksToThreads(channel_name) {
    // put all active tasks to channel and make for each task a thread
}