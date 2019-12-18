{
  name: 'Add user metadata to access token',
  order: 2,
  function: function (user, context, callback) {
    const namespace = 'https://api.rhosys.ch/';
    context.accessToken[namespace + 'integration'] = user.integrationData;
    context.accessToken[namespace + 'platform'] = user.app_metadata.platformData;
    context.accessToken[namespace + 'profile'] = {
      username: user.username || user.tokenProfile && user.tokenProfile.username,
      email: user.email || user.tokenProfile && user.tokenProfile.email,
      email_verified: user.email_verified || user.tokenProfile && user.tokenProfile.email_verified,
      name: user.name || user.tokenProfile && user.tokenProfile.name,
      given_name: user.given_name || user.tokenProfile && user.tokenProfile.given_name,
      family_name: user.family_name || user.tokenProfile && user.tokenProfile.family_name,
      picture: user.picture || user.tokenProfile && user.tokenProfile.picture,
      locale: user.locale || user.tokenProfile && user.tokenProfile.locale,
      tz: user.tz || user.tokenProfile && user.tokenProfile.tz
    };

    context.idToken[namespace + 'integration'] = user.integrationData;
    context.idToken[namespace + 'platform'] = user.app_metadata.platformData;
    
    callback(null, user, context);
  }
}
