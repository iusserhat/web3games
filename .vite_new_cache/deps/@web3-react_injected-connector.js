import {
  __commonJS,
  __toESM
} from "./chunk-V4OQ3NZ2.js";

// node_modules/events/events.js
var require_events = __commonJS({
  "node_modules/events/events.js"(exports, module) {
    "use strict";
    var R = typeof Reflect === "object" ? Reflect : null;
    var ReflectApply = R && typeof R.apply === "function" ? R.apply : function ReflectApply2(target, receiver, args) {
      return Function.prototype.apply.call(target, receiver, args);
    };
    var ReflectOwnKeys;
    if (R && typeof R.ownKeys === "function") {
      ReflectOwnKeys = R.ownKeys;
    } else if (Object.getOwnPropertySymbols) {
      ReflectOwnKeys = function ReflectOwnKeys2(target) {
        return Object.getOwnPropertyNames(target).concat(Object.getOwnPropertySymbols(target));
      };
    } else {
      ReflectOwnKeys = function ReflectOwnKeys2(target) {
        return Object.getOwnPropertyNames(target);
      };
    }
    function ProcessEmitWarning(warning2) {
      if (console && console.warn) console.warn(warning2);
    }
    var NumberIsNaN = Number.isNaN || function NumberIsNaN2(value) {
      return value !== value;
    };
    function EventEmitter2() {
      EventEmitter2.init.call(this);
    }
    module.exports = EventEmitter2;
    module.exports.once = once;
    EventEmitter2.EventEmitter = EventEmitter2;
    EventEmitter2.prototype._events = void 0;
    EventEmitter2.prototype._eventsCount = 0;
    EventEmitter2.prototype._maxListeners = void 0;
    var defaultMaxListeners = 10;
    function checkListener(listener) {
      if (typeof listener !== "function") {
        throw new TypeError('The "listener" argument must be of type Function. Received type ' + typeof listener);
      }
    }
    Object.defineProperty(EventEmitter2, "defaultMaxListeners", {
      enumerable: true,
      get: function() {
        return defaultMaxListeners;
      },
      set: function(arg) {
        if (typeof arg !== "number" || arg < 0 || NumberIsNaN(arg)) {
          throw new RangeError('The value of "defaultMaxListeners" is out of range. It must be a non-negative number. Received ' + arg + ".");
        }
        defaultMaxListeners = arg;
      }
    });
    EventEmitter2.init = function() {
      if (this._events === void 0 || this._events === Object.getPrototypeOf(this)._events) {
        this._events = /* @__PURE__ */ Object.create(null);
        this._eventsCount = 0;
      }
      this._maxListeners = this._maxListeners || void 0;
    };
    EventEmitter2.prototype.setMaxListeners = function setMaxListeners(n) {
      if (typeof n !== "number" || n < 0 || NumberIsNaN(n)) {
        throw new RangeError('The value of "n" is out of range. It must be a non-negative number. Received ' + n + ".");
      }
      this._maxListeners = n;
      return this;
    };
    function _getMaxListeners(that) {
      if (that._maxListeners === void 0)
        return EventEmitter2.defaultMaxListeners;
      return that._maxListeners;
    }
    EventEmitter2.prototype.getMaxListeners = function getMaxListeners() {
      return _getMaxListeners(this);
    };
    EventEmitter2.prototype.emit = function emit(type) {
      var args = [];
      for (var i = 1; i < arguments.length; i++) args.push(arguments[i]);
      var doError = type === "error";
      var events = this._events;
      if (events !== void 0)
        doError = doError && events.error === void 0;
      else if (!doError)
        return false;
      if (doError) {
        var er;
        if (args.length > 0)
          er = args[0];
        if (er instanceof Error) {
          throw er;
        }
        var err = new Error("Unhandled error." + (er ? " (" + er.message + ")" : ""));
        err.context = er;
        throw err;
      }
      var handler = events[type];
      if (handler === void 0)
        return false;
      if (typeof handler === "function") {
        ReflectApply(handler, this, args);
      } else {
        var len = handler.length;
        var listeners = arrayClone(handler, len);
        for (var i = 0; i < len; ++i)
          ReflectApply(listeners[i], this, args);
      }
      return true;
    };
    function _addListener(target, type, listener, prepend) {
      var m;
      var events;
      var existing;
      checkListener(listener);
      events = target._events;
      if (events === void 0) {
        events = target._events = /* @__PURE__ */ Object.create(null);
        target._eventsCount = 0;
      } else {
        if (events.newListener !== void 0) {
          target.emit(
            "newListener",
            type,
            listener.listener ? listener.listener : listener
          );
          events = target._events;
        }
        existing = events[type];
      }
      if (existing === void 0) {
        existing = events[type] = listener;
        ++target._eventsCount;
      } else {
        if (typeof existing === "function") {
          existing = events[type] = prepend ? [listener, existing] : [existing, listener];
        } else if (prepend) {
          existing.unshift(listener);
        } else {
          existing.push(listener);
        }
        m = _getMaxListeners(target);
        if (m > 0 && existing.length > m && !existing.warned) {
          existing.warned = true;
          var w = new Error("Possible EventEmitter memory leak detected. " + existing.length + " " + String(type) + " listeners added. Use emitter.setMaxListeners() to increase limit");
          w.name = "MaxListenersExceededWarning";
          w.emitter = target;
          w.type = type;
          w.count = existing.length;
          ProcessEmitWarning(w);
        }
      }
      return target;
    }
    EventEmitter2.prototype.addListener = function addListener(type, listener) {
      return _addListener(this, type, listener, false);
    };
    EventEmitter2.prototype.on = EventEmitter2.prototype.addListener;
    EventEmitter2.prototype.prependListener = function prependListener(type, listener) {
      return _addListener(this, type, listener, true);
    };
    function onceWrapper() {
      if (!this.fired) {
        this.target.removeListener(this.type, this.wrapFn);
        this.fired = true;
        if (arguments.length === 0)
          return this.listener.call(this.target);
        return this.listener.apply(this.target, arguments);
      }
    }
    function _onceWrap(target, type, listener) {
      var state = { fired: false, wrapFn: void 0, target, type, listener };
      var wrapped = onceWrapper.bind(state);
      wrapped.listener = listener;
      state.wrapFn = wrapped;
      return wrapped;
    }
    EventEmitter2.prototype.once = function once2(type, listener) {
      checkListener(listener);
      this.on(type, _onceWrap(this, type, listener));
      return this;
    };
    EventEmitter2.prototype.prependOnceListener = function prependOnceListener(type, listener) {
      checkListener(listener);
      this.prependListener(type, _onceWrap(this, type, listener));
      return this;
    };
    EventEmitter2.prototype.removeListener = function removeListener(type, listener) {
      var list, events, position, i, originalListener;
      checkListener(listener);
      events = this._events;
      if (events === void 0)
        return this;
      list = events[type];
      if (list === void 0)
        return this;
      if (list === listener || list.listener === listener) {
        if (--this._eventsCount === 0)
          this._events = /* @__PURE__ */ Object.create(null);
        else {
          delete events[type];
          if (events.removeListener)
            this.emit("removeListener", type, list.listener || listener);
        }
      } else if (typeof list !== "function") {
        position = -1;
        for (i = list.length - 1; i >= 0; i--) {
          if (list[i] === listener || list[i].listener === listener) {
            originalListener = list[i].listener;
            position = i;
            break;
          }
        }
        if (position < 0)
          return this;
        if (position === 0)
          list.shift();
        else {
          spliceOne(list, position);
        }
        if (list.length === 1)
          events[type] = list[0];
        if (events.removeListener !== void 0)
          this.emit("removeListener", type, originalListener || listener);
      }
      return this;
    };
    EventEmitter2.prototype.off = EventEmitter2.prototype.removeListener;
    EventEmitter2.prototype.removeAllListeners = function removeAllListeners(type) {
      var listeners, events, i;
      events = this._events;
      if (events === void 0)
        return this;
      if (events.removeListener === void 0) {
        if (arguments.length === 0) {
          this._events = /* @__PURE__ */ Object.create(null);
          this._eventsCount = 0;
        } else if (events[type] !== void 0) {
          if (--this._eventsCount === 0)
            this._events = /* @__PURE__ */ Object.create(null);
          else
            delete events[type];
        }
        return this;
      }
      if (arguments.length === 0) {
        var keys = Object.keys(events);
        var key;
        for (i = 0; i < keys.length; ++i) {
          key = keys[i];
          if (key === "removeListener") continue;
          this.removeAllListeners(key);
        }
        this.removeAllListeners("removeListener");
        this._events = /* @__PURE__ */ Object.create(null);
        this._eventsCount = 0;
        return this;
      }
      listeners = events[type];
      if (typeof listeners === "function") {
        this.removeListener(type, listeners);
      } else if (listeners !== void 0) {
        for (i = listeners.length - 1; i >= 0; i--) {
          this.removeListener(type, listeners[i]);
        }
      }
      return this;
    };
    function _listeners(target, type, unwrap) {
      var events = target._events;
      if (events === void 0)
        return [];
      var evlistener = events[type];
      if (evlistener === void 0)
        return [];
      if (typeof evlistener === "function")
        return unwrap ? [evlistener.listener || evlistener] : [evlistener];
      return unwrap ? unwrapListeners(evlistener) : arrayClone(evlistener, evlistener.length);
    }
    EventEmitter2.prototype.listeners = function listeners(type) {
      return _listeners(this, type, true);
    };
    EventEmitter2.prototype.rawListeners = function rawListeners(type) {
      return _listeners(this, type, false);
    };
    EventEmitter2.listenerCount = function(emitter, type) {
      if (typeof emitter.listenerCount === "function") {
        return emitter.listenerCount(type);
      } else {
        return listenerCount.call(emitter, type);
      }
    };
    EventEmitter2.prototype.listenerCount = listenerCount;
    function listenerCount(type) {
      var events = this._events;
      if (events !== void 0) {
        var evlistener = events[type];
        if (typeof evlistener === "function") {
          return 1;
        } else if (evlistener !== void 0) {
          return evlistener.length;
        }
      }
      return 0;
    }
    EventEmitter2.prototype.eventNames = function eventNames() {
      return this._eventsCount > 0 ? ReflectOwnKeys(this._events) : [];
    };
    function arrayClone(arr, n) {
      var copy = new Array(n);
      for (var i = 0; i < n; ++i)
        copy[i] = arr[i];
      return copy;
    }
    function spliceOne(list, index) {
      for (; index + 1 < list.length; index++)
        list[index] = list[index + 1];
      list.pop();
    }
    function unwrapListeners(arr) {
      var ret = new Array(arr.length);
      for (var i = 0; i < ret.length; ++i) {
        ret[i] = arr[i].listener || arr[i];
      }
      return ret;
    }
    function once(emitter, name) {
      return new Promise(function(resolve, reject) {
        function errorListener(err) {
          emitter.removeListener(name, resolver);
          reject(err);
        }
        function resolver() {
          if (typeof emitter.removeListener === "function") {
            emitter.removeListener("error", errorListener);
          }
          resolve([].slice.call(arguments));
        }
        ;
        eventTargetAgnosticAddListener(emitter, name, resolver, { once: true });
        if (name !== "error") {
          addErrorHandlerIfEventEmitter(emitter, errorListener, { once: true });
        }
      });
    }
    function addErrorHandlerIfEventEmitter(emitter, handler, flags) {
      if (typeof emitter.on === "function") {
        eventTargetAgnosticAddListener(emitter, "error", handler, flags);
      }
    }
    function eventTargetAgnosticAddListener(emitter, name, listener, flags) {
      if (typeof emitter.on === "function") {
        if (flags.once) {
          emitter.once(name, listener);
        } else {
          emitter.on(name, listener);
        }
      } else if (typeof emitter.addEventListener === "function") {
        emitter.addEventListener(name, function wrapListener(arg) {
          if (flags.once) {
            emitter.removeEventListener(name, wrapListener);
          }
          listener(arg);
        });
      } else {
        throw new TypeError('The "emitter" argument must be of type EventEmitter. Received type ' + typeof emitter);
      }
    }
  }
});

