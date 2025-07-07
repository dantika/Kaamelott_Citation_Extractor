import { CITATIONS_EXTRACT } from "./contants/citations-extract.constants";
import { CITATIONS_XML_URLS } from "./contants/xml-urls.constant";
import { FetchingService } from "./services/fetching.service";
import { ParserService } from "./services/parser.service";

const parserService = new ParserService();
const fetchingService = new FetchingService();

CITATIONS_XML_URLS.forEach((url) => {
  let x = fetchingService.localFetch(url.local);
  x = fetchingService.cleanText(x);

  let isGLobalCitations = [...x.matchAll(CITATIONS_EXTRACT.global)];
  if (isGLobalCitations.length > 0) {
    console.log("GLOBAL FILE ---");
  } else {
    let name = [...x.matchAll(CITATIONS_EXTRACT.specific_character_name)];
    console.log("NAME --- ", name[0][1]);
  }
});

// console.log(name)
