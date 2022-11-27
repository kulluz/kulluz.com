import {Meteor} from 'meteor/meteor';
import {Documents} from '/imports/api/documents';

Meteor.methods({
	getForms{query}) {
		return [{
			type: 'form',
			name: 'create bill',
			query: {type: 'forms'},
			columns: [
				'_id',
				{key: 'createdAt'}, // Same as above
				{key: 'from.name'}, // Evals to document['from']['name']
				{key: 'to.name'},
				{key: null, label: 'Description', onChange: 'console.log("changed")'},
			],
		}];
	}
});
