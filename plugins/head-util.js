export default ({ app, $i18n }, inject) => {
  inject('headUtil', (data) => {
    const dataTitle = data.title || (process.env.metaDefaultTitle ? process.env.metaDefaultTitle : '')
    const dataDescription = data.description ? data.description.replace(/<[^>]*>/g, '') : (process.env.metaDefaultDescription ? process.env.metaDefaultDescription.replace(/<[^>]*>/g, '') : '')
    return {
      htmlAttrs: {
        lang: data.lang || ($i18n.localeProperties ? $i18n.localeProperties.iso : (process.env.metaDefaultLang ? process.env.metaDefaultLang : ''))
      },
      title: dataTitle,
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: dataDescription
        },
        {
          name: 'keywords',
          content: data.keywords || (process.env.metaDefaultKeywords ? process.env.metaDefaultKeywords.split(',') : [])
        },
        {
          property: 'og:title',
          name: 'og:title',
          content: dataTitle
        },
        {
          property: 'og:type',
          name: 'og:type',
          content: 'article'
        },
        {
          property: 'og:description',
          name: 'og:description',
          content: dataDescription
        },
        {
          property: 'og:url',
          name: 'og:url',
          content: data.urlPath || (process.env.metaDefaultUrl ? process.env.metaDefaultUrl : '')
        },
        {
          property: 'og:site_name',
          name: 'og:site_name',
          content: process.env.metaDefaultSiteName ? process.env.metaDefaultSiteName : ''
        },
        {
          property: 'og:image',
          name: 'og:image',
          content: data.image || (process.env.metaDefaultImage ? process.env.metaDefaultImage : '')
        },
        {
          property: 'twitter:card',
          name: 'twitter:card',
          content: 'summary_large_image'
        },
        {
          property: 'twitter:site',
          name: 'twitter:site',
          content: '@publisher_handle'
        },
        {
          property: 'twitter:title',
          name: 'twitter:title',
          content: dataTitle
        },
        {
          property: 'twitter:description',
          name: 'twitter:description',
          content: dataDescription
        },
        {
          property: 'twitter:image',
          name: 'twitter:image',
          content: data.image || (process.env.metaDefaultImage ? process.env.metaDefaultImage : '')
        },
        {
          property: 'twitter:image:src',
          name: 'twitter:image:src',
          content: data.image || (process.env.metaDefaultImage ? process.env.metaDefaultImage : '')
        }
      ],
      link: [
        {
          rel: 'canonical',
          href: data.urlPath || (process.env.metaDefaultUrl ? process.env.metaDefaultUrl : '')
        }
      ]
    }
  })
}
