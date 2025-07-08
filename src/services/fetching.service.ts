import { readFileSync } from "fs";

export class FetchingService {
  constructor() {}

  async fetch(url: string) {
    const response = await fetch(url);
    return response.text() || "";
  }
  localFetch(url: string) {
    const response = readFileSync(url, "utf8") || "";
    return response;
  }
}
