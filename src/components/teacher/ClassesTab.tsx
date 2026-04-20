import { useState } from 'react';
import { classes, SUBJECTS } from '@/data/journalData';
import Icon from '@/components/ui/icon';

function avg(grades: number[]) {
  if (!grades.length) return '—';
  return (grades.reduce((a, b) => a + b, 0) / grades.length).toFixed(1);
}

function gradeColor(g: number | string) {
  const n = typeof g === 'string' ? parseFloat(g) : g;
  if (n >= 4.5) return 'grade-5';
  if (n >= 3.5) return 'grade-4';
  if (n >= 2.5) return 'grade-3';
  return 'grade-2';
}

function gradeBg(g: string) {
  const n = parseFloat(g);
  if (isNaN(n)) return '';
  if (n >= 4.5) return 'grade-bg-5';
  if (n >= 3.5) return 'grade-bg-4';
  if (n >= 2.5) return 'grade-bg-3';
  return 'grade-bg-2';
}

export default function ClassesTab() {
  const [selectedClass, setSelectedClass] = useState(classes[0]);
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [addGrade, setAddGrade] = useState<{ studentId: number; value: string } | null>(null);

  const handleExport = () => {
    const rows: string[] = [];
    rows.push(['Ученик', ...SUBJECTS, 'Средний балл'].join('\t'));
    selectedClass.students.forEach(s => {
      const avgs = SUBJECTS.map(sub => avg(s.grades[sub] || []));
      const overall = SUBJECTS.flatMap(sub => s.grades[sub] || []);
      const overallAvg = avg(overall);
      rows.push([s.name, ...avgs, overallAvg].join('\t'));
    });
    const blob = new Blob([rows.join('\n')], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Оценки_${selectedClass.name}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-foreground">Управление классами</h2>
          <p className="text-sm text-muted-foreground mt-0.5">Успеваемость учеников по предметам</p>
        </div>
        <button
          onClick={handleExport}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded text-sm font-medium hover:bg-primary/90 transition-colors"
        >
          <Icon name="Download" size={14} />
          Экспорт
        </button>
      </div>

      {/* Class selector */}
      <div className="flex gap-2 mb-6">
        {classes.map(cls => (
          <button
            key={cls.id}
            onClick={() => setSelectedClass(cls)}
            className={`px-4 py-1.5 rounded border text-sm font-medium transition-all ${
              selectedClass.id === cls.id
                ? 'bg-primary text-primary-foreground border-primary'
                : 'bg-card border-border text-foreground hover:border-primary/50'
            }`}
          >
            {cls.name}
          </button>
        ))}
      </div>

      {/* Subject filter */}
      <div className="flex gap-1.5 flex-wrap mb-4">
        <button
          onClick={() => setSelectedSubject(null)}
          className={`px-3 py-1 rounded text-xs font-medium border transition-all ${
            !selectedSubject ? 'bg-primary text-primary-foreground border-primary' : 'bg-muted text-muted-foreground border-transparent hover:border-border'
          }`}
        >
          Все предметы
        </button>
        {SUBJECTS.map(s => (
          <button
            key={s}
            onClick={() => setSelectedSubject(s === selectedSubject ? null : s)}
            className={`px-3 py-1 rounded text-xs font-medium border transition-all ${
              selectedSubject === s ? 'bg-primary text-primary-foreground border-primary' : 'bg-muted text-muted-foreground border-transparent hover:border-border'
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-card rounded-lg border border-border overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th className="text-left px-4 py-3 font-semibold text-foreground w-48">Ученик</th>
              {(selectedSubject ? [selectedSubject] : SUBJECTS).map(sub => (
                <th key={sub} className="px-3 py-3 font-medium text-muted-foreground text-center min-w-[90px]">
                  <div className="text-xs leading-tight">{sub}</div>
                </th>
              ))}
              <th className="px-4 py-3 font-semibold text-center text-foreground">Ср. балл</th>
            </tr>
          </thead>
          <tbody>
            {selectedClass.students.map((student, idx) => {
              const subjects = selectedSubject ? [selectedSubject] : SUBJECTS;
              const allGrades = SUBJECTS.flatMap(s => student.grades[s] || []);
              const overallAvg = avg(allGrades);
              return (
                <tr key={student.id} className={`border-b border-border/50 hover:bg-muted/30 transition-colors ${idx % 2 === 0 ? '' : 'bg-muted/10'}`}>
                  <td className="px-4 py-3 font-medium text-foreground">{student.name}</td>
                  {subjects.map(sub => {
                    const g = student.grades[sub] || [];
                    const a = avg(g);
                    return (
                      <td key={sub} className="px-3 py-3 text-center">
                        <div className="flex flex-wrap gap-1 justify-center mb-1">
                          {g.map((gr, i) => (
                            <span key={i} className={`font-mono-nums text-xs font-semibold w-5 h-5 rounded flex items-center justify-center ${
                              gr === 5 ? 'grade-bg-5 grade-5' :
                              gr === 4 ? 'grade-bg-4 grade-4' :
                              gr === 3 ? 'grade-bg-3 grade-3' :
                              'grade-bg-2 grade-2'
                            }`}>{gr}</span>
                          ))}
                          {(addGrade?.studentId === student.id) && (
                            <input
                              autoFocus
                              type="number"
                              min={2} max={5}
                              className="w-8 h-5 text-xs text-center border border-primary rounded outline-none bg-white font-mono-nums"
                              value={addGrade.value}
                              onChange={e => setAddGrade({ studentId: student.id, value: e.target.value })}
                              onKeyDown={e => {
                                if (e.key === 'Enter') setAddGrade(null);
                                if (e.key === 'Escape') setAddGrade(null);
                              }}
                              onBlur={() => setAddGrade(null)}
                            />
                          )}
                        </div>
                        <div className={`text-xs font-semibold font-mono-nums ${a !== '—' ? gradeColor(parseFloat(a)) : 'text-muted-foreground'}`}>
                          {a}
                        </div>
                      </td>
                    );
                  })}
                  <td className="px-4 py-3 text-center">
                    <span className={`font-mono-nums text-sm font-bold px-2 py-0.5 rounded ${overallAvg !== '—' ? `${gradeColor(parseFloat(overallAvg))} ${gradeBg(overallAvg)}` : 'text-muted-foreground'}`}>
                      {overallAvg}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <p className="text-xs text-muted-foreground mt-3">
        <Icon name="Info" size={11} className="inline mr-1" />
        Нажмите на оценку для редактирования — функция будет добавлена по запросу
      </p>
    </div>
  );
}
