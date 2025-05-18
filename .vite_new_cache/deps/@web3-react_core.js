import {
  require_react
} from "./chunk-D2KY6O3O.js";
import {
  AddressZero,
  Base58,
  BigNumber,
  ForkEvent,
  HashZero,
  Logger,
  Provider,
  Signer,
  TypedDataEncoder,
  accessListify,
  arrayify,
  checkProperties,
  concat,
  decode,
  deepCopy,
  defineReadOnly,
  dnsEncode,
  encode,
  getAddress,
  getContractAddress,
  getStatic,
  hexConcat,
  hexDataLength,
  hexDataSlice,
  hexValue,
  hexZeroPad,
  hexlify,
  init_lib,
  init_lib10 as init_lib9,
  init_lib11 as init_lib10,
  init_lib12 as init_lib11,
  init_lib13 as init_lib12,
  init_lib15 as init_lib13,
  init_lib16 as init_lib14,
  init_lib17 as init_lib15,
  init_lib2,
  init_lib3,
  init_lib5 as init_lib4,
  init_lib6 as init_lib5,
  init_lib7 as init_lib6,
  init_lib8 as init_lib7,
  init_lib9 as init_lib8,
  isBytesLike,
  isHexString,
  lib_exports,
  namehash,
  parse,
  require_bech32,
  resolveProperties,
  sha256,
  shallowCopy,
  shuffled,
  toUtf8Bytes,
  toUtf8String
} from "./chunk-B4BE72TJ.js";
import {
  __commonJS,
  __esm,
  __export,
  __toCommonJS,
  __toESM
} from "./chunk-V4OQ3NZ2.js";

// node_modules/@web3-react/store/node_modules/zustand/esm/vanilla.mjs
var createStoreImpl, createStore;
var init_vanilla = __esm({
  "node_modules/@web3-react/store/node_modules/zustand/esm/vanilla.mjs"() {
    createStoreImpl = (createState) => {
      let state;
      const listeners = /* @__PURE__ */ new Set();
      const setState = (partial, replace) => {
        const nextState = typeof partial === "function" ? partial(state) : partial;
        if (!Object.is(nextState, state)) {
          const previousState = state;
          state = (replace != null ? replace : typeof nextState !== "object") ? nextState : Object.assign({}, state, nextState);
          listeners.forEach((listener) => listener(state, previousState));
        }
      };
      const getState = () => state;
      const subscribe = (listener) => {
        listeners.add(listener);
        return () => listeners.delete(listener);
      };
      const destroy = () => {
        if ((import.meta.env ? import.meta.env.MODE : void 0) !== "production") {
          console.warn(
            "[DEPRECATED] The `destroy` method will be unsupported in a future version. Instead use unsubscribe function returned by subscribe. Everything will be garbage-collected if store is garbage-collected."
          );
        }
        listeners.clear();
      };
      const api = { setState, getState, subscribe, destroy };
      state = createState(setState, getState, api);
      return api;
    };
    createStore = (createState) => createState ? createStoreImpl(createState) : createStoreImpl;
  }
});

// node_modules/@web3-react/store/node_modules/use-sync-external-store/cjs/use-sync-external-store-shim.development.js
var require_use_sync_external_store_shim_development = __commonJS({
  "node_modules/@web3-react/store/node_modules/use-sync-external-store/cjs/use-sync-external-store-shim.development.js"(exports) {
    "use strict";
    if (true) {
      (function() {
        "use strict";
        if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ !== "undefined" && typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart === "function") {
          __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart(new Error());
        }
        var React = require_react();
        var ReactSharedInternals = React.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED;
        function error(format) {
          {
            {
              for (var _len2 = arguments.length, args = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
                args[_key2 - 1] = arguments[_key2];
              }
              printWarning("error", format, args);
            }
          }
        }
        function printWarning(level, format, args) {
          {
            var ReactDebugCurrentFrame = ReactSharedInternals.ReactDebugCurrentFrame;
            var stack = ReactDebugCurrentFrame.getStackAddendum();
            if (stack !== "") {
              format += "%s";
              args = args.concat([stack]);
            }
            var argsWithFormat = args.map(function(item) {
              return String(item);
            });
            argsWithFormat.unshift("Warning: " + format);
            Function.prototype.apply.call(console[level], console, argsWithFormat);
          }
        }
        function is(x, y) {
          return x === y && (x !== 0 || 1 / x === 1 / y) || x !== x && y !== y;
        }
        var objectIs = typeof Object.is === "function" ? Object.is : is;
        var useState = React.useState, useEffect = React.useEffect, useLayoutEffect = React.useLayoutEffect, useDebugValue4 = React.useDebugValue;
        var didWarnOld18Alpha = false;
        var didWarnUncachedGetSnapshot = false;
        function useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot) {
          {
            if (!didWarnOld18Alpha) {
              if (React.startTransition !== void 0) {
                didWarnOld18Alpha = true;
                error("You are using an outdated, pre-release alpha of React 18 that does not support useSyncExternalStore. The use-sync-external-store shim will not work correctly. Upgrade to a newer pre-release.");
              }
            }
          }
          var value = getSnapshot();
          {
            if (!didWarnUncachedGetSnapshot) {
              var cachedValue = getSnapshot();
              if (!objectIs(value, cachedValue)) {
                error("The result of getSnapshot should be cached to avoid an infinite loop");
                didWarnUncachedGetSnapshot = true;
              }
            }
          }
          var _useState = useState({
            inst: {
              value,
              getSnapshot
            }
          }), inst = _useState[0].inst, forceUpdate = _useState[1];
          useLayoutEffect(function() {
            inst.value = value;
            inst.getSnapshot = getSnapshot;
            if (checkIfSnapshotChanged(inst)) {
              forceUpdate({
                inst
              });
            }
          }, [subscribe, value, getSnapshot]);
          useEffect(function() {
            if (checkIfSnapshotChanged(inst)) {
              forceUpdate({
                inst
              });
            }
            var handleStoreChange = function() {
              if (checkIfSnapshotChanged(inst)) {
                forceUpdate({
                  inst
                });
              }
            };
            return subscribe(handleStoreChange);
          }, [subscribe]);
          useDebugValue4(value);
          return value;
        }
        function checkIfSnapshotChanged(inst) {
          var latestGetSnapshot = inst.getSnapshot;
          var prevValue = inst.value;
          try {
            var nextValue = latestGetSnapshot();
            return !objectIs(prevValue, nextValue);
          } catch (error2) {
            return true;
          }
        }
        function useSyncExternalStore$1(subscribe, getSnapshot, getServerSnapshot) {
          return getSnapshot();
        }
        var canUseDOM = !!(typeof window !== "undefined" && typeof window.document !== "undefined" && typeof window.document.createElement !== "undefined");
        var isServerEnvironment = !canUseDOM;
        var shim = isServerEnvironment ? useSyncExternalStore$1 : useSyncExternalStore;
        var useSyncExternalStore$2 = React.useSyncExternalStore !== void 0 ? React.useSyncExternalStore : shim;
        exports.useSyncExternalStore = useSyncExternalStore$2;
        if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ !== "undefined" && typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop === "function") {
          __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop(new Error());
        }
      })();
    }
  }
});

// node_modules/@web3-react/store/node_modules/use-sync-external-store/shim/index.js
var require_shim = __commonJS({
  "node_modules/@web3-react/store/node_modules/use-sync-external-store/shim/index.js"(exports, module) {
    "use strict";
    if (false) {
      module.exports = null;
    } else {
      module.exports = require_use_sync_external_store_shim_development();
    }
  }
});

// node_modules/@web3-react/store/node_modules/use-sync-external-store/cjs/use-sync-external-store-shim/with-selector.development.js
var require_with_selector_development = __commonJS({
  "node_modules/@web3-react/store/node_modules/use-sync-external-store/cjs/use-sync-external-store-shim/with-selector.development.js"(exports) {
    "use strict";
    if (true) {
      (function() {
        "use strict";
        if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ !== "undefined" && typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart === "function") {
          __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart(new Error());
        }
        var React = require_react();
        var shim = require_shim();
        function is(x, y) {
          return x === y && (x !== 0 || 1 / x === 1 / y) || x !== x && y !== y;
        }
        var objectIs = typeof Object.is === "function" ? Object.is : is;
        var useSyncExternalStore = shim.useSyncExternalStore;
        var useRef = React.useRef, useEffect = React.useEffect, useMemo = React.useMemo, useDebugValue4 = React.useDebugValue;
        function useSyncExternalStoreWithSelector4(subscribe, getSnapshot, getServerSnapshot, selector, isEqual) {
          var instRef = useRef(null);
          var inst;
          if (instRef.current === null) {
            inst = {
              hasValue: false,
              value: null
            };
            instRef.current = inst;
          } else {
            inst = instRef.current;
          }
          var _useMemo = useMemo(function() {
            var hasMemo = false;
            var memoizedSnapshot;
            var memoizedSelection;
            var memoizedSelector = function(nextSnapshot) {
              if (!hasMemo) {
                hasMemo = true;
                memoizedSnapshot = nextSnapshot;
                var _nextSelection = selector(nextSnapshot);
                if (isEqual !== void 0) {
                  if (inst.hasValue) {
                    var currentSelection = inst.value;
                    if (isEqual(currentSelection, _nextSelection)) {
                      memoizedSelection = currentSelection;
                      return currentSelection;
                    }
                  }
                }
                memoizedSelection = _nextSelection;
                return _nextSelection;
              }
              var prevSnapshot = memoizedSnapshot;
              var prevSelection = memoizedSelection;
              if (objectIs(prevSnapshot, nextSnapshot)) {
                return prevSelection;
              }
              var nextSelection = selector(nextSnapshot);
              if (isEqual !== void 0 && isEqual(prevSelection, nextSelection)) {
                return prevSelection;
              }
              memoizedSnapshot = nextSnapshot;
              memoizedSelection = nextSelection;
              return nextSelection;
            };
            var maybeGetServerSnapshot = getServerSnapshot === void 0 ? null : getServerSnapshot;
            var getSnapshotWithSelector = function() {
              return memoizedSelector(getSnapshot());
            };
            var getServerSnapshotWithSelector = maybeGetServerSnapshot === null ? void 0 : function() {
              return memoizedSelector(maybeGetServerSnapshot());
            };
            return [getSnapshotWithSelector, getServerSnapshotWithSelector];
          }, [getSnapshot, getServerSnapshot, selector, isEqual]), getSelection = _useMemo[0], getServerSelection = _useMemo[1];
          var value = useSyncExternalStore(subscribe, getSelection, getServerSelection);
          useEffect(function() {
            inst.hasValue = true;
            inst.value = value;
          }, [value]);
          useDebugValue4(value);
          return value;
        }
        exports.useSyncExternalStoreWithSelector = useSyncExternalStoreWithSelector4;
        if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ !== "undefined" && typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop === "function") {
          __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop(new Error());
        }
      })();
    }
  }
});

// node_modules/@web3-react/store/node_modules/use-sync-external-store/shim/with-selector.js
var require_with_selector = __commonJS({
  "node_modules/@web3-react/store/node_modules/use-sync-external-store/shim/with-selector.js"(exports, module) {
    "use strict";
    if (false) {
      module.exports = null;
    } else {
      module.exports = require_with_selector_development();
    }
  }
});

// node_modules/@web3-react/store/node_modules/zustand/esm/index.js
var esm_exports = {};
__export(esm_exports, {
  create: () => create,
  createStore: () => createStore,
  default: () => react,
  useStore: () => useStore
});
function useStore(api, selector = api.getState, equalityFn) {
  if (equalityFn) {
    console.warn(
      "[DEPRECATED] Use `createWithEqualityFn` from 'zustand/traditional'. https://github.com/pmndrs/zustand/discussions/1937"
    );
  }
  const slice = useSyncExternalStoreWithSelector(
    api.subscribe,
    api.getState,
    api.getServerState || api.getState,
    selector,
    equalityFn
  );
  (0, import_react.useDebugValue)(slice);
  return slice;
}
var import_react, import_with_selector, useSyncExternalStoreWithSelector, createImpl, create, react;
var init_esm = __esm({
  "node_modules/@web3-react/store/node_modules/zustand/esm/index.js"() {
    init_vanilla();
    init_vanilla();
    import_react = __toESM(require_react());
    import_with_selector = __toESM(require_with_selector());
    ({ useSyncExternalStoreWithSelector } = import_with_selector.default);
    createImpl = (createState) => {
      if (typeof createState !== "function") {
        console.warn(
          "[DEPRECATED] Passing a vanilla store will be unsupported in a future version. Instead use `import { useStore } from 'zustand'`."
        );
      }
      const api = typeof createState === "function" ? createStore(createState) : createState;
      const useBoundStore = (selector, equalityFn) => useStore(api, selector, equalityFn);
      Object.assign(useBoundStore, api);
      return useBoundStore;
    };
    create = (createState) => createState ? createImpl(createState) : createImpl;
    react = (createState) => {
      if (true) {
        console.warn(
          "[DEPRECATED] Default export is deprecated. Instead use `import { create } from 'zustand'`."
        );
      }
      return create(createState);
    };
  }
});

// node_modules/@web3-react/store/dist/index.js
var require_dist = __commonJS({
  "node_modules/@web3-react/store/dist/index.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.createWeb3ReactStoreAndActions = exports.MAX_SAFE_CHAIN_ID = void 0;
    var address_1 = (init_lib4(), __toCommonJS(lib_exports));
    var zustand_1 = (init_esm(), __toCommonJS(esm_exports));
    exports.MAX_SAFE_CHAIN_ID = 4503599627370476;
    function validateChainId(chainId) {
      if (!Number.isInteger(chainId) || chainId <= 0 || chainId > exports.MAX_SAFE_CHAIN_ID) {
        throw new Error(`Invalid chainId ${chainId}`);
      }
    }
    function validateAccount(account) {
      return (0, address_1.getAddress)(account);
    }
    var DEFAULT_STATE = {
      chainId: void 0,
      accounts: void 0,
      activating: false
    };
    function createWeb3ReactStoreAndActions() {
      const store = (0, zustand_1.createStore)()(() => DEFAULT_STATE);
      let nullifier = 0;
      function startActivation() {
        const nullifierCached = ++nullifier;
        store.setState(Object.assign(Object.assign({}, DEFAULT_STATE), { activating: true }));
        return () => {
          if (nullifier === nullifierCached)
            store.setState({ activating: false });
        };
      }
      function update(stateUpdate) {
        if (stateUpdate.chainId !== void 0) {
          validateChainId(stateUpdate.chainId);
        }
        if (stateUpdate.accounts !== void 0) {
          for (let i = 0; i < stateUpdate.accounts.length; i++) {
            stateUpdate.accounts[i] = validateAccount(stateUpdate.accounts[i]);
          }
        }
        nullifier++;
        store.setState((existingState) => {
          var _a, _b;
          const chainId = (_a = stateUpdate.chainId) !== null && _a !== void 0 ? _a : existingState.chainId;
          const accounts = (_b = stateUpdate.accounts) !== null && _b !== void 0 ? _b : existingState.accounts;
          let activating = existingState.activating;
          if (activating && chainId && accounts) {
            activating = false;
          }
          return { chainId, accounts, activating };
        });
      }
      function resetState() {
        nullifier++;
        store.setState(DEFAULT_STATE);
      }
      return [store, { startActivation, update, resetState }];
    }
    exports.createWeb3ReactStoreAndActions = createWeb3ReactStoreAndActions;
  }
});

// node_modules/@web3-react/core/node_modules/zustand/esm/vanilla.mjs
var createStoreImpl2, createStore2;
var init_vanilla2 = __esm({
  "node_modules/@web3-react/core/node_modules/zustand/esm/vanilla.mjs"() {
    createStoreImpl2 = (createState) => {
      let state;
      const listeners = /* @__PURE__ */ new Set();
      const setState = (partial, replace) => {
        const nextState = typeof partial === "function" ? partial(state) : partial;
        if (!Object.is(nextState, state)) {
          const previousState = state;
          state = (replace != null ? replace : typeof nextState !== "object") ? nextState : Object.assign({}, state, nextState);
          listeners.forEach((listener) => listener(state, previousState));
        }
      };
      const getState = () => state;
      const subscribe = (listener) => {
        listeners.add(listener);
        return () => listeners.delete(listener);
      };
      const destroy = () => {
        if ((import.meta.env ? import.meta.env.MODE : void 0) !== "production") {
          console.warn(
            "[DEPRECATED] The `destroy` method will be unsupported in a future version. Instead use unsubscribe function returned by subscribe. Everything will be garbage-collected if store is garbage-collected."
          );
        }
        listeners.clear();
      };
      const api = { setState, getState, subscribe, destroy };
      state = createState(setState, getState, api);
      return api;
    };
    createStore2 = (createState) => createState ? createStoreImpl2(createState) : createStoreImpl2;
  }
});

// node_modules/@web3-react/core/node_modules/zustand/node_modules/use-sync-external-store/cjs/use-sync-external-store-shim.development.js
var require_use_sync_external_store_shim_development2 = __commonJS({
  "node_modules/@web3-react/core/node_modules/zustand/node_modules/use-sync-external-store/cjs/use-sync-external-store-shim.development.js"(exports) {
    "use strict";
    if (true) {
      (function() {
        "use strict";
        if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ !== "undefined" && typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart === "function") {
          __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart(new Error());
        }
        var React = require_react();
        var ReactSharedInternals = React.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED;
        function error(format) {
          {
            {
              for (var _len2 = arguments.length, args = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
                args[_key2 - 1] = arguments[_key2];
              }
              printWarning("error", format, args);
            }
          }
        }
        function printWarning(level, format, args) {
          {
            var ReactDebugCurrentFrame = ReactSharedInternals.ReactDebugCurrentFrame;
            var stack = ReactDebugCurrentFrame.getStackAddendum();
            if (stack !== "") {
              format += "%s";
              args = args.concat([stack]);
            }
            var argsWithFormat = args.map(function(item) {
              return String(item);
            });
            argsWithFormat.unshift("Warning: " + format);
            Function.prototype.apply.call(console[level], console, argsWithFormat);
          }
        }
        function is(x, y) {
          return x === y && (x !== 0 || 1 / x === 1 / y) || x !== x && y !== y;
        }
        var objectIs = typeof Object.is === "function" ? Object.is : is;
        var useState = React.useState, useEffect = React.useEffect, useLayoutEffect = React.useLayoutEffect, useDebugValue4 = React.useDebugValue;
        var didWarnOld18Alpha = false;
        var didWarnUncachedGetSnapshot = false;
        function useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot) {
          {
            if (!didWarnOld18Alpha) {
              if (React.startTransition !== void 0) {
                didWarnOld18Alpha = true;
                error("You are using an outdated, pre-release alpha of React 18 that does not support useSyncExternalStore. The use-sync-external-store shim will not work correctly. Upgrade to a newer pre-release.");
              }
            }
          }
          var value = getSnapshot();
          {
            if (!didWarnUncachedGetSnapshot) {
              var cachedValue = getSnapshot();
              if (!objectIs(value, cachedValue)) {
                error("The result of getSnapshot should be cached to avoid an infinite loop");
                didWarnUncachedGetSnapshot = true;
              }
            }
          }
          var _useState = useState({
            inst: {
              value,
              getSnapshot
            }
          }), inst = _useState[0].inst, forceUpdate = _useState[1];
          useLayoutEffect(function() {
            inst.value = value;
            inst.getSnapshot = getSnapshot;
            if (checkIfSnapshotChanged(inst)) {
              forceUpdate({
                inst
              });
            }
          }, [subscribe, value, getSnapshot]);
          useEffect(function() {
            if (checkIfSnapshotChanged(inst)) {
              forceUpdate({
                inst
              });
            }
            var handleStoreChange = function() {
              if (checkIfSnapshotChanged(inst)) {
                forceUpdate({
                  inst
                });
              }
            };
            return subscribe(handleStoreChange);
          }, [subscribe]);
          useDebugValue4(value);
          return value;
        }
        function checkIfSnapshotChanged(inst) {
          var latestGetSnapshot = inst.getSnapshot;
          var prevValue = inst.value;
          try {
            var nextValue = latestGetSnapshot();
            return !objectIs(prevValue, nextValue);
          } catch (error2) {
            return true;
          }
        }
        function useSyncExternalStore$1(subscribe, getSnapshot, getServerSnapshot) {
          return getSnapshot();
        }
        var canUseDOM = !!(typeof window !== "undefined" && typeof window.document !== "undefined" && typeof window.document.createElement !== "undefined");
        var isServerEnvironment = !canUseDOM;
        var shim = isServerEnvironment ? useSyncExternalStore$1 : useSyncExternalStore;
        var useSyncExternalStore$2 = React.useSyncExternalStore !== void 0 ? React.useSyncExternalStore : shim;
        exports.useSyncExternalStore = useSyncExternalStore$2;
        if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ !== "undefined" && typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop === "function") {
          __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop(new Error());
        }
      })();
    }
  }
});

// node_modules/@web3-react/core/node_modules/zustand/node_modules/use-sync-external-store/shim/index.js
var require_shim2 = __commonJS({
  "node_modules/@web3-react/core/node_modules/zustand/node_modules/use-sync-external-store/shim/index.js"(exports, module) {
    "use strict";
    if (false) {
      module.exports = null;
    } else {
      module.exports = require_use_sync_external_store_shim_development2();
    }
  }
});

// node_modules/@web3-react/core/node_modules/zustand/node_modules/use-sync-external-store/cjs/use-sync-external-store-shim/with-selector.development.js
var require_with_selector_development2 = __commonJS({
  "node_modules/@web3-react/core/node_modules/zustand/node_modules/use-sync-external-store/cjs/use-sync-external-store-shim/with-selector.development.js"(exports) {
    "use strict";
    if (true) {
      (function() {
        "use strict";
        if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ !== "undefined" && typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart === "function") {
          __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart(new Error());
        }
        var React = require_react();
        var shim = require_shim2();
        function is(x, y) {
          return x === y && (x !== 0 || 1 / x === 1 / y) || x !== x && y !== y;
        }
        var objectIs = typeof Object.is === "function" ? Object.is : is;
        var useSyncExternalStore = shim.useSyncExternalStore;
        var useRef = React.useRef, useEffect = React.useEffect, useMemo = React.useMemo, useDebugValue4 = React.useDebugValue;
        function useSyncExternalStoreWithSelector4(subscribe, getSnapshot, getServerSnapshot, selector, isEqual) {
          var instRef = useRef(null);
          var inst;
          if (instRef.current === null) {
            inst = {
              hasValue: false,
              value: null
            };
            instRef.current = inst;
          } else {
            inst = instRef.current;
          }
          var _useMemo = useMemo(function() {
            var hasMemo = false;
            var memoizedSnapshot;
            var memoizedSelection;
            var memoizedSelector = function(nextSnapshot) {
              if (!hasMemo) {
                hasMemo = true;
                memoizedSnapshot = nextSnapshot;
                var _nextSelection = selector(nextSnapshot);
                if (isEqual !== void 0) {
                  if (inst.hasValue) {
                    var currentSelection = inst.value;
                    if (isEqual(currentSelection, _nextSelection)) {
                      memoizedSelection = currentSelection;
                      return currentSelection;
                    }
                  }
                }
                memoizedSelection = _nextSelection;
                return _nextSelection;
              }
              var prevSnapshot = memoizedSnapshot;
              var prevSelection = memoizedSelection;
              if (objectIs(prevSnapshot, nextSnapshot)) {
                return prevSelection;
              }
              var nextSelection = selector(nextSnapshot);
              if (isEqual !== void 0 && isEqual(prevSelection, nextSelection)) {
                return prevSelection;
              }
              memoizedSnapshot = nextSnapshot;
              memoizedSelection = nextSelection;
              return nextSelection;
            };
            var maybeGetServerSnapshot = getServerSnapshot === void 0 ? null : getServerSnapshot;
            var getSnapshotWithSelector = function() {
              return memoizedSelector(getSnapshot());
            };
            var getServerSnapshotWithSelector = maybeGetServerSnapshot === null ? void 0 : function() {
              return memoizedSelector(maybeGetServerSnapshot());
            };
            return [getSnapshotWithSelector, getServerSnapshotWithSelector];
          }, [getSnapshot, getServerSnapshot, selector, isEqual]), getSelection = _useMemo[0], getServerSelection = _useMemo[1];
          var value = useSyncExternalStore(subscribe, getSelection, getServerSelection);
          useEffect(function() {
            inst.hasValue = true;
            inst.value = value;
          }, [value]);
          useDebugValue4(value);
          return value;
        }
        exports.useSyncExternalStoreWithSelector = useSyncExternalStoreWithSelector4;
        if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ !== "undefined" && typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop === "function") {
          __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop(new Error());
        }
      })();
    }
  }
});

// node_modules/@web3-react/core/node_modules/zustand/node_modules/use-sync-external-store/shim/with-selector.js
var require_with_selector2 = __commonJS({
  "node_modules/@web3-react/core/node_modules/zustand/node_modules/use-sync-external-store/shim/with-selector.js"(exports, module) {
    "use strict";
    if (false) {
      module.exports = null;
    } else {
      module.exports = require_with_selector_development2();
    }
  }
});

// node_modules/@web3-react/core/node_modules/zustand/esm/index.js
var esm_exports2 = {};
__export(esm_exports2, {
  create: () => create2,
  createStore: () => createStore2,
  default: () => react2,
  useStore: () => useStore2
});
function useStore2(api, selector = api.getState, equalityFn) {
  if (equalityFn) {
    console.warn(
      "[DEPRECATED] Use `createWithEqualityFn` from 'zustand/traditional'. https://github.com/pmndrs/zustand/discussions/1937"
    );
  }
  const slice = useSyncExternalStoreWithSelector2(
    api.subscribe,
    api.getState,
    api.getServerState || api.getState,
    selector,
    equalityFn
  );
  (0, import_react2.useDebugValue)(slice);
  return slice;
}
var import_react2, import_with_selector2, useSyncExternalStoreWithSelector2, createImpl2, create2, react2;
var init_esm2 = __esm({
  "node_modules/@web3-react/core/node_modules/zustand/esm/index.js"() {
    init_vanilla2();
    init_vanilla2();
    import_react2 = __toESM(require_react());
    import_with_selector2 = __toESM(require_with_selector2());
    ({ useSyncExternalStoreWithSelector: useSyncExternalStoreWithSelector2 } = import_with_selector2.default);
    createImpl2 = (createState) => {
      if (typeof createState !== "function") {
        console.warn(
          "[DEPRECATED] Passing a vanilla store will be unsupported in a future version. Instead use `import { useStore } from 'zustand'`."
        );
      }
      const api = typeof createState === "function" ? createStore2(createState) : createState;
      const useBoundStore = (selector, equalityFn) => useStore2(api, selector, equalityFn);
      Object.assign(useBoundStore, api);
      return useBoundStore;
    };
    create2 = (createState) => createState ? createImpl2(createState) : createImpl2;
    react2 = (createState) => {
      if (true) {
        console.warn(
          "[DEPRECATED] Default export is deprecated. Instead use `import { create } from 'zustand'`."
        );
      }
      return create2(createState);
    };
  }
});

// node_modules/@web3-react/core/node_modules/zustand/esm/traditional.js
var traditional_exports = {};
__export(traditional_exports, {
  createWithEqualityFn: () => createWithEqualityFn,
  useStoreWithEqualityFn: () => useStoreWithEqualityFn
});
function useStoreWithEqualityFn(api, selector = api.getState, equalityFn) {
  const slice = useSyncExternalStoreWithSelector3(
    api.subscribe,
    api.getState,
    api.getServerState || api.getState,
    selector,
    equalityFn
  );
  (0, import_react3.useDebugValue)(slice);
  return slice;
}
var import_react3, import_with_selector3, useSyncExternalStoreWithSelector3, createWithEqualityFnImpl, createWithEqualityFn;
var init_traditional = __esm({
  "node_modules/@web3-react/core/node_modules/zustand/esm/traditional.js"() {
    import_react3 = __toESM(require_react());
    import_with_selector3 = __toESM(require_with_selector2());
    init_vanilla2();
    ({ useSyncExternalStoreWithSelector: useSyncExternalStoreWithSelector3 } = import_with_selector3.default);
    createWithEqualityFnImpl = (createState, defaultEqualityFn) => {
      const api = createStore2(createState);
      const useBoundStoreWithEqualityFn = (selector, equalityFn = defaultEqualityFn) => useStoreWithEqualityFn(api, selector, equalityFn);
      Object.assign(useBoundStoreWithEqualityFn, api);
      return useBoundStoreWithEqualityFn;
    };
    createWithEqualityFn = (createState, defaultEqualityFn) => createState ? createWithEqualityFnImpl(createState, defaultEqualityFn) : createWithEqualityFnImpl;
  }
});

