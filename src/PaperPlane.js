const PaperPlane = {};

PaperPlane.HttpMethod = {
    GET: "GET",
    HEAD: "HEAD",
    POST: "POST",
    PATCH: "PATCH",
    PUT: "PUT",
    DELETE: "DELETE"
};

PaperPlane.ContentType = {
    APPLICATION_JSON: "application/json"
};

/**
 * 
 * @param {XMLHttpRequest} _xhr 
 * @returns {String|Object}
 */
PaperPlane.parseXHRResponseData = function(_xhr) {
    if(_xhr.getResponseHeader('Content-Type') === PaperPlane.ContentType.APPLICATION_JSON) {
        return JSON.parse(responseData);
    }

    return _xhr.responseText;
};

/**
 * @callback PaperPlane~responseCallback
 * @param {String|Object} responseData
 * @param {XMLHttpRequest} xhr
 */

/**
 * 
 * @param {String} _method
 * @param {String} _url
 * @param {FormData} _formData
 * @param {Map} [_httpHeaders=new Map()]
 * @param {PaperPlane~responseCallback} [_onSuccess]
 * @param {PaperPlane~responseCallback} [_onError]
 * @param {PaperPlane~responseCallback} [_onComplete]
 * @returns {XMLHttpRequest}
 */
PaperPlane.sendFormData = function(
    _method, 
    _url, 
    _formData, 
    _httpHeaders,
    _onSuccess, 
    _onError, 
    _onComplete
) {
    _httpHeaders = _httpHeaders || (new Map());
    _onSuccess = _onSuccess || (() => {});
    _onError = _onError || (() => {});        
    _onComplete = _onComplete || (() => {});    

    const internalErrorHander = function(_xhr, _errorMessageHint) {          
        _onError(_errorMessageHint || PaperPlane.parseXHRResponseData(xhr), xhr);
    };

    const xhr = new XMLHttpRequest();
    xhr.open(_method, _url);

    for (let [key,value] of _httpHeaders) {
        xhr.setRequestHeader(key, value);
    }

    xhr.timeout = 30000;
    xhr.onload = function() {
        if(xhr.status >= 400) {
            internalErrorHander(xhr);
        } else {
            _onSuccess(PaperPlane.parseXHRResponseData(xhr), xhr);
        }
    };

    xhr.ontimeout = function() {
        internalErrorHander(xhr, "client timeout");
    };

    xhr.onerror = function() {
        internalErrorHander(xhr);
    };

    xhr.onloadend = function() {
        _onComplete(PaperPlane.parseXHRResponseData(xhr), xhr);
    };

    xhr.send(_formData);    

    return xhr;
};

/**
 * 
 * @param {String} _url
 * @param {String} _method
 * @param {Object} _data
 * @param {Map} [_httpHeaders=new Map()]
 * @param {PaperPlane~responseCallback} _onSuccess
 * @param {PaperPlane~responseCallback} _onError
 * @param {PaperPlane~responseCallback} _onComplete
 * @returns {XMLHttpRequest}
 */
PaperPlane.sendJson = function(
    _method, 
    _url, 
    _data, 
    _httpHeaders,
    _onSuccess, 
    _onError, 
    _onComplete
) {
    _httpHeaders = _httpHeaders || (new Map());
    _onSuccess = _onSuccess || (() => {});
    _onError = _onError || (() => {});        
    _onComplete = _onComplete || (() => {});    

    const internalErrorHander = function(_xhr, _errorMessageHint) {          
        _onError(_errorMessageHint || PaperPlane.parseXHRResponseData(xhr), xhr);
    };

    const xhr = new XMLHttpRequest();
    xhr.open(_method, _url);    

    for (let [key,value] of _httpHeaders) {
        xhr.setRequestHeader(key, value);
    }
        
    xhr.timeout = 30000;

    xhr.onload = function() {
        if(xhr.status >= 400) {
            internalErrorHander(xhr);
        } else {
            _onSuccess(PaperPlane.parseXHRResponseData(xhr), xhr);
        }
    };

    xhr.ontimeout = function() {
        internalErrorHander(xhr, "client timeout");
    };

    xhr.onerror = function() {
        internalErrorHander(xhr);
    };

    xhr.onloadend = function() {
        _onComplete(PaperPlane.parseXHRResponseData(xhr), xhr);
    };    

    xhr.setRequestHeader("Content-Type", PaperPlane.ContentType.APPLICATION_JSON);
    xhr.send(JSON.stringify(_data));   
    
    return xhr;    
};


/**
 * @param {String} _method
 * @param {String} _url 
 * @param {Map} [_httpHeaders=new Map()]
 * @param {PaperPlane~responseCallback} _onSuccess
 * @param {PaperPlane~responseCallback} _onError
 * @param {PaperPlane~responseCallback} _onComplete
 * @returns {XMLHttpRequest}
 */
PaperPlane.recv = function(
    _method,
    _url, 
    _httpHeaders,
    _onSuccess, 
    _onError, 
    _onComplete
) {
    _httpHeaders = _httpHeaders || (new Map());
    _onSuccess = _onSuccess || (() => {});
    _onError = _onError || (() => {});        
    _onComplete = _onComplete || (() => {});    

    const internalErrorHander = function(_xhr, _errorMessageHint) {          
        _onError(_errorMessageHint || PaperPlane.parseXHRResponseData(xhr), xhr);
    };

    const xhr = new XMLHttpRequest();
    xhr.open(_method, _url);    

    for (let [key,value] of _httpHeaders) {
        xhr.setRequestHeader(key, value);
    }
        
    xhr.timeout = 30000;

    xhr.onload = function() {
        if(xhr.status >= 400) {
            internalErrorHander(xhr);
        } else {
            _onSuccess(PaperPlane.parseXHRResponseData(xhr), xhr);
        }
    };

    xhr.ontimeout = function() {
        internalErrorHander(xhr, "client timeout");
    };

    xhr.onerror = function() {
        internalErrorHander(xhr);
    };

    xhr.onloadend = function() {
        _onComplete(PaperPlane.parseXHRResponseData(xhr), xhr);
    };    

    xhr.send(null);   
    
    return xhr;    
};

export { PaperPlane };
