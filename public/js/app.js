$(document).ready(()=>{
    

    $("#sendZip").click( (e) => {
        e.preventDefault();
        var userZip = $("#zip").val();
        axios.post("/api/"+userZip, userZip)
        .then( (resp) => {
            //console.log(resp);
            var data = resp.data;

            var resultsTable = `<table id="results-table"></table>`;
            $("#results").append(resultsTable);
            
            data.forEach( (system, i) => {
                if(i === 0){
                    var thead = `<thead>
                                    <tr>
                                        <th>${system.name}</th>
                                        <th>${system.city}</th>
                                        <th>${system.pop}</th>
                                    </tr>
                                </thead>`;
                    var tbody = `<tbody id="results-body"></tbody>`;
                    $("#results").append(thead+tbody);
                } else {
                    var id = system.link.toString().split("=")[1];
                    //console.log(id);
                    var sysRow = `<tr >
                                    <td ><span id="${id}">${system.name}</span></td>
                                    <td>${system.city}</td>
                                    <td>${system.pop}</td>
                                </tr>`;
                    $("#results-body").append(sysRow);

                    $(`#${id}`).click( function(e) {
                        e.preventDefault();

                        axios.post(`/api/system/${id}`, id)
                        .then( resp => {
                            console.log(resp);
                            var data = resp.data;
                            $("#results").empty();
                            var table = `<table id="results-table">
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
                            })

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