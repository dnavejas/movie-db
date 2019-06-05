$(document).ready(function () {
    $("#search-submit").click(function (e) { 
        e.preventDefault()

        let searchCriteria = $("#search-bar")[0].value;

        window.location.href = `search-results.html?query=${searchCriteria}`;
    });
    GetData();
    loadCarousel();
});

function getUrlParameter(name) {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    var results = regex.exec(location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
};

function GetData(){
    let searchCriteria = getUrlParameter('query');
    let link = `${"https://api.themoviedb.org/3/search/multi?api_key=9d11c1773b21ad7a4a5761cc1454361b&language=en-US&query="+searchCriteria+"&page=1&include_adult=false"}`

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
            console.dir(searchObjects);
            if (searchObjects.media_type === "movie"){
                let movieImg = searchObjects.poster_path;
                let title = searchObjects.original_title;
                let rating = searchObjects.vote_average;
                let overview = searchObjects.overview;
                let div = document.createElement("div");
                div.innerHTML = title + "<br>" + rating + "<br>" + overview;
                let target = $("#load-search-data")


                // Create images
                var imageTag = document.createElement("img");
                imageTag.src = `${"https://image.tmdb.org/t/p/w500/" + movieImg}`
                target.append(imageTag);
                target.append(div);
            } else if (searchObjects.media_type === "person") {
                let personImg = searchObjects.profile_path;
                let name = searchObjects.name;
                let movies = searchObjects.known_for;
                let works = $.each(movies, function(i, value){
                    
                    let workName = value.original_title;
                    return workName;
                })
                console.log(works); 


                let div = document.createElement("div");
                div.innerHTML = "<h2>" + name + "</h2>" + "<br>" + "List of Movies/Shows:" + "<br>" + works;
                let target = $("#load-search-data")
                var imageTag = document.createElement("img");
                imageTag.src = `${"https://image.tmdb.org/t/p/w500/" + personImg}`
                target.append(imageTag);
                target.append(div);

            }
        }) 
    });        
}   
function loadCarousel(){
    var settings = {
        "async": true,
        "crossDomain": true,
        "url": "https://api.themoviedb.org/3/movie/upcoming?api_key=9d11c1773b21ad7a4a5761cc1454361b&language=en-US&page=1",
        "method": "GET",
        "headers": {},
        "data": "{}"
        }
        
        $.ajax(settings).done(function (response) {
        console.dir(response.results);
        });
    }