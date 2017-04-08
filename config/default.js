module.exports = {
  	MONGO_DB: 'run-sync',
  	SECRET: 'iloverunningandrunning',
  	server: {
	    host: 'localhost',
	    port: process.env.PORT || 8080
	},
	email: {
        host: '******',
		port: '***',
		secureConnection: true,
		authMethod: "****",
		username: "******",
		password: "******",
		verifyEmailUrl: "verifyEmail"
    }
};
