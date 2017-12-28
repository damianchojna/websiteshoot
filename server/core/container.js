class Container {

    constructor() {
        this.services = {};
    }

    set(name, service) {
        this.services[name] = service;
    }

    get(name) {
        if (name in this.services) {
            return this.services[name];
        }
        throw new Error(`Service ${name} does not exist`);
    }
};

module.exports = new Container();