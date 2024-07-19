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
(function() {
    this.changeVis = function() {
        
        let visType = getVisType();
        let visName = getVisName();
        let rawType = getRawType(visType);
        console.log(rawType);
        
        sendMessageToIframe(visName);
        const iframe = document.getElementById('myIframe');
        const iframeWindow = iframe.contentWindow;

        // .setVisType instansiates the specific vis
        // let json = {
        //     frameId: 123,
        //     callbackId: 123,
        //     data: {
        //        functionName: "visualisationManager.setVisType",
        //        params: [
        //         "visualisations." + rawType,
        //         selectedTheme
        //        ]
        //     }
        //  };
        //  if (iframeWindow) {
        //      iframeWindow.postMessage(json, '*');
        //  }

         // visualisationManager.setData pushes the data to the vis
         // vis.setData will be called (on the vis) from update(callback) in vis.js
         // todo need to encorporate the test data into the vis.js to send
        //  json = {
        //     frameId: 123,
        //     callbackId: 123,
        //     data: {
        //        functionName: "visualisationManager.setData",
        //        params: [
        //         {},
        //         null,
        //         {
        //             values: [],
        //             min: [],
        //             max: [],
        //             sum: [],
        //             types: [],
        //             sortDirections: []
        //         }
        //        ]
        //     }
        //  };
        //  if (iframeWindow) {
        //      iframeWindow.postMessage(json, '*');
        //  }

        // fetchAndParseXML(visName);
        // import(dependencyAddresses(0, visName));
        // show(visType);
        // var win = frame.contentWindow;
        // if (win) {
        //     win.postMessage(json, '*');
        // }
    }

      function sendMessageToIframe(visName) {
        // injectScripts allows you to inject needed scripts
        const iframe = document.getElementById('myIframe');
        const iframeWindow = iframe.contentWindow;
        let json = {
            frameId: 123,
            callbackId: 123,
            data: {
               functionName: "visualisationManager.injectScripts",
               params: [
                    {
                        name: visName + ".Script.resource.js",
                        url: "/stroom-content/Visualisations/Version3/" + visName + ".Script.resource.js"
                    }
                ]
            }
         };
         if (iframeWindow) {
             iframeWindow.postMessage(json, '*');
         }
      }

    function getVisType() {
        var visType = document.getElementById("visType");
        var index = visType.selectedIndex;
        var value = visType.options[index].value; 
        return value;
    }

    function getVisName() {
        if (visType.value.includes("-")) {
            let index = visType.value.indexOf("-")
            let visName = visType.value.substring(0, index);
            return visName;
        } else {
            let visName = visType.value;
            return visName;
        }
    }

    function getBucketSize() {
        var bucketSize = document.getElementById("bucketSize");
        var index = bucketSize.selectedIndex;
        var value = bucketSize.options[index].value; 
        return value;
    }

    function getRawType(type){
        return type.split("-")[0];
    }
    
    this.update = function() {
        //Todo needs to create a new place and generate a new iframe
    }

    this.autoResize = function() {
        if (document.getElementById("autoResize").checked) {
            resize();
        }
    };

    this.autoUpdate = function() {
        if (document.getElementById("autoUpdate").checked) {
            update();
        }
        setTimeout(autoUpdate, 3000);
    };

    setTimeout(autoUpdate, 3000);
})();
