import { useEffect, useMemo, useState } from 'react'
import { BookOpen, Braces, ChevronRight, Menu, RotateCcw, Search, X } from 'lucide-react'
import { ApiMap } from '@/components/ApiMap'
import { BookLibrary } from '@/components/BookLibrary'
import { CourseSidebar } from '@/components/CourseSidebar'
import { FieldGuide } from '@/components/FieldGuide'
import { LessonView } from '@/components/LessonView'
import { UiLab } from '@/components/UiLab'
import { lessons } from '@/data/course'
import { cn } from '@/lib/utils'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Sheet, SheetContent, SheetDescription, SheetTitle } from '@/components/ui/sheet'

type View = 'learn' | 'book' | 'map' | 'ui' | 'guide'

const PROGRESS_KEY = 'bpy-bridge-progress-v1'
const POSITION_KEY = 'bpy-bridge-position-v1'

function readCompleted() {
  try {
    const saved = JSON.parse(localStorage.getItem(PROGRESS_KEY) ?? '[]')
    return new Set<string>(Array.isArray(saved) ? saved.filter((id) => lessons.some((lesson) => lesson.id === id)) : [])
  } catch {
    return new Set<string>()
  }
}

function initialPosition() {
  const hashMatch = window.location.hash.match(/^#lesson\/([a-z-]+)$/)
  if (hashMatch && lessons.some((lesson) => lesson.id === hashMatch[1])) return hashMatch[1]
  const saved = localStorage.getItem(POSITION_KEY)
  return saved && lessons.some((lesson) => lesson.id === saved) ? saved : lessons[0].id
}

function initialView(): View {
  if (window.location.hash === '#book-library') return 'book'
  if (window.location.hash === '#api-map') return 'map'
  if (window.location.hash === '#ui-lab') return 'ui'
  if (window.location.hash === '#field-guide') return 'guide'
  return 'learn'
}

function Brand() {
  return (
    <div className="flex items-center gap-3">
      <svg width="29" height="29" viewBox="0 0 29 29" fill="none" aria-hidden="true">
        <path d="M4 8.5 14.5 3 25 8.5v12L14.5 26 4 20.5v-12Z" stroke="#ed8b45" strokeWidth="1.5" />
        <path d="m4 8.5 10.5 6L25 8.5M14.5 14.5V26M9.2 5.8l10.6 6v6.2" stroke="#ed8b45" strokeWidth="1.2" opacity=".65" />
      </svg>
      <div>
        <div className="font-mono text-[17px] font-semibold tracking-[-0.04em] text-[#f0f3f4]">bpy<span className="text-[#ed8b45]">.</span>bridge</div>
        <div className="font-mono text-[8px] uppercase tracking-[0.18em] text-[#77868f]">Unreal → Blender Python</div>
      </div>
    </div>
  )
}

export default function App() {
  const [view, setView] = useState<View>(initialView)
  const [activeLessonId, setActiveLessonId] = useState(initialPosition)
  const [completed, setCompleted] = useState<Set<string>>(readCompleted)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [resetOpen, setResetOpen] = useState(false)
  const [query, setQuery] = useState('')

  const activeLesson = lessons.find((lesson) => lesson.id === activeLessonId) ?? lessons[0]
  const searchResults = useMemo(() => {
    const normalized = query.trim().toLowerCase()
    if (!normalized) return lessons
    return lessons.filter((lesson) => `${lesson.title} ${lesson.summary} ${lesson.bridge.blender}`.toLowerCase().includes(normalized))
  }, [query])

  useEffect(() => {
    localStorage.setItem(PROGRESS_KEY, JSON.stringify([...completed]))
  }, [completed])

  useEffect(() => {
    localStorage.setItem(POSITION_KEY, activeLessonId)
  }, [activeLessonId])

  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement
      const typing = ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName) || target.isContentEditable
      if ((event.key === '/' && !typing) || ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k')) {
        event.preventDefault()
        setSearchOpen(true)
      }
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [])

  useEffect(() => {
    const onHashChange = () => {
      if (window.location.hash === '#book-library') setView('book')
      else if (window.location.hash === '#api-map') setView('map')
      else if (window.location.hash === '#ui-lab') setView('ui')
      else if (window.location.hash === '#field-guide') setView('guide')
      else {
        const match = window.location.hash.match(/^#lesson\/([a-z-]+)$/)
        if (match && lessons.some((lesson) => lesson.id === match[1])) setActiveLessonId(match[1])
        setView('learn')
      }
    }
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

  const navigate = (nextView: View) => {
    setView(nextView)
    const hash = nextView === 'book' ? '#book-library' : nextView === 'map' ? '#api-map' : nextView === 'ui' ? '#ui-lab' : nextView === 'guide' ? '#field-guide' : `#lesson/${activeLessonId}`
    window.history.pushState(null, '', hash)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const selectLesson = (lessonId: string) => {
    setActiveLessonId(lessonId)
    setView('learn')
    setMobileOpen(false)
    setSearchOpen(false)
    setQuery('')
    window.history.pushState(null, '', `#lesson/${lessonId}`)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const toggleComplete = (lessonId: string) => {
    setCompleted((current) => {
      const next = new Set(current)
      if (next.has(lessonId)) next.delete(lessonId)
      else next.add(lessonId)
      return next
    })
  }

  const resetProgress = () => {
    setCompleted(new Set())
    setResetOpen(false)
  }

  const navItems: { id: View; label: string }[] = [
    { id: 'learn', label: 'Course' },
    { id: 'book', label: 'Book library' },
    { id: 'map', label: 'API map' },
    { id: 'ui', label: 'UI lab' },
    { id: 'guide', label: 'Field guide' },
  ]

  return (
    <div className="min-h-screen bg-[#0d1216] text-[#dce3e7]">
      <header className="sticky top-0 z-30 flex h-16 items-center border-b border-[#2a343c] bg-[#0d1216]/95 backdrop-blur-md">
        <button type="button" onClick={() => navigate('learn')} className="flex h-full w-full cursor-pointer items-center px-5 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#ed8b45] sm:w-auto sm:px-6 lg:w-[292px] lg:shrink-0 lg:border-r lg:border-[#2a343c]" aria-label="bpy.bridge course home">
          <Brand />
        </button>
        <nav className="hidden h-full items-center gap-1 px-5 lg:flex" aria-label="Main navigation">
          {navItems.map((item) => (
            <button key={item.id} type="button" onClick={() => navigate(item.id)} aria-current={view === item.id ? 'page' : undefined} className={cn('relative h-full cursor-pointer px-4 text-[13px] font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#ed8b45]', view === item.id ? 'text-[#f0f3f4] after:absolute after:inset-x-4 after:bottom-0 after:h-0.5 after:bg-[#ed8b45]' : 'text-[#87959e] hover:text-[#d9e1e5]')}>
              {item.label}
            </button>
          ))}
        </nav>
        <div className="ml-auto flex items-center gap-2 px-3 sm:px-5">
          <button type="button" onClick={() => setSearchOpen(true)} className="flex min-h-10 cursor-pointer items-center gap-2 border border-[#303c44] bg-[#11181c] px-3 text-[#86959e] transition-colors hover:border-[#4c5a64] hover:text-[#d7e0e4] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ed8b45]" aria-label="Search lessons">
            <Search className="h-4 w-4" />
            <span className="hidden text-xs sm:inline">Find a lesson</span>
            <kbd className="ml-4 hidden border border-[#37434b] px-1.5 py-0.5 font-mono text-[10px] text-[#788790] lg:inline">/</kbd>
          </button>
          <button type="button" onClick={() => setMobileOpen(true)} className="flex h-10 w-10 cursor-pointer items-center justify-center text-[#a1afb7] transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ed8b45] lg:hidden" aria-label="Open course menu">
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </header>

      <div className="flex min-h-[calc(100dvh-4rem)]">
        {view === 'learn' && (
          <aside className="sticky top-16 hidden h-[calc(100dvh-4rem)] w-[292px] shrink-0 border-r border-[#2a343c] lg:block">
            <CourseSidebar activeLessonId={activeLessonId} completed={completed} onSelect={selectLesson} />
          </aside>
        )}
        <main className="min-w-0 flex-1">
          {view === 'learn' && <LessonView key={activeLesson.id} lesson={activeLesson} completed={completed.has(activeLesson.id)} onToggleComplete={toggleComplete} onSelectLesson={selectLesson} />}
          {view === 'book' && <BookLibrary onOpenLesson={selectLesson} />}
          {view === 'map' && <ApiMap />}
          {view === 'ui' && <UiLab onOpenLesson={selectLesson} />}
          {view === 'guide' && <FieldGuide onOpenLesson={selectLesson} onOpenUiLab={() => navigate('ui')} onResetProgress={() => setResetOpen(true)} />}
        </main>
      </div>

      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="left" className="w-[min(88vw,340px)] gap-0 border-[#2a343c] bg-[#101519] p-0 text-[#dce3e7] sm:max-w-[340px]">
          <div className="border-b border-[#2a343c] p-5"><SheetTitle><Brand /></SheetTitle><SheetDescription className="sr-only">Course lesson navigation</SheetDescription></div>
          <div className="grid grid-cols-2 gap-1 border-b border-[#2a343c] p-2 lg:hidden">
            {navItems.map((item) => (
              <button key={item.id} type="button" onClick={() => { navigate(item.id); setMobileOpen(false) }} className={cn('min-h-10 flex-1 cursor-pointer px-2 text-xs font-medium', view === item.id ? 'bg-[#263139] text-white' : 'text-[#91a0a9]')}>{item.label}</button>
            ))}
          </div>
          <div className="min-h-0 flex-1"><CourseSidebar activeLessonId={activeLessonId} completed={completed} onSelect={selectLesson} /></div>
        </SheetContent>
      </Sheet>

      <Dialog open={searchOpen} onOpenChange={(open) => { setSearchOpen(open); if (!open) setQuery('') }}>
        <DialogContent className="top-[12vh] max-w-2xl translate-y-0 gap-0 overflow-hidden border-[#35414a] bg-[#11181d] p-0 text-[#dce3e7] sm:top-[16vh] sm:max-w-2xl" showCloseButton={false}>
          <DialogHeader className="sr-only"><DialogTitle>Search course lessons</DialogTitle><DialogDescription>Find a lesson by title, topic, or Blender concept.</DialogDescription></DialogHeader>
          <div className="relative border-b border-[#35414a]">
            <Search className="absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-[#ed8b45]" />
            <input autoFocus value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search lessons and concepts…" className="h-16 w-full bg-transparent pl-14 pr-12 text-[16px] text-[#edf1f3] outline-none placeholder:text-[#6f7f89]" aria-label="Search course lessons" />
            <button type="button" onClick={() => { setSearchOpen(false); setQuery('') }} className="absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 cursor-pointer items-center justify-center text-[#83929b] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ed8b45]" aria-label="Close lesson search"><X className="h-4 w-4" /></button>
          </div>
          <div className="max-h-[55vh] overflow-y-auto p-2">
            {searchResults.length ? searchResults.map((lesson) => (
              <button key={lesson.id} type="button" onClick={() => selectLesson(lesson.id)} className="group flex min-h-16 w-full cursor-pointer items-center gap-3 px-3 py-3 text-left transition-colors hover:bg-[#1c252b] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#ed8b45]">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center border border-[#35424b] font-mono text-[11px] text-[#9aa8b1]">{lesson.number}</span>
                <span className="min-w-0 flex-1"><span className="block text-sm font-semibold text-[#dfe6e9]">{lesson.title}</span><span className="mt-1 block truncate text-xs text-[#7f8f98]">{lesson.level} · {lesson.duration} min</span></span>
                {completed.has(lesson.id) && <BookOpen className="h-4 w-4 shrink-0 text-[#a8c99b]" />}
                <ChevronRight className="h-4 w-4 shrink-0 text-[#63737d] group-hover:text-[#ed8b45]" />
              </button>
            )) : (
              <div className="px-5 py-12 text-center"><Braces className="mx-auto h-6 w-6 text-[#63737d]" /><p className="mt-3 text-sm font-medium text-[#d2dce1]">No lessons match “{query}”</p><p className="mt-1 text-xs text-[#7e8e97]">Try “operator”, “context”, “provider”, or “panel”.</p></div>
            )}
          </div>
          <div className="flex items-center justify-between border-t border-[#303c44] px-5 py-3 font-mono text-[10px] text-[#6e7e88]"><span>{searchResults.length} lessons</span><span>ESC to close</span></div>
        </DialogContent>
      </Dialog>

      <Dialog open={resetOpen} onOpenChange={setResetOpen}>
        <DialogContent className="border-[#3a454d] bg-[#131a1f] text-[#e0e6e9]">
          <DialogHeader><DialogTitle>Reset course progress?</DialogTitle><DialogDescription className="leading-6 text-[#8f9ea7]">This clears all completed lesson markers stored in this browser. It cannot be undone, but your current lesson position will stay where it is.</DialogDescription></DialogHeader>
          <DialogFooter className="mt-3">
            <button type="button" onClick={() => setResetOpen(false)} className="secondary-button">Keep progress</button>
            <button type="button" onClick={resetProgress} className="primary-button"><RotateCcw className="h-4 w-4" /> Reset progress</button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
