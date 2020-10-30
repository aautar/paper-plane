# paper-plane

Simple XHR and navigator.sendBeacon wrapper

Maybe [fetch](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) in a later version


No dependencies

## Installation

`npm install paper-plane`

paper-plane is an ES module.

However, `dist/paperplan.min.js` is not (as browser support for ESM is not widespread), this file will create a `PaperPlane` object attached to the window (`window.PaperPlane`). This will likely change in the future.

## Usage

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

### Beacon Request
Send an HTTP [beacon request](https://developer.mozilla.org/en-US/docs/Web/API/Navigator/sendBeacon) to server.

```javascript
PaperPlane.postBeacon(
    '/analytics/view',
    PaperPlane.makeJsonRequestData({}, headers)
);
```
