const express = require("express");
const bodyParser = require("body-parser")

const PORT = process.env.PORT || 3002;

const app = express();
app.disable('etag');

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
    res.send("OK");
});

app.get("/api/get_schedule", async (req, res) => {
    await delay(3000);
    res.json(schedule);
});

var motor_status = 0;

app.get("/api/motor_on", async (req, res) => {
    await delay(1000);
    motor_status = 1;
    res.send("OK");
});

app.get("/api/motor_off", async (req, res) => {
    await delay(1000);
    motor_status = 0;
    res.send("OK");
});

app.get("/api/motor_status", async (req, res) => {
    await delay(1000);
    res.send(String(motor_status));
});

app.use(express.static('build'))

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
