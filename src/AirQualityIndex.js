/* © 2018 NauStud.io
 * Licensed under the MIT license.
 * @author Thanh Tran
 */
import request from 'request-promise-native';

/**
 * AQI class
 * Wrapping Air quality index object from http://aqicn.org
 */
class AirQualityIndex {
	constructor() {
		this.aqiInfo = {
			aqi: 0,
			time: new Date(),
			advice: this.lookupAdvice(0),
		};
	}

	getCurrentAQI() {
		return request({
			method: 'GET',
			// currently hardcoded to Ho Chi Minh city
			uri: 'http://api.waqi.info/feed/@8767/?token=9a7b5159d27b748c6c24449560afa6d241bc6921',
			json: true, // Automatically stringifies the body to JSON
		}).then(body => {
			console.log('getCurrentAQI body:', body);
			if (body && body.data) {
				const data = body.data;
				this.aqiInfo = {
					aqi: data.aqi,
					time: new Date(data.time.s),
					advice: this.lookupAdvice(data.aqi),
				};
			}

			return this;
		});
	}

	getAQIMessage() {
		const info = this.aqiInfo;

		const message = {
			as_user: true,
			attachments: [
				{
					fallback: `Chỉ số chất lượng không khí tại TP.HCM là *${info.aqi}*, với đánh giá là *${
						info.advice.level
					}*.`,
					color: info.advice.b,

					text: `Chỉ số chất lượng không khí tại TP.HCM là *${info.aqi}*, với đánh giá là *${
						info.advice.level
					}*.${info.aqi > 150 ? ' Ra đường nên mang khẩu trang bạn nhé.' : ''}`,
					// image_url: 'http://my-website.com/path/to/image.jpg',
					thumb_url: info.advice.thumb,
					footer: `AQI được cập nhật vào lúc ${info.time.toLocaleTimeString()}`,
				},
			],
		};

		return message;
	}

	lookupAdvice(aqi) {
		let advice = {
			level: 'Không có dữ liệu',
			b: '#888888',
			f: '#ffffff',
			thumb: 'http://mohawkvalleyweather.com/ajax-images/ajax-images/AQI-Icons/AQI0.jpg',
		};

		if (aqi <= 50) {
			advice = {
				level: 'trong lành',
				b: '#009966',
				f: '#ffffff',
				thumb: 'http://mohawkvalleyweather.com/ajax-images/ajax-images/AQI-Icons/AQI1.jpg',
			};
		} else if (aqi <= 100) {
			advice = {
				level: 'tạm được',
				b: '#ffde33',
				f: '#000000',
				thumb: 'http://mohawkvalleyweather.com/ajax-images/ajax-images/AQI-Icons/AQI2.jpg',
			};
		} else if (aqi <= 150) {
			advice = {
				level: 'không tốt cho người nhạy cảm',
				b: '#ff9933',
				f: '#000000',
				thumb: 'http://mohawkvalleyweather.com/ajax-images/ajax-images/AQI-Icons/AQI3.jpg',
			};
		} else if (aqi <= 200) {
			advice = {
				level: 'không tốt cho sức khỏe',
				b: '#cc0033',
				f: '#ffffff',
				thumb: 'http://mohawkvalleyweather.com/ajax-images/ajax-images/AQI-Icons/AQI4.jpg',
			};
		} else if (aqi <= 300) {
			advice = {
				level: 'RẤT không tốt cho sức khỏe.',
				b: '#660099',
				f: '#ffffff',
				thumb: 'http://mohawkvalleyweather.com/ajax-images/ajax-images/AQI-Icons/AQI5.jpg',
			};
		} else {
			// > 300
			advice = {
				level: 'độc hại',
				b: '#7e0023',
				f: '#ffffff',
				thumb: 'http://mohawkvalleyweather.com/ajax-images/ajax-images/AQI-Icons/AQI6.jpg',
			};
		}

		return advice;
	}
}

export { AirQualityIndex };

/*
Example response from aqi
{
	"status": "ok",
	"data":
	{
		"aqi": 107,
		"idx": 8767,
		"attributions": [
		{
			"url": "http://worldweather.wmo.int",
			"name": "World Meteorological Organization - surface synoptic observations (WMO-SYNOP)"
		},
		{
			"url": "https://vn.usembassy.gov/embassy-consulates/ho-chi-minh-city/air-quality-monitor/",
			"name": "Ho Chi Minh City Air Quality Monitor - Embassy of the United States"
		}],
		"city":
		{
			"geo": [10.782978, 106.700711],
			"name": "Ho Chi Minh City US Consulate",
			"url": "http://aqicn.org/city/vietnam/ho-chi-minh-city/us-consulate/"
		},
		"dominentpol": "pm25",
		"iaqi":
		{
			"h":
			{
				"v": 57
			},
			"p":
			{
				"v": 1007.5
			},
			"pm25":
			{
				"v": 107
			},
			"t":
			{
				"v": 31.65
			}
		},
		"time":
		{
			"s": "2018-02-26 17:00:00",
			"tz": "+07:00",
			"v": 1519664400
		}
	}
}
 */
