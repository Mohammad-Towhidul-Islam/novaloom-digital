'use client';
import * as Icons from 'lucide-react';
export default function Icon({name='Sparkles',size=20,...props}) { const C=Icons[name]||Icons.Sparkles; return <C size={size} strokeWidth={1.7} {...props}/>; }
