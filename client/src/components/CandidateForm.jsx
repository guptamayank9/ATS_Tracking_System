import { useState } from "react";

const empty = {
  name: "", email: "", phone: "", role: "",
  skills: "", experience: 0, resumeUrl: "", notes: "",
};

export default function CandidateForm({ initial, onSave, onClose }) {
  const [form, setForm] = useState(
    initial ? { ...initial, skills: initial.skills.join(", ") } : empty
  );
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      await onSave({
        ...form,
        experience: Number(form.experience) || 0,
        // "React, Node" -> ["React", "Node"]
        skills: form.skills.split(",").map((s) => s.trim()).filter(Boolean),
      });
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
      setSaving(false);
    }
  };

  const input = "w-full border rounded-md px-3 py-2 text-sm";

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
      <form onSubmit={handleSubmit} className="bg-white rounded-xl p-5 w-full max-w-lg max-h-[90vh] overflow-y-auto space-y-3">
        <h2 className="text-lg font-bold">{initial ? "Edit Candidate" : "Add Candidate"}</h2>
        {error && <p className="text-sm text-red-600 bg-red-50 p-2 rounded">{error}</p>}

        <input className={input} placeholder="Full name *" value={form.name} onChange={set("name")} required />
        <input className={input} type="email" placeholder="Email *" value={form.email} onChange={set("email")} required />
        <div className="grid grid-cols-2 gap-3">
          <input className={input} placeholder="Phone" value={form.phone} onChange={set("phone")} />
          <input className={input} type="number" min="0" step="0.5" placeholder="Experience (yrs)" value={form.experience} onChange={set("experience")} />
        </div>
        <input className={input} placeholder="Role applied for *" value={form.role} onChange={set("role")} required />
        <input className={input} placeholder="Skills (comma separated) e.g. React, Node" value={form.skills} onChange={set("skills")} />
        <input className={input} placeholder="Resume URL" value={form.resumeUrl} onChange={set("resumeUrl")} />
        <textarea className={input} rows={3} placeholder="Notes" value={form.notes} onChange={set("notes")} />

        <div className="flex justify-end gap-2 pt-2">
          <button type="button" onClick={onClose} className="px-4 py-2 text-sm rounded-md border">Cancel</button>
          <button disabled={saving} className="px-4 py-2 text-sm rounded-md bg-indigo-600 text-white disabled:opacity-60">
            {saving ? "Saving..." : "Save"}
          </button>
        </div>
      </form>
    </div>
  );
}