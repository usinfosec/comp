console.log("[TOP] Script execution started - V3"); // Earliest possible log

import * as fs from "fs";
import * as path from "path";
import { glob } from "glob";

// Manually build the translation map by reading files
function buildTranslationMap(): Record<string, string> {
  console.log("  [buildTranslationMap] Starting...");
  const translations: Record<string, string> = {};
  
  const translationFiles = [
    { prefix: "common", file: "core/common.ts" },
    { prefix: "errors", file: "core/errors.ts" },
    { prefix: "language", file: "core/language.ts" },
    { prefix: "auth", file: "auth/auth.ts" },
    { prefix: "onboarding", file: "auth/onboarding.ts" },
    { prefix: "header", file: "layout/header.ts" },
    { prefix: "not_found", file: "layout/not-found.ts" },
    { prefix: "sidebar", file: "layout/sidebar.ts" },
    { prefix: "theme", file: "layout/theme.ts" },
    { prefix: "user_menu", file: "layout/user-menu.ts" },
    { prefix: "controls", file: "features/controls.ts" },
    { prefix: "frameworks", file: "features/frameworks.ts" },
    { prefix: "overview", file: "features/overview.ts" },
    { prefix: "people", file: "features/people.ts" },
    { prefix: "policies", file: "features/policies.ts" },
    { prefix: "risk", file: "features/risk.ts" },
    { prefix: "tests", file: "features/tests.ts" },
    { prefix: "vendors", file: "features/vendors.ts" },
    { prefix: "app_onboarding", file: "onboarding/app-onboarding.ts" },
    { prefix: "settings", file: "settings/settings.ts" },
    { prefix: "tasks", file: "features/tasks.ts" },
  ];
  
  // Base path for locales, assuming script is run from apps/app
  const baseLocalePath = path.join(process.cwd(), "src", "locales");

  for (const { prefix, file } of translationFiles) {
    const filePath = path.join(baseLocalePath, file);
    console.log(`    [buildTranslationMap] Processing translation file: ${filePath}`);
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, "utf-8");
      parseTranslationFile(content, prefix, translations);
      console.log(`      [buildTranslationMap] Finished processing: ${file}`);
    } else {
      console.warn(`      [buildTranslationMap] WARN: File not found - ${filePath} (CWD: ${process.cwd()})`);
    }
  }
  
  console.log("  [buildTranslationMap] Finished.");
  return translations;
}

// Parse a translation file and extract key-value pairs
function parseTranslationFile(content: string, prefix: string, translations: Record<string, string>) {
  const lines = content.split('\n');
  let currentPath: string[] = [prefix];
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line || line.startsWith('//')) continue;

    const simpleMatch = line.match(/^(\w+)\s*:\s*"([^"]*)"\s*,?$/);
    if (simpleMatch) {
      const [, key, value] = simpleMatch;
      const fullKey = [...currentPath, key].join('.');
      translations[fullKey] = value.replace(/\\"/g, '"'); // Handle escaped quotes
      continue;
    }
    
    const objectMatch = line.match(/^(\w+)\s*:\s*{\s*$/);
    if (objectMatch) {
      currentPath.push(objectMatch[1]);
      continue;
    }
    
    if (line.includes('}')) {
      const braceCount = (line.match(/}/g) || []).length;
      for (let j = 0; j < braceCount; j++) {
        if (currentPath.length > 1) {
          currentPath.pop();
        }
      }
    }
    
    const multilineStart = line.match(/^(\w+)\s*:\s*$/);
    if (multilineStart && i + 1 < lines.length && lines[i + 1].trim().startsWith('"')) {
      const key = multilineStart[1];
      let value = '';
      i++; 
      
      while (i < lines.length) {
        const valueLine = lines[i].trim();
        const valueMatch = valueLine.match(/^"([^"]*)"\s*,?$/);
        if (valueMatch) {
          value = valueMatch[1].replace(/\\"/g, '"'); // Handle escaped quotes
          break;
        }
        const partialValueMatch = valueLine.match(/^"([^"]*)/); // part of multiline
        if(partialValueMatch){
            value += partialValueMatch[1].replace(/\\"/g, '"');
        } else if (valueLine.endsWith('"')) { // end of multiline
            value += valueLine.substring(0, valueLine.length -1).replace(/\\"/g, '"');
            break;
        } else { // middle of multiline
             value += valueLine.replace(/\\"/g, '"');
        }
        i++;
      }
      
      if (value) {
        const fullKey = [...currentPath, key].join('.');
        translations[fullKey] = value;
      }
    }
  }
}

