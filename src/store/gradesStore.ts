import { classes, SUBJECTS } from '@/data/journalData';

export interface GradeEntry {
  id: string;
  studentId: number;
  subject: string;
  grade: number;
}

const STORAGE_KEY = 'journal_grades_v1';

function buildInitialGrades(): GradeEntry[] {
  const entries: GradeEntry[] = [];
  let counter = 0;
  classes.forEach(cls => {
    cls.students.forEach(student => {
      SUBJECTS.forEach(subject => {
        const grades = student.grades[subject] || [];
        grades.forEach(g => {
          entries.push({ id: `init-${counter++}`, studentId: student.id, subject, grade: g });
        });
      });
    });
  });
  return entries;
}

export function loadGrades(): GradeEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as GradeEntry[];
  } catch (_e) { /* ignore */ }
  const initial = buildInitialGrades();
  saveGrades(initial);
  return initial;
}

export function saveGrades(grades: GradeEntry[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(grades));
}

export function addGrade(grades: GradeEntry[], studentId: number, subject: string, grade: number): GradeEntry[] {
  const entry: GradeEntry = { id: `${Date.now()}-${Math.random()}`, studentId, subject, grade };
  const next = [...grades, entry];
  saveGrades(next);
  return next;
}

export function removeGrade(grades: GradeEntry[], id: string): GradeEntry[] {
  const next = grades.filter(g => g.id !== id);
  saveGrades(next);
  return next;
}

export function updateGrade(grades: GradeEntry[], id: string, newGrade: number): GradeEntry[] {
  const next = grades.map(g => g.id === id ? { ...g, grade: newGrade } : g);
  saveGrades(next);
  return next;
}

export function getStudentGrades(grades: GradeEntry[], studentId: number, subject: string): GradeEntry[] {
  return grades.filter(g => g.studentId === studentId && g.subject === subject);
}