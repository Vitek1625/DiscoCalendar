const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('Database/Calendar.sqlite3');

db.serialize(() => {
    // db.run("CREATE TABLE user (id INTEGER PRIMARY KEY, name TEXT NOT NULL)");
    db.run("CREATE TABLE tag (id INTEGER PRIMARY KEY, name TEXT NOT NULL, icon TEXT)"); //, user_id INTEGER NOT NULL, FOREIGN KEY (user_id) REFERENCES user(id)
    
    db.run("CREATE TABLE task (" +
        "id INTEGER PRIMARY KEY," +
        " title TEXT NOT NULL," + 
        " description TEXT NOT NULL," +
        " due_date TEXT CHECK(length(due_date) = 10 AND substr(due_date, 5, 1) = '-' AND substr(due_date, 8, 1) = '-')," + 
        " expected_minutes INTEGER NOT NULL," +
        " status TEXT NOT NULL DEFAULT 'pending' CHECK(status IN ('pending', 'in_progress', 'completed'))," +
        " created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP)");

    db.run("CREATE TABLE schedule (" +
        "id INTEGER PRIMARY KEY," +
        " day_of_week INTEGER NOT NULL CHECK(day_of_week BETWEEN 0 AND 6) DEFAULT 0," +
        " hour_from TEXT NOT NULL CHECK(length(hour_from) = 5 AND substr(hour_from, 3, 1) = ':')," + 
        " hour_to TEXT NOT NULL CHECK(length(hour_to) = 5 AND substr(hour_to, 3, 1) = ':')," + 
        " fixed_schedule INTEGER NOT NULL CHECK(fixed_schedule IN (0, 1))," +
        " task_id INTEGER NOT NULL," +
        " FOREIGN KEY (task_id) REFERENCES task(id))");
    
    db.run("CREATE TABLE task_tag (" +
        "task_id INTEGER," + 
        " tag_id INTEGER," + 
        " FOREIGN KEY (task_id) REFERENCES task(id)," +
        " FOREIGN KEY (tag_id) REFERENCES tag(id)," +
        " PRIMARY KEY (task_id, tag_id))");
    
    // db.run("CREATE TABLE user_task (" +
    //     "user_id INTEGER," + 
    //     " task_id INTEGER," + 
    //     " FOREIGN KEY (user_id) REFERENCES user(id)," +
//     " FOREIGN KEY (task_id) REFERENCES task(id)," +
    //     " PRIMARY KEY (user_id, task_id))");

});

db.close();