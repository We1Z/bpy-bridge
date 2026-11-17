import { useState } from 'react'
import {
  ArrowLeftRight,
  ArrowRight,
  BookOpen,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Clock3,
  Download,
  FlaskConical,
  Lightbulb,
  ListChecks,
  RotateCcw,
  Target,
  XCircle,
} from 'lucide-react'
import type { Lesson } from '@/data/course'
import { lessons } from '@/data/course'
import { cn } from '@/lib/utils'
import { CodeBlock } from './CodeBlock'

type LessonViewProps = {
  lesson: Lesson
  completed: boolean
  onToggleComplete: (lessonId: string) => void
  onSelectLesson: (lessonId: string) => void
}

export function LessonView({ lesson, completed, onToggleComplete, onSelectLesson }: LessonViewProps) {
  const [codeTab, setCodeTab] = useState<'unreal' | 'blender'>('blender')
  const [showHint, setShowHint] = useState(false)
  const [showSolution, setShowSolution] = useState(false)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [checked, setChecked] = useState(false)


  const lessonIndex = lessons.findIndex((item) => item.id === lesson.id)
  const nextLesson = lessons[lessonIndex + 1]
  const correct = selectedAnswer === lesson.quiz.answer

  const downloadExample = () => {
    const content = `# ${lesson.title}\n# bpy.bridge — Blender example\n# Source: ${lesson.source}\n\n${lesson.code.blender.trim()}\n`
    const url = URL.createObjectURL(new Blob([content], { type: 'text/x-python' }))
    const link = document.createElement('a')
    link.href = url
    link.download = lesson.code.filename
    document.body.appendChild(link)
    link.click()
    link.remove()
    URL.revokeObjectURL(url)
  }

  return (
    <article className="mx-auto w-full max-w-[1060px] px-5 pb-20 pt-8 sm:px-8 lg:px-12 lg:pt-12">
      <header className="border-b border-[#2a343c] pb-9">
        <div className="mb-5 flex flex-wrap items-center gap-3 font-mono text-[11px] uppercase tracking-[0.14em] text-[#8e9aa3]">
          <span className="text-[#ed8b45]">Lesson {lesson.number}</span>
          <span className="h-3 w-px bg-[#43505a]" />
          <span>{lesson.level}</span>
          <span className="h-3 w-px bg-[#43505a]" />
          <span className="inline-flex items-center gap-1.5 normal-case tracking-normal"><Clock3 className="h-3.5 w-3.5" />{lesson.duration} min</span>
        </div>
        <h1 className="max-w-[820px] text-balance text-[34px] font-semibold leading-[1.12] tracking-[-0.035em] text-[#f2f4f5] sm:text-[44px]">
          {lesson.title}
        </h1>
        <p className="mt-5 max-w-[760px] text-[16px] leading-7 text-[#aab6bd] sm:text-[17px]">{lesson.summary}</p>

        <div className="mt-8 grid gap-6 border-l-2 border-[#ed8b45] pl-5 sm:grid-cols-[1fr_auto] sm:items-end">
          <div>
            <h2 className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.12em] text-[#dbe2e6]">
              <Target className="h-4 w-4 text-[#ed8b45]" /> By the end, you can
            </h2>
            <ul className="space-y-2">
              {lesson.outcomes.map((outcome) => (
                <li key={outcome} className="flex items-start gap-2 text-sm leading-6 text-[#9facb4]">
                  <Check className="mt-1.5 h-3.5 w-3.5 shrink-0 text-[#a8c99b]" />{outcome}
                </li>
              ))}
            </ul>
          </div>
          <div className="flex items-center gap-2 text-xs text-[#87959e] sm:max-w-[180px]">
            <BookOpen className="h-4 w-4 shrink-0" />
            <span>{lesson.source}</span>
          </div>
        </div>
      </header>

      <section className="py-10" aria-labelledby="bridge-heading">
        <div className="mb-5 flex items-center gap-3">
          <ArrowLeftRight className="h-5 w-5 text-[#ed8b45]" />
          <h2 id="bridge-heading" className="text-xl font-semibold tracking-[-0.02em] text-[#edf1f3]">{lesson.bridge.title}</h2>
        </div>
        <div className="grid overflow-hidden border border-[#2b363e] bg-[#11171c] md:grid-cols-2">
          <div className="p-5 sm:p-6">
            <div className="mb-3 flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center bg-[#25333e] font-mono text-[11px] font-bold text-[#9bc4dc]">U</span>
              <h3 className="font-mono text-[11px] uppercase tracking-[0.14em] text-[#a8b5bd]">In Unreal</h3>
            </div>
            <p className="text-[15px] leading-7 text-[#bdc7cd]">{lesson.bridge.unreal}</p>
          </div>
          <div className="border-t border-[#2b363e] bg-[#151b1f] p-5 sm:p-6 md:border-l md:border-t-0">
            <div className="mb-3 flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center bg-[#4a2c1b] font-mono text-[11px] font-bold text-[#f1a36f]">B</span>
              <h3 className="font-mono text-[11px] uppercase tracking-[0.14em] text-[#d9c3b2]">In Blender</h3>
            </div>
            <p className="text-[15px] leading-7 text-[#d1d7da]">{lesson.bridge.blender}</p>
          </div>
        </div>
        <div className="flex items-start gap-3 border-x border-b border-[#2b363e] bg-[#0e1418] px-5 py-4">
          <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-[#e0bd6f]" />
          <p className="text-sm leading-6 text-[#9caab3]"><strong className="font-semibold text-[#d8dfe3]">Translation note: </strong>{lesson.bridge.caution}</p>
        </div>
      </section>

      <section className="pb-10" aria-labelledby="concepts-heading">
        <p className="section-kicker">Understand the API</p>
        <h2 id="concepts-heading" className="section-title">The idea, without the guesswork</h2>
        <div className="mt-6 space-y-7">
          {lesson.concepts.map((concept) => (
            <div key={concept.heading} className="grid gap-2 sm:grid-cols-[220px_1fr] sm:gap-8">
              <h3 className="text-[15px] font-semibold leading-6 text-[#e2e8eb]">{concept.heading}</h3>
              <p className="text-[15px] leading-7 text-[#a8b4bc]">{concept.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-y border-[#2a343c] py-10" aria-labelledby="steps-heading">
        <div className="grid gap-8 md:grid-cols-[0.75fr_1.25fr]">
          <div>
            <p className="section-kicker">Do it in Blender</p>
            <h2 id="steps-heading" className="section-title">Follow the workflow</h2>
            <p className="mt-3 max-w-[36ch] text-sm leading-6 text-[#8e9ca5]">Use a disposable scene. Run each step, observe the result, then change one variable and run it again.</p>
          </div>
          <ol className="space-y-6">
            {lesson.steps.map((step, index) => (
              <li key={step.title} className="flex gap-4">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center border border-[#40505b] font-mono text-[11px] text-[#c3cdd3]">{index + 1}</span>
                <div>
                  <h3 className="text-sm font-semibold leading-6 text-[#e0e6e9]">{step.title}</h3>
                  <p className="mt-1 text-sm leading-6 text-[#98a6af]">{step.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="py-10" aria-labelledby="code-heading">
        <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="section-kicker">Compare the implementation</p>
            <h2 id="code-heading" className="section-title">Same intent, different host API</h2>
          </div>
          <button type="button" onClick={downloadExample} className="secondary-button">
            <Download className="h-4 w-4" /> Download .py
          </button>
        </div>

        <div className="mb-3 grid grid-cols-2 border border-[#2c3740] p-1 md:hidden" role="tablist" aria-label="Code language">
          {(['unreal', 'blender'] as const).map((tab) => (
            <button
              key={tab}
              type="button"
              role="tab"
              aria-selected={codeTab === tab}
              onClick={() => setCodeTab(tab)}
              className={cn('min-h-11 cursor-pointer font-mono text-xs uppercase tracking-[0.1em] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ed8b45]', codeTab === tab ? 'bg-[#283139] text-[#f2f5f6]' : 'text-[#8d9ba4] hover:text-[#d6dee2]')}
            >
              {tab}
            </button>
          ))}
        </div>
        <div className="md:hidden">
          <CodeBlock code={codeTab === 'blender' ? lesson.code.blender : lesson.code.unreal} label={codeTab === 'blender' ? lesson.code.filename : 'unreal_example.py'} />
        </div>
        <div className="hidden gap-4 md:grid md:grid-cols-2">
          <CodeBlock code={lesson.code.unreal} label="Unreal · Python" />
          <CodeBlock code={lesson.code.blender} label={`Blender · ${lesson.code.filename}`} />
        </div>
      </section>

      <section className="mb-10 border border-[#334049] bg-[#12191e] p-5 sm:p-7" aria-labelledby="exercise-heading">
        <div className="flex items-start gap-4">
          <FlaskConical className="mt-1 h-5 w-5 shrink-0 text-[#ed8b45]" />
          <div className="min-w-0 flex-1">
            <p className="section-kicker">Your turn</p>
            <h2 id="exercise-heading" className="mt-1 text-xl font-semibold tracking-[-0.02em] text-[#edf1f3]">Modify the example</h2>
            <p className="mt-3 text-[15px] leading-7 text-[#b3bfc6]">{lesson.exercise.brief}</p>
            <div className="mt-5 flex flex-wrap gap-3">
              <button type="button" onClick={() => setShowHint((value) => !value)} className="text-button" aria-expanded={showHint}>
                <Lightbulb className="h-4 w-4" /> {showHint ? 'Hide hint' : 'Show hint'}
              </button>
              <button type="button" onClick={() => setShowSolution((value) => !value)} className="text-button" aria-expanded={showSolution}>
                {showSolution ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                {showSolution ? 'Hide solution' : 'Reveal solution'}
              </button>
            </div>
            {showHint && <p className="mt-4 border-l border-[#d1ac62] pl-4 text-sm leading-6 text-[#c4b797]">{lesson.exercise.hint}</p>}
            {showSolution && <CodeBlock className="mt-5" code={lesson.exercise.solution} label="One possible solution" maxHeight={360} />}
          </div>
        </div>
      </section>

      <section className="mb-10" aria-labelledby="checkpoint-heading">
        <p className="section-kicker">Checkpoint</p>
        <h2 id="checkpoint-heading" className="section-title">Check your mental model</h2>
        <form
          className="mt-5"
          onSubmit={(event) => {
            event.preventDefault()
            if (selectedAnswer !== null) setChecked(true)
          }}
        >
          <fieldset>
            <legend className="mb-4 text-[16px] font-medium leading-7 text-[#dce3e7]">{lesson.quiz.question}</legend>
            <div className="space-y-2">
              {lesson.quiz.options.map((option, index) => {
                const isSelected = selectedAnswer === index
                const isAnswer = lesson.quiz.answer === index
                return (
                  <label
                    key={option}
                    className={cn(
                      'flex min-h-12 cursor-pointer items-center gap-3 border px-4 py-3 text-sm leading-6 transition-colors duration-150',
                      checked && isAnswer ? 'border-[#617d5b] bg-[#172219] text-[#d7e6d2]' : checked && isSelected ? 'border-[#8a554d] bg-[#251917] text-[#ebc9c2]' : isSelected ? 'border-[#9b633e] bg-[#211b17] text-[#e8ddd5]' : 'border-[#2e3941] text-[#aab6bd] hover:border-[#52616c] hover:bg-[#141b20]',
                    )}
                  >
                    <input
                      type="radio"
                      name={`quiz-${lesson.id}`}
                      value={index}
                      checked={isSelected}
                      onChange={() => { setSelectedAnswer(index); setChecked(false) }}
                      className="h-4 w-4 shrink-0 accent-[#ed8b45]"
                    />
                    <span>{option}</span>
                    {checked && isAnswer && <CheckCircle2 className="ml-auto h-4 w-4 shrink-0 text-[#a8c99b]" />}
                    {checked && isSelected && !isAnswer && <XCircle className="ml-auto h-4 w-4 shrink-0 text-[#d99082]" />}
                  </label>
                )
              })}
            </div>
          </fieldset>
          <div className="mt-4 flex items-center gap-4">
            <button type="submit" disabled={selectedAnswer === null} className="secondary-button disabled:cursor-not-allowed disabled:opacity-40">
              <ListChecks className="h-4 w-4" /> Check answer
            </button>
            {checked && <span aria-live="polite" className={cn('text-sm font-medium', correct ? 'text-[#a8c99b]' : 'text-[#d99082]')}>{correct ? 'Correct.' : 'Not quite—try again.'}</span>}
          </div>
          {checked && <p className="mt-4 max-w-[75ch] text-sm leading-6 text-[#94a3ac]">{lesson.quiz.explanation}</p>}
        </form>
      </section>

      <footer className="border-t border-[#2a343c] pt-7">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <button
            type="button"
            onClick={() => onToggleComplete(lesson.id)}
            className={cn(completed ? 'secondary-button border-[#526c4d] text-[#b8d0b1]' : 'primary-button')}
          >
            {completed ? <RotateCcw className="h-4 w-4" /> : <Check className="h-4 w-4" />}
            {completed ? 'Mark as incomplete' : 'Mark lesson complete'}
          </button>
          {nextLesson ? (
            <button type="button" onClick={() => onSelectLesson(nextLesson.id)} className="next-button">
              <span><span className="block font-mono text-[9px] uppercase tracking-[0.14em] text-[#7f8e97]">Up next · {nextLesson.number}</span><span className="mt-1 block text-sm font-semibold text-[#dce3e7]">{nextLesson.shortTitle}</span></span>
              <ArrowRight className="h-5 w-5 text-[#ed8b45]" />
            </button>
          ) : (
            <div className="flex items-center gap-2 text-sm text-[#a8c99b]"><CheckCircle2 className="h-5 w-5" /> You reached the capstone.</div>
          )}
        </div>
      </footer>
    </article>
  )
}
