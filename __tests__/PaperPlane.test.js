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


test('xhr makes successful ajax call and calls success callback', () => {

    window.XMLHttpRequest = jest.fn().mockImplementation(xhrSuccessMockClass);

    const onSuccess = jest.fn();
    const xhr = PaperPlane.xhr(
        "POST", 
        "/test-url", 
        PaperPlane.makeFormDataRequestData(new FormData(), new Map()), 
        onSuccess
    );

    xhr.onload();

    expect(xhr.open).toHaveBeenCalled();
    expect(xhr.send).toHaveBeenCalled();    
    expect(onSuccess).toHaveBeenCalled();    
});


test('xhr makes successful ajax call with headers', () => {

    window.XMLHttpRequest = jest.fn().mockImplementation(xhrSuccessMockClass);

    const onSuccess = jest.fn();
    
    const xhr = PaperPlane.xhr(
        "POST", 
        "/test-url", 
        PaperPlane.makeFormDataRequestData(new FormData(), new Map([['X-Custom-Header', 'header-value']])), 
        onSuccess
    );

    xhr.onload();

    expect(xhr.setRequestHeader).toHaveBeenLastCalledWith('X-Custom-Header', 'header-value');
});


test('xhr makes failed ajax call and calls failure callback', () => {

    window.XMLHttpRequest = jest.fn().mockImplementation(xhrSuccessMockClass);

    const onSuccess = jest.fn();
    const onFailure = jest.fn();

    const xhr = PaperPlane.xhr(
        "POST", 
        "/test-url", 
        PaperPlane.makeFormDataRequestData(new FormData(), new Map()),
        onSuccess, 
        onFailure
    );

    xhr.status = 500;
    xhr.onload();

    expect(xhr.open).toHaveBeenCalled();
    expect(xhr.send).toHaveBeenCalled();    
    expect(onFailure).toHaveBeenCalled();    
});


test('get makes successful ajax call and calls success callback', () => {

    window.XMLHttpRequest = jest.fn().mockImplementation(xhrSuccessMockClass);

    const onSuccess = jest.fn();
    const xhr = PaperPlane.get( 
        "/test-url", 
        new Map(), 
        onSuccess
    );

    xhr.onload();

    expect(xhr.open).toHaveBeenCalled();
    expect(xhr.send).toHaveBeenCalled();    
    expect(onSuccess).toHaveBeenCalled();    
});
