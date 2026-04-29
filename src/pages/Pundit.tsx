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

type Resolution = "correct" | "incorrect" | "void";

type PunditData = {
  pundit: {
    id: string;
    slug: string;
    name: string;
    description: string | null;
    image: string | null;
    url: string | null;
    stats: {
      takes: number;
      correct: number;
      incorrect: number;
      pending: number;
    };
  };
  takes: Array<{
    id: string;
    slug: string;
    headline: string;
    kind: "objective" | "subjective";
    statedAt: string;
    resolutionOutcome: Resolution | null;
  }>;
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

export default function Pundit() {
  const { slug } = useParams<{ slug: string }>();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [data, setData] = useState<PunditData | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!slug) return;
    fetch(`/api/pundits/${slug}`)
      .then((r) => {
        if (r.status === 404) {
          setNotFound(true);
          return null;
        }
        return r.json<PunditData>();
      })
      .then((d) => { if (d) setData(d); })
      .finally(() => setLoading(false));
  }, [slug]);

  if (!loading && notFound) {
    return (
      <div className="min-h-dvh bg-zinc-50 font-geist antialiased flex items-center justify-center">
        <p className="text-zinc-500">Pundit not found.</p>
      </div>
    );
  }

  const pundit = data?.pundit;
  const takes = data?.takes ?? [];
  const { correct = 0, incorrect = 0 } = pundit?.stats ?? {};
  const resolved = correct + incorrect;
  const accuracyPct = resolved > 0 ? Math.round((correct / resolved) * 100) : null;

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

        {loading ? (
          <div className="mt-8 text-sm text-zinc-400">Loading…</div>
        ) : pundit ? (
          <>
            <div className="mt-6 flex items-start gap-5">
              <Avatar
                src={pundit.image}
                name={pundit.name}
                className="size-16 shrink-0 sm:size-20"
              />
              <div>
                <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 text-balance sm:text-3xl">
                  {pundit.name}
                </h1>
                {pundit.description && (
                  <p className="mt-3 max-w-[52ch] text-sm text-zinc-600 text-pretty">
                    {pundit.description}
                  </p>
                )}
              </div>
            </div>

            <dl className="mt-8 grid grid-cols-3 rounded-xl border border-zinc-200 divide-x divide-zinc-200 bg-white">
              <div className="px-6 py-5">
                <dt className="text-sm text-zinc-500">Takes tracked</dt>
                <dd className="mt-1 text-3xl font-semibold tabular-nums text-zinc-900">
                  {pundit.stats.takes}
                </dd>
              </div>
              <div className="px-6 py-5">
                <dt className="text-sm text-zinc-500">Verified correct</dt>
                <dd className="mt-1 text-3xl font-semibold tabular-nums text-sky-500">
                  {pundit.stats.correct}
                </dd>
              </div>
              <div className="px-6 py-5">
                <dt className="text-sm text-zinc-500">Accuracy</dt>
                <dd className="mt-1 text-3xl font-semibold tabular-nums text-zinc-900">
                  {accuracyPct !== null ? `${accuracyPct}%` : "—"}
                </dd>
              </div>
            </dl>

            {accuracyPct !== null && (
              <div className="mt-3 flex items-center gap-2">
                <div className="h-2 flex-1 rounded-full bg-zinc-100 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-sky-500 transition-all"
                    style={{ width: `${accuracyPct}%` }}
                  />
                </div>
                <span className="text-sm tabular-nums text-zinc-500">
                  {correct} of {resolved} resolved takes
                </span>
              </div>
            )}

            <div className="mt-10">
              <h2 className="text-base font-semibold tracking-tight text-zinc-900">
                Takes
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
                      {takes.map((take) => (
                        <tr key={take.id}>
                          <td className="py-4 pr-6">
                            <Link
                              to={`/takes/${take.slug}`}
                              className="text-sm font-medium text-zinc-900 hover:text-sky-600 text-pretty whitespace-normal max-w-xs inline-block transition-colors"
                            >
                              {take.headline}
                            </Link>
                          </td>
                          <td className="py-4 pr-6 text-sm text-zinc-500 capitalize">
                            {take.kind}
                          </td>
                          <td className="py-4 pr-6 text-sm tabular-nums text-zinc-500">
                            {formatDate(take.statedAt)}
                          </td>
                          <td className="py-4">
                            <VerdictBadge resolution={take.resolutionOutcome} />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </>
        ) : null}
      </main>
    </div>
  );
}
