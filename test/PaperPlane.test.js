import {PaperPlane} from '../src/PaperPlane';

const xhrSuccessMockClass = () => ({
    open: jest.fn(),
    send: jest.fn(),
    setRequestHeader: jest.fn(),
    status: 200,
    readyState: 4,
    responseText: 'test-response',
    getResponseHeader: function() { return "text/plain"; }
});


beforeEach(() => {
    jest.useFakeTimers();
});


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

    window.XMLHttpRequest = jest.fn().mockImplementation(xhrSuccessMockClass);

    const onSuccess = jest.fn();
    const xhr = PaperPlane.postFormData("/test-url", new FormData(), onSuccess);
    xhr.onload();

    expect(xhr.open).toHaveBeenCalled();
    expect(xhr.send).toHaveBeenCalled();    
    expect(onSuccess).toHaveBeenCalled();    
});

test('postFormData makes successful ajax call with headers', () => {

    window.XMLHttpRequest = jest.fn().mockImplementation(xhrSuccessMockClass);

    const headers = new Map();
    headers.set('X-Custom-Header', 'header-value');

    const onSuccess = jest.fn();
    const xhr = PaperPlane.postFormData("/test-url", new FormData(), onSuccess, ()=>{}, ()=>{}, headers);
    xhr.onload();

    expect(xhr.setRequestHeader).toHaveBeenLastCalledWith('X-Custom-Header', 'header-value');
});

test('postFormData makes failed ajax call and calls failure callback', () => {

    window.XMLHttpRequest = jest.fn().mockImplementation(xhrSuccessMockClass);

    const onSuccess = jest.fn();
    const onFailure = jest.fn();
    const xhr = PaperPlane.postFormData("/test-url", new FormData(), onSuccess, onFailure);
    xhr.status = 500;
    xhr.onload();

    expect(xhr.open).toHaveBeenCalled();
    expect(xhr.send).toHaveBeenCalled();    
    expect(onFailure).toHaveBeenCalled();    
});

test('postFormData retries failed ajax call, for server-side errors, for _numAttempts=3, _canRetryOnServerError=true', () => {

    const sendFunc = jest.fn().mockImplementation(function() {
        this.onload();
    });

    const xhrServerFailureMockClass = () => ({
        open: jest.fn(),    
        setRequestHeader: jest.fn(),
        status: 500,
        readyState: 4,
        responseText: 'test-response',
        send: sendFunc,
        getResponseHeader: function() { return "text/plain"; }
    });

    window.XMLHttpRequest = jest.fn().mockImplementation(xhrServerFailureMockClass);

    const onSuccess = jest.fn();
    const onFailure = jest.fn();
    const onComplete = jest.fn();
    PaperPlane.postFormData("/test-url", new FormData(), onSuccess, onFailure, onComplete, new Map(), 3, true);

    expect(setTimeout).toHaveBeenCalledTimes(1); 
    expect(setTimeout).toHaveBeenLastCalledWith(expect.any(Function), 200);

    jest.advanceTimersByTime(200);

    expect(setTimeout).toHaveBeenCalledTimes(2); 
    expect(setTimeout).toHaveBeenLastCalledWith(expect.any(Function), 400);
    
});


test('postFormData does not retry ajax call, on server-side error, for _numAttempts=3, _canRetryOnServerError=false', () => {

    const sendFunc = jest.fn().mockImplementation(function() {
        this.onload();
    });

    const xhrServerFailureMockClass = () => ({
        open: jest.fn(),    
        setRequestHeader: jest.fn(),
        status: 500,
        readyState: 4,
        responseText: 'test-response',
        send: sendFunc,
        getResponseHeader: function() { return "text/plain"; }
    });

    window.XMLHttpRequest = jest.fn().mockImplementation(xhrServerFailureMockClass);

    const onSuccess = jest.fn();
    const onFailure = jest.fn();
    const onComplete = jest.fn();
    PaperPlane.postFormData("/test-url", new FormData(), onSuccess, onFailure, onComplete, new Map(), 3, false);

    expect(onFailure).toHaveBeenCalled();   
    expect(setTimeout).toHaveBeenCalledTimes(0); 
});

test('ajax makes successful ajax call and calls success callback', () => {

    window.XMLHttpRequest = jest.fn().mockImplementation(xhrSuccessMockClass);

    const onSuccess = jest.fn();
    const xhr = PaperPlane.ajax("GET", "/test-url", "payload", onSuccess);
    xhr.onload();

    expect(xhr.open).toHaveBeenCalled();
    expect(xhr.send).toHaveBeenCalled();    
    expect(onSuccess).toHaveBeenCalled();    
});
