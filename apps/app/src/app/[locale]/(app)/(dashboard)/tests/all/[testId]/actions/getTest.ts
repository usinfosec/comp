"use server";

import { db } from "@bubba/db";
import { auth } from "@/auth";
import { 
  appErrors, 
  type ActionResponse 
} from "./types";

import type { Test } from "../../types";
import { OrganizationIntegration } from "@/components/integrations/integrations";

export async function getTest(input: { testId: string }): Promise<ActionResponse<Test>> {
  const { testId } = input;

  const session = await auth();
  const organizationId = session?.user.organizationId;

  if (!organizationId) {
    throw new Error("Organization ID not found");
  }

  try {

    const results = await db.organizationIntegrationResults.findUnique({
      where: {
        id: testId,
        organizationId: organizationId,
      },
      include: {
        organizationIntegration: true,
        IntegrationResultsComments: true,
      },
    });

    if (!results) {
      return {
        success: false,
        error: appErrors.NOT_FOUND,
      };
    }

    const integrationResult = results;

    // Format the result to match the expected CloudTestResult structure
    const result: Test = {
      id: integrationResult.id,
      title: integrationResult.title || "",
      description: typeof integrationResult.resultDetails === 'object' && integrationResult.resultDetails 
        ? (integrationResult.resultDetails as any).description || "" 
        : "",
      provider: integrationResult.organizationIntegration.name,
      status: integrationResult.status,
      resultDetails: integrationResult.resultDetails,
      label: integrationResult.label,
      assignedUserId: integrationResult.assignedUserId || "",
      organizationId: organizationId,
      completedAt: integrationResult.completedAt || new Date(),
      organizationIntegrationId: integrationResult.organizationIntegrationId,
      TestComments: integrationResult.IntegrationResultsComments,
    };

    return {
      success: true,
      data: result,
    };
  } catch (error) {
    console.error("Error fetching integration result details:", error);
    return {
      success: false,
      error: appErrors.UNEXPECTED_ERROR,
    };
  }
} 