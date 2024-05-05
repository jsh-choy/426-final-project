import express from 'express';
import bodyParser from 'body-parser';
import {PlannerEvent} from './planner-event.mjs';

const app = express();

const port = 3000;

app.use(bodyParser.json());

app.get('/events', (req, res) => {
    res.json(PlannerEvent.all());
});

app.get('/events/:id', (req, res) => {
    res.json(PlannerEvent.getByIDJSON(req.params.id));
});

app.post('/events', (req, res) => {
    let event = PlannerEvent.create(req.body);
    if (!event) {
        res.status(400).send("Invalid request");
        return;
    }
    res.location('/events/' + event.id);
    res.status(201).json(event);
});

app.put('/events/:id', (req, res) => {
    const id = Number(req.params.id);
    if (isNaN(id) || id < 0) {
        res.status(400).send("Invalid ID");
        return;
    }

    let event = PlannerEvent.getByID(id);
    if (!event) {
        res.status(404).send("Event not found.");
        return;
    }

    if (!req.body instanceof Object) {
        res.status(400).send("Bad request");
        return;
    }

    let updated = PlannerEvent.update(req.body, id);
    res.json(updated);
});

app.delete('/events/:id', (req, res) => {
    const id = Number(req.params.id);
    if (isNaN(id) || id < 0) {
        res.status(400).send("Invalid ID");
        return;
    }
    let event = PlannerEvent.getByIDJSON(id);
    if (!event) {
        res.status(404).send("Event not found.");
        return;
    }
    res.json(PlannerEvent.delete(id));
});

app.listen(port, () => {
    console.log((new Date()).toJSON().toString());
});