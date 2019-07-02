var  mongoose    = require("mongoose");

// SCHEMA SETUP
var projectSchema = new mongoose.Schema({
    name: String,
    price: String,
    image: String,
    description: String,
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    },
    tasks: [
      {
         type: mongoose.Schema.Types.ObjectId,
         ref: "Task"
      }
   ]
});

module.exports = mongoose.model("Project", projectSchema);