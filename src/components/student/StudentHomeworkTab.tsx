import { useState } from 'react';
import { weekSchedules, SUBJECTS } from '@/data/journalData';
import Icon from '@/components/ui/icon';

const SUBJECT_COLORS: Record<string, string> = {
  'Математика': 'border-l-blue-400',
  'Физика': 'border-l-purple-400',
  'Русский язык': 'border-l-emerald-400',
  'История': 'border-l-amber-400',
  'Химия': 'border-l-rose-400',
  'Литература': 'border-l-indigo-400',
  'Биология': 'border-l-teal-400',
  'Английский': 'border-l-orange-400',
};

export default function StudentHomeworkTab() {
  const [selectedWeekIdx, setSelectedWeekIdx] = useState(0);
  const [doneIds, setDoneIds] = useState<Set<string>>(new Set());
  const [filterSubject, setFilterSubject] = useState('Все');

  const week = weekSchedules[selectedWeekIdx];
  const lessons = week.lessons.filter(l => filterSubject === 'Все' || l.subject === filterSubject);

  const toggleDone = (key: string) => {
    setDoneIds(prev => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const doneCount = lessons.filter(l => doneIds.has(`${week.week}-${l.day}-${l.subject}`)).length;

  const handleExport = () => {
    const rows = [`Домашние задания: ${week.week}`, ''];
    week.lessons.forEach(l => {
      const key = `${week.week}-${l.day}-${l.subject}`;
      const status = doneIds.has(key) ? '✓' : '○';
      rows.push(`${status} ${l.day} | ${l.subject}`);
      rows.push(`  ${l.homework}`);
      rows.push('');
    });
    const blob = new Blob([rows.join('\n')], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ДЗ_${week.week.replace('–', '-')}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-foreground">Домашние задания</h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            Выполнено: {doneCount} из {lessons.length}
          </p>
        </div>
        <button
          onClick={handleExport}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded text-sm font-medium hover:bg-primary/90 transition-colors"
        >
          <Icon name="Download" size={14} />
          Экспорт
        </button>
      </div>

      {/* Progress bar */}
      <div className="mb-6">
        <div className="h-1.5 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-[hsl(210,70%,55%)] rounded-full transition-all duration-500"
            style={{ width: lessons.length ? `${(doneCount / lessons.length) * 100}%` : '0%' }}
          />
        </div>
      </div>

      {/* Week selector */}
      <div className="flex gap-2 flex-wrap mb-4">
        {weekSchedules.map((w, idx) => (
          <button
            key={idx}
            onClick={() => setSelectedWeekIdx(idx)}
            className={`px-4 py-1.5 rounded border text-sm font-medium transition-all ${
              selectedWeekIdx === idx ? 'bg-primary text-primary-foreground border-primary' : 'bg-card border-border hover:border-primary/50'
            }`}
          >
            {w.week}
          </button>
        ))}
      </div>

      {/* Subject filter */}
      <div className="flex gap-1.5 flex-wrap mb-5">
        {['Все', ...SUBJECTS].map(s => (
          <button
            key={s}
            onClick={() => setFilterSubject(s)}
            className={`px-3 py-1 rounded text-xs font-medium border transition-all ${
              filterSubject === s ? 'bg-primary text-primary-foreground border-primary' : 'bg-muted text-muted-foreground border-transparent hover:border-border'
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {/* HW cards */}
      <div className="space-y-2">
        {lessons.map((lesson, i) => {
          const key = `${week.week}-${lesson.day}-${lesson.subject}`;
          const done = doneIds.has(key);
          const borderColor = SUBJECT_COLORS[lesson.subject] || 'border-l-gray-300';
          return (
            <div
              key={i}
              className={`bg-card border border-border border-l-4 ${borderColor} rounded-lg p-4 flex items-start gap-3 transition-all ${done ? 'opacity-50' : ''}`}
            >
              <button
                onClick={() => toggleDone(key)}
                className={`flex-shrink-0 w-5 h-5 rounded border-2 mt-0.5 flex items-center justify-center transition-all ${
                  done ? 'bg-[hsl(210,70%,55%)] border-[hsl(210,70%,55%)]' : 'border-border hover:border-primary'
                }`}
              >
                {done && <Icon name="Check" size={11} className="text-white" />}
              </button>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className="text-xs font-semibold text-primary">{lesson.subject}</span>
                  <span className="text-xs text-muted-foreground">{lesson.day}</span>
                  <span className="text-xs text-muted-foreground font-mono-nums">{lesson.time}</span>
                </div>
                <div className={`text-sm text-foreground leading-snug ${done ? 'line-through' : ''}`}>
                  {lesson.homework}
                </div>
                <div className="text-xs text-muted-foreground mt-1">Тема: {lesson.topic}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
