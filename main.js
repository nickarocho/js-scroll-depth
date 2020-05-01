let windowHeight, docHeight, trackLength, currentScrollMarker;
const pageMarkers = [0, 25, 50, 75, 100];
const THROTTLE_RATE = 150;

const percentEl = document.querySelector('#percent');
const pageHeightEl = document.querySelector('#page-height');
const windowHeightEl = document.querySelector('#window-height');

const scrollDepth = {
  init() {
    window.addEventListener('scroll', _.throttle(scrollDepth.getScrollDepth, THROTTLE_RATE));
    windowHeight = scrollDepth.getWindowHeight();
    docHeight = scrollDepth.getDocumentHeight();
    trackLength = docHeight - windowHeight
    windowHeightEl.textContent = `${windowHeight}px`;
    pageHeightEl.textContent = `${docHeight}px`;
  },
  getWindowHeight() {
    return window.innerHeight || (document.documentElement || document.body).clientHeight;
  },
  getDocumentHeight() {
    const D = document;
    return Math.max(
      D.body.scrollHeight, D.documentElement.scrollHeight,
      D.body.offsetHeight, D.documentElement.offsetHeight,
      D.body.clientHeight, D.documentElement.clientHeight
    );
  },
  getScrollDepth() {
    const scrollTop = window.pageYOffset || (document.documentElement || document.body.parentNode || document.body).scrollTop;
    const percentScrolled = Math.floor(scrollTop / trackLength * 100);
    percentEl.textContent = `${percentScrolled}%`;
    switch (true) {
      case percentScrolled >= pageMarkers[0] && percentScrolled < pageMarkers[1] :
        if (currentScrollMarker != pageMarkers[0]) {
          scrollDepth.emitDataLayerEvt(pageMarkers[0]);
          currentScrollMarker = pageMarkers[0];
        }
        break;
      case percentScrolled >= pageMarkers[1] && percentScrolled < pageMarkers[2] :
        if (currentScrollMarker != pageMarkers[1]) {
          scrollDepth.emitDataLayerEvt(pageMarkers[1]);
          currentScrollMarker = pageMarkers[1];
        }
        break;
      case percentScrolled >= pageMarkers[2] && percentScrolled < pageMarkers[3] :
        if (currentScrollMarker != pageMarkers[2]) {
          scrollDepth.emitDataLayerEvt(pageMarkers[2]);
          currentScrollMarker = pageMarkers[2];
        }
        break;
      case percentScrolled >= pageMarkers[3] :
        if (currentScrollMarker != pageMarkers[3]) {
          scrollDepth.emitDataLayerEvt(pageMarkers[3]);
          currentScrollMarker = pageMarkers[3]
        }
        break;
    }
  },
  emitDataLayerEvt(val) {
    console.log(`EMIT DATALAYER EVENT: ${val}% scrolled`);
    percentEl.textContent = `${val}%`;
  }
}

window.addEventListener('load', function() {
  scrollDepth.init();
});
window.addEventListener('resize', _.debounce(scrollDepth.init, 100));
