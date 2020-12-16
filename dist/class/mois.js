"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const moment_1 = __importDefault(require("moment"));
class Mois {
    constructor(mois, annee) {
        this.mois = mois;
        this.annee = annee;
        this.dateSejour = [];
    }
    trierList() {
        this.dateSejour.sort((a, b) => moment_1.default(a.debut).startOf("day").isBefore(moment_1.default(b.debut).startOf("day"))
            ? -1
            : 1);
    }
    addSejour(sejour) {
        this.dateSejour.push(sejour);
        this.trierList();
    }
}
exports.default = Mois;
//# sourceMappingURL=mois.js.map