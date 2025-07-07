export const CITATIONS_EXTRACT = {
  global: /<title>Kaamelott<\/title>/g,
  specific_character_name: /<title>Kaamelott\/([\s\S]*?)<\/title>/g,
  global_character_name: /=== \[\[w:Personnages de Kaamelott#([\s\S]*?)\|/g,
};
