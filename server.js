const { createServer } = require('http')
const { parse } = require('url')
const next = require('next')
const { Server } = require('socket.io')
const cron = require('node-cron')
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()
const dev = process.env.NODE_ENV !== 'production'
const hostname = 'localhost'
const port = process.env.PORT || 3000

const app = next({ dev, hostname, port })
const handle = app.getRequestHandler()

app.prepare().then(() => {
  const server = createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true)
      
      // Internal webhook to broadcast notifications from Server Actions
      if (parsedUrl.pathname === '/api/socket/internal-broadcast' && req.method === 'POST') {
        let body = ''
        req.on('data', chunk => { body += chunk.toString() })
        req.on('end', () => {
           try {
             if (body) {
                const data = JSON.parse(body)
                const eventName = data.eventType || 'notification'
                
                if (data.room) {
                    io.to(data.room).emit(eventName, data)
                } else if (data.userId) {
                    io.to(`user_${data.userId}`).emit(eventName, data)
                }
             }
             res.statusCode = 200
             res.end('OK')
           } catch(e) {
             console.error('Socket broadcast parse error:', e)
             res.statusCode = 500
             res.end('Error')
           }
        })
        return
      }

      await handle(req, res, parsedUrl)
    } catch (err) {
      console.error('Error occurred handling', req.url, err)
      res.statusCode = 500
      res.end('internal server error')
    }
  })

  // Initialize Socket.io
  const io = new Server(server, { cors: { origin: '*' } })

  io.on('connection', (socket) => {
    socket.on('join', (roomName) => {
      // If client provides just a numeric ID, we wrap it in user_ for backwards compatibility
      // But they can also pass 'business_123' directly.
      const room = roomName.startsWith('business_') ? roomName : `user_${roomName}`
      socket.join(room)
    })
  })

  server
    .once('error', (err) => {
      console.error(err)
      process.exit(1)
    })
    .listen(port, () => {
      console.log(`> Ready on http://${hostname}:${port}`)

      // CRON JOB: Check for upcoming appointments every 15 minutes
      cron.schedule('*/15 * * * *', async () => {
         console.log('Running automated appointment reminder check...')
         try {
             const now = new Date()
             
             // We need to find appointments that are "APPROVED"
             const upcoming = await prisma.appointment.findMany({
                 where: { status: 'APPROVED' },
                 include: { service: true }
             })

             for (const app of upcoming) {
                 // Construct Date object for the appointment
                 const [year, month, day] = app.date.split('-').map(Number)
                 const [hour, minute] = app.startTime.split(':').map(Number)
                 
                 const appDate = new Date(year, month - 1, day, hour, minute)
                 const diffHours = (appDate.getTime() - now.getTime()) / (1000 * 60 * 60)

                 // Check for 24 hours notification
                 if (diffHours > 23.75 && diffHours <= 24) {
                     await sendReminder(app, '24 hours', io)
                 }
                 // Check for 1 hour notification
                 else if (diffHours > 0.75 && diffHours <= 1) {
                     await sendReminder(app, '1 hour', io)
                 }
             }

         } catch (err) {
             console.error('Cron job error:', err)
         }
      })
    })
})

async function sendReminder(appointment, timeLabel, io) {
    // Prevent duplicate notifications by checking if one already exists
    const title = `Reminder: Appointment in ${timeLabel}`
    const existing = await prisma.notification.findFirst({
        where: { userId: appointment.customerId, title }
    })
    
    if (!existing) {
        const notification = await prisma.notification.create({
            data: {
                userId: appointment.customerId,
                title,
                message: `Your appointment for ${appointment.service.name} is coming up in ${timeLabel}!`,
                type: 'SYSTEM',
                isRead: false
            }
        })
        io.to(`user_${appointment.customerId}`).emit('notification', notification)
    }
}
