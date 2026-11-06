'use client';

import type { Skill } from '@/types';
import type { Lang } from '@/data/translations';
import SkillTrackCard from './SkillCard';

type TrackVariant = 'excel' | 'sql' | 'english';

interface SkillCardsGridProps {
  skills: Skill[];
  onContinue: (skillId: string) => void;
  lang: Lang;
}

const VARIANT_MAP: Record<string, TrackVariant> = {
  excel: 'excel',
  sql: 'sql',
  english: 'english',
};

const STAGGER = ['stagger-3', 'stagger-4', 'stagger-5'] as const;

export default function SkillCardsGrid({ skills, onContinue, lang }: SkillCardsGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
      {skills.map((skill, i) => (
        <div key={skill.id} className={`animate-fade-in-up ${STAGGER[i] ?? 'stagger-5'}`}>
          <SkillTrackCard
            skill={skill}
            variant={VARIANT_MAP[skill.id] ?? 'excel'}
            onContinue={onContinue}
            lang={lang}
          />
        </div>
      ))}
    </div>
  );
}