// node_modules/@web3-react/abstract-connector/dist/abstract-connector.esm.js
var import_events = __toESM(require_events());

// node_modules/@web3-react/abstract-connector/node_modules/@web3-react/types/dist/types.esm.js
var ConnectorEvent;
(function(ConnectorEvent2) {
  ConnectorEvent2["Update"] = "Web3ReactUpdate";
  ConnectorEvent2["Error"] = "Web3ReactError";
  ConnectorEvent2["Deactivate"] = "Web3ReactDeactivate";
})(ConnectorEvent || (ConnectorEvent = {}));

// node_modules/@web3-react/abstract-connector/dist/abstract-connector.esm.js
function _inheritsLoose(subClass, superClass) {
  subClass.prototype = Object.create(superClass.prototype);
  subClass.prototype.constructor = subClass;
  subClass.__proto__ = superClass;
}
var AbstractConnector = function(_EventEmitter) {
  _inheritsLoose(AbstractConnector2, _EventEmitter);
  function AbstractConnector2(_temp) {
    var _this;
    var _ref = _temp === void 0 ? {} : _temp, supportedChainIds = _ref.supportedChainIds;
    _this = _EventEmitter.call(this) || this;
    _this.supportedChainIds = supportedChainIds;
    return _this;
  }
  var _proto = AbstractConnector2.prototype;
  _proto.emitUpdate = function emitUpdate(update) {
    if (true) {
      console.log("Emitting '" + ConnectorEvent.Update + "' with payload", update);
    }
    this.emit(ConnectorEvent.Update, update);
  };
  _proto.emitError = function emitError(error) {
    if (true) {
      console.log("Emitting '" + ConnectorEvent.Error + "' with payload", error);
    }
    this.emit(ConnectorEvent.Error, error);
  };
  _proto.emitDeactivate = function emitDeactivate() {
    if (true) {
      console.log("Emitting '" + ConnectorEvent.Deactivate + "'");
    }
    this.emit(ConnectorEvent.Deactivate);
  };
  return AbstractConnector2;
}(import_events.EventEmitter);