// node_modules/@ethersproject/networks/lib.esm/_version.js
var version;
var init_version = __esm({
  "node_modules/@ethersproject/networks/lib.esm/_version.js"() {
    version = "networks/5.8.0";
  }
});

// node_modules/@ethersproject/networks/lib.esm/index.js
function isRenetworkable(value) {
  return value && typeof value.renetwork === "function";
}
function ethDefaultProvider(network) {
  const func = function(providers, options) {
    if (options == null) {
      options = {};
    }
    const providerList = [];
    if (providers.InfuraProvider && options.infura !== "-") {
      try {
        providerList.push(new providers.InfuraProvider(network, options.infura));
      } catch (error) {
      }
    }
    if (providers.EtherscanProvider && options.etherscan !== "-") {
      try {
        providerList.push(new providers.EtherscanProvider(network, options.etherscan));
      } catch (error) {
      }
    }
    if (providers.AlchemyProvider && options.alchemy !== "-") {
      try {
        providerList.push(new providers.AlchemyProvider(network, options.alchemy));
      } catch (error) {
      }
    }
    if (providers.PocketProvider && options.pocket !== "-") {
      const skip = ["goerli", "ropsten", "rinkeby", "sepolia"];
      try {
        const provider = new providers.PocketProvider(network, options.pocket);
        if (provider.network && skip.indexOf(provider.network.name) === -1) {
          providerList.push(provider);
        }
      } catch (error) {
      }
    }
    if (providers.CloudflareProvider && options.cloudflare !== "-") {
      try {
        providerList.push(new providers.CloudflareProvider(network));
      } catch (error) {
      }
    }
    if (providers.AnkrProvider && options.ankr !== "-") {
      try {
        const skip = ["ropsten"];
        const provider = new providers.AnkrProvider(network, options.ankr);
        if (provider.network && skip.indexOf(provider.network.name) === -1) {
          providerList.push(provider);
        }
      } catch (error) {
      }
    }
    if (providers.QuickNodeProvider && options.quicknode !== "-") {
      try {
        providerList.push(new providers.QuickNodeProvider(network, options.quicknode));
      } catch (error) {
      }
    }
    if (providerList.length === 0) {
      return null;
    }
    if (providers.FallbackProvider) {
      let quorum = 1;
      if (options.quorum != null) {
        quorum = options.quorum;
      } else if (network === "homestead") {
        quorum = 2;
      }
      return new providers.FallbackProvider(providerList, quorum);
    }
    return providerList[0];
  };
  func.renetwork = function(network2) {
    return ethDefaultProvider(network2);
  };
  return func;
}
function etcDefaultProvider(url, network) {
  const func = function(providers, options) {
    if (providers.JsonRpcProvider) {
      return new providers.JsonRpcProvider(url, network);
    }
    return null;
  };
  func.renetwork = function(network2) {
    return etcDefaultProvider(url, network2);
  };
  return func;
}
function getNetwork(network) {
  if (network == null) {
    return null;
  }
  if (typeof network === "number") {
    for (const name in networks) {
      const standard2 = networks[name];
      if (standard2.chainId === network) {
        return {
          name: standard2.name,
          chainId: standard2.chainId,
          ensAddress: standard2.ensAddress || null,
          _defaultProvider: standard2._defaultProvider || null
        };
      }
    }
    return {
      chainId: network,
      name: "unknown"
    };
  }
  if (typeof network === "string") {
    const standard2 = networks[network];
    if (standard2 == null) {
      return null;
    }
    return {
      name: standard2.name,
      chainId: standard2.chainId,
      ensAddress: standard2.ensAddress,
      _defaultProvider: standard2._defaultProvider || null
    };
  }
  const standard = networks[network.name];
  if (!standard) {
    if (typeof network.chainId !== "number") {
      logger.throwArgumentError("invalid network chainId", "network", network);
    }
    return network;
  }
  if (network.chainId !== 0 && network.chainId !== standard.chainId) {
    logger.throwArgumentError("network chainId mismatch", "network", network);
  }
  let defaultProvider = network._defaultProvider || null;
  if (defaultProvider == null && standard._defaultProvider) {
    if (isRenetworkable(standard._defaultProvider)) {
      defaultProvider = standard._defaultProvider.renetwork(network);
    } else {
      defaultProvider = standard._defaultProvider;
    }
  }
  return {
    name: network.name,
    chainId: standard.chainId,
    ensAddress: network.ensAddress || standard.ensAddress || null,
    _defaultProvider: defaultProvider
  };
}
var logger, homestead, ropsten, classicMordor, networks;
var init_lib16 = __esm({
  "node_modules/@ethersproject/networks/lib.esm/index.js"() {
    "use strict";
    init_lib();
    init_version();
    logger = new Logger(version);
    homestead = {
      chainId: 1,
      ensAddress: "0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e",
      name: "homestead",
      _defaultProvider: ethDefaultProvider("homestead")
    };
    ropsten = {
      chainId: 3,
      ensAddress: "0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e",
      name: "ropsten",
      _defaultProvider: ethDefaultProvider("ropsten")
    };
    classicMordor = {
      chainId: 63,
      name: "classicMordor",
      _defaultProvider: etcDefaultProvider("https://www.ethercluster.com/mordor", "classicMordor")
    };
    networks = {
      unspecified: { chainId: 0, name: "unspecified" },
      homestead,
      mainnet: homestead,
      morden: { chainId: 2, name: "morden" },
      ropsten,
      testnet: ropsten,
      rinkeby: {
        chainId: 4,
        ensAddress: "0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e",
        name: "rinkeby",
        _defaultProvider: ethDefaultProvider("rinkeby")
      },
      kovan: {
        chainId: 42,
        name: "kovan",
        _defaultProvider: ethDefaultProvider("kovan")
      },
      goerli: {
        chainId: 5,
        ensAddress: "0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e",
        name: "goerli",
        _defaultProvider: ethDefaultProvider("goerli")
      },
      kintsugi: { chainId: 1337702, name: "kintsugi" },
      sepolia: {
        chainId: 11155111,
        ensAddress: "0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e",
        name: "sepolia",
        _defaultProvider: ethDefaultProvider("sepolia")
      },
      holesky: {
        chainId: 17e3,
        name: "holesky",
        _defaultProvider: ethDefaultProvider("holesky")
      },
      // ETC (See: #351)
      classic: {
        chainId: 61,
        name: "classic",
        _defaultProvider: etcDefaultProvider("https://www.ethercluster.com/etc", "classic")
      },
      classicMorden: { chainId: 62, name: "classicMorden" },
      classicMordor,
      classicTestnet: classicMordor,
      classicKotti: {
        chainId: 6,
        name: "classicKotti",
        _defaultProvider: etcDefaultProvider("https://www.ethercluster.com/kotti", "classicKotti")
      },
      xdai: { chainId: 100, name: "xdai" },
      matic: {
        chainId: 137,
        name: "matic",
        _defaultProvider: ethDefaultProvider("matic")
      },
      maticmum: {
        chainId: 80001,
        name: "maticmum",
        _defaultProvider: ethDefaultProvider("maticmum")
      },
      optimism: {
        chainId: 10,
        name: "optimism",
        _defaultProvider: ethDefaultProvider("optimism")
      },
      "optimism-kovan": { chainId: 69, name: "optimism-kovan" },
      "optimism-goerli": { chainId: 420, name: "optimism-goerli" },
      "optimism-sepolia": { chainId: 11155420, name: "optimism-sepolia" },
      arbitrum: { chainId: 42161, name: "arbitrum" },
      "arbitrum-rinkeby": { chainId: 421611, name: "arbitrum-rinkeby" },
      "arbitrum-goerli": { chainId: 421613, name: "arbitrum-goerli" },
      "arbitrum-sepolia": { chainId: 421614, name: "arbitrum-sepolia" },
      bnb: { chainId: 56, name: "bnb" },
      bnbt: { chainId: 97, name: "bnbt" }
    };
  }
});

// node_modules/@ethersproject/web/lib.esm/_version.js
var version2;
var init_version2 = __esm({
  "node_modules/@ethersproject/web/lib.esm/_version.js"() {
    version2 = "web/5.8.0";
  }
});

// node_modules/@ethersproject/web/lib.esm/geturl.js
function getUrl(href, options) {
  return __awaiter(this, void 0, void 0, function* () {
    if (options == null) {
      options = {};
    }
    const request = {
      method: options.method || "GET",
      headers: options.headers || {},
      body: options.body || void 0
    };
    if (options.skipFetchSetup !== true) {
      request.mode = "cors";
      request.cache = "no-cache";
      request.credentials = "same-origin";
      request.redirect = "follow";
      request.referrer = "client";
    }
    ;
    if (options.fetchOptions != null) {
      const opts = options.fetchOptions;
      if (opts.mode) {
        request.mode = opts.mode;
      }
      if (opts.cache) {
        request.cache = opts.cache;
      }
      if (opts.credentials) {
        request.credentials = opts.credentials;
      }
      if (opts.redirect) {
        request.redirect = opts.redirect;
      }
      if (opts.referrer) {
        request.referrer = opts.referrer;
      }
    }
    const response = yield fetch(href, request);
    const body = yield response.arrayBuffer();
    const headers = {};
    if (response.headers.forEach) {
      response.headers.forEach((value, key) => {
        headers[key.toLowerCase()] = value;
      });
    } else {
      response.headers.keys().forEach((key) => {
        headers[key.toLowerCase()] = response.headers.get(key);
      });
    }
    return {
      headers,
      statusCode: response.status,
      statusMessage: response.statusText,
      body: arrayify(new Uint8Array(body))
    };
  });
}
var __awaiter;
var init_geturl = __esm({
  "node_modules/@ethersproject/web/lib.esm/geturl.js"() {
    "use strict";
    init_lib2();
    __awaiter = function(thisArg, _arguments, P, generator) {
      function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
          resolve(value);
        });
      }
      return new (P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) {
          try {
            step(generator.next(value));
          } catch (e) {
            reject(e);
          }
        }
        function rejected(value) {
          try {
            step(generator["throw"](value));
          } catch (e) {
            reject(e);
          }
        }
        function step(result) {
          result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    };
  }
});

// node_modules/@ethersproject/web/lib.esm/index.js
function staller(duration) {
  return new Promise((resolve) => {
    setTimeout(resolve, duration);
  });
}
function bodyify(value, type) {
  if (value == null) {
    return null;
  }
  if (typeof value === "string") {
    return value;
  }
  if (isBytesLike(value)) {
    if (type && (type.split("/")[0] === "text" || type.split(";")[0].trim() === "application/json")) {
      try {
        return toUtf8String(value);
      } catch (error) {
      }
      ;
    }
    return hexlify(value);
  }
  return value;
}
function unpercent(value) {
  return toUtf8Bytes(value.replace(/%([0-9a-f][0-9a-f])/gi, (all, code) => {
    return String.fromCharCode(parseInt(code, 16));
  }));
}
function _fetchData(connection, body, processFunc) {
  const attemptLimit = typeof connection === "object" && connection.throttleLimit != null ? connection.throttleLimit : 12;
  logger2.assertArgument(attemptLimit > 0 && attemptLimit % 1 === 0, "invalid connection throttle limit", "connection.throttleLimit", attemptLimit);
  const throttleCallback = typeof connection === "object" ? connection.throttleCallback : null;
  const throttleSlotInterval = typeof connection === "object" && typeof connection.throttleSlotInterval === "number" ? connection.throttleSlotInterval : 100;
  logger2.assertArgument(throttleSlotInterval > 0 && throttleSlotInterval % 1 === 0, "invalid connection throttle slot interval", "connection.throttleSlotInterval", throttleSlotInterval);
  const errorPassThrough = typeof connection === "object" ? !!connection.errorPassThrough : false;
  const headers = {};
  let url = null;
  const options = {
    method: "GET"
  };
  let allow304 = false;
  let timeout = 2 * 60 * 1e3;
  if (typeof connection === "string") {
    url = connection;
  } else if (typeof connection === "object") {
    if (connection == null || connection.url == null) {
      logger2.throwArgumentError("missing URL", "connection.url", connection);
    }
    url = connection.url;
    if (typeof connection.timeout === "number" && connection.timeout > 0) {
      timeout = connection.timeout;
    }
    if (connection.headers) {
      for (const key in connection.headers) {
        headers[key.toLowerCase()] = { key, value: String(connection.headers[key]) };
        if (["if-none-match", "if-modified-since"].indexOf(key.toLowerCase()) >= 0) {
          allow304 = true;
        }
      }
    }
    options.allowGzip = !!connection.allowGzip;
    if (connection.user != null && connection.password != null) {
      if (url.substring(0, 6) !== "https:" && connection.allowInsecureAuthentication !== true) {
        logger2.throwError("basic authentication requires a secure https url", Logger.errors.INVALID_ARGUMENT, { argument: "url", url, user: connection.user, password: "[REDACTED]" });
      }
      const authorization = connection.user + ":" + connection.password;
      headers["authorization"] = {
        key: "Authorization",
        value: "Basic " + encode(toUtf8Bytes(authorization))
      };
    }
    if (connection.skipFetchSetup != null) {
      options.skipFetchSetup = !!connection.skipFetchSetup;
    }
    if (connection.fetchOptions != null) {
      options.fetchOptions = shallowCopy(connection.fetchOptions);
    }
  }
  const reData = new RegExp("^data:([^;:]*)?(;base64)?,(.*)$", "i");
  const dataMatch = url ? url.match(reData) : null;
  if (dataMatch) {
    try {
      const response = {
        statusCode: 200,
        statusMessage: "OK",
        headers: { "content-type": dataMatch[1] || "text/plain" },
        body: dataMatch[2] ? decode(dataMatch[3]) : unpercent(dataMatch[3])
      };
      let result = response.body;
      if (processFunc) {
        result = processFunc(response.body, response);
      }
      return Promise.resolve(result);
    } catch (error) {
      logger2.throwError("processing response error", Logger.errors.SERVER_ERROR, {
        body: bodyify(dataMatch[1], dataMatch[2]),
        error,
        requestBody: null,
        requestMethod: "GET",
        url
      });
    }
  }
  if (body) {
    options.method = "POST";
    options.body = body;
    if (headers["content-type"] == null) {
      headers["content-type"] = { key: "Content-Type", value: "application/octet-stream" };
    }
    if (headers["content-length"] == null) {
      headers["content-length"] = { key: "Content-Length", value: String(body.length) };
    }
  }
  const flatHeaders = {};
  Object.keys(headers).forEach((key) => {
    const header = headers[key];
    flatHeaders[header.key] = header.value;
  });
  options.headers = flatHeaders;
  const runningTimeout = function() {
    let timer2 = null;
    const promise = new Promise(function(resolve, reject) {
      if (timeout) {
        timer2 = setTimeout(() => {
          if (timer2 == null) {
            return;
          }
          timer2 = null;
          reject(logger2.makeError("timeout", Logger.errors.TIMEOUT, {
            requestBody: bodyify(options.body, flatHeaders["content-type"]),
            requestMethod: options.method,
            timeout,
            url
          }));
        }, timeout);
      }
    });
    const cancel = function() {
      if (timer2 == null) {
        return;
      }
      clearTimeout(timer2);
      timer2 = null;
    };
    return { promise, cancel };
  }();
  const runningFetch = function() {
    return __awaiter2(this, void 0, void 0, function* () {
      for (let attempt = 0; attempt < attemptLimit; attempt++) {
        let response = null;
        try {
          response = yield getUrl(url, options);
          if (attempt < attemptLimit) {
            if (response.statusCode === 301 || response.statusCode === 302) {
              const location = response.headers.location || "";
              if (options.method === "GET" && location.match(/^https:/)) {
                url = response.headers.location;
                continue;
              }
            } else if (response.statusCode === 429) {
              let tryAgain = true;
              if (throttleCallback) {
                tryAgain = yield throttleCallback(attempt, url);
              }
              if (tryAgain) {
                let stall3 = 0;
                const retryAfter = response.headers["retry-after"];
                if (typeof retryAfter === "string" && retryAfter.match(/^[1-9][0-9]*$/)) {
                  stall3 = parseInt(retryAfter) * 1e3;
                } else {
                  stall3 = throttleSlotInterval * parseInt(String(Math.random() * Math.pow(2, attempt)));
                }
                yield staller(stall3);
                continue;
              }
            }
          }
        } catch (error) {
          response = error.response;
          if (response == null) {
            runningTimeout.cancel();
            logger2.throwError("missing response", Logger.errors.SERVER_ERROR, {
              requestBody: bodyify(options.body, flatHeaders["content-type"]),
              requestMethod: options.method,
              serverError: error,
              url
            });
          }
        }
        let body2 = response.body;
        if (allow304 && response.statusCode === 304) {
          body2 = null;
        } else if (!errorPassThrough && (response.statusCode < 200 || response.statusCode >= 300)) {
          runningTimeout.cancel();
          logger2.throwError("bad response", Logger.errors.SERVER_ERROR, {
            status: response.statusCode,
            headers: response.headers,
            body: bodyify(body2, response.headers ? response.headers["content-type"] : null),
            requestBody: bodyify(options.body, flatHeaders["content-type"]),
            requestMethod: options.method,
            url
          });
        }
        if (processFunc) {
          try {
            const result = yield processFunc(body2, response);
            runningTimeout.cancel();
            return result;
          } catch (error) {
            if (error.throttleRetry && attempt < attemptLimit) {
              let tryAgain = true;
              if (throttleCallback) {
                tryAgain = yield throttleCallback(attempt, url);
              }
              if (tryAgain) {
                const timeout2 = throttleSlotInterval * parseInt(String(Math.random() * Math.pow(2, attempt)));
                yield staller(timeout2);
                continue;
              }
            }
            runningTimeout.cancel();
            logger2.throwError("processing response error", Logger.errors.SERVER_ERROR, {
              body: bodyify(body2, response.headers ? response.headers["content-type"] : null),
              error,
              requestBody: bodyify(options.body, flatHeaders["content-type"]),
              requestMethod: options.method,
              url
            });
          }
        }
        runningTimeout.cancel();
        return body2;
      }
      return logger2.throwError("failed response", Logger.errors.SERVER_ERROR, {
        requestBody: bodyify(options.body, flatHeaders["content-type"]),
        requestMethod: options.method,
        url
      });
    });
  }();
  return Promise.race([runningTimeout.promise, runningFetch]);
}
function fetchJson(connection, json, processFunc) {
  let processJsonFunc = (value, response) => {
    let result = null;
    if (value != null) {
      try {
        result = JSON.parse(toUtf8String(value));
      } catch (error) {
        logger2.throwError("invalid JSON", Logger.errors.SERVER_ERROR, {
          body: value,
          error
        });
      }
    }
    if (processFunc) {
      result = processFunc(result, response);
    }
    return result;
  };
  let body = null;
  if (json != null) {
    body = toUtf8Bytes(json);
    const updated = typeof connection === "string" ? { url: connection } : shallowCopy(connection);
    if (updated.headers) {
      const hasContentType = Object.keys(updated.headers).filter((k) => k.toLowerCase() === "content-type").length !== 0;
      if (!hasContentType) {
        updated.headers = shallowCopy(updated.headers);
        updated.headers["content-type"] = "application/json";
      }
    } else {
      updated.headers = { "content-type": "application/json" };
    }
    connection = updated;
  }
  return _fetchData(connection, body, processJsonFunc);
}
function poll(func, options) {
  if (!options) {
    options = {};
  }
  options = shallowCopy(options);
  if (options.floor == null) {
    options.floor = 0;
  }
  if (options.ceiling == null) {
    options.ceiling = 1e4;
  }
  if (options.interval == null) {
    options.interval = 250;
  }
  return new Promise(function(resolve, reject) {
    let timer2 = null;
    let done = false;
    const cancel = () => {
      if (done) {
        return false;
      }
      done = true;
      if (timer2) {
        clearTimeout(timer2);
      }
      return true;
    };
    if (options.timeout) {
      timer2 = setTimeout(() => {
        if (cancel()) {
          reject(new Error("timeout"));
        }
      }, options.timeout);
    }
    const retryLimit = options.retryLimit;
    let attempt = 0;
    function check() {
      return func().then(function(result) {
        if (result !== void 0) {
          if (cancel()) {
            resolve(result);
          }
        } else if (options.oncePoll) {
          options.oncePoll.once("poll", check);
        } else if (options.onceBlock) {
          options.onceBlock.once("block", check);
        } else if (!done) {
          attempt++;
          if (attempt > retryLimit) {
            if (cancel()) {
              reject(new Error("retry limit reached"));
            }
            return;
          }
          let timeout = options.interval * parseInt(String(Math.random() * Math.pow(2, attempt)));
          if (timeout < options.floor) {
            timeout = options.floor;
          }
          if (timeout > options.ceiling) {
            timeout = options.ceiling;
          }
          setTimeout(check, timeout);
        }
        return null;
      }, function(error) {
        if (cancel()) {
          reject(error);
        }
      });
    }
    check();
  });
}
var __awaiter2, logger2;
var init_lib17 = __esm({
  "node_modules/@ethersproject/web/lib.esm/index.js"() {
    "use strict";
    init_lib7();
    init_lib2();
    init_lib5();
    init_lib10();
    init_lib();
    init_version2();
    init_geturl();
    __awaiter2 = function(thisArg, _arguments, P, generator) {
      function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
          resolve(value);
        });
      }
      return new (P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) {
          try {
            step(generator.next(value));
          } catch (e) {
            reject(e);
          }
        }
        function rejected(value) {
          try {
            step(generator["throw"](value));
          } catch (e) {
            reject(e);
          }
        }
        function step(result) {
          result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    };
    logger2 = new Logger(version2);
  }
});

// node_modules/@ethersproject/providers/lib.esm/_version.js
var version3;
var init_version3 = __esm({
  "node_modules/@ethersproject/providers/lib.esm/_version.js"() {
    version3 = "providers/5.8.0";
  }
});

// node_modules/@ethersproject/providers/lib.esm/formatter.js
function isCommunityResourcable(value) {
  return value && typeof value.isCommunityResource === "function";
}
function isCommunityResource(value) {
  return isCommunityResourcable(value) && value.isCommunityResource();
}
function showThrottleMessage() {
  if (throttleMessage) {
    return;
  }
  throttleMessage = true;
  console.log("========= NOTICE =========");
  console.log("Request-Rate Exceeded  (this message will not be repeated)");
  console.log("");
  console.log("The default API keys for each service are provided as a highly-throttled,");
  console.log("community resource for low-traffic projects and early prototyping.");
  console.log("");
  console.log("While your application will continue to function, we highly recommended");
  console.log("signing up for your own API keys to improve performance, increase your");
  console.log("request rate/limit and enable other perks, such as metrics and advanced APIs.");
  console.log("");
  console.log("For more details: https://docs.ethers.io/api-keys/");
  console.log("==========================");
}
var logger3, Formatter, throttleMessage;
var init_formatter = __esm({
  "node_modules/@ethersproject/providers/lib.esm/formatter.js"() {
    "use strict";
    init_lib4();
    init_lib3();
    init_lib2();
    init_lib9();
    init_lib5();
    init_lib13();
    init_lib();
    init_version3();
    logger3 = new Logger(version3);
    Formatter = class _Formatter {
      constructor() {
        this.formats = this.getDefaultFormats();
      }
      getDefaultFormats() {
        const formats = {};
        const address = this.address.bind(this);
        const bigNumber = this.bigNumber.bind(this);
        const blockTag = this.blockTag.bind(this);
        const data = this.data.bind(this);
        const hash = this.hash.bind(this);
        const hex = this.hex.bind(this);
        const number = this.number.bind(this);
        const type = this.type.bind(this);
        const strictData = (v) => {
          return this.data(v, true);
        };
        formats.transaction = {
          hash,
          type,
          accessList: _Formatter.allowNull(this.accessList.bind(this), null),
          blockHash: _Formatter.allowNull(hash, null),
          blockNumber: _Formatter.allowNull(number, null),
          transactionIndex: _Formatter.allowNull(number, null),
          confirmations: _Formatter.allowNull(number, null),
          from: address,
          // either (gasPrice) or (maxPriorityFeePerGas + maxFeePerGas)
          // must be set
          gasPrice: _Formatter.allowNull(bigNumber),
          maxPriorityFeePerGas: _Formatter.allowNull(bigNumber),
          maxFeePerGas: _Formatter.allowNull(bigNumber),
          gasLimit: bigNumber,
          to: _Formatter.allowNull(address, null),
          value: bigNumber,
          nonce: number,
          data,
          r: _Formatter.allowNull(this.uint256),
          s: _Formatter.allowNull(this.uint256),
          v: _Formatter.allowNull(number),
          creates: _Formatter.allowNull(address, null),
          raw: _Formatter.allowNull(data)
        };
        formats.transactionRequest = {
          from: _Formatter.allowNull(address),
          nonce: _Formatter.allowNull(number),
          gasLimit: _Formatter.allowNull(bigNumber),
          gasPrice: _Formatter.allowNull(bigNumber),
          maxPriorityFeePerGas: _Formatter.allowNull(bigNumber),
          maxFeePerGas: _Formatter.allowNull(bigNumber),
          to: _Formatter.allowNull(address),
          value: _Formatter.allowNull(bigNumber),
          data: _Formatter.allowNull(strictData),
          type: _Formatter.allowNull(number),
          accessList: _Formatter.allowNull(this.accessList.bind(this), null)
        };
        formats.receiptLog = {
          transactionIndex: number,
          blockNumber: number,
          transactionHash: hash,
          address,
          topics: _Formatter.arrayOf(hash),
          data,
          logIndex: number,
          blockHash: hash
        };
        formats.receipt = {
          to: _Formatter.allowNull(this.address, null),
          from: _Formatter.allowNull(this.address, null),
          contractAddress: _Formatter.allowNull(address, null),
          transactionIndex: number,
          // should be allowNull(hash), but broken-EIP-658 support is handled in receipt
          root: _Formatter.allowNull(hex),
          gasUsed: bigNumber,
          logsBloom: _Formatter.allowNull(data),
          blockHash: hash,
          transactionHash: hash,
          logs: _Formatter.arrayOf(this.receiptLog.bind(this)),
          blockNumber: number,
          confirmations: _Formatter.allowNull(number, null),
          cumulativeGasUsed: bigNumber,
          effectiveGasPrice: _Formatter.allowNull(bigNumber),
          status: _Formatter.allowNull(number),
          type
        };
        formats.block = {
          hash: _Formatter.allowNull(hash),
          parentHash: hash,
          number,
          timestamp: number,
          nonce: _Formatter.allowNull(hex),
          difficulty: this.difficulty.bind(this),
          gasLimit: bigNumber,
          gasUsed: bigNumber,
          miner: _Formatter.allowNull(address),
          extraData: data,
          transactions: _Formatter.allowNull(_Formatter.arrayOf(hash)),
          baseFeePerGas: _Formatter.allowNull(bigNumber)
        };
        formats.blockWithTransactions = shallowCopy(formats.block);
        formats.blockWithTransactions.transactions = _Formatter.allowNull(_Formatter.arrayOf(this.transactionResponse.bind(this)));
        formats.filter = {
          fromBlock: _Formatter.allowNull(blockTag, void 0),
          toBlock: _Formatter.allowNull(blockTag, void 0),
          blockHash: _Formatter.allowNull(hash, void 0),
          address: _Formatter.allowNull(address, void 0),
          topics: _Formatter.allowNull(this.topics.bind(this), void 0)
        };
        formats.filterLog = {
          blockNumber: _Formatter.allowNull(number),
          blockHash: _Formatter.allowNull(hash),
          transactionIndex: number,
          removed: _Formatter.allowNull(this.boolean.bind(this)),
          address,
          data: _Formatter.allowFalsish(data, "0x"),
          topics: _Formatter.arrayOf(hash),
          transactionHash: hash,
          logIndex: number
        };
        return formats;
      }
      accessList(accessList) {
        return accessListify(accessList || []);
      }
      // Requires a BigNumberish that is within the IEEE754 safe integer range; returns a number
      // Strict! Used on input.
      number(number) {
        if (number === "0x") {
          return 0;
        }
        return BigNumber.from(number).toNumber();
      }
      type(number) {
        if (number === "0x" || number == null) {
          return 0;
        }
        return BigNumber.from(number).toNumber();
      }
      // Strict! Used on input.
      bigNumber(value) {
        return BigNumber.from(value);
      }
      // Requires a boolean, "true" or  "false"; returns a boolean
      boolean(value) {
        if (typeof value === "boolean") {
          return value;
        }
        if (typeof value === "string") {
          value = value.toLowerCase();
          if (value === "true") {
            return true;
          }
          if (value === "false") {
            return false;
          }
        }
        throw new Error("invalid boolean - " + value);
      }
      hex(value, strict) {
        if (typeof value === "string") {
          if (!strict && value.substring(0, 2) !== "0x") {
            value = "0x" + value;
          }
          if (isHexString(value)) {
            return value.toLowerCase();
          }
        }
        return logger3.throwArgumentError("invalid hash", "value", value);
      }
      data(value, strict) {
        const result = this.hex(value, strict);
        if (result.length % 2 !== 0) {
          throw new Error("invalid data; odd-length - " + value);
        }
        return result;
      }
      // Requires an address
      // Strict! Used on input.
      address(value) {
        return getAddress(value);
      }
      callAddress(value) {
        if (!isHexString(value, 32)) {
          return null;
        }
        const address = getAddress(hexDataSlice(value, 12));
        return address === AddressZero ? null : address;
      }
      contractAddress(value) {
        return getContractAddress(value);
      }
      // Strict! Used on input.
      blockTag(blockTag) {
        if (blockTag == null) {
          return "latest";
        }
        if (blockTag === "earliest") {
          return "0x0";
        }
        switch (blockTag) {
          case "earliest":
            return "0x0";
          case "latest":
          case "pending":
          case "safe":
          case "finalized":
            return blockTag;
        }
        if (typeof blockTag === "number" || isHexString(blockTag)) {
          return hexValue(blockTag);
        }
        throw new Error("invalid blockTag");
      }
      // Requires a hash, optionally requires 0x prefix; returns prefixed lowercase hash.
      hash(value, strict) {
        const result = this.hex(value, strict);
        if (hexDataLength(result) !== 32) {
          return logger3.throwArgumentError("invalid hash", "value", value);
        }
        return result;
      }
      // Returns the difficulty as a number, or if too large (i.e. PoA network) null
      difficulty(value) {
        if (value == null) {
          return null;
        }
        const v = BigNumber.from(value);
        try {
          return v.toNumber();
        } catch (error) {
        }
        return null;
      }
      uint256(value) {
        if (!isHexString(value)) {
          throw new Error("invalid uint256");
        }
        return hexZeroPad(value, 32);
      }
      _block(value, format) {
        if (value.author != null && value.miner == null) {
          value.miner = value.author;
        }
        const difficulty = value._difficulty != null ? value._difficulty : value.difficulty;
        const result = _Formatter.check(format, value);
        result._difficulty = difficulty == null ? null : BigNumber.from(difficulty);
        return result;
      }
      block(value) {
        return this._block(value, this.formats.block);
      }
      blockWithTransactions(value) {
        return this._block(value, this.formats.blockWithTransactions);
      }
      // Strict! Used on input.
      transactionRequest(value) {
        return _Formatter.check(this.formats.transactionRequest, value);
      }
      transactionResponse(transaction) {
        if (transaction.gas != null && transaction.gasLimit == null) {
          transaction.gasLimit = transaction.gas;
        }
        if (transaction.to && BigNumber.from(transaction.to).isZero()) {
          transaction.to = "0x0000000000000000000000000000000000000000";
        }
        if (transaction.input != null && transaction.data == null) {
          transaction.data = transaction.input;
        }
        if (transaction.to == null && transaction.creates == null) {
          transaction.creates = this.contractAddress(transaction);
        }
        if ((transaction.type === 1 || transaction.type === 2) && transaction.accessList == null) {
          transaction.accessList = [];
        }
        const result = _Formatter.check(this.formats.transaction, transaction);
        if (transaction.chainId != null) {
          let chainId = transaction.chainId;
          if (isHexString(chainId)) {
            chainId = BigNumber.from(chainId).toNumber();
          }
          result.chainId = chainId;
        } else {
          let chainId = transaction.networkId;
          if (chainId == null && result.v == null) {
            chainId = transaction.chainId;
          }
          if (isHexString(chainId)) {
            chainId = BigNumber.from(chainId).toNumber();
          }
          if (typeof chainId !== "number" && result.v != null) {
            chainId = (result.v - 35) / 2;
            if (chainId < 0) {
              chainId = 0;
            }
            chainId = parseInt(chainId);
          }
          if (typeof chainId !== "number") {
            chainId = 0;
          }
          result.chainId = chainId;
        }
        if (result.blockHash && result.blockHash.replace(/0/g, "") === "x") {
          result.blockHash = null;
        }
        return result;
      }
      transaction(value) {
        return parse(value);
      }
      receiptLog(value) {
        return _Formatter.check(this.formats.receiptLog, value);
      }
      receipt(value) {
        const result = _Formatter.check(this.formats.receipt, value);
        if (result.root != null) {
          if (result.root.length <= 4) {
            const value2 = BigNumber.from(result.root).toNumber();
            if (value2 === 0 || value2 === 1) {
              if (result.status != null && result.status !== value2) {
                logger3.throwArgumentError("alt-root-status/status mismatch", "value", { root: result.root, status: result.status });
              }
              result.status = value2;
              delete result.root;
            } else {
              logger3.throwArgumentError("invalid alt-root-status", "value.root", result.root);
            }
          } else if (result.root.length !== 66) {
            logger3.throwArgumentError("invalid root hash", "value.root", result.root);
          }
        }
        if (result.status != null) {
          result.byzantium = true;
        }
        return result;
      }
      topics(value) {
        if (Array.isArray(value)) {
          return value.map((v) => this.topics(v));
        } else if (value != null) {
          return this.hash(value, true);
        }
        return null;
      }
      filter(value) {
        return _Formatter.check(this.formats.filter, value);
      }
      filterLog(value) {
        return _Formatter.check(this.formats.filterLog, value);
      }
      static check(format, object) {
        const result = {};
        for (const key in format) {
          try {
            const value = format[key](object[key]);
            if (value !== void 0) {
              result[key] = value;
            }
          } catch (error) {
            error.checkKey = key;
            error.checkValue = object[key];
            throw error;
          }
        }
        return result;
      }
      // if value is null-ish, nullValue is returned
      static allowNull(format, nullValue) {
        return function(value) {
          if (value == null) {
            return nullValue;
          }
          return format(value);
        };
      }
      // If value is false-ish, replaceValue is returned
      static allowFalsish(format, replaceValue) {
        return function(value) {
          if (!value) {
            return replaceValue;
          }
          return format(value);
        };
      }
      // Requires an Array satisfying check
      static arrayOf(format) {
        return function(array) {
          if (!Array.isArray(array)) {
            throw new Error("not an array");
          }
          const result = [];
          array.forEach(function(value) {
            result.push(format(value));
          });
          return result;
        };
      }
    };
    throttleMessage = false;
  }
});

