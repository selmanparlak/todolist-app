import express from "express";
import bodyParser from "body-parser";

const app = express();
const port = 3000;

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

var workData = [];
var todayData = [];

function Note(index, title, subject, date) {
    this.index = index;
    this.title = title;
    this.subject = subject;
    this.date = date;
}

function Todo(index, title) {
    this.index = index;
    this.title = title;
}

function getDate(dataType = "todayData") {
    const currentDate = new Date();

    if (dataType == "workData") {
        const options = {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        };
        return currentDate.toLocaleDateString('en-US', options);
    }
    else if (dataType == "todayData") {
        const options = {
            weekday: 'long',
            month: 'long',
            day: 'numeric',
        };
        return currentDate.toLocaleDateString('en-US', options);
    }
}

function createData(array, title, subject, dataType) {
    let hasSameTitle = false;
    let note = new Note(array.length, title, subject, getDate(dataType));

    if (dataType == "todayData") {
        note = new Todo(array.length, title);
    }

    if (note.title.length <= 50) {
        if (array.length === 0) {

            array.push(note);

        } else {
            array.forEach(element => {
                if (element.title === note.title) {
                    hasSameTitle = true;
                }

            });
            if (!hasSameTitle) {
                array.push(note);
            }
        }
    } else {
        // maxLength
    }

    console.log(array);

}

function updateData(array, indexToUpdate, title, subject, dataType) {
    let hasSameTitle = false;

    if (title.length <= 50) {

        array.forEach((element) => {

            if (element.title == title && element.index != indexToUpdate) {
                hasSameTitle = true;
                return;
            }
        });
        array.forEach((element, i) => {
            if (!hasSameTitle) {
                if (indexToUpdate == element.index) {
                    if (dataType == "todayData") {
                        array[i] = new Todo(indexToUpdate, title);

                    }
                    else {
                        array[i] = new Note(indexToUpdate, title, subject, getDate(dataType));

                    }

                }
            }
        });
    } else {
        // maxLength
    }

}

function deleteData(indexToDelete, array) {
    const indexInArray = array.findIndex(element => element.index == indexToDelete);

    if (indexInArray !== -1) {
        array.splice(indexInArray, 1); // one times remove specific index.
        console.log(`Element at index ${indexToDelete} deleted.`);
    }
}

app.get("/", (req, res) => {

    res.render("index.ejs", { workData: workData });
});

app.get("/today", (req, res) => {
    res.render("index.ejs", { todayData: todayData, date: getDate() });
});

app.post("/create", (req, res) => {
    req.body.workData ? createData(workData, req.body.title, req.body.subject, req.body.workData) : createData(todayData, req.body.title, "", req.body.todayData);
    const renderData = req.body.workData ? { workData: workData } : { todayData: todayData, date: getDate() };
    res.render("index.ejs", renderData);

});

app.post("/edit", (req, res) => {
    const indexToUpdate = req.body.index;
    const title = req.body.title;
    const subject = req.body.subject;
    req.body.workData ? updateData(workData, indexToUpdate, title, subject, req.body.workData) : updateData(todayData, indexToUpdate, title, "", req.body.todayData);
    const renderData = req.body.workData ? { workData: workData } : { todayData: todayData, date: getDate() };
    res.render("index.ejs", renderData);

});

app.post("/delete", (req, res) => {
    const indexToDelete = req.body.index;
    const array = req.body.workData ? workData : todayData;
    deleteData(indexToDelete, array);
    const renderData = req.body.workData ? { workData: workData } : { todayData: todayData, date: getDate() };
    res.render("index.ejs", renderData);

});

app.listen(port, (req, res) => {
    console.log(`listening on port ${port}`);
});