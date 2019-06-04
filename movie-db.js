$(document).ready(function () {
    $("#search-submit").click(function (e) { 
        let searchCriteria = $("#search-bar")[0].value;
        let result = searchCriteria.split(" ").join("%20");
        let link = `${"https://api.themoviedb.org/3/search/multi?api_key=9d11c1773b21ad7a4a5761cc1454361b&language=en-US&query="+result+"&page=1&include_adult=false"}`

        var settings = {
            "async": true,
            "crossDomain": true,
            "url": link,
            "method": "GET",
            "headers": {},
            "data": "{}"
        }
          
        $.ajax(settings).done(function (response) {
            let searchResults = response.results;
            $.each(searchResults, function(i, value){
                let searchObjects = value;
                $.each(searchObjects, function (i, value){
                    let div = document.createElement("div");
                    $("#load-search-data").append(div, value)
                })
               
            });
        });        
    });
    // function captureSearch(){
    // }
});