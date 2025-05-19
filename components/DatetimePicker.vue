<template>
  <div>
    <v-menu
      ref="menu"
      v-model="menu"
      :close-on-content-click="false"
      min-width="290px"
      nudge-bottom="-25"
      offset-y
    >
      <template #activator="{ on, attrs }">
        <v-text-field
          :value="dateText"
          :outlined="outlined"
          :solo="solo"
          :filled="filled"
          :flat="flat"
          readonly
          :rules="rules"
          v-bind="attrs"
          :class="contentClass"
          :placeholder="placeholder"
          :dense="dense"
          :hint="hint"
          :persistent-hint="persistentHint"
          :clearable="clearable"
          required
          :hide-details="hideDetails"
          v-on="on"
          @focus="focusField"
          @click:clear="clearData"
        >
          <template v-if="label" #label>
            <template v-if="required">
              <span class="font-weight-bold">
                {{ label }}
              </span>
              <v-icon color="red" x-small class="mt-n4">
                mdi-asterisk
              </v-icon>
            </template>
            <template v-else>
              {{ label }}
            </template>
          </template>
          <template #prepend-inner>
            <v-icon :small="dense" :class="dense ? 'mt-1 mr-1': 'mr-1'">
              {{ prependIcon ? prependIcon : (dateOnly ? 'mdi-calendar' : 'mdi-calendar-clock') }}
            </v-icon>
          </template>
        </v-text-field>
      </template>
      <v-date-picker
        v-model="date"
        :active-picker.sync="activePicker"
        :max="max"
        :min="min"
        :no-title="noTitle"
        :locale="setLang"
        @input="saveDate"
      >
        <div v-if="(date && !dateOnly) || !hideNow" class="w-100">
          <v-divider />
          <div class="d-flex justify-center align-center pt-2">
            <v-btn
              v-if="!hideNow"
              outlined
              small
              color="info"
              class="px-0"
              @click="now"
            >
              {{ dateOnly ? $t('TODAY') : $t('NOW') }}
            </v-btn>
            <v-spacer v-if="date && !dateOnly && !hideNow" />
            <div v-if="date && !dateOnly" class="d-flex align-center justify-center">
              <v-icon color="" left>
                mdi-clock-time-{{ timeText[hour % 12] }}-outline
              </v-icon>
              <v-autocomplete
                v-model="hour"
                :items="$_.range(24).map(ele => $_.padStart(ele, 2, '0'))"
                append-icon=""
                hide-details
                solo
                flat
                class="mt-0 text-center time-select"
                dense
              />
              <p class="title mb-0">
                :
              </p>
              <v-autocomplete
                v-model="minute"
                :items="$_.range(0,60,stepMinute).map(ele => $_.padStart(ele, 2, '0'))"
                append-icon=""
                hide-details
                solo
                flat
                class="mt-0 text-center time-select"
                dense
              />
              <p v-if="useSeconds" class="title mb-0">
                :
              </p>
              <v-autocomplete
                v-if="useSeconds"
                v-model="seconds"
                :items="$_.range(0,60,stepSeconds).map(ele => $_.padStart(ele, 2, '0'))"
                append-icon=""
                hide-details
                solo
                flat
                class="mt-0 text-center time-select"
                dense
              />
            </div>
          </div>
        </div>
      </v-date-picker>
    </v-menu>
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: String,
      default: null
    },
    label: {
      type: String,
      default: null
    },
    prependIcon: {
      type: String,
      default: ''
    },
    contentClass: {
      type: String,
      default: ''
    },
    rules: {
      type: Array,
      default: Array
    },
    min: {
      type: String,
      default: undefined
    },
    max: {
      type: String,
      default: undefined
    },
    placeholder: {
      type: String,
      default: ''
    },
    formatDateText: {
      type: String,
      default: 'long'
    },
    formatTimeText: {
      type: String,
      default: ''
    },
    hint: {
      type: String,
      default: ''
    },
    persistentHint: {
      type: Boolean,
      default: false
    },
    outlined: {
      type: Boolean,
      default: false
    },
    solo: {
      type: Boolean,
      default: false
    },
    filled: {
      type: Boolean,
      default: false
    },
    flat: {
      type: Boolean,
      default: false
    },
    dense: {
      type: Boolean,
      default: false
    },
    clearable: {
      type: Boolean,
      default: false
    },
    hideDetails: {
      type: Boolean,
      default: false
    },
    required: {
      type: Boolean,
      default: false
    },
    useSeconds: {
      type: Boolean,
      default: false
    },
    noTitle: {
      type: Boolean,
      default: false
    },
    dateOnly: {
      type: Boolean,
      default: false
    },
    hideNow: {
      type: Boolean,
      default: false
    },
    lang: {
      type: String,
      default: ''
    },
    stepMinute: {
      type: Number,
      default: 1
    },
    stepSeconds: {
      type: Number,
      default: 1
    }
  },
  data () {
    return {
      activePicker: null,
      menu: false,
      timeText: ['twelve', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven']
    }
  },
  computed: {
    dateText () {
      return this.value ? this.$dateText(this.value, this.formatDateText, (!this.dateOnly ? (this.formatTimeText ? this.formatTimeText : (this.useSeconds ? 'long' : 'medium')) : null), (this.lang ? this.lang.substring(0, 2) : null)) : ''
    },
    splitDatetime () {
      if (this.dateOnly) {
        return this.value ? this.$dayjs(this.value).format('YYYY-MM-DD').split(' ') : null
      } else {
        return this.value ? this.$dayjs(this.value).format('YYYY-MM-DD HH:mm:ss').split(' ') : null
      }
    },
    setLang () {
      return this.lang ? this.lang : this.$lang.getIso()
    },
    date: {
      get () {
        if (this.value && this.splitDatetime && this.splitDatetime[0]) {
          return this.splitDatetime[0]
        }
        return null
      },
      set (val) {
        this.saveDate(val)
      }
    },
    hour: {
      get () {
        if (this.value && this.splitDatetime && this.splitDatetime[1]) {
          const splitTime = this.splitDatetime[1].split(':')
          return splitTime[0]
        } else {
          return '00'
        }
      },
      set (val) {
        this.saveHour(val)
      }
    },
    minute: {
      get () {
        if (this.value && this.splitDatetime && this.splitDatetime[1]) {
          const splitTime = this.splitDatetime[1].split(':')
          return splitTime[1]
        } else {
          return '00'
        }
      },
      set (val) {
        this.saveMinute(val)
      }
    },
    seconds: {
      get () {
        if (this.value && this.splitDatetime && this.splitDatetime[1]) {
          const splitTime = this.splitDatetime[1].split(':')
          return splitTime[2]
        } else {
          return '00'
        }
      },
      set (val) {
        this.saveSeconds(val)
      }
    }
  },
  // watch: {
  //   menu (val) {
  //     val && this.$nextTick(() => (this.activePicker = this.date ? 'DATE' : 'YEAR'))
  //   }
  // },
  methods: {
    focusField () {
      setTimeout(() => {
        this.menu = true
      }, 300)
    },
    clearData () {
      this.$emit('input', null)
      this.$emit('clear')
    },
    now () {
      if (this.dateOnly) {
        this.$emit('input', this.$dayjs().format('YYYY-MM-DD'))
        this.$emit('change', this.$dayjs().format('YYYY-MM-DD'))
        this.menu = false
      } else {
        this.$emit('input', this.$dayjs().format('YYYY-MM-DD HH:mm:ss'))
        this.$emit('change', this.$dayjs().format('YYYY-MM-DD HH:mm:ss'))
        this.menu = false
      }
    },
    saveDate (val) {
      if (this.dateOnly) {
        this.$emit('input', this.$dayjs(val).format('YYYY-MM-DD 00:00:00'))
        this.$emit('change', this.$dayjs(val).format('YYYY-MM-DD 00:00:00'))
        this.menu = false
      } else {
        this.$emit('input', `${val} ${this.hour || '00'}:${this.minute || '00'}:${this.seconds || '00'}`)
        this.$emit('change', `${val} ${this.hour || '00'}:${this.minute || '00'}:${this.seconds || '00'}`)
      }
    },
    saveHour (val) {
      this.$emit('input', `${this.date} ${val}:${this.minute}:${this.seconds}`)
      this.$emit('change', `${this.date} ${val}:${this.minute}:${this.seconds}`)
    },
    saveMinute (val) {
      this.$emit('input', `${this.date} ${this.hour}:${val}:${this.seconds}`)
      this.$emit('change', `${this.date} ${this.hour}:${val}:${this.seconds}`)
    },
    saveSeconds (val) {
      this.$emit('input', `${this.date} ${this.hour}:${this.minute}:${val}`)
      this.$emit('change', `${this.date} ${this.hour}:${this.minute}:${val}`)
    }
  }
}
</script>

<style lang="scss" scoped>
.time-select{
  min-width: 50px;
  max-width: 50px;
}
</style>
