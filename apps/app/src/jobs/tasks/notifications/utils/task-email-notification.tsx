import TaskReminderEmail from "@bubba/email/emails/reminders/task-reminder";
import { TriggerEvents, trigger } from "@bubba/notifications";
import { render } from "@react-email/render";

interface Props {
  owner: {
    id: string;
    fullName?: string;
    email: string;
    organizationId: string;
  };
  task: {
    recordId: string;
    dueDate: string;
  };
}

export async function sendTaskEmailNotification({ owner, task }: Props) {
  const html = await render(
    <TaskReminderEmail
      name={owner.fullName ?? "there"}
      dueDate={task.dueDate}
      recordId={task.recordId}
    />,
  );

  const triggerData = {
    name: TriggerEvents.TaskReminderEmail,
    payload: {
      subject: "Task Reminder",
      html,
    },
    replyTo: owner.email,
    user: {
      subscriberId: `${owner.organizationId}_${owner.id}`,
      organizationId: owner.organizationId,
      email: owner.email,
      fullName: owner.fullName,
    },
  };

  await trigger(triggerData);
}
