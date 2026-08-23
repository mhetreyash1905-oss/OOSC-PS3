import re

with open('frontend/app/platform/page.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Add states
state_to_add = '''
  // Session History Management
  const [dropdownOpen, setDropdownOpen] = useState<string | null>(null);
  const [editingSessionId, setEditingSessionId] = useState<string | null>(null);
  const [editTitleText, setEditTitleText] = useState('');

  const handleDeleteSession = async (id: string) => {
    try {
      const token = await getIdToken();
      if (!token) return;
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/platform/sessions/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setHistory(prev => prev.filter(s => s.session_id !== id));
      if (sessionId === id) {
        setSessionId(null);
        setMessages([]);
        setRightsData(null);
        setRecommendationData(null);
        setStep(1);
      }
    } catch (error) {
      console.error('Failed to delete session', error);
    }
  };

  const handleRenameSession = async (id: string) => {
    if (!editTitleText.trim()) {
      setEditingSessionId(null);
      return;
    }
    try {
      const token = await getIdToken();
      if (!token) return;
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/platform/sessions/${id}/title`, {
        method: 'PUT',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ title: editTitleText.trim() })
      });
      setHistory(prev => prev.map(s => s.session_id === id ? { ...s, title: editTitleText.trim() } : s));
      setEditingSessionId(null);
    } catch (error) {
      console.error('Failed to rename session', error);
    }
  };
'''

content = content.replace(
    'const [loadingHistory, setLoadingHistory] = useState(false);',
    'const [loadingHistory, setLoadingHistory] = useState(false);\n' + state_to_add
)

# 2. Update list rendering
old_list = '''                    <li key={session.session_id}>
                      <button
                        onClick={() => loadPastSession(session.session_id)}
                        className={`w-full text-left px-3 py-2 text-xs font-medium rounded-xl truncate 
transition-colors flex items-center gap-2 ${
                          sessionId === session.session_id
                            ? 'bg-blue-50 dark:bg-[#2f2c2c] text-blue-700 dark:text-orange-300 font-semibold'
                            : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-[#2b2929] hover:text-gray-900 dark:hover:text-gray-200'
                        }`}
                      >
                        <span className="text-gray-400 dark:text-gray-500 shrink-0">dY'</span>
                        <span className="truncate">{session.title}</span>
                      </button>
                    </li>'''

# Regex to find the whole li element (since the icon has weird characters in powershell output like dY')
old_list_regex = re.compile(r'<li key=\{session.session_id\}>.*?</li>', re.DOTALL)

new_list = '''<li key={session.session_id} className="relative group">
                      {editingSessionId === session.session_id ? (
                        <div className="flex items-center gap-1 px-2 py-1">
                          <input 
                            autoFocus
                            type="text" 
                            className="w-full text-xs px-2 py-1 bg-white dark:bg-[#1a1919] border border-gray-300 dark:border-gray-600 rounded text-gray-900 dark:text-gray-100 focus:outline-none" 
                            value={editTitleText}
                            onChange={e => setEditTitleText(e.target.value)}
                            onKeyDown={e => {
                               if (e.key === 'Enter') handleRenameSession(session.session_id);
                               if (e.key === 'Escape') setEditingSessionId(null);
                            }}
                          />
                          <button onClick={() => handleRenameSession(session.session_id)} className="text-green-600 shrink-0">✓</button>
                          <button onClick={() => setEditingSessionId(null)} className="text-red-600 shrink-0">✕</button>
                        </div>
                      ) : (
                        <div className={`flex items-center justify-between w-full text-left px-2 py-1.5 text-xs font-medium rounded-xl transition-colors ${
                          sessionId === session.session_id
                            ? 'bg-blue-50 dark:bg-[#2f2c2c] text-blue-700 dark:text-orange-300 font-semibold'
                            : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-[#2b2929] hover:text-gray-900 dark:hover:text-gray-200'
                        }`}>
                          <button
                            onClick={() => loadPastSession(session.session_id)}
                            className="flex items-center gap-2 truncate flex-1 py-0.5"
                          >
                            <span className="text-gray-400 dark:text-gray-500 shrink-0 text-[10px]">💬</span>
                            <span className="truncate">{session.title}</span>
                          </button>
                          
                          <div className="relative shrink-0 opacity-0 group-hover:opacity-100 transition-opacity z-50">
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                setDropdownOpen(dropdownOpen === session.session_id ? null : session.session_id);
                              }}
                              className="px-1.5 py-0.5 hover:bg-gray-200 dark:hover:bg-gray-700 rounded text-gray-500 font-bold"
                            >
                              ⋮
                            </button>
                            {dropdownOpen === session.session_id && (
                              <div className="absolute left-full top-0 ml-1 w-24 bg-white dark:bg-[#242222] border border-gray-200 dark:border-gray-700 rounded-md shadow-lg py-1 z-[100]">
                                <button 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setEditingSessionId(session.session_id);
                                    setEditTitleText(session.title);
                                    setDropdownOpen(null);
                                  }}
                                  className="w-full text-left px-3 py-1 text-xs hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-colors"
                                >
                                  Rename
                                </button>
                                <button 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteSession(session.session_id);
                                    setDropdownOpen(null);
                                  }}
                                  className="w-full text-left px-3 py-1 text-xs hover:bg-red-50 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400 transition-colors"
                                >
                                  Delete
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </li>'''

content = old_list_regex.sub(new_list, content)

# 3. Add document click listener to close dropdown
click_outside_effect = '''  useEffect(() => {
    const handleClickOutside = () => setDropdownOpen(null);
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);
'''
content = content.replace(
    'export default function PlatformPage() {',
    'export default function PlatformPage() {\n' + click_outside_effect
)


with open('frontend/app/platform/page.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
print('Patched frontend component!')
