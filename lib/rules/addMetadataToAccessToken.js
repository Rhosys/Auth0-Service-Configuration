function (user, context, callback) {
  const namespace = 'https://api.rhosys.ch/';
  context.accessToken[namespace + 'integration'] = user.integrationData;
  context.accessToken[namespace + 'profile'] = user.tokenProfile;
  callback(null, user, context);
}
