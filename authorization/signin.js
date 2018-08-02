exports.signin = function(request, response, firebaseAdmin) {

    firebaseAdmin.auth().createUser({
        email: request.body.email.toString(),
        emailVerified: false,
        phoneNumber: request.body.phoneNumber.toString(),
        password: request.body.password.toString(),
        displayName: request.body.displayName.toString(),
        photoURL: request.body.profileImage.toString(),
        disabled: false
      })
        .then(function(userRecord) {
          response.json({status: 'ok', uid: userRecord.uid});
        })
        .catch(function(error) {
          response.status(500).send(error);
        });
}