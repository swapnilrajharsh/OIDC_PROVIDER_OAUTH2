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
          "urn:ietf:params:oauth:grant-type:device_code",
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
    ],
    features: {
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
      Session: 1209600 /* 14 days in seconds */
    }

}

module.exports = configuration