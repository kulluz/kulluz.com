import { Meteor } from 'meteor/meteor';
import { Documents } from '/imports/api/documents';
import '/imports/api/methods.js';


Meteor.startup(() => {
  const checkins =  [{type: "checkin", lnglat: {lng: 0.0, lat: 0.0}, time: new Date({}), uid: "excavator"}]
  //Documents.insert(checkins[0]);
});
