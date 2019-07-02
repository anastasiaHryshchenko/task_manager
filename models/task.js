var  mongoose    = require("mongoose");

// SCHEMA SETUP
var taskSchema = new mongoose.Schema({
    text: String,
    priority: String,
    duedate: String,
    status: String,
    percentCompleted: Number,
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    }
});

module.exports = mongoose.model("Task", taskSchema);