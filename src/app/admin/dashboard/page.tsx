'use client'

import { useState, useCallback } from 'react'
import useSWR from 'swr'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Users, UserPlus, Unlock, Activity, LogOut, RefreshCw,
    Search, Download, ChevronLeft, ChevronRight, X,
    CheckCircle, Clock, Terminal, Filter, Mail, AlertTriangle
} from 'lucide-react'
import { useRouter } from 'next/navigation'

// ─── Types ────────────────────────────────────────────────────────────────────

interface Stats {
    members: { total: number; last24h: number; emailSent: number; emailPending: number }
    recruitment: { total: number; last24h: number; unlocked: number; submitted: number }
}

interface Member {
    _id: string
    name: string
    email: string
    mobile: string
    rollNumber: string
    department: string
    year: string
    interests: string[]
    experience?: string
    emailSent: boolean
    emailSentAt?: string
    createdAt: string
}

interface RecruitmentCandidate {
    _id: string
    name: string
    email: string
    mobile: string
    passingOutYear: string
    problemUnlocked?: string
    submittedSolution: boolean
    source: string
    createdAt: string
}

interface Pagination {
    total: number
    page: number
    limit: number
    pages: number
}

interface PaginatedResponse<T> {
    data: T[]
    pagination: Pagination
}

// ─── Fetcher ──────────────────────────────────────────────────────────────────

const fetcher = (url: string) =>
    fetch(url, { headers: { "x-api-key": process.env.NEXT_PUBLIC_API_KEY || '' } }).then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        return res.json()
    })

// ─── Helper Components ────────────────────────────────────────────────────────

function StatCard({
    title,
    value,
    subtitle,
    icon: Icon,
    color
}: {
    title: string
    value: number | string
    subtitle?: string
    icon: React.ElementType
    color: 'green' | 'purple' | 'cyan' | 'yellow'
}) {
    const colorMap = {
        green: { bg: 'bg-[#50fa7b]/10', border: 'border-[#50fa7b]/30', icon: 'text-[#50fa7b]', value: 'text-[#50fa7b]' },
        purple: { bg: 'bg-[#bd93f9]/10', border: 'border-[#bd93f9]/30', icon: 'text-[#bd93f9]', value: 'text-[#bd93f9]' },
        cyan: { bg: 'bg-[#8be9fd]/10', border: 'border-[#8be9fd]/30', icon: 'text-[#8be9fd]', value: 'text-[#8be9fd]' },
        yellow: { bg: 'bg-[#f1fa8c]/10', border: 'border-[#f1fa8c]/30', icon: 'text-[#f1fa8c]', value: 'text-[#f1fa8c]' },
    }
    const c = colorMap[color]

    return (
        <div className={`border ${c.border} ${c.bg} rounded-xl p-5`}>
            <div className="flex items-start justify-between mb-3">
                <div className={`p-2 rounded-lg ${c.bg} border ${c.border}`}>
                    <Icon size={18} className={c.icon} />
                </div>
            </div>
            <div className={`text-3xl font-bold font-mono ${c.value} mb-1`}>{value}</div>
            <div className="text-[#f8f8f2] text-sm font-medium">{title}</div>
            {subtitle && <div className="text-[#6272a4] text-xs font-mono mt-1">{subtitle}</div>}
        </div>
    )
}

