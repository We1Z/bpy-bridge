import { useState } from 'react'
import { Highlight, type PrismTheme } from 'prism-react-renderer'
import { Check, Copy, FileCode2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { copyText } from '@/lib/clipboard'

const codeTheme: PrismTheme = {
  plain: { color: '#dce3e8', backgroundColor: '#0c1014' },
  styles: [
    { types: ['comment', 'prolog', 'doctype', 'cdata'], style: { color: '#72808a', fontStyle: 'italic' } },
    { types: ['punctuation'], style: { color: '#9aa8b2' } },
    { types: ['property', 'tag', 'boolean', 'number', 'constant', 'symbol'], style: { color: '#f5a65b' } },
    { types: ['selector', 'attr-name', 'string', 'char', 'builtin', 'inserted'], style: { color: '#a8c99b' } },
    { types: ['operator', 'entity', 'url', 'variable'], style: { color: '#d7dee4' } },
    { types: ['atrule', 'attr-value', 'function', 'class-name'], style: { color: '#82b6c9' } },
    { types: ['keyword'], style: { color: '#e68a72' } },
    { types: ['regex', 'important'], style: { color: '#e9c46a' } },
  ],
}

type CodeBlockProps = {
  code: string
  label?: string
  filename?: string
  className?: string
  maxHeight?: number
}

export function CodeBlock({ code, label, filename, className, maxHeight = 440 }: CodeBlockProps) {
  const [copyState, setCopyState] = useState<'idle' | 'copied' | 'error'>('idle')

  const handleCopy = async () => {
    try {
      await copyText(code)
      setCopyState('copied')
    } catch {
      setCopyState('error')
    }
    window.setTimeout(() => setCopyState('idle'), 1800)
  }

  return (
    <div className={cn('code-shell overflow-hidden border border-[#263039] bg-[#0c1014]', className)}>
      <div className="flex min-h-12 items-center justify-between gap-3 border-b border-[#263039] bg-[#11171c] px-4 py-2">
        <div className="flex min-w-0 items-center gap-2">
          <FileCode2 className="h-4 w-4 shrink-0 text-[#82919c]" aria-hidden="true" />
          <span className="truncate font-mono text-[11px] uppercase tracking-[0.12em] text-[#a6b2ba]">
            {label ?? filename ?? 'Python'}
          </span>
        </div>
        <button
          type="button"
          onClick={handleCopy}
          className="flex min-h-9 shrink-0 cursor-pointer items-center gap-1.5 px-2 font-mono text-[11px] text-[#a6b2ba] transition-colors duration-150 hover:text-[#f4f6f7] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ed8b45]"
          aria-label={`Copy ${label ?? filename ?? 'code'}`}
        >
          {copyState === 'copied' ? <Check className="h-3.5 w-3.5 text-[#a8c99b]" /> : <Copy className="h-3.5 w-3.5" />}
          {copyState === 'copied' ? 'Copied' : copyState === 'error' ? 'Select code' : 'Copy'}
        </button>
      </div>
      <div className="overflow-auto" style={{ maxHeight }}>
        <Highlight code={code.trim()} language="python" prism={undefined} theme={codeTheme}>
          {({ className: highlightClass, style, tokens, getLineProps, getTokenProps }) => (
            <pre className={cn(highlightClass, 'min-w-max p-4 font-mono text-[12.5px] leading-6')} style={style}>
              {tokens.map((line, index) => (
                <div key={index} {...getLineProps({ line })} className="table-row">
                  <span className="table-cell w-9 select-none pr-4 text-right text-[#4e5d67]">{index + 1}</span>
                  <span className="table-cell">
                    {line.map((token, key) => (
                      <span key={key} {...getTokenProps({ token })} />
                    ))}
                  </span>
                </div>
              ))}
            </pre>
          )}
        </Highlight>
      </div>
    </div>
  )
}
