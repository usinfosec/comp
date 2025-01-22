"use server";

import { auth } from "@/auth";
import { db } from "@bubba/db";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { authActionClient } from "../safe-action";
import { updateVendorSchema } from "../schema";

export const updateVendorAction = authActionClient
  .schema(updateVendorSchema)
  .metadata({
    name: "update-vendor",
    track: {
      event: "update-vendor",
      channel: "server",
    },
  })
  .action(async ({ parsedInput, ctx }) => {
    const {
      id,
      name,
      website,
      description,
      category,
      status,
      ownerId,
      contacts,
    } = parsedInput;
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

      // First delete existing contacts
      await db.vendorContact.deleteMany({
        where: {
          vendorId: id,
          organizationId,
        },
      });

      // Update vendor and create new contacts
      await db.vendors.update({
        where: {
          id,
          organizationId,
        },
        data: {
          name,
          website,
          description,
          category,
          status,
          ownerId,
          VendorContact: {
            create: contacts.map((contact) => ({
              ...contact,
              organizationId,
            })),
          },
        },
      });

      revalidatePath(`/vendors/${id}`);
      revalidatePath("/vendors");

      return {
        success: true,
        data: null,
      };
    } catch (error) {
      return {
        success: false,
        error: "Failed to update vendor",
      };
    }
  });
