import { useState } from "react";
import { X, Building2, Briefcase, Calendar, MapPin, Plus } from "lucide-react";

export default function AddApplicationForm({ onAdd, onClose }) {
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [location, setLocation] = useState("");
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [status, setStatus] = useState("Applied");

  function handleSubmit(event) {
    event.preventDefault();
    if (!company.trim() || !role.trim()) return;

    onAdd({
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      company: company.trim(),
      role: role.trim(),
      location: location.trim() || "Remote / On-site",
      date,
      status,
    });

    onClose();
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/50 p-4 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
    >
      <form
        onSubmit={handleSubmit}
        className="my-auto w-full max-w-lg rounded-3xl border border-slate-100 bg-white p-6 shadow-2xl sm:p-7 dark:border-slate-800 dark:bg-[#0f172a] transition-colors"
      >
        <div className="mb-5 flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white sm:text-xl">
              Add Job Application
            </h2>
            <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
              Track a new internship or full-time opportunity.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close form"
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-300"
          >
            <X size={18} />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-xs font-bold text-slate-700 dark:text-slate-300">
              Company Name
            </label>
            <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2.5 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-100 dark:border-slate-700 dark:bg-slate-800/60">
              <Building2 size={16} className="text-slate-400 dark:text-slate-500" />
              <input
                required
                autoFocus
                value={company}
                onChange={(event) => setCompany(event.target.value)}
                placeholder="e.g. Google, Microsoft, Razorpay"
                className="w-full bg-transparent text-sm text-slate-800 outline-none dark:text-slate-100"
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-xs font-bold text-slate-700 dark:text-slate-300">
              Role / Position
            </label>
            <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2.5 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-100 dark:border-slate-700 dark:bg-slate-800/60">
              <Briefcase size={16} className="text-slate-400 dark:text-slate-500" />
              <input
                required
                value={role}
                onChange={(event) => setRole(event.target.value)}
                placeholder="e.g. Frontend Developer Intern, SDE-1"
                className="w-full bg-transparent text-sm text-slate-800 outline-none dark:text-slate-100"
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-xs font-bold text-slate-700 dark:text-slate-300">
              Location <span className="font-normal text-slate-400 dark:text-slate-500">(Optional)</span>
            </label>
            <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2.5 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-100 dark:border-slate-700 dark:bg-slate-800/60">
              <MapPin size={16} className="text-slate-400 dark:text-slate-500" />
              <input
                value={location}
                onChange={(event) => setLocation(event.target.value)}
                placeholder="e.g. Remote, Bangalore, Hyderabad"
                className="w-full bg-transparent text-sm text-slate-800 outline-none dark:text-slate-100"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-bold text-slate-700 dark:text-slate-300">
                Application Date
              </label>
              <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2.5 focus-within:border-indigo-500 dark:border-slate-700 dark:bg-slate-800/60">
                <Calendar size={16} className="text-slate-400 dark:text-slate-500" />
                <input
                  required
                  type="date"
                  value={date}
                  onChange={(event) => setDate(event.target.value)}
                  className="w-full bg-transparent text-xs text-slate-800 outline-none dark:text-slate-100"
                />
              </div>
            </div>

            <div>
              <label className="mb-1 block text-xs font-bold text-slate-700 dark:text-slate-300">
                Current Status
              </label>
              <select
                value={status}
                onChange={(event) => setStatus(event.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs font-medium text-slate-800 outline-none focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
              >
                <option value="Applied">Applied</option>
                <option value="Under Review">Under Review</option>
                <option value="Interview">Interview</option>
                <option value="Offer Received">Offer Received</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-2.5 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            Cancel
          </button>

          <button
            type="submit"
            className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-indigo-700"
          >
            <Plus size={14} />
            Save Application
          </button>
        </div>
      </form>
    </div>
  );
}
