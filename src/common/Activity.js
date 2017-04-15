// Common object
// array of 'Activity' called 'activities'
// 'Activity' is an object with the data
// 'Activity.from' = 'nikeplus, endomondo, strava...'
// 'Activity.id' = id from their database
// 'Activity.duration' = ''
// 'Activity.distance' = distance



class Activity {
	constructor(from, id, date, duration, distance) {
		this.from = from;
		this.id = id;
		this.duration = duration;
		this.distance = distance;
		this.date = date
	}
}

module.exports = Activity;