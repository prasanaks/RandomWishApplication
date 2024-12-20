const express = require("express");
const fs = require("fs");
const path = require("path");
const app = express();

const wishesFilePath = path.join(__dirname, "wishes.json");
const assignmentsFilePath = path.join(__dirname, "assignments.json");

// Function to load wishes
function loadWishes() {
    const wishesData = fs.readFileSync(wishesFilePath);
    return JSON.parse(wishesData).wishes;
}

// Function to load assignments
function loadAssignments() {
    const assignmentsData = fs.readFileSync(assignmentsFilePath);
    return JSON.parse(assignmentsData);
}

// Function to save assignments
function saveAssignments(assignments) {
    fs.writeFileSync(assignmentsFilePath, JSON.stringify(assignments, null, 2));
}

app.get("/", (req, res) => {
    const userIP = req.ip || "Unknown IP";  // Retrieve user IP address
    const wishes = loadWishes();
    let assignments = loadAssignments();

    if (!assignments[userIP]) {
        // Assign a random wish if the user doesn't have one
        const randomWish = wishes[Math.floor(Math.random() * wishes.length)];
        assignments[userIP] = randomWish;
        saveAssignments(assignments);
    }

    const assignedWish = assignments[userIP];

    // Send the HTML directly with wish data embedded
    res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Secret Santa Wish</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    text-align: center;
                    padding: 20px;
                }
                h1 {
                    color: #333;
                }
                h2 {
                    color: green;
                }
                button {
                    padding: 10px 20px;
                    font-size: 16px;
                    cursor: pointer;
                    background-color: #4CAF50;
                    color: white;
                    border: none;
                    border-radius: 5px;
                }
                button:hover {
                    background-color: #45a049;
                }
            </style>
        </head>
        <body>
            <h1>Secret Santa</h1>
            <p><strong>Name:</strong> ${assignedWish.name}</p>
            <p><strong>Trigram:</strong> ${assignedWish.trigram}</p>
            <p><strong>Wish:</strong> </p>
            <h2 style="color: green;">${assignedWish.wish}</h2>
            <button onclick="window.location.reload()">Click Me Again</button>
        </body>
        </html>
    `);
});

app.listen(3000, () => {
    console.log("Server is running on port 3000...");
});
