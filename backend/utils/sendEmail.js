import nodemailer from "nodemailer";

export const sendOTPEmail = async (email, otp) => {

    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    await transporter.sendMail({
        from: `"NextRig" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: "Your NextRig verification code",
        html: `
      <div style="font-family:sans-serif;max-width:400px;margin:auto">
        <h2>Verify your email</h2>
        <p>Your one-time verification code is:</p>
        <h1 style="letter-spacing:8px;color:#76b900">${otp}</h1>
        <p style="color:#888">Valid for 2 minutes. Do not share this code.</p>
      </div>
    `,
    });
};