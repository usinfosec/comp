import { db, Departments } from "@bubba/db";
import { NextResponse, type NextRequest } from "next/server";
import { getOrganizationFromApiKey } from "@/lib/api-key";
import { z } from "zod";

// Define the schema for employee update
const employeeUpdateSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }).optional(),
  email: z.string().email({ message: "Valid email is required" }).optional(),
  department: z.nativeEnum(Departments).optional(),
  isActive: z.boolean().optional(),
  externalEmployeeId: z.string().optional().nullable(),
  userId: z.string().optional().nullable(),
  linkId: z.string().optional().nullable(),
});

// Type for the validated update data
type EmployeeUpdateInput = z.infer<typeof employeeUpdateSchema>;

/**
 * GET /api/v1/employees/:id
 *
 * Get a single employee by ID for the organization associated with the API key
 *
 * Headers:
 * - Authorization: Bearer {api_key} or X-API-Key: {api_key}
 *
 * Path Parameters:
 * - id: string - The ID of the employee to fetch
 *
 * Returns:
 * - 200: { success: true, data: Employee }
 * - 401: { error: "Invalid or missing API key" }
 * - 404: { error: "Employee not found" }
 * - 500: { error: "Failed to fetch employee" }
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
    const employeeId = params.id;

    // Fetch the employee
    const employee = await db.employee.findFirst({
      where: {
        id: employeeId,
        organizationId: organizationId!,
      },
      select: {
        id: true,
        name: true,
        email: true,
        department: true,
        isActive: true,
        externalEmployeeId: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    // If employee not found, return 404
    if (!employee) {
      return NextResponse.json(
        { error: "Employee not found" },
        { status: 404 }
      );
    }

    // Format dates for JSON response
    const formattedEmployee = {
      ...employee,
      createdAt: employee.createdAt.toISOString(),
      updatedAt: employee.updatedAt.toISOString(),
    };

    return NextResponse.json({ success: true, data: formattedEmployee });
  } catch (error) {
    console.error("Error fetching employee:", error);
    return NextResponse.json(
      { error: "Failed to fetch employee" },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/v1/employees/:id
 *
 * Update an employee by ID for the organization associated with the API key
 *
 * Headers:
 * - Authorization: Bearer {api_key} or X-API-Key: {api_key}
 *
 * Path Parameters:
 * - id: string - The ID of the employee to update
 *
 * Body:
 * - name: string - The name of the employee (optional)
 * - email: string - The email of the employee (optional)
 * - department: Departments - The department of the employee (optional)
 * - isActive: boolean - Whether the employee is active (optional)
 * - externalEmployeeId: string - External employee ID (optional)
 * - userId: string - User ID (optional)
 * - linkId: string - Link ID (optional)
 *
 * Returns:
 * - 200: { success: true, data: Employee }
 * - 400: { error: "Validation failed", details: {...} }
 * - 401: { error: "Invalid or missing API key" }
 * - 404: { error: "Employee not found" }
 * - 500: { error: "Failed to update employee" }
 */
export async function PUT(
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
    const employeeId = params.id;
    const body = await request.json();

    // Validate the request body against the schema
    const validationResult = employeeUpdateSchema.safeParse(body);

    if (!validationResult.success) {
      // Return validation errors
      return NextResponse.json(
        {
          error: "Validation failed",
          details: validationResult.error.format(),
        },
        { status: 400 }
      );
    }

    // Extract validated data
    const validatedData: EmployeeUpdateInput = validationResult.data;

    // Check if the employee exists and belongs to the organization
    const existingEmployee = await db.employee.findFirst({
      where: {
        id: employeeId,
        organizationId: organizationId!,
      },
    });

    if (!existingEmployee) {
      return NextResponse.json(
        { error: "Employee not found" },
        { status: 404 }
      );
    }

    // Update the employee
    const updatedEmployee = await db.employee.update({
      where: {
        id: employeeId,
      },
      data: validatedData,
      select: {
        id: true,
        name: true,
        email: true,
        department: true,
        isActive: true,
        externalEmployeeId: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    // Format dates for JSON response
    const formattedEmployee = {
      ...updatedEmployee,
      createdAt: updatedEmployee.createdAt.toISOString(),
      updatedAt: updatedEmployee.updatedAt.toISOString(),
    };

    return NextResponse.json({ success: true, data: formattedEmployee });
  } catch (error) {
    console.error("Error updating employee:", error);
    return NextResponse.json(
      { error: "Failed to update employee" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/v1/employees/:id
 *
 * Delete an employee by ID for the organization associated with the API key
 *
 * Headers:
 * - Authorization: Bearer {api_key} or X-API-Key: {api_key}
 *
 * Path Parameters:
 * - id: string - The ID of the employee to delete
 *
 * Returns:
 * - 200: { success: true, message: "Employee deleted successfully" }
 * - 401: { error: "Invalid or missing API key" }
 * - 404: { error: "Employee not found" }
 * - 500: { error: "Failed to delete employee" }
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
    const employeeId = params.id;

    // Check if the employee exists and belongs to the organization
    const existingEmployee = await db.employee.findFirst({
      where: {
        id: employeeId,
        organizationId: organizationId!,
      },
    });

    if (!existingEmployee) {
      return NextResponse.json(
        { error: "Employee not found" },
        { status: 404 }
      );
    }

    // Delete the employee
    await db.employee.delete({
      where: {
        id: employeeId,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Employee deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting employee:", error);
    return NextResponse.json(
      { error: "Failed to delete employee" },
      { status: 500 }
    );
  }
}
