
Object.defineProperty(exports, "__esModule", { value: true });

const {
  PrismaClientKnownRequestError,
  PrismaClientUnknownRequestError,
  PrismaClientRustPanicError,
  PrismaClientInitializationError,
  PrismaClientValidationError,
  getPrismaClient,
  sqltag,
  empty,
  join,
  raw,
  skip,
  Decimal,
  Debug,
  objectEnumValues,
  makeStrictEnum,
  Extensions,
  warnOnce,
  defineDmmfProperty,
  Public,
  getRuntime,
  createParam,
} = require('./runtime/wasm.js')


const Prisma = {}

exports.Prisma = Prisma
exports.$Enums = {}

/**
 * Prisma Client JS version: 6.6.0
 * Query Engine version: f676762280b54cd07c770017ed3711ddde35f37a
 */
Prisma.prismaVersion = {
  client: "6.6.0",
  engine: "f676762280b54cd07c770017ed3711ddde35f37a"
}

Prisma.PrismaClientKnownRequestError = PrismaClientKnownRequestError;
Prisma.PrismaClientUnknownRequestError = PrismaClientUnknownRequestError
Prisma.PrismaClientRustPanicError = PrismaClientRustPanicError
Prisma.PrismaClientInitializationError = PrismaClientInitializationError
Prisma.PrismaClientValidationError = PrismaClientValidationError
Prisma.Decimal = Decimal

/**
 * Re-export of sql-template-tag
 */
Prisma.sql = sqltag
Prisma.empty = empty
Prisma.join = join
Prisma.raw = raw
Prisma.validator = Public.validator

/**
* Extensions
*/
Prisma.getExtensionContext = Extensions.getExtensionContext
Prisma.defineExtension = Extensions.defineExtension

/**
 * Shorthand utilities for JSON filtering
 */
Prisma.DbNull = objectEnumValues.instances.DbNull
Prisma.JsonNull = objectEnumValues.instances.JsonNull
Prisma.AnyNull = objectEnumValues.instances.AnyNull

Prisma.NullTypes = {
  DbNull: objectEnumValues.classes.DbNull,
  JsonNull: objectEnumValues.classes.JsonNull,
  AnyNull: objectEnumValues.classes.AnyNull
}





/**
 * Enums
 */
exports.Prisma.TransactionIsolationLevel = makeStrictEnum({
  ReadUncommitted: 'ReadUncommitted',
  ReadCommitted: 'ReadCommitted',
  RepeatableRead: 'RepeatableRead',
  Serializable: 'Serializable'
});

exports.Prisma.UserScalarFieldEnum = {
  id: 'id',
  name: 'name',
  email: 'email',
  emailVerified: 'emailVerified',
  image: 'image',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  lastLogin: 'lastLogin'
};

exports.Prisma.SessionScalarFieldEnum = {
  id: 'id',
  expiresAt: 'expiresAt',
  token: 'token',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  ipAddress: 'ipAddress',
  userAgent: 'userAgent',
  userId: 'userId',
  activeOrganizationId: 'activeOrganizationId'
};

