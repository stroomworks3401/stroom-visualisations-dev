/*
 * Copyright 2016 Crown Copyright
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
function TestData() {
    //TODO this needs a massive overhaul as it has grown into a bit of a mess.
    //The test data for a vis needs to be driven from the settings.json files
    //as these define the data structures and defaul settings values.
    //Ideally the TestVis UI would also be driven from the same json data, meaning
    //only the controls appropiate to the vis would be show foe that vis
    var commonFunctions = visualisations.commonFunctions;
    var commonConstants = visualisations.commonConstants;

    var millisInHour = 1000 * 60 * 60;
    var millisInDay = millisInHour * 24;
    var millisInWeek = millisInDay * 7;

    var USE_DATES_FOR_GRID_SERIES = false;
    var USE_DATES_FOR_SERIES = false;
    var USE_DATES_FOR_NAMES = false;

    var VIS_TYPE_BAR_CHART = "BarChart";
    var VIS_TYPE_BAR_CHART_BUCKET = "BarChart-bucket";
    var VIS_TYPE_BAR_CHART_ORDINAL = "BarChart-ordinal";
    var VIS_TYPE_BUBBLE_FLAT = "Bubble-flat";
    var VIS_TYPE_BUBBLE_NESTED = "Bubble-nested";
    var VIS_TYPE_DAY_WEEK_HEAT_MAP = "DayWeekHeatMap";
    var VIS_TYPE_DOUGHNUT = "Doughnut";
    var VIS_TYPE_FLOOR_MAP = "FloorMap";
    var VIS_TYPE_FORCE = "Force";
    var VIS_TYPE_FORCE_CANVAS = "ForceCanvas";
    var VIS_TYPE_GAUGE_GR = "Gauge-GreenRed";
    var VIS_TYPE_GAUGE_RG = "Gauge-RedGreen";
    var VIS_TYPE_GEOMAP = "GeoMap";
    var VIS_TYPE_HOUR_DAY_HEAT_MAP = "HourDayHeatMap";
    var VIS_TYPE_HOUR_DAY_MULTI_HEAT_MAP = "HourDayMultiHeatMap";
    var VIS_TYPE_HOUR_DAY_POINT_MAP = "HourDayPointMap";
    var VIS_TYPE_HOUR_DAY_SESSION_MAP = "HourDaySessionMap";
    var VIS_TYPE_LINE_CHART = "LineChart";
    var VIS_TYPE_RADIAL_TREE = "RadialTree";
    var VIS_TYPE_RAG_STATUS_GR = "RAGStatus-GreenRed";
    var VIS_TYPE_RAG_STATUS_RG = "RAGStatus-RedGreen";
    var VIS_TYPE_SCATTER = "Scatter";
    var VIS_TYPE_SERIES_DAY_HEAT_MAP = "SeriesDayHeatMap";
    var VIS_TYPE_SERIES_SESSION_MAP = "SeriesSessionMap";
    var VIS_TYPE_STACKED_AREA = "StackedArea";
    var VIS_TYPE_STATEFUL_LINE_CHART = "LineChart-Stateful";
    var VIS_TYPE_STATEFUL_SESSION_MAP = "SeriesSessionMap-Stateful";
    var VIS_TYPE_STROOM = "Stroom";
    var VIS_TYPE_SUNBURST = "Sunburst";
    var VIS_TYPE_TEXT_VALUE = "TextValue";
    var VIS_TYPE_TIME_SERIES = "TimeSeries";
    var VIS_TYPE_TRAFFIC_LIGHTS_GR = "TrafficLights-GreenRed";
    var VIS_TYPE_TRAFFIC_LIGHTS_RG = "TrafficLights-RedGreen";
    var VIS_TYPE_TREE = "Tree";
    var VIS_TYPE_TREEMAP = "TreeMap";

    //array of visualisations that support the extra level of nesting
    var GRIDABLE_VISUALISATIONS = [
        VIS_TYPE_BAR_CHART,
        VIS_TYPE_BAR_CHART_BUCKET,
        VIS_TYPE_BAR_CHART_ORDINAL,
        VIS_TYPE_BUBBLE_FLAT,
        VIS_TYPE_BUBBLE_NESTED,
        VIS_TYPE_DOUGHNUT,
        VIS_TYPE_FLOOR_MAP,
        VIS_TYPE_GAUGE_GR,
        VIS_TYPE_GAUGE_RG,
        VIS_TYPE_GEOMAP,
        VIS_TYPE_HOUR_DAY_POINT_MAP,
        VIS_TYPE_HOUR_DAY_SESSION_MAP,
        VIS_TYPE_LINE_CHART,
        VIS_TYPE_RAG_STATUS_GR,
        VIS_TYPE_RAG_STATUS_RG,
        VIS_TYPE_SCATTER,
        VIS_TYPE_SERIES_SESSION_MAP,
        VIS_TYPE_STACKED_AREA,
        VIS_TYPE_STATEFUL_LINE_CHART,
        VIS_TYPE_STATEFUL_SESSION_MAP,
        VIS_TYPE_STROOM,
        VIS_TYPE_TEXT_VALUE,
        VIS_TYPE_TIME_SERIES,
        VIS_TYPE_TRAFFIC_LIGHTS_GR,
        VIS_TYPE_TRAFFIC_LIGHTS_RG,
        VIS_TYPE_TREE,
        VIS_TYPE_SUNBURST
    ];

    this.visTestDataSettingsMap = (function() {
        var visTestDataSettingsMap = {};
        visTestDataSettingsMap.isGriddable = function(visName) {
            if (visTestDataSettingsMap[visName]){
                return commonFunctions.isTrue(visTestDataSettingsMap[visName].griddable);
            } else {
                return false;
            }
        };
        visTestDataSettingsMap.getValueFieldIndex = function(visName) {
            if (visTestDataSettingsMap[visName] && visTestDataSettingsMap[visName].hasOwnProperty("valueFieldIndex")) {
                return visTestDataSettingsMap[visName].valueFieldIndex;
            } else {
                return -1;
            }
        };
        visTestDataSettingsMap[VIS_TYPE_DOUGHNUT] = {
            griddable: true
        };
        visTestDataSettingsMap[VIS_TYPE_LINE_CHART] = {
            griddable: true
        };

        visTestDataSettingsMap[VIS_TYPE_HOUR_DAY_MULTI_HEAT_MAP] = {
            griddable: true,
            valueFieldIndex: 0
        };
        return visTestDataSettingsMap;
    })();

    var visSettings;
    var valueFunctions = [];
    var valueCountLimit = null;
    var randomMaxVal;

    this.create = function(visType, pass, addGridSeries, settings, randomMax) {

        randomMaxVal = randomMax;

        visSettings = settings;
        valueFunctions = [];

        if (visType == VIS_TYPE_STROOM) {
            return createStroomData();

        } else if (GRIDABLE_VISUALISATIONS.indexOf(visType) != -1) {
            var maxGridCells = 25;

            if (addGridSeries){
                var seriesCount = Math.max(1, Math.round(Math.random() * maxGridCells));
                //var seriesCount = 2;
                var data = createGridData(visType, pass, seriesCount, true);
                //dumpLevelToConsole(data);
                return data;
            } else {
                //gridable vis but we have no grid series so the grid level of nesting
                //will only ever have one value in its array
                var data = createGridData(visType, pass, 1, false);
                //dumpLevelToConsole(data);
                return data;
            }
        } else {
            var data = createSingleGridCell(visType, pass);
            //dumpLevelToConsole(data);
            return data;
        }
    };

    var buildExtraText = function(len) {
        var charCount = Math.floor(Math.random() * len + 1);
        var arr = new Uint8Array((charCount || 40) / 2);
        window.crypto.getRandomValues(arr);
        return [].map.call(arr, function(n) {
            return n.toString(16); 
        }).join("");
    };

    //recursive debug function to walk the data tree dumping out each level
    var dumpLevelToConsole = function(data, prefix) {
        var prefixStr = prefix ? prefix : "";
        if (data.values) {
            console.log(prefixStr + data.key);
            data.values.forEach(function(d) {
                dumpLevelToConsole(d, prefixStr + "  ");
            });
        } else {
            //this is a leaf
            var str = "";
            data.forEach(function(d) {
                str += prefixStr + d + " (" + new Date(d) + ")";
            });
            console.log(str);
        }
    };

    var createGridData = function(visType, pass, seriesCount, includeKey) {

        var gridData = {};
        gridData.values = [];
        gridData.min = [];
        gridData.max = [];
        gridData.sum = [];

        for (j=0; j< seriesCount; j++){
            //create data for a single cell and add it to gridData.values

            var cellData = createSingleGridCell(visType, pass);
            if (includeKey) {
                if (USE_DATES_FOR_GRID_SERIES) {
                    //for testing grid series keys that are times in MS
                    cellData.key = Date.now() - (j * 1000000);
                } else {

                    //for testing grid series names that are variale length strings
                    cellData.key = "Grid-series-" + j + ' ' + buildExtraText(60);

                    //for testing basic grid series keys 
                    //cellData.key = "grid-series-" + j ;
                }
            }
            gridData.values[j] = cellData;
        }

        //now remove all the types properties of each of gridData.values
        //and add the min/max/sum at the top level

        gridData.types = gridData.values[0].types;

        gridData.types.forEach(
            function(d,i) {
                gridData.min[i] = d3.min(gridData.values, function(d) {return d.min[i];});
                gridData.max[i] = d3.max(gridData.values, function(d) {return d.max[i];});
                gridData.sum[i] = d3.sum(gridData.values, function(d) {return d.sum[i];});
            });

            gridData.values.forEach(
                function(d, i) {
                    delete d.types;
                });
                return gridData;
    };


    var createSingleGridCell = function(visType, pass) {
        var maxSeries = 9;
        var seriesCount;
        var nestValues = false;
        var fieldZeroType = commonConstants.dataTypeDateTime;


        if (visType == VIS_TYPE_FORCE || visType == VIS_TYPE_FORCE_CANVAS || visType == VIS_TYPE_TREE || visType == VIS_TYPE_RADIAL_TREE) {

            seriesCount = 1;
            fieldZeroType = commonConstants.dataTypeNumber;
        } else if (visType === VIS_TYPE_DOUGHNUT) {
            seriesCount = 1;
            valueFunctions[0] = generateTextValue;
            valueFunctions[1] = generateFloatValue;
            fieldZeroType = commonConstants.dataTypeGeneral;
        } else if ([VIS_TYPE_RAG_STATUS_GR, VIS_TYPE_RAG_STATUS_RG, VIS_TYPE_TRAFFIC_LIGHTS_GR, VIS_TYPE_TRAFFIC_LIGHTS_RG, VIS_TYPE_GAUGE_GR, VIS_TYPE_GAUGE_RG].indexOf(visType) !== -1) {
            seriesCount = 1;
            valueFunctions[0] = generateFloatValue;
            fieldZeroType = commonConstants.dataTypeGeneral;
            valueCountLimit = 1;
        } else if (visType === VIS_TYPE_TEXT_VALUE) {
            seriesCount = 1;
            valueFunctions[0] = generateRandomTextValue;
            fieldZeroType = commonConstants.dataTypeGeneral;
            valueCountLimit = 1;
        } else if (visType == VIS_TYPE_HOUR_DAY_HEAT_MAP  || visType == VIS_TYPE_DAY_WEEK_HEAT_MAP) {
            seriesCount = 1;
        } else if (visType == VIS_TYPE_HOUR_DAY_POINT_MAP
        || visType == VIS_TYPE_HOUR_DAY_SESSION_MAP) {
            seriesCount = Math.max(1, Math.round(Math.random() * 5));
            nestValues = true;
        } else if (visType == VIS_TYPE_HOUR_DAY_MULTI_HEAT_MAP || visType == VIS_TYPE_SERIES_SESSION_MAP || visType == VIS_TYPE_SERIES_DAY_HEAT_MAP
        || visType == VIS_TYPE_STATEFUL_SESSION_MAP) {
            seriesCount = Math.max(1, Math.round(Math.random() * 20));
            nestValues = true;
        } else if (visType === VIS_TYPE_BUBBLE_FLAT || visType === VIS_TYPE_BUBBLE_NESTED) {
            seriesCount = 10;
            nestValues = true;
        } else if (visType == VIS_TYPE_BAR_CHART_ORDINAL) {
            seriesCount = Math.max(1, Math.round(Math.random() * 5));
            //seriesCount = 2;
            nestValues = true;
            fieldZeroType = commonConstants.dataTypeGeneral;
            valueFunctions[0] = generateTextValue;
            valueFunctions[1] = generateFloatValue;
        } else if (visType == VIS_TYPE_BAR_CHART_BUCKET || visType == VIS_TYPE_TREE) {
            seriesCount = 1;
            nestValues = true;
        } else if (visType == VIS_TYPE_FLOOR_MAP) {
            seriesCount = Math.round(Math.random() * 5);
            nestValues = true;
            valueFunctions[0] = generateTextValue;
            valueFunctions[1] = generateCampusValue;
            valueFunctions[2] = generateBuildingValue;
            valueFunctions[3] = generateFloorValue;
            valueFunctions[4] = generateXValue;
            valueFunctions[5] = generateYValue;
            valueFunctions[6] = generateMilliEpochValue;
            valueFunctions[7] = generateIconValue;
            valueFunctions[8] = generateSeriesValue;

            valueCountLimit = 9;
            fieldZeroType = commonConstants.dataTypeGeneral;
        } else if (visType == VIS_TYPE_GEOMAP) {
            seriesCount = Math.round(Math.random() * 5);
            nestValues = true;
            valueFunctions[0] = generateTextValue;
            valueFunctions[1] = generateLatitudeValue;
            valueFunctions[2] = generateLongitudeValue;
            valueFunctions[3] = generateMilliEpochValue;
            valueFunctions[4] = generateIconValue;
            valueFunctions[5] = generateSeriesValue;
            valueCountLimit = 6;
            fieldZeroType = commonConstants.dataTypeGeneral;
        } else if (visType == VIS_TYPE_SUNBURST) {
            nestValues = true;
            seriesCount = 1;
        } else {
            // define a random number of series
            seriesCount = Math.max(1, Math.round(Math.random() * maxSeries));
            nestValues = true;
        }

        // console.log("seriesCount: " + seriesCount);

        var date = Date.now() + Math.random() * 10000000 + (1000 * pass);

        var data = {};
        var values = [];

        if (nestValues === false && (visType === VIS_TYPE_BUBBLE_FLAT || visType === VIS_TYPE_BUBBLE_NESTED)) {

            // no nesting of values.
            for (var i = 0; i < seriesCount; i++) {

                var seriesKey = "series-" + i;
                var tmpValues = createGeneralBasedSeries(visType, i, seriesKey , randomMaxVal * 1000);
                for (var j = 0; j < tmpValues.values.length; j++) {
                    var value = [];
                    value[0] = tmpValues.key;
                    value[1] = tmpValues.values[j][0];
                    value[2] = tmpValues.values[j][1];
                    values.push(value);
                }
            }

            data.values = values;
            data.types = [
                commonConstants.dataTypeGeneral,
                commonConstants.dataTypeGeneral, 
                commonConstants.dataTypeNumber
            ];

            computeValueAggregates(data);
        } else if (nestValues === false) {

            // no nesting of values.
            if (fieldZeroType == commonConstants.dataTypeNumber){
                values = createDateBasedValues(visType, pass, date, randomMaxVal);
            } else {
                values = createGeneralBasedValues(visType, pass, randomMaxVal);
            }
            data.values = values;
            data.types = [fieldZeroType, commonConstants.dataTypeNumber];

            computeValueAggregates(data);

        } else {
            //nesting of values
            //var seriesStartNum = 1;
            //var seriesEndNum = 1;
            var seriesStartNum = Math.max(0, Math.round(Math.random() * 2));
            var seriesEndNum = seriesStartNum + seriesCount -1;
            if (seriesCount == 1){
                seriesStartNum = 1;
                seriesEndNum = 1;
            }
            for (var i = seriesStartNum; i <= seriesEndNum; i++) {
                //values[i] = createDateBasedSeries(visType, i, date, "series-" + i, randomMaxVal);
                if (USE_DATES_FOR_SERIES) {
                    //Use this key when you want datetimes
                    var seriesKey = Date.now() - (i * 100000000);
                } else {
                    //Use this key when you want just text
                    var seriesKey = "series-" + i;
                }
                if (visType == VIS_TYPE_BAR_CHART_BUCKET) {
                    values.push(createTimeBucketBasedSeries(visType, i, date, seriesKey, randomMaxVal));
                }else if (fieldZeroType == commonConstants.dataTypeDateTime){
                    values.push(createDateBasedSeries(visType, i, date, seriesKey, randomMaxVal));
                } else {
                    values.push(createGeneralBasedSeries(visType, pass, seriesKey, randomMaxVal));
                }
            }
            data.values = values;
            data.types = [fieldZeroType, commonConstants.dataTypeNumber, commonConstants.dataTypeNumber];

            computeNestedAggregates(data);

        }

        values.sort(function() {
            return 0.5 - Math.random();
        });

        // var json =
        // "[[\"\",[[1.425906626536E12,771.9831463438505],[1.425906626542E12,392.85029453114583],[1.425906626565E12,291.7627553255644],[1.425906626585E12,727.4353469180874],[1.42590662664E12,336.0700068568214],[1.425906626657E12,905.3319043561278],[1.425906626706E12,627.0170493108707],[1.425906626753E12,583.8191192885809],[1.425906626754E12,393.6067384603087],[1.425906626756E12,108.68285295790136],[1.42590662683E12,51.850889496470096],[1.425906626881E12,779.3325047908831],[1.425906626893E12,39.77635356947784],[1.425906626898E12,66.04899357402128],[1.425906626908E12,7.8313240427196895],[1.425906626988E12,463.99625836484995],[1.425906626996E12,353.6141504100866],[1.425906627107E12,692.2151890812365],[1.425906627124E12,724.9127766099954],[1.425906627126E12,221.72503804336563],[1.425906627134E12,769.2273879995296],[1.425906627142E12,317.05164484413075],[1.425906627165E12,518.2156039081038],[1.425906627189E12,982.0929756275818],[1.425906627207E12,445.257196091582],[1.425906627252E12,367.80243829907346],[1.42590662728E12,805.0349981389646],[1.425906627298E12,315.17242801660393],[1.425906627315E12,236.80439062259606],[1.425906627343E12,973.5229822916439],[1.425906627363E12,752.285469753364],[1.425906627423E12,568.7719211921295],[1.42590662743E12,420.7224837852873],[1.425906627431E12,356.24496869254176],[1.425906627436E12,775.7874093695989],[1.425906627439E12,417.2404249052156],[1.425906627441E12,806.9744616683485],[1.42590662746E12,933.8193161320107],[1.425906627495E12,521.2806934840789],[1.425906627505E12,850.7221310015775]]],[\"Test1\",[[1.425906626539E12,700.9917991496208],[1.425906626621E12,753.3025936343813],[1.425906626659E12,942.2977336617784],[1.425906626666E12,442.75633110314317],[1.425906626705E12,440.66453413489046],[1.425906626708E12,100.9159459218868],[1.425906626723E12,329.5151282108949],[1.425906626725E12,136.2351962678766],[1.425906626843E12,184.91209072026336],[1.425906626857E12,246.92093937986093],[1.425906626896E12,583.6706979085681],[1.425906626922E12,62.88207141592539],[1.425906626927E12,167.89454226266577],[1.425906626998E12,983.5904241652183],[1.425906627E12,876.9824241157963],[1.425906627004E12,53.97192344874202],[1.425906627034E12,714.5000189136587],[1.425906627051E12,736.4053756386795],[1.425906627083E12,378.8809669167538],[1.425906627084E12,407.31160912375753],[1.42590662713E12,248.74618594477704],[1.425906627181E12,319.96301014697315],[1.425906627244E12,661.622641855543],[1.425906627262E12,882.2800853594161],[1.425906627274E12,85.78273833310712],[1.425906627329E12,526.5288736904107],[1.425906627351E12,298.0891742771317],[1.425906627373E12,79.63860576479509],[1.425906627422E12,627.7989046462753],[1.425906627441E12,183.01675582669952]]],[\"Test2\",[[1.425906626515E12,529.2060305251887],[1.425906626547E12,603.340022004975],[1.425906626591E12,143.33908201700118],[1.425906626607E12,502.92923996657737],[1.425906626654E12,562.9039076420036],[1.425906626683E12,954.0532325042165],[1.425906626713E12,289.0435819013073],[1.4259066268E12,72.95758906115002],[1.425906626839E12,346.4802485634809],[1.425906626881E12,837.8135725779993],[1.425906626897E12,416.49653595293944],[1.425906626906E12,770.9545113755419],[1.425906626913E12,812.9072493264133],[1.425906626925E12,316.7385335093865],[1.425906626962E12,328.161999047787],[1.425906626974E12,148.8524501924262],[1.425906626995E12,257.9784764175093],[1.425906627018E12,562.813362387815],[1.425906627027E12,780.065282032275],[1.425906627049E12,703.5274616644068],[1.425906627165E12,669.6804497792272],[1.425906627234E12,633.1105236543443],[1.42590662724E12,517.2872296787086],[1.425906627257E12,196.15739755656625],[1.425906627282E12,188.76263088664336],[1.425906627324E12,307.349760131039],[1.425906627345E12,450.33321083577425],[1.425906627417E12,654.9406041716305],[1.425906627447E12,927.0616764480867],[1.425906627506E12,437.33864617178153]]]]";
        // var root = JSON.parse(json);
        // data.values = root;

        // var fieldTypes = {};
        // fieldTypes.x = "Date";
        // fieldTypes.y = "Number";

        // data.fieldTypes = fieldTypes;

        // console.log(data);

        return data;
        };

        var createDateBasedSeries = function(visType, pass, date, key, randomMaxVal) {
            var values = createDateBasedValues(visType, pass, date, randomMaxVal);

            var series = {};
            series.key = key;
            series.values = values;

            computeValueAggregates(series);

            return series;
        };

        var createTimeBucketBasedSeries = function(visType, pass, date, key, randomMaxVal) {

            if (visSettings.bucketSize) {
                var bucketSizeMs = commonFunctions.decodeTimePeriod(visSettings.bucketSize);
                var values = createBucketisedTimeData(randomMaxVal, bucketSizeMs);
            } else {
                var values = createBucketisedTimeData(randomMaxVal);
            }

            var series = {};
            series.key = key;
            series.values = values;

            computeValueAggregates(series);

            return series;
        };

        var createGeneralBasedSeries = function(visType, pass, key, randomMaxVal) {
            var values = createGeneralBasedValues(visType, pass, randomMaxVal);

            var series = {};
            series.key = key;
            series.values = values;

            computeValueAggregates(series);
            return series;
        }

        var valueMap = {};

        var generateTextValue = function(i) {
            var prefix = 'Val ' + i;

            var fullValue = valueMap[prefix];
            if (typeof fullValue == 'undefined'){
                if (Math.random() > 0.5) {
                    fullValue =  prefix + ' ' + buildExtraText(40);
                } else {
                    fullValue =  prefix;
                }
                valueMap[prefix] = fullValue;
            } 
            return fullValue;
        };

        var generateRandomTextValue = function(i) {
            return buildExtraText(50);
        };

        var generateFloatValue = function(i) {
            return Math.random() * randomMaxVal;
        };

        var generateLatitudeValue = function(i) {
            return Math.random() + 51;
        };

        var generateLongitudeValue = function(i) {
            return Math.random() - 0.5;
        };

        var generateMilliEpochValue = function(i, random) {
            return Date.now() + random * 10000000 + (1000 * i);
        }

        var generateXValue = function(i, random) {
            const randomInt = Math.floor(random  * 1000);

            if (randomInt % 2 == 0)  {
                return Math.random() * 100;
            } else {
                return Math.random() * 40;
            }
        };

        var generateYValue = function(i) {
            return Math.random() * 60;
        };

        var generateIconValue = function(i) {
            if (i % 5 == 0) {
                return null;
            } else {
                if (i % 2 == 0) {
                    return 'coffee';
                } else {
                    return 'camera';
                }
            }
        };


        var generateSeriesValue = function(i) {
            if (i % 2 == 0) {
                return 'Coffee Shops';
            } else {
                return 'Points of Interest';
            }
        };

        var generateBuildingValue = function(i, random) {
            const randomInt = Math.floor(random  * 1000);

            if (randomInt % 2 == 0) {
                return 'Headquarters';
            } else {
                return 'Downtown';
            }
            
        }

        var generateCampusValue = function(i, random) {
            return "The Campus";
        }

        var generateFloorValue = function(i, random) {

            const randomInt = Math.floor(random  * 1000);
            if (randomInt % 2 == 0)  {
                const floor = randomInt % 8;
                if (floor == 0) {
                    return "Ground Floor";
                } else if (floor == 2) {
                    return "First Floor";
                } else if  (floor == 4) {
                    return "Second Floor";
                } else {
                    return "Third Floor";
                }
            } else {
                const floor = randomInt % 5;
                if (floor == 1) {
                    return "Basement";
                } else if (floor == 3) {
                    return "North Tower";
                } else {
                    return "South Tower";
                }
            }
        }

        var createGeneralBasedValues = function(visType, pass, randomMaxVal) {
            var values = [];
            while (values.length === 0) {
                var valueCount = valueCountLimit ? valueCountLimit : (9 + Math.random() * 10);
                for (var i = 0; i < valueCount; i++) {
                    //make the series sparse
                    if (Math.random() > 0.1) {
                        var value = [];

                        const randomNumber = Math.random();
                        valueFunctions.forEach(function(valueFunction, j) {
                            value[j] = valueFunction(i, randomNumber);
                        });

                        values.push(value);
                    }
                }
            }
            return values;
        };

        var createDateBasedValues = function(visType, pass, date, randomMaxVal) {
            var values = [];

            if (visType == VIS_TYPE_BAR_CHART_BUCKET) {

                if (visSettings.bucketSize) {
                    var bucketSizeMs = commonFunctions.decodeTimePeriod(visSettings.bucketSize);
                    var values = createBucketisedTimeData(randomMaxVal, bucketSizeMs);
                } else {
                    values = createBucketisedTimeData(randomMaxVal);
                }
            } else if (visType == VIS_TYPE_HOUR_DAY_HEAT_MAP ) {
                values = createHourDayHeatMapData(randomMaxVal);
            } else if (visType == VIS_TYPE_HOUR_DAY_MULTI_HEAT_MAP) {
                values = createHourDayMultiHeatMapData(randomMaxVal);    
            } else if (visType == VIS_TYPE_DAY_WEEK_HEAT_MAP) {
                values = createDayWeekHeatMapData(randomMaxVal);
            } else if (visType == VIS_TYPE_SERIES_DAY_HEAT_MAP) {
                values = createSeriesDayHeatMapData(randomMaxVal);
            } else if (visType == VIS_TYPE_HOUR_DAY_POINT_MAP
            || visType == VIS_TYPE_HOUR_DAY_SESSION_MAP) {
                values = createHourDayPointMapData(randomMaxVal);
            } else if (visType == VIS_TYPE_SERIES_SESSION_MAP ) {
                values = createSeriesSessionMapData(date, randomMaxVal, false);
            }
            else if (visType == VIS_TYPE_STATEFUL_SESSION_MAP) {
                values = createSeriesSessionMapData(date, randomMaxVal, true);
            }
            else if (visType == VIS_TYPE_STATEFUL_LINE_CHART) {
                values = createSeriesSessionMapData(date, randomMaxVal, true);
            }
            else if (visType == VIS_TYPE_FORCE || visType == VIS_TYPE_FORCE_CANVAS) {
                values = createSeriesForceData(pass);
            } 
            else if (visType == VIS_TYPE_RADIAL_TREE) {
                values = createSeriesTreeData();
            }
            else if (visType == VIS_TYPE_TREE){
                values = createPathTreeData();
            }
            else if (visType == VIS_TYPE_SUNBURST){
                values = createSunburstData();
            }

            else {
                //while loop to make sure we have at leat one data point
                //as the 
                while (values.length == 0) {
                    for (var i = 0; i < (9+Math.random()*10); i++) {
                        //make the data sparse
                        if (Math.random() > 0.5) {
                            var value = [];
                            if (visType == VIS_TYPE_DOUGHNUT || visType == VIS_TYPE_BUBBLE_FLAT || visType == VIS_TYPE_BUBBLE_NESTED || visType == VIS_TYPE_TREEMAP) {
                                if (USE_DATES_FOR_NAMES) {
                                    value[0] = Date.now() - (i * 1000000);
                                } else {
                                    var prefix = 'Value ' + i;
                                    if (Math.random() > 0.5) {
                                        value[0] =  prefix + ' ' + buildExtraText(40);
                                    } else {
                                        value[0] =  prefix;
                                    }
                                }
                            } else {
                                var millis = date + (i * 100000);
                                value[0] = millis;
                            }

                            value[1] = Math.random() * randomMaxVal;
                            values.push(value);
                        }
                    }
                } 
            }
            return values;
        };

        function computeValueAggregates(data) {
            data.min = [];
            data.max = [];
            data.sum = [];

            if (!data.values || data.values.length > 0){
                for (i=0; i<data.values[0].length; i++){

                    data.min[i] = d3.min(data.values, function(d) {
                        return d[i];
                    });
    
                    data.max[i] = d3.max(data.values, function(d) {
                        return d[i];
                    });
    
                    data.sum[i] = d3.sum(data.values, function(d) {
                        return d[i];
                    });
                }

            }

        };

        function computeNestedAggregates(data) {
            data.min = [];
            data.max = [];
            data.sum = [];

            if (!data.values || data.values.length > 0){
                for (i=0; i<data.values[0].min.length; i++){

                    data.min[i] = d3.min(data.values, function(d) {
                        return d.min[i];
                    });

                    data.max[i] = d3.max(data.values, function(d) {
                        return d.max[i];
                    });

                    data.sum[i] = d3.sum(data.values, function(d) {
                        return d.sum[i];
                    });
                }
            }
        };

        function createSeriesForceData (pass){
            data = [
                ["Barney McGrew","Pugh 1","SPOD","SDA", 1000],
                ["Barney McGrew","Cuthbert","SPOD", "SPOD"],
                ["Pugh 1","Pugh 1", "SDA", "SDA"],
                ["Pugh 1","Barney McGrew", "SDA", "SPOD"],
                ["Pugh 1","Dibble", "SDA", "Dev"],
                ["Dibble","Grub", "Dev", "Dev"],
                ["Cuthbert","Pugh 2", "SPOD", "SPOD"],
                ["Barney McGrew","Dibble", "SPOD", "Dev"],
                ["Barney McGrew","Pugh 2", "SPOD", "SPOD"],
                ["Cuthbert", "Dibble", "Programme 1", "Dev"],
                ["Barney McGrew","Cuthbert","SPOD", "SPOD"],
                ["Pugh 1","Dibble", "SDA", "Dev"],
                ["Barney McGrew","Cuthbert","SPOD", "SPOD"],
                ["Barney McGrew","Dibble", "SPOD", "Dev"],
                ["Barney McGrew","Cuthbert","SPOD", "SPOD"],
                ["Barney McGrew","Cuthbert","SPOD", "SPOD"],
                ["Barney McGrew","Dibble", "SPOD", "Dev"],
                ["Barney McGrew","Cuthbert","SPOD", "SPOD"],
                ["Barney McGrew","Cuthbert","SPOD", "SPOD"],
                ["Grub","Dibble", "Dev", "Dev"],
                ["Dibble","Grub", "Dev", "Dev"],
                ["Grub","Dibble", "Dev", "Dev"],
                ["Dibble","Grub", "Dev", "Dev"],
                ["Dibble","Grub", "Dev", "Dev"],
                ["Grub","Dibble", "Dev", "Dev"],
                ["Grub","Dibble", "Dev", "Dev"],
                ["Dibble","Grub", "Dev", "Dev"],
                ["Chippy Minton","Captain Flack","SDA", "Manager"],
                ["Barney McGrew","Cuthbert","SPOD", "SPOD"],
                ["Barney McGrew","Cuthbert","SPOD", "SPOD"],
                ["Barney McGrew","Cuthbert","SPOD", "SPOD"],
                ["Barney McGrew","Cuthbert","SPOD", "SPOD"],
                ["Barney McGrew","Cuthbert","SPOD", "SPOD"],
                ["Barney McGrew","Cuthbert","SPOD", "SPOD"],
                ["Captain Flack","Pugh 1","Manager", "SDA"],
                ["Chippy Minton","Dibble","SDA", "Dev"],
                ["Patrick","Cuthbert","Accord", "SPOD"],
                ["Barney McGrew","Cuthbert","SPOD", "SPOD"],
                ["Barney McGrew","Cuthbert","SPOD", "SPOD"],
                ["Barney McGrew","Cuthbert","SPOD", "SPOD"],
                ["Pugh 1","Patrick","SDA", "Accord"],
                ["Dibble","Grub", "Dev", "Dev"],
                ["Grub","Dibble", "Dev", "Dev"],
                ["Dibble","Grub", "Dev", "Dev"],
                ["Dibble","Grub", "Dev", "Dev"],
                ["Chippy Minton","Cuthbert","SDA","Programme 1"],
                ["Captain Flack","Pugh 1","Manager","SDA", 100]
            ];

            // data = [
            //     ["Nasty Man","Evil", "People"],
            //     ["Fido","Evil", "Animals"],
            //     ["Skippy","Bouncy", "Animals"],
            //     ["Pugh 1","Happy", "People"],
            //     ["Skippy","Happy", "Animals"],
            //     ["Ringo","Fab", "People"],
            //     ["John","Fab", "People"],
            //     ["John","Dead", "People"],
            //     ["Skippy","Dead", "Animals"],
            //     ["Ringo", "Bouncy", "People"]
            //   ];

            //   data = [
            //   ["Nasty Man","Evil","People", "Personality"],
            //   ["Fido","Evil", "Animals", "Personality"],
            //   ["Skippy","Bouncy", "Animals", "Appearance"],
            //   ["Pugh 1","Happy", "People", "Demeanor"],
            //   ["Skippy","Happy", "Animals", "Demeanor"]
            // ];

            // data = [
            // ["Nasty Man","Evil",null, "Personality"],
            // ["Fido","Evil", null, "Personality"],
            // ["Skippy","Bouncy", null, "Appearance"],
            // ["Pugh 1","Happy", null, "Demeanor"],
            // ["Skippy","Happy",null, "Demeanor"],
            // ["Fido","Mean", null, "Demeanor"],
            // ["Nasty Man","Happy", null, "Demeanor"]
            // ];


            // data = [
            //   ["Apple", "Green"],
            //   ["Apple", "Red"],
            //   ["Car", "Red"],
            //   ["Car", "Silver"],
            //   ["Car", "Black"],
            //   ["Postbox", "Red"]
            //   ];

            output = [];
            for (var iIsForIndex = 0; iIsForIndex <= pass%data.length; iIsForIndex++)
                output.push(data [iIsForIndex]);

            return output;
        };

        function createSeriesTreeData (){
            data = [
                ["Barney McGrew","Captain Flack","SPOD","Manager"],
                ["Pugh 1","Captain Flack", "SDA", "Manager"],
                ["Cuthbert","Barney McGrew", "SPOD", "SPOD"],
                ["Dibble","Captain Flack", "Dev", "Manager"],
                ["Pugh 2","Barney McGrew", "SPOD", "SPOD"],
                ["Captain Flack","", "Manager", ""],
                ["Grub", "Dibble", "Dev", "Dev"],
                ["John","Edd","Service","Boss"]
            ];

            return data;
        };

        function createPathTreeData(){
            data = [
                ["/home/user/documents/reports/2024/summary.txt"],
                ["/home/user/documents/reports/2024/financials.xlsx"],
                ["/home/user/documents/reports/2023/summary.txt"],
                ["/home/user/documents/reports/2023/financials.xlsx"],
                ["/home/user/documents/reports/2023/notes.txt"],
                ["/home/user/documents/presentations/2024/q1_review.pptx"],
                ["/home/user/documents/presentations/2024/q2_review.pptx"],
                ["/home/user/documents/presentations/2023/annual_review.pptx"],
                ["/home/user/music/playlists/rock/summer2024.m3u"],
                ["/home/user/music/playlists/pop/top_hits_2023.m3u"],
                ["/home/user/music/playlists/rock/classics.m3u"],
                ["/home/user/music/albums/rock/album1/song1.mp3"],
                ["/home/user/music/albums/rock/album1/song2.mp3"],
                ["/home/user/music/albums/pop/album2/song1.mp3"],
                ["/home/user/music/albums/pop/album2/song2.mp3"],
                ["/home/user/pictures/vacation_2023/beach.jpg"],
                ["/home/user/pictures/vacation_2023/mountains.jpg"],
                ["/home/user/pictures/vacation_2024/beach.jpg"],
                ["/home/user/pictures/family/holidays/christmas_2023.jpg"],
                ["/home/user/pictures/family/holidays/christmas_2024.jpg"],
                ["/home/user/pictures/family/reunion_2023/group_photo.jpg"],
                ["/var/log/apache2/access.log"],
                ["/var/log/apache2/error.log"],
                ["/var/log/nginx/access.log"],
                ["/var/log/nginx/error.log"],
                ["/etc/nginx/sites-available/default"],
                ["/etc/nginx/sites-available/example.com"],
                ["/etc/nginx/sites-enabled/default"],
                ["/etc/nginx/sites-enabled/example.com"],
                ["/etc/ssh/sshd_config"],
                ["/etc/ssh/ssh_config"],
                ["/home/user/projects/myapp/src/main.py"],
                ["/home/user/projects/myapp/src/utils/helpers.py"],
                ["/home/user/projects/myapp/tests/test_main.py"],
                ["/home/user/projects/myapp/tests/test_helpers.py"],
                ["/home/user/.config/code/settings.json"],
                ["/home/user/.config/code/keybindings.json"],
                ["/home/user/.config/terminal/config.json"],
                ["/opt/software/config/settings.yaml"],
                ["/opt/software/config/backup.yaml"],
                ["/opt/software/logs/install.log"],
                ["/opt/software/logs/update.log"],
                ["/var/www/html/index.html"],
                ["/var/www/html/about.html"],
                ["/var/www/html/css/styles.css"],
                ["/var/www/html/js/scripts.js"],
                ["/mnt/external_drive/backups/2024/q1_backup.tar.gz"],
                ["/mnt/external_drive/backups/2024/q2_backup.tar.gz"],
                ["/mnt/external_drive/backups/2023/full_backup.tar.gz"],
                ["/mnt/external_drive/photos/vacation_2023/beach.jpg"]
            ];

            // Below to only return random 5 paths
            // for (let i = data.length - 1; i > 0; i--) {
            //     const j = Math.floor(Math.random() * (i + 1));
            //     [data[i], data[j]] = [data[j], data[i]];
            // }
                
            // return data.slice(0, 5);
            return data;
        };

        function createSunburstData(){
            data = [
                {
                "name": "flare",
                "children": [
                 {
                  "name": "analytics",
                  "children": [
                   {
                    "name": "cluster",
                    "children": [
                     {"name": "AgglomerativeCluster", "value": 3938},
                     {"name": "CommunityStructure", "value": 3812},
                     {"name": "HierarchicalCluster", "value": 6714},
                     {"name": "MergeEdge", "value": 743}
                    ]
                   },
                   {
                    "name": "graph",
                    "children": [
                     {"name": "BetweennessCentrality", "value": 3534},
                     {"name": "LinkDistance", "value": 5731},
                     {"name": "MaxFlowMinCut", "value": 7840},
                     {"name": "ShortestPaths", "value": 5914},
                     {"name": "SpanningTree", "value": 3416}
                    ]
                   },
                   {
                    "name": "optimization",
                    "children": [
                     {"name": "AspectRatioBanker", "value": 7074}
                    ]
                   }
                  ]
                 },
                 {
                  "name": "animate",
                  "children": [
                   {"name": "Easing", "value": 17010},
                   {"name": "FunctionSequence", "value": 5842},
                   {
                    "name": "interpolate",
                    "children": [
                     {"name": "ArrayInterpolator", "value": 1983},
                     {"name": "ColorInterpolator", "value": 2047},
                     {"name": "DateInterpolator", "value": 1375},
                     {"name": "Interpolator", "value": 8746},
                     {"name": "MatrixInterpolator", "value": 2202},
                     {"name": "NumberInterpolator", "value": 1382},
                     {"name": "ObjectInterpolator", "value": 1629},
                     {"name": "PointInterpolator", "value": 1675},
                     {"name": "RectangleInterpolator", "value": 2042}
                    ]
                   },
                   {"name": "ISchedulable", "value": 1041},
                   {"name": "Parallel", "value": 5176},
                   {"name": "Pause", "value": 449},
                   {"name": "Scheduler", "value": 5593},
                   {"name": "Sequence", "value": 5534},
                   {"name": "Transition", "value": 9201},
                   {"name": "Transitioner", "value": 19975},
                   {"name": "TransitionEvent", "value": 1116},
                   {"name": "Tween", "value": 6006}
                  ]
                 },
                 {
                  "name": "data",
                  "children": [
                   {
                    "name": "converters",
                    "children": [
                     {"name": "Converters", "value": 721},
                     {"name": "DelimitedTextConverter", "value": 4294},
                     {"name": "GraphMLConverter", "value": 9800},
                     {"name": "IDataConverter", "value": 1314},
                     {"name": "JSONConverter", "value": 2220}
                    ]
                   },
                   {"name": "DataField", "value": 1759},
                   {"name": "DataSchema", "value": 2165},
                   {"name": "DataSet", "value": 586},
                   {"name": "DataSource", "value": 3331},
                   {"name": "DataTable", "value": 772},
                   {"name": "DataUtil", "value": 3322}
                  ]
                 },
                 {
                  "name": "display",
                  "children": [
                   {"name": "DirtySprite", "value": 8833},
                   {"name": "LineSprite", "value": 1732},
                   {"name": "RectSprite", "value": 3623},
                   {"name": "TextSprite", "value": 10066}
                  ]
                 },
                 {
                  "name": "flex",
                  "children": [
                   {"name": "FlareVis", "value": 4116}
                  ]
                 },
                 {
                  "name": "physics",
                  "children": [
                   {"name": "DragForce", "value": 1082},
                   {"name": "GravityForce", "value": 1336},
                   {"name": "IForce", "value": 319},
                   {"name": "NBodyForce", "value": 10498},
                   {"name": "Particle", "value": 2822},
                   {"name": "Simulation", "value": 9983},
                   {"name": "Spring", "value": 2213},
                   {"name": "SpringForce", "value": 1681}
                  ]
                 },
                 {
                  "name": "query",
                  "children": [
                   {"name": "AggregateExpression", "value": 1616},
                   {"name": "And", "value": 1027},
                   {"name": "Arithmetic", "value": 3891},
                   {"name": "Average", "value": 891},
                   {"name": "BinaryExpression", "value": 2893},
                   {"name": "Comparison", "value": 5103},
                   {"name": "CompositeExpression", "value": 3677},
                   {"name": "Count", "value": 781},
                   {"name": "DateUtil", "value": 4141},
                   {"name": "Distinct", "value": 933},
                   {"name": "Expression", "value": 5130},
                   {"name": "ExpressionIterator", "value": 3617},
                   {"name": "Fn", "value": 3240},
                   {"name": "If", "value": 2732},
                   {"name": "IsA", "value": 2039},
                   {"name": "Literal", "value": 1214},
                   {"name": "Match", "value": 3748},
                   {"name": "Maximum", "value": 843},
                   {
                    "name": "methods",
                    "children": [
                     {"name": "add", "value": 593},
                     {"name": "and", "value": 330},
                     {"name": "average", "value": 287},
                     {"name": "count", "value": 277},
                     {"name": "distinct", "value": 292},
                     {"name": "div", "value": 595},
                     {"name": "eq", "value": 594},
                     {"name": "fn", "value": 460},
                     {"name": "gt", "value": 603},
                     {"name": "gte", "value": 625},
                     {"name": "iff", "value": 748},
                     {"name": "isa", "value": 461},
                     {"name": "lt", "value": 597},
                     {"name": "lte", "value": 619},
                     {"name": "max", "value": 283},
                     {"name": "min", "value": 283},
                     {"name": "mod", "value": 591},
                     {"name": "mul", "value": 603},
                     {"name": "neq", "value": 599},
                     {"name": "not", "value": 386},
                     {"name": "or", "value": 323},
                     {"name": "orderby", "value": 307},
                     {"name": "range", "value": 772},
                     {"name": "select", "value": 296},
                     {"name": "stddev", "value": 363},
                     {"name": "sub", "value": 600},
                     {"name": "sum", "value": 280},
                     {"name": "update", "value": 307},
                     {"name": "variance", "value": 335},
                     {"name": "where", "value": 299},
                     {"name": "xor", "value": 354},
                     {"name": "_", "value": 264}
                    ]
                   },
                   {"name": "Minimum", "value": 843},
                   {"name": "Not", "value": 1554},
                   {"name": "Or", "value": 970},
                   {"name": "Query", "value": 13896},
                   {"name": "Range", "value": 1594},
                   {"name": "StringUtil", "value": 4130},
                   {"name": "Sum", "value": 791},
                   {"name": "Variable", "value": 1124},
                   {"name": "Variance", "value": 1876},
                   {"name": "Xor", "value": 1101}
                  ]
                 },
                 {
                  "name": "scale",
                  "children": [
                   {"name": "IScaleMap", "value": 2105},
                   {"name": "LinearScale", "value": 1316},
                   {"name": "LogScale", "value": 3151},
                   {"name": "OrdinalScale", "value": 3770},
                   {"name": "QuantileScale", "value": 2435},
                   {"name": "QuantitativeScale", "value": 4839},
                   {"name": "RootScale", "value": 1756},
                   {"name": "Scale", "value": 4268},
                   {"name": "ScaleType", "value": 1821},
                   {"name": "TimeScale", "value": 5833}
                  ]
                 },
                 {
                  "name": "util",
                  "children": [
                   {"name": "Arrays", "value": 8258},
                   {"name": "Colors", "value": 10001},
                   {"name": "Dates", "value": 8217},
                   {"name": "Displays", "value": 12555},
                   {"name": "Filter", "value": 2324},
                   {"name": "Geometry", "value": 10993},
                   {
                    "name": "heap",
                    "children": [
                     {"name": "FibonacciHeap", "value": 9354},
                     {"name": "HeapNode", "value": 1233}
                    ]
                   },
                   {"name": "IEvaluable", "value": 335},
                   {"name": "IPredicate", "value": 383},
                   {"name": "IValueProxy", "value": 874},
                   {
                    "name": "math",
                    "children": [
                     {"name": "DenseMatrix", "value": 3165},
                     {"name": "IMatrix", "value": 2815},
                     {"name": "SparseMatrix", "value": 3366}
                    ]
                   },
                   {"name": "Maths", "value": 17705},
                   {"name": "Orientation", "value": 1486},
                   {
                    "name": "palette",
                    "children": [
                     {"name": "ColorPalette", "value": 6367},
                     {"name": "Palette", "value": 1229},
                     {"name": "ShapePalette", "value": 2059},
                     {"name": "SizePalette", "value": 2291}
                    ]
                   },
                   {"name": "Property", "value": 5559},
                   {"name": "Shapes", "value": 19118},
                   {"name": "Sort", "value": 6887},
                   {"name": "Stats", "value": 6557},
                   {"name": "Strings", "value": 22026}
                  ]
                 },
                 {
                  "name": "vis",
                  "children": [
                   {
                    "name": "axis",
                    "children": [
                     {"name": "Axes", "value": 1302},
                     {"name": "Axis", "value": 24593},
                     {"name": "AxisGridLine", "value": 652},
                     {"name": "AxisLabel", "value": 636},
                     {"name": "CartesianAxes", "value": 6703}
                    ]
                   },
                   {
                    "name": "controls",
                    "children": [
                     {"name": "AnchorControl", "value": 2138},
                     {"name": "ClickControl", "value": 3824},
                     {"name": "Control", "value": 1353},
                     {"name": "ControlList", "value": 4665},
                     {"name": "DragControl", "value": 2649},
                     {"name": "ExpandControl", "value": 2832},
                     {"name": "HoverControl", "value": 4896},
                     {"name": "IControl", "value": 763},
                     {"name": "PanZoomControl", "value": 5222},
                     {"name": "SelectionControl", "value": 7862},
                     {"name": "TooltipControl", "value": 8435}
                    ]
                   },
                   {
                    "name": "data",
                    "children": [
                     {"name": "Data", "value": 20544},
                     {"name": "DataList", "value": 19788},
                     {"name": "DataSprite", "value": 10349},
                     {"name": "EdgeSprite", "value": 3301},
                     {"name": "NodeSprite", "value": 19382},
                     {
                      "name": "render",
                      "children": [
                       {"name": "ArrowType", "value": 698},
                       {"name": "EdgeRenderer", "value": 5569},
                       {"name": "IRenderer", "value": 353},
                       {"name": "ShapeRenderer", "value": 2247}
                      ]
                     },
                     {"name": "ScaleBinding", "value": 11275},
                     {"name": "Tree", "value": 7147},
                     {"name": "TreeBuilder", "value": 9930}
                    ]
                   },
                   {
                    "name": "events",
                    "children": [
                     {"name": "DataEvent", "value": 2313},
                     {"name": "SelectionEvent", "value": 1880},
                     {"name": "TooltipEvent", "value": 1701},
                     {"name": "VisualizationEvent", "value": 1117}
                    ]
                   },
                   {
                    "name": "legend",
                    "children": [
                     {"name": "Legend", "value": 20859},
                     {"name": "LegendItem", "value": 4614},
                     {"name": "LegendRange", "value": 10530}
                    ]
                   },
                   {
                    "name": "operator",
                    "children": [
                     {
                      "name": "distortion",
                      "children": [
                       {"name": "BifocalDistortion", "value": 4461},
                       {"name": "Distortion", "value": 6314},
                       {"name": "FisheyeDistortion", "value": 3444}
                      ]
                     },
                     {
                      "name": "encoder",
                      "children": [
                       {"name": "ColorEncoder", "value": 3179},
                       {"name": "Encoder", "value": 4060},
                       {"name": "PropertyEncoder", "value": 4138},
                       {"name": "ShapeEncoder", "value": 1690},
                       {"name": "SizeEncoder", "value": 1830}
                      ]
                     },
                     {
                      "name": "filter",
                      "children": [
                       {"name": "FisheyeTreeFilter", "value": 5219},
                       {"name": "GraphDistanceFilter", "value": 3165},
                       {"name": "VisibilityFilter", "value": 3509}
                      ]
                     },
                     {"name": "IOperator", "value": 1286},
                     {
                      "name": "label",
                      "children": [
                       {"name": "Labeler", "value": 9956},
                       {"name": "RadialLabeler", "value": 3899},
                       {"name": "StackedAreaLabeler", "value": 3202}
                      ]
                     },
                     {
                      "name": "layout",
                      "children": [
                       {"name": "AxisLayout", "value": 6725},
                       {"name": "BundledEdgeRouter", "value": 3727},
                       {"name": "CircleLayout", "value": 9317},
                       {"name": "CirclePackingLayout", "value": 12003},
                       {"name": "DendrogramLayout", "value": 4853},
                       {"name": "ForceDirectedLayout", "value": 8411},
                       {"name": "IcicleTreeLayout", "value": 4864},
                       {"name": "IndentedTreeLayout", "value": 3174},
                       {"name": "Layout", "value": 7881},
                       {"name": "NodeLinkTreeLayout", "value": 12870},
                       {"name": "PieLayout", "value": 2728},
                       {"name": "RadialTreeLayout", "value": 12348},
                       {"name": "RandomLayout", "value": 870},
                       {"name": "StackedAreaLayout", "value": 9121},
                       {"name": "TreeMapLayout", "value": 9191}
                      ]
                     },
                     {"name": "Operator", "value": 2490},
                     {"name": "OperatorList", "value": 5248},
                     {"name": "OperatorSequence", "value": 4190},
                     {"name": "OperatorSwitch", "value": 2581},
                     {"name": "SortOperator", "value": 2023}
                    ]
                   },
                   {"name": "Visualization", "value": 16540}
                  ]
                 }
                ]
                }
            ]
            
            return data;
        }

        function createBucketisedTimeData(randomMaxVal, bucketSizeMs) {

            var values = [];

            if ( !bucketSizeMs) {
                var bucketSizeMs = millisInHour;
            }

            var startTimeDeltaMs = bucketSizeMs * Math.floor(Math.random() * 10)  ;
            var now = new Date();
            var nowMs = now.getTime();
            if (bucketSizeMs === millisInWeek) {
                //special case for week buckets as unix epoch is a thursday
                var truncatedNowMs = commonFunctions.getWeekCommencingDate(now).getTime();
            } else {
                var truncatedNowMs = commonFunctions.truncateToStartOfInterval(now.getTime(), bucketSizeMs);
            }
            var startTimeMs =  truncatedNowMs - startTimeDeltaMs;
            var bucketsOnChart = Math.floor(Math.random() * 20 ) + 1  ;

            var arrPos = 0;

            for (var i = 0; i <= bucketsOnChart; i++) {

                // in 10% of cases don't produce a value to make the data sparse
                if (Math.random() > 0.1) {
                    var value = [];

                    var millis = startTimeMs + (i * bucketSizeMs);

                    // console.log(new Date(millis));
                    value[0] = millis;

                    value[1] = Math.random() * randomMaxVal;

                    values[arrPos++] = value;
                }
            }

            return values;
        };

        function createHourDayHeatMapData(randomMaxVal, bucketSizeMs) {

            var values = [];

            if ( !bucketSizeMs) {
                var bucketSizeMs = millisInHour;
            }

            // get the number of the week since 1970 and add it to the object
            var weekNo = Math.floor(Date.now() / millisInWeek);

            // this ensures our period starts and ends mid way through a day
            var startDelta = Math.floor(Math.random() * 22) + 1;
            var hoursInPeriod = (Math.floor(Math.random() * 10) + 1) * 24;

            // use these if you want the days to be static
            // var startDelta = 0;
            // var hoursInPeriod = 7 * 24;

            // work out the date of the monday of the week of the data item
            var startOfWeek = new Date((weekNo * millisInWeek) - (millisInDay * 3)
                - (millisInHour * startDelta));

            var arrPos = 0;

            // construct a values array for each hour since the start of the week so we
            // have 24 of them
            for (var i = 0; i < (hoursInPeriod * (millisInHour / bucketSizeMs)); i++) {

                // in 10% of cases don't produce a value to make the data sparse
                if (Math.random() > 0.1) {
                    var value = [];

                    var millis = startOfWeek.getTime() + (i * bucketSizeMs);

                    // console.log(new Date(millis));
                    value[0] = millis;

                    value[1] = Math.random() * randomMaxVal;

                    values[arrPos++] = value;
                }
            }

            return values;
        };

        function createHourDayMultiHeatMapData(randomMaxVal) {

            var values = [];

            // get the number of the week since 1970 and add it to the object
            var weekNo = Math.floor(Date.now() / millisInWeek);

            // this ensures our period starts and ends mid way through a day
            var startDelta = Math.floor(Math.random() * 72) + 1;
            var hoursInPeriod = (Math.floor(Math.random() * 15) + 1) * 24;

            // use these if you want the days to be static
            // var startDelta = 0;
            // var hoursInPeriod = 7 * 24;

            // work out the date of the monday of the week of the data item
            var startOfWeek = new Date((weekNo * millisInWeek) - (millisInDay * 1)
                - (millisInHour * startDelta));

            var arrPos = 0;

            // construct a values array for each hour since the start of the week so we
            // have 24 of them
            for (var i = 0; i < hoursInPeriod; i++) {

                // in 10% of cases don't produce a value to make the data sparse
                if (Math.random() > 0.1) {
                    var value = [];

                    var millis = startOfWeek.getTime() + (i * millisInHour);

                    // console.log(new Date(millis));
                    value[0] = millis;

                    value[1] = Math.random() * randomMaxVal;

                    values[arrPos++] = value;
                }
            }

            return values;
        };

        function createDayWeekHeatMapData(randomMaxVal) {

            var values = [];
            // get the number of the week since 1970 and add it to the object
            var weekNo = Math.floor(Date.now() / millisInWeek);

            // this ensures our period starts and ends mid way through a week
            var startDelta = Math.floor(Math.random() * 6) + 1;
            var daysInPeriod = (Math.floor(Math.random() * 30) + 1) * 7;

            // use these if you want the days to be static
            // var startDelta = 0;
            // var hoursInPeriod = 7 * 24;

            // work out the date of the monday of the week of the data item
            var startOfWeek = new Date((weekNo * millisInWeek)
                - (millisInDay * startDelta));

            var arrPos = 0;

            // construct a values array for each hour since the start of the week so we
            // have 24 of them
            for (var i = 0; i < daysInPeriod; i++) {

                // in 10% of cases don't produce a value to make the data sparse
                if (Math.random() > 0.1) {
                    var value = [];

                    var millis = startOfWeek.getTime() + (i * millisInDay);

                    // console.log(new Date(millis));
                    value[0] = millis;

                    value[1] = Math.random() * randomMaxVal;

                    values[arrPos++] = value;
                }
            }
            return values;
        };

        function createHourDayPointMapData(randomMaxVal) {

            var values = [];

            // get the number of the week since 1970 and add it to the object
            var weekNo = Math.floor(Date.now() / millisInWeek);

            // this ensures our period starts and ends mid way through a day
            var startDelta = Math.floor(Math.random() * 22) + 1;
            var hoursInPeriod = (Math.floor(Math.random() * 10) + 1) * 24;

            // use these if you want the days to be static
            // var startDelta = 0;
            // var hoursInPeriod = 7 * 24;

            // work out the date of the monday of the week of the data item
            var startOfWeek = (weekNo * millisInWeek) - (millisInDay * 3)
                - (millisInHour * startDelta);
            var endOfWeek = startOfWeek + (millisInHour * hoursInPeriod);

            var arrPos = 0;

            var eventTimeMs = startOfWeek += (Math.random() * millisInHour);

            while (eventTimeMs <= endOfWeek) {
                var value = [];

                value[0] = eventTimeMs;
                value[1] = Math.random() * randomMaxVal;
                values[arrPos++] = value;

                eventTimeMs += Math.floor((Math.random() * millisInHour));

                // console.log(new Date(eventTimeMs));
            }

            return values;
        };

        function createHourDaySessionMapData(randomMaxVal) {

            var values = [];

            // get the number of the week since 1970 and add it to the object
            var weekNo = Math.floor(Date.now() / millisInWeek);

            // this ensures our period starts and ends mid way through a day
            var startDelta = Math.floor(Math.random() * 22) + 1;
            var hoursInPeriod = (Math.floor(Math.random() * 10) + 1) * 24;

            // use these if you want the days to be static
            // var startDelta = 0;
            // var hoursInPeriod = 7 * 24;

            // work out the date of the monday of the week of the data item
            var startOfWeek = (weekNo * millisInWeek) - (millisInDay * 3)
                - (millisInHour * startDelta);
            var endOfWeek = startOfWeek + (millisInHour * hoursInPeriod);

            var arrPos = 0;

            var eventTimeMs = startOfWeek += (Math.random() * millisInHour);

            while (eventTimeMs <= endOfWeek) {

                var value = [];

                value[0] = eventTimeMs;
                values[arrPos++] = value;

                eventTimeMs += Math.floor((Math.random() * millisInHour));

                // console.log(new Date(eventTimeMs));
            }

            return values;
        };

        function createSeriesSessionMapData(date, randomMaxVal, stateChangeField) {

            var values = [];

            var startTime = date - Math.floor(Math.random() * millisInDay);
            var endTime = date + Math.floor(Math.random() * millisInDay);

            // console.log("Date: " + new Date(date) + " start: " + new Date(startTime)
            // + " end: " + new Date(endTime));

            var arrPos = 0;

            var eventTimeMs = startTime;

            while (eventTimeMs <= endTime) {

                var value = [];

                value[0] = eventTimeMs;

                if (stateChangeField)
                    value[1] = (Math.floor((Math.random() * 1000) % 2) === 0) ? "OUT" : "IN" ;
                else
                    value [1] = null;
                values[arrPos++] = value;


                eventTimeMs += Math.floor((Math.random() *  millisInHour * 3 ));

                // console.log(new Date(eventTimeMs));
            }

            return values;
        };

        function createSeriesDayHeatMapData(randomMaxVal) {

            var values = [];

            // for 5% of series we have no data at all
            if (Math.random() <= 0.05) {
                return values;
            }

            var startOfDay = Math.floor(Date.now() / millisInDay) * millisInDay;

            // build data that starts and ends up to 6 hours from either end
            var startDelta = Math.floor(Math.random() * 6) * millisInHour;

            var endDelta = Math.floor(Math.random() * 6) * millisInHour;

            var startTime = startOfDay + startDelta;

            var endTime = startOfDay + (millisInHour * 23) - endDelta;

            var arrPos = 0;

            var time = startTime;

            // construct a values array for each hour since the start of the week so we
            // have 24 of them
            while (time <= endTime) {

                // in 5% of cases don't produce a value to make the data sparse
                if (Math.random() > 0.05) {
                    var value = [];

                    // console.log(new Date(millis));
                    value[0] = time;

                    value[1] = Math.random() * randomMaxVal;

                    values[arrPos++] = value;
                }
                time += millisInHour;
            }

            return values;
        };


        function createSeriesNameData(randomMaxVal) {

            var values = [];
            // get the number of the week since 1970 and add it to the object
            var weekNo = Math.floor(Date.now() / millisInWeek);

            // this ensures our period starts and ends mid way through a week
            var startDelta = Math.floor(Math.random() * 6) + 1;
            var daysInPeriod = (Math.floor(Math.random() * 30) + 1) * 7;

            // use these if you want the days to be static
            // var startDelta = 0;
            // var hoursInPeriod = 7 * 24;

            // work out the date of the monday of the week of the data item
            var startOfWeek = new Date((weekNo * millisInWeek)
                - (millisInDay * startDelta));

            var arrPos = 0;

            // construct a values array for each hour since the start of the week so we
            // have 24 of them
            for (var i = 0; i < daysInPeriod; i++) {

                // in 10% of cases don't produce a value to make the data sparse
                if (Math.random() > 0.1) {
                    var value = [];

                    var millis = startOfWeek.getTime() + (i * millisInDay);

                    // console.log(new Date(millis));
                    value[0] = millis;

                    value[1] = Math.random() * randomMaxVal;

                    values[arrPos++] = value;
                }
            }

            return values;
        };

        var createStroomData = function() {
            var d = {
                types: [commonConstants.dataTypeGeneral],
                values: []
            };

            var colours = commonConstants.categoryGoogle().range();
            colours.push("#00BFA5");

            colours.forEach(function(colour) {
                var value = {
                    key: colour.toUpperCase(),
                    min: [colour],
                    max: [colour],
                    sum: [0],
                    types: [commonConstants.dataTypeGeneral],
                    values: [ [colour] ]
                };
                d.values.push(value);
            });

            computeNestedAggregates(d);

            return d;
        };
}
