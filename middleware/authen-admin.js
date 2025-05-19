export default function ({ store, redirect, localePath }) {
  if (!store.$auth.loggedIn) {
    return redirect(localePath({ name: 'backend-login' }))
  }
}
