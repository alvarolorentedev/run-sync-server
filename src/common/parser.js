let Activity = require('./Activity');

module.exports = {
	fromNikeToCommon: (activities) => {

		let arrayResults = [];
		activities.forEach((element, index, array) => {
			// console.log('Element : ' + JSON.stringify(element));
			let distance = 0;
			const duration = msToTime(element.active_duration_ms);
			const date = new Date(element.end_epoch_ms);
			distance = element.summaries.reduce((acc, elto) => {
				if (elto.metric === 'distance') {
					return acc + elto.value;
				} else {
					return acc;
				}
			}, 0);

			arrayResults.push(new Activity('nikeplus', element.id, date, duration, distance));
		});

		return arrayResults;
	}
};



function msToTime(duration) {
    var milliseconds = parseInt((duration%1000)/100), 
    	seconds = parseInt((duration/1000)%60), 
    	minutes = parseInt((duration/(1000*60))%60), 
    	hours = parseInt((duration/(1000*60*60))%24);

   	if (hours > 0) {
    	hours = (hours < 10) ? '0' + hours : hours + ':';
    } else {
    	hours = '';
    }
    if (minutes > 0) {
    	minutes = (minutes < 10) ? '0' + minutes : minutes + ':';
    } else {
    	minutes = '';
    }
    seconds = (seconds < 10) ? '0' + seconds : seconds;
    return hours + minutes + seconds;
}


