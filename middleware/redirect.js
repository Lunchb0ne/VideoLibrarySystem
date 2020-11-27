export default async function({ store, redirect }) {
	// automatic redirect
	if (!store.$auth.loggedIn) return redirect('/');
	else {
		const userRef = store.$fire.firestore.collection('users');
		const res = await userRef.where('email', '==', store.$auth.user.email).get();
		if (res.empty) {
			console.log('No matching user\nCreating a new one.');
			const adding = await userRef
				.add({
					email: store.$auth.user.email,
					fname: store.$auth.user.given_name,
					lname: store.$auth.user.family_name ? store.$auth.user.family_name : '',
					purchases: [],
					type: 3,
					created: store.$fireModule.firestore.FieldValue.serverTimestamp()
				})
				.then(
					() => {
						console.log('User Added');
					},
					(err) => {
						console.error(err);
					}
				);
			return;
		}
	}
}
