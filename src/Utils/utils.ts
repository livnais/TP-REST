import Chambre from "../class/chambre";
import Hotel from "../Class/hotel";
import moment from "moment";
import DateSejour from "../Class/dateSejour";
import { v4 as uuidv4 } from "uuid";

export const initData = () => {
  const hotels = Array<Hotel>();

  let chambre1 = new Chambre();
  let chambre2 = new Chambre();

  const listChambre = [];
  listChambre.push(chambre1);
  listChambre.push(chambre2);
  let hotelParis = new Hotel("Paris", listChambre);

  let chambre3 = new Chambre();

  const listChambre2 = [];
  listChambre2.push(chambre3);

  let hotelBx = new Hotel("Bx", listChambre2);
  hotels.push(hotelParis);
  hotels.push(hotelBx);
  return hotels;
};

const formatDate = (date) => moment(date).startOf("day");

const isFreeRoom = (startDate, endDate, itemsMonth: Array<DateSejour>) => {
  for (let i = 0; i < itemsMonth.length; i++) {
    if (
      formatDate(startDate).isBetween(
        formatDate(itemsMonth[i].debut),
        formatDate(itemsMonth[i].fin),
        "day",
        "[]"
      ) ||
      formatDate(endDate).isBetween(
        formatDate(itemsMonth[i].debut),
        formatDate(itemsMonth[i].fin),
        "day",
        "[]"
      ) ||
      formatDate(itemsMonth[i].debut).isBetween(
        formatDate(startDate),
        formatDate(endDate),
        "day",
        "[]"
      ) ||
      formatDate(itemsMonth[i].fin).isBetween(
        formatDate(startDate),
        formatDate(endDate),
        "day",
        "[]"
      )
    ) {
      return false;
    }
  }
  return true;
};

export const isBookableChambre = (
  startDate,
  endDate,
  listChambre: Array<Chambre>,
  city
) => {
  return new Promise((successCallback, failureCallback) => {
    for (let i = 0; i < listChambre.length; i++) {
      const chambre = listChambre[i];
      const chambreReservation = chambre.reservation;
      if (isFreeRoom(startDate, endDate, chambreReservation)) {
        const uid = uuidv4();

        const sejour = new DateSejour(uid, startDate, endDate);
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

export const isBookableHotel = (
  city,
  startDate,
  endDate,
  listHotel: Array<Hotel>
) => {
  return new Promise((success, failed) => {
    const hotelIndex = listHotel.findIndex((hotel) => hotel.city === city);
    if (hotelIndex > -1) {
      isBookableChambre(
        startDate,
        endDate,
        listHotel[hotelIndex].chambres,
        city
      )
        .then((result) => {
          success(result);
        })
        .catch((error) => {
          failed(error);
        });
    } else {
      failed({ code: "error", result: "Cannot find hotel" });
    }
  });
};
