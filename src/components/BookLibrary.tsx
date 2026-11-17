import { useMemo, useState } from 'react'
import { ArrowLeft, ArrowRight, BookOpen, FileText, ImageOff, Layers3, Search, X } from 'lucide-react'
import { bookChapters, bookSections, type BookSection } from '@/data/book'
import { cn } from '@/lib/utils'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'

type BookLibraryProps = {
  onOpenLesson: (lessonId: string) => void
}

function PageThumbnail({ section }: { section: BookSection }) {
  const [failed, setFailed] = useState(false)
  return (
    <div className="relative flex aspect-[7/10] w-24 shrink-0 items-center justify-center overflow-hidden bg-[#e9e8e3] sm:w-28">
      {failed ? (
        <div className="flex flex-col items-center gap-2 p-2 text-center text-[#53616a]"><ImageOff className="h-5 w-5" /><span className="text-[10px]">Preview unavailable</span></div>
      ) : (
        <img
          src={section.image}
          alt=""
          loading="lazy"
          onError={() => setFailed(true)}
          className="h-full w-full object-contain transition-transform duration-200 group-hover:scale-[1.025]"
        />
      )}
      <span className="absolute bottom-1 right-1 bg-[#11171c]/90 px-1.5 py-0.5 font-mono text-[9px] text-white">p. {section.page}</span>
    </div>
  )
}

