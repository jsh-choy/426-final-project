export class PlannerEvent {
    #id
    #title
    #description
    #location
    #date
    #duration

    static #next_id = 0;
    static #allEvents = [];

    constructor(id, title, description, location, date, duration) {
        this.#id = id;
        this.#title = title;
        this.#description = description;
        this.#location = location;
        this.#date = date;
        this.#duration = duration;
    }

    static isDate(date) {
        return (new Date(date) !== "Invalid Date") && !isNaN(new Date(date));
    }

    static all() {
        let all = [];
        PlannerEvent.#allEvents.forEach(event => {
            all.push({"id": event.#id, "title": event.#title, "description": event.#description, "location": event.#location, "date": event.#date, "duration": event.#duration})
        });
        all = all.sort((a, b) => new Date(a.date) - new Date(b.date));
        return all;
    }

    static create(data) {
        if (data !== undefined && data instanceof Object
        && data.title !== undefined
        && typeof data.title == "string"
        && data.date !== undefined
        && typeof data.date == "string"
        && this.isDate(data.date)) {
            let id = PlannerEvent.#next_id++;
            let title = data.title;
            let description = "";
            let location = "";
            let date = data.date;
            let duration = 0;

            if (data.description !== undefined && typeof data.description == 'string') {
                description = data.description;
            }
            if (data.location !== undefined && typeof data.location == 'string') {
                location = data.location;
            }
            if (data.duration !== undefined && typeof data.duration == 'number') {
                duration = data.duration;
            }

            let event = new PlannerEvent(id, title, description, location, date, duration);
            PlannerEvent.#allEvents.push(event);
            return {"id": event.#id, "title": event.#title, "description": event.#description, "location": event.#location, "date": event.#date, "duration": event.#duration};
        }
        return null;
    }

    static update(data, id) {
        let event = PlannerEvent.getByID(id);
        if (data !== undefined && data instanceof Object) {
            if (data.title !== undefined && typeof data.title == 'string') {
                event.#title = data.title;
            }
            if (data.description !== undefined && typeof data.description == 'string') {
                event.#description = data.description;
            }
            if (data.location !== undefined && typeof data.location == 'string') {
                event.#location = data.location;
            }
            if (data.date !== undefined && typeof data.date == "string"
            && this.isDate(data.date)) {
                event.#date = data.date;
            }
            if (data.duration !== undefined && typeof data.duration == 'number') {
                event.#duration = data.duration;
            }
        }
        return {"id": event.#id, "title": event.#title, "description": event.#description, "location": event.#location, "date": event.#date, "duration": event.#duration};
    }

    static getByID(id) {
        let event = PlannerEvent.#allEvents.find(e => e.getID() == id);
        return (event == undefined ? null : event);
    }

    static getByIDJSON(id) {
        let event = PlannerEvent.#allEvents.find(e => e.getID() == id);
        return (event == undefined ? null : {"id": event.#id, "title": event.#title, "description": event.#description, "location": event.#location, "date": event.#date, "duration": event.#duration});
    }

    static delete(id) {
        PlannerEvent.#allEvents = PlannerEvent.#allEvents.filter(e => e.getID() != id);
        return true;
    }

    getID() {
        return this.#id;
    }
}