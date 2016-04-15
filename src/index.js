'use strict';

const throttle = require('lodash/throttle');
const isEqual = require('lodash/isEqual');

function getPercentageViewable (element) {
  const rect = element.getBoundingClientRect();
  const percentage = (100 / rect.height) * (window.innerHeight - rect.top);
  return percentage === Infinity ? 0 : percentage;

}
var s;
var c;
module.exports = class ScrollTracker {
  constructor({element, buckets, callback, delay}) {
    this.rootEl = element;
    this.rootEl.dataset.scrollTracking = true;
    s = throttle(() => {
      const percentage = getPercentageViewable(element);
      const currentBuckets = buckets.filter(bucket => bucket <= percentage);
      if (!isEqual(currentBuckets, c)) {
        c = currentBuckets;
        callback(currentBuckets);
      }
    }, delay);
    document.addEventListener('scroll', s);
  }

  destroy () {
    document.removeEventListener('scroll', s);
    delete this.rootEl.dataset.scrollTracking;
    delete this.rootEl;
  }
};
