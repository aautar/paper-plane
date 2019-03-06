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


test('sendFormData makes successful ajax call and calls success callback', () => {

    window.XMLHttpRequest = jest.fn().mockImplementation(xhrSuccessMockClass);

    const onSuccess = jest.fn();
    const xhr = PaperPlane.sendFormData(PaperPlane.HttpMethod.POST, "/test-url", new FormData(), new Map(), onSuccess);
    xhr.onload();

    expect(xhr.open).toHaveBeenCalled();
    expect(xhr.send).toHaveBeenCalled();    
    expect(onSuccess).toHaveBeenCalled();    
});


test('sendFormData makes successful ajax call with headers', () => {

    window.XMLHttpRequest = jest.fn().mockImplementation(xhrSuccessMockClass);

    const headers = new Map();
    headers.set('X-Custom-Header', 'header-value');

    const onSuccess = jest.fn();
    const xhr = PaperPlane.sendFormData(PaperPlane.HttpMethod.POST, "/test-url", new FormData(), headers, onSuccess);
    xhr.onload();

    expect(xhr.setRequestHeader).toHaveBeenLastCalledWith('X-Custom-Header', 'header-value');
});


test('sendFormData makes failed ajax call and calls failure callback', () => {

    window.XMLHttpRequest = jest.fn().mockImplementation(xhrSuccessMockClass);

    const onSuccess = jest.fn();
    const onFailure = jest.fn();
    const xhr = PaperPlane.sendFormData(PaperPlane.HttpMethod.POST, "/test-url", new FormData(), new Map(), onSuccess, onFailure);
    xhr.status = 500;
    xhr.onload();

    expect(xhr.open).toHaveBeenCalled();
    expect(xhr.send).toHaveBeenCalled();    
    expect(onFailure).toHaveBeenCalled();    
});

test('sendJson makes successful ajax call and calls success callback', () => {

    window.XMLHttpRequest = jest.fn().mockImplementation(xhrSuccessMockClass);

    const onSuccess = jest.fn();
    const xhr = PaperPlane.sendJson(PaperPlane.HttpMethod.POST, "/test-url", { "testKey": "testValue" }, new Map(), onSuccess);
    xhr.onload();

    expect(xhr.open).toHaveBeenCalled();
    expect(xhr.send).toHaveBeenCalled();    
    expect(onSuccess).toHaveBeenCalled();    
});


test('ajax makes successful ajax call and calls success callback', () => {

    window.XMLHttpRequest = jest.fn().mockImplementation(xhrSuccessMockClass);

    const onSuccess = jest.fn();
    const xhr = PaperPlane.recv(PaperPlane.HttpMethod.POST, "/test-url", new Map(), onSuccess);
    xhr.onload();

    expect(xhr.open).toHaveBeenCalled();
    expect(xhr.send).toHaveBeenCalled();    
    expect(onSuccess).toHaveBeenCalled();    
});

test('ajax makes successful ajax call and calls success callback', () => {

    window.XMLHttpRequest = jest.fn().mockImplementation(xhrSuccessMockClass);

    const onSuccess = jest.fn();
    const xhr = PaperPlane.recv(PaperPlane.HttpMethod.POST, "/test-url", new Map(), onSuccess);
    xhr.onload();

    expect(xhr.open).toHaveBeenCalled();
    expect(xhr.send).toHaveBeenCalled();    
    expect(onSuccess).toHaveBeenCalled();    
});
