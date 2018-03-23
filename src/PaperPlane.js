const PaperPlane = { };

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
 * @returns {jqXHR}
 */
PaperPlane.postFormData = function(_url, _formData, _onSuccess, _onError, _onComplete, _numAttempts) {
    
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

        const numAttemptsRemaining = _numAttempts - 1;

        if(_xhr.status >= 500 && numAttemptsRemaining > 0) {
            setTimeout(function() {
                PaperPlane.postFormData(_url, _formData, _onSuccess, _onError, _onComplete, numAttemptsRemaining-1);
            }, PaperPlane.calculateExpBackoff(numAttemptsRemaining));
        } else {
            _onError(_xhr);
        }
    };

    const xhr = new XMLHttpRequest();
    xhr.open('POST', _url);
    xhr.send(_formData);
    xhr.onload = function() {
        if(xhr.status >= 400) {
            wrapperErrorHander(xhr);
        } else {
            _onSuccess(xhr);
        }

        _onComplete(xhr);
    };

    return xhr;
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
