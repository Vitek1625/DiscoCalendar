const {Interaction, MessageFlags} = require('discord.js');
const db = require('../database-accesspoint')

module.exports = {
  handleCommandInteraction,
}
/**
 * @param {Interaction<import('discord.js').CacheType>} interaction
 */
function handleCommandInteraction(interaction) {
    switch(interaction.commandName)
    {
        case "ping":
            interaction.reply({
                content: "Pong!",
                flags: MessageFlags.Ephemeral,
            });
            break;
        case "dailies":
            break;
        case "tasks":
            displayTasksCommand(interaction);
            break;
        case "add-object":
            addObjectCommand(interaction);
            break;
        default:
            break;
    }
}
/**
 * @param {Interaction<import('discord.js').CacheType>} interaction
 */
function addObjectCommand(interaction) {
    const subcommand = interaction.options.getSubcommand();
    switch(subcommand)
    {
        case "task":
            addTask(interaction);
            break;
        case "schedule":
            addSchedule(interaction);
            break;
        case "tag":
            addTag(interaction);
            break;
    }
}

/**
 * @param {Interaction<import('discord.js').CacheType>} interaction
 */
function addTask(interaction) {
    const title = interaction.options.getString("title");
    const description = interaction.options.getString("description");
    const expected_minutes = interaction.options.getInteger("expected_minutes");
    const due_date = interaction.options.getString("due_date") ?? null;
    
   db.run("INSERT INTO task (title, " +
         "description, expected_minutes, " +
          "due_date, status " +
          ") VALUES (?, ?, ?, ?, ?)",
           [title,
             description, expected_minutes,
             due_date, 'pending'
           ], function(err) {   // <-- use function, not arrow function
            if (err) {
                console.error("SQL error:", err);
                return;
            }

            console.log("New task inserted with ID:", this.lastID);
        }
   );

    interaction.reply({
        content: "Added new task!",
        flags: MessageFlags.Ephemeral,
    });
}

/**
 * @param {Interaction<import('discord.js').CacheType>} interaction
 */
function addSchedule(interaction) {
    const title = interaction.options.getString("title");
    const description = interaction.options.getString("description");
    const expected_minutes = interaction.options.getInteger("expected_minutes");
    const due_date = interaction.options.getString("due_date") ?? null;
    
    db.run("INSERT INTO task (title, " +
         "description, expected_minutes, " +
          "due_date, status" +
          ") VALUES (?, ?, ?, ?, ?)",
           [title,
             description, expected_minutes,
             due_date, 'pending'
           ],
        function (err) {
            if (err) {
                console.error("Error inserting task:", err.message);
                return;
            }

            console.log("New task inserted with ID:", this.lastID);
            connectTaskToSchedule(interaction, this.lastID)
        }
    );
}

/**
 * @param {Interaction<import('discord.js').CacheType>} interaction
 * @param {number} task_id
 */
function connectTaskToSchedule(interaction, task_id) {
    const day_of_week = interaction.options.getInteger("day_of_week");
    const hour_from = interaction.options.getString("hour_from");
    const hour_to = interaction.options.getString("hour_to");
    const fixed_schedule = interaction.options.getBoolean("fixed_schedule");

    db.run("INSERT INTO schedule (" +
         "day_of_week, hour_from, " +
         "hour_to, fixed_schedule, " +
         "task_id) VALUES (?, ?, ?, ?, ?)",
           [
             day_of_week, hour_from,
             hour_to, fixed_schedule,
             task_id
           ]
        );

    interaction.reply({
        content: "Added new schedule!",
        flags: MessageFlags.Ephemeral,
    });
}

/**
 * @param {Interaction<import('discord.js').CacheType>} interaction
 */
function addTag(interaction) {
    const name = interaction.options.getString("name");
    const icon = interaction.options.getString("icon") ?? null;

    db.run("INSERT INTO tag (name, icon) VALUES (?, ?)", [name, icon]);

    interaction.reply({
        content: "Added new tag!",
        flags: MessageFlags.Ephemeral,
    });
}

/**
 * @param {Interaction<import('discord.js').CacheType>} interaction
 */
function displayTasksCommand(interaction) {
    const subcommand = interaction.options.getSubcommand();
    switch(subcommand)
    {
        case "today":
            // addTask(interaction);
            break;
        case "week":
            // addSchedule(interaction);
            break;
        case "month":
            // addTag(interaction);
            break;
        case "all":
            // addTag(interaction);
            break;
    }

    let taskList = "";
    
    db.each("SELECT title, " +
         "description, expected_minutes, " +
         "due_date, status, " +
         "day_of_week, hour_from, " +
         "hour_to, fixed_schedule " +
         "FROM task " +
         "LEFT JOIN schedule "+
         "ON task.id = schedule.task_id", (err, row) => {
            if (err) {
                console.error("SQL error:", err);
                return;
            }
        
            taskList += JSON.stringify(row) + "\n";

            // taskList += Object.entries(row)
            //     .map(([key, value]) => `${key}: ${value}`)
            //     .join("\n") + "\n\n";

            //  taskList +=
            //     `Title: ${row.title}
            //     Description: ${row.description}
            //     Expected Minutes: ${row.expected_minutes}
            //     Due Date: ${row.due_date ?? "None"}
            //     Status: ${row.status}
            //     Day of Week: ${row.day_of_week ?? "-"}
            //     From: ${row.hour_from ?? "-"}
            //     To: ${row.hour_to ?? "-"}
            //     Fixed: ${row.fixed_schedule ?? "-"}
            //     -----------------------------
            //     `

        },
        (err, count) => {
            console.log(taskList);
            if (taskList == "") {
                taskList = "No tasks!"
            }
            interaction.reply({
                content: taskList,
                flags: MessageFlags.Ephemeral,
            });
        }
    );
}
