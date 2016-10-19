/* eslint-disable max-len */

import { expect } from 'chai';
import fx from '../../src/fx';

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

    it('should support animating properties', (done) => {
        const el = document.createElement('div');
        const anim = fx(el);
        anim.animate({width: 100, height: 100}, 1000);
        setTimeout(() => {
            expect(el.style.width).to.equal('100px');
            expect(el.style.height).to.equal('100px');
            done();
        }, 1100);
    });
});
