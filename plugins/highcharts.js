import Vue from 'vue'
import Highcharts from 'highcharts'
import Maps from 'highcharts/modules/map'
import Wordcloud from 'highcharts/modules/wordcloud'
import NetworkGraph from 'highcharts/modules/networkgraph'
import mapData from '@highcharts/map-collection/custom/world-highres.geo.json'
import HighchartsVue from 'highcharts-vue'

if (typeof Highcharts === 'object') {
  Wordcloud(Highcharts)
  NetworkGraph(Highcharts)
  Maps(Highcharts)
  Highcharts.maps.world = mapData

  Highcharts.addEvent(
    Highcharts.Series,
    'afterSetOptions',
    function (e) {
      const colors = []
      for (let index = 0; index < 100; index++) {
        const letters = '0123456789ABCDEF'
        let color = '#'
        for (let i = 0; i < 6; i++) {
          color += letters[Math.floor(Math.random() * 16)]
        }
        colors.push(color)
      }

      const nodeCounts = {}
      if (this instanceof Highcharts.seriesTypes.networkgraph) {
      // count connections for each From or To node
        e.options.data.forEach(function (link) {
          nodeCounts[link[0]] = (nodeCounts[link[0]] || 0) + 1
          nodeCounts[link[1]] = (nodeCounts[link[1]] || 0) + 1
        })

        const radiusFactor = 3 // radius multiplier to graphically enlarge nodes

        // map each nodeCount to a node object setting the radius
        e.options.nodes = Object.keys(nodeCounts).map(function (id) {
          const newColor = colors[nodeCounts[id]]
          return {
            id,
            marker: { radius: nodeCounts[id] * radiusFactor },
            color: newColor
          }
        })
      }
    }
  )
}

Highcharts.setOptions({
  lang: {
    decimalPoint: '.',
    thousandsSep: ','
  }
})

Vue.use(HighchartsVue)
