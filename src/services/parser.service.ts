import { CITATIONS_EXTRACT } from "../contants/citations-extract.constants";
import { MEDIA_TYPE } from "../contants/media.enum";
import { CitationBuilder } from "./../models/citation.model";

export class ParserService {
  constructor() {}

  isolateCharactersFromGlobal(list: RegExpExecArray[]): string[] {
    return [
      ...list[0].input.matchAll(CITATIONS_EXTRACT.global_character_isolation),
    ].map((e) => e[0]);
  }

  extractCharacterName(rawData: string, isGlobalFile: boolean) {
    return isGlobalFile
      ? [...rawData.matchAll(CITATIONS_EXTRACT.global_character_name)].map(
          (e) => e[2]
        )[0] || ""
      : [...rawData.matchAll(CITATIONS_EXTRACT.specific_character_name)].map(
          (e) => e[1]
        )[0] || "";
  }

  extractEpisodeContent(
    rawData: string,
    regexp: RegExp
  ): {
    name: string;
    number: number | string;
  } {
    let result = [...rawData.matchAll(regexp)][0] || "";

    return {
      name: result[2] || "",
      number: result[1] || "",
    };
  }

  extractContent(rawData: string, regexp: RegExp): string {
    return [...rawData.matchAll(regexp)].map((e) => e[1])[0] || "";
  }

  extractInfosFromRawData(rawData: string, isGlobalFile = false) {
    const isALinkToSpecific = CITATIONS_EXTRACT.linkToSpecific.test(rawData);
    if (!isALinkToSpecific) {
      const citation = new CitationBuilder().build();
      citation.character_name = this.extractCharacterName(
        rawData,
        isGlobalFile
      );

      // TODO Extraire la liste des citations car là je n'en ai que une à chaque fois et redéfinir les entrée suivante
      citation.actor = this.extractContent(rawData, CITATIONS_EXTRACT.actor);
      citation.author = this.extractContent(rawData, CITATIONS_EXTRACT.author);
      citation.description = this.extractContent(rawData, CITATIONS_EXTRACT.description);
      citation.media = this.extractContent(rawData, CITATIONS_EXTRACT.media);
      
      if (citation.media === MEDIA_TYPE.movie) {
        citation.title = this.extractContent(rawData, CITATIONS_EXTRACT.title);
        citation.date = this.extractContent(rawData, CITATIONS_EXTRACT.date);
      } else {
        citation.season = this.extractContent(rawData,CITATIONS_EXTRACT.season);
        citation.show = this.extractContent(rawData, CITATIONS_EXTRACT.show);
        citation.episode = this.extractEpisodeContent(rawData,CITATIONS_EXTRACT.episode);
      }

      console.log("XXXXXXXXXXXXX", citation);
    }
  }
}
