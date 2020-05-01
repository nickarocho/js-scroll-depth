let windowHeight, docHeight, trackLength, currentScrollMarker;
const pageMarkers = [0, 25, 50, 75, 100];
const THROTTLE_RATE = 150;

const percentEl = document.querySelector('#percent');
const pageHeightEl = document.querySelector('#page-height');
const windowHeightEl = document.querySelector('#window-height');
const scrollMarkerEl = document.querySelector('#scroll-marker');

const scrollDepth = {
  init() {
    try {
      window.addEventListener('scroll', _.throttle(scrollDepth.getScrollDepth, THROTTLE_RATE));
    } catch (e) {
      window.addEventListener('scroll', scrollDepth.poorManThrottle(scrollDepth.getScrollDepth, THROTTLE_RATE));
      console.error(e, 'Firing poor man throttle');
    }
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
    for (let i = 0; i < pageMarkers.length; i++) {
      if ((percentScrolled >= pageMarkers[i] && percentScrolled < pageMarkers[i + 1]) && currentScrollMarker !== pageMarkers[i]) {
        currentScrollMarker = pageMarkers[i];
        scrollDepth.emitDataLayerEvt(pageMarkers[i]);
      } else if ((percentScrolled === pageMarkers[pageMarkers.length - 1]) && currentScrollMarker !== pageMarkers[pageMarkers.length - 1]) {
        currentScrollMarker = pageMarkers[pageMarkers.length - 1];
        scrollDepth.emitDataLayerEvt(pageMarkers[pageMarkers.length - 1]);
      }
    }
  },
  emitDataLayerEvt(val) {
    scrollMarkerEl.textContent = `${val}%`;
  },
  poorManThrottle(callback, limit) {
    var tick = false;
    return function () {
      if (!tick) {
        callback.call();
        tick = true;
        setTimeout(function () {
          tick = false;
        }, limit);
      }
    }
  },
}

window.addEventListener('load', function() {
  scrollDepth.init();
});

try {
  window.addEventListener('scroll', _.throttle(scrollDepth.getScrollDepth, THROTTLE_RATE));
} catch (e) {
  console.error(e, 'Debounce method unavailable');
}
