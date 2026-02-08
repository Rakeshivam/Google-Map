let markers = [];
let infos = [];
let map;
let isSatellite = false;

$("#btn1").click(() => {
  markers.forEach((m) => m.setMap(null));
  markers = [];
});

$("#btn2").click(() => {
  infos.forEach((i) => i.close());
  infos = [];
});

function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    zoom: 7,
    center: { lat: 28.6448, lng: 77.2167 },
    mapTypeId: "roadmap",
  });

  addDefaultMarker();
  mapClickWeather();
  locateMe();
  toggleMapType();
}

function addDefaultMarker() {
  const marker = new google.maps.Marker({
    position: { lat: 28.6448, lng: 77.2167 },
    map,
  });

  const info = new google.maps.InfoWindow({ content: "New Delhi" });
  info.open(map, marker);

  markers.push(marker);
  infos.push(info);
}

function mapClickWeather() {
  map.addListener("click", (e) => {
    infos.forEach((i) => i.close());

    const marker = new google.maps.Marker({
      position: e.latLng,
      map,
    });

    markers.push(marker);
    map.panTo(e.latLng);

    const url = `https://api.weatherbit.io/v2.0/current?lat=${e.latLng.lat()}&lon=${e.latLng.lng()}&key=da334a7104474c598181ccae11d00c02`;

    $.ajax({
      url,
      dataType: "jsonp",
      success: (res) => {
        const d = res.data[0];
        const info = new google.maps.InfoWindow({
          content: `
            <b>Weather</b><br>
            ${d.weather.description}<br>
            🌡 ${d.temp} °C
          `,
        });
        info.open(map, marker);
        infos.push(info);
      },
    });
  });
}

function locateMe() {
  $("#locateMe").click(() => {
    navigator.geolocation.getCurrentPosition((pos) => {
      map.panTo({
        lat: pos.coords.latitude,
        lng: pos.coords.longitude,
      });
      map.setZoom(14);
    });
  });
}

function toggleMapType() {
  $("#toggleMap").click(() => {
    isSatellite = !isSatellite;
    map.setMapTypeId(isSatellite ? "hybrid" : "roadmap");
  });
}
