# paper-plane

Simple XHR and navigator.sendBeacon wrapper

Maybe [fetch](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) in a later version


No dependencies

## Installation

`npm install paper-plane`

paper-plane is an ES module.

However, `dist/paperplan.min.js` is not (as browser support for ESM is not widespread), this file will create a `PaperPlane` object attached to the window (`window.PaperPlane`). This will likely change in the future.

## Fetching data

### GET Request
```javascript
const headers = new Map();
const successCallback = function() {
    alert('GET call successful');
};

PaperPlane.get(
    '/endpoint',
    headers,
    successCallback
);
```

### HEAD Request
```javascript
const headers = new Map();
const successCallback = function() {
    alert('HEAD call successful');
};

PaperPlane.head(
    '/endpoint',
    headers,
    successCallback
);
```

## Sending data
Sending data requires constructing a request payload with one of the PaperPlane helper methods. The examples below construct a JSON payload via `PaperPlane.makeJsonRequestData()`. 

Sending [FormData](https://developer.mozilla.org/en-US/docs/Web/API/FormData) is also supported via `PaperPlane.makeFormDataRequestData()`.

### POST Request
```javascript
const headers = new Map();
const successCallback = function() {
    alert('POST call successful');
};

PaperPlane.post(
    '/endpoint',
    PaperPlane.makeJsonRequestData({}, headers),
    successCallback
);
```

### PUT Request
```javascript
const headers = new Map();
const successCallback = function() {
    alert('PUT call successful');
};

PaperPlane.put(
    '/resource/id',
    PaperPlane.makeJsonRequestData({}, headers),
    successCallback
);
```

### Beacon Request
Send an HTTP [beacon request](https://developer.mozilla.org/en-US/docs/Web/API/Navigator/sendBeacon) to server.

```javascript
PaperPlane.postBeacon(
    '/analytics/view',
    PaperPlane.makeJsonRequestData({}, headers)
);
```

## Removing data

### DELETE Request
```javascript
const headers = new Map();
const successCallback = function() {
    alert('DELETE call successful');
};

PaperPlane.delete(
    '/resources/id',
    PaperPlane.makeJsonRequestData({}, headers),
    successCallback
);
```

