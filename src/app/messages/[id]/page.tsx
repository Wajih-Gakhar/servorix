import { getSession } from '@/lib/auth'
import { redirect } from 'next/navigation'
import ChatWindow from '@/components/chat/ChatWindow'

export default async function MessageNodePage({ params }: { params: Promise<{ id: string }> }) {
    const session = await getSession()
    if (!session) redirect('/login')

    const p = await params;

    return <ChatWindow conversationId={p.id} currentUser={session} />
}
