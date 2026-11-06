'use client';

import { Flame, Clock, Award, Target, Check } from 'lucide-react';
import type { UserProfile, WeeklyActivity, Skill } from '@/types';
import type { Lang } from '@/data/translations';
import { translations } from '@/data/translations';

interface ProgressViewProps {
  user: UserProfile;
  activities: WeeklyActivity[];
  skills: Skill[];
  lang: Lang;
}

const SKILL_COLORS: Record<string, string> = {
  excel: '#48C8A4',
  sql: '#43D5ED',
  english: '#D9F66F',
};

export default function ProgressView({ user, activities, skills, lang }: ProgressViewProps) {
  const t = translations.progressPage;
  const totalMinutesThisWeek = activities.reduce((acc, curr) => acc + curr.minutes, 0);
  const totalCompletedDays = activities.filter((a) => a.completed).length;

  const statCards = [
    {
      label: t.learningStreak,
      value: user.streak,
      unit: t.consecutiveDays,
      sub: t.personalRecord,
      icon: <Flame size={18} className="text-[#FF7777] fill-[#FF7777]" />,
      badgeBg: 'bg-[#FF7777]/15 border border-[#FF7777]/30',
      badgeText: 'text-[#FF7777]',
    },
    {
      label: t.totalTime,
      value: user.totalMinutes,
      unit: t.accumulated,
      sub: t.equivalent,
      icon: <Clock size={18} className="text-[#43D5ED]" />,
      badgeBg: 'bg-[#43D5ED]/15 border border-[#43D5ED]/30',
      badgeText: 'text-[#43D5ED]',
    },
    {
      label: t.lessonsCompleted,
      value: skills.reduce((sum, s) => sum + s.completedLessons, 0),
      unit: t.lessons,
      sub: t.accuracy,
      icon: <Check size={18} className="text-[#6BE0A4]" strokeWidth={3} />,
      badgeBg: 'bg-[#6BE0A4]/15 border border-[#6BE0A4]/30',
      badgeText: 'text-[#6BE0A4]',
    },
    {
      label: t.weeklyTarget,
      value: totalMinutesThisWeek,
      unit: { vi: `/ ${user.weeklyGoal} phút`, en: `/ ${user.weeklyGoal} min` },
      sub: { vi: `${totalCompletedDays}/7 ${translations.progressPage.daysInWeek.vi}`, en: `${totalCompletedDays}/7 ${translations.progressPage.daysInWeek.en}` },
      icon: <Target size={18} className="text-[#D9F66F]" />,
      badgeBg: 'bg-[#D9F66F]/15 border border-[#D9F66F]/30',
      badgeText: 'text-[#D9F66F]',
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Title */}
      <div>
        <span className="text-[11px] font-bold uppercase tracking-wider text-[#43D5ED] block mb-1">
          {lang === 'vi' ? 'BÁO CÁO HỌC TẬP' : 'LEARNING REPORT'}
        </span>
        <h2 className="text-2xl sm:text-3xl font-black text-[#F5FAFF]">{t.title[lang]}</h2>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card, idx) => (
          <div
            key={idx}
            className={`card-premium bg-[#102B40]/95 p-5 rounded-3xl border border-[#82CDE1]/20 shadow-xl animate-fade-in-up stagger-${idx + 1}`}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-[#93A8B8]">{card.label[lang]}</span>
              <div className={`w-9 h-9 rounded-xl ${card.badgeBg} ${card.badgeText} flex items-center justify-center`}>
                {card.icon}
              </div>
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl font-black text-[#F5FAFF] tabular-nums">{card.value}</span>
              <span className="text-xs font-semibold text-[#93A8B8]">{card.unit[lang]}</span>
            </div>
            <p className="mt-2 text-xs font-medium text-[#C3D2DF]">{card.sub[lang]}</p>
          </div>
        ))}
      </div>

      {/* Skill mastery */}
      <div className="card-premium bg-[#102B40]/95 p-6 rounded-3xl border border-[#82CDE1]/20 shadow-xl">
        <div className="flex items-center justify-between mb-5 pb-4 border-b border-[#82CDE1]/15">
          <div>
            <h3 className="text-base font-bold text-[#F5FAFF]">{t.skillMastery[lang]}</h3>
          </div>
          <span className="bg-[#15354A] border border-[#43D5ED]/30 px-3 py-1 rounded-xl text-xs font-bold text-[#43D5ED]">
            3 {t.activeSkills[lang]}
          </span>
        </div>

        <div className="space-y-5">
          {skills.map((skill) => (
            <div key={skill.id}>
              <div className="flex items-center justify-between text-sm mb-2">
                <div className="flex items-center gap-2">
                  <span
                    className="w-3 h-3 rounded-full inline-block shadow-[0_0_8px_currentColor]"
                    style={{ backgroundColor: SKILL_COLORS[skill.id] ?? '#43D5ED', color: SKILL_COLORS[skill.id] ?? '#43D5ED' }}
                  />
                  <span className="font-bold text-[#F5FAFF]">{skill.name}</span>
                  <span className="text-xs font-medium text-[#93A8B8]">• {skill.level}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-[#93A8B8]">
                    {skill.completedLessons}/{skill.totalLessons}
                  </span>
                  <span className="text-sm font-black text-[#F5FAFF] tabular-nums">{skill.progress}%</span>
                </div>
              </div>
              <div className="h-2 rounded-full bg-[#061625] overflow-hidden border border-[#82CDE1]/10">
                <div
                  className="h-full rounded-full transition-all duration-500 ease-out"
                  style={{
                    width: `${skill.progress}%`,
                    backgroundColor: SKILL_COLORS[skill.id] ?? '#43D5ED',
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Badges */}
      <div className="card-premium bg-[#102B40]/95 p-6 rounded-3xl border border-[#82CDE1]/20 shadow-xl">
        <div className="flex items-center gap-2 mb-5 pb-3 border-b border-[#82CDE1]/15">
          <Award size={18} className="text-[#43D5ED]" />
          <h3 className="text-base font-bold text-[#F5FAFF]">{t.badgesEarned[lang]}</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            {
              icon: '⚡',
              title: { vi: 'Kỷ luật vàng', en: 'Golden Discipline' },
              desc: { vi: 'Học liên tục 10 ngày không ngắt quãng', en: '10 consecutive days of learning' },
              bg: 'bg-[#15354A] border border-[#D9F66F]/40 text-[#D9F66F]',
            },
            {
              icon: '📊',
              title: { vi: 'SQL Apprentice', en: 'SQL Apprentice' },
              desc: { vi: 'Hoàn thành 5 bài truy vấn thực tế', en: '5 practical queries completed' },
              bg: 'bg-[#15354A] border border-[#43D5ED]/40 text-[#43D5ED]',
            },
            {
              icon: '🎯',
              title: { vi: '10-Min Master', en: '10-Min Master' },
              desc: { vi: 'Giải quyết bài tập trong đúng 10 phút', en: 'Complete an exercise in exactly 10 minutes' },
              bg: 'bg-[#15354A] border border-[#FF7777]/40 text-[#FF7777]',
            },
          ].map((badge) => (
            <div key={badge.title.en} className="border border-[#82CDE1]/15 rounded-2xl p-4 flex items-start gap-3 bg-[#061625]/80 hover:border-[#43D5ED]/40 transition-all">
              <div className={`w-11 h-11 rounded-xl ${badge.bg} flex items-center justify-center text-xl shrink-0 shadow-sm`}>
                {badge.icon}
              </div>
              <div>
                <h4 className="text-sm font-bold text-[#F5FAFF]">{badge.title[lang]}</h4>
                <p className="text-xs text-[#C3D2DF] mt-0.5">{badge.desc[lang]}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
