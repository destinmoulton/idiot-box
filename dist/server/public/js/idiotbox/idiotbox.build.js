/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/client/App.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/client/App.js":
/*!***************************!*\
  !*** ./src/client/App.js ***!
  \***************************/
/*! no exports provided */
/***/ (function(module, exports) {

eval("throw new Error(\"Module build failed (from ./node_modules/babel-loader/lib/index.js):\\nError: Duplicate plugin/preset detected.\\nIf you'd like to use two separate instances of a plugin,\\nthey need separate names, e.g.\\n\\n  plugins: [\\n    ['some-plugin', {}],\\n    ['some-plugin', {}, 'some unique name'],\\n  ]\\n\\nDuplicates detected are:\\n[\\n  {\\n    \\\"alias\\\": \\\"/home/destin/projects/idiot-box/node_modules/@babel/preset-env/lib/index.js\\\",\\n    \\\"options\\\": {\\n      \\\"targets\\\": {\\n        \\\"node\\\": \\\"10\\\"\\n      }\\n    },\\n    \\\"dirname\\\": \\\"/home/destin/projects/idiot-box\\\",\\n    \\\"ownPass\\\": false,\\n    \\\"file\\\": {\\n      \\\"request\\\": \\\"@babel/preset-env\\\",\\n      \\\"resolved\\\": \\\"/home/destin/projects/idiot-box/node_modules/@babel/preset-env/lib/index.js\\\"\\n    }\\n  },\\n  {\\n    \\\"alias\\\": \\\"/home/destin/projects/idiot-box/node_modules/@babel/preset-env/lib/index.js\\\",\\n    \\\"dirname\\\": \\\"/home/destin/projects/idiot-box\\\",\\n    \\\"ownPass\\\": false,\\n    \\\"file\\\": {\\n      \\\"request\\\": \\\"@babel/env\\\",\\n      \\\"resolved\\\": \\\"/home/destin/projects/idiot-box/node_modules/@babel/preset-env/lib/index.js\\\"\\n    }\\n  }\\n]\\n    at assertNoDuplicates (/home/destin/projects/idiot-box/node_modules/@babel/core/lib/config/config-descriptors.js:206:13)\\n    at createDescriptors (/home/destin/projects/idiot-box/node_modules/@babel/core/lib/config/config-descriptors.js:114:3)\\n    at createPresetDescriptors (/home/destin/projects/idiot-box/node_modules/@babel/core/lib/config/config-descriptors.js:101:10)\\n    at presets (/home/destin/projects/idiot-box/node_modules/@babel/core/lib/config/config-descriptors.js:47:19)\\n    at mergeChainOpts (/home/destin/projects/idiot-box/node_modules/@babel/core/lib/config/config-chain.js:416:26)\\n    at /home/destin/projects/idiot-box/node_modules/@babel/core/lib/config/config-chain.js:374:7\\n    at Generator.next (<anonymous>)\\n    at loadFileChain (/home/destin/projects/idiot-box/node_modules/@babel/core/lib/config/config-chain.js:228:24)\\n    at loadFileChain.next (<anonymous>)\\n    at buildRootChain (/home/destin/projects/idiot-box/node_modules/@babel/core/lib/config/config-chain.js:135:29)\\n    at buildRootChain.next (<anonymous>)\\n    at loadPrivatePartialConfig (/home/destin/projects/idiot-box/node_modules/@babel/core/lib/config/partial.js:101:62)\\n    at loadPrivatePartialConfig.next (<anonymous>)\\n    at /home/destin/projects/idiot-box/node_modules/@babel/core/lib/config/partial.js:140:25\\n    at Generator.next (<anonymous>)\\n    at step (/home/destin/projects/idiot-box/node_modules/gensync/index.js:261:32)\\n    at /home/destin/projects/idiot-box/node_modules/gensync/index.js:273:13\\n    at async.call.result.err.err (/home/destin/projects/idiot-box/node_modules/gensync/index.js:223:11)\");//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvY2xpZW50L0FwcC5qcy5qcyIsInNvdXJjZXMiOltdLCJtYXBwaW5ncyI6IiIsInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///./src/client/App.js\n");

/***/ })

/******/ });