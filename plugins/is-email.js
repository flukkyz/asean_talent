import * as EmailValidator from 'email-validator'
export default ({ app }, inject) => {
  inject('email', EmailValidator)
}
