Ext.Loader.setConfig({
  enabled: true,
  disableCaching: false
});
Ext.application({
  name: 'Scene',
  appFolder: 'app',
  autoCreateViewport: 'Scene.view.Main',
  quickTips: false,
  platformConfig: {
    desktop: { quickTips: true }
  },
  launch: function () {},
  init: function() {
    var renderer;
  }
});