export default function ({ store, redirect, localePath }) {
  if (store.$auth.loggedIn && !['secret'].includes(store.$auth.user.role)) {
    return redirect(localePath({ name: 'backend-index' }))
  }
}
