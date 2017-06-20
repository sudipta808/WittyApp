exports.wittyAppCategory = function (response, db) {
    fetchCategoryFromFirebase(response, db);
};

var fetchCategoryFromFirebase = function (response,db) {
    var ref = db.ref("category");
    ref.once("value", function(snapshot) {
        var categoryDataSource = [];
        snapshot.forEach(function (data) {
            categoryDataSource.push(data.val());
        });
        console.log(categoryDataSource);
        response.json({data: categoryDataSource});
    }, function (errorObject) {
        response.status(500).send("The read failed: " + errorObject.code);
    });
};