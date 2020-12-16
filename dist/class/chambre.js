"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const moment_1 = __importDefault(require("moment"));
const uuid_1 = require("uuid");
class Chambre {
    constructor() {
        this.id = uuid_1.v4();
        this.reservation = [];
    }
    trierList() {
        this.reservation.sort((a, b) => moment_1.default(a.debut).startOf("day").isBefore(moment_1.default(b.debut).startOf("day"))
            ? -1
            : 1);
    }
    addSejour(sejour) {
        this.reservation.push(sejour);
        this.trierList();
    }
}
exports.default = Chambre;
//# sourceMappingURL=chambre.js.map