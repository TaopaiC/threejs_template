var camera, scene;

module.exports = {
  setCamera: function(newCamera) {
    camera = newCamera;
    return camera;
  },

  getCamera: function() {
    return camera;
  },

  setScene: function(newScene) {
    scene = newScene;
    return scene;
  },

  getScene: function() {
    return scene;
  }
};
