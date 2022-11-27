Meteor.methods({
	getText(path) {
		console.log('getText', path);
		return Assets.getText(path);
	},
});

