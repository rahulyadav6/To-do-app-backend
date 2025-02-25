const express = require('express');
const app = express();
require("dotenv").config();
const port = process.env.PORT || 3000;
const cors = require('cors');

const { Todo } = require("./db");

app.use(express.json());
app.use(cors());

// Get all todos
app.get("/todos", async(req,res)=>{
    try {
        const todos = await Todo.find({});
        res.status(200).json({
            todos
        })
    } catch (error) {
        res.status(500).json({
            message: "Error fetching todos",
            error: error.message
        })
    }
})

// Add new todo
app.post("/addtodo", async (req, res) => {
    try {
        const { todo } = req.body;
        if(!todo || typeof todo !== 'string') {
            return res.status(400).json({
                message: "Invalid todo text provided"
            });
        }
        const newTodo = await Todo.create({ 
            todo,
            completed: false  // Initialize as uncompleted
        });
        res.status(201).json({
            message: "Todo added successfully",
            todo: newTodo
        });
    } catch (error) {
        res.status(500).json({
            message: "Error adding todo",
            error: error.message
        });
    }
});

// Update todo
app.put("/update", async (req,res) =>{
    const { _id, todo, completed } = req.body;
    try {
        // Create update object based on what was provided
        const updateData = {};
        if (todo !== undefined) updateData.todo = todo;
        if (completed !== undefined) updateData.completed = completed;

        const updatedTodo = await Todo.findByIdAndUpdate(
            _id, 
            updateData,
            { new: true }  // Return the updated document
        );

        if (!updatedTodo) {
            return res.status(404).json({
                message: "Todo not found"
            });
        }

        res.status(200).json({
            message: "Todo updated successfully",
            todo: updatedTodo
        });
    } catch(error) {   
        res.status(500).json({
            message: "Error updating todo",
            error: error.message
        });
    }
});

// Delete todo
app.delete("/delete/:id", async (req,res) => {
    const { id } = req.params;
    try {
        const deletedTodo = await Todo.findByIdAndDelete(id);
        
        if (!deletedTodo) {
            return res.status(404).json({
                message: "Todo not found"
            });
        }

        res.status(200).json({
            message: "Todo deleted successfully",
            todo: deletedTodo
        });
    } catch(error) {
        res.status(500).json({
            message: "Error deleting todo",
            error: error.message
        });
    }
});

app.listen(port, ()=>{
    console.log(`Listening to port ${port}`);
});