import { Plus, Clock, Settings, MoreVertical, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

export function Sidebar() {
    return (
        <div className="w-[300px] flex-shrink-0 bg-white border-r border-slate-200 flex flex-col h-screen font-sans">
            {/* Header */}
            <div className="p-6">
                <div className="flex items-center gap-3 mb-8">
                    <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
                        <Sparkles className="w-5 h-5 text-white fill-white" />
                    </div>
                    <div>
                        <h1 className="font-bold text-slate-900 text-lg leading-tight">Tambo AI</h1>
                        <p className="text-xs text-slate-500 font-medium">Adaptive Learning</p>
                    </div>
                </div>

                <button className="w-full bg-primary text-white font-semibold h-12 rounded-xl flex items-center justify-center gap-2 hover:bg-blue-700 transition-all shadow-md shadow-primary/20">
                    <Plus className="w-5 h-5" />
                    New Chat
                </button>
            </div>

            {/* Recent Assessments */}
            <div className="px-4 flex-1 overflow-y-auto">
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider px-4 mb-3">
                    Recent Assessments
                </div>
                <div className="space-y-1">
                    {[
                        "Intro to Photosynthesis",
                        "Cell Biology Basics",
                        "World War II Overview",
                        "Organic Chemistry 101"
                    ].map((item, i) => (
                        <button
                            key={i}
                            className={cn(
                                "w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-colors flex items-center gap-3",
                                i === 0 ? "bg-blue-50 text-blue-700" : "text-slate-600 hover:bg-slate-50"
                            )}
                        >
                            <Clock className={cn("w-4 h-4", i === 0 ? "text-blue-500" : "text-slate-400")} />
                            <span className="truncate">{item}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* User Footer */}
            <div className="p-4 border-t border-slate-200">
                <button className="w-full flex items-center gap-3 px-2 py-2 text-slate-600 hover:text-slate-900 mb-2">
                    <Settings className="w-5 h-5 text-slate-400" />
                    <span className="text-sm font-medium">Settings</span>
                </button>
                <div className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 cursor-pointer transition-colors">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-orange-200 flex items-center justify-center text-orange-600 font-bold border-2 border-white shadow-sm">
                            AJ
                        </div>
                        <div>
                            <p className="text-sm font-bold text-slate-900">Alex Johnson</p>
                            <p className="text-xs text-slate-500">Premium Plan</p>
                        </div>
                    </div>
                    <MoreVertical className="w-5 h-5 text-slate-400" />
                </div>
            </div>
        </div>
    );
}
