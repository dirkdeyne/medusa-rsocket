var _M = _M || {};

_M.ws = null;
_M.timeoutTimer = 0;
_M.retryAttempts = 0;
_M.testMode = _M.testMode || false;
_M.debugMode = _M.debugMode || true;
_M.retryMode = false;
_M.fatalMode = false;

// ref application.properties spring.rsocket.server.port + spring.rsocket.server.mapping-path
const WEBSOCKET_URL = "ws://localhost:8888/event-emitter";

_M.retryConnection = function () {
    _M.retryAttempts++;

    if(!_M.retryMode && _M.retryAttempts > 2) {
        document.body.innerHTML += _M.connectionDropRetry;
        _M.retryMode = true;
    }

    if(!_M.fatalMode && _M.retryAttempts > 5) {
        document.body.innerHTML += _M.connectionDropFatal;
        _M.fatalMode = true;
    }

    setTimeout(function() {
        if(_M.timeoutTimer < 1000) {
            _M.timeoutTimer += 150;
        } else {
            _M.timeoutTimer = 1000;
        }

        try{
            // _M.ws = new WebSocket(((_M.isLocal) ? "ws://" : "wss://") + window.location.host + "%WEBSOCKET_URL%");
            _M.ws = new WebSocket(WEBSOCKET_URL);

            if(_M.ws.readyState === _M.ws.CLOSED || _M.ws.readyState === _M.ws.CLOSING) {
                _M.retryConnection();
            }
            _M.ws.onopen = function() {
                _M.debug("ws.onopen", _M.ws);
                _M.debug("ws.readyState", "wsstatus");
                _M.retryAttempts = 0;
                if(_M.fatalMode) document.getElementById('m-top-error-fatal').remove();
                if(_M.retryMode) document.getElementById('m-top-error-retry').remove();
                _M.fatalMode = false;
                _M.retryMode = false;
                // _M.ws.send("unq//%SECURITY_CONTEXT_ID%");
                _M.ws.send("JS");
                _M.debug("send hello", _M.ws);
            }
            _M.ws.onclose = function(error) {
                _M.debug("ws.onclose", _M.ws, error);
                _M.retryConnection();
            }
            _M.ws.onerror = function(error) {
                _M.debug("ws.onerror", _M.ws);
                _M.debug("An error occurred", error);
            }
            _M.ws.onmessage = function(message) {
                _M.debug("message: ", JSON.parse(message.data));
                document.getElementById("message").innerText = message.data
                /*
                if(message.data.indexOf("unq//") === -1) {
                    _M.debug("ws.onmessage", _M.ws, message);
                    let data = JSON.parse(message.data);
                    if(typeof _M.preEventHandler !== "undefined") { _M.preEventHandler(data); }
                    _M.eventHandler(data);
                    if(typeof _M.postRender !== "undefined") { _M.postRender(data); }
                } else {
                    _M.debug("ws.onmessage - unq confirm", _M.ws, message);
                    _M.ws.send("%INITIAL_DOM_CHANGES%" );
                }
                */
            }
        } catch (e) {
            _M.debug("oops",e);
            _M.retryConnection();
        }
    }, _M.timeoutTimer);
};

_M.debug = function(textToLog, fullObject) {
    if(_M.debugMode) {
        console.log(textToLog, fullObject);
    }
};

_M.retryConnection();

_M.connectionDropRetry = "<div id='m-top-error-retry' style=\"position: absolute; top: 0; left: 0; background:orange; color: black; width:100%; text-align:center;\">Your connection with the server dropped. Retrying to connect.</div>";
_M.connectionDropFatal = "<div id='m-top-error-fatal' style=\"position: absolute; top: 0; left: 0; background:red; color: black; width:100%; text-align:center;\">Your connection with the server dropped and reconnecting is not possible. Please reload.</div>";