function Badge({ children, variant }: { children: React.ReactNode; variant: 'success' | 'pending' | 'info' | 'warning' }) {
    const styles = {
        success: 'bg-[#50fa7b]/15 text-[#50fa7b] border-[#50fa7b]/30',
        pending: 'bg-[#ff5555]/15 text-[#ff5555] border-[#ff5555]/30',
        info: 'bg-[#8be9fd]/15 text-[#8be9fd] border-[#8be9fd]/30',
        warning: 'bg-[#ffb86c]/15 text-[#ffb86c] border-[#ffb86c]/30',
    }
    return (
        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md border text-xs font-mono font-medium ${styles[variant]}`}>
            {children}
        </span>
    )
}

function Skeleton({ className }: { className?: string }) {
    return <div className={`animate-pulse bg-[#1e1f29] rounded ${className}`} />
}

function TableSkeleton({ cols }: { cols: number }) {
    return (
        <>
            {Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className="border-b border-[#6272a4]/10">
                    {Array.from({ length: cols }).map((_, j) => (
                        <td key={j} className="px-4 py-3">
                            <Skeleton className="h-4 w-full" />
                        </td>
                    ))}
                </tr>
            ))}
        </>
    )
}

function PaginationControls({
    pagination,
    onPageChange
}: {
    pagination: Pagination
    onPageChange: (page: number) => void
}) {
    const { page, pages, total, limit } = pagination
    const start = (page - 1) * limit + 1
    const end = Math.min(page * limit, total)

    return (
        <div className="flex items-center justify-between mt-4 px-1">
            <span className="text-[#6272a4] text-xs font-mono">
                {start}–{end} of {total} records
            </span>
            <div className="flex items-center gap-2">
                <button
                    onClick={() => onPageChange(page - 1)}
                    disabled={page <= 1}
                    className="p-1.5 rounded-md border border-[#6272a4]/30 text-[#6272a4] hover:text-[#f8f8f2] hover:border-[#bd93f9]/50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                    <ChevronLeft size={16} />
                </button>
                <span className="text-[#f8f8f2] text-xs font-mono px-2">
                    {page} / {pages}
                </span>
                <button
                    onClick={() => onPageChange(page + 1)}
                    disabled={page >= pages}
                    className="p-1.5 rounded-md border border-[#6272a4]/30 text-[#6272a4] hover:text-[#f8f8f2] hover:border-[#bd93f9]/50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                    <ChevronRight size={16} />
                </button>
            </div>
        </div>
    )
}

// ─── Members Tab ──────────────────────────────────────────────────────────────

const DEPARTMENTS = ['CSE', 'CSE-AIML', 'CSE-DS', 'CSE-CS', 'IT', 'ECE', 'EEE', 'MECH', 'CIVIL', 'OTHER']

