// This is initialization data
const latitude = 28.3674739;
const longitude = -81.5576757;
const chartInitData = {};
const allMarkers =[];

function getLocations() {
  var response = null;
  $.ajax({
    type: "GET",
    url: "/api/data",
    dataType: "json",
    async: false,
    success: function(data) {
      response = data;
    },
    error: function(XMLHttpRequest, textStatus, errorThrown) {
      console.log("Status: " + textStatus);
      console.log("Error: " + errorThrown);
    }
  });
  return response;
}

function getChartData(uid, figindx) {
  var response = null;
  $.ajax({
    type: "GET",
    url: "/api/chartdata",
    dataType: "json",
    data: { uid: uid, figindx: figindx },
    async: false,
    success: function(data) {
      response = data;
    },
    error: function(XMLHttpRequest, textStatus, errorThrown) {
      console.log("Status: " + textStatus);
      console.log("Error: " + errorThrown);
    }
  });
  return response;
}

function displayMarkers(map, panorama) {
  var locations = getLocations();

  var marker, i;

  for (i = 0; i < locations.length; i++) {
    var assetname = locations[i].Name;
    var lat = locations[i].lat;
    var long = locations[i].lon;
    var addr_loc = locations[i].Address;
    var city = locations[i].City;
    var state = locations[i].State;
    var zip = locations[i].Zip;
    var phone = locations[i].Phone;
    var uid = locations[i].UID;

    var latlngset = new google.maps.LatLng(lat, long);
    var marker = new google.maps.Marker({
      map: map,
      title: assetname,
      position: latlngset,
      id: uid
    });

    var content =
      '<div id="content">' +
      '<div id="siteNotice">' +
      "</div>" +
      '<h1 id="firstHeading" class="firstHeading">' +
      assetname +
      "</h1>" +
      '<div id="bodyContent">' +
      "<br><b>Address:</b>" +
      addr_loc +
      "<br><b>City:</b> " +
      city +
      "<br><b>State:</b> " +
      state +
      "<br><b>Zip Code:</b> " +
      zip +
      "<br><b>Phone:</b> " +
      phone +
      "</div>" +
      "</div>";

    var prevWindow = false;

    google.maps.event.addListener(
      marker,
      "click",
      (function(marker, content, panorama) {
        return function() {
          if (prevWindow) {
            prevWindow.close();
          }
          var infowindow = new google.maps.InfoWindow();
          prevWindow = infowindow;
          infowindow.setContent(content);
          infowindow.open(panorama, marker);

          setNewPano(marker.getPosition(), panorama);

          var chart1data = getChartData(marker.id, 1);
          var chart2data = getChartData(marker.id, 2);
          var chart3data = getChartData(marker.id, 3);
          var chart4data = getChartData(marker.id, 4);
          drawChart(
            chart1data,
            "chart1",
            "Test Label",
            marker.title,
            "Test Ylab",
            "Test Xlab"
          );
          drawChart(
            chart2data,
            "chart2",
            "Test Label",
            marker.title,
            "Test Ylab",
            "Test Xlab"
          );
          drawChart(
            chart3data,
            "chart3",
            "Test Label",
            marker.title,
            "Test Ylab",
            "Test Xlab"
          );
          drawChart(
            chart4data,
            "chart4",
            "Test Label",
            marker.title,
            "Test Ylab",
            "Test Xlab"
          );
        };
      })(marker, content, panorama)
    );
  }
}

function setNewPano(position, panorama, status) {
  var streetViewService = new google.maps.StreetViewService();
  streetViewService.getPanorama(
    {
      location: position
    },
    function(data, status) {
      if (status === google.maps.StreetViewStatus.OK) {
        document.getElementById("pano").innerHTML = "";
        panorama = new google.maps.StreetViewPanorama(
          document.getElementById("pano"),
          {
            position: position
          }
        );
        panorama.setVisible(true);
      } else {
        document.getElementById("pano").innerHTML =
          "Street View data not found for this location.";
      }
    }
  );
}

function parseChartData(data) {
  var firstRow = data[0];
  var parsedData = [];

  for (var key in firstRow) {
    parsedData.push(firstRow[key]);
  }

  return parsedData;
}

