{{flutter_js}}
{{flutter_build_config}}

// Every demo shares one copy of the engine and its default font, served next to the demos.
_flutter.loader.load({
  config: {
    canvasKitBaseUrl: '/flutter/demos/engine/',
    fontFallbackBaseUrl: '/flutter/demos/engine/fonts/',
  },
})
