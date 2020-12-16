"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chambre_1 = __importDefault(require("../class/chambre"));
const hotel_1 = __importDefault(require("../Class/hotel"));
const moment_1 = __importDefault(require("moment"));
const dateSejour_1 = __importDefault(require("../Class/dateSejour"));
const uuid_1 = require("uuid");
exports.initData = () => {
    const hotels = Array();
    let chambre1 = new chambre_1.default();
    let chambre2 = new chambre_1.default();
    const listChambre = [];
    listChambre.push(chambre1);
    listChambre.push(chambre2);
    let hotelParis = new hotel_1.default("Paris", listChambre);
    let chambre3 = new chambre_1.default();
    const listChambre2 = [];
    listChambre2.push(chambre3);
    let hotelBx = new hotel_1.default("Bx", listChambre2);
    hotels.push(hotelParis);
    hotels.push(hotelBx);
    return hotels;
};
const formatDate = (date) => moment_1.default(date).startOf("day");
const isFreeRoom = (startDate, endDate, itemsMonth) => {
    for (let i = 0; i < itemsMonth.length; i++) {
        if (formatDate(startDate).isBetween(formatDate(itemsMonth[i].debut), formatDate(itemsMonth[i].fin), "day", "[]") ||
            formatDate(endDate).isBetween(formatDate(itemsMonth[i].debut), formatDate(itemsMonth[i].fin), "day", "[]") ||
            formatDate(itemsMonth[i].debut).isBetween(formatDate(startDate), formatDate(endDate), "day", "[]") ||
            formatDate(itemsMonth[i].fin).isBetween(formatDate(startDate), formatDate(endDate), "day", "[]")) {
            return false;
        }
    }
    return true;
};
exports.isBookableChambre = (startDate, endDate, listChambre, city) => {
    return new Promise((successCallback, failureCallback) => {
        for (let i = 0; i < listChambre.length; i++) {
            const chambre = listChambre[i];
            const chambreReservation = chambre.reservation;
            if (isFreeRoom(startDate, endDate, chambreReservation)) {
                const uid = uuid_1.v4();
                const sejour = new dateSejour_1.default(uid, startDate, endDate);
                chambre.addSejour(sejour);
                successCallback({
                    code: "success",
                    result: {
                        sejourUid: uid,
                        ville: city,
                        chambreUid: chambre.id,
                        sejour,
                    },
                });
                break;
            }
        }
        failureCallback({ code: "error", result: "Unavailable data" });
    });
};
exports.isBookableHotel = (city, startDate, endDate, listHotel) => {
    return new Promise((success, failed) => {
        const hotelIndex = listHotel.findIndex((hotel) => hotel.city === city);
        if (hotelIndex > -1) {
            exports.isBookableChambre(startDate, endDate, listHotel[hotelIndex].chambres, city)
                .then((result) => {
                success(result);
            })
                .catch((error) => {
                failed(error);
            });
        }
        else {
            failed({ code: "error", result: "Cannot find hotel" });
        }
    });
};
//# sourceMappingURL=utils.js.map