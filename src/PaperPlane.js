const PaperPlane = {};

/**
 * 
 * @param {Number} _attemptNum 
 */
PaperPlane.calculateExpBackoff = function(_attemptNum) {
    return Math.min(5000, 100.0 * Math.pow(2, _attemptNum));
};

/**
 * 
 * @param {XMLHttpRequest} _xhr 
 * @returns {String|Object}
 */
PaperPlane.parseXHRResponseData = function(_xhr) {
    if(_xhr.getResponseHeader('Content-Type') === "application/json") {
        return JSON.parse(responseData);
    }

    return _xhr.responseText;
};

/**
 * 
 * @param {XMLHttpRequest} _xhr 
 * @param {Boolean} _canRetryOnServerError 
 * @returns {Boolean}
 */
PaperPlane.isRetryableError = function(_xhr, _canRetryOnServerError) {
    return (_xhr.readyState === 0 || (_canRetryOnServerError && _xhr.readyState === 4 && _xhr.status >= 500));
};

/**
 * @callback PaperPlane~responseCallback
 * @param {String|Object} responseData
 * @param {XMLHttpRequest} xhr
 */

/**
 * 
 * @param {String} _url
 * @param {FormData} _formData
 * @param {PaperPlane~responseCallback} [_onSuccess]
 * @param {PaperPlane~responseCallback} [_onError]
 * @param {PaperPlane~responseCallback} [_onComplete]
 * @param {Map} [_httpHeaders=new Map()]
 * @param {Number} [_numAttempts=1]
 * @param {Boolean} [_canRetryOnServerError=false]
 * @returns {XMLHttpRequest}
 */
PaperPlane.postFormData = function(_url, _formData, _onSuccess, _onError, _onComplete, _httpHeaders, _numAttempts, _canRetryOnServerError) {

    _onSuccess = _onSuccess || (() => {});
    _onError = _onError || (() => {});        
    _onComplete = _onComplete || (() => {});
    _httpHeaders = _httpHeaders || (new Map());
    _numAttempts = _numAttempts || 1;
    _canRetryOnServerError = _canRetryOnServerError || false;    

    const postMethod = function(_currentAttemptNum) {

        const internalErrorHander = function(_xhr, _errorMessageHint) {

            const nextAttemptNum = _numAttempts - _currentAttemptNum;
            const numAttemptsRemaining = _numAttempts - _currentAttemptNum;
            const isRetryableError = PaperPlane.isRetryableError(_xhr, _canRetryOnServerError);
           
            if(numAttemptsRemaining > 0 && isRetryableError) {
                setTimeout(function() {
                    postMethod(_currentAttemptNum-1);
                }, PaperPlane.calculateExpBackoff(nextAttemptNum-1));
            } else {
                _onError(_errorMessageHint || PaperPlane.parseXHRResponseData(xhr), xhr);
            }
        };

        const xhr = new XMLHttpRequest();
        xhr.open('POST', _url);

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

    return postMethod(1);
};

/**
 * 
 * @param {String} _url
 * @param {String} _method
 * @param {object} _data
 * @param {function} _onSuccess
 * @param {function} _onError
 * @param {function} _onComplete
 * @returns {jqXHR}
 */
PaperPlane.ajax = function(_url, _method, _data, _onSuccess, _onError, _onComplete) {
    
    if(typeof _onError === 'undefined') {
        _onError = function() { };
    }
    
    if(typeof _onComplete === 'undefined') {
        _onComplete = function() { };
    }    
    
    return $.ajax({
                url: _url,
                method: _method,
                dataType: 'json',
                data: _data,
                success: _onSuccess,
                error: _onError,
                complete: _onComplete,
                timeout: 8000
            });
    
};

export { PaperPlane };
