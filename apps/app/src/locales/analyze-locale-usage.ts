import fs from 'node:fs'
import path from 'node:path'
import { execSync } from 'node:child_process'

// This script finds unused translation keys in the codebase
// It works by:
// 1. Converting the en.ts file to a temporary JSON file using ts-node
// 2. Reading the JSON and extracting all translation keys
// 3. Checking if each key is used in the codebase using grep (no ripgrep required)
// 4. Finding duplicate translation values and where they are used

const DEBUG = false // Set to false to check all translation keys

async function findUnusedTranslations() {
  try {
    // Generate a temporary JSON file with the translations
    const tempJsonPath = path.join(process.cwd(), 'src/locales/translations.json')
    
    // Create a temporary TypeScript file to convert the translations to JSON
    const converterPath = path.join(process.cwd(), 'src/locales/converter.ts')
    createConverterScript(converterPath)
    
    try {
      // Run the converter script with ts-node
      execSync(`bunx tsx ${converterPath}`)
      
      // Read the JSON file
      const translationsJson = fs.readFileSync(tempJsonPath, 'utf8')
      const translations = JSON.parse(translationsJson)
      
      // Extract all keys and their values
      const keyValuePairs = flattenObjectWithValues(translations)
      
      // Extract just the keys for unused key detection
      const allKeys = keyValuePairs.map(pair => pair.key)
      
      console.log(`Found ${allKeys.length} translation keys to check.`)
      
      // Try a test search for a key that should exist
      if (DEBUG) {
        // Using common.notifications.inbox since we know it's in the notification-center.tsx file
        const testKey = "common.notifications.inbox" 
        const testResult = await testKeySearch(testKey)
        console.log(`Test search for "${testKey}": ${testResult ? "FOUND" : "NOT FOUND"}`)
      }
      
      // Check which keys are unused
      const unusedKeys: string[] = []
      const errors: string[] = []
      
      // Limit the number of keys to check in debug mode
      const keysToCheck = DEBUG ? allKeys.slice(0, 10) : allKeys
      
      for (const key of keysToCheck) {
        try {
          const isUsed = await isKeyUsedInCode(key)
          if (!isUsed) {
            unusedKeys.push(key)
          } else if (DEBUG) {
            console.log(`Key used: ${key}`)
          }
        } catch (error) {
          errors.push(`Error checking key ${key}: ${error}`)
        }
      }
      
      // Find duplicate values
      const duplicates = findDuplicateValues(keyValuePairs)
      
      // Find locations where duplicates are used
      const duplicatesWithLocations = await findDuplicateLocations(duplicates)
      
      // Report results
      console.log('\nResults:')
      console.log('=========')
      
      if (DEBUG) {
        console.log(`\nChecked ${keysToCheck.length} of ${allKeys.length} keys in debug mode.`)
      }
      
      if (unusedKeys.length > 0) {
        console.log(`\nFound ${unusedKeys.length} unused translation keys:`)
        for (const key of unusedKeys) {
          console.log(`- ${key}`)
        }
      } else {
        console.log('\nNo unused translation keys found!')
      }
      
      if (duplicatesWithLocations.length > 0) {
        console.log(`\nFound ${duplicatesWithLocations.length} duplicate translation values:`)
        for (const dup of duplicatesWithLocations) {
          console.log(`\nValue: "${dup.value}" is used in ${dup.keys.length} places:`)
          for (const key of dup.keys) {
            console.log(`- ${key}${dup.locations[key] ? ` (used in: ${dup.locations[key].join(', ')})` : ''}`)
          }
        }
      } else {
        console.log('\nNo duplicate translation values found!')
      }
      
      if (errors.length > 0) {
        console.log(`\nEncountered ${errors.length} errors:`)
        for (const error of errors) {
          console.log(`- ${error}`)
        }
      }
    } finally {
      // Clean up temporary files
      if (fs.existsSync(tempJsonPath)) {
        fs.unlinkSync(tempJsonPath)
      }
      if (fs.existsSync(converterPath)) {
        fs.unlinkSync(converterPath)
      }
    }
  } catch (error) {
    console.error('Error:', error)
  }
}

// Create a converter script that extracts translations to JSON
function createConverterScript(filePath: string) {
  const script = `
import fs from 'node:fs'
import path from 'node:path'

// Import the translations object from en.ts
import translations from './en'

// Write the translations to a JSON file
fs.writeFileSync(
  path.join(process.cwd(), 'src/locales/translations.json'),
  JSON.stringify(translations, null, 2)
)
`
  fs.writeFileSync(filePath, script)
}

