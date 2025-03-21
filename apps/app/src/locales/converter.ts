
import fs from 'node:fs'
import path from 'node:path'

// Import the translations object from en.ts
import translations from './en'

// Write the translations to a JSON file
fs.writeFileSync(
  path.join(process.cwd(), 'src/locales/translations.json'),
  JSON.stringify(translations, null, 2)
)
