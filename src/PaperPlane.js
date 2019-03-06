const PaperPlane = {};

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
        return JSON.parse(_xhr.responseText);
    }

    return _xhr.responseText;
};

/**
 * @param {FormData} _data
 * @param {Map} _httpHeaders
 * @returns {Object}
 */
PaperPlane.makeFormDataRequestData = function(_data, _httpHeaders) {
    return {
        body: _data,
        headers: (_httpHeaders || new Map())
    };
};

/**
 * @param {Object} _data
 * @param {Map} _httpHeaders
 * @returns {Object}
 */
PaperPlane.makeJsonRequestData = function(_data, _httpHeaders) {

    _httpHeaders = _httpHeaders || (new Map());
    _httpHeaders.set("Content-Type", PaperPlane.ContentType.APPLICATION_JSON);

    return {
        body: JSON.stringify(_data),
        headers: _httpHeaders
    };
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
 * @param {Object} _requestData
 * @param {PaperPlane~responseCallback} [_onSuccess]
 * @param {PaperPlane~responseCallback} [_onError]
 * @param {PaperPlane~responseCallback} [_onComplete]
 * @returns {XMLHttpRequest}
 */
PaperPlane.xhr = function(
    _method, 
    _url, 
    _requestData,
    _onSuccess, 
    _onError, 
    _onComplete
) {
    const httpHeaders = _requestData.headers;
    _onSuccess = _onSuccess || (() => {});
    _onError = _onError || (() => {});        
    _onComplete = _onComplete || (() => {});    

    const internalErrorHander = function(_xhr, _errorMessageHint) {          
        _onError(_errorMessageHint || PaperPlane.parseXHRResponseData(xhr), xhr);
    };

    const xhr = new XMLHttpRequest();
    xhr.open(_method, _url);

    for (let [key,value] of httpHeaders) {
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

    xhr.send(_requestData.body);    

    return xhr;
};

/**
 * 
 * @param {String} _url
 * @param {Object} _requestData
 * @param {PaperPlane~responseCallback} _onSuccess
 * @param {PaperPlane~responseCallback} _onError
 * @param {PaperPlane~responseCallback} _onComplete
 * @returns {XMLHttpRequest}
 */
PaperPlane.post = function(
    _url, 
    _requestData,
    _onSuccess, 
    _onError, 
    _onComplete
) {
    return PaperPlane.xhr(
        "POST",
        _url,
        _requestData,
        _onSuccess,
        _onError,
        _onComplete
    );
};


/**
 * 
 * @param {String} _url
 * @param {Object} _requestData
 * @param {PaperPlane~responseCallback} _onSuccess
 * @param {PaperPlane~responseCallback} _onError
 * @param {PaperPlane~responseCallback} _onComplete
 * @returns {XMLHttpRequest}
 */
PaperPlane.put = function(
    _url, 
    _requestData,
    _onSuccess, 
    _onError, 
    _onComplete
) {
    return PaperPlane.xhr(
        "PUT",
        _url,
        _requestData,
        _onSuccess,
        _onError,
        _onComplete
    );

};


/**
 * 
 * @param {String} _url
 * @param {Object} _requestData
 * @param {PaperPlane~responseCallback} _onSuccess
 * @param {PaperPlane~responseCallback} _onError
 * @param {PaperPlane~responseCallback} _onComplete
 * @returns {XMLHttpRequest}
 */
PaperPlane.delete = function(
    _url, 
    _requestData,
    _onSuccess, 
    _onError, 
    _onComplete
) {
    return PaperPlane.xhr(
        "DELETE",
        _url,
        _requestData,
        _onSuccess,
        _onError,
        _onComplete
    );
};

/**
 * @param {String} _url 
 * @param {Object} [_httpHeaders={}]
 * @param {PaperPlane~responseCallback} _onSuccess
 * @param {PaperPlane~responseCallback} _onError
 * @param {PaperPlane~responseCallback} _onComplete
 * @returns {XMLHttpRequest}
 */
PaperPlane.get = function(
    _url, 
    _httpHeaders,
    _onSuccess, 
    _onError, 
    _onComplete
) {
    return PaperPlane.xhr(
        "GET",
        _url,
        {
            body: null,
            headers: _httpHeaders
        },
        _onSuccess,
        _onError,
        _onComplete
    ); 
};

/**
 * @param {String} _url 
 * @param {Object} [_httpHeaders={}]
 * @param {PaperPlane~responseCallback} _onSuccess
 * @param {PaperPlane~responseCallback} _onError
 * @param {PaperPlane~responseCallback} _onComplete
 * @returns {XMLHttpRequest}
 */
PaperPlane.head = function(
    _url, 
    _httpHeaders,
    _onSuccess, 
    _onError, 
    _onComplete
) {
    return PaperPlane.xhr(
        "HEAD",
        _url,
        {
            body: null,
            headers: _httpHeaders
        },
        _onSuccess,
        _onError,
        _onComplete
    ); 
};

export { PaperPlane };
