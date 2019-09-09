{
  name: 'Add PlatformUserId if the user does not already have one',
  order: 1,
  function: function (user, context, callback) {
    const uuid = require('uuid@3.3.2');
    if (user.app_metadata && !user.app_metadata.platformData) {
      return callback(new Error('Auth0RuleForPlatformIdAppMetadataExistsError'));
    }
    if (user.app_metadata) {
      return callback(null, user, context);
    }
  	user.app_metadata = {
    	platformData: {
      	userId: uuid.v4()
      }
    };
    return auth0.users.updateAppMetadata(user.user_id, user.app_metadata)
      .then(function(){
      callback(null, user, context);
    })
      .catch(function(err){
      callback(err);
    });
  }
};