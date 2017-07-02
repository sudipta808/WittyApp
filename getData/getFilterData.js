exports.getFilteredData = function (request, response, db) {
    var categoryId = request.query.categoryId.toString();
    var ref = db.ref("wittyDataSource");
    ref.child("wittyList").orderByChild("categoryId").on("value", function (snapshot) {
        filterWittyData(snapshot, categoryId).then(function (filterData) {
            if(filterData) {
                response.json({data: {totalItem: filterData.length, wittyList: filterData}});
            }
        });
    });
};

var filterWittyData = function (snapshot, categoryId) {
    return new Promise(function (resolve, reject) {
        var wittyDataSource = [];
        snapshot.forEach(function(data) {
            if(categoryId) {
                if(categoryId === data.val().categoryId.toString()) {
                    wittyDataSource.push(data);
                }
            }
        });

        if(wittyDataSource) {
            resolve(wittyDataSource);
        }
        else {
            reject(wittyDataSource);
        }
    });
};