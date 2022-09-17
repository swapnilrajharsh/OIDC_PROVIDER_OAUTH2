const adapter = require('../adapter/mongodb')
const accountService = require('../services/accountService')

const configuration = {
    adapter,
    async findAccount(ctx, id) {
      const account = await accountService.get(id);
      return (
        account && {
          accountId: id,
          async claims(use /* id_token, userinfo */, scope, claims) {
            if (!scope) return undefined;
            const openid = { sub: id };
            const email = {
              email: account.email,
              email_verified: account.emailVerified,
            };
            return {
              ...(scope.includes("openid") && openid),
              ...(scope.includes("email") && email),
            };
          },
        }
      );
    },
    clients: [
      {
        client_id: "app",
        client_secret: "scorpion",
        redirect_uris: ["https://google.com"],
        grant_types: [
          "authorization_code",
          "refresh_token",
          "urn:ietf:params:oauth:grant-type:device_code"
        ],
        response_type: ['code'],
        scope: "openid email profile phone address offline_access",
      },
      {
        client_id: 'client',
        grant_types: ['urn:ietf:params:oauth:grant-type:device_code', 'refresh_token'],
        response_types: [],
        redirect_uris: [],
        token_endpoint_auth_method: 'none',
        application_type: 'native',
      },
      {
        client_id: 'client-basic-auth',
        client_secret: 'secret',
        grant_types: ['authorization_code',
          'urn:ietf:params:oauth:grant-type:device_code',
          'refresh_token'],
        response_types: ['code'],
        redirect_uris: ["https://google.com"],
        token_endpoint_auth_method: 'none',
        application_type: 'native',
        scope: "openid email profile phone address offline_access",
      },
      {
        client_id: "api",
        client_secret: "night-wolf",
        redirect_uris: [],
        response_types: [],
        grant_types: ["client_credentials"],
        scope: "openid email profile phone address offline_access",
      }
    ],
    features: {

      clientCredentials: { 
        enabled: true 
      },
  
      introspection: {

        enabled: true,

        allowedPolicy(ctx, client, token) {
          if ( client.introspectionEndpointAuthMethod === "none" &&
            token.clientId !== ctx.oidc.client.clientId
          ) {
            console.log('Part a')
            return false;
          }
          console.log('Part b')
          return true;
        },
      },

      devInteractions: { enabled: false }, 

      deviceFlow: {
        charset: 'base-20', 
        enabled: true /* defaults to false*/,
        mask: '****-****',
      },

      revocation: { enabled: true }, // defaults to false
    },
    format:{
      AccessToken:'jwt'
    },
    interactions: {
      url(ctx, interaction) { // eslint-disable-line no-unused-vars
        return `/interaction/${interaction.uid}`;
      },
    },
    claims: {
      address: ['address'],
      email: ['email', 'email_verified'],
      phone: ['phone_number', 'phone_number_verified'],
      profile: ['birthdate', 'family_name', 'gender', 'given_name', 'locale', 'middle_name', 'name',
        'nickname', 'picture', 'preferred_username', 'profile', 'updated_at', 'website', 'zoneinfo'],
    },
    pkce: { 
      required: () => false, methods: ["S256"] 
    },
    ttl : {
      AccessToken: 24*60*60,//3600,
      AuthorizationCode: 60,
      DeviceCode: 600 /* 10 minutes in seconds */,
      Grant: 1209600 /* 14 days in seconds */,
      IdToken: 3600 /* 1 hour in seconds */,
      Interaction: 3600 /* 1 hour in seconds */,
      Session: 1209600 /* 14 days in seconds */,

      ClientCredentials: function ClientCredentialsTTL(ctx, token, client) {
        if (token.resourceServer) {
          return token.resourceServer.accessTokenTTL || 10 * 60; // 10 minutes in seconds
        }
        return 10 * 60; // 10 minutes in seconds
      }

    },

    resourceIndicators: {
      defaultResource(ctx) {
        return Array.isArray(ctx.oidc.params.resource)
          ? ctx.oidc.params.resource[0]
          : ctx.oidc.params.resource;
      },
      getResourceServerInfo(ctx, resourceIndicator, client) {
        return {
          scope: "api:read offline_access",
        };
      },
    },

    jwks: {
      keys: [
        {
          kty: "RSA",
          n: "jw3bixcae4ktBdXYcKeK5J7pmsXvQdvuOB8yv_q426tsMDlTZ1jj9CgYEZF_SCfzwQ5pcogLD-WY-LYJtt8zfjU_mWZZWcbR1QcMIWhLsSdi2OSlksIewMiv5CzvDBzs6h9sU0yr6yY6SYmT89jXU-D0MqSakDR0x0tyVUonGAWiVGJYINCCEbonoqFYAXjKdrNCCIliXiWQS6rajkEEXj0I2uQr4L1S80mSWWvDfFmFw4yC7V9nOGf1OPotscLCpT7vzlhHCuh3rY12bTEceZeARQ9G9aWQMBhQZPIPBvLdTRl5smFByFJ_FWs2yXXdHXFRo2L8UgwV2D4qVlgUXw",
          e: "AQAB",
          d: "PodKHUPd-X1-RnywfJ1fIosrhNFbwSfGupU4c529y5bkVTfZcuTxzrjvvE4imoGMFCiegsdgPnSXJq87E8oAEfxobj7Ec29qLHlGHhweabLTjAZ1MO7UzmNqLoxNeLfz_mn5yXdL9h7hf185Ym63wBwl4TT9smabXLlnokwlRmQXL-FWN5P50X60XgPG9hbv5BGPCrfbNNkLzae3fVeTfAZUYw-rwfrKN_HVUz78lo3cNhE2AVMnIF2CeZeH1xrUC81MWGJi7W1R1MtMTUObdqCpqLMtoWSojF3UT0pOMCiMeEt25EGpMiRVNy8HQD-z92uBEh8n2DYWb8Fou1Wa0Q",
          p: "23oJTOlWauw_fQJxBmwkfzPL_j9p_Fjtf_ThESn4ZpCkl2Y5cKSqc70bBP3SkgKRWWIt8QunkmkSHDmVzu0_UQu7YgCxqwwR8TvK8uCgNw8umtE_2w2fvf8l_863TEg4btz87kMtk01vWRUcqQxlBvd-bTmL8FDm0iblkskSpbs",
          q: "ptwhZzh1TkXFiglDz04_dC6s-Ek_qRxTtUSdhaRr7UDzpa_mEEd41m3kgmjgIlK-FgDpf66N4OWHQow76PVtRUAQSZDSPo4k8TNs5AY_oyzIBAWBnakfs8L368Vo4O3RZJ4wiMqnphTRGiM6rLOev74uTILcVnPgDZLbAm2Gb60",
          dp: "QDjIienpcKYqucDCI_f3AgW9Fmul7sJy1LNqPGSEnDaNAwRVoIF-oxld06sWN8VqlLYm7VbUtQHr27h5_q_rjCKbtUSwuHVytp0heMqD9ziJEaJTRh0JdkY370-k0Tx8zuv5UxrzNhw9jdqgpVLMKSq4outo6Gwz7qCVIsuVmks",
          dq: "FHPNAFryPfrdYLMMBcAAlRwXhYNs8yyOshxL9pKVzAn3E2sBFyO7kwT7SmTSfEKKHCZWeJkLuPJJZwXLXh2fHCrjFDFVI-fGbW4xPa3qZPTbO2r1XT7arO0L-HFFDrT3wo6FQm8cp4XLr5l72qlVnwkPob80hMBFSUSj5aNJJC0",
          qi: "MJJ6KTrCdq1gEgH-MpDF4DeXhE_dlB1P2am3juUR8ieZmohWbruBo6vmA_9Fm_lUs6V3qZ7gjbszguQZwcIFnvXceOBMH35_8TQLM3IrnNTJJTyWslrH3rdLAsIPk_x0cgIJ_gC0BHiQ9TfW8mKjGAK0JRv-V8XXnT4ZFQrlmQI",
        },
      ],
    },
    cookies: {
      keys: ["subzero"],
    },

}

module.exports = configuration