import Chambre from "./chambre";
import { v4 as uuidv4 } from "uuid";
export default class Hotel {
  id: string;
  city: string;
  chambres: Array<Chambre>;

  constructor(city, chambres: Array<Chambre>) {
    this.id = uuidv4();
    this.city = city;
    this.chambres = chambres;
  }
}
