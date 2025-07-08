export const CITATIONS_EXTRACT = {
  global: /<title>Kaamelott<\/title>/g,
  global_character_isolation:
    /(===( |)\[\[w:Personnages de Kaamelott#[^\]]+\]\]( |)===[\s\S]*?)(?===)/g,
  global_character_name: /===( |)\[\[w:Personnages de Kaamelott#([\s\S]*?)\|/g,
  specific_character_name: /<title>Kaamelott\/([\s\S]*?)<\/title>/g,
  author: /\|[aA]uteur=\s*(?:\[\[)?\s*([^\|\]\n\r]+?)\s*(?:\]\])?(?=\s*\|)/g,
  actor: /\|[aA]cteur=\s*(?:\[\[)?\s*([^\|\]\n\r]+?)\s*(?:\]\])?(?=\s*\|)/g,
  description:
    /\{\{[cC]itation[\s\S]*?\|[cC]itation\s*=\s*(.*?)(?=\n?\}\}|\r?\n?\}\})/g,
  media: /\{\{[rR][eé]f\s*([^|]+)\|/g,
  title: /\|[tT]itre=\s*(?:\[\[)?\s*([^\|\]\n\r]+?)\s*(?:\]\])?(?=\s*\|)/g,
  date: /\|[dD]ate=\s*(?:\[\[)?\s*([^\|\]\n\r]+?)\s*(?:\]\])?(?=\s*\|)/g,
  show: /\|[sS][eé]rie=\s*(?:\[\[)?\s*([^\|\]\n\r]+?)\s*(?:\]\])?(?=\s*\|)/g,
  season: /\|[sS]aison=\s*(?:\[\[)?\s*([^\|\]\n\r]+?)\s*(?:\]\])?(?=\s*\|)/g,
  episode:
    /\|[éE]pisode=\s*(?:\[\[)?\s*([^\|\]\n\r]+?)\s*(?:\]\])(.*?)(?=\n?\}\}|\r?\n?\}\})/g,
};