function MembersTab() {
    const [search, setSearch] = useState('')
    const [dept, setDept] = useState('')
    const [year, setYear] = useState('')
    const [emailSent, setEmailSent] = useState('')
    const [page, setPage] = useState(1)
    const [downloading, setDownloading] = useState(false)

    const params = new URLSearchParams({
        page: String(page),
        limit: '20',
        ...(search && { search }),
        ...(dept && { dept }),
        ...(year && { year }),
        ...(emailSent && { emailSent }),
    })

    const { data, error, isLoading, mutate } = useSWR<PaginatedResponse<Member>>(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/members?${params.toString()}`,
        fetcher,
        { keepPreviousData: true }
    )

    const handleSearchChange = useCallback((val: string) => {
        setSearch(val)
        setPage(1)
    }, [])

    const handleExport = async () => {
        setDownloading(true)
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/members?export=true`, { 
                headers: { 
                    'Accept': 'text/csv',
                    'x-api-key': process.env.NEXT_PUBLIC_API_KEY || ''
                } 
            })
            // Actually call export endpoint directly
            const exportRes = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/members/export`, { headers: { 'x-api-key': process.env.NEXT_PUBLIC_API_KEY || '' } })
            const blob = await exportRes.blob()
            const url = URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = url
            a.download = `c3-members-${Date.now()}.csv`
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
        return new Date(dateStr).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
    }

    return (
        <div>
            {/* Filters */}
            <div className="flex flex-wrap gap-3 mb-4">
                <div className="flex items-center gap-2 bg-[#1e1f29] border border-[#6272a4]/30 rounded-lg px-3 py-2 flex-1 min-w-[200px]">
                    <Search size={14} className="text-[#6272a4] shrink-0" />
                    <input
                        type="text"
                        placeholder="Search name, email, roll no..."
                        value={search}
                        onChange={e => handleSearchChange(e.target.value)}
                        className="bg-transparent outline-none text-[#f8f8f2] text-sm placeholder:text-[#44475a] flex-1 font-mono"
                    />
                    {search && (
                        <button onClick={() => handleSearchChange('')} className="text-[#6272a4] hover:text-[#ff5555]">
                            <X size={12} />
                        </button>
                    )}
                </div>

                <select
                    value={dept}
                    onChange={e => { setDept(e.target.value); setPage(1) }}
                    className="bg-[#1e1f29] border border-[#6272a4]/30 rounded-lg px-3 py-2 text-sm text-[#f8f8f2] font-mono outline-none focus:border-[#bd93f9]/50"
                >
                    <option value="">All Depts</option>
                    {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
                </select>

                <select
                    value={year}
                    onChange={e => { setYear(e.target.value); setPage(1) }}
                    className="bg-[#1e1f29] border border-[#6272a4]/30 rounded-lg px-3 py-2 text-sm text-[#f8f8f2] font-mono outline-none focus:border-[#bd93f9]/50"
                >
                    <option value="">All Years</option>
                    {['1', '2', '3', '4'].map(y => <option key={y} value={y}>Year {y}</option>)}
                </select>

                <select
                    value={emailSent}
                    onChange={e => { setEmailSent(e.target.value); setPage(1) }}
                    className="bg-[#1e1f29] border border-[#6272a4]/30 rounded-lg px-3 py-2 text-sm text-[#f8f8f2] font-mono outline-none focus:border-[#bd93f9]/50"
                >
                    <option value="">All Email Status</option>
                    <option value="true">Email Sent</option>
                    <option value="false">Email Pending</option>
                </select>

                <div className="flex gap-2">
                    <button
                        onClick={() => mutate()}
                        className="p-2 rounded-lg border border-[#6272a4]/30 text-[#6272a4] hover:text-[#8be9fd] hover:border-[#8be9fd]/50 transition-colors"
                        title="Refresh"
                    >
                        <RefreshCw size={16} />
                    </button>
                    <button
                        onClick={handleExport}
                        disabled={downloading}
                        className="flex items-center gap-2 px-3 py-2 rounded-lg border border-[#50fa7b]/30 text-[#50fa7b] hover:bg-[#50fa7b]/10 transition-colors text-sm font-mono disabled:opacity-50"
                    >
                        <Download size={14} />
                        {downloading ? 'Exporting...' : 'Export CSV'}
                    </button>
                </div>
            </div>

            {/* Table */}
            <div className="border border-[#6272a4]/20 rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-[#1e1f29] border-b border-[#6272a4]/20">
                                <th className="text-left px-4 py-3 text-[#6272a4] font-mono text-xs uppercase tracking-wider">Name</th>
                                <th className="text-left px-4 py-3 text-[#6272a4] font-mono text-xs uppercase tracking-wider">Email</th>
                                <th className="text-left px-4 py-3 text-[#6272a4] font-mono text-xs uppercase tracking-wider">Roll No</th>
                                <th className="text-left px-4 py-3 text-[#6272a4] font-mono text-xs uppercase tracking-wider">Dept</th>
                                <th className="text-left px-4 py-3 text-[#6272a4] font-mono text-xs uppercase tracking-wider">Yr</th>
                                <th className="text-left px-4 py-3 text-[#6272a4] font-mono text-xs uppercase tracking-wider">Email</th>
                                <th className="text-left px-4 py-3 text-[#6272a4] font-mono text-xs uppercase tracking-wider">Joined</th>
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading && <TableSkeleton cols={7} />}
                            {error && (
                                <tr>
                                    <td colSpan={7} className="px-4 py-8 text-center">
                                        <div className="flex flex-col items-center gap-2 text-[#ff5555]">
                                            <AlertTriangle size={20} />
                                            <span className="font-mono text-sm">Failed to load members</span>
                                        </div>
                                    </td>
                                </tr>
                            )}
                            {!isLoading && !error && data?.data.length === 0 && (
                                <tr>
                                    <td colSpan={7} className="px-4 py-10 text-center text-[#6272a4] font-mono text-sm">
                                        No members found matching your filters.
                                    </td>
                                </tr>
                            )}
                            {!isLoading && data?.data.map((member, i) => (
                                <tr
                                    key={member._id}
                                    className={`border-b border-[#6272a4]/10 hover:bg-[#1e1f29]/60 transition-colors ${i % 2 === 0 ? 'bg-transparent' : 'bg-[#1e1f29]/20'}`}
                                >
                                    <td className="px-4 py-3 text-[#f8f8f2] font-medium max-w-[150px] truncate">{member.name}</td>
                                    <td className="px-4 py-3 text-[#8be9fd] font-mono text-xs max-w-[180px] truncate">{member.email}</td>
                                    <td className="px-4 py-3 text-[#f1fa8c] font-mono text-xs">{member.rollNumber}</td>
                                    <td className="px-4 py-3">
                                        <Badge variant="info">{member.department}</Badge>
                                    </td>
                                    <td className="px-4 py-3 text-[#f8f8f2] text-center">{member.year}</td>
                                    <td className="px-4 py-3">
                                        {member.emailSent
                                            ? <Badge variant="success"><CheckCircle size={10} /> Sent</Badge>
                                            : <Badge variant="pending"><Clock size={10} /> Pending</Badge>
                                        }
                                    </td>
                                    <td className="px-4 py-3 text-[#6272a4] font-mono text-xs">{formatDate(member.createdAt)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {data?.pagination && (
                <PaginationControls
                    pagination={data.pagination}
                    onPageChange={setPage}
                />
            )}
        </div>
    )
}

// ─── Recruitment Tab ──────────────────────────────────────────────────────────

function RecruitmentTab() {
    const [search, setSearch] = useState('')
    const [year, setYear] = useState('')
    const [unlocked, setUnlocked] = useState('')
    const [page, setPage] = useState(1)
    const [downloading, setDownloading] = useState(false)

    const params = new URLSearchParams({
        page: String(page),
        limit: '20',
        ...(search && { search }),
        ...(year && { year }),
        ...(unlocked && { unlocked }),
    })

    const { data, error, isLoading, mutate } = useSWR<PaginatedResponse<RecruitmentCandidate>>(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/recruitment?${params.toString()}`,
        fetcher,
        { keepPreviousData: true }
    )

    const handleSearchChange = useCallback((val: string) => {
        setSearch(val)
        setPage(1)
    }, [])

    const handleExport = async () => {
        setDownloading(true)
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/recruitment/export`, { headers: { 'x-api-key': process.env.NEXT_PUBLIC_API_KEY || '' } })
            const blob = await res.blob()
            const url = URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = url
            a.download = `c3-recruitment-${Date.now()}.csv`
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
        return new Date(dateStr).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
    }

    const currentYear = new Date().getFullYear()
    const years = Array.from({ length: 6 }, (_, i) => String(currentYear + i))

    return (
        <div>
            {/* Filters */}
            <div className="flex flex-wrap gap-3 mb-4">
                <div className="flex items-center gap-2 bg-[#1e1f29] border border-[#6272a4]/30 rounded-lg px-3 py-2 flex-1 min-w-[200px]">
                    <Search size={14} className="text-[#6272a4] shrink-0" />
                    <input
                        type="text"
                        placeholder="Search name or email..."
                        value={search}
                        onChange={e => handleSearchChange(e.target.value)}
                        className="bg-transparent outline-none text-[#f8f8f2] text-sm placeholder:text-[#44475a] flex-1 font-mono"
                    />
                    {search && (
                        <button onClick={() => handleSearchChange('')} className="text-[#6272a4] hover:text-[#ff5555]">
                            <X size={12} />
                        </button>
                    )}
                </div>

                <select
                    value={year}
                    onChange={e => { setYear(e.target.value); setPage(1) }}
                    className="bg-[#1e1f29] border border-[#6272a4]/30 rounded-lg px-3 py-2 text-sm text-[#f8f8f2] font-mono outline-none focus:border-[#bd93f9]/50"
                >
                    <option value="">All Passing Years</option>
                    {years.map(y => <option key={y} value={y}>{y}</option>)}
                </select>

                <select
                    value={unlocked}
                    onChange={e => { setUnlocked(e.target.value); setPage(1) }}
                    className="bg-[#1e1f29] border border-[#6272a4]/30 rounded-lg px-3 py-2 text-sm text-[#f8f8f2] font-mono outline-none focus:border-[#bd93f9]/50"
                >
                    <option value="">All Candidates</option>
                    <option value="true">Problem Unlocked</option>
                    <option value="false">Not Yet Unlocked</option>
                </select>

                <div className="flex gap-2">
                    <button
                        onClick={() => mutate()}
                        className="p-2 rounded-lg border border-[#6272a4]/30 text-[#6272a4] hover:text-[#8be9fd] hover:border-[#8be9fd]/50 transition-colors"
                        title="Refresh"
                    >
                        <RefreshCw size={16} />
                    </button>
                    <button
                        onClick={handleExport}
                        disabled={downloading}
                        className="flex items-center gap-2 px-3 py-2 rounded-lg border border-[#50fa7b]/30 text-[#50fa7b] hover:bg-[#50fa7b]/10 transition-colors text-sm font-mono disabled:opacity-50"
                    >
                        <Download size={14} />
                        {downloading ? 'Exporting...' : 'Export CSV'}
                    </button>
                </div>
            </div>

            {/* Table */}
            <div className="border border-[#6272a4]/20 rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-[#1e1f29] border-b border-[#6272a4]/20">
                                <th className="text-left px-4 py-3 text-[#6272a4] font-mono text-xs uppercase tracking-wider">Name</th>
                                <th className="text-left px-4 py-3 text-[#6272a4] font-mono text-xs uppercase tracking-wider">Email</th>
                                <th className="text-left px-4 py-3 text-[#6272a4] font-mono text-xs uppercase tracking-wider">Mobile</th>
                                <th className="text-left px-4 py-3 text-[#6272a4] font-mono text-xs uppercase tracking-wider">Passing Yr</th>
                                <th className="text-left px-4 py-3 text-[#6272a4] font-mono text-xs uppercase tracking-wider">Problem</th>
                                <th className="text-left px-4 py-3 text-[#6272a4] font-mono text-xs uppercase tracking-wider">Submitted</th>
                                <th className="text-left px-4 py-3 text-[#6272a4] font-mono text-xs uppercase tracking-wider">Registered</th>
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading && <TableSkeleton cols={7} />}
                            {error && (
                                <tr>
                                    <td colSpan={7} className="px-4 py-8 text-center">
                                        <div className="flex flex-col items-center gap-2 text-[#ff5555]">
                                            <AlertTriangle size={20} />
                                            <span className="font-mono text-sm">Failed to load recruitment data</span>
                                        </div>
                                    </td>
                                </tr>
                            )}
                            {!isLoading && !error && data?.data.length === 0 && (
                                <tr>
                                    <td colSpan={7} className="px-4 py-10 text-center text-[#6272a4] font-mono text-sm">
                                        No candidates found matching your filters.
                                    </td>
                                </tr>
                            )}
                            {!isLoading && data?.data.map((candidate, i) => (
                                <tr
                                    key={candidate._id}
                                    className={`border-b border-[#6272a4]/10 hover:bg-[#1e1f29]/60 transition-colors ${i % 2 === 0 ? 'bg-transparent' : 'bg-[#1e1f29]/20'}`}
                                >
                                    <td className="px-4 py-3 text-[#f8f8f2] font-medium max-w-[140px] truncate">{candidate.name}</td>
                                    <td className="px-4 py-3 text-[#8be9fd] font-mono text-xs max-w-[180px] truncate">{candidate.email}</td>
                                    <td className="px-4 py-3 text-[#6272a4] font-mono text-xs">{candidate.mobile}</td>
                                    <td className="px-4 py-3 text-[#bd93f9] font-mono text-center">{candidate.passingOutYear}</td>
                                    <td className="px-4 py-3">
                                        {candidate.problemUnlocked
                                            ? <Badge variant="info"><Unlock size={10} /> {candidate.problemUnlocked}</Badge>
                                            : <span className="text-[#44475a] text-xs font-mono">—</span>
                                        }
                                    </td>
                                    <td className="px-4 py-3">
                                        {candidate.submittedSolution
                                            ? <Badge variant="success"><CheckCircle size={10} /> Yes</Badge>
                                            : <Badge variant="pending"><Clock size={10} /> No</Badge>
                                        }
                                    </td>
                                    <td className="px-4 py-3 text-[#6272a4] font-mono text-xs">{formatDate(candidate.createdAt)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {data?.pagination && (
                <PaginationControls
                    pagination={data.pagination}
                    onPageChange={setPage}
                />
            )}
        </div>
    )
}

// ─── Main Dashboard ───────────────────────────────────────────────────────────

type Tab = 'members' | 'recruitment'

export default function AdminDashboard() {
    const [activeTab, setActiveTab] = useState<Tab>('members')
    const [loggingOut, setLoggingOut] = useState(false)
    const router = useRouter()

    const { data: stats, isLoading: statsLoading, mutate: refreshStats } = useSWR<Stats>(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/stats`,
        fetcher,
        { refreshInterval: 60000 } // auto-refresh every 60s
    )

    const handleLogout = async () => {
        setLoggingOut(true)
        await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/logout`, { 
            method: 'POST',
            headers: { 'x-api-key': process.env.NEXT_PUBLIC_API_KEY || '' }
        })
        router.replace('/admin/login')
    }

    return (
        <div className="min-h-screen bg-[#0d0e12] text-[#f8f8f2]">
            {/* Top Nav */}
            <header className="sticky top-0 z-40 bg-[#0d0e12]/95 backdrop-blur-md border-b border-[#6272a4]/20">
                <div className="max-w-[1400px] mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
                    {/* Left: Logo + Title */}
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 font-mono">
                            <Terminal size={16} className="text-[#bd93f9]" />
                            <span className="text-[#bd93f9] font-bold text-sm hidden sm:block">C3</span>
                            <span className="text-[#6272a4] text-sm hidden sm:block">//</span>
                            <span className="text-[#f8f8f2] text-sm font-bold hidden sm:block">ADMIN</span>
                        </div>
                        {/* Live indicator */}
                        <div className="flex items-center gap-1.5 ml-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#50fa7b] animate-pulse" />
                            <span className="text-[#50fa7b] text-xs font-mono hidden sm:block">LIVE</span>
                        </div>
                    </div>

                    {/* Center: Tabs */}
                    <div className="flex items-center bg-[#1e1f29] border border-[#6272a4]/30 rounded-lg p-1 gap-1">
                        {(['members', 'recruitment'] as Tab[]).map(tab => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`px-4 py-1.5 rounded-md text-sm font-mono capitalize transition-all duration-200 flex items-center gap-2
                                    ${activeTab === tab
                                        ? 'bg-[#bd93f9]/20 text-[#bd93f9] border border-[#bd93f9]/30'
                                        : 'text-[#6272a4] hover:text-[#f8f8f2]'
                                    }`}
                            >
                                {tab === 'members' ? <Users size={13} /> : <UserPlus size={13} />}
                                <span className="hidden sm:inline">{tab}</span>
                            </button>
                        ))}
                    </div>

                    {/* Right: Refresh + Logout */}
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => refreshStats()}
                            className="p-2 rounded-lg text-[#6272a4] hover:text-[#8be9fd] transition-colors"
                            title="Refresh stats"
                        >
                            <RefreshCw size={15} />
                        </button>
                        <button
                            onClick={handleLogout}
                            disabled={loggingOut}
                            className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-[#ff5555]/30 text-[#ff5555] hover:bg-[#ff5555]/10 transition-colors text-xs font-mono disabled:opacity-50"
                        >
                            <LogOut size={13} />
                            <span className="hidden sm:inline">{loggingOut ? 'Logging out...' : 'Logout'}</span>
                        </button>
                    </div>
                </div>
            </header>

            <main className="max-w-[1400px] mx-auto px-4 sm:px-6 py-6">
                {/* Stats Row */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    {statsLoading ? (
                        Array.from({ length: 4 }).map((_, i) => (
                            <div key={i} className="border border-[#6272a4]/20 rounded-xl p-5">
                                <Skeleton className="h-8 w-8 rounded-lg mb-4" />
                                <Skeleton className="h-8 w-20 mb-2" />
                                <Skeleton className="h-4 w-28 mb-1" />
                                <Skeleton className="h-3 w-20" />
                            </div>
                        ))
                    ) : (
                        <>
                            <StatCard
                                title="Total Members"
                                value={stats?.members.total ?? 0}
                                subtitle={`+${stats?.members.last24h ?? 0} today`}
                                icon={Users}
                                color="green"
                            />
                            <StatCard
                                title="Email Sent"
                                value={stats?.members.emailSent ?? 0}
                                subtitle={`${stats?.members.emailPending ?? 0} pending`}
                                icon={Mail}
                                color="cyan"
                            />
                            <StatCard
                                title="Recruitment"
                                value={stats?.recruitment.total ?? 0}
                                subtitle={`+${stats?.recruitment.last24h ?? 0} today`}
                                icon={UserPlus}
                                color="purple"
                            />
                            <StatCard
                                title="Problems Unlocked"
                                value={stats?.recruitment.unlocked ?? 0}
                                subtitle={`${stats?.recruitment.submitted ?? 0} submitted`}
                                icon={Unlock}
                                color="yellow"
                            />
                        </>
                    )}
                </div>

                {/* Tab Content */}
                <div className="bg-[#0d0e12] border border-[#6272a4]/20 rounded-xl p-5">
                    {/* Tab Content Header */}
                    <div className="flex items-center justify-between mb-5 pb-4 border-b border-[#6272a4]/20">
                        <div className="flex items-center gap-2">
                            {activeTab === 'members' ? (
                                <Users size={16} className="text-[#50fa7b]" />
                            ) : (
                                <UserPlus size={16} className="text-[#bd93f9]" />
                            )}
                            <h2 className="font-mono font-bold text-[#f8f8f2] capitalize">{activeTab}</h2>
                            <span className="text-[#6272a4] text-xs font-mono">
                                // {activeTab === 'members' ? 'registered members' : 'recruitment candidates'}
                            </span>
                        </div>
                        <div className="flex items-center gap-2 text-xs font-mono text-[#6272a4]">
                            <Filter size={12} />
                            <span>Filter & Export</span>
                        </div>
                    </div>

                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -8 }}
                            transition={{ duration: 0.15 }}
                        >
                            {activeTab === 'members' ? <MembersTab /> : <RecruitmentTab />}
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* Footer */}
                <div className="mt-6 text-center text-[#44475a] text-xs font-mono">
                    C3 Admin Terminal — Unauthorized access is monitored and logged.
                </div>
            </main>
        </div>
    )
}
