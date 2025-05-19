export default ({ app }, inject) => {
  inject('sleep', (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms))
  })
  inject('capitalize', (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1)
  })
  inject('isPDF', (src) => {
    return ['pdf'].includes(src.substr(src.lastIndexOf('.') + 1))
  })
  inject('isImage', (src) => {
    return ['bmp', 'png', 'jpeg', 'jpg', 'gif'].includes(src.substr(src.lastIndexOf('.') + 1))
  })
  inject('imageExist', (url) => {
    const img = new Image()
    img.src = url
    return img.height !== 0
  })
  inject('checkIdCard', (val) => {
    if (!val) { return false }
    const idc = val.replaceAll('-', '')
    if (idc.length < 13) {
      return false
    }
    let sum = 0
    for (let index = 0; index < idc.length - 1; index++) {
      sum += parseInt(idc.charAt(index)) * (idc.length - index)
    }
    return (11 - (sum % 11)) % 10 === parseInt(idc.charAt(idc.length - 1))
  })
  inject('age', (dob) => {
    return app.$dayjs().diff(dob, 'years')
  })
  inject('currencyText', (num, digitOptions = {}) => {
    return new Intl.NumberFormat(app.$lang.getIso(), digitOptions).format(num)
  })
  inject('idCardText', (idCard) => {
    return app.$checkIdCard(idCard) ? idCard.substr(0, 1) + '-' + idCard.substr(1, 4) + '-' + idCard.substr(5, 5) + '-' + idCard.substr(10, 2) + '-' + idCard.substr(12, 1) : idCard
  })
  inject('removeHtml', (str) => {
    return str ? str.replaceAll(/(<[^>]*>)/g, '').replaceAll('&nbsp;', ' ').replaceAll('&emsp;', '  ') : ''
  })
  inject('addUrlHttp', (url) => {
    if (url && !/^https?:\/\//i.test(url)) {
      url = `http://${url}`
    }
    return url
  })
  inject('dateText', (date = null, dateStyle = null, timeStyle = null) => {
    const dateTimeFormat = {
      th: {
        merge: '',
        date: {
          short: 'D/M/BB',
          medium: 'D MMM BBBB',
          long: 'D MMMM BBBB',
          full: 'วันddddที่ D MMMM พ.ศ. BBBB'
        },
        time: {
          short: 'H:mm',
          medium: 'HH.mm น.',
          long: 'HH:mm:ss',
          full: 'HH นาฬิกา mm นาที ss วินาที'
        }
      },
      en: {
        merge: 'at',
        date: {
          short: 'M/D/YY',
          medium: 'MMM D, YYYY',
          long: 'MMMM D, YYYY',
          full: 'dddd, MMMM D, YYYY'
        },
        time: {
          short: 'h:mm A',
          medium: 'hh:mm A',
          long: 'hh:mm:ss A',
          full: 'hh:mm:ss A'
        }
      },
      zh: {
        merge: 'at',
        date: {
          short: 'M/D/YY',
          medium: 'MMM D, YYYY',
          long: 'MMMM D, YYYY',
          full: 'dddd, MMMM D, YYYY'
        },
        time: {
          short: 'h:mm A',
          medium: 'hh:mm A',
          long: 'hh:mm:ss A',
          full: 'hh:mm:ss A'
        }
      },
      lo: {
        merge: 'at',
        date: {
          short: 'M/D/YY',
          medium: 'MMM D, YYYY',
          long: 'MMMM D, YYYY',
          full: 'dddd, MMMM D, YYYY'
        },
        time: {
          short: 'h:mm A',
          medium: 'hh:mm A',
          long: 'hh:mm:ss A',
          full: 'hh:mm:ss A'
        }
      }
    }
    if (date) {
      return app.$dayjs(date).locale(app.$lang.getSIso()).format(dateTimeFormat[app.$lang.getSIso()].date[(dateStyle || 'medium')]) + (timeStyle ? ` ${dateTimeFormat[app.$lang.getSIso()].merge} ${app.$dayjs(date).locale(app.$lang.getSIso()).format(dateTimeFormat[app.$lang.getSIso()].time[timeStyle])}` : '')
    } else {
      return app.$dayjs().locale(app.$lang.getSIso()).format(dateTimeFormat[app.$lang.getSIso()].date[(dateStyle || 'medium')]) + (timeStyle ? ` ${dateTimeFormat[app.$lang.getSIso()].merge} ${app.$dayjs().locale(app.$lang.getSIso()).format(dateTimeFormat[app.$lang.getSIso()].time[timeStyle])}` : '')
    }
  })
  inject('objToArr', (object) => {
    return Object.keys(object).map((key) => {
      const obj = {
        value: key,
        text: object[key]
      }
      return obj
    })
  })
  inject('objGetKey', (object, value) => {
    return Object.keys(object).find(key => object[key] === value)
  })
  inject('randomColor', (tone = 'all') => {
    const letters = '0123456789ABCDEF'
    let color = '#'
    for (let i = 0; i < 6; i++) {
      if (i % 2 === 0) {
        if (tone === 'dark') {
          color += letters[2 + Math.floor(Math.random() * 4)]
        } else if (tone === 'light') {
          color += letters[10 + Math.floor(Math.random() * 4)]
        } else {
          color += letters[Math.floor(Math.random() * 16)]
        }
      } else {
        color += letters[Math.floor(Math.random() * 16)]
      }
    }
    return color
  })
  inject('componentToHex', (c) => {
    const hex = c.toString(16)
    return hex.length === 1 ? '0' + hex : hex
  })
  inject('rgbToHex', (r, g, b) => {
    return '#' + app.$componentToHex(r) + app.$componentToHex(g) + app.$componentToHex(b)
  })
  inject('hexToRgb', (hex) => {
    const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i
    hex = hex.replace(shorthandRegex, function (m, r, g, b) {
      return r + r + g + g + b + b
    })

    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16)
        }
      : null
  })
  inject('rgbToHistogram', (r, g, b) => {
    return Math.floor((r + g + b) / 3)
  })
  inject('hexToHistogram', (hex) => {
    const rgb = app.$hexToRgb(hex)
    return rgb ? Math.floor((rgb.r + rgb.g + rgb.b) / 3) : null
  })
  inject('rgbIsDark', (r, g, b) => {
    const histogram = app.$rgbToHistogram(r, g, b)
    return histogram < 128
  })
  inject('hexIsDark', (hex) => {
    const histogram = app.$hexToHistogram(hex)
    return histogram < 128
  })
  inject('rgbIsLight', (r, g, b) => {
    return !app.$rgbIsDark(r, g, b)
  })
  inject('hexIsLight', (hex) => {
    return !app.$hexIsDark(hex)
  })
  inject('interpolateColor', (color1, color2, amount) => {
    const c1 = app.$hexToRgb(color1)
    const c2 = app.$hexToRgb(color2)
    const r = Math.round(c1.r + (c2.r - c1.r) * amount)
    const g = Math.round(c1.g + (c2.g - c1.g) * amount)
    const b = Math.round(c1.b + (c2.b - c1.b) * amount)
    return app.$rgbToHex(r, g, b)
  })
  inject('generateGradientColorList', (color1, color2, steps) => {
    const colorList = []
    for (let i = 0; i <= steps; i++) {
      const amount = i / steps
      colorList.push(app.$interpolateColor(color1, color2, amount))
    }
    return colorList
  })
  inject('charSwitch', (str) => {
    const charFrom = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '=', 'q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', '[', ']', '\\', 'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';', "'", 'z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '/', '!', '@', '#', '$', '%', '^', '&', '*', '(', ')', '_', '+', 'Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P', '{', '}', '|', 'A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', ':', '"', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', '<', '>', '?', 'ๅ', '/', '-', 'ภ', 'ถ', 'ุ', 'ึ', 'ค', 'ต', 'จ', 'ข', 'ช', 'ๆ', 'ไ', 'ำ', 'พ', 'ะ', 'ั', 'ี', 'ร', 'น', 'ย', 'บ', 'ล', 'ฃ', 'ฟ', 'ห', 'ก', 'ด', 'เ', '้', '่', 'า', 'ส', 'ว', 'ง', 'ผ', 'ป', 'แ', 'อ', 'ิ', 'ื', 'ท', 'ม', 'ใ', 'ฝ', '+', '๑', '๒', '๓', '๔', 'ู', '฿', '๕', '๖', '๗', '๘', '๙', '๐', '"', 'ฎ', 'ฑ', 'ธ', 'ํ', '๊', 'ณ', 'ฯ', 'ญ', 'ฐ', ',', 'ฅ', 'ฤ', 'ฆ', 'ฏ', 'โ', 'ฌ', '็', '๋', 'ษ', 'ศ', 'ซ', '.', '(', ')', 'ฉ', 'ฮ', 'ฺ', '์', '?', 'ฒ', 'ฬ', 'ฦ']
    const charTo = ['ๅ', '/', '-', 'ภ', 'ถ', 'ุ', 'ึ', 'ค', 'ต', 'จ', 'ข', 'ช', 'ๆ', 'ไ', 'ำ', 'พ', 'ะ', 'ั', 'ี', 'ร', 'น', 'ย', 'บ', 'ล', 'ฃ', 'ฟ', 'ห', 'ก', 'ด', 'เ', '้', '่', 'า', 'ส', 'ว', 'ง', 'ผ', 'ป', 'แ', 'อ', 'ิ', 'ื', 'ท', 'ม', 'ใ', 'ฝ', '+', '๑', '๒', '๓', '๔', 'ู', '฿', '๕', '๖', '๗', '๘', '๙', '๐', '"', 'ฎ', 'ฑ', 'ธ', 'ํ', '๊', 'ณ', 'ฯ', 'ญ', 'ฐ', ',', 'ฅ', 'ฤ', 'ฆ', 'ฏ', 'โ', 'ฌ', '็', '๋', 'ษ', 'ศ', 'ซ', '.', '(', ')', 'ฉ', 'ฮ', 'ฺ', '์', '?', 'ฒ', 'ฬ', 'ฦ', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '=', 'q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', '[', ']', '\\', 'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';', "'", 'z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '/', '!', '@', '#', '$', '%', '^', '&', '*', '(', ')', '_', '+', 'Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P', '{', '}', '|', 'A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', ':', '"', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', '<', '>', '?']
    let newStr = ''
    for (let i = 0; i < str.length; i++) {
      const char = str.charAt(i)
      if (char !== ' ') {
        const indexFrom = charFrom.indexOf(char)
        if (indexFrom !== -1) {
          newStr += charTo[indexFrom]
        }
      } else {
        newStr += ' '
      }
    }
    return newStr
  })
  inject('findSome', (search, item) => {
    if (search && item) {
      return search.toString().toLowerCase().split(' ').some(ele => item.toString().toLowerCase().includes(ele) || app.$charSwitch(item).toString().toLowerCase().includes(ele))
    }
    return false
  })
  inject('capitalize', (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1)
  })
  inject('randomNumber', (min, max) => {
    return Math.floor(Math.random() * (max - min + 1) + min)
  })
  inject('formatBytes', (bytes, decimals = 2) => {
    if (bytes === 0) { return '0 Bytes' }
    const k = 1024
    const dm = decimals < 0 ? 0 : decimals
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
  })
  inject('abbreviateNumber', (value) => {
    let newValue = value
    if (value >= 1000) {
      const suffixes = ['', 'k', 'm', 'b', 't']
      const suffixNum = Math.floor(('' + value).length / 3)
      let shortValue = ''
      for (let precision = 2; precision >= 1; precision--) {
        shortValue = parseFloat((suffixNum !== 0 ? (value / Math.pow(1000, suffixNum)) : value).toPrecision(precision))
        const dotLessShortValue = (shortValue + '').replace(/[^a-zA-Z 0-9]+/g, '')
        if (dotLessShortValue.length <= 2) { break }
      }
      if (shortValue % 1 !== 0) { shortValue = shortValue.toFixed(1) }
      newValue = shortValue + suffixes[suffixNum]
    }
    return newValue
  })
  inject('ckConfig', (uploadConfig = null) => {
    const config = {
      toolbar: [
        'undo',
        'redo',
        '|',
        'heading',
        '|',
        'alignment',
        '|',
        'fontFamily',
        'fontSize',
        'fontColor',
        'fontBackgroundColor',
        'bold',
        'italic',
        'underline',
        '|',
        'bulletedList',
        'numberedList',
        '|',
        'horizontalLine',
        'blockQuote',
        'link',
        'insertTable'
      ],
      removePlugins: ['Title'],
      link: {
        addTargetToExternalLinks: true
      },
      mediaEmbed: {
        previewsInData: true
      },
      image: {
        styles: [
          'alignLeft', 'alignCenter', 'alignRight'
        ],
        resizeOptions: [
          {
            name: 'resizeImage:original',
            value: null,
            icon: 'original'
          },
          {
            name: 'resizeImage:50',
            value: '50',
            icon: 'medium'
          },
          {
            name: 'resizeImage:75',
            value: '75',
            icon: 'large'
          }
        ],
        toolbar: [
          '|',
          'imageStyle:alignLeft', 'imageStyle:alignCenter', 'imageStyle:alignRight',
          '|',
          'resizeImage:50',
          'resizeImage:75',
          'resizeImage:original',
          '|',
          'linkImage'
        ]
      },
      simpleUpload: uploadConfig
    }
    if (uploadConfig) {
      config.simpleUpload = uploadConfig
      config.toolbar.push('uploadImage')
    }
    config.toolbar.push('mediaEmbed')
    return config
  })
  inject('ckBasicConfig', (uploadConfig = null) => {
    const config = {
      toolbar: [
        'undo',
        'redo',
        '|',
        'bold',
        'italic',
        'underline',
        '|',
        'bulletedList',
        'numberedList',
        '|',
        'blockQuote',
        'link'
      ],
      removePlugins: ['Title'],
      link: {
        addTargetToExternalLinks: true
      },
      mediaEmbed: {
        previewsInData: true
      },
      image: {
        styles: [
          'alignLeft', 'alignCenter', 'alignRight'
        ],
        resizeOptions: [
          {
            name: 'resizeImage:original',
            value: null,
            icon: 'original'
          },
          {
            name: 'resizeImage:50',
            value: '50',
            icon: 'medium'
          },
          {
            name: 'resizeImage:75',
            value: '75',
            icon: 'large'
          }
        ],
        toolbar: [
          '|',
          'imageStyle:alignLeft', 'imageStyle:alignCenter', 'imageStyle:alignRight',
          '|',
          'resizeImage:50',
          'resizeImage:75',
          'resizeImage:original',
          '|',
          'linkImage'
        ]
      },
      simpleUpload: uploadConfig
    }
    if (uploadConfig) {
      config.simpleUpload = uploadConfig
      config.toolbar.push('uploadImage')
    }
    config.toolbar.push('mediaEmbed')
    return config
  })
}
