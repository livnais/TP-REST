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
const sejourDisponible = new Map();
let sejourDisponibleArray = [];
exports.initData = () => {
    const hotels = Array();
    const listChambreParis = [];
    for (let i = 0; i < CHAMBRENUMBER; i++) {
        listChambreParis.push(new chambre_1.default());
    }
    let hotelParis = new hotel_1.default("Paris", 54, listChambreParis);
    const listChambreLaval = [];
    for (let i = 0; i < CHAMBRENUMBER2; i++) {
        listChambreLaval.push(new chambre_1.default());
    }
    let hotelLaval = new hotel_1.default("Laval", 23, listChambreLaval);
    const listChambreStDenis = [];
    for (let i = 0; i < CHAMBRENUMBER2; i++) {
        listChambreStDenis.push(new chambre_1.default());
    }
    let hotelSD = new hotel_1.default("Saint-Denis", 10, listChambreStDenis);
    const listChambreSF = [];
    for (let i = 0; i < CHAMBRENUMBER; i++) {
        listChambreSF.push(new chambre_1.default());
    }
    let hotelSF = new hotel_1.default("San Francisco", 67, listChambreSF);
    hotels.push(hotelParis);
    hotels.push(hotelLaval);
    hotels.push(hotelSD);
    hotels.push(hotelSF);
    return hotels;
};
const formatDate = (date) => moment_1.default(date).startOf("day");
const isFreeRoom = (startDate, endDate, itemReservation, chambreId) => {
    for (let i = 0; i < itemReservation.length; i++) {
        if (formatDate(startDate).isBetween(formatDate(itemReservation[i].debut), formatDate(itemReservation[i].fin), "day", "[]") ||
            formatDate(endDate).isBetween(formatDate(itemReservation[i].debut), formatDate(itemReservation[i].fin), "day", "[]") ||
            formatDate(itemReservation[i].debut).isBetween(formatDate(startDate), formatDate(endDate), "day", "[]") ||
            formatDate(itemReservation[i].fin).isBetween(formatDate(startDate), formatDate(endDate), "day", "[]")) {
            if (itemReservation[i].chambreUid &&
                chambreId !== itemReservation[i].chambreUid) {
                return true;
            }
            return false;
        }
    }
    return true;
};
const isBookableChambre = (startDate, endDate, listChambre, city, priceChambre) => {
    return new Promise((successCallback, failureCallback) => {
        for (let i = 0; i < listChambre.length; i++) {
            const chambre = listChambre[i];
            const chambreReservation = chambre.reservation;
            if (isFreeRoom(startDate, endDate, chambreReservation)) {
                if (isFreeRoom(startDate, endDate, sejourDisponibleArray, chambre.id)) {
                    const uid = uuid_1.v4();
                    const sejour = new dateSejour_1.default(uid, startDate, endDate);
                    const price = `${Math.abs(moment_1.default(startDate).diff(moment_1.default(endDate), "days")) *
                        priceChambre}€`;
                    sejourDisponible.set(uid, {
                        updateAt: moment_1.default(),
                        price,
                        sejourUid: uid,
                        ville: city,
                        chambreUid: chambre.id,
                        sejour,
                    });
                    sejourDisponibleArray = Array.from(sejourDisponible.values());
                    successCallback({
                        code: "success",
                        result: { message: "ok", uidSejour: uid, price },
                    });
                    break;
                }
            }
        }
        failureCallback({
            code: "error",
            result: { message: "not ok", description: "Unavailable data" },
        });
    });
};
exports.isBookableHotel = (city, startDate, endDate, listHotel) => {
    return new Promise((success, failed) => {
        const hotelIndex = listHotel.findIndex((hotel) => hotel.city.toUpperCase() === city.toUpperCase());
        if (hotelIndex > -1) {
            const { chambres, city, price } = listHotel[hotelIndex];
            isBookableChambre(startDate, endDate, chambres, city, price)
                .then((result) => {
                success(result);
            })
                .catch((error) => {
                failed(error);
            });
        }
        else {
            failed({
                code: "error",
                result: "not ok",
                description: "Cannot find hotel",
            });
        }
    });
};
const addSejour = (sejourReser, listHotel) => {
    const hotelIndex = listHotel.findIndex((hotel) => hotel.city.toUpperCase() === sejourReser.ville.toUpperCase());
    if (hotelIndex >= 0) {
        const chambre = listHotel[hotelIndex].chambres.find((ch) => ch.id === sejourReser.chambreUid);
        if (chambre) {
            chambre.addSejour(sejourReser.sejour);
            console.log("yolo");
        }
    }
};
exports.confirmBookingPayment = (uid, listHotel) => {
    return new Promise((success, failed) => {
        const sejourDispo = sejourDisponible.get(uid);
        if (sejourDispo) {
            addSejour(sejourDispo, listHotel);
            sejourDisponible.delete(uid);
            success({
                code: "success",
                result: {
                    message: "ok",
                    description: `Congratulations on your well booked hotel in ${sejourDispo.ville}`,
                    sejourUid: sejourDispo.sejourUid,
                    chambreId: sejourDispo.chambreUid,
                    price: sejourDispo.price,
                },
            });
        }
        else {
            failed({
                code: "error",
                result: {
                    messege: "not ok",
                    description: "We are sorry, we could not confirm your reservation",
                },
            });
        }
    });
};
exports.cleanSejourDisponible = () => {
    setInterval(() => {
        for (const [key, value] of sejourDisponible.entries()) {
            if (Math.abs(moment_1.default(value.updateAt).diff(moment_1.default(), "minutes")) >= 5) {
                sejourDisponible.delete(key);
            }
        }
        sejourDisponibleArray = Array.from(sejourDisponible.values());
    }, 30000);
};
//# sourceMappingURL=utils.js.map