const rootStyles = window.getComputedStyle(document.documentElement)

if( rootStyles.getPropertyValue('--book-cover-with-large') != null && 
rootStyles.getPropertyValue('--book-cover-with-large') != ''){
  ready();
} else {
  document.getElementById("main-css").addEventListener('load', ready)
}

function ready() {

  const coverWidth = parseFloat(rootStyles.getPropertyValue('--book-cover-width-large'))
  const coverAspectRatio = parseFloat(rootStyles.getPropertyValue('--book-cover-aspect-large'))
  const coverHeight = coverWidth / coverAspectRatio

  FilePond.registerPlugin(
      FilePondPluginImagePreview,
      FilePondPluginImageResize,
      FilePondPluginFileEncode,
  )
  
  FilePond.setOptions({
    stylePanelAspectRadio: coverAspectRatio,
    imageResizeWidth: coverWidth,  
    imageResizeHeight: coverHeight  
  })
  
  FilePond.parse(document.body);

}
