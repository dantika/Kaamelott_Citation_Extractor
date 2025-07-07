import { CITATIONS, DESTINATION_FOLDER } from "./contants/filenames.constant";
import { FileService } from "./services/file.service";
import { CommonService } from "./services/common.service";
import { CITATIONS_EXTRACT } from "./contants/citations-extract.constants";
import { CITATIONS_XML_URLS } from "./contants/xml-urls.constant";
import { FetchingService } from "./services/fetching.service";
import { ParserService } from "./services/parser.service";

const parserService = new ParserService();
const fetchingService = new FetchingService();
const commonService = new CommonService();
const fileService = new FileService();

const DEBUG_MODE = true;

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

  // NOTE check if file if the global one
  const globalCitations = [...data.matchAll(CITATIONS_EXTRACT.global)];
  if (globalCitations.length > 0) {
    const globalCharactersList =
      parserService.isolateCharactersFromGlobal(globalCitations);

    globalCharactersList.forEach((e, i) => {
      parserService.extractInfosFromRawData(e);

      const parsedCitation = {
        index: i,
        content: e,
      };

      fileService.appendToDataJsonFile(
        DESTINATION_FOLDER,
        CITATIONS,
        parsedCitation
      );
    });
  } else {
    // const parsedCitation = parserService.extractInfosFromRawData(data);
    const parsedCitation = {
      kjfze: data,
    };
    fileService.appendToDataJsonFile(
      DESTINATION_FOLDER,
      CITATIONS,
      parsedCitation
    );
  }
});
