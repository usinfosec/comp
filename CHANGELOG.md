# [1.9.0](https://github.com/trycompai/comp/compare/v1.8.3...v1.9.0) (2025-05-11)


### Features

* **trust:** implement custom domain management and DNS verification for trust portal ([d34206c](https://github.com/trycompai/comp/commit/d34206cc8e0ca633d071d34e0fc95ad1994a2cf0))

## [1.8.3](https://github.com/trycompai/comp/compare/v1.8.2...v1.8.3) (2025-05-10)


### Bug Fixes

* **trust:** update organization ID mapping for security domain in middleware ([2e690b1](https://github.com/trycompai/comp/commit/2e690b1e56da4e82e615b305927a0df9dd8d4e2c))

## [1.8.2](https://github.com/trycompai/comp/compare/v1.8.1...v1.8.2) (2025-05-10)


### Bug Fixes

* **trust:** update domain mapping in middleware to include new ngrok domain ([cb8f296](https://github.com/trycompai/comp/commit/cb8f2960eba1f9800e297734c3f6e33a17d76314))

## [1.8.1](https://github.com/trycompai/comp/compare/v1.8.0...v1.8.1) (2025-05-10)


### Bug Fixes

* **trust:** add new domain mapping to organization ID and refine URL rewriting logic in middleware ([f8b2854](https://github.com/trycompai/comp/commit/f8b28545adcce6bc18fdf3b590d2d31b8f857ce1))

# [1.8.0](https://github.com/trycompai/comp/compare/v1.7.0...v1.8.0) (2025-05-10)


### Bug Fixes

* **trust:** update metadata generation to correctly handle async params and adjust URL format ([52b3d23](https://github.com/trycompai/comp/commit/52b3d2316077abb397bf3c108f4fae620502ceae))


### Features

* **trust:** implement middleware for domain-based organization ID mapping and enhance layout with new font and metadata generation ([6237329](https://github.com/trycompai/comp/commit/62373292c9725eb1bbf05bd81ffc789c30098d41))

# [1.7.0](https://github.com/trycompai/comp/compare/v1.6.0...v1.7.0) (2025-05-10)


### Features

* **trust:** add Trust app configuration and dependencies; refactor Trust Portal settings and remove unused components ([8834b14](https://github.com/trycompai/comp/commit/8834b144046c85670c5beecb6afbd514b7ad4006))
* **turbo:** add data:build configuration to manage DATABASE_URL and build inputs for enhanced build process ([6f4f1c4](https://github.com/trycompai/comp/commit/6f4f1c4e195ceface8c9aac67204c90282cf377e))

# [1.6.0](https://github.com/trycompai/comp/compare/v1.5.0...v1.6.0) (2025-05-10)


### Features

* **turbo:** add trust:build configuration to manage DATABASE_URL and inputs for improved build process ([96435a5](https://github.com/trycompai/comp/commit/96435a53558b7d1dcf8faeaa79514ef1037e70f5))

# [1.5.0](https://github.com/trycompai/comp/compare/v1.4.0...v1.5.0) (2025-05-10)


### Bug Fixes

* **package:** add missing newline at end of file in package.json ([75c0e49](https://github.com/trycompai/comp/commit/75c0e4951c79d9a7a0cfe7c30c075082da1a915d))
* **trust-portal:** optimize getTrustPortal function by caching session retrieval for improved performance ([4a7cbc5](https://github.com/trycompai/comp/commit/4a7cbc52fbbe593fa1d9d68c897242def373b2f3))


### Features

* **trust-portal:** add Trust Portal settings page and components, including loading state and switch functionality; update layout to include Trust Portal link ([3fc5fba](https://github.com/trycompai/comp/commit/3fc5fba9fcf21f55591624858268102698d75b05))
* **trust-portal:** enhance Next.js configuration and add new components for improved error handling and compliance reporting; update package dependencies ([1e899a4](https://github.com/trycompai/comp/commit/1e899a442174ec78015cef5929446ea6ebcc994e))
* **trust-portal:** implement TrustPortalSettings component with dynamic trust portal state retrieval and rendering ([4facc5c](https://github.com/trycompai/comp/commit/4facc5c6c2e30ab4afe0333a76382d3136b9c321))
* **turbo:** add build:trust configuration to manage environment variables and dependencies for improved build process ([c7475e2](https://github.com/trycompai/comp/commit/c7475e26c41f12fab9677e3dda2765feb7881010))
* **turbo:** rename build:trust to trust:build and add it to the build pipeline for better organization ([95569ae](https://github.com/trycompai/comp/commit/95569ae853fddbfc5f776006fe093c4b672e5c24))

# [1.4.0](https://github.com/trycompai/comp/compare/v1.3.0...v1.4.0) (2025-05-10)


### Features

* **controls:** add Edit and Delete Control dialogs for enhanced control management; implement update and delete functionalities in actions ([c05ab4d](https://github.com/trycompai/comp/commit/c05ab4d9faf3654b1c22b479a101f2aac721df22))
* **controls:** implement control template management features including creation, linking, and unlinking of requirements, policies, and tasks; enhance UI components for better user experience ([779e579](https://github.com/trycompai/comp/commit/779e579ddf5dd3ad86c20e97ecde735a6f7cdccb))
* **controls:** implement linking and unlinking of policy and task templates to control templates; enhance ManageLinksDialog for improved user interaction ([05da639](https://github.com/trycompai/comp/commit/05da639ccf1cce77b79837ccea4c73bba523ed6e))
* **loading:** add Loading component with skeleton placeholders for improved user experience; enhance PageLayout to support loading state ([166fa59](https://github.com/trycompai/comp/commit/166fa59d8f8f7ef535d86efeeb340a9aca4243fc))

# [1.3.0](https://github.com/trycompai/comp/compare/v1.2.1...v1.3.0) (2025-05-09)


### Features

* **Providers:** introduce Providers component to wrap RootLayout with NuqsAdapter and Suspense for improved rendering ([aa66614](https://github.com/trycompai/comp/commit/aa666142f951fb062403caba75252a26a58e91bd))

## [1.2.1](https://github.com/trycompai/comp/compare/v1.2.0...v1.2.1) (2025-05-09)


### Bug Fixes

* **layout:** correct NuqsAdapter placement in RootLayout component for proper rendering ([4d315a0](https://github.com/trycompai/comp/commit/4d315a0bb74a4e29cabf304649797c6fb8ac52b5))

# [1.2.0](https://github.com/trycompai/comp/compare/v1.1.1...v1.2.0) (2025-05-09)


### Bug Fixes

* **CreateFrameworkDialog:** adjust form layout by reducing gap size and updating version input placeholder for clarity ([ff56470](https://github.com/trycompai/comp/commit/ff5647076d4a79c5564b69cf50bcc331eaf4bc45))


### Features

* add database migrations and update Prisma schema for framework editor ([3287353](https://github.com/trycompai/comp/commit/32873533a38e29fcec7d4102cb6d233fd70e0c56))
* add RequirementBaseSchema for requirement validation; implement EditRequirementDialog for editing requirements with form handling and server action integration ([2e1e91e](https://github.com/trycompai/comp/commit/2e1e91e7679005c9d3719f18e144fa70f59f5b77))
* enhance framework editor layout with Toolbar and MenuTabs components ([21566bb](https://github.com/trycompai/comp/commit/21566bb8adb44d1498c91a185e0084cdc98dfef4))
* enhance framework-editor layout by restructuring RootLayout for full-height body and adding breadcrumbs to PageLayout for controls and policies pages; implement FrameworksClientPage for improved framework management ([2400d35](https://github.com/trycompai/comp/commit/2400d3588eff54a78c369dcddf50cd1037c6cc42))
* enhance FrameworkRequirementsClientPage with requirement editing functionality; refactor columns to use dynamic column generation and improve DataTable integration for better user experience ([1db3b8f](https://github.com/trycompai/comp/commit/1db3b8f9019892b6bf090fa35dc1acb72da14e82))
* fetch and display frameworks in framework-editor page ([b9db4b9](https://github.com/trycompai/comp/commit/b9db4b90b5374acf1e08865eb6b22fad2b8774e2))
* **FrameworkRequirementsClientPage:** add delete functionality with confirmation dialog for framework deletion ([91a9b27](https://github.com/trycompai/comp/commit/91a9b27eaff58bc7be9ec3b8238983d48867fe7f))
* implement add and delete requirement functionality with corresponding dialogs; enhance FrameworkRequirementsClientPage for better user experience and data management ([0efa400](https://github.com/trycompai/comp/commit/0efa400d7b5687e3d7993110a3c686e70dc29a8f))
* implement DataTable component for enhanced data display and search functionality across controls, frameworks, policies, and tasks pages; update layout with NuqsAdapter and Toaster for improved user experience ([a74dfca](https://github.com/trycompai/comp/commit/a74dfca1aa63409ee07b42e45bedc9a10f0590f4))
* implement delete framework functionality with confirmation dialog and server action integration ([5bdbeb1](https://github.com/trycompai/comp/commit/5bdbeb1554512009595e3b92da43dbe19f58b445))
* implement FrameworkRequirementsClientPage and enhance framework data handling; update FrameworksClientPage to include counts for requirements and controls, and improve DataTable with row click functionality ([4151d8f](https://github.com/trycompai/comp/commit/4151d8f4554be8b028957a0679e8b00aef07401b))
* introduce FrameworkBaseSchema for consistent framework validation; refactor framework actions and dialogs to utilize shared schema for improved maintainability ([066efcc](https://github.com/trycompai/comp/commit/066efcc49899d51cd1d1296a12c6f5419a182fec))
* update framework-editor with new columns for DataTable across controls, frameworks, policies, and tasks pages; enhance data fetching and layout for improved user experience ([034f75e](https://github.com/trycompai/comp/commit/034f75e1ac374fd845d78cd9901769bac1f658f4))

## [1.1.1](https://github.com/trycompai/comp/compare/v1.1.0...v1.1.1) (2025-05-09)


### Bug Fixes

* **organization:** enhance user name handling in createOrganizationAction and update newOrgSequence email content ([1f8a68a](https://github.com/trycompai/comp/commit/1f8a68a3d3223b5b8faec9872a1fe52d40b286bf))

# [1.1.0](https://github.com/trycompai/comp/compare/v1.0.1...v1.1.0) (2025-05-09)


### Bug Fixes

* **package:** add missing newline at end of file in package.json ([99ee59c](https://github.com/trycompai/comp/commit/99ee59cfa00bbc08efc14fa06bc5e9f0c3d3a51a))
* **package:** remove trailing newline in package.json ([41d024d](https://github.com/trycompai/comp/commit/41d024d3707e4b5b3f3a0e6cb097cfc722427329))


### Features

* implement new organization welcome email sequence and remove legacy email component ([5173aa0](https://github.com/trycompai/comp/commit/5173aa044af64173308a0ea53c8d654dae0a9f45))

## [1.0.1](https://github.com/trycompai/comp/compare/v1.0.0...v1.0.1) (2025-05-03)


### Bug Fixes

* **docs:** add missing period at the end of README.md tip for clarity ([245bb5f](https://github.com/trycompai/comp/commit/245bb5f18c3849da319b43bd71b4490c166fac33))
* **docs:** remove newline at end of README.md for consistency ([73b81fd](https://github.com/trycompai/comp/commit/73b81fd052bb6a2e88fd021b3fc0d4134330652c))
