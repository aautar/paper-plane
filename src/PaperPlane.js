const PaperPlane = {};

PaperPlane.calculateExpBackoff = function(_attemptNum) {
    return Math.min(5000, 100.0 * Math.pow(2, _attemptNum));
};

/**
 * 
 * @param {String} _url
 * @param {FormData} _formData
 * @param {function} _onSuccess
 * @param {function} _onError
 * @param {function} _onComplete
 * @param {Number} _numAttempts
 * @returns {XMLHttpRequest}
 */
PaperPlane.postFormData = function(_url, _formData, _onSuccess, _onError, _onComplete, _numAttempts) {
    
    const postMethod = function(_currentAttemptNum) {

        if(typeof _onSuccess === 'undefined') {
            _onSuccess = function() { };
        }

        if(typeof _onError === 'undefined') {
            _onError = function() { };
        }
        
        if(typeof _onComplete === 'undefined') {
            _onComplete = function() { };
        }        

        if(typeof _numAttempts === 'undefined') {
            _numAttempts = 1;
        }

        const wrapperErrorHander = function(_xhr) {

            const nextAttemptNum = _numAttempts - _currentAttemptNum;
            const numAttemptsRemaining = _numAttempts - _currentAttemptNum;
            const isRetryableError = (_xhr.readyState === 0 || (_xhr.readyState === 4 && _xhr.status >= 500));
            
            if(numAttemptsRemaining > 0 && isRetryableError) {
                setTimeout(function() {
                    postMethod(_currentAttemptNum-1);
                }, PaperPlane.calculateExpBackoff(nextAttemptNum-1));
            } else {
                _onError(_xhr);
            }
        };

        const xhr = new XMLHttpRequest();
        xhr.open('POST', _url);
        xhr.timeout = 30000;
        xhr.onload = function() {
            if(xhr.status >= 400) {
                wrapperErrorHander(xhr);
            } else {
                _onSuccess(xhr);
            }

            _onComplete(xhr);
        };

        xhr.ontimeout = function() {
            wrapperErrorHander(xhr);
        };

        xhr.onerror = function() {
            wrapperErrorHander(xhr);
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
