import { CLEANING_REGEXP } from "../contants/cleaning-regexp.constants";
export class CommonService {
  constructor() {}
  cleanText(text: string): string {
    let res = text;
    CLEANING_REGEXP.forEach((symbol, i) => {
      i < 1
        ? (res = text.replace(symbol.regexp, symbol.converted))
        : (res = res.replace(symbol.regexp, symbol.converted));
    });
    return res.trim();
  }
}
