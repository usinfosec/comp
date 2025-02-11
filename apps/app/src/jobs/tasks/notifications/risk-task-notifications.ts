import { db } from "@bubba/db";
import {
  NotificationTypes,
  TriggerEvents,
  trigger,
} from "@bubba/notifications";
import { logger, schedules } from "@trigger.dev/sdk/v3";
import { formatDistance } from "date-fns";

export const sendRiskTaskNotifications = schedules.task({
  id: "send-risk-task-notifications",
  run: async () => {
    const now = new Date();
    const upcomingThreshold = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

    logger.info(
      `Sending risk task notifications from now: ${now} to ${upcomingThreshold}`,
    );

    const tasks = await db.riskMitigationTask.findMany({
      where: {
        dueDate: { gte: now, lte: upcomingThreshold },
        status: { in: ["open", "pending"] },
        notifiedAt: null,
      },
      select: {
        id: true,
        dueDate: true,
        notifiedAt: true,
        riskId: true,
        title: true,
        owner: {
          select: {
            id: true,
            email: true,
            name: true,
            image: true,
            organizationId: true,
          },
        },
      },
    });

    const notifiedTasks = [];

    for (const task of tasks) {
      const owner = task.owner;

      const timeUntilDue = task.dueDate
        ? formatDistance(task.dueDate, new Date(), {
          addSuffix: true,
        })
        : "soon";

      try {
        if (!owner || !owner.email || !owner.organizationId) {
          logger.warn(`Skipping task ${task.id} - owner ${owner?.id} missing email or organizationId`);
          return;
        }

        await db.riskMitigationTask.update({
          where: { id: task.id },
          data: { notifiedAt: new Date() },
        });

        await trigger({
          name: TriggerEvents.TaskReminderInApp,
          user: {
            subscriberId: `${owner.organizationId}_${owner.id}`,
            email: owner.email,
            fullName: owner.name,
            image: owner.image,
            organizationId: owner.organizationId,
          },
          payload: {
            description: `${task.title} is due ${timeUntilDue}`,
            recordId: `/risk/${task.riskId}/tasks/${task.id}`,
            type: NotificationTypes.Task,
          },
        });


        notifiedTasks.push(task.id);
      } catch (error) {
        logger.error(
          `Error processing task ${task.id} for ${owner?.email}: ${error}`,
        );
      }
    }

    if (notifiedTasks.length) {
      logger.info(`Sent notifications for tasks: ${notifiedTasks.join(", ")}`);
    }
  },
});