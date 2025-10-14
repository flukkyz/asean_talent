<template>
  <div class="">
    <div class="hero-image" style="height: 96px;">
      <v-container fluid :class="['d-flex align-center h-100',['xs', 'sm'].includes($vuetify.breakpoint.name) ? 'flex-column justify-center' : 'justify-space-between px-5']">
        <h1 :class="['font-weight-bold',['xs', 'sm'].includes($vuetify.breakpoint.name) ? 'headline' : 'display-1']">
          Settings
        </h1>
      </v-container>
    </div>
    <div v-if="profile" class="pt-8 pb-16">
      <v-container fluid class="px-5">
        <div :class="['d-flex',['xs', 'sm'].includes($vuetify.breakpoint.name) ? 'flex-column' : 'justify-space-between align-start']">
          <div class="mr-3">
            <p class="title mb-0 font-weight-bold">
              Profile info
            </p>
            <p class="mb-0 grey--text">
              Update your profile and other info.
            </p>
          </div>
          <div v-if="editing" :class="['d-flex align-center',['xs', 'sm'].includes($vuetify.breakpoint.name) ? 'flex-column justify-center mt-3' : 'justify-space-between']">
            <v-btn
              large
              class="rounded-lg"
              :class="['xs', 'sm'].includes($vuetify.breakpoint.name) ? 'mt-3 order-last' : 'mr-3'"
              :disabled="saving"
              outlined
              :block="['xs', 'sm'].includes($vuetify.breakpoint.name)"
              color="themeAccent"
              :loading="saving"
              @click="cancelEditing"
            >
              <v-icon small left>
                fas fa-times
              </v-icon>
              Cancel
            </v-btn>
            <v-btn
              large
              :block="['xs', 'sm'].includes($vuetify.breakpoint.name)"
              class="rounded-lg white--text"
              :disabled="saving || !valid"
              color="themeAccent"
              :loading="saving"
              @click="saveProfile"
            >
              <v-icon small left>
                fas fa-check
              </v-icon>
              Update Profile
            </v-btn>
          </div>
          <div v-else :class="['d-flex align-center',['xs', 'sm'].includes($vuetify.breakpoint.name) ? 'flex-column justify-center mt-3' : 'justify-space-between']">
            <v-btn
              large
              class="rounded-lg"
              :class="['xs', 'sm'].includes($vuetify.breakpoint.name) ? 'mt-3 order-last' : 'mr-3'"
              outlined
              :block="['xs', 'sm'].includes($vuetify.breakpoint.name)"
              color="themeAccent"
              @click="$bus.$emit('open-change-password-form')"
            >
              <v-icon small left>
                fas fa-lock
              </v-icon>

              {{ !!profile.password_created_at ? $t('CHANGE_PASSWORD') : $t('CREATE_PASSWORD') }}
            </v-btn>
            <v-btn
              large
              dark
              depressed
              type="button"
              :block="['xs', 'sm'].includes($vuetify.breakpoint.name)"
              color="themeAccent"
              class="rounded-lg"
              @click="onEditing"
            >
              <v-icon small left>
                fas fa-edit
              </v-icon>

              Edit Profile
            </v-btn>
          </div>
        </div>
        <v-form ref="form" v-model="valid" :disabled="saving">
          <div v-if="profile.member_type === 'researcher'">
            <v-divider class="my-5" />
            <div :class="['d-flex ',['xs', 'sm'].includes($vuetify.breakpoint.name) ? 'flex-column' : 'justify-space-between']">
              <div :class="['flex-shrink-0',['xs', 'sm'].includes($vuetify.breakpoint.name) ? 'mb-5' : 'w-30 mr-5']">
                <p class="mb-0 font-weight-bold">
                  Personal
                </p>
                <p class="mb-0 grey--text caption">
                  Update your photo and personal details.
                </p>
              </div>
              <div class="flex-grow-1">
                <div :class="['d-flex align-baseline mb-3',['xs', 'sm'].includes($vuetify.breakpoint.name) ? 'flex-column' : '']">
                  <p :class="['mb-0 flex-shrink-0',['xs', 'sm'].includes($vuetify.breakpoint.name) ? '' : 'w-40']">
                    E-mail
                  </p>
                  <p class="mb-0 font-weight-bold body-1 flex-grow-1">
                    {{ profile.email }}
                  </p>
                </div>
                <div :class="['d-flex align-baseline mb-3',['xs', 'sm'].includes($vuetify.breakpoint.name) ? 'flex-column' : '']">
                  <p :class="['flex-shrink-0', ['xs', 'sm'].includes($vuetify.breakpoint.name) && editing ? 'mb-2' : 'mb-0 w-40']">
                    Full name
                  </p>
                  <div v-if="editing" :class="['flex-grow-1',['xs', 'sm'].includes($vuetify.breakpoint.name) ? 'w-100' : '']">
                    <v-combobox
                      v-model="form.title"
                      label="Academic Title"
                      outlined
                      class="rounded-lg"
                      :items="academicTitles"
                      clearable
                      dense
                    />
                    <v-text-field
                      v-model="form.firstname"
                      outlined
                      class="rounded-lg"
                      :rules="rules.firstname"
                      dense
                      required
                    >
                      <template #label>
                        {{ $t('FIRSTNAME') }}
                        <v-icon color="error" x-small class="mt-n3">
                          mdi-asterisk
                        </v-icon>
                      </template>
                    </v-text-field>
                    <v-text-field
                      v-model="form.middlename"
                      outlined
                      class="rounded-lg"
                      label="Middlename"
                      dense
                    />
                    <v-text-field
                      v-model="form.lastname"
                      outlined
                      class="rounded-lg"
                      :rules="rules.lastname"
                      dense
                      required
                    >
                      <template #label>
                        {{ $t('LASTNAME') }}
                        <v-icon color="error" x-small class="mt-n3">
                          mdi-asterisk
                        </v-icon>
                      </template>
                    </v-text-field>
                  </div>
                  <p v-else class="mb-0 font-weight-bold flex-grow-1">
                    {{ profile.Researcher.lastname }},
                    {{ profile.Researcher.firstname }}
                    {{ profile.Researcher.middlename || '' }}
                    <span v-if="profile.Researcher.title && profile.Researcher.title !== 'Unspecified'">
                      ({{ profile.Researcher.title }})
                    </span>
                  </p>
                </div>
                <div :class="['d-flex align-baseline mb-3',['xs', 'sm'].includes($vuetify.breakpoint.name) ? 'flex-column' : '']">
                  <p :class="['mb-0 flex-shrink-0',['xs', 'sm'].includes($vuetify.breakpoint.name) ? '' : 'w-40']">
                    Gender
                  </p>
                  <div v-if="editing" :class="['flex-grow-1',['xs', 'sm'].includes($vuetify.breakpoint.name) ? 'w-100' : '']">
                    <v-radio-group
                      v-model="form.gender"
                      row
                      class="mt-0 mb-3"
                      :rules="rules.gender"
                      required
                    >
                      <v-radio
                        v-for="value in ['Male', 'Female','Unspecified']"
                        :key="value"
                        :label="value"
                        :value="value"
                      />
                    </v-radio-group>
                  </div>
                  <p v-else class="mb-0 font-weight-bold flex-grow-1">
                    {{ profile.Researcher.gender }}
                  </p>
                </div>
                <div :class="['d-flex align-start mb-3',['xs', 'sm'].includes($vuetify.breakpoint.name) ? 'flex-column' : '']">
                  <p :class="['flex-shrink-0',['xs', 'sm'].includes($vuetify.breakpoint.name) ? 'mb-5' : 'mb-0 w-40']">
                    Display photo
                  </p>
                  <v-avatar :size="['xs', 'sm'].includes($vuetify.breakpoint.name) ? '200' : '64'" :class="['shadow',['xs', 'sm'].includes($vuetify.breakpoint.name) ? 'mx-auto' : '']">
                    <v-img v-if="imgPreview" :src="imgPreview" />
                    <v-img v-else-if="profile.avatar" :src="profile.avatar" />
                    <v-img v-else src="/images/logo.png" />
                  </v-avatar>
                  <div v-if="editing" :class="['flex-grow-1 align-self-center',['xs', 'sm'].includes($vuetify.breakpoint.name) ? 'mt-5' : 'ml-5']">
                    <v-btn
                      x-small
                      plain
                      color="info"
                      depressed
                      @click="selectFile"
                    >
                      {{ $t('CHANGE',{text: $t('IMAGE')}) }}
                    </v-btn>
                    <v-btn
                      v-if="imgPreview"
                      class="ml-2"
                      x-small
                      depressed
                      color=" "
                      @click="saveChangeImage"
                    >
                      Upload
                    </v-btn>
                    <v-btn
                      v-if="imgPreview"
                      class="ml-2"
                      x-small
                      depressed
                      color="error"
                      @click="cancelChangeImage"
                    >
                      {{ $t('CANCEL') }}
                    </v-btn>
                  </div>
                </div>
              </div>
            </div>
            <v-divider class="my-5" />
            <div :class="['d-flex ',['xs', 'sm'].includes($vuetify.breakpoint.name) ? 'flex-column' : 'justify-space-between']">
              <div :class="['flex-shrink-0',['xs', 'sm'].includes($vuetify.breakpoint.name) ? 'mb-5' : 'w-30 mr-5']">
                <p class="mb-0 font-weight-bold">
                  Profile
                </p>
                <p class="mb-0 grey--text caption">
                  Update your profile.
                </p>
              </div>
              <div class="flex-grow-1">
                <div :class="['d-flex align-baseline mb-3',['xs', 'sm'].includes($vuetify.breakpoint.name) ? 'flex-column' : '']">
                  <p :class="['mb-0 flex-shrink-0',['xs', 'sm'].includes($vuetify.breakpoint.name) ? '' : 'w-40']">
                    Department
                    <v-icon v-if="editing" color="error" x-small class="mt-n3">
                      mdi-asterisk
                    </v-icon>
                  </p>
                  <div v-if="editing" :class="['flex-grow-1',['xs', 'sm'].includes($vuetify.breakpoint.name) ? 'w-100' : '']">
                    <v-text-field
                      v-model="form.department"
                      outlined
                      class="rounded-lg"
                      :rules="rules.department"
                      dense
                      required
                    />
                  </div>
                  <p v-else class="mb-0 font-weight-bold flex-grow-1">
                    {{ profile.Researcher.department }}
                  </p>
                </div>
                <div :class="['d-flex align-baseline mb-3',['xs', 'sm'].includes($vuetify.breakpoint.name) ? 'flex-column' : '']">
                  <p :class="['mb-0 flex-shrink-0',['xs', 'sm'].includes($vuetify.breakpoint.name) ? '' : 'w-40']">
                    Organization
                    <v-icon v-if="editing" color="error" x-small class="mt-n3">
                      mdi-asterisk
                    </v-icon>
                  </p>
                  <div v-if="editing" :class="['flex-grow-1',['xs', 'sm'].includes($vuetify.breakpoint.name) ? 'w-100' : '']">
                    <v-text-field
                      v-model="form.organization"
                      outlined
                      class="rounded-lg"
                      :rules="rules.organization"
                      dense
                      required
                    />
                  </div>
                  <p v-else class="mb-0 font-weight-bold flex-grow-1">
                    {{ profile.Researcher.organization }}
                  </p>
                </div>
                <div :class="['d-flex align-baseline mb-3',['xs', 'sm'].includes($vuetify.breakpoint.name) ? 'flex-column' : '']">
                  <p :class="['mb-0 flex-shrink-0',['xs', 'sm'].includes($vuetify.breakpoint.name) ? '' : 'w-40']">
                    Religion
                  </p>
                  <div v-if="editing" :class="['flex-grow-1',['xs', 'sm'].includes($vuetify.breakpoint.name) ? 'w-100' : '']">
                    <v-combobox
                      v-model="form.religion"
                      outlined
                      class="rounded-lg"
                      placeholder="Select your religion"
                      :items="religions"
                      clearable
                      dense
                    />
                  </div>
                  <p v-else class="mb-0 font-weight-bold flex-grow-1">
                    {{ profile.Researcher.religion || '-' }}
                  </p>
                </div>
                <div :class="['d-flex align-baseline mb-3',['xs', 'sm'].includes($vuetify.breakpoint.name) ? 'flex-column' : '']">
                  <p :class="['mb-0 flex-shrink-0',['xs', 'sm'].includes($vuetify.breakpoint.name) ? '' : 'w-40']">
                    Phone number
                  </p>
                  <div v-if="editing" :class="['flex-grow-1',['xs', 'sm'].includes($vuetify.breakpoint.name) ? 'w-100' : '']">
                    <v-text-field
                      v-model="form.phone_number"
                      placeholder="Input your phone number"
                      outlined
                      class="rounded-lg"
                      dense
                    />
                  </div>
                  <p v-else class="mb-0 font-weight-bold flex-grow-1">
                    {{ profile.Researcher.phone_number || '-' }}
                  </p>
                </div>
                <div :class="['d-flex align-baseline mb-3',['xs', 'sm'].includes($vuetify.breakpoint.name) ? 'flex-column' : '']">
                  <p :class="['mb-0 flex-shrink-0',['xs', 'sm'].includes($vuetify.breakpoint.name) ? '' : 'w-40']">
                    Address
                  </p>
                  <div v-if="editing" :class="['flex-grow-1',['xs', 'sm'].includes($vuetify.breakpoint.name) ? 'w-100' : '']">
                    <v-textarea
                      v-model="form.address"
                      placeholder="Input your address"
                      rows="3"
                      outlined
                      class="rounded-lg"
                      dense
                    />
                  </div>
                  <p v-else class="mb-0 font-weight-bold flex-grow-1">
                    {{ profile.Researcher.address || '-' }}
                  </p>
                </div>
                <div :class="['d-flex align-baseline mb-3',['xs', 'sm'].includes($vuetify.breakpoint.name) ? 'flex-column' : '']">
                  <p :class="['mb-0 flex-shrink-0',['xs', 'sm'].includes($vuetify.breakpoint.name) ? '' : 'w-40']">
                    City
                  </p>
                  <div v-if="editing" :class="['flex-grow-1',['xs', 'sm'].includes($vuetify.breakpoint.name) ? 'w-100' : '']">
                    <v-text-field
                      v-model="form.city"
                      placeholder="Input your city"
                      outlined
                      class="rounded-lg"
                      dense
                    />
                  </div>
                  <p v-else class="mb-0 font-weight-bold flex-grow-1">
                    {{ profile.Researcher.city || '-' }}
                  </p>
                </div>
                <div :class="['d-flex align-baseline mb-3',['xs', 'sm'].includes($vuetify.breakpoint.name) ? 'flex-column' : '']">
                  <p :class="['mb-0 flex-shrink-0',['xs', 'sm'].includes($vuetify.breakpoint.name) ? '' : 'w-40']">
                    Country
                    <v-icon v-if="editing" color="error" x-small class="mt-n3">
                      mdi-asterisk
                    </v-icon>
                  </p>
                  <div v-if="editing" :class="['flex-grow-1',['xs', 'sm'].includes($vuetify.breakpoint.name) ? 'w-100' : '']">
                    <v-autocomplete
                      v-model="form.country_id"
                      :items="countries"
                      item-value="id"
                      item-text="name"
                      outlined
                      class="rounded-lg"
                      dense
                      :rules="rules.country"
                    />
                  </div>
                  <p v-else class="mb-0 font-weight-bold flex-grow-1">
                    {{ profile.Researcher.Country.name || '-' }}
                  </p>
                </div>
              </div>
            </div>
            <v-divider class="my-5" />
            <div :class="['d-flex ',['xs', 'sm'].includes($vuetify.breakpoint.name) ? 'flex-column' : 'justify-space-between']">
              <div :class="['flex-shrink-0',['xs', 'sm'].includes($vuetify.breakpoint.name) ? 'mb-5' : 'w-30 mr-5']">
                <p class="mb-0 font-weight-bold">
                  Education Info
                </p>
                <p class="mb-0 grey--text caption">
                  Update your education experience.
                </p>
              </div>
              <div class="flex-grow-1">
                <div :class="['d-flex align-baseline mb-3',['xs', 'sm'].includes($vuetify.breakpoint.name) ? 'flex-column' : '']">
                  <p :class="['mb-0 flex-shrink-0',['xs', 'sm'].includes($vuetify.breakpoint.name) ? '' : 'w-40']">
                    Graduate (Top-Level)
                    <v-icon v-if="editing" color="error" x-small class="mt-n3">
                      mdi-asterisk
                    </v-icon>
                  </p>
                  <div v-if="editing" :class="['flex-grow-1',['xs', 'sm'].includes($vuetify.breakpoint.name) ? 'w-100' : '']">
                    <v-combobox
                      v-model="form.graduate"
                      outlined
                      class="rounded-lg"
                      :items="degrees"
                      dense
                      required
                    />
                  </div>
                  <p v-else class="mb-0 font-weight-bold flex-grow-1">
                    {{ profile.Researcher.graduate }}
                  </p>
                </div>
                <div :class="['d-flex align-baseline mb-3',['xs', 'sm'].includes($vuetify.breakpoint.name) ? 'flex-column' : '']">
                  <p :class="['mb-0 flex-shrink-0',['xs', 'sm'].includes($vuetify.breakpoint.name) ? '' : 'w-40']">
                    Graduate Country
                    <v-icon v-if="editing" color="error" x-small class="mt-n3">
                      mdi-asterisk
                    </v-icon>
                  </p>
                  <div v-if="editing" :class="['flex-grow-1',['xs', 'sm'].includes($vuetify.breakpoint.name) ? 'w-100' : '']">
                    <v-autocomplete
                      v-model="form.graduate_country_id"
                      :items="countries"
                      item-value="id"
                      item-text="name"
                      outlined
                      class="rounded-lg"
                      dense
                      :rules="rules.country"
                    />
                  </div>
                  <p v-else class="mb-0 font-weight-bold flex-grow-1">
                    {{ profile.Researcher.GraduateCountry.name }}
                  </p>
                </div>
              </div>
            </div>
            <v-divider class="my-5" />
            <div :class="['d-flex ',['xs', 'sm'].includes($vuetify.breakpoint.name) ? 'flex-column' : 'justify-space-between']">
              <div :class="['flex-shrink-0',['xs', 'sm'].includes($vuetify.breakpoint.name) ? 'mb-5' : 'w-30 mr-5']">
                <p class="mb-0 font-weight-bold">
                  Research Info
                </p>
                <p class="mb-0 grey--text caption">
                  Update your research expertise.
                </p>
              </div>
              <div class="flex-grow-1">
                <div :class="['d-flex align-baseline mb-3',['xs', 'sm'].includes($vuetify.breakpoint.name) ? 'flex-column' : '']">
                  <p :class="['mb-0 flex-shrink-0',['xs', 'sm'].includes($vuetify.breakpoint.name) ? '' : 'w-40']">
                    Keywords
                  </p>
                  <div v-if="editing" :class="['flex-grow-1',['xs', 'sm'].includes($vuetify.breakpoint.name) ? 'w-100' : '']">
                    <v-combobox
                      v-model="keywords"
                      hide-selected
                      multiple
                      append-icon
                      outlined
                      class="rounded-lg"
                      dense
                      hint="Input Keyword and Enter or Tab for added"
                      clearable
                      chips
                      deletable-chips
                      small-chips
                      persistent-hint
                      @change="updateKeywords"
                    />
                  </div>
                  <div v-else class="flex-grow-1">
                    <div v-if="profile.Researcher.keyword" class="d-flex flex-wrap">
                      <v-chip
                        v-for="(val, index) in profile.Researcher.keyword.split('; ')"
                        :key="`keyword-${index}`"
                        label
                        small
                        class="mr-1 mb-1 themeAccent--text font-weight-bold"
                      >
                        {{ val }}
                      </v-chip>
                    </div>
                    <p v-else class="mb-0 font-weight-bold">
                      -
                    </p>
                  </div>
                </div>
                <div :class="['d-flex align-baseline mb-3',['xs', 'sm'].includes($vuetify.breakpoint.name) ? 'flex-column' : '']">
                  <p :class="['mb-0 flex-shrink-0',['xs', 'sm'].includes($vuetify.breakpoint.name) ? '' : 'w-40']">
                    Expert
                  </p>
                  <div v-if="editing" :class="['flex-grow-1',['xs', 'sm'].includes($vuetify.breakpoint.name) ? 'w-100' : '']">
                    <v-combobox
                      v-model="experts"
                      hide-selected
                      multiple
                      append-icon
                      outlined
                      class="rounded-lg"
                      dense
                      hint="Input Expert and Enter or Tab for added"
                      clearable
                      chips
                      deletable-chips
                      small-chips
                      persistent-hint
                      @change="updateExperts"
                    />
                  </div>
                  <div v-else class="flex-grow-1">
                    <div v-if="profile.Researcher.expert" class="d-flex flex-wrap">
                      <v-chip
                        v-for="(val, index) in profile.Researcher.expert.split('; ')"
                        :key="`expert-${index}`"
                        small
                        label
                        class="mr-1 mb-1 white--text font-weight-bold"
                        color="themeAccent"
                      >
                        {{ val }}
                      </v-chip>
                    </div>
                    <p v-else class="mb-0 font-weight-bold">
                      -
                    </p>
                  </div>
                </div>
                <div :class="['d-flex align-baseline mb-3',['xs', 'sm'].includes($vuetify.breakpoint.name) ? 'flex-column' : '']">
                  <p :class="['mb-0 flex-shrink-0',['xs', 'sm'].includes($vuetify.breakpoint.name) ? '' : 'w-40']">
                    Case Study / Sample Group
                  </p>
                  <div v-if="editing" :class="['flex-grow-1',['xs', 'sm'].includes($vuetify.breakpoint.name) ? 'w-100' : '']">
                    <v-textarea
                      v-model="form.case_study"
                      outlined
                      class="rounded-lg"
                      placeholder="Please specify the research examples or case studies you are interested in studying in the future"
                      rows="3"
                      dense
                    />
                  </div>
                  <p v-else class="mb-0 font-weight-bold flex-grow-1">
                    {{ profile.Researcher.case_study || '-' }}
                  </p>
                </div>
                <div :class="['d-flex align-baseline mb-3',['xs', 'sm'].includes($vuetify.breakpoint.name) ? 'flex-column' : '']">
                  <p :class="['mb-0 flex-shrink-0',['xs', 'sm'].includes($vuetify.breakpoint.name) ? '' : 'w-40']">
                    Previous research location
                  </p>
                  <div v-if="editing" :class="['flex-grow-1',['xs', 'sm'].includes($vuetify.breakpoint.name) ? 'w-100' : '']">
                    <v-textarea
                      v-model="form.hot_issue"
                      placeholder="Please specify your previous research location"
                      rows="3"
                      outlined
                      class="rounded-lg"
                      dense
                    />
                  </div>
                  <p v-else class="mb-0 font-weight-bold flex-grow-1">
                    {{ profile.Researcher.hot_issue || '-' }}
                  </p>
                </div>
                <div :class="['d-flex align-baseline mb-3',['xs', 'sm'].includes($vuetify.breakpoint.name) ? 'flex-column' : '']">
                  <p :class="['mb-0 flex-shrink-0',['xs', 'sm'].includes($vuetify.breakpoint.name) ? '' : 'w-40']">
                    New research location
                  </p>
                  <div v-if="editing" :class="['flex-grow-1',['xs', 'sm'].includes($vuetify.breakpoint.name) ? 'w-100' : '']">
                    <v-textarea
                      v-model="form.research_country"
                      placeholder="Please specify your new research location"
                      rows="3"
                      outlined
                      class="rounded-lg"
                      dense
                    />
                  </div>
                  <p v-else class="mb-0 font-weight-bold flex-grow-1">
                    {{ profile.Researcher.research_country || '-' }}
                  </p>
                </div>
                <div :class="['d-flex align-baseline mb-3',['xs', 'sm'].includes($vuetify.breakpoint.name) ? 'flex-column' : '']">
                  <p :class="['mb-0 flex-shrink-0',['xs', 'sm'].includes($vuetify.breakpoint.name) ? '' : 'w-40']">
                    Research Period
                  </p>
                  <div v-if="editing" :class="['flex-grow-1',['xs', 'sm'].includes($vuetify.breakpoint.name) ? 'w-100' : '']">
                    <v-autocomplete
                      v-model="form.length"
                      placeholder="Select research period"
                      :items="[6, 8, 12, 24, 36]"
                      suffix="Month"
                      outlined
                      class="rounded-lg"
                      dense
                    />
                  </div>
                  <p v-else class="mb-0 font-weight-bold flex-grow-1">
                    <span v-if="profile.Researcher.length">
                      {{ profile.Researcher.length }}
                      Month
                    </span>
                    <span v-else>-</span>
                  </p>
                </div>
                <div :class="['d-flex align-baseline mb-3',['xs', 'sm'].includes($vuetify.breakpoint.name) ? 'flex-column' : '']">
                  <p :class="['mb-0 flex-shrink-0',['xs', 'sm'].includes($vuetify.breakpoint.name) ? '' : 'w-40']">
                    Number of Research Team Members
                  </p>
                  <div v-if="editing" :class="['flex-grow-1',['xs', 'sm'].includes($vuetify.breakpoint.name) ? 'w-100' : '']">
                    <v-currency-field
                      v-model="form.no_of_coauthor"
                      placeholder="Input number of research team members"
                      outlined
                      class="rounded-lg"
                      :min="0"
                      :decimal-length="0"
                      dense
                    />
                  </div>
                  <p v-else class="mb-0 font-weight-bold flex-grow-1">
                    {{ $currencyText(profile.Researcher.no_of_coauthor) || '-' }}
                  </p>
                </div>
                <div :class="['d-flex align-baseline mb-3',['xs', 'sm'].includes($vuetify.breakpoint.name) ? 'flex-column' : '']">
                  <p :class="['mb-0 flex-shrink-0',['xs', 'sm'].includes($vuetify.breakpoint.name) ? '' : 'w-40']">
                    Scopus URL
                  </p>
                  <div v-if="editing" :class="['flex-grow-1',['xs', 'sm'].includes($vuetify.breakpoint.name) ? 'w-100' : '']">
                    <v-text-field
                      v-model="form.link_scopus"
                      placeholder="Input your Scopus URL"
                      outlined
                      class="rounded-lg"
                      dense
                    />
                  </div>
                  <p v-else class="mb-0 font-weight-bold flex-grow-1">
                    {{ profile.Researcher.link_scopus || '-' }}
                  </p>
                </div>
                <div :class="['d-flex align-baseline mb-3',['xs', 'sm'].includes($vuetify.breakpoint.name) ? 'flex-column' : '']">
                  <p :class="['mb-0 flex-shrink-0',['xs', 'sm'].includes($vuetify.breakpoint.name) ? '' : 'w-40']">
                    Linkedin URL
                  </p>
                  <div v-if="editing" :class="['flex-grow-1',['xs', 'sm'].includes($vuetify.breakpoint.name) ? 'w-100' : '']">
                    <v-text-field
                      v-model="form.link_linkedin"
                      placeholder="Input your Linkedin URL"
                      outlined
                      class="rounded-lg"
                      dense
                    />
                  </div>
                  <p v-else class="mb-0 font-weight-bold flex-grow-1">
                    {{ profile.Researcher.link_linkedin || '-' }}
                  </p>
                </div>
                <div :class="['d-flex align-baseline mb-3',['xs', 'sm'].includes($vuetify.breakpoint.name) ? 'flex-column' : '']">
                  <p :class="['mb-0 flex-shrink-0',['xs', 'sm'].includes($vuetify.breakpoint.name) ? '' : 'w-40']">
                    Research Gate URL
                  </p>
                  <div v-if="editing" :class="['flex-grow-1',['xs', 'sm'].includes($vuetify.breakpoint.name) ? 'w-100' : '']">
                    <v-text-field
                      v-model="form.research_gate"
                      placeholder="Input your Research Gate URL"
                      outlined
                      class="rounded-lg"
                      dense
                    />
                  </div>
                  <p v-else class="mb-0 font-weight-bold flex-grow-1">
                    {{ profile.Researcher.research_gate || '-' }}
                  </p>
                </div>
                <div :class="['d-flex align-start mb-3',['xs', 'sm'].includes($vuetify.breakpoint.name) ? 'flex-column' : '']">
                  <div :class="['flex-shrink-0',['xs', 'sm'].includes($vuetify.breakpoint.name) ? '' : 'w-40']">
                    <p class="mb-0">
                      CV
                      <span v-if="['xs', 'sm'].includes($vuetify.breakpoint.name) && editing" class="caption">{{ $t('LESS_SIZE', { text: $t('FILE'), count: '2 MB' }) }}</span>
                    </p>
                    <p v-if="!['xs', 'sm'].includes($vuetify.breakpoint.name) && editing" class="caption mb-0">
                      {{ $t('LESS_SIZE', { text: $t('FILE'), count: '2 MB' }) }}
                    </p>
                  </div>
                  <a v-if="profile.Researcher.cv" :href="profile.Researcher.cv" target="_blank">
                    <v-btn text color="info" class="mr-3 rounded-lg">
                      View CV
                    </v-btn>
                  </a>
                  <p v-else-if="!editing" class="mb-0 font-weight-bold flex-grow-1">
                    {{ '-' }}
                  </p>
                  <div v-if="editing" :class="['flex-grow-1',['xs', 'sm'].includes($vuetify.breakpoint.name) ? 'w-100' : '']">
                    <v-file-input
                      v-model="cv_img"
                      accept="image/jpeg,image/gif,image/png,application/pdf"
                      prepend-inner-icon="mdi-paperclip"
                      prepend-icon=""
                      :placeholder="profile.Researcher.cv ? 'Browse and Upload to update your CV' : 'Browse and Upload your new CV'"
                      outlined
                      :rules="rules.cv_img"
                      dense
                      :hide-details="!!cv_img"
                      class="rounded-lg"
                      :show-size="1000"
                    />
                    <v-btn
                      v-if="cv_img"
                      class="ml-2 mt-1"
                      x-small
                      depressed
                      color=" "
                      @click="saveChangeCV"
                    >
                      Upload
                    </v-btn>
                  </div>
                </div>
                <div :class="['d-flex align-baseline mb-3',['xs', 'sm'].includes($vuetify.breakpoint.name) ? 'flex-column' : '']">
                  <p :class="['mb-0 flex-shrink-0',['xs', 'sm'].includes($vuetify.breakpoint.name) ? '' : 'w-40']">
                    Patient of Researcher
                  </p>
                  <div v-if="editing" :class="['flex-grow-1',['xs', 'sm'].includes($vuetify.breakpoint.name) ? 'w-100' : '']">
                    <v-textarea
                      v-model="form.patient"
                      placeholder="Please specify your Patient of Researcher"
                      rows="3"
                      outlined
                      class="rounded-lg"
                      dense
                    />
                  </div>
                  <p v-else class="mb-0 font-weight-bold flex-grow-1">
                    {{ profile.Researcher.patient || '-' }}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div v-else-if="profile.member_type === 'organization'">
            <v-divider class="my-5" />
            <div :class="['d-flex ',['xs', 'sm'].includes($vuetify.breakpoint.name) ? 'flex-column' : 'justify-space-between']">
              <div :class="['flex-shrink-0',['xs', 'sm'].includes($vuetify.breakpoint.name) ? 'mb-5' : 'w-30 mr-5']">
                <p class="mb-0 font-weight-bold">
                  Company Info
                </p>
                <p class="mb-0 grey--text caption">
                  Update your logo and company name.
                </p>
              </div>
              <div class="flex-grow-1">
                <div :class="['d-flex align-baseline mb-3',['xs', 'sm'].includes($vuetify.breakpoint.name) ? 'flex-column' : '']">
                  <p :class="['mb-0 flex-shrink-0',['xs', 'sm'].includes($vuetify.breakpoint.name) ? '' : 'w-40']">
                    Company Name
                    <v-icon v-if="editing" color="error" x-small class="mt-n3">
                      mdi-asterisk
                    </v-icon>
                  </p>
                  <div v-if="editing" :class="['flex-grow-1',['xs', 'sm'].includes($vuetify.breakpoint.name) ? 'w-100' : '']">
                    <v-text-field
                      v-model="form.name"
                      outlined
                      class="rounded-lg"
                      :rules="rules.name"
                      dense
                      required
                    />
                  </div>
                  <p v-else class="mb-0 font-weight-bold flex-grow-1">
                    {{ profile.Organization.name }}
                  </p>
                </div>
                <div :class="['d-flex align-start mb-3',['xs', 'sm'].includes($vuetify.breakpoint.name) ? 'flex-column' : '']">
                  <p :class="['flex-shrink-0',['xs', 'sm'].includes($vuetify.breakpoint.name) ? 'mb-5' : 'mb-0 w-40']">
                    Company Logo
                  </p>
                  <v-avatar :size="['xs', 'sm'].includes($vuetify.breakpoint.name) ? '200' : '64'" :class="['shadow',['xs', 'sm'].includes($vuetify.breakpoint.name) ? 'mx-auto' : '']">
                    <v-img v-if="imgPreview" :src="imgPreview" />
                    <v-img v-else-if="profile.avatar" :src="profile.avatar" />
                    <v-img v-else src="/images/logo.png" />
                  </v-avatar>
                  <div v-if="editing" :class="['flex-grow-1 align-self-center',['xs', 'sm'].includes($vuetify.breakpoint.name) ? 'mt-5' : 'ml-5']">
                    <v-btn
                      x-small
                      plain
                      color="info"
                      depressed
                      @click="selectFile"
                    >
                      {{ $t('CHANGE',{text: $t('IMAGE')}) }}
                    </v-btn>
                    <v-btn
                      v-if="imgPreview"
                      class="ml-2"
                      x-small
                      depressed
                      color=" "
                      @click="saveChangeImage"
                    >
                      Upload
                    </v-btn>
                    <v-btn
                      v-if="imgPreview"
                      class="ml-2"
                      x-small
                      depressed
                      color="error"
                      @click="cancelChangeImage"
                    >
                      {{ $t('CANCEL') }}
                    </v-btn>
                  </div>
                </div>
              </div>
            </div>
            <v-divider class="my-5" />
            <div :class="['d-flex ',['xs', 'sm'].includes($vuetify.breakpoint.name) ? 'flex-column' : 'justify-space-between']">
              <div :class="['flex-shrink-0',['xs', 'sm'].includes($vuetify.breakpoint.name) ? 'mb-5' : 'w-30 mr-5']">
                <p class="mb-0 font-weight-bold">
                  Organization Info
                </p>
                <p class="mb-0 grey--text caption">
                  Update your organization info.
                </p>
              </div>
              <div class="flex-grow-1">
                <div :class="['d-flex align-baseline mb-3',['xs', 'sm'].includes($vuetify.breakpoint.name) ? 'flex-column' : '']">
                  <p :class="['mb-0 flex-shrink-0',['xs', 'sm'].includes($vuetify.breakpoint.name) ? '' : 'w-40']">
                    Organization Type
                    <v-icon v-if="editing" color="error" x-small class="mt-n3">
                      mdi-asterisk
                    </v-icon>
                  </p>
                  <div v-if="editing" :class="['flex-grow-1',['xs', 'sm'].includes($vuetify.breakpoint.name) ? 'w-100' : '']">
                    <v-autocomplete
                      v-model="form.organization_type_id"
                      :items="organizationTypes"
                      item-value="id"
                      item-text="name"
                      outlined
                      class="rounded-lg"
                      dense
                      :rules="rules.organization_type"
                    />
                  </div>
                  <p v-else class="mb-0 font-weight-bold flex-grow-1">
                    {{ profile.Organization.OrganizationType.name }}
                  </p>
                </div>
                <div :class="['d-flex align-baseline mb-3',['xs', 'sm'].includes($vuetify.breakpoint.name) ? 'flex-column' : '']">
                  <p :class="['mb-0 flex-shrink-0',['xs', 'sm'].includes($vuetify.breakpoint.name) ? '' : 'w-40']">
                    Amount of Staff
                  </p>
                  <div v-if="editing" :class="['flex-grow-1',['xs', 'sm'].includes($vuetify.breakpoint.name) ? 'w-100' : '']">
                    <v-currency-field
                      v-model="form.size"
                      placeholder="Input amount of staff"
                      outlined
                      class="rounded-lg"
                      :min="0"
                      :decimal-length="0"
                      dense
                    />
                  </div>
                  <p v-else class="mb-0 font-weight-bold flex-grow-1">
                    {{ $currencyText(profile.Organization.size) || '-' }}
                  </p>
                </div>
                <div :class="['d-flex align-baseline mb-3',['xs', 'sm'].includes($vuetify.breakpoint.name) ? 'flex-column' : '']">
                  <p :class="['mb-0 flex-shrink-0',['xs', 'sm'].includes($vuetify.breakpoint.name) ? '' : 'w-40']">
                    Product and Service
                  </p>
                  <div v-if="editing" :class="['flex-grow-1',['xs', 'sm'].includes($vuetify.breakpoint.name) ? 'w-100' : '']">
                    <v-textarea
                      v-model="form.product"
                      placeholder="Input product and service of company"
                      outlined
                      class="rounded-lg"
                      dense
                      rows="3"
                    />
                  </div>
                  <p v-else class="mb-0 font-weight-bold flex-grow-1">
                    {{ profile.Organization.product || '-' }}
                  </p>
                </div>
                <div :class="['d-flex align-baseline mb-3',['xs', 'sm'].includes($vuetify.breakpoint.name) ? 'flex-column' : '']">
                  <p :class="['mb-0 flex-shrink-0',['xs', 'sm'].includes($vuetify.breakpoint.name) ? '' : 'w-40']">
                    Research Area
                  </p>
                  <div v-if="editing" :class="['flex-grow-1',['xs', 'sm'].includes($vuetify.breakpoint.name) ? 'w-100' : '']">
                    <v-textarea
                      v-model="form.research_area"
                      placeholder="Input research area of company"
                      outlined
                      class="rounded-lg"
                      dense
                      rows="3"
                    />
                  </div>
                  <p v-else class="mb-0 font-weight-bold flex-grow-1">
                    {{ profile.Organization.research_area || '-' }}
                  </p>
                </div>
                <div :class="['d-flex align-baseline mb-3',['xs', 'sm'].includes($vuetify.breakpoint.name) ? 'flex-column' : '']">
                  <p :class="['mb-0 flex-shrink-0',['xs', 'sm'].includes($vuetify.breakpoint.name) ? '' : 'w-40']">
                    {{ $t('ADDRESS') }}
                  </p>
                  <div v-if="editing" :class="['flex-grow-1',['xs', 'sm'].includes($vuetify.breakpoint.name) ? 'w-100' : '']">
                    <v-textarea
                      v-model="form.address"
                      placeholder="Input address of company"
                      rows="3"
                      outlined
                      class="rounded-lg"
                      dense
                    />
                  </div>
                  <p v-else class="mb-0 font-weight-bold flex-grow-1">
                    {{ profile.Organization.address || '-' }}
                  </p>
                </div>
                <div :class="['d-flex align-baseline mb-3',['xs', 'sm'].includes($vuetify.breakpoint.name) ? 'flex-column' : '']">
                  <p :class="['mb-0 flex-shrink-0',['xs', 'sm'].includes($vuetify.breakpoint.name) ? '' : 'w-40']">
                    City
                  </p>
                  <div v-if="editing" :class="['flex-grow-1',['xs', 'sm'].includes($vuetify.breakpoint.name) ? 'w-100' : '']">
                    <v-text-field
                      v-model="form.city"
                      placeholder=" Input city of company"
                      outlined
                      class="rounded-lg"
                      dense
                    />
                  </div>
                  <p v-else class="mb-0 font-weight-bold flex-grow-1">
                    {{ profile.Organization.city || '-' }}
                  </p>
                </div>
                <div :class="['d-flex align-baseline mb-3',['xs', 'sm'].includes($vuetify.breakpoint.name) ? 'flex-column' : '']">
                  <p :class="['mb-0 flex-shrink-0',['xs', 'sm'].includes($vuetify.breakpoint.name) ? '' : 'w-40']">
                    Country
                    <v-icon v-if="editing" color="error" x-small class="mt-n3">
                      mdi-asterisk
                    </v-icon>
                  </p>
                  <div v-if="editing" :class="['flex-grow-1',['xs', 'sm'].includes($vuetify.breakpoint.name) ? 'w-100' : '']">
                    <v-autocomplete
                      v-model="form.country_id"
                      :items="countries"
                      item-value="id"
                      item-text="name"
                      outlined
                      class="rounded-lg"
                      dense
                      :rules="rules.country"
                    />
                  </div>
                  <p v-else class="mb-0 font-weight-bold flex-grow-1">
                    {{ profile.Organization.Country.name || '-' }}
                  </p>
                </div>
              </div>
            </div>
            <v-divider class="my-5" />
            <div :class="['d-flex ',['xs', 'sm'].includes($vuetify.breakpoint.name) ? 'flex-column' : 'justify-space-between']">
              <div :class="['flex-shrink-0',['xs', 'sm'].includes($vuetify.breakpoint.name) ? 'mb-5' : 'w-30 mr-5']">
                <p class="mb-0 font-weight-bold">
                  Contact Info
                </p>
                <p class="mb-0 grey--text caption">
                  Update your contact info.
                </p>
              </div>
              <div class="flex-grow-1">
                <div :class="['d-flex align-baseline mb-3',['xs', 'sm'].includes($vuetify.breakpoint.name) ? 'flex-column' : '']">
                  <p :class="['mb-0 flex-shrink-0',['xs', 'sm'].includes($vuetify.breakpoint.name) ? '' : 'w-40']">
                    Contact Name
                  </p>
                  <div v-if="editing" :class="['flex-grow-1',['xs', 'sm'].includes($vuetify.breakpoint.name) ? 'w-100' : '']">
                    <v-text-field
                      v-model="form.contact_name"
                      outlined
                      class="rounded-lg"
                      placeholder="Input company contact name"
                      dense
                    />
                  </div>
                  <p v-else class="mb-0 font-weight-bold flex-grow-1">
                    {{ profile.Organization.contact_name || '-' }}
                  </p>
                </div>
                <div :class="['d-flex align-baseline mb-3',['xs', 'sm'].includes($vuetify.breakpoint.name) ? 'flex-column' : '']">
                  <p :class="['mb-0 flex-shrink-0',['xs', 'sm'].includes($vuetify.breakpoint.name) ? '' : 'w-40']">
                    Department
                  </p>
                  <div v-if="editing" :class="['flex-grow-1',['xs', 'sm'].includes($vuetify.breakpoint.name) ? 'w-100' : '']">
                    <v-text-field
                      v-model="form.department"
                      placeholder="Input company contact department"
                      outlined
                      class="rounded-lg"
                      dense
                    />
                  </div>
                  <p v-else class="mb-0 font-weight-bold flex-grow-1">
                    {{ profile.Organization.department || '-' }}
                  </p>
                </div>
                <div :class="['d-flex align-baseline mb-3',['xs', 'sm'].includes($vuetify.breakpoint.name) ? 'flex-column' : '']">
                  <p :class="['mb-0 flex-shrink-0',['xs', 'sm'].includes($vuetify.breakpoint.name) ? '' : 'w-40']">
                    Phone Number
                  </p>
                  <div v-if="editing" :class="['flex-grow-1',['xs', 'sm'].includes($vuetify.breakpoint.name) ? 'w-100' : '']">
                    <v-text-field
                      v-model="form.contact_email"
                      placeholder="Input company contact E-mail"
                      outlined
                      class="rounded-lg"
                      dense
                    />
                  </div>
                  <p v-else class="mb-0 font-weight-bold flex-grow-1">
                    {{ profile.Organization.contact_email || '-' }}
                  </p>
                </div>
                <div :class="['d-flex align-baseline mb-3',['xs', 'sm'].includes($vuetify.breakpoint.name) ? 'flex-column' : '']">
                  <p :class="['mb-0 flex-shrink-0',['xs', 'sm'].includes($vuetify.breakpoint.name) ? '' : 'w-40']">
                    Linkedin URL
                  </p>
                  <div v-if="editing" :class="['flex-grow-1',['xs', 'sm'].includes($vuetify.breakpoint.name) ? 'w-100' : '']">
                    <v-text-field
                      v-model="form.link_linkedin"
                      placeholder="Input your Linkedin URL"
                      outlined
                      class="rounded-lg"
                      dense
                    />
                  </div>
                  <p v-else class="mb-0 font-weight-bold flex-grow-1">
                    {{ profile.Organization.link_linkedin || '-' }}
                  </p>
                </div>
                <div :class="['d-flex align-baseline mb-3',['xs', 'sm'].includes($vuetify.breakpoint.name) ? 'flex-column' : '']">
                  <p :class="['mb-0 flex-shrink-0',['xs', 'sm'].includes($vuetify.breakpoint.name) ? '' : 'w-40']">
                    Patient of the organization
                  </p>
                  <div v-if="editing" :class="['flex-grow-1',['xs', 'sm'].includes($vuetify.breakpoint.name) ? 'w-100' : '']">
                    <v-textarea
                      v-model="form.patient"
                      placeholder="Please specify your Patient of the organization"
                      rows="3"
                      outlined
                      class="rounded-lg"
                      dense
                    />
                  </div>
                  <p v-else class="mb-0 font-weight-bold flex-grow-1">
                    {{ profile.Organization.patient || '-' }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </v-form>
      </v-container>
      <forms-change-password :has-password="!!profile.password_created_at" @save="savePassword" />
      <input
        ref="inputFiles"
        type="file"
        accept="image/*"
        hidden
        @change="saveImage"
      >
    </div>
  </div>
</template>

<script>
export default {
  layout: 'member',
  middleware: ['authen', 'frontend'],
  data () {
    return {
      basePath: `${process.env.baseUrl}${this.$route.fullPath}`,
      authApi: `${process.env.apiUrl}${process.env.apiDirectory}auth`,
      countryApi: `${process.env.apiUrl}${process.env.apiDirectory}countries`,
      organizationTypeApi: `${process.env.apiUrl}${process.env.apiDirectory}organization-types`,
      pageName: this.$t('PROFILE_INFO'),
      valid: true,
      saving: false,
      editing: false,
      profile: null,
      imgPreview: null,
      countries: null,
      organizationTypes: null,
      keywords: [],
      experts: [],
      rules: {
        gender: [
          v => !!v || 'Gender is required'
        ],
        title: [
          v => !!v || 'Title is required'
        ],
        department: [
          v => !!v || 'Department is required'
        ],
        organization: [
          v => !!v || 'Organization is required'
        ],
        country: [
          v => !!v || 'Country is required'
        ],
        graduate: [
          v => !!v || 'Graduate is required'
        ],
        expert: [
          v => v.length > 0 || 'Expert is required'
        ],
        case_study: [
          v => !!v || 'Case Study / Sample Group is required'
        ],
        length: [
          v => !!v || 'Research Period (Month) is required'
        ],
        firstname: [
          v => !!v || this.$t('IS_REQUIRED', { text: this.$t('FIRSTNAME') })
        ],
        lastname: [
          v => !!v || this.$t('IS_REQUIRED', { text: this.$t('LASTNAME') })
        ],
        keywords: [
          v => v.length > 0 || 'Keyword is required'
        ],
        name: [
          v => !!v || 'Name is required'
        ],
        organization_type: [
          v => !!v || 'Organization Type is required'
        ],
        size: [
          v => !!v || 'Amount of Co Staff is required'
        ],
        cv_img: [
          (v) => {
            const mimetypeImages = ['image/png', 'image/gif', 'image/jpg', 'image/jpeg', 'application/pdf']
            return !v || mimetypeImages.includes(v.type) || 'File must be image or PDF only'
          },
          v => !v || v.size <= 2000000 || this.$t('LESS_SIZE', { text: this.$t('FILE'), count: '2 MB' })
        ]
      },
      form: { },
      cv_img: null
    }
  },
  async fetch () {
    try {
      await this.$auth.fetchUser()
      this.profile = { ...this.$auth.user }
      if (this.profile.member_type === 'researcher') {
        this.form = {
          ...this.$auth.user.Researcher
        }
        if (this.form.keyword && this.form.keyword.trim() !== '') {
          this.keywords = this.form.keyword.split('; ')
        }
        if (this.form.expert.trim() !== '') {
          this.experts = this.form.expert.split('; ')
        }
      } else if (this.profile.member_type === 'organization') {
        this.form = {
          ...this.$auth.user.Organization
        }
      }
    } catch (e) {
      this.$nuxt.error({ statusCode: e.response.status, message: e.response.data.message })
    }
    this.$overlay.hide()
  },
  head () {
    return this.$headUtil({
      lang: this.$lang.getISO,
      title: this.pageName,
      urlPath: this.basePath
    })
  },
  computed: {
    academicTitles () {
      return this.$store.state.references.academicTitles
    },
    religions () {
      return this.$store.state.references.religions
    },
    degrees () {
      return this.$store.state.references.degrees
    }
  },
  async mounted () {
    try {
      const refDatas = await Promise.all([
        this.$axios.$get(this.organizationTypeApi),
        this.$axios.$get(this.countryApi)
      ])
      this.organizationTypes = refDatas[0].rows
      this.countries = refDatas[1].rows
    } catch (e) {
      this.$nuxt.error({ statusCode: e.response.status, message: e.response.data.message })
    }
  },
  created () {
    this.$breadcrumbs.clear()
  },
  methods: {
    selectFile () {
      const fileInputElement = this.$refs.inputFiles
      fileInputElement.value = null
      fileInputElement.click()
    },
    saveImage (e) {
      const file = e.target.files[0]
      this.profile.avatar_img = file
      this.imgPreview = URL.createObjectURL(file)
      this.$overlay.hide()
    },
    async saveChangeImage () {
      this.$overlay.showLoading()
      const formData = new FormData()
      for (const [key, value] of Object.entries(this.profile)) {
        formData.append(key, value)
      }
      try {
        await this.$axios.$post(`${this.authApi}/update-avatar`, formData)
        this.$notifier.showMessage({ title: this.$t('UPDATED'), content: this.$t('UPDATED_', { text: this.$t('PROFILE_IMAGE') }), color: 'success' })
        this.imgPreview = null
        await this.$fetch()
      } catch (e) {
        this.$notifier.showMessage({ title: 'Error', content: e, color: 'error' })
      }
    },
    async saveChangeCV () {
      this.$overlay.showLoading()
      const formData = new FormData()
      formData.append('cv_img', this.cv_img)
      try {
        await this.$axios.$post(`${this.authApi}/update-cv`, formData)
        this.$notifier.showMessage({ title: this.$t('UPDATED'), content: this.$t('UPDATED_', { text: 'CV' }), color: 'success' })
        this.cv_img = null
        await this.$fetch()
      } catch (e) {
        this.$notifier.showMessage({ title: 'Error', content: e, color: 'error' })
      }
    },
    cancelChangeImage () {
      this.imgPreview = null
    },
    onEditing () {
      this.editing = true
      return false
    },
    updateKeywords (vals) {
      this.keywords = vals.filter(ele => ele.trim() !== '').map(ele => ele.trim())
      this.form.keyword = vals.filter(ele => ele.trim() !== '').map(ele => ele.trim()).join('; ')
    },
    updateExperts (vals) {
      this.experts = vals.filter(ele => ele.trim() !== '').map(ele => ele.trim())
      this.form.expert = vals.filter(ele => ele.trim() !== '').map(ele => ele.trim()).join('; ')
    },
    async cancelEditing () {
      this.editing = false
      await this.$fetch()
    },
    async saveProfile (data, noti = true) {
      if (this.$refs.form.validate()) {
        this.saving = true
        this.editing = false
        try {
          await this.$axios.$post(`${this.authApi}/update-${this.profile.member_type}`, this.form)
          if (noti) {
            this.$notifier.showMessage({ title: this.$t('UPDATED'), content: this.$t('UPDATED_', { text: this.$t('PROFILE') }), color: 'success' })
          }
          await this.$fetch()
        } catch (e) {
          this.$notifier.showMessage({ title: 'Error', content: e, color: 'error' })
        } finally {
          this.saving = false
        }
      }
    },
    async savePassword (data) {
      try {
        await this.$axios.$post(`${this.authApi}/update-password`, data)
        this.$notifier.showMessage({ title: this.$t('UPDATED'), content: this.$t('UPDATED_', { text: ' Password ' }), color: 'success' })
        await this.$fetch()
      } catch (e) {
        this.$notifier.showMessage({ title: this.$t('INVALID', { text: this.$t('OLD_PASSWORD') }), content: this.$t('INCORRECT_OLD_PASSWORD_DETAIL'), color: 'error' })
        this.$overlay.hide()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.hero-image {
  background: linear-gradient(to left, #d6d6e6 0%, #f0f0f5 100%);
  background-position: top;
  background-repeat: no-repeat;
  background-size: cover;
}
</style>
