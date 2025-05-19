export default ({ app }, inject) => {
  const lang = {
    sIso: {
      th: 'th',
      en: 'en',
      zh: 'zh',
      lo: 'lo'
    },
    iso: {
      th: 'th-th',
      en: 'en-us',
      zh: 'zh-cn',
      lo: 'lo-la'
    },
    ISO: {
      th: 'th-TH',
      en: 'en-US',
      zh: 'zh-CN',
      lo: 'lo-LA'
    }
  }
  inject('lang', {
    l: () => {
      return app.i18n.locale
    },
    isTh: () => {
      return app.i18n.locale === 'th'
    },
    isEn: () => {
      return app.i18n.locale === 'en'
    },
    isZh: () => {
      return app.i18n.locale === 'zh'
    },
    isLo: () => {
      return app.i18n.locale === 'lo'
    },
    getSIso: () => {
      return lang.sIso[app.i18n.locale]
    },
    getIso: () => {
      return lang.iso[app.i18n.locale]
    },
    getISO: () => {
      return lang.ISO[app.i18n.locale]
    }
  })
}
