
import { Target, Code2, Brain, MessageCircle } from "lucide-react";

const skills = [
  {
    name: "Frontend Development",
    detail: "React, JavaScript, Tailwind CSS",
    progress: 75,
    icon: Code2,
    color: "bg-violet-500",
  },
  {
    name: "Data Structures & Algorithms",
    detail: "Problem solving and LeetCode",
    progress: 60,
    icon: Brain,
    color: "bg-blue-500",
  },
  {
    name: "Interview Preparation",
    detail: "Technical and communication skills",
    progress: 45,
    icon: MessageCircle,
    color: "bg-emerald-500",
  },
];

export default function CareerProgress() {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center gap-3">
        <span className="grid h-11 w-11 place-items-center rounded-xl bg-violet-100 text-violet-600">
          <Target size={22} />
        </span>

        <div>
          <h3 className="text-lg font-bold text-slate-900">
            Career Progress
          </h3>
          <p className="text-sm text-slate-500">
            Keep building skills for your next opportunity.
          </p>
        </div>
      </div>

      <div className="mt-7 space-y-6">
        {skills.map((skill) => {
          const Icon = skill.icon;

          return (
            <div key={skill.name}>
              <div className="flex items-start gap-3">
                <span className="mt-1 text-slate-500">
                  <Icon size={19} />
                </span>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="text-sm font-semibold text-slate-800">
                      {skill.name}
                    </p>
                    <span className="text-sm font-bold text-slate-700">
                      {skill.progress}%
                    </span>
                  </div>

                  <p className="mt-1 text-xs text-slate-500">
                    {skill.detail}
                  </p>

                  <div
                    className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100"
                    role="progressbar"
                    aria-label={skill.name}
                    aria-valuenow={skill.progress}
                    aria-valuemin={0}
                    aria-valuemax={100}
                  >
                    <div
                      className={`h-full rounded-full ${skill.color} transition-all duration-500`}
                      style={{ width: `${skill.progress}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
