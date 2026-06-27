import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";
import {
  getTodayOrders,
  getEarnings,
  updateOrderStatus,
} from "../services/dashboardServices";
import BottomNav from "../components/dashboard/bottomNav";
import MacraLogo from "../assets/logo/Macra.png";

// ─── Palette ──────────────────────────────────────────────────────────────────

const BG      = "#0F1A13";
const SURFACE = "#162A1E";
const BORDER  = "#1F3527";
const MUTED   = "#6B8F71";
const GREEN   = "#2CD377";
const ORANGE  = "#FF9F1C";

// ─── Config ───────────────────────────────────────────────────────────────────

const SLOT = {
  breakfast: { emoji: "☀️", label: "Breakfast", time: "7–9 AM"  },
  lunch:     { emoji: "🍱", label: "Lunch",      time: "12–2 PM" },
  dinner:    { emoji: "🌙", label: "Dinner",     time: "6–8 PM"  },
};

const STATUS = {
  scheduled:        { label: "Scheduled",  badge: `bg-[#1F3527] text-[#6B8F71]`                    },
  out_for_delivery: { label: "On the way", badge: "bg-[rgba(255,159,28,0.15)] text-[#FF9F1C]"      },
  delivered:        { label: "Delivered",  badge: "bg-[rgba(44,211,119,0.15)] text-[#2CD377]"      },
  failed:           { label: "Failed",     badge: "bg-[rgba(239,68,68,0.15)] text-[#EF4444]"       },
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function greet(name) {
  const h = new Date().getHours();
  const t = h < 12 ? "morning" : h < 17 ? "afternoon" : "evening";
  return `Good ${t}, ${name} 👋`;
}

function todayStr() {
  return new Date().toLocaleDateString("en-IN", {
    weekday: "long", day: "numeric", month: "long",
  });
}

// ─── Spinner ──────────────────────────────────────────────────────────────────

function Spinner() {
  return (
    <div className="flex flex-col items-center justify-center py-24 gap-4">
      <div
        className="w-9 h-9 rounded-full border-[3px] animate-spin"
        style={{ borderColor: BORDER, borderTopColor: GREEN }}
      />
      <p className="font-body text-sm" style={{ color: MUTED }}>Loading your runs…</p>
    </div>
  );
}

// ─── Stat Chip ────────────────────────────────────────────────────────────────

function StatChip({ label, value, green = false }) {
  return (
    <div className="flex-shrink-0 rounded-2xl px-5 py-3.5" style={{ backgroundColor: SURFACE }}>
      <p
        className="font-heading font-bold text-[26px] leading-none mb-1.5"
        style={{ color: green ? GREEN : "#FFFFFF" }}
      >
        {value}
      </p>
      <p className="font-body text-xs whitespace-nowrap" style={{ color: MUTED }}>{label}</p>
    </div>
  );
}

// ─── Order Row ────────────────────────────────────────────────────────────────

function OrderRow({ order, onTap }) {
  const slot   = SLOT[order.delivery_slot] ?? { emoji: "📦", label: order.delivery_slot ?? "", time: "" };
  const status = STATUS[order.status] ?? STATUS.scheduled;

  return (
    <button
      onClick={() => onTap(order)}
      className="w-full flex items-center gap-4 px-4 py-4 rounded-2xl text-left active:opacity-70 transition-opacity"
      style={{ backgroundColor: SURFACE }}
    >
      {/* Stop circle */}
      <div
        className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 font-heading font-bold text-[#0F2B1D] text-sm"
        style={{ backgroundColor: GREEN }}
      >
        {order.route_order ?? "—"}
      </div>

      {/* Address + slot */}
      <div className="flex-1 min-w-0">
        <p className="text-white font-heading font-semibold text-sm truncate mb-0.5">
          {order.address || "Address not set"}
        </p>
        <p className="font-body text-xs" style={{ color: MUTED }}>
          {slot.emoji} {slot.label} · {slot.time}
        </p>
      </div>

      {/* Status badge + chevron */}
      <div className="flex items-center gap-2 flex-shrink-0">
        <span className={`text-[11px] font-medium px-2.5 py-0.5 rounded-full ${status.badge}`}>
          {status.label}
        </span>
        <span className="text-base font-light" style={{ color: MUTED }}>›</span>
      </div>
    </button>
  );
}

// ─── Bottom Sheet ─────────────────────────────────────────────────────────────

function BottomSheet({ order, onClose, onStatusUpdate, isUpdating }) {
  if (!order) return null;

  const slot    = SLOT[order.delivery_slot] ?? { emoji: "📦", label: order.delivery_slot ?? "", time: "" };
  const mapsUrl = order.latitude && order.longitude
    ? `https://maps.google.com/?q=${order.latitude},${order.longitude}`
    : `https://maps.google.com/?q=${encodeURIComponent(order.address ?? "")}`;

  return (
    <div className="fixed inset-0 z-[60] flex flex-col justify-end" onClick={onClose}>
      {/* Dim overlay */}
      <div className="absolute inset-0 bg-black/60" />

      {/* Sheet panel */}
      <div
        className="relative w-full max-w-lg mx-auto rounded-t-[24px] pb-10 sheet-enter"
        style={{ backgroundColor: SURFACE }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drag handle */}
        <div className="flex justify-center pt-3 pb-5">
          <div className="w-9 h-1 rounded-full" style={{ backgroundColor: BORDER }} />
        </div>

        {/* Header */}
        <div className="px-6 pb-5" style={{ borderBottom: `1px solid ${BORDER}` }}>
          <p className="font-body text-[11px] uppercase tracking-widest mb-1.5" style={{ color: MUTED }}>
            Stop {order.route_order}
          </p>
          <p className="font-heading font-bold text-white text-xl leading-tight">
            Order #{order.id}
          </p>
          <p className="font-body text-sm mt-1" style={{ color: MUTED }}>
            {slot.emoji} {slot.label} · {slot.time}
          </p>
        </div>

        {/* Full address */}
        <div className="px-6 py-5" style={{ borderBottom: `1px solid ${BORDER}` }}>
          <p className="font-body text-[11px] uppercase tracking-widest mb-2" style={{ color: MUTED }}>
            Delivery address
          </p>
          <p className="font-body text-white text-sm leading-relaxed">
            {order.address || "Not provided"}
          </p>
        </div>

        {/* Call + Maps */}
        <div className="px-6 pt-5 pb-4 grid grid-cols-2 gap-3">
          {order.customer_phone ? (
            <a
              href={`tel:${order.customer_phone}`}
              className="flex items-center justify-center gap-2 py-3 rounded-2xl font-heading font-semibold text-sm text-white"
              style={{ border: `1.5px solid ${BORDER}` }}
            >
              📞&nbsp;Call
            </a>
          ) : (
            <button
              disabled
              className="flex items-center justify-center gap-2 py-3 rounded-2xl font-body text-sm opacity-30"
              style={{ border: `1.5px solid ${BORDER}`, color: MUTED }}
            >
              📞&nbsp;No phone
            </button>
          )}
          <a
            href={mapsUrl}
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-center gap-2 py-3 rounded-2xl font-heading font-semibold text-sm"
            style={{ border: `1.5px solid ${GREEN}`, color: GREEN }}
          >
            📍&nbsp;Maps
          </a>
        </div>

        {/* Action button */}
        <div className="px-6">
          {order.status === "scheduled" && (
            <button
              onClick={() => onStatusUpdate(order.id, "out_for_delivery")}
              disabled={isUpdating}
              className="w-full py-4 rounded-2xl font-heading font-bold text-white text-[15px] disabled:opacity-60 active:opacity-80 transition-opacity"
              style={{ backgroundColor: ORANGE }}
            >
              {isUpdating ? "Updating…" : "▶  Start Delivery"}
            </button>
          )}

          {order.status === "out_for_delivery" && (
            <button
              onClick={() => onStatusUpdate(order.id, "delivered")}
              disabled={isUpdating}
              className="w-full py-4 rounded-2xl font-heading font-bold text-[#0F2B1D] text-[15px] disabled:opacity-60 active:opacity-80 transition-opacity"
              style={{ backgroundColor: GREEN }}
            >
              {isUpdating ? "Updating…" : "✓  Mark as Delivered"}
            </button>
          )}

          {order.status === "delivered" && (
            <div
              className="w-full py-4 rounded-2xl flex items-center justify-center gap-2"
              style={{ backgroundColor: `rgba(44,211,119,0.12)` }}
            >
              <span className="font-heading font-bold text-[15px]" style={{ color: GREEN }}>
                ✓ Delivered
              </span>
            </div>
          )}

          {order.status === "failed" && (
            <div
              className="w-full py-4 rounded-2xl flex items-center justify-center"
              style={{ backgroundColor: "rgba(239,68,68,0.1)" }}
            >
              <span className="font-heading font-bold text-[15px] text-crimson">Failed</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Dashboard ────────────────────────────────────────────────────────────────

export default function Dashboard() {
  const { rider, logout } = useAuth();
  const navigate = useNavigate();

  const [orders,        setOrders]        = useState([]);
  const [earnings,      setEarnings]      = useState(null);
  const [loading,       setLoading]       = useState(true);
  const [error,         setError]         = useState("");
  const [activeOrderId, setActiveOrderId] = useState(null);
  const [updating,      setUpdating]      = useState(null);

  const loadData = async () => {
    setLoading(true);
    setError("");
    try {
      const [ordersData, earningsData] = await Promise.all([
        getTodayOrders(),
        getEarnings(),
      ]);
      setOrders(ordersData ?? []);
      setEarnings(earningsData ?? null);
    } catch (err) {
      setError(err.message || "Failed to load. Check your connection.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const handleStatusUpdate = async (orderId, newStatus) => {
    setUpdating(orderId);
    try {
      await updateOrderStatus(orderId, newStatus);
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
      );
      if (newStatus === "delivered") {
        const earningsData = await getEarnings();
        setEarnings(earningsData);
      }
    } catch (err) {
      alert(err.message);
    } finally {
      setUpdating(null);
    }
  };

  const sorted      = [...orders].sort((a, b) => a.route_order - b.route_order);
  const pending     = orders.filter((o) => o.status !== "delivered" && o.status !== "failed").length;
  const delivered   = orders.filter((o) => o.status === "delivered").length;
  const todayAmt    = parseFloat(earnings?.today_earnings ?? 0).toFixed(0);
  const totalAmt    = parseFloat(earnings?.total_earnings ?? 0).toFixed(0);
  const firstName   = rider?.name?.split(" ")[0] ?? "Rider";
  const activeOrder = orders.find((o) => o.id === activeOrderId) ?? null;

  return (
    <div className="min-h-screen pb-24" style={{ backgroundColor: BG }}>

      {/* ── Navbar ────────────────────────────────────────── */}
      <nav
        className="sticky top-0 z-50"
        style={{ backgroundColor: BG, borderBottom: `1px solid ${BORDER}` }}
      >
        <div className="max-w-lg mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src={MacraLogo} alt="Macra" className="h-7 w-auto object-contain" />
            <span
              className="font-heading font-semibold text-sm tracking-[0.18em] uppercase"
              style={{ color: GREEN }}
            >
              rider
            </span>
          </div>
          <button
            onClick={() => { logout(); navigate("/login"); }}
            className="font-body text-sm font-medium active:opacity-60 transition-opacity"
            style={{ color: MUTED }}
          >
            Logout
          </button>
        </div>
      </nav>

      <div className="max-w-lg mx-auto px-4 pt-6">

        {/* ── Greeting ────────────────────────────────────── */}
        <h1 className="font-heading font-bold text-[26px] text-white leading-tight mb-1">
          {greet(firstName)}
        </h1>
        <p className="font-body text-sm mb-7" style={{ color: MUTED }}>{todayStr()}</p>

        {/* ── Stat chips ──────────────────────────────────── */}
        <div className="-mx-4 px-4 flex gap-3 overflow-x-auto no-scrollbar pb-1 mb-7">
          <StatChip label="Pending"    value={pending}         />
          <StatChip label="Delivered"  value={delivered}       green />
          <StatChip label="Today"      value={`₹${todayAmt}`} />
          <StatChip label="Total"      value={`₹${totalAmt}`} green />
          {/* Right padding sentinel */}
          <div className="flex-shrink-0 w-1" />
        </div>

        {/* ── Section header ──────────────────────────────── */}
        <div className="flex items-center justify-between mb-4">
          <p
            className="font-body text-[11px] font-semibold uppercase tracking-widest"
            style={{ color: MUTED }}
          >
            Today's Runs
          </p>
          <button
            onClick={loadData}
            disabled={loading}
            className="font-body text-xs font-medium disabled:opacity-40 active:opacity-60 transition-opacity"
            style={{ color: GREEN }}
          >
            Refresh
          </button>
        </div>

        {/* ── Loading ─────────────────────────────────────── */}
        {loading && <Spinner />}

        {/* ── Error ───────────────────────────────────────── */}
        {error && !loading && (
          <div
            className="rounded-2xl px-5 py-4 font-body text-sm"
            style={{ backgroundColor: "rgba(239,68,68,0.1)", color: "#EF4444" }}
          >
            {error}
          </div>
        )}

        {/* ── Empty ───────────────────────────────────────── */}
        {!loading && !error && orders.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 gap-2 text-center">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center mb-3 text-3xl"
              style={{ backgroundColor: SURFACE }}
            >
              📦
            </div>
            <p className="font-heading font-semibold text-white text-base">All clear today</p>
            <p className="font-body text-sm" style={{ color: MUTED }}>
              No deliveries assigned for today.
            </p>
          </div>
        )}

        {/* ── Order rows ──────────────────────────────────── */}
        {!loading && !error && sorted.length > 0 && (
          <div className="flex flex-col gap-3 pb-4">
            {sorted.map((order) => (
              <OrderRow
                key={order.id}
                order={order}
                onTap={(o) => setActiveOrderId(o.id)}
              />
            ))}
          </div>
        )}

      </div>

      {/* ── Bottom sheet ──────────────────────────────────── */}
      <BottomSheet
        order={activeOrder}
        onClose={() => setActiveOrderId(null)}
        onStatusUpdate={handleStatusUpdate}
        isUpdating={updating === activeOrderId}
      />

      <BottomNav />
    </div>
  );
}
