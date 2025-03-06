import { db } from "@bubba/db";
import { logger, schemaTask } from "@trigger.dev/sdk/v3";
import axios from "axios";
import { z } from "zod";
import { Departments } from "@bubba/db";

// Define the input schema for the Deel task
const deelTaskSchema = z.object({
  integration: z.object({
    id: z.string(),
    name: z.string(),
    integration_id: z.string(),
    settings: z.record(z.any()),
    user_settings: z.record(z.any()),
    organization: z.object({
      id: z.string(),
      name: z.string(),
    }),
  }),
});

// Define the schema for Deel employee data
interface DeelEmployee {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  department?: string;
  title?: string;
  status: string;
}

/**
 * Fetches employees from Deel API
 */
async function fetchDeelEmployees(
  accessToken: string
): Promise<DeelEmployee[]> {
  try {
    // const response = await axios.get("https://api.deel.com/v1/employees", {
    //   headers: {
    //     Authorization: `Bearer ${accessToken}`,
    //     "Content-Type": "application/json",
    //   },
    // });

    // Return some fake data
    return [
      {
        id: "1",
        firstName: "John",
        lastName: "Doe",
        email: "john.doe@example.com",
        department: "Engineering",
        title: "Software Engineer",
        status: "active",
      },
    ];

    // Return the employees from the response
  } catch (error) {
    logger.error(`Failed to fetch employees from Deel: ${error}`);
    throw error;
  }
}

/**
 * Maps Deel department to our system's department enum
 */
function mapDeelDepartment(deelDepartment?: string): Departments {
  if (!deelDepartment) return Departments.none;

  // Map Deel departments to our system's department enum
  const departmentMap: Record<string, Departments> = {
    Engineering: Departments.it,
    Product: Departments.it,
    Marketing: Departments.admin,
    Sales: Departments.admin,
    HR: Departments.hr,
    Finance: Departments.admin,
    Legal: Departments.gov,
    Operations: Departments.admin,
    // Add more mappings as needed
  };

  return departmentMap[deelDepartment] || Departments.none;
}

/**
 * Task to sync employees from Deel to our system
 */
export const syncDeelEmployees = schemaTask({
  id: "sync-deel-employees",
  schema: deelTaskSchema,
  run: async ({ integration }) => {
    logger.info(`Running Deel employee sync for ${integration.name}`);

    try {
      // Check if the integration is for Deel
      if (integration.integration_id !== "Deel") {
        logger.warn(
          `Integration ${integration.name} is not a Deel integration`
        );
        return { success: false, error: "Not a Deel integration" };
      }

      // Check if we've run this integration within the last 24 hours
      const lastRun = await db.integrationLastRun.findUnique({
        where: {
          integrationId_organizationId: {
            integrationId: integration.id,
            organizationId: integration.organization.id,
          },
        },
      });

      const now = new Date();
      if (
        lastRun &&
        lastRun.lastRunAt > new Date(now.getTime() - 24 * 60 * 60 * 1000)
      ) {
        logger.info("Skipping Deel sync as it was run less than 24 hours ago");
        return {
          success: true,
          message: "Skipped - run less than 24 hours ago",
        };
      }

      // Extract access token from user settings
      const accessToken = integration.user_settings.accessToken;
      if (!accessToken) {
        logger.error(
          `Deel integration ${integration.name} is missing an access token`
        );
        return { success: false, error: "Missing access token" };
      }

      // Fetch employees from Deel
      const deelEmployees = await fetchDeelEmployees(accessToken);
      logger.info(`Fetched ${deelEmployees.length} employees from Deel`);

      // Process each employee
      const processedEmployees = [];
      for (const deelEmployee of deelEmployees) {
        // Skip inactive employees
        if (deelEmployee.status !== "active") {
          continue;
        }

        const name =
          `${deelEmployee.firstName} ${deelEmployee.lastName}`.trim();
        const department = mapDeelDepartment(deelEmployee.department);

        // Check if employee already exists
        const existingEmployee = await db.employee.findUnique({
          where: {
            email_organizationId: {
              email: deelEmployee.email,
              organizationId: integration.organization.id,
            },
          },
        });

        if (existingEmployee) {
          // Update existing employee
          await db.employee.update({
            where: {
              id: existingEmployee.id,
            },
            data: {
              name,
              department,
              externalEmployeeId: deelEmployee.id,
              // Keep isActive true as we're filtering inactive employees already
            },
          });
          processedEmployees.push({
            id: existingEmployee.id,
            action: "updated",
          });
        } else {
          // Create new employee
          const newEmployee = await db.employee.create({
            data: {
              name,
              email: deelEmployee.email,
              department,
              isActive: true,
              externalEmployeeId: deelEmployee.id,
              organizationId: integration.organization.id,
            },
          });
          processedEmployees.push({ id: newEmployee.id, action: "created" });
        }
      }

      // Update or create the last run record
      await db.integrationLastRun.upsert({
        where: {
          integrationId_organizationId: {
            integrationId: integration.id,
            organizationId: integration.organization.id,
          },
        },
        create: {
          integrationId: integration.id,
          organizationId: integration.organization.id,
          lastRunAt: now,
        },
        update: {
          lastRunAt: now,
        },
      });

      logger.info(`Deel employee sync completed for ${integration.name}`);
      return {
        success: true,
        processedCount: processedEmployees.length,
        totalFetched: deelEmployees.length,
      };
    } catch (error) {
      logger.error(`Error running Deel employee sync: ${error}`);
      return {
        success: false,
        error: error instanceof Error ? error.message : String(error),
      };
    }
  },
});
