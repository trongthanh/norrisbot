/* © 2017 NauStud.io
 * Licensed under the MIT license.
 * @author Thanh Tran
 */
import request from 'request-promise-native';

/**
 * Weather class
 * Wrapping openweather's info object for convenience
 * @param {[type]} weatherInfo [description]
 */
class WundergroundWeather {
	constructor(weatherInfo) {
		this.rawObj = weatherInfo;
		this.rawHourlyArr = null;
	}

	getCurrentWeather() {
		const hour = new Date();
		hour.setMinutes(0, 0, 0); //roud it up to hours

		return request({
			method: 'GET',
			uri: 'http://api.wunderground.com/api/33c9addcc118e257/conditions/lang:VU/q/zmw:00000.2.48894.json',
			json: true, // Automatically stringifies the body to JSON
		}).then(body => {
			console.log('getCurrentWeather body:', body);
			if (body) {
				this.rawObj = body.current_observation;
			}

			return this;
		});
	}

	getHourlyWeather() {
		const hour = new Date();
		hour.setMinutes(0, 0, 0); //roud it up to hours

		return request
			.get({
				method: 'GET',
				uri: 'http://api.wunderground.com/api/33c9addcc118e257/conditions/hourly/lang:VU/q/zmw:00000.2.48894.json',
				json: true, // Automatically stringifies the body to JSON
			})
			.then(body => {
				console.log('getHourlyWeather body:', body);
				if (body) {
					this.rawObj = body.current_observation;
					this.rawHourlyArr = body.hourly_forecast;
				}

				return this;
			});
	}

	/**
	* Temperature in Degree Celsius
	* @return {Number} [description]
	*/
	temp() {
		return this.rawObj.temp_c;
	}

	/**
	* Feel-like temperatue in Degree Celsius
	* @return {Number} [description]
	*/
	feelLikeTemp() {
		return parseFloat(this.rawObj.feelslike_c);
	}

	/**
	* Humidity in percentage
	* @return {Number} [description]
	*/
	humidity() {
		return parseFloat(this.rawObj.relative_humidity); //raw value is in string, i.e "62%"
	}

	/**
	* Weather description
	* @return {String} [description]
	*/
	mainCondition() {
		return this.rawObj.weather;
	}

	/**
	* Wind speed at km/h
	* (Raw wind speed is in m/s)
	* @return {Number} [description]
	*/
	windSpeed() {
		return this.rawObj.wind_kph;
	}

	/**
	* Weather condition in next hour (forecast)
	* @return {String} condition string
	*/
	nextHourCondition() {
		if (this.rawHourlyArr && this.rawHourlyArr[0]) {
			// first item in the array is next hour
			return this.rawHourlyArr[0].condition;
		}

		return '';
	}

	getWeatherMessage() {
		let text = `Nhiệt độ bên ngoài là *${this.temp()} độ*`;

		if (this.feelLikeTemp()) {
			text += `, cảm giác như *${this.feelLikeTemp()} độ*. `;
		} else {
			text += '; ';
		}

		if (this.humidity() >= 80) {
			text += `Độ ẩm là *${this.humidity()}%*. `;
		}
		if (this.windSpeed() >= 20) {
			text += `Tốc độ gió là *${this.windSpeed()} km/h*. `;
		}

		//text += 'Thời tiết hiện tại là ' + this.mainCondition() + '; ';

		const nextHourCondition = this.nextHourCondition().toLowerCase();
		if (nextHourCondition && nextHourCondition !== this.mainCondition().toLowerCase()) {
			text += `Thời tiết của giờ tiếp theo là *${nextHourCondition}*. `;
		}

		if (nextHourCondition.includes('mưa') || nextHourCondition.includes('dông')) {
			text += '\nĐi đâu nhớ đem theo áo mưa nhé, ahihi :umbrella_with_rain_drops:.';
		}

		return text;
	}
}

export { WundergroundWeather };
