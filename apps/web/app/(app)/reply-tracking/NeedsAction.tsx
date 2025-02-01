import { redirect } from "next/navigation";
import { auth } from "@/app/api/auth/[...nextauth]/auth";
import prisma from "@/utils/prisma";
import { ThreadTrackerType } from "@prisma/client";

export async function NeedsAction() {
  const session = await auth();
  if (!session?.user.id) redirect("/login");

  const trackers = await prisma.threadTracker.findMany({
    where: {
      userId: session.user.id,
      resolved: false,
      type: ThreadTrackerType.NEEDS_ACTION,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return <div>NeedsAction</div>;
}
