import { callClaude } from '@/lib/claude';
import type { ChatMessage } from '@/types';
import { useState } from 'react';
export function useAICoach(mode:'gym'|'court'='gym') {
  const welcome:ChatMessage = {id:'0',senderId:'ai',senderName:mode==='gym'?'AI Coach':'Court Assistant',senderType:'ai',content:mode==='gym'?"Kumusta! I'm your AI Coach 💪 Tell me your fitness goal and I'll build a personalized plan for you!":"Hi there! 🏀 I'm your Court Assistant. Ask me about availability, pricing, or event packages!",timestamp:new Date(),read:true};
  const [messages,setMessages] = useState<ChatMessage[]>([welcome]);
  const [loading,setLoading]   = useState(false);
  const sendMessage = async (text:string):Promise<void> => {
    const userMsg:ChatMessage = {id:Date.now().toString(),senderId:'user',senderName:'You',senderType:'user',content:text,timestamp:new Date(),read:true};
    setMessages((p)=>[...p,userMsg]);
    setLoading(true);
    try {
      const history=[...messages,userMsg].filter((_,i)=>i>0||messages[0]?.senderType==='user').map((m)=>({role:(m.senderType==='user'?'user':'assistant') as 'user'|'assistant',content:m.content}));
      const reply = await callClaude(history,mode);
      setMessages((p)=>[...p,{id:(Date.now()+1).toString(),senderId:'ai',senderName:mode==='gym'?'AI Coach':'Court Assistant',senderType:'ai',content:reply,timestamp:new Date(),read:true}]);
    } catch {
      setMessages((p)=>[...p,{id:(Date.now()+1).toString(),senderId:'ai',senderName:'System',senderType:'ai',content:'Sorry, I had trouble connecting. Please try again.',timestamp:new Date(),read:true}]);
    } finally { setLoading(false); }
  };
  const clearChat = () => setMessages([welcome]);
  return {messages,loading,sendMessage,clearChat};
}
