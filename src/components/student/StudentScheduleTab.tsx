import { useState } from 'react';
import { weekSchedules, DAYS } from '@/data/journalData';
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

export default function StudentScheduleTab() {
  const [selectedWeekIdx, setSelectedWeekIdx] = useState(0);
  const week = weekSchedules[selectedWeekIdx];

  const handleExport = () => {
    const rows: string[] = [`Моё расписание: ${week.week}`, ''];
    DAYS.forEach(day => {
      const dayLessons = week.lessons.filter(l => l.day === day);
      if (!dayLessons.length) return;
      rows.push(`${day}:`);
      dayLessons.forEach(l => {
        rows.push(`  ${l.time}  ${l.subject} — ${l.topic}`);
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
          <h2 className="text-xl font-semibold text-foreground">Моё расписание</h2>
          <p className="text-sm text-muted-foreground mt-0.5">Темы уроков и домашние задания</p>
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
              selectedWeekIdx === idx ? 'bg-primary text-primary-foreground border-primary' : 'bg-card border-border hover:border-primary/50'
            }`}
          >
            <Icon name="CalendarDays" size={13} />
            {w.week}
          </button>
        ))}
      </div>

      {/* Schedule by day */}
      <div className="space-y-4">
        {DAYS.map(day => {
          const dayLessons = week.lessons.filter(l => l.day === day);
          if (!dayLessons.length) return null;
          return (
            <div key={day}>
              <div className="flex items-center gap-3 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{day}</span>
                <div className="flex-1 h-px bg-border" />
              </div>
              <div className="space-y-2">
                {dayLessons.map((lesson, i) => {
                  const colorCls = SUBJECT_COLORS[lesson.subject] || 'bg-gray-50 border-gray-200 text-gray-800';
                  return (
                    <div key={i} className="bg-card border border-border rounded-lg p-4 flex gap-4">
                      <div className="flex-shrink-0 text-center">
                        <div className="font-mono-nums text-sm font-semibold text-foreground">{lesson.time}</div>
                      </div>
                      <div className="w-px bg-border flex-shrink-0" />
                      <div className="flex-1">
                        <div className="flex items-start gap-2 mb-2">
                          <span className={`text-xs font-semibold px-2 py-0.5 rounded border ${colorCls}`}>
                            {lesson.subject}
                          </span>
                        </div>
                        <div className="text-sm font-medium text-foreground mb-2">{lesson.topic}</div>
                        <div className="flex items-start gap-1.5">
                          <Icon name="BookOpen" size={13} className="text-muted-foreground mt-0.5 flex-shrink-0" />
                          <span className="text-xs text-muted-foreground leading-relaxed">{lesson.homework}</span>
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
