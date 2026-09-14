import { createFileRoute, Link } from "@tanstack/react-router";
import { tradeBySlug } from "@/lib/kit-offer";
import { SampleSite } from "@/components/kit/sample-site";

export const Route = createFileRoute("/work/$slug")({
  component: WorkSample,
});

function WorkSample() {
  const { slug } = Route.useParams();
  const trade = tradeBySlug(slug);

  if (!trade) {
    return (
      <main className="grid min-h-screen place-items-center bg-ink px-6 text-paper">
        <div className="text-center">
          <p className="font-display text-4xl italic">No sample here.</p>
          <Link to="/" className="btn-primary mt-6">
            Back to Kit
          </Link>
        </div>
      </main>
    );
  }

  return <SampleSite trade={trade} />;
}
