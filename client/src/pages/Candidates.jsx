import { useEffect, useState } from "react";
import api from "../api";
import { STAGES, STAGE_COLORS } from "../constants";
import CandidateForm from "../components/CandidateForm";

export default function Candidates() {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [stage, setStage] = useState("");
  const [skill, setSkill] = useState("");
  const [modal, setModal] = useState(null); // null | "new" | candidate object

  const fetchCandidates = async () => {
    setLoading(true);
    try {
      const params = {};
      if (search) params.search = search;
      if (stage) params.stage = stage;
      if (skill) params.skill = skill;
      const { data } = await api.get("/candidates", { params });
      setCandidates(data);
    } finally {
      setLoading(false);
    }
  };

  // debounce: user ruke tab hi API call ho (300ms)
  useEffect(() => {
    const t = setTimeout(fetchCandidates, 300);
    return () => clearTimeout(t);
  }, [search, stage, skill]);

  const handleSave = async (data) => {
    if (modal === "new") await api.post("/candidates", data);
    else await api.put(`/candidates/${modal._id}`, data);
    setModal(null);
    fetchCandidates();
  };

  const handleStageChange = async (id, newStage) => {
    await api.patch(`/candidates/${id}/stage`, { stage: newStage });
    fetchCandidates();
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this candidate?")) return;
    await api.delete(`/candidates/${id}`);
    fetchCandidates();
  };

  return (
    <div>
      <div className="flex flex-wrap gap-2 items-center mb-4">
        <input
          value={search} onChange={(e) => setSearch(e.target.value)}
          placeholder="Search name, email, role, skill..."
          className="border rounded-md px-3 py-2 text-sm flex-1 min-w-[200px]"
        />
        <select value={stage} onChange={(e) => setStage(e.target.value)} className="border rounded-md px-3 py-2 text-sm">
          <option value="">All stages</option>
          {STAGES.map((s) => <option key={s}>{s}</option>)}
        </select>
        <input
          value={skill} onChange={(e) => setSkill(e.target.value)}
          placeholder="Exact skill (e.g. React)"
          className="border rounded-md px-3 py-2 text-sm w-44"
        />
        <button onClick={() => setModal("new")} className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm hover:bg-indigo-700">
          + Add Candidate
        </button>
      </div>

      {loading ? (
        <p className="text-gray-500 text-sm">Loading...</p>
      ) : candidates.length === 0 ? (
        <p className="text-gray-500 text-sm">No candidates found. Try a different search or add a new candidate.</p>
      ) : (
        <div className="bg-white rounded-xl border overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-left text-gray-600">
              <tr>
                <th className="p-3">Name</th>
                <th className="p-3">Role</th>
                <th className="p-3">Skills</th>
                <th className="p-3">Exp</th>
                <th className="p-3">Stage</th>
                <th className="p-3"></th>
              </tr>
            </thead>
            <tbody>
              {candidates.map((c) => (
                <tr key={c._id} className="border-t">
                  <td className="p-3">
                    <div className="font-medium">{c.name}</div>
                    <div className="text-xs text-gray-500">{c.email}</div>
                  </td>
                  <td className="p-3">{c.role}</td>
                  <td className="p-3">
                    <div className="flex flex-wrap gap-1">
                      {c.skills.map((s) => (
                        <span key={s} className="bg-gray-100 text-xs px-2 py-0.5 rounded">{s}</span>
                      ))}
                    </div>
                  </td>
                  <td className="p-3">{c.experience} yr</td>
                  <td className="p-3">
                    <select
                      value={c.stage}
                      onChange={(e) => handleStageChange(c._id, e.target.value)}
                      className={`text-xs font-medium rounded-full px-2 py-1 border-0 ${STAGE_COLORS[c.stage]}`}
                    >
                      {STAGES.map((s) => <option key={s}>{s}</option>)}
                    </select>
                  </td>
                  <td className="p-3 whitespace-nowrap">
                    <button onClick={() => setModal(c)} className="text-indigo-600 hover:underline mr-3">Edit</button>
                    <button onClick={() => handleDelete(c._id)} className="text-red-600 hover:underline">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {modal && (
        <CandidateForm
          initial={modal === "new" ? null : modal}
          onSave={handleSave}
          onClose={() => setModal(null)}
        />
      )}
    </div>
  );
}