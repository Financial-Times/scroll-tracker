'use strict';

const throttle = require('lodash/throttle');
const isEqual = require('lodash/isEqual');

function getPercentageViewable (element) {
  const rect = element.getBoundingClientRect();
  const percentage = (100 / rect.height) * (window.innerHeight - rect.top);
  return percentage === Infinity ? 0 : percentage;

}

module.exports = (function() {
  let scrollHandler_;
  let currentBuckets_;

  class ScrollTracker {
    constructor({element, buckets, callback, delay}) {
      this.rootEl = element;
      this.rootEl.dataset.scrollTracking = true;
      scrollHandler_ = throttle(() => {
        const percentage = getPercentageViewable(element);
        const currentBuckets = buckets.filter(bucket => bucket <= percentage);
        if (!isEqual(currentBuckets, currentBuckets_)) {
          currentBuckets_ = currentBuckets;
          callback(currentBuckets);
        }
      }, delay);
      document.addEventListener('scroll', scrollHandler_);
    }

    destroy () {
      document.removeEventListener('scroll', scrollHandler_);
      delete this.rootEl.dataset.scrollTracking;
      delete this.rootEl;
    }
  };

  return ScrollTracker;
}());