// Process a single file
function processFile(filePath: string, translations: Record<string, string>): boolean {
  // filePath is now relative to CWD (apps/app) from glob
  const fullFilePath = path.join(process.cwd(), filePath);
  try {
    let content = fs.readFileSync(fullFilePath, "utf-8");
    let originalContent = content;
    
    const importPatterns = [
      /import\s*{\s*useI18n\s*}\s*from\s*["']@\/locales\/client["'][\s;]*\n?/g,
      /import\s*{\s*getI18n\s*}\s*from\s*["']@\/locales\/server["'][\s;]*\n?/g,
      /import\s*{\s*getScopedI18n\s*}\s*from\s*["']@\/locales\/server["'][\s;]*\n?/g,
      /import\s*{\s*useScopedI18n\s*}\s*from\s*["']@\/locales\/client["'][\s;]*\n?/g,
       // Generic catch for all imports from locales/client or locales/server
      /import\s*{[^}]*}\s*from\s*["']@\/locales\/(client|server)["'][\s;]*\n?/g,
    ];
    
    for (const pattern of importPatterns) {
      content = content.replace(pattern, '');
    }
    
    const declarationPatterns = [
      /const\s+t\s*=\s*useI18n\s*\(\s*\)[\s;]*\n?/g,
      /const\s+t\s*=\s*await\s+getI18n\s*\(\s*\)[\s;]*\n?/g,
      /const\s+t\s*=\s*useScopedI18n\s*\([^)]*\)[\s;]*\n?/g,
      /const\s+t\s*=\s*await\s+getScopedI18n\s*\([^)]*\)[\s;]*\n?/g,
    ];
    
    for (const pattern of declarationPatterns) {
      content = content.replace(pattern, '');
    }
    
    const tCallPattern = /t\s*\(\s*(["'`])((?:\\\1|(?!\1).)+?)\1\s*\)/g;
    const changes: string[] = [];
    
    content = content.replace(tCallPattern, (match, quote, key) => {
      const value = translations[key];
      if (value !== undefined) {
        changes.push(`  ${key} → "${value.length > 50 ? value.substring(0, 47) + '...' : value}"`);
        const escapedValue = value
          .replace(/\\/g, '\\\\')
          .replace(/"/g, '\\"')
          .replace(/\n/g, '\\n')
          .replace(/\r/g, '\\r')
          .replace(/\t/g, '\\t');
        return `"${escapedValue}"`;
      }
      console.warn(`  ⚠️  WARN: Translation not found: "${key}" in ${filePath}`);
      return match;
    });
    
    content = content.replace(/\n{3,}/g, '\n\n');
    content = content.split('\n').map(line => line.trimEnd()).join('\n');
    if (content.startsWith('\n\n')) {
      content = content.substring(2);
    }

    const hasChanges = content !== originalContent;

    if (hasChanges) {
      fs.writeFileSync(fullFilePath, content, "utf-8");
      console.log(`✅ Modified: ${filePath}`); // Log the relative path
      if (changes.length > 0 && changes.length <= 5) {
        console.log(changes.join('\n'));
      } else if (changes.length > 5) {
        console.log(`   ${changes.length} translations replaced`);
      }
      return true;
    }
    
    return false;
  } catch (error) {
    console.error(`❌ Error processing ${fullFilePath}:`, error);
    return false;
  }
}

async function main() {
  console.log(`[main] Script CWD: ${process.cwd()}`);
  console.log("🚀 Starting localization removal...");
  
  console.log("\n📖 Building translation map...");
  const startTime = Date.now();
  const translations = buildTranslationMap();
  const buildTime = Date.now() - startTime;
  console.log(`✅ Loaded ${Object.keys(translations).length} translation keys in ${buildTime}ms\n`);
  
  console.log("🔍 Finding files to process...");
  const globStartTime = Date.now();
  // Ensure glob runs from the project root (apps/app) for consistency
  const files = await glob("src/**/*.{ts,tsx}", {
    cwd: process.cwd(), 
    ignore: [
      "**/node_modules/**",
      "**/locales/**",
      "**/*.test.{ts,tsx}",
      "**/*.spec.{ts,tsx}",
      "**/*.d.ts",
      "**/scripts/**", // ignore this script itself
    ],
    absolute: false, // Get relative paths from CWD
  });
  const globTime = Date.now() - globStartTime;
  console.log(`📁 Found ${files.length} files to process in ${globTime}ms (e.g., ${files[0]})\n`);
  
  let processedCount = 0;
  const batchSize = 20; 
  const totalBatches = Math.ceil(files.length / batchSize);

  console.log(`⚙️  Processing files in ${totalBatches} batches of ${batchSize}...`);
  const processingStartTime = Date.now();

  for (let i = 0; i < files.length; i += batchSize) {
    const batch = files.slice(i, i + batchSize);
    const batchNum = i / batchSize + 1;
    console.log(`  Batch ${batchNum}/${totalBatches} processing ${batch.length} files...`);
    
    for (const file of batch) {
      // processFile expects path relative to CWD
      const wasProcessed = processFile(file, translations);
      if (wasProcessed) processedCount++;
    }
    
    if (i + batchSize < files.length) {
      await new Promise(resolve => setTimeout(resolve, 50)); 
    }
  }
  const processingTime = Date.now() - processingStartTime;
  console.log(`
✅ Localization removal complete! Processed ${processedCount} out of ${files.length} files in ${processingTime / 1000}s.`);
  
  console.log("\n📋 Next steps:");
  console.log("1. Review changes carefully (e.g., with 'git diff')");
  console.log("2. Test your application thoroughly");
  console.log("3. Manually remove [locale] segments from your routes");
  console.log("4. Delete the 'src/locales' directory when confident");
  console.log("5. Update 'middleware.ts' to remove any locale handling logic");
  console.log("6. Remove 'next-international' from your 'package.json' dependencies");
}

main().catch(error => {
  console.error("\n❌ Script failed unexpectedly:", error);
  process.exit(1);
}); 