export function BookLibrary({ onOpenLesson }: BookLibraryProps) {
  const [query, setQuery] = useState('')
  const [chapterFilter, setChapterFilter] = useState('all')
  const [selected, setSelected] = useState<BookSection | null>(null)

  const filteredChapters = useMemo(() => {
    const normalized = query.trim().toLowerCase()
    return bookChapters
      .filter((chapter) => chapterFilter === 'all' || chapter.id === chapterFilter)
      .map((chapter) => ({
        ...chapter,
        sections: chapter.sections.filter((section) => !normalized || `${section.id} ${section.title} ${section.summary}`.toLowerCase().includes(normalized)),
      }))
      .filter((chapter) => chapter.sections.length > 0)
  }, [query, chapterFilter])

  const resultCount = filteredChapters.reduce((sum, chapter) => sum + chapter.sections.length, 0)
  const selectedIndex = selected ? bookSections.findIndex((section) => section.id === selected.id) : -1
  const selectedChapter = selected ? bookChapters.find((chapter) => chapter.sections.some((section) => section.id === selected.id)) : null

  const movePreview = (direction: -1 | 1) => {
    const next = bookSections[selectedIndex + direction]
    if (next) setSelected(next)
  }

  return (
    <div className="mx-auto w-full max-w-[1180px] px-5 pb-20 pt-10 sm:px-8 lg:px-12 lg:pt-14">
      <header className="border-b border-[#2a343c] pb-9">
        <div className="mb-5 flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.16em] text-[#ed8b45]"><BookOpen className="h-4 w-4" /> Complete PDF companion</div>
        <h1 className="max-w-[850px] text-[36px] font-semibold leading-tight tracking-[-0.035em] text-[#f0f3f4] sm:text-[48px]">Every key section. One searchable library.</h1>
        <p className="mt-5 max-w-[780px] text-[16px] leading-7 text-[#a4b1b9]">All five chapters, 56 development sections, and the glossary from <span className="text-[#dce3e7]">Blender: Advanced Add-On Development</span>. Open any entry for its summary and the original first-page preview.</p>
        <div className="mt-7 flex flex-wrap gap-x-7 gap-y-3 font-mono text-[11px] text-[#85949d]">
          <span className="inline-flex items-center gap-2"><FileText className="h-4 w-4 text-[#d39166]" />343-page source</span>
          <span className="inline-flex items-center gap-2"><Layers3 className="h-4 w-4 text-[#d39166]" />57 library entries</span>
          <span>Alex Telford · v0.0.8</span>
        </div>
      </header>

      <div className="sticky top-16 z-10 -mx-1 bg-[#0d1216]/95 px-1 py-5 backdrop-blur-md">
        <div className="relative">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#75858f]" />
          <input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search “RNA”, “modal”, “wheels”, “gizmos”…" aria-label="Search the book library" className="min-h-12 w-full border border-[#34414a] bg-[#12191e] pl-11 pr-12 text-[15px] text-[#e1e7ea] outline-none transition-colors placeholder:text-[#6f7e88] focus:border-[#ed8b45] focus:ring-1 focus:ring-[#ed8b45]" />
          {query && <button type="button" onClick={() => setQuery('')} className="absolute right-1 top-1/2 flex h-10 w-10 -translate-y-1/2 cursor-pointer items-center justify-center text-[#8b99a2] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ed8b45]" aria-label="Clear book search"><X className="h-4 w-4" /></button>}
        </div>
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1" aria-label="Filter book chapters">
          <button type="button" onClick={() => setChapterFilter('all')} aria-pressed={chapterFilter === 'all'} className={cn('book-filter', chapterFilter === 'all' && 'book-filter-active')}>All sections</button>
          {bookChapters.map((chapter) => (
            <button key={chapter.id} type="button" onClick={() => setChapterFilter(chapter.id)} aria-pressed={chapterFilter === chapter.id} className={cn('book-filter', chapterFilter === chapter.id && 'book-filter-active')}>{chapter.id === 'glossary' ? 'Glossary' : `Chapter ${chapter.number}`}</button>
          ))}
        </div>
      </div>

      <p className="mb-5 font-mono text-[11px] text-[#788790]" aria-live="polite">Showing {resultCount} of {bookSections.length} entries</p>

      {filteredChapters.length ? filteredChapters.map((chapter) => (
        <section key={chapter.id} className="mb-12" aria-labelledby={`${chapter.id}-title`}>
          <div className="mb-5 grid gap-3 border-t border-[#35414a] pt-5 md:grid-cols-[220px_1fr] md:gap-8">
            <div>
              <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-[#d88d5d]">{chapter.id === 'glossary' ? 'Reference' : `Chapter ${chapter.number}`}</span>
              <h2 id={`${chapter.id}-title`} className="mt-1 text-xl font-semibold tracking-[-0.02em] text-[#e8edef]">{chapter.title}</h2>
              <p className="mt-2 font-mono text-[10px] text-[#74838c]">{chapter.range}</p>
            </div>
            <p className="max-w-[720px] text-sm leading-6 text-[#93a1aa]">{chapter.description}</p>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            {chapter.sections.map((section) => (
              <button key={section.id} type="button" onClick={() => setSelected(section)} className="group flex min-h-40 w-full cursor-pointer gap-4 overflow-hidden border border-[#2d3941] bg-[#11181c] p-3 text-left transition-colors duration-150 hover:border-[#66503f] hover:bg-[#161c20] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ed8b45]" aria-label={`Open section ${section.id}, ${section.title}, page ${section.page}`}>
                <PageThumbnail section={section} />
                <span className="min-w-0 flex-1 py-1">
                  <span className="flex items-center justify-between gap-3"><span className="font-mono text-[10px] text-[#d88d5d]">§ {section.id}</span><ArrowRight className="h-4 w-4 text-[#5f6f79] transition-transform group-hover:translate-x-1 group-hover:text-[#ed8b45]" /></span>
                  <span className="mt-2 block text-[15px] font-semibold leading-6 text-[#dfe6e9]">{section.title}</span>
                  <span className="mt-2 line-clamp-3 text-[12px] leading-5 text-[#8e9da6]">{section.summary}</span>
                  {section.lessonId && <span className="mt-3 inline-block font-mono text-[9px] uppercase tracking-[0.1em] text-[#9fb895]">Hands-on lesson linked</span>}
                </span>
              </button>
            ))}
          </div>
        </section>
      )) : (
        <div className="border-t border-[#2d3941] py-16 text-center"><Search className="mx-auto h-6 w-6 text-[#64747e]" /><h2 className="mt-4 text-lg font-semibold text-[#dbe2e6]">No book sections found</h2><p className="mt-2 text-sm text-[#8b9aa3]">Try a broader topic or clear the chapter filter.</p><button type="button" onClick={() => { setQuery(''); setChapterFilter('all') }} className="secondary-button mt-5">Clear filters</button></div>
      )}

      <footer className="border-t border-[#2a343c] pt-6 text-xs leading-6 text-[#7f8e97]">Page previews come from your supplied PDF and preserve the book’s original page numbering. The PDF itself is not included in this website.</footer>

      <Dialog open={selected !== null} onOpenChange={(open) => { if (!open) setSelected(null) }}>
        <DialogContent className="flex h-[92dvh] max-w-[calc(100%-1rem)] flex-col gap-0 overflow-hidden border-[#3a464e] bg-[#11181d] p-0 text-[#dce3e7] sm:max-w-[1050px]">
          {selected && (
            <>
              <DialogHeader className="shrink-0 border-b border-[#34414a] px-5 py-4 pr-12 text-left sm:px-6">
                <div className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#d88d5d]">{selectedChapter?.title} · Section {selected.id}</div>
                <DialogTitle className="mt-1 text-xl leading-7 text-[#edf1f3]">{selected.title}</DialogTitle>
                <DialogDescription className="text-xs text-[#8998a1]">Book page {selected.page} · PDF page {selected.page + 1}</DialogDescription>
              </DialogHeader>
              <div className="grid min-h-0 flex-1 overflow-y-auto lg:grid-cols-[0.65fr_1.35fr] lg:overflow-hidden">
                <div className="flex flex-col p-5 sm:p-6 lg:overflow-y-auto">
                  <p className="section-kicker">Section briefing</p>
                  <p className="text-[15px] leading-7 text-[#aab7be]">{selected.summary}</p>
                  {selected.lessonId && (
                    <button type="button" onClick={() => { const lessonId = selected.lessonId!; setSelected(null); onOpenLesson(lessonId) }} className="primary-button mt-6 self-start">Open related lesson <ArrowRight className="h-4 w-4" /></button>
                  )}
                  <div className="mt-auto flex gap-2 pt-7">
                    <button type="button" onClick={() => movePreview(-1)} disabled={selectedIndex <= 0} className="secondary-button flex-1 px-3 disabled:cursor-not-allowed disabled:opacity-35"><ArrowLeft className="h-4 w-4" /> Previous</button>
                    <button type="button" onClick={() => movePreview(1)} disabled={selectedIndex >= bookSections.length - 1} className="secondary-button flex-1 px-3 disabled:cursor-not-allowed disabled:opacity-35">Next <ArrowRight className="h-4 w-4" /></button>
                  </div>
                </div>
                <div className="min-h-0 overflow-y-auto border-t border-[#34414a] bg-[#090e11] p-3 sm:p-5 lg:border-l lg:border-t-0">
                  <img src={selected.image} alt={`Book page ${selected.page}: section ${selected.id}, ${selected.title}`} className="mx-auto h-auto w-full max-w-[1008px] bg-white" />
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
