export default {
  redirect: false,
  strategies: {
    social: {
      scheme: 'refresh',
      token: {
        property: 'access_token',
        maxAge: 3600
      },
      refreshToken: {
        property: 'refresh_token',
        data: 'refresh_token',
        maxAge: 60 * 60 * 10
      },
      endpoints: {
        refresh: {
          url: '/api/auth/token',
          method: 'post'
        },
        user: {
          url: '/api/auth/me',
          method: 'get',
          propertyName: 'user'
        },
        logout: {
          url: '/api/auth/logout',
          method: 'delete'
        }
      }
    },
    admin: {
      scheme: 'refresh',
      token: {
        property: 'access_token',
        maxAge: 3600
      },
      refreshToken: {
        property: 'refresh_token',
        data: 'refresh_token',
        maxAge: 60 * 60 * 10
      },
      endpoints: {
        login: {
          url: '/api/auth-admin/login',
          method: 'post'
        },
        refresh: {
          url: '/api/auth-admin/token',
          method: 'post'
        },
        user: {
          url: '/api/auth-admin/me',
          method: 'get',
          propertyName: 'user'
        },
        logout: {
          url: '/api/auth-admin/logout',
          method: 'delete'
        }
      }
    },
    member: {
      scheme: 'refresh',
      token: {
        property: 'access_token',
        maxAge: 3600
      },
      refreshToken: {
        property: 'refresh_token',
        data: 'refresh_token',
        maxAge: 60 * 60 * 10
      },
      endpoints: {
        login: {
          url: '/api/auth/login',
          method: 'post'
        },
        refresh: {
          url: '/api/auth/token',
          method: 'post'
        },
        user: {
          url: '/api/auth/me',
          method: 'get',
          propertyName: 'user'
        },
        logout: {
          url: '/api/auth/logout',
          method: 'delete'
        }
      }
    }
  }
}
