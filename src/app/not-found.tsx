import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="max-w-lg w-full font-mono">
        <div className="border border-[#6272a4]/40 rounded-lg overflow-hidden">
          {/* Terminal title bar */}
          <div className="bg-[#1e1f29] px-4 py-2 flex items-center gap-2 border-b border-[#6272a4]/40">
            <span className="w-3 h-3 rounded-full bg-[#ff5555]" />
            <span className="w-3 h-3 rounded-full bg-[#ffb86c]" />
            <span className="w-3 h-3 rounded-full bg-[#50fa7b]" />
            <span className="ml-2 text-[#6272a4] text-xs">bash — 404</span>
          </div>
          {/* Terminal body */}
          <div className="bg-[#0d0e12] p-6 space-y-3">
            <div className="text-[#ff5555] text-sm">
              <span className="text-[#6272a4] mr-2">$</span>
              GET {typeof window !== 'undefined' ? window.location.pathname : '/???'}
            </div>
            <div className="text-[#ffb86c] text-4xl font-bold">404</div>
            <div className="text-[#f8f8f2] text-sm">
              <span className="text-[#ff5555]">Error:</span> Route not found in system.
            </div>
            <div className="text-[#6272a4] text-xs">
              The path you requested does not exist on this server.
            </div>
            <div className="pt-4 border-t border-[#6272a4]/20">
              <div className="text-[#6272a4] text-xs mb-2"># Available routes</div>
              {[
                ['/', 'home'],
                ['/join', 'join the club'],
                ['/recruitment', 'recruitment portal'],
                ['/events', 'events'],
                ['/projects', 'project schools'],
                ['/blogs', 'blogs'],
              ].map(([href, label]) => (
                <div key={href} className="text-xs">
                  <span className="text-[#6272a4]">  → </span>
                  <Link href={href} className="text-[#8be9fd] hover:text-[#bd93f9] transition-colors">
                    {href}
                  </Link>
                  <span className="text-[#6272a4] ml-2"># {label}</span>
                </div>
              ))}
            </div>
            <div className="pt-2">
              <Link
                href="/"
                className="inline-flex items-center gap-2 text-sm text-[#50fa7b] hover:text-[#bd93f9] transition-colors"
              >
                <span className="text-[#ff79c6]">cd</span> ~/home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
