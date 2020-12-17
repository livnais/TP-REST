import Chambre from "../class/chambre";
import Hotel from "../class/hotel";
import moment from "moment";
import DateSejour from "../class/dateSejour";
import { v4 as uuidv4 } from "uuid";

const CHAMBRENUMBER = 20;
const CHAMBRENUMBER2 = 50;

const sejourDisponible = new Map();
let sejourDisponibleArray = [];

export const initData = () => {
  const hotels = Array<Hotel>();

  const listChambreParis = [];
  for (let i = 0; i < CHAMBRENUMBER; i++) {
    listChambreParis.push(new Chambre());
  }
  let hotelParis = new Hotel("Paris", 54, listChambreParis);

  const listChambreLaval = [];
  for (let i = 0; i < CHAMBRENUMBER2; i++) {
    listChambreLaval.push(new Chambre());
  }
  let hotelLaval = new Hotel("Laval", 23, listChambreLaval);

  const listChambreStDenis = [];
  for (let i = 0; i < CHAMBRENUMBER2; i++) {
    listChambreStDenis.push(new Chambre());
  }
  let hotelSD = new Hotel("Saint-Denis", 10, listChambreStDenis);

  const listChambreSF = [];
  for (let i = 0; i < CHAMBRENUMBER; i++) {
    listChambreSF.push(new Chambre());
  }
  let hotelSF = new Hotel("San Francisco", 67, listChambreSF);

  hotels.push(hotelParis);
  hotels.push(hotelLaval);
  hotels.push(hotelSD);
  hotels.push(hotelSF);
  return hotels;
};

const formatDate = (date) => moment(date).startOf("day");

const isFreeRoom = (
  startDate,
  endDate,
  itemReservation: Array<any>,
  chambreId?: string
) => {
  for (let i = 0; i < itemReservation.length; i++) {
    if (
      formatDate(startDate).isBetween(
        formatDate(itemReservation[i].debut),
        formatDate(itemReservation[i].fin),
        "day",
        "[]"
      ) ||
      formatDate(endDate).isBetween(
        formatDate(itemReservation[i].debut),
        formatDate(itemReservation[i].fin),
        "day",
        "[]"
      ) ||
      formatDate(itemReservation[i].debut).isBetween(
        formatDate(startDate),
        formatDate(endDate),
        "day",
        "[]"
      ) ||
      formatDate(itemReservation[i].fin).isBetween(
        formatDate(startDate),
        formatDate(endDate),
        "day",
        "[]"
      )
    ) {
      if (
        itemReservation[i].chambreUid &&
        chambreId !== itemReservation[i].chambreUid
      ) {
        return true;
      }
      return false;
    }
  }
  return true;
};

const isBookableChambre = (
  startDate,
  endDate,
  listChambre: Array<Chambre>,
  city,
  priceChambre
) => {
  return new Promise((successCallback, failureCallback) => {
    for (let i = 0; i < listChambre.length; i++) {
      const chambre = listChambre[i];
      const chambreReservation = chambre.reservation;
      if (isFreeRoom(startDate, endDate, chambreReservation)) {
        if (isFreeRoom(startDate, endDate, sejourDisponibleArray, chambre.id)) {
          const uid = uuidv4();
          const sejour = new DateSejour(uid, startDate, endDate);
          const price = `${
            Math.abs(moment(startDate).diff(moment(endDate), "days")) *
            priceChambre
          }€`;
          sejourDisponible.set(uid, {
            updateAt: moment(),
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

export const isBookableHotel = (
  city,
  startDate,
  endDate,
  listHotel: Array<Hotel>
) => {
  return new Promise((success, failed) => {
    const hotelIndex = listHotel.findIndex(
      (hotel) => hotel.city.toUpperCase() === city.toUpperCase()
    );
    if (hotelIndex > -1) {
      const { chambres, city, price } = listHotel[hotelIndex];
      isBookableChambre(startDate, endDate, chambres, city, price)
        .then((result) => {
          success(result);
        })
        .catch((error) => {
          failed(error);
        });
    } else {
      failed({
        code: "error",
        result: "not ok",
        description: "Cannot find hotel",
      });
    }
  });
};

const addSejour = (sejourReser, listHotel: Array<Hotel>) => {
  const hotelIndex = listHotel.findIndex(
    (hotel) => hotel.city.toUpperCase() === sejourReser.ville.toUpperCase()
  );
  if (hotelIndex >= 0) {
    const chambre = listHotel[hotelIndex].chambres.find(
      (ch) => ch.id === sejourReser.chambreUid
    );
    if (chambre) {
      chambre.addSejour(sejourReser.sejour);
      console.log("yolo");
    }
  }
};

export const confirmBookingPayment = (uid, listHotel: Array<Hotel>) => {
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
    } else {
      failed({
        code: "error",
        result: {
          message: "not ok",
          description: "We are sorry, we could not confirm your reservation",
        },
      });
    }
  });
};

export const cleanSejourDisponible = () => {
  setInterval(() => {
    for (const [key, value] of sejourDisponible.entries()) {
      if (Math.abs(moment(value.updateAt).diff(moment(), "minutes")) >= 5) {
        sejourDisponible.delete(key);
      }
    }
    sejourDisponibleArray = Array.from(sejourDisponible.values());
  }, 30000);
};