// node_modules/@ethersproject/providers/lib.esm/base-provider.js
function checkTopic(topic) {
  if (topic == null) {
    return "null";
  }
  if (hexDataLength(topic) !== 32) {
    logger4.throwArgumentError("invalid topic", "topic", topic);
  }
  return topic.toLowerCase();
}
function serializeTopics(topics) {
  topics = topics.slice();
  while (topics.length > 0 && topics[topics.length - 1] == null) {
    topics.pop();
  }
  return topics.map((topic) => {
    if (Array.isArray(topic)) {
      const unique = {};
      topic.forEach((topic2) => {
        unique[checkTopic(topic2)] = true;
      });
      const sorted = Object.keys(unique);
      sorted.sort();
      return sorted.join("|");
    } else {
      return checkTopic(topic);
    }
  }).join("&");
}
function deserializeTopics(data) {
  if (data === "") {
    return [];
  }
  return data.split(/&/g).map((topic) => {
    if (topic === "") {
      return [];
    }
    const comps = topic.split("|").map((topic2) => {
      return topic2 === "null" ? null : topic2;
    });
    return comps.length === 1 ? comps[0] : comps;
  });
}
function getEventTag(eventName) {
  if (typeof eventName === "string") {
    eventName = eventName.toLowerCase();
    if (hexDataLength(eventName) === 32) {
      return "tx:" + eventName;
    }
    if (eventName.indexOf(":") === -1) {
      return eventName;
    }
  } else if (Array.isArray(eventName)) {
    return "filter:*:" + serializeTopics(eventName);
  } else if (ForkEvent.isForkEvent(eventName)) {
    logger4.warn("not implemented");
    throw new Error("not implemented");
  } else if (eventName && typeof eventName === "object") {
    return "filter:" + (eventName.address || "*") + ":" + serializeTopics(eventName.topics || []);
  }
  throw new Error("invalid event - " + eventName);
}
function getTime() {
  return (/* @__PURE__ */ new Date()).getTime();
}
function stall(duration) {
  return new Promise((resolve) => {
    setTimeout(resolve, duration);
  });
}
function bytes32ify(value) {
  return hexZeroPad(BigNumber.from(value).toHexString(), 32);
}
function base58Encode(data) {
  return Base58.encode(concat([data, hexDataSlice(sha256(sha256(data)), 0, 4)]));
}
function _parseString(result, start) {
  try {
    return toUtf8String(_parseBytes(result, start));
  } catch (error) {
  }
  return null;
}
function _parseBytes(result, start) {
  if (result === "0x") {
    return null;
  }
  const offset = BigNumber.from(hexDataSlice(result, start, start + 32)).toNumber();
  const length = BigNumber.from(hexDataSlice(result, offset, offset + 32)).toNumber();
  return hexDataSlice(result, offset + 32, offset + 32 + length);
}
function getIpfsLink(link) {
  if (link.match(/^ipfs:\/\/ipfs\//i)) {
    link = link.substring(12);
  } else if (link.match(/^ipfs:\/\//i)) {
    link = link.substring(7);
  } else {
    logger4.throwArgumentError("unsupported IPFS format", "link", link);
  }
  return `https://gateway.ipfs.io/ipfs/${link}`;
}
function numPad(value) {
  const result = arrayify(value);
  if (result.length > 32) {
    throw new Error("internal; should not happen");
  }
  const padded = new Uint8Array(32);
  padded.set(result, 32 - result.length);
  return padded;
}
function bytesPad(value) {
  if (value.length % 32 === 0) {
    return value;
  }
  const result = new Uint8Array(Math.ceil(value.length / 32) * 32);
  result.set(value);
  return result;
}
function encodeBytes(datas) {
  const result = [];
  let byteCount = 0;
  for (let i = 0; i < datas.length; i++) {
    result.push(null);
    byteCount += 32;
  }
  for (let i = 0; i < datas.length; i++) {
    const data = arrayify(datas[i]);
    result[i] = numPad(byteCount);
    result.push(numPad(data.length));
    result.push(bytesPad(data));
    byteCount += 32 + Math.ceil(data.length / 32) * 32;
  }
  return hexConcat(result);
}
var import_bech32, __awaiter3, logger4, MAX_CCIP_REDIRECTS, PollableEvents, Event, coinInfos, matcherIpfs, matchers, Resolver, defaultFormatter, nextPollId, BaseProvider;
var init_base_provider = __esm({
  "node_modules/@ethersproject/providers/lib.esm/base-provider.js"() {
    "use strict";
    init_lib6();
    init_lib7();
    init_lib8();
    init_lib3();
    init_lib2();
    init_lib9();
    init_lib11();
    init_lib16();
    init_lib5();
    init_lib12();
    init_lib10();
    init_lib17();
    import_bech32 = __toESM(require_bech32());
    init_lib();
    init_version3();
    init_formatter();
    __awaiter3 = function(thisArg, _arguments, P, generator) {
      function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
          resolve(value);
        });
      }
      return new (P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) {
          try {
            step(generator.next(value));
          } catch (e) {
            reject(e);
          }
        }
        function rejected(value) {
          try {
            step(generator["throw"](value));
          } catch (e) {
            reject(e);
          }
        }
        function step(result) {
          result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    };
    logger4 = new Logger(version3);
    MAX_CCIP_REDIRECTS = 10;
    PollableEvents = ["block", "network", "pending", "poll"];
    Event = class {
      constructor(tag, listener, once) {
        defineReadOnly(this, "tag", tag);
        defineReadOnly(this, "listener", listener);
        defineReadOnly(this, "once", once);
        this._lastBlockNumber = -2;
        this._inflight = false;
      }
      get event() {
        switch (this.type) {
          case "tx":
            return this.hash;
          case "filter":
            return this.filter;
        }
        return this.tag;
      }
      get type() {
        return this.tag.split(":")[0];
      }
      get hash() {
        const comps = this.tag.split(":");
        if (comps[0] !== "tx") {
          return null;
        }
        return comps[1];
      }
      get filter() {
        const comps = this.tag.split(":");
        if (comps[0] !== "filter") {
          return null;
        }
        const address = comps[1];
        const topics = deserializeTopics(comps[2]);
        const filter = {};
        if (topics.length > 0) {
          filter.topics = topics;
        }
        if (address && address !== "*") {
          filter.address = address;
        }
        return filter;
      }
      pollable() {
        return this.tag.indexOf(":") >= 0 || PollableEvents.indexOf(this.tag) >= 0;
      }
    };
    coinInfos = {
      "0": { symbol: "btc", p2pkh: 0, p2sh: 5, prefix: "bc" },
      "2": { symbol: "ltc", p2pkh: 48, p2sh: 50, prefix: "ltc" },
      "3": { symbol: "doge", p2pkh: 30, p2sh: 22 },
      "60": { symbol: "eth", ilk: "eth" },
      "61": { symbol: "etc", ilk: "eth" },
      "700": { symbol: "xdai", ilk: "eth" }
    };
    matcherIpfs = new RegExp("^(ipfs)://(.*)$", "i");
    matchers = [
      new RegExp("^(https)://(.*)$", "i"),
      new RegExp("^(data):(.*)$", "i"),
      matcherIpfs,
      new RegExp("^eip155:[0-9]+/(erc[0-9]+):(.*)$", "i")
    ];
    Resolver = class {
      // The resolvedAddress is only for creating a ReverseLookup resolver
      constructor(provider, address, name, resolvedAddress) {
        defineReadOnly(this, "provider", provider);
        defineReadOnly(this, "name", name);
        defineReadOnly(this, "address", provider.formatter.address(address));
        defineReadOnly(this, "_resolvedAddress", resolvedAddress);
      }
      supportsWildcard() {
        if (!this._supportsEip2544) {
          this._supportsEip2544 = this.provider.call({
            to: this.address,
            data: "0x01ffc9a79061b92300000000000000000000000000000000000000000000000000000000"
          }).then((result) => {
            return BigNumber.from(result).eq(1);
          }).catch((error) => {
            if (error.code === Logger.errors.CALL_EXCEPTION) {
              return false;
            }
            this._supportsEip2544 = null;
            throw error;
          });
        }
        return this._supportsEip2544;
      }
      _fetch(selector, parameters) {
        return __awaiter3(this, void 0, void 0, function* () {
          const tx = {
            to: this.address,
            ccipReadEnabled: true,
            data: hexConcat([selector, namehash(this.name), parameters || "0x"])
          };
          let parseBytes = false;
          if (yield this.supportsWildcard()) {
            parseBytes = true;
            tx.data = hexConcat(["0x9061b923", encodeBytes([dnsEncode(this.name), tx.data])]);
          }
          try {
            let result = yield this.provider.call(tx);
            if (arrayify(result).length % 32 === 4) {
              logger4.throwError("resolver threw error", Logger.errors.CALL_EXCEPTION, {
                transaction: tx,
                data: result
              });
            }
            if (parseBytes) {
              result = _parseBytes(result, 0);
            }
            return result;
          } catch (error) {
            if (error.code === Logger.errors.CALL_EXCEPTION) {
              return null;
            }
            throw error;
          }
        });
      }
      _fetchBytes(selector, parameters) {
        return __awaiter3(this, void 0, void 0, function* () {
          const result = yield this._fetch(selector, parameters);
          if (result != null) {
            return _parseBytes(result, 0);
          }
          return null;
        });
      }
      _getAddress(coinType, hexBytes) {
        const coinInfo = coinInfos[String(coinType)];
        if (coinInfo == null) {
          logger4.throwError(`unsupported coin type: ${coinType}`, Logger.errors.UNSUPPORTED_OPERATION, {
            operation: `getAddress(${coinType})`
          });
        }
        if (coinInfo.ilk === "eth") {
          return this.provider.formatter.address(hexBytes);
        }
        const bytes = arrayify(hexBytes);
        if (coinInfo.p2pkh != null) {
          const p2pkh = hexBytes.match(/^0x76a9([0-9a-f][0-9a-f])([0-9a-f]*)88ac$/);
          if (p2pkh) {
            const length = parseInt(p2pkh[1], 16);
            if (p2pkh[2].length === length * 2 && length >= 1 && length <= 75) {
              return base58Encode(concat([[coinInfo.p2pkh], "0x" + p2pkh[2]]));
            }
          }
        }
        if (coinInfo.p2sh != null) {
          const p2sh = hexBytes.match(/^0xa9([0-9a-f][0-9a-f])([0-9a-f]*)87$/);
          if (p2sh) {
            const length = parseInt(p2sh[1], 16);
            if (p2sh[2].length === length * 2 && length >= 1 && length <= 75) {
              return base58Encode(concat([[coinInfo.p2sh], "0x" + p2sh[2]]));
            }
          }
        }
        if (coinInfo.prefix != null) {
          const length = bytes[1];
          let version4 = bytes[0];
          if (version4 === 0) {
            if (length !== 20 && length !== 32) {
              version4 = -1;
            }
          } else {
            version4 = -1;
          }
          if (version4 >= 0 && bytes.length === 2 + length && length >= 1 && length <= 75) {
            const words = import_bech32.default.toWords(bytes.slice(2));
            words.unshift(version4);
            return import_bech32.default.encode(coinInfo.prefix, words);
          }
        }
        return null;
      }
      getAddress(coinType) {
        return __awaiter3(this, void 0, void 0, function* () {
          if (coinType == null) {
            coinType = 60;
          }
          if (coinType === 60) {
            try {
              const result = yield this._fetch("0x3b3b57de");
              if (result === "0x" || result === HashZero) {
                return null;
              }
              return this.provider.formatter.callAddress(result);
            } catch (error) {
              if (error.code === Logger.errors.CALL_EXCEPTION) {
                return null;
              }
              throw error;
            }
          }
          const hexBytes = yield this._fetchBytes("0xf1cb7e06", bytes32ify(coinType));
          if (hexBytes == null || hexBytes === "0x") {
            return null;
          }
          const address = this._getAddress(coinType, hexBytes);
          if (address == null) {
            logger4.throwError(`invalid or unsupported coin data`, Logger.errors.UNSUPPORTED_OPERATION, {
              operation: `getAddress(${coinType})`,
              coinType,
              data: hexBytes
            });
          }
          return address;
        });
      }
      getAvatar() {
        return __awaiter3(this, void 0, void 0, function* () {
          const linkage = [{ type: "name", content: this.name }];
          try {
            const avatar = yield this.getText("avatar");
            if (avatar == null) {
              return null;
            }
            for (let i = 0; i < matchers.length; i++) {
              const match = avatar.match(matchers[i]);
              if (match == null) {
                continue;
              }
              const scheme = match[1].toLowerCase();
              switch (scheme) {
                case "https":
                  linkage.push({ type: "url", content: avatar });
                  return { linkage, url: avatar };
                case "data":
                  linkage.push({ type: "data", content: avatar });
                  return { linkage, url: avatar };
                case "ipfs":
                  linkage.push({ type: "ipfs", content: avatar });
                  return { linkage, url: getIpfsLink(avatar) };
                case "erc721":
                case "erc1155": {
                  const selector = scheme === "erc721" ? "0xc87b56dd" : "0x0e89341c";
                  linkage.push({ type: scheme, content: avatar });
                  const owner = this._resolvedAddress || (yield this.getAddress());
                  const comps = (match[2] || "").split("/");
                  if (comps.length !== 2) {
                    return null;
                  }
                  const addr = yield this.provider.formatter.address(comps[0]);
                  const tokenId = hexZeroPad(BigNumber.from(comps[1]).toHexString(), 32);
                  if (scheme === "erc721") {
                    const tokenOwner = this.provider.formatter.callAddress(yield this.provider.call({
                      to: addr,
                      data: hexConcat(["0x6352211e", tokenId])
                    }));
                    if (owner !== tokenOwner) {
                      return null;
                    }
                    linkage.push({ type: "owner", content: tokenOwner });
                  } else if (scheme === "erc1155") {
                    const balance = BigNumber.from(yield this.provider.call({
                      to: addr,
                      data: hexConcat(["0x00fdd58e", hexZeroPad(owner, 32), tokenId])
                    }));
                    if (balance.isZero()) {
                      return null;
                    }
                    linkage.push({ type: "balance", content: balance.toString() });
                  }
                  const tx = {
                    to: this.provider.formatter.address(comps[0]),
                    data: hexConcat([selector, tokenId])
                  };
                  let metadataUrl = _parseString(yield this.provider.call(tx), 0);
                  if (metadataUrl == null) {
                    return null;
                  }
                  linkage.push({ type: "metadata-url-base", content: metadataUrl });
                  if (scheme === "erc1155") {
                    metadataUrl = metadataUrl.replace("{id}", tokenId.substring(2));
                    linkage.push({ type: "metadata-url-expanded", content: metadataUrl });
                  }
                  if (metadataUrl.match(/^ipfs:/i)) {
                    metadataUrl = getIpfsLink(metadataUrl);
                  }
                  linkage.push({ type: "metadata-url", content: metadataUrl });
                  const metadata = yield fetchJson(metadataUrl);
                  if (!metadata) {
                    return null;
                  }
                  linkage.push({ type: "metadata", content: JSON.stringify(metadata) });
                  let imageUrl = metadata.image;
                  if (typeof imageUrl !== "string") {
                    return null;
                  }
                  if (imageUrl.match(/^(https:\/\/|data:)/i)) {
                  } else {
                    const ipfs = imageUrl.match(matcherIpfs);
                    if (ipfs == null) {
                      return null;
                    }
                    linkage.push({ type: "url-ipfs", content: imageUrl });
                    imageUrl = getIpfsLink(imageUrl);
                  }
                  linkage.push({ type: "url", content: imageUrl });
                  return { linkage, url: imageUrl };
                }
              }
            }
          } catch (error) {
          }
          return null;
        });
      }
      getContentHash() {
        return __awaiter3(this, void 0, void 0, function* () {
          const hexBytes = yield this._fetchBytes("0xbc1c58d1");
          if (hexBytes == null || hexBytes === "0x") {
            return null;
          }
          const ipfs = hexBytes.match(/^0xe3010170(([0-9a-f][0-9a-f])([0-9a-f][0-9a-f])([0-9a-f]*))$/);
          if (ipfs) {
            const length = parseInt(ipfs[3], 16);
            if (ipfs[4].length === length * 2) {
              return "ipfs://" + Base58.encode("0x" + ipfs[1]);
            }
          }
          const ipns = hexBytes.match(/^0xe5010172(([0-9a-f][0-9a-f])([0-9a-f][0-9a-f])([0-9a-f]*))$/);
          if (ipns) {
            const length = parseInt(ipns[3], 16);
            if (ipns[4].length === length * 2) {
              return "ipns://" + Base58.encode("0x" + ipns[1]);
            }
          }
          const swarm = hexBytes.match(/^0xe40101fa011b20([0-9a-f]*)$/);
          if (swarm) {
            if (swarm[1].length === 32 * 2) {
              return "bzz://" + swarm[1];
            }
          }
          const skynet = hexBytes.match(/^0x90b2c605([0-9a-f]*)$/);
          if (skynet) {
            if (skynet[1].length === 34 * 2) {
              const urlSafe = { "=": "", "+": "-", "/": "_" };
              const hash = encode("0x" + skynet[1]).replace(/[=+\/]/g, (a) => urlSafe[a]);
              return "sia://" + hash;
            }
          }
          return logger4.throwError(`invalid or unsupported content hash data`, Logger.errors.UNSUPPORTED_OPERATION, {
            operation: "getContentHash()",
            data: hexBytes
          });
        });
      }
      getText(key) {
        return __awaiter3(this, void 0, void 0, function* () {
          let keyBytes = toUtf8Bytes(key);
          keyBytes = concat([bytes32ify(64), bytes32ify(keyBytes.length), keyBytes]);
          if (keyBytes.length % 32 !== 0) {
            keyBytes = concat([keyBytes, hexZeroPad("0x", 32 - key.length % 32)]);
          }
          const hexBytes = yield this._fetchBytes("0x59d1d43c", hexlify(keyBytes));
          if (hexBytes == null || hexBytes === "0x") {
            return null;
          }
          return toUtf8String(hexBytes);
        });
      }
    };
    defaultFormatter = null;
    nextPollId = 1;
    BaseProvider = class extends Provider {
      /**
       *  ready
       *
       *  A Promise<Network> that resolves only once the provider is ready.
       *
       *  Sub-classes that call the super with a network without a chainId
       *  MUST set this. Standard named networks have a known chainId.
       *
       */
      constructor(network) {
        super();
        this._events = [];
        this._emitted = { block: -2 };
        this.disableCcipRead = false;
        this.formatter = new.target.getFormatter();
        defineReadOnly(this, "anyNetwork", network === "any");
        if (this.anyNetwork) {
          network = this.detectNetwork();
        }
        if (network instanceof Promise) {
          this._networkPromise = network;
          network.catch((error) => {
          });
          this._ready().catch((error) => {
          });
        } else {
          const knownNetwork = getStatic(new.target, "getNetwork")(network);
          if (knownNetwork) {
            defineReadOnly(this, "_network", knownNetwork);
            this.emit("network", knownNetwork, null);
          } else {
            logger4.throwArgumentError("invalid network", "network", network);
          }
        }
        this._maxInternalBlockNumber = -1024;
        this._lastBlockNumber = -2;
        this._maxFilterBlockRange = 10;
        this._pollingInterval = 4e3;
        this._fastQueryDate = 0;
      }
      _ready() {
        return __awaiter3(this, void 0, void 0, function* () {
          if (this._network == null) {
            let network = null;
            if (this._networkPromise) {
              try {
                network = yield this._networkPromise;
              } catch (error) {
              }
            }
            if (network == null) {
              network = yield this.detectNetwork();
            }
            if (!network) {
              logger4.throwError("no network detected", Logger.errors.UNKNOWN_ERROR, {});
            }
            if (this._network == null) {
              if (this.anyNetwork) {
                this._network = network;
              } else {
                defineReadOnly(this, "_network", network);
              }
              this.emit("network", network, null);
            }
          }
          return this._network;
        });
      }
      // This will always return the most recently established network.
      // For "any", this can change (a "network" event is emitted before
      // any change is reflected); otherwise this cannot change
      get ready() {
        return poll(() => {
          return this._ready().then((network) => {
            return network;
          }, (error) => {
            if (error.code === Logger.errors.NETWORK_ERROR && error.event === "noNetwork") {
              return void 0;
            }
            throw error;
          });
        });
      }
      // @TODO: Remove this and just create a singleton formatter
      static getFormatter() {
        if (defaultFormatter == null) {
          defaultFormatter = new Formatter();
        }
        return defaultFormatter;
      }
      // @TODO: Remove this and just use getNetwork
      static getNetwork(network) {
        return getNetwork(network == null ? "homestead" : network);
      }
      ccipReadFetch(tx, calldata, urls) {
        return __awaiter3(this, void 0, void 0, function* () {
          if (this.disableCcipRead || urls.length === 0) {
            return null;
          }
          const sender = tx.to.toLowerCase();
          const data = calldata.toLowerCase();
          const errorMessages = [];
          for (let i = 0; i < urls.length; i++) {
            const url = urls[i];
            const href = url.replace("{sender}", sender).replace("{data}", data);
            const json = url.indexOf("{data}") >= 0 ? null : JSON.stringify({ data, sender });
            const result = yield fetchJson({ url: href, errorPassThrough: true }, json, (value, response) => {
              value.status = response.statusCode;
              return value;
            });
            if (result.data) {
              return result.data;
            }
            const errorMessage = result.message || "unknown error";
            if (result.status >= 400 && result.status < 500) {
              return logger4.throwError(`response not found during CCIP fetch: ${errorMessage}`, Logger.errors.SERVER_ERROR, { url, errorMessage });
            }
            errorMessages.push(errorMessage);
          }
          return logger4.throwError(`error encountered during CCIP fetch: ${errorMessages.map((m) => JSON.stringify(m)).join(", ")}`, Logger.errors.SERVER_ERROR, {
            urls,
            errorMessages
          });
        });
      }
      // Fetches the blockNumber, but will reuse any result that is less
      // than maxAge old or has been requested since the last request
      _getInternalBlockNumber(maxAge) {
        return __awaiter3(this, void 0, void 0, function* () {
          yield this._ready();
          if (maxAge > 0) {
            while (this._internalBlockNumber) {
              const internalBlockNumber = this._internalBlockNumber;
              try {
                const result = yield internalBlockNumber;
                if (getTime() - result.respTime <= maxAge) {
                  return result.blockNumber;
                }
                break;
              } catch (error) {
                if (this._internalBlockNumber === internalBlockNumber) {
                  break;
                }
              }
            }
          }
          const reqTime = getTime();
          const checkInternalBlockNumber = resolveProperties({
            blockNumber: this.perform("getBlockNumber", {}),
            networkError: this.getNetwork().then((network) => null, (error) => error)
          }).then(({ blockNumber, networkError }) => {
            if (networkError) {
              if (this._internalBlockNumber === checkInternalBlockNumber) {
                this._internalBlockNumber = null;
              }
              throw networkError;
            }
            const respTime = getTime();
            blockNumber = BigNumber.from(blockNumber).toNumber();
            if (blockNumber < this._maxInternalBlockNumber) {
              blockNumber = this._maxInternalBlockNumber;
            }
            this._maxInternalBlockNumber = blockNumber;
            this._setFastBlockNumber(blockNumber);
            return { blockNumber, reqTime, respTime };
          });
          this._internalBlockNumber = checkInternalBlockNumber;
          checkInternalBlockNumber.catch((error) => {
            if (this._internalBlockNumber === checkInternalBlockNumber) {
              this._internalBlockNumber = null;
            }
          });
          return (yield checkInternalBlockNumber).blockNumber;
        });
      }
      poll() {
        return __awaiter3(this, void 0, void 0, function* () {
          const pollId = nextPollId++;
          const runners = [];
          let blockNumber = null;
          try {
            blockNumber = yield this._getInternalBlockNumber(100 + this.pollingInterval / 2);
          } catch (error) {
            this.emit("error", error);
            return;
          }
          this._setFastBlockNumber(blockNumber);
          this.emit("poll", pollId, blockNumber);
          if (blockNumber === this._lastBlockNumber) {
            this.emit("didPoll", pollId);
            return;
          }
          if (this._emitted.block === -2) {
            this._emitted.block = blockNumber - 1;
          }
          if (Math.abs(this._emitted.block - blockNumber) > 1e3) {
            logger4.warn(`network block skew detected; skipping block events (emitted=${this._emitted.block} blockNumber${blockNumber})`);
            this.emit("error", logger4.makeError("network block skew detected", Logger.errors.NETWORK_ERROR, {
              blockNumber,
              event: "blockSkew",
              previousBlockNumber: this._emitted.block
            }));
            this.emit("block", blockNumber);
          } else {
            for (let i = this._emitted.block + 1; i <= blockNumber; i++) {
              this.emit("block", i);
            }
          }
          if (this._emitted.block !== blockNumber) {
            this._emitted.block = blockNumber;
            Object.keys(this._emitted).forEach((key) => {
              if (key === "block") {
                return;
              }
              const eventBlockNumber = this._emitted[key];
              if (eventBlockNumber === "pending") {
                return;
              }
              if (blockNumber - eventBlockNumber > 12) {
                delete this._emitted[key];
              }
            });
          }
          if (this._lastBlockNumber === -2) {
            this._lastBlockNumber = blockNumber - 1;
          }
          this._events.forEach((event) => {
            switch (event.type) {
              case "tx": {
                const hash = event.hash;
                let runner = this.getTransactionReceipt(hash).then((receipt) => {
                  if (!receipt || receipt.blockNumber == null) {
                    return null;
                  }
                  this._emitted["t:" + hash] = receipt.blockNumber;
                  this.emit(hash, receipt);
                  return null;
                }).catch((error) => {
                  this.emit("error", error);
                });
                runners.push(runner);
                break;
              }
              case "filter": {
                if (!event._inflight) {
                  event._inflight = true;
                  if (event._lastBlockNumber === -2) {
                    event._lastBlockNumber = blockNumber - 1;
                  }
                  const filter = event.filter;
                  filter.fromBlock = event._lastBlockNumber + 1;
                  filter.toBlock = blockNumber;
                  const minFromBlock = filter.toBlock - this._maxFilterBlockRange;
                  if (minFromBlock > filter.fromBlock) {
                    filter.fromBlock = minFromBlock;
                  }
                  if (filter.fromBlock < 0) {
                    filter.fromBlock = 0;
                  }
                  const runner = this.getLogs(filter).then((logs) => {
                    event._inflight = false;
                    if (logs.length === 0) {
                      return;
                    }
                    logs.forEach((log) => {
                      if (log.blockNumber > event._lastBlockNumber) {
                        event._lastBlockNumber = log.blockNumber;
                      }
                      this._emitted["b:" + log.blockHash] = log.blockNumber;
                      this._emitted["t:" + log.transactionHash] = log.blockNumber;
                      this.emit(filter, log);
                    });
                  }).catch((error) => {
                    this.emit("error", error);
                    event._inflight = false;
                  });
                  runners.push(runner);
                }
                break;
              }
            }
          });
          this._lastBlockNumber = blockNumber;
          Promise.all(runners).then(() => {
            this.emit("didPoll", pollId);
          }).catch((error) => {
            this.emit("error", error);
          });
          return;
        });
      }
      // Deprecated; do not use this
      resetEventsBlock(blockNumber) {
        this._lastBlockNumber = blockNumber - 1;
        if (this.polling) {
          this.poll();
        }
      }
      get network() {
        return this._network;
      }
      // This method should query the network if the underlying network
      // can change, such as when connected to a JSON-RPC backend
      detectNetwork() {
        return __awaiter3(this, void 0, void 0, function* () {
          return logger4.throwError("provider does not support network detection", Logger.errors.UNSUPPORTED_OPERATION, {
            operation: "provider.detectNetwork"
          });
        });
      }
      getNetwork() {
        return __awaiter3(this, void 0, void 0, function* () {
          const network = yield this._ready();
          const currentNetwork = yield this.detectNetwork();
          if (network.chainId !== currentNetwork.chainId) {
            if (this.anyNetwork) {
              this._network = currentNetwork;
              this._lastBlockNumber = -2;
              this._fastBlockNumber = null;
              this._fastBlockNumberPromise = null;
              this._fastQueryDate = 0;
              this._emitted.block = -2;
              this._maxInternalBlockNumber = -1024;
              this._internalBlockNumber = null;
              this.emit("network", currentNetwork, network);
              yield stall(0);
              return this._network;
            }
            const error = logger4.makeError("underlying network changed", Logger.errors.NETWORK_ERROR, {
              event: "changed",
              network,
              detectedNetwork: currentNetwork
            });
            this.emit("error", error);
            throw error;
          }
          return network;
        });
      }
      get blockNumber() {
        this._getInternalBlockNumber(100 + this.pollingInterval / 2).then((blockNumber) => {
          this._setFastBlockNumber(blockNumber);
        }, (error) => {
        });
        return this._fastBlockNumber != null ? this._fastBlockNumber : -1;
      }
      get polling() {
        return this._poller != null;
      }
      set polling(value) {
        if (value && !this._poller) {
          this._poller = setInterval(() => {
            this.poll();
          }, this.pollingInterval);
          if (!this._bootstrapPoll) {
            this._bootstrapPoll = setTimeout(() => {
              this.poll();
              this._bootstrapPoll = setTimeout(() => {
                if (!this._poller) {
                  this.poll();
                }
                this._bootstrapPoll = null;
              }, this.pollingInterval);
            }, 0);
          }
        } else if (!value && this._poller) {
          clearInterval(this._poller);
          this._poller = null;
        }
      }
      get pollingInterval() {
        return this._pollingInterval;
      }
      set pollingInterval(value) {
        if (typeof value !== "number" || value <= 0 || parseInt(String(value)) != value) {
          throw new Error("invalid polling interval");
        }
        this._pollingInterval = value;
        if (this._poller) {
          clearInterval(this._poller);
          this._poller = setInterval(() => {
            this.poll();
          }, this._pollingInterval);
        }
      }
      _getFastBlockNumber() {
        const now2 = getTime();
        if (now2 - this._fastQueryDate > 2 * this._pollingInterval) {
          this._fastQueryDate = now2;
          this._fastBlockNumberPromise = this.getBlockNumber().then((blockNumber) => {
            if (this._fastBlockNumber == null || blockNumber > this._fastBlockNumber) {
              this._fastBlockNumber = blockNumber;
            }
            return this._fastBlockNumber;
          });
        }
        return this._fastBlockNumberPromise;
      }
      _setFastBlockNumber(blockNumber) {
        if (this._fastBlockNumber != null && blockNumber < this._fastBlockNumber) {
          return;
        }
        this._fastQueryDate = getTime();
        if (this._fastBlockNumber == null || blockNumber > this._fastBlockNumber) {
          this._fastBlockNumber = blockNumber;
          this._fastBlockNumberPromise = Promise.resolve(blockNumber);
        }
      }
      waitForTransaction(transactionHash, confirmations, timeout) {
        return __awaiter3(this, void 0, void 0, function* () {
          return this._waitForTransaction(transactionHash, confirmations == null ? 1 : confirmations, timeout || 0, null);
        });
      }
      _waitForTransaction(transactionHash, confirmations, timeout, replaceable) {
        return __awaiter3(this, void 0, void 0, function* () {
          const receipt = yield this.getTransactionReceipt(transactionHash);
          if ((receipt ? receipt.confirmations : 0) >= confirmations) {
            return receipt;
          }
          return new Promise((resolve, reject) => {
            const cancelFuncs = [];
            let done = false;
            const alreadyDone = function() {
              if (done) {
                return true;
              }
              done = true;
              cancelFuncs.forEach((func) => {
                func();
              });
              return false;
            };
            const minedHandler = (receipt2) => {
              if (receipt2.confirmations < confirmations) {
                return;
              }
              if (alreadyDone()) {
                return;
              }
              resolve(receipt2);
            };
            this.on(transactionHash, minedHandler);
            cancelFuncs.push(() => {
              this.removeListener(transactionHash, minedHandler);
            });
            if (replaceable) {
              let lastBlockNumber = replaceable.startBlock;
              let scannedBlock = null;
              const replaceHandler = (blockNumber) => __awaiter3(this, void 0, void 0, function* () {
                if (done) {
                  return;
                }
                yield stall(1e3);
                this.getTransactionCount(replaceable.from).then((nonce) => __awaiter3(this, void 0, void 0, function* () {
                  if (done) {
                    return;
                  }
                  if (nonce <= replaceable.nonce) {
                    lastBlockNumber = blockNumber;
                  } else {
                    {
                      const mined = yield this.getTransaction(transactionHash);
                      if (mined && mined.blockNumber != null) {
                        return;
                      }
                    }
                    if (scannedBlock == null) {
                      scannedBlock = lastBlockNumber - 3;
                      if (scannedBlock < replaceable.startBlock) {
                        scannedBlock = replaceable.startBlock;
                      }
                    }
                    while (scannedBlock <= blockNumber) {
                      if (done) {
                        return;
                      }
                      const block = yield this.getBlockWithTransactions(scannedBlock);
                      for (let ti = 0; ti < block.transactions.length; ti++) {
                        const tx = block.transactions[ti];
                        if (tx.hash === transactionHash) {
                          return;
                        }
                        if (tx.from === replaceable.from && tx.nonce === replaceable.nonce) {
                          if (done) {
                            return;
                          }
                          const receipt2 = yield this.waitForTransaction(tx.hash, confirmations);
                          if (alreadyDone()) {
                            return;
                          }
                          let reason = "replaced";
                          if (tx.data === replaceable.data && tx.to === replaceable.to && tx.value.eq(replaceable.value)) {
                            reason = "repriced";
                          } else if (tx.data === "0x" && tx.from === tx.to && tx.value.isZero()) {
                            reason = "cancelled";
                          }
                          reject(logger4.makeError("transaction was replaced", Logger.errors.TRANSACTION_REPLACED, {
                            cancelled: reason === "replaced" || reason === "cancelled",
                            reason,
                            replacement: this._wrapTransaction(tx),
                            hash: transactionHash,
                            receipt: receipt2
                          }));
                          return;
                        }
                      }
                      scannedBlock++;
                    }
                  }
                  if (done) {
                    return;
                  }
                  this.once("block", replaceHandler);
                }), (error) => {
                  if (done) {
                    return;
                  }
                  this.once("block", replaceHandler);
                });
              });
              if (done) {
                return;
              }
              this.once("block", replaceHandler);
              cancelFuncs.push(() => {
                this.removeListener("block", replaceHandler);
              });
            }
            if (typeof timeout === "number" && timeout > 0) {
              const timer2 = setTimeout(() => {
                if (alreadyDone()) {
                  return;
                }
                reject(logger4.makeError("timeout exceeded", Logger.errors.TIMEOUT, { timeout }));
              }, timeout);
              if (timer2.unref) {
                timer2.unref();
              }
              cancelFuncs.push(() => {
                clearTimeout(timer2);
              });
            }
          });
        });
      }
      getBlockNumber() {
        return __awaiter3(this, void 0, void 0, function* () {
          return this._getInternalBlockNumber(0);
        });
      }
      getGasPrice() {
        return __awaiter3(this, void 0, void 0, function* () {
          yield this.getNetwork();
          const result = yield this.perform("getGasPrice", {});
          try {
            return BigNumber.from(result);
          } catch (error) {
            return logger4.throwError("bad result from backend", Logger.errors.SERVER_ERROR, {
              method: "getGasPrice",
              result,
              error
            });
          }
        });
      }
      getBalance(addressOrName, blockTag) {
        return __awaiter3(this, void 0, void 0, function* () {
          yield this.getNetwork();
          const params = yield resolveProperties({
            address: this._getAddress(addressOrName),
            blockTag: this._getBlockTag(blockTag)
          });
          const result = yield this.perform("getBalance", params);
          try {
            return BigNumber.from(result);
          } catch (error) {
            return logger4.throwError("bad result from backend", Logger.errors.SERVER_ERROR, {
              method: "getBalance",
              params,
              result,
              error
            });
          }
        });
      }
      getTransactionCount(addressOrName, blockTag) {
        return __awaiter3(this, void 0, void 0, function* () {
          yield this.getNetwork();
          const params = yield resolveProperties({
            address: this._getAddress(addressOrName),
            blockTag: this._getBlockTag(blockTag)
          });
          const result = yield this.perform("getTransactionCount", params);
          try {
            return BigNumber.from(result).toNumber();
          } catch (error) {
            return logger4.throwError("bad result from backend", Logger.errors.SERVER_ERROR, {
              method: "getTransactionCount",
              params,
              result,
              error
            });
          }
        });
      }
      getCode(addressOrName, blockTag) {
        return __awaiter3(this, void 0, void 0, function* () {
          yield this.getNetwork();
          const params = yield resolveProperties({
            address: this._getAddress(addressOrName),
            blockTag: this._getBlockTag(blockTag)
          });
          const result = yield this.perform("getCode", params);
          try {
            return hexlify(result);
          } catch (error) {
            return logger4.throwError("bad result from backend", Logger.errors.SERVER_ERROR, {
              method: "getCode",
              params,
              result,
              error
            });
          }
        });
      }
      getStorageAt(addressOrName, position, blockTag) {
        return __awaiter3(this, void 0, void 0, function* () {
          yield this.getNetwork();
          const params = yield resolveProperties({
            address: this._getAddress(addressOrName),
            blockTag: this._getBlockTag(blockTag),
            position: Promise.resolve(position).then((p) => hexValue(p))
          });
          const result = yield this.perform("getStorageAt", params);
          try {
            return hexlify(result);
          } catch (error) {
            return logger4.throwError("bad result from backend", Logger.errors.SERVER_ERROR, {
              method: "getStorageAt",
              params,
              result,
              error
            });
          }
        });
      }
      // This should be called by any subclass wrapping a TransactionResponse
      _wrapTransaction(tx, hash, startBlock) {
        if (hash != null && hexDataLength(hash) !== 32) {
          throw new Error("invalid response - sendTransaction");
        }
        const result = tx;
        if (hash != null && tx.hash !== hash) {
          logger4.throwError("Transaction hash mismatch from Provider.sendTransaction.", Logger.errors.UNKNOWN_ERROR, { expectedHash: tx.hash, returnedHash: hash });
        }
        result.wait = (confirms, timeout) => __awaiter3(this, void 0, void 0, function* () {
          if (confirms == null) {
            confirms = 1;
          }
          if (timeout == null) {
            timeout = 0;
          }
          let replacement = void 0;
          if (confirms !== 0 && startBlock != null) {
            replacement = {
              data: tx.data,
              from: tx.from,
              nonce: tx.nonce,
              to: tx.to,
              value: tx.value,
              startBlock
            };
          }
          const receipt = yield this._waitForTransaction(tx.hash, confirms, timeout, replacement);
          if (receipt == null && confirms === 0) {
            return null;
          }
          this._emitted["t:" + tx.hash] = receipt.blockNumber;
          if (receipt.status === 0) {
            logger4.throwError("transaction failed", Logger.errors.CALL_EXCEPTION, {
              transactionHash: tx.hash,
              transaction: tx,
              receipt
            });
          }
          return receipt;
        });
        return result;
      }
      sendTransaction(signedTransaction) {
        return __awaiter3(this, void 0, void 0, function* () {
          yield this.getNetwork();
          const hexTx = yield Promise.resolve(signedTransaction).then((t) => hexlify(t));
          const tx = this.formatter.transaction(signedTransaction);
          if (tx.confirmations == null) {
            tx.confirmations = 0;
          }
          const blockNumber = yield this._getInternalBlockNumber(100 + 2 * this.pollingInterval);
          try {
            const hash = yield this.perform("sendTransaction", { signedTransaction: hexTx });
            return this._wrapTransaction(tx, hash, blockNumber);
          } catch (error) {
            error.transaction = tx;
            error.transactionHash = tx.hash;
            throw error;
          }
        });
      }
      _getTransactionRequest(transaction) {
        return __awaiter3(this, void 0, void 0, function* () {
          const values = yield transaction;
          const tx = {};
          ["from", "to"].forEach((key) => {
            if (values[key] == null) {
              return;
            }
            tx[key] = Promise.resolve(values[key]).then((v) => v ? this._getAddress(v) : null);
          });
          ["gasLimit", "gasPrice", "maxFeePerGas", "maxPriorityFeePerGas", "value"].forEach((key) => {
            if (values[key] == null) {
              return;
            }
            tx[key] = Promise.resolve(values[key]).then((v) => v ? BigNumber.from(v) : null);
          });
          ["type"].forEach((key) => {
            if (values[key] == null) {
              return;
            }
            tx[key] = Promise.resolve(values[key]).then((v) => v != null ? v : null);
          });
          if (values.accessList) {
            tx.accessList = this.formatter.accessList(values.accessList);
          }
          ["data"].forEach((key) => {
            if (values[key] == null) {
              return;
            }
            tx[key] = Promise.resolve(values[key]).then((v) => v ? hexlify(v) : null);
          });
          return this.formatter.transactionRequest(yield resolveProperties(tx));
        });
      }
      _getFilter(filter) {
        return __awaiter3(this, void 0, void 0, function* () {
          filter = yield filter;
          const result = {};
          if (filter.address != null) {
            result.address = this._getAddress(filter.address);
          }
          ["blockHash", "topics"].forEach((key) => {
            if (filter[key] == null) {
              return;
            }
            result[key] = filter[key];
          });
          ["fromBlock", "toBlock"].forEach((key) => {
            if (filter[key] == null) {
              return;
            }
            result[key] = this._getBlockTag(filter[key]);
          });
          return this.formatter.filter(yield resolveProperties(result));
        });
      }
      _call(transaction, blockTag, attempt) {
        return __awaiter3(this, void 0, void 0, function* () {
          if (attempt >= MAX_CCIP_REDIRECTS) {
            logger4.throwError("CCIP read exceeded maximum redirections", Logger.errors.SERVER_ERROR, {
              redirects: attempt,
              transaction
            });
          }
          const txSender = transaction.to;
          const result = yield this.perform("call", { transaction, blockTag });
          if (attempt >= 0 && blockTag === "latest" && txSender != null && result.substring(0, 10) === "0x556f1830" && hexDataLength(result) % 32 === 4) {
            try {
              const data = hexDataSlice(result, 4);
              const sender = hexDataSlice(data, 0, 32);
              if (!BigNumber.from(sender).eq(txSender)) {
                logger4.throwError("CCIP Read sender did not match", Logger.errors.CALL_EXCEPTION, {
                  name: "OffchainLookup",
                  signature: "OffchainLookup(address,string[],bytes,bytes4,bytes)",
                  transaction,
                  data: result
                });
              }
              const urls = [];
              const urlsOffset = BigNumber.from(hexDataSlice(data, 32, 64)).toNumber();
              const urlsLength = BigNumber.from(hexDataSlice(data, urlsOffset, urlsOffset + 32)).toNumber();
              const urlsData = hexDataSlice(data, urlsOffset + 32);
              for (let u = 0; u < urlsLength; u++) {
                const url = _parseString(urlsData, u * 32);
                if (url == null) {
                  logger4.throwError("CCIP Read contained corrupt URL string", Logger.errors.CALL_EXCEPTION, {
                    name: "OffchainLookup",
                    signature: "OffchainLookup(address,string[],bytes,bytes4,bytes)",
                    transaction,
                    data: result
                  });
                }
                urls.push(url);
              }
              const calldata = _parseBytes(data, 64);
              if (!BigNumber.from(hexDataSlice(data, 100, 128)).isZero()) {
                logger4.throwError("CCIP Read callback selector included junk", Logger.errors.CALL_EXCEPTION, {
                  name: "OffchainLookup",
                  signature: "OffchainLookup(address,string[],bytes,bytes4,bytes)",
                  transaction,
                  data: result
                });
              }
              const callbackSelector = hexDataSlice(data, 96, 100);
              const extraData = _parseBytes(data, 128);
              const ccipResult = yield this.ccipReadFetch(transaction, calldata, urls);
              if (ccipResult == null) {
                logger4.throwError("CCIP Read disabled or provided no URLs", Logger.errors.CALL_EXCEPTION, {
                  name: "OffchainLookup",
                  signature: "OffchainLookup(address,string[],bytes,bytes4,bytes)",
                  transaction,
                  data: result
                });
              }
              const tx = {
                to: txSender,
                data: hexConcat([callbackSelector, encodeBytes([ccipResult, extraData])])
              };
              return this._call(tx, blockTag, attempt + 1);
            } catch (error) {
              if (error.code === Logger.errors.SERVER_ERROR) {
                throw error;
              }
            }
          }
          try {
            return hexlify(result);
          } catch (error) {
            return logger4.throwError("bad result from backend", Logger.errors.SERVER_ERROR, {
              method: "call",
              params: { transaction, blockTag },
              result,
              error
            });
          }
        });
      }
      call(transaction, blockTag) {
        return __awaiter3(this, void 0, void 0, function* () {
          yield this.getNetwork();
          const resolved = yield resolveProperties({
            transaction: this._getTransactionRequest(transaction),
            blockTag: this._getBlockTag(blockTag),
            ccipReadEnabled: Promise.resolve(transaction.ccipReadEnabled)
          });
          return this._call(resolved.transaction, resolved.blockTag, resolved.ccipReadEnabled ? 0 : -1);
        });
      }
      estimateGas(transaction) {
        return __awaiter3(this, void 0, void 0, function* () {
          yield this.getNetwork();
          const params = yield resolveProperties({
            transaction: this._getTransactionRequest(transaction)
          });
          const result = yield this.perform("estimateGas", params);
          try {
            return BigNumber.from(result);
          } catch (error) {
            return logger4.throwError("bad result from backend", Logger.errors.SERVER_ERROR, {
              method: "estimateGas",
              params,
              result,
              error
            });
          }
        });
      }
      _getAddress(addressOrName) {
        return __awaiter3(this, void 0, void 0, function* () {
          addressOrName = yield addressOrName;
          if (typeof addressOrName !== "string") {
            logger4.throwArgumentError("invalid address or ENS name", "name", addressOrName);
          }
          const address = yield this.resolveName(addressOrName);
          if (address == null) {
            logger4.throwError("ENS name not configured", Logger.errors.UNSUPPORTED_OPERATION, {
              operation: `resolveName(${JSON.stringify(addressOrName)})`
            });
          }
          return address;
        });
      }
      _getBlock(blockHashOrBlockTag, includeTransactions) {
        return __awaiter3(this, void 0, void 0, function* () {
          yield this.getNetwork();
          blockHashOrBlockTag = yield blockHashOrBlockTag;
          let blockNumber = -128;
          const params = {
            includeTransactions: !!includeTransactions
          };
          if (isHexString(blockHashOrBlockTag, 32)) {
            params.blockHash = blockHashOrBlockTag;
          } else {
            try {
              params.blockTag = yield this._getBlockTag(blockHashOrBlockTag);
              if (isHexString(params.blockTag)) {
                blockNumber = parseInt(params.blockTag.substring(2), 16);
              }
            } catch (error) {
              logger4.throwArgumentError("invalid block hash or block tag", "blockHashOrBlockTag", blockHashOrBlockTag);
            }
          }
          return poll(() => __awaiter3(this, void 0, void 0, function* () {
            const block = yield this.perform("getBlock", params);
            if (block == null) {
              if (params.blockHash != null) {
                if (this._emitted["b:" + params.blockHash] == null) {
                  return null;
                }
              }
              if (params.blockTag != null) {
                if (blockNumber > this._emitted.block) {
                  return null;
                }
              }
              return void 0;
            }
            if (includeTransactions) {
              let blockNumber2 = null;
              for (let i = 0; i < block.transactions.length; i++) {
                const tx = block.transactions[i];
                if (tx.blockNumber == null) {
                  tx.confirmations = 0;
                } else if (tx.confirmations == null) {
                  if (blockNumber2 == null) {
                    blockNumber2 = yield this._getInternalBlockNumber(100 + 2 * this.pollingInterval);
                  }
                  let confirmations = blockNumber2 - tx.blockNumber + 1;
                  if (confirmations <= 0) {
                    confirmations = 1;
                  }
                  tx.confirmations = confirmations;
                }
              }
              const blockWithTxs = this.formatter.blockWithTransactions(block);
              blockWithTxs.transactions = blockWithTxs.transactions.map((tx) => this._wrapTransaction(tx));
              return blockWithTxs;
            }
            return this.formatter.block(block);
          }), { oncePoll: this });
        });
      }
      getBlock(blockHashOrBlockTag) {
        return this._getBlock(blockHashOrBlockTag, false);
      }
      getBlockWithTransactions(blockHashOrBlockTag) {
        return this._getBlock(blockHashOrBlockTag, true);
      }
      getTransaction(transactionHash) {
        return __awaiter3(this, void 0, void 0, function* () {
          yield this.getNetwork();
          transactionHash = yield transactionHash;
          const params = { transactionHash: this.formatter.hash(transactionHash, true) };
          return poll(() => __awaiter3(this, void 0, void 0, function* () {
            const result = yield this.perform("getTransaction", params);
            if (result == null) {
              if (this._emitted["t:" + transactionHash] == null) {
                return null;
              }
              return void 0;
            }
            const tx = this.formatter.transactionResponse(result);
            if (tx.blockNumber == null) {
              tx.confirmations = 0;
            } else if (tx.confirmations == null) {
              const blockNumber = yield this._getInternalBlockNumber(100 + 2 * this.pollingInterval);
              let confirmations = blockNumber - tx.blockNumber + 1;
              if (confirmations <= 0) {
                confirmations = 1;
              }
              tx.confirmations = confirmations;
            }
            return this._wrapTransaction(tx);
          }), { oncePoll: this });
        });
      }
      getTransactionReceipt(transactionHash) {
        return __awaiter3(this, void 0, void 0, function* () {
          yield this.getNetwork();
          transactionHash = yield transactionHash;
          const params = { transactionHash: this.formatter.hash(transactionHash, true) };
          return poll(() => __awaiter3(this, void 0, void 0, function* () {
            const result = yield this.perform("getTransactionReceipt", params);
            if (result == null) {
              if (this._emitted["t:" + transactionHash] == null) {
                return null;
              }
              return void 0;
            }
            if (result.blockHash == null) {
              return void 0;
            }
            const receipt = this.formatter.receipt(result);
            if (receipt.blockNumber == null) {
              receipt.confirmations = 0;
            } else if (receipt.confirmations == null) {
              const blockNumber = yield this._getInternalBlockNumber(100 + 2 * this.pollingInterval);
              let confirmations = blockNumber - receipt.blockNumber + 1;
              if (confirmations <= 0) {
                confirmations = 1;
              }
              receipt.confirmations = confirmations;
            }
            return receipt;
          }), { oncePoll: this });
        });
      }
      getLogs(filter) {
        return __awaiter3(this, void 0, void 0, function* () {
          yield this.getNetwork();
          const params = yield resolveProperties({ filter: this._getFilter(filter) });
          const logs = yield this.perform("getLogs", params);
          logs.forEach((log) => {
            if (log.removed == null) {
              log.removed = false;
            }
          });
          return Formatter.arrayOf(this.formatter.filterLog.bind(this.formatter))(logs);
        });
      }
      getEtherPrice() {
        return __awaiter3(this, void 0, void 0, function* () {
          yield this.getNetwork();
          return this.perform("getEtherPrice", {});
        });
      }
      _getBlockTag(blockTag) {
        return __awaiter3(this, void 0, void 0, function* () {
          blockTag = yield blockTag;
          if (typeof blockTag === "number" && blockTag < 0) {
            if (blockTag % 1) {
              logger4.throwArgumentError("invalid BlockTag", "blockTag", blockTag);
            }
            let blockNumber = yield this._getInternalBlockNumber(100 + 2 * this.pollingInterval);
            blockNumber += blockTag;
            if (blockNumber < 0) {
              blockNumber = 0;
            }
            return this.formatter.blockTag(blockNumber);
          }
          return this.formatter.blockTag(blockTag);
        });
      }
      getResolver(name) {
        return __awaiter3(this, void 0, void 0, function* () {
          let currentName = name;
          while (true) {
            if (currentName === "" || currentName === ".") {
              return null;
            }
            if (name !== "eth" && currentName === "eth") {
              return null;
            }
            const addr = yield this._getResolver(currentName, "getResolver");
            if (addr != null) {
              const resolver = new Resolver(this, addr, name);
              if (currentName !== name && !(yield resolver.supportsWildcard())) {
                return null;
              }
              return resolver;
            }
            currentName = currentName.split(".").slice(1).join(".");
          }
        });
      }
      _getResolver(name, operation) {
        return __awaiter3(this, void 0, void 0, function* () {
          if (operation == null) {
            operation = "ENS";
          }
          const network = yield this.getNetwork();
          if (!network.ensAddress) {
            logger4.throwError("network does not support ENS", Logger.errors.UNSUPPORTED_OPERATION, { operation, network: network.name });
          }
          try {
            const addrData = yield this.call({
              to: network.ensAddress,
              data: "0x0178b8bf" + namehash(name).substring(2)
            });
            return this.formatter.callAddress(addrData);
          } catch (error) {
          }
          return null;
        });
      }
      resolveName(name) {
        return __awaiter3(this, void 0, void 0, function* () {
          name = yield name;
          try {
            return Promise.resolve(this.formatter.address(name));
          } catch (error) {
            if (isHexString(name)) {
              throw error;
            }
          }
          if (typeof name !== "string") {
            logger4.throwArgumentError("invalid ENS name", "name", name);
          }
          const resolver = yield this.getResolver(name);
          if (!resolver) {
            return null;
          }
          return yield resolver.getAddress();
        });
      }
      lookupAddress(address) {
        return __awaiter3(this, void 0, void 0, function* () {
          address = yield address;
          address = this.formatter.address(address);
          const node = address.substring(2).toLowerCase() + ".addr.reverse";
          const resolverAddr = yield this._getResolver(node, "lookupAddress");
          if (resolverAddr == null) {
            return null;
          }
          const name = _parseString(yield this.call({
            to: resolverAddr,
            data: "0x691f3431" + namehash(node).substring(2)
          }), 0);
          const addr = yield this.resolveName(name);
          if (addr != address) {
            return null;
          }
          return name;
        });
      }
      getAvatar(nameOrAddress) {
        return __awaiter3(this, void 0, void 0, function* () {
          let resolver = null;
          if (isHexString(nameOrAddress)) {
            const address = this.formatter.address(nameOrAddress);
            const node = address.substring(2).toLowerCase() + ".addr.reverse";
            const resolverAddress = yield this._getResolver(node, "getAvatar");
            if (!resolverAddress) {
              return null;
            }
            resolver = new Resolver(this, resolverAddress, node);
            try {
              const avatar2 = yield resolver.getAvatar();
              if (avatar2) {
                return avatar2.url;
              }
            } catch (error) {
              if (error.code !== Logger.errors.CALL_EXCEPTION) {
                throw error;
              }
            }
            try {
              const name = _parseString(yield this.call({
                to: resolverAddress,
                data: "0x691f3431" + namehash(node).substring(2)
              }), 0);
              resolver = yield this.getResolver(name);
            } catch (error) {
              if (error.code !== Logger.errors.CALL_EXCEPTION) {
                throw error;
              }
              return null;
            }
          } else {
            resolver = yield this.getResolver(nameOrAddress);
            if (!resolver) {
              return null;
            }
          }
          const avatar = yield resolver.getAvatar();
          if (avatar == null) {
            return null;
          }
          return avatar.url;
        });
      }
      perform(method, params) {
        return logger4.throwError(method + " not implemented", Logger.errors.NOT_IMPLEMENTED, { operation: method });
      }
      _startEvent(event) {
        this.polling = this._events.filter((e) => e.pollable()).length > 0;
      }
      _stopEvent(event) {
        this.polling = this._events.filter((e) => e.pollable()).length > 0;
      }
      _addEventListener(eventName, listener, once) {
        const event = new Event(getEventTag(eventName), listener, once);
        this._events.push(event);
        this._startEvent(event);
        return this;
      }
      on(eventName, listener) {
        return this._addEventListener(eventName, listener, false);
      }
      once(eventName, listener) {
        return this._addEventListener(eventName, listener, true);
      }
      emit(eventName, ...args) {
        let result = false;
        let stopped = [];
        let eventTag = getEventTag(eventName);
        this._events = this._events.filter((event) => {
          if (event.tag !== eventTag) {
            return true;
          }
          setTimeout(() => {
            event.listener.apply(this, args);
          }, 0);
          result = true;
          if (event.once) {
            stopped.push(event);
            return false;
          }
          return true;
        });
        stopped.forEach((event) => {
          this._stopEvent(event);
        });
        return result;
      }
      listenerCount(eventName) {
        if (!eventName) {
          return this._events.length;
        }
        let eventTag = getEventTag(eventName);
        return this._events.filter((event) => {
          return event.tag === eventTag;
        }).length;
      }
      listeners(eventName) {
        if (eventName == null) {
          return this._events.map((event) => event.listener);
        }
        let eventTag = getEventTag(eventName);
        return this._events.filter((event) => event.tag === eventTag).map((event) => event.listener);
      }
      off(eventName, listener) {
        if (listener == null) {
          return this.removeAllListeners(eventName);
        }
        const stopped = [];
        let found = false;
        let eventTag = getEventTag(eventName);
        this._events = this._events.filter((event) => {
          if (event.tag !== eventTag || event.listener != listener) {
            return true;
          }
          if (found) {
            return true;
          }
          found = true;
          stopped.push(event);
          return false;
        });
        stopped.forEach((event) => {
          this._stopEvent(event);
        });
        return this;
      }
      removeAllListeners(eventName) {
        let stopped = [];
        if (eventName == null) {
          stopped = this._events;
          this._events = [];
        } else {
          const eventTag = getEventTag(eventName);
          this._events = this._events.filter((event) => {
            if (event.tag !== eventTag) {
              return true;
            }
            stopped.push(event);
            return false;
          });
        }
        stopped.forEach((event) => {
          this._stopEvent(event);
        });
        return this;
      }
    };
  }
});

