import PusherClient from 'pusher-js'

let pusherClientInstance: PusherClient | null = null;

export const getPusherClient = () => {
    if (typeof window === 'undefined') return null; // Avoid SSR issues
    
    if (!pusherClientInstance) {
        pusherClientInstance = new PusherClient(process.env.NEXT_PUBLIC_PUSHER_APP_KEY!, {
            cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
            forceTLS: true,
            authEndpoint: '/api/pusher/auth', // For private channel authentication (optional capability)
        });
    }
    
    return pusherClientInstance;
}
