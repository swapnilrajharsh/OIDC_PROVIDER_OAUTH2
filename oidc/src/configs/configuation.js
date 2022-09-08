const configuration = {
    async findAccount(ctx, id) {
      return {
        accountId: id,
        async claims(use /* id_token, userinfo */, scope, claims) {
          return { sub: id };
        },
      };
    },
    clients: [
      {
        client_id: "app",
        client_secret: "scorpion",
        redirect_uris: ["https://google.com"],
        grant_types: ["authorization_code"],
        response_type: ['code'],
        scope: "openid email profile phone address offline_access",
      },
    ],
    features: {
      devInteractions: { enabled: false }, 
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
    pkce: { required: () => false, methods: ["S256"] },
}

module.exports = configuration