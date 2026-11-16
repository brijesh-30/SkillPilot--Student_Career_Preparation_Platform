import {
  Building2,
  Trash2,
  Search,
  Plus,
  BriefcaseBusiness,
  LayoutGrid,
  List,
  MapPin,
  Calendar,
  ArrowRight,
  ArrowLeft,
} from "lucide-react";
import { useState } from "react";

const statusStyles = {
  Interview:
    "bg-blue-50 text-blue-700 border-blue-200 dark:bg-cyan-950/60 dark:text-cyan-300 dark:border-cyan-800/60",
  Applied:
    "bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/60 dark:text-indigo-300 dark:border-indigo-800/60",
  "Under Review":
    "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800/60",
  Rejected:
    "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-800/60",
  "Offer Received":
    "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800/60",
};

const columnColors = {
  Applied:
    "border-indigo-200 bg-indigo-50/40 text-indigo-800 dark:border-indigo-900/50 dark:bg-indigo-950/30 dark:text-indigo-300",
  "Under Review":
    "border-amber-200 bg-amber-50/40 text-amber-800 dark:border-amber-900/50 dark:bg-amber-950/30 dark:text-amber-300",
  Interview:
    "border-blue-200 bg-blue-50/40 text-blue-800 dark:border-cyan-900/50 dark:bg-cyan-950/30 dark:text-cyan-300",
  "Offer Received":
    "border-emerald-200 bg-emerald-50/40 text-emerald-800 dark:border-emerald-900/50 dark:bg-emerald-950/30 dark:text-emerald-300",
  Rejected:
    "border-rose-200 bg-rose-50/40 text-rose-800 dark:border-rose-900/50 dark:bg-rose-950/30 dark:text-rose-300",
};

const statuses = [
  "Applied",
  "Under Review",
  "Interview",
  "Offer Received",
  "Rejected",
];

