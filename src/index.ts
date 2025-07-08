import { CitationsParser } from "./citations.parser";

export const DEBUG_MODE = false;

const citationsParserService = new CitationsParser();

citationsParserService.extractCitations();
// TODO Dialog parser
// TODO Comics parser
