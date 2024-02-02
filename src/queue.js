export default class Queue {

    constructor() {
        this.items = [];
    }

    enqueue(item) {
        this.items.push(item);
    }

    dequeue() {
        return this.items.shift() || null;
    }

    getLast() {
        return this.items[this.items.length - 1] || null;
    }

    clear() {
        this.items.length = 0;
    }

    isEmpty() {
        return this.items.length === 0;
    }
}
