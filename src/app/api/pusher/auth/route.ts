import { NextResponse } from 'next/server';
import { pusherServer } from '@/lib/pusherServer';
import { getSession } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const body = await req.formData();
    const socketId = body.get('socket_id') as string;
    const channel = body.get('channel_name') as string;

    const presenceData = {
      user_id: session.userId,
      user_info: {
        id: session.userId,
        role: session.role,
      },
    };

    const authResponse = pusherServer.authorizeChannel(socketId, channel, presenceData);
    return NextResponse.json(authResponse);
  } catch (error) {
    console.error('Pusher Auth Error:', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
