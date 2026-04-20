import { useState } from 'react';
import { classes, SUBJECTS } from '@/data/journalData';
import Icon from '@/components/ui/icon';

function avg(grades: number[]) {
  if (!grades.length) return null;
  return grades.reduce((a, b) => a + b, 0) / grades.length;
}

function GradeBadge({ grade }: { grade: number }) {
  const cls =
    grade === 5 ? 'grade-bg-5 grade-5' :
    grade === 4 ? 'grade-bg-4 grade-4' :
    grade === 3 ? 'grade-bg-3 grade-3' :
    'grade-bg-2 grade-2';
  return (
    <span className={`inline-flex items-center justify-center w-6 h-6 rounded text-xs font-bold font-mono-nums ${cls}`}>
      {grade}
    </span>
  );
}

export default function GradesTab() {
  const [selectedClass, setSelectedClass] = useState(classes[0]);
  const [selectedSubject, setSelectedSubject] = useState(SUBJECTS[0]);

  const handleExport = () => {
    const rows = ['Ученик\tОценки\tСредний балл'];
    selectedClass.students.forEach(s => {
      const g = s.grades[selectedSubject] || [];
      const a = avg(g);
      rows.push(`${s.name}\t${g.join(', ')}\t${a ? a.toFixed(1) : '—'}`);
    });
    const blob = new Blob([rows.join('\n')], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Оценки_${selectedClass.name}_${selectedSubject}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-foreground">Отметки</h2>
          <p className="text-sm text-muted-foreground mt-0.5">Журнал оценок по предмету</p>
        </div>
        <button
          onClick={handleExport}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded text-sm font-medium hover:bg-primary/90 transition-colors"
        >
          <Icon name="Download" size={14} />
          Экспорт
        </button>
      </div>

      <div className="flex gap-3 flex-wrap mb-6">
        {/* Class */}
        <div className="flex gap-2">
          {classes.map(cls => (
            <button
              key={cls.id}
              onClick={() => setSelectedClass(cls)}
              className={`px-4 py-1.5 rounded border text-sm font-medium transition-all ${
                selectedClass.id === cls.id ? 'bg-primary text-primary-foreground border-primary' : 'bg-card border-border hover:border-primary/50'
              }`}
            >
              {cls.name}
            </button>
          ))}
        </div>
        {/* Subject */}
        <select
          value={selectedSubject}
          onChange={e => setSelectedSubject(e.target.value)}
          className="px-3 py-1.5 rounded border border-border bg-card text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
        >
          {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-4 gap-3 mb-6">
        {[5, 4, 3, 2].map(g => {
          const count = selectedClass.students.reduce((acc, s) => {
            return acc + (s.grades[selectedSubject] || []).filter(x => x === g).length;
          }, 0);
          const colorCls = g === 5 ? 'grade-5' : g === 4 ? 'grade-4' : g === 3 ? 'grade-3' : 'grade-2';
          const bgCls = g === 5 ? 'grade-bg-5' : g === 4 ? 'grade-bg-4' : g === 3 ? 'grade-bg-3' : 'grade-bg-2';
          return (
            <div key={g} className={`${bgCls} rounded-lg p-3 border border-current/10 text-center`}>
              <div className={`text-2xl font-bold font-mono-nums ${colorCls}`}>{count}</div>
              <div className={`text-xs font-medium ${colorCls} opacity-80`}>Оценок «{g}»</div>
            </div>
          );
        })}
      </div>

      {/* Students list */}
      <div className="bg-card rounded-lg border border-border overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/40">
              <th className="text-left px-4 py-3 font-semibold text-foreground">Ученик</th>
              <th className="px-4 py-3 font-semibold text-foreground text-center">Оценки</th>
              <th className="px-4 py-3 font-semibold text-foreground text-center w-28">Средний балл</th>
            </tr>
          </thead>
          <tbody>
            {selectedClass.students.map((student, idx) => {
              const grades = student.grades[selectedSubject] || [];
              const a = avg(grades);
              const aStr = a ? a.toFixed(1) : '—';
              const aColor = a ? (a >= 4.5 ? 'grade-5' : a >= 3.5 ? 'grade-4' : a >= 2.5 ? 'grade-3' : 'grade-2') : 'text-muted-foreground';
              const aBg = a ? (a >= 4.5 ? 'grade-bg-5' : a >= 3.5 ? 'grade-bg-4' : a >= 2.5 ? 'grade-bg-3' : 'grade-bg-2') : '';
              return (
                <tr key={student.id} className={`border-b border-border/50 hover:bg-muted/20 transition-colors ${idx % 2 === 1 ? 'bg-muted/10' : ''}`}>
                  <td className="px-4 py-3 font-medium text-foreground">{student.name}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1.5 flex-wrap justify-center">
                      {grades.length ? grades.map((g, i) => <GradeBadge key={i} grade={g} />) : (
                        <span className="text-xs text-muted-foreground">Нет оценок</span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={`font-mono-nums text-sm font-bold px-2 py-0.5 rounded ${aColor} ${aBg}`}>
                      {aStr}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
