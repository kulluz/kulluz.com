import {Meteor} from 'meteor/meteor';
import {fetch, Headers, request, response} from 'meteor/fetch';
import {Documents} from '/imports/api/documents';

Meteor.methods({
	opentripmap(query) {
		const getDataCall = Meteor.wrapAsync(getData);

		const key = '5ae2e3f221c38a28845f05b60fac39f68c46743e2e00f1940dac5933';

		const checkins = [{type: 'checkin', lnglat: {lng: 0.0, lat: 0.0}, time: new Date({}), uid: 'excavator'}];

		const url = 'https://api.opentripmap.com/0.1/en/places/radius?radius=5000&lon=35.217018&lat=31.771959&apikey=5ae2e3f221c38a28845f05b60fac39f68c46743e2e00f1940dac5933';

		console.log({urlz: url});

		const result = getData({url}).then((resultz) => {
			console.log(Object.keys(resultz));
			resultz.features?.map((place) => {
				console.log('inserting', place);
				Documents.insert(place);
			});
			console.log({resultz});
		});
	},
});

async function postData(url, data) {
	try {
		const response = await fetch(url, {
			method: 'POST', // *GET, POST, PUT, DELETE, etc.
			mode: 'cors', // No-cors, *cors, same-origin
			cache: 'no-cache', // *Default, no-cache, reload, force-cache, only-if-cached
			credentials: 'same-origin', // Include, *same-origin, omit
			headers: new Headers({
				Authorization: 'Bearer my-secret-key',
				'Content-Type': 'application/json',
			}),
			redirect: 'follow', // Manual, *follow, error
			referrerPolicy: 'no-referrer', // No-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
			body: JSON.stringify(data), // Body data type must match "Content-Type" header
		});
		const data = await response.json();
		return response(null, data);
	} catch (err) {
		return response(err, null);
	}
}

async function getData({url, datas}) {
	try {
		const response = await fetch(url, {
			method: 'GET', // *GET, POST, PUT, DELETE, etc.
			// mode: 'cors', // no-cors, *cors, same-origin
			// cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
			// credentials: 'same-origin', // include, *same-origin, omit
			headers: new Headers({
				// Authorization: 'Bearer my-secret-key',
				'Content-Type': 'application/json',
			}),
			redirect: 'follow', // Manual, *follow, error
			referrerPolicy: 'no-referrer', // No-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
			// body: JSON.stringify(data) // body data type must match "Content-Type" header
		});
		console.log({url});
		const data = await response.json();
		// Console.log(data);
		return data; // Response(null, data);
	} catch (err) {
		return err; // Response(err, null);
	}
}
