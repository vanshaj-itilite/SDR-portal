import { useState } from "react";
import { Plus, Phone, Mail, Calendar, MessageSquare } from "lucide-react";
import "./Tasks.css";

type Task = {
  id: number;
  title: string;
  type: "Call" | "Email" | "Meeting" | "Follow-up";
  related: string;
  dueDate: string;
  priority: "High" | "Medium" | "Low";
  done: boolean;
};

const INITIAL_TASKS: Task[] = [
  { id: 1, title: "Call Arjun Mehta for product demo", type: "Call", related: "Arjun Mehta (InfraCloud)", dueDate: "Today", priority: "High", done: false },
  { id: 2, title: "Send demo recording to Priya Nair", type: "Email", related: "Priya Nair (FinEdge)", dueDate: "Today", priority: "High", done: false },
  { id: 3, title: "Cold call 10 leads from segment A", type: "Call", related: "—", dueDate: "Today", priority: "Medium", done: false },
  { id: 4, title: "Follow up on proposal with Deepak Joshi", type: "Follow-up", related: "Deepak Joshi (TechVault)", dueDate: "Tomorrow", priority: "High", done: false },
  { id: 5, title: "Schedule intro call with Meera Iyer", type: "Meeting", related: "Meera Iyer (Nexify)", dueDate: "Tomorrow", priority: "Medium", done: false },
  { id: 6, title: "Send LinkedIn connection requests (20)", type: "Email", related: "—", dueDate: "Aug 31", priority: "Low", done: false },
  { id: 7, title: "Update CRM with call notes", type: "Follow-up", related: "—", dueDate: "Aug 31", priority: "Low", done: true },
  { id: 8, title: "Weekly pipeline review prep", type: "Meeting", related: "—", dueDate: "Sep 1", priority: "Medium", done: false },
];

const TYPE_ICON = {
  Call: Phone,
  Email: Mail,
  Meeting: Calendar,
  "Follow-up": MessageSquare,
};

const PRIORITY_COLOR: Record<string, string> = {
  High: "red",
  Medium: "orange",
  Low: "blue",
};

const FILTERS = ["All", "Today", "Tomorrow", "Upcoming"];

export default function Tasks() {
  const [tasks, setTasks] = useState(INITIAL_TASKS);
  const [filter, setFilter] = useState("All");

  const toggle = (id: number) =>
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));

  const filtered = tasks.filter((t) => {
    if (filter === "Today") return t.dueDate === "Today";
    if (filter === "Tomorrow") return t.dueDate === "Tomorrow";
    if (filter === "Upcoming") return t.dueDate !== "Today" && t.dueDate !== "Tomorrow";
    return true;
  });

  const pending = filtered.filter((t) => !t.done);
  const done = filtered.filter((t) => t.done);

  return (
    <div className="tasks-page">
      <div className="page-toolbar">
        <div className="filter-tabs">
          {FILTERS.map((f) => (
            <button
              key={f}
              className={`filter-tab ${filter === f ? "active" : ""}`}
              onClick={() => setFilter(f)}
            >
              {f}
            </button>
          ))}
        </div>
        <button className="btn-primary">
          <Plus size={15} /> Add Task
        </button>
      </div>

      <div className="tasks-section">
        <div className="tasks-section-label">
          Pending <span className="count">{pending.length}</span>
        </div>
        {pending.map((t) => <TaskRow key={t.id} task={t} onToggle={toggle} />)}
        {pending.length === 0 && <p className="empty-msg">All caught up!</p>}
      </div>

      {done.length > 0 && (
        <div className="tasks-section">
          <div className="tasks-section-label">
            Completed <span className="count">{done.length}</span>
          </div>
          {done.map((t) => <TaskRow key={t.id} task={t} onToggle={toggle} />)}
        </div>
      )}
    </div>
  );
}

function TaskRow({ task, onToggle }: { task: Task; onToggle: (id: number) => void }) {
  const Icon = TYPE_ICON[task.type];
  return (
    <div className={`task-row ${task.done ? "task-row-done" : ""}`}>
      <button className={`task-check ${task.done ? "task-check-done" : ""}`} onClick={() => onToggle(task.id)}>
        {task.done && "✓"}
      </button>
      <div className={`task-type-icon type-${task.type.toLowerCase().replace("-", "")}`}>
        <Icon size={14} />
      </div>
      <div className="task-info">
        <span className="task-title">{task.title}</span>
        <span className="task-related">{task.related}</span>
      </div>
      <div className="task-meta">
        <span className={`pill pill-${PRIORITY_COLOR[task.priority]}`}>{task.priority}</span>
        <span className="task-due">{task.dueDate}</span>
      </div>
    </div>
  );
}
