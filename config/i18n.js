const path = require('path')
const fs = require('fs')

let en = {} // en-US
let th = {} // th-TH
let zh = {} // zh-CN
let lo = {} // lo-LA
fs.readdirSync(path.join(__dirname, '/../locales/en')).forEach((file) => {
  const locales = require(path.join(__dirname, '/../locales/en', file))
  en = {
    ...en,
    ...locales
  }
})
fs.readdirSync(path.join(__dirname, '/../locales/th')).forEach((file) => {
  const locales = require(path.join(__dirname, '/../locales/th', file))
  th = {
    ...th,
    ...locales
  }
})
fs.readdirSync(path.join(__dirname, '/../locales/zh')).forEach((file) => {
  const locales = require(path.join(__dirname, '/../locales/zh', file))
  zh = {
    ...zh,
    ...locales
  }
})
fs.readdirSync(path.join(__dirname, '/../locales/lo')).forEach((file) => {
  const locales = require(path.join(__dirname, '/../locales/lo', file))
  lo = {
    ...lo,
    ...locales
  }
})

export default {
  defaultLocale: 'en',
  seo: true,
  detectBrowserLanguage: false,
  locales: [
    {
      code: 'en',
      countryCode: 'gb',
      name: 'English',
      subName: 'อังกฤษ',
      iso: 'en-US'
    }
    // {
    //   code: 'th',
    //   countryCode: 'th',
    //   name: 'ไทย',
    //   subName: 'Thai',
    //   iso: 'th-TH'
    // }
    // {
    //   code: 'zh',
    //   countryCode: 'cn',
    //   name: '官話',
    //   subName: 'Chinese',
    //   iso: 'zh-CN'
    // },
    // {
    //   code: 'lo',
    //   countryCode: 'la',
    //   name: 'ລາວ',
    //   subName: 'Laos',
    //   iso: 'lo-LA'
    // }
  ],
  vueI18n: {
    // locale: 'th',
    // fallbackLocale: 'th',
    locale: 'en',
    fallbackLocale: 'en',
    messages: {
      en,
      th,
      zh,
      lo
    }
  }
}
