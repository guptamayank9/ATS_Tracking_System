import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const linkClass = ({ isActive }) =>
  `px-3 py-1.5 rounded-md text-sm font-medium ${
    isActive ? "bg-indigo-600 text-white" : "text-gray-600 hover:bg-gray-100"
  }`;

export default function Navbar() {
  const { user, logout } = useAuth();
  return (
    <nav className="bg-white border-b">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <span className="font-bold text-indigo-600">Mini ATS</span>
          <NavLink to="/" end className={linkClass}>Candidates</NavLink>
          <NavLink to="/board" className={linkClass}>Board</NavLink>
          <NavLink to="/dashboard" className={linkClass}>Dashboard</NavLink>
          {/* Step 5 me Board aur Dashboard links yahan aayenge */}
        </div>
        <div className="flex items-center gap-3 text-sm">
          <span className="text-gray-500">{user?.name}</span>
          <button onClick={logout} className="text-red-600 hover:underline">
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}