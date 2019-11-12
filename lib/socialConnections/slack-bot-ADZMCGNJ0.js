{
  getUserProfile: function(accessToken, ctx, cb) {
    request.get({
      url: 'https://slack.com/api/users.info',
      qs: {
        user: ctx.user_id,
        token: ctx.bot.bot_access_token,
        include_locale: true
      }
    }, function(err, resp, body) {
      if (err) return cb(err);
      if (resp.statusCode !== 200) return cb(new Error(body));
  
      var slackResponse = JSON.parse(body);
      if (!slackResponse.ok) return cb(new Error(body));
  
      function encrypt(data) {
        const stringData = Buffer.from(JSON.stringify(data), 'utf8');
        const key = `-----BEGIN PUBLIC KEY-----
  MIICIjANBgkqhkiG9w0BAQEFAAOCAg8AMIICCgKCAgEAn/vCwHOrGGCa01jsyByY
  y9k85HPkOYvv1k7KBtCdUhJlWyPQ6QcqSgXFHQPdVnVK1hLjOcaXvCde3QUZR74C
  6HFOQt3j+/DEzXhbqJSrsxyNQTj//dTy8K+OO4R5Lo92Zd0RFHl/YOpHqFm5DR2J
  b5GLzmztLPf3HD6+pbMP4QqNSG0VgtXX16ZXqdLariiIJ9kegwg00GTr/UlX70dz
  PHOR6W2L7Ue+wvrhLywI6YGnRZ8OlBbhttrIPTpXThthsDVkTjDgGSdbeAOhB2Ut
  j7fJxDzGZBJHX/o8G9r+kJlx3VWD7mK7xDeuKoAUAXkeUUFTjmACN0ZPqSWaIQ1y
  dfxxjjAANGlDv78I3FnkrPQHQOY84y8SdwfOCYUExFCZBAhkvp1xOvyi1jraD0f0
  RNJQHzfUW2L8pYJQOvza+RXVX7Hi8POzaOVQK3yWDtLwVXElMPpv/heurWdbjR6S
  REkGJaHZA8C/4tbzcq5ySZruS11WovAOntwP3HN/nkzPRShK6wsBTj8wjKb/VYjs
  b9IaEv13JtXiHkRPPPaXeBYPkCwQErSpW1usn3OtILVRFK0m7Sxg9BQzQtSLMes2
  fup5yG382iB3fv4J7dj5+pR/xiXJWuCeLp5Y6gyo52zGWvZqvpkzLE/3+IZFN+c2
  Ub+hvFwMkbAQzZn6RnfZhrMCAwEAAQ==
  -----END PUBLIC KEY-----`
        const encryptedText = crypto.publicEncrypt(key, stringData);
        return encryptedText.toString('base64')
      };
      const tokenProfile = {
        username: slackResponse.user.name,
        email: slackResponse.user.profile.email,
        email_verified: !!slackResponse.user.profile.email,
        nickname: slackResponse.user.display_name,
        name: slackResponse.user.real_name,
        given_name: slackResponse.user.profile.first_name,
        family_name: slackResponse.user.profile.last_name,
        picture: slackResponse.user.profile.image_192,
        locale: slackResponse.user.locale,
        tz: slackResponse.user.tz
      };
      const profile = {
        user_id: ctx.user_id,
        tokenProfile,
        ...tokenProfile,
        integrationData: {
          type: 'SLACK',
          encrypted: encrypt({
            userAccessToken: accessToken,
            botAccessToken: ctx.bot && ctx.bot.bot_access_token
          }),
          appUserId: ctx.bot && ctx.bot.bot_user_id,
          appId: 'ADZMCGNJ0',
          userId: ctx.user_id,
          teamId: ctx.team_id,
          teamName: ctx.team_name,
          loginId: `slack|${ctx.user_id}`,
          savedScopes: ctx.scope
        }
      };
      cb(null, profile);
    });
  }
}