exports.Prisma.AccountScalarFieldEnum = {
  id: 'id',
  accountId: 'accountId',
  providerId: 'providerId',
  userId: 'userId',
  accessToken: 'accessToken',
  refreshToken: 'refreshToken',
  idToken: 'idToken',
  accessTokenExpiresAt: 'accessTokenExpiresAt',
  refreshTokenExpiresAt: 'refreshTokenExpiresAt',
  scope: 'scope',
  password: 'password',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.VerificationScalarFieldEnum = {
  id: 'id',
  identifier: 'identifier',
  value: 'value',
  expiresAt: 'expiresAt',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.MemberScalarFieldEnum = {
  id: 'id',
  organizationId: 'organizationId',
  userId: 'userId',
  role: 'role',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  isActive: 'isActive'
};

exports.Prisma.InvitationScalarFieldEnum = {
  id: 'id',
  organizationId: 'organizationId',
  email: 'email',
  role: 'role',
  status: 'status',
  expiresAt: 'expiresAt',
  inviterId: 'inviterId'
};

exports.Prisma.OrganizationScalarFieldEnum = {
  id: 'id',
  name: 'name',
  slug: 'slug',
  logo: 'logo',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  metadata: 'metadata',
  stripeCustomerId: 'stripeCustomerId'
};

exports.Prisma.ApiKeyScalarFieldEnum = {
  id: 'id',
  name: 'name',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  expiresAt: 'expiresAt',
  lastUsedAt: 'lastUsedAt',
  isActive: 'isActive',
  organizationId: 'organizationId'
};

exports.Prisma.SortOrder = {
  asc: 'asc',
  desc: 'desc'
};

exports.Prisma.QueryMode = {
  default: 'default',
  insensitive: 'insensitive'
};

exports.Prisma.NullsOrder = {
  first: 'first',
  last: 'last'
};
exports.Role = exports.$Enums.Role = {
  owner: 'owner',
  admin: 'admin',
  member: 'member'
};

exports.Prisma.ModelName = {
  User: 'User',
  Session: 'Session',
  Account: 'Account',
  Verification: 'Verification',
  Member: 'Member',
  Invitation: 'Invitation',
  Organization: 'Organization',
  ApiKey: 'ApiKey'
};
/**
 * Create the Client
 */
const config = {
  "generator": {
    "name": "next",
    "provider": {
      "fromEnvVar": null,
      "value": "prisma-client-js"
    },
    "output": {
      "value": "/Users/claudfuen/Documents/Repos/comp/packages/db-framework-editor/dist",
      "fromEnvVar": null
    },
    "config": {
      "engineType": "library"
    },
    "binaryTargets": [
      {
        "fromEnvVar": null,
        "value": "darwin-arm64"
      },
      {
        "fromEnvVar": null,
        "value": "rhel-openssl-3.0.x"
      }
    ],
    "previewFeatures": [
      "driverAdapters",
      "postgresqlExtensions"
    ],
    "sourceFilePath": "/Users/claudfuen/Documents/Repos/comp/packages/db-framework-editor/prisma/schema.prisma",
    "isCustomOutput": true
  },
  "relativeEnvPaths": {
    "rootEnvPath": "../.env",
    "schemaEnvPath": "../.env"
  },
  "relativePath": "../prisma",
  "clientVersion": "6.6.0",
  "engineVersion": "f676762280b54cd07c770017ed3711ddde35f37a",
  "datasourceNames": [
    "db"
  ],
  "activeProvider": "postgresql",
  "inlineDatasources": {
    "db": {
      "url": {
        "fromEnvVar": "DATABASE_URL",
        "value": "postgresql://postgres:postgres@localhost:5432/framework-editor"
      }
    }
  },
  "inlineSchema": "// This is your Prisma schema file,\n// learn more about it in the docs: https://pris.ly/d/prisma-schema\n\n// Looking for ways to speed up your queries, or scale easily with your serverless or edge functions?\n// Try Prisma Accelerate: https://pris.ly/cli/accelerate-init\n\ngenerator next {\n  provider        = \"prisma-client-js\"\n  previewFeatures = [\"driverAdapters\", \"postgresqlExtensions\"]\n  output          = \"../dist\"\n  binaryTargets   = [\"darwin-arm64\", \"rhel-openssl-3.0.x\"]\n\n  // runtime                = \"nodejs\"\n  // moduleFormat           = \"esm\"\n  // generatedFileExtension = \"ts\"\n  // importFileExtension    = \"\"\n}\n\n// generator node {\n//   provider        = \"prisma-client\"\n//   previewFeatures = [\"driverAdapters\", \"postgresqlExtensions\"]\n//   output          = \"../../db-node/src\"\n//   binaryTargets   = [\"darwin-arm64\", \"rhel-openssl-3.0.x\"]\n\n//   runtime                = \"nodejs\"\n//   moduleFormat           = \"commonjs\"\n//   generatedFileExtension = \"ts\"\n//   importFileExtension    = \"\"\n// }\n\n// generator types {\n//   provider        = \"prisma-generator-typescript-interfaces\"\n//   previewFeatures = [\"driverAdapters\", \"postgresqlExtensions\"]\n//   output          = \"../../db-types/src/interfaces.ts\"\n//   binaryTargets   = [\"darwin-arm64\", \"rhel-openssl-3.0.x\"]\n// }\n\ndatasource db {\n  provider   = \"postgresql\"\n  url        = env(\"DATABASE_URL\")\n  extensions = [pgcrypto]\n}\n\nmodel User {\n  id            String    @id @default(dbgenerated(\"generate_prefixed_cuid('usr'::text)\"))\n  name          String\n  email         String\n  emailVerified Boolean\n  image         String?\n  createdAt     DateTime  @default(now())\n  updatedAt     DateTime  @default(now()) @updatedAt\n  lastLogin     DateTime?\n\n  accounts    Account[]\n  invitations Invitation[]\n  members     Member[]\n  sessions    Session[]\n\n  @@unique([email])\n}\n\nmodel Session {\n  id                   String   @id @default(dbgenerated(\"generate_prefixed_cuid('ses'::text)\"))\n  expiresAt            DateTime\n  token                String\n  createdAt            DateTime @default(now())\n  updatedAt            DateTime @default(now()) @updatedAt\n  ipAddress            String?\n  userAgent            String?\n  userId               String\n  activeOrganizationId String?\n  user                 User     @relation(fields: [userId], references: [id], onDelete: Cascade)\n\n  @@unique([token])\n}\n\nmodel Account {\n  id                    String    @id @default(dbgenerated(\"generate_prefixed_cuid('acc'::text)\"))\n  accountId             String\n  providerId            String\n  userId                String\n  user                  User      @relation(fields: [userId], references: [id], onDelete: Cascade)\n  accessToken           String?\n  refreshToken          String?\n  idToken               String?\n  accessTokenExpiresAt  DateTime?\n  refreshTokenExpiresAt DateTime?\n  scope                 String?\n  password              String?\n  createdAt             DateTime  @default(now())\n  updatedAt             DateTime  @default(now()) @updatedAt\n}\n\nmodel Verification {\n  id         String   @id @default(dbgenerated(\"generate_prefixed_cuid('ver'::text)\"))\n  identifier String\n  value      String\n  expiresAt  DateTime\n  createdAt  DateTime @default(now())\n  updatedAt  DateTime @default(now()) @updatedAt\n}\n\nmodel Member {\n  id             String       @id @default(dbgenerated(\"generate_prefixed_cuid('mem'::text)\"))\n  organizationId String\n  organization   Organization @relation(fields: [organizationId], references: [id], onDelete: Cascade)\n  userId         String\n  user           User         @relation(fields: [userId], references: [id], onDelete: Cascade)\n  role           String\n  createdAt      DateTime     @default(now())\n  updatedAt      DateTime     @default(now()) @updatedAt\n  isActive       Boolean      @default(true)\n}\n\nmodel Invitation {\n  id             String       @id @default(dbgenerated(\"generate_prefixed_cuid('inv'::text)\"))\n  organizationId String\n  organization   Organization @relation(fields: [organizationId], references: [id], onDelete: Cascade)\n  email          String\n  role           String\n  status         String\n  expiresAt      DateTime\n  inviterId      String\n  user           User         @relation(fields: [inviterId], references: [id], onDelete: Cascade)\n}\n\n// Not enforced on the DB level (needs to be string), but this type is used in auth client\nenum Role {\n  owner\n  admin\n  member\n}\n\nmodel Organization {\n  id               String   @id @default(dbgenerated(\"generate_prefixed_cuid('org'::text)\"))\n  name             String\n  slug             String   @unique\n  logo             String?\n  createdAt        DateTime @default(now())\n  updatedAt        DateTime @default(now()) @updatedAt\n  metadata         String?\n  stripeCustomerId String?\n\n  apiKeys     ApiKey[]\n  invitations Invitation[]\n  members     Member[]\n\n  @@index([slug])\n}\n\nmodel ApiKey {\n  id         String    @id @default(dbgenerated(\"generate_prefixed_cuid_long('pk'::text)\"))\n  name       String\n  createdAt  DateTime  @default(now())\n  updatedAt  DateTime  @default(now()) @updatedAt\n  expiresAt  DateTime?\n  lastUsedAt DateTime?\n  isActive   Boolean   @default(true)\n\n  organization   Organization @relation(fields: [organizationId], references: [id], onDelete: Cascade)\n  organizationId String\n\n  @@index([organizationId])\n}\n",
  "inlineSchemaHash": "48e7ac2a6d24a746dab2d804264149cee3ba3b3af370fe0bcc408186d9be0fc4",
  "copyEngine": true
}
config.dirname = '/'

config.runtimeDataModel = JSON.parse("{\"models\":{\"User\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"name\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"email\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"emailVerified\",\"kind\":\"scalar\",\"type\":\"Boolean\"},{\"name\":\"image\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"lastLogin\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"accounts\",\"kind\":\"object\",\"type\":\"Account\",\"relationName\":\"AccountToUser\"},{\"name\":\"invitations\",\"kind\":\"object\",\"type\":\"Invitation\",\"relationName\":\"InvitationToUser\"},{\"name\":\"members\",\"kind\":\"object\",\"type\":\"Member\",\"relationName\":\"MemberToUser\"},{\"name\":\"sessions\",\"kind\":\"object\",\"type\":\"Session\",\"relationName\":\"SessionToUser\"}],\"dbName\":null},\"Session\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"expiresAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"token\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"ipAddress\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"userAgent\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"userId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"activeOrganizationId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"user\",\"kind\":\"object\",\"type\":\"User\",\"relationName\":\"SessionToUser\"}],\"dbName\":null},\"Account\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"accountId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"providerId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"userId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"user\",\"kind\":\"object\",\"type\":\"User\",\"relationName\":\"AccountToUser\"},{\"name\":\"accessToken\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"refreshToken\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"idToken\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"accessTokenExpiresAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"refreshTokenExpiresAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"scope\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"password\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"}],\"dbName\":null},\"Verification\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"identifier\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"value\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"expiresAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"}],\"dbName\":null},\"Member\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"organizationId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"organization\",\"kind\":\"object\",\"type\":\"Organization\",\"relationName\":\"MemberToOrganization\"},{\"name\":\"userId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"user\",\"kind\":\"object\",\"type\":\"User\",\"relationName\":\"MemberToUser\"},{\"name\":\"role\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"isActive\",\"kind\":\"scalar\",\"type\":\"Boolean\"}],\"dbName\":null},\"Invitation\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"organizationId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"organization\",\"kind\":\"object\",\"type\":\"Organization\",\"relationName\":\"InvitationToOrganization\"},{\"name\":\"email\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"role\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"status\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"expiresAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"inviterId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"user\",\"kind\":\"object\",\"type\":\"User\",\"relationName\":\"InvitationToUser\"}],\"dbName\":null},\"Organization\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"name\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"slug\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"logo\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"metadata\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"stripeCustomerId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"apiKeys\",\"kind\":\"object\",\"type\":\"ApiKey\",\"relationName\":\"ApiKeyToOrganization\"},{\"name\":\"invitations\",\"kind\":\"object\",\"type\":\"Invitation\",\"relationName\":\"InvitationToOrganization\"},{\"name\":\"members\",\"kind\":\"object\",\"type\":\"Member\",\"relationName\":\"MemberToOrganization\"}],\"dbName\":null},\"ApiKey\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"name\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"expiresAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"lastUsedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"isActive\",\"kind\":\"scalar\",\"type\":\"Boolean\"},{\"name\":\"organization\",\"kind\":\"object\",\"type\":\"Organization\",\"relationName\":\"ApiKeyToOrganization\"},{\"name\":\"organizationId\",\"kind\":\"scalar\",\"type\":\"String\"}],\"dbName\":null}},\"enums\":{},\"types\":{}}")
defineDmmfProperty(exports.Prisma, config.runtimeDataModel)
config.engineWasm = {
  getRuntime: async () => require('./query_engine_bg.js'),
  getQueryEngineWasmModule: async () => {
    const loader = (await import('#wasm-engine-loader')).default
    const engine = (await loader).default
    return engine
  }
}
config.compilerWasm = undefined

config.injectableEdgeEnv = () => ({
  parsed: {
    DATABASE_URL: typeof globalThis !== 'undefined' && globalThis['DATABASE_URL'] || typeof process !== 'undefined' && process.env && process.env.DATABASE_URL || undefined
  }
})

if (typeof globalThis !== 'undefined' && globalThis['DEBUG'] || typeof process !== 'undefined' && process.env && process.env.DEBUG || undefined) {
  Debug.enable(typeof globalThis !== 'undefined' && globalThis['DEBUG'] || typeof process !== 'undefined' && process.env && process.env.DEBUG || undefined)
}

const PrismaClient = getPrismaClient(config)
exports.PrismaClient = PrismaClient
Object.assign(exports, Prisma)