function parseChartKeys(data) {
  var firstRow = data[0];
  var keys = [];

  for (var key in firstRow) {
    keys.push(key);
  }

  return keys;
}

function addData(chart, datalabel, newdata) {
  chart.data.datasets.push({
    label: datalabel,
    backgroundColor: "#000000",
    borderColor: "#000000",
    pointBackgroundColor: "#000000",
    data: newdata,
    borderWidth: 2,
    showDatapoints: true,
    type: "line",
    fill: false,
    yAxisID: "y-axis-1"
  });
  chart.update();
}

function drawChart(data, element, datalabel, title, ylabel, xlabel) {
  document.getElementById(element).remove();
  var newElement = document.createElement("canvas");
  var el = document
    .getElementById(element + "container")
    .appendChild(newElement);
  el.setAttribute("id", element);
  el.setAttribute("height", 300);

  var parsedData = parseChartData(data);
  var keys = parseChartKeys(data);
  if (keys.length === 0) {
    keys = [
      "1999",
      "2000",
      "2001",
      "2002",
      "2003",
      "2004",
      "2005",
      "2006",
      "2007",
      "2008",
      "2009",
      "2010",
      "2011",
      "2012",
      "2013",
      "2014",
      "2015",
      "2016",
      "2017"
    ];
  }

  var chart = document.getElementById(element);
  var chartCtx = chart.getContext("2d");
  var currentChart = null;

  if (element === "chart1") {
    currentChart = new Chart(chartCtx, {
      type: "bar",
      data: {
        labels: keys,
        datasets: [
          {
            label: "Nuggets+",
            backgroundColor: "rgba(170, 25, 33, .2)",
            borderWidth: 1,
            data: [
              2000,
              75000,
              103000,
              100000,
              101000,
              111000,
              123000,
              121000,
              119000,
              121000,
              119000,
              118000,
              117000,
              118000,
              119000,
              119000,
              116000,
              109000,
              70620
            ]
          },
          {
            label: "Burgers",
            backgroundColor: "rgba(33, 170, 25, .2)",
            borderWidth: 1,
            data: [
              21000,
              94100,
              59000,
              73000,
              74570,
              65000,
              57000,
              57020,
              55000,
              49000,
              54000,
              47500,
              55000,
              53000,
              52000,
              51000,
              63000,
              61000,
              56000
            ]
          }
        ]
      },

      options: {
        responsive: true,
        title: {
          display: true,
          text: "Fast Food Market Tracked Stock (Pads)  - Community Type"
        },
        legend: {
          position: "bottom"
        },
        tooltips: {
          mode: "index",
          intersect: true
        },
        scales: {
          xAxes: [
            {
              stacked: true
            }
          ],
          yAxes: [
            {
              stacked: true,
              id: "y-axis-1"
            }
          ]
        }
      }
    });
  }

  if (element === "chart2") {
    currentChart = new Chart(chartCtx, {
      type: "line",
      data: {
        labels: keys,
        datasets: [
          {
            label: "Total Occupancy",
            backgroundColor: "rgba(75,0,130,0.2)",
            borderColor: "rgba(75,0,130,0.2)",
            pointBackgroundColor: "rgba(75,0,130,0.2)",
            borderWidth: 2,
            fill: false,
            data: [
              91.547,
              84.331,
              87.489,
              81.546,
              81.67,
              87.19,
              92.34,
              92.643,
              92.182,
              92.228,
              92.024,
              91.22,
              89.9,
              91.192,
              91.482,
              91.741,
              92.157,
              92.42,
              93.244
            ]
          },
          {
            label: "Burgers Occupancy",
            backgroundColor: "rgba(0,0,205,0.2)",
            borderColor: "rgba(0,0,205,0.2)",
            pointBackgroundColor: "rgba(0,0,205,0.2)",
            borderWidth: 2,
            fill: false,
            data: [
              90.804,
              88.776,
              87.781,
              87.909,
              88.27,
              88.743,
              88.427,
              89.427,
              87.871,
              87.995,
              88.026,
              87.072,
              87.123,
              87.137,
              87.991,
              88.265,
              89.657,
              90.211,
              92.02
            ]
          },
          {
            label: "Nuggets+ Occupancy",
            backgroundColor: "rgba(220,20,60,0.2)",
            borderColor: "rgba(220,20,60,0.2)",
            pointBackgroundColor: "rgba(220,20,60,0.2)",
            borderWidth: 2,
            fill: false,
            data: [
              97.336,
              93.902,
              93.542,
              93.717,
              94.305,
              94.6,
              94.233,
              94.162,
              94.168,
              94.069,
              93.817,
              92.998,
              93.17,
              93.048,
              93.019,
              93.348,
              93.506,
              93.673,
              94.208
            ]
          }
        ]
      },

      options: {
        responsive: true,
        title: {
          display: true,
          text: "Fast Food Market Occupancy  - Community Type"
        },
        tooltips: {
          mode: "index",
          intersect: true
        },
        legend: {
          display: true
        },
        scales: {
          yAxes: [
            {
              id: "y-axis-1"
            }
          ]
        }
      }
    });
  }

  if (element === "chart3") {
    currentChart = new Chart(chartCtx, {
      type: "bar",
      data: {
        labels: keys,
        datasets: [
          {
            type: "line",
            label: "ChristmasTree Total",
            borderColor: "rgba(75,0,130,0.2)",
            pointBackgroundColor: "rgba(75,0,130,0.2)",
            borderWidth: 2,
            fill: false,
            data: [
              240.65,
              252.29,
              261.41,
              272.21,
              276.63,
              278.28,
              289.32,
              307.57,
              325.65,
              344.28,
              359.86,
              368.99,
              379.46,
              391.41,
              401.41,
              413.81,
              431.62,
              443.24,
              459.08
            ],
            yAxisID: "y-axis-1"
          },
          {
            type: "line",
            label: "Burgers ChristmasTree",
            borderColor: "rgba(0,0,205,0.2)",
            pointBackgroundColor: "rgba(0,0,205,0.2)",
            borderWidth: 2,
            fill: false,
            data: [
              255,
              251,
              222.97,
              243.81,
              259.94,
              247.49,
              276.84,
              296.46,
              317.8,
              323.98,
              355.47,
              340.71,
              395.86,
              408.39,
              418.94,
              432,
              449.42,
              468.16,
              476
            ],
            yAxisID: "y-axis-1"
          },
          {
            type: "line",
            label: "Nuggets+ ChristmasTree",
            borderColor: "rgba(220,20,60,0.2)",
            pointBackgroundColor: "rgba(220,20,60,0.2)",
            borderWidth: 2,
            fill: false,
            data: [
              245.44,
              254.41,
              255.34,
              267.54,
              272.79,
              274.07,
              286.09,
              303.64,
              320.86,
              340.2,
              356.3,
              364.58,
              373.62,
              384.39,
              394.19,
              406.41,
              423.05,
              430.28,
              446.15
            ],
            yAxisID: "y-axis-1"
          },
          {
            type: "bar",
            label: "Nuggets+ Premium",
            backgroundColor: "rgba(170, 25, 33, .2)",
            borderWidth: 1,
            data: [
              5.405,
              4.4965,
              -1.4726,
              -2.4012,
              -3.916,
              -4.6679,
              -5.6214,
              -6.0521,
              -7.0163,
              -8.1633,
              -9.8233,
              -10.2376,
              -11.6176,
              -12.877,
              -5.9067,
              -5.9217,
              -5.8677,
              -8.092,
              -6.2721
            ],
            yAxisID: "y-axis-2"
          }
        ]
      },

      options: {
        responsive: true,
        title: {
          display: true,
          text: "Fast Food Market ChristmasTree - Community Type"
        },
        legend: {
          display: true
        },
        tooltips: {
          mode: "index",
          intersect: true
        },
        scales: {
          yAxes: [
            {
              type: "linear", // only linear but allow scale type registration. This allows extensions to exist solely for log scale for instance
              display: true,
              position: "left",
              id: "y-axis-1"
            },
            {
              type: "linear", // only linear but allow scale type registration. This allows extensions to exist solely for log scale for instance
              display: true,
              position: "right",
              id: "y-axis-2",

              // grid line settings
              gridLines: {
                drawOnChartArea: false // only want the grid lines for one axis to show up
              }
            }
          ]
        }
      }
    });
  }

  if (element === "chart4") {
    currentChart = new Chart(chartCtx, {
      type: "bar",
      data: {
        labels: keys,
        datasets: [
          {
            type: "line",
            label: "Adjusted StuffYo Total",
            borderColor: "rgb(75,0,130,0.2)",
            pointBackgroundColor: "rgb(75,0,130,0.2)",
            borderWidth: 2,
            fill: false,
            data: [
              240.65,
              252.29,
              261.41,
              272.21,
              276.63,
              278.28,
              289.32,
              307.57,
              325.65,
              344.28,
              359.86,
              368.99,
              379.46,
              391.41,
              401.41,
              413.81,
              431.62,
              443.24,
              459.08
            ],
            yAxisID: "y-axis-1"
          },
          {
            type: "line",
            label: "Burgers Adj StuffYo",
            borderColor: "rgba(0,0,205,0.2)",
            pointBackgroundColor: "rgba(0,0,205,0.2)",
            borderWidth: 2,
            fill: false,
            data: [
              255,
              251,
              222.97,
              243.81,
              259.94,
              247.49,
              276.84,
              296.46,
              317.8,
              323.98,
              355.47,
              340.71,
              395.86,
              408.39,
              418.94,
              432,
              449.42,
              468.16,
              476
            ],
            yAxisID: "y-axis-1"
          },
          {
            type: "line",
            label: "Nuggets+ Adj StuffYo",
            borderColor: "rgba(220,20,60,0.2)",
            pointBackgroundColor: "rgba(220,20,60,0.2)",
            borderWidth: 2,
            fill: false,
            data: [
              245.44,
              254.41,
              255.34,
              267.54,
              272.79,
              274.07,
              286.09,
              303.64,
              320.86,
              340.2,
              356.3,
              364.58,
              373.62,
              384.39,
              394.19,
              406.41,
              423.05,
              430.28,
              446.15
            ],
            yAxisID: "y-axis-1"
          },
          {
            type: "bar",
            label: "Nuggets+ Premium",
            backgroundColor: "rgba(170, 25, 33, .2)",
            borderWidth: 1,
            data: [
              5.405,
              4.4965,
              -1.4726,
              -2.4012,
              -3.916,
              -4.6679,
              -5.6214,
              -6.0521,
              -7.0163,
              -8.1633,
              -9.8233,
              -10.2376,
              -11.6176,
              -12.877,
              -5.9067,
              -5.9217,
              -5.8677,
              -8.092,
              -6.2721
            ],
            yAxisID: "y-axis-2"
          }
        ]
      },

      options: {
        responsive: true,
        title: {
          display: true,
          text: "Fast Food Market Adj. StuffYo - Community Type"
        },
        legend: {
          display: true
        },
        tooltips: {
          mode: "index",
          intersect: true
        },
        scales: {
          yAxes: [
            {
              type: "linear", // only linear but allow scale type registration. This allows extensions to exist solely for log scale for instance
              display: true,
              position: "left",
              id: "y-axis-1"
            },
            {
              type: "linear", // only linear but allow scale type registration. This allows extensions to exist solely for log scale for instance
              display: true,
              position: "right",
              id: "y-axis-2",

              // grid line settings
              gridLines: {
                drawOnChartArea: false // only want the grid lines for one axis to show up
              }
            }
          ]
        }
      }
    });
  }

  addData(currentChart, datalabel, parsedData);
}

