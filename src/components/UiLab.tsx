import { useMemo, useState, type ReactNode } from 'react'
import {
  ArrowRight,
  Box,
  Check,
  ChevronDown,
  ChevronRight,
  Code2,
  Download,
  FileInput,
  FilePlus2,
  Files,
  Folder,
  FolderOpen,
  Info,
  Layers3,
  Plus,
  RefreshCw,
  RotateCcw,
  Save,
  Upload,
} from 'lucide-react'
import { CodeBlock } from './CodeBlock'
import { panelPieces, panelSource } from '@/data/panelLab'
import { cn } from '@/lib/utils'

type UiLabProps = {
  onOpenLesson: (lessonId: string) => void
}

type Asset = { name: string; kind: string }
type Version = { name: string; source: 'work' | 'published'; note: string }

const startingAssets: Asset[] = [
  { name: 'Sci-Fi Crate', kind: 'MODEL' },
  { name: 'Utility Terminal', kind: 'MODEL' },
  { name: 'Cargo Trolley', kind: 'MODEL' },
]

const versions: Version[] = [
  { name: 'v003 · work', source: 'work', note: 'Current working revision' },
  { name: 'v002 · published', source: 'published', note: 'Approved for production' },
  { name: 'v001 · published', source: 'published', note: 'First published revision' },
]

function EmptyRows({ count }: { count: number }) {
  return <>{Array.from({ length: count }, (_, index) => <div key={index} className="min-h-11 border-b border-[#30363b] last:border-b-0" aria-hidden="true" />)}</>
}

function Flow({ children }: { children: ReactNode }) {
  return <span className="border border-[#344149] bg-[#141c21] px-2.5 py-1.5 text-center font-mono text-[10px] leading-4 text-[#bac6cc]">{children}</span>
}

