import { google } from '@ai-sdk/google';
import { streamText, tool } from 'ai';
import { z } from 'zod';

export const maxDuration = 60;

export async function POST(req: Request) {
  // 1. Calcoliamo l'ora attuale in Italia
  const romeTime = new Date().toLocaleString('it-IT', { timeZone: 'Europe/Rome' });

  console.log(`🔥 Route chiamata. Ora: ${romeTime}`);

  try {
    const { messages } = await req.json();

    const result = streamText({
      model: google('gemini-2.5-flash'), 
      
      messages,
      // INIETTIAMO L'ORARIO NEL SYSTEM PROMPT
      system: `Sei un assistente di ricerca news in tempo reale.
      ORA ATTUALE (ITALIA): ${romeTime}.
      
      LOGICA:
      1. Se l'utente chiede "ultima ora", "ultim'ora" o "appena successo", usa search_type="news" e hours=1.
      2. Quando ricevi i risultati, controlla l'orario. Se una notizia è di 20 ore fa ma l'utente vuole l'ultima ora, avvisalo o scartala.
      3. Cita sempre la fonte e l'orario di pubblicazione.`,
      
      tools: {
        getInformation: tool({
          description: 'Cerca informazioni su internet.',
          parameters: z.object({
            question: z.string().describe('Query di ricerca'),
            search_type: z.enum(['news', 'general']).describe('Tipo di ricerca'),
            days: z.number().optional().describe('Giorni indietro (default 1 per news)'),
            hours: z.number().optional().describe('Se serve precisione oraria (es. 1 per ultima ora)'),
          }),
          execute: async ({ question, search_type, days, hours }) => {
            console.log(`🔍 TOOL: "${question}" | Ore: ${hours || 'N/A'}`);
            
            try {
              // Ottimizzazione query per breaking news
              let finalQuery = question;
              if (hours) {
                finalQuery += " ultima ora"; 
              }

              const body: any = {
                api_key: process.env.TAVILY_API_KEY,
                query: finalQuery,
                search_depth: "basic", 
                include_answer: true,
                max_results: 5,
                topic: search_type,
              };

              // Se cerchiamo per ore, forziamo days=1 (minimo API)
              if (search_type === 'news') {
                body.days = days || 1; 
              }

              const response = await fetch('https://api.tavily.com/search', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
              });
              
              const data = await response.json();

              if (!data.results || data.results.length === 0) return "Nessun risultato trovato.";
              
              // Restituiamo i risultati con la data
              return data.results.map((r: any) => 
                `[DATA: ${r.published_date}] ${r.title}: ${r.content}`
              ).join('\n\n');

            } catch (error) {
              console.error("❌ Errore ricerca:", error);
              return "Errore tecnico ricerca.";
            }
          },
        }),
      },
    });

    return result.toDataStreamResponse();
  } catch (error) {
    console.error("🔴 ERRORE SERVER:", error);
    return new Response("Errore del server", { status: 500 });
  }
}