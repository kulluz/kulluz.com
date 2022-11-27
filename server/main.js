import {Meteor} from 'meteor/meteor';
import {Documents} from '/imports/api/documents';
import '/imports/api/methods.js';
import '/imports/api/opentripmap.js';
import '/imports/api/attributes.js';
import {Attributes} from '../imports/api/attributes';
import {Models} from '../imports/api/models';

Meteor.startup(() => {

	Documents.remove({}, (errors, removed) => {
		console.log({errors, removed});
	});


	Meteor.call('getAttributes', (atts, ats) => {
		ats.forEach((at) => {
			Documents.insert(at);
		});
	});

	

	// Const checkins = [{type: 'checkin', lnglat: {lng: 0.0, lat: 0.0}, time: new Date({}), uid: 'excavator'}];
	// Documents.insert(checkins[0]);
});
