Kaamelott Citation Extractor

🛠️ An XML parser to extract and structure quotes from the Kaamelott Wikiquote pages.

🚀 Features

Extract quotes ("citations") from XML dump of Wikiquote - Kaamelott

Support for multiple quote formats

Regex-based content extraction

Handles both global and specific character citations

Generates structured output in JSON format

📁 Project Structure

├── src/
│   ├── contants/
│   │   ├── cleaning-regexp.constants.ts      # Regex for cleaning
│   │   ├── citations-extract.constants.ts    # Regex for extraction
│   │   ├── filenames.constant.ts             # Filenames used
│   │   ├── media.enum.ts                     # MEDIA_TYPE enum
│   │   └── xml-urls.constant.ts              # XML dump URLs
│   ├── models/
│   │   ├── citation.model.ts                 # Citation builder/model
│   │   └── episode.model.ts                  # Episode structure
│   ├── services/
│   │   ├── common.service.ts
│   │   ├── fetching.service.ts               # For fetching XML data
│   │   ├── file.service.ts                   # For file writing
│   │   └── parser.service.ts                 # Quote parsing logic
│   ├── citations.parser.ts                   # Core parsing orchestration
│   └── index.ts                              # Entry point
├── package.json
├── tsconfig.json
└── .gitignore

📦 Installation

git clone https://github.com/yourusername/kaamelott-citation-extractor.git
cd kaamelott-citation-extractor
npm install

🛠️ Usage

1. Build the project

npm run build

2. Run the extractor

npm start

This will:

Compile TypeScript into dist/

Run dist/index.js

Parse and extract quotes

Output structured data into a JSON file (e.g. data.json)

📑 Output Format

Each quote is saved as a structured object:

{
  character_name: string;
  author: string;
  actor: string;
  description: string;
  media: string; // "Série" or "Film"
  season: string;
  episode: { name: string; number: string | number; };
  title: string;
  show: string;
  date: string;
}

🧪 Development

Use src/citations.parser.ts to tweak how citations are detected, cleaned, and structured.
Regex rules are defined in:

citations-extract.constants.ts

cleaning-regexp.constants.ts

🧩 Dependencies

TypeScript

cpx – Copy files after build

📄 License

This project is released under a custom non-commercial license.

You are free to use, modify and distribute this code for personal or non-commercial use only.

🚫 Commercial Use Restriction

Commercial use (including in proprietary software, SaaS products, paid platforms or integrations) is not permitted without prior written consent from the author.

If you are interested in using this project in a commercial context, please contact:

📧 Benjamin Bats – bats.benjamin.dev@gmail.com

All rights reserved unless explicitly granted in writing.

🧙‍♂️ Author

Benjamin Bats

