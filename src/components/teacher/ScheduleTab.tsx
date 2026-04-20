import { useState } from 'react';
import { weekSchedules, DAYS, WeekSchedule } from '@/data/journalData';
import Icon from '@/components/ui/icon';

const SUBJECT_COLORS: Record<string, string> = {
  'Математика': 'bg-blue-50 border-blue-200 text-blue-800',
  'Физика': 'bg-purple-50 border-purple-200 text-purple-800',
  'Русский язык': 'bg-emerald-50 border-emerald-200 text-emerald-800',
  'История': 'bg-amber-50 border-amber-200 text-amber-800',
  'Химия': 'bg-rose-50 border-rose-200 text-rose-800',
  'Литература': 'bg-indigo-50 border-indigo-200 text-indigo-800',
  'Биология': 'bg-teal-50 border-teal-200 text-teal-800',
  'Английский': 'bg-orange-50 border-orange-200 text-orange-800',
};

export default function ScheduleTab() {
  const [selectedWeekIdx, setSelectedWeekIdx] = useState(0);
  const week: WeekSchedule = weekSchedules[selectedWeekIdx];

  const handleExport = () => {
    const rows: string[] = [`Расписание на неделю: ${week.week}`, ''];
    DAYS.forEach(day => {
      const dayLessons = week.lessons.filter(l => l.day === day);
      if (!dayLessons.length) return;
      rows.push(`${day}:`);
      dayLessons.forEach(l => {
        rows.push(`  ${l.time}  ${l.subject}`);
        rows.push(`    Тема: ${l.topic}`);
        rows.push(`    ДЗ: ${l.homework}`);
      });
      rows.push('');
    });
    const blob = new Blob([rows.join('\n')], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Расписание_${week.week.replace('–', '-')}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-foreground">Расписание</h2>
          <p className="text-sm text-muted-foreground mt-0.5">Темы уроков и домашние задания по неделям</p>
        </div>
        <button
          onClick={handleExport}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded text-sm font-medium hover:bg-primary/90 transition-colors"
        >
          <Icon name="Download" size={14} />
          Экспорт
        </button>
      </div>

      {/* Week selector */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {weekSchedules.map((w, idx) => (
          <button
            key={idx}
            onClick={() => setSelectedWeekIdx(idx)}
            className={`flex items-center gap-2 px-4 py-2 rounded border text-sm font-medium transition-all ${
              selectedWeekIdx === idx
                ? 'bg-primary text-primary-foreground border-primary'
                : 'bg-card border-border text-foreground hover:border-primary/50'
            }`}
          >
            <Icon name="CalendarDays" size={13} />
            {w.week}
          </button>
        ))}
      </div>

      {/* Schedule grid */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
        {DAYS.map(day => {
          const dayLessons = week.lessons.filter(l => l.day === day);
          return (
            <div key={day} className="bg-card rounded-lg border border-border overflow-hidden">
              <div className="px-3 py-2.5 border-b border-border bg-[hsl(220,35%,18%)]">
                <span className="text-xs font-semibold text-white/80 uppercase tracking-wider">{day}</span>
              </div>
              <div className="p-2 space-y-2">
                {dayLessons.length === 0 ? (
                  <div className="text-xs text-muted-foreground py-4 text-center">Нет уроков</div>
                ) : dayLessons.map((lesson, i) => {
                  const colorCls = SUBJECT_COLORS[lesson.subject] || 'bg-gray-50 border-gray-200 text-gray-800';
                  return (
                    <div key={i} className={`rounded border p-2.5 ${colorCls}`}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-semibold">{lesson.subject}</span>
                        <span className="text-xs opacity-60 font-mono-nums">{lesson.time}</span>
                      </div>
                      <div className="text-xs font-medium leading-tight mb-1.5">{lesson.topic}</div>
                      <div className="border-t border-current/10 pt-1.5">
                        <div className="flex items-start gap-1">
                          <Icon name="BookOpen" size={10} className="mt-0.5 opacity-60 flex-shrink-0" />
                          <span className="text-xs opacity-70 leading-tight">{lesson.homework}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
