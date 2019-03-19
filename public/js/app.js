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
                    var sysRow = `<tr>
                                    <td><a href="https://www.ewg.org/tapwater/${system.link}">${system.name}</a></td>
                                    <td>${system.city}</td>
                                    <td>${system.pop}</td>
                                </tr>`;
                    $("#results-body").append(sysRow);
                    console.log(system);
                }
                
            })
        })
        .catch( (err) => {
            console.log(err);
        })
        console.log(userZip);
    });
});