// filepath: src/pages/PlaceholderPage.tsx
// Уақытша бет — әлі жасалмаған модульдер үшін.
// Кейін әрқайсысы нақты бетке ауысады.

import { Construction } from "lucide-react";

export default function PlaceholderPage({ title }: { title: string }) {
  return (
    <div className="flex flex-col items-center justify-center h-full min-h-[60vh] text-center">
      <div className="w-16 h-16 rounded-card bg-surface-2 flex items-center justify-center mb-4">
        <Construction className="w-8 h-8 text-accent-gold" />
      </div>
      <h2 className="text-2xl font-display font-bold mb-2">{title}</h2>
      <p className="text-text-secondary">Бұл бөлім дайындалып жатыр</p>
    </div>
  );
}
