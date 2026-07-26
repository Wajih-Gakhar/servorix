import { getMyNotifications } from '@/app/actions/notificationActions'
import NotificationList from '@/components/NotificationList'

export default async function CustomerNotificationsPage() {
  const { notifications, error } = await getMyNotifications()

  if (error) {
    return <p style={{ color: 'var(--color-error)' }}>{error}</p>
  }

  return (
    <div>
      <h1 style={{ marginBottom: '2rem' }}>My Notifications</h1>
      <NotificationList initialNotifications={notifications || []} />
    </div>
  )
}
