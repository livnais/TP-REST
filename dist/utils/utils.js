"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chambre_1 = __importDefault(require("../class/chambre"));
const hotel_1 = __importDefault(require("../class/hotel"));
const moment_1 = __importDefault(require("moment"));
const dateSejour_1 = __importDefault(require("../class/dateSejour"));
const uuid_1 = require("uuid");
const CHAMBRENUMBER = 20;
const CHAMBRENUMBER2 = 50;
exports.initData = () => {
    const hotels = Array();
    const listChambreParis = [];
    for (let i = 0; i < CHAMBRENUMBER; i++) {
        listChambreParis.push(new chambre_1.default());
    }
    let hotelParis = new hotel_1.default("Paris", listChambreParis);
    const listChambreLaval = [];
    for (let i = 0; i < CHAMBRENUMBER2; i++) {
        listChambreLaval.push(new chambre_1.default());
    }
    let hotelLaval = new hotel_1.default("Laval", listChambreLaval);
    const listChambreStDenis = [];
    for (let i = 0; i < CHAMBRENUMBER2; i++) {
        listChambreStDenis.push(new chambre_1.default());
    }
    let hotelSD = new hotel_1.default("Saint-Denis", listChambreStDenis);
    const listChambreSF = [];
    for (let i = 0; i < CHAMBRENUMBER; i++) {
        listChambreSF.push(new chambre_1.default());
    }
    let hotelSF = new hotel_1.default("San Francisco", listChambreSF);
    hotels.push(hotelParis);
    hotels.push(hotelLaval);
    hotels.push(hotelSD);
    hotels.push(hotelSF);
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
const isBookableChambre = (startDate, endDate, listChambre, city) => {
    return new Promise((successCallback, failureCallback) => {
        for (let i = 0; i < listChambre.length; i++) {
            const chambre = listChambre[i];
            const chambreReservation = chambre.reservation;
            if (isFreeRoom(startDate, endDate, chambreReservation)) {
                const uid = uuid_1.v4();
                const sejour = new dateSejour_1.default(uid, startDate, endDate);
                chambre.addSejour(sejour);
                const price = `${Math.abs(moment_1.default(startDate).diff(moment_1.default(endDate), "days")) * 54}€`;
                console.log({ price });
                successCallback({
                    code: "success",
                    result: {
                        price,
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
        const hotelIndex = listHotel.findIndex((hotel) => hotel.city.toUpperCase() === city.toUpperCase());
        if (hotelIndex > -1) {
            isBookableChambre(startDate, endDate, listHotel[hotelIndex].chambres, listHotel[hotelIndex].city)
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