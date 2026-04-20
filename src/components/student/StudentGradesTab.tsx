import { classes, SUBJECTS, currentStudentId } from '@/data/journalData';
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
    <span className={`inline-flex items-center justify-center w-7 h-7 rounded text-sm font-bold font-mono-nums ${cls}`}>
      {grade}
    </span>
  );
}

export default function StudentGradesTab() {
  const student = classes.flatMap(c => c.students).find(s => s.id === currentStudentId);
  if (!student) return null;

  const handleExport = () => {
    const rows = [`Ученик: ${student.name}`, ''];
    SUBJECTS.forEach(sub => {
      const g = student.grades[sub] || [];
      const a = avg(g);
      rows.push(`${sub}: ${g.join(', ')} | Средний: ${a ? a.toFixed(1) : '—'}`);
    });
    const allGrades = SUBJECTS.flatMap(s => student.grades[s] || []);
    const overall = avg(allGrades);
    rows.push('');
    rows.push(`Общий средний балл: ${overall ? overall.toFixed(1) : '—'}`);
    const blob = new Blob([rows.join('\n')], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Мои_оценки.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const allGrades = SUBJECTS.flatMap(s => student.grades[s] || []);
  const overall = avg(allGrades);

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-foreground">Мои отметки</h2>
          <p className="text-sm text-muted-foreground mt-0.5">{student.name}</p>
        </div>
        <button
          onClick={handleExport}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded text-sm font-medium hover:bg-primary/90 transition-colors"
        >
          <Icon name="Download" size={14} />
          Экспорт
        </button>
      </div>

      {/* Overall */}
      {overall && (
        <div className={`rounded-lg border p-4 mb-6 flex items-center gap-4 ${
          overall >= 4.5 ? 'grade-bg-5 border-green-200' :
          overall >= 3.5 ? 'grade-bg-4 border-blue-200' :
          overall >= 2.5 ? 'grade-bg-3 border-amber-200' :
          'grade-bg-2 border-red-200'
        }`}>
          <div className={`text-4xl font-bold font-mono-nums ${
            overall >= 4.5 ? 'grade-5' : overall >= 3.5 ? 'grade-4' : overall >= 2.5 ? 'grade-3' : 'grade-2'
          }`}>
            {overall.toFixed(1)}
          </div>
          <div>
            <div className="font-semibold text-foreground">Общий средний балл</div>
            <div className="text-sm text-muted-foreground">по всем предметам</div>
          </div>
        </div>
      )}

      {/* Per subject */}
      <div className="space-y-3">
        {SUBJECTS.map(sub => {
          const grades = student.grades[sub] || [];
          const a = avg(grades);
          const aColor = a ? (a >= 4.5 ? 'grade-5' : a >= 3.5 ? 'grade-4' : a >= 2.5 ? 'grade-3' : 'grade-2') : 'text-muted-foreground';
          const aBg = a ? (a >= 4.5 ? 'grade-bg-5' : a >= 3.5 ? 'grade-bg-4' : a >= 2.5 ? 'grade-bg-3' : 'grade-bg-2') : '';
          return (
            <div key={sub} className="bg-card border border-border rounded-lg p-4 flex items-center gap-4">
              <div className="flex-1 min-w-0">
                <div className="font-medium text-foreground mb-2">{sub}</div>
                <div className="flex gap-1.5 flex-wrap">
                  {grades.length ? grades.map((g, i) => <GradeBadge key={i} grade={g} />) : (
                    <span className="text-xs text-muted-foreground">Нет оценок</span>
                  )}
                </div>
              </div>
              {a && (
                <div className={`flex-shrink-0 w-14 h-14 rounded-lg flex flex-col items-center justify-center ${aBg}`}>
                  <span className={`text-xl font-bold font-mono-nums ${aColor}`}>{a.toFixed(1)}</span>
                  <span className={`text-xs ${aColor} opacity-70`}>ср.</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
