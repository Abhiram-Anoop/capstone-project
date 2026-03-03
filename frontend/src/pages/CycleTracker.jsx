import React, { useEffect, useMemo, useRef, useState } from "react";
import Header from "../assets/component/Header.jsx";
import Footer from "../assets/component/Footer.jsx";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import {
  Droplet,
  Smile,
  Frown,
  Heart,
  Zap,
  Activity,
  Bed,
  AlertCircle,
  Cloud,
  Bike,
  Dumbbell,
  Footprints,
  MapPin,
  Store,
  Search,
  NotebookPen,
  CalendarDays,
  Info,
  Leaf,
  ShieldQuestion,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

// The existing helpers and mock data remain unchanged as they are functional.
const fmt = (d) => d.toISOString().slice(0, 10);
const parse = (s) => {
  const [y, m, d] = s.split("-").map(Number);
  return new Date(y, m - 1, d);
};
const addDays = (d, n) => {
  const x = new Date(d);
  x.setDate(x.getDate() + n);
  return x;
};
const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));

// Color palette for a softer, premium look
const GRADIENT_COLORS = ["#6366F1", "#A855F7", "#F472B6", "#F87171"];
const PHASE_COLORS_NEW = {
  menstrual: "bg-gradient-to-r from-purple-400 to-pink-500 text-white",
  follicular: "bg-gradient-to-r from-emerald-400 to-sky-500 text-white",
  ovulation: "bg-gradient-to-r from-rose-400 to-red-500 text-white",
  luteal: "bg-gradient-to-r from-indigo-400 to-purple-500 text-white",
  none: "bg-gray-100 text-gray-700",
};
const borderForPhase = {
  menstrual: "ring-2 ring-purple-400/70",
  follicular: "ring-2 ring-emerald-400/70",
  ovulation: "ring-2 ring-rose-400/70",
  luteal: "ring-2 ring-indigo-400/70",
  none: "ring-1 ring-gray-200",
};

const today = new Date();
const defaultStart = fmt(addDays(today, -10));

const MOCK_STORES = [
  { id: 1, name: "CareMart Pharmacy", area: "Indore", distanceKm: 1.2, items: [{ brand: "Whisper Ultra", price: 85, stock: "In Stock" }, { brand: "Stayfree Secure", price: 72, stock: "Low Stock" }] },
  { id: 2, name: "Health+ Medicals", area: "Bhopal", distanceKm: 3.5, items: [{ brand: "Sofy Antibacteria", price: 95, stock: "In Stock" }, { brand: "Nua Pads", price: 159, stock: "Out of Stock" }] },
  { id: 3, name: "Apna Store", area: "Jaipur", distanceKm: 0.8, items: [{ brand: "Whisper Choice", price: 52, stock: "In Stock" }, { brand: "Stayfree Dry-Max", price: 98, stock: "In Stock" }] },
  { id: 4, name: "City Chemists", area: "Mumbai", distanceKm: 2.1, items: [{ brand: "Paree Super", price: 89, stock: "Low Stock" }, { brand: "Kotex Overnight", price: 120, stock: "In Stock" }] },
];

