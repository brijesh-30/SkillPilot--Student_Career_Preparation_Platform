import { ArrowRight, Sparkles, Lightbulb } from "lucide-react";

export default function CareerMotivation({ onExplore }) {
  return (
    <section className="relative overflow-hidden rounded-3xl border border-indigo-200/60 bg-linear-to-r from-indigo-900 via-slate-900 to-violet-950 p-6 text-white shadow-md sm:p-7">
      <div className="pointer-events-none absolute -right-10 -top-14 h-48 w-48 rounded-full bg-indigo-500/20 blur-3xl" />

      <div className="relative flex flex-col justify-between gap-5 md:flex-row md:items-center">
        <div className="flex items-start gap-3.5 max-w-xl">
          <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white/10 text-amber-300 ring-1 ring-white/15">
            <Lightbulb size={20} />
          </div>

          <div>
            <div className="mb-1 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-indigo-300">
              <Sparkles size={12} />
              Engineer Mindset
            </div>
            <h3 className="text-lg font-bold text-white sm:text-xl">
              Consistency is greater than intensity.
            </h3>
            <p className="mt-1 text-xs leading-relaxed text-slate-300 sm:text-sm">
              Solving 2 coding problems and building for 45 minutes every day
              will compound into immense engineering readiness over 6 months.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onExplore}
          className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-white px-5 py-2.5 text-xs font-bold text-slate-900 shadow-sm transition hover:bg-slate-100 hover:shadow"
        >
          Explore Career Roadmap
          <ArrowRight size={14} />
        </button>
      </div>
    </section>
  );
}