// Flatten an object into a list of dot-notation keys
function flattenObject(obj: Record<string, any>, prefix = ''): string[] {
  return Object.keys(obj).reduce((acc: string[], key) => {
    const pre = prefix.length ? `${prefix}.` : ''
    
    if (typeof obj[key] === 'object' && obj[key] !== null) {
      acc.push(...flattenObject(obj[key], `${pre}${key}`))
    } else {
      acc.push(`${pre}${key}`)
    }
    
    return acc
  }, [])
}

// Flatten an object into key-value pairs with dot-notation keys
function flattenObjectWithValues(obj: Record<string, any>, prefix = ''): Array<{key: string, value: string}> {
  return Object.entries(obj).reduce((acc: Array<{key: string, value: string}>, [key, value]) => {
    const pre = prefix.length ? `${prefix}.` : ''
    
    if (typeof value === 'object' && value !== null) {
      acc.push(...flattenObjectWithValues(value, `${pre}${key}`))
    } else if (typeof value === 'string') {
      acc.push({ key: `${pre}${key}`, value })
    }
    
    return acc
  }, [])
}

// Find duplicate values in the translations
function findDuplicateValues(keyValues: Array<{key: string, value: string}>): Array<{value: string, keys: string[]}> {
  // Group by value
  const valueToKeys = keyValues.reduce((acc: Record<string, string[]>, { key, value }) => {
    // Skip empty values or non-string values
    if (!value || typeof value !== 'string') {
      return acc
    }
    
    if (!acc[value]) {
      acc[value] = []
    }
    acc[value].push(key)
    return acc
  }, {})
  
  // Filter only duplicates and exclude very short strings (likely to be punctuation, etc.)
  return Object.entries(valueToKeys)
    .filter(([value, keys]) => keys.length > 1 && value.length > 1)
    .map(([value, keys]) => ({ value, keys }))
    .sort((a, b) => b.keys.length - a.keys.length) // Sort by number of duplicates
}

// Find locations where duplicate keys are used
async function findDuplicateLocations(duplicates: Array<{value: string, keys: string[]}>): Promise<Array<{value: string, keys: string[], locations: Record<string, string[]>}>> {
  const result = []
  
  for (const dup of duplicates) {
    const locations: Record<string, string[]> = {}
    
    for (const key of dup.keys) {
      try {
        locations[key] = await findKeyUsageLocations(key)
      } catch (error) {
        locations[key] = []
      }
    }
    
    result.push({
      value: dup.value,
      keys: dup.keys,
      locations
    })
  }
  
  return result
}

// Find locations where a key is used
async function findKeyUsageLocations(key: string): Promise<string[]> {
  try {
    const escapedKey = key.replace(/\./g, '\\.')
    const locations: string[] = []
    
    // Check for t("key") pattern
    try {
      const doubleQuoteCmd = `grep -r "t(\\"${escapedKey}\\")" --include="*.tsx" --include="*.ts" --include="*.jsx" ./src`
      const doubleQuoteResult = execSync(doubleQuoteCmd, { encoding: 'utf8', stdio: ['pipe', 'pipe', 'ignore'] }).trim()
      
      if (doubleQuoteResult) {
        // Extract file paths from grep results
        const matches = doubleQuoteResult.split('\n')
        for (const match of matches) {
          const fileMatch = match.match(/^\.\/src\/(.+?):/)?.[1]
          if (fileMatch) {
            const directory = path.dirname(fileMatch)
            if (!locations.includes(directory)) {
              locations.push(directory)
            }
          }
        }
      }
    } catch (e) {
      // Grep returns exit code 1 if no matches
    }
    
    // Check for t('key') pattern
    try {
      const singleQuoteCmd = `grep -r "t('${escapedKey}')" --include="*.tsx" --include="*.ts" --include="*.jsx" ./src`
      const singleQuoteResult = execSync(singleQuoteCmd, { encoding: 'utf8', stdio: ['pipe', 'pipe', 'ignore'] }).trim()
      
      if (singleQuoteResult) {
        // Extract file paths from grep results
        const matches = singleQuoteResult.split('\n')
        for (const match of matches) {
          const fileMatch = match.match(/^\.\/src\/(.+?):/)?.[1]
          if (fileMatch) {
            const directory = path.dirname(fileMatch)
            if (!locations.includes(directory)) {
              locations.push(directory)
            }
          }
        }
      }
    } catch (e) {
      // Grep returns exit code 1 if no matches
    }
    
    // Also check for useI18n calls
    try {
      const i18nCmd = `grep -r "useI18n(\\"${escapedKey}\\")" --include="*.tsx" --include="*.ts" --include="*.jsx" ./src`
      const i18nResult = execSync(i18nCmd, { encoding: 'utf8', stdio: ['pipe', 'pipe', 'ignore'] }).trim()
      
      if (i18nResult) {
        // Extract file paths from grep results
        const matches = i18nResult.split('\n')
        for (const match of matches) {
          const fileMatch = match.match(/^\.\/src\/(.+?):/)?.[1]
          if (fileMatch) {
            const directory = path.dirname(fileMatch)
            if (!locations.includes(directory)) {
              locations.push(directory)
            }
          }
        }
      }
    } catch (e) {
      // Grep returns exit code 1 if no matches
    }
    
    return locations
  } catch (error) {
    console.error(`Error finding usage locations for key ${key}:`, error)
    return []
  }
}