const MenstrualTracker = () => {
  const [lastStart, setLastStart] = useState(defaultStart);
  const [cycleLength, setCycleLength] = useState(28);
  const [periodLength, setPeriodLength] = useState(5);
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [logs, setLogs] = useState({});
  const [selectedDate, setSelectedDate] = useState(fmt(today));
  const [q, setQ] = useState("");
  const [storeArea, setStoreArea] = useState("");
  // State variables for the new pop-ups
  const [isPracticesModalOpen, setIsPracticesModalOpen] = useState(false);
  const [isMythsModalOpen, setIsMythsModalOpen] = useState(false);

  const storesRef = useRef(null);
  const educationRef = useRef(null);

  const schedule = useMemo(() => {
    if (!lastStart) return {};
    const start = parse(lastStart);
    const horizonDays = 31 * 6;
    const map = {};
    for (let i = 0; i < horizonDays; i++) {
      const d = addDays(start, i);
      const dayIdx = i % cycleLength;
      let phase = "none";

      if (dayIdx >= 0 && dayIdx < periodLength) phase = "menstrual";
      const ovuIdx = clamp(cycleLength - 14, 10, 20);
      if (dayIdx === ovuIdx) phase = "ovulation";
      if (dayIdx >= periodLength && dayIdx < ovuIdx) phase = "follicular";
      if (dayIdx > ovuIdx) phase = "luteal";

      map[fmt(d)] = phase;
    }
    return map;
  }, [lastStart, cycleLength, periodLength]);

  const predictions = useMemo(() => {
    if (!lastStart) return null;
    const start = parse(lastStart);
    const nextStart = addDays(start, cycleLength);
    const ovulation = addDays(start, cycleLength - 14);
    const fertileStart = addDays(ovulation, -2);
    const fertileEnd = addDays(ovulation, 1);
    const periodEnd = addDays(start, periodLength - 1);
    return {
      current: { start, end: periodEnd },
      next: { start: nextStart, end: addDays(nextStart, periodLength - 1) },
      ovulation,
      fertileStart,
      fertileEnd,
    };
  }, [lastStart, cycleLength, periodLength]);

  const phaseData = useMemo(() => {
    const ovIdx = clamp(cycleLength - 14, 10, 20);
    const menstrual = clamp(periodLength, 1, 10);
    const ovulation = 1;
    const follicular = Math.max(0, ovIdx - menstrual);
    const lutealFixed = Math.max(0, cycleLength - (menstrual + follicular + ovulation));
    return [
      { name: "Menstrual", value: menstrual },
      { name: "Follicular", value: follicular },
      { name: "Ovulation", value: ovulation },
      { name: "Luteal", value: lutealFixed },
    ];
  }, [cycleLength, periodLength]);

  const monthGrid = useMemo(() => {
    const first = new Date(viewYear, viewMonth, 1);
    const startDay = (first.getDay() + 6) % 7;
    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
    const cells = [];
    for (let i = 0; i < startDay; i++) {
      cells.push(null);
    }
    for (let d = 1; d <= daysInMonth; d++) {
      const date = new Date(viewYear, viewMonth, d);
      cells.push(date);
    }
    return cells;
  }, [viewMonth, viewYear]);

  useEffect(() => {
    const sd = parse(selectedDate);
    setViewYear(sd.getFullYear());
    setViewMonth(sd.getMonth());
  }, []);

  const setLog = (dateStr, updater) =>
    setLogs((prev) => {
      const base = prev[dateStr] ?? { flow: "", moods: [], activities: [], other: [], signs: [], energy: "", notes: "" };
      const next = typeof updater === "function" ? updater(base) : updater;
      return { ...prev, [dateStr]: next };
    });

  const filteredStores = useMemo(() => {
    const text = (q || "").toLowerCase().trim();
    const area = (storeArea || "").toLowerCase().trim();
    return MOCK_STORES.filter(
      (s) =>
        (!text || s.name.toLowerCase().includes(text) || s.items.some((i) => i.brand.toLowerCase().includes(text))) &&
        (!area || s.area.toLowerCase().includes(area))
    ).sort((a, b) => a.distanceKm - b.distanceKm);
  }, [q, storeArea]);
  
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, name, index }) => {
    const RADIAN = Math.PI / 180;
    const radius = outerRadius + 20;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text x={x} y={y} fill={GRADIENT_COLORS[index]} textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
        {`${name} ${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };
  
  // Data for the Healthy Period Practices modal
  const HEALTHY_PRACTICES_DETAILS = [
    {
      title: "Use Clean Pads or Cloths",
      text: "Always use sanitary pads or a clean cotton cloth. If using cloth, wash it properly with soap and water, and dry it in sunlight."
    },
    {
      title: "Change Regularly",
      text: "Change your pad or cloth every 4–6 hours, even if the flow is light. This prevents infections and bad odor."
    },
    {
      title: "Maintain Personal Hygiene",
      text: "Wash your hands before and after changing pads. Keep the vaginal area clean by washing with clean water (no harsh soaps needed)."
    },
    {
      title: "Dispose Safely",
      text: "Wrap used pads in paper and throw them in a dustbin. Do not flush pads or throw them in open areas."
    },
    {
      title: "Eat & Rest Well",
      text: "Drink plenty of water and eat iron-rich foods (like jaggery, spinach, pulses). Take rest, but also try light activity like walking or stretching to reduce cramps."
    },
    {
      title: "Know When to See a Doctor",
      text: "If you have very heavy bleeding, severe pain, or irregular cycles, consult a doctor or ASHA worker."
    }
  ];

  const BREAKING_MYTHS_DETAILS = [
    {
      title: "Myth: Women are “impure” during periods.",
      text: "Truth: Periods are natural. A woman is not dirty or untouchable. She can cook, pray, and do daily activities if she feels comfortable."
    },
    {
      title: "Myth: Women cannot enter temples or pray during periods.",
      text: "Truth: Periods are created by God Himself. They are not a sin or impurity. A woman is always pure in God’s eyes, whether she has her period or not."
    },
    {
      title: "Myth: Touching religious items during periods brings bad luck.",
      text: "Truth: No religion teaches that women are “untouchable.” Menstruation is a sign of life and health. God never punishes women for something natural."
    },
    {
      title: "Myth: You should not eat certain foods during periods.",
      text: "Truth: Eating fruits, vegetables, and warm foods actually helps you feel better. There is no food that must be avoided."
    },
    {
      title: "Myth: Period blood is dirty.",
      text: "Truth: Menstrual blood is just blood from your body. It is not waste or poison—it is a healthy sign that your body is working properly."
    },
    {
      title: "Myth: Girls should not talk openly about periods.",
      text: "Truth: Talking about periods helps women learn, stay healthy, and support each other. There is nothing to hide or feel shy about."
    },
    {
      title: "Myth: Women should stay away from kitchens and family during periods.",
      text: "Truth: Periods do not spoil food or harm anyone. This belief comes from old traditions, not God. Women should rest if they feel tired, but they are never “dirty.”"
    },
    {
      title: "Myth: Periods are a disease.",
      text: "Truth: Periods are not an illness. They are a normal monthly process in every healthy woman."
    },
  ];

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-100 text-gray-800 font-sans py-12 px-4 md:px-8">
        {/* Title */}
        <section className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 drop-shadow-lg">
            Flow-Sense
          </h1>
          <p className="text-gray-600 mt-3 max-w-lg mx-auto">
            Your personal cycle companion for tracking, predicting, and understanding your body's rhythm.
          </p>
          <div className="mt-6 flex gap-3 justify-center flex-wrap">
            <JumpButton icon={<CalendarDays size={18} />} label="Calendar" onClick={() => document.getElementById("calendar-section")?.scrollIntoView({ behavior: "smooth" })} />
            <JumpButton icon={<NotebookPen size={18} />} label="Daily Logs" onClick={() => document.getElementById("logs-section")?.scrollIntoView({ behavior: "smooth" })} />
            <JumpButton icon={<Store size={18} />} label="Nearby Stores" onClick={() => storesRef.current?.scrollIntoView({ behavior: "smooth" })} />
            <JumpButton icon={<Info size={18} />} label="Health Info" onClick={() => educationRef.current?.scrollIntoView({ behavior: "smooth" })} />
          </div>
        </section>

        {/* --- Core Tracking Section (Inputs + Calendar) --- */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8" id="calendar-section">
          <Card className="lg:col-span-2">
            <h2 className="text-xl font-semibold mb-6">Your Cycle Details 🩸</h2>
            <InputRow label="Last period start date">
              <input
                type="date"
                value={lastStart}
                onChange={(e) => {
                  setLastStart(e.target.value);
                  setSelectedDate(e.target.value);
                }}
                className="w-full mt-2 p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
              />
            </InputRow>
            <InputRow label="Average cycle length (days)">
              <input
                type="number"
                min={20}
                max={40}
                value={cycleLength}
                onChange={(e) => setCycleLength(clamp(Number(e.target.value || 28), 20, 40))}
                className="w-full mt-2 p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
              />
            </InputRow>
            <InputRow label="Period length (days)">
              <input
                type="number"
                min={2}
                max={10}
                value={periodLength}
                onChange={(e) => setPeriodLength(clamp(Number(e.target.value || 5), 2, 10))}
                className="w-full mt-2 p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
              />
            </InputRow>

            <div className="rounded-2xl bg-gray-50 border border-gray-200 p-5 mt-8 shadow-inner">
              <h4 className="font-semibold text-gray-700 mb-3">Predicted Dates</h4>
              <ul className="text-sm text-gray-700 space-y-2">
                <li>
                  <span className="font-medium text-gray-500">Current period: </span>
                  <span className="font-semibold">
                    {predictions?.current?.start.toDateString()} → {predictions?.current?.end.toDateString()}
                  </span>
                </li>
                <li>
                  <span className="font-medium text-gray-500">Ovulation: </span>
                  <span className="font-semibold">{predictions?.ovulation.toDateString()}</span>
                </li>
                <li>
                  <span className="font-medium text-gray-500">Fertile window: </span>
                  <span className="font-semibold">
                    {predictions?.fertileStart.toDateString()} → {predictions?.fertileEnd.toDateString()}
                  </span>
                </li>
                <li>
                  <span className="font-medium text-gray-500">Next period: </span>
                  <span className="font-semibold">
                    {predictions?.next?.start.toDateString()} → {predictions?.next?.end.toDateString()}
                  </span>
                </li>
              </ul>
            </div>

            <div className="flex flex-col items-center mt-8">
              <h4 className="font-semibold text-gray-700 mb-3">Cycle Overview</h4>
              <PieChart width={300} height={300}>
                <Pie
                  data={phaseData}
                  cx="50%"
                  cy="50%"
                  labelLine={true}
                  outerRadius={90}
                  dataKey="value"
                  label={renderCustomizedLabel}
                >
                  {phaseData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={GRADIENT_COLORS[index]} stroke="#fff" strokeWidth={2} />
                  ))}
                </Pie>
                <Tooltip formatter={(value, name) => [`${value} days`, name]} />
                <Legend layout="horizontal" align="center" verticalAlign="bottom" wrapperStyle={{ paddingTop: '20px' }} />
              </PieChart>
            </div>
          </Card>

          <Card className="lg:col-span-3 self-start">
            <div className="flex items-center justify-between mb-6">
              <button
                className="p-2 rounded-full border border-gray-200 hover:bg-gray-100 transition"
                onClick={() => { const d = new Date(viewYear, viewMonth - 1, 1); setViewYear(d.getFullYear()); setViewMonth(d.getMonth()); }}
              >
                <ChevronLeft size={20} />
              </button>
              <h2 className="text-2xl font-bold text-gray-700">
                {new Date(viewYear, viewMonth, 1).toLocaleString(undefined, { month: "long", year: "numeric" })}
              </h2>
              <button
                className="p-2 rounded-full border border-gray-200 hover:bg-gray-100 transition"
                onClick={() => { const d = new Date(viewYear, viewMonth + 1, 1); setViewYear(d.getFullYear()); setViewMonth(d.getMonth()); }}
              >
                <ChevronRight size={20} />
              </button>
            </div>

            <div className="flex flex-wrap gap-2 text-xs mt-4 justify-center">
              <LegendPill colorClass={PHASE_COLORS_NEW.menstrual} label="Menstrual" />
              <LegendPill colorClass={PHASE_COLORS_NEW.follicular} label="Follicular" />
              <LegendPill colorClass={PHASE_COLORS_NEW.ovulation} label="Ovulation" />
              <LegendPill colorClass={PHASE_COLORS_NEW.luteal} label="Luteal" />
            </div>

            <div className="grid grid-cols-7 gap-3 text-center text-gray-700 text-sm mt-6">
              {["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"].map((d, i) => (
                <div key={i} className="font-semibold text-gray-500">{d}</div>
              ))}
              {monthGrid.map((dateObj, i) => {
                if (!dateObj) {
                  return <div key={i} />;
                }
                const ds = fmt(dateObj);
                const phase = schedule[ds] ?? "none";
                const isSelected = ds === selectedDate;
                const isToday = fmt(today) === ds;

                return (
                  <button
                    key={i}
                    onClick={() => setSelectedDate(ds)}
                    className={`p-3 rounded-xl transition-all text-sm flex flex-col items-center gap-1
                    ${isSelected ? "bg-gradient-to-br from-violet-300 to-blue-300 text-white shadow-lg" : "hover:bg-gray-100 bg-white border border-gray-200"}
                    ${isSelected ? "" : borderForPhase[phase]}
                    ${isToday ? "border-2 border-emerald-500" : ""}`}
                    title={phase}
                  >
                    <span className={`font-medium ${isSelected ? "text-white" : ""}`}>{dateObj.getDate()}</span>
                    <span className={`px-2 py-0.5 rounded-full text-[9px] leading-3 capitalize whitespace-nowrap overflow-hidden max-w-full
                      ${isSelected ? "bg-white/20" : PHASE_COLORS_NEW[phase]}`}>
                      {phase === "none" ? "" : phase}
                    </span>
                    {isToday && !isSelected && (<span className="text-[8px] text-emerald-600 font-semibold">today</span>)}
                  </button>
                );
              })}
            </div>
            
            <div ref={educationRef} className="mt-8 pt-8 border-t border-gray-200">
                <h3 className="text-xl font-semibold mb-6">Health Insights & Education</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                    <PhaseCard title="Menstrual" text="Day 1–5 • Bleeding • Low energy" color="purple" />
                    <PhaseCard title="Follicular" text="Day 5–13 • High energy • Estrogen rising" color="emerald" />
                    <PhaseCard title="Ovulation" text="Day 14 • Peak fertility" color="rose" />
                    <PhaseCard title="Luteal" text="Day 15–28 • PMS likely" color="indigo" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-4">
                    <InfoCard
                        icon={<Leaf />}
                        title="Healthy Period Practices"
                        onClick={() => setIsPracticesModalOpen(true)}
                    />
                    <InfoCard
                        icon={<ShieldQuestion />}
                        title="Breaking Myths"
                        onClick={() => setIsMythsModalOpen(true)}
                    />
                </div>
            </div>
          </Card>
        </div>

        {/* --- Daily Log Section --- */}
        <section id="logs-section" className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
          <Card title={`Logs: ${selectedDate}`}>
            <div className="text-sm text-gray-500 mb-4">
              Select a date from calendar, then tap chips to record. Auto-saved.
            </div>
            <ChipGroup title="Menstruation Flow" type="single" value={logs[selectedDate]?.flow || ""}
              onChange={(val) => setLog(selectedDate, (b) => ({ ...b, flow: val === b.flow ? "" : val }))}
              items={[{ label: "Light", icon: <Droplet size={16} /> }, { label: "Medium", icon: <Droplet size={16} /> }, { label: "Heavy", icon: <Droplet size={16} /> }, { label: "Spotting", icon: <Droplet size={16} /> }]}
              color="red"
            />
            <ChipGroup title="Moods" type="multi" value={logs[selectedDate]?.moods || []}
              onChange={(arr) => setLog(selectedDate, (b) => ({ ...b, moods: arr }))}
              items={[{ label: "Neutral", icon: <Smile size={16} /> }, { label: "Happy", icon: <Smile size={16} /> }, { label: "Sad", icon: <Frown size={16} /> }, { label: "Sensitive", icon: <Heart size={16} /> }]}
              color="pink"
            />
            <ChipGroup title="Physical Activity" type="multi" value={logs[selectedDate]?.activities || []}
              onChange={(arr) => setLog(selectedDate, (b) => ({ ...b, activities: arr }))}
              items={[{ label: "Gym", icon: <Dumbbell size={16} /> }, { label: "Walking", icon: <Footprints size={16} /> }, { label: "Running", icon: <Activity size={16} /> }, { label: "Cycling", icon: <Bike size={16} /> }]}
              color="purple"
            />
            <ChipGroup title="Other Body Symptoms" type="multi" value={logs[selectedDate]?.other || []}
              onChange={(arr) => setLog(selectedDate, (b) => ({ ...b, other: arr }))}
              items={[{ label: "Bloating", icon: <Cloud size={16} /> }, { label: "Fatigue", icon: <Bed size={16} /> }, { label: "Nausea", icon: <AlertCircle size={16} /> }, { label: "Insomnia", icon: <Bed size={16} /> }]}
              color="blue"
            />
            <ChipGroup title="Signs" type="multi" value={logs[selectedDate]?.signs || []}
              onChange={(arr) => setLog(selectedDate, (b) => ({ ...b, signs: arr }))}
              items={[{ label: "All Good", icon: <Smile size={16} /> }, { label: "Cramps", icon: <AlertCircle size={16} /> }, { label: "Headache", icon: <Frown size={16} /> }, { label: "Acne", icon: <AlertCircle size={16} /> }]}
              color="violet"
            />
            <ChipGroup title="Energy Levels" type="single" value={logs[selectedDate]?.energy || ""}
              onChange={(val) => setLog(selectedDate, (b) => ({ ...b, energy: val === b.energy ? "" : val }))}
              items={[{ label: "High", icon: <Zap size={16} /> }, { label: "Medium", icon: <Zap size={16} /> }, { label: "Low", icon: <Zap size={16} /> }, { label: "Exhausted", icon: <Bed size={16} /> }]}
              color="gray"
            />
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-600 mb-2">Add Personal Notes</label>
              <textarea
                rows="4"
                value={logs[selectedDate]?.notes || ""}
                onChange={(e) => setLog(selectedDate, (b) => ({ ...b, notes: e.target.value }))}
                placeholder="Write your notes here..."
                className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-400"
              />
            </div>
          </Card>

          <Card title="Today's Snapshot">
            <SummaryBlock dateStr={selectedDate} logs={logs} schedule={schedule} />
          </Card>
        </section>

        {/* --- Nearby Stores Section --- */}
        <section ref={storesRef} className="mt-10">
          <Card>
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
              <h3 className="text-xl font-semibold flex items-center gap-3">
                <Store size={24} className="text-blue-500" /> Nearby Stores Availability
              </h3>
              <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                <div className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 bg-gray-50 focus-within:ring-2 focus-within:ring-blue-400 transition">
                  <Search size={18} className="text-gray-400 shrink-0" />
                  <input
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                    placeholder="Search brand / store..."
                    className="bg-transparent outline-none text-sm w-full"
                  />
                </div>
                <div className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 bg-gray-50 focus-within:ring-2 focus-within:ring-blue-400 transition">
                  <MapPin size={18} className="text-gray-400 shrink-0" />
                  <input
                    value={storeArea}
                    onChange={(e) => setStoreArea(e.target.value)}
                    placeholder="Area / City"
                    className="bg-transparent outline-none text-sm w-full"
                  />
                </div>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredStores.map((s) => (
                <div key={s.id} className="border border-gray-200 rounded-2xl p-4 bg-white hover:shadow-lg transition-shadow">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-semibold">{s.name}</div>
                      <div className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                        <MapPin size={14} /> {s.area} • {s.distanceKm} km
                      </div>
                    </div>
                  </div>
                  <div className="mt-3 border-t border-gray-100 pt-3 space-y-2">
                    {s.items.map((it, idx) => (
                      <div key={idx} className="flex items-center justify-between text-sm">
                        <span className="font-medium text-gray-700">{it.brand}</span>
                        <div className="flex-1 text-right text-gray-500">
                          <span>₹{it.price}</span>
                        </div>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ml-2
                          ${it.stock === "In Stock" ? "bg-emerald-100 text-emerald-700"
                            : it.stock === "Low Stock" ? "bg-amber-100 text-amber-700"
                              : "bg-rose-100 text-rose-700"}`}>
                          {it.stock}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              {filteredStores.length === 0 && (
                <div className="col-span-full text-center text-gray-500 py-6">No stores found with that name or area.</div>
              )}
            </div>
          </Card>
        </section>

      </main>

      {/* Info Modals */}
      <InfoModal
        isOpen={isPracticesModalOpen}
        onClose={() => setIsPracticesModalOpen(false)}
        title="Healthy Period Practices"
        data={HEALTHY_PRACTICES_DETAILS}
      />

      <InfoModal
        isOpen={isMythsModalOpen}
        onClose={() => setIsMythsModalOpen(false)}
        title="Breaking Myths"
        data={BREAKING_MYTHS_DETAILS}
      />

      <Footer />
    </>
  );
};

