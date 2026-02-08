import { Bell, Search, UploadCloud, ChevronDown, Check, Zap, ArrowRight, FileText, Plus, Loader2, X } from "lucide-react";
import { useState, useRef } from "react";

interface InteractiveModelProps {
    onNavigate: (view: 'chat' | 'file' | 'dashboard') => void;
    onStartAssessment: (prompt: string) => void;
}

export function InteractiveModel({ onNavigate, onStartAssessment }: InteractiveModelProps) {
    const [fileDragging, setFileDragging] = useState(false);
    const [topic, setTopic] = useState("");
    const [audience, setAudience] = useState("Undergraduate");
    const [complexity, setComplexity] = useState("Standard Adaptive");
    const [fileContent, setFileContent] = useState<string | null>(null);
    const [fileName, setFileName] = useState<string | null>(null);
    const [isReading, setIsReading] = useState(false);

    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) await processFile(file);
    };

    const processFile = async (file: File) => {
        setFileName(file.name);
        setIsReading(true);
        try {
            const text = await file.text();
            setFileContent(text);
        } catch (error) {
            console.error("Error reading file:", error);
            alert("Failed to read file.");
        } finally {
            setIsReading(false);
        }
    };

    const handleDrop = async (e: React.DragEvent) => {
        e.preventDefault();
        setFileDragging(false);
        const file = e.dataTransfer.files?.[0];
        if (file) await processFile(file);
    };

    const handleGenerate = () => {
        if (!fileContent && !topic) {
            alert("Please provide a file or a topic.");
            return;
        }

        const prompt = `
Context:
- Topic: ${topic || "General"}
- Audience: ${audience}
- Complexity: ${complexity}

Content:
${fileContent ? fileContent.slice(0, 20000) : "No file provided."}

Please generate an assessment based on the above context and content.
        `.trim();

        onStartAssessment(prompt);
    };

    return (
        <div className="min-h-screen bg-background-light font-sans text-slate-900">
            {/* Header */}
            <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/80 backdrop-blur-md">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 items-center justify-between">
                        <div className="flex items-center gap-8">
                            <div className="flex items-center gap-2">
                                <div className="bg-primary p-1.5 rounded-lg">
                                    <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M44 11.2727C44 14.0109 39.8386 16.3957 33.69 17.6364C39.8386 18.877 44 21.2618 44 24C44 26.7382 39.8386 29.123 33.69 30.3636C39.8386 31.6043 44 33.9891 44 36.7273C44 40.7439 35.0457 44 24 44C12.9543 44 4 40.7439 4 36.7273C4 33.9891 8.16144 31.6043 14.31 30.3636C8.16144 29.123 4 26.7382 4 24C4 21.2618 8.16144 18.877 14.31 17.6364C8.16144 16.3957 4 14.0109 4 11.2727C4 7.25611 12.9543 4 24 4C35.0457 4 44 7.25611 44 11.2727Z" fill="currentColor"></path>
                                    </svg>
                                </div>
                                <span className="text-lg font-bold tracking-tight text-primary">Tambo AI</span>
                            </div>
                            <nav className="hidden md:flex items-center gap-6">
                                <a href="#" onClick={(e) => { e.preventDefault(); onNavigate('dashboard'); }} className="text-sm font-bold text-primary">Dashboard</a>
                                <a href="#" className="text-sm font-medium text-slate-500 hover:text-slate-800 transition-colors">Library</a>
                                <a href="#" className="text-sm font-medium text-slate-500 hover:text-slate-800 transition-colors">Analytics</a>
                            </nav>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="relative hidden md:block">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <input
                                    type="text"
                                    placeholder="Search assessments..."
                                    className="pl-10 pr-4 py-2 bg-slate-100 border-none rounded-lg text-sm focus:ring-2 focus:ring-primary/20 w-64"
                                />
                            </div>
                            <div className="flex items-center gap-3">
                                <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors relative">
                                    <Bell className="w-5 h-5" />
                                    <span className="absolute top-2 right-2.5 w-2 h-2 bg-blue-500 rounded-full border border-white"></span>
                                </button>
                                <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 overflow-hidden cursor-pointer">
                                    <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuBzFnLmcxKVLSV4dTzoe0POx68RDTO1naLLax002Mdo2xgZLNfV6GeAasU9pwCWC8Gs-eIH4LsKF60ZP_M6ZDJriM83rqHhWBbvVuaGab2wWPIo-9HBaB6elmVt2-ZQb9nfoYX1Yge3Yb_jJXCNgVcRjQh_9hMqdgjbhynyfjk3HLg40grSuTq9-yiP3Mp75qTN0glm86syUDjPGoV6YKh9IrGAQlkX3BUJ1A_VzmI_U6vsY2MY7qBZS8g7QUstPvV5XVeDoIVgzWey" alt="Avatar" className="w-full h-full object-cover" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

                {/* Hero Title */}
                <div className="text-center mb-10">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 text-xs font-bold uppercase tracking-wider mb-4 border border-indigo-100">
                        <Zap className="w-3 h-3 fill-indigo-600" /> AI-Powered Intelligence
                    </div>
                    <h1 className="text-4xl lg:text-5xl font-black text-slate-900 mb-4 tracking-tight">
                        Transform Content into Intelligence
                    </h1>
                    <p className="text-slate-500 text-lg max-w-2xl mx-auto">
                        Upload your source material and let our AI generate a personalized, adaptive assessment tailored to your learning objectives.
                    </p>
                </div>

                {/* Main Card */}
                <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-200 overflow-hidden mb-16">
                    {/* Card Header/Tabs */}
                    <div className="bg-white border-b border-slate-100 flex">
                        <div className="flex-1 py-4 text-center border-b-2 border-primary">
                            <span className="text-primary font-bold flex items-center justify-center gap-2">
                                <FileText className="w-4 h-4" /> Source Material
                            </span>
                        </div>
                        <div className="flex-1 py-4 text-center border-b border-slate-100 bg-slate-50/50 text-slate-400">
                            <span className="font-semibold flex items-center justify-center gap-2">
                                <Settings className="w-4 h-4" /> AI Configuration
                            </span>
                        </div>
                    </div>

                    <div className="p-8 bg-slate-700/90 text-white relative overflow-hidden">
                        {/* Background Texture/Noise could go here */}

                        <div className="flex flex-col lg:flex-row gap-12 relative z-10">
                            {/* Left: Upload */}
                            <div className="flex-1">
                                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">1. Provide Content</h3>
                                <div
                                    className={`bg-white rounded-2xl h-64 flex flex-col items-center justify-center border-2 border-dashed transition-all cursor-pointer relative overflow-hidden group
                                        ${fileDragging ? 'border-primary bg-blue-50/10' : 'border-slate-500/30 hover:border-primary/50'}
                                    `}
                                    onDragOver={(e) => { e.preventDefault(); setFileDragging(true); }}
                                    onDragLeave={() => setFileDragging(false)}
                                    onDrop={handleDrop}
                                    onClick={() => fileInputRef.current?.click()}
                                >
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        className="hidden"
                                        accept=".txt,.md,.csv,.json"
                                        onChange={handleFileSelect}
                                    />

                                    {isReading ? (
                                        <div className="flex flex-col items-center text-slate-900">
                                            <Loader2 className="w-8 h-8 animate-spin text-primary mb-2" />
                                            <p>Reading file...</p>
                                        </div>
                                    ) : fileName ? (
                                        <div className="flex flex-col items-center text-slate-900 relative z-20">
                                            <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mb-4">
                                                <Check className="w-8 h-8 text-green-500" />
                                            </div>
                                            <h4 className="text-slate-900 font-bold text-lg mb-1">{fileName}</h4>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setFileName(null);
                                                    setFileContent(null);
                                                }}
                                                className="mt-2 text-xs text-red-500 hover:underline flex items-center gap-1"
                                            >
                                                <X className="w-3 h-3" /> Remove
                                            </button>
                                        </div>
                                    ) : (
                                        <>
                                            <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                                <UploadCloud className="w-8 h-8 text-primary" />
                                            </div>
                                            <h4 className="text-slate-900 font-bold text-lg mb-1">Upload File</h4>
                                            <p className="text-slate-500 text-sm mb-6">Drag and drop file or click to browse</p>
                                            <button className="px-6 py-2.5 bg-primary text-white font-bold rounded-lg hover:bg-blue-600 transition-colors shadow-lg shadow-blue-500/25">
                                                Browse Files
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>

                            {/* Right: Context */}
                            <div className="flex-1">
                                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">2. Define Context</h3>
                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-slate-400 text-xs font-bold mb-2">Subject Matter / Topic</label>
                                        <div className="relative">
                                            <input
                                                type="text"
                                                value={topic}
                                                onChange={(e) => setTopic(e.target.value)}
                                                placeholder="e.g. Molecular Biology"
                                                className="w-full bg-slate-100 rounded-lg px-4 py-3 text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-slate-400 text-xs font-bold mb-2">Target Audience</label>
                                            <div className="relative">
                                                <select
                                                    value={audience}
                                                    onChange={(e) => setAudience(e.target.value)}
                                                    className="w-full bg-slate-100 rounded-lg px-4 py-3 appearance-none cursor-pointer text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary"
                                                >
                                                    <option>High School</option>
                                                    <option>Undergraduate</option>
                                                    <option>Graduate</option>
                                                    <option>Professional</option>
                                                </select>
                                                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-slate-400 text-xs font-bold mb-2">Complexity</label>
                                            <div className="relative">
                                                <select
                                                    value={complexity}
                                                    onChange={(e) => setComplexity(e.target.value)}
                                                    className="w-full bg-slate-100 rounded-lg px-4 py-3 appearance-none cursor-pointer text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary"
                                                >
                                                    <option>Beginner</option>
                                                    <option>Standard Adaptive</option>
                                                    <option>Advanced</option>
                                                    <option>Expert</option>
                                                </select>
                                                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="pt-4 border-t border-slate-600/30 flex items-center justify-between">
                                        {/* Toggles */}
                                        <div className="flex items-center gap-6">
                                            <label className="flex items-center gap-3 cursor-pointer group">
                                                <div className="w-10 h-6 bg-primary rounded-full relative transition-colors">
                                                    <div className="absolute top-1 left-5 w-4 h-4 bg-white rounded-full shadow-sm transition-all"></div>
                                                </div>
                                                <span className="text-sm font-semibold text-slate-300 group-hover:text-white transition-colors">Adaptive Scaling</span>
                                            </label>
                                            <label className="flex items-center gap-3 cursor-pointer group">
                                                <div className="w-10 h-6 bg-slate-600 rounded-full relative transition-colors">
                                                    <div className="absolute top-1 left-1 w-4 h-4 bg-white/50 rounded-full shadow-sm transition-all"></div>
                                                </div>
                                                <span className="text-sm font-semibold text-slate-400 group-hover:text-slate-300 transition-colors">Auto-Grading</span>
                                            </label>
                                        </div>
                                        <div className="flex items-center gap-2 text-primary font-bold text-sm">
                                            <div className="w-4 h-4 rounded-full bg-primary flex items-center justify-center">
                                                <Check className="w-3 h-3 text-white" strokeWidth={4} />
                                            </div>
                                            Tambo AI Engine Ready
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="px-8 py-6 bg-white border-t border-slate-200 flex items-center justify-between">
                        <div className="flex items-center gap-2 text-slate-400 text-xs font-medium">
                            <div className="w-4 h-4 rounded-full bg-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-500">i</div>
                            Estimated generation time: 45-60 seconds
                        </div>
                        <button
                            onClick={handleGenerate}
                            className={`px-8 py-3 font-bold rounded-lg transition-all shadow-lg flex items-center gap-2
                                ${(fileContent || topic) ? 'bg-primary text-white hover:bg-blue-700 shadow-primary/25' : 'bg-slate-300 text-slate-500 cursor-not-allowed shadow-none'}
                            `}
                            disabled={!fileContent && !topic}
                        >
                            <Zap className={`w-4 h-4 ${(!fileContent && !topic) ? 'fill-slate-500' : 'fill-white'}`} />
                            Generate Assessment
                        </button>
                    </div>
                </div>

                {/* Recent Assessments */}
                <div>
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                            <div className="p-1 rounded bg-slate-100">
                                <svg className="w-4 h-4 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            Recent Assessments
                        </h3>
                        <button className="text-primary text-sm font-bold hover:text-blue-700">View All</button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Card 1 */}
                        <div className="bg-slate-600 rounded-xl p-6 relative overflow-hidden group cursor-pointer hover:shadow-xl transition-all">
                            <div className="absolute top-0 right-0 p-4">
                                <span className="text-[10px] font-bold bg-white/10 text-white px-2 py-1 rounded border border-white/10">READY</span>
                            </div>
                            <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center mb-16">
                                <svg className="w-6 h-6 text-green-400" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z" /></svg>
                            </div>
                            <h4 className="text-white font-bold text-lg mb-1">Cell Biology Final</h4>
                            <p className="text-slate-400 text-xs mb-4">Generated 2 hours ago • 45 Questions</p>
                            <div className="flex items-center justify-between">
                                <div className="flex -space-x-2">
                                    <div className="w-6 h-6 rounded-full bg-slate-500 border border-slate-600"></div>
                                    <div className="w-6 h-6 rounded-full bg-slate-400 border border-slate-600"></div>
                                    <div className="w-6 h-6 rounded-full bg-slate-300 border border-slate-600"></div>
                                </div>
                                <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-white transition-colors" />
                            </div>
                        </div>

                        {/* Card 2 */}
                        <div className="bg-slate-600 rounded-xl p-6 relative overflow-hidden group cursor-pointer hover:shadow-xl transition-all">
                            <div className="absolute top-0 right-0 p-4">
                                <span className="text-[10px] font-bold bg-white/10 text-white px-2 py-1 rounded border border-white/10">READY</span>
                            </div>
                            <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center mb-16">
                                <span className="text-blue-400 font-serif font-bold text-xl">Σ</span>
                            </div>
                            <h4 className="text-white font-bold text-lg mb-1">Linear Algebra II</h4>
                            <p className="text-slate-400 text-xs mb-4">Generated yesterday • 20 Questions</p>
                            <div className="flex items-center justify-between">
                                <div className="flex -space-x-2">
                                    <div className="w-6 h-6 rounded-full bg-blue-500 border border-slate-600"></div>
                                    <div className="w-6 h-6 rounded-full bg-blue-400 border border-slate-600"></div>
                                </div>
                                <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-white transition-colors" />
                            </div>
                        </div>

                        {/* New Draft Card */}
                        <div className="bg-transparent rounded-xl p-6 border-2 border-dashed border-slate-300 flex flex-col items-center justify-center h-full hover:border-primary hover:bg-slate-50 transition-all cursor-pointer group min-h-[240px]">
                            <div className="w-12 h-12 rounded-full border border-slate-300 flex items-center justify-center mb-3 group-hover:border-primary group-hover:text-primary transition-colors text-slate-400">
                                <Plus className="w-6 h-6" />
                            </div>
                            <span className="font-bold text-slate-500 group-hover:text-primary transition-colors">New Draft</span>
                        </div>
                    </div>
                </div>
            </main>

            <footer className="mt-20 py-8 border-t border-slate-200 bg-white/50">
                <div className="max-w-7xl mx-auto px-4 text-xs text-slate-500 flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-green-500"></span> Systems Operational
                    </div>
                    <div className="flex gap-8">
                        <a href="#" className="hover:text-primary">Documentation</a>
                        <a href="#" className="hover:text-primary">Support Center</a>
                        <a href="#" className="hover:text-primary">API Keys</a>
                    </div>
                    <div>
                        © 2024 Tambo AI React SDK. All rights reserved.
                    </div>
                </div>
            </footer>
        </div>
    );
}

// Adding settings icon for reuse
function Settings({ className }: { className?: string }) {
    return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
    )
}
