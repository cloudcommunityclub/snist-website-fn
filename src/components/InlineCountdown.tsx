import React, { useEffect, useState } from 'react'

function formatMsToTime(seconds: number): string {
    seconds *= 0.001
    const negative = seconds < 0
    seconds = Math.abs(seconds)
    const d = Math.floor(seconds / (3600 * 24))
    const h = Math.floor((seconds % (3600 * 24)) / 3600)
    const m = Math.floor((seconds % 3600) / 60)
    const s = Math.floor(seconds % 60)

    // Uncomment if you want to use text format like "2 days, 3 hours" instead of "02:03:00:00"
    /*
    return (
        (d > 0 ? d + (d === 1 ? ' day, ' : ' days, ') : '') +
        (h > 0 ? h + (h === 1 ? ' hour, ' : ' hours, ') : '') +
        (m > 0 ? m + (m === 1 ? ' minute, ' : ' minutes, ') : '') +
        (s > 0 ? s + (s === 1 ? ' second' : ' seconds') : '0 seconds') +
        (negative ? ' ago' : '')
    )
    */

    return (
        (negative ? '-' : '') +
        d.toString().padStart(2, '0') +
        ':' +
        h.toString().padStart(2, '0') +
        ':' +
        m.toString().padStart(2, '0') +
        ':' +
        s.toString().padStart(2, '0')
    )
}

export default function InlineCountdown({ 
    timestamp,
    className = ''
}: { 
    timestamp: number
    className?: string
}): React.ReactNode {
    const [currentTime, setCurrentTime] = useState(formatMsToTime(timestamp - Date.now()))

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTime(formatMsToTime(timestamp - Date.now()))
        }, 1000)

        return () => clearInterval(interval)
    }, [timestamp])

    return (
        <span className={className}>{currentTime}</span>
    )
}