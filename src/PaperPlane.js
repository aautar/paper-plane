const PaperPlane = {};

PaperPlane.ContentType = {
    APPLICATION_JSON: "application/json"
};

PaperPlane.convertBlobToString = function(_blob, _onConvert) {
    const reader = new FileReader();
    reader.readAsText(_blob); 
    reader.onloadend = function() {
        _onConvert(reader.result);
    };
};

/**
 * 
 * @param {Blob} _respBlob 
 * @returns {String|Object|Blob}
 */
PaperPlane.parseXHRResponseData = function(_respBlob, _onParseComplete) {
    if(_respBlob && _respBlob.type === PaperPlane.ContentType.APPLICATION_JSON) {
        var parsedResponseBody = {};
        
        PaperPlane.convertBlobToString(_respBlob, function(_blobTextual) {
            parsedResponseBody = JSON.parse(_blobTextual);
            _onParseComplete(parsedResponseBody);
        });

    } else if(_respBlob && _respBlob.type.split('/')[0] === 'text') {
        PaperPlane.convertBlobToString(_respBlob, function(_blobTextual) {
            _onParseComplete(_blobTextual);
        });
    } else {
        _onParseComplete(_respBlob);
    }
};

/**
 * @param {FormData} _data
 * @param {Map=} _httpHeaders
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
 * @param {Map=} _httpHeaders
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
 * @param {Blob} _blob
 * @param {Map=} _httpHeaders
 * @returns {Object}
 */
PaperPlane.makeBlobRequestData = function(_blob, _httpHeaders) {
    _httpHeaders = _httpHeaders || (new Map());
    _httpHeaders.set("Content-Type", _blob.type);

    return {
        body: _blob,
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
    _onComplete,
    _clientSettings
) {
    const httpHeaders = _requestData.headers;
    _onSuccess = _onSuccess || (() => {});
    _onError = _onError || (() => {});        
    _onComplete = _onComplete || (() => {});    

    const internalErrorHander = function(_xhr, _errorMessageHint) {
        if(_errorMessageHint) {
            _onError(_errorMessageHint, xhr);
        } else {
            PaperPlane.parseXHRResponseData(xhr.response, function(_parsedResponse) {
                _onError(_parsedResponse, xhr);
            });
        }
    };

    const xhr = new XMLHttpRequest();
    xhr.open(_method, _url);

    for (let [key,value] of httpHeaders) {
        xhr.setRequestHeader(key, value);
    }

    xhr.responseType = 'blob';

    if(_clientSettings && _clientSettings.timeout) {
        xhr.timeout = _clientSettings.timeout;
    } else {
        xhr.timeout = 30000;
    }

    xhr.onload = function() {
        if(xhr.status >= 400) {
            internalErrorHander(xhr);
        } else {
            PaperPlane.parseXHRResponseData(xhr.response, function(_parsedResponse) {
                _onSuccess(_parsedResponse, xhr);
            });
        }
    };

    xhr.ontimeout = function() {
        internalErrorHander(xhr, "client timeout");
    };

    xhr.onerror = function() {
        internalErrorHander(xhr);
    };

    xhr.onloadend = function() {
        PaperPlane.parseXHRResponseData(xhr.response, function(_parsedResponse) {
            _onComplete(_parsedResponse, xhr);
        });
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


/**
 * 
 * @param {String} _url
 * @param {Object} _requestData
 * @returns {Boolean}
 */
PaperPlane.postBeacon = function(_url, _requestData) {
    return navigator.sendBeacon(_url, _requestData.body);
};

export { PaperPlane };
