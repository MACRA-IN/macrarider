import { useNavigate, useLocation } from "react-router-dom";

const BG     = "#0F1A13";
const BORDER = "#1F3527";
const GREEN  = "#2CD377";
const MUTED  = "#3A5A44";

export default function BottomNav() {
  const navigate     = useNavigate();
  const { pathname } = useLocation();
  const isActive     = (path) => pathname === path;

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50"
      style={{ backgroundColor: BG, borderTop: `1px solid ${BORDER}` }}
    >
      <div className="max-w-lg mx-auto flex">
        <button
          onClick={() => navigate("/dashboard")}
          className="flex-1 flex flex-col items-center justify-center py-3.5 gap-1 transition-colors"
          style={{ color: isActive("/dashboard") ? GREEN : MUTED }}
        >
          <span className="text-xl leading-none">🏠</span>
          <span className="font-body text-xs font-medium">Home</span>
        </button>

        <button
          onClick={() => navigate("/earnings")}
          className="flex-1 flex flex-col items-center justify-center py-3.5 gap-1 transition-colors"
          style={{ color: isActive("/earnings") ? GREEN : MUTED }}
        >
          <span className="text-xl leading-none">💰</span>
          <span className="font-body text-xs font-medium">Earnings</span>
        </button>
      </div>
    </div>
  );
}
