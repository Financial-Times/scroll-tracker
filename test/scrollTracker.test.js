/* eslint-env es6 */
/* global describe, beforeEach, afterEach, it */

const sandbox = require('./helpers/sandbox');
const ScrollTracker = require('./../src');

const chai = require('chai');
chai.use(require('chai-dom'));
const expect = chai.expect;
const sinon = require('sinon/pkg/sinon');

describe('ScrollTracker API', () => {

	it('is defined', () => {
		expect(ScrollTracker).to.be.a('function');
	});

	it('has a destroy instance method', () => {
		expect(ScrollTracker.prototype.destroy).to.be.a('function');
	});

});

describe('ScrollTracker instance', () => {

	beforeEach(() => {
		sandbox.init();
		sandbox.setContents(`<div id='test' style='height: 10000px; min-height: 10000px;'>Hello world</div>`);
	});

	afterEach(() => {
		sandbox.reset();
	});

	it('is defined', () => {
    const scrollTracker = new ScrollTracker({element: document.querySelector('#test'), buckets: [25, 50, 75, 100], callback: () => {}});
		expect(scrollTracker).to.be.a('object');
	});

	it('has the correct prototype', () => {
    const scrollTracker = new ScrollTracker({element: document.querySelector('#test'), buckets: [25, 50, 75, 100], callback: () => {}});
		expect(Object.getPrototypeOf(scrollTracker)).to.equal(ScrollTracker.prototype);
	});

  it('has rootEl defined as the element passed in to the constructor', () => {
    const scrollTracker = new ScrollTracker({element: document.querySelector('#test'), buckets: [25, 50, 75, 100], callback: () => {}});
    expect(scrollTracker.rootEl).to.equal(document.querySelector('#test'));
  });

	it('sets a data attribute on the root element of the component', () => {
    const scrollTracker = new ScrollTracker({element: document.querySelector('#test'), buckets: [25, 50, 75, 100], callback: () => {}});
		expect(scrollTracker.rootEl.hasAttribute('data-scroll-tracking')).to.be.true;
	});

  it('adds scroll event listeners to the element passed in to the constructor', () => {
    const realAddEventListener = document.addEventListener;
		const addEventListenerSpy = sinon.spy();
		document.addEventListener = addEventListenerSpy;

		new ScrollTracker({element: document.querySelector('#test'), buckets: [25, 50, 75, 100], callback: () => {}});

		expect(addEventListenerSpy.calledOnce).to.be.true;
    expect(addEventListenerSpy.args[0][0]).to.equal('scroll');
		expect(addEventListenerSpy.calledOn(document)).to.be.true;

    document.addEventListener = realAddEventListener;
  });

  it('fires events when scrolled past a bucket precentage threshold', (done) => {
    const spy = sinon.spy();
    new ScrollTracker({element: document.querySelector('#test'), buckets: [25, 50, 75, 100], callback: spy});
    window.scrollTo(0, 2500);
    setTimeout(() => {
      expect(spy.calledOnce).to.be.true;
      expect(spy.args[0][0]).to.eql([25]);
      window.scrollTo(0, 3000);
      setTimeout(() => {
        expect(spy.calledOnce).to.be.true;
        expect(spy.calledTwice).to.be.false;
        window.scrollTo(0, 5000);
        setTimeout(() => {
          expect(spy.calledTwice).to.be.true;
          expect(spy.args[1][0]).to.eql([25, 50]);
          window.scrollTo(0, 7500);
          setTimeout(() => {
            expect(spy.calledThrice).to.be.true;
            expect(spy.args[2][0]).to.eql([25, 50, 75]);
            window.scrollTo(0, 10000);
            setTimeout(() => {
              expect(spy.callCount).to.equal(4);
              expect(spy.args[3][0]).to.eql([25, 50, 75, 100]);
              done();
            }, 250);
          }, 250);
        }, 250);
      }, 250);
    }, 250);
  });

  it('throttles events to 250ms', (done) => {
    const spy = sinon.spy();
    new ScrollTracker({element: document.querySelector('#test'), buckets: [25, 50, 75, 100], callback: spy});
    window.scrollTo(0, 2500);
    window.scrollTo(0, 5000);
    setTimeout(() => {
      expect(spy.calledOnce).to.be.true;
      expect(spy.args[0][0]).to.eql([25, 50]);
      done();
    }, 250);
  });

  it('does not fire events when the instance is destroyed', (done) => {
    const spy = sinon.spy();
    const scrollTracker = new ScrollTracker({element: document.querySelector('#test'), buckets: [25, 50, 75, 100], callback: spy});
    scrollTracker.destroy();
    window.scrollTo(0, 2500);
    setTimeout(() => {
      expect(spy.calledOnce).to.be.false;
      done();
    }, 250);
  });

  it('when destroyed, removes the rootEl property from the object', () => {
    const scrollTracker = new ScrollTracker({element: document.querySelector('#test'), buckets: [25, 50, 75, 100], callback: () => {}});
    expect(scrollTracker.rootEl).to.equal(document.querySelector('#test'));
		scrollTracker.destroy();
		expect(scrollTracker.rootEl).to.be.undefined;
	});

	it('when destroyed, removes the data attribute which was added during JS initialisation', () => {
    const scrollTracker = new ScrollTracker({element: document.querySelector('#test'), buckets: [25, 50, 75, 100], callback: () => {}});
		scrollTracker.destroy();
		expect(document.querySelector('#test').hasAttribute('data-scroll-tracking')).to.be.false;
	});

  it('when destroyed, removes all event listeners which were added by the component', () => {
		const realAddEventListener = document.addEventListener;
		const addEventListenerSpy = sinon.spy();
		document.addEventListener = addEventListenerSpy;

		const scrollTracker = new ScrollTracker({element: document.querySelector('#test'), buckets: [25, 50, 75, 100], callback: () => {}});

		const trackedElement = document;
		expect(addEventListenerSpy.calledOnce).to.be.true;
    expect(addEventListenerSpy.args[0][0]).to.equal('scroll');
		expect(addEventListenerSpy.calledOn(trackedElement)).to.be.true;

		const trackedElementEventAndHandler = addEventListenerSpy.args[0];

		const realRemoveEventListener = document.removeEventListener;
		const removeEventListenerSpy = sinon.spy();
		document.removeEventListener = removeEventListenerSpy;

		scrollTracker.destroy();

		expect(removeEventListenerSpy.calledOnce).to.be.true;
    expect(removeEventListenerSpy.args[0][0]).to.equal('scroll');
		expect(removeEventListenerSpy.calledOn(trackedElement)).to.be.true;

		expect(removeEventListenerSpy.calledWith(...trackedElementEventAndHandler)).to.be.true;

		document.addEventListener = realAddEventListener;
		document.removeEventListener = realRemoveEventListener;
	});
});