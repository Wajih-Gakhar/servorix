import { ReactNode } from 'react'
import { getSession } from '@/lib/auth'
import { redirect } from 'next/navigation'
import ConversationList from '@/components/chat/ConversationList'

export default async function MessagesLayout({ children }: { children: ReactNode }) {
    const session = await getSession()
    if (!session) redirect('/login')

    return (
        <div className="container" style={{ paddingTop: '8rem', height: '100vh', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', gap: '2rem', flex: 1, overflow: 'hidden', paddingBottom: '2rem' }}>
                <aside style={{ 
                    width: '350px', 
                    background: 'var(--bg-glass)', 
                    border: '1px solid var(--border-color)', 
                    borderRadius: '16px', 
                    overflowY: 'auto', 
                    padding: '1.5rem' 
                }}>
                    <h3 style={{ fontSize: '1rem', marginBottom: '1.5rem', opacity: 0.7, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Network Streams</h3>
                    <ConversationList currentUser={session} />
                </aside>
                
                <main style={{ 
                    flex: 1, 
                    minWidth: 0, 
                    background: 'var(--bg-glass)', 
                    border: '1px solid var(--border-color)', 
                    borderRadius: '16px',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column'
                }}>
                    {children}
                </main>
            </div>
        </div>
    )
}
