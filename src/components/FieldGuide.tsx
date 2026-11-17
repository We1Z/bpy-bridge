import { useState } from 'react'
import { ArrowRight, BookOpen, Boxes, Bug, Check, Download, ExternalLink, RotateCcw, TerminalSquare } from 'lucide-react'
import { CodeBlock } from './CodeBlock'
import { cn } from '@/lib/utils'

type FieldGuideProps = {
  onOpenLesson: (lessonId: string) => void
  onResetProgress: () => void
}

const tabs = [
  { id: 'debug', label: 'Debug loop', icon: Bug },
  { id: 'anatomy', label: 'NBB anatomy', icon: Boxes },
  { id: 'book', label: 'Book map', icon: BookOpen },
] as const

const debuggingCode = `import bpy\nimport traceback\n\n# Inspect the live API instead of guessing property names.\nobj = bpy.context.object\nif obj:\n    print("Object:", obj.name)\n    print("RNA properties:", [p.identifier for p in obj.bl_rna.properties])\n    print("Custom properties:", dict(obj.items()))\n\ntry:\n    # Your experimental code goes here.\n    if not obj:\n        raise RuntimeError("No active Object")\n    print("Location:", tuple(obj.location))\nexcept Exception:\n    # The full traceback appears in the System Console / terminal.\n    traceback.print_exc()\n    raise`

const reloadCode = `# Windows PowerShell — run from your add-on repository\n# Replace <you> and confirm your actual Blender version first.\nmklink /J "C:\\Users\\<you>\\AppData\\Roaming\\Blender Foundation\\Blender\\5.2\\scripts\\addons\\nbb_asset_manager" "F:\\NBB\\Pipelines\\Blender\\Addons\\nbb_asset_manager"\n\n# Development loop:\n# 1. Edit the source package in your external IDE.\n# 2. In Blender: Text Editor > Text > Reload Scripts.\n# 3. If registration state is stale, restart Blender.\n# 4. Test disable/enable as well as your normal artist workflow.`

