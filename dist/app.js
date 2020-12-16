"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const utils_1 = require("./Utils/utils");
const moment_1 = __importDefault(require("moment"));
const app = express_1.default();
const PORT = process.env.PORT || 8080;
let hotels = Array();
moment_1.default.locale("fr");
app.get("/v1/booking", (req, res) => {
    const { city } = req.query;
    //@ts-ignore
    const startDate = req.query;
    //@ts-ignore
    const endDate = req.query;
    console.log(moment_1.default(startDate).isValid(), moment_1.default(endDate).isValid(), moment_1.default(moment_1.default(startDate)).isBefore(moment_1.default(endDate), "day"), startDate, endDate);
    if (city &&
        startDate &&
        endDate &&
        moment_1.default(startDate).isValid() &&
        moment_1.default(endDate).isValid() &&
        moment_1.default(startDate).isBefore(endDate, "day")) {
        utils_1.isBookableHotel(city, startDate, endDate, hotels)
            .then((result) => res.send(result))
            .catch((error) => {
            res.send(error);
        });
    }
    else {
        res.send({ code: "error", result: "invalid information" });
    }
});
app.listen(PORT, () => {
    hotels = utils_1.initData();
    // console.log(hotels);
    return console.log(`server is listening on ${PORT}`);
});
//# sourceMappingURL=app.js.map