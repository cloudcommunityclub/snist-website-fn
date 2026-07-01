'use client'

import { useState, useCallback } from 'react'
import useSWR from 'swr'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Users,
    RefreshCw,
    Search,
    Download,
    ChevronLeft,
    ChevronRight,
    X,
    CheckCircle,
    Clock,
    Terminal,
    Filter,
    AlertTriangle,
    ArrowLeft,
    Eye,
    Check,
    Image as ImageIcon,
} from 'lucide-react'
import { useRouter } from 'next/navigation'

interface Stats {
    total: number
    last24h: number
    verified: number
    pending: number
}

interface Submission {
    _id: string
    name: string
    college: string
    email: string
    phone: string
    idea: string
    utrId: string
    paymentScreenshotUrl: string
    paymentVerified: boolean
    verifiedAt?: string
    verifiedBy?: string
    createdAt: string
    acceptedAt?: string
    acceptedBy?: string
    // Referral & Team fields
    teamName: string
    domain: string
    teamSize: number
    teamMembers: Array<{ name: string; email: string }>
}

interface Pagination {
    total: number
    page: number
    limit: number
    pages: number
}

interface PaginatedResponse {
    data: Submission[]
    pagination: Pagination
}

const fetcher = (url: string) =>
    fetch(url).then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        return res.json()
    })

function StatCard({
    title,
    value,
    subtitle,
    icon: Icon,
    color,
}: {
    title: string
    value: number | string
    subtitle?: string
    icon: React.ElementType
    color: 'blue' | 'green' | 'yellow' | 'purple'
}) {
    const colorMap = {
        blue: {
            bg: 'bg-[#8be9fd]/10',
            border: 'border-[#8be9fd]/30',
            icon: 'text-[#8be9fd]',
            value: 'text-[#8be9fd]',
        },
        green: {
            bg: 'bg-[#50fa7b]/10',
            border: 'border-[#50fa7b]/30',
            icon: 'text-[#50fa7b]',
            value: 'text-[#50fa7b]',
        },
        yellow: {
            bg: 'bg-[#f1fa8c]/10',
            border: 'border-[#f1fa8c]/30',
            icon: 'text-[#f1fa8c]',
            value: 'text-[#f1fa8c]',
        },
        purple: {
            bg: 'bg-[#bd93f9]/10',
            border: 'border-[#bd93f9]/30',
            icon: 'text-[#bd93f9]',
            value: 'text-[#bd93f9]',
        },
    }
    const c = colorMap[color]

    return (
        <div className={`border ${c.border} ${c.bg} rounded-xl p-5`}>
            <div className='flex items-start justify-between mb-3'>
                <div className={`p-2 rounded-lg ${c.bg} border ${c.border}`}>
                    <Icon size={18} className={c.icon} />
                </div>
            </div>
            <div className={`text-3xl font-bold font-mono ${c.value} mb-1`}>
                {value}
            </div>
            <div className='text-[#f8f8f2] text-sm font-medium'>{title}</div>
            {subtitle && (
                <div className='text-[#6272a4] text-xs font-mono mt-1'>
                    {subtitle}
                </div>
            )}
        </div>
    )
}

