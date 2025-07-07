import { CITATIONS_EXTRACT } from "../contants/citations-extract.constants";

export class ParserService {
  constructor() {}

  isolateCharactersFromGlobal(list: RegExpExecArray[]): string[] {
    return [
      ...list[0].input.matchAll(CITATIONS_EXTRACT.global_character_isolation),
    ].map((e) => e[0]);
  }

  extractInfosFromRawData(rawData: string) {
    // console.log(rawData);
    // characterName = [
    //   ...data.matchAll(CITATIONS_EXTRACT.specific_character_name),
    // ][0][1];
    // {{citation| ------ }}
    // {{Réf Film
    // {{Réf Série
    // |acteur=
    // |auteur=
    // si série
    // |série=
    // |saison=
    // |épisode=
    // si film
    // |titre=
    // |date=
  }
}
