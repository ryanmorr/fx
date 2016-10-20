/* eslint-disable max-len */

import Promise from 'promise-polyfill';
import { expect } from 'chai';
import fx from '../../src/fx';

// Polyfill promises for PhantomJS
window.Promise = Promise;

describe('fx', () => {
    it('should support providing a DOM element', () => {
        const el = document.createElement('div');
        const anim = fx(el);
        expect(anim.getElement()).to.equal(el);
    });

    it('should support providing a CSS selector string', () => {
        const el = document.createElement('div');
        el.id = 'fx-element';
        document.body.appendChild(el);
        const anim = fx('#fx-element');
        expect(anim.getElement()).to.equal(el);
        document.body.removeChild(el);
    });

    it('should support promises', (done) => {
        const el = document.createElement('div');
        const promise = fx(el).animate({width: 100});
        promise.then(() => {
            expect(promise.constructor).to.equal(Promise);
            done();
        });
    });

    it('should know if the element is currently animating', (done) => {
        const el = document.createElement('div');
        const anim = fx(el);
        expect(anim.isAnimating()).to.equal(false);
        anim.animate({width: 100}).then(() => {
            expect(anim.isAnimating()).to.equal(false);
            done();
        });
        expect(anim.isAnimating()).to.equal(true);
    });

    it('should support animating numeric properties', (done) => {
        const el = document.createElement('div');
        fx(el).animate({
            width: 100,
            height: 100
        }, 1000);
        setTimeout(() => {
            expect(el.style.width).to.equal('100px');
            expect(el.style.height).to.equal('100px');
            done();
        }, 1100);
    });

    it('should support animating colors', (done) => {
        const el = document.createElement('div');
        fx(el).animate({
            color: 'rgb(0, 0, 255)',
            backgroundColor: '#00FFFF',
            borderColor: '#01F'
        }, 1000);
        setTimeout(() => {
            expect(el.style.color).to.equal('rgb(0, 0, 255)');
            expect(el.style.borderColor).to.equal('rgb(0, 17, 255)');
            expect(el.style.backgroundColor).to.equal('rgb(0, 255, 255)');
            done();
        }, 1100);
    });

    it('should support scroll animations', (done) => {
        const el = document.createElement('div');
        el.style.cssText = 'height: 100px; overflow: scroll';
        el.innerHTML = '<div style="height: 1000px"></div>';
        document.body.appendChild(el);
        fx(el).animate({scrollTop: 200}, 1000);
        setTimeout(() => {
            expect(el.scrollTop).to.equal(200);
            document.body.removeChild(el);
            done();
        }, 1100);
    });
});
