'use client';

import { useChat } from 'ai/react';
import { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';

export default function Page() {
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: '/api/chat',
    maxSteps: 5,
  });

  const [greeting, setGreeting] = useState("");

  useEffect(() => {
    const greetings = [
      "Quali notizie cerchi oggi?",
      "Cosa sta succedendo nel mondo?",
      "Analizziamo qualche argomento?",
      "Chiedimi qualsiasi cosa.",
      "Ricerca news in tempo reale..."
    ];
    setGreeting(greetings[Math.floor(Math.random() * greetings.length)]);
  }, []);

  const isChatEmpty = messages.length === 0;

  // --- MODIFICA 1: Emoji al posto dell'SVG ---
  const LogoComponent = () => (
    <div className="text-8xl mb-6 hover:scale-110 transition-transform cursor-default select-none">
      🍌
    </div>
  );

  return (
    <div className="min-h-screen bg-white text-gray-800 font-sans selection:bg-blue-100 relative overflow-x-hidden">
      
      {/* --- AREA MESSAGGI --- */}
      {!isChatEmpty && (
        <div className="w-full max-w-2xl mx-auto pt-10 pb-32 px-4 space-y-6">
          {messages.map((m, index) => (
            <div 
              key={m.id} 
              className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} animate-message`}
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <div 
                className={`
                  max-w-[85%] p-4 rounded-2xl shadow-sm border
                  ${m.role === 'user' 
                    ? 'bg-blue-600 text-white border-blue-600 rounded-br-none' 
                    : 'bg-white text-gray-800 border-gray-100 rounded-bl-none shadow-md'}
                `}
              >
                <div className={`text-xs font-bold mb-1 opacity-70 ${m.role === 'user' ? 'text-blue-100' : 'text-gray-400'}`}>
                  {m.role === 'user' ? 'TU' : 'AI AGENT'}
                </div>
                
                <div className="text-sm sm:text-base leading-relaxed">
                  <ReactMarkdown
                    components={{
                      strong: ({node, ...props}) => <span className="font-bold" {...props} />,
                      ul: ({node, ...props}) => <ul className="list-disc pl-4 space-y-1 mt-2" {...props} />,
                      ol: ({node, ...props}) => <ol className="list-decimal pl-4 space-y-1 mt-2" {...props} />,
                      li: ({node, ...props}) => <li className="pl-1" {...props} />,
                      a: ({node, ...props}) => <a className="text-blue-500 underline hover:text-blue-700" target="_blank" rel="noopener noreferrer" {...props} />,
                      p: ({node, ...props}) => <p className="mb-2 last:mb-0" {...props} />,
                    }}
                  >
                    {m.content}
                  </ReactMarkdown>
                </div>

                {!m.content && m.toolInvocations && (
                  <div className="flex items-center gap-2 text-sm text-gray-500 italic mt-2">
                    <span className="w-2 h-2 bg-blue-500 rounded-full animate-ping"></span>
                    Sto analizzando le fonti...
                  </div>
                )}
              </div>
            </div>
          ))}
          
          {isLoading && messages[messages.length - 1]?.role === 'user' && (
            <div className="flex justify-start animate-message">
              <div className="bg-white border border-gray-100 p-4 rounded-2xl rounded-bl-none shadow-md text-gray-400 text-sm">
                Sto pensando...
              </div>
            </div>
          )}
        </div>
      )}

      {/* --- INPUT AREA --- */}
      <div 
        className={`
          transition-all duration-500 ease-in-out w-full px-4
          ${isChatEmpty ? 'fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 max-w-xl' : 'fixed bottom-6 left-0 right-0 max-w-2xl mx-auto'}
        `}
      >
        {isChatEmpty && (
          <div className="text-center mb-8 animate-fade-in-up">
            <LogoComponent />
            <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-2">Ricerca AI</h1>
            <p className="text-lg text-gray-500">{greeting}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="relative group">
          
          {/* --- MODIFICA 2: Wrapper Arcobaleno Avanzato --- */}
          <div className="rainbow-container">
            {/* Sfondo bianco per coprire il centro del gradiente */}
            <div className="rainbow-bg"></div>
            
            <input
              className={`
                w-full p-5 pl-6 pr-14 
                bg-transparent /* IMPORTANTE: Trasparente per vedere il bianco sotto */
                text-lg text-gray-800 placeholder:text-gray-400
                focus:outline-none 
                relative z-10
              `}
              value={input}
              placeholder="Chiedi notizie, dati o curiosità..."
              onChange={handleInputChange}
              autoFocus
            />
            
            <button 
              type="submit"
              disabled={!input.trim()}
              aria-label="Invia ricerca"
              title="Invia ricerca"
              className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full transition-colors disabled:opacity-0 disabled:pointer-events-none z-20"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75" />
              </svg>
            </button>
          </div>
          {/* ----------------------------------------------- */}

        </form>
      </div>

      {/* --- FOOTER: Creato da NDC --- */}
      {isChatEmpty && (
        <footer className="fixed bottom-4 left-0 w-full text-center text-xs text-gray-400 font-medium tracking-widest opacity-60">
          CREATO DA NDC
        </footer>
      )}

    </div>
  );
}