// node_modules/@ethersproject/providers/lib.esm/json-rpc-provider.js
function spelunk(value, requireData) {
  if (value == null) {
    return null;
  }
  if (typeof value.message === "string" && value.message.match("reverted")) {
    const data = isHexString(value.data) ? value.data : null;
    if (!requireData || data) {
      return { message: value.message, data };
    }
  }
  if (typeof value === "object") {
    for (const key in value) {
      const result = spelunk(value[key], requireData);
      if (result) {
        return result;
      }
    }
    return null;
  }
  if (typeof value === "string") {
    try {
      return spelunk(JSON.parse(value), requireData);
    } catch (error) {
    }
  }
  return null;
}
function checkError(method, error, params) {
  const transaction = params.transaction || params.signedTransaction;
  if (method === "call") {
    const result = spelunk(error, true);
    if (result) {
      return result.data;
    }
    logger5.throwError("missing revert data in call exception; Transaction reverted without a reason string", Logger.errors.CALL_EXCEPTION, {
      data: "0x",
      transaction,
      error
    });
  }
  if (method === "estimateGas") {
    let result = spelunk(error.body, false);
    if (result == null) {
      result = spelunk(error, false);
    }
    if (result) {
      logger5.throwError("cannot estimate gas; transaction may fail or may require manual gas limit", Logger.errors.UNPREDICTABLE_GAS_LIMIT, {
        reason: result.message,
        method,
        transaction,
        error
      });
    }
  }
  let message = error.message;
  if (error.code === Logger.errors.SERVER_ERROR && error.error && typeof error.error.message === "string") {
    message = error.error.message;
  } else if (typeof error.body === "string") {
    message = error.body;
  } else if (typeof error.responseText === "string") {
    message = error.responseText;
  }
  message = (message || "").toLowerCase();
  if (message.match(/insufficient funds|base fee exceeds gas limit|InsufficientFunds/i)) {
    logger5.throwError("insufficient funds for intrinsic transaction cost", Logger.errors.INSUFFICIENT_FUNDS, {
      error,
      method,
      transaction
    });
  }
  if (message.match(/nonce (is )?too low/i)) {
    logger5.throwError("nonce has already been used", Logger.errors.NONCE_EXPIRED, {
      error,
      method,
      transaction
    });
  }
  if (message.match(/replacement transaction underpriced|transaction gas price.*too low/i)) {
    logger5.throwError("replacement fee too low", Logger.errors.REPLACEMENT_UNDERPRICED, {
      error,
      method,
      transaction
    });
  }
  if (message.match(/only replay-protected/i)) {
    logger5.throwError("legacy pre-eip-155 transactions not supported", Logger.errors.UNSUPPORTED_OPERATION, {
      error,
      method,
      transaction
    });
  }
  if (errorGas.indexOf(method) >= 0 && message.match(/gas required exceeds allowance|always failing transaction|execution reverted|revert/)) {
    logger5.throwError("cannot estimate gas; transaction may fail or may require manual gas limit", Logger.errors.UNPREDICTABLE_GAS_LIMIT, {
      error,
      method,
      transaction
    });
  }
  throw error;
}
function timer(timeout) {
  return new Promise(function(resolve) {
    setTimeout(resolve, timeout);
  });
}
function getResult(payload) {
  if (payload.error) {
    const error = new Error(payload.error.message);
    error.code = payload.error.code;
    error.data = payload.error.data;
    throw error;
  }
  return payload.result;
}
function getLowerCase(value) {
  if (value) {
    return value.toLowerCase();
  }
  return value;
}
var __awaiter4, logger5, errorGas, _constructorGuard, JsonRpcSigner, UncheckedJsonRpcSigner, allowedTransactionKeys, JsonRpcProvider;
var init_json_rpc_provider = __esm({
  "node_modules/@ethersproject/providers/lib.esm/json-rpc-provider.js"() {
    "use strict";
    init_lib14();
    init_lib3();
    init_lib2();
    init_lib11();
    init_lib5();
    init_lib10();
    init_lib13();
    init_lib17();
    init_lib();
    init_version3();
    init_base_provider();
    __awaiter4 = function(thisArg, _arguments, P, generator) {
      function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
          resolve(value);
        });
      }
      return new (P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) {
          try {
            step(generator.next(value));
          } catch (e) {
            reject(e);
          }
        }
        function rejected(value) {
          try {
            step(generator["throw"](value));
          } catch (e) {
            reject(e);
          }
        }
        function step(result) {
          result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    };
    logger5 = new Logger(version3);
    errorGas = ["call", "estimateGas"];
    _constructorGuard = {};
    JsonRpcSigner = class extends Signer {
      constructor(constructorGuard, provider, addressOrIndex) {
        super();
        if (constructorGuard !== _constructorGuard) {
          throw new Error("do not call the JsonRpcSigner constructor directly; use provider.getSigner");
        }
        defineReadOnly(this, "provider", provider);
        if (addressOrIndex == null) {
          addressOrIndex = 0;
        }
        if (typeof addressOrIndex === "string") {
          defineReadOnly(this, "_address", this.provider.formatter.address(addressOrIndex));
          defineReadOnly(this, "_index", null);
        } else if (typeof addressOrIndex === "number") {
          defineReadOnly(this, "_index", addressOrIndex);
          defineReadOnly(this, "_address", null);
        } else {
          logger5.throwArgumentError("invalid address or index", "addressOrIndex", addressOrIndex);
        }
      }
      connect(provider) {
        return logger5.throwError("cannot alter JSON-RPC Signer connection", Logger.errors.UNSUPPORTED_OPERATION, {
          operation: "connect"
        });
      }
      connectUnchecked() {
        return new UncheckedJsonRpcSigner(_constructorGuard, this.provider, this._address || this._index);
      }
      getAddress() {
        if (this._address) {
          return Promise.resolve(this._address);
        }
        return this.provider.send("eth_accounts", []).then((accounts) => {
          if (accounts.length <= this._index) {
            logger5.throwError("unknown account #" + this._index, Logger.errors.UNSUPPORTED_OPERATION, {
              operation: "getAddress"
            });
          }
          return this.provider.formatter.address(accounts[this._index]);
        });
      }
      sendUncheckedTransaction(transaction) {
        transaction = shallowCopy(transaction);
        const fromAddress = this.getAddress().then((address) => {
          if (address) {
            address = address.toLowerCase();
          }
          return address;
        });
        if (transaction.gasLimit == null) {
          const estimate = shallowCopy(transaction);
          estimate.from = fromAddress;
          transaction.gasLimit = this.provider.estimateGas(estimate);
        }
        if (transaction.to != null) {
          transaction.to = Promise.resolve(transaction.to).then((to) => __awaiter4(this, void 0, void 0, function* () {
            if (to == null) {
              return null;
            }
            const address = yield this.provider.resolveName(to);
            if (address == null) {
              logger5.throwArgumentError("provided ENS name resolves to null", "tx.to", to);
            }
            return address;
          }));
        }
        return resolveProperties({
          tx: resolveProperties(transaction),
          sender: fromAddress
        }).then(({ tx, sender }) => {
          if (tx.from != null) {
            if (tx.from.toLowerCase() !== sender) {
              logger5.throwArgumentError("from address mismatch", "transaction", transaction);
            }
          } else {
            tx.from = sender;
          }
          const hexTx = this.provider.constructor.hexlifyTransaction(tx, { from: true });
          return this.provider.send("eth_sendTransaction", [hexTx]).then((hash) => {
            return hash;
          }, (error) => {
            if (typeof error.message === "string" && error.message.match(/user denied/i)) {
              logger5.throwError("user rejected transaction", Logger.errors.ACTION_REJECTED, {
                action: "sendTransaction",
                transaction: tx
              });
            }
            return checkError("sendTransaction", error, hexTx);
          });
        });
      }
      signTransaction(transaction) {
        return logger5.throwError("signing transactions is unsupported", Logger.errors.UNSUPPORTED_OPERATION, {
          operation: "signTransaction"
        });
      }
      sendTransaction(transaction) {
        return __awaiter4(this, void 0, void 0, function* () {
          const blockNumber = yield this.provider._getInternalBlockNumber(100 + 2 * this.provider.pollingInterval);
          const hash = yield this.sendUncheckedTransaction(transaction);
          try {
            return yield poll(() => __awaiter4(this, void 0, void 0, function* () {
              const tx = yield this.provider.getTransaction(hash);
              if (tx === null) {
                return void 0;
              }
              return this.provider._wrapTransaction(tx, hash, blockNumber);
            }), { oncePoll: this.provider });
          } catch (error) {
            error.transactionHash = hash;
            throw error;
          }
        });
      }
      signMessage(message) {
        return __awaiter4(this, void 0, void 0, function* () {
          const data = typeof message === "string" ? toUtf8Bytes(message) : message;
          const address = yield this.getAddress();
          try {
            return yield this.provider.send("personal_sign", [hexlify(data), address.toLowerCase()]);
          } catch (error) {
            if (typeof error.message === "string" && error.message.match(/user denied/i)) {
              logger5.throwError("user rejected signing", Logger.errors.ACTION_REJECTED, {
                action: "signMessage",
                from: address,
                messageData: message
              });
            }
            throw error;
          }
        });
      }
      _legacySignMessage(message) {
        return __awaiter4(this, void 0, void 0, function* () {
          const data = typeof message === "string" ? toUtf8Bytes(message) : message;
          const address = yield this.getAddress();
          try {
            return yield this.provider.send("eth_sign", [address.toLowerCase(), hexlify(data)]);
          } catch (error) {
            if (typeof error.message === "string" && error.message.match(/user denied/i)) {
              logger5.throwError("user rejected signing", Logger.errors.ACTION_REJECTED, {
                action: "_legacySignMessage",
                from: address,
                messageData: message
              });
            }
            throw error;
          }
        });
      }
      _signTypedData(domain, types, value) {
        return __awaiter4(this, void 0, void 0, function* () {
          const populated = yield TypedDataEncoder.resolveNames(domain, types, value, (name) => {
            return this.provider.resolveName(name);
          });
          const address = yield this.getAddress();
          try {
            return yield this.provider.send("eth_signTypedData_v4", [
              address.toLowerCase(),
              JSON.stringify(TypedDataEncoder.getPayload(populated.domain, types, populated.value))
            ]);
          } catch (error) {
            if (typeof error.message === "string" && error.message.match(/user denied/i)) {
              logger5.throwError("user rejected signing", Logger.errors.ACTION_REJECTED, {
                action: "_signTypedData",
                from: address,
                messageData: { domain: populated.domain, types, value: populated.value }
              });
            }
            throw error;
          }
        });
      }
      unlock(password) {
        return __awaiter4(this, void 0, void 0, function* () {
          const provider = this.provider;
          const address = yield this.getAddress();
          return provider.send("personal_unlockAccount", [address.toLowerCase(), password, null]);
        });
      }
    };
    UncheckedJsonRpcSigner = class extends JsonRpcSigner {
      sendTransaction(transaction) {
        return this.sendUncheckedTransaction(transaction).then((hash) => {
          return {
            hash,
            nonce: null,
            gasLimit: null,
            gasPrice: null,
            data: null,
            value: null,
            chainId: null,
            confirmations: 0,
            from: null,
            wait: (confirmations) => {
              return this.provider.waitForTransaction(hash, confirmations);
            }
          };
        });
      }
    };
    allowedTransactionKeys = {
      chainId: true,
      data: true,
      gasLimit: true,
      gasPrice: true,
      nonce: true,
      to: true,
      value: true,
      type: true,
      accessList: true,
      maxFeePerGas: true,
      maxPriorityFeePerGas: true
    };
    JsonRpcProvider = class extends BaseProvider {
      constructor(url, network) {
        let networkOrReady = network;
        if (networkOrReady == null) {
          networkOrReady = new Promise((resolve, reject) => {
            setTimeout(() => {
              this.detectNetwork().then((network2) => {
                resolve(network2);
              }, (error) => {
                reject(error);
              });
            }, 0);
          });
        }
        super(networkOrReady);
        if (!url) {
          url = getStatic(this.constructor, "defaultUrl")();
        }
        if (typeof url === "string") {
          defineReadOnly(this, "connection", Object.freeze({
            url
          }));
        } else {
          defineReadOnly(this, "connection", Object.freeze(shallowCopy(url)));
        }
        this._nextId = 42;
      }
      get _cache() {
        if (this._eventLoopCache == null) {
          this._eventLoopCache = {};
        }
        return this._eventLoopCache;
      }
      static defaultUrl() {
        return "http://localhost:8545";
      }
      detectNetwork() {
        if (!this._cache["detectNetwork"]) {
          this._cache["detectNetwork"] = this._uncachedDetectNetwork();
          setTimeout(() => {
            this._cache["detectNetwork"] = null;
          }, 0);
        }
        return this._cache["detectNetwork"];
      }
      _uncachedDetectNetwork() {
        return __awaiter4(this, void 0, void 0, function* () {
          yield timer(0);
          let chainId = null;
          try {
            chainId = yield this.send("eth_chainId", []);
          } catch (error) {
            try {
              chainId = yield this.send("net_version", []);
            } catch (error2) {
            }
          }
          if (chainId != null) {
            const getNetwork2 = getStatic(this.constructor, "getNetwork");
            try {
              return getNetwork2(BigNumber.from(chainId).toNumber());
            } catch (error) {
              return logger5.throwError("could not detect network", Logger.errors.NETWORK_ERROR, {
                chainId,
                event: "invalidNetwork",
                serverError: error
              });
            }
          }
          return logger5.throwError("could not detect network", Logger.errors.NETWORK_ERROR, {
            event: "noNetwork"
          });
        });
      }
      getSigner(addressOrIndex) {
        return new JsonRpcSigner(_constructorGuard, this, addressOrIndex);
      }
      getUncheckedSigner(addressOrIndex) {
        return this.getSigner(addressOrIndex).connectUnchecked();
      }
      listAccounts() {
        return this.send("eth_accounts", []).then((accounts) => {
          return accounts.map((a) => this.formatter.address(a));
        });
      }
      send(method, params) {
        const request = {
          method,
          params,
          id: this._nextId++,
          jsonrpc: "2.0"
        };
        this.emit("debug", {
          action: "request",
          request: deepCopy(request),
          provider: this
        });
        const cache = ["eth_chainId", "eth_blockNumber"].indexOf(method) >= 0;
        if (cache && this._cache[method]) {
          return this._cache[method];
        }
        const result = fetchJson(this.connection, JSON.stringify(request), getResult).then((result2) => {
          this.emit("debug", {
            action: "response",
            request,
            response: result2,
            provider: this
          });
          return result2;
        }, (error) => {
          this.emit("debug", {
            action: "response",
            error,
            request,
            provider: this
          });
          throw error;
        });
        if (cache) {
          this._cache[method] = result;
          setTimeout(() => {
            this._cache[method] = null;
          }, 0);
        }
        return result;
      }
      prepareRequest(method, params) {
        switch (method) {
          case "getBlockNumber":
            return ["eth_blockNumber", []];
          case "getGasPrice":
            return ["eth_gasPrice", []];
          case "getBalance":
            return ["eth_getBalance", [getLowerCase(params.address), params.blockTag]];
          case "getTransactionCount":
            return ["eth_getTransactionCount", [getLowerCase(params.address), params.blockTag]];
          case "getCode":
            return ["eth_getCode", [getLowerCase(params.address), params.blockTag]];
          case "getStorageAt":
            return ["eth_getStorageAt", [getLowerCase(params.address), hexZeroPad(params.position, 32), params.blockTag]];
          case "sendTransaction":
            return ["eth_sendRawTransaction", [params.signedTransaction]];
          case "getBlock":
            if (params.blockTag) {
              return ["eth_getBlockByNumber", [params.blockTag, !!params.includeTransactions]];
            } else if (params.blockHash) {
              return ["eth_getBlockByHash", [params.blockHash, !!params.includeTransactions]];
            }
            return null;
          case "getTransaction":
            return ["eth_getTransactionByHash", [params.transactionHash]];
          case "getTransactionReceipt":
            return ["eth_getTransactionReceipt", [params.transactionHash]];
          case "call": {
            const hexlifyTransaction = getStatic(this.constructor, "hexlifyTransaction");
            return ["eth_call", [hexlifyTransaction(params.transaction, { from: true }), params.blockTag]];
          }
          case "estimateGas": {
            const hexlifyTransaction = getStatic(this.constructor, "hexlifyTransaction");
            return ["eth_estimateGas", [hexlifyTransaction(params.transaction, { from: true })]];
          }
          case "getLogs":
            if (params.filter && params.filter.address != null) {
              params.filter.address = getLowerCase(params.filter.address);
            }
            return ["eth_getLogs", [params.filter]];
          default:
            break;
        }
        return null;
      }
      perform(method, params) {
        return __awaiter4(this, void 0, void 0, function* () {
          if (method === "call" || method === "estimateGas") {
            const tx = params.transaction;
            if (tx && tx.type != null && BigNumber.from(tx.type).isZero()) {
              if (tx.maxFeePerGas == null && tx.maxPriorityFeePerGas == null) {
                const feeData = yield this.getFeeData();
                if (feeData.maxFeePerGas == null && feeData.maxPriorityFeePerGas == null) {
                  params = shallowCopy(params);
                  params.transaction = shallowCopy(tx);
                  delete params.transaction.type;
                }
              }
            }
          }
          const args = this.prepareRequest(method, params);
          if (args == null) {
            logger5.throwError(method + " not implemented", Logger.errors.NOT_IMPLEMENTED, { operation: method });
          }
          try {
            return yield this.send(args[0], args[1]);
          } catch (error) {
            return checkError(method, error, params);
          }
        });
      }
      _startEvent(event) {
        if (event.tag === "pending") {
          this._startPending();
        }
        super._startEvent(event);
      }
      _startPending() {
        if (this._pendingFilter != null) {
          return;
        }
        const self = this;
        const pendingFilter = this.send("eth_newPendingTransactionFilter", []);
        this._pendingFilter = pendingFilter;
        pendingFilter.then(function(filterId) {
          function poll2() {
            self.send("eth_getFilterChanges", [filterId]).then(function(hashes) {
              if (self._pendingFilter != pendingFilter) {
                return null;
              }
              let seq = Promise.resolve();
              hashes.forEach(function(hash) {
                self._emitted["t:" + hash.toLowerCase()] = "pending";
                seq = seq.then(function() {
                  return self.getTransaction(hash).then(function(tx) {
                    self.emit("pending", tx);
                    return null;
                  });
                });
              });
              return seq.then(function() {
                return timer(1e3);
              });
            }).then(function() {
              if (self._pendingFilter != pendingFilter) {
                self.send("eth_uninstallFilter", [filterId]);
                return;
              }
              setTimeout(function() {
                poll2();
              }, 0);
              return null;
            }).catch((error) => {
            });
          }
          poll2();
          return filterId;
        }).catch((error) => {
        });
      }
      _stopEvent(event) {
        if (event.tag === "pending" && this.listenerCount("pending") === 0) {
          this._pendingFilter = null;
        }
        super._stopEvent(event);
      }
      // Convert an ethers.js transaction into a JSON-RPC transaction
      //  - gasLimit => gas
      //  - All values hexlified
      //  - All numeric values zero-striped
      //  - All addresses are lowercased
      // NOTE: This allows a TransactionRequest, but all values should be resolved
      //       before this is called
      // @TODO: This will likely be removed in future versions and prepareRequest
      //        will be the preferred method for this.
      static hexlifyTransaction(transaction, allowExtra) {
        const allowed = shallowCopy(allowedTransactionKeys);
        if (allowExtra) {
          for (const key in allowExtra) {
            if (allowExtra[key]) {
              allowed[key] = true;
            }
          }
        }
        checkProperties(transaction, allowed);
        const result = {};
        ["chainId", "gasLimit", "gasPrice", "type", "maxFeePerGas", "maxPriorityFeePerGas", "nonce", "value"].forEach(function(key) {
          if (transaction[key] == null) {
            return;
          }
          const value = hexValue(BigNumber.from(transaction[key]));
          if (key === "gasLimit") {
            key = "gas";
          }
          result[key] = value;
        });
        ["from", "to", "data"].forEach(function(key) {
          if (transaction[key] == null) {
            return;
          }
          result[key] = hexlify(transaction[key]);
        });
        if (transaction.accessList) {
          result["accessList"] = accessListify(transaction.accessList);
        }
        return result;
      }
    };
  }
});

