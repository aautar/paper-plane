import {PaperPlane} from '../src/PaperPlane';

test('calculateExpBackoff gives expected number for milliseconds for 1st retry', () => {
    expect(PaperPlane.calculateExpBackoff(1)).toEqual(200);
});

test('calculateExpBackoff gives expected number for milliseconds for 2nd retry', () => {
    expect(PaperPlane.calculateExpBackoff(2)).toEqual(400);
});

test('calculateExpBackoff gives max of 5000 milliseconds', () => {
    expect(PaperPlane.calculateExpBackoff(10000)).toEqual(5000);
});

