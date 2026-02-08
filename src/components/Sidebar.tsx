import { Plus, Settings, MoreVertical, Sparkles } from "lucide-react";

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
                        <h1 className="font-bold text-slate-900 text-lg leading-tight">StudBud</h1>
                        <p className="text-xs text-slate-500 font-medium">Adaptive Learning</p>
                    </div>
                </div>

                <button className="w-full bg-primary text-white font-semibold h-12 rounded-xl flex items-center justify-center gap-2 hover:bg-blue-700 transition-all shadow-md shadow-primary/20">
                    <Plus className="w-5 h-5" />
                    New Chat
                </button>
            </div>

            {/* Recent Assessments Removed */}

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