// node_modules/@ethersproject/providers/lib.esm/ws.js
var WS;
var init_ws = __esm({
  "node_modules/@ethersproject/providers/lib.esm/ws.js"() {
    "use strict";
    init_lib();
    init_version3();
    WS = null;
    try {
      WS = WebSocket;
      if (WS == null) {
        throw new Error("inject please");
      }
    } catch (error) {
      const logger19 = new Logger(version3);
      WS = function() {
        logger19.throwError("WebSockets not supported in this environment", Logger.errors.UNSUPPORTED_OPERATION, {
          operation: "new WebSocket()"
        });
      };
    }
  }
});

// node_modules/@ethersproject/providers/lib.esm/websocket-provider.js
var __awaiter5, logger6, NextId, WebSocketProvider;
var init_websocket_provider = __esm({
  "node_modules/@ethersproject/providers/lib.esm/websocket-provider.js"() {
    "use strict";
    init_lib3();
    init_lib5();
    init_json_rpc_provider();
    init_ws();
    init_lib();
    init_version3();
    __awaiter5 = function(thisArg, _arguments, P, generator) {
      function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
          resolve(value);
        });
      }
      return new (P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) {
          try {
            step(generator.next(value));
          } catch (e) {
            reject(e);
          }
        }
        function rejected(value) {
          try {
            step(generator["throw"](value));
          } catch (e) {
            reject(e);
          }
        }
        function step(result) {
          result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    };
    logger6 = new Logger(version3);
    NextId = 1;
    WebSocketProvider = class extends JsonRpcProvider {
      constructor(url, network) {
        if (network === "any") {
          logger6.throwError("WebSocketProvider does not support 'any' network yet", Logger.errors.UNSUPPORTED_OPERATION, {
            operation: "network:any"
          });
        }
        if (typeof url === "string") {
          super(url, network);
        } else {
          super("_websocket", network);
        }
        this._pollingInterval = -1;
        this._wsReady = false;
        if (typeof url === "string") {
          defineReadOnly(this, "_websocket", new WS(this.connection.url));
        } else {
          defineReadOnly(this, "_websocket", url);
        }
        defineReadOnly(this, "_requests", {});
        defineReadOnly(this, "_subs", {});
        defineReadOnly(this, "_subIds", {});
        defineReadOnly(this, "_detectNetwork", super.detectNetwork());
        this.websocket.onopen = () => {
          this._wsReady = true;
          Object.keys(this._requests).forEach((id) => {
            this.websocket.send(this._requests[id].payload);
          });
        };
        this.websocket.onmessage = (messageEvent) => {
          const data = messageEvent.data;
          const result = JSON.parse(data);
          if (result.id != null) {
            const id = String(result.id);
            const request = this._requests[id];
            delete this._requests[id];
            if (result.result !== void 0) {
              request.callback(null, result.result);
              this.emit("debug", {
                action: "response",
                request: JSON.parse(request.payload),
                response: result.result,
                provider: this
              });
            } else {
              let error = null;
              if (result.error) {
                error = new Error(result.error.message || "unknown error");
                defineReadOnly(error, "code", result.error.code || null);
                defineReadOnly(error, "response", data);
              } else {
                error = new Error("unknown error");
              }
              request.callback(error, void 0);
              this.emit("debug", {
                action: "response",
                error,
                request: JSON.parse(request.payload),
                provider: this
              });
            }
          } else if (result.method === "eth_subscription") {
            const sub = this._subs[result.params.subscription];
            if (sub) {
              sub.processFunc(result.params.result);
            }
          } else {
            console.warn("this should not happen");
          }
        };
        const fauxPoll = setInterval(() => {
          this.emit("poll");
        }, 1e3);
        if (fauxPoll.unref) {
          fauxPoll.unref();
        }
      }
      // Cannot narrow the type of _websocket, as that is not backwards compatible
      // so we add a getter and let the WebSocket be a public API.
      get websocket() {
        return this._websocket;
      }
      detectNetwork() {
        return this._detectNetwork;
      }
      get pollingInterval() {
        return 0;
      }
      resetEventsBlock(blockNumber) {
        logger6.throwError("cannot reset events block on WebSocketProvider", Logger.errors.UNSUPPORTED_OPERATION, {
          operation: "resetEventBlock"
        });
      }
      set pollingInterval(value) {
        logger6.throwError("cannot set polling interval on WebSocketProvider", Logger.errors.UNSUPPORTED_OPERATION, {
          operation: "setPollingInterval"
        });
      }
      poll() {
        return __awaiter5(this, void 0, void 0, function* () {
          return null;
        });
      }
      set polling(value) {
        if (!value) {
          return;
        }
        logger6.throwError("cannot set polling on WebSocketProvider", Logger.errors.UNSUPPORTED_OPERATION, {
          operation: "setPolling"
        });
      }
      send(method, params) {
        const rid = NextId++;
        return new Promise((resolve, reject) => {
          function callback(error, result) {
            if (error) {
              return reject(error);
            }
            return resolve(result);
          }
          const payload = JSON.stringify({
            method,
            params,
            id: rid,
            jsonrpc: "2.0"
          });
          this.emit("debug", {
            action: "request",
            request: JSON.parse(payload),
            provider: this
          });
          this._requests[String(rid)] = { callback, payload };
          if (this._wsReady) {
            this.websocket.send(payload);
          }
        });
      }
      static defaultUrl() {
        return "ws://localhost:8546";
      }
      _subscribe(tag, param, processFunc) {
        return __awaiter5(this, void 0, void 0, function* () {
          let subIdPromise = this._subIds[tag];
          if (subIdPromise == null) {
            subIdPromise = Promise.all(param).then((param2) => {
              return this.send("eth_subscribe", param2);
            });
            this._subIds[tag] = subIdPromise;
          }
          const subId = yield subIdPromise;
          this._subs[subId] = { tag, processFunc };
        });
      }
      _startEvent(event) {
        switch (event.type) {
          case "block":
            this._subscribe("block", ["newHeads"], (result) => {
              const blockNumber = BigNumber.from(result.number).toNumber();
              this._emitted.block = blockNumber;
              this.emit("block", blockNumber);
            });
            break;
          case "pending":
            this._subscribe("pending", ["newPendingTransactions"], (result) => {
              this.emit("pending", result);
            });
            break;
          case "filter":
            this._subscribe(event.tag, ["logs", this._getFilter(event.filter)], (result) => {
              if (result.removed == null) {
                result.removed = false;
              }
              this.emit(event.filter, this.formatter.filterLog(result));
            });
            break;
          case "tx": {
            const emitReceipt = (event2) => {
              const hash = event2.hash;
              this.getTransactionReceipt(hash).then((receipt) => {
                if (!receipt) {
                  return;
                }
                this.emit(hash, receipt);
              });
            };
            emitReceipt(event);
            this._subscribe("tx", ["newHeads"], (result) => {
              this._events.filter((e) => e.type === "tx").forEach(emitReceipt);
            });
            break;
          }
          // Nothing is needed
          case "debug":
          case "poll":
          case "willPoll":
          case "didPoll":
          case "error":
            break;
          default:
            console.log("unhandled:", event);
            break;
        }
      }
      _stopEvent(event) {
        let tag = event.tag;
        if (event.type === "tx") {
          if (this._events.filter((e) => e.type === "tx").length) {
            return;
          }
          tag = "tx";
        } else if (this.listenerCount(event.event)) {
          return;
        }
        const subId = this._subIds[tag];
        if (!subId) {
          return;
        }
        delete this._subIds[tag];
        subId.then((subId2) => {
          if (!this._subs[subId2]) {
            return;
          }
          delete this._subs[subId2];
          this.send("eth_unsubscribe", [subId2]);
        });
      }
      destroy() {
        return __awaiter5(this, void 0, void 0, function* () {
          if (this.websocket.readyState === WS.CONNECTING) {
            yield new Promise((resolve) => {
              this.websocket.onopen = function() {
                resolve(true);
              };
              this.websocket.onerror = function() {
                resolve(false);
              };
            });
          }
          this.websocket.close(1e3);
        });
      }
    };
  }
});

