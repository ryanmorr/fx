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
        const anim = fx('#animation-element');
        expect(anim.getElement()).to.equal(document.querySelector('#animation-element'));
    });
});
