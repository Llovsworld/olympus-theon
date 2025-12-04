import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, email, message } = body;

        // Validation
        if (!name || !email || !message) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        // Simulate email sending (replace with actual email service later)
        console.log('Received contact form submission:', { name, email, message });

        // Here you would typically use Nodemailer, Resend, SendGrid, etc.
        // await sendEmail({ to: 'admin@olympus.com', subject: `New Contact from ${name}`, text: message });

        // Simulate delay
        await new Promise(resolve => setTimeout(resolve, 1000));

        return NextResponse.json(
            { message: 'Message sent successfully' },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error processing contact form:', error);
        return NextResponse.json(
            { error: 'Failed to send message' },
            { status: 500 }
        );
    }
}
