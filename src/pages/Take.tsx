import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";

const resolutionLabel = {
  correct: "Correct",
  incorrect: "Incorrect",
  void: "Void",
} as const;

const resolutionClass = {
  correct: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
  incorrect: "bg-red-50 text-red-700 ring-red-600/20",
  void: "bg-gray-100 text-gray-600 ring-gray-500/20",
} as const;

const verdictDescription = {
  correct: "This take was verified as accurate.",
  incorrect: "This take did not hold up to scrutiny.",
  void: "This take was voided — the conditions needed to evaluate it never materialized.",
} as const;

type Resolution = "correct" | "incorrect" | "void";

type RelatedTake = {
  id: string;
  slug: string;
  headline: string;
  kind: "objective" | "subjective";
  statedAt: string;
  resolutionOutcome: Resolution | null;
};

type TakeData = {
  take: {
    id: string;
    slug: string;
    headline: string;
    kind: "objective" | "subjective";
    statedAt: string;
    source: string | null;
    pundit: {
      slug: string;
      name: string;
      image: string | null;
    };
    resolution: {
      outcome: Resolution;
      resolvedAt: string;
      notes: string | null;
    } | null;
    stats: {
      agree: number;
      disagree: number;
      boosts: number;
    };
  };
  moreTakes: RelatedTake[];
};

function Avatar({
  src,
  name,
  className,
}: {
  src: string | null;
  name: string;
  className: string;
}) {
  if (src) {
    return (
      <img
        src={src}
        alt=""
        className={`${className} rounded-full object-cover outline-1 -outline-offset-1 outline-black/5`}
      />
    );
  }
  return (
    <span
      className={`${className} rounded-full bg-zinc-200 flex items-center justify-center text-xs font-medium text-zinc-600 outline-1 -outline-offset-1 outline-black/5`}
    >
      {name[0]}
    </span>
  );
}

