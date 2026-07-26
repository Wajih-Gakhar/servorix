'use client'

import { useState, useEffect } from 'react'
import { getWorkingHours, updateWorkingHours, DaySchedule } from '@/app/actions/workingHoursActions'

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

export default function WorkingHoursManager({ businessId, defaultOpen, defaultClose }: { businessId: string, defaultOpen: string, defaultClose: string }) {
    const [schedules, setSchedules] = useState<DaySchedule[]>([])
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [message, setMessage] = useState('')

    useEffect(() => {
        const load = async () => {
             const res = await getWorkingHours(businessId)
             if (res.success) {
                 // Map the DB response into the 7-day UI state
                 const dbHours = res.hours || []
                 const hasConfigured = res.hasConfiguredHours
                 const newSchedules: DaySchedule[] = DAYS.map((_, i) => {
                     const existing = dbHours.find((h: any) => h.dayOfWeek === i)
                     if (existing) {
                         return { dayOfWeek: i, isOpen: true, openTime: existing.openTime, closeTime: existing.closeTime }
                     }
                     // If no explicitly saved data yet, fallback to the global business defaults
                     // BUT if we HAVE configured other hours, missing records mean CLOSED
                     const isOpen = !hasConfigured
                     return { dayOfWeek: i, isOpen, openTime: defaultOpen, closeTime: defaultClose }
                 })
                 setSchedules(newSchedules)
             }
             setLoading(false)
        }
        load()
    }, [businessId, defaultOpen, defaultClose])

    const handleToggle = (dayIndex: number) => {
        const updated = [...schedules]
        updated[dayIndex].isOpen = !updated[dayIndex].isOpen
        setSchedules(updated)
    }

    const handleChangeTime = (dayIndex: number, field: 'openTime' | 'closeTime', value: string) => {
        const updated = [...schedules]
        updated[dayIndex][field] = value
        setSchedules(updated)
    }

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault()
        setSaving(true)
        setMessage('')
        
        const res = await updateWorkingHours(businessId, schedules)
        if (res.error) {
            setMessage(res.error)
        } else {
            setMessage('Working hours saved successfully.')
            // Clear success message after 3 seconds
            setTimeout(() => setMessage(''), 3000)
        }
        setSaving(false)
    }

    if (loading) return <div>Loading schedules...</div>

    return (
        <form onSubmit={handleSave}>
            <div style={{ display: 'grid', gap: '1rem', marginBottom: '1.5rem' }}>
                {schedules.map((schedule, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', backgroundColor: 'var(--bg-main)', borderRadius: 'var(--radius-sm)' }}>
                        
                        <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                            <input 
                                type="checkbox" 
                                checked={schedule.isOpen} 
                                onChange={() => handleToggle(i)}
                                id={`day-${i}`}
                                style={{ width: '1.2rem', height: '1.2rem', cursor: 'pointer' }}
                            />
                            <label htmlFor={`day-${i}`} style={{ width: '90px', fontWeight: 'bold', cursor: 'pointer', color: schedule.isOpen ? 'var(--text-main)' : 'var(--text-secondary)' }}>
                                {DAYS[i]}
                            </label>
                            
                            {!schedule.isOpen && <span style={{ color: 'var(--color-error)', fontSize: '0.9rem', fontStyle: 'italic' }}>Closed</span>}
                        </div>

                        {schedule.isOpen && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <input 
                                    type="time" 
                                    value={schedule.openTime} 
                                    onChange={(e) => handleChangeTime(i, 'openTime', e.target.value)} 
                                    className="form-input" 
                                    style={{ padding: '0.4rem', border: '1px solid var(--border-color)', borderRadius: '4px' }}
                                    required
                                />
                                <span>to</span>
                                <input 
                                    type="time" 
                                    value={schedule.closeTime} 
                                    onChange={(e) => handleChangeTime(i, 'closeTime', e.target.value)} 
                                    className="form-input" 
                                    style={{ padding: '0.4rem', border: '1px solid var(--border-color)', borderRadius: '4px' }}
                                    required
                                />
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {message && <p style={{ color: message.includes('success') ? 'var(--color-success)' : 'var(--color-error)', marginBottom: '1rem' }}>{message}</p>}

            <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={saving}>
                {saving ? 'Saving...' : 'Save Schedule'}
            </button>
        </form>
    )
}
