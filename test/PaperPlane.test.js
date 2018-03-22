import {PaperPlane} from '../src/PaperPlane';

const xhrMockClass = () => ({
    open: jest.fn(),
    send: jest.fn(),
    setRequestHeader: jest.fn(),
    status: 200,
    readyState: 4,
    responseText: 'test-response'
});
  
window.XMLHttpRequest = jest.fn().mockImplementation(xhrMockClass)

test('calculateExpBackoff gives expected number for milliseconds for 1st retry', () => {
    expect(PaperPlane.calculateExpBackoff(1)).toEqual(200);
});

test('calculateExpBackoff gives expected number for milliseconds for 2nd retry', () => {
    expect(PaperPlane.calculateExpBackoff(2)).toEqual(400);
});

test('calculateExpBackoff gives max of 5000 milliseconds', () => {
    expect(PaperPlane.calculateExpBackoff(10000)).toEqual(5000);
});

test('postFormData makes successful ajax call and calls success callback', () => {
    const onSuccess = jest.fn();
    const xhr = PaperPlane.postFormData("/test-url", new FormData(), onSuccess);
    xhr.onload();

    expect(xhr.open).toHaveBeenCalled();
    expect(xhr.send).toHaveBeenCalled();    
    expect(onSuccess).toHaveBeenCalled();    
});
