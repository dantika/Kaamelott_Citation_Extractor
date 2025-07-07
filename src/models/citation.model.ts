export interface CitationModel {
  character_name: string;
  author: string;
  actor: string;
  citation: string;
  season: string;
  date: string;
}

export class CitationMetadata {
  private _character_name: string;
  private _author: string;
  private _citation: string;
  private _actor: string;
  private _season: string;
  private _date: string;

  constructor(data: CitationModel) {
    this._character_name = data.character_name;
    this._author = data.author;
    this._citation = data.citation;
    this._actor = data.actor;
    this._season = data.season;
    this._date = data.date;
  }

  get character_name(): string {
    return this._character_name;
  }
  get author(): string {
    return this._author;
  }
  get citation(): string {
    return this._citation;
  }
  get actor(): string {
    return this._actor;
  }
  get season(): string {
    return this._season;
  }
  get date(): string {
    return this._date;
  }

  set character_name(value: string) {
    this._character_name = value;
  }
  set author(value: string) {
    this._author = value;
  }
  set citation(value: string) {
    this._citation = value;
  }
  set actor(value: string) {
    this._actor = value;
  }
  set season(value: string) {
    this._season = value;
  }
  set date(value: string) {
    this._date = value;
  }
}

export class CitationBuilder {
  private _character_name: string = "";
  private _author: string = "";
  private _actor: string = "";
  private _citation: string = "";
  private _season: string = "";
  private _date: string = "";

  character_name(character_name: string): this {
    this._character_name = character_name;
    return this;
  }

  author(author: string): this {
    this._author = author;
    return this;
  }

  actor(actor: string): this {
    this._actor = actor;
    return this;
  }

  description(citation: string): this {
    this._citation = citation;
    return this;
  }

  season(season: string): this {
    this._season = season;
    return this;
  }

  date(date: string): this {
    this._date = date;
    return this;
  }

  build(): CitationMetadata {
    const citation: CitationModel = {
      character_name: this._character_name,
      author: this._author,
      actor: this._actor,
      citation: this._citation,
      season: this._season,
      date: this._date,
    };

    return new CitationMetadata(citation);
  }
}
