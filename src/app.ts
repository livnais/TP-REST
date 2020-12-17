import express from "express";
import Hotel from "./class/hotel";
import { isBookableHotel, initData } from "./utils/utils";
import moment from "moment";
const app = express();
const PORT = process.env.PORT || 8080;
let hotels = Array<Hotel>();
moment.locale("fr");

app.get("/v1/booking", (req, res) => {
  const { city } = req.query;
  //@ts-ignore
  const startDate: string = req.query.startDate;
  //@ts-ignore
  const endDate: string = req.query.endDate;

  if (
    city &&
    startDate &&
    endDate &&
    moment(startDate).isValid() &&
    moment(endDate).isValid() &&
    moment(startDate).isBefore(endDate)
  ) {
    isBookableHotel(city, startDate, endDate, hotels)
      .then((result) => res.send(result))
      .catch((error) => {
        res.send(error);
      });
  } else {
    res.send({ code: "error", result: "invalid information" });
  }
});

app.get("/v1/payment", (req, res) => {
  res.send({ hotels });
});

app.listen(PORT, () => {
  hotels = initData();
  return console.log(`server is listening on ${PORT}`);
});
