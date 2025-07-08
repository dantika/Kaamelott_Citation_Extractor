import { CITATIONS_EXTRACT } from "./contants/citations-extract.constants";
import { CITATIONS_XML_URLS } from "./contants/xml-urls.constant";
import { CommonService } from "./services/common.service";
import { FetchingService } from "./services/fetching.service";
import { FileService } from "./services/file.service";
import { ParserService } from "./services/parser.service";

const parserService = new ParserService();
const fetchingService = new FetchingService();
const commonService = new CommonService();
const fileService = new FileService();

const DEBUG_MODE = true;

extractCitations();

function extractCitations() {
  CITATIONS_XML_URLS.forEach((url) => {
    let data = DEBUG_MODE
      ? fetchingService.localFetch(url.local)
      : fetchingService.fetch(url.url);

    if (typeof data !== "string") {
      // TODO Create the whole process to get files from urls
      // and create xml files in corresponding folder before continue
      // if not in DEBUG_MODE
      data = "";
    }
    data = commonService.cleanText(data);

    const globalCitations = [...data.matchAll(CITATIONS_EXTRACT.global)];
    if (globalCitations.length > 0) {
      const globalCharactersList =
        parserService.isolateCharactersFromGlobal(globalCitations);

      globalCharactersList.forEach((e, i) => {
        parserService.extractInfosFromRawData(e, true);

        // fileService.appendToDataJsonFile(
        //   DESTINATION_FOLDER,
        //   CITATIONS,
        //   parserService.extractInfosFromRawData(e)
        // );
      });
    } else {
      parserService.extractInfosFromRawData(data);

      // fileService.appendToDataJsonFile(
      //   DESTINATION_FOLDER,
      //   CITATIONS,
      //   parserService.extractInfosFromRawData(data)
      // );
    }
  });
}
