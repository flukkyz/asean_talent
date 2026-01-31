export const state = () => ({
  firstLoad: false,
  drawer: false,
  regexNoHtml: /(<[^>]*>)/g,
  setting: null,
  topbarLogos: null,
  frontend: [
    {
      icon: 'mdi-home',
      text: 'Home',
      url: 'home'
    },
    {
      icon: 'mdi-view-dashboard',
      text: 'Dashboard',
      url: 'dashboard',
      active: 'show_menu_dashboard'
    },
    // {
    //   icon: 'fas fa-user-tie',
    //   text: 'ASEAN Talent Pool',
    //   url: 'asean-talent-pool'
    // },
    {
      group: 'Talent Pool',
      icon: 'fas fa-user-tie',
      active: 'show_menu_talent_pool',
      items: [
        {
          text: 'ASEAN Talent',
          url: 'asean-talent-pool',
          active: 'show_menu_asean_talent'
        },
        {
          text: 'Young Talent',
          url: 'young-talent-pool',
          active: 'show_menu_young_talent'
        }
      ]
    },
    {
      icon: 'mdi-checkbox-multiple-outline',
      text: 'Search Researchers',
      url: 'paring-search',
      active: 'show_menu_paring_search'
    },
    // {
    //   icon: 'fas fa-search-dollar',
    //   text: 'Funding Search',
    //   url: 'funding-search'
    // },
    {
      group: 'Resources ',
      icon: 'fas fa-cubes',
      active: 'show_menu_resourse',
      items: [
        {
          text: 'Publication',
          url: 'publication',
          active: 'show_menu_resourse_publication'
        },
        {
          text: 'Training Course',
          url: 'training-course',
          active: 'show_menu_resourse_training_course'
        },
        {
          text: 'Funding Organization',
          url: 'funding-organization',
          active: 'show_menu_resourse_funding_organization'
        },
        {
          text: 'Host',
          url: 'host',
          active: 'show_menu_resourse_host'
        },
        {
          text: 'Lab Location',
          url: 'lab-location',
          active: 'show_menu_resourse_lab_location'
        },
        {
          text: 'Forums',
          url: 'forums',
          active: 'show_menu_resourse_forum'
        }
      ]
    },
    {
      icon: 'mdi-share-variant',
      text: 'Asean Network',
      url: 'asean-network',
      active: 'show_menu_asean_network'
    },
    {
      icon: 'mdi-information',
      text: 'About',
      url: 'about'
    }
  ],
  backend: [
    {
      group: 'Reports',
      icon: 'fas fa-file-alt',
      items: [
        {
          text: 'Talents Report',
          url: 'backend-reports-talents'
        }
        // {
        //   text: 'Social Network Analysis',
        //   url: 'backend-reports-social-network-analysis',
        //   roles: ['secret', 'admin']
        // },
        // {
        //   text: 'Thai National Research Repository (TNRR)',
        //   url: 'backend-reports-tnrr',
        //   roles: ['secret', 'admin']
        // }
      ]
    },
    {
      header: 'Manages'
    },
    {
      group: 'Talent',
      icon: 'fas fa-user-tie',
      items: [
        {
          text: 'Talents Lists',
          url: 'backend-manages-talents'
        },
        {
          text: 'Upload Talents',
          url: 'backend-manages-talents-uploads'
        },
        {
          text: 'Update Scopus',
          url: 'backend-manages-talents-update-scopuses'
        }
      ]
    },
    {
      group: 'Funding Organization',
      icon: 'fas fa-search-dollar',
      items: [
        {
          text: 'Funding Organizations Lists',
          url: 'backend-manages-funding-organizations'
        },
        {
          text: 'Upload Funding Organizations',
          url: 'backend-manages-funding-organizations-uploads'
        }
      ]
    },
    {
      group: 'Lab Location',
      icon: 'mdi-map-marker-account-outline',
      items: [
        {
          text: 'Lab Locations Lists',
          url: 'backend-manages-lab-locations'
        },
        {
          text: 'Upload Lab Locations',
          url: 'backend-manages-lab-locations-uploads'
        }
      ]
    },
    {
      group: 'Training Course',
      icon: 'fas fa-chalkboard-teacher',
      items: [
        {
          text: 'Training Courses Lists',
          url: 'backend-manages-training-courses'
        },
        {
          text: 'Upload Training Courses',
          url: 'backend-manages-training-courses-uploads'
        }
      ]
    },
    {
      group: 'Host',
      icon: 'fas fa-house-user',
      items: [
        {
          text: 'Hosts Lists',
          url: 'backend-manages-hosts'
        },
        {
          text: 'Upload Hosts',
          url: 'backend-manages-hosts-uploads'
        }
      ]
    },
    {
      group: 'Publication',
      icon: 'fas fa-book',
      items: [
        {
          text: 'Publisher Lists',
          url: 'backend-manages-publications-publishers'
        },
        {
          text: 'Journal Lists',
          url: 'backend-manages-publications-journals'
        },
        {
          text: 'Publication Lists',
          url: 'backend-manages-publications'
        }
      ]
    },
    {
      group: 'Young Talent',
      icon: 'fas fa-user-graduate',
      items: [
        {
          text: 'Young Talents Lists',
          url: 'backend-manages-young-talents'
        },
        {
          text: 'Upload Young Talents',
          url: 'backend-manages-young-talents-uploads'
        },
        {
          text: 'Update Young Talent Scopus',
          url: 'backend-manages-young-talents-update-scopuses'
        }
      ]
    },
    {
      group: 'Match Company',
      icon: 'fas fa-industry',
      items: [
        {
          text: 'Match Companies Lists',
          url: 'backend-manages-match-companies'
        },
        {
          text: 'Upload Match Companies',
          url: 'backend-manages-match-companies-uploads'
        }
      ]
    },
    {
      icon: 'mdi-share-variant',
      text: 'Asean Network',
      url: 'backend-manages-asean-networks',
      roles: ['secret', 'admin']
    },
    {
      icon: 'fas fa-users',
      text: 'Co Author',
      url: 'backend-manages-co-authors',
      roles: ['secret', 'admin']
    },
    {
      icon: 'fas fa-newspaper',
      text: 'News & Activity',
      url: 'backend-manages-blogs',
      roles: ['secret', 'admin']
    },
    {
      icon: 'mdi-forum',
      text: 'Forums',
      url: 'backend-manages-forums',
      roles: ['secret', 'admin']
    },
    {
      divider: true,
      roles: ['secret', 'admin', 'country_admin']
    },
    {
      header: 'Settings',
      roles: ['secret', 'admin', 'country_admin']
    },
    {
      icon: 'fas fa-display',
      text: 'Display Setting',
      url: 'backend-settings-setting',
      roles: ['secret', 'admin']
    },
    {
      icon: 'fas fa-images',
      text: 'Slider',
      url: 'backend-settings-slides',
      roles: ['secret', 'admin']
    },
    // {
    //   icon: 'mdi-link',
    //   text: 'Portal Link',
    //   url: 'backend-settings-portals',
    //   roles: ['secret', 'admin']
    // },
    {
      icon: 'mdi-link',
      text: 'Topbar Logo',
      url: 'backend-settings-topbar-logos',
      roles: ['secret', 'admin']
    },
    {
      icon: 'mdi-link',
      text: 'Supported by',
      url: 'backend-settings-supports',
      roles: ['secret', 'admin']
    },
    {
      icon: 'mdi-link',
      text: 'Managed by',
      url: 'backend-settings-manages',
      roles: ['secret', 'admin']
    },
    {
      group: 'Reference Datas',
      icon: 'fas fa-cogs',
      roles: ['secret', 'admin'],
      items: [
        {
          text: 'Network Type',
          url: 'backend-settings-references-network-types',
          roles: ['secret', 'admin']
        },
        {
          text: 'Indexed By',
          url: 'backend-settings-references-index-standards',
          roles: ['secret', 'admin']
        },
        {
          text: 'Organization Type',
          url: 'backend-settings-references-organization-types',
          roles: ['secret', 'admin']
        },
        {
          text: 'Blog Category',
          url: 'backend-settings-references-blog-categories',
          roles: ['secret', 'admin']
        },
        {
          text: 'Religion',
          url: 'backend-settings-references-religions',
          roles: ['secret', 'admin']
        },
        {
          text: 'Funding Agency',
          url: 'backend-settings-references-departments',
          roles: ['secret', 'admin']
        },
        {
          text: 'University',
          url: 'backend-settings-references-universities',
          roles: ['secret', 'admin']
        },
        {
          text: 'City',
          url: 'backend-settings-references-cities',
          roles: ['secret', 'admin']
        },
        {
          text: 'Country',
          url: 'backend-settings-references-countries',
          roles: ['secret', 'admin']
        },
        {
          text: 'Domain Industry',
          url: 'backend-settings-references-domain-industries',
          roles: ['secret', 'admin']
        }
      ]
    },
    {
      icon: 'mdi-account-circle',
      text: 'Member List',
      url: 'backend-settings-members',
      roles: ['secret', 'admin', 'country_admin']
    },
    {
      icon: 'mdi-account-supervisor',
      text: 'Staff Management',
      url: 'backend-settings-users',
      roles: ['secret', 'admin']
    }
    // {
    //   icon: 'fas fa-image',
    //   text: 'Banner',
    //   url: 'backend-settings-banners',
    //   roles: ['secret', 'admin']
    // }
  ],
  member: [
    {
      header: 'ASEAN Talent'
    },
    {
      icon: 'mdi-view-dashboard',
      text: 'ASEAN Talent Community',
      url: 'my-profile-dashboard'
    },
    {
      text: 'Funding Organization',
      icon: 'fas fa-search-dollar',
      url: 'my-profile-funding-organization',
      active: 'show_menu_resourse_funding_organization'
    },
    {
      text: 'Host',
      icon: 'fas fa-house-user',
      url: 'my-profile-host',
      active: 'show_menu_resourse_host'
    },
    {
      icon: 'mdi-map-marker-account-outline',
      text: 'Lab Location',
      url: 'my-profile-lab-location',
      active: 'show_menu_resourse_lab_location'
    },
    {
      icon: 'mdi-checkbox-multiple-outline',
      text: 'Search Researchers',
      url: 'my-profile-paring-search',
      active: 'show_menu_paring_search'
    },
    {
      icon: 'fas fa-bullhorn',
      text: 'Publication',
      url: 'my-profile-publication',
      active: 'show_menu_resourse_publication'
    },
    {
      icon: 'fas fa-chalkboard-teacher',
      text: 'Training Course',
      url: 'my-profile-training-course',
      active: 'show_menu_resourse_training_course'
    },
    {
      icon: 'mdi-share-variant',
      text: 'Asean Network',
      url: 'my-profile-asean-network',
      active: 'show_menu_asean_network'
    },
    {
      icon: 'fas fa-user-graduate',
      text: 'Young Talent',
      url: 'my-profile-young-talent',
      active: 'show_menu_young_talent'
    },
    {
      header: 'Settings'
    },
    {
      icon: 'mdi-account-circle',
      text: 'Profile Info',
      url: 'my-profile-info'
    },
    {
      icon: 'mdi-shield-half-full',
      text: 'Data and privacy',
      url: 'my-profile-privacy'
    }
  ],
  enums: {
    roles: {
      admin: 'Main Admin'
      // country_admin: 'Country Admin'
    },
    memberTypes: {
      Researcher: 'researcher',
      Organization: 'organization'
    },
    talentGroups: {
      talent: 'Talent',
      young_talent: 'Young Talent'
    },
    talentSearchTypes: {
      all: 'All',
      name: 'Name',
      keyword: 'Keyword'
    },
    labSearchTypes: {
      all: 'All',
      name: 'Name',
      equipment: 'Equipment'
    },
    machineStatuses: {
      active: 'Available',
      inactive: 'Not Available'
    },
    trainingFormats: {
      onsite: 'Onsite',
      online: 'Online',
      hybrid: 'Hybrid'
    },
    hostSearchTypes: {
      all: 'All',
      name: 'Name',
      keyword: 'Keyword'
    },
    publicationSearchTypes: {
      all: 'All',
      name: 'Name',
      journal: 'Journal',
      publisher: 'Publisher'
    },
    industries: {
      BCG: {
        color: '#2ACA93',
        colorStart: '#11BE98',
        colorEnd: '#60E385',
        class: 'success'
      },
      'Earth and Space': {
        color: '#4A9FF9',
        colorStart: '#4985FD',
        colorEnd: '#4BD6ED',
        class: 'info'
      },
      AI: {
        color: '#F95387',
        colorStart: '#F83F76',
        colorEnd: '#FA85AF',
        class: 'error'
      },
      'High Energy Physics': {
        color: '#FF9B44',
        colorStart: '#FF701F',
        colorEnd: '#FFC164',
        class: 'warning'
      },
      Quantum: {
        color: '#9983FD',
        colorStart: '#8C82FC',
        colorEnd: '#BF82FC',
        class: 'primary'
      },
      'Young Talent': {
        color: '#2aca93',
        colorStart: '#0ebb86',
        colorEnd: '#6de8ba',
        class: 'young'
      }
    }
  },
  references: {
    academicTitles: ['Assistant Professor', 'Associate Professor', 'Professor', 'Unspecified'],
    religions: ['Christianity', 'Islam', 'Buddhism', 'Other'],
    degrees: ['Bachelor degree', 'Master degree', 'Doctoral degree', 'Unspecified']
  },
  aseanCountries: [
    'Brunei Darussalam',
    'Cambodia',
    'Indonesia',
    'Lao PDR',
    'Malaysia',
    'Myanmar',
    'Philippines',
    'Singapore',
    'Thailand',
    'Viet Nam'
  ]
})

export const actions = {
  async nuxtClientInit ({ commit, state }, { $axios, error, req, $auth, $cookies }) {
    try {
      if (!state.setting) {
        const setting = await $axios.$get(`${process.env.apiUrl}${process.env.apiDirectory}setting`)
        commit('setSetting', setting)
      }
      if (!state.topbarLogos) {
        const topbarLogos = await $axios.$get(`${process.env.apiUrl}${process.env.apiDirectory}topbar-logos`)
        commit('setTopbarLogos', topbarLogos.rows)
      }
    } catch (e) {
      error({ statusCode: e.response.status, message: e.response.data.message })
    }
    commit('setFirstLoad', true)
  }
}

export const mutations = {
  setFirstLoad (state, val) {
    state.firstLoad = val
  },
  setSetting (state, val) {
    state.setting = val
  },
  setDrawer (state, val) {
    state.drawer = val
  },
  setTopbarLogos (state, val) {
    state.topbarLogos = val
  }
}
