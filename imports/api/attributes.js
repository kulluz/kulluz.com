import {Mongo} from 'meteor/mongo';

import {Meteor} from 'meteor/meteor';
import {Documents} from '/imports/api/documents';
export const Attributes = new Mongo.Collection('attributes');

Meteor.methods({
	getAttributes() {
		const currencies = [{value: 'USD', label: '$'}, {value: 'EUR', label: '€'}, {value: 'BTC', label: '฿'}, {value: 'JPY', label: '¥'}];
		const listOptions = (list) => list.map((item) => ({value: item, label: item}));
		const selector = listOptions(['InputText', 'InputNumber', 'InputSelect', 'InputDateTime']);
		console.log('selector', selector);
		return [
			{type: 'model', name: 'model'},
			{type: 'attribute', model: 'model', label: 'name', inputType: 'InputText'},

			{type: 'model', name: 'attribute'},
			{type: 'attribute', model: 'attribute', label: 'label', inputType: 'InputText'},
			{type: 'attribute', model: 'attribute', label: 'model', inputType: 'InputAutoComplete', options: {type: 'model'}},
			{type: 'attribute', model: 'attribute', label: 'inputType', inputType: 'InputSelect', options: listOptions(['InputText', 'InputNumber', 'InputSelect', 'InputDateTime'])},

			{type: 'model', name: 'item'},

			{type: 'model', name: 'tx'},
			{type: 'attribute', model: 'tx', label: 'createdAt', inputType: 'InputDateTime'},
			{type: 'attribute', model: 'tx', label: 'account', inputType: 'InputSelect'},
			{type: 'attribute', model: 'tx', label: 'item', inputType: 'InputText'},
			{type: 'attribute', model: 'tx', label: 'timestamp', inputType: 'InputDateTime'},
			{type: 'attribute', model: 'tx', label: 'direction', inputType: 'InputSelect', options: listOptions([1, -1])},
			{type: 'attribute', model: 'tx', label: 'amount', inputType: 'InputNumber'},
			{type: 'attribute', model: 'tx', label: 'weight', inputType: 'InputNumber'},

			{type: 'model', name: 'bill'},

			{type: 'attribute', model: 'bill', label: 'item', inputType: 'tx'},
			{type: 'attribute', model: 'bill', label: 'item', inputType: 'InputSelect', options: {type: 'item'}},
			{type: 'attribute', model: 'bill', inputType: 'InputDate', label: 'timestamp'},

			{type: 'attribute', model: 'bill', inputType: 'InputNumber', label: 'creditAmount'},
			{type: 'attribute', model: 'bill', inputType: 'InputSelect', label: 'creditCurrencyName', options: currencies},
			{type: 'attribute', model: 'bill', inputType: 'InputText', label: 'note'},

			{type: 'model', name: 'account'},
			{type: 'attribute', model: 'account', inputType: 'InputText', label: 'name'},

		];
	},
});
