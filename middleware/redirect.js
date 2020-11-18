export default function ({ store, redirect }) {
  // automatic redirect
  if(!store.$auth.loggedIn)
    return redirect('/')
}
