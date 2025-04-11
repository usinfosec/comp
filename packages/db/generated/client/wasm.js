
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
 * Query Engine version: 173f8d54f8d52e692c7e27e72a88314ec7aeff60
 */
Prisma.prismaVersion = {
  client: "6.6.0",
  engine: "173f8d54f8d52e692c7e27e72a88314ec7aeff60"
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

exports.Prisma.ArtifactScalarFieldEnum = {
  id: 'id',
  type: 'type',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  organizationId: 'organizationId',
  evidenceId: 'evidenceId',
  policyId: 'policyId'
};

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

exports.Prisma.EmployeeTrainingVideoCompletionScalarFieldEnum = {
  id: 'id',
  completedAt: 'completedAt',
  videoId: 'videoId',
  memberId: 'memberId'
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
  department: 'department',
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

exports.Prisma.CommentScalarFieldEnum = {
  id: 'id',
  content: 'content',
  entityId: 'entityId',
  createdAt: 'createdAt',
  authorId: 'authorId',
  organizationId: 'organizationId'
};

exports.Prisma.ControlScalarFieldEnum = {
  id: 'id',
  name: 'name',
  description: 'description',
  lastReviewDate: 'lastReviewDate',
  nextReviewDate: 'nextReviewDate',
  organizationId: 'organizationId'
};

exports.Prisma.EvidenceScalarFieldEnum = {
  id: 'id',
  name: 'name',
  description: 'description',
  isNotRelevant: 'isNotRelevant',
  additionalUrls: 'additionalUrls',
  fileUrls: 'fileUrls',
  frequency: 'frequency',
  department: 'department',
  status: 'status',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  lastPublishedAt: 'lastPublishedAt',
  assigneeId: 'assigneeId',
  organizationId: 'organizationId'
};

exports.Prisma.FrameworkInstanceScalarFieldEnum = {
  id: 'id',
  organizationId: 'organizationId',
  frameworkId: 'frameworkId'
};

exports.Prisma.IntegrationScalarFieldEnum = {
  id: 'id',
  name: 'name',
  integrationId: 'integrationId',
  settings: 'settings',
  userSettings: 'userSettings',
  organizationId: 'organizationId',
  lastRunAt: 'lastRunAt'
};

exports.Prisma.IntegrationResultScalarFieldEnum = {
  id: 'id',
  title: 'title',
  description: 'description',
  remediation: 'remediation',
  status: 'status',
  severity: 'severity',
  resultDetails: 'resultDetails',
  completedAt: 'completedAt',
  integrationId: 'integrationId',
  organizationId: 'organizationId',
  assignedUserId: 'assignedUserId'
};

exports.Prisma.OrganizationScalarFieldEnum = {
  id: 'id',
  name: 'name',
  slug: 'slug',
  logo: 'logo',
  createdAt: 'createdAt',
  metadata: 'metadata',
  stripeCustomerId: 'stripeCustomerId'
};

exports.Prisma.PolicyScalarFieldEnum = {
  id: 'id',
  name: 'name',
  description: 'description',
  status: 'status',
  content: 'content',
  frequency: 'frequency',
  department: 'department',
  isRequiredToSign: 'isRequiredToSign',
  signedBy: 'signedBy',
  reviewDate: 'reviewDate',
  isArchived: 'isArchived',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  lastArchivedAt: 'lastArchivedAt',
  lastPublishedAt: 'lastPublishedAt',
  organizationId: 'organizationId',
  assigneeId: 'assigneeId'
};

exports.Prisma.RequirementMapScalarFieldEnum = {
  id: 'id',
  requirementId: 'requirementId',
  controlId: 'controlId',
  frameworkInstanceId: 'frameworkInstanceId'
};

exports.Prisma.RiskScalarFieldEnum = {
  id: 'id',
  title: 'title',
  description: 'description',
  category: 'category',
  department: 'department',
  status: 'status',
  likelihood: 'likelihood',
  impact: 'impact',
  residualLikelihood: 'residualLikelihood',
  residualImpact: 'residualImpact',
  treatmentStrategyDescription: 'treatmentStrategyDescription',
  treatmentStrategy: 'treatmentStrategy',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  organizationId: 'organizationId',
  assigneeId: 'assigneeId'
};

exports.Prisma.ApiKeyScalarFieldEnum = {
  id: 'id',
  name: 'name',
  key: 'key',
  salt: 'salt',
  createdAt: 'createdAt',
  expiresAt: 'expiresAt',
  lastUsedAt: 'lastUsedAt',
  isActive: 'isActive',
  organizationId: 'organizationId'
};

exports.Prisma.AuditLogScalarFieldEnum = {
  id: 'id',
  timestamp: 'timestamp',
  userId: 'userId',
  organizationId: 'organizationId',
  data: 'data'
};

exports.Prisma.TaskScalarFieldEnum = {
  id: 'id',
  title: 'title',
  description: 'description',
  status: 'status',
  relatedId: 'relatedId',
  relatedType: 'relatedType',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  dueDate: 'dueDate',
  assigneeId: 'assigneeId',
  organizationId: 'organizationId'
};

exports.Prisma.VendorScalarFieldEnum = {
  id: 'id',
  name: 'name',
  description: 'description',
  category: 'category',
  status: 'status',
  inherentProbability: 'inherentProbability',
  inherentImpact: 'inherentImpact',
  residualProbability: 'residualProbability',
  residualImpact: 'residualImpact',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  organizationId: 'organizationId',
  assigneeId: 'assigneeId'
};

exports.Prisma.VendorContactScalarFieldEnum = {
  id: 'id',
  vendorId: 'vendorId',
  name: 'name',
  email: 'email',
  phone: 'phone',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.SortOrder = {
  asc: 'asc',
  desc: 'desc'
};

exports.Prisma.JsonNullValueInput = {
  JsonNull: Prisma.JsonNull
};

exports.Prisma.NullableJsonNullValueInput = {
  DbNull: Prisma.DbNull,
  JsonNull: Prisma.JsonNull
};

exports.Prisma.QueryMode = {
  default: 'default',
  insensitive: 'insensitive'
};

exports.Prisma.NullsOrder = {
  first: 'first',
  last: 'last'
};

exports.Prisma.JsonNullValueFilter = {
  DbNull: Prisma.DbNull,
  JsonNull: Prisma.JsonNull,
  AnyNull: Prisma.AnyNull
};
exports.ArtifactType = exports.$Enums.ArtifactType = {
  policy: 'policy',
  evidence: 'evidence',
  procedure: 'procedure',
  training: 'training'
};

exports.Role = exports.$Enums.Role = {
  owner: 'owner',
  admin: 'admin',
  auditor: 'auditor',
  employee: 'employee'
};

exports.EvidenceStatus = exports.$Enums.EvidenceStatus = {
  draft: 'draft',
  published: 'published',
  not_relevant: 'not_relevant'
};

exports.FrameworkId = exports.$Enums.FrameworkId = {
  soc2: 'soc2'
};

exports.PolicyStatus = exports.$Enums.PolicyStatus = {
  draft: 'draft',
  published: 'published',
  needs_review: 'needs_review'
};

exports.RequirementId = exports.$Enums.RequirementId = {
  soc2_CC1: 'soc2_CC1',
  soc2_CC2: 'soc2_CC2',
  soc2_CC3: 'soc2_CC3',
  soc2_CC4: 'soc2_CC4',
  soc2_CC5: 'soc2_CC5',
  soc2_CC6: 'soc2_CC6',
  soc2_CC7: 'soc2_CC7',
  soc2_CC8: 'soc2_CC8',
  soc2_CC9: 'soc2_CC9',
  soc2_A1: 'soc2_A1',
  soc2_C1: 'soc2_C1',
  soc2_PI1: 'soc2_PI1',
  soc2_P1: 'soc2_P1'
};

exports.RiskTreatmentType = exports.$Enums.RiskTreatmentType = {
  accept: 'accept',
  avoid: 'avoid',
  mitigate: 'mitigate',
  transfer: 'transfer'
};

exports.RiskCategory = exports.$Enums.RiskCategory = {
  customer: 'customer',
  governance: 'governance',
  operations: 'operations',
  other: 'other',
  people: 'people',
  regulatory: 'regulatory',
  reporting: 'reporting',
  resilience: 'resilience',
  technology: 'technology',
  vendor_management: 'vendor_management'
};

exports.RiskStatus = exports.$Enums.RiskStatus = {
  open: 'open',
  pending: 'pending',
  closed: 'closed',
  archived: 'archived'
};

exports.Departments = exports.$Enums.Departments = {
  none: 'none',
  admin: 'admin',
  gov: 'gov',
  hr: 'hr',
  it: 'it',
  itsm: 'itsm',
  qms: 'qms'
};

exports.Frequency = exports.$Enums.Frequency = {
  monthly: 'monthly',
  quarterly: 'quarterly',
  yearly: 'yearly'
};

exports.Likelihood = exports.$Enums.Likelihood = {
  very_unlikely: 'very_unlikely',
  unlikely: 'unlikely',
  possible: 'possible',
  likely: 'likely',
  very_likely: 'very_likely'
};

exports.Impact = exports.$Enums.Impact = {
  insignificant: 'insignificant',
  minor: 'minor',
  moderate: 'moderate',
  major: 'major',
  severe: 'severe'
};

exports.TaskStatus = exports.$Enums.TaskStatus = {
  open: 'open',
  closed: 'closed'
};

exports.TaskType = exports.$Enums.TaskType = {
  vendor: 'vendor',
  risk: 'risk'
};

exports.VendorCategory = exports.$Enums.VendorCategory = {
  cloud: 'cloud',
  infrastructure: 'infrastructure',
  software_as_a_service: 'software_as_a_service',
  finance: 'finance',
  marketing: 'marketing',
  sales: 'sales',
  hr: 'hr',
  other: 'other'
};

exports.VendorStatus = exports.$Enums.VendorStatus = {
  not_assessed: 'not_assessed',
  in_progress: 'in_progress',
  assessed: 'assessed'
};

exports.Prisma.ModelName = {
  Artifact: 'Artifact',
  User: 'User',
  EmployeeTrainingVideoCompletion: 'EmployeeTrainingVideoCompletion',
  Session: 'Session',
  Account: 'Account',
  Verification: 'Verification',
  Member: 'Member',
  Invitation: 'Invitation',
  Comment: 'Comment',
  Control: 'Control',
  Evidence: 'Evidence',
  FrameworkInstance: 'FrameworkInstance',
  Integration: 'Integration',
  IntegrationResult: 'IntegrationResult',
  Organization: 'Organization',
  Policy: 'Policy',
  RequirementMap: 'RequirementMap',
  Risk: 'Risk',
  ApiKey: 'ApiKey',
  AuditLog: 'AuditLog',
  Task: 'Task',
  Vendor: 'Vendor',
  VendorContact: 'VendorContact'
};
/**
 * Create the Client
 */
const config = {
  "generator": {
    "name": "client",
    "provider": {
      "fromEnvVar": null,
      "value": "prisma-client-js"
    },
    "output": {
      "value": "/Users/claudfuen/Documents/Repos/comp/packages/db/generated/client",
      "fromEnvVar": null
    },
    "config": {
      "engineType": "library"
    },
    "binaryTargets": [
      {
        "fromEnvVar": null,
        "value": "darwin-arm64",
        "native": true
      },
      {
        "fromEnvVar": null,
        "value": "debian-openssl-3.0.x"
      }
    ],
    "previewFeatures": [
      "driverAdapters",
      "postgresqlExtensions",
      "prismaSchemaFolder"
    ],
    "sourceFilePath": "/Users/claudfuen/Documents/Repos/comp/packages/db/prisma/schema/schema.prisma",
    "isCustomOutput": true
  },
  "relativeEnvPaths": {
    "rootEnvPath": "../../.env",
    "schemaEnvPath": "../../.env"
  },
  "relativePath": "../../prisma/schema",
  "clientVersion": "6.6.0",
  "engineVersion": "173f8d54f8d52e692c7e27e72a88314ec7aeff60",
  "datasourceNames": [
    "db"
  ],
  "activeProvider": "postgresql",
  "postinstall": false,
  "inlineDatasources": {
    "db": {
      "url": {
        "fromEnvVar": "DATABASE_URL",
        "value": null
      }
    }
  },
  "inlineSchema": "model Artifact {\n  // Metadata\n  id   String       @id @default(dbgenerated(\"generate_prefixed_cuid('art'::text)\"))\n  type ArtifactType\n\n  // Timestamps\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  // Relations\n  controls       Control[]\n  organizationId String\n  organization   Organization @relation(fields: [organizationId], references: [id], onDelete: Cascade)\n  evidenceId     String?\n  evidence       Evidence?    @relation(fields: [evidenceId], references: [id], onDelete: Cascade)\n  policyId       String?\n  policy         Policy?      @relation(fields: [policyId], references: [id], onDelete: Cascade)\n\n  @@unique([organizationId, evidenceId, policyId])\n}\n\nenum ArtifactType {\n  policy\n  evidence\n  procedure\n  training\n}\n\nmodel User {\n  id            String    @id @default(dbgenerated(\"generate_prefixed_cuid('usr'::text)\"))\n  name          String\n  email         String\n  emailVerified Boolean\n  image         String?\n  createdAt     DateTime  @default(now())\n  updatedAt     DateTime  @updatedAt\n  lastLogin     DateTime?\n\n  accounts           Account[]\n  auditLog           AuditLog[]\n  integrationResults IntegrationResult[]\n  invitations        Invitation[]\n  members            Member[]\n  sessions           Session[]\n\n  @@unique([email])\n}\n\nmodel EmployeeTrainingVideoCompletion {\n  id          String    @id @default(dbgenerated(\"generate_prefixed_cuid('evc'::text)\"))\n  completedAt DateTime?\n  videoId     String\n\n  memberId String\n  member   Member @relation(fields: [memberId], references: [id], onDelete: Cascade)\n\n  @@unique([memberId, videoId])\n  @@index([memberId])\n}\n\nmodel Session {\n  id                   String   @id @default(dbgenerated(\"generate_prefixed_cuid('ses'::text)\"))\n  expiresAt            DateTime\n  token                String\n  createdAt            DateTime @default(now())\n  updatedAt            DateTime @updatedAt\n  ipAddress            String?\n  userAgent            String?\n  userId               String\n  activeOrganizationId String?\n  user                 User     @relation(fields: [userId], references: [id], onDelete: Cascade)\n\n  @@unique([token])\n}\n\nmodel Account {\n  id                    String    @id @default(dbgenerated(\"generate_prefixed_cuid('acc'::text)\"))\n  accountId             String\n  providerId            String\n  userId                String\n  user                  User      @relation(fields: [userId], references: [id], onDelete: Cascade)\n  accessToken           String?\n  refreshToken          String?\n  idToken               String?\n  accessTokenExpiresAt  DateTime?\n  refreshTokenExpiresAt DateTime?\n  scope                 String?\n  password              String?\n  createdAt             DateTime\n  updatedAt             DateTime\n}\n\nmodel Verification {\n  id         String   @id @default(dbgenerated(\"generate_prefixed_cuid('ver'::text)\"))\n  identifier String\n  value      String\n  expiresAt  DateTime\n  createdAt  DateTime @default(now())\n  updatedAt  DateTime @updatedAt\n}\n\nmodel Member {\n  id             String       @id @default(dbgenerated(\"generate_prefixed_cuid('mem'::text)\"))\n  organizationId String\n  organization   Organization @relation(fields: [organizationId], references: [id], onDelete: Cascade)\n  userId         String\n  user           User         @relation(fields: [userId], references: [id], onDelete: Cascade)\n  role           Role\n  createdAt      DateTime     @default(now())\n\n  department                      Departments                       @default(none)\n  isActive                        Boolean                           @default(true)\n  EmployeeTrainingVideoCompletion EmployeeTrainingVideoCompletion[]\n  Evidence                        Evidence[]\n  Policy                          Policy[]\n  Risk                            Risk[]\n  Task                            Task[]\n  Vendor                          Vendor[]\n  comments                        Comment[]\n}\n\nmodel Invitation {\n  id             String       @id @default(dbgenerated(\"generate_prefixed_cuid('inv'::text)\"))\n  organizationId String\n  organization   Organization @relation(fields: [organizationId], references: [id], onDelete: Cascade)\n  email          String\n  role           Role?\n  status         String\n  expiresAt      DateTime\n  inviterId      String\n  user           User         @relation(fields: [inviterId], references: [id], onDelete: Cascade)\n}\n\nenum Role {\n  owner\n  admin\n  auditor\n  employee\n}\n\nmodel Comment {\n  id        String   @id @default(dbgenerated(\"generate_prefixed_cuid('cmt'::text)\"))\n  content   String\n  entityId  String\n  createdAt DateTime @default(now())\n\n  // Relationships\n  authorId       String\n  author         Member       @relation(fields: [authorId], references: [id])\n  organizationId String\n  organization   Organization @relation(fields: [organizationId], references: [id], onDelete: Cascade)\n\n  @@index([entityId])\n}\n\nmodel Control {\n  // Metadata\n  id          String @id @default(dbgenerated(\"generate_prefixed_cuid('ctl'::text)\"))\n  name        String\n  description String\n\n  // Review dates\n  lastReviewDate DateTime?\n  nextReviewDate DateTime?\n\n  // Relationships\n  frameworkInstances FrameworkInstance[]\n  organization       Organization        @relation(fields: [organizationId], references: [id], onDelete: Cascade)\n  organizationId     String\n  artifacts          Artifact[]\n  requirementsMapped RequirementMap[]\n\n  @@index([organizationId])\n}\n\nmodel Evidence {\n  // Metadata\n  id             String          @id @default(dbgenerated(\"generate_prefixed_cuid('evd'::text)\"))\n  name           String\n  description    String\n  isNotRelevant  Boolean         @default(false)\n  additionalUrls String[]\n  fileUrls       String[]\n  frequency      Frequency?\n  department     Departments     @default(none)\n  status         EvidenceStatus? @default(draft)\n\n  // Dates\n  createdAt       DateTime  @default(now())\n  updatedAt       DateTime  @updatedAt\n  lastPublishedAt DateTime?\n\n  // Relationships\n  assigneeId     String?\n  assignee       Member?      @relation(fields: [assigneeId], references: [id])\n  organizationId String\n  organization   Organization @relation(fields: [organizationId], references: [id], onDelete: Cascade)\n  artifacts      Artifact[]\n\n  @@index([organizationId])\n}\n\nenum EvidenceStatus {\n  draft\n  published\n  not_relevant\n}\n\nmodel FrameworkInstance {\n  // Metadata\n  id             String      @id @default(dbgenerated(\"generate_prefixed_cuid('frm'::text)\"))\n  organizationId String\n  frameworkId    FrameworkId\n\n  // Relationships\n  controls           Control[]\n  organization       Organization     @relation(fields: [organizationId], references: [id], onDelete: Cascade)\n  requirementsMapped RequirementMap[]\n\n  @@unique([organizationId, frameworkId])\n}\n\nenum FrameworkId {\n  soc2\n}\n\nmodel Integration {\n  id             String              @id @default(dbgenerated(\"generate_prefixed_cuid('int'::text)\"))\n  name           String              @unique\n  integrationId  String\n  settings       Json\n  userSettings   Json\n  organizationId String\n  lastRunAt      DateTime?\n  organization   Organization        @relation(fields: [organizationId], references: [id], onDelete: Cascade)\n  results        IntegrationResult[]\n\n  @@index([organizationId])\n}\n\nmodel IntegrationResult {\n  id             String    @id @default(dbgenerated(\"generate_prefixed_cuid('itr'::text)\"))\n  title          String?\n  description    String?\n  remediation    String?\n  status         String?\n  severity       String?\n  resultDetails  Json?\n  completedAt    DateTime? @default(now())\n  integrationId  String\n  organizationId String\n  assignedUserId String?\n\n  assignedUser User?       @relation(fields: [assignedUserId], references: [id], onDelete: Cascade)\n  integration  Integration @relation(fields: [integrationId], references: [id], onDelete: Cascade)\n\n  @@index([integrationId])\n}\n\nmodel Organization {\n  id               String   @id @default(dbgenerated(\"generate_prefixed_cuid('org'::text)\"))\n  name             String\n  slug             String   @unique\n  logo             String?\n  createdAt        DateTime\n  metadata         String?\n  stripeCustomerId String?\n\n  apiKeys            ApiKey[]\n  artifacts          Artifact[]\n  auditLog           AuditLog[]\n  controls           Control[]\n  evidence           Evidence[]\n  frameworkInstances FrameworkInstance[]\n  integrations       Integration[]\n  invitations        Invitation[]\n  members            Member[]\n  policy             Policy[]\n  risk               Risk[]\n  vendors            Vendor[]\n  tasks              Task[]\n  comments           Comment[]\n\n  @@index([slug])\n}\n\nmodel Policy {\n  id               String       @id @default(dbgenerated(\"generate_prefixed_cuid('pol'::text)\"))\n  name             String\n  description      String?\n  status           PolicyStatus @default(draft)\n  content          Json[]\n  frequency        Frequency?\n  department       Departments?\n  isRequiredToSign Boolean      @default(false)\n  signedBy         String[]     @default([])\n  reviewDate       DateTime?\n  isArchived       Boolean      @default(false)\n\n  // Dates\n  createdAt       DateTime  @default(now())\n  updatedAt       DateTime  @updatedAt\n  lastArchivedAt  DateTime?\n  lastPublishedAt DateTime?\n\n  // Relationships\n  organizationId String\n  organization   Organization @relation(fields: [organizationId], references: [id], onDelete: Cascade)\n  assigneeId     String?\n  assignee       Member?      @relation(fields: [assigneeId], references: [id])\n  artifacts      Artifact[]\n\n  @@index([organizationId])\n}\n\nenum PolicyStatus {\n  draft\n  published\n  needs_review\n}\n\nmodel RequirementMap {\n  id            String        @id @default(dbgenerated(\"generate_prefixed_cuid('req'::text)\"))\n  requirementId RequirementId\n\n  controlId           String\n  control             Control           @relation(fields: [controlId], references: [id], onDelete: Cascade)\n  frameworkInstanceId String\n  frameworkInstance   FrameworkInstance @relation(fields: [frameworkInstanceId], references: [id], onDelete: Cascade)\n\n  @@unique([controlId, frameworkInstanceId, requirementId])\n  @@index([requirementId, frameworkInstanceId])\n}\n\n// Ensure these map to @comp/data requirements object\nenum RequirementId {\n  soc2_CC1\n  soc2_CC2\n  soc2_CC3\n  soc2_CC4\n  soc2_CC5\n  soc2_CC6\n  soc2_CC7\n  soc2_CC8\n  soc2_CC9\n  soc2_A1\n  soc2_C1\n  soc2_PI1\n  soc2_P1\n}\n\nmodel Risk {\n  // Metadata\n  id                           String            @id @default(dbgenerated(\"generate_prefixed_cuid('rsk'::text)\"))\n  title                        String\n  description                  String\n  category                     RiskCategory\n  department                   Departments?\n  status                       RiskStatus        @default(open)\n  likelihood                   Likelihood        @default(very_unlikely)\n  impact                       Impact            @default(insignificant)\n  residualLikelihood           Likelihood        @default(very_unlikely)\n  residualImpact               Impact            @default(insignificant)\n  treatmentStrategyDescription String?\n  treatmentStrategy            RiskTreatmentType @default(accept)\n\n  // Dates\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  // Relationships\n  organizationId String\n  organization   Organization @relation(fields: [organizationId], references: [id], onDelete: Cascade)\n  assigneeId     String?\n  assignee       Member?      @relation(fields: [assigneeId], references: [id])\n\n  @@index([organizationId])\n  @@index([category])\n  @@index([status])\n}\n\nenum RiskTreatmentType {\n  accept\n  avoid\n  mitigate\n  transfer\n}\n\nenum RiskCategory {\n  customer\n  governance\n  operations\n  other\n  people\n  regulatory\n  reporting\n  resilience\n  technology\n  vendor_management\n}\n\nenum RiskStatus {\n  open\n  pending\n  closed\n  archived\n}\n\ngenerator client {\n  provider        = \"prisma-client-js\"\n  previewFeatures = [\"driverAdapters\", \"postgresqlExtensions\", \"prismaSchemaFolder\"]\n  binaryTargets   = [\"native\", \"debian-openssl-3.0.x\"]\n  output          = \"../../generated/client\"\n}\n\ndatasource db {\n  provider   = \"postgresql\"\n  url        = env(\"DATABASE_URL\")\n  extensions = [pgcrypto]\n}\n\nmodel ApiKey {\n  id         String    @id @default(dbgenerated(\"generate_prefixed_cuid('apk'::text)\"))\n  name       String\n  key        String    @unique\n  salt       String?\n  createdAt  DateTime  @default(now())\n  expiresAt  DateTime?\n  lastUsedAt DateTime?\n  isActive   Boolean   @default(true)\n\n  organization   Organization @relation(fields: [organizationId], references: [id], onDelete: Cascade)\n  organizationId String\n\n  @@index([organizationId])\n  @@index([key])\n}\n\nmodel AuditLog {\n  id             String   @id @default(dbgenerated(\"generate_prefixed_cuid('aud'::text)\"))\n  timestamp      DateTime @default(now())\n  userId         String\n  organizationId String\n  data           Json\n\n  organization Organization @relation(fields: [organizationId], references: [id], onDelete: Cascade)\n  user         User         @relation(fields: [userId], references: [id], onDelete: Cascade)\n\n  @@index([userId])\n  @@index([organizationId])\n}\n\nenum Departments {\n  none\n  admin\n  gov\n  hr\n  it\n  itsm\n  qms\n}\n\nenum Frequency {\n  monthly\n  quarterly\n  yearly\n}\n\nenum Likelihood {\n  very_unlikely\n  unlikely\n  possible\n  likely\n  very_likely\n}\n\nenum Impact {\n  insignificant\n  minor\n  moderate\n  major\n  severe\n}\n\nmodel Task {\n  // Metadata\n  id          String     @id @default(dbgenerated(\"generate_prefixed_cuid('tsk'::text)\"))\n  title       String\n  description String\n  status      TaskStatus @default(open)\n  relatedId   String\n  relatedType TaskType\n\n  // Dates\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n  dueDate   DateTime\n\n  // Relationships\n  assigneeId     String?\n  assignee       Member?      @relation(fields: [assigneeId], references: [id])\n  organizationId String\n  organization   Organization @relation(fields: [organizationId], references: [id])\n\n  @@index([relatedId])\n  @@index([relatedId, organizationId])\n}\n\nenum TaskStatus {\n  open\n  closed\n}\n\nenum TaskType {\n  vendor\n  risk\n}\n\nmodel Vendor {\n  id                  String          @id @default(dbgenerated(\"generate_prefixed_cuid('vnd'::text)\"))\n  name                String\n  description         String\n  category            VendorCategory  @default(other)\n  status              VendorStatus    @default(not_assessed)\n  inherentProbability Likelihood      @default(very_unlikely)\n  inherentImpact      Impact          @default(insignificant)\n  residualProbability Likelihood      @default(very_unlikely)\n  residualImpact      Impact          @default(insignificant)\n  contacts            VendorContact[]\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  organizationId String\n  organization   Organization @relation(fields: [organizationId], references: [id], onDelete: Cascade)\n  assigneeId     String?\n  assignee       Member?      @relation(fields: [assigneeId], references: [id], onDelete: Cascade)\n\n  @@index([organizationId])\n  @@index([assigneeId])\n  @@index([category])\n}\n\nmodel VendorContact {\n  id        String   @id @default(dbgenerated(\"generate_prefixed_cuid('vct'::text)\"))\n  vendorId  String\n  name      String\n  email     String\n  phone     String\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n  Vendor    Vendor   @relation(fields: [vendorId], references: [id])\n\n  @@index([vendorId])\n}\n\nenum VendorCategory {\n  cloud\n  infrastructure\n  software_as_a_service\n  finance\n  marketing\n  sales\n  hr\n  other\n}\n\nenum VendorStatus {\n  not_assessed\n  in_progress\n  assessed\n}\n",
  "inlineSchemaHash": "085342757e0ac65e78bf2a8b093862f8edaaed9912b77d209197199cd14bfbcd",
  "copyEngine": true
}
config.dirname = '/'

config.runtimeDataModel = JSON.parse("{\"models\":{\"Artifact\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"type\",\"kind\":\"enum\",\"type\":\"ArtifactType\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"controls\",\"kind\":\"object\",\"type\":\"Control\",\"relationName\":\"ArtifactToControl\"},{\"name\":\"organizationId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"organization\",\"kind\":\"object\",\"type\":\"Organization\",\"relationName\":\"ArtifactToOrganization\"},{\"name\":\"evidenceId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"evidence\",\"kind\":\"object\",\"type\":\"Evidence\",\"relationName\":\"ArtifactToEvidence\"},{\"name\":\"policyId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"policy\",\"kind\":\"object\",\"type\":\"Policy\",\"relationName\":\"ArtifactToPolicy\"}],\"dbName\":null},\"User\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"name\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"email\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"emailVerified\",\"kind\":\"scalar\",\"type\":\"Boolean\"},{\"name\":\"image\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"lastLogin\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"accounts\",\"kind\":\"object\",\"type\":\"Account\",\"relationName\":\"AccountToUser\"},{\"name\":\"auditLog\",\"kind\":\"object\",\"type\":\"AuditLog\",\"relationName\":\"AuditLogToUser\"},{\"name\":\"integrationResults\",\"kind\":\"object\",\"type\":\"IntegrationResult\",\"relationName\":\"IntegrationResultToUser\"},{\"name\":\"invitations\",\"kind\":\"object\",\"type\":\"Invitation\",\"relationName\":\"InvitationToUser\"},{\"name\":\"members\",\"kind\":\"object\",\"type\":\"Member\",\"relationName\":\"MemberToUser\"},{\"name\":\"sessions\",\"kind\":\"object\",\"type\":\"Session\",\"relationName\":\"SessionToUser\"}],\"dbName\":null},\"EmployeeTrainingVideoCompletion\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"completedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"videoId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"memberId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"member\",\"kind\":\"object\",\"type\":\"Member\",\"relationName\":\"EmployeeTrainingVideoCompletionToMember\"}],\"dbName\":null},\"Session\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"expiresAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"token\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"ipAddress\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"userAgent\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"userId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"activeOrganizationId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"user\",\"kind\":\"object\",\"type\":\"User\",\"relationName\":\"SessionToUser\"}],\"dbName\":null},\"Account\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"accountId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"providerId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"userId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"user\",\"kind\":\"object\",\"type\":\"User\",\"relationName\":\"AccountToUser\"},{\"name\":\"accessToken\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"refreshToken\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"idToken\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"accessTokenExpiresAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"refreshTokenExpiresAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"scope\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"password\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"}],\"dbName\":null},\"Verification\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"identifier\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"value\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"expiresAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"}],\"dbName\":null},\"Member\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"organizationId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"organization\",\"kind\":\"object\",\"type\":\"Organization\",\"relationName\":\"MemberToOrganization\"},{\"name\":\"userId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"user\",\"kind\":\"object\",\"type\":\"User\",\"relationName\":\"MemberToUser\"},{\"name\":\"role\",\"kind\":\"enum\",\"type\":\"Role\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"department\",\"kind\":\"enum\",\"type\":\"Departments\"},{\"name\":\"isActive\",\"kind\":\"scalar\",\"type\":\"Boolean\"},{\"name\":\"EmployeeTrainingVideoCompletion\",\"kind\":\"object\",\"type\":\"EmployeeTrainingVideoCompletion\",\"relationName\":\"EmployeeTrainingVideoCompletionToMember\"},{\"name\":\"Evidence\",\"kind\":\"object\",\"type\":\"Evidence\",\"relationName\":\"EvidenceToMember\"},{\"name\":\"Policy\",\"kind\":\"object\",\"type\":\"Policy\",\"relationName\":\"MemberToPolicy\"},{\"name\":\"Risk\",\"kind\":\"object\",\"type\":\"Risk\",\"relationName\":\"MemberToRisk\"},{\"name\":\"Task\",\"kind\":\"object\",\"type\":\"Task\",\"relationName\":\"MemberToTask\"},{\"name\":\"Vendor\",\"kind\":\"object\",\"type\":\"Vendor\",\"relationName\":\"MemberToVendor\"},{\"name\":\"comments\",\"kind\":\"object\",\"type\":\"Comment\",\"relationName\":\"CommentToMember\"}],\"dbName\":null},\"Invitation\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"organizationId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"organization\",\"kind\":\"object\",\"type\":\"Organization\",\"relationName\":\"InvitationToOrganization\"},{\"name\":\"email\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"role\",\"kind\":\"enum\",\"type\":\"Role\"},{\"name\":\"status\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"expiresAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"inviterId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"user\",\"kind\":\"object\",\"type\":\"User\",\"relationName\":\"InvitationToUser\"}],\"dbName\":null},\"Comment\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"content\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"entityId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"authorId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"author\",\"kind\":\"object\",\"type\":\"Member\",\"relationName\":\"CommentToMember\"},{\"name\":\"organizationId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"organization\",\"kind\":\"object\",\"type\":\"Organization\",\"relationName\":\"CommentToOrganization\"}],\"dbName\":null},\"Control\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"name\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"description\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"lastReviewDate\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"nextReviewDate\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"frameworkInstances\",\"kind\":\"object\",\"type\":\"FrameworkInstance\",\"relationName\":\"ControlToFrameworkInstance\"},{\"name\":\"organization\",\"kind\":\"object\",\"type\":\"Organization\",\"relationName\":\"ControlToOrganization\"},{\"name\":\"organizationId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"artifacts\",\"kind\":\"object\",\"type\":\"Artifact\",\"relationName\":\"ArtifactToControl\"},{\"name\":\"requirementsMapped\",\"kind\":\"object\",\"type\":\"RequirementMap\",\"relationName\":\"ControlToRequirementMap\"}],\"dbName\":null},\"Evidence\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"name\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"description\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"isNotRelevant\",\"kind\":\"scalar\",\"type\":\"Boolean\"},{\"name\":\"additionalUrls\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"fileUrls\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"frequency\",\"kind\":\"enum\",\"type\":\"Frequency\"},{\"name\":\"department\",\"kind\":\"enum\",\"type\":\"Departments\"},{\"name\":\"status\",\"kind\":\"enum\",\"type\":\"EvidenceStatus\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"lastPublishedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"assigneeId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"assignee\",\"kind\":\"object\",\"type\":\"Member\",\"relationName\":\"EvidenceToMember\"},{\"name\":\"organizationId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"organization\",\"kind\":\"object\",\"type\":\"Organization\",\"relationName\":\"EvidenceToOrganization\"},{\"name\":\"artifacts\",\"kind\":\"object\",\"type\":\"Artifact\",\"relationName\":\"ArtifactToEvidence\"}],\"dbName\":null},\"FrameworkInstance\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"organizationId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"frameworkId\",\"kind\":\"enum\",\"type\":\"FrameworkId\"},{\"name\":\"controls\",\"kind\":\"object\",\"type\":\"Control\",\"relationName\":\"ControlToFrameworkInstance\"},{\"name\":\"organization\",\"kind\":\"object\",\"type\":\"Organization\",\"relationName\":\"FrameworkInstanceToOrganization\"},{\"name\":\"requirementsMapped\",\"kind\":\"object\",\"type\":\"RequirementMap\",\"relationName\":\"FrameworkInstanceToRequirementMap\"}],\"dbName\":null},\"Integration\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"name\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"integrationId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"settings\",\"kind\":\"scalar\",\"type\":\"Json\"},{\"name\":\"userSettings\",\"kind\":\"scalar\",\"type\":\"Json\"},{\"name\":\"organizationId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"lastRunAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"organization\",\"kind\":\"object\",\"type\":\"Organization\",\"relationName\":\"IntegrationToOrganization\"},{\"name\":\"results\",\"kind\":\"object\",\"type\":\"IntegrationResult\",\"relationName\":\"IntegrationToIntegrationResult\"}],\"dbName\":null},\"IntegrationResult\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"title\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"description\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"remediation\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"status\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"severity\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"resultDetails\",\"kind\":\"scalar\",\"type\":\"Json\"},{\"name\":\"completedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"integrationId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"organizationId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"assignedUserId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"assignedUser\",\"kind\":\"object\",\"type\":\"User\",\"relationName\":\"IntegrationResultToUser\"},{\"name\":\"integration\",\"kind\":\"object\",\"type\":\"Integration\",\"relationName\":\"IntegrationToIntegrationResult\"}],\"dbName\":null},\"Organization\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"name\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"slug\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"logo\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"metadata\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"stripeCustomerId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"apiKeys\",\"kind\":\"object\",\"type\":\"ApiKey\",\"relationName\":\"ApiKeyToOrganization\"},{\"name\":\"artifacts\",\"kind\":\"object\",\"type\":\"Artifact\",\"relationName\":\"ArtifactToOrganization\"},{\"name\":\"auditLog\",\"kind\":\"object\",\"type\":\"AuditLog\",\"relationName\":\"AuditLogToOrganization\"},{\"name\":\"controls\",\"kind\":\"object\",\"type\":\"Control\",\"relationName\":\"ControlToOrganization\"},{\"name\":\"evidence\",\"kind\":\"object\",\"type\":\"Evidence\",\"relationName\":\"EvidenceToOrganization\"},{\"name\":\"frameworkInstances\",\"kind\":\"object\",\"type\":\"FrameworkInstance\",\"relationName\":\"FrameworkInstanceToOrganization\"},{\"name\":\"integrations\",\"kind\":\"object\",\"type\":\"Integration\",\"relationName\":\"IntegrationToOrganization\"},{\"name\":\"invitations\",\"kind\":\"object\",\"type\":\"Invitation\",\"relationName\":\"InvitationToOrganization\"},{\"name\":\"members\",\"kind\":\"object\",\"type\":\"Member\",\"relationName\":\"MemberToOrganization\"},{\"name\":\"policy\",\"kind\":\"object\",\"type\":\"Policy\",\"relationName\":\"OrganizationToPolicy\"},{\"name\":\"risk\",\"kind\":\"object\",\"type\":\"Risk\",\"relationName\":\"OrganizationToRisk\"},{\"name\":\"vendors\",\"kind\":\"object\",\"type\":\"Vendor\",\"relationName\":\"OrganizationToVendor\"},{\"name\":\"tasks\",\"kind\":\"object\",\"type\":\"Task\",\"relationName\":\"OrganizationToTask\"},{\"name\":\"comments\",\"kind\":\"object\",\"type\":\"Comment\",\"relationName\":\"CommentToOrganization\"}],\"dbName\":null},\"Policy\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"name\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"description\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"status\",\"kind\":\"enum\",\"type\":\"PolicyStatus\"},{\"name\":\"content\",\"kind\":\"scalar\",\"type\":\"Json\"},{\"name\":\"frequency\",\"kind\":\"enum\",\"type\":\"Frequency\"},{\"name\":\"department\",\"kind\":\"enum\",\"type\":\"Departments\"},{\"name\":\"isRequiredToSign\",\"kind\":\"scalar\",\"type\":\"Boolean\"},{\"name\":\"signedBy\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"reviewDate\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"isArchived\",\"kind\":\"scalar\",\"type\":\"Boolean\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"lastArchivedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"lastPublishedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"organizationId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"organization\",\"kind\":\"object\",\"type\":\"Organization\",\"relationName\":\"OrganizationToPolicy\"},{\"name\":\"assigneeId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"assignee\",\"kind\":\"object\",\"type\":\"Member\",\"relationName\":\"MemberToPolicy\"},{\"name\":\"artifacts\",\"kind\":\"object\",\"type\":\"Artifact\",\"relationName\":\"ArtifactToPolicy\"}],\"dbName\":null},\"RequirementMap\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"requirementId\",\"kind\":\"enum\",\"type\":\"RequirementId\"},{\"name\":\"controlId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"control\",\"kind\":\"object\",\"type\":\"Control\",\"relationName\":\"ControlToRequirementMap\"},{\"name\":\"frameworkInstanceId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"frameworkInstance\",\"kind\":\"object\",\"type\":\"FrameworkInstance\",\"relationName\":\"FrameworkInstanceToRequirementMap\"}],\"dbName\":null},\"Risk\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"title\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"description\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"category\",\"kind\":\"enum\",\"type\":\"RiskCategory\"},{\"name\":\"department\",\"kind\":\"enum\",\"type\":\"Departments\"},{\"name\":\"status\",\"kind\":\"enum\",\"type\":\"RiskStatus\"},{\"name\":\"likelihood\",\"kind\":\"enum\",\"type\":\"Likelihood\"},{\"name\":\"impact\",\"kind\":\"enum\",\"type\":\"Impact\"},{\"name\":\"residualLikelihood\",\"kind\":\"enum\",\"type\":\"Likelihood\"},{\"name\":\"residualImpact\",\"kind\":\"enum\",\"type\":\"Impact\"},{\"name\":\"treatmentStrategyDescription\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"treatmentStrategy\",\"kind\":\"enum\",\"type\":\"RiskTreatmentType\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"organizationId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"organization\",\"kind\":\"object\",\"type\":\"Organization\",\"relationName\":\"OrganizationToRisk\"},{\"name\":\"assigneeId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"assignee\",\"kind\":\"object\",\"type\":\"Member\",\"relationName\":\"MemberToRisk\"}],\"dbName\":null},\"ApiKey\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"name\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"key\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"salt\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"expiresAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"lastUsedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"isActive\",\"kind\":\"scalar\",\"type\":\"Boolean\"},{\"name\":\"organization\",\"kind\":\"object\",\"type\":\"Organization\",\"relationName\":\"ApiKeyToOrganization\"},{\"name\":\"organizationId\",\"kind\":\"scalar\",\"type\":\"String\"}],\"dbName\":null},\"AuditLog\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"timestamp\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"userId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"organizationId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"data\",\"kind\":\"scalar\",\"type\":\"Json\"},{\"name\":\"organization\",\"kind\":\"object\",\"type\":\"Organization\",\"relationName\":\"AuditLogToOrganization\"},{\"name\":\"user\",\"kind\":\"object\",\"type\":\"User\",\"relationName\":\"AuditLogToUser\"}],\"dbName\":null},\"Task\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"title\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"description\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"status\",\"kind\":\"enum\",\"type\":\"TaskStatus\"},{\"name\":\"relatedId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"relatedType\",\"kind\":\"enum\",\"type\":\"TaskType\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"dueDate\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"assigneeId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"assignee\",\"kind\":\"object\",\"type\":\"Member\",\"relationName\":\"MemberToTask\"},{\"name\":\"organizationId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"organization\",\"kind\":\"object\",\"type\":\"Organization\",\"relationName\":\"OrganizationToTask\"}],\"dbName\":null},\"Vendor\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"name\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"description\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"category\",\"kind\":\"enum\",\"type\":\"VendorCategory\"},{\"name\":\"status\",\"kind\":\"enum\",\"type\":\"VendorStatus\"},{\"name\":\"inherentProbability\",\"kind\":\"enum\",\"type\":\"Likelihood\"},{\"name\":\"inherentImpact\",\"kind\":\"enum\",\"type\":\"Impact\"},{\"name\":\"residualProbability\",\"kind\":\"enum\",\"type\":\"Likelihood\"},{\"name\":\"residualImpact\",\"kind\":\"enum\",\"type\":\"Impact\"},{\"name\":\"contacts\",\"kind\":\"object\",\"type\":\"VendorContact\",\"relationName\":\"VendorToVendorContact\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"organizationId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"organization\",\"kind\":\"object\",\"type\":\"Organization\",\"relationName\":\"OrganizationToVendor\"},{\"name\":\"assigneeId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"assignee\",\"kind\":\"object\",\"type\":\"Member\",\"relationName\":\"MemberToVendor\"}],\"dbName\":null},\"VendorContact\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"vendorId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"name\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"email\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"phone\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"Vendor\",\"kind\":\"object\",\"type\":\"Vendor\",\"relationName\":\"VendorToVendorContact\"}],\"dbName\":null}},\"enums\":{},\"types\":{}}")
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

