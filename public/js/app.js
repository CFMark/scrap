$(document).ready(function(){
    M.AutoInit();

    var clearModal = function(){
        $("#modal-title").empty();
        $("#modal-body").empty();
        $("#modal-footer").empty();
    }

    var setModal = function(title, body, footer) {
        $("#modal-title").append(title);
        $("#modal-body").append(body);
        $("#modal-footer").append(footer);
    }

    $("#sendZip").click( (e) => {
        e.preventDefault();
        var userZip = $("#zip").val();
        axios.post("/api/"+userZip, userZip)
        .then( (resp) => {
            //console.log(resp);
            var data = resp.data;
            $("#results").empty();
            $("#sendReportContainer").empty();
            var resultsTable = `<table id="results-table" class="highlight"></table>`;

            $("#results").append(resultsTable);
            
            data.forEach( (system, i) => {
                if(i === 0){
                    var thead = `<thead>
                                    <tr >
                                        <th>${system.name}</th>
                                        <th>${system.city}</th>
                                        <th>${system.pop}</th>
                                    </tr>
                                </thead>`;
                    var tbody = `<tbody id="results-body"></tbody>`;
                    $("#results-table").append(thead+tbody);
                } else {
                    var id = system.link.toString().split("=")[1];
                    //console.log(id);
                    var sysRow = `<tr id="row-${i}">
                                    <td ><span id="${id}">${system.name}</span></td>
                                    <td>${system.city}</td>
                                    <td>${system.pop}</td>
                                </tr>`;
                    $("#results-body").append(sysRow);

                    $(`#row-${i}`).click( function(e) {
                        e.preventDefault();

                        axios.post(`/api/system/${id}`, id)
                        .then( resp => {
                            console.log(resp);
                            var data = resp.data;
                            $("#results").empty();
                            $("#sendReportContainer").empty();
                            var table = `<table id="results-table" class="highlight">
                                            <thead>
                                                <tr>
                                                    <td>Name</td>
                                                    <td>Helath Guideline</td>
                                                    <td>Your Level</td>
                                                </tr>
                                            </thead>
                                            <tbody id="results-body"></tbody>    
                                        </table>`;
                            $("#results").append(table);
                            data.forEach( contam => {
                                var row = `<tr>
                                                <td>${contam.name}</td>
                                                <td>${contam.healthGuide}</td>
                                                <td>${contam.yourLevel}</td>
                                            </tr>`;
                                $("#results-body").append(row);
                            });
                            var sendReport = `<div class="row"></div>
                            <div class="row"><div class="col s12"><a class="waves-effect waves-light btn modal-trigger light-blue lighten-2" href="#modal">Send Me My Report!</a></div></div>
                            <div class="row"></div>`;
                            $("#sendReportContainer").append(sendReport);

                            clearModal();

                            var modalTitle = `<h5>Enter Your Email</h5>`;
                            var modalBody = `<div class="row">
                                                <div class="input-field col s12">
                                                    <input placeholder="Enter Your Email" id="report-email" type="text" class="validate">
                                                    <label class="active" for="report-email">First Name</label>
                                                </div>
                                            </div>`;
                            var modalFooter = `<a id="sendReport" class="waves-effect waves-light btn light-blue lighten-2">Send My Report</a>`;
                            setModal(modalTitle, modalBody, modalFooter);
                            $("#sendReport").click(function(e) {
                                e.preventDefault();
                                var email = $("#report-email").val();
                                var table = $("#results").html();
                                axios.post("/api/sendReport/"+email, table)
                                .then(function(resp){
                                    console.log(resp);
                                })
                                .catch(function(err){
                                    console.log(err);
                                })
                            });


                        })
                        .catch( err => {
                            console.log(err);
                        });

                    });

                }
                
            })
        })
        .catch( (err) => {
            console.log(err);
        })
        console.log(userZip);
    });

});