export function FieldGuide({ onOpenLesson, onResetProgress }: FieldGuideProps) {
  const [activeTab, setActiveTab] = useState<(typeof tabs)[number]['id']>('debug')

  const downloadCheatSheet = () => {
    const content = `# bpy.bridge field notes\n\n## The three entry points\n- bpy.data — file-wide datablocks.\n- bpy.context — current user/editor state.\n- bpy.ops — registered operators, often context-sensitive.\n\n## The default tool shape\n1. Read and validate context.\n2. Perform pure Python or direct RNA work.\n3. Use an Operator for a user-facing action.\n4. Store structured state in RNA PropertyGroups.\n5. Draw cheap, state-only Panels.\n6. Keep external services and filesystem logic behind bpy-free providers.\n\n## Before shipping\n- Empty selection and wrong mode produce a useful message.\n- Operators return FINISHED or CANCELLED deliberately.\n- register() and unregister() have been tested repeatedly.\n- External side effects are not assumed to be covered by undo.\n- World/local transforms and scene units are explicit.\n- No expensive work runs in Panel.draw().\n`
    const url = URL.createObjectURL(new Blob([content], { type: 'text/markdown' }))
    const link = document.createElement('a')
    link.href = url
    link.download = 'bpy-bridge-field-notes.md'
    document.body.appendChild(link)
    link.click()
    link.remove()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="mx-auto w-full max-w-[1060px] px-5 pb-20 pt-10 sm:px-8 lg:px-12 lg:pt-14">
      <header className="flex flex-col gap-7 border-b border-[#2a343c] pb-9 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-[720px]">
          <p className="mb-5 font-mono text-[11px] uppercase tracking-[0.16em] text-[#ed8b45]">Field guide</p>
          <h1 className="text-[36px] font-semibold leading-tight tracking-[-0.035em] text-[#f0f3f4] sm:text-[48px]">Keep this beside Blender.</h1>
          <p className="mt-5 text-[16px] leading-7 text-[#a4b1b9]">A compact debugging reference, a guided tour of your NBB add-on, and a map back into the supplied book.</p>
        </div>
        <button type="button" onClick={downloadCheatSheet} className="secondary-button shrink-0"><Download className="h-4 w-4" /> Field notes</button>
      </header>

      <div className="mt-8 flex gap-1 overflow-x-auto border-b border-[#2c373f]" role="tablist" aria-label="Field guide topics">
        {tabs.map((tab) => {
          const Icon = tab.icon
          return (
            <button key={tab.id} type="button" role="tab" aria-selected={activeTab === tab.id} onClick={() => setActiveTab(tab.id)} className={cn('flex min-h-12 shrink-0 cursor-pointer items-center gap-2 border-b-2 px-4 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ed8b45]', activeTab === tab.id ? 'border-[#ed8b45] text-[#f0f3f4]' : 'border-transparent text-[#8c9aa3] hover:text-[#d8e0e4]')}>
              <Icon className="h-4 w-4" />{tab.label}
            </button>
          )
        })}
      </div>

      {activeTab === 'debug' && (
        <div className="pt-9">
          <div className="grid gap-10 lg:grid-cols-[0.72fr_1.28fr]">
            <div>
              <p className="section-kicker">A tight feedback loop</p>
              <h2 className="text-2xl font-semibold tracking-[-0.025em] text-[#e9eef0]">Inspect. Change. Observe.</h2>
              <p className="mt-4 text-[15px] leading-7 text-[#9dabb4]">Blender exposes live RNA metadata. When a property name is uncertain, inspect the object rather than guessing from an Unreal equivalent.</p>
              <div className="mt-7 space-y-4">
                {[
                  ['F3', 'Find an Operator by label'],
                  ['N', 'Open the 3D View sidebar'],
                  ['Shift + F4', 'Open a Python Console area'],
                  ['Ctrl + Z', 'Test an undoable Operator'],
                ].map(([keys, action]) => (
                  <div key={keys} className="flex items-center justify-between gap-4 border-b border-[#29343b] pb-3 text-sm">
                    <kbd className="font-mono text-[11px] text-[#d7a17c]">{keys}</kbd><span className="text-right text-[#96a4ad]">{action}</span>
                  </div>
                ))}
              </div>
            </div>
            <CodeBlock code={debuggingCode} label="inspect_live_rna.py" maxHeight={480} />
          </div>
          <div className="mt-12 border-t border-[#2a343c] pt-9">
            <div className="mb-5 flex items-center gap-2"><TerminalSquare className="h-5 w-5 text-[#ed8b45]" /><h2 className="text-xl font-semibold text-[#e7edef]">Your live-source development loop</h2></div>
            <CodeBlock code={reloadCode} label="PowerShell + Blender" maxHeight={340} />
          </div>
        </div>
      )}

      {activeTab === 'anatomy' && (
        <div className="pt-9">
          <div className="max-w-[740px]">
            <p className="section-kicker">Read by responsibility</p>
            <h2 className="text-2xl font-semibold tracking-[-0.025em] text-[#e9eef0]">One scan, six boundaries.</h2>
            <p className="mt-4 text-[15px] leading-7 text-[#9dabb4]">Follow the direction below. The UI never scans folders itself; the provider never touches Blender RNA. That separation is the architecture.</p>
          </div>
          <div className="mt-8 border-y border-[#2d383f]">
            {[
              ['01', 'ui/panels.py', 'Artist intent', 'Draws the NBB Assets tab and invokes nbb.scan_assets.'],
              ['02', 'operators/assets.py', 'Application command', 'Validates, clears state, calls the provider, and reports the result.'],
              ['03', 'preferences.py', 'Configuration edge', 'Builds the configured FolderScanProvider from the project root.'],
              ['04', 'providers/folder_scan.py', 'Pure data source', 'Finds asset folders and returns plain Python AssetInfo objects.'],
              ['05', 'properties.py', 'Scene state', 'Stores asset and version rows with bounds-checked selection.'],
              ['06', 'ui/panels.py', 'Rendered feedback', 'Reads the updated state on redraw and presents the next actions.'],
            ].map(([number, file, role, description]) => (
              <div key={number} className="grid gap-2 border-b border-[#2d383f] py-5 last:border-b-0 sm:grid-cols-[36px_190px_150px_1fr] sm:items-start sm:gap-4">
                <span className="font-mono text-[11px] text-[#6e7d86]">{number}</span>
                <code className="font-mono text-[12px] text-[#d6a17e]">{file}</code>
                <span className="text-sm font-semibold text-[#d7dfe3]">{role}</span>
                <p className="text-sm leading-6 text-[#91a0a9]">{description}</p>
              </div>
            ))}
          </div>
          <button type="button" onClick={() => onOpenLesson('nbb-architecture')} className="primary-button mt-7">Open the architecture lesson <ArrowRight className="h-4 w-4" /></button>
        </div>
      )}

      {activeTab === 'book' && (
        <div className="pt-9">
          <div className="max-w-[740px]">
            <p className="section-kicker">Go deeper with your copy</p>
            <h2 className="text-2xl font-semibold tracking-[-0.025em] text-[#e9eef0]">Blender: Advanced Add-On Development</h2>
            <p className="mt-3 text-sm text-[#84939c]">Alex Telford · First Edition, version 0.0.8 · supplied 343-page PDF</p>
          </div>
          <div className="mt-8 grid gap-px border border-[#2c373f] bg-[#2c373f] md:grid-cols-2">
            {[
              ['Chapter 1', 'Getting Started', 'Scripting workspace, first Operators, Panels, components, and custom properties.', 'first-script'],
              ['Chapter 2', 'API Fundamentals', 'bpy, data model, DNA/RNA, context, Operators, properties, and callbacks.', 'context-data'],
              ['Chapter 3', 'Development in Practice', 'External IDEs, projects, virtual environments, add-ons, extensions, and wheels.', 'addon-package'],
              ['Chapter 4', 'Building Our Own Tools', 'Property types, metadata, undo, debugging, invocation, modal Operators, and Qt.', 'operators'],
              ['Chapter 5', 'Drawables & Gizmos', 'Vectors, matrices, rotations, visual feedback, 2D drawing, and interactive gizmos.', 'capstone'],
            ].map(([chapter, title, description, lessonId]) => (
              <button key={chapter} type="button" onClick={() => onOpenLesson(lessonId)} className="group min-h-48 cursor-pointer bg-[#11171b] p-6 text-left transition-colors hover:bg-[#171e23] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#ed8b45]">
                <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#d39266]">{chapter}</span>
                <span className="mt-2 flex items-center justify-between gap-4 text-lg font-semibold text-[#e1e8eb]">{title}<ArrowRight className="h-4 w-4 text-[#6f7e87] transition-transform group-hover:translate-x-1 group-hover:text-[#ed8b45]" /></span>
                <span className="mt-3 block text-sm leading-6 text-[#91a0a9]">{description}</span>
              </button>
            ))}
            <div className="bg-[#151b1f] p-6">
              <Check className="h-5 w-5 text-[#a8c99b]" />
              <h3 className="mt-3 text-lg font-semibold text-[#e1e8eb]">Suggested reading rhythm</h3>
              <p className="mt-3 text-sm leading-6 text-[#91a0a9]">Complete the matching website lesson first. Then read the book section with Blender open and reproduce one variation without copying.</p>
            </div>
          </div>
          <div className="mt-8 flex flex-wrap gap-5 border-t border-[#2a343c] pt-6">
            <a href="https://docs.blender.org/api/current/" target="_blank" rel="noreferrer" className="resource-link">Blender Python API <ExternalLink className="h-3.5 w-3.5" /></a>
            <a href="https://docs.blender.org/manual/en/latest/advanced/scripting/introduction.html" target="_blank" rel="noreferrer" className="resource-link">Blender scripting manual <ExternalLink className="h-3.5 w-3.5" /></a>
          </div>
        </div>
      )}

      <section className="mt-14 border-t border-[#2a343c] pt-7">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div><h2 className="text-sm font-semibold text-[#d6dfe3]">Start the course over</h2><p className="mt-1 text-xs leading-5 text-[#7f8e97]">Clears completed lessons in this browser. Your lesson position stays put.</p></div>
          <button type="button" onClick={onResetProgress} className="secondary-button shrink-0"><RotateCcw className="h-4 w-4" /> Reset progress</button>
        </div>
      </section>
    </div>
  )
}
