import express from "express";
import Hotel from "./Class/hotel";
import { isBookableHotel, initData } from "./Utils/utils";
import moment from "moment";
const app = express();
const PORT = process.env.PORT || 8080;
let hotels = Array<Hotel>();
moment.locale("fr");

app.get("/v1/booking", (req, res) => {
  const { city } = req.query;
  //@ts-ignore
  const startDate: string = req.query;
  //@ts-ignore
  const endDate: string = req.query;
  console.log(
    moment(startDate).isValid(),
    moment(endDate).isValid(),
    moment(moment(startDate)).isBefore(moment(endDate), "day"),
    startDate,
    endDate
  );
  if (
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
    res.send({ code: "error", result: "invalid information" });
  }
});

app.listen(PORT, () => {
  hotels = initData();
  // console.log(hotels);
  return console.log(`server is listening on ${PORT}`);
});