export function UiLab({ onOpenLesson }: UiLabProps) {
  const [mode, setMode] = useState<'assemble' | 'explore'>('explore')
  const [activeId, setActiveId] = useState('project')
  const [visibleCount, setVisibleCount] = useState(panelPieces.length)
  const [projectRoot, setProjectRoot] = useState('F:/NBB/Assets')
  const [assetType, setAssetType] = useState('MODEL')
  const [assets, setAssets] = useState(startingAssets)
  const [assetIndex, setAssetIndex] = useState(0)
  const [versionIndex, setVersionIndex] = useState(0)
  const [status, setStatus] = useState('Ready — 3 assets in scene state.')

  const activeIndex = Math.max(0, panelPieces.findIndex((piece) => piece.id === activeId))
  const activePiece = panelPieces[activeIndex]
  const selectedAsset = assets[assetIndex]
  const selectedVersion = versions[versionIndex]
  const visible = (id: string) => panelPieces.findIndex((piece) => piece.id === id) < visibleCount

  const inspect = (id: string) => {
    const index = panelPieces.findIndex((piece) => piece.id === id)
    setActiveId(id)
    if (mode === 'assemble') setVisibleCount((count) => Math.max(count, index + 1))
  }

  const startAssembly = () => {
    setMode('assemble')
    setVisibleCount(1)
    setActiveId('shell')
  }

  const showComplete = () => {
    setMode('explore')
    setVisibleCount(panelPieces.length)
  }

  const advance = () => {
    if (visibleCount < panelPieces.length) {
      const nextCount = visibleCount + 1
      setVisibleCount(nextCount)
      setActiveId(panelPieces[nextCount - 1].id)
    } else {
      showComplete()
    }
  }

  const scanAssets = () => {
    setAssets(startingAssets)
    setAssetIndex(0)
    setVersionIndex(0)
    setStatus(`Scan complete — ${startingAssets.length} ${assetType.toLowerCase()} assets found.`)
    inspect('project')
  }

  const addAsset = () => {
    const next: Asset = { name: `Kitbash Part ${assets.length + 1}`, kind: assetType }
    setAssets((current) => [...current, next])
    setAssetIndex(assets.length)
    setVersionIndex(0)
    setStatus(`${next.name} added to scene state.`)
    inspect('assets')
  }

  const downloadSource = () => {
    const url = URL.createObjectURL(new Blob([panelSource], { type: 'text/x-python' }))
    const link = document.createElement('a')
    link.href = url
    link.download = 'panels.py'
    document.body.appendChild(link)
    link.click()
    link.remove()
    URL.revokeObjectURL(url)
  }

  const inspectorButton = (id: string, label: string) => (
    <button
      type="button"
      onClick={(event) => { event.stopPropagation(); inspect(id) }}
      className="flex min-h-8 min-w-8 cursor-pointer items-center justify-center text-[#b5bdc2] transition-colors hover:bg-[#444b50] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ed8b45]"
      aria-label={`Inspect ${label}`}
      title={`Inspect ${label}`}
    >
      <Code2 className="h-3.5 w-3.5" />
    </button>
  )

  const pieceClass = (id: string) => cn(
    'relative border transition-colors duration-150',
    activeId === id ? 'border-[#ed8b45] bg-[#34383a]' : 'border-transparent',
  )

  const currentActionLabel = useMemo(() => {
    if (visibleCount === panelPieces.length) return 'Explore the complete panel'
    return `Add ${panelPieces[visibleCount].shortLabel}`
  }, [visibleCount])

  return (
    <div className="mx-auto w-full max-w-[1220px] px-5 pb-20 pt-10 sm:px-8 lg:px-12 lg:pt-14">
      <header className="border-b border-[#2a343c] pb-9">
        <div className="flex flex-col gap-7 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-[760px]">
            <p className="mb-5 font-mono text-[11px] uppercase tracking-[0.16em] text-[#ed8b45]">Interactive UI lab · ui/panels.py</p>
            <h1 className="text-[36px] font-semibold leading-tight tracking-[-0.04em] text-[#f0f3f4] sm:text-[50px]">See how the UI fits together.</h1>
            <p className="mt-5 max-w-[700px] text-[16px] leading-7 text-[#a4b1b9]">Explore a working reconstruction of your NBB Asset Manager panel. Select a control to see its Python, or assemble the interface one piece at a time.</p>
          </div>
          <button type="button" onClick={downloadSource} className="secondary-button shrink-0 self-start lg:self-auto"><Download className="h-4 w-4" /> panels.py</button>
        </div>
        <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-2 font-mono text-[10px] uppercase tracking-[0.12em] text-[#7f8f98]">
          <span>1 Panel class</span><span>7 interface pieces</span><span>Real source · sample data</span>
        </div>
      </header>

      <div className="mt-7 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="inline-flex self-start border border-[#35414a] bg-[#11181c] p-1" role="group" aria-label="UI lab mode">
          <button type="button" onClick={startAssembly} aria-pressed={mode === 'assemble'} className={cn('min-h-10 cursor-pointer px-4 text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ed8b45]', mode === 'assemble' ? 'bg-[#ed8b45] text-[#1a120d]' : 'text-[#96a5ae] hover:text-white')}>Assemble step by step</button>
          <button type="button" onClick={showComplete} aria-pressed={mode === 'explore'} className={cn('min-h-10 cursor-pointer px-4 text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ed8b45]', mode === 'explore' ? 'bg-[#ed8b45] text-[#1a120d]' : 'text-[#96a5ae] hover:text-white')}>Explore complete UI</button>
        </div>
        <p className="text-xs leading-5 text-[#7f8f98]">Interactive teaching model — no files are changed.</p>
      </div>

      <ol className="mt-6 grid grid-cols-4 gap-px border border-[#303b43] bg-[#303b43] sm:grid-cols-7" aria-label="Panel construction pieces">
        {panelPieces.map((piece, index) => (
          <li key={piece.id} className="min-w-0">
            <button
              type="button"
              onClick={() => inspect(piece.id)}
              aria-current={activeId === piece.id ? 'step' : undefined}
              className={cn(
                'flex min-h-14 w-full cursor-pointer flex-col items-start justify-center gap-0.5 px-2.5 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#ed8b45] sm:items-center sm:text-center',
                activeId === piece.id ? 'bg-[#2b211b] text-[#f0b38b]' : index < visibleCount ? 'bg-[#151d22] text-[#a9b6bd] hover:bg-[#1c262c]' : 'bg-[#11171b] text-[#5f6e77] hover:bg-[#182026]',
              )}
            >
              <span className="font-mono text-[9px] text-[#73838d]">{String(index + 1).padStart(2, '0')}</span>
              <span className="text-[11px] font-semibold">{piece.shortLabel}</span>
            </button>
          </li>
        ))}
      </ol>

      <div className="mt-8 grid items-start gap-8 lg:grid-cols-[minmax(0,400px)_minmax(0,1fr)] xl:gap-11">
        <div className="lg:sticky lg:top-24">
          <div className="mb-3 flex items-center justify-between gap-4">
            <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#9aa8b1]">Blender · 3D Viewport sidebar</p>
            <span className="font-mono text-[9px] text-[#687983]">PRESS N</span>
          </div>
          <div className="overflow-hidden border border-[#4b545a] bg-[#252a2e] shadow-[0_20px_60px_rgba(0,0,0,0.25)]" aria-label="Interactive reconstruction of the NBB Asset Manager Blender panel">
            <div className="flex h-10 items-center justify-between border-b border-[#171b1e] bg-[#1d2225] px-3 text-[11px] text-[#bec6ca]">
              <span>3D Viewport</span><span className="font-mono text-[9px] text-[#859198]">N-PANEL PREVIEW</span>
            </div>
            <div className="grid grid-cols-[42px_minmax(0,1fr)]">
              <div className="border-r border-[#1d2225] bg-[#262b2f] py-2">
                <div className="flex min-h-20 items-center justify-center border-l-2 border-[#ed8b45] bg-[#383e42] px-1 text-center text-[9px] leading-3 text-[#edf0f1]">NBB<br />Assets</div>
                <div className="mt-1 flex min-h-14 items-center justify-center px-1 text-center text-[9px] leading-3 text-[#89949a]">Item</div>
                <div className="mt-1 flex min-h-14 items-center justify-center px-1 text-center text-[9px] leading-3 text-[#89949a]">Tool</div>
              </div>
              <div className="min-w-0 bg-[#30363a] p-2 text-[#d9dfe2]">
                <button type="button" onClick={() => inspect('shell')} className={cn('flex min-h-11 w-full cursor-pointer items-center gap-2 border px-2 text-left text-[12px] font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ed8b45]', activeId === 'shell' ? 'border-[#ed8b45] bg-[#3c4144]' : 'border-transparent hover:bg-[#3a4044]')} aria-label="Inspect panel placement">
                  <ChevronDown className="h-3.5 w-3.5" /><span className="flex-1">NBB Asset Manager</span><Code2 className="h-3.5 w-3.5 text-[#aeb8bd]" />
                </button>

                {visible('project') && (
                  <section className={cn(pieceClass('project'), 'mt-1 p-2')} aria-label="Project controls" onClick={() => inspect('project')}>
                    <div className="flex min-h-8 items-center gap-2"><Folder className="h-4 w-4 text-[#c7d0d4]" /><span className="flex-1 text-[11px] font-semibold">Project</span>{inspectorButton('project', 'project controls')}</div>
                    <input value={projectRoot} onChange={(event) => { setProjectRoot(event.target.value); inspect('project') }} onClick={(event) => event.stopPropagation()} className="mt-1 min-h-11 w-full border border-[#20262a] bg-[#24292d] px-2 font-mono text-[10px] text-[#e1e6e8] outline-none focus:border-[#ed8b45]" aria-label="Project root preference" />
                    <button type="button" onClick={(event) => { event.stopPropagation(); scanAssets() }} className="mt-1 flex min-h-11 w-full cursor-pointer items-center justify-center gap-2 border border-[#50595f] bg-[#41494e] px-2 text-[11px] font-medium transition-colors hover:bg-[#515b61] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ed8b45]"><RefreshCw className="h-3.5 w-3.5" /> Scan Assets</button>
                    {status && <div className="mt-2 flex items-start gap-2 text-[10px] leading-4 text-[#c5d0d5]"><Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#8fb6cb]" /><span>{status}</span></div>}
                  </section>
                )}

                {visible('type') && (
                  <section className={cn(pieceClass('type'), 'mt-1 flex min-h-14 items-center gap-2 p-2')} aria-label="Asset type property" onClick={() => inspect('type')}>
                    <label htmlFor="asset-type" className="shrink-0 text-[11px]">Type</label>
                    <select id="asset-type" value={assetType} onChange={(event) => { setAssetType(event.target.value); setStatus(`Asset type set to ${event.target.value}. Scan to apply it.`); inspect('type') }} onClick={(event) => event.stopPropagation()} className="min-h-11 min-w-0 flex-1 cursor-pointer border border-[#20262a] bg-[#24292d] px-2 text-[11px] text-[#e1e6e8] outline-none focus:border-[#ed8b45]">
                      <option value="MODEL">Model</option><option value="MATERIAL">Material</option><option value="COLLECTION">Collection</option>
                    </select>
                    {inspectorButton('type', 'asset type property')}
                  </section>
                )}

                {visible('assets') && (
                  <section className={cn(pieceClass('assets'), 'mt-1 p-2')} aria-label="Asset list and commands" onClick={() => inspect('assets')}>
                    <div className="mb-1 flex min-h-8 items-center gap-2"><Layers3 className="h-3.5 w-3.5" /><span className="flex-1 text-[10px] font-semibold">Assets</span>{inspectorButton('assets', 'asset list')}</div>
                    <div className="grid grid-cols-[minmax(0,1fr)_44px] gap-1">
                      <div className="border border-[#20262a] bg-[#24292d]" role="listbox" aria-label="Assets">
                        {assets.map((asset, index) => (
                          <button key={asset.name} type="button" role="option" aria-selected={assetIndex === index} onClick={(event) => { event.stopPropagation(); setAssetIndex(index); setVersionIndex(0); setStatus(`${asset.name} selected.`); inspect('assets') }} className={cn('flex min-h-11 w-full cursor-pointer items-center gap-2 border-b border-[#30363b] px-2 text-left text-[10px] transition-colors last:border-b-0 hover:bg-[#394147] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#ed8b45]', assetIndex === index ? 'bg-[#526d80] text-white' : 'text-[#d1d8dc]')}>
                            <Box className="h-3.5 w-3.5 shrink-0" /><span className="truncate">{asset.name}</span>
                          </button>
                        ))}
                        <EmptyRows count={Math.max(0, 5 - assets.length)} />
                      </div>
                      <div className="flex flex-col gap-1">
                        <button type="button" onClick={(event) => { event.stopPropagation(); addAsset() }} className="flex min-h-11 cursor-pointer items-center justify-center border border-[#50595f] bg-[#41494e] text-[#e1e6e8] transition-colors hover:bg-[#515b61] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ed8b45]" aria-label="New asset" title="New asset"><Plus className="h-4 w-4" /></button>
                        <button type="button" onClick={(event) => { event.stopPropagation(); setStatus(`Open Explorer invoked for ${selectedAsset?.name ?? 'the project'}.`); inspect('assets') }} className="flex min-h-11 cursor-pointer items-center justify-center border border-[#50595f] bg-[#41494e] text-[#e1e6e8] transition-colors hover:bg-[#515b61] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ed8b45]" aria-label="Open asset folder" title="Open asset folder"><FolderOpen className="h-4 w-4" /></button>
                      </div>
                    </div>
                  </section>
                )}

                {visible('versions') && selectedAsset && (
                  <section className={cn(pieceClass('versions'), 'mt-2 bg-[#2b3135] p-2')} aria-label="Version list" onClick={() => inspect('versions')}>
                    <div className="flex min-h-8 items-center gap-2"><Files className="h-3.5 w-3.5" /><span className="min-w-0 flex-1 truncate text-[10px] font-semibold">Versions: {selectedAsset.name}</span>{inspectorButton('versions', 'version list')}</div>
                    <div className="mt-1 grid grid-cols-[minmax(0,1fr)_44px] gap-1">
                      <div className="border border-[#20262a] bg-[#24292d]" role="listbox" aria-label="Versions">
                        {versions.map((version, index) => (
                          <button key={version.name} type="button" role="option" aria-selected={versionIndex === index} onClick={(event) => { event.stopPropagation(); setVersionIndex(index); setStatus(`${version.name} selected — ${version.note}.`); inspect('versions') }} className={cn('flex min-h-11 w-full cursor-pointer items-center gap-2 border-b border-[#30363b] px-2 text-left text-[10px] transition-colors last:border-b-0 hover:bg-[#394147] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#ed8b45]', versionIndex === index ? 'bg-[#526d80] text-white' : 'text-[#d1d8dc]')}>
                            <FilePlus2 className="h-3.5 w-3.5 shrink-0" /><span className="truncate">{version.name}</span>
                          </button>
                        ))}
                        <EmptyRows count={2} />
                      </div>
                      <button type="button" onClick={(event) => { event.stopPropagation(); setStatus(`Versions refreshed for ${selectedAsset.name}.`); inspect('versions') }} className="flex min-h-11 cursor-pointer items-start justify-center border border-[#50595f] bg-[#41494e] pt-3 text-[#e1e6e8] transition-colors hover:bg-[#515b61] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ed8b45]" aria-label="Refresh versions" title="Refresh versions"><RefreshCw className="h-4 w-4" /></button>
                    </div>

                    {visible('actions') && selectedVersion && (
                      <div className={cn(pieceClass('actions'), 'mt-1 flex items-center gap-1 p-1')} onClick={(event) => event.stopPropagation()}>
                        <button type="button" onClick={() => { setStatus(`Load invoked: ${selectedAsset.name} ${selectedVersion.name}.`); inspect('actions') }} className="flex min-h-11 min-w-0 flex-1 cursor-pointer items-center justify-center gap-1.5 border border-[#50595f] bg-[#41494e] px-2 text-[10px] transition-colors hover:bg-[#515b61] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ed8b45]"><FileInput className="h-3.5 w-3.5" /><span className="truncate">Load Version</span></button>
                        {selectedVersion.source === 'work' && <button type="button" onClick={() => { setStatus(`Publish invoked: ${selectedAsset.name} ${selectedVersion.name}.`); inspect('actions') }} className="flex min-h-11 min-w-0 flex-1 cursor-pointer items-center justify-center gap-1.5 border border-[#50595f] bg-[#41494e] px-2 text-[10px] transition-colors hover:bg-[#515b61] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ed8b45]"><Upload className="h-3.5 w-3.5" /><span className="truncate">Publish</span></button>}
                        {inspectorButton('actions', 'version actions')}
                      </div>
                    )}
                  </section>
                )}

                {visible('save') && selectedAsset && (
                  <div className={cn(pieceClass('save'), 'mt-1 flex items-center gap-1 p-1')}>
                    <button type="button" onClick={() => { setStatus(`Save Work Version invoked for ${selectedAsset.name}.`); inspect('save') }} className="flex min-h-11 flex-1 cursor-pointer items-center justify-center gap-2 border border-[#59646a] bg-[#465157] px-2 text-[11px] font-medium transition-colors hover:bg-[#58666e] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ed8b45]"><Save className="h-3.5 w-3.5" /> Save Work Version</button>
                    {inspectorButton('save', 'save work version')}
                  </div>
                )}
              </div>
            </div>
          </div>
          <p className="mt-3 text-[11px] leading-5 text-[#7f8f98]">Try Scan, select an asset or version, and watch the conditional controls and scene-state feedback.</p>
          {mode === 'assemble' && (
            <div className="mt-5 flex gap-2">
              <button type="button" onClick={advance} className="primary-button flex-1">{currentActionLabel} <ArrowRight className="h-4 w-4" /></button>
              <button type="button" onClick={startAssembly} className="secondary-button px-3" aria-label="Restart panel assembly" title="Restart assembly"><RotateCcw className="h-4 w-4" /></button>
            </div>
          )}
        </div>

        <section className="min-w-0" aria-live="polite" aria-label="Selected interface piece explanation">
          <div className="border-b border-[#2d383f] pb-6">
            <p className="section-kicker">Piece {String(activeIndex + 1).padStart(2, '0')} · source lines {activePiece.lines}</p>
            <h2 className="text-[27px] font-semibold leading-tight tracking-[-0.03em] text-[#e9eef0] sm:text-[32px]">{activePiece.title}</h2>
            <p className="mt-4 text-[15px] leading-7 text-[#a5b2ba]">{activePiece.summary}</p>
          </div>

          <div className="mt-6"><CodeBlock code={activePiece.code} label={`panels.py · ${activePiece.label}`} maxHeight={340} /></div>

          <div className="mt-7 grid gap-6 border-b border-[#2d383f] pb-7 sm:grid-cols-2">
            <div><h3 className="text-xs font-semibold uppercase tracking-[0.1em] text-[#d6dfe3]">How it works</h3><p className="mt-3 text-sm leading-6 text-[#96a5ae]">{activePiece.explanation}</p></div>
            <div><h3 className="text-xs font-semibold uppercase tracking-[0.1em] text-[#d6a17e]">From Unreal</h3><p className="mt-3 text-sm leading-6 text-[#96a5ae]">{activePiece.unreal}</p></div>
          </div>

          <div className="mt-7">
            <h3 className="text-xs font-semibold uppercase tracking-[0.1em] text-[#d6dfe3]">The data / command path</h3>
            <div className="mt-4 grid grid-cols-[1fr_auto_1fr_auto_1fr] items-center gap-1.5 sm:gap-2">
              <Flow>{activePiece.flow[0]}</Flow><ChevronRight className="h-4 w-4 text-[#647680]" aria-hidden="true" />
              <Flow>{activePiece.flow[1]}</Flow><ChevronRight className="h-4 w-4 text-[#647680]" aria-hidden="true" />
              <Flow>{activePiece.flow[2]}</Flow>
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-4 border-t border-[#2d383f] pt-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3"><Check className="mt-0.5 h-4 w-4 shrink-0 text-[#a8c99b]" /><p className="max-w-[440px] text-xs leading-5 text-[#84959f]">Panel.draw() should stay cheap. Operators perform the work; properties hold the state; the next redraw displays the result.</p></div>
            <button type="button" onClick={() => onOpenLesson('panels')} className="text-button shrink-0">Panels lesson <ArrowRight className="h-4 w-4" /></button>
          </div>
        </section>
      </div>

      <details className="group mt-14 border-t border-[#2a343c] pt-6">
        <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-4 text-sm font-semibold text-[#cbd5da] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ed8b45]">
          <span className="flex items-center gap-2"><Code2 className="h-4 w-4 text-[#ed8b45]" /> Read the complete panels.py source</span>
          <ChevronDown className="h-4 w-4 text-[#84959f] transition-transform group-open:rotate-180" />
        </summary>
        <div className="mt-5"><CodeBlock code={panelSource} label="ui/panels.py · complete source" maxHeight={620} /></div>
      </details>
    </div>
  )
}
