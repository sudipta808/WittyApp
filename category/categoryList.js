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

        if(categoryDataSource[0].categoryList) {
            updateCategoryItemCount(categoryDataSource[0].categoryList, db).then(function (filteredData) {
                if(filteredData) {
                    categoryDataSource[0].categoryList = filteredData;
                    response.json({data: categoryDataSource});
                }
            });
        }

    }, function (errorObject) {
        response.status(500).send("The read failed: " + errorObject.code);
    });
};

var updateCategoryItemCount = function (categoryDataSource, db) {
  return new Promise(function (resolve, reject) {
      var ref = db.ref("wittyDataSource");
      var count = 0;
      ref.child("wittyList").orderByChild("categoryId").on("value", function (snapshot) {
          categoryDataSource.forEach(function (element) {
              count++;
              element.totalCount = filterWittyData(snapshot, element.id);
              if(count === categoryDataSource.length){
                  resolve(categoryDataSource);
              }
          }, function (error) {
              reject(error);
          });
      });
  });
};

var filterWittyData = function (snapshot, categoryId) {
    var count = 0;

    snapshot.forEach(function(data) {
        if(categoryId) {
            if(categoryId.toString() === data.val().categoryId.toString()) {
                count++;
            }
        }
    });

    return count;
};