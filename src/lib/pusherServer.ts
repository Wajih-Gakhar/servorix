import PusherServer from 'pusher'

const pusherConfig = {
  appId: process.env.PUSHER_APP_ID!,
  key: process.env.NEXT_PUBLIC_PUSHER_APP_KEY!,
  secret: process.env.PUSHER_SECRET!,
  cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
  useTLS: true,
}

declare global {
  var pusherServer: PusherServer | undefined
}

// In development, to avoid connection leaks during HMR
export const pusherServer = global.pusherServer || new PusherServer(pusherConfig)

if (process.env.NODE_ENV !== 'production') {
  global.pusherServer = pusherServer
}