// Test function to verify grep is working
async function testKeySearch(key: string): Promise<boolean> {
  try {
    // Use grep instead of ripgrep
    const result = execSync(`grep -r "t(\\"${key}\\")" --include="*.tsx" --include="*.ts" --include="*.jsx" ./src || echo "Not found"`, { encoding: 'utf8' })
    console.log(`Test command output: "${result.trim()}"`)
    return !result.includes("Not found")
  } catch (error) {
    console.error("Error in test search:", error)
    return false
  }
}

// Check if a key is used in the codebase using grep
async function isKeyUsedInCode(key: string): Promise<boolean> {
  try {
    // Escape dots for grep
    const escapedKey = key.replace(/\./g, '\\.')
    
    // Check for different usage patterns using separate grep commands
    
    // 1. Check for t("key") pattern
    try {
      const doubleQuoteCmd = `grep -r "t(\\"${escapedKey}\\")" --include="*.tsx" --include="*.ts" --include="*.jsx" ./src`
      const doubleQuoteResult = execSync(doubleQuoteCmd, { encoding: 'utf8', stdio: ['pipe', 'pipe', 'ignore'] }).trim()
      if (doubleQuoteResult) {
        if (DEBUG) console.log(`Found double quote match for ${key}`)
        return true
      }
    } catch (e) {
      // Grep returns exit code 1 if no matches, which causes execSync to throw
    }
    
    // 2. Check for t('key') pattern
    try {
      const singleQuoteCmd = `grep -r "t('${escapedKey}')" --include="*.tsx" --include="*.ts" --include="*.jsx" ./src`
      const singleQuoteResult = execSync(singleQuoteCmd, { encoding: 'utf8', stdio: ['pipe', 'pipe', 'ignore'] }).trim()
      if (singleQuoteResult) {
        if (DEBUG) console.log(`Found single quote match for ${key}`)
        return true
      }
    } catch (e) {
      // Grep returns exit code 1 if no matches
    }
    
    // 3. Check for useI18n or useTranslations
    try {
      const i18nCmd = `grep -r "useI18n(\\"${escapedKey}\\")" --include="*.tsx" --include="*.ts" --include="*.jsx" ./src`
      const i18nResult = execSync(i18nCmd, { encoding: 'utf8', stdio: ['pipe', 'pipe', 'ignore'] }).trim()
      if (i18nResult) {
        if (DEBUG) console.log(`Found useI18n match for ${key}`)
        return true
      }
    } catch (e) {
      // Grep returns exit code 1 if no matches
    }
    
    // 4. As a last resort, try a more general search for the last part of the key
    // This might have more false positives but ensures we don't miss dynamic usages
    if (key.includes('.')) {
      const keyParts = key.split('.')
      const lastPart = keyParts[keyParts.length - 1]
      
      try {
        // Searching for patterns like: t("something.lastPart") or t(`${prefix}.lastPart`)
        const lastPartCmd = `grep -r "\\.${lastPart}" --include="*.tsx" --include="*.ts" --include="*.jsx" ./src | grep -v "find-unused-translations.ts" | grep -v "translations.json"`
        const lastPartResult = execSync(lastPartCmd, { encoding: 'utf8', stdio: ['pipe', 'pipe', 'ignore'] }).trim()
        
        // Only count this as a match if it's in a t() function call context
        if (lastPartResult && (lastPartResult.includes('t(') || lastPartResult.includes('useI18n'))) {
          if (DEBUG) console.log(`Found last part match for ${key} (${lastPart})`)
          return true
        }
      } catch (e) {
        // Grep returns exit code 1 if no matches
      }
    }
    
    // Not found in any pattern
    return false
  } catch (error) {
    console.error(`Error checking key ${key}:`, error)
    return false
  }
}

findUnusedTranslations().catch(console.error) 