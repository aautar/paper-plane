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
PaperPlane.postFormData = function(_url, _formData, _onSuccess, _onError, _onComplete, _retryCount) {
    
    if(typeof _onSuccess === 'undefined') {
        _onSuccess = function() { };
    }

    if(typeof _onError === 'undefined') {
        _onError = function() { };
    }
    
    if(typeof _onComplete === 'undefined') {
        _onComplete = function() { };
    }        

    if(typeof _retryCount === 'undefined') {
        _retryCount = 0;
    }
    
    const wrapperErrorHander = function(r) {
        if(r.statusCode >= 500) {
            _retryCount--;
        }

        if(_retryCount > 0) {

            setTimeout(function() {
                PaperPlane.postFormData(_url, _formData, _onSuccess, _onError, _onComplete, _retryCount);
            }, PaperPlane.calculateExpBackoff);

        } else {
            _onError(r);
        }
    };

    const xhr = new XMLHttpRequest();
    xhr.open('POST', _url);
    xhr.send(_formData);
    xhr.onload = function() {
        if(xhr.status >= 400) {
            wrapperErrorHander(xhr.response);
        } else {
            _onSuccess(xhr.response);
        }

        _onComplete(xhr.response);
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