function Badge({
    children,
    variant,
}: {
    children: React.ReactNode
    variant: 'success' | 'pending' | 'info' | 'warning'
}) {
    const styles = {
        success: 'bg-[#50fa7b]/15 text-[#50fa7b] border-[#50fa7b]/30',
        pending: 'bg-[#ff5555]/15 text-[#ff5555] border-[#ff5555]/30',
        info: 'bg-[#8be9fd]/15 text-[#8be9fd] border-[#8be9fd]/30',
        warning: 'bg-[#ffb86c]/15 text-[#ffb86c] border-[#ffb86c]/30',
    }
    return (
        <span
            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md border text-xs font-mono font-medium ${styles[variant]}`}
        >
            {children}
        </span>
    )
}

function Skeleton({ className }: { className?: string }) {
    return <div className={`animate-pulse bg-[#1e1f29] rounded ${className}`} />
}

export default function DigitalIndiaAdminDashboard() {
    const [search, setSearch] = useState('')
    const [verified, setVerified] = useState('')
    const [page, setPage] = useState(1)
    const [downloading, setDownloading] = useState(false)
    const [selectedIdea, setSelectedIdea] = useState<string | null>(null)
    const [selectedScreenshot, setSelectedScreenshot] = useState<string | null>(
        null
    )
    const [verifyingId, setVerifyingId] = useState<string | null>(null)
    const [acceptingId, setAcceptingId] = useState<string | null>(null)
    const [activeSubTab, setActiveSubTab] = useState<
        'submissions' | 'accepted'
    >('submissions')
    const router = useRouter()

    const params = new URLSearchParams({
        page: String(page),
        limit: '20',
        ...(search && { search }),
        ...(activeSubTab === 'submissions' && verified && { verified }),
    })

    const apiUrl =
        activeSubTab === 'submissions'
            ? `/api/admin/digital-india?${params.toString()}`
            : `/api/admin/digital-india/accepted-list?${params.toString()}`

    const { data, error, isLoading, mutate } = useSWR<PaginatedResponse>(
        apiUrl,
        fetcher,
        { keepPreviousData: true }
    )

    const { data: globalStats, mutate: refreshStats } = useSWR(
        '/api/admin/stats',
        fetcher
    )

    const handleSearchChange = useCallback((val: string) => {
        setSearch(val)
        setPage(1)
    }, [])

    const handleTabChange = (tab: 'submissions' | 'accepted') => {
        setActiveSubTab(tab)
        setPage(1)
        setSearch('')
        setVerified('')
    }

    const handleVerify = async (id: string, currentStatus: boolean) => {
        setVerifyingId(id)
        try {
            const res = await fetch('/api/admin/digital-india/verify', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, verified: !currentStatus }),
            })
            if (res.ok) {
                mutate()
                refreshStats()
            } else {
                const err = await res.json()
                alert(err.message || 'Action failed')
            }
        } catch {
            alert('Verification update failed. Please try again.')
        } finally {
            setVerifyingId(null)
        }
    }

    const handleAccept = async (id: string) => {
        if (
            !confirm(
                'Are you sure you want to accept this candidate? They will be moved to the Accepted Participants list and notified via email.'
            )
        ) {
            return
        }
        setAcceptingId(id)
        try {
            const res = await fetch('/api/admin/digital-india/accept', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id }),
            })
            if (res.ok) {
                mutate()
                refreshStats()
            } else {
                const err = await res.json()
                alert(err.message || 'Action failed')
            }
        } catch {
            alert('Acceptance failed. Please try again.')
        } finally {
            setAcceptingId(null)
        }
    }

    const handleExport = async () => {
        setDownloading(true)
        try {
            const endpoint =
                activeSubTab === 'submissions'
                    ? '/api/admin/digital-india/export'
                    : '/api/admin/digital-india/accepted-list/export'
            const res = await fetch(endpoint)
            const blob = await res.blob()
            const url = URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = url
            a.download = `c3-digital-india-${activeSubTab}-${Date.now()}.csv`
            document.body.appendChild(a)
            a.click()
            document.body.removeChild(a)
            URL.revokeObjectURL(url)
        } catch {
            alert('Export failed. Please try again.')
        } finally {
            setDownloading(false)
        }
    }

    const formatDate = (dateStr: string) => {
        if (!dateStr) return '—'
        return new Date(dateStr).toLocaleDateString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        })
    }

    return (
        <div className='min-h-screen bg-[#0d0e12] text-[#f8f8f2]'>
            {/* Top Header */}
            <header className='sticky top-0 z-40 bg-[#0d0e12]/95 backdrop-blur-md border-b border-[#6272a4]/20'>
                <div className='max-w-[1400px] mx-auto px-4 sm:px-6 h-14 flex items-center justify-between'>
                    <div className='flex items-center gap-3'>
                        <button
                            onClick={() => router.push('/admin/dashboard')}
                            className='p-1.5 rounded-lg text-[#6272a4] hover:text-[#bd93f9] hover:bg-[#1e1f29] transition-colors'
                        >
                            <ArrowLeft size={16} />
                        </button>
                        <div className='flex items-center gap-2 font-mono'>
                            <Terminal size={16} className='text-[#bd93f9]' />
                            <span className='text-[#bd93f9] font-bold text-sm hidden sm:block'>
                                C3
                            </span>
                            <span className='text-[#6272a4] text-sm hidden sm:block'>
                                {'//'}
                            </span>
                            <span className='text-[#f8f8f2] text-sm font-bold'>
                                DIGITAL INDIA
                            </span>
                        </div>
                    </div>

                    <div className='flex items-center gap-2'>
                        <button
                            onClick={() => {
                                mutate()
                                refreshStats()
                            }}
                            className='p-2 rounded-lg text-[#6272a4] hover:text-[#8be9fd] transition-colors'
                            title='Refresh'
                        >
                            <RefreshCw size={15} />
                        </button>
                    </div>
                </div>
            </header>

            <main className='max-w-[1400px] mx-auto px-4 sm:px-6 py-6'>
                {/* Stats Row */}
                <div className='grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8'>
                    <StatCard
                        title='Pending Submissions'
                        value={globalStats?.digitalIndia?.pending ?? 0}
                        icon={Clock}
                        color='yellow'
                    />
                    <StatCard
                        title='Verified Submissions'
                        value={globalStats?.digitalIndia?.verified ?? 0}
                        icon={CheckCircle}
                        color='blue'
                    />
                    <StatCard
                        title='Accepted Participants'
                        value={globalStats?.digitalIndia?.accepted ?? 0}
                        icon={Check}
                        color='green'
                    />
                    <StatCard
                        title='Total Registrations'
                        value={
                            (globalStats?.digitalIndia?.total ?? 0) +
                            (globalStats?.digitalIndia?.accepted ?? 0)
                        }
                        subtitle={`+${globalStats?.digitalIndia?.last24h ?? 0} last 24h`}
                        icon={Users}
                        color='purple'
                    />
                </div>

                {/* Main panel content */}
                <div className='bg-[#0d0e12] border border-[#6272a4]/20 rounded-xl p-5'>
                    {/* Tab Header */}
                    <div className='flex items-center justify-between mb-5 pb-4 border-b border-[#6272a4]/20 flex-wrap gap-4'>
                        <div className='flex items-center gap-4'>
                            <button
                                onClick={() => handleTabChange('submissions')}
                                className={`font-mono font-bold text-sm pb-2 border-b-2 transition-all ${
                                    activeSubTab === 'submissions'
                                        ? 'border-[#bd93f9] text-[#bd93f9]'
                                        : 'border-transparent text-[#6272a4] hover:text-[#f8f8f2]'
                                }`}
                            >
                                Submissions (
                                {globalStats?.digitalIndia?.total ?? 0})
                            </button>
                            <button
                                onClick={() => handleTabChange('accepted')}
                                className={`font-mono font-bold text-sm pb-2 border-b-2 transition-all ${
                                    activeSubTab === 'accepted'
                                        ? 'border-[#50fa7b] text-[#50fa7b]'
                                        : 'border-transparent text-[#6272a4] hover:text-[#f8f8f2]'
                                }`}
                            >
                                Accepted Participants (
                                {globalStats?.digitalIndia?.accepted ?? 0})
                            </button>
                        </div>
                        <div className='flex items-center gap-2 text-xs font-mono text-[#6272a4]'>
                            <Filter size={12} />
                            <span>
                                {activeSubTab === 'submissions'
                                    ? 'Submissions list'
                                    : 'Accepted list'}
                            </span>
                        </div>
                    </div>

                    {/* Filters & search */}
                    <div className='flex flex-wrap gap-3 mb-4'>
                        <div className='flex items-center gap-2 bg-[#1e1f29] border border-[#6272a4]/30 rounded-lg px-3 py-2 flex-1 min-w-[200px]'>
                            <Search
                                size={14}
                                className='text-[#6272a4] shrink-0'
                            />
                            <input
                                type='text'
                                placeholder='Search name, email, college, UTR...'
                                value={search}
                                onChange={(e) =>
                                    handleSearchChange(e.target.value)
                                }
                                className='bg-transparent outline-none text-[#f8f8f2] text-sm placeholder:text-[#44475a] flex-1 font-mono'
                            />
                            {search && (
                                <button
                                    onClick={() => handleSearchChange('')}
                                    className='text-[#6272a4] hover:text-[#ff5555]'
                                >
                                    <X size={12} />
                                </button>
                            )}
                        </div>

                        {activeSubTab === 'submissions' && (
                            <select
                                value={verified}
                                onChange={(e) => {
                                    setVerified(e.target.value)
                                    setPage(1)
                                }}
                                className='bg-[#1e1f29] border border-[#6272a4]/30 rounded-lg px-3 py-2 text-sm text-[#f8f8f2] font-mono outline-none focus:border-[#bd93f9]/50'
                            >
                                <option value=''>
                                    All Verification Statuses
                                </option>
                                <option value='true'>Verified Payments</option>
                                <option value='false'>
                                    Pending Verification
                                </option>
                            </select>
                        )}

                        <button
                            onClick={handleExport}
                            disabled={downloading}
                            className='flex items-center gap-2 px-3 py-2 rounded-lg border border-[#50fa7b]/30 text-[#50fa7b] hover:bg-[#50fa7b]/10 transition-colors text-sm font-mono disabled:opacity-50'
                        >
                            <Download size={14} />
                            {downloading ? 'Exporting...' : 'Export CSV'}
                        </button>
                    </div>

                    {/* Table list */}
                    <div className='border border-[#6272a4]/20 rounded-xl overflow-hidden'>
                        <div className='overflow-x-auto'>
                            <table className='w-full text-sm'>
                                <thead>
                                    <tr className='bg-[#1e1f29] border-b border-[#6272a4]/20'>
                                        <th className='text-left px-4 py-3 text-[#6272a4] font-mono text-xs uppercase tracking-wider'>
                                            Candidate
                                        </th>
                                        <th className='text-left px-4 py-3 text-[#6272a4] font-mono text-xs uppercase tracking-wider'>
                                            College
                                        </th>
                                        <th className='text-left px-4 py-3 text-[#6272a4] font-mono text-xs uppercase tracking-wider'>
                                            UTR ID
                                        </th>
                                        <th className='text-left px-4 py-3 text-[#6272a4] font-mono text-xs uppercase tracking-wider'>
                                            Track / Idea
                                        </th>
                                        <th className='text-left px-4 py-3 text-[#6272a4] font-mono text-xs uppercase tracking-wider'>
                                            Proof
                                        </th>
                                        {activeSubTab === 'submissions' ? (
                                            <>
                                                <th className='text-left px-4 py-3 text-[#6272a4] font-mono text-xs uppercase tracking-wider'>
                                                    Status
                                                </th>
                                                <th className='text-left px-4 py-3 text-[#6272a4] font-mono text-xs uppercase tracking-wider'>
                                                    Action
                                                </th>
                                                <th className='text-left px-4 py-3 text-[#6272a4] font-mono text-xs uppercase tracking-wider'>
                                                    Date
                                                </th>
                                            </>
                                        ) : (
                                            <>
                                                <th className='text-left px-4 py-3 text-[#6272a4] font-mono text-xs uppercase tracking-wider'>
                                                    Accepted By
                                                </th>
                                                <th className='text-left px-4 py-3 text-[#6272a4] font-mono text-xs uppercase tracking-wider'>
                                                    Date Accepted
                                                </th>
                                            </>
                                        )}
                                    </tr>
                                </thead>
                                <tbody>
                                    {isLoading && (
                                        <>
                                            {Array.from({ length: 5 }).map(
                                                (_, i) => (
                                                    <tr
                                                        key={i}
                                                        className='border-b border-[#6272a4]/10'
                                                    >
                                                        {Array.from({
                                                            length:
                                                                activeSubTab ===
                                                                'submissions'
                                                                    ? 8
                                                                    : 7,
                                                        }).map((_, j) => (
                                                            <td
                                                                key={j}
                                                                className='px-4 py-3'
                                                            >
                                                                <Skeleton className='h-4 w-full' />
                                                            </td>
                                                        ))}
                                                    </tr>
                                                )
                                            )}
                                        </>
                                    )}
                                    {error && (
                                        <tr>
                                            <td
                                                colSpan={
                                                    activeSubTab ===
                                                    'submissions'
                                                        ? 8
                                                        : 7
                                                }
                                                className='px-4 py-8 text-center'
                                            >
                                                <div className='flex flex-col items-center gap-2 text-[#ff5555]'>
                                                    <AlertTriangle size={20} />
                                                    <span className='font-mono text-sm'>
                                                        Failed to load Digital
                                                        India data
                                                    </span>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                    {!isLoading &&
                                        !error &&
                                        data?.data.length === 0 && (
                                            <tr>
                                                <td
                                                    colSpan={
                                                        activeSubTab ===
                                                        'submissions'
                                                            ? 8
                                                            : 7
                                                    }
                                                    className='px-4 py-10 text-center text-[#6272a4] font-mono text-sm'
                                                >
                                                    No records found matching
                                                    your filters.
                                                </td>
                                            </tr>
                                        )}
                                    {!isLoading &&
                                        data?.data.map((sub, i) => (
                                            <tr
                                                key={sub._id}
                                                className={`border-b border-[#6272a4]/10 hover:bg-[#1e1f29]/60 transition-colors ${i % 2 === 0 ? 'bg-transparent' : 'bg-[#1e1f29]/20'}`}
                                            >
                                                <td className='px-4 py-3'>
                                                    <div className='flex flex-col gap-1'>
                                                        {sub.teamName && (
                                                            <div className='mb-0.5'>
                                                                <span className='text-[#bd93f9] font-mono font-bold text-sm tracking-wide'>
                                                                    {
                                                                        sub.teamName
                                                                    }
                                                                </span>
                                                            </div>
                                                        )}
                                                        <div>
                                                            <span className='text-[#f8f8f2] font-medium'>
                                                                {sub.name}
                                                            </span>
                                                            <span className='ml-1.5 text-[9px] font-mono bg-[#6272a4]/20 text-[#f8f8f2]/60 px-1.5 py-0.5 rounded-full uppercase tracking-wider font-semibold'>
                                                                Leader
                                                            </span>
                                                        </div>
                                                        <div
                                                            className='text-[#8be9fd] font-mono text-xs max-w-[220px] truncate'
                                                            title={sub.email}
                                                        >
                                                            {sub.email}
                                                        </div>
                                                        <div className='text-[#6272a4] text-xs font-mono'>
                                                            {sub.phone}
                                                        </div>

                                                        {sub.teamMembers &&
                                                            sub.teamMembers
                                                                .length > 0 && (
                                                                <div className='mt-2 pt-2 border-t border-[#6272a4]/10 space-y-1'>
                                                                    <div className='text-[10px] text-[#6272a4] font-mono uppercase tracking-wider'>
                                                                        Members
                                                                        (
                                                                        {
                                                                            sub
                                                                                .teamMembers
                                                                                .length
                                                                        }
                                                                        )
                                                                    </div>
                                                                    {sub.teamMembers.map(
                                                                        (
                                                                            m,
                                                                            idx
                                                                        ) => (
                                                                            <div
                                                                                key={
                                                                                    idx
                                                                                }
                                                                                className='text-xs leading-normal'
                                                                            >
                                                                                <span className='text-[#f8f8f2]/90'>
                                                                                    {
                                                                                        m.name
                                                                                    }
                                                                                </span>
                                                                                <span className='text-[#6272a4] mx-1 font-mono'>
                                                                                    •
                                                                                </span>
                                                                                <span
                                                                                    className='text-[#8be9fd]/70 font-mono text-[11px]'
                                                                                    title={
                                                                                        m.email
                                                                                    }
                                                                                >
                                                                                    {
                                                                                        m.email
                                                                                    }
                                                                                </span>
                                                                            </div>
                                                                        )
                                                                    )}
                                                                </div>
                                                            )}
                                                    </div>
                                                </td>
                                                <td
                                                    className='px-4 py-3 text-[#f8f8f2] text-xs max-w-[150px] truncate'
                                                    title={sub.college}
                                                >
                                                    {sub.college}
                                                </td>
                                                <td className='px-4 py-3 text-[#f1fa8c] font-mono text-xs'>
                                                    {sub.utrId}
                                                </td>
                                                <td className='px-4 py-3'>
                                                    <div className='flex flex-col gap-1.5 items-start'>
                                                        {sub.domain && (
                                                            <span
                                                                className='text-[10px] font-mono bg-[#8be9fd]/10 text-[#8be9fd] border border-[#8be9fd]/20 px-2 py-0.5 rounded-md font-semibold tracking-wide'
                                                                title={
                                                                    sub.domain
                                                                }
                                                            >
                                                                {sub.domain}
                                                            </span>
                                                        )}
                                                        <button
                                                            onClick={() =>
                                                                setSelectedIdea(
                                                                    sub.idea
                                                                )
                                                            }
                                                            className='flex items-center gap-1.5 text-xs text-[#bd93f9] hover:underline'
                                                        >
                                                            <Eye size={12} />
                                                            View Idea
                                                        </button>
                                                    </div>
                                                </td>
                                                <td className='px-4 py-3'>
                                                    <button
                                                        onClick={() =>
                                                            setSelectedScreenshot(
                                                                `/api/admin/digital-india/screenshot?id=${sub._id}&accepted=${activeSubTab === 'accepted'}`
                                                            )
                                                        }
                                                        className='flex items-center gap-1.5 text-xs text-[#8be9fd] hover:underline'
                                                    >
                                                        <ImageIcon size={12} />
                                                        Screenshot
                                                    </button>
                                                </td>
                                                {activeSubTab ===
                                                'submissions' ? (
                                                    <>
                                                        <td className='px-4 py-3'>
                                                            {sub.paymentVerified ? (
                                                                <Badge variant='success'>
                                                                    <CheckCircle
                                                                        size={
                                                                            10
                                                                        }
                                                                    />{' '}
                                                                    Verified
                                                                </Badge>
                                                            ) : (
                                                                <Badge variant='warning'>
                                                                    <Clock
                                                                        size={
                                                                            10
                                                                        }
                                                                    />{' '}
                                                                    Pending
                                                                </Badge>
                                                            )}
                                                        </td>
                                                        <td className='px-4 py-3'>
                                                            <div className='flex items-center gap-2'>
                                                                <button
                                                                    onClick={() =>
                                                                        handleVerify(
                                                                            sub._id,
                                                                            sub.paymentVerified
                                                                        )
                                                                    }
                                                                    disabled={
                                                                        verifyingId ===
                                                                            sub._id ||
                                                                        acceptingId ===
                                                                            sub._id
                                                                    }
                                                                    className={`px-3 py-1.5 rounded-md text-xs font-mono font-medium transition-colors flex items-center gap-1 ${
                                                                        sub.paymentVerified
                                                                            ? 'border border-[#ff5555]/30 text-[#ff5555] hover:bg-[#ff5555]/10'
                                                                            : 'bg-[#50fa7b]/15 text-[#50fa7b] border border-[#50fa7b]/30 hover:bg-[#50fa7b]/25'
                                                                    }`}
                                                                >
                                                                    {verifyingId ===
                                                                    sub._id ? (
                                                                        <RefreshCw
                                                                            size={
                                                                                12
                                                                            }
                                                                            className='animate-spin'
                                                                        />
                                                                    ) : sub.paymentVerified ? (
                                                                        'Unverify'
                                                                    ) : (
                                                                        <>
                                                                            <Check
                                                                                size={
                                                                                    12
                                                                                }
                                                                            />
                                                                            Verify
                                                                        </>
                                                                    )}
                                                                </button>
                                                                <button
                                                                    onClick={() =>
                                                                        handleAccept(
                                                                            sub._id
                                                                        )
                                                                    }
                                                                    disabled={
                                                                        !sub.paymentVerified ||
                                                                        acceptingId ===
                                                                            sub._id ||
                                                                        verifyingId ===
                                                                            sub._id
                                                                    }
                                                                    className={`px-3 py-1.5 rounded-md text-xs font-mono font-medium transition-colors flex items-center gap-1 ${
                                                                        sub.paymentVerified
                                                                            ? 'bg-[#50fa7b] text-[#0d0e12] hover:bg-[#40c762] cursor-pointer'
                                                                            : 'bg-[#1e1f29] text-[#6272a4] border border-[#6272a4]/20 cursor-not-allowed'
                                                                    }`}
                                                                    title={
                                                                        sub.paymentVerified
                                                                            ? 'Accept candidate and send shortlisted email'
                                                                            : 'Verify payment first to accept'
                                                                    }
                                                                >
                                                                    {acceptingId ===
                                                                    sub._id ? (
                                                                        <RefreshCw
                                                                            size={
                                                                                12
                                                                            }
                                                                            className='animate-spin'
                                                                        />
                                                                    ) : (
                                                                        'Accept'
                                                                    )}
                                                                </button>
                                                            </div>
                                                        </td>
                                                        <td className='px-4 py-3 text-[#6272a4] font-mono text-xs'>
                                                            {formatDate(
                                                                sub.createdAt
                                                            )}
                                                        </td>
                                                    </>
                                                ) : (
                                                    <>
                                                        <td className='px-4 py-3 text-[#8be9fd] font-mono text-xs'>
                                                            {sub.acceptedBy ||
                                                                'Admin'}
                                                        </td>
                                                        <td className='px-4 py-3 text-[#6272a4] font-mono text-xs'>
                                                            {formatDate(
                                                                sub.acceptedAt ||
                                                                    sub.createdAt
                                                            )}
                                                        </td>
                                                    </>
                                                )}
                                            </tr>
                                        ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {data?.pagination && (
                        <div className='flex items-center justify-between mt-4 px-1'>
                            <span className='text-[#6272a4] text-xs font-mono'>
                                {data.pagination.total === 0
                                    ? '0'
                                    : (page - 1) * 20 + 1}
                                –{Math.min(page * 20, data.pagination.total)} of{' '}
                                {data.pagination.total} records
                            </span>
                            <div className='flex items-center gap-2'>
                                <button
                                    onClick={() => setPage(page - 1)}
                                    disabled={page <= 1}
                                    className='p-1.5 rounded-md border border-[#6272a4]/30 text-[#6272a4] hover:text-[#f8f8f2] hover:border-[#bd93f9]/50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors'
                                >
                                    <ChevronLeft size={16} />
                                </button>
                                <span className='text-[#f8f8f2] text-xs font-mono px-2'>
                                    {page} / {data.pagination.pages}
                                </span>
                                <button
                                    onClick={() => setPage(page + 1)}
                                    disabled={page >= data.pagination.pages}
                                    className='p-1.5 rounded-md border border-[#6272a4]/30 text-[#6272a4] hover:text-[#f8f8f2] hover:border-[#bd93f9]/50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors'
                                >
                                    <ChevronRight size={16} />
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </main>

            {/* Modals / Lightboxes */}
            <AnimatePresence>
                {selectedIdea && (
                    <div className='fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm'>
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className='bg-[#1e1f29] border border-[#6272a4]/30 rounded-xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto relative shadow-2xl'
                        >
                            <button
                                onClick={() => setSelectedIdea(null)}
                                className='absolute top-4 right-4 text-[#6272a4] hover:text-[#f8f8f2]'
                            >
                                <X size={20} />
                            </button>
                            <h3 className='text-xl font-bold font-mono text-[#bd93f9] mb-4'>
                                Idea Description
                            </h3>
                            <p className='text-gray-300 leading-relaxed text-sm whitespace-pre-wrap font-sans'>
                                {selectedIdea}
                            </p>
                        </motion.div>
                    </div>
                )}

                {selectedScreenshot && (
                    <div className='fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm'>
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className='relative max-w-3xl w-full max-h-[85vh] flex flex-col items-center'
                        >
                            <button
                                onClick={() => setSelectedScreenshot(null)}
                                className='absolute -top-10 right-0 text-white/70 hover:text-white flex items-center gap-1.5 font-mono text-xs'
                            >
                                <X size={20} />
                                Close
                            </button>
                            <div className='w-full h-full relative rounded-lg overflow-hidden border border-white/10 bg-black/60 flex items-center justify-center p-2'>
                                <img
                                    src={selectedScreenshot}
                                    alt='Payment screenshot proof'
                                    className='max-w-full max-h-[75vh] object-contain rounded'
                                />
                            </div>
                            <a
                                href={selectedScreenshot}
                                target='_blank'
                                rel='noreferrer'
                                className='mt-3 text-xs text-[#8be9fd] hover:underline font-mono'
                            >
                                Open image in new tab
                            </a>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    )
}
