import { useMemo, useState } from 'react'
import { ArrowLeftRight, Check, Copy, ExternalLink, Search, X } from 'lucide-react'
import { apiMappings, type ApiMapping } from '@/data/mappings'
import { cn } from '@/lib/utils'
import { copyText } from '@/lib/clipboard'

const categories = ['All', 'Scene', 'Assets', 'UI', 'Math', 'Workflow'] as const

function MappingRow({ mapping }: { mapping: ApiMapping }) {
  const [copied, setCopied] = useState(false)
  const copyBlender = async () => {
    await copyText(mapping.blender)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1600)
  }

  return (
    <article className="border-b border-[#29343c] py-6 last:border-b-0">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="text-[16px] font-semibold text-[#e3e9ec]">{mapping.task}</h2>
        <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#788790]">{mapping.category}</span>
      </div>
      <div className="grid gap-3 lg:grid-cols-2">
        <div className="min-w-0 border border-[#29343c] bg-[#10161a] p-4">
          <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.14em] text-[#84939c]">Unreal Python</p>
          <code className="block overflow-x-auto whitespace-pre-wrap break-words font-mono text-[12px] leading-6 text-[#b7c8d2]">{mapping.unreal}</code>
        </div>
        <div className="relative min-w-0 border border-[#3c332c] bg-[#151614] p-4 pr-12">
          <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.14em] text-[#ba9b83]">Blender Python</p>
          <code className="block overflow-x-auto whitespace-pre-wrap break-words font-mono text-[12px] leading-6 text-[#dcc7b6]">{mapping.blender}</code>
          <button type="button" onClick={copyBlender} className="absolute right-2 top-2 flex h-10 w-10 cursor-pointer items-center justify-center text-[#a68f7e] transition-colors hover:text-[#f0c29f] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ed8b45]" aria-label={`Copy Blender code for ${mapping.task}`}>
            {copied ? <Check className="h-4 w-4 text-[#a8c99b]" /> : <Copy className="h-4 w-4" />}
          </button>
        </div>
      </div>
      <p className="mt-3 max-w-[85ch] text-sm leading-6 text-[#8f9da6]">{mapping.note}</p>
    </article>
  )
}

export function ApiMap() {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState<(typeof categories)[number]>('All')

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase()
    return apiMappings.filter((mapping) => {
      const matchesCategory = category === 'All' || mapping.category === category
      const matchesQuery = !normalized || `${mapping.task} ${mapping.unreal} ${mapping.blender} ${mapping.note}`.toLowerCase().includes(normalized)
      return matchesCategory && matchesQuery
    })
  }, [query, category])

  return (
    <div className="mx-auto w-full max-w-[1060px] px-5 pb-20 pt-10 sm:px-8 lg:px-12 lg:pt-14">
      <header className="max-w-[790px]">
        <div className="mb-5 flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.16em] text-[#ed8b45]">
          <ArrowLeftRight className="h-4 w-4" /> Translation reference
        </div>
        <h1 className="text-[36px] font-semibold leading-tight tracking-[-0.035em] text-[#f0f3f4] sm:text-[48px]">Unreal → Blender API map</h1>
        <p className="mt-5 text-[16px] leading-7 text-[#a4b1b9]">Search by task, not by class name. These are practical analogies—not claims that the two APIs are identical. Read the note before carrying a pattern into production.</p>
      </header>

      <div className="sticky top-[65px] z-10 -mx-1 mt-9 bg-[#0d1216]/95 px-1 py-4 backdrop-blur-md">
        <div className="relative">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#75858f]" />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Try “selection”, “metadata”, or “undo”…"
            aria-label="Search API mappings"
            className="min-h-12 w-full border border-[#34414a] bg-[#12191e] pl-11 pr-12 text-[15px] text-[#e1e7ea] outline-none transition-colors placeholder:text-[#6f7e88] focus:border-[#ed8b45] focus:ring-1 focus:ring-[#ed8b45]"
          />
          {query && (
            <button type="button" onClick={() => setQuery('')} className="absolute right-1 top-1/2 flex h-10 w-10 -translate-y-1/2 cursor-pointer items-center justify-center text-[#8b99a2] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ed8b45]" aria-label="Clear API search">
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1" aria-label="Filter mappings by category">
          {categories.map((item) => (
            <button key={item} type="button" onClick={() => setCategory(item)} aria-pressed={category === item} className={cn('min-h-10 shrink-0 cursor-pointer border px-4 font-mono text-[11px] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ed8b45]', category === item ? 'border-[#9a6039] bg-[#251c16] text-[#edb18a]' : 'border-[#303b43] text-[#8e9ca5] hover:border-[#52616b] hover:text-[#d7dfe3]')}>
              {item}
            </button>
          ))}
        </div>
      </div>

      <p className="mt-3 font-mono text-[11px] text-[#788790]" aria-live="polite">Showing {filtered.length} of {apiMappings.length} mappings</p>
      <div className="mt-2 border-t border-[#29343c]">
        {filtered.length ? filtered.map((mapping) => <MappingRow key={mapping.id} mapping={mapping} />) : (
          <div className="py-16 text-center">
            <Search className="mx-auto h-6 w-6 text-[#64747e]" />
            <h2 className="mt-4 text-lg font-semibold text-[#dbe2e6]">No translation found</h2>
            <p className="mt-2 text-sm text-[#8b9aa3]">Try a broader task name or clear the category filter.</p>
            <button type="button" onClick={() => { setQuery(''); setCategory('All') }} className="secondary-button mt-5">Clear filters</button>
          </div>
        )}
      </div>

      <footer className="mt-10 border-t border-[#29343c] pt-6">
        <a href="https://docs.blender.org/api/current/" target="_blank" rel="noreferrer" className="inline-flex min-h-11 items-center gap-2 text-sm font-medium text-[#d7a17c] transition-colors hover:text-[#f2bd96] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ed8b45]">
          Continue into Blender’s official Python API reference <ExternalLink className="h-4 w-4" />
        </a>
      </footer>
    </div>
  )
}