// ====================== UI Subcomponents (Refined) ======================
const Card = ({ title, children, className = "", innerRef }) => (
  <div ref={innerRef} className={`bg-white shadow-xl rounded-3xl p-8 border border-gray-200/50 ${className}`}>
    {title && <h3 className="text-xl font-semibold text-gray-800 mb-6">{title}</h3>}
    {children}
  </div>
);

const JumpButton = ({ icon, label, onClick }) => (
  <button
    onClick={onClick}
    className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 text-sm font-medium transition-all shadow-sm hover:shadow-md"
  >
    {icon} <span className="hidden sm:inline">{label}</span>
  </button>
);

const InputRow = ({ label, children }) => (
  <div className="mb-5">
    <label className="block text-sm font-medium text-gray-600 mb-2">{label}</label>
    {children}
  </div>
);

const LegendPill = ({ colorClass, label }) => (
  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${colorClass}`}>{label}</span>
);

const colorMap = {
  red: "bg-red-100 text-red-700",
  pink: "bg-pink-100 text-pink-700",
  purple: "bg-purple-100 text-purple-700",
  blue: "bg-blue-100 text-blue-700",
  violet: "bg-violet-100 text-violet-700",
  gray: "bg-gray-100 text-gray-700",
  rose: "bg-rose-100 text-rose-700",
  emerald: "bg-emerald-100 text-emerald-700",
  indigo: "bg-indigo-100 text-indigo-700",
};

const Chip = ({ active, onClick, children, color = "gray" }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200
    ${active ? "bg-gray-900 text-white shadow-md" : `hover:bg-gray-200 ${colorMap[color]}`}`}
  >
    {children}
  </button>
);

