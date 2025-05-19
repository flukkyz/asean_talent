<template>
  <div
    class="zoom-on-hover"
    :class="{zoomed}"
    @touchstart="touchzoom"
    @mousemove="move"
    @mouseenter="zoom"
    @mouseleave="unzoom"
  >
    <img ref="normal" class="normal" :style="height ? `max-height: ${height}px` : ''" :src="imgNormal">
    <img ref="zoom" class="zoom" :src="imgZoom || imgNormal">
  </div>
</template>

<script>
export default {
  props: {
    imgNormal: {
      type: String,
      default: '',
      require: true
    },
    imgZoom: {
      type: String,
      default: ''
    },
    scale: {
      type: Number,
      default: 1
    },
    height: {
      type: Number,
      default: null
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      resizeCheckInterval: null,
      zoomed: false
    }
  },
  mounted () {
    if (this.$props.scale) {
      this.$refs.zoom.style.transform = 'scale(' + this.scale + ')'
    }
    this.initEventLoaded()
    this.initEventResized()
  },
  updated () {
    this.initEventLoaded()
  },
  beforeDestroy () {
    this.resizeCheckInterval && clearInterval(this.resizeCheckInterval)
  },
  methods: {
    pageOffset (el) {
      const rect = el.getBoundingClientRect()
      const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop
      return {
        y: rect.top + scrollTop,
        x: rect.left + scrollLeft
      }
    },
    touchzoom (event) {
      if (this.disabled) { return }
      this.move(event)
      this.zoomed = !this.zoomed
    },
    zoom () {
      if (!this.disabled) { this.zoomed = true }
    },
    unzoom () {
      if (!this.disabled) { this.zoomed = false }
    },
    move (event) {
      if (this.disabled || !this.zoomed) { return }
      const offset = this.pageOffset(this.$el)
      const zoom = this.$refs.zoom
      const normal = this.$refs.normal
      const relativeX = event.clientX - offset.x + window.pageXOffset
      const relativeY = event.clientY - offset.y + window.pageYOffset
      const normalFactorX = relativeX / normal.offsetWidth
      const normalFactorY = relativeY / normal.offsetHeight
      const x = normalFactorX * (zoom.offsetWidth * this.scale - normal.offsetWidth)
      const y = normalFactorY * (zoom.offsetHeight * this.scale - normal.offsetHeight)
      zoom.style.left = -x + 'px'
      zoom.style.top = -y + 'px'
    },
    initEventLoaded () {
      // emit the "loaded" event if all images have been loaded
      const promises = [this.$refs.zoom, this.$refs.normal].map(function (image) {
        return new Promise(function (resolve, reject) {
          image.addEventListener('load', resolve)
          image.addEventListener('error', reject)
        })
      })
      const component = this
      Promise.all(promises).then(function () {
        component.$emit('loaded')
      })
    },
    initEventResized () {
      const normal = this.$refs.normal
      let previousWidth = normal.offsetWidth
      let previousHeight = normal.offsetHeight
      const component = this
      this.resizeCheckInterval = setInterval(function () {
        if ((previousWidth !== normal.offsetWidth) || (previousHeight !== normal.offsetHeight)) {
          previousWidth = normal.offsetWidth
          previousHeight = normal.offsetHeight
          component.$emit('resized', {
            width: normal.width,
            height: normal.height,
            fullWidth: normal.naturalWidth,
            fullHeight: normal.naturalHeight
          })
        }
      }, 1000)
    }
  }
}
</script>

<style lang="scss" scoped>
.zoom-on-hover {
  position: relative;
  overflow: hidden;
}
.zoom-on-hover .normal {
  width: 100%;
}
.zoom-on-hover .zoom {
  position: absolute;
  opacity: 0;
  transform-origin: top left;
}
.zoom-on-hover.zoomed .zoom {
  opacity: 1;
}
.zoom-on-hover.zoomed .normal {
  opacity: 0;
}
</style>
