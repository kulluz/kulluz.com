import {Meteor} from 'meteor/meteor';
import {fetch, Headers, request, response} from 'meteor/fetch';
import {Documents} from '/imports/api/documents';

Meteor.methods({
	getSchemas(query) {
		return [{
			name: 'bill',
		}];
	},
});
