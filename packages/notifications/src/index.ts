import { Novu } from "@novu/node";
import ky from "ky";
import { nanoid } from "nanoid";

const novu = new Novu(process.env.NOVU_API_KEY!);
const novu_api = "https://api.novu.co/v1";

export enum TriggerEvents {
  TaskReminderInApp = "task-reminder-inapp",
}

export enum NotificationTypes {
  Task = "task",
}

type TriggerUser = {
  subscriberId: string;
  email: string;
  fullName: string;
  image: string;
  organizationId: string;
}

type TriggerPayload = {
  name: TriggerEvents;
  payload: any;
  user: TriggerUser;
  replyTo?: string;
  tenant?: string; // organization_id + user_id
}

type GetSubscriberPreferencesParams = {
  organizationId: string;
  subscriberId: string;
}

type UpdateSubscriberPreferencesParams = {
  subscriberId: string;
  organizationId: string;
  templateId: string;
  type: string;
  enabled: boolean;
}

export async function trigger(data: TriggerPayload) {
  try {
    const subscriberId = `${data.user.organizationId}_${data.user.subscriberId}`;

    await novu.trigger(data.name, {
      to: {
        ...data.user,
        subscriberId
      },
      payload: data.payload,
      tenant: data.tenant,
      overrides: {
        email: {
          replyTo: data.replyTo,
          headers: {
            "X-Entity-Ref-ID": nanoid(),
          }
        }
      }
    });
  } catch (error: any) {
    console.error('Novu trigger error:', {
      event: data.name,
      error: error.response?.data || error.message,
      status: error.response?.status
    });

    throw error;
  }
}

export async function getSubscriberPreferences({ organizationId, subscriberId }: GetSubscriberPreferencesParams) {
  try {
    const response = await ky.get(`${novu_api}/subscribers/${organizationId}_${subscriberId}/preferences?includeInactiveChannels=false`, {
      method: "GET",
      headers: {
        Authorization: `ApiKey ${process.env.NOVU_API_KEY!}`,
      },
    })

    return response.json();
  } catch (error) {
    console.log(error);
    return null;
  }
}

export async function updateSubscriberPreferences({ subscriberId, organizationId, templateId, type, enabled }: UpdateSubscriberPreferencesParams) {
  try {
    const response = await ky.patch(`${novu_api}/subscribers/${organizationId}_${subscriberId}/preferences/${templateId}`, {
      method: "PATCH",
      headers: {
        Authorization: `ApiKey ${process.env.NOVU_API_KEY!}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        channel: {
          type,
          enabled,
        },
      }),
    })

    return response.json();
  } catch (error) {
    console.log(error);
    return null;
  }
}