// node_modules/tiny-warning/dist/tiny-warning.esm.js
var isProduction = false;
function warning(condition, message) {
  if (!isProduction) {
    if (condition) {
      return;
    }
    var text = "Warning: " + message;
    if (typeof console !== "undefined") {
      console.warn(text);
    }
    try {
      throw Error(text);
    } catch (x) {
    }
  }
}
var tiny_warning_esm_default = warning;

// node_modules/@web3-react/injected-connector/dist/injected-connector.esm.js
function _extends() {
  _extends = Object.assign || function(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];
      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }
    return target;
  };
  return _extends.apply(this, arguments);
}
function _inheritsLoose2(subClass, superClass) {
  subClass.prototype = Object.create(superClass.prototype);
  subClass.prototype.constructor = subClass;
  subClass.__proto__ = superClass;
}
function _getPrototypeOf(o) {
  _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf2(o2) {
    return o2.__proto__ || Object.getPrototypeOf(o2);
  };
  return _getPrototypeOf(o);
}
function _setPrototypeOf(o, p) {
  _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf2(o2, p2) {
    o2.__proto__ = p2;
    return o2;
  };
  return _setPrototypeOf(o, p);
}
function isNativeReflectConstruct() {
  if (typeof Reflect === "undefined" || !Reflect.construct) return false;
  if (Reflect.construct.sham) return false;
  if (typeof Proxy === "function") return true;
  try {
    Date.prototype.toString.call(Reflect.construct(Date, [], function() {
    }));
    return true;
  } catch (e) {
    return false;
  }
}
function _construct(Parent, args, Class) {
  if (isNativeReflectConstruct()) {
    _construct = Reflect.construct;
  } else {
    _construct = function _construct2(Parent2, args2, Class2) {
      var a = [null];
      a.push.apply(a, args2);
      var Constructor = Function.bind.apply(Parent2, a);
      var instance = new Constructor();
      if (Class2) _setPrototypeOf(instance, Class2.prototype);
      return instance;
    };
  }
  return _construct.apply(null, arguments);
}
function _isNativeFunction(fn) {
  return Function.toString.call(fn).indexOf("[native code]") !== -1;
}
function _wrapNativeSuper(Class) {
  var _cache = typeof Map === "function" ? /* @__PURE__ */ new Map() : void 0;
  _wrapNativeSuper = function _wrapNativeSuper2(Class2) {
    if (Class2 === null || !_isNativeFunction(Class2)) return Class2;
    if (typeof Class2 !== "function") {
      throw new TypeError("Super expression must either be null or a function");
    }
    if (typeof _cache !== "undefined") {
      if (_cache.has(Class2)) return _cache.get(Class2);
      _cache.set(Class2, Wrapper);
    }
    function Wrapper() {
      return _construct(Class2, arguments, _getPrototypeOf(this).constructor);
    }
    Wrapper.prototype = Object.create(Class2.prototype, {
      constructor: {
        value: Wrapper,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
    return _setPrototypeOf(Wrapper, Class2);
  };
  return _wrapNativeSuper(Class);
}
function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }
  return self;
}
var _iteratorSymbol = typeof Symbol !== "undefined" ? Symbol.iterator || (Symbol.iterator = Symbol("Symbol.iterator")) : "@@iterator";
var _asyncIteratorSymbol = typeof Symbol !== "undefined" ? Symbol.asyncIterator || (Symbol.asyncIterator = Symbol("Symbol.asyncIterator")) : "@@asyncIterator";
function _catch(body, recover) {
  try {
    var result = body();
  } catch (e) {
    return recover(e);
  }
  if (result && result.then) {
    return result.then(void 0, recover);
  }
  return result;
}
function parseSendReturn(sendReturn) {
  return sendReturn.hasOwnProperty("result") ? sendReturn.result : sendReturn;
}
var NoEthereumProviderError = function(_Error) {
  _inheritsLoose2(NoEthereumProviderError2, _Error);
  function NoEthereumProviderError2() {
    var _this;
    _this = _Error.call(this) || this;
    _this.name = _this.constructor.name;
    _this.message = "No Ethereum provider was found on window.ethereum.";
    return _this;
  }
  return NoEthereumProviderError2;
}(
  _wrapNativeSuper(Error)
);
var UserRejectedRequestError = function(_Error2) {
  _inheritsLoose2(UserRejectedRequestError2, _Error2);
  function UserRejectedRequestError2() {
    var _this2;
    _this2 = _Error2.call(this) || this;
    _this2.name = _this2.constructor.name;
    _this2.message = "The user rejected the request.";
    return _this2;
  }
  return UserRejectedRequestError2;
}(
  _wrapNativeSuper(Error)
);
var InjectedConnector = function(_AbstractConnector) {
  _inheritsLoose2(InjectedConnector2, _AbstractConnector);
  function InjectedConnector2(kwargs) {
    var _this3;
    _this3 = _AbstractConnector.call(this, kwargs) || this;
    _this3.handleNetworkChanged = _this3.handleNetworkChanged.bind(_assertThisInitialized(_this3));
    _this3.handleChainChanged = _this3.handleChainChanged.bind(_assertThisInitialized(_this3));
    _this3.handleAccountsChanged = _this3.handleAccountsChanged.bind(_assertThisInitialized(_this3));
    _this3.handleClose = _this3.handleClose.bind(_assertThisInitialized(_this3));
    return _this3;
  }
  var _proto = InjectedConnector2.prototype;
  _proto.handleChainChanged = function handleChainChanged(chainId) {
    if (true) {
      console.log("Handling 'chainChanged' event with payload", chainId);
    }
    this.emitUpdate({
      chainId,
      provider: window.ethereum
    });
  };
  _proto.handleAccountsChanged = function handleAccountsChanged(accounts) {
    if (true) {
      console.log("Handling 'accountsChanged' event with payload", accounts);
    }
    if (accounts.length === 0) {
      this.emitDeactivate();
    } else {
      this.emitUpdate({
        account: accounts[0]
      });
    }
  };
  _proto.handleClose = function handleClose(code, reason) {
    if (true) {
      console.log("Handling 'close' event with payload", code, reason);
    }
    this.emitDeactivate();
  };
  _proto.handleNetworkChanged = function handleNetworkChanged(networkId) {
    if (true) {
      console.log("Handling 'networkChanged' event with payload", networkId);
    }
    this.emitUpdate({
      chainId: networkId,
      provider: window.ethereum
    });
  };
  _proto.activate = function activate() {
    try {
      var _temp5 = function _temp52(_result) {
        if (_exit2) return _result;
        function _temp2() {
          return _extends({
            provider: window.ethereum
          }, account ? {
            account
          } : {});
        }
        var _temp = function() {
          if (!account) {
            return Promise.resolve(window.ethereum.enable().then(function(sendReturn) {
              return sendReturn && parseSendReturn(sendReturn)[0];
            })).then(function(_window$ethereum$enab) {
              account = _window$ethereum$enab;
            });
          }
        }();
        return _temp && _temp.then ? _temp.then(_temp2) : _temp2(_temp);
      };
      var _exit2 = false;
      var _this5 = this;
      if (!window.ethereum) {
        throw new NoEthereumProviderError();
      }
      if (window.ethereum.on) {
        window.ethereum.on("chainChanged", _this5.handleChainChanged);
        window.ethereum.on("accountsChanged", _this5.handleAccountsChanged);
        window.ethereum.on("close", _this5.handleClose);
        window.ethereum.on("networkChanged", _this5.handleNetworkChanged);
      }
      if (window.ethereum.isMetaMask) {
        ;
        window.ethereum.autoRefreshOnNetworkChange = false;
      }
      var account;
      var _temp6 = _catch(function() {
        return Promise.resolve(window.ethereum.send("eth_requestAccounts").then(function(sendReturn) {
          return parseSendReturn(sendReturn)[0];
        })).then(function(_window$ethereum$send) {
          account = _window$ethereum$send;
        });
      }, function(error) {
        if (error.code === 4001) {
          throw new UserRejectedRequestError();
        }
        true ? tiny_warning_esm_default(false, "eth_requestAccounts was unsuccessful, falling back to enable") : void 0;
      });
      return Promise.resolve(_temp6 && _temp6.then ? _temp6.then(_temp5) : _temp5(_temp6));
    } catch (e) {
      return Promise.reject(e);
    }
  };
  _proto.getProvider = function getProvider() {
    try {
      return Promise.resolve(window.ethereum);
    } catch (e) {
      return Promise.reject(e);
    }
  };
  _proto.getChainId = function getChainId() {
    try {
      var _temp12 = function _temp122() {
        function _temp9() {
          if (!chainId) {
            try {
              chainId = parseSendReturn(window.ethereum.send({
                method: "net_version"
              }));
            } catch (_unused) {
              true ? tiny_warning_esm_default(false, "net_version v2 was unsuccessful, falling back to manual matches and static properties") : void 0;
            }
          }
          if (!chainId) {
            if (window.ethereum.isDapper) {
              chainId = parseSendReturn(window.ethereum.cachedResults.net_version);
            } else {
              chainId = window.ethereum.chainId || window.ethereum.netVersion || window.ethereum.networkVersion || window.ethereum._chainId;
            }
          }
          return chainId;
        }
        var _temp8 = function() {
          if (!chainId) {
            var _temp14 = _catch(function() {
              return Promise.resolve(window.ethereum.send("net_version").then(parseSendReturn)).then(function(_window$ethereum$send3) {
                chainId = _window$ethereum$send3;
              });
            }, function() {
              true ? tiny_warning_esm_default(false, "net_version was unsuccessful, falling back to net version v2") : void 0;
            });
            if (_temp14 && _temp14.then) return _temp14.then(function() {
            });
          }
        }();
        return _temp8 && _temp8.then ? _temp8.then(_temp9) : _temp9(_temp8);
      };
      if (!window.ethereum) {
        throw new NoEthereumProviderError();
      }
      var chainId;
      var _temp13 = _catch(function() {
        return Promise.resolve(window.ethereum.send("eth_chainId").then(parseSendReturn)).then(function(_window$ethereum$send2) {
          chainId = _window$ethereum$send2;
        });
      }, function() {
        true ? tiny_warning_esm_default(false, "eth_chainId was unsuccessful, falling back to net_version") : void 0;
      });
      return Promise.resolve(_temp13 && _temp13.then ? _temp13.then(_temp12) : _temp12(_temp13));
    } catch (e) {
      return Promise.reject(e);
    }
  };
  _proto.getAccount = function getAccount() {
    try {
      var _temp20 = function _temp202() {
        function _temp17() {
          if (!account) {
            account = parseSendReturn(window.ethereum.send({
              method: "eth_accounts"
            }))[0];
          }
          return account;
        }
        var _temp16 = function() {
          if (!account) {
            var _temp22 = _catch(function() {
              return Promise.resolve(window.ethereum.enable().then(function(sendReturn) {
                return parseSendReturn(sendReturn)[0];
              })).then(function(_window$ethereum$enab2) {
                account = _window$ethereum$enab2;
              });
            }, function() {
              true ? tiny_warning_esm_default(false, "enable was unsuccessful, falling back to eth_accounts v2") : void 0;
            });
            if (_temp22 && _temp22.then) return _temp22.then(function() {
            });
          }
        }();
        return _temp16 && _temp16.then ? _temp16.then(_temp17) : _temp17(_temp16);
      };
      if (!window.ethereum) {
        throw new NoEthereumProviderError();
      }
      var account;
      var _temp21 = _catch(function() {
        return Promise.resolve(window.ethereum.send("eth_accounts").then(function(sendReturn) {
          return parseSendReturn(sendReturn)[0];
        })).then(function(_window$ethereum$send4) {
          account = _window$ethereum$send4;
        });
      }, function() {
        true ? tiny_warning_esm_default(false, "eth_accounts was unsuccessful, falling back to enable") : void 0;
      });
      return Promise.resolve(_temp21 && _temp21.then ? _temp21.then(_temp20) : _temp20(_temp21));
    } catch (e) {
      return Promise.reject(e);
    }
  };
  _proto.deactivate = function deactivate() {
    if (window.ethereum && window.ethereum.removeListener) {
      window.ethereum.removeListener("chainChanged", this.handleChainChanged);
      window.ethereum.removeListener("accountsChanged", this.handleAccountsChanged);
      window.ethereum.removeListener("close", this.handleClose);
      window.ethereum.removeListener("networkChanged", this.handleNetworkChanged);
    }
  };
  _proto.isAuthorized = function isAuthorized() {
    try {
      if (!window.ethereum) {
        return Promise.resolve(false);
      }
      return Promise.resolve(_catch(function() {
        return Promise.resolve(window.ethereum.send("eth_accounts").then(function(sendReturn) {
          if (parseSendReturn(sendReturn).length > 0) {
            return true;
          } else {
            return false;
          }
        }));
      }, function() {
        return false;
      }));
    } catch (e) {
      return Promise.reject(e);
    }
  };
  return InjectedConnector2;
}(AbstractConnector);
export {
  InjectedConnector,
  NoEthereumProviderError,
  UserRejectedRequestError
};
//# sourceMappingURL=@web3-react_injected-connector.js.map
