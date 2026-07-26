'use client'

import { useEffect, useState } from 'react'
import { getAllBusinesses, updateBusinessStatus, softDeleteBusiness, restoreBusiness, permanentlyDeleteBusiness } from '@/app/actions/adminActions'

export default function AdminBusinessesPage() {
    const [businesses, setBusinesses] = useState<any[]>([])

    async function fetchBusinesses() {
        const res = await getAllBusinesses()

        if (res?.success) {
            setBusinesses(res.businesses)
        } else {
            console.log("Failed to load businesses:", res)
        }
    }

    async function handleStatus(id: string, status: 'APPROVED' | 'REJECTED') {
        await updateBusinessStatus(id, status)
        fetchBusinesses()
    }

    async function handleSoftDelete(id: string) {
        await softDeleteBusiness(id)
        fetchBusinesses()
    }

    async function handleRestore(id: string) {
        await restoreBusiness(id)
        fetchBusinesses()
    }

    async function handlePermanentDelete(id: string) {
        if (!confirm('Are you sure you want to permanently delete this business?')) return
        await permanentlyDeleteBusiness(id)
        fetchBusinesses()
    }

    useEffect(() => {
        fetchBusinesses()
    }, [])

    return (
        <div>
            <h1>Admin Dashboard - Businesses</h1>
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Type</th>
                        <th>City</th>
                        <th>Owner</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {businesses.map(b => (
                        <tr key={b.id}>
                            <td>{b.name}</td>
                            <td>{b.type}</td>
                            <td>{b.city}</td>
                            <td>{b.owner?.name} ({b.owner?.email})</td>
                            <td>{b.status}</td>
                            <td>
                                {b.status === 'PENDING' && (
                                    <>
                                        <button onClick={() => handleStatus(b.id, 'APPROVED')}>Approve</button>
                                        <button onClick={() => handleStatus(b.id, 'REJECTED')}>Reject</button>
                                    </>
                                )}
                                {b.status === 'APPROVED' && <button onClick={() => handleSoftDelete(b.id)}>Soft Delete</button>}
                                {b.status === 'DELETED' && <button onClick={() => handleRestore(b.id)}>Restore</button>}
                                <button onClick={() => handlePermanentDelete(b.id)}>Delete Permanently</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}