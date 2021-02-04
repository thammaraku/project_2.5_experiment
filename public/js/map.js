
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

//////////////////////////// FUNCTIONS ////////////////////////////////////////

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

// POST Request to Location Table
function postLocation(geoLocationObj) {
  // console.log("postLocations.userEmail = " + geoLocationObj.userEmail);
  // console.log("postLocations.place = " + geoLocationObj.place);
  // console.log("postLocations.lat = " + geoLocationObj.lat);
  // console.log("postLocations.lang = " + geoLocationObj.lang);

  const userEmail = geoLocationObj.userEmail;
  const place = geoLocationObj.place;
  const latitude = geoLocationObj.lat;
  const longitude = geoLocationObj.lang;

  $.post("/api/location", {
    userEmail: userEmail,
    place: place,
    latitude: latitude,
    longitude: longitude
  })
    .then(() => {
      // window.location.replace("/user_journal");
    })
    .catch(err => {
      console.log(err);
    });
}

// Import user input from form to get latitude and longitude from google service then return as object to render map and marker
function getGeolocation(newAdd) {
  infowindow = new google.maps.InfoWindow();
  var map = new google.maps.Map(document.getElementById("map"));

  const request = {
    query: newAdd.placeName,
    fields: ["name", "geometry"]
  };

  // To get latitude and longitude from google service
  service = new google.maps.places.PlacesService(map);
  service.findPlaceFromQuery(request, (results, status) => {
    if (status === google.maps.places.PlacesServiceStatus.OK) {
      for (let i = 0; i < results.length; i++) {
        // console.log("results.length = " + results.length);
        infowindow.setContent(results[i].name);
        infowindow.open(map);

        var latitude = results[i].geometry.location.lat();
        var longitude = results[i].geometry.location.lng();

        // Then return as object to render map and marker
        const geoLocationObj = {
          "userEmail": newAdd.userEmail,
          "place": newAdd.placeName,
          "lat": latitude,
          "lang": longitude
        }
        collectUserSearch(geoLocationObj);
      }
    }
  });
}

// Render all locations on one journal
function collectUserSearch(geoLocationObj) {
  // console.log("collectUserSearch geoLocationObj = " + geoLocationObj);
  userListArr.push(geoLocationObj);

  // Render new userListArr
  // renderJournal(userListArr);
  initMap(userListArr);
  // console.log("under collectUserSearch before postLocation geoLocationObj = " + geoLocationObj);
  postLocation(geoLocationObj);

}

// function renderJournal() {
//   console.log("userListArr.length under renderJournal = " + userListArr.length);
//   if (userListArr) {
//     for (var i = 0; i < userListArr.length; ++i) {
//       $(`#row${i}`).html(`<td><p class="">${userListArr[i].place} ${userListArr[i].date}
//       <button class="" style="float:right"><i class="fas fa-trash-alt"></i></button>
//       <button class="" style="float:right"><i class="fas fa-camera"></i></button></p>
//       <p class="">${userListArr[i].journal}</p>
//       </td>`);
//     }
//   }
// }



// To have a landing map when array is first empty
function landingMap() {

  // let newAddArr = [];
  // const userListArr = [];
  // const newAdd = {};
  // const geoLocationObj = {};
  // console.log("newAddArr.length under landingMap = " + newAddArr.length);


  const map = new google.maps.Map(document.getElementById("map"), {
    zoom: 2,
    // landing page center on united states
    center: new google.maps.LatLng(37.0902, -95.7129),
    mapTypeId: 'satellite'
  });
}


function handleSearchBtnSubmit(event) {
  event.preventDefault;


  // console.log("under handleSearchBtnSubmit memberEmail = " + memberEmail);
  // console.log("newAddArr.length under Search Button = " + newAddArr.length);

  var newAdd = {
    // placeName: $('input').val(),
    userEmail: memberEmail,
    placeName: $('#placeForm').val(),
    date: $("#date").val(),
    journal: $("#journal-body").val(),
    tripName: $("#tripName").val(),
  };

  // getGeolocation(newAdd.placeName);
  getGeolocation(newAdd);
  postJournal(newAdd);

  newAddArr.push(newAdd);
  renderJournal2(newAddArr);

  $('#placeForm').val("");
  $("#date").val("");
  $("#journal-body").val("");

}

// POST Request to database
function postJournal(newAdd) {
  const userEmail = newAdd.userEmail;
  const tripName = newAdd.tripName;
  const placeName = newAdd.placeName;
  const date = newAdd.date;
  const journal = newAdd.journal;

  $.post("/api/journal", {
    userEmail: userEmail,
    journalTitle: tripName,
    location: placeName,
    start_date: date,
    journalEntry: journal
  })
    .then(() => {
      // window.location.replace("/user_journal");
    })
    .catch(err => {
      console.log(err);
    });
}

// Render Journal from the Array
function renderJournal2(newAddArr) {
  console.log("newAddArr.length under renderJournal2 = " + newAddArr.length);

  for (var i = 0; i < newAddArr.length; ++i) {
    console.log("newAddArr[i].userEmail = " + newAddArr[i].userEmail);
    console.log("newAddArr[i].placeName = " + newAddArr[i].placeName);
    console.log("newAddArr[i].date = " + newAddArr[i].date);
    console.log("newAddArr[i].journal = " + newAddArr[i].journal);
    console.log("newAddArr[i].tripName = " + newAddArr[i].tripName);

    $(`#row${i}`).html(`<td class="journal_table"><p>${newAddArr[i].placeName} - ${newAddArr[i].date}
  <button class="" style="float:right"><i class="fas fa-trash-alt"></i></button>
  <button class="" style="float:right"><i class="fas fa-camera"></i></button></p>
  <p class="">${newAddArr[i].journal}</p>
  </td>`);
  }

}

function handlePushBtnSubmit(event) {
  event.preventDefault;

  $('#placeForm').val("");
  $("#date").val("");
  $("#journal-body").val("");
  $("#tripName").val("");
  $(".journal_table").remove();


  // Clear out array on Map and Journal
  newAddArr = [];
  userListArr = [];
  geoLocationObj = {};

  // init map to the default location
  landingMap()

}


//////////////////////////// EXECUTION ////////////////////////////////////////

$(document).ready(function () {


  $.get("/api/user_data").then(data => {
    $(".member-name").text(data.email);
    memberEmail = data.email;
    // console.log(memberEmail);
  });

  // Render user journal list
  // renderJournal();

  // Render map section
  if (userListArr.length === 0) {
    // Landing page when array is first empty
    landingMap();
  } else {
    // Render map with existing array
    initMap(userListArr);
  }

  // When user click to search a place
  $(document).on("click", "#searchBtn", handleSearchBtnSubmit);


  // When user click to finish a journal
  $(document).on("click", "#pushBtn", handlePushBtnSubmit);


});