// node_modules/@ethersproject/providers/lib.esm/url-json-rpc-provider.js
var __awaiter6, logger7, StaticJsonRpcProvider, UrlJsonRpcProvider;
var init_url_json_rpc_provider = __esm({
  "node_modules/@ethersproject/providers/lib.esm/url-json-rpc-provider.js"() {
    "use strict";
    init_lib5();
    init_lib();
    init_version3();
    init_json_rpc_provider();
    __awaiter6 = function(thisArg, _arguments, P, generator) {
      function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
          resolve(value);
        });
      }
      return new (P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) {
          try {
            step(generator.next(value));
          } catch (e) {
            reject(e);
          }
        }
        function rejected(value) {
          try {
            step(generator["throw"](value));
          } catch (e) {
            reject(e);
          }
        }
        function step(result) {
          result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    };
    logger7 = new Logger(version3);
    StaticJsonRpcProvider = class extends JsonRpcProvider {
      detectNetwork() {
        const _super = Object.create(null, {
          detectNetwork: { get: () => super.detectNetwork }
        });
        return __awaiter6(this, void 0, void 0, function* () {
          let network = this.network;
          if (network == null) {
            network = yield _super.detectNetwork.call(this);
            if (!network) {
              logger7.throwError("no network detected", Logger.errors.UNKNOWN_ERROR, {});
            }
            if (this._network == null) {
              defineReadOnly(this, "_network", network);
              this.emit("network", network, null);
            }
          }
          return network;
        });
      }
    };
    UrlJsonRpcProvider = class _UrlJsonRpcProvider extends StaticJsonRpcProvider {
      constructor(network, apiKey) {
        logger7.checkAbstract(new.target, _UrlJsonRpcProvider);
        network = getStatic(new.target, "getNetwork")(network);
        apiKey = getStatic(new.target, "getApiKey")(apiKey);
        const connection = getStatic(new.target, "getUrl")(network, apiKey);
        super(connection, network);
        if (typeof apiKey === "string") {
          defineReadOnly(this, "apiKey", apiKey);
        } else if (apiKey != null) {
          Object.keys(apiKey).forEach((key) => {
            defineReadOnly(this, key, apiKey[key]);
          });
        }
      }
      _startPending() {
        logger7.warn("WARNING: API provider does not support pending filters");
      }
      isCommunityResource() {
        return false;
      }
      getSigner(address) {
        return logger7.throwError("API provider does not support signing", Logger.errors.UNSUPPORTED_OPERATION, { operation: "getSigner" });
      }
      listAccounts() {
        return Promise.resolve([]);
      }
      // Return a defaultApiKey if null, otherwise validate the API key
      static getApiKey(apiKey) {
        return apiKey;
      }
      // Returns the url or connection for the given network and API key. The
      // API key will have been sanitized by the getApiKey first, so any validation
      // or transformations can be done there.
      static getUrl(network, apiKey) {
        return logger7.throwError("not implemented; sub-classes must override getUrl", Logger.errors.NOT_IMPLEMENTED, {
          operation: "getUrl"
        });
      }
    };
  }
});

// node_modules/@ethersproject/providers/lib.esm/alchemy-provider.js
var logger8, defaultApiKey, AlchemyWebSocketProvider, AlchemyProvider;
var init_alchemy_provider = __esm({
  "node_modules/@ethersproject/providers/lib.esm/alchemy-provider.js"() {
    "use strict";
    init_lib5();
    init_formatter();
    init_websocket_provider();
    init_lib();
    init_version3();
    init_url_json_rpc_provider();
    logger8 = new Logger(version3);
    defaultApiKey = "_gg7wSSi0KMBsdKnGVfHDueq6xMB9EkC";
    AlchemyWebSocketProvider = class extends WebSocketProvider {
      constructor(network, apiKey) {
        const provider = new AlchemyProvider(network, apiKey);
        const url = provider.connection.url.replace(/^http/i, "ws").replace(".alchemyapi.", ".ws.alchemyapi.");
        super(url, provider.network);
        defineReadOnly(this, "apiKey", provider.apiKey);
      }
      isCommunityResource() {
        return this.apiKey === defaultApiKey;
      }
    };
    AlchemyProvider = class extends UrlJsonRpcProvider {
      static getWebSocketProvider(network, apiKey) {
        return new AlchemyWebSocketProvider(network, apiKey);
      }
      static getApiKey(apiKey) {
        if (apiKey == null) {
          return defaultApiKey;
        }
        if (apiKey && typeof apiKey !== "string") {
          logger8.throwArgumentError("invalid apiKey", "apiKey", apiKey);
        }
        return apiKey;
      }
      static getUrl(network, apiKey) {
        let host = null;
        switch (network.name) {
          case "homestead":
            host = "eth-mainnet.alchemyapi.io/v2/";
            break;
          case "goerli":
            host = "eth-goerli.g.alchemy.com/v2/";
            break;
          case "sepolia":
            host = "eth-sepolia.g.alchemy.com/v2/";
            break;
          case "matic":
            host = "polygon-mainnet.g.alchemy.com/v2/";
            break;
          case "maticmum":
            host = "polygon-mumbai.g.alchemy.com/v2/";
            break;
          case "arbitrum":
            host = "arb-mainnet.g.alchemy.com/v2/";
            break;
          case "arbitrum-goerli":
            host = "arb-goerli.g.alchemy.com/v2/";
            break;
          case "arbitrum-sepolia":
            host = "arb-sepolia.g.alchemy.com/v2/";
            break;
          case "optimism":
            host = "opt-mainnet.g.alchemy.com/v2/";
            break;
          case "optimism-goerli":
            host = "opt-goerli.g.alchemy.com/v2/";
            break;
          case "optimism-sepolia":
            host = "opt-sepolia.g.alchemy.com/v2/";
            break;
          default:
            logger8.throwArgumentError("unsupported network", "network", arguments[0]);
        }
        return {
          allowGzip: true,
          url: "https://" + host + apiKey,
          throttleCallback: (attempt, url) => {
            if (apiKey === defaultApiKey) {
              showThrottleMessage();
            }
            return Promise.resolve(true);
          }
        };
      }
      isCommunityResource() {
        return this.apiKey === defaultApiKey;
      }
    };
  }
});

// node_modules/@ethersproject/providers/lib.esm/ankr-provider.js
function getHost(name) {
  switch (name) {
    case "homestead":
      return "rpc.ankr.com/eth/";
    case "ropsten":
      return "rpc.ankr.com/eth_ropsten/";
    case "rinkeby":
      return "rpc.ankr.com/eth_rinkeby/";
    case "goerli":
      return "rpc.ankr.com/eth_goerli/";
    case "sepolia":
      return "rpc.ankr.com/eth_sepolia/";
    case "matic":
      return "rpc.ankr.com/polygon/";
    case "maticmum":
      return "rpc.ankr.com/polygon_mumbai/";
    case "optimism":
      return "rpc.ankr.com/optimism/";
    case "optimism-goerli":
      return "rpc.ankr.com/optimism_testnet/";
    case "optimism-sepolia":
      return "rpc.ankr.com/optimism_sepolia/";
    case "arbitrum":
      return "rpc.ankr.com/arbitrum/";
  }
  return logger9.throwArgumentError("unsupported network", "name", name);
}
var logger9, defaultApiKey2, AnkrProvider;
var init_ankr_provider = __esm({
  "node_modules/@ethersproject/providers/lib.esm/ankr-provider.js"() {
    init_formatter();
    init_url_json_rpc_provider();
    init_lib();
    init_version3();
    logger9 = new Logger(version3);
    defaultApiKey2 = "9f7d929b018cdffb338517efa06f58359e86ff1ffd350bc889738523659e7972";
    AnkrProvider = class extends UrlJsonRpcProvider {
      isCommunityResource() {
        return this.apiKey === defaultApiKey2;
      }
      static getApiKey(apiKey) {
        if (apiKey == null) {
          return defaultApiKey2;
        }
        return apiKey;
      }
      static getUrl(network, apiKey) {
        if (apiKey == null) {
          apiKey = defaultApiKey2;
        }
        const connection = {
          allowGzip: true,
          url: "https://" + getHost(network.name) + apiKey,
          throttleCallback: (attempt, url) => {
            if (apiKey.apiKey === defaultApiKey2) {
              showThrottleMessage();
            }
            return Promise.resolve(true);
          }
        };
        if (apiKey.projectSecret != null) {
          connection.user = "";
          connection.password = apiKey.projectSecret;
        }
        return connection;
      }
    };
  }
});

// node_modules/@ethersproject/providers/lib.esm/cloudflare-provider.js
var __awaiter7, logger10, CloudflareProvider;
var init_cloudflare_provider = __esm({
  "node_modules/@ethersproject/providers/lib.esm/cloudflare-provider.js"() {
    "use strict";
    init_url_json_rpc_provider();
    init_lib();
    init_version3();
    __awaiter7 = function(thisArg, _arguments, P, generator) {
      function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
          resolve(value);
        });
      }
      return new (P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) {
          try {
            step(generator.next(value));
          } catch (e) {
            reject(e);
          }
        }
        function rejected(value) {
          try {
            step(generator["throw"](value));
          } catch (e) {
            reject(e);
          }
        }
        function step(result) {
          result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    };
    logger10 = new Logger(version3);
    CloudflareProvider = class extends UrlJsonRpcProvider {
      static getApiKey(apiKey) {
        if (apiKey != null) {
          logger10.throwArgumentError("apiKey not supported for cloudflare", "apiKey", apiKey);
        }
        return null;
      }
      static getUrl(network, apiKey) {
        let host = null;
        switch (network.name) {
          case "homestead":
            host = "https://cloudflare-eth.com/";
            break;
          default:
            logger10.throwArgumentError("unsupported network", "network", arguments[0]);
        }
        return host;
      }
      perform(method, params) {
        const _super = Object.create(null, {
          perform: { get: () => super.perform }
        });
        return __awaiter7(this, void 0, void 0, function* () {
          if (method === "getBlockNumber") {
            const block = yield _super.perform.call(this, "getBlock", { blockTag: "latest" });
            return block.number;
          }
          return _super.perform.call(this, method, params);
        });
      }
    };
  }
});

// node_modules/@ethersproject/providers/lib.esm/etherscan-provider.js
function getTransactionPostData(transaction) {
  const result = {};
  for (let key in transaction) {
    if (transaction[key] == null) {
      continue;
    }
    let value = transaction[key];
    if (key === "type" && value === 0) {
      continue;
    }
    if ({ type: true, gasLimit: true, gasPrice: true, maxFeePerGs: true, maxPriorityFeePerGas: true, nonce: true, value: true }[key]) {
      value = hexValue(hexlify(value));
    } else if (key === "accessList") {
      value = "[" + accessListify(value).map((set) => {
        return `{address:"${set.address}",storageKeys:["${set.storageKeys.join('","')}"]}`;
      }).join(",") + "]";
    } else {
      value = hexlify(value);
    }
    result[key] = value;
  }
  return result;
}
function getResult2(result) {
  if (result.status == 0 && (result.message === "No records found" || result.message === "No transactions found")) {
    return result.result;
  }
  if (result.status != 1 || typeof result.message !== "string" || !result.message.match(/^OK/)) {
    const error = new Error("invalid response");
    error.result = JSON.stringify(result);
    if ((result.result || "").toLowerCase().indexOf("rate limit") >= 0) {
      error.throttleRetry = true;
    }
    throw error;
  }
  return result.result;
}
function getJsonResult(result) {
  if (result && result.status == 0 && result.message == "NOTOK" && (result.result || "").toLowerCase().indexOf("rate limit") >= 0) {
    const error = new Error("throttled response");
    error.result = JSON.stringify(result);
    error.throttleRetry = true;
    throw error;
  }
  if (result.jsonrpc != "2.0") {
    const error = new Error("invalid response");
    error.result = JSON.stringify(result);
    throw error;
  }
  if (result.error) {
    const error = new Error(result.error.message || "unknown error");
    if (result.error.code) {
      error.code = result.error.code;
    }
    if (result.error.data) {
      error.data = result.error.data;
    }
    throw error;
  }
  return result.result;
}
function checkLogTag(blockTag) {
  if (blockTag === "pending") {
    throw new Error("pending not supported");
  }
  if (blockTag === "latest") {
    return blockTag;
  }
  return parseInt(blockTag.substring(2), 16);
}
function checkError2(method, error, transaction) {
  if (method === "call" && error.code === Logger.errors.SERVER_ERROR) {
    const e = error.error;
    if (e && (e.message.match(/reverted/i) || e.message.match(/VM execution error/i))) {
      let data = e.data;
      if (data) {
        data = "0x" + data.replace(/^.*0x/i, "");
      }
      if (isHexString(data)) {
        return data;
      }
      logger11.throwError("missing revert data in call exception", Logger.errors.CALL_EXCEPTION, {
        error,
        data: "0x"
      });
    }
  }
  let message = error.message;
  if (error.code === Logger.errors.SERVER_ERROR) {
    if (error.error && typeof error.error.message === "string") {
      message = error.error.message;
    } else if (typeof error.body === "string") {
      message = error.body;
    } else if (typeof error.responseText === "string") {
      message = error.responseText;
    }
  }
  message = (message || "").toLowerCase();
  if (message.match(/insufficient funds/)) {
    logger11.throwError("insufficient funds for intrinsic transaction cost", Logger.errors.INSUFFICIENT_FUNDS, {
      error,
      method,
      transaction
    });
  }
  if (message.match(/same hash was already imported|transaction nonce is too low|nonce too low/)) {
    logger11.throwError("nonce has already been used", Logger.errors.NONCE_EXPIRED, {
      error,
      method,
      transaction
    });
  }
  if (message.match(/another transaction with same nonce/)) {
    logger11.throwError("replacement fee too low", Logger.errors.REPLACEMENT_UNDERPRICED, {
      error,
      method,
      transaction
    });
  }
  if (message.match(/execution failed due to an exception|execution reverted/)) {
    logger11.throwError("cannot estimate gas; transaction may fail or may require manual gas limit", Logger.errors.UNPREDICTABLE_GAS_LIMIT, {
      error,
      method,
      transaction
    });
  }
  throw error;
}
var __awaiter8, logger11, EtherscanProvider;
var init_etherscan_provider = __esm({
  "node_modules/@ethersproject/providers/lib.esm/etherscan-provider.js"() {
    "use strict";
    init_lib2();
    init_lib5();
    init_lib13();
    init_lib17();
    init_formatter();
    init_lib();
    init_version3();
    init_base_provider();
    __awaiter8 = function(thisArg, _arguments, P, generator) {
      function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
          resolve(value);
        });
      }
      return new (P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) {
          try {
            step(generator.next(value));
          } catch (e) {
            reject(e);
          }
        }
        function rejected(value) {
          try {
            step(generator["throw"](value));
          } catch (e) {
            reject(e);
          }
        }
        function step(result) {
          result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    };
    logger11 = new Logger(version3);
    EtherscanProvider = class extends BaseProvider {
      constructor(network, apiKey) {
        super(network);
        defineReadOnly(this, "baseUrl", this.getBaseUrl());
        defineReadOnly(this, "apiKey", apiKey || null);
      }
      getBaseUrl() {
        switch (this.network ? this.network.name : "invalid") {
          case "homestead":
            return "https://api.etherscan.io";
          case "goerli":
            return "https://api-goerli.etherscan.io";
          case "sepolia":
            return "https://api-sepolia.etherscan.io";
          case "matic":
            return "https://api.polygonscan.com";
          case "maticmum":
            return "https://api-testnet.polygonscan.com";
          case "arbitrum":
            return "https://api.arbiscan.io";
          case "arbitrum-goerli":
            return "https://api-goerli.arbiscan.io";
          case "optimism":
            return "https://api-optimistic.etherscan.io";
          case "optimism-goerli":
            return "https://api-goerli-optimistic.etherscan.io";
          default:
        }
        return logger11.throwArgumentError("unsupported network", "network", this.network.name);
      }
      getUrl(module, params) {
        const query = Object.keys(params).reduce((accum, key) => {
          const value = params[key];
          if (value != null) {
            accum += `&${key}=${value}`;
          }
          return accum;
        }, "");
        const apiKey = this.apiKey ? `&apikey=${this.apiKey}` : "";
        return `${this.baseUrl}/api?module=${module}${query}${apiKey}`;
      }
      getPostUrl() {
        return `${this.baseUrl}/api`;
      }
      getPostData(module, params) {
        params.module = module;
        params.apikey = this.apiKey;
        return params;
      }
      fetch(module, params, post) {
        return __awaiter8(this, void 0, void 0, function* () {
          const url = post ? this.getPostUrl() : this.getUrl(module, params);
          const payload = post ? this.getPostData(module, params) : null;
          const procFunc = module === "proxy" ? getJsonResult : getResult2;
          this.emit("debug", {
            action: "request",
            request: url,
            provider: this
          });
          const connection = {
            url,
            throttleSlotInterval: 1e3,
            throttleCallback: (attempt, url2) => {
              if (this.isCommunityResource()) {
                showThrottleMessage();
              }
              return Promise.resolve(true);
            }
          };
          let payloadStr = null;
          if (payload) {
            connection.headers = { "content-type": "application/x-www-form-urlencoded; charset=UTF-8" };
            payloadStr = Object.keys(payload).map((key) => {
              return `${key}=${payload[key]}`;
            }).join("&");
          }
          const result = yield fetchJson(connection, payloadStr, procFunc || getJsonResult);
          this.emit("debug", {
            action: "response",
            request: url,
            response: deepCopy(result),
            provider: this
          });
          return result;
        });
      }
      detectNetwork() {
        return __awaiter8(this, void 0, void 0, function* () {
          return this.network;
        });
      }
      perform(method, params) {
        const _super = Object.create(null, {
          perform: { get: () => super.perform }
        });
        return __awaiter8(this, void 0, void 0, function* () {
          switch (method) {
            case "getBlockNumber":
              return this.fetch("proxy", { action: "eth_blockNumber" });
            case "getGasPrice":
              return this.fetch("proxy", { action: "eth_gasPrice" });
            case "getBalance":
              return this.fetch("account", {
                action: "balance",
                address: params.address,
                tag: params.blockTag
              });
            case "getTransactionCount":
              return this.fetch("proxy", {
                action: "eth_getTransactionCount",
                address: params.address,
                tag: params.blockTag
              });
            case "getCode":
              return this.fetch("proxy", {
                action: "eth_getCode",
                address: params.address,
                tag: params.blockTag
              });
            case "getStorageAt":
              return this.fetch("proxy", {
                action: "eth_getStorageAt",
                address: params.address,
                position: params.position,
                tag: params.blockTag
              });
            case "sendTransaction":
              return this.fetch("proxy", {
                action: "eth_sendRawTransaction",
                hex: params.signedTransaction
              }, true).catch((error) => {
                return checkError2("sendTransaction", error, params.signedTransaction);
              });
            case "getBlock":
              if (params.blockTag) {
                return this.fetch("proxy", {
                  action: "eth_getBlockByNumber",
                  tag: params.blockTag,
                  boolean: params.includeTransactions ? "true" : "false"
                });
              }
              throw new Error("getBlock by blockHash not implemented");
            case "getTransaction":
              return this.fetch("proxy", {
                action: "eth_getTransactionByHash",
                txhash: params.transactionHash
              });
            case "getTransactionReceipt":
              return this.fetch("proxy", {
                action: "eth_getTransactionReceipt",
                txhash: params.transactionHash
              });
            case "call": {
              if (params.blockTag !== "latest") {
                throw new Error("EtherscanProvider does not support blockTag for call");
              }
              const postData = getTransactionPostData(params.transaction);
              postData.module = "proxy";
              postData.action = "eth_call";
              try {
                return yield this.fetch("proxy", postData, true);
              } catch (error) {
                return checkError2("call", error, params.transaction);
              }
            }
            case "estimateGas": {
              const postData = getTransactionPostData(params.transaction);
              postData.module = "proxy";
              postData.action = "eth_estimateGas";
              try {
                return yield this.fetch("proxy", postData, true);
              } catch (error) {
                return checkError2("estimateGas", error, params.transaction);
              }
            }
            case "getLogs": {
              const args = { action: "getLogs" };
              if (params.filter.fromBlock) {
                args.fromBlock = checkLogTag(params.filter.fromBlock);
              }
              if (params.filter.toBlock) {
                args.toBlock = checkLogTag(params.filter.toBlock);
              }
              if (params.filter.address) {
                args.address = params.filter.address;
              }
              if (params.filter.topics && params.filter.topics.length > 0) {
                if (params.filter.topics.length > 1) {
                  logger11.throwError("unsupported topic count", Logger.errors.UNSUPPORTED_OPERATION, { topics: params.filter.topics });
                }
                if (params.filter.topics.length === 1) {
                  const topic0 = params.filter.topics[0];
                  if (typeof topic0 !== "string" || topic0.length !== 66) {
                    logger11.throwError("unsupported topic format", Logger.errors.UNSUPPORTED_OPERATION, { topic0 });
                  }
                  args.topic0 = topic0;
                }
              }
              const logs = yield this.fetch("logs", args);
              let blocks = {};
              for (let i = 0; i < logs.length; i++) {
                const log = logs[i];
                if (log.blockHash != null) {
                  continue;
                }
                if (blocks[log.blockNumber] == null) {
                  const block = yield this.getBlock(log.blockNumber);
                  if (block) {
                    blocks[log.blockNumber] = block.hash;
                  }
                }
                log.blockHash = blocks[log.blockNumber];
              }
              return logs;
            }
            case "getEtherPrice":
              if (this.network.name !== "homestead") {
                return 0;
              }
              return parseFloat((yield this.fetch("stats", { action: "ethprice" })).ethusd);
            default:
              break;
          }
          return _super.perform.call(this, method, params);
        });
      }
      // Note: The `page` page parameter only allows pagination within the
      //       10,000 window available without a page and offset parameter
      //       Error: Result window is too large, PageNo x Offset size must
      //              be less than or equal to 10000
      getHistory(addressOrName, startBlock, endBlock) {
        return __awaiter8(this, void 0, void 0, function* () {
          const params = {
            action: "txlist",
            address: yield this.resolveName(addressOrName),
            startblock: startBlock == null ? 0 : startBlock,
            endblock: endBlock == null ? 99999999 : endBlock,
            sort: "asc"
          };
          const result = yield this.fetch("account", params);
          return result.map((tx) => {
            ["contractAddress", "to"].forEach(function(key) {
              if (tx[key] == "") {
                delete tx[key];
              }
            });
            if (tx.creates == null && tx.contractAddress != null) {
              tx.creates = tx.contractAddress;
            }
            const item = this.formatter.transactionResponse(tx);
            if (tx.timeStamp) {
              item.timestamp = parseInt(tx.timeStamp);
            }
            return item;
          });
        });
      }
      isCommunityResource() {
        return this.apiKey == null;
      }
    };
  }
});

