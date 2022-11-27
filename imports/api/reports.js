import {Meteor} from 'meteor/meteor';
import {Documents} from '/imports/api/documents';

Meteor.methods({
	getReports({query}) {
		return [{
			name: 'bills list',
			query: {type: 'bill'},
			columns: [
				'_id',
				{key: 'createdAt'}, // Same as above
				{key: 'from.name'}, // Evals to document['from']['name']
				{key: 'to.name'},
				{key: null, label: 'Description', render: '<h1>hi</h1>'},
			],
		}];
	},
});
