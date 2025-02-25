require("dotenv").config();
const mongoose = require("mongoose");
const mongoUrl = process.env.MONGO_URL;

mongoose.connect(mongoUrl)
    .then(() => console.log(`Connected to database successfully`))
    .catch((err) => console.log(`Database connection error: ${err.message}`))


const todoSchema = new mongoose.Schema({
    todo: {
        type: String,
        required: true,
        trim: true
    },
    completed: {
        type: Boolean,
        default: false
    }
})
const Todo = mongoose.model("Todo", todoSchema);

module.exports = { Todo }