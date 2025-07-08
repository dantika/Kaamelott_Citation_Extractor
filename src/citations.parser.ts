import path from "path";
import { DEBUG_MODE } from ".";
import { CITATIONS_EXTRACT } from "./contants/citations-extract.constants";
import {
  CITATIONS,
  CLEANED_EXTRACT_FOLDER,
  RAW_EXTRACT_FOLDER,
} from "./contants/filenames.constant";
import { CITATIONS_XML_URLS } from "./contants/xml-urls.constant";
import { CitationModel } from "./models/citation.model";
import { CommonService } from "./services/common.service";
import { FetchingService } from "./services/fetching.service";
import { FileService } from "./services/file.service";
import { ParserService } from "./services/parser.service";
export class CitationsParser {
  parserService = new ParserService();
  fetchingService = new FetchingService();
  commonService = new CommonService();
  fileService = new FileService();

  constructor() {}
  async extractCitations() {
    CITATIONS_XML_URLS.forEach(async (url) => {
      let data = "";
      let localFilePath = DEBUG_MODE ? url.localDebug : url.local;

      if (!DEBUG_MODE) {
        localFilePath = url.local;
        data = await this.fetchingService.fetch(url.url);
        this.fileService.writeXmlFile(
          path.join(RAW_EXTRACT_FOLDER, CITATIONS),
          url.fileName,
          data
        );
      }
      this.fetchingService.localFetch(localFilePath);
      data = this.commonService.cleanText(data);

      let citationsList: CitationModel[] = [];
      const globalCitations = [...data.matchAll(CITATIONS_EXTRACT.global)];

      if (globalCitations.length > 0) {
        const globalCharactersList =
          this.parserService.isolateCharactersFromGlobal(globalCitations);

        globalCharactersList.forEach((e, i) => {
          const results = this.parserService.extractInfosFromRawData(e, true);
          citationsList.push(...results);
        });
      } else {
        const results = this.parserService.extractInfosFromRawData(data);
        citationsList.push(...results);
      }

      this.fileService.appendToDataJsonFile(
        CLEANED_EXTRACT_FOLDER,
        CITATIONS,
        citationsList
      );
    });
  }
}
