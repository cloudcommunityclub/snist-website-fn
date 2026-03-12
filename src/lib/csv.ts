/**
 * Escape a value for safe CSV output.
 */
export function escCsv(val: unknown): string {
    if (val == null) return ''
    const s = Array.isArray(val) ? val.join('; ') : String(val)
    if (s.includes(',') || s.includes('"') || s.includes('\n')) {
        return `"${s.replace(/"/g, '""')}"`
    }
    return s
}
