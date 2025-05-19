export default function ({ redirect, localePath, $auth }) {
  if ($auth.loggedIn) {
    return redirect(localePath({ name: 'backend' }))
  }
}
