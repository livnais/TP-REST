import Chambre from "../class/chambre";
import Hotel from "../class/hotel";
import moment, { Moment } from "moment";
import DateSejour from "../class/dateSejour";
import { v4 as uuidv4 } from "uuid";

const CHAMBRENUMBER = 20;
const CHAMBRENUMBER2 = 50;
export const initData = () => {
  const hotels = Array<Hotel>();

  const listChambreParis = [];
  for (let i = 0; i < CHAMBRENUMBER; i++) {
    listChambreParis.push(new Chambre());
  }
  let hotelParis = new Hotel("Paris", listChambreParis);

  const listChambreLaval = [];
  for (let i = 0; i < CHAMBRENUMBER2; i++) {
    listChambreLaval.push(new Chambre());
  }
  let hotelLaval = new Hotel("Laval", listChambreLaval);

  const listChambreStDenis = [];
  for (let i = 0; i < CHAMBRENUMBER2; i++) {
    listChambreLaval.push(new Chambre());
  }

  let hotelSD = new Hotel("Saint-Denis", listChambreStDenis);
  const listChambreSF = [];
  for (let i = 0; i < CHAMBRENUMBER; i++) {
    listChambreLaval.push(new Chambre());
  }
  let hotelSF = new Hotel("San Francisco", listChambreSF);

  hotels.push(hotelParis);
  hotels.push(hotelLaval);
  hotels.push(hotelSD);
  hotels.push(hotelSF);
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

const isBookableChambre = (
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
        const price = `${
          Math.abs(moment(startDate).diff(moment(endDate), "days")) * 54
        }€`;
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
