export default function ({ store, redirect, localePath }) {
  if (store.$auth.loggedIn && !!store.$auth.user.role) {
    return redirect(localePath({ name: 'index' }))
  }
}