// node_modules/@ethersproject/providers/lib.esm/fallback-provider.js
function now() {
  return (/* @__PURE__ */ new Date()).getTime();
}
function checkNetworks(networks2) {
  let result = null;
  for (let i = 0; i < networks2.length; i++) {
    const network = networks2[i];
    if (network == null) {
      return null;
    }
    if (result) {
      if (!(result.name === network.name && result.chainId === network.chainId && (result.ensAddress === network.ensAddress || result.ensAddress == null && network.ensAddress == null))) {
        logger12.throwArgumentError("provider mismatch", "networks", networks2);
      }
    } else {
      result = network;
    }
  }
  return result;
}
function median(values, maxDelta) {
  values = values.slice().sort();
  const middle = Math.floor(values.length / 2);
  if (values.length % 2) {
    return values[middle];
  }
  const a = values[middle - 1], b = values[middle];
  if (maxDelta != null && Math.abs(a - b) > maxDelta) {
    return null;
  }
  return (a + b) / 2;
}
function serialize(value) {
  if (value === null) {
    return "null";
  } else if (typeof value === "number" || typeof value === "boolean") {
    return JSON.stringify(value);
  } else if (typeof value === "string") {
    return value;
  } else if (BigNumber.isBigNumber(value)) {
    return value.toString();
  } else if (Array.isArray(value)) {
    return JSON.stringify(value.map((i) => serialize(i)));
  } else if (typeof value === "object") {
    const keys = Object.keys(value);
    keys.sort();
    return "{" + keys.map((key) => {
      let v = value[key];
      if (typeof v === "function") {
        v = "[function]";
      } else {
        v = serialize(v);
      }
      return JSON.stringify(key) + ":" + v;
    }).join(",") + "}";
  }
  throw new Error("unknown value type: " + typeof value);
}
function stall2(duration) {
  let cancel = null;
  let timer2 = null;
  let promise = new Promise((resolve) => {
    cancel = function() {
      if (timer2) {
        clearTimeout(timer2);
        timer2 = null;
      }
      resolve();
    };
    timer2 = setTimeout(cancel, duration);
  });
  const wait = (func) => {
    promise = promise.then(func);
    return promise;
  };
  function getPromise() {
    return promise;
  }
  return { cancel, getPromise, wait };
}
function exposeDebugConfig(config, now2) {
  const result = {
    weight: config.weight
  };
  Object.defineProperty(result, "provider", { get: () => config.provider });
  if (config.start) {
    result.start = config.start;
  }
  if (now2) {
    result.duration = now2 - config.start;
  }
  if (config.done) {
    if (config.error) {
      result.error = config.error;
    } else {
      result.result = config.result || null;
    }
  }
  return result;
}
function normalizedTally(normalize, quorum) {
  return function(configs) {
    const tally = {};
    configs.forEach((c) => {
      const value = normalize(c.result);
      if (!tally[value]) {
        tally[value] = { count: 0, result: c.result };
      }
      tally[value].count++;
    });
    const keys = Object.keys(tally);
    for (let i = 0; i < keys.length; i++) {
      const check = tally[keys[i]];
      if (check.count >= quorum) {
        return check.result;
      }
    }
    return void 0;
  };
}
function getProcessFunc(provider, method, params) {
  let normalize = serialize;
  switch (method) {
    case "getBlockNumber":
      return function(configs) {
        const values = configs.map((c) => c.result);
        let blockNumber = median(configs.map((c) => c.result), 2);
        if (blockNumber == null) {
          return void 0;
        }
        blockNumber = Math.ceil(blockNumber);
        if (values.indexOf(blockNumber + 1) >= 0) {
          blockNumber++;
        }
        if (blockNumber >= provider._highestBlockNumber) {
          provider._highestBlockNumber = blockNumber;
        }
        return provider._highestBlockNumber;
      };
    case "getGasPrice":
      return function(configs) {
        const values = configs.map((c) => c.result);
        values.sort();
        return values[Math.floor(values.length / 2)];
      };
    case "getEtherPrice":
      return function(configs) {
        return median(configs.map((c) => c.result));
      };
    // No additional normalizing required; serialize is enough
    case "getBalance":
    case "getTransactionCount":
    case "getCode":
    case "getStorageAt":
    case "call":
    case "estimateGas":
    case "getLogs":
      break;
    // We drop the confirmations from transactions as it is approximate
    case "getTransaction":
    case "getTransactionReceipt":
      normalize = function(tx) {
        if (tx == null) {
          return null;
        }
        tx = shallowCopy(tx);
        tx.confirmations = -1;
        return serialize(tx);
      };
      break;
    // We drop the confirmations from transactions as it is approximate
    case "getBlock":
      if (params.includeTransactions) {
        normalize = function(block) {
          if (block == null) {
            return null;
          }
          block = shallowCopy(block);
          block.transactions = block.transactions.map((tx) => {
            tx = shallowCopy(tx);
            tx.confirmations = -1;
            return tx;
          });
          return serialize(block);
        };
      } else {
        normalize = function(block) {
          if (block == null) {
            return null;
          }
          return serialize(block);
        };
      }
      break;
    default:
      throw new Error("unknown method: " + method);
  }
  return normalizedTally(normalize, provider.quorum);
}
function waitForSync(config, blockNumber) {
  return __awaiter9(this, void 0, void 0, function* () {
    const provider = config.provider;
    if (provider.blockNumber != null && provider.blockNumber >= blockNumber || blockNumber === -1) {
      return provider;
    }
    return poll(() => {
      return new Promise((resolve, reject) => {
        setTimeout(function() {
          if (provider.blockNumber >= blockNumber) {
            return resolve(provider);
          }
          if (config.cancelled) {
            return resolve(null);
          }
          return resolve(void 0);
        }, 0);
      });
    }, { oncePoll: provider });
  });
}
function getRunner(config, currentBlockNumber, method, params) {
  return __awaiter9(this, void 0, void 0, function* () {
    let provider = config.provider;
    switch (method) {
      case "getBlockNumber":
      case "getGasPrice":
        return provider[method]();
      case "getEtherPrice":
        if (provider.getEtherPrice) {
          return provider.getEtherPrice();
        }
        break;
      case "getBalance":
      case "getTransactionCount":
      case "getCode":
        if (params.blockTag && isHexString(params.blockTag)) {
          provider = yield waitForSync(config, currentBlockNumber);
        }
        return provider[method](params.address, params.blockTag || "latest");
      case "getStorageAt":
        if (params.blockTag && isHexString(params.blockTag)) {
          provider = yield waitForSync(config, currentBlockNumber);
        }
        return provider.getStorageAt(params.address, params.position, params.blockTag || "latest");
      case "getBlock":
        if (params.blockTag && isHexString(params.blockTag)) {
          provider = yield waitForSync(config, currentBlockNumber);
        }
        return provider[params.includeTransactions ? "getBlockWithTransactions" : "getBlock"](params.blockTag || params.blockHash);
      case "call":
      case "estimateGas":
        if (params.blockTag && isHexString(params.blockTag)) {
          provider = yield waitForSync(config, currentBlockNumber);
        }
        if (method === "call" && params.blockTag) {
          return provider[method](params.transaction, params.blockTag);
        }
        return provider[method](params.transaction);
      case "getTransaction":
      case "getTransactionReceipt":
        return provider[method](params.transactionHash);
      case "getLogs": {
        let filter = params.filter;
        if (filter.fromBlock && isHexString(filter.fromBlock) || filter.toBlock && isHexString(filter.toBlock)) {
          provider = yield waitForSync(config, currentBlockNumber);
        }
        return provider.getLogs(filter);
      }
    }
    return logger12.throwError("unknown method error", Logger.errors.UNKNOWN_ERROR, {
      method,
      params
    });
  });
}
var __awaiter9, logger12, nextRid, ForwardErrors, ForwardProperties, FallbackProvider;
var init_fallback_provider = __esm({
  "node_modules/@ethersproject/providers/lib.esm/fallback-provider.js"() {
    "use strict";
    init_lib6();
    init_lib3();
    init_lib2();
    init_lib5();
    init_lib15();
    init_lib17();
    init_base_provider();
    init_formatter();
    init_lib();
    init_version3();
    __awaiter9 = function(thisArg, _arguments, P, generator) {
      function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
          resolve(value);
        });
      }
      return new (P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) {
          try {
            step(generator.next(value));
          } catch (e) {
            reject(e);
          }
        }
        function rejected(value) {
          try {
            step(generator["throw"](value));
          } catch (e) {
            reject(e);
          }
        }
        function step(result) {
          result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    };
    logger12 = new Logger(version3);
    nextRid = 1;
    ForwardErrors = [
      Logger.errors.CALL_EXCEPTION,
      Logger.errors.INSUFFICIENT_FUNDS,
      Logger.errors.NONCE_EXPIRED,
      Logger.errors.REPLACEMENT_UNDERPRICED,
      Logger.errors.UNPREDICTABLE_GAS_LIMIT
    ];
    ForwardProperties = [
      "address",
      "args",
      "errorArgs",
      "errorSignature",
      "method",
      "transaction"
    ];
    FallbackProvider = class extends BaseProvider {
      constructor(providers, quorum) {
        if (providers.length === 0) {
          logger12.throwArgumentError("missing providers", "providers", providers);
        }
        const providerConfigs = providers.map((configOrProvider, index) => {
          if (Provider.isProvider(configOrProvider)) {
            const stallTimeout = isCommunityResource(configOrProvider) ? 2e3 : 750;
            const priority = 1;
            return Object.freeze({ provider: configOrProvider, weight: 1, stallTimeout, priority });
          }
          const config = shallowCopy(configOrProvider);
          if (config.priority == null) {
            config.priority = 1;
          }
          if (config.stallTimeout == null) {
            config.stallTimeout = isCommunityResource(configOrProvider) ? 2e3 : 750;
          }
          if (config.weight == null) {
            config.weight = 1;
          }
          const weight = config.weight;
          if (weight % 1 || weight > 512 || weight < 1) {
            logger12.throwArgumentError("invalid weight; must be integer in [1, 512]", `providers[${index}].weight`, weight);
          }
          return Object.freeze(config);
        });
        const total = providerConfigs.reduce((accum, c) => accum + c.weight, 0);
        if (quorum == null) {
          quorum = total / 2;
        } else if (quorum > total) {
          logger12.throwArgumentError("quorum will always fail; larger than total weight", "quorum", quorum);
        }
        let networkOrReady = checkNetworks(providerConfigs.map((c) => c.provider.network));
        if (networkOrReady == null) {
          networkOrReady = new Promise((resolve, reject) => {
            setTimeout(() => {
              this.detectNetwork().then(resolve, reject);
            }, 0);
          });
        }
        super(networkOrReady);
        defineReadOnly(this, "providerConfigs", Object.freeze(providerConfigs));
        defineReadOnly(this, "quorum", quorum);
        this._highestBlockNumber = -1;
      }
      detectNetwork() {
        return __awaiter9(this, void 0, void 0, function* () {
          const networks2 = yield Promise.all(this.providerConfigs.map((c) => c.provider.getNetwork()));
          return checkNetworks(networks2);
        });
      }
      perform(method, params) {
        return __awaiter9(this, void 0, void 0, function* () {
          if (method === "sendTransaction") {
            const results = yield Promise.all(this.providerConfigs.map((c) => {
              return c.provider.sendTransaction(params.signedTransaction).then((result) => {
                return result.hash;
              }, (error) => {
                return error;
              });
            }));
            for (let i2 = 0; i2 < results.length; i2++) {
              const result = results[i2];
              if (typeof result === "string") {
                return result;
              }
            }
            throw results[0];
          }
          if (this._highestBlockNumber === -1 && method !== "getBlockNumber") {
            yield this.getBlockNumber();
          }
          const processFunc = getProcessFunc(this, method, params);
          const configs = shuffled(this.providerConfigs.map(shallowCopy));
          configs.sort((a, b) => a.priority - b.priority);
          const currentBlockNumber = this._highestBlockNumber;
          let i = 0;
          let first = true;
          while (true) {
            const t0 = now();
            let inflightWeight = configs.filter((c) => c.runner && t0 - c.start < c.stallTimeout).reduce((accum, c) => accum + c.weight, 0);
            while (inflightWeight < this.quorum && i < configs.length) {
              const config = configs[i++];
              const rid = nextRid++;
              config.start = now();
              config.staller = stall2(config.stallTimeout);
              config.staller.wait(() => {
                config.staller = null;
              });
              config.runner = getRunner(config, currentBlockNumber, method, params).then((result) => {
                config.done = true;
                config.result = result;
                if (this.listenerCount("debug")) {
                  this.emit("debug", {
                    action: "request",
                    rid,
                    backend: exposeDebugConfig(config, now()),
                    request: { method, params: deepCopy(params) },
                    provider: this
                  });
                }
              }, (error) => {
                config.done = true;
                config.error = error;
                if (this.listenerCount("debug")) {
                  this.emit("debug", {
                    action: "request",
                    rid,
                    backend: exposeDebugConfig(config, now()),
                    request: { method, params: deepCopy(params) },
                    provider: this
                  });
                }
              });
              if (this.listenerCount("debug")) {
                this.emit("debug", {
                  action: "request",
                  rid,
                  backend: exposeDebugConfig(config, null),
                  request: { method, params: deepCopy(params) },
                  provider: this
                });
              }
              inflightWeight += config.weight;
            }
            const waiting = [];
            configs.forEach((c) => {
              if (c.done || !c.runner) {
                return;
              }
              waiting.push(c.runner);
              if (c.staller) {
                waiting.push(c.staller.getPromise());
              }
            });
            if (waiting.length) {
              yield Promise.race(waiting);
            }
            const results = configs.filter((c) => c.done && c.error == null);
            if (results.length >= this.quorum) {
              const result = processFunc(results);
              if (result !== void 0) {
                configs.forEach((c) => {
                  if (c.staller) {
                    c.staller.cancel();
                  }
                  c.cancelled = true;
                });
                return result;
              }
              if (!first) {
                yield stall2(100).getPromise();
              }
              first = false;
            }
            const errors = configs.reduce((accum, c) => {
              if (!c.done || c.error == null) {
                return accum;
              }
              const code = c.error.code;
              if (ForwardErrors.indexOf(code) >= 0) {
                if (!accum[code]) {
                  accum[code] = { error: c.error, weight: 0 };
                }
                accum[code].weight += c.weight;
              }
              return accum;
            }, {});
            Object.keys(errors).forEach((errorCode) => {
              const tally = errors[errorCode];
              if (tally.weight < this.quorum) {
                return;
              }
              configs.forEach((c) => {
                if (c.staller) {
                  c.staller.cancel();
                }
                c.cancelled = true;
              });
              const e = tally.error;
              const props = {};
              ForwardProperties.forEach((name) => {
                if (e[name] == null) {
                  return;
                }
                props[name] = e[name];
              });
              logger12.throwError(e.reason || e.message, errorCode, props);
            });
            if (configs.filter((c) => !c.done).length === 0) {
              break;
            }
          }
          configs.forEach((c) => {
            if (c.staller) {
              c.staller.cancel();
            }
            c.cancelled = true;
          });
          return logger12.throwError("failed to meet quorum", Logger.errors.SERVER_ERROR, {
            method,
            params,
            //results: configs.map((c) => c.result),
            //errors: configs.map((c) => c.error),
            results: configs.map((c) => exposeDebugConfig(c)),
            provider: this
          });
        });
      }
    };
  }
});

// node_modules/@ethersproject/providers/lib.esm/ipc-provider.js
var IpcProvider;
var init_ipc_provider = __esm({
  "node_modules/@ethersproject/providers/lib.esm/ipc-provider.js"() {
    "use strict";
    IpcProvider = null;
  }
});

// node_modules/@ethersproject/providers/lib.esm/infura-provider.js
var logger13, defaultProjectId, InfuraWebSocketProvider, InfuraProvider;
var init_infura_provider = __esm({
  "node_modules/@ethersproject/providers/lib.esm/infura-provider.js"() {
    "use strict";
    init_lib5();
    init_websocket_provider();
    init_formatter();
    init_lib();
    init_version3();
    init_url_json_rpc_provider();
    logger13 = new Logger(version3);
    defaultProjectId = "84842078b09946638c03157f83405213";
    InfuraWebSocketProvider = class extends WebSocketProvider {
      constructor(network, apiKey) {
        const provider = new InfuraProvider(network, apiKey);
        const connection = provider.connection;
        if (connection.password) {
          logger13.throwError("INFURA WebSocket project secrets unsupported", Logger.errors.UNSUPPORTED_OPERATION, {
            operation: "InfuraProvider.getWebSocketProvider()"
          });
        }
        const url = connection.url.replace(/^http/i, "ws").replace("/v3/", "/ws/v3/");
        super(url, network);
        defineReadOnly(this, "apiKey", provider.projectId);
        defineReadOnly(this, "projectId", provider.projectId);
        defineReadOnly(this, "projectSecret", provider.projectSecret);
      }
      isCommunityResource() {
        return this.projectId === defaultProjectId;
      }
    };
    InfuraProvider = class extends UrlJsonRpcProvider {
      static getWebSocketProvider(network, apiKey) {
        return new InfuraWebSocketProvider(network, apiKey);
      }
      static getApiKey(apiKey) {
        const apiKeyObj = {
          apiKey: defaultProjectId,
          projectId: defaultProjectId,
          projectSecret: null
        };
        if (apiKey == null) {
          return apiKeyObj;
        }
        if (typeof apiKey === "string") {
          apiKeyObj.projectId = apiKey;
        } else if (apiKey.projectSecret != null) {
          logger13.assertArgument(typeof apiKey.projectId === "string", "projectSecret requires a projectId", "projectId", apiKey.projectId);
          logger13.assertArgument(typeof apiKey.projectSecret === "string", "invalid projectSecret", "projectSecret", "[REDACTED]");
          apiKeyObj.projectId = apiKey.projectId;
          apiKeyObj.projectSecret = apiKey.projectSecret;
        } else if (apiKey.projectId) {
          apiKeyObj.projectId = apiKey.projectId;
        }
        apiKeyObj.apiKey = apiKeyObj.projectId;
        return apiKeyObj;
      }
      static getUrl(network, apiKey) {
        let host = null;
        switch (network ? network.name : "unknown") {
          case "homestead":
            host = "mainnet.infura.io";
            break;
          case "goerli":
            host = "goerli.infura.io";
            break;
          case "sepolia":
            host = "sepolia.infura.io";
            break;
          case "matic":
            host = "polygon-mainnet.infura.io";
            break;
          case "maticmum":
            host = "polygon-mumbai.infura.io";
            break;
          case "optimism":
            host = "optimism-mainnet.infura.io";
            break;
          case "optimism-goerli":
            host = "optimism-goerli.infura.io";
            break;
          case "optimism-sepolia":
            host = "optimism-sepolia.infura.io";
            break;
          case "arbitrum":
            host = "arbitrum-mainnet.infura.io";
            break;
          case "arbitrum-goerli":
            host = "arbitrum-goerli.infura.io";
            break;
          case "arbitrum-sepolia":
            host = "arbitrum-sepolia.infura.io";
            break;
          default:
            logger13.throwError("unsupported network", Logger.errors.INVALID_ARGUMENT, {
              argument: "network",
              value: network
            });
        }
        const connection = {
          allowGzip: true,
          url: "https://" + host + "/v3/" + apiKey.projectId,
          throttleCallback: (attempt, url) => {
            if (apiKey.projectId === defaultProjectId) {
              showThrottleMessage();
            }
            return Promise.resolve(true);
          }
        };
        if (apiKey.projectSecret != null) {
          connection.user = "";
          connection.password = apiKey.projectSecret;
        }
        return connection;
      }
      isCommunityResource() {
        return this.projectId === defaultProjectId;
      }
    };
  }
});

// node_modules/@ethersproject/providers/lib.esm/json-rpc-batch-provider.js
var JsonRpcBatchProvider;
var init_json_rpc_batch_provider = __esm({
  "node_modules/@ethersproject/providers/lib.esm/json-rpc-batch-provider.js"() {
    init_lib5();
    init_lib17();
    init_json_rpc_provider();
    JsonRpcBatchProvider = class extends JsonRpcProvider {
      send(method, params) {
        const request = {
          method,
          params,
          id: this._nextId++,
          jsonrpc: "2.0"
        };
        if (this._pendingBatch == null) {
          this._pendingBatch = [];
        }
        const inflightRequest = { request, resolve: null, reject: null };
        const promise = new Promise((resolve, reject) => {
          inflightRequest.resolve = resolve;
          inflightRequest.reject = reject;
        });
        this._pendingBatch.push(inflightRequest);
        if (!this._pendingBatchAggregator) {
          this._pendingBatchAggregator = setTimeout(() => {
            const batch = this._pendingBatch;
            this._pendingBatch = null;
            this._pendingBatchAggregator = null;
            const request2 = batch.map((inflight) => inflight.request);
            this.emit("debug", {
              action: "requestBatch",
              request: deepCopy(request2),
              provider: this
            });
            return fetchJson(this.connection, JSON.stringify(request2)).then((result) => {
              this.emit("debug", {
                action: "response",
                request: request2,
                response: result,
                provider: this
              });
              batch.forEach((inflightRequest2, index) => {
                const payload = result[index];
                if (payload.error) {
                  const error = new Error(payload.error.message);
                  error.code = payload.error.code;
                  error.data = payload.error.data;
                  inflightRequest2.reject(error);
                } else {
                  inflightRequest2.resolve(payload.result);
                }
              });
            }, (error) => {
              this.emit("debug", {
                action: "response",
                error,
                request: request2,
                provider: this
              });
              batch.forEach((inflightRequest2) => {
                inflightRequest2.reject(error);
              });
            });
          }, 10);
        }
        return promise;
      }
    };
  }
});

// node_modules/@ethersproject/providers/lib.esm/nodesmith-provider.js
var logger14, defaultApiKey3, NodesmithProvider;
var init_nodesmith_provider = __esm({
  "node_modules/@ethersproject/providers/lib.esm/nodesmith-provider.js"() {
    "use strict";
    init_url_json_rpc_provider();
    init_lib();
    init_version3();
    logger14 = new Logger(version3);
    defaultApiKey3 = "ETHERS_JS_SHARED";
    NodesmithProvider = class extends UrlJsonRpcProvider {
      static getApiKey(apiKey) {
        if (apiKey && typeof apiKey !== "string") {
          logger14.throwArgumentError("invalid apiKey", "apiKey", apiKey);
        }
        return apiKey || defaultApiKey3;
      }
      static getUrl(network, apiKey) {
        logger14.warn("NodeSmith will be discontinued on 2019-12-20; please migrate to another platform.");
        let host = null;
        switch (network.name) {
          case "homestead":
            host = "https://ethereum.api.nodesmith.io/v1/mainnet/jsonrpc";
            break;
          case "ropsten":
            host = "https://ethereum.api.nodesmith.io/v1/ropsten/jsonrpc";
            break;
          case "rinkeby":
            host = "https://ethereum.api.nodesmith.io/v1/rinkeby/jsonrpc";
            break;
          case "goerli":
            host = "https://ethereum.api.nodesmith.io/v1/goerli/jsonrpc";
            break;
          case "kovan":
            host = "https://ethereum.api.nodesmith.io/v1/kovan/jsonrpc";
            break;
          default:
            logger14.throwArgumentError("unsupported network", "network", arguments[0]);
        }
        return host + "?apiKey=" + apiKey;
      }
    };
  }
});

// node_modules/@ethersproject/providers/lib.esm/pocket-provider.js
var logger15, defaultApplicationId, PocketProvider;
var init_pocket_provider = __esm({
  "node_modules/@ethersproject/providers/lib.esm/pocket-provider.js"() {
    "use strict";
    init_lib();
    init_version3();
    init_url_json_rpc_provider();
    logger15 = new Logger(version3);
    defaultApplicationId = "62e1ad51b37b8e00394bda3b";
    PocketProvider = class extends UrlJsonRpcProvider {
      static getApiKey(apiKey) {
        const apiKeyObj = {
          applicationId: null,
          loadBalancer: true,
          applicationSecretKey: null
        };
        if (apiKey == null) {
          apiKeyObj.applicationId = defaultApplicationId;
        } else if (typeof apiKey === "string") {
          apiKeyObj.applicationId = apiKey;
        } else if (apiKey.applicationSecretKey != null) {
          apiKeyObj.applicationId = apiKey.applicationId;
          apiKeyObj.applicationSecretKey = apiKey.applicationSecretKey;
        } else if (apiKey.applicationId) {
          apiKeyObj.applicationId = apiKey.applicationId;
        } else {
          logger15.throwArgumentError("unsupported PocketProvider apiKey", "apiKey", apiKey);
        }
        return apiKeyObj;
      }
      static getUrl(network, apiKey) {
        let host = null;
        switch (network ? network.name : "unknown") {
          case "goerli":
            host = "eth-goerli.gateway.pokt.network";
            break;
          case "homestead":
            host = "eth-mainnet.gateway.pokt.network";
            break;
          case "kovan":
            host = "poa-kovan.gateway.pokt.network";
            break;
          case "matic":
            host = "poly-mainnet.gateway.pokt.network";
            break;
          case "maticmum":
            host = "polygon-mumbai-rpc.gateway.pokt.network";
            break;
          case "rinkeby":
            host = "eth-rinkeby.gateway.pokt.network";
            break;
          case "ropsten":
            host = "eth-ropsten.gateway.pokt.network";
            break;
          default:
            logger15.throwError("unsupported network", Logger.errors.INVALID_ARGUMENT, {
              argument: "network",
              value: network
            });
        }
        const url = `https://${host}/v1/lb/${apiKey.applicationId}`;
        const connection = { headers: {}, url };
        if (apiKey.applicationSecretKey != null) {
          connection.user = "";
          connection.password = apiKey.applicationSecretKey;
        }
        return connection;
      }
      isCommunityResource() {
        return this.applicationId === defaultApplicationId;
      }
    };
  }
});

// node_modules/@ethersproject/providers/lib.esm/quicknode-provider.js
var logger16, defaultApiKey4, QuickNodeProvider;
var init_quicknode_provider = __esm({
  "node_modules/@ethersproject/providers/lib.esm/quicknode-provider.js"() {
    "use strict";
    init_url_json_rpc_provider();
    init_lib();
    init_version3();
    logger16 = new Logger(version3);
    defaultApiKey4 = "919b412a057b5e9c9b6dce193c5a60242d6efadb";
    QuickNodeProvider = class extends UrlJsonRpcProvider {
      static getApiKey(apiKey) {
        if (apiKey && typeof apiKey !== "string") {
          logger16.throwArgumentError("invalid apiKey", "apiKey", apiKey);
        }
        return apiKey || defaultApiKey4;
      }
      static getUrl(network, apiKey) {
        let host = null;
        switch (network.name) {
          case "homestead":
            host = "ethers.quiknode.pro";
            break;
          case "goerli":
            host = "ethers.ethereum-goerli.quiknode.pro";
            break;
          case "sepolia":
            host = "ethers.ethereum-sepolia.quiknode.pro";
            break;
          case "holesky":
            host = "ethers.ethereum-holesky.quiknode.pro";
            break;
          case "arbitrum":
            host = "ethers.arbitrum-mainnet.quiknode.pro";
            break;
          case "arbitrum-goerli":
            host = "ethers.arbitrum-goerli.quiknode.pro";
            break;
          case "arbitrum-sepolia":
            host = "ethers.arbitrum-sepolia.quiknode.pro";
            break;
          case "base":
            host = "ethers.base-mainnet.quiknode.pro";
            break;
          case "base-goerli":
            host = "ethers.base-goerli.quiknode.pro";
            break;
          case "base-spolia":
            host = "ethers.base-sepolia.quiknode.pro";
            break;
          case "bnb":
            host = "ethers.bsc.quiknode.pro";
            break;
          case "bnbt":
            host = "ethers.bsc-testnet.quiknode.pro";
            break;
          case "matic":
            host = "ethers.matic.quiknode.pro";
            break;
          case "maticmum":
            host = "ethers.matic-testnet.quiknode.pro";
            break;
          case "optimism":
            host = "ethers.optimism.quiknode.pro";
            break;
          case "optimism-goerli":
            host = "ethers.optimism-goerli.quiknode.pro";
            break;
          case "optimism-sepolia":
            host = "ethers.optimism-sepolia.quiknode.pro";
            break;
          case "xdai":
            host = "ethers.xdai.quiknode.pro";
            break;
          default:
            logger16.throwArgumentError("unsupported network", "network", arguments[0]);
        }
        return "https://" + host + "/" + apiKey;
      }
    };
  }
});

