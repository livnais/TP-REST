import DateSejour from "./dateSejour";
import moment from "moment";
import { v4 as uuidv4 } from "uuid";
export default class Chambre {
  id: number;
  reservation: Array<DateSejour>;
  constructor() {
    this.id = uuidv4();
    this.reservation = [];
  }

  trierList() {
    this.reservation.sort((a, b) =>
      moment(a.debut).startOf("day").isBefore(moment(b.debut).startOf("day"))
        ? -1
        : 1
    );
  }
  addSejour(sejour: DateSejour) {
    this.reservation.push(sejour);
    this.trierList();
  }
}
