import { SYMBOLES } from "./../contants/symbol-conversions.constants";
export class CommonService {
  constructor() {}
  cleanText(text: string): string {
    let res = text;
    SYMBOLES.forEach((symbol, i) => {
      i < 1
        ? (res = text.replace(new RegExp(symbol.regexp, "g"), symbol.converted))
        : (res = res.replace(new RegExp(symbol.regexp, "g"), symbol.converted));
    });
    return res.trim();
  }
}