// node_modules/@ethersproject/providers/lib.esm/web3-provider.js
function buildWeb3LegacyFetcher(provider, sendFunc) {
  const fetcher = "Web3LegacyFetcher";
  return function(method, params) {
    const request = {
      method,
      params,
      id: _nextId++,
      jsonrpc: "2.0"
    };
    return new Promise((resolve, reject) => {
      this.emit("debug", {
        action: "request",
        fetcher,
        request: deepCopy(request),
        provider: this
      });
      sendFunc(request, (error, response) => {
        if (error) {
          this.emit("debug", {
            action: "response",
            fetcher,
            error,
            request,
            provider: this
          });
          return reject(error);
        }
        this.emit("debug", {
          action: "response",
          fetcher,
          request,
          response,
          provider: this
        });
        if (response.error) {
          const error2 = new Error(response.error.message);
          error2.code = response.error.code;
          error2.data = response.error.data;
          return reject(error2);
        }
        resolve(response.result);
      });
    });
  };
}
function buildEip1193Fetcher(provider) {
  return function(method, params) {
    if (params == null) {
      params = [];
    }
    const request = { method, params };
    this.emit("debug", {
      action: "request",
      fetcher: "Eip1193Fetcher",
      request: deepCopy(request),
      provider: this
    });
    return provider.request(request).then((response) => {
      this.emit("debug", {
        action: "response",
        fetcher: "Eip1193Fetcher",
        request,
        response,
        provider: this
      });
      return response;
    }, (error) => {
      this.emit("debug", {
        action: "response",
        fetcher: "Eip1193Fetcher",
        request,
        error,
        provider: this
      });
      throw error;
    });
  };
}
var logger17, _nextId, Web3Provider;
var init_web3_provider = __esm({
  "node_modules/@ethersproject/providers/lib.esm/web3-provider.js"() {
    "use strict";
    init_lib5();
    init_lib();
    init_version3();
    init_json_rpc_provider();
    logger17 = new Logger(version3);
    _nextId = 1;
    Web3Provider = class extends JsonRpcProvider {
      constructor(provider, network) {
        if (provider == null) {
          logger17.throwArgumentError("missing provider", "provider", provider);
        }
        let path = null;
        let jsonRpcFetchFunc = null;
        let subprovider = null;
        if (typeof provider === "function") {
          path = "unknown:";
          jsonRpcFetchFunc = provider;
        } else {
          path = provider.host || provider.path || "";
          if (!path && provider.isMetaMask) {
            path = "metamask";
          }
          subprovider = provider;
          if (provider.request) {
            if (path === "") {
              path = "eip-1193:";
            }
            jsonRpcFetchFunc = buildEip1193Fetcher(provider);
          } else if (provider.sendAsync) {
            jsonRpcFetchFunc = buildWeb3LegacyFetcher(provider, provider.sendAsync.bind(provider));
          } else if (provider.send) {
            jsonRpcFetchFunc = buildWeb3LegacyFetcher(provider, provider.send.bind(provider));
          } else {
            logger17.throwArgumentError("unsupported provider", "provider", provider);
          }
          if (!path) {
            path = "unknown:";
          }
        }
        super(path, network);
        defineReadOnly(this, "jsonRpcFetchFunc", jsonRpcFetchFunc);
        defineReadOnly(this, "provider", subprovider);
      }
      send(method, params) {
        return this.jsonRpcFetchFunc(method, params);
      }
    };
  }
});

// node_modules/@ethersproject/providers/lib.esm/index.js
var lib_exports2 = {};
__export(lib_exports2, {
  AlchemyProvider: () => AlchemyProvider,
  AlchemyWebSocketProvider: () => AlchemyWebSocketProvider,
  AnkrProvider: () => AnkrProvider,
  BaseProvider: () => BaseProvider,
  CloudflareProvider: () => CloudflareProvider,
  EtherscanProvider: () => EtherscanProvider,
  FallbackProvider: () => FallbackProvider,
  Formatter: () => Formatter,
  InfuraProvider: () => InfuraProvider,
  InfuraWebSocketProvider: () => InfuraWebSocketProvider,
  IpcProvider: () => IpcProvider,
  JsonRpcBatchProvider: () => JsonRpcBatchProvider,
  JsonRpcProvider: () => JsonRpcProvider,
  JsonRpcSigner: () => JsonRpcSigner,
  NodesmithProvider: () => NodesmithProvider,
  PocketProvider: () => PocketProvider,
  Provider: () => Provider,
  QuickNodeProvider: () => QuickNodeProvider,
  Resolver: () => Resolver,
  StaticJsonRpcProvider: () => StaticJsonRpcProvider,
  UrlJsonRpcProvider: () => UrlJsonRpcProvider,
  Web3Provider: () => Web3Provider,
  WebSocketProvider: () => WebSocketProvider,
  getDefaultProvider: () => getDefaultProvider,
  getNetwork: () => getNetwork,
  isCommunityResourcable: () => isCommunityResourcable,
  isCommunityResource: () => isCommunityResource,
  showThrottleMessage: () => showThrottleMessage
});
function getDefaultProvider(network, options) {
  if (network == null) {
    network = "homestead";
  }
  if (typeof network === "string") {
    const match = network.match(/^(ws|http)s?:/i);
    if (match) {
      switch (match[1].toLowerCase()) {
        case "http":
        case "https":
          return new JsonRpcProvider(network);
        case "ws":
        case "wss":
          return new WebSocketProvider(network);
        default:
          logger18.throwArgumentError("unsupported URL scheme", "network", network);
      }
    }
  }
  const n = getNetwork(network);
  if (!n || !n._defaultProvider) {
    logger18.throwError("unsupported getDefaultProvider network", Logger.errors.NETWORK_ERROR, {
      operation: "getDefaultProvider",
      network
    });
  }
  return n._defaultProvider({
    FallbackProvider,
    AlchemyProvider,
    AnkrProvider,
    CloudflareProvider,
    EtherscanProvider,
    InfuraProvider,
    JsonRpcProvider,
    NodesmithProvider,
    PocketProvider,
    QuickNodeProvider,
    Web3Provider,
    IpcProvider
  }, options);
}
var logger18;
var init_lib18 = __esm({
  "node_modules/@ethersproject/providers/lib.esm/index.js"() {
    "use strict";
    init_lib6();
    init_lib16();
    init_base_provider();
    init_alchemy_provider();
    init_ankr_provider();
    init_cloudflare_provider();
    init_etherscan_provider();
    init_fallback_provider();
    init_ipc_provider();
    init_infura_provider();
    init_json_rpc_provider();
    init_json_rpc_batch_provider();
    init_nodesmith_provider();
    init_pocket_provider();
    init_quicknode_provider();
    init_url_json_rpc_provider();
    init_web3_provider();
    init_websocket_provider();
    init_formatter();
    init_lib();
    init_version3();
    logger18 = new Logger(version3);
  }
});

// node_modules/@web3-react/core/dist/hooks.js
var require_hooks = __commonJS({
  "node_modules/@web3-react/core/dist/hooks.js"(exports) {
    "use strict";
    var __createBinding = exports && exports.__createBinding || (Object.create ? function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      var desc = Object.getOwnPropertyDescriptor(m, k);
      if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: function() {
          return m[k];
        } };
      }
      Object.defineProperty(o, k2, desc);
    } : function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      o[k2] = m[k];
    });
    var __setModuleDefault = exports && exports.__setModuleDefault || (Object.create ? function(o, v) {
      Object.defineProperty(o, "default", { enumerable: true, value: v });
    } : function(o, v) {
      o["default"] = v;
    });
    var __importStar = exports && exports.__importStar || function(mod) {
      if (mod && mod.__esModule) return mod;
      var result = {};
      if (mod != null) {
        for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
      }
      __setModuleDefault(result, mod);
      return result;
    };
    var __awaiter10 = exports && exports.__awaiter || function(thisArg, _arguments, P, generator) {
      function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
          resolve(value);
        });
      }
      return new (P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) {
          try {
            step(generator.next(value));
          } catch (e) {
            reject(e);
          }
        }
        function rejected(value) {
          try {
            step(generator["throw"](value));
          } catch (e) {
            reject(e);
          }
        }
        function step(result) {
          result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.getPriorityConnector = exports.getSelectedConnector = exports.initializeConnector = void 0;
    var store_1 = require_dist();
    var react_1 = require_react();
    var zustand_1 = (init_esm2(), __toCommonJS(esm_exports2));
    var traditional_1 = (init_traditional(), __toCommonJS(traditional_exports));
    var DynamicProvider;
    function importProvider() {
      return __awaiter10(this, void 0, void 0, function* () {
        if (DynamicProvider === void 0) {
          try {
            const { Web3Provider: Web3Provider2 } = yield Promise.resolve().then(() => __importStar((init_lib18(), __toCommonJS(lib_exports2))));
            DynamicProvider = Web3Provider2;
          } catch (_a) {
            console.debug("@ethersproject/providers not available");
            DynamicProvider = null;
          }
        }
      });
    }
    function initializeConnector(f) {
      const [store, actions] = (0, store_1.createWeb3ReactStoreAndActions)();
      const connector = f(actions);
      const stateHooks = getStateHooks(store);
      const derivedHooks = getDerivedHooks(stateHooks);
      const augmentedHooks = getAugmentedHooks(connector, stateHooks, derivedHooks);
      return [connector, Object.assign(Object.assign(Object.assign({}, stateHooks), derivedHooks), augmentedHooks), store];
    }
    exports.initializeConnector = initializeConnector;
    function computeIsActive({ chainId, accounts, activating }) {
      return Boolean(chainId && accounts && !activating);
    }
    function getSelectedConnector(...initializedConnectors) {
      function getIndex(connector) {
        const index = initializedConnectors.findIndex(([initializedConnector]) => connector === initializedConnector);
        if (index === -1)
          throw new Error("Connector not found");
        return index;
      }
      function useSelectedStore(connector) {
        const store = initializedConnectors[getIndex(connector)][2];
        if (!store)
          throw new Error("Stores not passed");
        return store;
      }
      function useSelectedChainId(connector) {
        const values = initializedConnectors.map(([, { useChainId }]) => useChainId());
        return values[getIndex(connector)];
      }
      function useSelectedAccounts(connector) {
        const values = initializedConnectors.map(([, { useAccounts }]) => useAccounts());
        return values[getIndex(connector)];
      }
      function useSelectedIsActivating(connector) {
        const values = initializedConnectors.map(([, { useIsActivating }]) => useIsActivating());
        return values[getIndex(connector)];
      }
      function useSelectedAccount(connector) {
        const values = initializedConnectors.map(([, { useAccount }]) => useAccount());
        return values[getIndex(connector)];
      }
      function useSelectedIsActive(connector) {
        const values = initializedConnectors.map(([, { useIsActive }]) => useIsActive());
        return values[getIndex(connector)];
      }
      function useSelectedProvider(connector, network) {
        const index = getIndex(connector);
        const values = initializedConnectors.map(([, { useProvider }], i) => useProvider(network, i === index));
        return values[index];
      }
      function useSelectedENSNames(connector, provider) {
        const index = getIndex(connector);
        const values = initializedConnectors.map(([, { useENSNames }], i) => (
          // eslint-disable-next-line react-hooks/rules-of-hooks
          useENSNames(i === index ? provider : void 0)
        ));
        return values[index];
      }
      function useSelectedENSName(connector, provider) {
        const index = getIndex(connector);
        const values = initializedConnectors.map(([, { useENSName }], i) => useENSName(i === index ? provider : void 0));
        return values[index];
      }
      return {
        useSelectedStore,
        useSelectedChainId,
        useSelectedAccounts,
        useSelectedIsActivating,
        useSelectedAccount,
        useSelectedIsActive,
        useSelectedProvider,
        useSelectedENSNames,
        useSelectedENSName
      };
    }
    exports.getSelectedConnector = getSelectedConnector;
    function getPriorityConnector(...initializedConnectors) {
      const { useSelectedStore, useSelectedChainId, useSelectedAccounts, useSelectedIsActivating, useSelectedAccount, useSelectedIsActive, useSelectedProvider, useSelectedENSNames, useSelectedENSName } = getSelectedConnector(...initializedConnectors);
      function usePriorityConnector() {
        const values = initializedConnectors.map(([, { useIsActive }]) => useIsActive());
        const index = values.findIndex((isActive) => isActive);
        return initializedConnectors[index === -1 ? 0 : index][0];
      }
      function usePriorityStore() {
        return useSelectedStore(usePriorityConnector());
      }
      function usePriorityChainId() {
        return useSelectedChainId(usePriorityConnector());
      }
      function usePriorityAccounts() {
        return useSelectedAccounts(usePriorityConnector());
      }
      function usePriorityIsActivating() {
        return useSelectedIsActivating(usePriorityConnector());
      }
      function usePriorityAccount() {
        return useSelectedAccount(usePriorityConnector());
      }
      function usePriorityIsActive() {
        return useSelectedIsActive(usePriorityConnector());
      }
      function usePriorityProvider(network) {
        return useSelectedProvider(usePriorityConnector(), network);
      }
      function usePriorityENSNames(provider) {
        return useSelectedENSNames(usePriorityConnector(), provider);
      }
      function usePriorityENSName(provider) {
        return useSelectedENSName(usePriorityConnector(), provider);
      }
      return {
        useSelectedStore,
        useSelectedChainId,
        useSelectedAccounts,
        useSelectedIsActivating,
        useSelectedAccount,
        useSelectedIsActive,
        useSelectedProvider,
        useSelectedENSNames,
        useSelectedENSName,
        usePriorityConnector,
        usePriorityStore,
        usePriorityChainId,
        usePriorityAccounts,
        usePriorityIsActivating,
        usePriorityAccount,
        usePriorityIsActive,
        usePriorityProvider,
        usePriorityENSNames,
        usePriorityENSName
      };
    }
    exports.getPriorityConnector = getPriorityConnector;
    var CHAIN_ID = ({ chainId }) => chainId;
    var ACCOUNTS = ({ accounts }) => accounts;
    var ACTIVATING = ({ activating }) => activating;
    var ACCOUNTS_EQUALITY_CHECKER = (oldAccounts, newAccounts) => oldAccounts === void 0 && newAccounts === void 0 || oldAccounts !== void 0 && oldAccounts.length === (newAccounts === null || newAccounts === void 0 ? void 0 : newAccounts.length) && oldAccounts.every((oldAccount, i) => oldAccount === newAccounts[i]);
    function getStateHooks(store) {
      function useChainId() {
        return (0, zustand_1.useStore)(store, CHAIN_ID);
      }
      function useAccounts() {
        return (0, traditional_1.useStoreWithEqualityFn)(store, ACCOUNTS, ACCOUNTS_EQUALITY_CHECKER);
      }
      function useIsActivating() {
        return (0, zustand_1.useStore)(store, ACTIVATING);
      }
      return { useChainId, useAccounts, useIsActivating };
    }
    function getDerivedHooks({ useChainId, useAccounts, useIsActivating }) {
      function useAccount() {
        var _a;
        return (_a = useAccounts()) === null || _a === void 0 ? void 0 : _a[0];
      }
      function useIsActive() {
        const chainId = useChainId();
        const accounts = useAccounts();
        const activating = useIsActivating();
        return computeIsActive({
          chainId,
          accounts,
          activating
        });
      }
      return { useAccount, useIsActive };
    }
    function useENS(provider, accounts = []) {
      const [ENSNames, setENSNames] = (0, react_1.useState)();
      (0, react_1.useEffect)(() => {
        if (provider && accounts.length) {
          let stale = false;
          Promise.all(accounts.map((account) => provider.lookupAddress(account))).then((ENSNames2) => {
            if (stale)
              return;
            setENSNames(ENSNames2);
          }).catch((error) => {
            if (stale)
              return;
            console.debug("Could not fetch ENS names", error);
            setENSNames(new Array(accounts.length).fill(null));
          });
          return () => {
            stale = true;
            setENSNames(void 0);
          };
        }
      }, [provider, accounts]);
      return ENSNames !== null && ENSNames !== void 0 ? ENSNames : new Array(accounts.length).fill(void 0);
    }
    function getAugmentedHooks(connector, { useAccounts, useChainId }, { useAccount, useIsActive }) {
      function useProvider(network, enabled = true) {
        const isActive = useIsActive();
        const chainId = useChainId();
        const [loaded, setLoaded] = (0, react_1.useState)(DynamicProvider !== void 0);
        (0, react_1.useEffect)(() => {
          if (loaded)
            return;
          let stale = false;
          void importProvider().then(() => {
            if (stale)
              return;
            setLoaded(true);
          });
          return () => {
            stale = true;
          };
        }, [loaded]);
        return (0, react_1.useMemo)(() => {
          void loaded;
          if (enabled) {
            if (connector.customProvider)
              return connector.customProvider;
            else if (DynamicProvider && connector.provider)
              return new DynamicProvider(connector.provider, network);
          }
        }, [loaded, enabled, isActive, chainId, network]);
      }
      function useENSNames(provider) {
        const accounts = useAccounts();
        return useENS(provider, accounts);
      }
      function useENSName(provider) {
        var _a;
        const account = useAccount();
        const accounts = (0, react_1.useMemo)(() => account === void 0 ? void 0 : [account], [account]);
        return (_a = useENS(provider, accounts)) === null || _a === void 0 ? void 0 : _a[0];
      }
      return { useProvider, useENSNames, useENSName };
    }
  }
});

// node_modules/eventemitter3/index.js
var require_eventemitter3 = __commonJS({
  "node_modules/eventemitter3/index.js"(exports, module) {
    "use strict";
    var has = Object.prototype.hasOwnProperty;
    var prefix = "~";
    function Events() {
    }
    if (Object.create) {
      Events.prototype = /* @__PURE__ */ Object.create(null);
      if (!new Events().__proto__) prefix = false;
    }
    function EE(fn, context, once) {
      this.fn = fn;
      this.context = context;
      this.once = once || false;
    }
    function addListener(emitter, event, fn, context, once) {
      if (typeof fn !== "function") {
        throw new TypeError("The listener must be a function");
      }
      var listener = new EE(fn, context || emitter, once), evt = prefix ? prefix + event : event;
      if (!emitter._events[evt]) emitter._events[evt] = listener, emitter._eventsCount++;
      else if (!emitter._events[evt].fn) emitter._events[evt].push(listener);
      else emitter._events[evt] = [emitter._events[evt], listener];
      return emitter;
    }
    function clearEvent(emitter, evt) {
      if (--emitter._eventsCount === 0) emitter._events = new Events();
      else delete emitter._events[evt];
    }
    function EventEmitter() {
      this._events = new Events();
      this._eventsCount = 0;
    }
    EventEmitter.prototype.eventNames = function eventNames() {
      var names = [], events, name;
      if (this._eventsCount === 0) return names;
      for (name in events = this._events) {
        if (has.call(events, name)) names.push(prefix ? name.slice(1) : name);
      }
      if (Object.getOwnPropertySymbols) {
        return names.concat(Object.getOwnPropertySymbols(events));
      }
      return names;
    };
    EventEmitter.prototype.listeners = function listeners(event) {
      var evt = prefix ? prefix + event : event, handlers = this._events[evt];
      if (!handlers) return [];
      if (handlers.fn) return [handlers.fn];
      for (var i = 0, l = handlers.length, ee = new Array(l); i < l; i++) {
        ee[i] = handlers[i].fn;
      }
      return ee;
    };
    EventEmitter.prototype.listenerCount = function listenerCount(event) {
      var evt = prefix ? prefix + event : event, listeners = this._events[evt];
      if (!listeners) return 0;
      if (listeners.fn) return 1;
      return listeners.length;
    };
    EventEmitter.prototype.emit = function emit(event, a1, a2, a3, a4, a5) {
      var evt = prefix ? prefix + event : event;
      if (!this._events[evt]) return false;
      var listeners = this._events[evt], len = arguments.length, args, i;
      if (listeners.fn) {
        if (listeners.once) this.removeListener(event, listeners.fn, void 0, true);
        switch (len) {
          case 1:
            return listeners.fn.call(listeners.context), true;
          case 2:
            return listeners.fn.call(listeners.context, a1), true;
          case 3:
            return listeners.fn.call(listeners.context, a1, a2), true;
          case 4:
            return listeners.fn.call(listeners.context, a1, a2, a3), true;
          case 5:
            return listeners.fn.call(listeners.context, a1, a2, a3, a4), true;
          case 6:
            return listeners.fn.call(listeners.context, a1, a2, a3, a4, a5), true;
        }
        for (i = 1, args = new Array(len - 1); i < len; i++) {
          args[i - 1] = arguments[i];
        }
        listeners.fn.apply(listeners.context, args);
      } else {
        var length = listeners.length, j;
        for (i = 0; i < length; i++) {
          if (listeners[i].once) this.removeListener(event, listeners[i].fn, void 0, true);
          switch (len) {
            case 1:
              listeners[i].fn.call(listeners[i].context);
              break;
            case 2:
              listeners[i].fn.call(listeners[i].context, a1);
              break;
            case 3:
              listeners[i].fn.call(listeners[i].context, a1, a2);
              break;
            case 4:
              listeners[i].fn.call(listeners[i].context, a1, a2, a3);
              break;
            default:
              if (!args) for (j = 1, args = new Array(len - 1); j < len; j++) {
                args[j - 1] = arguments[j];
              }
              listeners[i].fn.apply(listeners[i].context, args);
          }
        }
      }
      return true;
    };
    EventEmitter.prototype.on = function on(event, fn, context) {
      return addListener(this, event, fn, context, false);
    };
    EventEmitter.prototype.once = function once(event, fn, context) {
      return addListener(this, event, fn, context, true);
    };
    EventEmitter.prototype.removeListener = function removeListener(event, fn, context, once) {
      var evt = prefix ? prefix + event : event;
      if (!this._events[evt]) return this;
      if (!fn) {
        clearEvent(this, evt);
        return this;
      }
      var listeners = this._events[evt];
      if (listeners.fn) {
        if (listeners.fn === fn && (!once || listeners.once) && (!context || listeners.context === context)) {
          clearEvent(this, evt);
        }
      } else {
        for (var i = 0, events = [], length = listeners.length; i < length; i++) {
          if (listeners[i].fn !== fn || once && !listeners[i].once || context && listeners[i].context !== context) {
            events.push(listeners[i]);
          }
        }
        if (events.length) this._events[evt] = events.length === 1 ? events[0] : events;
        else clearEvent(this, evt);
      }
      return this;
    };
    EventEmitter.prototype.removeAllListeners = function removeAllListeners(event) {
      var evt;
      if (event) {
        evt = prefix ? prefix + event : event;
        if (this._events[evt]) clearEvent(this, evt);
      } else {
        this._events = new Events();
        this._eventsCount = 0;
      }
      return this;
    };
    EventEmitter.prototype.off = EventEmitter.prototype.removeListener;
    EventEmitter.prototype.addListener = EventEmitter.prototype.on;
    EventEmitter.prefixed = prefix;
    EventEmitter.EventEmitter = EventEmitter;
    if ("undefined" !== typeof module) {
      module.exports = EventEmitter;
    }
  }
});

// node_modules/@web3-react/core/dist/mocks.js
var require_mocks = __commonJS({
  "node_modules/@web3-react/core/dist/mocks.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.MockEIP1193Provider = void 0;
    var eventemitter3_1 = require_eventemitter3();
    var MockEIP1193Provider = class extends eventemitter3_1.EventEmitter {
      constructor() {
        super(...arguments);
        this.eth_chainId = jest.fn((chainId) => chainId);
        this.eth_accounts = jest.fn((accounts) => accounts);
        this.eth_requestAccounts = jest.fn((accounts) => accounts);
      }
      request(x) {
        if (!this.chainId)
          return Promise.reject(new Error());
        switch (x.method) {
          case "eth_chainId":
            return Promise.resolve(this.eth_chainId(this.chainId));
          case "eth_accounts":
            return Promise.resolve(this.eth_accounts(this.accounts));
          case "eth_requestAccounts":
            return Promise.resolve(this.eth_requestAccounts(this.accounts));
          default:
            throw new Error(`Method not supported on mock: ${JSON.stringify(x)}`);
        }
      }
      emitConnect(chainId) {
        this.emit("connect", { chainId });
      }
      emitDisconnect(error) {
        this.emit("disconnect", error);
      }
      emitChainChanged(chainId) {
        this.emit("chainChanged", chainId);
      }
      emitAccountsChanged(accounts) {
        this.emit("accountsChanged", accounts);
      }
    };
    exports.MockEIP1193Provider = MockEIP1193Provider;
  }
});

// node_modules/@web3-react/core/dist/provider.js
var require_provider = __commonJS({
  "node_modules/@web3-react/core/dist/provider.js"(exports) {
    "use strict";
    var __createBinding = exports && exports.__createBinding || (Object.create ? function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      var desc = Object.getOwnPropertyDescriptor(m, k);
      if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: function() {
          return m[k];
        } };
      }
      Object.defineProperty(o, k2, desc);
    } : function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      o[k2] = m[k];
    });
    var __setModuleDefault = exports && exports.__setModuleDefault || (Object.create ? function(o, v) {
      Object.defineProperty(o, "default", { enumerable: true, value: v });
    } : function(o, v) {
      o["default"] = v;
    });
    var __importStar = exports && exports.__importStar || function(mod) {
      if (mod && mod.__esModule) return mod;
      var result = {};
      if (mod != null) {
        for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
      }
      __setModuleDefault(result, mod);
      return result;
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.useWeb3React = exports.Web3ReactProvider = void 0;
    var react_1 = __importStar(require_react());
    var hooks_1 = require_hooks();
    var Web3Context = (0, react_1.createContext)(void 0);
    function Web3ReactProvider({ children, connectors, connectorOverride, network, lookupENS = true }) {
      const cachedConnectors = (0, react_1.useRef)(connectors);
      if (connectors.length != cachedConnectors.current.length || connectors.some((connector2, i) => {
        const cachedConnector = cachedConnectors.current[i];
        return connector2[0] !== cachedConnector[0];
      }))
        throw new Error("The connectors prop passed to Web3ReactProvider must be referentially static. If connectors is changing, try providing a key prop to Web3ReactProvider that changes every time connectors changes.");
      const hooks = (0, hooks_1.getPriorityConnector)(...connectors);
      const { usePriorityConnector, useSelectedChainId, useSelectedAccounts, useSelectedIsActivating, useSelectedAccount, useSelectedIsActive, useSelectedProvider, useSelectedENSNames, useSelectedENSName } = hooks;
      const priorityConnector = usePriorityConnector();
      const connector = connectorOverride !== null && connectorOverride !== void 0 ? connectorOverride : priorityConnector;
      const chainId = useSelectedChainId(connector);
      const accounts = useSelectedAccounts(connector);
      const isActivating = useSelectedIsActivating(connector);
      const account = useSelectedAccount(connector);
      const isActive = useSelectedIsActive(connector);
      const provider = useSelectedProvider(connector, network);
      const ENSNames = useSelectedENSNames(connector, lookupENS ? provider : void 0);
      const ENSName = useSelectedENSName(connector, lookupENS ? provider : void 0);
      return react_1.default.createElement(Web3Context.Provider, { value: {
        connector,
        chainId,
        accounts,
        isActivating,
        account,
        isActive,
        provider,
        ENSNames,
        ENSName,
        hooks
      } }, children);
    }
    exports.Web3ReactProvider = Web3ReactProvider;
    function useWeb3React() {
      const context = (0, react_1.useContext)(Web3Context);
      if (!context)
        throw Error("useWeb3React can only be used within the Web3ReactProvider component");
      return context;
    }
    exports.useWeb3React = useWeb3React;
  }
});

// node_modules/@web3-react/core/dist/index.js
var require_dist2 = __commonJS({
  "node_modules/@web3-react/core/dist/index.js"(exports) {
    var __createBinding = exports && exports.__createBinding || (Object.create ? function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      var desc = Object.getOwnPropertyDescriptor(m, k);
      if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: function() {
          return m[k];
        } };
      }
      Object.defineProperty(o, k2, desc);
    } : function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      o[k2] = m[k];
    });
    var __exportStar = exports && exports.__exportStar || function(m, exports2) {
      for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports2, p)) __createBinding(exports2, m, p);
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    __exportStar(require_hooks(), exports);
    __exportStar(require_mocks(), exports);
    __exportStar(require_provider(), exports);
  }
});
export default require_dist2();
/*! Bundled license information:

use-sync-external-store/cjs/use-sync-external-store-shim.development.js:
use-sync-external-store/cjs/use-sync-external-store-shim.development.js:
  (**
   * @license React
   * use-sync-external-store-shim.development.js
   *
   * Copyright (c) Facebook, Inc. and its affiliates.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   *)

use-sync-external-store/cjs/use-sync-external-store-shim/with-selector.development.js:
use-sync-external-store/cjs/use-sync-external-store-shim/with-selector.development.js:
  (**
   * @license React
   * use-sync-external-store-shim/with-selector.development.js
   *
   * Copyright (c) Facebook, Inc. and its affiliates.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   *)
*/
//# sourceMappingURL=@web3-react_core.js.map
