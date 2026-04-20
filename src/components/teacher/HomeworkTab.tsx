import { useState } from 'react';
import { weekSchedules, SUBJECTS } from '@/data/journalData';
import Icon from '@/components/ui/icon';

export default function HomeworkTab() {
  const [selectedSubject, setSelectedSubject] = useState<string>('Все');
  const allLessons = weekSchedules.flatMap(w =>
    w.lessons.map(l => ({ ...l, week: w.week }))
  );
  const filtered = selectedSubject === 'Все'
    ? allLessons
    : allLessons.filter(l => l.subject === selectedSubject);

  const [editId, setEditId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-foreground">Домашние задания</h2>
          <p className="text-sm text-muted-foreground mt-0.5">Управление ДЗ по урокам</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded text-sm font-medium hover:bg-primary/90 transition-colors">
          <Icon name="Plus" size={14} />
          Добавить ДЗ
        </button>
      </div>

      {/* Subject filter */}
      <div className="flex gap-1.5 flex-wrap mb-6">
        {['Все', ...SUBJECTS].map(s => (
          <button
            key={s}
            onClick={() => setSelectedSubject(s)}
            className={`px-3 py-1 rounded text-xs font-medium border transition-all ${
              selectedSubject === s ? 'bg-primary text-primary-foreground border-primary' : 'bg-muted text-muted-foreground border-transparent hover:border-border'
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {/* HW list */}
      <div className="space-y-2">
        {filtered.map((lesson, i) => {
          const key = `${lesson.week}-${lesson.day}-${lesson.subject}`;
          const isEditing = editId === key;
          return (
            <div key={i} className="bg-card border border-border rounded-lg p-4 flex items-start gap-4 hover:border-primary/30 transition-all">
              <div className="flex-shrink-0 w-2 h-2 rounded-full bg-[hsl(210,70%,55%)] mt-2" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className="text-xs font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded">{lesson.subject}</span>
                  <span className="text-xs text-muted-foreground">{lesson.day}, {lesson.week}</span>
                  <span className="text-xs text-muted-foreground font-mono-nums">{lesson.time}</span>
                </div>
                <div className="text-sm font-medium text-foreground mb-1">{lesson.topic}</div>
                {isEditing ? (
                  <div className="flex gap-2 mt-2">
                    <input
                      autoFocus
                      className="flex-1 text-sm border border-primary rounded px-2 py-1 outline-none bg-white"
                      value={editText}
                      onChange={e => setEditText(e.target.value)}
                    />
                    <button onClick={() => setEditId(null)} className="px-3 py-1 bg-primary text-primary-foreground text-xs rounded font-medium">
                      Сохранить
                    </button>
                    <button onClick={() => setEditId(null)} className="px-3 py-1 bg-muted text-muted-foreground text-xs rounded">
                      Отмена
                    </button>
                  </div>
                ) : (
                  <div className="flex items-start gap-1.5 mt-1">
                    <Icon name="BookOpen" size={13} className="text-muted-foreground mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-muted-foreground">{lesson.homework}</span>
                  </div>
                )}
              </div>
              {!isEditing && (
                <button
                  onClick={() => { setEditId(key); setEditText(lesson.homework); }}
                  className="flex-shrink-0 p-1.5 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded transition-colors"
                >
                  <Icon name="Pencil" size={13} />
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
