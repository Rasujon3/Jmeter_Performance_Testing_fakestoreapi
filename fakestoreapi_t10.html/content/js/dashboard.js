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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.4396551724137931, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.1, 500, 1500, "Delete a product"], "isController": false}, {"data": [0.0, 500, 1500, "Get carts in a date range"], "isController": false}, {"data": [0.0, 500, 1500, "Get a single user"], "isController": false}, {"data": [0.0, 500, 1500, "Delete a cart"], "isController": false}, {"data": [1.0, 500, 1500, "Update a product"], "isController": false}, {"data": [1.0, 500, 1500, "Add a new cart"], "isController": false}, {"data": [0.0, 500, 1500, "User login"], "isController": false}, {"data": [0.55, 500, 1500, "Get all products"], "isController": false}, {"data": [0.0, 500, 1500, "Get all users"], "isController": false}, {"data": [0.0, 500, 1500, "Add a new user"], "isController": false}, {"data": [0.0, 500, 1500, "Get user carts"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "Sort results"], "isController": false}, {"data": [1.0, 500, 1500, "Update a cart - patch"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "Limit results"], "isController": false}, {"data": [0.0, 500, 1500, "Delete a user"], "isController": false}, {"data": [0.95, 500, 1500, "Get a single product"], "isController": false}, {"data": [0.15, 500, 1500, "Get products in a specific category"], "isController": false}, {"data": [1.0, 500, 1500, "Update a product - patch"], "isController": false}, {"data": [0.0, 500, 1500, "Get all carts"], "isController": false}, {"data": [1.0, 500, 1500, "Add new product"], "isController": false}, {"data": [1.0, 500, 1500, "Update a cart"], "isController": false}, {"data": [1.0, 500, 1500, "Get all categories"], "isController": false}, {"data": [1.0, 500, 1500, "Update a users - patch"], "isController": false}, {"data": [0.0, 500, 1500, "Get a single cart"], "isController": false}, {"data": [1.0, 500, 1500, "Update a users"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 290, 0, 0.0, 1234.3620689655172, 297, 3041, 1686.0, 2066.0, 2158.0499999999997, 2729.5599999999977, 6.442153900835259, 12.943227824551272, 1.5962206493246847], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Delete a product", 10, 0, 0.0, 1650.9999999999998, 1418, 1984, 1614.5, 1969.9, 1984.0, 1984.0, 1.1697274535033337, 1.258827786875658, 0.24788169668967133], "isController": false}, {"data": ["Get carts in a date range", 10, 0, 0.0, 2024.1000000000001, 1912, 2245, 1992.0, 2235.9, 2245.0, 2245.0, 1.026272577996716, 1.6390294668513958, 0.16636840619868637], "isController": false}, {"data": ["Get a single user", 10, 0, 0.0, 2055.7999999999997, 1990, 2178, 2034.0, 2176.5, 2178.0, 2178.0, 1.0141987829614605, 0.9793356997971603, 0.12677484787018256], "isController": false}, {"data": ["Delete a cart", 10, 0, 0.0, 2058.0000000000005, 1917, 2191, 2054.0, 2184.5, 2191.0, 2191.0, 1.0158472165786265, 0.8273599400650142, 0.21229619565217392], "isController": false}, {"data": ["Update a product", 10, 0, 0.0, 311.70000000000005, 301, 338, 307.5, 337.0, 338.0, 338.0, 1.4513788098693758, 1.1823634796806968, 0.5088330007256894], "isController": false}, {"data": ["Add a new cart", 10, 0, 0.0, 313.0, 298, 363, 309.0, 358.0, 363.0, 363.0, 1.223091976516634, 0.9682015196917808, 0.5076309472847358], "isController": false}, {"data": ["User login", 10, 0, 0.0, 1893.4, 1734, 2233, 1899.0, 2203.2000000000003, 2233.0, 2233.0, 1.0691756655618518, 0.8887522719982893, 0.26729391639046296], "isController": false}, {"data": ["Get all products", 10, 0, 0.0, 808.6, 446, 2066, 695.5, 1949.8000000000004, 2066.0, 2066.0, 1.0324179227751393, 11.417896964691307, 0.13006046097460253], "isController": false}, {"data": ["Get all users", 10, 0, 0.0, 2114.2999999999997, 1988, 2320, 2079.5, 2311.2, 2320.0, 2320.0, 1.0115314586283632, 3.6460572400364155, 0.1244657849484119], "isController": false}, {"data": ["Add a new user", 10, 0, 0.0, 1986.3, 1834, 2065, 1994.5, 2064.4, 2065.0, 2065.0, 1.0120433154539015, 0.6979540911851027, 0.6335153957089363], "isController": false}, {"data": ["Get user carts", 10, 0, 0.0, 2024.0, 1899, 2204, 2021.5, 2195.0, 2204.0, 2204.0, 1.0181225819588677, 0.8296108226430463, 0.13223662441457953], "isController": false}, {"data": ["Sort results", 30, 0, 0.0, 1448.3000000000002, 309, 2284, 1951.0, 2072.3, 2218.0, 2284.0, 0.8125677139761647, 4.404476740249187, 0.10871267267063922], "isController": false}, {"data": ["Update a cart - patch", 10, 0, 0.0, 332.70000000000005, 301, 412, 322.0, 407.40000000000003, 412.0, 412.0, 1.2241400416207613, 0.9685529899620516, 0.5116522830211776], "isController": false}, {"data": ["Limit results", 30, 0, 0.0, 1389.5666666666668, 302, 2082, 1831.5, 2032.7, 2071.0, 2082.0, 0.874865124959902, 1.8774856194045086, 0.11533866393514335], "isController": false}, {"data": ["Delete a user", 10, 0, 0.0, 1933.3, 1749, 2025, 1962.0, 2023.9, 2025.0, 2025.0, 1.0372368011617052, 1.012521393009024, 0.21676628461777825], "isController": false}, {"data": ["Get a single product", 10, 0, 0.0, 336.90000000000003, 298, 584, 308.5, 559.0000000000001, 584.0, 584.0, 1.2169891687963978, 1.3070748904709748, 0.1556890440550079], "isController": false}, {"data": ["Get products in a specific category", 10, 0, 0.0, 1961.1000000000001, 1396, 3041, 1712.0, 3017.5, 3041.0, 3041.0, 1.037344398340249, 2.267367414419087, 0.14891565093360995], "isController": false}, {"data": ["Update a product - patch", 10, 0, 0.0, 312.79999999999995, 302, 340, 312.0, 337.9, 340.0, 340.0, 1.4484356894553883, 1.177702690469293, 0.5106301600521437], "isController": false}, {"data": ["Get all carts", 10, 0, 0.0, 1751.7000000000003, 1612, 2004, 1694.5, 1999.3, 2004.0, 2004.0, 1.1273957158962795, 1.8027321730552426, 0.13872251972942504], "isController": false}, {"data": ["Add new product", 10, 0, 0.0, 318.9, 300, 345, 315.0, 344.8, 345.0, 345.0, 1.446759259259259, 1.1794478804976851, 0.5100391529224537], "isController": false}, {"data": ["Update a cart", 10, 0, 0.0, 305.6, 298, 318, 304.5, 317.1, 318.0, 318.0, 1.2239902080783354, 0.967000076499388, 0.5091990514075887], "isController": false}, {"data": ["Get all categories", 10, 0, 0.0, 314.30000000000007, 297, 340, 316.0, 338.9, 340.0, 340.0, 1.2144765606023804, 0.9030297394947777, 0.1660417172698567], "isController": false}, {"data": ["Update a users - patch", 10, 0, 0.0, 310.09999999999997, 298, 336, 308.5, 334.1, 336.0, 336.0, 1.2218963831867058, 1.1624721254887587, 0.7684582722385143], "isController": false}, {"data": ["Get a single cart", 10, 0, 0.0, 1847.6, 1711, 2000, 1828.0, 1998.6, 2000.0, 2000.0, 1.092896174863388, 0.8884050546448087, 0.13661202185792348], "isController": false}, {"data": ["Update a users", 10, 0, 0.0, 317.70000000000005, 306, 359, 313.0, 355.40000000000003, 359.0, 359.0, 1.22040517451794, 1.1646288442762995, 0.7651368379301927], "isController": false}]}, function(index, item){
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
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 290, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
