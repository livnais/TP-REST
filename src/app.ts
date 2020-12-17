import express from "express";
import Hotel from "./class/hotel";
import {
  isBookableHotel,
  initData,
  cleanSejourDisponible,
  confirmBookingPayment,
} from "./utils/utils";
import moment from "moment";
const app = express();
const PORT = process.env.PORT || 8080;
let hotels = Array<Hotel>();
moment.locale("fr");

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Request-Method", "GET");
  res.setHeader("Access-Control-Request-Headers", "*");
  next();
});

app.get("/v1/booking", (req, res) => {
  const { city } = req.query;
  //@ts-ignore
  const startDate: string = req.query.startDate;
  //@ts-ignore
  const endDate: string = req.query.endDate;

  if (moment(startDate).startOf("day").isBefore(moment())) {
    res.json({
      code: "error",
      result: {
        message: "not ok",
        description: "The start date must be greater than the current day",
      },
    });
  } else if (
    moment(startDate)
      .startOf("day")
      .isSameOrAfter(moment(endDate).startOf("day"))
  ) {
    res.send({
      code: "error",
      result: {
        message: "not ok",
        description: "The end date must be greater than the start date",
      },
    });
  } else if (
    city &&
    startDate &&
    endDate &&
    moment(startDate).isValid() &&
    moment(endDate).isValid()
  ) {
    isBookableHotel(city, startDate, endDate, hotels)
      .then((result) => res.send(result))
      .catch((error) => {
        res.send(error);
      });
  } else {
    res.send({
      code: "error",
      result: { message: "not ok", description: "Invalid information" },
    });
  }
});

app.get("/v1/payment", (req, res) => {
  const { uidSejour } = req.query;
  if (uidSejour) {
    confirmBookingPayment(uidSejour, hotels)
      .then((result) => res.send(result))
      .catch((error) => res.send(error));
  } else {
    res.send({ code: "error", result: { message: "Invalid information" } });
  }
});

app.listen(PORT, () => {
  hotels = initData();
  cleanSejourDisponible();
  return console.log(`server is listening on ${PORT}`);
});
