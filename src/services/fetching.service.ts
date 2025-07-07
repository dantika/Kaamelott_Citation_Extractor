import { readFileSync } from "fs";
import { SYMBOLES } from "../contants/symbol-conversions.constants";

export class FetchingService {
  // date = new Date();
  // time = `${this.date.getFullYear()}/${this.date.getMonth()}/${this.date.getDate()}:${this.date.getHours()}-${this.date.getMinutes()}-${this.date.getSeconds()}-${this.date.getMilliseconds()}`;

  constructor() {}

  async fetch(url: string) {
    const response = await fetch(url);
    return response.text() || "";
  }
  localFetch(url: string) {
    const response = readFileSync(url, "utf8") || "";
    return response;
  }

  cleanText(text: string): string {
    let res = text;
    SYMBOLES.forEach((symbol, i) => {
      i < 1
        ? (res = text.replace(new RegExp(symbol.regexp, "g"), symbol.converted))
        : (res = res.replace(new RegExp(symbol.regexp, "g"), symbol.converted));
    });
    return res.trim();
  }

  getMatch(el: String, regex: RegExp): string {
    const extraction = el.match(regex);
    return extraction ? extraction[1] : "";
  }
}
