export default class DateSejour {
  uid: string;
  debut: Date;
  fin: Date;

  constructor(uid: string, debut: Date, fin: Date) {
    this.uid = uid;
    this.debut = debut;
    this.fin = fin;
  }
}
