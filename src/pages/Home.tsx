import { useState } from "react";

const takes = [
  {
    id: 1,
    pundit: "Colin Cowherd",
    avatarId: 3,
    headline: "The Lakers will not make the playoffs this season.",
    kind: "objective" as const,
    date: "Oct 12, 2024",
    resolution: "correct" as const,
  },
  {
    id: 2,
    pundit: "Skip Bayless",
    avatarId: 5,
    headline: "Dak Prescott will never win a Super Bowl.",
    kind: "subjective" as const,
    date: "Sep 5, 2024",
    resolution: null,
  },
  {
    id: 3,
    pundit: "Stephen A. Smith",
    avatarId: 7,
    headline: "The Knicks are a legitimate title contender this year.",
    kind: "objective" as const,
    date: "Nov 1, 2024",
    resolution: "incorrect" as const,
  },
  {
    id: 4,
    pundit: "Shannon Sharpe",
    avatarId: 2,
    headline: "Patrick Mahomes will win his fourth MVP before turning 30.",
    kind: "objective" as const,
    date: "Aug 20, 2024",
    resolution: null,
  },
  {
    id: 5,
    pundit: "Mina Kimes",
    avatarId: 9,
    headline: "CJ Stroud is a top-five quarterback in the league right now.",
    kind: "subjective" as const,
    date: "Oct 28, 2024",
    resolution: null,
  },
];

const stats = [
  { label: "Takes tracked", value: "5" },
  { label: "Verified correct", value: "1" },
  { label: "Pending verdict", value: "3" },
];

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

function Avatar({ id, className }: { id: number; className: string }) {
  return (
    <img
      src={`https://assets.ui.sh/avatars/${id}.webp`}
      alt=""
      className={`${className} rounded-full object-cover outline-1 -outline-offset-1 outline-black/5`}
    />
  );
}

function VerdictBadge({
  resolution,
}: {
  resolution: "correct" | "incorrect" | "void" | null;
}) {
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

export default function Home() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-dvh bg-zinc-50 font-geist antialiased isolate">
      <header className="bg-zinc-950 border-b border-white/5">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-14 items-center justify-between">
            <a
              href="/"
              aria-label="Homepage"
              className="font-marker text-3xl text-sky-400"
            >
              Takeoff
            </a>
            <nav className="hidden sm:flex items-center gap-6">
              <a
                href="/"
                className="text-sm text-zinc-400 hover:text-sky-400 transition-colors"
              >
                Takes
              </a>
              <a
                href="/"
                className="text-sm text-zinc-400 hover:text-sky-400 transition-colors"
              >
                Pundits
              </a>
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
            <a href="/" className="text-sm text-zinc-300">
              Takes
            </a>
            <a href="/" className="text-sm text-zinc-300">
              Pundits
            </a>
          </div>
        )}
      </header>

      <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 text-balance">
          Takeoff
        </h1>
        <p className="mt-2 max-w-[56ch] text-base text-zinc-500 text-pretty">
          A running record of pundit takes — tracked, judged, and never
          forgotten.
        </p>

        <div className="mt-8 flex flex-wrap gap-2">
          {takes.map((take) => (
            <div
              key={take.id}
              className="flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-3 py-1.5"
            >
              <Avatar id={take.avatarId} className="size-5 shrink-0" />
              <span className="text-sm text-zinc-700">
                {take.pundit.split(" ")[0]}
              </span>
            </div>
          ))}
        </div>

        <dl className="mt-6 grid grid-cols-3 rounded-xl border border-zinc-200 divide-x divide-zinc-200 bg-white">
          {stats.map((stat, i) => (
            <div key={stat.label} className="px-6 py-5">
              <dt className="text-sm text-zinc-500">{stat.label}</dt>
              <dd
                className={`mt-1 text-3xl font-semibold tabular-nums ${i === 1 ? "text-sky-500" : "text-zinc-900"}`}
              >
                {stat.value}
              </dd>
            </div>
          ))}
        </dl>

        <div className="-mx-4 -my-2 mt-8 overflow-x-auto sm:-mx-6 lg:-mx-8">
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
                      <div className="flex items-start gap-3">
                        <Avatar
                          id={take.avatarId}
                          className="size-8 mt-0.5 shrink-0"
                        />
                        <div>
                          <p className="text-sm font-medium text-zinc-900 text-pretty whitespace-normal max-w-xs">
                            {take.headline}
                          </p>
                          <p className="mt-0.5 text-sm text-zinc-500">
                            {take.pundit}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 pr-6 text-sm text-zinc-500 capitalize">
                      {take.kind}
                    </td>
                    <td className="py-4 pr-6 text-sm tabular-nums text-zinc-500">
                      {take.date}
                    </td>
                    <td className="py-4">
                      <VerdictBadge resolution={take.resolution} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
