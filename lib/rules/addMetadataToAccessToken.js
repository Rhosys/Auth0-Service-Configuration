{
  name: 'Add user metadata to access token',
  order: 2,
  function: function (user, context, callback) {
    const namespace = 'https://api.rhosys.ch/';
    context.accessToken[namespace + 'integration'] = user.integrationData;
    context.accessToken[namespace + 'profile'] = user.tokenProfile;
    context.accessToken[namespace + 'platform'] = user.app_metadata.platformData;

    context.idToken[namespace + 'integration'] = user.integrationData;
    context.idToken[namespace + 'profile'] = user.tokenProfile;
    context.idToken[namespace + 'platform'] = user.app_metadata.platformData;
    
    callback(null, user, context);
  }
}
