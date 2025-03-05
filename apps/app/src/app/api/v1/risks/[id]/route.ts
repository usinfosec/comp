import { db } from "@bubba/db";
import { NextResponse, type NextRequest } from "next/server";
import { getOrganizationFromApiKey } from "@/lib/api-key";

// Configure this route to use Node.js runtime instead of Edge
export const runtime = "nodejs";

/**
 * GET /api/v1/risks/:id
 *
 * Get a single risk by ID for the organization associated with the API key
 *
 * Headers:
 * - Authorization: Bearer {api_key} or X-API-Key: {api_key}
 *
 * Path Parameters:
 * - id: string - The ID of the risk to fetch
 *
 * Returns:
 * - 200: { success: true, data: Risk }
 * - 401: { success: false, error: "Invalid or missing API key" }
 * - 404: { success: false, error: "Risk not found" }
 * - 500: { success: false, error: "Failed to fetch risk" }
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  // Get the organization ID from the API key
  const { organizationId, errorResponse } =
    await getOrganizationFromApiKey(request);

  // If there's an error response, return it
  if (errorResponse) {
    return errorResponse;
  }

  try {
    const riskId = params.id;

    // Fetch the risk
    const risk = await db.risk.findFirst({
      where: {
        id: riskId,
        organizationId: organizationId!,
      },
      select: {
        id: true,
        title: true,
        description: true,
        category: true,
        department: true,
        status: true,
        probability: true,
        impact: true,
        residual_probability: true,
        residual_impact: true,
        createdAt: true,
        updatedAt: true,
        ownerId: true,
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        treatmentStrategy: {
          select: {
            id: true,
            type: true,
            description: true,
            createdAt: true,
            updatedAt: true,
          },
        },
        mitigationTasks: {
          select: {
            id: true,
            title: true,
            description: true,
            status: true,
            dueDate: true,
            completedAt: true,
            createdAt: true,
            updatedAt: true,
            ownerId: true,
          },
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });

    // If risk not found, return 404
    if (!risk) {
      return NextResponse.json(
        {
          success: false,
          error: "Risk not found",
        },
        { status: 404 }
      );
    }

    // Format dates for JSON response
    const formattedRisk = {
      ...risk,
      createdAt: risk.createdAt.toISOString(),
      updatedAt: risk.updatedAt.toISOString(),
      treatmentStrategy: risk.treatmentStrategy
        ? {
            ...risk.treatmentStrategy,
            createdAt: risk.treatmentStrategy.createdAt.toISOString(),
            updatedAt: risk.treatmentStrategy.updatedAt.toISOString(),
          }
        : null,
      mitigationTasks: risk.mitigationTasks.map((task) => ({
        ...task,
        createdAt: task.createdAt.toISOString(),
        updatedAt: task.updatedAt.toISOString(),
        dueDate: task.dueDate ? task.dueDate.toISOString() : null,
        completedAt: task.completedAt ? task.completedAt.toISOString() : null,
      })),
    };

    return NextResponse.json({
      success: true,
      data: formattedRisk,
    });
  } catch (error) {
    console.error("Error fetching risk:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch risk",
      },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/v1/risks/:id
 *
 * Delete a risk by ID for the organization associated with the API key
 *
 * Headers:
 * - Authorization: Bearer {api_key} or X-API-Key: {api_key}
 *
 * Path Parameters:
 * - id: string - The ID of the risk to delete
 *
 * Returns:
 * - 200: { success: true, data: { message: string } }
 * - 401: { success: false, error: string }
 * - 404: { success: false, error: string }
 * - 500: { success: false, error: string }
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  // Get the organization ID from the API key
  const { organizationId, errorResponse } =
    await getOrganizationFromApiKey(request);

  // If there's an error response, return it
  if (errorResponse) {
    return errorResponse;
  }

  try {
    const riskId = params.id;

    // Check if the risk exists and belongs to the organization
    const existingRisk = await db.risk.findFirst({
      where: {
        id: riskId,
        organizationId: organizationId!,
      },
    });

    if (!existingRisk) {
      return NextResponse.json(
        {
          success: false,
          error: "Risk not found",
        },
        { status: 404 }
      );
    }

    // Delete the risk
    await db.risk.delete({
      where: {
        id: riskId,
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        message: "Risk deleted successfully",
      },
    });
  } catch (error) {
    console.error("Error deleting risk:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to delete risk",
      },
      { status: 500 }
    );
  }
}
