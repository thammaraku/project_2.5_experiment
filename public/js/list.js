
// Initialize and add the map
let map;
let service;
let infowindow;


let userListArr = [];
// var userListArr = [{
//   "place": "franklin bbq",
//   "latlang": (30.2701188, -97.7313156)
// }];

let newAddArr = [];
let geoLocationObj = {};
let memberEmail;



function getLoggedinEmail() {
  $.get("/api/user_data").then(data => {
    $(".member-name").text(data.email);
    memberEmail = data.email;
    console.log(memberEmail);
  });
}

function initMap() {
  const map = new google.maps.Map(document.getElementById("map"), {
    zoom: 4,
    // center: { lat: -25.344, lng: 131.036 },
    // center: new google.maps.LatLng(37.0902, -95.7129)
  });

  // Drop pins on all locations
  const latlngbounds = new google.maps.LatLngBounds();

  if (userListArr.length === 1) {
    const markerLocation = new google.maps.LatLng(
      userListArr[0].lat,
      userListArr[0].lang
    );

    const map = new google.maps.Map(document.getElementById("map"), {
      zoom: 12,
      // center: { lat: -25.344, lng: 131.036 },
      center: new google.maps.LatLng(userListArr[0].lat, userListArr[0].lang)
    });

    const marker = new google.maps.Marker({
      position: new google.maps.LatLng(userListArr[0].lat, userListArr[0].lang),
      map: map
    });

  } else {

    for (i = 0; i < userListArr.length; i++) {
      const markerLocation = new google.maps.LatLng(
        userListArr[i].lat,
        userListArr[i].lang
      );

      // eslint-disable-next-line no-unused-vars
      const marker = new google.maps.Marker({
        // position: { lat: -25.344, lng: 131.036 },
        position: markerLocation,
        map: map
      });
      latlngbounds.extend(markerLocation);
    }
    map.fitBounds(latlngbounds);

  }

}

function getJournals() {
  $.get("/api/journal", function(data) {
    var allJournals = data;
    console.log("allJournals.length = " + allJournals.length);
  });
}

function getLocations() {
  $.get("/api/location", function(data) {
    var allLocations = data;
    console.log("allLocations.length = " + allLocations.length);
  });
}


//////////////////////////// EXECUTION ////////////////////////////////////////

$(document).ready(function () {

  getLoggedinEmail();

  getJournals();

  getLocations()



  // This function grabs posts from the database and updates the view
  // function getJournal(memberEmail) {
  //   authorId = author || "";
  //   if (authorId) {
  //     authorId = "/?author_id=" + authorId;
  //   }
  //   $.get("/api/posts" + authorId, function(data) {
  //     console.log("Posts", data);
  //     posts = data;
  //     if (!posts || !posts.length) {
  //       displayEmpty(author);
  //     }
  //     else {
  //       initializeRows();
  //     }
  //   });

    // This function grabs posts from the database and updates the view
  // function getPosts(author) {
  //   authorId = author || "";
  //   if (authorId) {
  //     authorId = "/?author_id=" + authorId;
  //   }
  //   $.get("/api/posts" + authorId, function(data) {
  //     console.log("Posts", data);
  //     posts = data;
  //     if (!posts || !posts.length) {
  //       displayEmpty(author);
  //     }
  //     else {
  //       initializeRows();
  //     }
  //   });
  // }
  // }




});
