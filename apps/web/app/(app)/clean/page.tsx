import { Card } from "@/components/ui/card";
import { CleanStep } from "./types";
import { IntroStep } from "@/app/(app)/clean/IntroStep";
import { ActionSelectionStep } from "@/app/(app)/clean/ActionSelectionStep";
import { CleanInstructionsStep } from "@/app/(app)/clean/CleanInstructionsStep";
import { TimeRangeStep } from "@/app/(app)/clean/TimeRangeStep";
import { ConfirmationStep } from "@/app/(app)/clean/ConfirmationStep";
import { getGmailClient } from "@/utils/gmail/client";
import { auth } from "@/app/api/auth/[...nextauth]/auth";
import { getInboxCount, getUnreadCount } from "@/utils/assess";

export default async function CleanPage({
  searchParams,
}: {
  searchParams: { step: string };
}) {
  const step = searchParams.step
    ? Number.parseInt(searchParams.step)
    : CleanStep.INTRO;

  const session = await auth();
  if (!session?.user.email) return <div>Not authenticated</div>;

  const gmail = getGmailClient(session);
  const inboxCount = await getInboxCount(gmail);
  const unreadCount = await getUnreadCount(gmail);
  const unhandledCount = Math.min(unreadCount, inboxCount);

  const renderStepContent = () => {
    switch (step) {
      case CleanStep.ARCHIVE_OR_READ:
        return <ActionSelectionStep />;

      case CleanStep.TIME_RANGE:
        return <TimeRangeStep />;

      case CleanStep.LABEL_OPTIONS:
        return <CleanInstructionsStep />;

      case CleanStep.FINAL_CONFIRMATION:
        return <ConfirmationStep unhandledCount={unhandledCount} />;

      // first / default step
      default:
        return (
          <IntroStep unhandledCount={unhandledCount} cleanAction={"ARCHIVE"} />
        );
    }
  };

  return (
    <div>
      <Card className="my-4 max-w-2xl p-6 sm:mx-4 md:mx-auto">
        {renderStepContent()}
      </Card>
    </div>
  );
}
