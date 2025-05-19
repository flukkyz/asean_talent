export default function ({ store, redirect, localePath }) {
  if (store.$auth.loggedIn && !['secret', 'admin', 'country_admin'].includes(store.$auth.user.role)) {
    return redirect(localePath({ name: 'backend-index' }))
  }
}
