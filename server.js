//Modules and dependecies using require and express
const fs = require("fs");
const express = require("express");
const path = require("path");
const app = express();

//Use the PORT environment variable and if none is available then use PORT 4000
const PORT = process.env.PORT || 4000;


//Takes the images, JS and CSS files in the public directory
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


//Adds a route to the notes.html file 
app.get("/notes", (req, res) => {
    res.sendFile(path.join(__dirname, "/public/notes.html"));
});

//Adds a route to GET info from the db.json file and return all previously saved notes
app.get("/api/notes", (req, res) => {
    res.sendFile(path.join(__dirname, "/db/db.json"));
});

//Adds route to GET using the universal variable from the index.html page
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "/public/index.html"));
});


//Takes the new note and adds it to the saved notes in db.json
app.post("/api/notes", (req, res) => {
    let newNoteIn = req.body;
    let list = JSON.parse(fs.readFileSync("./db/db.json", "utf8"));
    let noteLen = (list.length).toString();

    //Assigns a new variable for length and pushes the new note to the list
    newNoteIn.id = noteLen;
    list.push(newNoteIn);

    //Writes to the db.json file
    fs.writeFileSync("./db/db.json", JSON.stringify(list));
    res.json(list);
})

//Deletes note
//Filters notes that have no matching ID, saves them to a new array and then matching array is deleted.
app.delete("/api/notes/:id", (req, res) => {
    let list = JSON.parse(fs.readFileSync("./db/db.json", "utf8"));
    let noteId = (req.params.id).toString();

    list = list.filter(selected =>{
        return selected.id != noteId;
    })

    //Writes to the db.json file and displays updated notes
    fs.writeFileSync("./db/db.json", JSON.stringify(list));
    res.json(list);
});


//Listen to post when deployed
app.listen(PORT, () => console.log("Server listening on port " + PORT));