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

    static all() {
        return this.#allEvents;
    }

    static create(data) {
        if (data !== undefined && data instanceof Object
        && data.title !== undefined
        && typeof data.title == "string"
        && data.date !== undefined
        && Object.prototype.toString.call(data.date) === '[object Date]') {
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
            return event;
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
            if (data.date !== undefined && Object.prototype.toString.call(data.date) === '[object Date]') {
                event.#date = data.date;
            }
            if (data.duration !== undefined && typeof data.duration == 'number') {
                event.#duration = data.duration;
            }
        }
        return event;
    }

    static getByID(id) {
        let event = PlannerEvent.#allEvents.find(e => e.getID() == id);
        return (event == undefined ? null : event);
    }

    getID() {
        return this.#id;
    }
}