import { useState } from "react";
import { TamboProvider } from "@tambo-ai/react";
import { components } from "./tambo/registry";
import { TamboCanvas } from "./components/TamboCanvas";
import { AlertCircle } from "lucide-react";
import { Home } from "./pages/Home";

function App() {
  const [view, setView] = useState<'home' | 'app'>('home');
  const apiKey = import.meta.env.VITE_TAMBO_API_KEY;

  if (view === 'home') {
    return <Home onStart={() => setView('app')} />;
  }

  if (!apiKey) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-[#050A14] text-white p-4">
        <div className="max-w-md w-full bg-red-500/10 border border-red-500/20 rounded-2xl p-6 text-center space-y-4">
          <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center mx-auto">
            <AlertCircle className="w-6 h-6 text-red-500" />
          </div>
          <h2 className="text-xl font-bold text-red-400">Missing API Key</h2>
          <p className="text-sm text-red-200/70">
            Please add your <code className="bg-black/30 px-1 py-0.5 rounded text-red-300">VITE_TAMBO_API_KEY</code> to the <code className="bg-black/30 px-1 py-0.5 rounded text-red-300">.env</code> file in the project root.
          </p>
          <div className="text-xs text-white/30 bg-black/20 p-3 rounded-lg overflow-x-auto text-left">
            VITE_TAMBO_API_KEY=tambo_...
          </div>
        </div>
      </div>
    );
  }

  return (
    <TamboProvider
      apiKey={apiKey}
      components={components}
    >
      <TamboCanvas />
    </TamboProvider>
  );
}

export default App;