const ChipGroup = ({ title, type, value, onChange, items, color }) => {
  const handleClick = (label) => {
    if (type === "single") {
      onChange(label === value ? "" : label);
      return;
    }
    const set = new Set(value || []);
    if (set.has(label)) set.delete(label);
    else set.add(label);
    onChange([...set]);
  };

  return (
    <div className="mb-5">
      <h3 className="text-sm font-semibold text-gray-600 mb-2">{title}</h3>
      <div className="flex flex-wrap gap-2">
        {items.map((it, idx) => {
          const active = type === "single" ? value === it.label : (value || []).includes(it.label);
          return (
            <Chip key={idx} active={active} color={color} onClick={() => handleClick(it.label)}>
              {it.icon} {it.label}
            </Chip>
          );
        })}
      </div>
    </div>
  );
};

const PhaseCard = ({ title, text, color }) => (
  <div className={`rounded-xl border border-gray-200/50 p-4 transition-all hover:scale-105 shadow-sm hover:shadow-lg ${colorMap[color]}`}>
    <h4 className="font-bold text-gray-800 mb-1">{title}</h4>
    <p className="text-sm text-gray-600">{text}</p>
  </div>
);

const InfoCard = ({ icon, title, onClick }) => {
  return (
    <div
      className="rounded-xl border border-gray-200/50 p-4 cursor-pointer shadow-sm hover:shadow-md transition bg-white"
      onClick={onClick}
    >
      <div className="flex items-center gap-2 text-gray-800 font-semibold mb-2">
        {icon} {title}
      </div>
    </div>
  );
};

