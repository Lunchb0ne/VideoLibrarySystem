export default async function({ store, redirect }) {
	// automatic redirect
	if (!store.$auth.loggedIn) {
		return redirect('/');
	} else {
		const userRef = store.$fire.firestore.collection('users');
		const res = await userRef.where('email', '==', store.$auth.user.email).get();
		if (res.docs[0].data().type != 1) {
			return redirect('/');
		}
	}
}
