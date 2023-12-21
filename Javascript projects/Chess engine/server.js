const express = require("express");
//const openingBook = require("./openingBook.js")
const app = express();
const port = 8383;

app.use(express.static("engine"));

app.get("/info", (req, res) => {
    const [move, success] = [openingBook.getBookMove("hi"), true];
    if (success) {
        res.status(200).json({move: move});
    } else {
        res.status(400).json({move: "failed"});
    };
});

app.listen(port, () => console.log("server has started on port 8383"));