// frontend/src/App.jsx (Final, Stable Code)

import React, { useState } from 'react';
// Syntax Highlighter components are removed for guaranteed stability.

// Tailwind constant for consistent styling: Dark background, Amber/Gold border
const BASE_CLASSES = "p-6 border border-amber-600/30 rounded-xl shadow-2xl shadow-black bg-gray-900";
const API_URL = 'http://127.0.0.1:8000/execute';

function App() {
    const [prompt, setPrompt] = useState('');
    const [results, setResults] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    // --- API Connection (FRD 5) ---
    const handleRun = async () => {
        if (!prompt.trim()) return;
        setIsLoading(true); setResults(null); setError(null);
        
        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt: prompt }), // FRD 3.1
            });

            const data = await response.json();
            if (response.ok) { setResults(data); } else { setError(`API Error: ${data.detail || 'Could not execute request.'}`); }
        } catch (err) {
            setError(`Network Error: Cannot connect to backend server. Is FastAPI running on ${API_URL}?`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        // Global Background: Deep Black (950) with Light Gray Text (200), Formal Font
        <div className="min-h-screen bg-gray-950 text-gray-200 p-8 font-serif tracking-wide"> 
            <header className="mb-10">
                {/* Main Title: Gold/Amber Color */}
                <h1 className="text-5xl font-bold text-amber-400 tracking-widest">Recursive AI Executor</h1>
                {/* Subtitle Text */}
                <p className="text-gray-400 mt-2 text-lg">Generates, executes, and self-corrects Python code autonomously.</p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* COLUMN 1: Task Input */}
                <div className="lg:col-span-1">
                    {/* Section Title: Gold/Amber Color */}
                    <h2 className="text-3xl font-semibold mb-4 text-amber-400 tracking-wide">Task Input</h2>
                    <div className={`${BASE_CLASSES} flex flex-col space-y-5 border-amber-500/50`}>
                        
                        <textarea
                            className="w-full h-40 p-4 border rounded resize-none focus:ring-amber-500 focus:border-amber-500 bg-gray-800 text-gray-200 placeholder-gray-500 shadow-inner"
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            placeholder='Example: "Write a function to calculate the 10th Fibonacci number."'
                        />
                        
                        {/* Run Button (Gold Accent) */}
                        <button
                            onClick={handleRun}
                            disabled={isLoading || !prompt.trim()}
                            className="py-3 bg-amber-500 text-gray-950 font-extrabold rounded-lg shadow-2xl hover:bg-amber-400 disabled:bg-gray-700/50 transition duration-200 transform hover:scale-[1.02]"
                        >
                            {isLoading ? 'EXECUTING (AI Thinking...)' : 'RUN AI EXECUTOR'}
                        </button>
                        
                        {error && <p className="text-red-400 font-medium bg-gray-900 p-3 rounded">Error: {error}</p>}
                        {isLoading && <p className="text-amber-300 font-medium">Processing request...</p>}
                    </div>
                </div>

                {/* COLUMN 2 & 3: Execution Results */}
                <div className="lg:col-span-2">
                    <h2 className="text-3xl font-semibold mb-4 text-amber-400 tracking-wide">Execution Results</h2>
                    
                    {results && <ResultsDisplay results={results} />}
                    
                    {!results && !isLoading && !error && (
                        <div className={`${BASE_CLASSES} text-gray-500 h-full flex items-center justify-center`}>
                            <p>Awaiting task execution...</p>
                        </div>
                    )}
                </div>
            </div>
            {/* Full Log History (FRD 3.4, 3.5) */}
            {results && <LogHistoryDisplay logHistory={results.log_history} />}
        </div>
    );
}
// ----------------------------------------------------------------------
// Results Display Component (FRD 3.5, 3.6)
// ----------------------------------------------------------------------
const ResultsDisplay = ({ results }) => {
    // Status colours flipped for dark background
    const statusClass = results.final_status === 'SUCCESS' ? 
        'bg-green-700 text-green-100' : 
        'bg-red-700 text-red-100';

    // FRD 3.6: Logic for Exporting Results (JSON)
    const handleExport = () => { /* ... (Logic as before) ... */ };
    
    return (
        <div className={BASE_CLASSES}>
            {/* Status Indicator & Attempts Counter (FRD 3.5) */}
            <div className={`p-3 rounded-lg font-bold mb-4 ${statusClass} flex justify-between`}>
                <span>Final Status: {results.final_status}</span>
                <span>Attempts: {results.total_attempts} / 5</span>
            </div>

            <h3 className="text-xl font-semibold mb-2 text-gray-200">Final Code Generated:</h3>
            
            {/* Code Viewer: Stable <pre> tag with Dark Background, Gold/Amber Text */}
            <pre className="p-4 bg-gray-950 text-amber-300 rounded-lg text-sm overflow-auto whitespace-pre-wrap shadow-inner shadow-black/50">
                {results.final_code || '# No code generated.'}
            </pre>

            <h3 className="text-xl font-semibold mt-4 mb-2 text-gray-200">Terminal Output (stdout/stderr):</h3>
            
            {/* Output: Stable <pre> tag */}
            <pre className="p-4 bg-gray-950 text-amber-200 rounded-lg text-sm whitespace-pre-wrap shadow-inner shadow-black/50">
                {results.final_output || 'No output recorded.'}
            </pre>
            
            {/* Export Button: Subtle Gold Accent */}
            <button onClick={handleExport} className="mt-6 py-2 px-4 text-sm bg-amber-700 text-white font-medium rounded hover:bg-amber-600 transition duration-150 shadow-lg">
                Export Results (JSON)
            </button>
        </div>
    );
};
// ----------------------------------------------------------------------
// Log History Display Component (FRD 3.4)
// ----------------------------------------------------------------------
const LogHistoryDisplay = ({ logHistory }) => {
    return (
        <div className="mt-12">
            <h2 className="text-3xl font-semibold mb-4 text-amber-400 tracking-wide">Full Execution Log History</h2>
            <div className="space-y-6">
                {logHistory.map((log) => (
                    // Log Card Background (Slightly Lighter Dark Gray)
                    <div key={log.attempt} className="bg-gray-800 p-6 border border-amber-600/20 rounded-xl shadow-xl shadow-black">
                        
                        <div className="flex justify-between items-center pb-3 border-b border-gray-700 mb-4">
                            <h3 className="text-lg font-bold text-gray-100">Attempt #{log.attempt}</h3>
                            {/* Status Pill */}
                            <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                                log.status === 'SUCCESS' ? 'bg-green-600 text-white' : 
                                log.status === 'TIMEOUT' ? 'bg-orange-600 text-white' :
                                'bg-red-600 text-white'
                            }`}>
                                Status: {log.status}
                            </span>
                        </div>

                        <p className="text-sm text-gray-400 italic mb-4 border-l-4 border-amber-600/50 pl-3">
                            **Prompt:** {log.prompt_used.substring(0, 200)}{log.prompt_used.length > 200 ? '...' : ''}
                        </p>

                        <h4 className="font-semibold text-gray-200 mt-3 mb-2">Code Generated:</h4>
                        {/* Code Block */}
                        <pre className="p-3 bg-gray-950 text-amber-300 rounded text-xs overflow-auto whitespace-pre-wrap shadow-inner shadow-black/50">
                            {log.code_generated}
                        </pre>
                        
                        <div className="mt-4">
                            <h4 className="font-semibold text-gray-200">Execution Output:</h4>
                            {/* Output Block */}
                            <pre className="p-3 bg-gray-950 text-amber-200 rounded text-xs overflow-auto whitespace-pre-wrap">
                                {log.stderr && `[ERROR/STDERR]\n${log.stderr}\n\n`}
                                {log.stdout && `[STDOUT]\n${log.stdout}`}
                                {log.time_taken !== undefined && `\n\n[TIME] ${log.time_taken} seconds`}
                            </pre>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default App;