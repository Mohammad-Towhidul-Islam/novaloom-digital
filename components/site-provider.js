'use client';
import { createContext, useContext, useEffect, useState } from 'react';
const Ctx = createContext({ user:null, refresh:async()=>{} });
export function SiteProvider({children}) {
 const [user,setUser] = useState(null);
 const refresh = async()=>{ try { const r=await fetch('/api/auth/me'); const d=await r.json(); setUser(d.user||null); } catch { setUser(null); } };
 useEffect(()=>{ refresh(); },[]);
 return <Ctx.Provider value={{user,refresh}}>{children}</Ctx.Provider>;
}
export const useSite = ()=>useContext(Ctx);
