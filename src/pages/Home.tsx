
interface HomeProps {
    onStart: () => void;
}

export function Home({ onStart }: HomeProps) {
    return (
        <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 transition-colors duration-300 font-sans min-h-screen">
            {/* TopNavBar */}
            <header className="sticky top-0 z-50 w-full border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-background-dark/80 backdrop-blur-md">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="bg-primary p-1.5 rounded-lg">
                                <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M44 11.2727C44 14.0109 39.8386 16.3957 33.69 17.6364C39.8386 18.877 44 21.2618 44 24C44 26.7382 39.8386 29.123 33.69 30.3636C39.8386 31.6043 44 33.9891 44 36.7273C44 40.7439 35.0457 44 24 44C12.9543 44 4 40.7439 4 36.7273C4 33.9891 8.16144 31.6043 14.31 30.3636C8.16144 29.123 4 26.7382 4 24C4 21.2618 8.16144 18.877 14.31 17.6364C8.16144 16.3957 4 14.0109 4 11.2727C4 7.25611 12.9543 4 24 4C35.0457 4 44 7.25611 44 11.2727Z" fill="currentColor"></path>
                                </svg>
                            </div>
                            <span className="text-xl font-bold tracking-tight">Tambo AI</span>
                        </div>
                        <nav className="hidden md:flex items-center gap-8">
                            <a href="#" className="text-sm font-medium hover:text-primary transition-colors">Features</a>
                            <a href="#" className="text-sm font-medium hover:text-primary transition-colors">How it Works</a>
                            <a href="#" className="text-sm font-medium hover:text-primary transition-colors">Pricing</a>
                            <a href="#" className="text-sm font-medium hover:text-primary transition-colors">Docs</a>
                        </nav>
                        <div className="flex items-center gap-3">
                            <button className="px-4 py-2 text-sm font-semibold hover:text-primary transition-colors">Login</button>
                            <button
                                onClick={onStart}
                                className="px-5 py-2.5 bg-primary text-white text-sm font-bold rounded-lg hover:bg-blue-700 transition-all shadow-lg shadow-primary/20 cursor-pointer"
                            >
                                Get Started
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            <main>
                {/* Hero Section */}
                <section className="relative overflow-hidden pt-16 pb-24 lg:pt-32 lg:pb-32">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                            <div className="flex flex-col gap-8">
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider w-fit">
                                    <span className="relative flex h-2 w-2">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                                    </span>
                                    Now powered by GPT-4o
                                </div>
                                <h1 className="text-5xl lg:text-7xl font-black leading-tight tracking-tight text-slate-900 dark:text-white">
                                    Assessments that <span className="text-primary">Adapt</span> in Real-Time
                                </h1>
                                <p className="text-lg lg:text-xl text-slate-600 dark:text-slate-400 leading-relaxed max-w-xl">
                                    Leverage the Tambo AI SDK to create dynamic, generative test interfaces that personalize the learning journey for every student based on performance.
                                </p>
                                <div className="flex flex-wrap gap-4">
                                    <button
                                        onClick={onStart}
                                        className="px-8 py-4 bg-primary text-white font-bold rounded-xl hover:bg-blue-700 transition-all shadow-xl shadow-primary/25 text-lg cursor-pointer"
                                    >
                                        Start Building Free
                                    </button>
                                    <button className="px-8 py-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-bold rounded-xl hover:bg-slate-50 transition-all text-lg flex items-center gap-2 cursor-pointer">
                                        <span className="material-symbols-outlined">play_circle</span>
                                        View Demo
                                    </button>
                                </div>
                                <div className="flex items-center gap-4 text-sm text-slate-500">
                                    <div className="flex -space-x-2">
                                        <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuBzFnLmcxKVLSV4dTzoe0POx68RDTO1naLLax002Mdo2xgZLNfV6GeAasU9pwCWC8Gs-eIH4LsKF60ZP_M6ZDJriM83rqHhWBbvVuaGab2wWPIo-9HBaB6elmVt2-ZQb9nfoYX1Yge3Yb_jJXCNgVcRjQh_9hMqdgjbhynyfjk3HLg40grSuTq9-yiP3Mp75qTN0glm86syUDjPGoV6YKh9IrGAQlkX3BUJ1A_VzmI_U6vsY2MY7qBZS8g7QUstPvV5XVeDoIVgzWey" alt="" className="h-8 w-8 rounded-full border-2 border-white dark:border-slate-900" />
                                        <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuBVapD5wat_1PUqMHdnXXq9uRc8HH33UcXHmD5x9WADxHIfbtdjiquiSrRBjAAeriu-qsCI_KcFjDxdP37y_E0qyLdW5VZoeMeEX6E9V9T0TlXp_-bZbz2kMej-ztZ0paE13DB9ASx7SJvGccaCGkNUe11cGZ4Pf6jlRr38EtXbGUiz90S5jAykkfGBnQJvvGhHgVeZI3b_LUFStXHpuM3jSbwro3ssa5m_E9R8r34ysIcQUVP7SDq2-5KlqPhGoMi5j8EgueTKjUUy" alt="" className="h-8 w-8 rounded-full border-2 border-white dark:border-slate-900" />
                                        <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuApfSu4ZOgOANkbv7dkc6mUTtw9ZrZXk7NLdFdsaTs4LMhfd8Oew9e4ynisdPBqgbyvs4D98fsWDP_P6ekJRCmbQadmo7ResPRiKy3YTqpVkn2rzpbL8syIugKekFVbVvsSbdMTNSWCIpwZehPg-bQ-9Kv7mBNtJY7cknITYD3fqGzyCOM95Zke0LDS6NlNWTqXLTbtsPbpztd9XfP_kiVivqm8FJscwZSU2AEFQE3LupD-OtOieP2PX5M5UyIvoZfDJ4SEMoWXTgjS" alt="" className="h-8 w-8 rounded-full border-2 border-white dark:border-slate-900" />
                                    </div>
                                    <span>Trusted by 2,000+ educators worldwide</span>
                                </div>
                            </div>
                            <div className="relative">
                                {/* Abstract UI Representation */}
                                <div className="relative z-10 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-2xl overflow-hidden aspect-[4/3]">
                                    <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50">
                                        <div className="flex gap-1.5">
                                            <div className="w-3 h-3 rounded-full bg-red-400"></div>
                                            <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                                            <div className="w-3 h-3 rounded-full bg-green-400"></div>
                                        </div>
                                        <div className="text-xs font-mono text-slate-400">tambo-sdk-preview.tsx</div>
                                    </div>
                                    <div className="p-6 grid grid-cols-2 gap-6 h-full">
                                        <div className="space-y-4">
                                            <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded w-3/4"></div>
                                            <div className="h-32 bg-primary/5 rounded-lg border border-primary/20 p-4">
                                                <div className="h-2 bg-primary/20 rounded w-full mb-2"></div>
                                                <div className="h-2 bg-primary/20 rounded w-5/6 mb-2"></div>
                                                <div className="h-2 bg-primary/20 rounded w-4/6"></div>
                                            </div>
                                            <div className="grid grid-cols-2 gap-3">
                                                <div className="h-10 border border-slate-200 dark:border-slate-700 rounded p-2"></div>
                                                <div className="h-10 border border-slate-200 dark:border-slate-700 rounded p-2"></div>
                                            </div>
                                        </div>
                                        <div className="bg-slate-900 rounded-lg p-4 font-mono text-[10px] text-blue-300">
                                            <p className="mb-1"><span className="text-purple-400">const</span> <span className="text-yellow-400">Assessment</span> = () =&gt; {"{"}</p>
                                            <p className="ml-4 mb-1"><span className="text-purple-400">const</span> {"{ adaptiveUI }"} = useTambo();</p>
                                            <p className="ml-4 mb-1">return (</p>
                                            <p className="ml-8 mb-1"><span className="text-blue-400">&lt;GenerativeLayout</span></p>
                                            <p className="ml-12 mb-1">mode=<span className="text-green-400">"adaptive"</span></p>
                                            <p className="ml-12 mb-1">complexity={"{"}performance{"}"}</p>
                                            <p className="ml-8 mb-1"><span className="text-blue-400">/&gt;</span></p>
                                            <p className="ml-4 mb-1">);</p>
                                            <p className="mb-1">{"};"}</p>
                                        </div>
                                    </div>
                                </div>
                                {/* Background Glows */}
                                <div className="absolute -top-20 -right-20 w-80 h-80 bg-primary/20 blur-[120px] rounded-full"></div>
                                <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-purple-500/20 blur-[120px] rounded-full"></div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Social Proof */}
                <section className="py-12 border-y border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-background-dark/50">
                    <div className="max-w-7xl mx-auto px-4">
                        <p className="text-center text-sm font-semibold text-slate-500 uppercase tracking-widest mb-10">Trusted by leading educational innovators</p>
                        <div className="flex flex-wrap justify-center items-center gap-12 md:gap-20 opacity-50 grayscale hover:grayscale-0 transition-all cursor-default">
                            <span className="text-2xl font-bold italic">EduCORE</span>
                            <span className="text-2xl font-black">LearnStream</span>
                            <span className="text-2xl font-light tracking-tighter uppercase">Nexus Academy</span>
                            <span className="text-2xl font-medium font-serif">Stellaris</span>
                            <span className="text-2xl font-bold">Quill.ai</span>
                        </div>
                    </div>
                </section>

                {/* How it Works */}
                <section className="py-24 bg-white dark:bg-background-dark">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl lg:text-5xl font-bold mb-4">How it Works</h2>
                            <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">Three simple steps to deploy an intelligent, adaptive assessment engine in your product.</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
                            {/* Step 1 */}
                            <div className="flex flex-col items-center text-center p-8 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 hover:shadow-xl hover:-translate-y-1 transition-all">
                                <div className="w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-6">
                                    <span className="material-symbols-outlined text-3xl">upload_file</span>
                                </div>
                                <h3 className="text-xl font-bold mb-3">1. Upload Content</h3>
                                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                                    Input your raw curriculum, existing question banks, or learning objectives directly into our secure engine.
                                </p>
                            </div>
                            {/* Step 2 */}
                            <div className="flex flex-col items-center text-center p-8 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 hover:shadow-xl hover:-translate-y-1 transition-all">
                                <div className="w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-6">
                                    <span className="material-symbols-outlined text-3xl">hub</span>
                                </div>
                                <h3 className="text-xl font-bold mb-3">2. Generate UI</h3>
                                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                                    Tambo AI dynamically crafts interactive React components and unique assessment layouts in real-time.
                                </p>
                            </div>
                            {/* Step 3 */}
                            <div className="flex flex-col items-center text-center p-8 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 hover:shadow-xl hover:-translate-y-1 transition-all">
                                <div className="w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-6">
                                    <span className="material-symbols-outlined text-3xl">monitoring</span>
                                </div>
                                <h3 className="text-xl font-bold mb-3">3. Assess & Adapt</h3>
                                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                                    The engine analyzes responses on-the-fly, adjusting difficulty and content to match the learner's actual level.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Key Features Grid */}
                <section className="py-24 bg-background-light dark:bg-slate-950">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex flex-col lg:flex-row justify-between items-end mb-16 gap-6">
                            <div className="max-w-2xl">
                                <h2 className="text-3xl lg:text-5xl font-black mb-4 tracking-tight">Intelligence built into every component.</h2>
                                <p className="text-slate-600 dark:text-slate-400 text-lg">Experience the power of generative intelligence in education through our robust React SDK.</p>
                            </div>
                            <button className="px-6 py-3 border border-slate-300 dark:border-slate-700 font-semibold rounded-lg hover:bg-white dark:hover:bg-slate-900 transition-colors cursor-pointer">
                                Explore all features
                            </button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {/* Cards */}
                            {[
                                { icon: "dashboard_customize", title: "Generative UI", text: "Stop building static forms. Our SDK generates fully accessible, interactive assessment UIs that evolve based on context." },
                                { icon: "alt_route", title: "Adaptive Flow", text: "Personalized question paths that respond to performance levels instantly, keeping students in the 'Zone of Proximal Development'." },
                                { icon: "analytics", title: "Real-time Analytics", text: "Deep insights into student progress, friction points, and engagement metrics delivered through pre-built dashboard components." },
                                { icon: "shield_person", title: "Secure Integrity", text: "Built-in anti-cheat and verification measures to ensure the validity of assessments in high-stakes environments." },
                                { icon: "api", title: "Developer Friendly", text: "Comprehensive React documentation, TypeScript support, and a CLI for rapid testing and deployment." },
                                { icon: "translate", title: "Multi-lingual", text: "Automatically translate and localize assessments into 40+ languages without losing pedagogical accuracy." }
                            ].map((feature, idx) => (
                                <div key={idx} className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 group hover:border-primary/50 transition-all hover:shadow-lg">
                                    <div className="text-primary mb-6 group-hover:scale-110 transition-transform origin-left">
                                        <span className="material-symbols-outlined text-4xl">{feature.icon}</span>
                                    </div>
                                    <h4 className="text-xl font-bold mb-3">{feature.title}</h4>
                                    <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                                        {feature.text}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Call to Action */}
                <section className="py-24">
                    <div className="max-w-5xl mx-auto px-4">
                        <div className="bg-primary rounded-[2rem] p-8 md:p-16 text-center text-white relative overflow-hidden shadow-2xl shadow-primary/40">
                            {/* Background Decoration */}
                            <div className="absolute -top-24 -left-24 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
                            <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-blue-400/20 rounded-full blur-3xl"></div>
                            <h2 className="text-3xl lg:text-5xl font-black mb-6 relative z-10">Ready to transform assessment?</h2>
                            <p className="text-blue-100 text-lg mb-10 max-w-2xl mx-auto relative z-10">Join 500+ institutions using Tambo AI to deliver truly personalized learning experiences.</p>
                            <div className="flex flex-col sm:flex-row justify-center gap-4 relative z-10">
                                <button
                                    onClick={onStart}
                                    className="px-10 py-4 bg-white text-primary font-bold rounded-xl hover:bg-slate-100 transition-all shadow-lg text-lg cursor-pointer"
                                >
                                    Get Started Now
                                </button>
                                <button className="px-10 py-4 bg-primary border border-white/30 text-white font-bold rounded-xl hover:bg-white/10 transition-all text-lg cursor-pointer">
                                    Schedule a Demo
                                </button>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="bg-white dark:bg-background-dark pt-20 pb-10 border-t border-slate-200 dark:border-slate-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-12 mb-16">
                        <div className="lg:col-span-2">
                            <div className="flex items-center gap-2 mb-6">
                                <div className="bg-primary p-1.5 rounded-lg">
                                    <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M44 11.2727C44 14.0109 39.8386 16.3957 33.69 17.6364C39.8386 18.877 44 21.2618 44 24C44 26.7382 39.8386 29.123 33.69 30.3636C39.8386 31.6043 44 33.9891 44 36.7273C44 40.7439 35.0457 44 24 44C12.9543 44 4 40.7439 4 36.7273C4 33.9891 8.16144 31.6043 14.31 30.3636C8.16144 29.123 4 26.7382 4 24C4 21.2618 8.16144 18.877 14.31 17.6364C8.16144 16.3957 4 14.0109 4 11.2727C4 7.25611 12.9543 4 24 4C35.0457 4 44 7.25611 44 11.2727Z" fill="currentColor"></path>
                                    </svg>
                                </div>
                                <span className="text-xl font-bold tracking-tight">Tambo AI</span>
                            </div>
                            <p className="text-slate-600 dark:text-slate-400 max-w-xs mb-6 leading-relaxed">
                                The world's most advanced SDK for generative and adaptive assessment experiences.
                            </p>
                            <div className="flex gap-4">
                                <a href="#" className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center hover:bg-primary hover:text-white transition-all">
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"></path></svg>
                                </a>
                                <a href="#" className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center hover:bg-primary hover:text-white transition-all">
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"></path></svg>
                                </a>
                            </div>
                        </div>
                        <div>
                            <h5 className="font-bold mb-6">Product</h5>
                            <ul className="space-y-4 text-sm text-slate-600 dark:text-slate-400">
                                <li><a href="#" className="hover:text-primary transition-colors">Features</a></li>
                                <li><a href="#" className="hover:text-primary transition-colors">Pricing</a></li>
                                <li><a href="#" className="hover:text-primary transition-colors">Changelog</a></li>
                                <li><a href="#" className="hover:text-primary transition-colors">Status</a></li>
                            </ul>
                        </div>
                        <div>
                            <h5 className="font-bold mb-6">Developers</h5>
                            <ul className="space-y-4 text-sm text-slate-600 dark:text-slate-400">
                                <li><a href="#" className="hover:text-primary transition-colors">Documentation</a></li>
                                <li><a href="#" className="hover:text-primary transition-colors">API Reference</a></li>
                                <li><a href="#" className="hover:text-primary transition-colors">React SDK</a></li>
                                <li><a href="#" className="hover:text-primary transition-colors">Open Source</a></li>
                            </ul>
                        </div>
                        <div>
                            <h5 className="font-bold mb-6">Company</h5>
                            <ul className="space-y-4 text-sm text-slate-600 dark:text-slate-400">
                                <li><a href="#" className="hover:text-primary transition-colors">About Us</a></li>
                                <li><a href="#" className="hover:text-primary transition-colors">Careers</a></li>
                                <li><a href="#" className="hover:text-primary transition-colors">Privacy</a></li>
                                <li><a href="#" className="hover:text-primary transition-colors">Terms</a></li>
                            </ul>
                        </div>
                    </div>
                    <div className="border-t border-slate-200 dark:border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-slate-500">
                        <p>© 2024 Tambo AI, Inc. All rights reserved.</p>
                        <div className="flex items-center gap-6">
                            <span className="flex items-center gap-1">
                                <span className="w-2 h-2 rounded-full bg-green-500"></span> All systems operational
                            </span>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
