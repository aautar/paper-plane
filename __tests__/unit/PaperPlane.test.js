import {PaperPlane} from '../../src/PaperPlane';

const plainTextBlob = new Blob(["test-response"], {type : 'text/plain'});
const jsonBlob = new Blob([JSON.stringify({"message": "123"})], {type: 'application/json'});

const xhrClientFailureMockClass = () => ({
    open: jest.fn(),
    send: jest.fn(),
    setRequestHeader: jest.fn(),
    status: 1,
    readyState: 4,
    response: null,
    getResponseHeader: function() { }
});

const xhrSuccessMockClass = () => ({
    open: jest.fn(),
    send: jest.fn(),
    setRequestHeader: jest.fn(),
    status: 200,
    readyState: 4,
    response: plainTextBlob,
    getResponseHeader: function() { return "text/plain"; }
});

PaperPlane.convertBlobToString = function(_blob, _onConvert) {
    // Note that the actual PaperPlane.convertBlobToString implementation depends on the onloadend event being fired,
    // the delay is simulated with setTimeout
    if(_blob === plainTextBlob) {
        setTimeout(
            () => {
                _onConvert('test-response');
            }, 
            0
        );
    }

    if(_blob === jsonBlob) {
        setTimeout(
            () => {
                _onConvert(`{"message": "123"}`);
            }, 
            0
        );
    }
};

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
    
    jest.runAllTimers();

    expect(onSuccess).toHaveBeenCalledWith('test-response', xhr);
});

test('xhr makes successful ajax call and calls complete callback', () => {
    window.XMLHttpRequest = jest.fn().mockImplementation(xhrSuccessMockClass);

    const onSuccess = jest.fn();
    const onFailure = jest.fn();
    const onComplete = jest.fn();
    const xhr = PaperPlane.xhr(
        "POST", 
        "/test-url", 
        PaperPlane.makeFormDataRequestData(new FormData(), new Map()), 
        onSuccess,
        onFailure,
        onComplete
    );

    xhr.onloadend();

    expect(xhr.open).toHaveBeenCalled();
    expect(xhr.send).toHaveBeenCalled();
    
    jest.runAllTimers();

    expect(onComplete).toHaveBeenCalledWith('test-response', xhr);
});

test('xhr makes successful ajax call and calls success callback, with parsed JSON', () => {
    window.XMLHttpRequest = jest.fn().mockImplementation(
        () => ({
            open: jest.fn(),
            send: jest.fn(),
            setRequestHeader: jest.fn(),
            status: 200,
            readyState: 4,
            response: jsonBlob,
            getResponseHeader: function() { return "application/json"; }
        })
    );

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

    jest.runAllTimers();

    expect(onSuccess).toHaveBeenCalledWith({ "message": "123" }, xhr);
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

    jest.runAllTimers();

    expect(onFailure).toHaveBeenCalled();    
});

test('xhr makes failed ajax call and calls complete callback', () => {
    window.XMLHttpRequest = jest.fn().mockImplementation(xhrSuccessMockClass);

    const onSuccess = jest.fn();
    const onFailure = jest.fn();
    const onComplete = jest.fn();

    const xhr = PaperPlane.xhr(
        "POST", 
        "/test-url", 
        PaperPlane.makeFormDataRequestData(new FormData(), new Map()),
        onSuccess, 
        onFailure,
        onComplete
    );

    xhr.status = 500;
    xhr.onloadend();

    expect(xhr.open).toHaveBeenCalled();
    expect(xhr.send).toHaveBeenCalled();

    jest.runAllTimers();

    expect(onComplete).toHaveBeenCalled();    
});

test('xhr calls failure callback on client timeout', () => {
    window.XMLHttpRequest = jest.fn().mockImplementation(xhrClientFailureMockClass);

    const onSuccess = jest.fn();
    const onFailure = jest.fn();
    const onComplete = jest.fn();

    const xhr = PaperPlane.xhr(
        "POST", 
        "/test-url", 
        PaperPlane.makeFormDataRequestData(new FormData(), new Map()),
        onSuccess, 
        onFailure,
        onComplete
    );

    xhr.ontimeout();

    expect(xhr.open).toHaveBeenCalled();
    expect(xhr.send).toHaveBeenCalled();

    jest.runAllTimers();

    expect(onFailure).toHaveBeenCalled();    
});

test('xhr calls complete callback on client timeout', () => {
    window.XMLHttpRequest = jest.fn().mockImplementation(xhrClientFailureMockClass);

    const onSuccess = jest.fn();
    const onFailure = jest.fn();
    const onComplete = jest.fn();

    const xhr = PaperPlane.xhr(
        "POST", 
        "/test-url", 
        PaperPlane.makeFormDataRequestData(new FormData(), new Map()),
        onSuccess, 
        onFailure,
        onComplete
    );

    xhr.ontimeout();
    xhr.onloadend();

    expect(xhr.open).toHaveBeenCalled();
    expect(xhr.send).toHaveBeenCalled();

    jest.runAllTimers();

    expect(onComplete).toHaveBeenCalled();    
});


test('xhr makes failed ajax call and calls failure callback, with bad response body (JSON content expected, but invalid JSON in body)', () => {
    window.XMLHttpRequest = () => ({
        open: jest.fn(),
        send: jest.fn(),
        setRequestHeader: jest.fn(),
        status: 200,
        readyState: 4,
        response: plainTextBlob,
        getResponseHeader: function() { return "application/json"; }
    });
    
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

    jest.runAllTimers();

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

    jest.runAllTimers();

    expect(onSuccess).toHaveBeenCalled();    
});

test('makeBlobRequestData sets Content-Type header = Blob type', () => {
    const testBlob = new Blob(['abc123'], {type: 'text/plain'});
    const reqData = PaperPlane.makeBlobRequestData(testBlob);
    
    expect(reqData.headers.get('Content-Type')).toBe("text/plain");
});

test('makeUrlQueryString returns encoded query string', () => {
    const params = new Map();
    params.set("p1", "100%");
    params.set("p2", "path/path");

    const queryString = PaperPlane.makeUrlQueryString(params);
    
    expect(queryString).toBe("text/plain");
});
