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
        redirect_uris: ["http://localhost:3000/cb"],
        grant_types: ["authorization_code"],
        scope: "openid",
      },
    ],
    pkce: { required: () => false, methods: ["S256"] },
}

exports.module = configuration