export default function RecentApplications({
  applications = [],
  onStatusChange = () => {},
  onDelete = () => {},
  onAddClick = () => {},
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [viewMode, setViewMode] = useState("table"); // 'table' | 'kanban'

  const filteredApplications = applications.filter((application) => {
    const query = searchTerm.toLowerCase();
    const matchesSearch =
      (application.company || "").toLowerCase().includes(query) ||
      (application.role || "").toLowerCase().includes(query) ||
      (application.location || "").toLowerCase().includes(query);
    const matchesStatus =
      statusFilter === "All" || application.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalCount = applications.length;
  const interviewCount = applications.filter((a) => a.status === "Interview").length;
  const offerCount = applications.filter((a) => a.status === "Offer Received").length;
  const underReviewCount = applications.filter((a) => a.status === "Under Review").length;

  function moveStatus(appId, currentStatus, direction) {
    const currentIndex = statuses.indexOf(currentStatus);
    const newIndex = currentIndex + direction;
    if (newIndex >= 0 && newIndex < statuses.length) {
      onStatusChange(appId, statuses[newIndex]);
    }
  }

  return (
    <div className="space-y-5">
      {/* Top Pipeline Stats Strip */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="rounded-2xl border border-slate-200/90 bg-white p-4 shadow-xs dark:border-slate-800/80 dark:bg-[#0f172a]">
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Total Applied</p>
          <p className="mt-1 text-2xl font-black text-slate-900 dark:text-white font-mono-code">{totalCount}</p>
        </div>

        <div className="rounded-2xl border border-blue-100 bg-blue-50/50 p-4 shadow-xs dark:border-cyan-900/40 dark:bg-cyan-950/20">
          <p className="text-xs font-semibold text-blue-700 dark:text-cyan-300">In Interview</p>
          <p className="mt-1 text-2xl font-black text-blue-900 dark:text-cyan-200 font-mono-code">{interviewCount}</p>
        </div>

        <div className="rounded-2xl border border-amber-100 bg-amber-50/50 p-4 shadow-xs dark:border-amber-900/40 dark:bg-amber-950/20">
          <p className="text-xs font-semibold text-amber-700 dark:text-amber-300">Under Review</p>
          <p className="mt-1 text-2xl font-black text-amber-900 dark:text-amber-200 font-mono-code">{underReviewCount}</p>
        </div>

        <div className="rounded-2xl border border-emerald-100 bg-emerald-50/50 p-4 shadow-xs dark:border-emerald-900/40 dark:bg-emerald-950/20">
          <p className="text-xs font-semibold text-emerald-700 dark:text-emerald-300">Offers Received</p>
          <p className="mt-1 text-2xl font-black text-emerald-900 dark:text-emerald-200 font-mono-code">{offerCount}</p>
        </div>
      </div>

      {/* Main Container Card */}
      <section className="overflow-hidden rounded-3xl border border-slate-200/90 bg-white shadow-xs dark:border-slate-800/80 dark:bg-[#0f172a] transition-colors">
        {/* Controls Header */}
        <div className="border-b border-slate-100 dark:border-slate-800 p-5 sm:p-6">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Application Pipeline
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Manage your tech job and internship search status
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              {/* View Switcher Toggle */}
              <div className="flex rounded-xl bg-slate-100 dark:bg-slate-800 p-1">
                <button
                  type="button"
                  onClick={() => setViewMode("table")}
                  aria-label="Table view"
                  className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-bold transition ${
                    viewMode === "table"
                      ? "bg-white text-slate-900 shadow-xs dark:bg-slate-700 dark:text-white"
                      : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                  }`}
                >
                  <List size={14} />
                  Table
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode("kanban")}
                  aria-label="Kanban view"
                  className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-bold transition ${
                    viewMode === "kanban"
                      ? "bg-white text-slate-900 shadow-xs dark:bg-slate-700 dark:text-white"
                      : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                  }`}
                >
                  <LayoutGrid size={14} />
                  Kanban
                </button>
              </div>

              <button
                type="button"
                onClick={onAddClick}
                className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-linear-to-r from-indigo-600 to-violet-600 px-3.5 py-2 text-xs font-bold text-white shadow-xs transition hover:brightness-105"
              >
                <Plus size={15} />
                Add Application
              </button>
            </div>
          </div>

          <div className="mt-4 flex flex-col gap-3 sm:flex-row">
            <label className="flex flex-1 items-center gap-2 rounded-xl border border-slate-200 bg-slate-50/60 px-3 py-2 text-xs focus-within:border-indigo-500 focus-within:bg-white focus-within:ring-2 focus-within:ring-indigo-100 dark:border-slate-700 dark:bg-slate-800/60 dark:focus-within:border-indigo-400">
              <Search size={16} className="text-slate-400 dark:text-slate-500" />
              <input
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search company, role, or location..."
                aria-label="Search applications"
                className="w-full bg-transparent text-xs text-slate-800 outline-none dark:text-slate-100 dark:placeholder:text-slate-500"
              />
            </label>

            {viewMode === "table" && (
              <select
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value)}
                aria-label="Filter applications by status"
                className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 outline-none focus:border-indigo-500"
              >
                <option value="All">All statuses ({applications.length})</option>
                {statuses.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            )}
          </div>
        </div>

        {/* View Mode: Kanban Board */}
        {viewMode === "kanban" ? (
          <div className="overflow-x-auto p-5 sm:p-6">
            <div className="grid min-w-280 grid-cols-5 gap-4">
              {statuses.map((columnStatus) => {
                const columnApps = filteredApplications.filter(
                  (a) => a.status === columnStatus,
                );

                return (
                  <div
                    key={columnStatus}
                    className="flex flex-col rounded-2xl border border-slate-200/80 bg-slate-50/70 p-3 dark:border-slate-800 dark:bg-slate-900/60"
                  >
                    <div
                      className={`mb-3 flex items-center justify-between rounded-xl border px-2.5 py-1.5 text-xs font-bold ${columnColors[columnStatus]}`}
                    >
                      <span>{columnStatus}</span>
                      <span className="rounded-full bg-white dark:bg-slate-800 px-1.5 py-0.2 text-[10px] font-bold">
                        {columnApps.length}
                      </span>
                    </div>

                    <div className="space-y-2.5 flex-1 min-h-64">
                      {columnApps.map((app, idx) => {
                        const appId = app.id || `app-${idx}`;
                        const currentStatusIdx = statuses.indexOf(app.status);

                        return (
                          <div
                            key={appId}
                            className="rounded-xl border border-slate-200/90 bg-white p-3 shadow-xs transition hover:shadow-sm dark:border-slate-700/80 dark:bg-slate-800/90"
                          >
                            <div className="flex items-start justify-between gap-1.5">
                              <div>
                                <h4 className="font-bold text-xs text-slate-900 dark:text-white leading-tight">
                                  {app.role}
                                </h4>
                                <p className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 mt-0.5">
                                  {app.company}
                                </p>
                              </div>

                              <button
                                type="button"
                                onClick={() => {
                                  if (window.confirm(`Delete ${app.company}?`)) {
                                    onDelete(appId);
                                  }
                                }}
                                aria-label="Delete"
                                className="text-slate-300 hover:text-rose-500 p-0.5"
                              >
                                <Trash2 size={13} />
                              </button>
                            </div>

                            <div className="mt-2.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-[10px] text-slate-400">
                              {app.location && (
                                <span className="flex items-center gap-0.5">
                                  <MapPin size={10} />
                                  {app.location}
                                </span>
                              )}
                              {app.date && (
                                <span className="flex items-center gap-0.5">
                                  <Calendar size={10} />
                                  {app.date}
                                </span>
                              )}
                            </div>

                            {/* Kanban Move Arrows */}
                            <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-2 text-[10px]">
                              <button
                                type="button"
                                disabled={currentStatusIdx === 0}
                                onClick={() => moveStatus(appId, app.status, -1)}
                                className="inline-flex items-center gap-0.5 rounded px-1.5 py-0.5 text-slate-500 hover:bg-slate-100 disabled:opacity-30"
                              >
                                <ArrowLeft size={10} /> Back
                              </button>

                              <button
                                type="button"
                                disabled={currentStatusIdx === statuses.length - 1}
                                onClick={() => moveStatus(appId, app.status, 1)}
                                className="inline-flex items-center gap-0.5 rounded px-1.5 py-0.5 font-bold text-indigo-600 hover:bg-indigo-50 disabled:opacity-30"
                              >
                                Advance <ArrowRight size={10} />
                              </button>
                            </div>
                          </div>
                        );
                      })}

                      {columnApps.length === 0 && (
                        <div className="grid h-32 place-items-center rounded-xl border border-dashed border-slate-200 text-center text-[11px] text-slate-400">
                          Empty
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          /* View Mode: Table */
          <div className="overflow-x-auto">
            <table className="w-full min-w-160 text-left text-xs">
              <thead className="bg-slate-50/80 dark:bg-slate-800/70 font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                <tr>
                  <th className="px-5 py-3.5">Company & Role</th>
                  <th className="px-5 py-3.5">Location</th>
                  <th className="px-5 py-3.5">Date Applied</th>
                  <th className="px-5 py-3.5">Status</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredApplications.length > 0 ? (
                  filteredApplications.map((application, index) => {
                    const appId = application.id || `app-${index}`;

                    return (
                      <tr
                        key={appId}
                        className="transition-colors hover:bg-slate-50/80 dark:hover:bg-slate-800/40"
                      >
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/70 dark:text-indigo-400">
                              <Building2 size={18} />
                            </span>
                            <div>
                              <p className="font-bold text-slate-900 dark:text-white">
                                {application.role}
                              </p>
                              <p className="text-slate-500 dark:text-slate-400">
                                {application.company}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="px-5 py-4 text-slate-600 dark:text-slate-300 font-medium">
                          {application.location || "Remote / On-site"}
                        </td>

                        <td className="px-5 py-4 font-medium text-slate-500 dark:text-slate-400 font-mono-code">
                          {application.date
                            ? new Date(
                                `${application.date}T00:00:00`,
                              ).toLocaleDateString("en-IN", {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              })
                            : "—"}
                        </td>

                        <td className="px-5 py-4">
                          <select
                            value={application.status}
                            onChange={(event) =>
                              onStatusChange(appId, event.target.value)
                            }
                            aria-label={`Status for ${application.company}`}
                            className={`rounded-full border px-2.5 py-1 text-xs font-bold outline-none focus:ring-2 focus:ring-indigo-300 ${
                              statusStyles[application.status] ||
                              "border-slate-200 bg-slate-100 text-slate-700"
                            }`}
                          >
                            {statuses.map((status) => (
                              <option key={status} value={status}>
                                {status}
                              </option>
                            ))}
                          </select>
                        </td>

                        <td className="px-5 py-4 text-right">
                          <button
                            type="button"
                            onClick={() => {
                              if (
                                window.confirm(
                                  `Delete application for ${application.company}?`,
                                )
                              ) {
                                onDelete(appId);
                              }
                            }}
                            aria-label={`Delete application for ${application.company}`}
                            className="rounded-lg p-1.5 text-slate-400 transition hover:bg-rose-50 hover:text-rose-600"
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-5 py-12 text-center text-slate-400"
                    >
                      <BriefcaseBusiness
                        size={32}
                        className="mx-auto mb-2 text-slate-300"
                      />
                      <p className="text-sm font-semibold text-slate-700">
                        No applications found
                      </p>
                      <p className="mt-0.5 text-xs text-slate-400">
                        Click "Add Application" above to track your interviews and submissions.
                      </p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
