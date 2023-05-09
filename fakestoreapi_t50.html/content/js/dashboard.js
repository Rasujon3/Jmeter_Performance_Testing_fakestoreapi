/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 100.0, "KoPercent": 0.0};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7955172413793103, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.69, 500, 1500, "Delete a product"], "isController": false}, {"data": [0.62, 500, 1500, "Get carts in a date range"], "isController": false}, {"data": [0.61, 500, 1500, "Get a single user"], "isController": false}, {"data": [0.58, 500, 1500, "Delete a cart"], "isController": false}, {"data": [1.0, 500, 1500, "Update a product"], "isController": false}, {"data": [1.0, 500, 1500, "Add a new cart"], "isController": false}, {"data": [0.67, 500, 1500, "User login"], "isController": false}, {"data": [0.82, 500, 1500, "Get all products"], "isController": false}, {"data": [0.56, 500, 1500, "Get all users"], "isController": false}, {"data": [0.65, 500, 1500, "Add a new user"], "isController": false}, {"data": [0.65, 500, 1500, "Get user carts"], "isController": false}, {"data": [0.7433333333333333, 500, 1500, "Sort results"], "isController": false}, {"data": [1.0, 500, 1500, "Update a cart - patch"], "isController": false}, {"data": [0.7466666666666667, 500, 1500, "Limit results"], "isController": false}, {"data": [0.67, 500, 1500, "Delete a user"], "isController": false}, {"data": [1.0, 500, 1500, "Get a single product"], "isController": false}, {"data": [0.78, 500, 1500, "Get products in a specific category"], "isController": false}, {"data": [0.99, 500, 1500, "Update a product - patch"], "isController": false}, {"data": [0.66, 500, 1500, "Get all carts"], "isController": false}, {"data": [1.0, 500, 1500, "Add new product"], "isController": false}, {"data": [1.0, 500, 1500, "Update a cart"], "isController": false}, {"data": [1.0, 500, 1500, "Get all categories"], "isController": false}, {"data": [1.0, 500, 1500, "Update a users - patch"], "isController": false}, {"data": [0.66, 500, 1500, "Get a single cart"], "isController": false}, {"data": [0.99, 500, 1500, "Update a users"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1450, 0, 0.0, 484.9248275862067, 281, 2255, 477.0, 732.8000000000002, 795.0, 894.45, 61.07577608356851, 122.7339274619856, 15.133201792258118], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Delete a product", 50, 0, 0.0, 564.1199999999999, 465, 969, 510.0, 771.7, 802.0999999999999, 969.0, 5.166890565257828, 5.562884287485791, 1.0949367701767077], "isController": false}, {"data": ["Get carts in a date range", 50, 0, 0.0, 597.8199999999999, 450, 900, 579.0, 778.0999999999999, 819.8499999999999, 900.0, 4.750593824228028, 7.599651128266033, 0.7701157957244655], "isController": false}, {"data": ["Get a single user", 50, 0, 0.0, 605.8200000000003, 470, 824, 575.0, 770.5, 790.3, 824.0, 4.72768532526475, 4.565540492624811, 0.5909606656580938], "isController": false}, {"data": ["Delete a cart", 50, 0, 0.0, 605.1200000000001, 461, 892, 577.5, 745.0, 820.8499999999998, 892.0, 4.714757190004715, 3.8382911951909473, 0.9853105846298915], "isController": false}, {"data": ["Update a product", 50, 0, 0.0, 325.92, 292, 403, 320.0, 360.5, 381.59999999999997, 403.0, 5.414185165132647, 4.401140362750406, 1.8981371819166217], "isController": false}, {"data": ["Add a new cart", 50, 0, 0.0, 324.08, 284, 396, 322.0, 350.7, 373.9, 396.0, 4.844491812808836, 3.8362319542679972, 2.010653340277105], "isController": false}, {"data": ["User login", 50, 0, 0.0, 583.74, 463, 1041, 521.0, 801.3, 809.9499999999999, 1041.0, 4.767353165522502, 3.969566409229596, 1.1918382913806256], "isController": false}, {"data": ["Get all products", 50, 0, 0.0, 620.66, 416, 2255, 477.0, 1379.8999999999996, 1501.25, 2255.0, 4.970673029128144, 54.968071192464464, 0.626188301521026], "isController": false}, {"data": ["Get all users", 50, 0, 0.0, 614.64, 478, 860, 565.5, 812.7, 828.0999999999999, 860.0, 4.717871296471032, 17.01363907105114, 0.580519319682959], "isController": false}, {"data": ["Add a new user", 50, 0, 0.0, 600.6999999999999, 458, 804, 547.5, 789.7, 796.9, 804.0, 4.710315591144607, 3.2473578073480924, 2.9485471620348562], "isController": false}, {"data": ["Get user carts", 50, 0, 0.0, 601.96, 458, 897, 570.5, 813.3, 838.9, 897.0, 4.749240121580547, 3.8650651833206684, 0.6168446642287234], "isController": false}, {"data": ["Sort results", 150, 0, 0.0, 531.9266666666666, 287, 1392, 506.5, 775.9, 842.9, 1329.780000000001, 7.5945521745734395, 41.171174877221404, 1.0160680155435167], "isController": false}, {"data": ["Update a cart - patch", 50, 0, 0.0, 325.7399999999999, 290, 388, 319.5, 361.8, 380.29999999999995, 388.0, 4.818348270212971, 3.812329852076708, 2.0139190035655776], "isController": false}, {"data": ["Limit results", 150, 0, 0.0, 509.17333333333346, 293, 843, 501.5, 747.9000000000001, 809.1499999999999, 835.3500000000001, 8.059749610445435, 17.295928818978023, 1.0625646459083338], "isController": false}, {"data": ["Delete a user", 50, 0, 0.0, 578.0999999999997, 452, 794, 525.0, 755.0, 785.9499999999999, 794.0, 4.708984742889434, 4.607447259370879, 0.9841042333772838], "isController": false}, {"data": ["Get a single product", 50, 0, 0.0, 330.1599999999999, 291, 393, 327.0, 366.9, 374.9, 393.0, 5.56606924190137, 5.991351719915396, 0.7120654987198041], "isController": false}, {"data": ["Get products in a specific category", 50, 0, 0.0, 514.5199999999999, 464, 680, 498.0, 597.8, 645.3499999999999, 680.0, 5.347593582887701, 11.686998663101605, 0.7676721256684492], "isController": false}, {"data": ["Update a product - patch", 50, 0, 0.0, 345.5600000000001, 292, 1133, 325.0, 367.6, 391.4, 1133.0, 5.426524853483829, 4.407567628065986, 1.9130619844801389], "isController": false}, {"data": ["Get all carts", 50, 0, 0.0, 571.4399999999998, 460, 835, 514.5, 771.0999999999999, 814.8, 835.0, 5.0393065914130215, 8.053441846401935, 0.6200709282402741], "isController": false}, {"data": ["Add new product", 50, 0, 0.0, 328.9, 294, 402, 324.5, 354.0, 372.29999999999995, 402.0, 5.4147714966428415, 4.424460553389647, 1.9089184670781894], "isController": false}, {"data": ["Update a cart", 50, 0, 0.0, 317.08, 283, 387, 308.0, 343.7, 358.04999999999995, 387.0, 4.8285852245292125, 3.822315608401738, 2.0087669000482857], "isController": false}, {"data": ["Get all categories", 50, 0, 0.0, 326.72000000000014, 286, 389, 320.5, 363.4, 371.45, 389.0, 5.544466622310933, 4.123697050343757, 0.7580325460190729], "isController": false}, {"data": ["Update a users - patch", 50, 0, 0.0, 326.56000000000006, 294, 397, 318.5, 374.6, 384.49999999999994, 397.0, 4.827186715582158, 4.6033636440432515, 3.035847895346592], "isController": false}, {"data": ["Get a single cart", 50, 0, 0.0, 590.4799999999999, 452, 862, 529.5, 820.3, 829.4, 862.0, 4.924652811976756, 4.005897271742342, 0.6155816014970944], "isController": false}, {"data": ["Update a users", 50, 0, 0.0, 339.6799999999999, 281, 1017, 322.0, 353.8, 401.5999999999999, 1017.0, 4.839334107626791, 4.608331518583043, 3.0340356416957026], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": []}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1450, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
