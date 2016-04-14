const throttle = require('lodash/throttle');
const isEqual = require('lodash/isEqual');

function getPercentageViewable (element) {
  const rect = element.getBoundingClientRect();
	return (100 / rect.height) * (window.innerHeight - rect.top);
}

module.exports = (function() {
  let _scrollHandler = new WeakMap();
  let _currentBuckets = new WeakMap();

  class ScrollTracker {
    constructor({element, buckets, callback, delay}) {
      this.rootEl = element;
      this.rootEl.dataset.scrollTracking = true;
      _scrollHandler.set(this, throttle(() => {
        const percentage = getPercentageViewable(element);
        const currentBuckets = buckets.filter(bucket => bucket <= percentage);
        if (!isEqual(currentBuckets, _currentBuckets.get(this))) {
          _currentBuckets.set(this, currentBuckets);
          callback(currentBuckets);
        }
      }, delay));
      document.addEventListener('scroll', _scrollHandler.get(this));
    }

    destroy () {
      document.removeEventListener('scroll', _scrollHandler.get(this));
      delete this.rootEl.dataset.scrollTracking;
      delete this.rootEl;
    }
  };

  return ScrollTracker;
}());