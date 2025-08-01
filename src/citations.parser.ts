import path from "path";
import { LOCAL_MODE } from ".";
import { CITATIONS_EXTRACT } from "./contants/citations-extract.constant";
import { FILE_EXTENSION } from "./contants/file-extension.enum";
import {
  CITATIONS,
  PARSED_EXTRACT,
  FETCHED_EXTRACT,
} from "./contants/filenames.constant";
import { CITATIONS_XML_URLS } from "./contants/xml-urls.constant";
import { CitationModel } from "./models/citation.model";
import { commonService } from "./services/common.service";
import { fetchingService } from "./services/fetching.service";
import { fileService } from "./services/file.service";
import { logger } from "./services/logger.service";
import { parserService } from "./services/parser.service";

export class CitationsParser {
  private loggerContext = "CitationsParser";

  constructor() {}
  async extractCitations() {
    logger.info("Start extracting citations", this.loggerContext);
    CITATIONS_XML_URLS.forEach(async (url) => {
      logger.info(`Processing file: ${url.fileName}`, this.loggerContext);
      let data;

      if (!LOCAL_MODE) {
        data = await fetchingService.fetch(url.url);
        fileService.fileCreation(
          path.join(FETCHED_EXTRACT, CITATIONS),
          url.fileName,
          FILE_EXTENSION.XML,
          data
        );
      }
      data = fetchingService.localFetch(url.filePath);

      if (data) {
        data = commonService.cleanText(data);

        let citationsList: CitationModel[] = [];
        const globalCitations = [...data.matchAll(CITATIONS_EXTRACT.global)];

        if (globalCitations.length > 0) {
          const globalCharactersList =
            parserService.isolateCharactersFromGlobal(globalCitations);

          globalCharactersList.forEach((e, i) => {
            const results = parserService.extractInfosFromRawData(e, true);
            citationsList.push(...results);
          });
        } else {
          const results = parserService.extractInfosFromRawData(data);
          citationsList.push(...results);
        }

        fileService.appendToDataJson(PARSED_EXTRACT, CITATIONS, citationsList);
        logger.info(
          `Citations of ${url.fileName} extracted`,
          this.loggerContext
        );
      } else {
        logger.warn(
          "Citations parsing ended on an unsuspected event. File is unreachable. Look at the logs.\n",
          this.loggerContext
        );
      }
    });
    logger.info("Citations parsing finished\n", this.loggerContext);
  }
}

export const citationsParser = new CitationsParser();