function VerdictBadge({ resolution }: { resolution: Resolution | null }) {
  if (!resolution)
    return <span className="text-sm text-gray-400">Pending</span>;
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset ${resolutionClass[resolution]}`}
    >
      {resolutionLabel[resolution]}
    </span>
  );
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatNumber(n: number) {
  return n.toLocaleString("en-US");
}

export default function Take() {
  const { slug } = useParams<{ slug: string }>();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [data, setData] = useState<TakeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!slug) return;
    fetch(`/api/takes/${slug}`)
      .then((r) => {
        if (r.status === 404) {
          setNotFound(true);
          return null;
        }
        return r.json<TakeData>();
      })
      .then((d) => { if (d) setData(d); })
      .finally(() => setLoading(false));
  }, [slug]);

  if (!loading && notFound) {
    return (
      <div className="min-h-dvh bg-zinc-50 font-geist antialiased flex items-center justify-center">
        <p className="text-zinc-500">Take not found.</p>
      </div>
    );
  }

  const take = data?.take;
  const moreTakes = data?.moreTakes ?? [];
  const total = (take?.stats.agree ?? 0) + (take?.stats.disagree ?? 0);
  const agreePct = total > 0 ? Math.round(((take?.stats.agree ?? 0) / total) * 100) : 0;

  return (
    <div className="min-h-dvh bg-zinc-50 font-geist antialiased isolate">
      <header className="bg-zinc-950 border-b border-white/5">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-14 items-center justify-between">
            <Link
              to="/"
              aria-label="Homepage"
              className="font-marker text-3xl text-sky-400"
            >
              Takeoff
            </Link>
            <nav className="hidden sm:flex items-center gap-6">
              <Link
                to="/"
                className="text-sm text-zinc-400 hover:text-sky-400 transition-colors"
              >
                Takes
              </Link>
              <Link
                to="/"
                className="text-sm text-zinc-400 hover:text-sky-400 transition-colors"
              >
                Pundits
              </Link>
            </nav>
            <button
              className="sm:hidden -mr-2 p-2 text-zinc-400"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              <svg
                className="size-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                />
              </svg>
            </button>
          </div>
        </div>
        {mobileOpen && (
          <div className="sm:hidden bg-zinc-950 border-t border-white/5 px-4 py-3 flex flex-col gap-3">
            <Link to="/" className="text-sm text-zinc-300">
              Takes
            </Link>
            <Link to="/" className="text-sm text-zinc-300">
              Pundits
            </Link>
          </div>
        )}
      </header>

      <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
        {take ? (
          <Link
            to={`/pundits/${take.pundit.slug}`}
            className="inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-sky-500 transition-colors"
          >
            <svg
              className="size-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 19.5L8.25 12l7.5-7.5"
              />
            </svg>
            {take.pundit.name}
          </Link>
        ) : (
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-sky-500 transition-colors"
          >
            <svg
              className="size-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 19.5L8.25 12l7.5-7.5"
              />
            </svg>
            All takes
          </Link>
        )}

        {loading ? (
          <div className="mt-8 text-sm text-zinc-400">Loading…</div>
        ) : take ? (
          <>
            <div className="mt-6">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset bg-zinc-100 text-zinc-600 ring-zinc-500/20 capitalize">
                  {take.kind}
                </span>
                <span className="text-sm text-zinc-400">
                  {formatDate(take.statedAt)}
                </span>
                {take.source && (
                  <>
                    <span className="text-zinc-300" aria-hidden="true">
                      ·
                    </span>
                    <span className="text-sm text-zinc-400">{take.source}</span>
                  </>
                )}
              </div>
              <h1 className="mt-3 text-2xl font-semibold tracking-tight text-zinc-900 text-balance max-w-[30ch] sm:text-3xl">
                {take.headline}
              </h1>

              <div className="mt-4 flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-3 py-1.5 w-fit">
                <Avatar
                  src={take.pundit.image}
                  name={take.pundit.name}
                  className="size-5 shrink-0"
                />
                <span className="text-sm text-zinc-700">{take.pundit.name}</span>
              </div>
            </div>

            <dl className="mt-8 grid grid-cols-3 rounded-xl border border-zinc-200 divide-x divide-zinc-200 bg-white">
              <div className="px-6 py-5">
                <dt className="text-sm text-zinc-500">Agreed</dt>
                <dd className="mt-1 text-3xl font-semibold tabular-nums text-zinc-900">
                  {formatNumber(take.stats.agree)}
                </dd>
              </div>
              <div className="px-6 py-5">
                <dt className="text-sm text-zinc-500">Disagreed</dt>
                <dd className="mt-1 text-3xl font-semibold tabular-nums text-zinc-900">
                  {formatNumber(take.stats.disagree)}
                </dd>
              </div>
              <div className="px-6 py-5">
                <dt className="text-sm text-zinc-500">Boosted</dt>
                <dd className="mt-1 text-3xl font-semibold tabular-nums text-sky-500">
                  {formatNumber(take.stats.boosts)}
                </dd>
              </div>
            </dl>

            {total > 0 && (
              <div className="mt-3 flex items-center gap-2">
                <div className="h-2 flex-1 rounded-full bg-zinc-100 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-sky-500 transition-all"
                    style={{ width: `${agreePct}%` }}
                  />
                </div>
                <span className="text-sm tabular-nums text-zinc-500">
                  {agreePct}% agreed
                </span>
              </div>
            )}

            {take.resolution && (
              <div className="mt-8 rounded-xl border border-zinc-200 bg-white px-6 py-5">
                <div className="flex items-start gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <VerdictBadge resolution={take.resolution.outcome} />
                      <span className="text-sm text-zinc-400">
                        {formatDate(take.resolution.resolvedAt)}
                      </span>
                    </div>
                    <p className="mt-2 text-sm text-zinc-500 text-pretty">
                      {verdictDescription[take.resolution.outcome]}
                    </p>
                    {take.resolution.notes && (
                      <p className="mt-2 text-sm text-zinc-700 text-pretty">
                        {take.resolution.notes}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {moreTakes.length > 0 && (
              <div className="mt-10">
                <h2 className="text-base font-semibold tracking-tight text-zinc-900">
                  More from {take.pundit.name}
                </h2>
                <div className="-mx-4 -my-2 mt-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                  <div className="inline-block min-w-full px-4 py-2 align-middle sm:px-6 lg:px-8">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-zinc-200">
                          <th
                            scope="col"
                            className="whitespace-nowrap py-3 pr-6 text-left text-sm font-medium text-zinc-500"
                          >
                            Take
                          </th>
                          <th
                            scope="col"
                            className="whitespace-nowrap py-3 pr-6 text-left text-sm font-medium text-zinc-500"
                          >
                            Kind
                          </th>
                          <th
                            scope="col"
                            className="whitespace-nowrap py-3 pr-6 text-left text-sm font-medium text-zinc-500"
                          >
                            Date
                          </th>
                          <th
                            scope="col"
                            className="whitespace-nowrap py-3 text-left text-sm font-medium text-zinc-500"
                          >
                            Verdict
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-100">
                        {moreTakes.map((t) => (
                          <tr key={t.id}>
                            <td className="py-4 pr-6">
                              <Link
                                to={`/takes/${t.slug}`}
                                className="text-sm font-medium text-zinc-900 hover:text-sky-600 text-pretty whitespace-normal max-w-xs inline-block transition-colors"
                              >
                                {t.headline}
                              </Link>
                            </td>
                            <td className="py-4 pr-6 text-sm text-zinc-500 capitalize">
                              {t.kind}
                            </td>
                            <td className="py-4 pr-6 text-sm tabular-nums text-zinc-500">
                              {formatDate(t.statedAt)}
                            </td>
                            <td className="py-4">
                              <VerdictBadge resolution={t.resolutionOutcome} />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </>
        ) : null}
      </main>
    </div>
  );
}
