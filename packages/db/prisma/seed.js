"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const node_fs_1 = require("node:fs");
const node_path_1 = require("node:path");
const node_fs_2 = __importDefault(require("node:fs"));
const prisma = new client_1.PrismaClient();
async function main() {
    console.log("\n🗑️  Cleaning up existing data...");
    // For testing, we will delete all existing data, except for the users.
    await prisma.framework.deleteMany();
    await prisma.frameworkCategory.deleteMany();
    await prisma.policy.deleteMany();
    await prisma.control.deleteMany();
    await prisma.controlRequirement.deleteMany();
    console.log("✅ Database cleaned");
    console.log("\n📋 Seeding policies...");
    await seedPolicies();
    console.log("✅ Policies seeded");
    console.log("\n🏗️  Seeding frameworks...");
    await seedFrameworks();
    console.log("✅ Frameworks seeded");
    console.log("\n🔗 Seeding policy frameworks...");
    await seedPolicyFramework();
    console.log("✅ Policy frameworks seeded");
    console.log("\n🎉 All data seeded successfully!");
}
main()
    .catch((e) => {
    console.error("\n❌ Error during seeding:", e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
async function seedPolicies() {
    const policiesDir = (0, node_path_1.join)(__dirname, "../../data/policies");
    const policyFiles = (0, node_fs_1.readdirSync)(policiesDir).filter((file) => file.endsWith(".json"));
    console.log(`📄 Found ${policyFiles.length} policy files to process`);
    for (const file of policyFiles) {
        console.log(`  ⏳ Processing ${file}...`);
        const policyData = JSON.parse((0, node_fs_1.readFileSync)((0, node_path_1.join)(policiesDir, file), "utf8"));
        await prisma.policy.upsert({
            where: { id: policyData.id },
            update: {
                name: policyData.name,
                description: policyData.description,
                template: policyData.template,
                usedBy: policyData.usedBy,
            },
            create: {
                id: policyData.id,
                slug: policyData.slug,
                name: policyData.name,
                description: policyData.description,
                template: policyData.template,
                usedBy: policyData.usedBy,
            },
        });
        console.log(`  ✅ ${file} processed`);
    }
}
async function seedFrameworks() {
    const frameworksFile = (0, node_path_1.join)(__dirname, "../../data/frameworks.json");
    const frameworksJson = JSON.parse((0, node_fs_1.readFileSync)(frameworksFile, "utf8"));
    console.log(`🔍 Found ${Object.keys(frameworksJson).length} frameworks to process`);
    // Populate the app level frameworks that every org has access to.
    for (const [frameworkId, frameworkData] of Object.entries(frameworksJson)) {
        console.log(`  ⏳ Processing framework: ${frameworkData.name}...`);
        // First, upsert the framework itself.
        const insertedFramework = await prisma.framework.upsert({
            where: { id: frameworkId },
            update: {
                description: frameworkData.description,
                version: frameworkData.version,
            },
            create: {
                id: frameworkId,
                name: frameworkData.name,
                description: frameworkData.description,
                version: frameworkData.version,
            },
        });
        // Then, upsert the framework categories.
        await seedFrameworkCategories(insertedFramework.id);
        console.log(`  ✅ Framework ${frameworkData.name} processed`);
    }
}
async function seedFrameworkCategories(frameworkId) {
    let categories;
    try {
        categories = node_fs_2.default.readFileSync((0, node_path_1.join)(__dirname, `../../data/categories/${frameworkId}.json`), "utf8");
    }
    catch (error) {
        console.log(`  ⚠️  No categories found for framework ${frameworkId}, skipping`);
        return;
    }
    const categoriesData = JSON.parse(categories);
    console.log(`    📑 Found ${Object.keys(categoriesData).length} categories for ${frameworkId}`);
    // Upsert the framework categories for the given framework.
    for (const [categoryCode, categoryData] of Object.entries(categoriesData)) {
        console.log(`      ⏳ Processing category: ${categoryData.name}...`);
        // First, upsert the framework category itself for the given framework.
        await prisma.frameworkCategory.upsert({
            where: { id: categoryCode },
            update: {
                name: categoryData.name,
                code: categoryData.code,
                description: categoryData.description,
                frameworkId: frameworkId,
            },
            create: {
                id: categoryCode,
                name: categoryData.name,
                description: categoryData.description,
                code: categoryData.code,
                frameworkId: frameworkId,
            },
        });
        // Then, upsert the controls for the given framework category.
        await seedFrameworkCategoryControls(frameworkId, categoryCode);
        console.log(`      ✅ Category ${categoryData.name} processed`);
    }
}
async function seedFrameworkCategoryControls(frameworkId, categoryCode) {
    const controls = node_fs_2.default.readFileSync((0, node_path_1.join)(__dirname, `../../data/controls/${frameworkId}.json`), "utf8");
    const controlsData = JSON.parse(controls);
    const filteredControlsData = Object.fromEntries(Object.entries(controlsData).filter(([code, data]) => code.includes(categoryCode)));
    console.log(`        🎮 Processing ${Object.keys(filteredControlsData).length} controls`);
    for (const [controlCode, controlData] of Object.entries(filteredControlsData)) {
        // First, upsert the controls itself for the given category.
        const insertedControl = await prisma.control.upsert({
            where: { code: controlCode },
            update: {
                name: controlData.name,
                description: controlData.description,
                domain: controlData.domain,
                frameworkCategoryId: categoryCode,
            },
            create: {
                id: controlCode,
                code: controlCode,
                name: controlData.name,
                description: controlData.description,
                domain: controlData.domain,
                frameworkCategoryId: categoryCode,
            },
        });
        // Then, upsert the requirements for the given control.
        console.log(`          📝 Processing ${controlData.requirements.length} requirements for ${controlCode}`);
        for (const requirement of controlData.requirements) {
            await prisma.controlRequirement.upsert({
                where: {
                    id: requirement.id,
                },
                create: {
                    id: requirement.id,
                    controlId: insertedControl.id,
                    type: requirement.type,
                    description: requirement.description,
                    policyId: requirement.type === "policy"
                        ? requirement.policyId
                        : null,
                },
                update: {
                    description: requirement.description,
                    policyId: requirement.type === "policy"
                        ? requirement.policyId
                        : null,
                },
            });
        }
    }
}
async function seedPolicyFramework() {
    const policies = await prisma.policy.findMany();
    console.log(`🔄 Processing ${policies.length} policies for framework mapping`);
    for (const policy of policies) {
        console.log(`  ⏳ Mapping policy: ${policy.name}...`);
        if (!policy.usedBy) {
            console.log(`  ⚠️  Policy ${policy.name} has no usedBy, skipping`);
            continue;
        }
        for (const [frameworkId, categories] of Object.entries(policy.usedBy)) {
            // Upsert the policy framework mapping.
            await prisma.policyFramework.upsert({
                where: { id: `${frameworkId}_${policy.id}` },
                update: {
                    policyId: policy.id,
                    frameworkId: frameworkId,
                },
                create: {
                    id: `${frameworkId}_${policy.id}`,
                    policyId: policy.id,
                    frameworkId: frameworkId,
                },
            });
            for (const [categoryCode, controlCodes] of Object.entries(categories)) {
                for (const controlCode of controlCodes) {
                    // Upsert the policy control mapping.
                    await prisma.policyControl.upsert({
                        where: { id: `${frameworkId}_${categoryCode}_${controlCode}` },
                        update: {
                            policyId: policy.id,
                            controlId: controlCode,
                        },
                        create: {
                            id: `${frameworkId}_${categoryCode}_${controlCode}`,
                            policyId: policy.id,
                            controlId: controlCode,
                        },
                    });
                }
            }
        }
        console.log(`  ✅ Policy ${policy.name} mapped`);
    }
}
