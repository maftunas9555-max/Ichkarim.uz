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
        <h1 className="text-xl font-bold text-[var(--color-foreground)] ml-4 drop-shadow-sm">Rejalarim</h1>
      </div>

      {/* Neuroplasticity Section */}
      <div className="neu-card p-5 mb-6 border border-[var(--color-soft-red)]/20 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
          <Brain className="w-24 h-24 text-[var(--color-foreground)]" />
        </div>
        <div className="flex items-center gap-3 mb-3">
          <div className="p-2 rounded-full bg-[var(--background)] shadow-[inset_2px_2px_5px_rgba(215,200,160,0.6),inset_-2px_-2px_5px_rgba(255,255,255,0.9)]">
            <Brain className="w-5 h-5 text-[var(--color-soft-red)]" />
          </div>
          <h2 className="font-bold text-[var(--color-foreground)]">Neyroplastiklik</h2>
        </div>
        <p className="text-xs text-[var(--color-muted-text)] font-medium leading-relaxed">
          Miyangiz har safar yangi ish qilganingizda yoki eski odatni o'zgartirganingizda 
          jismonan o'zgaradi (neyroplastiklik). Kichik qadamlar bilan reja tuzib, ularni 
          bajarish yangi, kuchli asab tolalarini shakllantiradi.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 bg-[var(--background)] p-1 rounded-2xl shadow-[inset_4px_4px_10px_rgba(215,200,160,0.6),inset_-4px_-4px_10px_rgba(255,255,255,0.9)]">
        {[
          { id: "kunlik", label: "Kunlik" },
          { id: "haftalik", label: "Haftalik" },
          { id: "uzoq", label: "Uzoq muddat" }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as TaskType)}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
              activeTab === tab.id 
                ? "bg-[var(--color-soft-red)] text-white shadow-md" 
                : "text-[var(--color-muted-text)] hover:text-[var(--color-foreground)]"
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
          className="flex-1 h-12 neu-input rounded-xl px-4 text-[var(--color-foreground)] text-sm placeholder:text-[var(--color-muted-text)]/50"
        />
        <button
          onClick={addTask}
          disabled={!newTaskText.trim()}
          className="h-12 w-12 flex items-center justify-center neu-button text-[var(--color-soft-red)] rounded-xl disabled:opacity-50"
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>

      {/* Task List */}
      <div className="flex flex-col gap-3">
        {filteredTasks.length === 0 ? (
          <div className="text-center py-10 text-[var(--color-muted-text)] text-sm font-medium">
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
                    ? 'border-[var(--color-soft-red)] bg-[var(--color-soft-red)] text-white' 
                    : 'border-[var(--color-muted-text)]/30 text-transparent'
                }`}
              >
                <Check className="w-3.5 h-3.5" />
              </button>
              
              <div className="flex-1">
                <p className={`text-sm font-semibold text-[var(--color-foreground)] transition-all ${task.completed ? 'line-through text-[var(--color-muted-text)]' : ''}`}>
                  {task.text}
                </p>
                <div className="flex items-center gap-1.5 mt-1 text-[10px] font-bold text-[var(--color-muted-text)]">
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
