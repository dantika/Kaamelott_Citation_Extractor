import { citationsParser } from "./citations.parser";
import { logger } from "./services/logger.service";

export const LOCAL_MODE = true;

LOCAL_MODE
  ? logger.warn(`/!\\ LOCAL_MODE /!\\`)
  : logger.warn(
      `/!\\ PRODUCTION_MODE /!\\ Be carefull, it will request the official wikiquotes website !`
    );

citationsParser.extractCitations();
// TODO Dialog parser
// TODO Comics parser
