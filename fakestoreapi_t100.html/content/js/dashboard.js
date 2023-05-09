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

    var data = {"OkPercent": 99.96551724137932, "KoPercent": 0.034482758620689655};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.45155172413793104, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.16, 500, 1500, "Delete a product"], "isController": false}, {"data": [0.0, 500, 1500, "Get carts in a date range"], "isController": false}, {"data": [0.0, 500, 1500, "Get a single user"], "isController": false}, {"data": [0.0, 500, 1500, "Delete a cart"], "isController": false}, {"data": [0.955, 500, 1500, "Update a product"], "isController": false}, {"data": [0.87, 500, 1500, "Add a new cart"], "isController": false}, {"data": [0.305, 500, 1500, "User login"], "isController": false}, {"data": [0.45, 500, 1500, "Get all products"], "isController": false}, {"data": [0.0, 500, 1500, "Get all users"], "isController": false}, {"data": [0.17, 500, 1500, "Add a new user"], "isController": false}, {"data": [0.0, 500, 1500, "Get user carts"], "isController": false}, {"data": [0.335, 500, 1500, "Sort results"], "isController": false}, {"data": [0.96, 500, 1500, "Update a cart - patch"], "isController": false}, {"data": [0.30833333333333335, 500, 1500, "Limit results"], "isController": false}, {"data": [0.255, 500, 1500, "Delete a user"], "isController": false}, {"data": [0.935, 500, 1500, "Get a single product"], "isController": false}, {"data": [0.28, 500, 1500, "Get products in a specific category"], "isController": false}, {"data": [0.965, 500, 1500, "Update a product - patch"], "isController": false}, {"data": [0.12, 500, 1500, "Get all carts"], "isController": false}, {"data": [0.96, 500, 1500, "Add new product"], "isController": false}, {"data": [0.915, 500, 1500, "Update a cart"], "isController": false}, {"data": [0.955, 500, 1500, "Get all categories"], "isController": false}, {"data": [0.925, 500, 1500, "Update a users - patch"], "isController": false}, {"data": [0.045, 500, 1500, "Get a single cart"], "isController": false}, {"data": [0.94, 500, 1500, "Update a users"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 2900, 1, 0.034482758620689655, 1753.1427586206903, 294, 5511, 1279.0, 4234.300000000001, 4667.749999999999, 5026.8399999999965, 48.518512322029075, 97.49244120267353, 12.021794641213967], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Delete a product", 100, 0, 0.0, 2374.7300000000005, 602, 4228, 2277.0, 3900.7000000000003, 4091.0, 4227.79, 6.666666666666667, 7.173046875, 1.4127604166666667], "isController": false}, {"data": ["Get carts in a date range", 100, 0, 0.0, 4119.950000000001, 3034, 5181, 3938.0, 4723.7, 5022.999999999999, 5180.89, 3.2812705079406745, 5.246379835772411, 0.5319247112481953], "isController": false}, {"data": ["Get a single user", 100, 0, 0.0, 2735.3899999999994, 1620, 4537, 2472.0, 3916.4, 3945.8, 4533.879999999998, 4.2294028083234645, 4.085586591735747, 0.5286753510404332], "isController": false}, {"data": ["Delete a cart", 100, 1, 1.0, 3579.500000000001, 1948, 5410, 3660.5, 4878.4, 4971.9, 5408.969999999999, 3.37006706433458, 2.730478359956863, 0.7042913591480471], "isController": false}, {"data": ["Update a product", 100, 0, 0.0, 378.74, 298, 750, 351.0, 495.6, 571.8999999999997, 749.8299999999999, 8.85661146045523, 7.194612966079178, 3.105003431936941], "isController": false}, {"data": ["Add a new cart", 100, 0, 0.0, 434.8199999999999, 295, 1070, 359.0, 704.0000000000002, 936.3999999999994, 1069.97, 3.6597862684819207, 2.900380617771922, 1.5189542618211096], "isController": false}, {"data": ["User login", 100, 0, 0.0, 1252.4799999999998, 517, 1934, 1264.5, 1747.6, 1774.55, 1933.7299999999998, 8.292561572269674, 6.896593052906543, 2.0731403930674186], "isController": false}, {"data": ["Get all products", 100, 0, 0.0, 1077.73, 422, 3116, 847.0, 1940.9, 2427.75, 3115.94, 9.420631182289213, 104.18040508714084, 1.186778732925106], "isController": false}, {"data": ["Get all users", 100, 0, 0.0, 3189.2399999999993, 1648, 5310, 3403.0, 4632.900000000001, 4877.55, 5308.119999999999, 3.732039559619332, 13.456699594140696, 0.45921580518753496], "isController": false}, {"data": ["Add a new user", 100, 0, 0.0, 1785.4900000000002, 1015, 3546, 1698.5, 2549.8, 2706.5, 3540.329999999997, 6.435834727764192, 4.434692367100013, 4.028681699703951], "isController": false}, {"data": ["Get user carts", 100, 0, 0.0, 4065.59, 3258, 5125, 3875.0, 4859.3, 4901.0, 5124.0199999999995, 3.252561392096276, 2.6500116888925027, 0.42245182143437954], "isController": false}, {"data": ["Sort results", 300, 0, 0.0, 2170.9833333333327, 300, 5125, 1798.5, 4442.100000000001, 4839.4, 5103.240000000001, 5.675691015381123, 30.76819443262009, 0.7593453799875135], "isController": false}, {"data": ["Update a cart - patch", 100, 0, 0.0, 385.96, 300, 939, 362.5, 472.0, 603.2499999999998, 938.4799999999998, 3.630291149350178, 2.8732478172874467, 1.5173482538299572], "isController": false}, {"data": ["Limit results", 300, 0, 0.0, 2231.6433333333325, 301, 5363, 1831.5, 4634.1, 4878.5, 5305.99, 5.863268576789274, 12.583353081147639, 0.7729895096353048], "isController": false}, {"data": ["Delete a user", 100, 0, 0.0, 1472.4699999999996, 523, 2789, 1439.5, 1837.7, 2506.949999999999, 2787.669999999999, 7.357268981753973, 7.1944606662007065, 1.5375542598587404], "isController": false}, {"data": ["Get a single product", 100, 0, 0.0, 391.61, 300, 614, 369.5, 552.8000000000002, 597.95, 613.9499999999999, 11.56737998843262, 12.454588996529786, 1.4798113071139387], "isController": false}, {"data": ["Get products in a specific category", 100, 0, 0.0, 1594.65, 469, 3128, 1337.0, 2932.2000000000003, 2983.6499999999996, 3126.8199999999993, 8.72905027932961, 19.078430516759777, 1.2530960850209498], "isController": false}, {"data": ["Update a product - patch", 100, 0, 0.0, 367.30999999999995, 298, 733, 341.5, 442.6, 541.2999999999996, 731.9599999999995, 8.968609865470851, 7.292600896860987, 3.161785313901345], "isController": false}, {"data": ["Get all carts", 100, 0, 0.0, 2955.5599999999986, 868, 5511, 3106.0, 4530.700000000001, 4604.65, 5502.989999999996, 5.02563071665494, 8.032862128103327, 0.6183881545884009], "isController": false}, {"data": ["Add new product", 100, 0, 0.0, 378.27, 296, 705, 352.0, 487.9, 530.95, 704.5299999999997, 8.85896527285613, 7.235456070605953, 3.123131312012757], "isController": false}, {"data": ["Update a cart", 100, 0, 0.0, 403.32000000000005, 296, 823, 360.0, 559.0, 697.95, 821.9599999999995, 3.6533684056700277, 2.891227234948122, 1.51985834064007], "isController": false}, {"data": ["Get all categories", 100, 0, 0.0, 382.90999999999997, 294, 732, 349.5, 497.30000000000007, 566.95, 731.8699999999999, 11.594202898550725, 8.616621376811594, 1.585144927536232], "isController": false}, {"data": ["Update a users - patch", 100, 0, 0.0, 417.75999999999993, 299, 1801, 350.5, 502.9, 770.8499999999999, 1793.8499999999963, 7.5075075075075075, 7.156619510135135, 4.721518393393393], "isController": false}, {"data": ["Get a single cart", 100, 0, 0.0, 3483.18, 1247, 5175, 3982.0, 4938.6, 4975.3, 5174.48, 4.207514621113308, 3.422303640552026, 0.5259393276391635], "isController": false}, {"data": ["Update a users", 100, 0, 0.0, 406.5999999999999, 299, 1108, 345.0, 541.4000000000001, 821.9, 1107.3499999999997, 7.656967840735069, 7.302533977794793, 4.800559915773354], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["502/Bad Gateway", 1, 100.0, 0.034482758620689655], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 2900, 1, "502/Bad Gateway", 1, "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Delete a cart", 100, 1, "502/Bad Gateway", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
