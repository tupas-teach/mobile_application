const BASE = 'https://api.anthropic.com/v1/messages';
const GYM = `You are FlexZone AI Coach, a fitness and nutrition assistant for FlexZone SmartGym in Consolacion, Cebu, Philippines. Be motivating, warm, professional. Use occasional Filipino expressions (Kaya mo yan!, Sige!). Give concise actionable advice in 3-5 sentences.`;
const COURT = `You are FlexZone Court Assistant. Help customers book courts and events. Sports: Basketball ₱300/hr, Volleyball ₱250/hr, Badminton ₱200/hr, Pickleball ₱200/hr, Table Tennis ₱150/hr. Events from ₱5,000/day. Be friendly and concise.`;
export async function callClaude(messages:{role:'user'|'assistant';content:string}[],mode:'gym'|'court'='gym'):Promise<string> {
  try {
    const res = await fetch(BASE,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({model:'claude-sonnet-4-20250514',max_tokens:1000,system:mode==='gym'?GYM:COURT,messages})});
    if(!res.ok) throw new Error(`Claude API ${res.status}`);
    const d = await res.json() as {content?:{text?:string}[]};
    return d.content?.[0]?.text ?? 'Sorry, I could not respond right now.';
  } catch(e:unknown){ console.error('Claude error:',e); throw e; }
}
