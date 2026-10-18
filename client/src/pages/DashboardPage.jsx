import { useEffect, useState } from "react";
import api from "../api";
import { STAGES, STAGE_COLORS } from "../constants";

export default function DashboardPage() {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get("/dashboard")
      .then(({ data }) => setData(data))
      .catch(() => setError("Failed to load the dashboard."));
  }, []);

  if (error) return <p className="text-sm text-red-600">{error}</p>;
  if (!data) return <p className="text-sm text-gray-500">Loading...</p>;

  // used to scale the funnel bars relative to the largest count
  const maxFunnel = Math.max(...data.funnel.map((f) => f.count), 1);

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold">Dashboard</h1>

      {/* Total and per-stage counts */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
        <div className="bg-indigo-600 text-white rounded-xl p-4">
          <div className="text-xs opacity-80">Total</div>
          <div className="text-2xl font-bold">{data.total}</div>
        </div>
        {STAGES.map((s) => (
          <div key={s} className="bg-white border rounded-xl p-4">
            <span
              className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${STAGE_COLORS[s]}`}
            >
              {s}
            </span>
            <div className="text-2xl font-bold mt-2">{data.byStage[s]}</div>
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Hiring funnel */}
        <div className="bg-white border rounded-xl p-4">
          <h2 className="font-semibold mb-3">Hiring Funnel</h2>
          <div className="space-y-3">
            {data.funnel.map((f) => (
              <div key={f.stage}>
                <div className="flex justify-between text-xs mb-1">
                  <span>{f.stage}</span>
                  <span className="text-gray-500">
                    {f.count}{" "}
                    {f.stage !== "Applied" && `(${f.conversion}% of previous)`}
                  </span>
                </div>
                <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-indigo-500 rounded-full transition-all"
                    style={{ width: `${(f.count / maxFunnel) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent activity */}
        <div className="bg-white border rounded-xl p-4">
          <h2 className="font-semibold mb-3">Recent Activity</h2>
          {data.recentActivity.length === 0 ? (
            <p className="text-sm text-gray-500">No recent activity yet.</p>
          ) : (
            <ul className="space-y-2">
              {data.recentActivity.map((a, i) => (
                <li
                  key={i}
                  className="flex items-center justify-between text-sm border-b last:border-0 pb-2"
                >
                  <div>
                    <span className="font-medium">{a.name}</span>
                    <span className="text-gray-500"> → </span>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full ${STAGE_COLORS[a.stage]}`}
                    >
                      {a.stage}
                    </span>
                  </div>
                  <span className="text-xs text-gray-400">
                    {new Date(a.changedAt).toLocaleString("en-IN", {
                      day: "numeric",
                      month: "short",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}