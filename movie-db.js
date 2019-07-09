$(document).ready(function() {
  $("#search-submit").click(function(e) {
    e.preventDefault();

    let searchCriteria = $("#search-bar")[0].value;

    window.location.href = `search-results.html?query=${searchCriteria}`;
  });
  let actordId = getUrlParameter("actorId");
  let movieId = getUrlParameter("movieId");

  if (actordId !== "") {
    getActorDetails(actordId);
  }
  if (movieId !== "") {
    getMovieDetails(movieId);
  }
  GetData();
  loadCarousel();
  top10Movies();
});
$("#carouselExampleCaptions").bind("slid.bs.carousel", function(e) {
  upcomingMovieActors();
});
function getUrlParameter(name) {
  name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
  var regex = new RegExp("[\\?&]" + name + "=([^&#]*)");
  var results = regex.exec(location.search);
  return results === null
    ? ""
    : decodeURIComponent(results[1].replace(/\+/g, " "));
}
function GetData() {
  let searchCriteria = getUrlParameter("query");
  let link = `https://api.themoviedb.org/3/search/multi?api_key=9d11c1773b21ad7a4a5761cc1454361b&language=en-US&query=${searchCriteria}&page=1&include_adult=false`;

  var settings = {
    async: true,
    crossDomain: true,
    url: link,
    method: "GET",
    headers: {},
    data: "{}"
  };

  $.ajax(settings).done(function(response) {
    let searchResults = response.results;
    let id = 0;
    $.each(searchResults, function(i, value) {
      id++;
      let searchObjects = value;
      let newDiv = document.createElement("div");
      newDiv.id = "results" + id;
      newDiv.className = "boxes";
      let target = $("#load-search-data");
      let newTarget = $("#results" + id);

      if (searchObjects.media_type === "movie") {
        let movieImg = searchObjects.poster_path;
        let title = searchObjects.original_title;
        let rating = searchObjects.vote_average;
        let overview = searchObjects.overview;
        let div = document.createElement("div");
        div.innerHTML = title + "<br>" + rating + "<br>" + overview;

        // Create images
        var imageTag = document.createElement("img");
        imageTag.src = `https://image.tmdb.org/t/p/w500/${movieImg}`;
        imageTag.alt = title;
        newTarget.append(imageTag);
        newTarget.append(div);
      } else if (searchObjects.media_type === "person") {
        let personImg = searchObjects.profile_path;
        let name = searchObjects.name;
        let movies = searchObjects.known_for;

        let div = document.createElement("div");
        div.innerHTML =
          "<h2>" +
          name +
          "</h2><br><h3>" +
          "Known for these Movies/Shows:" +
          "</h3><br>";
        let newTarget = $("#load-search-data");
        var imageTag = document.createElement("img");
        imageTag.src = `https://image.tmdb.org/t/p/w500/${personImg}`;
        imageTag.alt = name;
        newTarget.append(imageTag);
        newTarget.append(div);
        $.each(movies, function(c, names) {
          workTitles = names.original_title + ", ";
          div.append(workTitles);
        });
      }
      target.append(newDiv);
    });
  });
}
function loadCarousel() {
  let carousel = $(".carousel-inner");

  var settings = {
    async: true,
    crossDomain: true,
    url:
      "https://api.themoviedb.org/3/movie/upcoming?api_key=9d11c1773b21ad7a4a5761cc1454361b&language=en-US&page=1",
    method: "GET",
    headers: {},
    data: "{}"
  };

  $.ajax(settings).done(function(response) {
    let results = response.results;
    $.each(results, function(i, value) {
      let movieTitle = value.original_title;
      let desc = value.overview;
      let newDiv = document.createElement("div");
      let newDiv2 = document.createElement("div");
      newDiv.className = "carousel-item";
      newDiv.id = value.id;
      let image = document.createElement("img");
      image.src = `https://image.tmdb.org/t/p/original/${value.backdrop_path}`;
      image.className = "d-block w-100";
      if (i === 0) {
        newDiv.className = "carousel-item active";
      }
      carousel.append(newDiv);
      newDiv.append(image);
      newDiv.append(newDiv2);
      newDiv2.innerHTML = `<h2>${movieTitle}</h2><p>${desc}</p>`;
    });
  });
}
function top10Movies() {
  var settings = {
    async: true,
    crossDomain: true,
    url:
      "https://api.themoviedb.org/3/movie/top_rated?page=1&language=en-US&api_key=9d11c1773b21ad7a4a5761cc1454361b",
    method: "GET",
    headers: {},
    data: "{}"
  };

  $.ajax(settings).done(function(response) {
    let topMovies = response.results.slice(0, 10);
    let id = 0;
    $.each(topMovies, function(i, value) {
      let link = document.createElement("a");
      link.href = `file:///Users/Danny/Projects/movie-db/movies.html?movieId=${
        value.id
      }`;
      let div1 = document.createElement("div");
      div1.className = "card";
      let image1 = document.createElement("img");
      image1.id = value.id;
      image1.data = "movie";
      image1.src = `https://image.tmdb.org/t/p/original/${value.poster_path}`;
      image1.className = "card-img-top";
      let div2 = document.createElement("div");
      div2.className = "card-body";
      let h5 = document.createElement("h5");
      h5.className = "card-title";
      h5.innerHTML = value.original_title;
      let p = document.createElement("p");
      p.className = "card-text";
      p.innerHTML = value.overview;
      link.append(image1);
      div1.append(link);
      div2.append(h5, p);
      div1.append(div2);
      $("#top-movies").append(div1);
      id++;
    });
  });
}
function upcomingMovieActors() {
  let activeSlide = $(".active");
  let movieId = activeSlide[1].id;

  var settings = {
    async: true,
    crossDomain: true,
    url: `https://api.themoviedb.org/3/movie/${movieId}/credits?api_key=9d11c1773b21ad7a4a5761cc1454361b`,
    method: "GET",
    headers: {},
    data: "{}"
  };
  let targetDiv = $("#movie-actors")[0];
  while (targetDiv.firstChild) {
    targetDiv.removeChild(targetDiv.firstChild);
  }
  $.ajax(settings).done(function(response) {
    let results = response.cast;
    console.log(results);
    let cast = results.slice(0, 3);
    let castDiv = $("#movie-actors");
    let actorDiv = document.createElement("div");
    actorDiv.className = "actor-div";
    for (let i = 0; i < cast.length; i++) {
      let imageLink = document.createElement("a");
      imageLink.href = `file:///Users/Danny/Projects/movie-db/actors.html?actorId=${
        cast[i].id
      }`;
      imageLink.id = cast[i].id;
      let castImg = document.createElement("img");
      castImg.className = "actor-images";
      castImg.data = "actor";
      let actorImg = cast[i].profile_path;
      castImg.src = `https://image.tmdb.org/t/p/original${actorImg}`;
      imageLink.append(castImg);
      actorDiv.append(imageLink);
    }
    castDiv.append(actorDiv);
  });
}
function getMovieDetails(id) {
  var settings = {
    async: true,
    crossDomain: true,
    url: `https://api.themoviedb.org/3/movie/${id}?language=en-US&api_key=9d11c1773b21ad7a4a5761cc1454361b`,
    method: "GET",
    headers: {},
    data: "{}"
  };

  $.ajax(settings).done(function(response) {
    let poster = document.createElement("div");
    poster.innerHTML = `<img style="margin:0px auto;  width:800px !important ; height: 500px; width:100%; background-repeat:no-repeat; background-size:cover;" src="https://image.tmdb.org/t/p/w500${
      response.backdrop_path !== undefined
        ? response.backdrop_path
        : response.poster_path
    }" />  
  <div style="text-align:left; padding: 30px; margin:0px auto; background-color:white; max-width:800px;"><div style="">
    <h1 class="primary-header">${response.original_title}</h1>
    <p style=" text-align:left;">${response.overview}</p>
    <div style="width:80%; text-align:left; padding-top:30px;">
    <p>Release Date: ${response.release_date}</p>  
    <p> Status: ${response.status}</p> 
    <p> Vote Average: ${response.vote_average}</p>
    <ul id="reviews"><b>Reviews:<b></ul>
    </div>
    </div>
    <a class="primary-btn" href="${response.homepage}">Live Site</a>
  </div>`;
    getMovieReviews(id);
    $(poster).addClass("poster");
    $("#movie-details").append(poster);
  });
}
function getActorDetails(actorId) {
  var settings = {
    async: true,
    crossDomain: true,
    url: `https://api.themoviedb.org/3/person/${actorId}?api_key=08f123202c02b3f6e43980f02514a11d&language=en-US`,
    method: "GET",
    headers: {},
    data: "{}"
  };

  $.ajax(settings).done(function(response) {
    console.log(response);
    let poster = document.createElement("div");
    poster.innerHTML = `<img style="margin:0px auto;  width:800px !important ; height: 500px; width:100%; background-repeat:no-repeat; background-size:cover;" src="https://image.tmdb.org/t/p/w500${
      response.profile_path !== undefined
        ? response.profile_path
        : response.poster_path
    }" />  
  <div style="text-align:left; padding: 0px; margin:0px auto; background-color:white; max-width:800px;"><div style="">
    <h1 class="primary-header">${response.name}</h1>
    <p style=" text-align:left;">Born: ${response.birthday}</p>
    <p> Place of Birth: ${response.place_of_birth}</p>
    <div style="width:80%; text-align:left; padding-top:30px;">
    <p>Biography: ${response.biography}</p>  
    <p>Popularity: ${response.popularity}</p>
    <div id="works-list">List of Works</div>
    </div>
    </div>
    <a class="primary-btn" href="${response.homepage}">Live Site</a>
  </div>`;
    getActorsMovies(`${response.id}`);
    $(poster).addClass("poster");
    $("#actor-details").append(poster);
  });
}

function getActorsMovies(id) {
  var settings = {
    async: true,
    crossDomain: true,
    url: `https://api.themoviedb.org/3/person/${id}/combined_credits?language=en-US&api_key=08f123202c02b3f6e43980f02514a11d`,
    method: "GET",
    headers: {},
    data: "{}"
  };

  $.ajax(settings).done(function(response) {
    console.log(response);
    let destination = $("#works-list");
    let list = document.createElement("ul");
    $.each(response.cast, function(i, value) {
      console.log(value);

      let newItem = document.createElement("li");
      newItem.innerText = !value.original_title
        ? value.name
        : value.original_title;
      list.append(newItem);
    });
    destination.append(list);
  });
}
function getMovieReviews(id) {
  var settings = {
    async: true,
    crossDomain: true,
    url: `https://api.themoviedb.org/3/movie/${id}/reviews?page=1&language=en-US&api_key=08f123202c02b3f6e43980f02514a11d`,
    method: "GET",
    headers: {},
    data: "{}"
  };

  $.ajax(settings).done(function(response) {
    let div = $("#reviews");
    $.each(response.results, function(i, value) {
      console.log(value);
      let p = document.createElement("li");
      p.innerText = value.content;
      div.append(p);
    });
  });
}
