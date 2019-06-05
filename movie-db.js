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
        let id = 0;
        $.each(searchResults, function(i, value){
            id++;
            let searchObjects = value;
            console.dir(searchObjects);
            let newDiv = document.createElement("div");
            newDiv.id = "results" + id;
            newDiv.className = "boxes";
            let target = $("#load-search-data");
            target.append(newDiv);
            let newTarget = $("#results" + id)

            if (searchObjects.media_type === "movie"){
                let movieImg = searchObjects.poster_path;
                let title = searchObjects.original_title;
                let rating = searchObjects.vote_average;
                let overview = searchObjects.overview;
                let div = document.createElement("div");
                div.innerHTML = title + "<br>" + rating + "<br>" + overview;
                


                // Create images
                var imageTag = document.createElement("img");
                imageTag.src = `${"https://image.tmdb.org/t/p/w500/" + movieImg}`
                imageTag.alt = title;
                newTarget.append(imageTag);
                newTarget.append(div);
            } else if (searchObjects.media_type === "person") {
                let personImg = searchObjects.profile_path;
                let name = searchObjects.name;
                let movies = searchObjects.known_for;
                

                let div = document.createElement("div");
                div.innerHTML = "<h2>" + name + "</h2><br><h3>" + "List of Movies/Shows:" + "</h3><br>";
                let newTarget = $("#load-search-data")
                var imageTag = document.createElement("img");
                imageTag.src = `${"https://image.tmdb.org/t/p/w500/" + personImg}`
                imageTag.alt = name;
                newTarget.append(imageTag);
                newTarget.append(div);
                $.each(movies, function(c, names){
                    workTitles = names.original_title + ", ";
                    div.append(workTitles);
                })

            }
        }) 
    });        
}   
function loadCarousel(){
    let carousel = $(".carousel-inner")

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
        let results = response.results;
        $.each(results, function(i, value){
            console.log(value);
            let movieTitle = value.original_title;
            let desc = value.overview;
            let newDiv = document.createElement("div");
            let newDiv2 = document.createElement("div");
            newDiv.className = "carousel-item"
            let image = document.createElement("img");
            image.src = `${"https://image.tmdb.org/t/p/original/" + value.backdrop_path}`
            image.className = "d-block w-100"
            if(i===0){
                newDiv.className = "carousel-item active";
            }
            carousel.append(newDiv);
            newDiv.append(image)
            newDiv.append(newDiv2);
            newDiv2.innerHTML = `${"<h2>" + movieTitle + "</h2><p>" + desc + "</p>"}`
        })
    });
}