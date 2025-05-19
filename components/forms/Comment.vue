<template>
  <v-form v-if="!hideForm" ref="form" v-model="valid" :disabled="saving" @submit.prevent="save">
    <client-only placeholder="Loading...">
      <p class="mb-1">
        {{ replyId ? 'Your reply comment' : (mode === 'add' ? 'Your comment' : 'Edit comment') }}
      </p>
      <ck-editor
        v-model="form.comment"
        :config="$ckBasicConfig(uploadConfig)"
      />
      <v-input v-model="form.comment" :rules="rules.comment" />
    </client-only>
    <div class="d-flex justify-end">
      <slot />
      <v-btn
        type="submit"
        :large="!smallSubmit"
        :small="smallSubmit"
        class="rounded-lg white--text px-4"
        :disabled="saving || !valid"
        color="themeAccent"
        :loading="saving"
      >
        {{ replyId ? 'Reply Comment' : (mode === 'add' ? 'Send Comment' : 'Edit') }}
      </v-btn>
    </div>
  </v-form>
</template>

<script>

export default {
  props: {
    forum: {
      type: Object,
      default: null
    },
    value: {
      type: String,
      default: null
    },
    replyId: {
      type: Number,
      default: null
    },
    smallSubmit: {
      type: Boolean,
      default: false
    },
    hideForm: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      modelName: 'Forum',
      uploadConfig: {
        uploadUrl: `${process.env.apiUrl}${process.env.apiDirectory}upload-img-member`,
        headers: {
          Authorization: this.$auth.strategy.token.get()
        }
      },
      mode: 'add',
      valid: true,
      saving: false,
      imgPreview: null,
      tags: [],
      rules: {
        comment: [
          v => !!v || 'Comment is required'
        ]
      },
      form: {}
    }
  },
  created () {
    this.$bus.$on(`open-comment-form${(this.value ? `-${this.value}` : '')}`, (data) => {
      this.saving = false
      this.clearData()
      this.mode = 'add'
      if (data) {
        this.mode = 'edit'
        this.form = {
          ...this.form,
          ...data
        }
      }
      setTimeout(() => {
        if (this.$refs.form) {
          this.$refs.form.resetValidation()
        }
      })
      this.$overlay.hide()
    })
    this.$bus.$on(`clear-comment-form${(this.value ? `-${this.value}` : '')}`, (data) => {
      this.saving = false
      this.mode = 'add'
      this.clearData()
      setTimeout(() => {
        if (this.$refs.form) {
          this.$refs.form.resetValidation()
        }
      })
      this.$overlay.hide()
    })
  },
  beforeDestroy () {
    this.$bus.$off(`open-comment-form${(this.value ? `-${this.value}` : '')}`)
    this.$bus.$off(`clear-comment-form${(this.value ? `-${this.value}` : '')}`)
  },
  methods: {
    clearData () {
      this.form = {
        comment: '',
        forum_id: this.forum.id,
        reply_id: this.replyId
      }
    },
    save () {
      if (this.$refs.form.validate()) {
        this.saving = true
        setTimeout(() => {
          this.$emit(this.mode, this.form, (this.replyId ? 'reply' : this.mode))
        }, 500)
      }
    }
  }
}
</script>
