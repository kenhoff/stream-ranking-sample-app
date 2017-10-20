require("dotenv").config();

const bodyParser = require("body-parser");
const stream = require("getstream");
const express = require("express");

let app = express();

app.use(bodyParser.json())

client = stream.connect(process.env.STREAM_API_KEY, process.env.STREAM_API_SECRET, process.env.STREAM_APP_ID);

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html")
});

app.get("/get-timeline/:userID", (req, res) => {
    var userTimelineFeed = client.feed("timeline", req.params.userID)
    userTimelineFeed.get({
        limit: 10
    }).then(results => {
        res.send(results)
    }).catch(err => {
        res.status(500).send(err)
    })
})

app.get("/get-personal/:userID", (req, res) => {
    userProfileFeed = client.feed("personal", req.params.userID)
    userProfileFeed.get({
        limit: 10
    }).then(results => {
        res.send(results)
    }).catch((err) => {
        res.status(500).send(err)
    })
})

app.get("/following", (req, res) => {
    // hardcoding kristin, because we're just using it as the main user right now
    client.feed("timeline", "kristin").following().then(results => {
        res.send(results.results)
    }).catch(err => {
        res.status(500).send(err)
    });
})

app.post("/follow/:userID", (req, res) => {
    // again, just using kristin right now
    userTimelineFeed = client.feed("timeline", "kristin")
    userTimelineFeed.follow("personal", req.params.userID).then(results => {
        res.send(results)
    }).catch(err => {
        console.log(err);
        res.status(500).send(err)
    })
})
app.post("/unfollow/:userID", (req, res) => {
    // again, just using kristin right now
    userTimelineFeed = client.feed("timeline", "kristin")
    userTimelineFeed.unfollow("personal", req.params.userID).then(results => {
        res.send(results)
    }).catch(err => {
        console.log(err);
        res.status(500).send(err)
    })
})

app.post("/attend-class/:userID/:gymID", (req, res) => {
    userProfileFeed = client.feed("personal", req.params.userID)
    userProfileFeed.addActivity({
        actor: req.params.userID,
        verb: "posted",
        object: `attended a class at ${req.params.gymID}`
    }).then(data => {
        res.send(data)
    }).catch(err => {
        // console.log(err);
        res.status(500).send(err)
    });
})



app.listen(process.env.PORT, () => {
    console.log(`Listening on ${process.env.PORT}...`);
})
