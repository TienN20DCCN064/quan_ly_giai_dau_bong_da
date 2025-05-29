const email = document.getElementById('email');
const subject = document.getElementById('subject');
const message = document.getElementById('message');
const form = document.getElementById('form_sendEmail');


document.addEventListener("DOMContentLoaded", function () {

    form.addEventListener('submit', async function (event) {
        event.preventDefault(); // Ngăn reload form
        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }
        console.log(document.getElementById('email').value);
        const form_sendGmail = {
            email_receiver: email.value,
            subject: subject.value,
            message: message.value
        }
        console.log(form_sendGmail);
        await hamChung.sendEmail(form_sendGmail.email_receiver, form_sendGmail.subject, form_sendGmail.message);


    });
});