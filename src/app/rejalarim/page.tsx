"use client";

import { useState, useEffect } from "react";
import { ArrowLeft, Plus, Check, Brain, Calendar, Trash2 } from "lucide-react";
import Link from "next/link";

type TaskType = "kunlik" | "haftalik" | "uzoq";

interface Task {
  id: string;
  text: string;
  completed: boolean;
  type: TaskType;
  date: string;
}

export default function Rejalarim() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskText, setNewTaskText] = useState("");
  const [activeTab, setActiveTab] = useState<TaskType>("kunlik");

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("ichkarim_tasks");
    if (saved) {
      try {
        setTasks(JSON.parse(saved));
      } catch (e) {}
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem("ichkarim_tasks", JSON.stringify(tasks));
  }, [tasks]);

  const addTask = () => {
    if (!newTaskText.trim()) return;
    const newTask: Task = {
      id: Date.now().toString(),
      text: newTaskText,
      completed: false,
      type: activeTab,
      date: new Date().toLocaleDateString("uz-UZ")
    };
    setTasks([newTask, ...tasks]);
    setNewTaskText("");
  };

  const toggleTask = (id: string) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  const filteredTasks = tasks.filter(t => t.type === activeTab);

  return (
    <div className="flex flex-col min-h-screen px-5 pt-6 pb-24">
      <div className="flex items-center mb-6">
        <Link href="/" className="neu-button p-2 text-[var(--color-muted-text)] hover:text-[var(--color-foreground)]">
          <ArrowLeft className="w-6 h-6" />
        </Link>
        <h1 className="text-2xl font-bold text-[var(--color-text-dark)] ml-4 drop-shadow-sm font-serif">Rejalarim</h1>
      </div>

      {/* Neuroplasticity Section */}
      <div className="neu-card p-5 mb-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
          <Brain className="w-24 h-24 text-[var(--color-green-top)]" />
        </div>
        <div className="flex items-center gap-3 mb-3">
          <div className="p-2 rounded-full bg-white shadow-sm">
            <Brain className="w-5 h-5 text-[var(--color-green-top)]" />
          </div>
          <h2 className="font-bold text-[var(--color-text-dark)] font-serif text-lg">Neyroplastiklik</h2>
        </div>
        <p className="text-xs text-[var(--color-text-muted)] font-medium leading-relaxed">
          Miyangiz har safar yangi ish qilganingizda yoki eski odatni o'zgartirganingizda 
          jismonan o'zgaradi (neyroplastiklik). Kichik qadamlar bilan reja tuzib, ularni 
          bajarish yangi, kuchli asab tolalarini shakllantiradi.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 bg-[var(--color-card)] p-1 rounded-full shadow-sm">
        {[
          { id: "kunlik", label: "Kunlik" },
          { id: "haftalik", label: "Haftalik" },
          { id: "uzoq", label: "Uzoq muddat" }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as TaskType)}
            className={`flex-1 py-2 text-xs font-bold rounded-full transition-all ${
              activeTab === tab.id 
                ? "bg-[var(--color-text-dark)] text-white shadow-md" 
                : "text-[var(--color-text-muted)] hover:text-[var(--color-text-dark)]"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Input */}
      <div className="flex gap-2 mb-6">
        <input
          type="text"
          value={newTaskText}
          onChange={(e) => setNewTaskText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addTask()}
          placeholder="Yangi reja qo'shish..."
          className="flex-1 h-12 neu-input rounded-full px-4 text-[var(--color-text-dark)] text-sm placeholder:text-[var(--color-text-muted)]/50"
        />
        <button
          onClick={addTask}
          disabled={!newTaskText.trim()}
          className="h-12 w-12 flex items-center justify-center bg-[var(--color-green-top)] text-white rounded-full disabled:opacity-50 shadow-sm active:scale-95 transition-all"
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>

      {/* Task List */}
      <div className="flex flex-col gap-3">
        {filteredTasks.length === 0 ? (
          <div className="text-center py-10 text-[var(--color-text-muted)] text-sm font-medium">
            Hozircha vazifalar yo'q. Yangi reja tuzib, ong ostingizni o'zgartirishni boshlang.
          </div>
        ) : (
          filteredTasks.map(task => (
            <div 
              key={task.id}
              className={`neu-card p-4 flex items-start gap-3 transition-all ${task.completed ? 'opacity-60' : ''}`}
            >
              <button 
                onClick={() => toggleTask(task.id)}
                className={`mt-0.5 flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                  task.completed 
                    ? 'border-[var(--color-green-top)] bg-[var(--color-green-top)] text-white' 
                    : 'border-[var(--color-text-muted)]/30 text-transparent'
                }`}
              >
                <Check className="w-3.5 h-3.5" />
              </button>
              
              <div className="flex-1">
                <p className={`text-sm font-semibold text-[var(--color-text-dark)] transition-all ${task.completed ? 'line-through text-[var(--color-text-muted)]' : ''}`}>
                  {task.text}
                </p>
                <div className="flex items-center gap-1.5 mt-1 text-[10px] font-bold text-[var(--color-text-muted)]">
                  <Calendar className="w-3 h-3" />
                  <span>{task.date}</span>
                </div>
              </div>

              <button 
                onClick={() => deleteTask(task.id)}
                className="p-2 text-[var(--color-muted-text)]/50 hover:text-red-500 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
