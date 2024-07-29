/*
 * Copyright 2024 Crown Copyright
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

var DependencyLoader = (function () {
    function dependencyUrls(fetchName){
        const baseName = fetchName.split('.')[0];
        const urls = [];
        urls[0] = "../stroom-content/Visualisations/Version3/" + baseName + ".Script.xml";
        urls[1] = "../stroom-content/Visualisations/Version3/Dependencies/" + baseName + ".Script.xml";
        urls[2] = "../stroom-content/Visualisations/Version3/Dependencies/Chroma/" + baseName + ".Script.xml";
        urls[3] = "../stroom-content/Visualisations/Version3/Dependencies/D3/" + baseName + ".Script.xml";
        urls[4] = "../stroom-content/Visualisations/Version3/Dependencies/D3-Grid/" + baseName + ".Script.xml";
        urls[5] = "../stroom-content/Visualisations/Version3/Dependencies/D3-Tip/" + baseName + ".Script.xml";
        urls[6] = "../stroom-content/Visualisations/Version3/Dependencies/JSHashes/" + baseName + ".Script.xml";
        urls[7] = "../stroom-content/Visualisations/Version3/Dependencies/Leaflet/" + baseName + ".Script.xml";
        urls[8] = "../stroom-content/Visualisations/Version3/Dependencies/LeafletDraw/" + baseName + ".Script.xml";
        urls[8] = "../stroom-content/Visualisations/Version3/Dependencies/Underscore/" + baseName + ".Script.xml";
        return urls;
    }

    function fetchAndParseXML(fetchName) {
        return new Promise((resolve, reject) => {
            const urls = dependencyUrls(fetchName);
            const fetchPromises = urls.map(url => {
                return fetch(url)
                    .then(response => {
                        if (!response.ok) {
                            throw new Error("Fetch failed for " + url + ". Status: " + response.status);
                        }
                        return response.text().then(xmlText => ({ xmlText, url })); // Attach URL to response
                    })
                    .then(({ xmlText, url }) => {
                        const parser = new DOMParser();
                        const xmlDoc = parser.parseFromString(xmlText, "application/xml");
                        return { xmlDoc, url }; // Return parsed XML document and URL
                    });
            });
    
            Promise.any(fetchPromises)
                .then(({ xmlDoc, url }) => {
                    resolve({ xmlDoc, url }); // Resolve with parsed XML document and URL
                })
                .catch(error => {
                    reject(error); // Reject with error from Promise.any
                });
        });
    }
    
    function loadDependencies(dependenciesXML, baseUrl) {
        return new Promise((resolve, reject) => {
            const scriptElement = dependenciesXML.querySelector('script');
            if (!scriptElement) {
                reject(new Error("No script element found"));
                return;
            }
    
            const dependenciesString = scriptElement.querySelector('dependenciesXML').textContent;
            if (!dependenciesString) {
                reject(new Error("No dependenciesXML element found"));
                return;
            }
    
            const dependenciesParser = new DOMParser();
            const dependenciesDoc = dependenciesParser.parseFromString(dependenciesString, 'application/xml');
    
            const docElements = dependenciesDoc.getElementsByTagName('doc');
            const scripts = [];
    
            for (let i = 0; i < docElements.length; i++) {
                let type = docElements[i].getElementsByTagName('type')[0].textContent;
                let name = docElements[i].getElementsByTagName('name')[0].textContent;
    
                if (type === 'Script') {
                    const scriptUrl = baseUrl.replace(/\.xml$/, ".resource.js");
                    scripts.push({ name: name, url: scriptUrl });
                }
            }
    
            if (scripts.length > 0) {
                console.log(scripts);
                resolve(scripts); // Resolve with scripts array
            } else {
                reject(new Error("No script dependencies found"));
            }
        });
    }

    function fetchAndInjectScripts(fetchName, callback) {
        fetchAndParseXML(fetchName)
            .then(({ xmlDoc, url }) => {
                loadDependencies(xmlDoc, url)
                    .then(scripts => {
                        injectNextScript(scripts, callback);
                    })
                    .catch(error => {
                        callback.onFailure("Failed to load dependencies: " + error.message);
                    });
            })
            .catch(error => {
                callback.onFailure("Failed to fetch and parse XML: " + error.message);
            });
    }
    
    return {
        fetchAndInjectScripts : fetchAndInjectScripts
    };
})();