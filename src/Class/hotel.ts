import Chambre from "./chambre";
import { v4 as uuidv4 } from "uuid";
export default class Hotel {
  id: string;
  city: string;
  chambres: Array<Chambre>;
  price: number;

  constructor(city, price: number, chambres: Array<Chambre>) {
    this.id = uuidv4();
    this.city = city;
    this.chambres = chambres;
    this.price = price;
  }
}
