import { Role } from '@/data/journalData';
import Icon from '@/components/ui/icon';

interface TopNavProps {
  role: Role;
  activeTab: string;
  onTabChange: (tab: string) => void;
  onRoleSwitch: () => void;
}

const teacherTabs = [
  { id: 'classes', label: 'Классы', icon: 'Users' },
  { id: 'schedule', label: 'Расписание', icon: 'Calendar' },
  { id: 'homework', label: 'Домашние задания', icon: 'BookOpen' },
  { id: 'grades', label: 'Отметки', icon: 'ClipboardList' },
];

const studentTabs = [
  { id: 'grades', label: 'Отметки', icon: 'ClipboardList' },
  { id: 'homework', label: 'ДЗ', icon: 'BookOpen' },
  { id: 'schedule', label: 'Расписание', icon: 'Calendar' },
];

export default function TopNav({ role, activeTab, onTabChange, onRoleSwitch }: TopNavProps) {
  const tabs = role === 'teacher' ? teacherTabs : studentTabs;

  return (
    <header className="bg-[hsl(220,35%,18%)] text-white shadow-lg sticky top-0 z-50">
      <div className="flex items-center justify-between px-6 h-14 border-b border-[hsl(220,30%,28%)]">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 bg-[hsl(210,70%,55%)] rounded flex items-center justify-center flex-shrink-0">
            <Icon name="BookMarked" size={14} className="text-white" />
          </div>
          <span className="text-sm font-semibold tracking-wide text-white/90 hidden sm:block">
            Электронный журнал
          </span>
        </div>

        <nav className="flex items-center gap-1">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded text-xs font-medium transition-all duration-150 ${
                activeTab === tab.id
                  ? 'bg-[hsl(210,70%,55%)] text-white'
                  : 'text-white/60 hover:text-white/90 hover:bg-white/8'
              }`}
            >
              <Icon name={tab.icon} size={13} />
              <span className="hidden sm:block">{tab.label}</span>
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <div className="text-xs text-white/50 hidden md:block">
            {role === 'teacher' ? 'Преподаватель' : 'Ученик: Александров М.'}
          </div>
          <button
            onClick={onRoleSwitch}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded border border-white/20 text-xs text-white/70 hover:text-white hover:border-white/40 transition-all"
          >
            <Icon name="RefreshCw" size={11} />
            <span className="hidden sm:block">{role === 'teacher' ? 'Режим ученика' : 'Режим учителя'}</span>
          </button>
        </div>
      </div>
    </header>
  );
}
