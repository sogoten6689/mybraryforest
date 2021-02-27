FilePond.registerPlugin(
    FilePondPluginImagePreview,
    FilePondPluginImageResize,
    FilePondPluginFileEncode,
)

FilePond.setOptions({
  stylePanelAspectRadio: 150/100,
  imageResizeWidth: 100,  
  imageResizeHeight: 150  
})

FilePond.parse(document.body);