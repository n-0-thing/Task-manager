const sgMail=require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
console.log(process.env.SENDGRID_API_KEY);
const sendWelcomeEmail=async(email,name)=>{
    await sgMail.send({

    to:email, 
    from:'saxenaojasvi0@gmail.com',
    subject:'Thanks for joining the App',
    text:`Welcome to the App ${name}`

})
};
const sendCancellationEmail=async(email,name)=>{
    await sgMail.send({

    to:email, 
    from:'saxenaojasvi0@gmail.com',
    subject:'Sorry for the inconvenience',
    text:`Hope to see u soon ${name}`

})
};
module.exports ={sendWelcomeEmail,sendCancellationEmail};