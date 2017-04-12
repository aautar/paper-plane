var PaperPlane = { };

/**
 * 
 * @param {string} _url
 * @param {FormData} _formData
 * @param {function} _onSuccess
 * @param {function} _onError
 * @param {function} _onComplete
 * @returns {jqXHR}
 */
PaperPlane.postFormData = function(_url, _formData, _onSuccess, _onError, _onComplete) {
    
    if(typeof _onError === 'undefined') {
        _onError = function() { };
    }
    
    if(typeof _onComplete === 'undefined') {
        _onComplete = function() { };
    }        
    
    return $.ajax({
        url: _url,
        method: "POST",
        data: _formData,
        contentType: false,                
        processData: false,
        success: _onSuccess,
        error: _onError,
        complete: _onComplete,
        timeout: 60000
    });    
};

/**
 * 
 * @param {string} _url
 * @param {string} _method
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
