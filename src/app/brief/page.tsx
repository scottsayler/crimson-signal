import { Suspense } from "react";
import { getAllBusinessEvents } from "@/lib/content";
import { ConversationFlow } from "@/components/ConversationFlow";

function BriefContent({ eventSlug }: { eventSlug?: string }) {
  const events = getAllBusinessEvents();
  return <ConversationFlow events={events} initialEventSlug={eventSlug} />;
}

export default async function BriefPage({
  searchParams,
}: {
  searchParams: Promise<{ event?: string }>;
}) {
  const params = await searchParams;
  return (
    <div className="mx-auto max-w-2xl px-6 py-16 md:py-24">
      <Suspense fallback={<div className="text-center text-muted">Loading...</div>}>
        <BriefContent eventSlug={params.event} />
      </Suspense>
    </div>
  );
}
