'use client'

import { useState, useEffect } from 'react'
import { getCategories, createCategory, deleteCategory, updateCategory, seedMissingCategories } from '@/app/actions/categoryActions'
import { AnimatedSection } from '@/components/AnimatedStagger'

export default function AdminCategoriesPage() {
    const [categories, setCategories] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [creating, setCreating] = useState(false)
    const [editingId, setEditingId] = useState<string | null>(null)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')

    const fetchCategories = async () => {
        setLoading(true)
        const res = await getCategories()
        if (res.success) {
            setCategories(res.categories || [])
        }
        setLoading(false)
    }

    useEffect(() => {
        fetchCategories()
    }, [])

    const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const form = e.currentTarget
        setError('')
        setSuccess('')
        setCreating(true)
        
        const formData = new FormData(form)
        const res = await createCategory(formData)
        
        if (res.error) {
            setError(res.error)
        } else {
            form.reset()
            setSuccess('Category registered successfully')
            fetchCategories()
        }
        setCreating(false)
    }

    const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (!editingId) return

        setError('')
        setSuccess('')
        setCreating(true)
        
        const formData = new FormData(e.currentTarget)
        const res = await updateCategory(editingId, formData)
        
        if (res.error) {
            setError(res.error)
        } else {
            setEditingId(null)
            setSuccess('Category updated successfully')
            fetchCategories()
        }
        setCreating(false)
    }

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this category? This might affect existing business listings.')) return
        
        const res = await deleteCategory(id)
        if (res.error) {
            alert(res.error)
        } else {
            fetchCategories()
        }
    }

    const handleSeed = async () => {
        if (!confirm('This will add missing predefined categories to your database. Continue?')) return
        setLoading(true)
        const res = await seedMissingCategories()
        if (res.error) {
            setError(res.error)
        } else {
            setSuccess(res.count ? `Successfully added ${res.count} categories.` : 'All categories are already present.')
            fetchCategories()
        }
        setLoading(false)
    }

    const startEdit = (cat: any) => {
        setEditingId(cat.id)
        setError('')
        setSuccess('')
    }

    const cancelEdit = () => {
        setEditingId(null)
        setError('')
    }

    return (
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
            <AnimatedSection directional="left">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2.5rem' }}>
                    <div>
                        <h1 style={{ fontSize: '2.25rem', fontWeight: 900, letterSpacing: '-1px', margin: 0 }}>📂 Category Management</h1>
                        <p style={{ color: 'var(--text-secondary)', marginTop: '0.25rem' }}>Organize and define business classifications across the platform.</p>
                    </div>
                    <button 
                        onClick={handleSeed}
                        className="btn btn-secondary glass-card"
                        style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.25rem' }}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"></path></svg>
                        Pre-fill Categories
                    </button>
                </div>
            </AnimatedSection>

            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 380px', gap: '2rem', alignItems: 'start' }}>
                
                {/* CATEGORIES LIST TABLE */}
                <AnimatedSection directional="up" className="glass-card" style={{ padding: '2rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
                        <h2 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0 }}>Portal Categories ({categories.length})</h2>
                    </div>

                    {loading && categories.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '4rem 0' }}>
                            <div style={{ color: 'var(--color-primary)', display: 'inline-block', marginBottom: '1rem' }}>
                                <svg style={{ animation: 'spin 1s linear infinite' }} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="2" x2="12" y2="6"></line><line x1="12" y1="18" x2="12" y2="22"></line><line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line><line x1="2" y1="12" x2="6" y2="12"></line><line x1="18" y1="12" x2="22" y2="12"></line><line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line><line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line></svg>
                            </div>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Retrieving classifications...</p>
                        </div>
                    ) : categories.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '4rem 2rem', background: 'rgba(255,255,255,0.02)', borderRadius: '1rem', border: '1px dashed var(--border-color)' }}>
                            <p style={{ color: 'var(--text-secondary)', margin: '0 0 1.5rem 0' }}>No active categories registered in the database.</p>
                            <button onClick={handleSeed} className="btn btn-primary btn-sm">Auto-Initialize Platform Categories</button>
                        </div>
                    ) : (
                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead>
                                    <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                                        <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>Classification</th>
                                        <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>Scope/Description</th>
                                        <th style={{ padding: '1rem', textAlign: 'right', fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>Management</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {categories.map((cat: any, i: number) => (
                                        <tr key={cat.id} style={{ borderBottom: i === categories.length - 1 ? 'none' : '1px solid rgba(255,255,255,0.05)', transition: 'background 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'} onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
                                            <td style={{ padding: '1.25rem 1rem' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                                    <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(0,180,216,0.1)', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem' }}>
                                                        {cat.icon || '📌'}
                                                    </div>
                                                    <span style={{ fontWeight: 700, fontSize: '1rem' }}>{cat.name}</span>
                                                </div>
                                            </td>
                                            <td style={{ padding: '1.25rem 1rem' }}>
                                                <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-secondary)', maxWidth: '300px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                    {cat.description || 'Global classification tier.'}
                                                </p>
                                            </td>
                                            <td style={{ padding: '1.25rem 1rem', textAlign: 'right' }}>
                                                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                                                    <button 
                                                        onClick={() => startEdit(cat)}
                                                        className="btn btn-sm"
                                                        style={{ background: 'rgba(255,255,255,0.05)', color: 'var(--text-primary)', border: '1px solid rgba(255,255,255,0.1)', padding: '0.5rem 0.75rem', fontSize: '0.75rem', borderRadius: '8px' }}
                                                    >
                                                        Edit
                                                    </button>
                                                    <button 
                                                        onClick={() => handleDelete(cat.id)}
                                                        className="btn btn-sm"
                                                        style={{ background: 'rgba(239, 68, 68, 0.1)', color: 'var(--color-error)', border: '1px solid rgba(239,68,68,0.2)', padding: '0.5rem 0.75rem', fontSize: '0.75rem', borderRadius: '8px' }}
                                                    >
                                                        Retire
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </AnimatedSection>
                
                {/* FORM SIDEBAR (ADD or EDIT) */}
                <AnimatedSection directional="right" className="glass-card" style={{ padding: '2rem', height: 'fit-content', border: editingId ? '1px solid var(--color-primary)' : '1px solid rgba(255,255,255,0.05)' }}>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 900, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        {editingId ? (
                             <>
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                                Modify Definition
                             </>
                        ) : (
                             <>
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="16"></line><line x1="8" y1="12" x2="16" y2="12"></line></svg>
                                Initialize Entry
                             </>
                        )}
                    </h3>

                    {error && <div className="badge badge-error" style={{ marginBottom: '1.5rem', width: '100%', padding: '1rem' }}>{error}</div>}
                    {success && <div className="badge badge-success" style={{ marginBottom: '1.5rem', width: '100%', padding: '1rem', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16,185,129,0.2)', color: '#10b981' }}>{success}</div>}

                    <form onSubmit={editingId ? handleUpdate : handleCreate} style={{ display: 'grid', gap: '1.25rem' }}>
                        <div className="form-group" style={{ margin: 0 }}>
                            <label className="form-label">Classification Name</label>
                            <input 
                                type="text" 
                                name="name" 
                                required 
                                className="form-input"
                                placeholder="e.g. Wellness Spa"
                                key={editingId ? `edit-name-${editingId}` : 'new-name'}
                                defaultValue={editingId ? categories.find(c => c.id === editingId)?.name : ''}
                            />
                        </div>

                        <div className="form-group" style={{ margin: 0 }}>
                            <label className="form-label">Scope Description</label>
                            <textarea 
                                name="description" 
                                rows={3}
                                className="form-input"
                                placeholder="Define the operational boundaries..."
                                style={{ resize: 'none' }}
                                key={editingId ? `edit-desc-${editingId}` : 'new-desc'}
                                defaultValue={editingId ? categories.find(c => c.id === editingId)?.description || '' : ''}
                            ></textarea>
                        </div>

                        <div className="form-group" style={{ margin: 0 }}>
                            <label className="form-label">Primary Icon/Emoji</label>
                            <input 
                                type="text" 
                                name="icon" 
                                className="form-input"
                                placeholder="Choose a visual identifier (💈, 🧘‍♀️)"
                                key={editingId ? `edit-icon-${editingId}` : 'new-icon'}
                                defaultValue={editingId ? categories.find(c => c.id === editingId)?.icon || '' : ''}
                            />
                        </div>

                        <div style={{ display: 'flex', gap: '0.75rem' }}>
                            {editingId && (
                                <button 
                                    type="button" 
                                    onClick={cancelEdit}
                                    className="btn btn-secondary"
                                    style={{ flex: 1 }}
                                >
                                    Cancel
                                </button>
                            )}
                            <button 
                                type="submit" 
                                disabled={creating}
                                className="btn btn-primary"
                                style={{ flex: 2 }}
                            >
                                {creating ? 'Synchronizing...' : editingId ? 'Update Definition' : 'Register Category'}
                            </button>
                        </div>
                    </form>
                </AnimatedSection>
            </div>
        </div>
    )
}
