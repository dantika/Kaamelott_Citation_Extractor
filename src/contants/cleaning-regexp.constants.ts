export const CLEANING_REGEXP = [
  {
    regexp: new RegExp(/&lt;/, "g"),
    converted: "<",
  },
  {
    regexp: new RegExp(/&gt;/, "g"),
    converted: ">",
  },
  {
    regexp: new RegExp(/<&gt;>/, "g"),
    converted: ">",
  },
  {
    regexp: new RegExp(/&nbsp;/, "g"),
    converted: " ",
  },
  {
    regexp: new RegExp(/<\s*br\s*\/?\s*>/, "gi"),
    converted: " ",
  },
  {
    regexp: new RegExp(/(\r\n|\r|\n|\\r|\\n)/, "g"),
    converted: "",
  },
  {
    regexp: new RegExp(/''/, "g"),
    converted: "",
  },
  {
    regexp: new RegExp(/\\/, "g"),
    converted: "",
  },
  {
    regexp: new RegExp(/\s{2,}/, "g"),
    converted: " ",
  },
  {
    regexp: new RegExp(/\{\{formatnum:(\d+)\}\}/, "g"),
    converted: "$1",
  },
];
