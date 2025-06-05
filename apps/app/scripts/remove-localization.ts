import * as fs from "fs";
import * as path from "path";
import { glob } from "glob";
import * as ts from "typescript";

interface TranslationMap {
  [key: string]: string | TranslationMap;
}

// Parse TypeScript file and extract the exported const object
function parseTranslationFile(filePath: string): any {
  const content = fs.readFileSync(filePath, "utf-8");
  
  // Create a TypeScript source file
  const sourceFile = ts.createSourceFile(
    filePath,
    content,
    ts.ScriptTarget.Latest,
    true
  );
  
  let result: any = null;
  
  // Visit all nodes in the AST
  function visit(node: ts.Node) {
    // Look for export const declarations
    if (ts.isVariableStatement(node) && 
        node.modifiers?.some(m => m.kind === ts.SyntaxKind.ExportKeyword)) {
      const declaration = node.declarationList.declarations[0];
      if (ts.isVariableDeclaration(declaration) && 
          declaration.initializer && 
          ts.isObjectLiteralExpression(declaration.initializer)) {
        result = parseObjectLiteral(declaration.initializer);
      }
    }
    
    ts.forEachChild(node, visit);
  }
  
  // Parse object literal expression
  function parseObjectLiteral(node: ts.ObjectLiteralExpression): any {
    const obj: any = {};
    
    for (const prop of node.properties) {
      if (ts.isPropertyAssignment(prop)) {
        const key = prop.name?.getText(sourceFile).replace(/['"]/g, '');
        
        if (prop.initializer) {
          if (ts.isStringLiteral(prop.initializer) || 
              ts.isNoSubstitutionTemplateLiteral(prop.initializer)) {
            obj[key] = prop.initializer.text;
          } else if (ts.isObjectLiteralExpression(prop.initializer)) {
            obj[key] = parseObjectLiteral(prop.initializer);
          }
        }
      }
    }
    
    return obj;
  }
  
  visit(sourceFile);
  return result;
}

// Build complete translation map from all files
async function buildCompleteTranslationMap(): Promise<TranslationMap> {
  const translationMap: TranslationMap = {};
  
  // Read the main en.ts file to get the structure
  const enPath = "apps/app/src/locales/en.ts";
  const enContent = fs.readFileSync(enPath, "utf-8");
  
  // Extract imports from en.ts
  const importRegex = /import\s*{\s*(\w+)\s*}\s*from\s*["']\.\/([^"']+)["']/g;
  let match;
  
  while ((match = importRegex.exec(enContent)) !== null) {
    const [_, importName, importPath] = match;
    const fullPath = path.join("apps/app/src/locales", importPath + ".ts");
    
    if (fs.existsSync(fullPath)) {
      try {
        const parsed = parseTranslationFile(fullPath);
        if (parsed) {
          translationMap[importName] = parsed;
        }
      } catch (error) {
        console.warn(`Failed to parse ${fullPath}:`, error);
      }
    }
  }
  
  return translationMap;
}

// Helper function to get nested value from object using dot notation
function getNestedValue(obj: any, path: string): string | undefined {
  const keys = path.split('.');
  let current = obj;
  
  for (const key of keys) {
    if (current && typeof current === 'object' && key in current) {
      current = current[key];
    } else {
      return undefined;
    }
  }
  
  return typeof current === 'string' ? current : undefined;
}

// Process a single file
async function processFile(filePath: string, translations: TranslationMap): Promise<boolean> {
  try {
    let content = fs.readFileSync(filePath, "utf-8");
    let hasChanges = false;
    const changes: string[] = [];

    // Pattern to match t("key") or t('key') or t(`key`)
    // Also handles multiline and spaces
    const tCallPattern = /t\s*\(\s*(["'`])([^"'`]+?)\1\s*\)/g;
    
    // Replace all t() calls with hardcoded strings
    content = content.replace(tCallPattern, (match, quote, key) => {
      const value = getNestedValue(translations, key);
      if (value) {
        hasChanges = true;
        changes.push(`  ${key} → "${value}"`);
        // Escape the value for JavaScript string
        const escapedValue = value
          .replace(/\\/g, '\\\\')
          .replace(/"/g, '\\"')
          .replace(/\n/g, '\\n')
          .replace(/\r/g, '\\r')
          .replace(/\t/g, '\\t');
        return `"${escapedValue}"`;
      }
      console.warn(`⚠️  Translation key not found: "${key}" in ${filePath}`);
      return match;
    });

    // Remove i18n imports (handle various formats)
    const importPatterns = [
      /import\s*{\s*useI18n\s*}\s*from\s*["']@\/locales\/client["'][\s;]*\n?/g,
      /import\s*{\s*getI18n\s*}\s*from\s*["']@\/locales\/server["'][\s;]*\n?/g,
      /import\s*{\s*getScopedI18n\s*}\s*from\s*["']@\/locales\/server["'][\s;]*\n?/g,
      /import\s*{\s*useScopedI18n\s*}\s*from\s*["']@\/locales\/client["'][\s;]*\n?/g,
      // Also handle multiple imports
      /import\s*{\s*[^}]*(?:useI18n|getI18n|getScopedI18n|useScopedI18n)[^}]*}\s*from\s*["']@\/locales\/(?:client|server)["'][\s;]*\n?/g,
    ];

    for (const pattern of importPatterns) {
      const matches = content.match(pattern);
      if (matches) {
        hasChanges = true;
        content = content.replace(pattern, '');
      }
    }

    // Remove useI18n/getI18n/getScopedI18n/useScopedI18n declarations
    const declarationPatterns = [
      /const\s+t\s*=\s*useI18n\s*\(\s*\)[\s;]*\n?/g,
      /const\s+t\s*=\s*await\s+getI18n\s*\(\s*\)[\s;]*\n?/g,
      /const\s+t\s*=\s*useScopedI18n\s*\([^)]*\)[\s;]*\n?/g,
      /const\s+t\s*=\s*await\s+getScopedI18n\s*\([^)]*\)[\s;]*\n?/g,
    ];

    for (const pattern of declarationPatterns) {
      if (pattern.test(content)) {
        hasChanges = true;
        content = content.replace(pattern, '');
      }
    }

    // Clean up extra newlines (max 2 consecutive)
    content = content.replace(/\n{3,}/g, '\n\n');
    
    // Remove trailing whitespace
    content = content.split('\n').map(line => line.trimEnd()).join('\n');

    if (hasChanges) {
      fs.writeFileSync(filePath, content, "utf-8");
      console.log(`✅ ${path.relative(process.cwd(), filePath)}`);
      if (changes.length > 0) {
        console.log(changes.join('\n'));
      }
      return true;
    }
    
    return false;
  } catch (error) {
    console.error(`❌ Error processing ${filePath}:`, error);
    return false;
  }
}

async function main() {
  console.log("🚀 Starting localization removal...\n");
  
  // Check if TypeScript is available
  try {
    require.resolve("typescript");
  } catch {
    console.error("❌ TypeScript is required. Please install it:");
    console.error("   npm install --save-dev typescript");
    process.exit(1);
  }
  
  // Build translation map
  console.log("📖 Loading translation files...");
  const translations = await buildCompleteTranslationMap();
  
  const totalKeys = countKeys(translations);
  console.log(`✅ Loaded ${totalKeys} translation keys\n`);
  
  // Find all .ts and .tsx files in apps/app
  console.log("🔍 Finding files to process...");
  const files = await glob("apps/app/src/**/*.{ts,tsx}", {
    ignore: [
      "**/node_modules/**",
      "**/locales/**", // Skip the locales directory itself
      "**/*.test.{ts,tsx}",
      "**/*.spec.{ts,tsx}",
      "**/*.d.ts",
    ],
  });

  console.log(`📁 Found ${files.length} files to process\n`);
  
  // Process all files
  let processedCount = 0;
  for (const file of files) {
    const wasProcessed = await processFile(file, translations);
    if (wasProcessed) processedCount++;
  }

  console.log(`\n✅ Localization removal complete!`);
  console.log(`📊 Processed ${processedCount} out of ${files.length} files`);
  
  console.log("\n📋 Next steps:");
  console.log("1. Review the changes (use 'git diff' to see all modifications)");
  console.log("2. Test your application to ensure everything works");
  console.log("3. Remove [locale] segments from your routes");
  console.log("4. Delete the locales directory when ready");
  console.log("5. Update middleware.ts to remove locale handling");
  console.log("6. Remove next-international from package.json");
}

// Helper to count total keys in nested object
function countKeys(obj: any): number {
  let count = 0;
  for (const key in obj) {
    if (typeof obj[key] === 'string') {
      count++;
    } else if (typeof obj[key] === 'object') {
      count += countKeys(obj[key]);
    }
  }
  return count;
}

// Run the script
if (require.main === module) {
  main().catch(error => {
    console.error("\n❌ Script failed:", error);
    process.exit(1);
  });
} 