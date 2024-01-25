const nodeMailer= require("nodemailer");

const transporter= nodeMailer.createTransport({
    service: "Gmail",
    host: "smtp.gmail.com",
    port: "465",
    secure: true,
    auth: {
        user: "dpsnittstudent@gmail.com",
        pass: "cznyttsneqmzigmy"
    }
});

async function sendMail (mail, token) {
    try {
        const sentMail= await transporter.sendMail({
            from: "'Ouiply'<dpsnittstudent@gmail.com>",
            to: mail,
            subject: "Verify Your Email Address For Quiply",
            text: `Dear User,
Thank you for registering at Quiply. To complete the registration process and ensure the security of your account, please verify your email address by clicking the link below.
            
http://localhost:5000/verifyUser/${token}
            
if you are unable to click the link, please copy and paste it into your browser. 

If it were not you, please disregard this email.

Thank you for choosing Quiply. Looking forward to having you, a valuable member.

Best Regards,
Admin
Quiply team`
        });
        return sentMail 
    } catch (error) {
        console.log(error);
    }
}
module.exports= sendMail