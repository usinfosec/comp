"use server";

import { auth } from "@/auth";
import { db } from "@bubba/db";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { authActionClient } from "../safe-action";
import { createVendorSchema } from "../schema";

export const createVendorAction = authActionClient
  .schema(createVendorSchema)
  .metadata({
    name: "create-vendor",
    track: {
      event: "create-vendor",
      channel: "server",
    },
  })
  .action(async ({ parsedInput, ctx }) => {
    const { name, website, description, category, ownerId, contacts } =
      parsedInput;
    const { user } = ctx;

    try {
      const session = await auth();
      const organizationId = session?.user.organizationId;

      if (!organizationId) {
        return {
          success: false,
          error: "Not authorized",
        };
      }

      await db.vendors.create({
        data: {
          name,
          website,
          description,
          category,
          ownerId,
          organizationId,
          VendorContact: {
            create: contacts.map((contact) => ({
              ...contact,
              organizationId,
            })),
          },
        },
      });

      revalidatePath("/vendors/register");

      return {
        success: true,
        data: null,
      };
    } catch (error) {
      return {
        success: false,
        error: "Failed to create vendor",
      };
    }
  });
