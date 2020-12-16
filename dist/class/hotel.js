"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const uuid_1 = require("uuid");
class Hotel {
    constructor(city, chambres) {
        this.id = uuid_1.v4();
        this.city = city;
        this.chambres = chambres;
    }
}
exports.default = Hotel;
//# sourceMappingURL=hotel.js.map