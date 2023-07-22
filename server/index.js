const express = require("express");
const bodyParser = require("body-parser")

const PORT = process.env.PORT || 3002;

const app = express();

var schedule = [
    {"volume": 100, periodicity: 4, active: true, start_time: 1677240000, period: 1},
    {"volume": 200, periodicity: 3, active: true, start_time: 1677240000, period: 2},
    {"volume": 300, periodicity: 2, active: true, start_time: 1677240000, period: 3},
    {"volume": 400, periodicity: 1, active: true, start_time: 1677240000, period: 4},
    {"volume": 500, periodicity: 0, active: true, start_time: 1677240000, period: 5},
];

const jsonParser = bodyParser.json()
const delay = ms => new Promise(resolve => setTimeout(resolve, ms))

app.post("/api/post_schedule", jsonParser, async (req, res) => {
    schedule = req.body.schedule
    console.log(schedule);
    await delay(3000);
    res.json("OK");
});

app.get("/api/get_schedule", async (req, res) => {
    await delay(3000);
    res.json(schedule);
});

app.use(express.static('build'))

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
