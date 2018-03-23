import {PaperPlane} from '../src/PaperPlane';

const xhrMockClass = () => ({
    open: jest.fn(),
    send: jest.fn(),
    setRequestHeader: jest.fn(),
    status: 200,
    readyState: 4,
    responseText: 'test-response'
});
  
window.XMLHttpRequest = jest.fn().mockImplementation(xhrMockClass);
jest.useFakeTimers();

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

test('postFormData makes failed ajax call and calls failure callback', () => {
    const onSuccess = jest.fn();
    const onFailure = jest.fn();
    const xhr = PaperPlane.postFormData("/test-url", new FormData(), onSuccess, onFailure);
    xhr.status = 500;
    xhr.onload();

    expect(xhr.open).toHaveBeenCalled();
    expect(xhr.send).toHaveBeenCalled();    
    expect(onFailure).toHaveBeenCalled();    
});

test('postFormData retries failed ajax call once for retryCount=1', () => {
    const onSuccess = jest.fn();
    const onFailure = jest.fn();
    const onComplete = jest.fn();

    const xhr = PaperPlane.postFormData("/test-url", new FormData(), onSuccess, onFailure, onComplete, 2);
    xhr.status = 500;
    xhr.onload();

    expect(setTimeout).toHaveBeenCalledTimes(1); 
    expect(setTimeout).toHaveBeenLastCalledWith(expect.any(Function), 200);
});
