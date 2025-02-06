import { useState } from 'react';
import { 
  Maximize, Minimize, Eye, EyeOff, Volume2, VolumeX,
  Book, Clock, Calculator, BookOpen, ChevronRight,
  Settings, User, Bell, Menu, Save, Plus
} from 'lucide-react';
import { Card, CardContent } from '../ui/Card';

const CareerPath = () => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isFocusMode, setIsFocusMode] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [activeTab, setActiveTab] = useState('notes');
  const [notes, setNotes] = useState([]);
  const [currentNote, setCurrentNote] = useState('');
  const [showSidebar, setShowSidebar] = useState(true);
  const [activeModule, setActiveModule] = useState(0);

  const modules = [
    { id: 0, title: 'Introduction to React', progress: 80 },
    { id: 1, title: 'Component Lifecycle', progress: 60 },
    { id: 2, title: 'Hooks Deep Dive', progress: 30 },
  ];

  const sampleTranscript = [
    { time: '0:00', text: 'Welcome to this lesson on React Components.' },
    { time: '0:30', text: 'We\'ll start by understanding the basics.' },
    { time: '1:00', text: 'Components are the building blocks of React applications.' },
  ];

  const saveNote = () => {
    if (currentNote.trim()) {
      setNotes([...notes, {
        id: Date.now(),
        text: currentNote,
        timestamp: new Date().toLocaleTimeString(),
      }]);
      setCurrentNote('');
    }
  };

  return (
    <div className="h-screen bg-[#FEFCE8] dark:bg-gray-900 flex flex-col">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setShowSidebar(!showSidebar)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
            >
              <Menu className="w-5 h-5" />
            </button>
            <h1 className="text-xl font-bold">Learning Workbench</h1>
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
              <Bell className="w-5 h-5" />
            </button>
            <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
              <Settings className="w-5 h-5" />
            </button>
            <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
              <User className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        {showSidebar && (
          <aside className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col">
            <div className="p-4">
              <h2 className="text-lg font-semibold mb-4">Course Modules</h2>
              <div className="space-y-2">
                {modules.map((module) => (
                  <button
                    key={module.id}
                    onClick={() => setActiveModule(module.id)}
                    className={`w-full p-3 rounded-lg text-left flex items-center justify-between ${
                      activeModule === module.id
                        ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                        : 'hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <BookOpen className="w-4 h-4" />
                      {module.title}
                    </span>
                    <div className="w-12 h-1 bg-gray-200 dark:bg-gray-700 rounded-full">
                      <div
                        className="h-full bg-blue-500 rounded-full"
                        style={{ width: `${module.progress}%` }}
                      />
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Study Tools */}
            <div className="mt-auto p-4 border-t border-gray-200 dark:border-gray-700">
              <h3 className="text-sm font-semibold mb-3">Study Tools</h3>
              <div className="grid grid-cols-2 gap-2">
                <button className="p-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg flex items-center gap-2">
                  <Book className="w-4 h-4" />
                  Flashcards
                </button>
                <button className="p-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Timer
                </button>
                <button className="p-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg flex items-center gap-2">
                  <Calculator className="w-4 h-4" />
                  Calculator
                </button>
              </div>
            </div>
          </aside>
        )}

        {/* Main Content */}
        <main className="flex-1 flex">
          {/* Video Section */}
          <div className="flex-1 p-4">
            <Card className="h-full flex flex-col">
              <CardContent className="p-0 flex-1">
                <div className="relative aspect-video">
                  <iframe
                    src="https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?autoplay=0&rel=0&modestbranding=1"
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                  {/* Video Controls */}
                  <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent">
                    <div className="flex items-center justify-between text-white">
                      <div className="flex items-center gap-2">
                        <button onClick={() => setIsFocusMode(!isFocusMode)}>
                          {isFocusMode ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                        <button onClick={() => setIsMuted(!isMuted)}>
                          {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                        </button>
                      </div>
                      <button onClick={() => setIsFullscreen(!isFullscreen)}>
                        {isFullscreen ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Transcript */}
                <div className="p-4 flex-1 overflow-y-auto">
                  <h3 className="text-lg font-semibold mb-4">Transcript</h3>
                  <div className="space-y-4">
                    {sampleTranscript.map((item, index) => (
                      <div
                        key={index}
                        className="flex gap-4 p-2 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg cursor-pointer"
                      >
                        <span className="text-sm text-gray-500">{item.time}</span>
                        <p>{item.text}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Notes Section */}
          <div className="w-96 border-l border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Notes</h2>
              <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                <Save className="w-5 h-5" />
              </button>
            </div>

            {/* Note Input */}
            <div className="mb-4">
              <textarea
                value={currentNote}
                onChange={(e) => setCurrentNote(e.target.value)}
                placeholder="Take notes..."
                className="w-full h-32 p-3 border border-gray-200 dark:border-gray-700 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700"
              />
              <button
                onClick={saveNote}
                className="mt-2 w-full py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Note
              </button>
            </div>

            {/* Notes List */}
            <div className="flex-1 overflow-y-auto">
              <div className="space-y-4">
                {notes.map((note) => (
                  <div
                    key={note.id}
                    className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                  >
                    <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                      {note.timestamp}
                    </div>
                    <p className="text-sm">{note.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default CareerPath;