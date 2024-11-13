class Order {
    constructor(action, delay = 0) {
        this.action = action;
        this.delay = delay;
    }

    execute(soldier) {
        setTimeout(() => {
            soldier.executeAction(this.action);
        }, this.delay);
    }
}