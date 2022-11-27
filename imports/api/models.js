import {Mongo} from 'meteor/mongo';

import {Meteor} from 'meteor/meteor';
import {Documents} from '/imports/api/documents';
export const Models = new Mongo.Collection('models');

Meteor.methods({
	getModels() {
		return [

		];
	},
});
