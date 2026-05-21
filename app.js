// ======================
// INIT MAP [1]
// ======================

var map = L.map('map', {
    zoomControl: false,
    maxZoom: 21,
    zoomSnap: 0.5
});

// ======================
// ZOOM CONTROL [4]
// ======================

L.control.zoom({
    position: 'bottomright'
}).addTo(map);

// ======================
// BASEMAP [2]
// ======================

// SATELLITE
var satellite = L.tileLayer(
    'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    {
        attribution: 'Tiles © Esri'
    }
);

// STREET MAP
var osm = L.tileLayer(
    'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    {
        attribution: '&copy; OpenStreetMap contributors'
    }
);

// ======================
// DRONE TILE [5]
// ======================

var drone = L.tileLayer('Data/tiles/{z}/{x}/{y}.png', {

    minZoom: 16,
    maxZoom: 21,

    opacity: 0.9,

    tms: false,

    attribution: '© Paramaya Agrapana Indonesia'

});

// ======================
// BASEMAP SWITCHER
// ======================

L.control.layers(
    {
        "Satellite": satellite,
        "Street Map": osm,
        "Drone Orthophoto": drone
    },
    null,
    {
        position: 'bottomright'
    }
).addTo(map);



// tampilkan osm
osm.addTo(map);

// tampilkan drone di atas osm
drone.addTo(map);


// ======================
// SET VIEW [3]
// ======================

map.setView([-6.14261, 106.92786], 18);

// ============================
// VARIABLE GLOBAL
// ============================

var bangunanLayer;

// ======================
// SIDEBAR INTERACTION
// ======================

var sidebarContent = document.getElementById("sidebar-content");

// ============================
// BANGUNAN LAYER [4]
// ============================

fetch("Data/bangunan_4326.geojson")

    .then(response => response.json())

    .then(data => {

        bangunanLayer = L.geoJSON(data, {

            style: function(feature) {

                // ambil nilai kolom Tipe
                var tipe = feature.properties.Tipe;

                // default color
                var fillWarna = "#d26d1f";

                // TIPE A = HIJAU
                if (tipe === "A") {

                    fillWarna = "#b4db19";

                }

                // TIPE B = ORANGE
                else if (tipe === "B") {

                    fillWarna = "#d26d1f";

                }

                return {

                    color: "#333",
                    weight: 1,
                    fillColor: fillWarna,
                    fillOpacity: 0.7

                };

            },

            onEachFeature: function(feature, layer) {

                // POPUP CONTENT

                var popupContent = `

                    <b>No Sertifikat:</b><br>
                    ${feature.properties.No_Sertifi}<br><br>

                    <b>Luasan:</b><br>
                    ${feature.properties.Luasan_m2} m²<br><br>

                    <b>Jenis Usaha:</b><br>
                    ${feature.properties.Jenis_Usah}<br><br>

                    <b>Jangka Waktu:</b><br>
                    ${feature.properties.Jangka_Wak}

                `;

                layer.bindPopup(popupContent);

                // ======================
                // CLICK EVENT
                // ======================

                layer.on("click", function() {

                    var tipe = feature.properties.Tipe;

                    var foto = feature.properties.foto;

                    var dokumen = feature.properties.dokumen;

                    var handle = feature.properties.Handle;

                    // TIPE A
                    if (tipe === "A") {

                        sidebarContent.innerHTML = `

                            <div style="
                                margin-bottom:15px;
                            ">

                                <div style="
                                    font-size:13px;
                                    color:#777;
                                    margin-bottom:4px;
                                ">
                                    ID Building
                                </div>

                                <div style="
                                    font-size:20px;
                                    font-weight:bold;
                                    color:#2c3e50;
                                ">
                                    ${handle}
                                </div>

                            </div>

                            <h3>Foto Bangunan</h3>

                            <img 
                                src="Data/foto/${foto}" 
                                style="
                                    width:100%;
                                    border-radius:10px;
                                    margin-top:10px;
                                    margin-bottom:15px;
                                "
                            >

                            <button 
                                class="open-doc-btn"
                                data-doc="Data/dokumen/${dokumen}"
                            >

                                Buka Dokumen

                            </button>

                        `;

                    }

                    // TIPE B
                    else {

                        sidebarContent.innerHTML = `

                            Klik bangunan Tipe A untuk melihat foto dan dokumen aset

                        `;

                    }

                });

            }

        }).addTo(map);

        map.fitBounds(bangunanLayer.getBounds());

    });

// ======================
// LEGEND
// ======================

var legend = L.control({ position: 'bottomleft' });

legend.onAdd = function(map) {

    var div = L.DomUtil.create('div', 'legend');

    div.innerHTML = `

        <div class="legend-title">
            Kategori Bangunan
        </div>

        <div class="legend-item">
            <div class="legend-color" style="background:#b4db19;"></div>
            Tipe A
        </div>

        <div class="legend-item">
            <div class="legend-color" style="background:#d26d1f;"></div>
            Tipe B
        </div>

    `;

    return div;

};

legend.addTo(map);

// ======================
// DOCUMENT VIEWER
// ======================

document.addEventListener("click", function(e) {

    // OPEN DOCUMENT

    if (e.target.classList.contains("open-doc-btn")) {

        var docPath = e.target.getAttribute("data-doc");

        // SHOW VIEWER

        document.getElementById("document-viewer")

            .style.display = "block";

        // LOAD PDF

        document.getElementById("pdf-frame")

            .src = docPath;
    }

});

// CLOSE BUTTON

document.getElementById("close-document")

    .addEventListener("click", function() {

        // HIDE VIEWER

        document.getElementById("document-viewer")

            .style.display = "none";

        // CLEAR PDF

        document.getElementById("pdf-frame")

            .src = "";

});