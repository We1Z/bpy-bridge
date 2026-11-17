import { Check, ChevronRight, Circle } from 'lucide-react'
import { lessons, modules } from '@/data/course'
import { cn } from '@/lib/utils'

type CourseSidebarProps = {
  activeLessonId: string
  completed: Set<string>
  onSelect: (lessonId: string) => void
}

export function CourseSidebar({ activeLessonId, completed, onSelect }: CourseSidebarProps) {
  const percentage = Math.round((completed.size / lessons.length) * 100)

  return (
    <div className="flex h-full flex-col bg-[#101519]">
      <div className="border-b border-[#273038] px-5 py-5">
        <div className="mb-3 flex items-end justify-between gap-4">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#8e9ba4]">Your progress</p>
            <p className="mt-1 text-sm font-semibold text-[#e9edef]">{completed.size} of {lessons.length} lessons</p>
          </div>
          <span className="font-mono text-xl font-medium text-[#ed8b45]">{percentage}%</span>
        </div>
        <div
          className="h-1 overflow-hidden bg-[#2a343b]"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={percentage}
          aria-label="Course completion"
        >
          <div className="h-full bg-[#ed8b45] transition-transform duration-200" style={{ width: `${percentage}%` }} />
        </div>
      </div>

      <nav className="min-h-0 flex-1 overflow-y-auto px-3 py-4" aria-label="Course lessons">
        {modules.map((module) => (
          <section key={module.id} className="mb-5 last:mb-0">
            <div className="mb-2 flex items-baseline gap-2 px-2">
              <span className="font-mono text-[10px] text-[#687680]">{module.number}</span>
              <h2 className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#9ca8b0]">{module.title}</h2>
            </div>
            <div className="space-y-1">
              {lessons.filter((lesson) => lesson.module === module.id).map((lesson) => {
                const isActive = lesson.id === activeLessonId
                const isComplete = completed.has(lesson.id)
                return (
                  <button
                    key={lesson.id}
                    type="button"
                    onClick={() => onSelect(lesson.id)}
                    aria-current={isActive ? 'page' : undefined}
                    className={cn(
                      'group flex min-h-12 w-full cursor-pointer items-center gap-3 border-l px-3 py-2 text-left transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#ed8b45]',
                      isActive
                        ? 'border-[#ed8b45] bg-[#1d2328] text-[#f4f6f7]'
                        : 'border-transparent text-[#9eabb4] hover:bg-[#171e23] hover:text-[#e1e7ea]',
                    )}
                  >
                    <span className={cn('shrink-0', isComplete ? 'text-[#a8c99b]' : isActive ? 'text-[#ed8b45]' : 'text-[#56636c]')}>
                      {isComplete ? <Check className="h-4 w-4" /> : <Circle className={cn('h-3.5 w-3.5', isActive && 'fill-current')} />}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[13px] font-medium">{lesson.shortTitle}</span>
                      <span className="mt-0.5 block font-mono text-[10px] text-[#6f7d86]">{lesson.number} · {lesson.duration} min</span>
                    </span>
                    {isActive && <ChevronRight className="h-3.5 w-3.5 shrink-0 text-[#ed8b45]" />}
                  </button>
                )
              })}
            </div>
          </section>
        ))}
      </nav>

      <div className="border-t border-[#273038] px-5 py-4">
        <p className="text-[11px] leading-5 text-[#7f8d96]">
          Built from your NBB add-on and <span className="text-[#b9c3c9]">Blender: Advanced Add-On Development</span> by Alex Telford.
        </p>
      </div>
    </div>
  )
}
