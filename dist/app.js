"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const utils_1 = require("./utils/utils");
const moment_1 = __importDefault(require("moment"));
const app = express_1.default();
const PORT = process.env.PORT || 8080;
let hotels = Array();
moment_1.default.locale("fr");
app.get("/v1/booking", (req, res) => {
    const { city } = req.query;
    //@ts-ignore
    const startDate = req.query.startDate;
    //@ts-ignore
    const endDate = req.query.endDate;
    if (moment_1.default(startDate).startOf("day").isBefore(moment_1.default())) {
        res.send({
            code: "error",
            result: {
                message: "not ok",
                description: "The start date must be greater than the current day",
            },
        });
    }
    else if (moment_1.default(startDate)
        .startOf("day")
        .isSameOrAfter(moment_1.default(endDate).startOf("day"))) {
        res.send({
            code: "error",
            result: {
                message: "not ok",
                description: "The end date must be greater than the start date",
            },
        });
    }
    else if (city &&
        startDate &&
        endDate &&
        moment_1.default(startDate).isValid() &&
        moment_1.default(endDate).isValid()) {
        utils_1.isBookableHotel(city, startDate, endDate, hotels)
            .then((result) => res.send(result))
            .catch((error) => {
            res.send(error);
        });
    }
    else {
        res.send({
            code: "error",
            result: { message: "not ok", description: "Invalid information" },
        });
    }
});
app.get("/v1/payment", (req, res) => {
    const { uidSejour } = req.query;
    if (uidSejour) {
        utils_1.confirmBookingPayment(uidSejour, hotels)
            .then((result) => res.send(result))
            .catch((error) => res.send(error));
    }
    else {
        res.send({ code: "error", result: { message: "Invalid information" } });
    }
});
app.listen(PORT, () => {
    hotels = utils_1.initData();
    utils_1.cleanSejourDisponible();
    return console.log(`server is listening on ${PORT}`);
});
//# sourceMappingURL=app.js.map