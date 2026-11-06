'use client';

import type { Skill } from '@/types';
import type { Lang } from '@/data/translations';
import { translations } from '@/data/translations';
import { ArrowRight, Database, FileSpreadsheet, MessageSquare } from 'lucide-react';

type TrackVariant = 'excel' | 'sql' | 'english';

interface SkillTrackCardProps {
  skill: Skill;
  variant: TrackVariant;
  onContinue: (skillId: string) => void;
  lang: Lang;
}

const TRACK_CONFIG: Record<
  TrackVariant,
  {
    number: string;
    icon: React.ComponentType<{ size?: number; className?: string }>;
    accentColor: string;
    badgeBg: string;
    badgeText: string;
    progressBarColor: string;
    skillKey: keyof typeof translations.skills;
  }
> = {
  excel: {
    number: '01',
    icon: FileSpreadsheet,
    accentColor: '#48C8A4',
    badgeBg: 'bg-[#48C8A4]/15',
    badgeText: 'text-[#48C8A4]',
    progressBarColor: 'bg-[#48C8A4]',
    skillKey: 'excel',
  },
  sql: {
    number: '02',
    icon: Database,
    accentColor: '#43D5ED',
    badgeBg: 'bg-[#43D5ED]/15',
    badgeText: 'text-[#43D5ED]',
    progressBarColor: 'bg-[#43D5ED]',
    skillKey: 'sql',
  },
  english: {
    number: '03',
    icon: MessageSquare,
    accentColor: '#D9F66F',
    badgeBg: 'bg-[#D9F66F]/15',
    badgeText: 'text-[#D9F66F]',
    progressBarColor: 'bg-[#D9F66F]',
    skillKey: 'english',
  },
};

export default function SkillTrackCard({ skill, variant, onContinue, lang }: SkillTrackCardProps) {
  const config = TRACK_CONFIG[variant];
  const Icon = config.icon;
  const skillT = translations.skills[config.skillKey];
  const t = translations.dashboard;

  return (
    <div className="card-premium bg-[#102B40]/95 p-6 rounded-3xl border border-[#82CDE1]/20 flex flex-col justify-between h-full group hover:border-[#43D5ED]/50 transition-all duration-300 shadow-xl">
      <div>
        {/* Top Header: Track Number & Category Icon */}
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-bold tracking-wider uppercase text-[#93A8B8]">
            {lang === 'vi' ? 'LỘ TRÌNH' : 'TRACK'} {config.number}
          </span>
          <div className={`w-9 h-9 rounded-xl ${config.badgeBg} ${config.badgeText} border border-current/20 flex items-center justify-center`}>
            <Icon size={17} />
          </div>
        </div>

        {/* Skill Name & Subtitle */}
        <div className="mb-3">
          <h3 className="text-xl sm:text-2xl font-black text-[#F5FAFF] group-hover:text-[#43D5ED] transition-colors leading-tight">
            {skillT.name[lang]}
          </h3>
          <p className="text-xs font-medium text-[#93A8B8] mt-1">
            {skillT.subtitle[lang]} • {skillT.category[lang]}
          </p>
        </div>

        {/* Workplace Scenario */}
        <p className="text-sm text-[#C3D2DF] leading-relaxed mb-6 font-normal">
          {skillT.scenario[lang]}
        </p>
      </div>

      <div>
        {/* Progress bar and metrics */}
        <div className="mb-5 pt-3.5 border-t border-[#82CDE1]/15">
          <div className="flex items-baseline justify-between mb-2">
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-black text-[#F5FAFF] tabular-nums">
                {skill.progress}%
              </span>
              <span className="text-xs font-semibold text-[#93A8B8]">
                {lang === 'vi' ? 'hoàn thành' : 'completed'}
              </span>
            </div>
            <span className="text-xs font-semibold text-[#93A8B8]">
              {skill.completedLessons}/{skill.totalLessons} {t.lessonsCompleted[lang]}
            </span>
          </div>

          {/* Clean progress bar */}
          <div className="h-2 rounded-full bg-[#061625] overflow-hidden border border-[#82CDE1]/10">
            <div
              className={`h-full rounded-full ${config.progressBarColor} transition-all duration-500 ease-out`}
              style={{ width: `${skill.progress}%` }}
            />
          </div>
        </div>

        {/* CTA Button */}
        <button
          onClick={() => onContinue(skill.id)}
          className="w-full py-3 rounded-2xl bg-[#15354A] hover:bg-[#1E4661] text-[#F5FAFF] border border-[#82CDE1]/25 hover:border-[#43D5ED]/50 text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer group-hover:text-[#43D5ED]"
        >
          <span>{t.continueLearning[lang]}</span>
          <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
}