function initDisplay() {
  const mapZoom = 7;
  const { google } = window;
  const mapOptions = {
    center: new google.maps.LatLng(latitude, longitude),
    zoom: mapZoom,
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    styles: [
      {
        elementType: "geometry",
        stylers: [
          { hue: "#ff4400" },
          { saturation: -68 },
          { lightness: -4 },
          { gamma: 0.72 }
        ]
      },
      {
        featureType: "road",
        elementType: "labels.icon"
      },
      {
        featureType: "landscape.man_made",
        elementType: "geometry",
        stylers: [{ hue: "#0077ff" }, { gamma: 3.1 }]
      },
      {
        featureType: "water",
        stylers: [{ hue: "#00ccff" }, { gamma: 0.44 }, { saturation: -33 }]
      },
      {
        featureType: "poi.park",
        stylers: [{ hue: "#44ff00" }, { saturation: -23 }]
      },
      {
        featureType: "water",
        elementType: "labels.text.fill",
        stylers: [
          { hue: "#007fff" },
          { gamma: 0.77 },
          { saturation: 65 },
          { lightness: 99 }
        ]
      },
      {
        featureType: "water",
        elementType: "labels.text.stroke",
        stylers: [
          { gamma: 0.11 },
          { weight: 5.6 },
          { saturation: 99 },
          { hue: "#0091ff" },
          { lightness: -86 }
        ]
      },
      {
        featureType: "transit.line",
        elementType: "geometry",
        stylers: [
          { lightness: -48 },
          { hue: "#ff5e00" },
          { gamma: 1.2 },
          { saturation: -23 }
        ]
      },
      {
        featureType: "transit",
        elementType: "labels.text.stroke",
        stylers: [
          { saturation: -64 },
          { hue: "#ff9100" },
          { lightness: 16 },
          { gamma: 0.47 },
          { weight: 2.7 }
        ]
      }
    ]
  };

  const map = new google.maps.Map(document.getElementById("map"), mapOptions);
//add listener after the polygon is drawn
  function addListener(polygon, markers){
    google.maps.event.addListener(map, 'click', function(event) {
      var newPolygon = new google.maps.Polygon({
        paths: polygon
      });
      for (let i =0; i <markers.length; i++){
        if(google.maps.geometry.poly.containsLocation(markers[i].position, newPolygon)=== true){
          markers[i].setMap(map);
        };
      }
    });
  
  }
  //polygon code
  const drawingManager = new google.maps.drawing.DrawingManager({
    drawingMode: google.maps.drawing.OverlayType.MARKER,
    drawingControl: true,
    drawingControlOptions: {
      position: google.maps.ControlPosition.TOP_CENTER,
      drawingModes: ["marker", "polygon"]
    },
    polygonOptions: {
      fillColor: "#ffff00",
      fillOpacity: 0.5,
      strokeWeight: 1,
      clickable: false,
      editable: true,
      zIndex: 1
    }
  });
  drawingManager.setMap(map);

  google.maps.event.addListener(drawingManager, "polygoncomplete", function(
    polygon
  ) {
    let path = polygon.getPath();
    let coordinates = [];
    for (let i = 0; i < path.length; i++) {
      coordinates.push({
        lat: path.getAt(i).lat(),
        lng: path.getAt(i).lng()
      });
    }
    var newPolygon = new google.maps.Polygon({
      paths: coordinates
    });

    let allMarkers =[];
    //creates markers
    const locations = getLocations();
    var marker, i;
    for (i = 0; i < locations.length; i++) {
      var assetname = locations[i].Name;
      var lat = locations[i].lat;
      var long = locations[i].lon;
      var addr_loc = locations[i].Address;
      var city = locations[i].City;
      var state = locations[i].State;
      var zip = locations[i].Zip;
      var phone = locations[i].Phone;
      var uid = locations[i].UID;
  
      var latlngset = new google.maps.LatLng(lat, long);
      var marker = new google.maps.Marker({
        map: map,
        title: assetname,
        position: latlngset,
        id: uid
      });
      marker.setMap(null)
      allMarkers.push(marker) 
    }
//Add listener after the polygon is drawn
    addListener(coordinates,allMarkers);

  });

  var panorama = new google.maps.StreetViewPanorama(
    document.getElementById("pano")
  );
  panorama.setVisible(false);
  document.getElementById("pano").innerHTML =
    "Click a marker to view street view panorama.";

  //displayMarkers(map, panorama);

  drawChart(
    chartInitData,
    "chart1",
    "Test Label",
    "Test Title",
    "Test Ylab",
    "Test Xlab"
  );
  drawChart(
    chartInitData,
    "chart2",
    "Test Label",
    "Test Title",
    "Test Ylab",
    "Test Xlab"
  );
  drawChart(
    chartInitData,
    "chart3",
    "Test Label",
    "Test Title",
    "Test Ylab",
    "Test Xlab"
  );
  drawChart(
    chartInitData,
    "chart4",
    "Test Label",
    "Test Title",
    "Test Ylab",
    "Test Xlab"
  );
}

