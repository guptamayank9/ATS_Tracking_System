import { useEffect, useState } from "react";
import api from "../api";
import { STAGES, STAGE_COLORS } from "../constants";

export default function Board() {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dragId, setDragId] = useState(null);
  const [overStage, setOverStage] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api.get("/candidates")
      .then(({ data }) => setCandidates(data))
      .finally(() => setLoading(false));
  }, []);

  const moveCandidate = async (id, newStage) => {
    const prev = candidates;
    const current = prev.find((c) => c._id === id);
    if (!current || current.stage === newStage) return;

    // optimistic update: UI turant badlo, fail ho to wapas
    setCandidates(prev.map((c) => (c._id === id ? { ...c, stage: newStage } : c)));
    setError("");
    try {
      await api.patch(`/candidates/${id}/stage`, { stage: newStage });
    } catch (err) {
      setCandidates(prev);
      setError("Failed to update the stage. Please try again.");
    }
  };

  const handleDrop = (e, stage) => {
    e.preventDefault();
    setOverStage(null);
    if (dragId) moveCandidate(dragId, stage);
    setDragId(null);
  };

  if (loading) return <p className="text-sm text-gray-500">Loading...</p>;

  return (
    <div>
      <h1 className="text-xl font-bold mb-3">Hiring Board</h1>
      {error && <p className="text-sm text-red-600 bg-red-50 p-2 rounded mb-3">{error}</p>}

      <div className="flex gap-3 overflow-x-auto pb-4">
        {STAGES.map((stage) => {
          const items = candidates.filter((c) => c.stage === stage);
          return (
            <div
              key={stage}
              onDragOver={(e) => { e.preventDefault(); setOverStage(stage); }}
              onDragLeave={() => setOverStage(null)}
              onDrop={(e) => handleDrop(e, stage)}
              className={`w-64 shrink-0 rounded-xl p-2 border transition ${
                overStage === stage ? "bg-indigo-50 border-indigo-400" : "bg-gray-50 border-gray-200"
              }`}
            >
              <div className="flex items-center justify-between px-1 mb-2">
                <span className={`text-xs font-semibold px-2 py-1 rounded-full ${STAGE_COLORS[stage]}`}>
                  {stage}
                </span>
                <span className="text-xs text-gray-500">{items.length}</span>
              </div>

              <div className="space-y-2 min-h-[80px]">
                {items.map((c) => (
                  <div
                    key={c._id}
                    draggable
                    onDragStart={() => setDragId(c._id)}
                    onDragEnd={() => { setDragId(null); setOverStage(null); }}
                    className={`bg-white border rounded-lg p-3 cursor-grab active:cursor-grabbing shadow-sm ${
                      dragId === c._id ? "opacity-40" : ""
                    }`}
                  >
                    <div className="font-medium text-sm">{c.name}</div>
                    <div className="text-xs text-gray-500">{c.role}</div>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {c.skills.slice(0, 3).map((s) => (
                        <span key={s} className="bg-gray-100 text-[10px] px-1.5 py-0.5 rounded">{s}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}