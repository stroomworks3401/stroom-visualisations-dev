
  var update = function(callback) {
    if (vis && currentData) {
      vis.setData(currentContext, currentSettings, currentData);
    }
    return {
      injectNextScript: this.injectNextScript.bind(this)
    };
  };

VisualisationManager.prototype.injectNextScript = function(scripts, callback) {
  // Implementation of injectNextScript function
  
  // if (!Array.isArray(scripts)) {
  //   scripts = [scripts];
  //   console.log("thats a hit");
  // }
  console.log("injectNextScript called with scripts:", scripts);
  if (scripts.length > 0) {
    const script = scripts.splice(0, 1)[0];
    console.log("script: " + script);
    const cb = {
        onSuccess: function () {
            console.log(script.name);
            DependencyLoader.fetchAndInjectScripts(script.name, {
                onSuccess: function (newScripts) {
                    injectNextScript(newScripts.concat(scripts), callback);
                },
                onFailure: function (ex) {
                    callback.onFailure(ex);
                }
            });
        },
        onFailure: function (ex) {
            callback.onFailure("Failed to inject script '" + script.name + "' - " + ex.message);
        }
    };

    console.log(script.url);
    new ScriptInjector().inject(script.url, cb);
  } else {
      callback.onSuccess(null);
  }
}

var visualisationManager = new VisualisationManager();
window.injectNextScript = visualisationManager.injectNextScript.bind(visualisationManager);
  