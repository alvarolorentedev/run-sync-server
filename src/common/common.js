const nodemailer = require('nodemailer');
const config = require('config');
const crypto = require('crypto');
const algorithm = 'aes-256-ctr';

var privateKey = config.key.privateKey;

// create reusable transport method (opens pool of SMTP connections)
// console.log(config.email.username+"  "+config.email.password);
var smtpTransport = nodemailer.createTransport("SMTP", {
    host: config.email.host,
	port: config.email.port,
	secureConnection: true,
	authMethod: config.email.authMethod,
	auth: {
		user: config.email.username,
		pass: config.email.password
	}
});

exports.decrypt = function(password) {
    return decrypt(password);
};

exports.encrypt = function(password) {
    return encrypt(password);
};

function mail(from, email, subject, mailbody){
    var mailOptions = {
        from: from, // sender address
        to: email, // list of receivers
        subject: subject, // Subject line
        //text: result.price, // plaintext body
        html: mailbody  // html body
    };

    smtpTransport.sendMail(mailOptions, function(error, response) {
        if (error) {
            console.error(error);
        }
        smtpTransport.close(); // shut down the connection pool, no more messages
    });
}