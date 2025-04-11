
Object.defineProperty(exports, "__esModule", { value: true });

const {
  Decimal,
  objectEnumValues,
  makeStrictEnum,
  Public,
  getRuntime,
  skip
} = require('./runtime/index-browser.js')


const Prisma = {}

exports.Prisma = Prisma
exports.$Enums = {}

/**
 * Prisma Client JS version: 6.5.0
 * Query Engine version: 173f8d54f8d52e692c7e27e72a88314ec7aeff60
 */
Prisma.prismaVersion = {
  client: "6.5.0",
  engine: "173f8d54f8d52e692c7e27e72a88314ec7aeff60"
}

Prisma.PrismaClientKnownRequestError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientKnownRequestError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)};
Prisma.PrismaClientUnknownRequestError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientUnknownRequestError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientRustPanicError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientRustPanicError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientInitializationError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientInitializationError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientValidationError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientValidationError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.Decimal = Decimal

/**
 * Re-export of sql-template-tag
 */
Prisma.sql = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`sqltag is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.empty = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`empty is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.join = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`join is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.raw = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`raw is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.validator = Public.validator

/**
* Extensions
*/
Prisma.getExtensionContext = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`Extensions.getExtensionContext is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.defineExtension = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`Extensions.defineExtension is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}

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

exports.RiskTreatmentType = exports.$Enums.RiskTreatmentType = {
  accept: 'accept',
  avoid: 'avoid',
  mitigate: 'mitigate',
  transfer: 'transfer'
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
 * This is a stub Prisma Client that will error at runtime if called.
 */
class PrismaClient {
  constructor() {
    return new Proxy(this, {
      get(target, prop) {
        let message
        const runtime = getRuntime()
        if (runtime.isEdge) {
          message = `PrismaClient is not configured to run in ${runtime.prettyName}. In order to run Prisma Client on edge runtime, either:
- Use Prisma Accelerate: https://pris.ly/d/accelerate
- Use Driver Adapters: https://pris.ly/d/driver-adapters
`;
        } else {
          message = 'PrismaClient is unable to run in this browser environment, or has been bundled for the browser (running in `' + runtime.prettyName + '`).'
        }
        
        message += `
If this is unexpected, please open an issue: https://pris.ly/prisma-prisma-bug-report`

        throw new Error(message)
      }
    })
  }
}

exports.PrismaClient = PrismaClient

Object.assign(exports, Prisma)
