import { useState } from 'react';
import { Role } from '@/data/journalData';
import TopNav from '@/components/TopNav';
import ClassesTab from '@/components/teacher/ClassesTab';
import ScheduleTab from '@/components/teacher/ScheduleTab';
import HomeworkTab from '@/components/teacher/HomeworkTab';
import GradesTab from '@/components/teacher/GradesTab';
import StudentGradesTab from '@/components/student/StudentGradesTab';
import StudentHomeworkTab from '@/components/student/StudentHomeworkTab';
import StudentScheduleTab from '@/components/student/StudentScheduleTab';

export default function Index() {
  const [role, setRole] = useState<Role>('teacher');
  const [teacherTab, setTeacherTab] = useState('classes');
  const [studentTab, setStudentTab] = useState('grades');

  const activeTab = role === 'teacher' ? teacherTab : studentTab;
  const setActiveTab = role === 'teacher' ? setTeacherTab : setStudentTab;

  const handleRoleSwitch = () => {
    setRole(r => r === 'teacher' ? 'student' : 'teacher');
  };

  const renderContent = () => {
    if (role === 'teacher') {
      switch (teacherTab) {
        case 'classes': return <ClassesTab />;
        case 'schedule': return <ScheduleTab />;
        case 'homework': return <HomeworkTab />;
        case 'grades': return <GradesTab />;
        default: return <ClassesTab />;
      }
    } else {
      switch (studentTab) {
        case 'grades': return <StudentGradesTab />;
        case 'homework': return <StudentHomeworkTab />;
        case 'schedule': return <StudentScheduleTab />;
        default: return <StudentGradesTab />;
      }
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <TopNav
        role={role}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onRoleSwitch={handleRoleSwitch}
      />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-6">
        {renderContent()}
      </main>

      <footer className="border-t border-border py-3 px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <span className="text-xs text-muted-foreground">
            Электронный журнал — {new Date().getFullYear()}
          </span>
          <span className="text-xs text-muted-foreground font-mono-nums">
            {role === 'teacher' ? 'Преподаватель' : '9А · Александров М.'}
          </span>
        </div>
      </footer>
    </div>
  );
}