const InfoModal = ({ isOpen, onClose, title, data }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white rounded-3xl p-8 max-w-lg w-full max-h-[90vh] overflow-y-auto relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-3xl font-bold"
        >
          &times;
        </button>
        <div className="flex items-center gap-3 text-2xl font-semibold mb-4 text-gray-800">
          {title}
        </div>
        <div className="text-base text-gray-700 space-y-4">
          {data.map((item, index) => (
            <div key={index}>
              <h4 className="font-semibold text-gray-900">{item.title}</h4>
              <p>{item.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};


const SummaryBlock = ({ dateStr, logs, schedule }) => {
  const l = logs[dateStr];
  const phase = schedule[dateStr] ?? "none";
  return (
    <div className="text-lg text-gray-700 space-y-3">
      <div>
        <span className="font-semibold text-gray-500">Phase: </span>
        <span className="font-semibold capitalize">{phase === "none" ? "—" : phase}</span>
      </div>
      <div>
        <span className="font-semibold text-gray-500">Flow: </span>
        <span className="font-semibold">{l?.flow || "—"}</span>
      </div>
      <RowList label="Moods" items={l?.moods} />
      <RowList label="Activities" items={l?.activities} />
      <RowList label="Symptoms" items={l?.other} />
      <RowList label="Signs" items={l?.signs} />
      <div>
        <span className="font-semibold text-gray-500">Energy: </span>
        <span className="font-semibold">{l?.energy || "—"}</span>
      </div>
      <div className="border-t border-gray-100 pt-3">
        <div className="font-semibold text-gray-500">Notes</div>
        <div className="text-gray-800">{l?.notes?.trim() || "—"}</div>
      </div>
    </div>
  );
};

const RowList = ({ label, items }) => (
  <div>
    <span className="font-semibold text-gray-500">{label}: </span>
    <span className="font-semibold">{items?.length ? items.join(", ") : "—"}</span>
  </div>
);

export default MenstrualTracker;