/******/ (function(modules) { // webpackBootstrap
/******/ 	function hotDisposeChunk(chunkId) {
/******/ 		delete installedChunks[chunkId];
/******/ 	}
/******/ 	var parentHotUpdateCallback = this["webpackHotUpdate"];
/******/ 	this["webpackHotUpdate"] = 
/******/ 	function webpackHotUpdateCallback(chunkId, moreModules) { // eslint-disable-line no-unused-vars
/******/ 		hotAddUpdateChunk(chunkId, moreModules);
/******/ 		if(parentHotUpdateCallback) parentHotUpdateCallback(chunkId, moreModules);
/******/ 	} ;
/******/ 	
/******/ 	function hotDownloadUpdateChunk(chunkId) { // eslint-disable-line no-unused-vars
/******/ 		var head = document.getElementsByTagName("head")[0];
/******/ 		var script = document.createElement("script");
/******/ 		script.type = "text/javascript";
/******/ 		script.charset = "utf-8";
/******/ 		script.src = __webpack_require__.p + "" + chunkId + "." + hotCurrentHash + ".hot-update.js";
/******/ 		head.appendChild(script);
/******/ 	}
/******/ 	
/******/ 	function hotDownloadManifest() { // eslint-disable-line no-unused-vars
/******/ 		return new Promise(function(resolve, reject) {
/******/ 			if(typeof XMLHttpRequest === "undefined")
/******/ 				return reject(new Error("No browser support"));
/******/ 			try {
/******/ 				var request = new XMLHttpRequest();
/******/ 				var requestPath = __webpack_require__.p + "" + hotCurrentHash + ".hot-update.json";
/******/ 				request.open("GET", requestPath, true);
/******/ 				request.timeout = 10000;
/******/ 				request.send(null);
/******/ 			} catch(err) {
/******/ 				return reject(err);
/******/ 			}
/******/ 			request.onreadystatechange = function() {
/******/ 				if(request.readyState !== 4) return;
/******/ 				if(request.status === 0) {
/******/ 					// timeout
/******/ 					reject(new Error("Manifest request to " + requestPath + " timed out."));
/******/ 				} else if(request.status === 404) {
/******/ 					// no update available
/******/ 					resolve();
/******/ 				} else if(request.status !== 200 && request.status !== 304) {
/******/ 					// other failure
/******/ 					reject(new Error("Manifest request to " + requestPath + " failed."));
/******/ 				} else {
/******/ 					// success
/******/ 					try {
/******/ 						var update = JSON.parse(request.responseText);
/******/ 					} catch(e) {
/******/ 						reject(e);
/******/ 						return;
/******/ 					}
/******/ 					resolve(update);
/******/ 				}
/******/ 			};
/******/ 		});
/******/ 	}
/******/
/******/ 	
/******/ 	
/******/ 	var hotApplyOnUpdate = true;
/******/ 	var hotCurrentHash = "9ea5cc6c0e0ef93858f6"; // eslint-disable-line no-unused-vars
/******/ 	var hotCurrentModuleData = {};
/******/ 	var hotCurrentChildModule; // eslint-disable-line no-unused-vars
/******/ 	var hotCurrentParents = []; // eslint-disable-line no-unused-vars
/******/ 	var hotCurrentParentsTemp = []; // eslint-disable-line no-unused-vars
/******/ 	
/******/ 	function hotCreateRequire(moduleId) { // eslint-disable-line no-unused-vars
/******/ 		var me = installedModules[moduleId];
/******/ 		if(!me) return __webpack_require__;
/******/ 		var fn = function(request) {
/******/ 			if(me.hot.active) {
/******/ 				if(installedModules[request]) {
/******/ 					if(installedModules[request].parents.indexOf(moduleId) < 0)
/******/ 						installedModules[request].parents.push(moduleId);
/******/ 				} else {
/******/ 					hotCurrentParents = [moduleId];
/******/ 					hotCurrentChildModule = request;
/******/ 				}
/******/ 				if(me.children.indexOf(request) < 0)
/******/ 					me.children.push(request);
/******/ 			} else {
/******/ 				console.warn("[HMR] unexpected require(" + request + ") from disposed module " + moduleId);
/******/ 				hotCurrentParents = [];
/******/ 			}
/******/ 			return __webpack_require__(request);
/******/ 		};
/******/ 		var ObjectFactory = function ObjectFactory(name) {
/******/ 			return {
/******/ 				configurable: true,
/******/ 				enumerable: true,
/******/ 				get: function() {
/******/ 					return __webpack_require__[name];
/******/ 				},
/******/ 				set: function(value) {
/******/ 					__webpack_require__[name] = value;
/******/ 				}
/******/ 			};
/******/ 		};
/******/ 		for(var name in __webpack_require__) {
/******/ 			if(Object.prototype.hasOwnProperty.call(__webpack_require__, name) && name !== "e") {
/******/ 				Object.defineProperty(fn, name, ObjectFactory(name));
/******/ 			}
/******/ 		}
/******/ 		fn.e = function(chunkId) {
/******/ 			if(hotStatus === "ready")
/******/ 				hotSetStatus("prepare");
/******/ 			hotChunksLoading++;
/******/ 			return __webpack_require__.e(chunkId).then(finishChunkLoading, function(err) {
/******/ 				finishChunkLoading();
/******/ 				throw err;
/******/ 			});
/******/ 	
/******/ 			function finishChunkLoading() {
/******/ 				hotChunksLoading--;
/******/ 				if(hotStatus === "prepare") {
/******/ 					if(!hotWaitingFilesMap[chunkId]) {
/******/ 						hotEnsureUpdateChunk(chunkId);
/******/ 					}
/******/ 					if(hotChunksLoading === 0 && hotWaitingFiles === 0) {
/******/ 						hotUpdateDownloaded();
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 		return fn;
/******/ 	}
/******/ 	
/******/ 	function hotCreateModule(moduleId) { // eslint-disable-line no-unused-vars
/******/ 		var hot = {
/******/ 			// private stuff
/******/ 			_acceptedDependencies: {},
/******/ 			_declinedDependencies: {},
/******/ 			_selfAccepted: false,
/******/ 			_selfDeclined: false,
/******/ 			_disposeHandlers: [],
/******/ 			_main: hotCurrentChildModule !== moduleId,
/******/ 	
/******/ 			// Module API
/******/ 			active: true,
/******/ 			accept: function(dep, callback) {
/******/ 				if(typeof dep === "undefined")
/******/ 					hot._selfAccepted = true;
/******/ 				else if(typeof dep === "function")
/******/ 					hot._selfAccepted = dep;
/******/ 				else if(typeof dep === "object")
/******/ 					for(var i = 0; i < dep.length; i++)
/******/ 						hot._acceptedDependencies[dep[i]] = callback || function() {};
/******/ 				else
/******/ 					hot._acceptedDependencies[dep] = callback || function() {};
/******/ 			},
/******/ 			decline: function(dep) {
/******/ 				if(typeof dep === "undefined")
/******/ 					hot._selfDeclined = true;
/******/ 				else if(typeof dep === "object")
/******/ 					for(var i = 0; i < dep.length; i++)
/******/ 						hot._declinedDependencies[dep[i]] = true;
/******/ 				else
/******/ 					hot._declinedDependencies[dep] = true;
/******/ 			},
/******/ 			dispose: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			addDisposeHandler: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			removeDisposeHandler: function(callback) {
/******/ 				var idx = hot._disposeHandlers.indexOf(callback);
/******/ 				if(idx >= 0) hot._disposeHandlers.splice(idx, 1);
/******/ 			},
/******/ 	
/******/ 			// Management API
/******/ 			check: hotCheck,
/******/ 			apply: hotApply,
/******/ 			status: function(l) {
/******/ 				if(!l) return hotStatus;
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			addStatusHandler: function(l) {
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			removeStatusHandler: function(l) {
/******/ 				var idx = hotStatusHandlers.indexOf(l);
/******/ 				if(idx >= 0) hotStatusHandlers.splice(idx, 1);
/******/ 			},
/******/ 	
/******/ 			//inherit from previous dispose call
/******/ 			data: hotCurrentModuleData[moduleId]
/******/ 		};
/******/ 		hotCurrentChildModule = undefined;
/******/ 		return hot;
/******/ 	}
/******/ 	
/******/ 	var hotStatusHandlers = [];
/******/ 	var hotStatus = "idle";
/******/ 	
/******/ 	function hotSetStatus(newStatus) {
/******/ 		hotStatus = newStatus;
/******/ 		for(var i = 0; i < hotStatusHandlers.length; i++)
/******/ 			hotStatusHandlers[i].call(null, newStatus);
/******/ 	}
/******/ 	
/******/ 	// while downloading
/******/ 	var hotWaitingFiles = 0;
/******/ 	var hotChunksLoading = 0;
/******/ 	var hotWaitingFilesMap = {};
/******/ 	var hotRequestedFilesMap = {};
/******/ 	var hotAvailableFilesMap = {};
/******/ 	var hotDeferred;
/******/ 	
/******/ 	// The update info
/******/ 	var hotUpdate, hotUpdateNewHash;
/******/ 	
/******/ 	function toModuleId(id) {
/******/ 		var isNumber = (+id) + "" === id;
/******/ 		return isNumber ? +id : id;
/******/ 	}
/******/ 	
/******/ 	function hotCheck(apply) {
/******/ 		if(hotStatus !== "idle") throw new Error("check() is only allowed in idle status");
/******/ 		hotApplyOnUpdate = apply;
/******/ 		hotSetStatus("check");
/******/ 		return hotDownloadManifest().then(function(update) {
/******/ 			if(!update) {
/******/ 				hotSetStatus("idle");
/******/ 				return null;
/******/ 			}
/******/ 			hotRequestedFilesMap = {};
/******/ 			hotWaitingFilesMap = {};
/******/ 			hotAvailableFilesMap = update.c;
/******/ 			hotUpdateNewHash = update.h;
/******/ 	
/******/ 			hotSetStatus("prepare");
/******/ 			var promise = new Promise(function(resolve, reject) {
/******/ 				hotDeferred = {
/******/ 					resolve: resolve,
/******/ 					reject: reject
/******/ 				};
/******/ 			});
/******/ 			hotUpdate = {};
/******/ 			var chunkId = 0;
/******/ 			{ // eslint-disable-line no-lone-blocks
/******/ 				/*globals chunkId */
/******/ 				hotEnsureUpdateChunk(chunkId);
/******/ 			}
/******/ 			if(hotStatus === "prepare" && hotChunksLoading === 0 && hotWaitingFiles === 0) {
/******/ 				hotUpdateDownloaded();
/******/ 			}
/******/ 			return promise;
/******/ 		});
/******/ 	}
/******/ 	
/******/ 	function hotAddUpdateChunk(chunkId, moreModules) { // eslint-disable-line no-unused-vars
/******/ 		if(!hotAvailableFilesMap[chunkId] || !hotRequestedFilesMap[chunkId])
/******/ 			return;
/******/ 		hotRequestedFilesMap[chunkId] = false;
/******/ 		for(var moduleId in moreModules) {
/******/ 			if(Object.prototype.hasOwnProperty.call(moreModules, moduleId)) {
/******/ 				hotUpdate[moduleId] = moreModules[moduleId];
/******/ 			}
/******/ 		}
/******/ 		if(--hotWaitingFiles === 0 && hotChunksLoading === 0) {
/******/ 			hotUpdateDownloaded();
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotEnsureUpdateChunk(chunkId) {
/******/ 		if(!hotAvailableFilesMap[chunkId]) {
/******/ 			hotWaitingFilesMap[chunkId] = true;
/******/ 		} else {
/******/ 			hotRequestedFilesMap[chunkId] = true;
/******/ 			hotWaitingFiles++;
/******/ 			hotDownloadUpdateChunk(chunkId);
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotUpdateDownloaded() {
/******/ 		hotSetStatus("ready");
/******/ 		var deferred = hotDeferred;
/******/ 		hotDeferred = null;
/******/ 		if(!deferred) return;
/******/ 		if(hotApplyOnUpdate) {
/******/ 			hotApply(hotApplyOnUpdate).then(function(result) {
/******/ 				deferred.resolve(result);
/******/ 			}, function(err) {
/******/ 				deferred.reject(err);
/******/ 			});
/******/ 		} else {
/******/ 			var outdatedModules = [];
/******/ 			for(var id in hotUpdate) {
/******/ 				if(Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 					outdatedModules.push(toModuleId(id));
/******/ 				}
/******/ 			}
/******/ 			deferred.resolve(outdatedModules);
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotApply(options) {
/******/ 		if(hotStatus !== "ready") throw new Error("apply() is only allowed in ready status");
/******/ 		options = options || {};
/******/ 	
/******/ 		var cb;
/******/ 		var i;
/******/ 		var j;
/******/ 		var module;
/******/ 		var moduleId;
/******/ 	
/******/ 		function getAffectedStuff(updateModuleId) {
/******/ 			var outdatedModules = [updateModuleId];
/******/ 			var outdatedDependencies = {};
/******/ 	
/******/ 			var queue = outdatedModules.slice().map(function(id) {
/******/ 				return {
/******/ 					chain: [id],
/******/ 					id: id
/******/ 				};
/******/ 			});
/******/ 			while(queue.length > 0) {
/******/ 				var queueItem = queue.pop();
/******/ 				var moduleId = queueItem.id;
/******/ 				var chain = queueItem.chain;
/******/ 				module = installedModules[moduleId];
/******/ 				if(!module || module.hot._selfAccepted)
/******/ 					continue;
/******/ 				if(module.hot._selfDeclined) {
/******/ 					return {
/******/ 						type: "self-declined",
/******/ 						chain: chain,
/******/ 						moduleId: moduleId
/******/ 					};
/******/ 				}
/******/ 				if(module.hot._main) {
/******/ 					return {
/******/ 						type: "unaccepted",
/******/ 						chain: chain,
/******/ 						moduleId: moduleId
/******/ 					};
/******/ 				}
/******/ 				for(var i = 0; i < module.parents.length; i++) {
/******/ 					var parentId = module.parents[i];
/******/ 					var parent = installedModules[parentId];
/******/ 					if(!parent) continue;
/******/ 					if(parent.hot._declinedDependencies[moduleId]) {
/******/ 						return {
/******/ 							type: "declined",
/******/ 							chain: chain.concat([parentId]),
/******/ 							moduleId: moduleId,
/******/ 							parentId: parentId
/******/ 						};
/******/ 					}
/******/ 					if(outdatedModules.indexOf(parentId) >= 0) continue;
/******/ 					if(parent.hot._acceptedDependencies[moduleId]) {
/******/ 						if(!outdatedDependencies[parentId])
/******/ 							outdatedDependencies[parentId] = [];
/******/ 						addAllToSet(outdatedDependencies[parentId], [moduleId]);
/******/ 						continue;
/******/ 					}
/******/ 					delete outdatedDependencies[parentId];
/******/ 					outdatedModules.push(parentId);
/******/ 					queue.push({
/******/ 						chain: chain.concat([parentId]),
/******/ 						id: parentId
/******/ 					});
/******/ 				}
/******/ 			}
/******/ 	
/******/ 			return {
/******/ 				type: "accepted",
/******/ 				moduleId: updateModuleId,
/******/ 				outdatedModules: outdatedModules,
/******/ 				outdatedDependencies: outdatedDependencies
/******/ 			};
/******/ 		}
/******/ 	
/******/ 		function addAllToSet(a, b) {
/******/ 			for(var i = 0; i < b.length; i++) {
/******/ 				var item = b[i];
/******/ 				if(a.indexOf(item) < 0)
/******/ 					a.push(item);
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// at begin all updates modules are outdated
/******/ 		// the "outdated" status can propagate to parents if they don't accept the children
/******/ 		var outdatedDependencies = {};
/******/ 		var outdatedModules = [];
/******/ 		var appliedUpdate = {};
/******/ 	
/******/ 		var warnUnexpectedRequire = function warnUnexpectedRequire() {
/******/ 			console.warn("[HMR] unexpected require(" + result.moduleId + ") to disposed module");
/******/ 		};
/******/ 	
/******/ 		for(var id in hotUpdate) {
/******/ 			if(Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 				moduleId = toModuleId(id);
/******/ 				var result;
/******/ 				if(hotUpdate[id]) {
/******/ 					result = getAffectedStuff(moduleId);
/******/ 				} else {
/******/ 					result = {
/******/ 						type: "disposed",
/******/ 						moduleId: id
/******/ 					};
/******/ 				}
/******/ 				var abortError = false;
/******/ 				var doApply = false;
/******/ 				var doDispose = false;
/******/ 				var chainInfo = "";
/******/ 				if(result.chain) {
/******/ 					chainInfo = "\nUpdate propagation: " + result.chain.join(" -> ");
/******/ 				}
/******/ 				switch(result.type) {
/******/ 					case "self-declined":
/******/ 						if(options.onDeclined)
/******/ 							options.onDeclined(result);
/******/ 						if(!options.ignoreDeclined)
/******/ 							abortError = new Error("Aborted because of self decline: " + result.moduleId + chainInfo);
/******/ 						break;
/******/ 					case "declined":
/******/ 						if(options.onDeclined)
/******/ 							options.onDeclined(result);
/******/ 						if(!options.ignoreDeclined)
/******/ 							abortError = new Error("Aborted because of declined dependency: " + result.moduleId + " in " + result.parentId + chainInfo);
/******/ 						break;
/******/ 					case "unaccepted":
/******/ 						if(options.onUnaccepted)
/******/ 							options.onUnaccepted(result);
/******/ 						if(!options.ignoreUnaccepted)
/******/ 							abortError = new Error("Aborted because " + moduleId + " is not accepted" + chainInfo);
/******/ 						break;
/******/ 					case "accepted":
/******/ 						if(options.onAccepted)
/******/ 							options.onAccepted(result);
/******/ 						doApply = true;
/******/ 						break;
/******/ 					case "disposed":
/******/ 						if(options.onDisposed)
/******/ 							options.onDisposed(result);
/******/ 						doDispose = true;
/******/ 						break;
/******/ 					default:
/******/ 						throw new Error("Unexception type " + result.type);
/******/ 				}
/******/ 				if(abortError) {
/******/ 					hotSetStatus("abort");
/******/ 					return Promise.reject(abortError);
/******/ 				}
/******/ 				if(doApply) {
/******/ 					appliedUpdate[moduleId] = hotUpdate[moduleId];
/******/ 					addAllToSet(outdatedModules, result.outdatedModules);
/******/ 					for(moduleId in result.outdatedDependencies) {
/******/ 						if(Object.prototype.hasOwnProperty.call(result.outdatedDependencies, moduleId)) {
/******/ 							if(!outdatedDependencies[moduleId])
/******/ 								outdatedDependencies[moduleId] = [];
/******/ 							addAllToSet(outdatedDependencies[moduleId], result.outdatedDependencies[moduleId]);
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 				if(doDispose) {
/******/ 					addAllToSet(outdatedModules, [result.moduleId]);
/******/ 					appliedUpdate[moduleId] = warnUnexpectedRequire;
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Store self accepted outdated modules to require them later by the module system
/******/ 		var outdatedSelfAcceptedModules = [];
/******/ 		for(i = 0; i < outdatedModules.length; i++) {
/******/ 			moduleId = outdatedModules[i];
/******/ 			if(installedModules[moduleId] && installedModules[moduleId].hot._selfAccepted)
/******/ 				outdatedSelfAcceptedModules.push({
/******/ 					module: moduleId,
/******/ 					errorHandler: installedModules[moduleId].hot._selfAccepted
/******/ 				});
/******/ 		}
/******/ 	
/******/ 		// Now in "dispose" phase
/******/ 		hotSetStatus("dispose");
/******/ 		Object.keys(hotAvailableFilesMap).forEach(function(chunkId) {
/******/ 			if(hotAvailableFilesMap[chunkId] === false) {
/******/ 				hotDisposeChunk(chunkId);
/******/ 			}
/******/ 		});
/******/ 	
/******/ 		var idx;
/******/ 		var queue = outdatedModules.slice();
/******/ 		while(queue.length > 0) {
/******/ 			moduleId = queue.pop();
/******/ 			module = installedModules[moduleId];
/******/ 			if(!module) continue;
/******/ 	
/******/ 			var data = {};
/******/ 	
/******/ 			// Call dispose handlers
/******/ 			var disposeHandlers = module.hot._disposeHandlers;
/******/ 			for(j = 0; j < disposeHandlers.length; j++) {
/******/ 				cb = disposeHandlers[j];
/******/ 				cb(data);
/******/ 			}
/******/ 			hotCurrentModuleData[moduleId] = data;
/******/ 	
/******/ 			// disable module (this disables requires from this module)
/******/ 			module.hot.active = false;
/******/ 	
/******/ 			// remove module from cache
/******/ 			delete installedModules[moduleId];
/******/ 	
/******/ 			// remove "parents" references from all children
/******/ 			for(j = 0; j < module.children.length; j++) {
/******/ 				var child = installedModules[module.children[j]];
/******/ 				if(!child) continue;
/******/ 				idx = child.parents.indexOf(moduleId);
/******/ 				if(idx >= 0) {
/******/ 					child.parents.splice(idx, 1);
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// remove outdated dependency from module children
/******/ 		var dependency;
/******/ 		var moduleOutdatedDependencies;
/******/ 		for(moduleId in outdatedDependencies) {
/******/ 			if(Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)) {
/******/ 				module = installedModules[moduleId];
/******/ 				if(module) {
/******/ 					moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 					for(j = 0; j < moduleOutdatedDependencies.length; j++) {
/******/ 						dependency = moduleOutdatedDependencies[j];
/******/ 						idx = module.children.indexOf(dependency);
/******/ 						if(idx >= 0) module.children.splice(idx, 1);
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Not in "apply" phase
/******/ 		hotSetStatus("apply");
/******/ 	
/******/ 		hotCurrentHash = hotUpdateNewHash;
/******/ 	
/******/ 		// insert new code
/******/ 		for(moduleId in appliedUpdate) {
/******/ 			if(Object.prototype.hasOwnProperty.call(appliedUpdate, moduleId)) {
/******/ 				modules[moduleId] = appliedUpdate[moduleId];
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// call accept handlers
/******/ 		var error = null;
/******/ 		for(moduleId in outdatedDependencies) {
/******/ 			if(Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)) {
/******/ 				module = installedModules[moduleId];
/******/ 				moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 				var callbacks = [];
/******/ 				for(i = 0; i < moduleOutdatedDependencies.length; i++) {
/******/ 					dependency = moduleOutdatedDependencies[i];
/******/ 					cb = module.hot._acceptedDependencies[dependency];
/******/ 					if(callbacks.indexOf(cb) >= 0) continue;
/******/ 					callbacks.push(cb);
/******/ 				}
/******/ 				for(i = 0; i < callbacks.length; i++) {
/******/ 					cb = callbacks[i];
/******/ 					try {
/******/ 						cb(moduleOutdatedDependencies);
/******/ 					} catch(err) {
/******/ 						if(options.onErrored) {
/******/ 							options.onErrored({
/******/ 								type: "accept-errored",
/******/ 								moduleId: moduleId,
/******/ 								dependencyId: moduleOutdatedDependencies[i],
/******/ 								error: err
/******/ 							});
/******/ 						}
/******/ 						if(!options.ignoreErrored) {
/******/ 							if(!error)
/******/ 								error = err;
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Load self accepted modules
/******/ 		for(i = 0; i < outdatedSelfAcceptedModules.length; i++) {
/******/ 			var item = outdatedSelfAcceptedModules[i];
/******/ 			moduleId = item.module;
/******/ 			hotCurrentParents = [moduleId];
/******/ 			try {
/******/ 				__webpack_require__(moduleId);
/******/ 			} catch(err) {
/******/ 				if(typeof item.errorHandler === "function") {
/******/ 					try {
/******/ 						item.errorHandler(err);
/******/ 					} catch(err2) {
/******/ 						if(options.onErrored) {
/******/ 							options.onErrored({
/******/ 								type: "self-accept-error-handler-errored",
/******/ 								moduleId: moduleId,
/******/ 								error: err2,
/******/ 								orginalError: err
/******/ 							});
/******/ 						}
/******/ 						if(!options.ignoreErrored) {
/******/ 							if(!error)
/******/ 								error = err2;
/******/ 						}
/******/ 						if(!error)
/******/ 							error = err;
/******/ 					}
/******/ 				} else {
/******/ 					if(options.onErrored) {
/******/ 						options.onErrored({
/******/ 							type: "self-accept-errored",
/******/ 							moduleId: moduleId,
/******/ 							error: err
/******/ 						});
/******/ 					}
/******/ 					if(!options.ignoreErrored) {
/******/ 						if(!error)
/******/ 							error = err;
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// handle errors in accept handlers and self accepted module load
/******/ 		if(error) {
/******/ 			hotSetStatus("fail");
/******/ 			return Promise.reject(error);
/******/ 		}
/******/ 	
/******/ 		hotSetStatus("idle");
/******/ 		return new Promise(function(resolve) {
/******/ 			resolve(outdatedModules);
/******/ 		});
/******/ 	}
/******/
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
/******/ 			exports: {},
/******/ 			hot: hotCreateModule(moduleId),
/******/ 			parents: (hotCurrentParentsTemp = hotCurrentParents, hotCurrentParents = [], hotCurrentParentsTemp),
/******/ 			children: []
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, hotCreateRequire(moduleId));
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
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
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
/******/ 	__webpack_require__.p = "dist/";
/******/
/******/ 	// __webpack_hash__
/******/ 	__webpack_require__.h = function() { return hotCurrentHash; };
/******/
/******/ 	// Load entry module and return exports
/******/ 	return hotCreateRequire(44)(__webpack_require__.s = 44);
/******/ })
/************************************************************************/
/******/ ({

/***/ 0:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {/* harmony export (immutable) */ __webpack_exports__["e"] = AggregateError;
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "d", function() { return FEATURE; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return PLATFORM; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return DOM; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return isInitialized; });
/* harmony export (immutable) */ __webpack_exports__["f"] = initializePAL;
/* unused harmony export reset */

function AggregateError(message, innerError, skipIfAlreadyAggregate) {
  if (innerError) {
    if (innerError.innerError && skipIfAlreadyAggregate) {
      return innerError;
    }

    var separator = '\n------------------------------------------------\n';

    message += separator + 'Inner Error:\n';

    if (typeof innerError === 'string') {
      message += 'Message: ' + innerError;
    } else {
      if (innerError.message) {
        message += 'Message: ' + innerError.message;
      } else {
        message += 'Unknown Inner Error Type. Displaying Inner Error as JSON:\n ' + JSON.stringify(innerError, null, '  ');
      }

      if (innerError.stack) {
        message += '\nInner Error Stack:\n' + innerError.stack;
        message += '\nEnd Inner Error Stack';
      }
    }

    message += separator;
  }

  var e = new Error(message);
  if (innerError) {
    e.innerError = innerError;
  }

  return e;
}

var FEATURE = {};

var PLATFORM = {
  noop: function noop() {},
  eachModule: function eachModule() {},
  moduleName: function (_moduleName) {
    function moduleName(_x) {
      return _moduleName.apply(this, arguments);
    }

    moduleName.toString = function () {
      return _moduleName.toString();
    };

    return moduleName;
  }(function (moduleName) {
    return moduleName;
  })
};

PLATFORM.global = function () {
  if (typeof self !== 'undefined') {
    return self;
  }

  if (typeof global !== 'undefined') {
    return global;
  }

  return new Function('return this')();
}();

var DOM = {};
var isInitialized = false;

function initializePAL(callback) {
  if (isInitialized) {
    return;
  }
  isInitialized = true;
  if (typeof Object.getPropertyDescriptor !== 'function') {
    Object.getPropertyDescriptor = function (subject, name) {
      var pd = Object.getOwnPropertyDescriptor(subject, name);
      var proto = Object.getPrototypeOf(subject);
      while (typeof pd === 'undefined' && proto !== null) {
        pd = Object.getOwnPropertyDescriptor(proto, name);
        proto = Object.getPrototypeOf(proto);
      }
      return pd;
    };
  }

  callback(PLATFORM, FEATURE, DOM);
}
function reset() {
  isInitialized = false;
}
/* WEBPACK VAR INJECTION */}.call(__webpack_exports__, __webpack_require__(41)))

/***/ }),

/***/ 1:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return metadata; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return Origin; });
/* unused harmony export decorators */
/* unused harmony export deprecated */
/* harmony export (immutable) */ __webpack_exports__["d"] = mixin;
/* harmony export (immutable) */ __webpack_exports__["b"] = protocol;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_aurelia_pal__ = __webpack_require__(0);
var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };





function isObject(val) {
  return val && (typeof val === 'function' || (typeof val === 'undefined' ? 'undefined' : _typeof(val)) === 'object');
}

var metadata = {
  resource: 'aurelia:resource',
  paramTypes: 'design:paramtypes',
  propertyType: 'design:type',
  properties: 'design:properties',
  get: function get(metadataKey, target, targetKey) {
    if (!isObject(target)) {
      return undefined;
    }
    var result = metadata.getOwn(metadataKey, target, targetKey);
    return result === undefined ? metadata.get(metadataKey, Object.getPrototypeOf(target), targetKey) : result;
  },
  getOwn: function getOwn(metadataKey, target, targetKey) {
    if (!isObject(target)) {
      return undefined;
    }
    return Reflect.getOwnMetadata(metadataKey, target, targetKey);
  },
  define: function define(metadataKey, metadataValue, target, targetKey) {
    Reflect.defineMetadata(metadataKey, metadataValue, target, targetKey);
  },
  getOrCreateOwn: function getOrCreateOwn(metadataKey, Type, target, targetKey) {
    var result = metadata.getOwn(metadataKey, target, targetKey);

    if (result === undefined) {
      result = new Type();
      Reflect.defineMetadata(metadataKey, result, target, targetKey);
    }

    return result;
  }
};

var originStorage = new Map();
var unknownOrigin = Object.freeze({ moduleId: undefined, moduleMember: undefined });

var Origin = function () {
  function Origin(moduleId, moduleMember) {
    

    this.moduleId = moduleId;
    this.moduleMember = moduleMember;
  }

  Origin.get = function get(fn) {
    var origin = originStorage.get(fn);

    if (origin === undefined) {
      __WEBPACK_IMPORTED_MODULE_0_aurelia_pal__["a" /* PLATFORM */].eachModule(function (key, value) {
        if ((typeof value === 'undefined' ? 'undefined' : _typeof(value)) === 'object') {
          for (var name in value) {
            try {
              var exp = value[name];
              if (exp === fn) {
                originStorage.set(fn, origin = new Origin(key, name));
                return true;
              }
            } catch (e) {}
          }
        }

        if (value === fn) {
          originStorage.set(fn, origin = new Origin(key, 'default'));
          return true;
        }

        return false;
      });
    }

    return origin || unknownOrigin;
  };

  Origin.set = function set(fn, origin) {
    originStorage.set(fn, origin);
  };

  return Origin;
}();

function decorators() {
  for (var _len = arguments.length, rest = Array(_len), _key = 0; _key < _len; _key++) {
    rest[_key] = arguments[_key];
  }

  var applicator = function applicator(target, key, descriptor) {
    var i = rest.length;

    if (key) {
      descriptor = descriptor || {
        value: target[key],
        writable: true,
        configurable: true,
        enumerable: true
      };

      while (i--) {
        descriptor = rest[i](target, key, descriptor) || descriptor;
      }

      Object.defineProperty(target, key, descriptor);
    } else {
      while (i--) {
        target = rest[i](target) || target;
      }
    }

    return target;
  };

  applicator.on = applicator;
  return applicator;
}

function deprecated(optionsOrTarget, maybeKey, maybeDescriptor) {
  function decorator(target, key, descriptor) {
    var methodSignature = target.constructor.name + '#' + key;
    var options = maybeKey ? {} : optionsOrTarget || {};
    var message = 'DEPRECATION - ' + methodSignature;

    if (typeof descriptor.value !== 'function') {
      throw new SyntaxError('Only methods can be marked as deprecated.');
    }

    if (options.message) {
      message += ' - ' + options.message;
    }

    return _extends({}, descriptor, {
      value: function deprecationWrapper() {
        if (options.error) {
          throw new Error(message);
        } else {
          console.warn(message);
        }

        return descriptor.value.apply(this, arguments);
      }
    });
  }

  return maybeKey ? decorator(optionsOrTarget, maybeKey, maybeDescriptor) : decorator;
}

function mixin(behavior) {
  var instanceKeys = Object.keys(behavior);

  function _mixin(possible) {
    var decorator = function decorator(target) {
      var resolvedTarget = typeof target === 'function' ? target.prototype : target;

      var i = instanceKeys.length;
      while (i--) {
        var property = instanceKeys[i];
        Object.defineProperty(resolvedTarget, property, {
          value: behavior[property],
          writable: true
        });
      }
    };

    return possible ? decorator(possible) : decorator;
  }

  return _mixin;
}

function alwaysValid() {
  return true;
}
function noCompose() {}

function ensureProtocolOptions(options) {
  if (options === undefined) {
    options = {};
  } else if (typeof options === 'function') {
    options = {
      validate: options
    };
  }

  if (!options.validate) {
    options.validate = alwaysValid;
  }

  if (!options.compose) {
    options.compose = noCompose;
  }

  return options;
}

function createProtocolValidator(validate) {
  return function (target) {
    var result = validate(target);
    return result === true;
  };
}

function createProtocolAsserter(name, validate) {
  return function (target) {
    var result = validate(target);
    if (result !== true) {
      throw new Error(result || name + ' was not correctly implemented.');
    }
  };
}

function protocol(name, options) {
  options = ensureProtocolOptions(options);

  var result = function result(target) {
    var resolvedTarget = typeof target === 'function' ? target.prototype : target;

    options.compose(resolvedTarget);
    result.assert(resolvedTarget);

    Object.defineProperty(resolvedTarget, 'protocol:' + name, {
      enumerable: false,
      configurable: false,
      writable: false,
      value: true
    });
  };

  result.validate = createProtocolValidator(options.validate);
  result.assert = createProtocolAsserter(name, options.validate);

  return result;
}

protocol.create = function (name, options) {
  options = ensureProtocolOptions(options);
  var hidden = 'protocol:' + name;
  var result = function result(target) {
    var decorator = protocol(name, options);
    return target ? decorator(target) : decorator;
  };

  result.decorates = function (obj) {
    return obj[hidden] === true;
  };
  result.validate = createProtocolValidator(options.validate);
  result.assert = createProtocolAsserter(name, options.validate);

  return result;
};

/***/ }),

/***/ 10:
/***/ (function(module, exports) {

module.exports = vendor_20ab9117cc13a042c964;

/***/ }),

/***/ 11:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return History; });


function mi(name) {
  throw new Error('History must implement ' + name + '().');
}

var History = function () {
  function History() {
    
  }

  History.prototype.activate = function activate(options) {
    mi('activate');
  };

  History.prototype.deactivate = function deactivate() {
    mi('deactivate');
  };

  History.prototype.getAbsoluteRoot = function getAbsoluteRoot() {
    mi('getAbsoluteRoot');
  };

  History.prototype.navigate = function navigate(fragment, options) {
    mi('navigate');
  };

  History.prototype.navigateBack = function navigateBack() {
    mi('navigateBack');
  };

  History.prototype.setTitle = function setTitle(title) {
    mi('setTitle');
  };

  History.prototype.setState = function setState(key, value) {
    mi('setState');
  };

  History.prototype.getState = function getState(key) {
    mi('getState');
  };

  History.prototype.getHistoryIndex = function getHistoryIndex() {
    mi('getHistoryIndex');
  };

  History.prototype.go = function go(movement) {
    mi('go');
  };

  return History;
}();

/***/ }),

/***/ 12:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (immutable) */ __webpack_exports__["getAuElements"] = getAuElements;
/* harmony export (immutable) */ __webpack_exports__["getControllersWithClassInstances"] = getControllersWithClassInstances;
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "HmrContext", function() { return HmrContext; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_aurelia_pal__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_aurelia_metadata__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_aurelia_templating__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_aurelia_dependency_injection__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__hmr_css_resource__ = __webpack_require__(22);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__view_model_traverse_controller__ = __webpack_require__(24);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__view_traverse_controller__ = __webpack_require__(25);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__render_utils__ = __webpack_require__(23);
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t;
    return { next: verb(0), "throw": verb(1), "return": verb(2) };
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};








var UndefinedResourceModule = { id: null, mainResource: { metadata: {}, value: undefined } };
function getAuElements() {
    return Array.from(__WEBPACK_IMPORTED_MODULE_0_aurelia_pal__["c" /* DOM */].querySelectorAll('.au-target'));
}
function getControllersWithClassInstances(oldPrototype) {
    // get visible elements to re-render:
    var auElements = getAuElements();
    /* NOTE: viewless components like blur-image do not have el.au.controller set */
    var controllersLists = auElements.map(function (el) { return el.au && Object.values(el.au) || []; });
    // list of unique controllers
    var controllers = Array.from(new Set((_a = []).concat.apply(_a, controllersLists)));
    var previouslyTraversed = new Set();
    var traversalInfo = (_b = []).concat.apply(_b, controllers.map(function (parentController) {
        return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_5__view_model_traverse_controller__["a" /* traverseController */])(oldPrototype, parentController, {
            previouslyTraversed: previouslyTraversed,
            parentController: parentController
        });
    }));
    return traversalInfo;
    var _a, _b;
}
var HmrContext = (function () {
    function HmrContext(loader) {
        var _this = this;
        this.loader = loader;
        this.viewEngine = __WEBPACK_IMPORTED_MODULE_3_aurelia_dependency_injection__["a" /* Container */].instance.get(__WEBPACK_IMPORTED_MODULE_2_aurelia_templating__["f" /* ViewEngine */]);
        this.moduleAnalyzerCache = this.viewEngine.moduleAnalyzer.cache;
        var styleResourcePlugin = {
            fetch: function (moduleId) {
                return _a = {},
                    _a[moduleId] = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_4__hmr_css_resource__["a" /* _createCSSResource */])(moduleId),
                    _a;
                var _a;
            },
            hot: function (moduleId) {
                _this.reloadCss(moduleId);
            }
        };
        ['.css', '.less', '.sass', '.scss', '.styl'].forEach(function (ext) { return _this.viewEngine.addResourcePlugin(ext, styleResourcePlugin); });
    }
    /**
     * Handles ViewModel changes
     */
    HmrContext.prototype.handleModuleChange = function (moduleId, hot) {
        return __awaiter(this, void 0, void 0, function () {
            var previousModule, newModule, oldResourceModule, newResourceModule, origin, normalizedId, moduleMember, keys;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        previousModule = this.loader.moduleRegistry[moduleId];
                        if (!previousModule) {
                            return [2 /*return*/];
                        }
                        console.log("Running default HMR for " + moduleId);
                        // reload fresh module:
                        delete this.loader.moduleRegistry[moduleId];
                        return [4 /*yield*/, this.loader.loadModule(moduleId)];
                    case 1:
                        newModule = _a.sent();
                        oldResourceModule = this.moduleAnalyzerCache[moduleId];
                        if (oldResourceModule) {
                            origin = __WEBPACK_IMPORTED_MODULE_1_aurelia_metadata__["c" /* Origin */].get(newModule);
                            normalizedId = origin.moduleId;
                            moduleMember = origin.moduleMember;
                            newResourceModule = this.viewEngine.moduleAnalyzer.analyze(normalizedId, newModule, moduleMember);
                            if (!newResourceModule.mainResource && !newResourceModule.resources) {
                                hot.decline(moduleId);
                                return [2 /*return*/];
                            }
                            if (newResourceModule.mainResource) {
                                newResourceModule.initialize(this.viewEngine.container);
                            }
                            // monkey patch old resource module:
                            // would be better to simply replace it everywhere
                            Object.assign(oldResourceModule, newResourceModule);
                        }
                        // TODO: kinda CompositionEngine.ensureViewModel()
                        // TODO: to replace - use closest container: childContainer.get(viewModelResource.value);
                        if (previousModule instanceof Object) {
                            keys = Object.keys(previousModule);
                            keys.forEach(function (key) {
                                var newExportValue = newModule[key];
                                if (!newExportValue) {
                                    return;
                                }
                                var previousExportValue = previousModule[key];
                                var type = typeof previousExportValue;
                                if (type === 'function' || type === 'object') {
                                    // these are the only exports we can reliably replace (classes, objects and functions)
                                    console.log("Analyzing " + moduleId + "->" + key);
                                    var traversalInfo = getControllersWithClassInstances(previousExportValue);
                                    // console.log(traversalInfo);
                                    traversalInfo.forEach(function (info) {
                                        if (info.propertyInParent === undefined) {
                                            return;
                                        }
                                        if (info.instance) {
                                            var entry = info.immediateParent[info.propertyInParent];
                                            var newPrototype = newExportValue.prototype;
                                            if (newPrototype) {
                                                Object.setPrototypeOf(entry, newPrototype);
                                            }
                                            else {
                                                console.warn("No new prototype for " + moduleId + "->" + key);
                                            }
                                            if (info.relatedView && info.relatedView.isBound) {
                                                var _a = info.relatedView, bindingContext = _a.bindingContext, overrideContext = _a.overrideContext;
                                                info.relatedView.unbind();
                                                info.relatedView.bind(bindingContext, overrideContext);
                                            }
                                        }
                                        else {
                                            console.log("Replacing", info.immediateParent[info.propertyInParent], "with", newExportValue);
                                            info.immediateParent[info.propertyInParent] = newExportValue;
                                        }
                                    });
                                }
                            });
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Handles Hot Reloading when a View changes
     *
     * TODO: make a queue of changes and handle after few ms multiple TOGETHER
     */
    HmrContext.prototype.handleViewChange = function (moduleId) {
        return __awaiter(this, void 0, void 0, function () {
            var templateModuleId, entry, originalFactory, _a, mainResource, associatedModuleId, htmlBehaviorResource, targetClass, compileInstruction, newViewFactory, elementsToReRender, factoryToRenderWith;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        templateModuleId = this.loader.applyPluginToUrl(moduleId, 'template-registry-entry');
                        console.log("Handling HMR for " + moduleId);
                        entry = this.loader.getOrCreateTemplateRegistryEntry(moduleId);
                        // delete it, and the module from caches:
                        delete this.loader.templateRegistry[moduleId];
                        delete this.loader.moduleRegistry[moduleId];
                        delete this.loader.moduleRegistry[templateModuleId];
                        originalFactory = entry.factory;
                        // just to be safe, lets patch up the old ViewFactory
                        if (!originalFactory) {
                            console.error("Something's gone wrong, no original ViewFactory?!");
                            return [2 /*return*/];
                        }
                        _a = this.getResourceModuleByTemplate(originalFactory.template), mainResource = _a.mainResource, associatedModuleId = _a.id;
                        htmlBehaviorResource = mainResource.metadata, targetClass = mainResource.value;
                        if (entry.factory !== htmlBehaviorResource.viewFactory) {
                            console.info("Different origin factories", entry.factory, htmlBehaviorResource.viewFactory);
                        }
                        compileInstruction = new __WEBPACK_IMPORTED_MODULE_2_aurelia_templating__["y" /* ViewCompileInstruction */](htmlBehaviorResource.targetShadowDOM, true);
                        compileInstruction.associatedModuleId = associatedModuleId;
                        return [4 /*yield*/, this.viewEngine.loadViewFactory(moduleId, compileInstruction, null, targetClass)];
                    case 1:
                        newViewFactory = (_b.sent());
                        // TODO: keep track of hidden Views, e.g. 
                        // using beforeBind or mutation-observers https://dev.opera.com/articles/mutation-observers-tutorial/
                        // NOTES:
                        // the document-fragment in the newViewFactory has different numbers for the same resources:
                        // newViewFactory.instructions -- have different numbers than originalFactory
                        // newViewFactory.resources.elements -- contains the resources of children but not the SELF HtmlBehaviorResource
                        // monkey-patch the template just in case references to it are lying still around somewhere:
                        originalFactory.template = newViewFactory.template;
                        originalFactory.instructions = newViewFactory.instructions;
                        originalFactory.resources = newViewFactory.resources;
                        elementsToReRender = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_6__view_traverse_controller__["a" /* getElementsToRerender */])(originalFactory.template);
                        factoryToRenderWith = newViewFactory;
                        // const factoryToRenderWith = originalFactory;
                        elementsToReRender.slots.forEach(function (slot) { return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_7__render_utils__["a" /* rerenderMatchingSlotChildren */])(slot, factoryToRenderWith, originalFactory.template); });
                        elementsToReRender.viewControllers.forEach(function (e) { return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_7__render_utils__["b" /* rerenderController */])(e, 'view', factoryToRenderWith); });
                        elementsToReRender.scopeControllers.forEach(function (e) { return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_7__render_utils__["b" /* rerenderController */])(e, 'scope', factoryToRenderWith); });
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * handles hot-reloading CSS modules
     */
    HmrContext.prototype.reloadCss = function (moduleId) {
        if (!(moduleId in this.loader.moduleRegistry)) {
            return; // first load
        }
        var extensionIndex = moduleId.lastIndexOf('.');
        var moduleExtension = moduleId.substring(extensionIndex + 1);
        var pluginName = moduleExtension + "-resource-plugin";
        var cssPluginModuleId = this.loader.applyPluginToUrl(moduleId, pluginName);
        console.log("Handling HMR for " + moduleId);
        delete this.loader.moduleRegistry[moduleId];
        delete this.loader.moduleRegistry[cssPluginModuleId];
        var analyzedModule = this.moduleAnalyzerCache[cssPluginModuleId];
        if (typeof analyzedModule === 'undefined') {
            console.error("Unable to find module, check the plugin exists and the module has been loaded with the expected plugin");
            return;
        }
        else if (!analyzedModule.resources || !analyzedModule.resources.length) {
            console.error("Something's wrong, no resources for this CSS file " + moduleId);
            return;
        }
        var mainResource = analyzedModule.resources[0];
        var cssResource = mainResource.metadata;
        if (cssResource._scoped && cssResource._scoped.injectedElements.length) {
            console.error("Hot Reloading scopedCSS is not yet supported!");
            return;
        }
        if (cssResource.injectedElement) {
            cssResource.injectedElement.remove();
        }
        // reload resource
        cssResource.load(__WEBPACK_IMPORTED_MODULE_3_aurelia_dependency_injection__["a" /* Container */].instance);
    };
    HmrContext.prototype.getResourceModuleByTemplate = function (template) {
        // find the related ResourceModule (if any)
        var relatedResourceModule = Object.values(this.moduleAnalyzerCache).find(function (resourceModule) {
            return resourceModule.mainResource &&
                resourceModule.mainResource.metadata &&
                resourceModule.mainResource.metadata.viewFactory &&
                resourceModule.mainResource.metadata.viewFactory.template === template;
        });
        return relatedResourceModule || UndefinedResourceModule;
    };
    HmrContext.prototype.getResourceModuleById = function (moduleId) {
        return moduleId in this.moduleAnalyzerCache ? this.moduleAnalyzerCache[moduleId] : UndefinedResourceModule;
    };
    return HmrContext;
}());



/***/ }),

/***/ 13:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export ActivateNextStep */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return AppRouter; });
/* unused harmony export BuildNavigationPlanStep */
/* unused harmony export CanActivateNextStep */
/* unused harmony export CanDeactivatePreviousStep */
/* unused harmony export CommitChangesStep */
/* unused harmony export DeactivatePreviousStep */
/* unused harmony export LoadRouteStep */
/* unused harmony export NavModel */
/* unused harmony export NavigationInstruction */
/* unused harmony export Pipeline */
/* unused harmony export PipelineProvider */
/* unused harmony export PipelineSlotName */
/* unused harmony export PipelineStatus */
/* unused harmony export Redirect */
/* unused harmony export RedirectToRoute */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return RouteLoader; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Router; });
/* unused harmony export RouterConfiguration */
/* unused harmony export RouterEvent */
/* unused harmony export activationStrategy */
/* unused harmony export isNavigationCommand */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_aurelia_logging__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_aurelia_dependency_injection__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_aurelia_history__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_aurelia_route_recognizer__ = __webpack_require__(28);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_aurelia_event_aggregator__ = __webpack_require__("aurelia-event-aggregator");






/*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */
/* global Reflect, Promise */

var extendStatics = function(d, b) {
    extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return extendStatics(d, b);
};

function __extends(d, b) {
    extendStatics(d, b);
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}

/**
 * Class used to represent an instruction during a navigation.
 */
var NavigationInstruction = /** @class */ (function () {
    function NavigationInstruction(init) {
        /**
         * Current built viewport plan of this nav instruction
         */
        this.plan = null;
        this.options = {};
        Object.assign(this, init);
        this.params = this.params || {};
        this.viewPortInstructions = {};
        var ancestorParams = [];
        var current = this;
        do {
            var currentParams = Object.assign({}, current.params);
            if (current.config && current.config.hasChildRouter) {
                // remove the param for the injected child route segment
                delete currentParams[current.getWildCardName()];
            }
            ancestorParams.unshift(currentParams);
            current = current.parentInstruction;
        } while (current);
        var allParams = Object.assign.apply(Object, [{}, this.queryParams].concat(ancestorParams));
        this.lifecycleArgs = [allParams, this.config, this];
    }
    /**
     * Gets an array containing this instruction and all child instructions for the current navigation.
     */
    NavigationInstruction.prototype.getAllInstructions = function () {
        var instructions = [this];
        var viewPortInstructions = this.viewPortInstructions;
        for (var key in viewPortInstructions) {
            var childInstruction = viewPortInstructions[key].childNavigationInstruction;
            if (childInstruction) {
                instructions.push.apply(instructions, childInstruction.getAllInstructions());
            }
        }
        return instructions;
    };
    /**
     * Gets an array containing the instruction and all child instructions for the previous navigation.
     * Previous instructions are no longer available after navigation completes.
     */
    NavigationInstruction.prototype.getAllPreviousInstructions = function () {
        return this.getAllInstructions().map(function (c) { return c.previousInstruction; }).filter(function (c) { return c; });
    };
    NavigationInstruction.prototype.addViewPortInstruction = function (nameOrInitOptions, strategy, moduleId, component) {
        var viewPortInstruction;
        var viewPortName = typeof nameOrInitOptions === 'string' ? nameOrInitOptions : nameOrInitOptions.name;
        var lifecycleArgs = this.lifecycleArgs;
        var config = Object.assign({}, lifecycleArgs[1], { currentViewPort: viewPortName });
        if (typeof nameOrInitOptions === 'string') {
            viewPortInstruction = {
                name: nameOrInitOptions,
                strategy: strategy,
                moduleId: moduleId,
                component: component,
                childRouter: component.childRouter,
                lifecycleArgs: [lifecycleArgs[0], config, lifecycleArgs[2]]
            };
        }
        else {
            viewPortInstruction = {
                name: viewPortName,
                strategy: nameOrInitOptions.strategy,
                component: nameOrInitOptions.component,
                moduleId: nameOrInitOptions.moduleId,
                childRouter: nameOrInitOptions.component.childRouter,
                lifecycleArgs: [lifecycleArgs[0], config, lifecycleArgs[2]]
            };
        }
        return this.viewPortInstructions[viewPortName] = viewPortInstruction;
    };
    /**
     * Gets the name of the route pattern's wildcard parameter, if applicable.
     */
    NavigationInstruction.prototype.getWildCardName = function () {
        // todo: potential issue, or at least unsafe typings
        var configRoute = this.config.route;
        var wildcardIndex = configRoute.lastIndexOf('*');
        return configRoute.substr(wildcardIndex + 1);
    };
    /**
     * Gets the path and query string created by filling the route
     * pattern's wildcard parameter with the matching param.
     */
    NavigationInstruction.prototype.getWildcardPath = function () {
        var wildcardName = this.getWildCardName();
        var path = this.params[wildcardName] || '';
        var queryString = this.queryString;
        if (queryString) {
            path += '?' + queryString;
        }
        return path;
    };
    /**
     * Gets the instruction's base URL, accounting for wildcard route parameters.
     */
    NavigationInstruction.prototype.getBaseUrl = function () {
        var _this = this;
        var $encodeURI = encodeURI;
        var fragment = decodeURI(this.fragment);
        if (fragment === '') {
            var nonEmptyRoute = this.router.routes.find(function (route) {
                return route.name === _this.config.name &&
                    route.route !== '';
            });
            if (nonEmptyRoute) {
                fragment = nonEmptyRoute.route;
            }
        }
        if (!this.params) {
            return $encodeURI(fragment);
        }
        var wildcardName = this.getWildCardName();
        var path = this.params[wildcardName] || '';
        if (!path) {
            return $encodeURI(fragment);
        }
        return $encodeURI(fragment.substr(0, fragment.lastIndexOf(path)));
    };
    /**
     * Finalize a viewport instruction
     * @internal
     */
    NavigationInstruction.prototype._commitChanges = function (waitToSwap) {
        var _this = this;
        var router = this.router;
        router.currentInstruction = this;
        var previousInstruction = this.previousInstruction;
        if (previousInstruction) {
            previousInstruction.config.navModel.isActive = false;
        }
        this.config.navModel.isActive = true;
        router.refreshNavigation();
        var loads = [];
        var delaySwaps = [];
        var viewPortInstructions = this.viewPortInstructions;
        var _loop_1 = function (viewPortName) {
            var viewPortInstruction = viewPortInstructions[viewPortName];
            var viewPort = router.viewPorts[viewPortName];
            if (!viewPort) {
                throw new Error("There was no router-view found in the view for " + viewPortInstruction.moduleId + ".");
            }
            var childNavInstruction = viewPortInstruction.childNavigationInstruction;
            if (viewPortInstruction.strategy === "replace" /* Replace */) {
                if (childNavInstruction && childNavInstruction.parentCatchHandler) {
                    loads.push(childNavInstruction._commitChanges(waitToSwap));
                }
                else {
                    if (waitToSwap) {
                        delaySwaps.push({ viewPort: viewPort, viewPortInstruction: viewPortInstruction });
                    }
                    loads.push(viewPort
                        .process(viewPortInstruction, waitToSwap)
                        .then(function () { return childNavInstruction
                        ? childNavInstruction._commitChanges(waitToSwap)
                        : Promise.resolve(); }));
                }
            }
            else {
                if (childNavInstruction) {
                    loads.push(childNavInstruction._commitChanges(waitToSwap));
                }
            }
        };
        for (var viewPortName in viewPortInstructions) {
            _loop_1(viewPortName);
        }
        return Promise
            .all(loads)
            .then(function () {
            delaySwaps.forEach(function (x) { return x.viewPort.swap(x.viewPortInstruction); });
            return null;
        })
            .then(function () { return prune(_this); });
    };
    /**@internal */
    NavigationInstruction.prototype._updateTitle = function () {
        var router = this.router;
        var title = this._buildTitle(router.titleSeparator);
        if (title) {
            router.history.setTitle(title);
        }
    };
    /**@internal */
    NavigationInstruction.prototype._buildTitle = function (separator) {
        if (separator === void 0) { separator = ' | '; }
        var title = '';
        var childTitles = [];
        var navModelTitle = this.config.navModel.title;
        var instructionRouter = this.router;
        var viewPortInstructions = this.viewPortInstructions;
        if (navModelTitle) {
            title = instructionRouter.transformTitle(navModelTitle);
        }
        for (var viewPortName in viewPortInstructions) {
            var viewPortInstruction = viewPortInstructions[viewPortName];
            var child_nav_instruction = viewPortInstruction.childNavigationInstruction;
            if (child_nav_instruction) {
                var childTitle = child_nav_instruction._buildTitle(separator);
                if (childTitle) {
                    childTitles.push(childTitle);
                }
            }
        }
        if (childTitles.length) {
            title = childTitles.join(separator) + (title ? separator : '') + title;
        }
        if (instructionRouter.title) {
            title += (title ? separator : '') + instructionRouter.transformTitle(instructionRouter.title);
        }
        return title;
    };
    return NavigationInstruction;
}());
var prune = function (instruction) {
    instruction.previousInstruction = null;
    instruction.plan = null;
};

/**
* Class for storing and interacting with a route's navigation settings.
*/
var NavModel = /** @class */ (function () {
    function NavModel(router, relativeHref) {
        /**
        * True if this nav item is currently active.
        */
        this.isActive = false;
        /**
        * The title.
        */
        this.title = null;
        /**
        * This nav item's absolute href.
        */
        this.href = null;
        /**
        * This nav item's relative href.
        */
        this.relativeHref = null;
        /**
        * Data attached to the route at configuration time.
        */
        this.settings = {};
        /**
        * The route config.
        */
        this.config = null;
        this.router = router;
        this.relativeHref = relativeHref;
    }
    /**
    * Sets the route's title and updates document.title.
    *  If the a navigation is in progress, the change will be applied
    *  to document.title when the navigation completes.
    *
    * @param title The new title.
    */
    NavModel.prototype.setTitle = function (title) {
        this.title = title;
        if (this.isActive) {
            this.router.updateTitle();
        }
    };
    return NavModel;
}());

function _normalizeAbsolutePath(path, hasPushState, absolute) {
    if (absolute === void 0) { absolute = false; }
    if (!hasPushState && path[0] !== '#') {
        path = '#' + path;
    }
    if (hasPushState && absolute) {
        path = path.substring(1, path.length);
    }
    return path;
}
function _createRootedPath(fragment, baseUrl, hasPushState, absolute) {
    if (isAbsoluteUrl.test(fragment)) {
        return fragment;
    }
    var path = '';
    if (baseUrl.length && baseUrl[0] !== '/') {
        path += '/';
    }
    path += baseUrl;
    if ((!path.length || path[path.length - 1] !== '/') && fragment[0] !== '/') {
        path += '/';
    }
    if (path.length && path[path.length - 1] === '/' && fragment[0] === '/') {
        path = path.substring(0, path.length - 1);
    }
    return _normalizeAbsolutePath(path + fragment, hasPushState, absolute);
}
function _resolveUrl(fragment, baseUrl, hasPushState) {
    if (isRootedPath.test(fragment)) {
        return _normalizeAbsolutePath(fragment, hasPushState);
    }
    return _createRootedPath(fragment, baseUrl, hasPushState);
}
function _ensureArrayWithSingleRoutePerConfig(config) {
    var routeConfigs = [];
    if (Array.isArray(config.route)) {
        for (var i = 0, ii = config.route.length; i < ii; ++i) {
            var current = Object.assign({}, config);
            current.route = config.route[i];
            routeConfigs.push(current);
        }
    }
    else {
        routeConfigs.push(Object.assign({}, config));
    }
    return routeConfigs;
}
var isRootedPath = /^#?\//;
var isAbsoluteUrl = /^([a-z][a-z0-9+\-.]*:)?\/\//i;

/**
 * Class used to configure a [[Router]] instance.
 *
 * @constructor
 */
var RouterConfiguration = /** @class */ (function () {
    function RouterConfiguration() {
        this.instructions = [];
        this.options = {};
        this.pipelineSteps = [];
    }
    /**
     * Adds a step to be run during the [[Router]]'s navigation pipeline.
     *
     * @param name The name of the pipeline slot to insert the step into.
     * @param step The pipeline step.
     * @chainable
     */
    RouterConfiguration.prototype.addPipelineStep = function (name, step) {
        if (step === null || step === undefined) {
            throw new Error('Pipeline step cannot be null or undefined.');
        }
        this.pipelineSteps.push({ name: name, step: step });
        return this;
    };
    /**
     * Adds a step to be run during the [[Router]]'s authorize pipeline slot.
     *
     * @param step The pipeline step.
     * @chainable
     */
    RouterConfiguration.prototype.addAuthorizeStep = function (step) {
        return this.addPipelineStep("authorize" /* Authorize */, step);
    };
    /**
     * Adds a step to be run during the [[Router]]'s preActivate pipeline slot.
     *
     * @param step The pipeline step.
     * @chainable
     */
    RouterConfiguration.prototype.addPreActivateStep = function (step) {
        return this.addPipelineStep("preActivate" /* PreActivate */, step);
    };
    /**
     * Adds a step to be run during the [[Router]]'s preRender pipeline slot.
     *
     * @param step The pipeline step.
     * @chainable
     */
    RouterConfiguration.prototype.addPreRenderStep = function (step) {
        return this.addPipelineStep("preRender" /* PreRender */, step);
    };
    /**
     * Adds a step to be run during the [[Router]]'s postRender pipeline slot.
     *
     * @param step The pipeline step.
     * @chainable
     */
    RouterConfiguration.prototype.addPostRenderStep = function (step) {
        return this.addPipelineStep("postRender" /* PostRender */, step);
    };
    /**
     * Configures a route that will be used if there is no previous location available on navigation cancellation.
     *
     * @param fragment The URL fragment to use as the navigation destination.
     * @chainable
     */
    RouterConfiguration.prototype.fallbackRoute = function (fragment) {
        this._fallbackRoute = fragment;
        return this;
    };
    /**
     * Maps one or more routes to be registered with the router.
     *
     * @param route The [[RouteConfig]] to map, or an array of [[RouteConfig]] to map.
     * @chainable
     */
    RouterConfiguration.prototype.map = function (route) {
        var _this = this;
        if (Array.isArray(route)) {
            route.forEach(function (r) { return _this.map(r); });
            return this;
        }
        return this.mapRoute(route);
    };
    /**
     * Configures defaults to use for any view ports.
     *
     * @param viewPortConfig a view port configuration object to use as a
     *  default, of the form { viewPortName: { moduleId } }.
     * @chainable
     */
    RouterConfiguration.prototype.useViewPortDefaults = function (viewPortConfig) {
        this.viewPortDefaults = viewPortConfig;
        return this;
    };
    /**
     * Maps a single route to be registered with the router.
     *
     * @param route The [[RouteConfig]] to map.
     * @chainable
     */
    RouterConfiguration.prototype.mapRoute = function (config) {
        this.instructions.push(function (router) {
            var routeConfigs = _ensureArrayWithSingleRoutePerConfig(config);
            var navModel;
            for (var i = 0, ii = routeConfigs.length; i < ii; ++i) {
                var routeConfig = routeConfigs[i];
                routeConfig.settings = routeConfig.settings || {};
                if (!navModel) {
                    navModel = router.createNavModel(routeConfig);
                }
                router.addRoute(routeConfig, navModel);
            }
        });
        return this;
    };
    /**
     * Registers an unknown route handler to be run when the URL fragment doesn't match any registered routes.
     *
     * @param config A string containing a moduleId to load, or a [[RouteConfig]], or a function that takes the
     *  [[NavigationInstruction]] and selects a moduleId to load.
     * @chainable
     */
    RouterConfiguration.prototype.mapUnknownRoutes = function (config) {
        this.unknownRouteConfig = config;
        return this;
    };
    /**
     * Applies the current configuration to the specified [[Router]].
     *
     * @param router The [[Router]] to apply the configuration to.
     */
    RouterConfiguration.prototype.exportToRouter = function (router) {
        var instructions = this.instructions;
        for (var i = 0, ii = instructions.length; i < ii; ++i) {
            instructions[i](router);
        }
        var _a = this, title = _a.title, titleSeparator = _a.titleSeparator, unknownRouteConfig = _a.unknownRouteConfig, _fallbackRoute = _a._fallbackRoute, viewPortDefaults = _a.viewPortDefaults;
        if (title) {
            router.title = title;
        }
        if (titleSeparator) {
            router.titleSeparator = titleSeparator;
        }
        if (unknownRouteConfig) {
            router.handleUnknownRoutes(unknownRouteConfig);
        }
        if (_fallbackRoute) {
            router.fallbackRoute = _fallbackRoute;
        }
        if (viewPortDefaults) {
            router.useViewPortDefaults(viewPortDefaults);
        }
        Object.assign(router.options, this.options);
        var pipelineSteps = this.pipelineSteps;
        var pipelineStepCount = pipelineSteps.length;
        if (pipelineStepCount) {
            if (!router.isRoot) {
                throw new Error('Pipeline steps can only be added to the root router');
            }
            var pipelineProvider = router.pipelineProvider;
            for (var i = 0, ii = pipelineStepCount; i < ii; ++i) {
                var _b = pipelineSteps[i], name_1 = _b.name, step = _b.step;
                pipelineProvider.addStep(name_1, step);
            }
        }
    };
    return RouterConfiguration;
}());

/**
 * The primary class responsible for handling routing and navigation.
 */
var Router = /** @class */ (function () {
    /**
     * @param container The [[Container]] to use when child routers.
     * @param history The [[History]] implementation to delegate navigation requests to.
     */
    function Router(container, history) {
        var _this = this;
        /**
         * The parent router, or null if this instance is not a child router.
         */
        this.parent = null;
        this.options = {};
        /**
         * The defaults used when a viewport lacks specified content
         */
        this.viewPortDefaults = {};
        /**
         * Extension point to transform the document title before it is built and displayed.
         * By default, child routers delegate to the parent router, and the app router
         * returns the title unchanged.
         */
        this.transformTitle = function (title) {
            if (_this.parent) {
                return _this.parent.transformTitle(title);
            }
            return title;
        };
        this.container = container;
        this.history = history;
        this.reset();
    }
    /**
     * Fully resets the router's internal state. Primarily used internally by the framework when multiple calls to setRoot are made.
     * Use with caution (actually, avoid using this). Do not use this to simply change your navigation model.
     */
    Router.prototype.reset = function () {
        var _this = this;
        this.viewPorts = {};
        this.routes = [];
        this.baseUrl = '';
        this.isConfigured = false;
        this.isNavigating = false;
        this.isExplicitNavigation = false;
        this.isExplicitNavigationBack = false;
        this.isNavigatingFirst = false;
        this.isNavigatingNew = false;
        this.isNavigatingRefresh = false;
        this.isNavigatingForward = false;
        this.isNavigatingBack = false;
        this.couldDeactivate = false;
        this.navigation = [];
        this.currentInstruction = null;
        this.viewPortDefaults = {};
        this._fallbackOrder = 100;
        this._recognizer = new __WEBPACK_IMPORTED_MODULE_3_aurelia_route_recognizer__["a" /* RouteRecognizer */]();
        this._childRecognizer = new __WEBPACK_IMPORTED_MODULE_3_aurelia_route_recognizer__["a" /* RouteRecognizer */]();
        this._configuredPromise = new Promise(function (resolve) {
            _this._resolveConfiguredPromise = resolve;
        });
    };
    Object.defineProperty(Router.prototype, "isRoot", {
        /**
         * Gets a value indicating whether or not this [[Router]] is the root in the router tree. I.e., it has no parent.
         */
        get: function () {
            return !this.parent;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Registers a viewPort to be used as a rendering target for activated routes.
     *
     * @param viewPort The viewPort.
     * @param name The name of the viewPort. 'default' if unspecified.
     */
    Router.prototype.registerViewPort = function (viewPort, name) {
        name = name || 'default';
        this.viewPorts[name] = viewPort;
    };
    /**
     * Returns a Promise that resolves when the router is configured.
     */
    Router.prototype.ensureConfigured = function () {
        return this._configuredPromise;
    };
    /**
     * Configures the router.
     *
     * @param callbackOrConfig The [[RouterConfiguration]] or a callback that takes a [[RouterConfiguration]].
     */
    Router.prototype.configure = function (callbackOrConfig) {
        var _this = this;
        this.isConfigured = true;
        var result = callbackOrConfig;
        var config;
        if (typeof callbackOrConfig === 'function') {
            config = new RouterConfiguration();
            result = callbackOrConfig(config);
        }
        return Promise
            .resolve(result)
            .then(function (c) {
            if (c && c.exportToRouter) {
                config = c;
            }
            config.exportToRouter(_this);
            _this.isConfigured = true;
            _this._resolveConfiguredPromise();
        });
    };
    /**
     * Navigates to a new location.
     *
     * @param fragment The URL fragment to use as the navigation destination.
     * @param options The navigation options.
     */
    Router.prototype.navigate = function (fragment, options) {
        if (!this.isConfigured && this.parent) {
            return this.parent.navigate(fragment, options);
        }
        this.isExplicitNavigation = true;
        return this.history.navigate(_resolveUrl(fragment, this.baseUrl, this.history._hasPushState), options);
    };
    /**
     * Navigates to a new location corresponding to the route and params specified. Equivallent to [[Router.generate]] followed
     * by [[Router.navigate]].
     *
     * @param route The name of the route to use when generating the navigation location.
     * @param params The route parameters to be used when populating the route pattern.
     * @param options The navigation options.
     */
    Router.prototype.navigateToRoute = function (route, params, options) {
        var path = this.generate(route, params);
        return this.navigate(path, options);
    };
    /**
     * Navigates back to the most recent location in history.
     */
    Router.prototype.navigateBack = function () {
        this.isExplicitNavigationBack = true;
        this.history.navigateBack();
    };
    /**
     * Creates a child router of the current router.
     *
     * @param container The [[Container]] to provide to the child router. Uses the current [[Router]]'s [[Container]] if unspecified.
     * @returns {Router} The new child Router.
     */
    Router.prototype.createChild = function (container) {
        var childRouter = new Router(container || this.container.createChild(), this.history);
        childRouter.parent = this;
        return childRouter;
    };
    /**
     * Generates a URL fragment matching the specified route pattern.
     *
     * @param name The name of the route whose pattern should be used to generate the fragment.
     * @param params The route params to be used to populate the route pattern.
     * @param options If options.absolute = true, then absolute url will be generated; otherwise, it will be relative url.
     * @returns {string} A string containing the generated URL fragment.
     */
    Router.prototype.generate = function (nameOrRoute, params, options) {
        if (params === void 0) { params = {}; }
        if (options === void 0) { options = {}; }
        // A child recognizer generates routes for potential child routes. Any potential child route is added
        // to the childRoute property of params for the childRouter to recognize. When generating routes, we
        // use the childRecognizer when childRoute params are available to generate a child router enabled route.
        var recognizer = 'childRoute' in params ? this._childRecognizer : this._recognizer;
        var hasRoute = recognizer.hasRoute(nameOrRoute);
        if (!hasRoute) {
            if (this.parent) {
                return this.parent.generate(nameOrRoute, params, options);
            }
            throw new Error("A route with name '" + nameOrRoute + "' could not be found. Check that `name: '" + nameOrRoute + "'` was specified in the route's config.");
        }
        var path = recognizer.generate(nameOrRoute, params);
        var rootedPath = _createRootedPath(path, this.baseUrl, this.history._hasPushState, options.absolute);
        return options.absolute ? "" + this.history.getAbsoluteRoot() + rootedPath : rootedPath;
    };
    /**
     * Creates a [[NavModel]] for the specified route config.
     *
     * @param config The route config.
     */
    Router.prototype.createNavModel = function (config) {
        var navModel = new NavModel(this, 'href' in config
            ? config.href
            // potential error when config.route is a string[] ?
            : config.route);
        navModel.title = config.title;
        navModel.order = config.nav;
        navModel.href = config.href;
        navModel.settings = config.settings;
        navModel.config = config;
        return navModel;
    };
    /**
     * Registers a new route with the router.
     *
     * @param config The [[RouteConfig]].
     * @param navModel The [[NavModel]] to use for the route. May be omitted for single-pattern routes.
     */
    Router.prototype.addRoute = function (config, navModel) {
        if (Array.isArray(config.route)) {
            var routeConfigs = _ensureArrayWithSingleRoutePerConfig(config);
            // the following is wrong. todo: fix this after TS refactoring release
            routeConfigs.forEach(this.addRoute.bind(this));
            return;
        }
        validateRouteConfig(config);
        if (!('viewPorts' in config) && !config.navigationStrategy) {
            config.viewPorts = {
                'default': {
                    moduleId: config.moduleId,
                    view: config.view
                }
            };
        }
        if (!navModel) {
            navModel = this.createNavModel(config);
        }
        this.routes.push(config);
        var path = config.route;
        if (path.charAt(0) === '/') {
            path = path.substr(1);
        }
        var caseSensitive = config.caseSensitive === true;
        var state = this._recognizer.add({
            path: path,
            handler: config,
            caseSensitive: caseSensitive
        });
        if (path) {
            var settings = config.settings;
            delete config.settings;
            var withChild = JSON.parse(JSON.stringify(config));
            config.settings = settings;
            withChild.route = path + "/*childRoute";
            withChild.hasChildRouter = true;
            this._childRecognizer.add({
                path: withChild.route,
                handler: withChild,
                caseSensitive: caseSensitive
            });
            withChild.navModel = navModel;
            withChild.settings = config.settings;
            withChild.navigationStrategy = config.navigationStrategy;
        }
        config.navModel = navModel;
        var navigation = this.navigation;
        if ((navModel.order || navModel.order === 0) && navigation.indexOf(navModel) === -1) {
            if ((!navModel.href && navModel.href !== '') && (state.types.dynamics || state.types.stars)) {
                throw new Error('Invalid route config for "' + config.route + '" : dynamic routes must specify an "href:" to be included in the navigation model.');
            }
            if (typeof navModel.order !== 'number') {
                navModel.order = ++this._fallbackOrder;
            }
            navigation.push(navModel);
            // this is a potential error / inconsistency between browsers
            //
            // MDN: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort
            // If compareFunction(a, b) returns 0, leave a and b unchanged with respect to each other,
            // but sorted with respect to all different elements.
            // Note: the ECMAscript standard does not guarantee this behaviour,
            // and thus not all browsers (e.g. Mozilla versions dating back to at least 2003) respect this.
            navigation.sort(function (a, b) { return a.order - b.order; });
        }
    };
    /**
     * Gets a value indicating whether or not this [[Router]] or one of its ancestors has a route registered with the specified name.
     *
     * @param name The name of the route to check.
     */
    Router.prototype.hasRoute = function (name) {
        return !!(this._recognizer.hasRoute(name) || this.parent && this.parent.hasRoute(name));
    };
    /**
     * Gets a value indicating whether or not this [[Router]] has a route registered with the specified name.
     *
     * @param name The name of the route to check.
     */
    Router.prototype.hasOwnRoute = function (name) {
        return this._recognizer.hasRoute(name);
    };
    /**
     * Register a handler to use when the incoming URL fragment doesn't match any registered routes.
     *
     * @param config The moduleId, or a function that selects the moduleId, or a [[RouteConfig]].
     */
    Router.prototype.handleUnknownRoutes = function (config) {
        var _this = this;
        if (!config) {
            throw new Error('Invalid unknown route handler');
        }
        this.catchAllHandler = function (instruction) {
            return _this
                ._createRouteConfig(config, instruction)
                .then(function (c) {
                instruction.config = c;
                return instruction;
            });
        };
    };
    /**
     * Updates the document title using the current navigation instruction.
     */
    Router.prototype.updateTitle = function () {
        var parentRouter = this.parent;
        if (parentRouter) {
            return parentRouter.updateTitle();
        }
        var currentInstruction = this.currentInstruction;
        if (currentInstruction) {
            currentInstruction._updateTitle();
        }
        return undefined;
    };
    /**
     * Updates the navigation routes with hrefs relative to the current location.
     * Note: This method will likely move to a plugin in a future release.
     */
    Router.prototype.refreshNavigation = function () {
        var nav = this.navigation;
        for (var i = 0, length_1 = nav.length; i < length_1; i++) {
            var current = nav[i];
            if (!current.config.href) {
                current.href = _createRootedPath(current.relativeHref, this.baseUrl, this.history._hasPushState);
            }
            else {
                current.href = _normalizeAbsolutePath(current.config.href, this.history._hasPushState);
            }
        }
    };
    /**
     * Sets the default configuration for the view ports. This specifies how to
     *  populate a view port for which no module is specified. The default is
     *  an empty view/view-model pair.
     */
    Router.prototype.useViewPortDefaults = function ($viewPortDefaults) {
        // a workaround to have strong typings while not requiring to expose interface ViewPortInstruction
        var viewPortDefaults = $viewPortDefaults;
        for (var viewPortName in viewPortDefaults) {
            var viewPortConfig = viewPortDefaults[viewPortName];
            this.viewPortDefaults[viewPortName] = {
                moduleId: viewPortConfig.moduleId
            };
        }
    };
    /**@internal */
    Router.prototype._refreshBaseUrl = function () {
        var parentRouter = this.parent;
        if (parentRouter) {
            this.baseUrl = generateBaseUrl(parentRouter, parentRouter.currentInstruction);
        }
    };
    /**@internal */
    Router.prototype._createNavigationInstruction = function (url, parentInstruction) {
        if (url === void 0) { url = ''; }
        if (parentInstruction === void 0) { parentInstruction = null; }
        var fragment = url;
        var queryString = '';
        var queryIndex = url.indexOf('?');
        if (queryIndex !== -1) {
            fragment = url.substr(0, queryIndex);
            queryString = url.substr(queryIndex + 1);
        }
        var urlRecognizationResults = this._recognizer.recognize(url);
        if (!urlRecognizationResults || !urlRecognizationResults.length) {
            urlRecognizationResults = this._childRecognizer.recognize(url);
        }
        var instructionInit = {
            fragment: fragment,
            queryString: queryString,
            config: null,
            parentInstruction: parentInstruction,
            previousInstruction: this.currentInstruction,
            router: this,
            options: {
                compareQueryParams: this.options.compareQueryParams
            }
        };
        var result;
        if (urlRecognizationResults && urlRecognizationResults.length) {
            var first = urlRecognizationResults[0];
            var instruction = new NavigationInstruction(Object.assign({}, instructionInit, {
                params: first.params,
                queryParams: first.queryParams || urlRecognizationResults.queryParams,
                config: first.config || first.handler
            }));
            if (typeof first.handler === 'function') {
                result = evaluateNavigationStrategy(instruction, first.handler, first);
            }
            else if (first.handler && typeof first.handler.navigationStrategy === 'function') {
                result = evaluateNavigationStrategy(instruction, first.handler.navigationStrategy, first.handler);
            }
            else {
                result = Promise.resolve(instruction);
            }
        }
        else if (this.catchAllHandler) {
            var instruction = new NavigationInstruction(Object.assign({}, instructionInit, {
                params: { path: fragment },
                queryParams: urlRecognizationResults ? urlRecognizationResults.queryParams : {},
                config: null // config will be created by the catchAllHandler
            }));
            result = evaluateNavigationStrategy(instruction, this.catchAllHandler);
        }
        else if (this.parent) {
            var router = this._parentCatchAllHandler(this.parent);
            if (router) {
                var newParentInstruction = this._findParentInstructionFromRouter(router, parentInstruction);
                var instruction = new NavigationInstruction(Object.assign({}, instructionInit, {
                    params: { path: fragment },
                    queryParams: urlRecognizationResults ? urlRecognizationResults.queryParams : {},
                    router: router,
                    parentInstruction: newParentInstruction,
                    parentCatchHandler: true,
                    config: null // config will be created by the chained parent catchAllHandler
                }));
                result = evaluateNavigationStrategy(instruction, router.catchAllHandler);
            }
        }
        if (result && parentInstruction) {
            this.baseUrl = generateBaseUrl(this.parent, parentInstruction);
        }
        return result || Promise.reject(new Error("Route not found: " + url));
    };
    /**@internal */
    Router.prototype._findParentInstructionFromRouter = function (router, instruction) {
        if (instruction.router === router) {
            instruction.fragment = router.baseUrl; // need to change the fragment in case of a redirect instead of moduleId
            return instruction;
        }
        else if (instruction.parentInstruction) {
            return this._findParentInstructionFromRouter(router, instruction.parentInstruction);
        }
        return undefined;
    };
    /**@internal */
    Router.prototype._parentCatchAllHandler = function (router) {
        if (router.catchAllHandler) {
            return router;
        }
        else if (router.parent) {
            return this._parentCatchAllHandler(router.parent);
        }
        return false;
    };
    /**
     * @internal
     */
    Router.prototype._createRouteConfig = function (config, instruction) {
        var _this = this;
        return Promise
            .resolve(config)
            .then(function (c) {
            if (typeof c === 'string') {
                return { moduleId: c };
            }
            else if (typeof c === 'function') {
                return c(instruction);
            }
            return c;
        })
            // typing here could be either RouteConfig or RedirectConfig
            // but temporarily treat both as RouteConfig
            // todo: improve typings precision
            .then(function (c) { return typeof c === 'string' ? { moduleId: c } : c; })
            .then(function (c) {
            c.route = instruction.params.path;
            validateRouteConfig(c);
            if (!c.navModel) {
                c.navModel = _this.createNavModel(c);
            }
            return c;
        });
    };
    return Router;
}());
/* @internal exported for unit testing */
var generateBaseUrl = function (router, instruction) {
    return "" + (router.baseUrl || '') + (instruction.getBaseUrl() || '');
};
/* @internal exported for unit testing */
var validateRouteConfig = function (config) {
    if (typeof config !== 'object') {
        throw new Error('Invalid Route Config');
    }
    if (typeof config.route !== 'string') {
        var name_1 = config.name || '(no name)';
        throw new Error('Invalid Route Config for "' + name_1 + '": You must specify a "route:" pattern.');
    }
    if (!('redirect' in config || config.moduleId || config.navigationStrategy || config.viewPorts)) {
        throw new Error('Invalid Route Config for "' + config.route + '": You must specify a "moduleId:", "redirect:", "navigationStrategy:", or "viewPorts:".');
    }
};
/* @internal exported for unit testing */
var evaluateNavigationStrategy = function (instruction, evaluator, context) {
    return Promise
        .resolve(evaluator.call(context, instruction))
        .then(function () {
        if (!('viewPorts' in instruction.config)) {
            instruction.config.viewPorts = {
                'default': {
                    moduleId: instruction.config.moduleId
                }
            };
        }
        return instruction;
    });
};

/**@internal exported for unit testing */
var createNextFn = function (instruction, steps) {
    var index = -1;
    var next = function () {
        index++;
        if (index < steps.length) {
            var currentStep = steps[index];
            try {
                return currentStep(instruction, next);
            }
            catch (e) {
                return next.reject(e);
            }
        }
        else {
            return next.complete();
        }
    };
    next.complete = createCompletionHandler(next, "completed" /* Completed */);
    next.cancel = createCompletionHandler(next, "canceled" /* Canceled */);
    next.reject = createCompletionHandler(next, "rejected" /* Rejected */);
    return next;
};
/**@internal exported for unit testing */
var createCompletionHandler = function (next, status) {
    return function (output) { return Promise
        .resolve({
        status: status,
        output: output,
        completed: status === "completed" /* Completed */
    }); };
};

/**
 * The class responsible for managing and processing the navigation pipeline.
 */
var Pipeline = /** @class */ (function () {
    function Pipeline() {
        /**
         * The pipeline steps. And steps added via addStep will be converted to a function
         * The actualy running functions with correct step contexts of this pipeline
         */
        this.steps = [];
    }
    /**
     * Adds a step to the pipeline.
     *
     * @param step The pipeline step.
     */
    Pipeline.prototype.addStep = function (step) {
        var run;
        if (typeof step === 'function') {
            run = step;
        }
        else if (typeof step.getSteps === 'function') {
            // getSteps is to enable support open slots
            // where devs can add multiple steps into the same slot name
            var steps = step.getSteps();
            for (var i = 0, l = steps.length; i < l; i++) {
                this.addStep(steps[i]);
            }
            return this;
        }
        else {
            run = step.run.bind(step);
        }
        this.steps.push(run);
        return this;
    };
    /**
     * Runs the pipeline.
     *
     * @param instruction The navigation instruction to process.
     */
    Pipeline.prototype.run = function (instruction) {
        var nextFn = createNextFn(instruction, this.steps);
        return nextFn();
    };
    return Pipeline;
}());

/**
* Determines if the provided object is a navigation command.
* A navigation command is anything with a navigate method.
*
* @param obj The object to check.
*/
function isNavigationCommand(obj) {
    return obj && typeof obj.navigate === 'function';
}
/**
* Used during the activation lifecycle to cause a redirect.
*/
var Redirect = /** @class */ (function () {
    /**
     * @param url The URL fragment to use as the navigation destination.
     * @param options The navigation options.
     */
    function Redirect(url, options) {
        if (options === void 0) { options = {}; }
        this.url = url;
        this.options = Object.assign({ trigger: true, replace: true }, options);
        this.shouldContinueProcessing = false;
    }
    /**
     * Called by the activation system to set the child router.
     *
     * @param router The router.
     */
    Redirect.prototype.setRouter = function (router) {
        this.router = router;
    };
    /**
     * Called by the navigation pipeline to navigate.
     *
     * @param appRouter The router to be redirected.
     */
    Redirect.prototype.navigate = function (appRouter) {
        var navigatingRouter = this.options.useAppRouter ? appRouter : (this.router || appRouter);
        navigatingRouter.navigate(this.url, this.options);
    };
    return Redirect;
}());
/**
 * Used during the activation lifecycle to cause a redirect to a named route.
 */
var RedirectToRoute = /** @class */ (function () {
    /**
     * @param route The name of the route.
     * @param params The parameters to be sent to the activation method.
     * @param options The options to use for navigation.
     */
    function RedirectToRoute(route, params, options) {
        if (params === void 0) { params = {}; }
        if (options === void 0) { options = {}; }
        this.route = route;
        this.params = params;
        this.options = Object.assign({ trigger: true, replace: true }, options);
        this.shouldContinueProcessing = false;
    }
    /**
     * Called by the activation system to set the child router.
     *
     * @param router The router.
     */
    RedirectToRoute.prototype.setRouter = function (router) {
        this.router = router;
    };
    /**
     * Called by the navigation pipeline to navigate.
     *
     * @param appRouter The router to be redirected.
     */
    RedirectToRoute.prototype.navigate = function (appRouter) {
        var navigatingRouter = this.options.useAppRouter ? appRouter : (this.router || appRouter);
        navigatingRouter.navigateToRoute(this.route, this.params, this.options);
    };
    return RedirectToRoute;
}());

/**
 * @internal exported for unit testing
 */
function _buildNavigationPlan(instruction, forceLifecycleMinimum) {
    var config = instruction.config;
    if ('redirect' in config) {
        return buildRedirectPlan(instruction);
    }
    var prevInstruction = instruction.previousInstruction;
    var defaultViewPortConfigs = instruction.router.viewPortDefaults;
    if (prevInstruction) {
        return buildTransitionPlans(instruction, prevInstruction, defaultViewPortConfigs, forceLifecycleMinimum);
    }
    // first navigation, only need to prepare a few information for each viewport plan
    var viewPortPlans = {};
    var viewPortConfigs = config.viewPorts;
    for (var viewPortName in viewPortConfigs) {
        var viewPortConfig = viewPortConfigs[viewPortName];
        if (viewPortConfig.moduleId === null && viewPortName in defaultViewPortConfigs) {
            viewPortConfig = defaultViewPortConfigs[viewPortName];
        }
        viewPortPlans[viewPortName] = {
            name: viewPortName,
            strategy: "replace" /* Replace */,
            config: viewPortConfig
        };
    }
    return Promise.resolve(viewPortPlans);
}
/**
 * Build redirect plan based on config of a navigation instruction
 * @internal exported for unit testing
 */
var buildRedirectPlan = function (instruction) {
    var config = instruction.config;
    var router = instruction.router;
    return router
        ._createNavigationInstruction(config.redirect)
        .then(function (redirectInstruction) {
        var params = {};
        var originalInstructionParams = instruction.params;
        var redirectInstructionParams = redirectInstruction.params;
        for (var key in redirectInstructionParams) {
            // If the param on the redirect points to another param, e.g. { route: first/:this, redirect: second/:this }
            var val = redirectInstructionParams[key];
            if (typeof val === 'string' && val[0] === ':') {
                val = val.slice(1);
                // And if that param is found on the original instruction then use it
                if (val in originalInstructionParams) {
                    params[key] = originalInstructionParams[val];
                }
            }
            else {
                params[key] = redirectInstructionParams[key];
            }
        }
        var redirectLocation = router.generate(redirectInstruction.config, params, instruction.options);
        // Special handling for child routes
        for (var key in originalInstructionParams) {
            redirectLocation = redirectLocation.replace(":" + key, originalInstructionParams[key]);
        }
        var queryString = instruction.queryString;
        if (queryString) {
            redirectLocation += '?' + queryString;
        }
        return Promise.resolve(new Redirect(redirectLocation));
    });
};
/**
 * @param viewPortPlans the Plan record that holds information about built plans
 * @internal exported for unit testing
 */
var buildTransitionPlans = function (currentInstruction, previousInstruction, defaultViewPortConfigs, forceLifecycleMinimum) {
    var viewPortPlans = {};
    var newInstructionConfig = currentInstruction.config;
    var hasNewParams = hasDifferentParameterValues(previousInstruction, currentInstruction);
    var pending = [];
    var previousViewPortInstructions = previousInstruction.viewPortInstructions;
    var _loop_1 = function (viewPortName) {
        var prevViewPortInstruction = previousViewPortInstructions[viewPortName];
        var prevViewPortComponent = prevViewPortInstruction.component;
        var newInstructionViewPortConfigs = newInstructionConfig.viewPorts;
        // if this is invoked on a viewport without any changes, based on new url,
        // newViewPortConfig will be the existing viewport instruction
        var nextViewPortConfig = viewPortName in newInstructionViewPortConfigs
            ? newInstructionViewPortConfigs[viewPortName]
            : prevViewPortInstruction;
        if (nextViewPortConfig.moduleId === null && viewPortName in defaultViewPortConfigs) {
            nextViewPortConfig = defaultViewPortConfigs[viewPortName];
        }
        var viewPortActivationStrategy = determineActivationStrategy(currentInstruction, prevViewPortInstruction, nextViewPortConfig, hasNewParams, forceLifecycleMinimum);
        var viewPortPlan = viewPortPlans[viewPortName] = {
            name: viewPortName,
            // ViewPortInstruction can quack like a RouteConfig
            config: nextViewPortConfig,
            prevComponent: prevViewPortComponent,
            prevModuleId: prevViewPortInstruction.moduleId,
            strategy: viewPortActivationStrategy
        };
        // recursively build nav plans for all existing child routers/viewports of this viewport
        // this is possible because existing child viewports and routers already have necessary information
        // to process the wildcard path from parent instruction
        if (viewPortActivationStrategy !== "replace" /* Replace */ && prevViewPortInstruction.childRouter) {
            var path = currentInstruction.getWildcardPath();
            var task = prevViewPortInstruction
                .childRouter
                ._createNavigationInstruction(path, currentInstruction)
                .then(function (childInstruction) {
                viewPortPlan.childNavigationInstruction = childInstruction;
                return _buildNavigationPlan(childInstruction, 
                // is it safe to assume viewPortPlan has not been changed from previous assignment?
                // if so, can just use local variable viewPortPlanStrategy
                // there could be user code modifying viewport plan during _createNavigationInstruction?
                viewPortPlan.strategy === "invoke-lifecycle" /* InvokeLifecycle */)
                    .then(function (childPlan) {
                    if (childPlan instanceof Redirect) {
                        return Promise.reject(childPlan);
                    }
                    childInstruction.plan = childPlan;
                    // for bluebird ?
                    return null;
                });
            });
            pending.push(task);
        }
    };
    for (var viewPortName in previousViewPortInstructions) {
        _loop_1(viewPortName);
    }
    return Promise.all(pending).then(function () { return viewPortPlans; });
};
/**
 * @param newViewPortConfig if this is invoked on a viewport without any changes, based on new url, newViewPortConfig will be the existing viewport instruction
 * @internal exported for unit testing
 */
var determineActivationStrategy = function (currentNavInstruction, prevViewPortInstruction, newViewPortConfig, 
// indicates whether there is difference between old and new url params
hasNewParams, forceLifecycleMinimum) {
    var newInstructionConfig = currentNavInstruction.config;
    var prevViewPortViewModel = prevViewPortInstruction.component.viewModel;
    var viewPortPlanStrategy;
    if (prevViewPortInstruction.moduleId !== newViewPortConfig.moduleId) {
        viewPortPlanStrategy = "replace" /* Replace */;
    }
    else if ('determineActivationStrategy' in prevViewPortViewModel) {
        viewPortPlanStrategy = prevViewPortViewModel.determineActivationStrategy.apply(prevViewPortViewModel, currentNavInstruction.lifecycleArgs);
    }
    else if (newInstructionConfig.activationStrategy) {
        viewPortPlanStrategy = newInstructionConfig.activationStrategy;
    }
    else if (hasNewParams || forceLifecycleMinimum) {
        viewPortPlanStrategy = "invoke-lifecycle" /* InvokeLifecycle */;
    }
    else {
        viewPortPlanStrategy = "no-change" /* NoChange */;
    }
    return viewPortPlanStrategy;
};
/**@internal exported for unit testing */
var hasDifferentParameterValues = function (prev, next) {
    var prevParams = prev.params;
    var nextParams = next.params;
    var nextWildCardName = next.config.hasChildRouter ? next.getWildCardName() : null;
    for (var key in nextParams) {
        if (key === nextWildCardName) {
            continue;
        }
        if (prevParams[key] !== nextParams[key]) {
            return true;
        }
    }
    for (var key in prevParams) {
        if (key === nextWildCardName) {
            continue;
        }
        if (prevParams[key] !== nextParams[key]) {
            return true;
        }
    }
    if (!next.options.compareQueryParams) {
        return false;
    }
    var prevQueryParams = prev.queryParams;
    var nextQueryParams = next.queryParams;
    for (var key in nextQueryParams) {
        if (prevQueryParams[key] !== nextQueryParams[key]) {
            return true;
        }
    }
    for (var key in prevQueryParams) {
        if (prevQueryParams[key] !== nextQueryParams[key]) {
            return true;
        }
    }
    return false;
};

/**
 * Transform a navigation instruction into viewport plan record object,
 * or a redirect request if user viewmodel demands
 */
var BuildNavigationPlanStep = /** @class */ (function () {
    function BuildNavigationPlanStep() {
    }
    BuildNavigationPlanStep.prototype.run = function (navigationInstruction, next) {
        return _buildNavigationPlan(navigationInstruction)
            .then(function (plan) {
            if (plan instanceof Redirect) {
                return next.cancel(plan);
            }
            navigationInstruction.plan = plan;
            return next();
        })
            .catch(next.cancel);
    };
    return BuildNavigationPlanStep;
}());

/**
 * @internal Exported for unit testing
 */
var loadNewRoute = function (routeLoader, navigationInstruction) {
    var loadingPlans = determineLoadingPlans(navigationInstruction);
    var loadPromises = loadingPlans.map(function (loadingPlan) { return loadRoute(routeLoader, loadingPlan.navigationInstruction, loadingPlan.viewPortPlan); });
    return Promise.all(loadPromises);
};
/**
 * @internal Exported for unit testing
 */
var determineLoadingPlans = function (navigationInstruction, loadingPlans) {
    if (loadingPlans === void 0) { loadingPlans = []; }
    var viewPortPlans = navigationInstruction.plan;
    for (var viewPortName in viewPortPlans) {
        var viewPortPlan = viewPortPlans[viewPortName];
        var childNavInstruction = viewPortPlan.childNavigationInstruction;
        if (viewPortPlan.strategy === "replace" /* Replace */) {
            loadingPlans.push({ viewPortPlan: viewPortPlan, navigationInstruction: navigationInstruction });
            if (childNavInstruction) {
                determineLoadingPlans(childNavInstruction, loadingPlans);
            }
        }
        else {
            var viewPortInstruction = navigationInstruction.addViewPortInstruction({
                name: viewPortName,
                strategy: viewPortPlan.strategy,
                moduleId: viewPortPlan.prevModuleId,
                component: viewPortPlan.prevComponent
            });
            if (childNavInstruction) {
                viewPortInstruction.childNavigationInstruction = childNavInstruction;
                determineLoadingPlans(childNavInstruction, loadingPlans);
            }
        }
    }
    return loadingPlans;
};
/**
 * @internal Exported for unit testing
 */
var loadRoute = function (routeLoader, navigationInstruction, viewPortPlan) {
    var planConfig = viewPortPlan.config;
    var moduleId = planConfig ? planConfig.moduleId : null;
    return loadComponent(routeLoader, navigationInstruction, planConfig)
        .then(function (component) {
        var viewPortInstruction = navigationInstruction.addViewPortInstruction({
            name: viewPortPlan.name,
            strategy: viewPortPlan.strategy,
            moduleId: moduleId,
            component: component
        });
        var childRouter = component.childRouter;
        if (childRouter) {
            var path = navigationInstruction.getWildcardPath();
            return childRouter
                ._createNavigationInstruction(path, navigationInstruction)
                .then(function (childInstruction) {
                viewPortPlan.childNavigationInstruction = childInstruction;
                return _buildNavigationPlan(childInstruction)
                    .then(function (childPlan) {
                    if (childPlan instanceof Redirect) {
                        return Promise.reject(childPlan);
                    }
                    childInstruction.plan = childPlan;
                    viewPortInstruction.childNavigationInstruction = childInstruction;
                    return loadNewRoute(routeLoader, childInstruction);
                });
            });
        }
        // ts complains without this, though they are same
        return void 0;
    });
};
/**
 * Load a routed-component based on navigation instruction and route config
 * @internal exported for unit testing only
 */
var loadComponent = function (routeLoader, navigationInstruction, config) {
    var router = navigationInstruction.router;
    var lifecycleArgs = navigationInstruction.lifecycleArgs;
    return Promise.resolve()
        .then(function () { return routeLoader.loadRoute(router, config, navigationInstruction); })
        .then(
    /**
     * @param component an object carrying information about loaded route
     * typically contains information about view model, childContainer, view and router
     */
    function (component) {
        var viewModel = component.viewModel, childContainer = component.childContainer;
        component.router = router;
        component.config = config;
        if ('configureRouter' in viewModel) {
            var childRouter_1 = childContainer.getChildRouter();
            component.childRouter = childRouter_1;
            return childRouter_1
                .configure(function (c) { return viewModel.configureRouter(c, childRouter_1, lifecycleArgs[0], lifecycleArgs[1], lifecycleArgs[2]); })
                .then(function () { return component; });
        }
        return component;
    });
};

/**
 * Abstract class that is responsible for loading view / view model from a route config
 * The default implementation can be found in `aurelia-templating-router`
 */
var RouteLoader = /** @class */ (function () {
    function RouteLoader() {
    }
    /**
     * Load a route config based on its viewmodel / view configuration
     */
    // return typing: return typings used to be never
    // as it was a throw. Changing it to Promise<any> should not cause any issues
    RouteLoader.prototype.loadRoute = function (router, config, navigationInstruction) {
        throw new Error('Route loaders must implement "loadRoute(router, config, navigationInstruction)".');
    };
    return RouteLoader;
}());

/**
 * A pipeline step responsible for loading a route config of a navigation instruction
 */
var LoadRouteStep = /** @class */ (function () {
    function LoadRouteStep(routeLoader) {
        this.routeLoader = routeLoader;
    }
    /**@internal */
    LoadRouteStep.inject = function () { return [RouteLoader]; };
    /**
     * Run the internal to load route config of a navigation instruction to prepare for next steps in the pipeline
     */
    LoadRouteStep.prototype.run = function (navigationInstruction, next) {
        return loadNewRoute(this.routeLoader, navigationInstruction)
            .then(next, next.cancel);
    };
    return LoadRouteStep;
}());

/**
 * A pipeline step for instructing a piepline to commit changes on a navigation instruction
 */
var CommitChangesStep = /** @class */ (function () {
    function CommitChangesStep() {
    }
    CommitChangesStep.prototype.run = function (navigationInstruction, next) {
        return navigationInstruction
            ._commitChanges(/*wait to swap?*/ true)
            .then(function () {
            navigationInstruction._updateTitle();
            return next();
        });
    };
    return CommitChangesStep;
}());

/**
 * An optional interface describing the available activation strategies.
 * @internal Used internally.
 */
var InternalActivationStrategy;
(function (InternalActivationStrategy) {
    /**
     * Reuse the existing view model, without invoking Router lifecycle hooks.
     */
    InternalActivationStrategy["NoChange"] = "no-change";
    /**
     * Reuse the existing view model, invoking Router lifecycle hooks.
     */
    InternalActivationStrategy["InvokeLifecycle"] = "invoke-lifecycle";
    /**
     * Replace the existing view model, invoking Router lifecycle hooks.
     */
    InternalActivationStrategy["Replace"] = "replace";
})(InternalActivationStrategy || (InternalActivationStrategy = {}));
/**
 * The strategy to use when activating modules during navigation.
 */
// kept for compat reason
var activationStrategy = {
    noChange: "no-change" /* NoChange */,
    invokeLifecycle: "invoke-lifecycle" /* InvokeLifecycle */,
    replace: "replace" /* Replace */
};

/**
 * Recursively find list of deactivate-able view models
 * and invoke the either 'canDeactivate' or 'deactivate' on each
 * @internal exported for unit testing
 */
var processDeactivatable = function (navigationInstruction, callbackName, next, ignoreResult) {
    var plan = navigationInstruction.plan;
    var infos = findDeactivatable(plan, callbackName);
    var i = infos.length; // query from inside out
    function inspect(val) {
        if (ignoreResult || shouldContinue(val)) {
            return iterate();
        }
        return next.cancel(val);
    }
    function iterate() {
        if (i--) {
            try {
                var viewModel = infos[i];
                var result = viewModel[callbackName](navigationInstruction);
                return processPotential(result, inspect, next.cancel);
            }
            catch (error) {
                return next.cancel(error);
            }
        }
        navigationInstruction.router.couldDeactivate = true;
        return next();
    }
    return iterate();
};
/**
 * Recursively find and returns a list of deactivate-able view models
 * @internal exported for unit testing
 */
var findDeactivatable = function (plan, callbackName, list) {
    if (list === void 0) { list = []; }
    for (var viewPortName in plan) {
        var viewPortPlan = plan[viewPortName];
        var prevComponent = viewPortPlan.prevComponent;
        if ((viewPortPlan.strategy === activationStrategy.invokeLifecycle || viewPortPlan.strategy === activationStrategy.replace)
            && prevComponent) {
            var viewModel = prevComponent.viewModel;
            if (callbackName in viewModel) {
                list.push(viewModel);
            }
        }
        if (viewPortPlan.strategy === activationStrategy.replace && prevComponent) {
            addPreviousDeactivatable(prevComponent, callbackName, list);
        }
        else if (viewPortPlan.childNavigationInstruction) {
            findDeactivatable(viewPortPlan.childNavigationInstruction.plan, callbackName, list);
        }
    }
    return list;
};
/**
 * @internal exported for unit testing
 */
var addPreviousDeactivatable = function (component, callbackName, list) {
    var childRouter = component.childRouter;
    if (childRouter && childRouter.currentInstruction) {
        var viewPortInstructions = childRouter.currentInstruction.viewPortInstructions;
        for (var viewPortName in viewPortInstructions) {
            var viewPortInstruction = viewPortInstructions[viewPortName];
            var prevComponent = viewPortInstruction.component;
            var prevViewModel = prevComponent.viewModel;
            if (callbackName in prevViewModel) {
                list.push(prevViewModel);
            }
            addPreviousDeactivatable(prevComponent, callbackName, list);
        }
    }
};
/**
 * @internal exported for unit testing
 */
var processActivatable = function (navigationInstruction, callbackName, next, ignoreResult) {
    var infos = findActivatable(navigationInstruction, callbackName);
    var length = infos.length;
    var i = -1; // query from top down
    function inspect(val, router) {
        if (ignoreResult || shouldContinue(val, router)) {
            return iterate();
        }
        return next.cancel(val);
    }
    function iterate() {
        var _a;
        i++;
        if (i < length) {
            try {
                var current_1 = infos[i];
                var result = (_a = current_1.viewModel)[callbackName].apply(_a, current_1.lifecycleArgs);
                return processPotential(result, function (val) { return inspect(val, current_1.router); }, next.cancel);
            }
            catch (error) {
                return next.cancel(error);
            }
        }
        return next();
    }
    return iterate();
};
/**
 * Find list of activatable view model and add to list (3rd parameter)
 * @internal exported for unit testing
 */
var findActivatable = function (navigationInstruction, callbackName, list, router) {
    if (list === void 0) { list = []; }
    var plan = navigationInstruction.plan;
    Object
        .keys(plan)
        .forEach(function (viewPortName) {
        var viewPortPlan = plan[viewPortName];
        var viewPortInstruction = navigationInstruction.viewPortInstructions[viewPortName];
        var viewPortComponent = viewPortInstruction.component;
        var viewModel = viewPortComponent.viewModel;
        if ((viewPortPlan.strategy === activationStrategy.invokeLifecycle
            || viewPortPlan.strategy === activationStrategy.replace)
            && callbackName in viewModel) {
            list.push({
                viewModel: viewModel,
                lifecycleArgs: viewPortInstruction.lifecycleArgs,
                router: router
            });
        }
        var childNavInstruction = viewPortPlan.childNavigationInstruction;
        if (childNavInstruction) {
            findActivatable(childNavInstruction, callbackName, list, viewPortComponent.childRouter || router);
        }
    });
    return list;
};
var shouldContinue = function (output, router) {
    if (output instanceof Error) {
        return false;
    }
    if (isNavigationCommand(output)) {
        if (typeof output.setRouter === 'function') {
            output.setRouter(router);
        }
        return !!output.shouldContinueProcessing;
    }
    if (output === undefined) {
        return true;
    }
    return output;
};
/**
 * wraps a subscription, allowing unsubscribe calls even if
 * the first value comes synchronously
 */
var SafeSubscription = /** @class */ (function () {
    function SafeSubscription(subscriptionFunc) {
        this._subscribed = true;
        this._subscription = subscriptionFunc(this);
        if (!this._subscribed) {
            this.unsubscribe();
        }
    }
    Object.defineProperty(SafeSubscription.prototype, "subscribed", {
        get: function () {
            return this._subscribed;
        },
        enumerable: true,
        configurable: true
    });
    SafeSubscription.prototype.unsubscribe = function () {
        if (this._subscribed && this._subscription) {
            this._subscription.unsubscribe();
        }
        this._subscribed = false;
    };
    return SafeSubscription;
}());
/**
 * A function to process return value from `activate`/`canActivate` steps
 * Supports observable/promise
 *
 * For observable, resolve at first next() or on complete()
 */
var processPotential = function (obj, resolve, reject) {
    // if promise like
    if (obj && typeof obj.then === 'function') {
        return Promise.resolve(obj).then(resolve).catch(reject);
    }
    // if observable
    if (obj && typeof obj.subscribe === 'function') {
        var obs_1 = obj;
        return new SafeSubscription(function (sub) { return obs_1.subscribe({
            next: function () {
                if (sub.subscribed) {
                    sub.unsubscribe();
                    resolve(obj);
                }
            },
            error: function (error) {
                if (sub.subscribed) {
                    sub.unsubscribe();
                    reject(error);
                }
            },
            complete: function () {
                if (sub.subscribed) {
                    sub.unsubscribe();
                    resolve(obj);
                }
            }
        }); });
    }
    // else just resolve
    try {
        return resolve(obj);
    }
    catch (error) {
        return reject(error);
    }
};

/**
 * A pipeline step responsible for finding and activating method `canDeactivate` on a view model of a route
 */
var CanDeactivatePreviousStep = /** @class */ (function () {
    function CanDeactivatePreviousStep() {
    }
    CanDeactivatePreviousStep.prototype.run = function (navigationInstruction, next) {
        return processDeactivatable(navigationInstruction, 'canDeactivate', next);
    };
    return CanDeactivatePreviousStep;
}());
/**
 * A pipeline step responsible for finding and activating method `canActivate` on a view model of a route
 */
var CanActivateNextStep = /** @class */ (function () {
    function CanActivateNextStep() {
    }
    CanActivateNextStep.prototype.run = function (navigationInstruction, next) {
        return processActivatable(navigationInstruction, 'canActivate', next);
    };
    return CanActivateNextStep;
}());
/**
 * A pipeline step responsible for finding and activating method `deactivate` on a view model of a route
 */
var DeactivatePreviousStep = /** @class */ (function () {
    function DeactivatePreviousStep() {
    }
    DeactivatePreviousStep.prototype.run = function (navigationInstruction, next) {
        return processDeactivatable(navigationInstruction, 'deactivate', next, true);
    };
    return DeactivatePreviousStep;
}());
/**
 * A pipeline step responsible for finding and activating method `activate` on a view model of a route
 */
var ActivateNextStep = /** @class */ (function () {
    function ActivateNextStep() {
    }
    ActivateNextStep.prototype.run = function (navigationInstruction, next) {
        return processActivatable(navigationInstruction, 'activate', next, true);
    };
    return ActivateNextStep;
}());

/**
 * A multi-slots Pipeline Placeholder Step for hooking into a pipeline execution
 */
var PipelineSlot = /** @class */ (function () {
    function PipelineSlot(container, name, alias) {
        this.steps = [];
        this.container = container;
        this.slotName = name;
        this.slotAlias = alias;
    }
    PipelineSlot.prototype.getSteps = function () {
        var _this = this;
        return this.steps.map(function (x) { return _this.container.get(x); });
    };
    return PipelineSlot;
}());
/**
 * Class responsible for creating the navigation pipeline.
 */
var PipelineProvider = /** @class */ (function () {
    function PipelineProvider(container) {
        this.container = container;
        this.steps = [
            BuildNavigationPlanStep,
            CanDeactivatePreviousStep,
            LoadRouteStep,
            createPipelineSlot(container, "authorize" /* Authorize */),
            CanActivateNextStep,
            createPipelineSlot(container, "preActivate" /* PreActivate */, 'modelbind'),
            // NOTE: app state changes start below - point of no return
            DeactivatePreviousStep,
            ActivateNextStep,
            createPipelineSlot(container, "preRender" /* PreRender */, 'precommit'),
            CommitChangesStep,
            createPipelineSlot(container, "postRender" /* PostRender */, 'postcomplete')
        ];
    }
    /**@internal */
    PipelineProvider.inject = function () { return [__WEBPACK_IMPORTED_MODULE_1_aurelia_dependency_injection__["a" /* Container */]]; };
    /**
     * Create the navigation pipeline.
     */
    PipelineProvider.prototype.createPipeline = function (useCanDeactivateStep) {
        var _this = this;
        if (useCanDeactivateStep === void 0) { useCanDeactivateStep = true; }
        var pipeline = new Pipeline();
        this.steps.forEach(function (step) {
            if (useCanDeactivateStep || step !== CanDeactivatePreviousStep) {
                pipeline.addStep(_this.container.get(step));
            }
        });
        return pipeline;
    };
    /**@internal */
    PipelineProvider.prototype._findStep = function (name) {
        // Steps that are not PipelineSlots are constructor functions, and they will automatically fail. Probably.
        return this.steps.find(function (x) { return x.slotName === name || x.slotAlias === name; });
    };
    /**
     * Adds a step into the pipeline at a known slot location.
     */
    PipelineProvider.prototype.addStep = function (name, step) {
        var found = this._findStep(name);
        if (found) {
            var slotSteps = found.steps;
            // prevent duplicates
            if (!slotSteps.includes(step)) {
                slotSteps.push(step);
            }
        }
        else {
            throw new Error("Invalid pipeline slot name: " + name + ".");
        }
    };
    /**
     * Removes a step from a slot in the pipeline
     */
    PipelineProvider.prototype.removeStep = function (name, step) {
        var slot = this._findStep(name);
        if (slot) {
            var slotSteps = slot.steps;
            slotSteps.splice(slotSteps.indexOf(step), 1);
        }
    };
    /**
     * Clears all steps from a slot in the pipeline
     * @internal
     */
    PipelineProvider.prototype._clearSteps = function (name) {
        if (name === void 0) { name = ''; }
        var slot = this._findStep(name);
        if (slot) {
            slot.steps = [];
        }
    };
    /**
     * Resets all pipeline slots
     */
    PipelineProvider.prototype.reset = function () {
        this._clearSteps("authorize" /* Authorize */);
        this._clearSteps("preActivate" /* PreActivate */);
        this._clearSteps("preRender" /* PreRender */);
        this._clearSteps("postRender" /* PostRender */);
    };
    return PipelineProvider;
}());
/**@internal */
var createPipelineSlot = function (container, name, alias) {
    return new PipelineSlot(container, name, alias);
};

var logger = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0_aurelia_logging__["getLogger"])('app-router');
/**
 * The main application router.
 */
var AppRouter = /** @class */ (function (_super) {
    __extends(AppRouter, _super);
    function AppRouter(container, history, pipelineProvider, events) {
        var _this = _super.call(this, container, history) || this;
        _this.pipelineProvider = pipelineProvider;
        _this.events = events;
        return _this;
    }
    /**@internal */
    AppRouter.inject = function () { return [__WEBPACK_IMPORTED_MODULE_1_aurelia_dependency_injection__["a" /* Container */], __WEBPACK_IMPORTED_MODULE_2_aurelia_history__["a" /* History */], PipelineProvider, __WEBPACK_IMPORTED_MODULE_4_aurelia_event_aggregator__["b" /* EventAggregator */]]; };
    /**
     * Fully resets the router's internal state. Primarily used internally by the framework when multiple calls to setRoot are made.
     * Use with caution (actually, avoid using this). Do not use this to simply change your navigation model.
     */
    AppRouter.prototype.reset = function () {
        _super.prototype.reset.call(this);
        this.maxInstructionCount = 10;
        if (!this._queue) {
            this._queue = [];
        }
        else {
            this._queue.length = 0;
        }
    };
    /**
     * Loads the specified URL.
     *
     * @param url The URL fragment to load.
     */
    AppRouter.prototype.loadUrl = function (url) {
        var _this = this;
        return this
            ._createNavigationInstruction(url)
            .then(function (instruction) { return _this._queueInstruction(instruction); })
            .catch(function (error) {
            logger.error(error);
            restorePreviousLocation(_this);
        });
    };
    /**
     * Registers a viewPort to be used as a rendering target for activated routes.
     *
     * @param viewPort The viewPort. This is typically a <router-view/> element in Aurelia default impl
     * @param name The name of the viewPort. 'default' if unspecified.
     */
    AppRouter.prototype.registerViewPort = function (viewPort, name) {
        var _this = this;
        // having strong typing without changing public API
        var $viewPort = viewPort;
        _super.prototype.registerViewPort.call(this, $viewPort, name);
        // beside adding viewport to the registry of this instance
        // AppRouter also configure routing/history to start routing functionality
        // There are situation where there are more than 1 <router-view/> element at root view
        // in that case, still only activate once via the following guard
        if (!this.isActive) {
            var viewModel_1 = this._findViewModel($viewPort);
            if ('configureRouter' in viewModel_1) {
                // If there are more than one <router-view/> element at root view
                // use this flag to guard against configure method being invoked multiple times
                // this flag is set inside method configure
                if (!this.isConfigured) {
                    // replace the real resolve with a noop to guarantee that any action in base class Router
                    // won't resolve the configurePromise prematurely
                    var resolveConfiguredPromise_1 = this._resolveConfiguredPromise;
                    this._resolveConfiguredPromise = function () { };
                    return this
                        .configure(function (config) {
                        return Promise
                            .resolve(viewModel_1.configureRouter(config, _this))
                            // an issue with configure interface. Should be fixed there
                            // todo: fix this via configure interface in router
                            .then(function () { return config; });
                    })
                        .then(function () {
                        _this.activate();
                        resolveConfiguredPromise_1();
                    });
                }
            }
            else {
                this.activate();
            }
        }
        // when a viewport is added dynamically to a root view that is already activated
        // just process the navigation instruction
        else {
            this._dequeueInstruction();
        }
        return Promise.resolve();
    };
    /**
     * Activates the router. This instructs the router to begin listening for history changes and processing instructions.
     *
     * @params options The set of options to activate the router with.
     */
    AppRouter.prototype.activate = function (options) {
        if (this.isActive) {
            return;
        }
        this.isActive = true;
        // route handler property is responsible for handling url change
        // the interface of aurelia-history isn't clear on this perspective
        this.options = Object.assign({ routeHandler: this.loadUrl.bind(this) }, this.options, options);
        this.history.activate(this.options);
        this._dequeueInstruction();
    };
    /**
     * Deactivates the router.
     */
    AppRouter.prototype.deactivate = function () {
        this.isActive = false;
        this.history.deactivate();
    };
    /**@internal */
    AppRouter.prototype._queueInstruction = function (instruction) {
        var _this = this;
        return new Promise(function (resolve) {
            instruction.resolve = resolve;
            _this._queue.unshift(instruction);
            _this._dequeueInstruction();
        });
    };
    /**@internal */
    AppRouter.prototype._dequeueInstruction = function (instructionCount) {
        var _this = this;
        if (instructionCount === void 0) { instructionCount = 0; }
        return Promise.resolve().then(function () {
            if (_this.isNavigating && !instructionCount) {
                // ts complains about inconsistent returns without void 0
                return void 0;
            }
            var instruction = _this._queue.shift();
            _this._queue.length = 0;
            if (!instruction) {
                // ts complains about inconsistent returns without void 0
                return void 0;
            }
            _this.isNavigating = true;
            var navtracker = _this.history.getState('NavigationTracker');
            var currentNavTracker = _this.currentNavigationTracker;
            if (!navtracker && !currentNavTracker) {
                _this.isNavigatingFirst = true;
                _this.isNavigatingNew = true;
            }
            else if (!navtracker) {
                _this.isNavigatingNew = true;
            }
            else if (!currentNavTracker) {
                _this.isNavigatingRefresh = true;
            }
            else if (currentNavTracker < navtracker) {
                _this.isNavigatingForward = true;
            }
            else if (currentNavTracker > navtracker) {
                _this.isNavigatingBack = true;
            }
            if (!navtracker) {
                navtracker = Date.now();
                _this.history.setState('NavigationTracker', navtracker);
            }
            _this.currentNavigationTracker = navtracker;
            instruction.previousInstruction = _this.currentInstruction;
            var maxInstructionCount = _this.maxInstructionCount;
            if (!instructionCount) {
                _this.events.publish("router:navigation:processing" /* Processing */, { instruction: instruction });
            }
            else if (instructionCount === maxInstructionCount - 1) {
                logger.error(instructionCount + 1 + " navigation instructions have been attempted without success. Restoring last known good location.");
                restorePreviousLocation(_this);
                return _this._dequeueInstruction(instructionCount + 1);
            }
            else if (instructionCount > maxInstructionCount) {
                throw new Error('Maximum navigation attempts exceeded. Giving up.');
            }
            var pipeline = _this.pipelineProvider.createPipeline(!_this.couldDeactivate);
            return pipeline
                .run(instruction)
                .then(function (result) { return processResult(instruction, result, instructionCount, _this); })
                .catch(function (error) {
                return { output: error instanceof Error ? error : new Error(error) };
            })
                .then(function (result) { return resolveInstruction(instruction, result, !!instructionCount, _this); });
        });
    };
    /**@internal */
    AppRouter.prototype._findViewModel = function (viewPort) {
        if (this.container.viewModel) {
            return this.container.viewModel;
        }
        if (viewPort.container) {
            var container = viewPort.container;
            while (container) {
                if (container.viewModel) {
                    this.container.viewModel = container.viewModel;
                    return container.viewModel;
                }
                container = container.parent;
            }
        }
        return undefined;
    };
    return AppRouter;
}(Router));
var processResult = function (instruction, result, instructionCount, router) {
    if (!(result && 'completed' in result && 'output' in result)) {
        result = result || {};
        result.output = new Error("Expected router pipeline to return a navigation result, but got [" + JSON.stringify(result) + "] instead.");
    }
    var finalResult = null;
    var navigationCommandResult = null;
    if (isNavigationCommand(result.output)) {
        navigationCommandResult = result.output.navigate(router);
    }
    else {
        finalResult = result;
        if (!result.completed) {
            if (result.output instanceof Error) {
                logger.error(result.output.toString());
            }
            restorePreviousLocation(router);
        }
    }
    return Promise.resolve(navigationCommandResult)
        .then(function (_) { return router._dequeueInstruction(instructionCount + 1); })
        .then(function (innerResult) { return finalResult || innerResult || result; });
};
var resolveInstruction = function (instruction, result, isInnerInstruction, router) {
    instruction.resolve(result);
    var eventAggregator = router.events;
    var eventArgs = { instruction: instruction, result: result };
    if (!isInnerInstruction) {
        router.isNavigating = false;
        router.isExplicitNavigation = false;
        router.isExplicitNavigationBack = false;
        router.isNavigatingFirst = false;
        router.isNavigatingNew = false;
        router.isNavigatingRefresh = false;
        router.isNavigatingForward = false;
        router.isNavigatingBack = false;
        router.couldDeactivate = false;
        var eventName = void 0;
        if (result.output instanceof Error) {
            eventName = "router:navigation:error" /* Error */;
        }
        else if (!result.completed) {
            eventName = "router:navigation:canceled" /* Canceled */;
        }
        else {
            var queryString = instruction.queryString ? ('?' + instruction.queryString) : '';
            router.history.previousLocation = instruction.fragment + queryString;
            eventName = "router:navigation:success" /* Success */;
        }
        eventAggregator.publish(eventName, eventArgs);
        eventAggregator.publish("router:navigation:complete" /* Complete */, eventArgs);
    }
    else {
        eventAggregator.publish("router:navigation:child:complete" /* ChildComplete */, eventArgs);
    }
    return result;
};
var restorePreviousLocation = function (router) {
    var previousLocation = router.history.previousLocation;
    if (previousLocation) {
        router.navigate(previousLocation, { trigger: false, replace: true });
    }
    else if (router.fallbackRoute) {
        router.navigate(router.fallbackRoute, { trigger: true, replace: true });
    }
    else {
        logger.error('Router navigation failed, and no previous location or fallbackRoute could be restored.');
    }
};

/**
* The status of a Pipeline.
*/
var PipelineStatus;
(function (PipelineStatus) {
    PipelineStatus["Completed"] = "completed";
    PipelineStatus["Canceled"] = "canceled";
    PipelineStatus["Rejected"] = "rejected";
    PipelineStatus["Running"] = "running";
})(PipelineStatus || (PipelineStatus = {}));

/**
 * A list of known router events used by the Aurelia router
 * to signal the pipeline has come to a certain state
 */
// const enum is preserved in tsconfig
var RouterEvent;
(function (RouterEvent) {
    RouterEvent["Processing"] = "router:navigation:processing";
    RouterEvent["Error"] = "router:navigation:error";
    RouterEvent["Canceled"] = "router:navigation:canceled";
    RouterEvent["Complete"] = "router:navigation:complete";
    RouterEvent["Success"] = "router:navigation:success";
    RouterEvent["ChildComplete"] = "router:navigation:child:complete";
})(RouterEvent || (RouterEvent = {}));

/**
 * Available pipeline slot names to insert interceptor into router pipeline
 */
// const enum is preserved in tsconfig
var PipelineSlotName;
(function (PipelineSlotName) {
    /**
     * Authorization slot. Invoked early in the pipeline,
     * before `canActivate` hook of incoming route
     */
    PipelineSlotName["Authorize"] = "authorize";
    /**
     * Pre-activation slot. Invoked early in the pipeline,
     * Invoked timing:
     *   - after Authorization slot
     *   - after canActivate hook on new view model
     *   - before deactivate hook on old view model
     *   - before activate hook on new view model
     */
    PipelineSlotName["PreActivate"] = "preActivate";
    /**
     * Pre-render slot. Invoked later in the pipeline
     * Invokcation timing:
     *   - after activate hook on new view model
     *   - before commit step on new navigation instruction
     */
    PipelineSlotName["PreRender"] = "preRender";
    /**
     * Post-render slot. Invoked last in the pipeline
     */
    PipelineSlotName["PostRender"] = "postRender";
})(PipelineSlotName || (PipelineSlotName = {}));


//# sourceMappingURL=aurelia-router.js.map


/***/ }),

/***/ 14:
/***/ (function(module, exports) {

var ENTITIES = [['Aacute', [193]], ['aacute', [225]], ['Abreve', [258]], ['abreve', [259]], ['ac', [8766]], ['acd', [8767]], ['acE', [8766, 819]], ['Acirc', [194]], ['acirc', [226]], ['acute', [180]], ['Acy', [1040]], ['acy', [1072]], ['AElig', [198]], ['aelig', [230]], ['af', [8289]], ['Afr', [120068]], ['afr', [120094]], ['Agrave', [192]], ['agrave', [224]], ['alefsym', [8501]], ['aleph', [8501]], ['Alpha', [913]], ['alpha', [945]], ['Amacr', [256]], ['amacr', [257]], ['amalg', [10815]], ['amp', [38]], ['AMP', [38]], ['andand', [10837]], ['And', [10835]], ['and', [8743]], ['andd', [10844]], ['andslope', [10840]], ['andv', [10842]], ['ang', [8736]], ['ange', [10660]], ['angle', [8736]], ['angmsdaa', [10664]], ['angmsdab', [10665]], ['angmsdac', [10666]], ['angmsdad', [10667]], ['angmsdae', [10668]], ['angmsdaf', [10669]], ['angmsdag', [10670]], ['angmsdah', [10671]], ['angmsd', [8737]], ['angrt', [8735]], ['angrtvb', [8894]], ['angrtvbd', [10653]], ['angsph', [8738]], ['angst', [197]], ['angzarr', [9084]], ['Aogon', [260]], ['aogon', [261]], ['Aopf', [120120]], ['aopf', [120146]], ['apacir', [10863]], ['ap', [8776]], ['apE', [10864]], ['ape', [8778]], ['apid', [8779]], ['apos', [39]], ['ApplyFunction', [8289]], ['approx', [8776]], ['approxeq', [8778]], ['Aring', [197]], ['aring', [229]], ['Ascr', [119964]], ['ascr', [119990]], ['Assign', [8788]], ['ast', [42]], ['asymp', [8776]], ['asympeq', [8781]], ['Atilde', [195]], ['atilde', [227]], ['Auml', [196]], ['auml', [228]], ['awconint', [8755]], ['awint', [10769]], ['backcong', [8780]], ['backepsilon', [1014]], ['backprime', [8245]], ['backsim', [8765]], ['backsimeq', [8909]], ['Backslash', [8726]], ['Barv', [10983]], ['barvee', [8893]], ['barwed', [8965]], ['Barwed', [8966]], ['barwedge', [8965]], ['bbrk', [9141]], ['bbrktbrk', [9142]], ['bcong', [8780]], ['Bcy', [1041]], ['bcy', [1073]], ['bdquo', [8222]], ['becaus', [8757]], ['because', [8757]], ['Because', [8757]], ['bemptyv', [10672]], ['bepsi', [1014]], ['bernou', [8492]], ['Bernoullis', [8492]], ['Beta', [914]], ['beta', [946]], ['beth', [8502]], ['between', [8812]], ['Bfr', [120069]], ['bfr', [120095]], ['bigcap', [8898]], ['bigcirc', [9711]], ['bigcup', [8899]], ['bigodot', [10752]], ['bigoplus', [10753]], ['bigotimes', [10754]], ['bigsqcup', [10758]], ['bigstar', [9733]], ['bigtriangledown', [9661]], ['bigtriangleup', [9651]], ['biguplus', [10756]], ['bigvee', [8897]], ['bigwedge', [8896]], ['bkarow', [10509]], ['blacklozenge', [10731]], ['blacksquare', [9642]], ['blacktriangle', [9652]], ['blacktriangledown', [9662]], ['blacktriangleleft', [9666]], ['blacktriangleright', [9656]], ['blank', [9251]], ['blk12', [9618]], ['blk14', [9617]], ['blk34', [9619]], ['block', [9608]], ['bne', [61, 8421]], ['bnequiv', [8801, 8421]], ['bNot', [10989]], ['bnot', [8976]], ['Bopf', [120121]], ['bopf', [120147]], ['bot', [8869]], ['bottom', [8869]], ['bowtie', [8904]], ['boxbox', [10697]], ['boxdl', [9488]], ['boxdL', [9557]], ['boxDl', [9558]], ['boxDL', [9559]], ['boxdr', [9484]], ['boxdR', [9554]], ['boxDr', [9555]], ['boxDR', [9556]], ['boxh', [9472]], ['boxH', [9552]], ['boxhd', [9516]], ['boxHd', [9572]], ['boxhD', [9573]], ['boxHD', [9574]], ['boxhu', [9524]], ['boxHu', [9575]], ['boxhU', [9576]], ['boxHU', [9577]], ['boxminus', [8863]], ['boxplus', [8862]], ['boxtimes', [8864]], ['boxul', [9496]], ['boxuL', [9563]], ['boxUl', [9564]], ['boxUL', [9565]], ['boxur', [9492]], ['boxuR', [9560]], ['boxUr', [9561]], ['boxUR', [9562]], ['boxv', [9474]], ['boxV', [9553]], ['boxvh', [9532]], ['boxvH', [9578]], ['boxVh', [9579]], ['boxVH', [9580]], ['boxvl', [9508]], ['boxvL', [9569]], ['boxVl', [9570]], ['boxVL', [9571]], ['boxvr', [9500]], ['boxvR', [9566]], ['boxVr', [9567]], ['boxVR', [9568]], ['bprime', [8245]], ['breve', [728]], ['Breve', [728]], ['brvbar', [166]], ['bscr', [119991]], ['Bscr', [8492]], ['bsemi', [8271]], ['bsim', [8765]], ['bsime', [8909]], ['bsolb', [10693]], ['bsol', [92]], ['bsolhsub', [10184]], ['bull', [8226]], ['bullet', [8226]], ['bump', [8782]], ['bumpE', [10926]], ['bumpe', [8783]], ['Bumpeq', [8782]], ['bumpeq', [8783]], ['Cacute', [262]], ['cacute', [263]], ['capand', [10820]], ['capbrcup', [10825]], ['capcap', [10827]], ['cap', [8745]], ['Cap', [8914]], ['capcup', [10823]], ['capdot', [10816]], ['CapitalDifferentialD', [8517]], ['caps', [8745, 65024]], ['caret', [8257]], ['caron', [711]], ['Cayleys', [8493]], ['ccaps', [10829]], ['Ccaron', [268]], ['ccaron', [269]], ['Ccedil', [199]], ['ccedil', [231]], ['Ccirc', [264]], ['ccirc', [265]], ['Cconint', [8752]], ['ccups', [10828]], ['ccupssm', [10832]], ['Cdot', [266]], ['cdot', [267]], ['cedil', [184]], ['Cedilla', [184]], ['cemptyv', [10674]], ['cent', [162]], ['centerdot', [183]], ['CenterDot', [183]], ['cfr', [120096]], ['Cfr', [8493]], ['CHcy', [1063]], ['chcy', [1095]], ['check', [10003]], ['checkmark', [10003]], ['Chi', [935]], ['chi', [967]], ['circ', [710]], ['circeq', [8791]], ['circlearrowleft', [8634]], ['circlearrowright', [8635]], ['circledast', [8859]], ['circledcirc', [8858]], ['circleddash', [8861]], ['CircleDot', [8857]], ['circledR', [174]], ['circledS', [9416]], ['CircleMinus', [8854]], ['CirclePlus', [8853]], ['CircleTimes', [8855]], ['cir', [9675]], ['cirE', [10691]], ['cire', [8791]], ['cirfnint', [10768]], ['cirmid', [10991]], ['cirscir', [10690]], ['ClockwiseContourIntegral', [8754]], ['clubs', [9827]], ['clubsuit', [9827]], ['colon', [58]], ['Colon', [8759]], ['Colone', [10868]], ['colone', [8788]], ['coloneq', [8788]], ['comma', [44]], ['commat', [64]], ['comp', [8705]], ['compfn', [8728]], ['complement', [8705]], ['complexes', [8450]], ['cong', [8773]], ['congdot', [10861]], ['Congruent', [8801]], ['conint', [8750]], ['Conint', [8751]], ['ContourIntegral', [8750]], ['copf', [120148]], ['Copf', [8450]], ['coprod', [8720]], ['Coproduct', [8720]], ['copy', [169]], ['COPY', [169]], ['copysr', [8471]], ['CounterClockwiseContourIntegral', [8755]], ['crarr', [8629]], ['cross', [10007]], ['Cross', [10799]], ['Cscr', [119966]], ['cscr', [119992]], ['csub', [10959]], ['csube', [10961]], ['csup', [10960]], ['csupe', [10962]], ['ctdot', [8943]], ['cudarrl', [10552]], ['cudarrr', [10549]], ['cuepr', [8926]], ['cuesc', [8927]], ['cularr', [8630]], ['cularrp', [10557]], ['cupbrcap', [10824]], ['cupcap', [10822]], ['CupCap', [8781]], ['cup', [8746]], ['Cup', [8915]], ['cupcup', [10826]], ['cupdot', [8845]], ['cupor', [10821]], ['cups', [8746, 65024]], ['curarr', [8631]], ['curarrm', [10556]], ['curlyeqprec', [8926]], ['curlyeqsucc', [8927]], ['curlyvee', [8910]], ['curlywedge', [8911]], ['curren', [164]], ['curvearrowleft', [8630]], ['curvearrowright', [8631]], ['cuvee', [8910]], ['cuwed', [8911]], ['cwconint', [8754]], ['cwint', [8753]], ['cylcty', [9005]], ['dagger', [8224]], ['Dagger', [8225]], ['daleth', [8504]], ['darr', [8595]], ['Darr', [8609]], ['dArr', [8659]], ['dash', [8208]], ['Dashv', [10980]], ['dashv', [8867]], ['dbkarow', [10511]], ['dblac', [733]], ['Dcaron', [270]], ['dcaron', [271]], ['Dcy', [1044]], ['dcy', [1076]], ['ddagger', [8225]], ['ddarr', [8650]], ['DD', [8517]], ['dd', [8518]], ['DDotrahd', [10513]], ['ddotseq', [10871]], ['deg', [176]], ['Del', [8711]], ['Delta', [916]], ['delta', [948]], ['demptyv', [10673]], ['dfisht', [10623]], ['Dfr', [120071]], ['dfr', [120097]], ['dHar', [10597]], ['dharl', [8643]], ['dharr', [8642]], ['DiacriticalAcute', [180]], ['DiacriticalDot', [729]], ['DiacriticalDoubleAcute', [733]], ['DiacriticalGrave', [96]], ['DiacriticalTilde', [732]], ['diam', [8900]], ['diamond', [8900]], ['Diamond', [8900]], ['diamondsuit', [9830]], ['diams', [9830]], ['die', [168]], ['DifferentialD', [8518]], ['digamma', [989]], ['disin', [8946]], ['div', [247]], ['divide', [247]], ['divideontimes', [8903]], ['divonx', [8903]], ['DJcy', [1026]], ['djcy', [1106]], ['dlcorn', [8990]], ['dlcrop', [8973]], ['dollar', [36]], ['Dopf', [120123]], ['dopf', [120149]], ['Dot', [168]], ['dot', [729]], ['DotDot', [8412]], ['doteq', [8784]], ['doteqdot', [8785]], ['DotEqual', [8784]], ['dotminus', [8760]], ['dotplus', [8724]], ['dotsquare', [8865]], ['doublebarwedge', [8966]], ['DoubleContourIntegral', [8751]], ['DoubleDot', [168]], ['DoubleDownArrow', [8659]], ['DoubleLeftArrow', [8656]], ['DoubleLeftRightArrow', [8660]], ['DoubleLeftTee', [10980]], ['DoubleLongLeftArrow', [10232]], ['DoubleLongLeftRightArrow', [10234]], ['DoubleLongRightArrow', [10233]], ['DoubleRightArrow', [8658]], ['DoubleRightTee', [8872]], ['DoubleUpArrow', [8657]], ['DoubleUpDownArrow', [8661]], ['DoubleVerticalBar', [8741]], ['DownArrowBar', [10515]], ['downarrow', [8595]], ['DownArrow', [8595]], ['Downarrow', [8659]], ['DownArrowUpArrow', [8693]], ['DownBreve', [785]], ['downdownarrows', [8650]], ['downharpoonleft', [8643]], ['downharpoonright', [8642]], ['DownLeftRightVector', [10576]], ['DownLeftTeeVector', [10590]], ['DownLeftVectorBar', [10582]], ['DownLeftVector', [8637]], ['DownRightTeeVector', [10591]], ['DownRightVectorBar', [10583]], ['DownRightVector', [8641]], ['DownTeeArrow', [8615]], ['DownTee', [8868]], ['drbkarow', [10512]], ['drcorn', [8991]], ['drcrop', [8972]], ['Dscr', [119967]], ['dscr', [119993]], ['DScy', [1029]], ['dscy', [1109]], ['dsol', [10742]], ['Dstrok', [272]], ['dstrok', [273]], ['dtdot', [8945]], ['dtri', [9663]], ['dtrif', [9662]], ['duarr', [8693]], ['duhar', [10607]], ['dwangle', [10662]], ['DZcy', [1039]], ['dzcy', [1119]], ['dzigrarr', [10239]], ['Eacute', [201]], ['eacute', [233]], ['easter', [10862]], ['Ecaron', [282]], ['ecaron', [283]], ['Ecirc', [202]], ['ecirc', [234]], ['ecir', [8790]], ['ecolon', [8789]], ['Ecy', [1069]], ['ecy', [1101]], ['eDDot', [10871]], ['Edot', [278]], ['edot', [279]], ['eDot', [8785]], ['ee', [8519]], ['efDot', [8786]], ['Efr', [120072]], ['efr', [120098]], ['eg', [10906]], ['Egrave', [200]], ['egrave', [232]], ['egs', [10902]], ['egsdot', [10904]], ['el', [10905]], ['Element', [8712]], ['elinters', [9191]], ['ell', [8467]], ['els', [10901]], ['elsdot', [10903]], ['Emacr', [274]], ['emacr', [275]], ['empty', [8709]], ['emptyset', [8709]], ['EmptySmallSquare', [9723]], ['emptyv', [8709]], ['EmptyVerySmallSquare', [9643]], ['emsp13', [8196]], ['emsp14', [8197]], ['emsp', [8195]], ['ENG', [330]], ['eng', [331]], ['ensp', [8194]], ['Eogon', [280]], ['eogon', [281]], ['Eopf', [120124]], ['eopf', [120150]], ['epar', [8917]], ['eparsl', [10723]], ['eplus', [10865]], ['epsi', [949]], ['Epsilon', [917]], ['epsilon', [949]], ['epsiv', [1013]], ['eqcirc', [8790]], ['eqcolon', [8789]], ['eqsim', [8770]], ['eqslantgtr', [10902]], ['eqslantless', [10901]], ['Equal', [10869]], ['equals', [61]], ['EqualTilde', [8770]], ['equest', [8799]], ['Equilibrium', [8652]], ['equiv', [8801]], ['equivDD', [10872]], ['eqvparsl', [10725]], ['erarr', [10609]], ['erDot', [8787]], ['escr', [8495]], ['Escr', [8496]], ['esdot', [8784]], ['Esim', [10867]], ['esim', [8770]], ['Eta', [919]], ['eta', [951]], ['ETH', [208]], ['eth', [240]], ['Euml', [203]], ['euml', [235]], ['euro', [8364]], ['excl', [33]], ['exist', [8707]], ['Exists', [8707]], ['expectation', [8496]], ['exponentiale', [8519]], ['ExponentialE', [8519]], ['fallingdotseq', [8786]], ['Fcy', [1060]], ['fcy', [1092]], ['female', [9792]], ['ffilig', [64259]], ['fflig', [64256]], ['ffllig', [64260]], ['Ffr', [120073]], ['ffr', [120099]], ['filig', [64257]], ['FilledSmallSquare', [9724]], ['FilledVerySmallSquare', [9642]], ['fjlig', [102, 106]], ['flat', [9837]], ['fllig', [64258]], ['fltns', [9649]], ['fnof', [402]], ['Fopf', [120125]], ['fopf', [120151]], ['forall', [8704]], ['ForAll', [8704]], ['fork', [8916]], ['forkv', [10969]], ['Fouriertrf', [8497]], ['fpartint', [10765]], ['frac12', [189]], ['frac13', [8531]], ['frac14', [188]], ['frac15', [8533]], ['frac16', [8537]], ['frac18', [8539]], ['frac23', [8532]], ['frac25', [8534]], ['frac34', [190]], ['frac35', [8535]], ['frac38', [8540]], ['frac45', [8536]], ['frac56', [8538]], ['frac58', [8541]], ['frac78', [8542]], ['frasl', [8260]], ['frown', [8994]], ['fscr', [119995]], ['Fscr', [8497]], ['gacute', [501]], ['Gamma', [915]], ['gamma', [947]], ['Gammad', [988]], ['gammad', [989]], ['gap', [10886]], ['Gbreve', [286]], ['gbreve', [287]], ['Gcedil', [290]], ['Gcirc', [284]], ['gcirc', [285]], ['Gcy', [1043]], ['gcy', [1075]], ['Gdot', [288]], ['gdot', [289]], ['ge', [8805]], ['gE', [8807]], ['gEl', [10892]], ['gel', [8923]], ['geq', [8805]], ['geqq', [8807]], ['geqslant', [10878]], ['gescc', [10921]], ['ges', [10878]], ['gesdot', [10880]], ['gesdoto', [10882]], ['gesdotol', [10884]], ['gesl', [8923, 65024]], ['gesles', [10900]], ['Gfr', [120074]], ['gfr', [120100]], ['gg', [8811]], ['Gg', [8921]], ['ggg', [8921]], ['gimel', [8503]], ['GJcy', [1027]], ['gjcy', [1107]], ['gla', [10917]], ['gl', [8823]], ['glE', [10898]], ['glj', [10916]], ['gnap', [10890]], ['gnapprox', [10890]], ['gne', [10888]], ['gnE', [8809]], ['gneq', [10888]], ['gneqq', [8809]], ['gnsim', [8935]], ['Gopf', [120126]], ['gopf', [120152]], ['grave', [96]], ['GreaterEqual', [8805]], ['GreaterEqualLess', [8923]], ['GreaterFullEqual', [8807]], ['GreaterGreater', [10914]], ['GreaterLess', [8823]], ['GreaterSlantEqual', [10878]], ['GreaterTilde', [8819]], ['Gscr', [119970]], ['gscr', [8458]], ['gsim', [8819]], ['gsime', [10894]], ['gsiml', [10896]], ['gtcc', [10919]], ['gtcir', [10874]], ['gt', [62]], ['GT', [62]], ['Gt', [8811]], ['gtdot', [8919]], ['gtlPar', [10645]], ['gtquest', [10876]], ['gtrapprox', [10886]], ['gtrarr', [10616]], ['gtrdot', [8919]], ['gtreqless', [8923]], ['gtreqqless', [10892]], ['gtrless', [8823]], ['gtrsim', [8819]], ['gvertneqq', [8809, 65024]], ['gvnE', [8809, 65024]], ['Hacek', [711]], ['hairsp', [8202]], ['half', [189]], ['hamilt', [8459]], ['HARDcy', [1066]], ['hardcy', [1098]], ['harrcir', [10568]], ['harr', [8596]], ['hArr', [8660]], ['harrw', [8621]], ['Hat', [94]], ['hbar', [8463]], ['Hcirc', [292]], ['hcirc', [293]], ['hearts', [9829]], ['heartsuit', [9829]], ['hellip', [8230]], ['hercon', [8889]], ['hfr', [120101]], ['Hfr', [8460]], ['HilbertSpace', [8459]], ['hksearow', [10533]], ['hkswarow', [10534]], ['hoarr', [8703]], ['homtht', [8763]], ['hookleftarrow', [8617]], ['hookrightarrow', [8618]], ['hopf', [120153]], ['Hopf', [8461]], ['horbar', [8213]], ['HorizontalLine', [9472]], ['hscr', [119997]], ['Hscr', [8459]], ['hslash', [8463]], ['Hstrok', [294]], ['hstrok', [295]], ['HumpDownHump', [8782]], ['HumpEqual', [8783]], ['hybull', [8259]], ['hyphen', [8208]], ['Iacute', [205]], ['iacute', [237]], ['ic', [8291]], ['Icirc', [206]], ['icirc', [238]], ['Icy', [1048]], ['icy', [1080]], ['Idot', [304]], ['IEcy', [1045]], ['iecy', [1077]], ['iexcl', [161]], ['iff', [8660]], ['ifr', [120102]], ['Ifr', [8465]], ['Igrave', [204]], ['igrave', [236]], ['ii', [8520]], ['iiiint', [10764]], ['iiint', [8749]], ['iinfin', [10716]], ['iiota', [8489]], ['IJlig', [306]], ['ijlig', [307]], ['Imacr', [298]], ['imacr', [299]], ['image', [8465]], ['ImaginaryI', [8520]], ['imagline', [8464]], ['imagpart', [8465]], ['imath', [305]], ['Im', [8465]], ['imof', [8887]], ['imped', [437]], ['Implies', [8658]], ['incare', [8453]], ['in', [8712]], ['infin', [8734]], ['infintie', [10717]], ['inodot', [305]], ['intcal', [8890]], ['int', [8747]], ['Int', [8748]], ['integers', [8484]], ['Integral', [8747]], ['intercal', [8890]], ['Intersection', [8898]], ['intlarhk', [10775]], ['intprod', [10812]], ['InvisibleComma', [8291]], ['InvisibleTimes', [8290]], ['IOcy', [1025]], ['iocy', [1105]], ['Iogon', [302]], ['iogon', [303]], ['Iopf', [120128]], ['iopf', [120154]], ['Iota', [921]], ['iota', [953]], ['iprod', [10812]], ['iquest', [191]], ['iscr', [119998]], ['Iscr', [8464]], ['isin', [8712]], ['isindot', [8949]], ['isinE', [8953]], ['isins', [8948]], ['isinsv', [8947]], ['isinv', [8712]], ['it', [8290]], ['Itilde', [296]], ['itilde', [297]], ['Iukcy', [1030]], ['iukcy', [1110]], ['Iuml', [207]], ['iuml', [239]], ['Jcirc', [308]], ['jcirc', [309]], ['Jcy', [1049]], ['jcy', [1081]], ['Jfr', [120077]], ['jfr', [120103]], ['jmath', [567]], ['Jopf', [120129]], ['jopf', [120155]], ['Jscr', [119973]], ['jscr', [119999]], ['Jsercy', [1032]], ['jsercy', [1112]], ['Jukcy', [1028]], ['jukcy', [1108]], ['Kappa', [922]], ['kappa', [954]], ['kappav', [1008]], ['Kcedil', [310]], ['kcedil', [311]], ['Kcy', [1050]], ['kcy', [1082]], ['Kfr', [120078]], ['kfr', [120104]], ['kgreen', [312]], ['KHcy', [1061]], ['khcy', [1093]], ['KJcy', [1036]], ['kjcy', [1116]], ['Kopf', [120130]], ['kopf', [120156]], ['Kscr', [119974]], ['kscr', [120000]], ['lAarr', [8666]], ['Lacute', [313]], ['lacute', [314]], ['laemptyv', [10676]], ['lagran', [8466]], ['Lambda', [923]], ['lambda', [955]], ['lang', [10216]], ['Lang', [10218]], ['langd', [10641]], ['langle', [10216]], ['lap', [10885]], ['Laplacetrf', [8466]], ['laquo', [171]], ['larrb', [8676]], ['larrbfs', [10527]], ['larr', [8592]], ['Larr', [8606]], ['lArr', [8656]], ['larrfs', [10525]], ['larrhk', [8617]], ['larrlp', [8619]], ['larrpl', [10553]], ['larrsim', [10611]], ['larrtl', [8610]], ['latail', [10521]], ['lAtail', [10523]], ['lat', [10923]], ['late', [10925]], ['lates', [10925, 65024]], ['lbarr', [10508]], ['lBarr', [10510]], ['lbbrk', [10098]], ['lbrace', [123]], ['lbrack', [91]], ['lbrke', [10635]], ['lbrksld', [10639]], ['lbrkslu', [10637]], ['Lcaron', [317]], ['lcaron', [318]], ['Lcedil', [315]], ['lcedil', [316]], ['lceil', [8968]], ['lcub', [123]], ['Lcy', [1051]], ['lcy', [1083]], ['ldca', [10550]], ['ldquo', [8220]], ['ldquor', [8222]], ['ldrdhar', [10599]], ['ldrushar', [10571]], ['ldsh', [8626]], ['le', [8804]], ['lE', [8806]], ['LeftAngleBracket', [10216]], ['LeftArrowBar', [8676]], ['leftarrow', [8592]], ['LeftArrow', [8592]], ['Leftarrow', [8656]], ['LeftArrowRightArrow', [8646]], ['leftarrowtail', [8610]], ['LeftCeiling', [8968]], ['LeftDoubleBracket', [10214]], ['LeftDownTeeVector', [10593]], ['LeftDownVectorBar', [10585]], ['LeftDownVector', [8643]], ['LeftFloor', [8970]], ['leftharpoondown', [8637]], ['leftharpoonup', [8636]], ['leftleftarrows', [8647]], ['leftrightarrow', [8596]], ['LeftRightArrow', [8596]], ['Leftrightarrow', [8660]], ['leftrightarrows', [8646]], ['leftrightharpoons', [8651]], ['leftrightsquigarrow', [8621]], ['LeftRightVector', [10574]], ['LeftTeeArrow', [8612]], ['LeftTee', [8867]], ['LeftTeeVector', [10586]], ['leftthreetimes', [8907]], ['LeftTriangleBar', [10703]], ['LeftTriangle', [8882]], ['LeftTriangleEqual', [8884]], ['LeftUpDownVector', [10577]], ['LeftUpTeeVector', [10592]], ['LeftUpVectorBar', [10584]], ['LeftUpVector', [8639]], ['LeftVectorBar', [10578]], ['LeftVector', [8636]], ['lEg', [10891]], ['leg', [8922]], ['leq', [8804]], ['leqq', [8806]], ['leqslant', [10877]], ['lescc', [10920]], ['les', [10877]], ['lesdot', [10879]], ['lesdoto', [10881]], ['lesdotor', [10883]], ['lesg', [8922, 65024]], ['lesges', [10899]], ['lessapprox', [10885]], ['lessdot', [8918]], ['lesseqgtr', [8922]], ['lesseqqgtr', [10891]], ['LessEqualGreater', [8922]], ['LessFullEqual', [8806]], ['LessGreater', [8822]], ['lessgtr', [8822]], ['LessLess', [10913]], ['lesssim', [8818]], ['LessSlantEqual', [10877]], ['LessTilde', [8818]], ['lfisht', [10620]], ['lfloor', [8970]], ['Lfr', [120079]], ['lfr', [120105]], ['lg', [8822]], ['lgE', [10897]], ['lHar', [10594]], ['lhard', [8637]], ['lharu', [8636]], ['lharul', [10602]], ['lhblk', [9604]], ['LJcy', [1033]], ['ljcy', [1113]], ['llarr', [8647]], ['ll', [8810]], ['Ll', [8920]], ['llcorner', [8990]], ['Lleftarrow', [8666]], ['llhard', [10603]], ['lltri', [9722]], ['Lmidot', [319]], ['lmidot', [320]], ['lmoustache', [9136]], ['lmoust', [9136]], ['lnap', [10889]], ['lnapprox', [10889]], ['lne', [10887]], ['lnE', [8808]], ['lneq', [10887]], ['lneqq', [8808]], ['lnsim', [8934]], ['loang', [10220]], ['loarr', [8701]], ['lobrk', [10214]], ['longleftarrow', [10229]], ['LongLeftArrow', [10229]], ['Longleftarrow', [10232]], ['longleftrightarrow', [10231]], ['LongLeftRightArrow', [10231]], ['Longleftrightarrow', [10234]], ['longmapsto', [10236]], ['longrightarrow', [10230]], ['LongRightArrow', [10230]], ['Longrightarrow', [10233]], ['looparrowleft', [8619]], ['looparrowright', [8620]], ['lopar', [10629]], ['Lopf', [120131]], ['lopf', [120157]], ['loplus', [10797]], ['lotimes', [10804]], ['lowast', [8727]], ['lowbar', [95]], ['LowerLeftArrow', [8601]], ['LowerRightArrow', [8600]], ['loz', [9674]], ['lozenge', [9674]], ['lozf', [10731]], ['lpar', [40]], ['lparlt', [10643]], ['lrarr', [8646]], ['lrcorner', [8991]], ['lrhar', [8651]], ['lrhard', [10605]], ['lrm', [8206]], ['lrtri', [8895]], ['lsaquo', [8249]], ['lscr', [120001]], ['Lscr', [8466]], ['lsh', [8624]], ['Lsh', [8624]], ['lsim', [8818]], ['lsime', [10893]], ['lsimg', [10895]], ['lsqb', [91]], ['lsquo', [8216]], ['lsquor', [8218]], ['Lstrok', [321]], ['lstrok', [322]], ['ltcc', [10918]], ['ltcir', [10873]], ['lt', [60]], ['LT', [60]], ['Lt', [8810]], ['ltdot', [8918]], ['lthree', [8907]], ['ltimes', [8905]], ['ltlarr', [10614]], ['ltquest', [10875]], ['ltri', [9667]], ['ltrie', [8884]], ['ltrif', [9666]], ['ltrPar', [10646]], ['lurdshar', [10570]], ['luruhar', [10598]], ['lvertneqq', [8808, 65024]], ['lvnE', [8808, 65024]], ['macr', [175]], ['male', [9794]], ['malt', [10016]], ['maltese', [10016]], ['Map', [10501]], ['map', [8614]], ['mapsto', [8614]], ['mapstodown', [8615]], ['mapstoleft', [8612]], ['mapstoup', [8613]], ['marker', [9646]], ['mcomma', [10793]], ['Mcy', [1052]], ['mcy', [1084]], ['mdash', [8212]], ['mDDot', [8762]], ['measuredangle', [8737]], ['MediumSpace', [8287]], ['Mellintrf', [8499]], ['Mfr', [120080]], ['mfr', [120106]], ['mho', [8487]], ['micro', [181]], ['midast', [42]], ['midcir', [10992]], ['mid', [8739]], ['middot', [183]], ['minusb', [8863]], ['minus', [8722]], ['minusd', [8760]], ['minusdu', [10794]], ['MinusPlus', [8723]], ['mlcp', [10971]], ['mldr', [8230]], ['mnplus', [8723]], ['models', [8871]], ['Mopf', [120132]], ['mopf', [120158]], ['mp', [8723]], ['mscr', [120002]], ['Mscr', [8499]], ['mstpos', [8766]], ['Mu', [924]], ['mu', [956]], ['multimap', [8888]], ['mumap', [8888]], ['nabla', [8711]], ['Nacute', [323]], ['nacute', [324]], ['nang', [8736, 8402]], ['nap', [8777]], ['napE', [10864, 824]], ['napid', [8779, 824]], ['napos', [329]], ['napprox', [8777]], ['natural', [9838]], ['naturals', [8469]], ['natur', [9838]], ['nbsp', [160]], ['nbump', [8782, 824]], ['nbumpe', [8783, 824]], ['ncap', [10819]], ['Ncaron', [327]], ['ncaron', [328]], ['Ncedil', [325]], ['ncedil', [326]], ['ncong', [8775]], ['ncongdot', [10861, 824]], ['ncup', [10818]], ['Ncy', [1053]], ['ncy', [1085]], ['ndash', [8211]], ['nearhk', [10532]], ['nearr', [8599]], ['neArr', [8663]], ['nearrow', [8599]], ['ne', [8800]], ['nedot', [8784, 824]], ['NegativeMediumSpace', [8203]], ['NegativeThickSpace', [8203]], ['NegativeThinSpace', [8203]], ['NegativeVeryThinSpace', [8203]], ['nequiv', [8802]], ['nesear', [10536]], ['nesim', [8770, 824]], ['NestedGreaterGreater', [8811]], ['NestedLessLess', [8810]], ['nexist', [8708]], ['nexists', [8708]], ['Nfr', [120081]], ['nfr', [120107]], ['ngE', [8807, 824]], ['nge', [8817]], ['ngeq', [8817]], ['ngeqq', [8807, 824]], ['ngeqslant', [10878, 824]], ['nges', [10878, 824]], ['nGg', [8921, 824]], ['ngsim', [8821]], ['nGt', [8811, 8402]], ['ngt', [8815]], ['ngtr', [8815]], ['nGtv', [8811, 824]], ['nharr', [8622]], ['nhArr', [8654]], ['nhpar', [10994]], ['ni', [8715]], ['nis', [8956]], ['nisd', [8954]], ['niv', [8715]], ['NJcy', [1034]], ['njcy', [1114]], ['nlarr', [8602]], ['nlArr', [8653]], ['nldr', [8229]], ['nlE', [8806, 824]], ['nle', [8816]], ['nleftarrow', [8602]], ['nLeftarrow', [8653]], ['nleftrightarrow', [8622]], ['nLeftrightarrow', [8654]], ['nleq', [8816]], ['nleqq', [8806, 824]], ['nleqslant', [10877, 824]], ['nles', [10877, 824]], ['nless', [8814]], ['nLl', [8920, 824]], ['nlsim', [8820]], ['nLt', [8810, 8402]], ['nlt', [8814]], ['nltri', [8938]], ['nltrie', [8940]], ['nLtv', [8810, 824]], ['nmid', [8740]], ['NoBreak', [8288]], ['NonBreakingSpace', [160]], ['nopf', [120159]], ['Nopf', [8469]], ['Not', [10988]], ['not', [172]], ['NotCongruent', [8802]], ['NotCupCap', [8813]], ['NotDoubleVerticalBar', [8742]], ['NotElement', [8713]], ['NotEqual', [8800]], ['NotEqualTilde', [8770, 824]], ['NotExists', [8708]], ['NotGreater', [8815]], ['NotGreaterEqual', [8817]], ['NotGreaterFullEqual', [8807, 824]], ['NotGreaterGreater', [8811, 824]], ['NotGreaterLess', [8825]], ['NotGreaterSlantEqual', [10878, 824]], ['NotGreaterTilde', [8821]], ['NotHumpDownHump', [8782, 824]], ['NotHumpEqual', [8783, 824]], ['notin', [8713]], ['notindot', [8949, 824]], ['notinE', [8953, 824]], ['notinva', [8713]], ['notinvb', [8951]], ['notinvc', [8950]], ['NotLeftTriangleBar', [10703, 824]], ['NotLeftTriangle', [8938]], ['NotLeftTriangleEqual', [8940]], ['NotLess', [8814]], ['NotLessEqual', [8816]], ['NotLessGreater', [8824]], ['NotLessLess', [8810, 824]], ['NotLessSlantEqual', [10877, 824]], ['NotLessTilde', [8820]], ['NotNestedGreaterGreater', [10914, 824]], ['NotNestedLessLess', [10913, 824]], ['notni', [8716]], ['notniva', [8716]], ['notnivb', [8958]], ['notnivc', [8957]], ['NotPrecedes', [8832]], ['NotPrecedesEqual', [10927, 824]], ['NotPrecedesSlantEqual', [8928]], ['NotReverseElement', [8716]], ['NotRightTriangleBar', [10704, 824]], ['NotRightTriangle', [8939]], ['NotRightTriangleEqual', [8941]], ['NotSquareSubset', [8847, 824]], ['NotSquareSubsetEqual', [8930]], ['NotSquareSuperset', [8848, 824]], ['NotSquareSupersetEqual', [8931]], ['NotSubset', [8834, 8402]], ['NotSubsetEqual', [8840]], ['NotSucceeds', [8833]], ['NotSucceedsEqual', [10928, 824]], ['NotSucceedsSlantEqual', [8929]], ['NotSucceedsTilde', [8831, 824]], ['NotSuperset', [8835, 8402]], ['NotSupersetEqual', [8841]], ['NotTilde', [8769]], ['NotTildeEqual', [8772]], ['NotTildeFullEqual', [8775]], ['NotTildeTilde', [8777]], ['NotVerticalBar', [8740]], ['nparallel', [8742]], ['npar', [8742]], ['nparsl', [11005, 8421]], ['npart', [8706, 824]], ['npolint', [10772]], ['npr', [8832]], ['nprcue', [8928]], ['nprec', [8832]], ['npreceq', [10927, 824]], ['npre', [10927, 824]], ['nrarrc', [10547, 824]], ['nrarr', [8603]], ['nrArr', [8655]], ['nrarrw', [8605, 824]], ['nrightarrow', [8603]], ['nRightarrow', [8655]], ['nrtri', [8939]], ['nrtrie', [8941]], ['nsc', [8833]], ['nsccue', [8929]], ['nsce', [10928, 824]], ['Nscr', [119977]], ['nscr', [120003]], ['nshortmid', [8740]], ['nshortparallel', [8742]], ['nsim', [8769]], ['nsime', [8772]], ['nsimeq', [8772]], ['nsmid', [8740]], ['nspar', [8742]], ['nsqsube', [8930]], ['nsqsupe', [8931]], ['nsub', [8836]], ['nsubE', [10949, 824]], ['nsube', [8840]], ['nsubset', [8834, 8402]], ['nsubseteq', [8840]], ['nsubseteqq', [10949, 824]], ['nsucc', [8833]], ['nsucceq', [10928, 824]], ['nsup', [8837]], ['nsupE', [10950, 824]], ['nsupe', [8841]], ['nsupset', [8835, 8402]], ['nsupseteq', [8841]], ['nsupseteqq', [10950, 824]], ['ntgl', [8825]], ['Ntilde', [209]], ['ntilde', [241]], ['ntlg', [8824]], ['ntriangleleft', [8938]], ['ntrianglelefteq', [8940]], ['ntriangleright', [8939]], ['ntrianglerighteq', [8941]], ['Nu', [925]], ['nu', [957]], ['num', [35]], ['numero', [8470]], ['numsp', [8199]], ['nvap', [8781, 8402]], ['nvdash', [8876]], ['nvDash', [8877]], ['nVdash', [8878]], ['nVDash', [8879]], ['nvge', [8805, 8402]], ['nvgt', [62, 8402]], ['nvHarr', [10500]], ['nvinfin', [10718]], ['nvlArr', [10498]], ['nvle', [8804, 8402]], ['nvlt', [60, 8402]], ['nvltrie', [8884, 8402]], ['nvrArr', [10499]], ['nvrtrie', [8885, 8402]], ['nvsim', [8764, 8402]], ['nwarhk', [10531]], ['nwarr', [8598]], ['nwArr', [8662]], ['nwarrow', [8598]], ['nwnear', [10535]], ['Oacute', [211]], ['oacute', [243]], ['oast', [8859]], ['Ocirc', [212]], ['ocirc', [244]], ['ocir', [8858]], ['Ocy', [1054]], ['ocy', [1086]], ['odash', [8861]], ['Odblac', [336]], ['odblac', [337]], ['odiv', [10808]], ['odot', [8857]], ['odsold', [10684]], ['OElig', [338]], ['oelig', [339]], ['ofcir', [10687]], ['Ofr', [120082]], ['ofr', [120108]], ['ogon', [731]], ['Ograve', [210]], ['ograve', [242]], ['ogt', [10689]], ['ohbar', [10677]], ['ohm', [937]], ['oint', [8750]], ['olarr', [8634]], ['olcir', [10686]], ['olcross', [10683]], ['oline', [8254]], ['olt', [10688]], ['Omacr', [332]], ['omacr', [333]], ['Omega', [937]], ['omega', [969]], ['Omicron', [927]], ['omicron', [959]], ['omid', [10678]], ['ominus', [8854]], ['Oopf', [120134]], ['oopf', [120160]], ['opar', [10679]], ['OpenCurlyDoubleQuote', [8220]], ['OpenCurlyQuote', [8216]], ['operp', [10681]], ['oplus', [8853]], ['orarr', [8635]], ['Or', [10836]], ['or', [8744]], ['ord', [10845]], ['order', [8500]], ['orderof', [8500]], ['ordf', [170]], ['ordm', [186]], ['origof', [8886]], ['oror', [10838]], ['orslope', [10839]], ['orv', [10843]], ['oS', [9416]], ['Oscr', [119978]], ['oscr', [8500]], ['Oslash', [216]], ['oslash', [248]], ['osol', [8856]], ['Otilde', [213]], ['otilde', [245]], ['otimesas', [10806]], ['Otimes', [10807]], ['otimes', [8855]], ['Ouml', [214]], ['ouml', [246]], ['ovbar', [9021]], ['OverBar', [8254]], ['OverBrace', [9182]], ['OverBracket', [9140]], ['OverParenthesis', [9180]], ['para', [182]], ['parallel', [8741]], ['par', [8741]], ['parsim', [10995]], ['parsl', [11005]], ['part', [8706]], ['PartialD', [8706]], ['Pcy', [1055]], ['pcy', [1087]], ['percnt', [37]], ['period', [46]], ['permil', [8240]], ['perp', [8869]], ['pertenk', [8241]], ['Pfr', [120083]], ['pfr', [120109]], ['Phi', [934]], ['phi', [966]], ['phiv', [981]], ['phmmat', [8499]], ['phone', [9742]], ['Pi', [928]], ['pi', [960]], ['pitchfork', [8916]], ['piv', [982]], ['planck', [8463]], ['planckh', [8462]], ['plankv', [8463]], ['plusacir', [10787]], ['plusb', [8862]], ['pluscir', [10786]], ['plus', [43]], ['plusdo', [8724]], ['plusdu', [10789]], ['pluse', [10866]], ['PlusMinus', [177]], ['plusmn', [177]], ['plussim', [10790]], ['plustwo', [10791]], ['pm', [177]], ['Poincareplane', [8460]], ['pointint', [10773]], ['popf', [120161]], ['Popf', [8473]], ['pound', [163]], ['prap', [10935]], ['Pr', [10939]], ['pr', [8826]], ['prcue', [8828]], ['precapprox', [10935]], ['prec', [8826]], ['preccurlyeq', [8828]], ['Precedes', [8826]], ['PrecedesEqual', [10927]], ['PrecedesSlantEqual', [8828]], ['PrecedesTilde', [8830]], ['preceq', [10927]], ['precnapprox', [10937]], ['precneqq', [10933]], ['precnsim', [8936]], ['pre', [10927]], ['prE', [10931]], ['precsim', [8830]], ['prime', [8242]], ['Prime', [8243]], ['primes', [8473]], ['prnap', [10937]], ['prnE', [10933]], ['prnsim', [8936]], ['prod', [8719]], ['Product', [8719]], ['profalar', [9006]], ['profline', [8978]], ['profsurf', [8979]], ['prop', [8733]], ['Proportional', [8733]], ['Proportion', [8759]], ['propto', [8733]], ['prsim', [8830]], ['prurel', [8880]], ['Pscr', [119979]], ['pscr', [120005]], ['Psi', [936]], ['psi', [968]], ['puncsp', [8200]], ['Qfr', [120084]], ['qfr', [120110]], ['qint', [10764]], ['qopf', [120162]], ['Qopf', [8474]], ['qprime', [8279]], ['Qscr', [119980]], ['qscr', [120006]], ['quaternions', [8461]], ['quatint', [10774]], ['quest', [63]], ['questeq', [8799]], ['quot', [34]], ['QUOT', [34]], ['rAarr', [8667]], ['race', [8765, 817]], ['Racute', [340]], ['racute', [341]], ['radic', [8730]], ['raemptyv', [10675]], ['rang', [10217]], ['Rang', [10219]], ['rangd', [10642]], ['range', [10661]], ['rangle', [10217]], ['raquo', [187]], ['rarrap', [10613]], ['rarrb', [8677]], ['rarrbfs', [10528]], ['rarrc', [10547]], ['rarr', [8594]], ['Rarr', [8608]], ['rArr', [8658]], ['rarrfs', [10526]], ['rarrhk', [8618]], ['rarrlp', [8620]], ['rarrpl', [10565]], ['rarrsim', [10612]], ['Rarrtl', [10518]], ['rarrtl', [8611]], ['rarrw', [8605]], ['ratail', [10522]], ['rAtail', [10524]], ['ratio', [8758]], ['rationals', [8474]], ['rbarr', [10509]], ['rBarr', [10511]], ['RBarr', [10512]], ['rbbrk', [10099]], ['rbrace', [125]], ['rbrack', [93]], ['rbrke', [10636]], ['rbrksld', [10638]], ['rbrkslu', [10640]], ['Rcaron', [344]], ['rcaron', [345]], ['Rcedil', [342]], ['rcedil', [343]], ['rceil', [8969]], ['rcub', [125]], ['Rcy', [1056]], ['rcy', [1088]], ['rdca', [10551]], ['rdldhar', [10601]], ['rdquo', [8221]], ['rdquor', [8221]], ['CloseCurlyDoubleQuote', [8221]], ['rdsh', [8627]], ['real', [8476]], ['realine', [8475]], ['realpart', [8476]], ['reals', [8477]], ['Re', [8476]], ['rect', [9645]], ['reg', [174]], ['REG', [174]], ['ReverseElement', [8715]], ['ReverseEquilibrium', [8651]], ['ReverseUpEquilibrium', [10607]], ['rfisht', [10621]], ['rfloor', [8971]], ['rfr', [120111]], ['Rfr', [8476]], ['rHar', [10596]], ['rhard', [8641]], ['rharu', [8640]], ['rharul', [10604]], ['Rho', [929]], ['rho', [961]], ['rhov', [1009]], ['RightAngleBracket', [10217]], ['RightArrowBar', [8677]], ['rightarrow', [8594]], ['RightArrow', [8594]], ['Rightarrow', [8658]], ['RightArrowLeftArrow', [8644]], ['rightarrowtail', [8611]], ['RightCeiling', [8969]], ['RightDoubleBracket', [10215]], ['RightDownTeeVector', [10589]], ['RightDownVectorBar', [10581]], ['RightDownVector', [8642]], ['RightFloor', [8971]], ['rightharpoondown', [8641]], ['rightharpoonup', [8640]], ['rightleftarrows', [8644]], ['rightleftharpoons', [8652]], ['rightrightarrows', [8649]], ['rightsquigarrow', [8605]], ['RightTeeArrow', [8614]], ['RightTee', [8866]], ['RightTeeVector', [10587]], ['rightthreetimes', [8908]], ['RightTriangleBar', [10704]], ['RightTriangle', [8883]], ['RightTriangleEqual', [8885]], ['RightUpDownVector', [10575]], ['RightUpTeeVector', [10588]], ['RightUpVectorBar', [10580]], ['RightUpVector', [8638]], ['RightVectorBar', [10579]], ['RightVector', [8640]], ['ring', [730]], ['risingdotseq', [8787]], ['rlarr', [8644]], ['rlhar', [8652]], ['rlm', [8207]], ['rmoustache', [9137]], ['rmoust', [9137]], ['rnmid', [10990]], ['roang', [10221]], ['roarr', [8702]], ['robrk', [10215]], ['ropar', [10630]], ['ropf', [120163]], ['Ropf', [8477]], ['roplus', [10798]], ['rotimes', [10805]], ['RoundImplies', [10608]], ['rpar', [41]], ['rpargt', [10644]], ['rppolint', [10770]], ['rrarr', [8649]], ['Rrightarrow', [8667]], ['rsaquo', [8250]], ['rscr', [120007]], ['Rscr', [8475]], ['rsh', [8625]], ['Rsh', [8625]], ['rsqb', [93]], ['rsquo', [8217]], ['rsquor', [8217]], ['CloseCurlyQuote', [8217]], ['rthree', [8908]], ['rtimes', [8906]], ['rtri', [9657]], ['rtrie', [8885]], ['rtrif', [9656]], ['rtriltri', [10702]], ['RuleDelayed', [10740]], ['ruluhar', [10600]], ['rx', [8478]], ['Sacute', [346]], ['sacute', [347]], ['sbquo', [8218]], ['scap', [10936]], ['Scaron', [352]], ['scaron', [353]], ['Sc', [10940]], ['sc', [8827]], ['sccue', [8829]], ['sce', [10928]], ['scE', [10932]], ['Scedil', [350]], ['scedil', [351]], ['Scirc', [348]], ['scirc', [349]], ['scnap', [10938]], ['scnE', [10934]], ['scnsim', [8937]], ['scpolint', [10771]], ['scsim', [8831]], ['Scy', [1057]], ['scy', [1089]], ['sdotb', [8865]], ['sdot', [8901]], ['sdote', [10854]], ['searhk', [10533]], ['searr', [8600]], ['seArr', [8664]], ['searrow', [8600]], ['sect', [167]], ['semi', [59]], ['seswar', [10537]], ['setminus', [8726]], ['setmn', [8726]], ['sext', [10038]], ['Sfr', [120086]], ['sfr', [120112]], ['sfrown', [8994]], ['sharp', [9839]], ['SHCHcy', [1065]], ['shchcy', [1097]], ['SHcy', [1064]], ['shcy', [1096]], ['ShortDownArrow', [8595]], ['ShortLeftArrow', [8592]], ['shortmid', [8739]], ['shortparallel', [8741]], ['ShortRightArrow', [8594]], ['ShortUpArrow', [8593]], ['shy', [173]], ['Sigma', [931]], ['sigma', [963]], ['sigmaf', [962]], ['sigmav', [962]], ['sim', [8764]], ['simdot', [10858]], ['sime', [8771]], ['simeq', [8771]], ['simg', [10910]], ['simgE', [10912]], ['siml', [10909]], ['simlE', [10911]], ['simne', [8774]], ['simplus', [10788]], ['simrarr', [10610]], ['slarr', [8592]], ['SmallCircle', [8728]], ['smallsetminus', [8726]], ['smashp', [10803]], ['smeparsl', [10724]], ['smid', [8739]], ['smile', [8995]], ['smt', [10922]], ['smte', [10924]], ['smtes', [10924, 65024]], ['SOFTcy', [1068]], ['softcy', [1100]], ['solbar', [9023]], ['solb', [10692]], ['sol', [47]], ['Sopf', [120138]], ['sopf', [120164]], ['spades', [9824]], ['spadesuit', [9824]], ['spar', [8741]], ['sqcap', [8851]], ['sqcaps', [8851, 65024]], ['sqcup', [8852]], ['sqcups', [8852, 65024]], ['Sqrt', [8730]], ['sqsub', [8847]], ['sqsube', [8849]], ['sqsubset', [8847]], ['sqsubseteq', [8849]], ['sqsup', [8848]], ['sqsupe', [8850]], ['sqsupset', [8848]], ['sqsupseteq', [8850]], ['square', [9633]], ['Square', [9633]], ['SquareIntersection', [8851]], ['SquareSubset', [8847]], ['SquareSubsetEqual', [8849]], ['SquareSuperset', [8848]], ['SquareSupersetEqual', [8850]], ['SquareUnion', [8852]], ['squarf', [9642]], ['squ', [9633]], ['squf', [9642]], ['srarr', [8594]], ['Sscr', [119982]], ['sscr', [120008]], ['ssetmn', [8726]], ['ssmile', [8995]], ['sstarf', [8902]], ['Star', [8902]], ['star', [9734]], ['starf', [9733]], ['straightepsilon', [1013]], ['straightphi', [981]], ['strns', [175]], ['sub', [8834]], ['Sub', [8912]], ['subdot', [10941]], ['subE', [10949]], ['sube', [8838]], ['subedot', [10947]], ['submult', [10945]], ['subnE', [10955]], ['subne', [8842]], ['subplus', [10943]], ['subrarr', [10617]], ['subset', [8834]], ['Subset', [8912]], ['subseteq', [8838]], ['subseteqq', [10949]], ['SubsetEqual', [8838]], ['subsetneq', [8842]], ['subsetneqq', [10955]], ['subsim', [10951]], ['subsub', [10965]], ['subsup', [10963]], ['succapprox', [10936]], ['succ', [8827]], ['succcurlyeq', [8829]], ['Succeeds', [8827]], ['SucceedsEqual', [10928]], ['SucceedsSlantEqual', [8829]], ['SucceedsTilde', [8831]], ['succeq', [10928]], ['succnapprox', [10938]], ['succneqq', [10934]], ['succnsim', [8937]], ['succsim', [8831]], ['SuchThat', [8715]], ['sum', [8721]], ['Sum', [8721]], ['sung', [9834]], ['sup1', [185]], ['sup2', [178]], ['sup3', [179]], ['sup', [8835]], ['Sup', [8913]], ['supdot', [10942]], ['supdsub', [10968]], ['supE', [10950]], ['supe', [8839]], ['supedot', [10948]], ['Superset', [8835]], ['SupersetEqual', [8839]], ['suphsol', [10185]], ['suphsub', [10967]], ['suplarr', [10619]], ['supmult', [10946]], ['supnE', [10956]], ['supne', [8843]], ['supplus', [10944]], ['supset', [8835]], ['Supset', [8913]], ['supseteq', [8839]], ['supseteqq', [10950]], ['supsetneq', [8843]], ['supsetneqq', [10956]], ['supsim', [10952]], ['supsub', [10964]], ['supsup', [10966]], ['swarhk', [10534]], ['swarr', [8601]], ['swArr', [8665]], ['swarrow', [8601]], ['swnwar', [10538]], ['szlig', [223]], ['Tab', [9]], ['target', [8982]], ['Tau', [932]], ['tau', [964]], ['tbrk', [9140]], ['Tcaron', [356]], ['tcaron', [357]], ['Tcedil', [354]], ['tcedil', [355]], ['Tcy', [1058]], ['tcy', [1090]], ['tdot', [8411]], ['telrec', [8981]], ['Tfr', [120087]], ['tfr', [120113]], ['there4', [8756]], ['therefore', [8756]], ['Therefore', [8756]], ['Theta', [920]], ['theta', [952]], ['thetasym', [977]], ['thetav', [977]], ['thickapprox', [8776]], ['thicksim', [8764]], ['ThickSpace', [8287, 8202]], ['ThinSpace', [8201]], ['thinsp', [8201]], ['thkap', [8776]], ['thksim', [8764]], ['THORN', [222]], ['thorn', [254]], ['tilde', [732]], ['Tilde', [8764]], ['TildeEqual', [8771]], ['TildeFullEqual', [8773]], ['TildeTilde', [8776]], ['timesbar', [10801]], ['timesb', [8864]], ['times', [215]], ['timesd', [10800]], ['tint', [8749]], ['toea', [10536]], ['topbot', [9014]], ['topcir', [10993]], ['top', [8868]], ['Topf', [120139]], ['topf', [120165]], ['topfork', [10970]], ['tosa', [10537]], ['tprime', [8244]], ['trade', [8482]], ['TRADE', [8482]], ['triangle', [9653]], ['triangledown', [9663]], ['triangleleft', [9667]], ['trianglelefteq', [8884]], ['triangleq', [8796]], ['triangleright', [9657]], ['trianglerighteq', [8885]], ['tridot', [9708]], ['trie', [8796]], ['triminus', [10810]], ['TripleDot', [8411]], ['triplus', [10809]], ['trisb', [10701]], ['tritime', [10811]], ['trpezium', [9186]], ['Tscr', [119983]], ['tscr', [120009]], ['TScy', [1062]], ['tscy', [1094]], ['TSHcy', [1035]], ['tshcy', [1115]], ['Tstrok', [358]], ['tstrok', [359]], ['twixt', [8812]], ['twoheadleftarrow', [8606]], ['twoheadrightarrow', [8608]], ['Uacute', [218]], ['uacute', [250]], ['uarr', [8593]], ['Uarr', [8607]], ['uArr', [8657]], ['Uarrocir', [10569]], ['Ubrcy', [1038]], ['ubrcy', [1118]], ['Ubreve', [364]], ['ubreve', [365]], ['Ucirc', [219]], ['ucirc', [251]], ['Ucy', [1059]], ['ucy', [1091]], ['udarr', [8645]], ['Udblac', [368]], ['udblac', [369]], ['udhar', [10606]], ['ufisht', [10622]], ['Ufr', [120088]], ['ufr', [120114]], ['Ugrave', [217]], ['ugrave', [249]], ['uHar', [10595]], ['uharl', [8639]], ['uharr', [8638]], ['uhblk', [9600]], ['ulcorn', [8988]], ['ulcorner', [8988]], ['ulcrop', [8975]], ['ultri', [9720]], ['Umacr', [362]], ['umacr', [363]], ['uml', [168]], ['UnderBar', [95]], ['UnderBrace', [9183]], ['UnderBracket', [9141]], ['UnderParenthesis', [9181]], ['Union', [8899]], ['UnionPlus', [8846]], ['Uogon', [370]], ['uogon', [371]], ['Uopf', [120140]], ['uopf', [120166]], ['UpArrowBar', [10514]], ['uparrow', [8593]], ['UpArrow', [8593]], ['Uparrow', [8657]], ['UpArrowDownArrow', [8645]], ['updownarrow', [8597]], ['UpDownArrow', [8597]], ['Updownarrow', [8661]], ['UpEquilibrium', [10606]], ['upharpoonleft', [8639]], ['upharpoonright', [8638]], ['uplus', [8846]], ['UpperLeftArrow', [8598]], ['UpperRightArrow', [8599]], ['upsi', [965]], ['Upsi', [978]], ['upsih', [978]], ['Upsilon', [933]], ['upsilon', [965]], ['UpTeeArrow', [8613]], ['UpTee', [8869]], ['upuparrows', [8648]], ['urcorn', [8989]], ['urcorner', [8989]], ['urcrop', [8974]], ['Uring', [366]], ['uring', [367]], ['urtri', [9721]], ['Uscr', [119984]], ['uscr', [120010]], ['utdot', [8944]], ['Utilde', [360]], ['utilde', [361]], ['utri', [9653]], ['utrif', [9652]], ['uuarr', [8648]], ['Uuml', [220]], ['uuml', [252]], ['uwangle', [10663]], ['vangrt', [10652]], ['varepsilon', [1013]], ['varkappa', [1008]], ['varnothing', [8709]], ['varphi', [981]], ['varpi', [982]], ['varpropto', [8733]], ['varr', [8597]], ['vArr', [8661]], ['varrho', [1009]], ['varsigma', [962]], ['varsubsetneq', [8842, 65024]], ['varsubsetneqq', [10955, 65024]], ['varsupsetneq', [8843, 65024]], ['varsupsetneqq', [10956, 65024]], ['vartheta', [977]], ['vartriangleleft', [8882]], ['vartriangleright', [8883]], ['vBar', [10984]], ['Vbar', [10987]], ['vBarv', [10985]], ['Vcy', [1042]], ['vcy', [1074]], ['vdash', [8866]], ['vDash', [8872]], ['Vdash', [8873]], ['VDash', [8875]], ['Vdashl', [10982]], ['veebar', [8891]], ['vee', [8744]], ['Vee', [8897]], ['veeeq', [8794]], ['vellip', [8942]], ['verbar', [124]], ['Verbar', [8214]], ['vert', [124]], ['Vert', [8214]], ['VerticalBar', [8739]], ['VerticalLine', [124]], ['VerticalSeparator', [10072]], ['VerticalTilde', [8768]], ['VeryThinSpace', [8202]], ['Vfr', [120089]], ['vfr', [120115]], ['vltri', [8882]], ['vnsub', [8834, 8402]], ['vnsup', [8835, 8402]], ['Vopf', [120141]], ['vopf', [120167]], ['vprop', [8733]], ['vrtri', [8883]], ['Vscr', [119985]], ['vscr', [120011]], ['vsubnE', [10955, 65024]], ['vsubne', [8842, 65024]], ['vsupnE', [10956, 65024]], ['vsupne', [8843, 65024]], ['Vvdash', [8874]], ['vzigzag', [10650]], ['Wcirc', [372]], ['wcirc', [373]], ['wedbar', [10847]], ['wedge', [8743]], ['Wedge', [8896]], ['wedgeq', [8793]], ['weierp', [8472]], ['Wfr', [120090]], ['wfr', [120116]], ['Wopf', [120142]], ['wopf', [120168]], ['wp', [8472]], ['wr', [8768]], ['wreath', [8768]], ['Wscr', [119986]], ['wscr', [120012]], ['xcap', [8898]], ['xcirc', [9711]], ['xcup', [8899]], ['xdtri', [9661]], ['Xfr', [120091]], ['xfr', [120117]], ['xharr', [10231]], ['xhArr', [10234]], ['Xi', [926]], ['xi', [958]], ['xlarr', [10229]], ['xlArr', [10232]], ['xmap', [10236]], ['xnis', [8955]], ['xodot', [10752]], ['Xopf', [120143]], ['xopf', [120169]], ['xoplus', [10753]], ['xotime', [10754]], ['xrarr', [10230]], ['xrArr', [10233]], ['Xscr', [119987]], ['xscr', [120013]], ['xsqcup', [10758]], ['xuplus', [10756]], ['xutri', [9651]], ['xvee', [8897]], ['xwedge', [8896]], ['Yacute', [221]], ['yacute', [253]], ['YAcy', [1071]], ['yacy', [1103]], ['Ycirc', [374]], ['ycirc', [375]], ['Ycy', [1067]], ['ycy', [1099]], ['yen', [165]], ['Yfr', [120092]], ['yfr', [120118]], ['YIcy', [1031]], ['yicy', [1111]], ['Yopf', [120144]], ['yopf', [120170]], ['Yscr', [119988]], ['yscr', [120014]], ['YUcy', [1070]], ['yucy', [1102]], ['yuml', [255]], ['Yuml', [376]], ['Zacute', [377]], ['zacute', [378]], ['Zcaron', [381]], ['zcaron', [382]], ['Zcy', [1047]], ['zcy', [1079]], ['Zdot', [379]], ['zdot', [380]], ['zeetrf', [8488]], ['ZeroWidthSpace', [8203]], ['Zeta', [918]], ['zeta', [950]], ['zfr', [120119]], ['Zfr', [8488]], ['ZHcy', [1046]], ['zhcy', [1078]], ['zigrarr', [8669]], ['zopf', [120171]], ['Zopf', [8484]], ['Zscr', [119989]], ['zscr', [120015]], ['zwj', [8205]], ['zwnj', [8204]]];

var alphaIndex = {};
var charIndex = {};

createIndexes(alphaIndex, charIndex);

/**
 * @constructor
 */
function Html5Entities() {}

/**
 * @param {String} str
 * @returns {String}
 */
Html5Entities.prototype.decode = function(str) {
    if (!str || !str.length) {
        return '';
    }
    return str.replace(/&(#?[\w\d]+);?/g, function(s, entity) {
        var chr;
        if (entity.charAt(0) === "#") {
            var code = entity.charAt(1) === 'x' ?
                parseInt(entity.substr(2).toLowerCase(), 16) :
                parseInt(entity.substr(1));

            if (!(isNaN(code) || code < -32768 || code > 65535)) {
                chr = String.fromCharCode(code);
            }
        } else {
            chr = alphaIndex[entity];
        }
        return chr || s;
    });
};

/**
 * @param {String} str
 * @returns {String}
 */
 Html5Entities.decode = function(str) {
    return new Html5Entities().decode(str);
 };

/**
 * @param {String} str
 * @returns {String}
 */
Html5Entities.prototype.encode = function(str) {
    if (!str || !str.length) {
        return '';
    }
    var strLength = str.length;
    var result = '';
    var i = 0;
    while (i < strLength) {
        var charInfo = charIndex[str.charCodeAt(i)];
        if (charInfo) {
            var alpha = charInfo[str.charCodeAt(i + 1)];
            if (alpha) {
                i++;
            } else {
                alpha = charInfo[''];
            }
            if (alpha) {
                result += "&" + alpha + ";";
                i++;
                continue;
            }
        }
        result += str.charAt(i);
        i++;
    }
    return result;
};

/**
 * @param {String} str
 * @returns {String}
 */
 Html5Entities.encode = function(str) {
    return new Html5Entities().encode(str);
 };

/**
 * @param {String} str
 * @returns {String}
 */
Html5Entities.prototype.encodeNonUTF = function(str) {
    if (!str || !str.length) {
        return '';
    }
    var strLength = str.length;
    var result = '';
    var i = 0;
    while (i < strLength) {
        var c = str.charCodeAt(i);
        var charInfo = charIndex[c];
        if (charInfo) {
            var alpha = charInfo[str.charCodeAt(i + 1)];
            if (alpha) {
                i++;
            } else {
                alpha = charInfo[''];
            }
            if (alpha) {
                result += "&" + alpha + ";";
                i++;
                continue;
            }
        }
        if (c < 32 || c > 126) {
            result += '&#' + c + ';';
        } else {
            result += str.charAt(i);
        }
        i++;
    }
    return result;
};

/**
 * @param {String} str
 * @returns {String}
 */
 Html5Entities.encodeNonUTF = function(str) {
    return new Html5Entities().encodeNonUTF(str);
 };

/**
 * @param {String} str
 * @returns {String}
 */
Html5Entities.prototype.encodeNonASCII = function(str) {
    if (!str || !str.length) {
        return '';
    }
    var strLength = str.length;
    var result = '';
    var i = 0;
    while (i < strLength) {
        var c = str.charCodeAt(i);
        if (c <= 255) {
            result += str[i++];
            continue;
        }
        result += '&#' + c + ';';
        i++
    }
    return result;
};

/**
 * @param {String} str
 * @returns {String}
 */
 Html5Entities.encodeNonASCII = function(str) {
    return new Html5Entities().encodeNonASCII(str);
 };

/**
 * @param {Object} alphaIndex Passed by reference.
 * @param {Object} charIndex Passed by reference.
 */
function createIndexes(alphaIndex, charIndex) {
    var i = ENTITIES.length;
    var _results = [];
    while (i--) {
        var e = ENTITIES[i];
        var alpha = e[0];
        var chars = e[1];
        var chr = chars[0];
        var addChar = (chr < 32 || chr > 126) || chr === 62 || chr === 60 || chr === 38 || chr === 34 || chr === 39;
        var charInfo;
        if (addChar) {
            charInfo = charIndex[chr] = charIndex[chr] || {};
        }
        if (chars[1]) {
            var chr2 = chars[1];
            alphaIndex[alpha] = String.fromCharCode(chr) + String.fromCharCode(chr2);
            _results.push(addChar && (charInfo[chr2] = alpha));
        } else {
            alphaIndex[alpha] = String.fromCharCode(chr);
            _results.push(addChar && (charInfo[''] = alpha));
        }
    }
}

module.exports = Html5Entities;


/***/ }),

/***/ 15:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_aurelia_framework__ = __webpack_require__("aurelia-framework");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

class Person {
    constructor(person) {
        this.id = person.id;
        this.firstName = person.firstName;
        this.lastName = person.lastName;
        this.authorised = person.authorised;
        this.enabled = person.enabled;
        this.colours = person.colours;
    }
    get fullName() {
        return `${this.firstName} ${this.lastName}`;
    }
    get palindrome() {
        // TODO: Step 5
        //
        // Implement the palindrome computed field.
        // True should be returned When the FullName is spelt the same
        // forwards as it is backwards. The match should ignore any
        // spaces and should also be case insensitive.
        //
        // Example: 'Bo Bob' is a palindrome.
        //create a string of the first name and last name
        const name = this.firstName + this.lastName;
        //check if name is the same as name backwards and return true or false
        return name.toLowerCase() == name.toLowerCase().split("").reverse().join("");
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = Person;

__decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0_aurelia_framework__["d" /* computedFrom */])('firstName', 'lastName'),
    __metadata("design:type", String),
    __metadata("design:paramtypes", [])
], Person.prototype, "fullName", null);
__decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0_aurelia_framework__["d" /* computedFrom */])('fullName'),
    __metadata("design:type", Boolean),
    __metadata("design:paramtypes", [])
], Person.prototype, "palindrome", null);


/***/ }),

/***/ 16:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* WEBPACK VAR INJECTION */(function(process) {/* harmony export (immutable) */ __webpack_exports__["bootstrap"] = bootstrap;
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "starting", function() { return starting; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_aurelia_polyfills__ = __webpack_require__(27);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_aurelia_pal__ = __webpack_require__(0);
var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };




var bootstrapPromises = [];
var startResolve = void 0;

var startPromise = new Promise(function (resolve) {
  return startResolve = resolve;
});
var host = __WEBPACK_IMPORTED_MODULE_1_aurelia_pal__["a" /* PLATFORM */].global;
var isNodeLike = typeof process !== 'undefined' && !process.browser;

function ready() {
  if (!host.document || host.document.readyState === 'complete') {
    return Promise.resolve();
  }

  return new Promise(function (resolve) {
    host.document.addEventListener('DOMContentLoaded', completed);
    host.addEventListener('load', completed);

    function completed() {
      host.document.removeEventListener('DOMContentLoaded', completed);
      host.removeEventListener('load', completed);
      resolve();
    }
  });
}

function createLoader() {
  if (__WEBPACK_IMPORTED_MODULE_1_aurelia_pal__["a" /* PLATFORM */].Loader) {
    return Promise.resolve(new __WEBPACK_IMPORTED_MODULE_1_aurelia_pal__["a" /* PLATFORM */].Loader());
  }

  if (false) {
    if (typeof __webpack_require__ !== 'undefined') {
      var m = __webpack_require__(require.resolve('aurelia-loader-webpack'));
      return Promise.resolve(new m.WebpackLoader());
    }

    if (host.System && typeof host.System.config === 'function') {
      return host.System.normalize('aurelia-bootstrapper').then(function (bsn) {
        return host.System.normalize('aurelia-loader-default', bsn);
      }).then(function (loaderName) {
        return host.System.import(loaderName).then(function (m) {
          return new m.DefaultLoader();
        });
      });
    }

    if (typeof host.require === 'function' && typeof host.define === 'function' && _typeof(host.define.amd) === 'object') {
      return new Promise(function (resolve, reject) {
        return host.require(['aurelia-loader-default'], function (m) {
          return resolve(new m.DefaultLoader());
        }, reject);
      });
    }

    if (isNodeLike && typeof module !== 'undefined' && typeof module.require !== 'undefined') {
      var _m = module.require('aurelia-loader-nodejs');
      return Promise.resolve(new _m.NodeJsLoader());
    }
  }

  return Promise.reject('No PLATFORM.Loader is defined and there is neither a System API (ES6) or a Require API (AMD) globally available to load your app.');
}

function initializePal(loader) {
  if (__WEBPACK_IMPORTED_MODULE_1_aurelia_pal__["b" /* isInitialized */]) return Promise.resolve();

  var type = void 0;

  var isRenderer = isNodeLike && (process.type === 'renderer' || process.versions['node-webkit']);

  if (isNodeLike && !isRenderer) {
    type = 'nodejs';
  } else if (typeof window !== 'undefined') {
    type = 'browser';
  } else if (typeof self !== 'undefined') {
    type = 'worker';
  } else {
    throw new Error('Could not determine platform implementation to load.');
  }

  return loader.loadModule('aurelia-pal-' + type).then(function (palModule) {
    return type === 'nodejs' && !__WEBPACK_IMPORTED_MODULE_1_aurelia_pal__["b" /* isInitialized */] && palModule.globalize() || palModule.initialize();
  });
}

function preparePlatform(loader) {
  var map = function map(moduleId, relativeTo) {
    return loader.normalize(moduleId, relativeTo).then(function (normalized) {
      loader.map(moduleId, normalized);
      return normalized;
    });
  };

  return initializePal(loader).then(function () {
    return loader.normalize('aurelia-bootstrapper');
  }).then(function (bootstrapperName) {
    var frameworkPromise = map('aurelia-framework', bootstrapperName);

    return Promise.all([frameworkPromise, frameworkPromise.then(function (frameworkName) {
      return map('aurelia-dependency-injection', frameworkName);
    }), map('aurelia-router', bootstrapperName), map('aurelia-logging-console', bootstrapperName)]);
  }).then(function (_ref) {
    var frameworkName = _ref[0];
    return loader.loadModule(frameworkName);
  }).then(function (fx) {
    return startResolve(function () {
      return new fx.Aurelia(loader);
    });
  });
}

function config(appHost, configModuleId, aurelia) {
  aurelia.host = appHost;
  aurelia.configModuleId = configModuleId || null;

  if (configModuleId) {
    return aurelia.loader.loadModule(configModuleId).then(function (customConfig) {
      if (!customConfig.configure) {
        throw new Error('Cannot initialize module \'' + configModuleId + '\' without a configure function.');
      }

      return customConfig.configure(aurelia);
    });
  }

  aurelia.use.standardConfiguration().developmentLogging();

  return aurelia.start().then(function () {
    return aurelia.setRoot();
  });
}

function run() {
  return ready().then(createLoader).then(preparePlatform).then(function () {
    var appHosts = host.document.querySelectorAll('[aurelia-app],[data-aurelia-app]');
    for (var i = 0, ii = appHosts.length; i < ii; ++i) {
      var appHost = appHosts[i];
      var moduleId = appHost.getAttribute('aurelia-app') || appHost.getAttribute('data-aurelia-app');
      bootstrap(config.bind(null, appHost, moduleId));
    }

    var toConsole = console.error.bind(console);
    var bootstraps = bootstrapPromises.map(function (p) {
      return p.catch(toConsole);
    });
    bootstrapPromises = null;
    return Promise.all(bootstraps);
  });
}

function bootstrap(configure) {
  var p = startPromise.then(function (factory) {
    return configure(factory());
  });
  if (bootstrapPromises) bootstrapPromises.push(p);
  return p;
}

var starting = run();
/* WEBPACK VAR INJECTION */}.call(__webpack_exports__, __webpack_require__(43)))

/***/ }),

/***/ 17:
/***/ (function(module, exports, __webpack_require__) {

// This file contains an empty module that does nothing.
// It's meant to be added as an entry point to the main bundle
// and helps reliably adding some Aurelia dependencies that are attached 
// to no module in particular, such as `includeAll` results or `aureliaApp`.
//
// Trying to attach those dependencies to, for example, 'aurelia-bootstrapper' 
// is unreliable if 'aurelia-bootstrapper' is in a DLL outside the bundle.
//
// Trying to attach to 'aurelia-loader-webpack' works well, unless a user
// configures a customized loader instead (unlikely, but in theory supported).


/***/ }),

/***/ 18:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_aurelia_pal__ = __webpack_require__(0);
// With default aurelia-loader-webpack config, this module is added as an extra entry
// before any other code executes so that PAL.Loader is properly configured.
// There are several tricky points worth noticing.
// 
// We don't add aurelia-loader-webpack itself as an entry point (used to until 2.0 RC2)
// because it (transitively) brings too much bagage with itself, most notably polyfills.
// This made it super-hard to add other polyfills before Aurelia's and led to various bugs.
//
// We don't add custom code in aurelia-pal or aurelia-loader or aurelia-bootstrapper to detect
// the Webpack environment and configure the loader because they might live in a DLL.
// If they do, they would bring aurelia-loader-webpack along in the DLL and this is a special 
// library that *has to be in the main chunk.*
//
// The over-complicated design I've settled upon in the end is to use this special module
// as an entry point that configures aurelia-loader-webpack. It has minimal static imports:
// just aurelia-pal, which itself has no other dependencies and doesn't run much code.
// It hacks the loader field into a getter so that it can synchronously load aurelia-loader-webpack
// just in time when it is demanded by aurelia-bootstrapper.
// This enables users to load polyfills before aurelia-loader-webpack is actually loaded.



var Loader;

Object.defineProperty(__WEBPACK_IMPORTED_MODULE_0_aurelia_pal__["a" /* PLATFORM */], "Loader", {
  get: function() {
    return Loader || (Loader = __webpack_require__(26).WebpackLoader);
  },
  set: function(value) {
    Loader = value;
  }
});


/***/ }),

/***/ 19:
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(__resourceQuery, module) {/*eslint-env browser*/
/*global __resourceQuery __webpack_public_path__*/

var options = {
  path: '/__webpack_hmr',
  timeout: 20 * 1000,
  overlay: true,
  reload: false,
  log: true,
  warn: true,
  name: '',
  autoConnect: true,
  overlayStyles: {},
  overlayWarnings: false,
  ansiColors: {},
};
if (true) {
  var querystring = __webpack_require__(35);
  var overrides = querystring.parse(__resourceQuery.slice(1));
  setOverrides(overrides);
}

if (typeof window === 'undefined') {
  // do nothing
} else if (typeof window.EventSource === 'undefined') {
  console.warn(
    "webpack-hot-middleware's client requires EventSource to work. " +
      'You should include a polyfill if you want to support this browser: ' +
      'https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events#Tools'
  );
} else {
  if (options.autoConnect) {
    connect();
  }
}

/* istanbul ignore next */
function setOptionsAndConnect(overrides) {
  setOverrides(overrides);
  connect();
}

function setOverrides(overrides) {
  if (overrides.autoConnect)
    options.autoConnect = overrides.autoConnect == 'true';
  if (overrides.path) options.path = overrides.path;
  if (overrides.timeout) options.timeout = overrides.timeout;
  if (overrides.overlay) options.overlay = overrides.overlay !== 'false';
  if (overrides.reload) options.reload = overrides.reload !== 'false';
  if (overrides.noInfo && overrides.noInfo !== 'false') {
    options.log = false;
  }
  if (overrides.name) {
    options.name = overrides.name;
  }
  if (overrides.quiet && overrides.quiet !== 'false') {
    options.log = false;
    options.warn = false;
  }

  if (overrides.dynamicPublicPath) {
    options.path = __webpack_require__.p + options.path;
  }

  if (overrides.ansiColors)
    options.ansiColors = JSON.parse(overrides.ansiColors);
  if (overrides.overlayStyles)
    options.overlayStyles = JSON.parse(overrides.overlayStyles);

  if (overrides.overlayWarnings) {
    options.overlayWarnings = overrides.overlayWarnings == 'true';
  }
}

function EventSourceWrapper() {
  var source;
  var lastActivity = new Date();
  var listeners = [];

  init();
  var timer = setInterval(function() {
    if (new Date() - lastActivity > options.timeout) {
      handleDisconnect();
    }
  }, options.timeout / 2);

  function init() {
    source = new window.EventSource(options.path);
    source.onopen = handleOnline;
    source.onerror = handleDisconnect;
    source.onmessage = handleMessage;
  }

  function handleOnline() {
    if (options.log) console.log('[HMR] connected');
    lastActivity = new Date();
  }

  function handleMessage(event) {
    lastActivity = new Date();
    for (var i = 0; i < listeners.length; i++) {
      listeners[i](event);
    }
  }

  function handleDisconnect() {
    clearInterval(timer);
    source.close();
    setTimeout(init, options.timeout);
  }

  return {
    addMessageListener: function(fn) {
      listeners.push(fn);
    },
  };
}

function getEventSourceWrapper() {
  if (!window.__whmEventSourceWrapper) {
    window.__whmEventSourceWrapper = {};
  }
  if (!window.__whmEventSourceWrapper[options.path]) {
    // cache the wrapper for other entries loaded on
    // the same page with the same options.path
    window.__whmEventSourceWrapper[options.path] = EventSourceWrapper();
  }
  return window.__whmEventSourceWrapper[options.path];
}

function connect() {
  getEventSourceWrapper().addMessageListener(handleMessage);

  function handleMessage(event) {
    if (event.data == '\uD83D\uDC93') {
      return;
    }
    try {
      processMessage(JSON.parse(event.data));
    } catch (ex) {
      if (options.warn) {
        console.warn('Invalid HMR message: ' + event.data + '\n' + ex);
      }
    }
  }
}

// the reporter needs to be a singleton on the page
// in case the client is being used by multiple bundles
// we only want to report once.
// all the errors will go to all clients
var singletonKey = '__webpack_hot_middleware_reporter__';
var reporter;
if (typeof window !== 'undefined') {
  if (!window[singletonKey]) {
    window[singletonKey] = createReporter();
  }
  reporter = window[singletonKey];
}

function createReporter() {
  var strip = __webpack_require__(36);

  var overlay;
  if (typeof document !== 'undefined' && options.overlay) {
    overlay = __webpack_require__(37)({
      ansiColors: options.ansiColors,
      overlayStyles: options.overlayStyles,
    });
  }

  var styles = {
    errors: 'color: #ff0000;',
    warnings: 'color: #999933;',
  };
  var previousProblems = null;
  function log(type, obj) {
    var newProblems = obj[type]
      .map(function(msg) {
        return strip(msg);
      })
      .join('\n');
    if (previousProblems == newProblems) {
      return;
    } else {
      previousProblems = newProblems;
    }

    var style = styles[type];
    var name = obj.name ? "'" + obj.name + "' " : '';
    var title = '[HMR] bundle ' + name + 'has ' + obj[type].length + ' ' + type;
    // NOTE: console.warn or console.error will print the stack trace
    // which isn't helpful here, so using console.log to escape it.
    if (console.group && console.groupEnd) {
      console.group('%c' + title, style);
      console.log('%c' + newProblems, style);
      console.groupEnd();
    } else {
      console.log(
        '%c' + title + '\n\t%c' + newProblems.replace(/\n/g, '\n\t'),
        style + 'font-weight: bold;',
        style + 'font-weight: normal;'
      );
    }
  }

  return {
    cleanProblemsCache: function() {
      previousProblems = null;
    },
    problems: function(type, obj) {
      if (options.warn) {
        log(type, obj);
      }
      if (overlay) {
        if (options.overlayWarnings || type === 'errors') {
          overlay.showProblems(type, obj[type]);
          return false;
        }
        overlay.clear();
      }
      return true;
    },
    success: function() {
      if (overlay) overlay.clear();
    },
    useCustomOverlay: function(customOverlay) {
      overlay = customOverlay;
    },
  };
}

var processUpdate = __webpack_require__(38);

var customHandler;
var subscribeAllHandler;
function processMessage(obj) {
  switch (obj.action) {
    case 'building':
      if (options.log) {
        console.log(
          '[HMR] bundle ' +
            (obj.name ? "'" + obj.name + "' " : '') +
            'rebuilding'
        );
      }
      break;
    case 'built':
      if (options.log) {
        console.log(
          '[HMR] bundle ' +
            (obj.name ? "'" + obj.name + "' " : '') +
            'rebuilt in ' +
            obj.time +
            'ms'
        );
      }
    // fall through
    case 'sync':
      if (obj.name && options.name && obj.name !== options.name) {
        return;
      }
      var applyUpdate = true;
      if (obj.errors.length > 0) {
        if (reporter) reporter.problems('errors', obj);
        applyUpdate = false;
      } else if (obj.warnings.length > 0) {
        if (reporter) {
          var overlayShown = reporter.problems('warnings', obj);
          applyUpdate = overlayShown;
        }
      } else {
        if (reporter) {
          reporter.cleanProblemsCache();
          reporter.success();
        }
      }
      if (applyUpdate) {
        processUpdate(obj.hash, obj.modules, options);
      }
      break;
    default:
      if (customHandler) {
        customHandler(obj);
      }
  }

  if (subscribeAllHandler) {
    subscribeAllHandler(obj);
  }
}

if (module) {
  module.exports = {
    subscribeAll: function subscribeAll(handler) {
      subscribeAllHandler = handler;
    },
    subscribe: function subscribe(handler) {
      customHandler = handler;
    },
    useCustomOverlay: function useCustomOverlay(customOverlay) {
      if (reporter) reporter.useCustomOverlay(customOverlay);
    },
    setOptionsAndConnect: setOptionsAndConnect,
  };
}

/* WEBPACK VAR INJECTION */}.call(exports, "?path=__webpack_hmr&dynamicPublicPath=true", __webpack_require__(39)(module)))

/***/ }),

/***/ 2:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export animationEvent */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "v", function() { return Animator; });
/* unused harmony export CompositionTransactionNotifier */
/* unused harmony export CompositionTransactionOwnershipToken */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "d", function() { return CompositionTransaction; });
/* unused harmony export _hyphenate */
/* unused harmony export _isAllWhitespace */
/* unused harmony export ViewEngineHooksResource */
/* unused harmony export viewEngineHooks */
/* unused harmony export ElementEvents */
/* unused harmony export ResourceLoadContext */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "y", function() { return ViewCompileInstruction; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "j", function() { return BehaviorInstruction; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "u", function() { return TargetInstruction; });
/* unused harmony export viewStrategy */
/* unused harmony export RelativeViewStrategy */
/* unused harmony export ConventionalViewStrategy */
/* unused harmony export NoViewStrategy */
/* unused harmony export TemplateRegistryViewStrategy */
/* unused harmony export InlineViewStrategy */
/* unused harmony export StaticViewStrategy */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "h", function() { return ViewLocator; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return BindingLanguage; });
/* unused harmony export SlotCustomAttribute */
/* unused harmony export PassThroughSlot */
/* unused harmony export ShadowSlot */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "l", function() { return ShadowDOM; });
/* unused harmony export validateBehaviorName */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ViewResources; });
/* unused harmony export View */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "e", function() { return ViewSlot; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "t", function() { return BoundViewFactory; });
/* unused harmony export ViewFactory */
/* unused harmony export ViewCompiler */
/* unused harmony export ResourceModule */
/* unused harmony export ResourceDescription */
/* unused harmony export ModuleAnalyzer */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "f", function() { return ViewEngine; });
/* unused harmony export Controller */
/* unused harmony export BehaviorPropertyObserver */
/* unused harmony export BindableProperty */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "g", function() { return HtmlBehaviorResource; });
/* unused harmony export children */
/* unused harmony export child */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "k", function() { return SwapStrategies; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "i", function() { return CompositionEngine; });
/* unused harmony export ElementConfigResource */
/* harmony export (immutable) */ __webpack_exports__["w"] = resource;
/* unused harmony export behavior */
/* harmony export (immutable) */ __webpack_exports__["n"] = customElement;
/* harmony export (immutable) */ __webpack_exports__["r"] = customAttribute;
/* harmony export (immutable) */ __webpack_exports__["s"] = templateController;
/* harmony export (immutable) */ __webpack_exports__["p"] = bindable;
/* unused harmony export dynamicOptions */
/* harmony export (immutable) */ __webpack_exports__["x"] = useShadowDOM;
/* unused harmony export processAttributes */
/* unused harmony export processContent */
/* unused harmony export containerless */
/* unused harmony export useViewStrategy */
/* harmony export (immutable) */ __webpack_exports__["o"] = useView;
/* harmony export (immutable) */ __webpack_exports__["m"] = inlineView;
/* harmony export (immutable) */ __webpack_exports__["q"] = noView;
/* unused harmony export view */
/* unused harmony export elementConfig */
/* unused harmony export viewResources */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return TemplatingEngine; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_aurelia_logging__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_aurelia_metadata__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_aurelia_pal__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_aurelia_loader__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_aurelia_path__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_aurelia_binding__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_aurelia_dependency_injection__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7_aurelia_task_queue__ = __webpack_require__(8);
var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _class, _temp, _class2, _temp2, _dec, _class3, _dec2, _class4, _dec3, _class5, _dec4, _class6, _dec5, _class7, _dec6, _class8, _class9, _temp3, _class10, _temp4, _class12, _dec7, _class14, _dec8, _class15, _class16, _temp5, _dec9, _class17, _dec10, _class18, _dec11, _class19;












var animationEvent = {
  enterBegin: 'animation:enter:begin',
  enterActive: 'animation:enter:active',
  enterDone: 'animation:enter:done',
  enterTimeout: 'animation:enter:timeout',

  leaveBegin: 'animation:leave:begin',
  leaveActive: 'animation:leave:active',
  leaveDone: 'animation:leave:done',
  leaveTimeout: 'animation:leave:timeout',

  staggerNext: 'animation:stagger:next',

  removeClassBegin: 'animation:remove-class:begin',
  removeClassActive: 'animation:remove-class:active',
  removeClassDone: 'animation:remove-class:done',
  removeClassTimeout: 'animation:remove-class:timeout',

  addClassBegin: 'animation:add-class:begin',
  addClassActive: 'animation:add-class:active',
  addClassDone: 'animation:add-class:done',
  addClassTimeout: 'animation:add-class:timeout',

  animateBegin: 'animation:animate:begin',
  animateActive: 'animation:animate:active',
  animateDone: 'animation:animate:done',
  animateTimeout: 'animation:animate:timeout',

  sequenceBegin: 'animation:sequence:begin',
  sequenceDone: 'animation:sequence:done'
};

var Animator = function () {
  function Animator() {
    
  }

  Animator.prototype.enter = function enter(element) {
    return Promise.resolve(false);
  };

  Animator.prototype.leave = function leave(element) {
    return Promise.resolve(false);
  };

  Animator.prototype.removeClass = function removeClass(element, className) {
    element.classList.remove(className);
    return Promise.resolve(false);
  };

  Animator.prototype.addClass = function addClass(element, className) {
    element.classList.add(className);
    return Promise.resolve(false);
  };

  Animator.prototype.animate = function animate(element, className) {
    return Promise.resolve(false);
  };

  Animator.prototype.runSequence = function runSequence(animations) {};

  Animator.prototype.registerEffect = function registerEffect(effectName, properties) {};

  Animator.prototype.unregisterEffect = function unregisterEffect(effectName) {};

  return Animator;
}();

var CompositionTransactionNotifier = function () {
  function CompositionTransactionNotifier(owner) {
    

    this.owner = owner;
    this.owner._compositionCount++;
  }

  CompositionTransactionNotifier.prototype.done = function done() {
    this.owner._compositionCount--;
    this.owner._tryCompleteTransaction();
  };

  return CompositionTransactionNotifier;
}();

var CompositionTransactionOwnershipToken = function () {
  function CompositionTransactionOwnershipToken(owner) {
    

    this.owner = owner;
    this.owner._ownershipToken = this;
    this.thenable = this._createThenable();
  }

  CompositionTransactionOwnershipToken.prototype.waitForCompositionComplete = function waitForCompositionComplete() {
    this.owner._tryCompleteTransaction();
    return this.thenable;
  };

  CompositionTransactionOwnershipToken.prototype.resolve = function resolve() {
    this._resolveCallback();
  };

  CompositionTransactionOwnershipToken.prototype._createThenable = function _createThenable() {
    var _this = this;

    return new Promise(function (resolve, reject) {
      _this._resolveCallback = resolve;
    });
  };

  return CompositionTransactionOwnershipToken;
}();

var CompositionTransaction = function () {
  function CompositionTransaction() {
    

    this._ownershipToken = null;
    this._compositionCount = 0;
  }

  CompositionTransaction.prototype.tryCapture = function tryCapture() {
    return this._ownershipToken === null ? new CompositionTransactionOwnershipToken(this) : null;
  };

  CompositionTransaction.prototype.enlist = function enlist() {
    return new CompositionTransactionNotifier(this);
  };

  CompositionTransaction.prototype._tryCompleteTransaction = function _tryCompleteTransaction() {
    if (this._compositionCount <= 0) {
      this._compositionCount = 0;

      if (this._ownershipToken !== null) {
        var token = this._ownershipToken;
        this._ownershipToken = null;
        token.resolve();
      }
    }
  };

  return CompositionTransaction;
}();

var capitalMatcher = /([A-Z])/g;

function addHyphenAndLower(char) {
  return '-' + char.toLowerCase();
}

function _hyphenate(name) {
  return (name.charAt(0).toLowerCase() + name.slice(1)).replace(capitalMatcher, addHyphenAndLower);
}

function _isAllWhitespace(node) {
  return !(node.auInterpolationTarget || /[^\t\n\r ]/.test(node.textContent));
}

var ViewEngineHooksResource = function () {
  function ViewEngineHooksResource() {
    
  }

  ViewEngineHooksResource.prototype.initialize = function initialize(container, target) {
    this.instance = container.get(target);
  };

  ViewEngineHooksResource.prototype.register = function register(registry, name) {
    registry.registerViewEngineHooks(this.instance);
  };

  ViewEngineHooksResource.prototype.load = function load(container, target) {};

  ViewEngineHooksResource.convention = function convention(name) {
    if (name.endsWith('ViewEngineHooks')) {
      return new ViewEngineHooksResource();
    }
  };

  return ViewEngineHooksResource;
}();

function viewEngineHooks(target) {
  var deco = function deco(t) {
    __WEBPACK_IMPORTED_MODULE_1_aurelia_metadata__["a" /* metadata */].define(__WEBPACK_IMPORTED_MODULE_1_aurelia_metadata__["a" /* metadata */].resource, new ViewEngineHooksResource(), t);
  };

  return target ? deco(target) : deco;
}

var ElementEvents = (_temp = _class = function () {
  function ElementEvents(element) {
    

    this.element = element;
    this.subscriptions = {};
  }

  ElementEvents.prototype._enqueueHandler = function _enqueueHandler(handler) {
    this.subscriptions[handler.eventName] = this.subscriptions[handler.eventName] || [];
    this.subscriptions[handler.eventName].push(handler);
  };

  ElementEvents.prototype._dequeueHandler = function _dequeueHandler(handler) {
    var index = void 0;
    var subscriptions = this.subscriptions[handler.eventName];
    if (subscriptions) {
      index = subscriptions.indexOf(handler);
      if (index > -1) {
        subscriptions.splice(index, 1);
      }
    }
    return handler;
  };

  ElementEvents.prototype.publish = function publish(eventName) {
    var detail = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var bubbles = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
    var cancelable = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : true;

    var event = __WEBPACK_IMPORTED_MODULE_2_aurelia_pal__["c" /* DOM */].createCustomEvent(eventName, { cancelable: cancelable, bubbles: bubbles, detail: detail });
    this.element.dispatchEvent(event);
  };

  ElementEvents.prototype.subscribe = function subscribe(eventName, handler, captureOrOptions) {
    if (typeof handler === 'function') {
      if (captureOrOptions === undefined) {
        captureOrOptions = ElementEvents.defaultListenerOptions;
      }
      var eventHandler = new EventHandlerImpl(this, eventName, handler, captureOrOptions, false);
      return eventHandler;
    }

    return undefined;
  };

  ElementEvents.prototype.subscribeOnce = function subscribeOnce(eventName, handler, captureOrOptions) {
    if (typeof handler === 'function') {
      if (captureOrOptions === undefined) {
        captureOrOptions = ElementEvents.defaultListenerOptions;
      }
      var eventHandler = new EventHandlerImpl(this, eventName, handler, captureOrOptions, true);
      return eventHandler;
    }

    return undefined;
  };

  ElementEvents.prototype.dispose = function dispose(eventName) {
    if (eventName && typeof eventName === 'string') {
      var subscriptions = this.subscriptions[eventName];
      if (subscriptions) {
        while (subscriptions.length) {
          var subscription = subscriptions.pop();
          if (subscription) {
            subscription.dispose();
          }
        }
      }
    } else {
      this.disposeAll();
    }
  };

  ElementEvents.prototype.disposeAll = function disposeAll() {
    for (var _key in this.subscriptions) {
      this.dispose(_key);
    }
  };

  return ElementEvents;
}(), _class.defaultListenerOptions = true, _temp);

var EventHandlerImpl = function () {
  function EventHandlerImpl(owner, eventName, handler, captureOrOptions, once) {
    

    this.owner = owner;
    this.eventName = eventName;
    this.handler = handler;

    this.capture = typeof captureOrOptions === 'boolean' ? captureOrOptions : captureOrOptions.capture;
    this.bubbles = !this.capture;
    this.captureOrOptions = captureOrOptions;
    this.once = once;
    owner.element.addEventListener(eventName, this, captureOrOptions);
    owner._enqueueHandler(this);
  }

  EventHandlerImpl.prototype.handleEvent = function handleEvent(e) {
    var fn = this.handler;
    fn(e);
    if (this.once) {
      this.dispose();
    }
  };

  EventHandlerImpl.prototype.dispose = function dispose() {
    this.owner.element.removeEventListener(this.eventName, this, this.captureOrOptions);
    this.owner._dequeueHandler(this);
    this.owner = this.handler = null;
  };

  return EventHandlerImpl;
}();

var ResourceLoadContext = function () {
  function ResourceLoadContext() {
    

    this.dependencies = {};
  }

  ResourceLoadContext.prototype.addDependency = function addDependency(url) {
    this.dependencies[url] = true;
  };

  ResourceLoadContext.prototype.hasDependency = function hasDependency(url) {
    return url in this.dependencies;
  };

  return ResourceLoadContext;
}();

var ViewCompileInstruction = function ViewCompileInstruction() {
  var targetShadowDOM = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
  var compileSurrogate = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

  

  this.targetShadowDOM = targetShadowDOM;
  this.compileSurrogate = compileSurrogate;
  this.associatedModuleId = null;
};

ViewCompileInstruction.normal = new ViewCompileInstruction();

var BehaviorInstruction = function () {
  function BehaviorInstruction() {
    
  }

  BehaviorInstruction.enhance = function enhance() {
    var instruction = new BehaviorInstruction();
    instruction.enhance = true;
    return instruction;
  };

  BehaviorInstruction.unitTest = function unitTest(type, attributes) {
    var instruction = new BehaviorInstruction();
    instruction.type = type;
    instruction.attributes = attributes || {};
    return instruction;
  };

  BehaviorInstruction.element = function element(node, type) {
    var instruction = new BehaviorInstruction();
    instruction.type = type;
    instruction.attributes = {};
    instruction.anchorIsContainer = !(node.hasAttribute('containerless') || type.containerless);
    instruction.initiatedByBehavior = true;
    return instruction;
  };

  BehaviorInstruction.attribute = function attribute(attrName, type) {
    var instruction = new BehaviorInstruction();
    instruction.attrName = attrName;
    instruction.type = type || null;
    instruction.attributes = {};
    return instruction;
  };

  BehaviorInstruction.dynamic = function dynamic(host, viewModel, viewFactory) {
    var instruction = new BehaviorInstruction();
    instruction.host = host;
    instruction.viewModel = viewModel;
    instruction.viewFactory = viewFactory;
    instruction.inheritBindingContext = true;
    return instruction;
  };

  return BehaviorInstruction;
}();

var biProto = BehaviorInstruction.prototype;
biProto.initiatedByBehavior = false;
biProto.enhance = false;
biProto.partReplacements = null;
biProto.viewFactory = null;
biProto.originalAttrName = null;
biProto.skipContentProcessing = false;
biProto.contentFactory = null;
biProto.viewModel = null;
biProto.anchorIsContainer = false;
biProto.host = null;
biProto.attributes = null;
biProto.type = null;
biProto.attrName = null;
biProto.inheritBindingContext = false;

BehaviorInstruction.normal = new BehaviorInstruction();

var TargetInstruction = (_temp2 = _class2 = function () {
  function TargetInstruction() {
    
  }

  TargetInstruction.shadowSlot = function shadowSlot(parentInjectorId) {
    var instruction = new TargetInstruction();
    instruction.parentInjectorId = parentInjectorId;
    instruction.shadowSlot = true;
    return instruction;
  };

  TargetInstruction.contentExpression = function contentExpression(expression) {
    var instruction = new TargetInstruction();
    instruction.contentExpression = expression;
    return instruction;
  };

  TargetInstruction.letElement = function letElement(expressions) {
    var instruction = new TargetInstruction();
    instruction.expressions = expressions;
    instruction.letElement = true;
    return instruction;
  };

  TargetInstruction.lifting = function lifting(parentInjectorId, liftingInstruction) {
    var instruction = new TargetInstruction();
    instruction.parentInjectorId = parentInjectorId;
    instruction.expressions = TargetInstruction.noExpressions;
    instruction.behaviorInstructions = [liftingInstruction];
    instruction.viewFactory = liftingInstruction.viewFactory;
    instruction.providers = [liftingInstruction.type.target];
    instruction.lifting = true;
    return instruction;
  };

  TargetInstruction.normal = function normal(injectorId, parentInjectorId, providers, behaviorInstructions, expressions, elementInstruction) {
    var instruction = new TargetInstruction();
    instruction.injectorId = injectorId;
    instruction.parentInjectorId = parentInjectorId;
    instruction.providers = providers;
    instruction.behaviorInstructions = behaviorInstructions;
    instruction.expressions = expressions;
    instruction.anchorIsContainer = elementInstruction ? elementInstruction.anchorIsContainer : true;
    instruction.elementInstruction = elementInstruction;
    return instruction;
  };

  TargetInstruction.surrogate = function surrogate(providers, behaviorInstructions, expressions, values) {
    var instruction = new TargetInstruction();
    instruction.expressions = expressions;
    instruction.behaviorInstructions = behaviorInstructions;
    instruction.providers = providers;
    instruction.values = values;
    return instruction;
  };

  return TargetInstruction;
}(), _class2.noExpressions = Object.freeze([]), _temp2);

var tiProto = TargetInstruction.prototype;

tiProto.injectorId = null;
tiProto.parentInjectorId = null;

tiProto.shadowSlot = false;
tiProto.slotName = null;
tiProto.slotFallbackFactory = null;

tiProto.contentExpression = null;
tiProto.letElement = false;

tiProto.expressions = null;
tiProto.expressions = null;
tiProto.providers = null;

tiProto.viewFactory = null;

tiProto.anchorIsContainer = false;
tiProto.elementInstruction = null;
tiProto.lifting = false;

tiProto.values = null;

var viewStrategy = __WEBPACK_IMPORTED_MODULE_1_aurelia_metadata__["b" /* protocol */].create('aurelia:view-strategy', {
  validate: function validate(target) {
    if (!(typeof target.loadViewFactory === 'function')) {
      return 'View strategies must implement: loadViewFactory(viewEngine: ViewEngine, compileInstruction: ViewCompileInstruction, loadContext?: ResourceLoadContext): Promise<ViewFactory>';
    }

    return true;
  },
  compose: function compose(target) {
    if (!(typeof target.makeRelativeTo === 'function')) {
      target.makeRelativeTo = __WEBPACK_IMPORTED_MODULE_2_aurelia_pal__["a" /* PLATFORM */].noop;
    }
  }
});

var RelativeViewStrategy = (_dec = viewStrategy(), _dec(_class3 = function () {
  function RelativeViewStrategy(path) {
    

    this.path = path;
    this.absolutePath = null;
  }

  RelativeViewStrategy.prototype.loadViewFactory = function loadViewFactory(viewEngine, compileInstruction, loadContext, target) {
    if (this.absolutePath === null && this.moduleId) {
      this.absolutePath = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_4_aurelia_path__["a" /* relativeToFile */])(this.path, this.moduleId);
    }

    compileInstruction.associatedModuleId = this.moduleId;
    return viewEngine.loadViewFactory(this.absolutePath || this.path, compileInstruction, loadContext, target);
  };

  RelativeViewStrategy.prototype.makeRelativeTo = function makeRelativeTo(file) {
    if (this.absolutePath === null) {
      this.absolutePath = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_4_aurelia_path__["a" /* relativeToFile */])(this.path, file);
    }
  };

  return RelativeViewStrategy;
}()) || _class3);

var ConventionalViewStrategy = (_dec2 = viewStrategy(), _dec2(_class4 = function () {
  function ConventionalViewStrategy(viewLocator, origin) {
    

    this.moduleId = origin.moduleId;
    this.viewUrl = viewLocator.convertOriginToViewUrl(origin);
  }

  ConventionalViewStrategy.prototype.loadViewFactory = function loadViewFactory(viewEngine, compileInstruction, loadContext, target) {
    compileInstruction.associatedModuleId = this.moduleId;
    return viewEngine.loadViewFactory(this.viewUrl, compileInstruction, loadContext, target);
  };

  return ConventionalViewStrategy;
}()) || _class4);

var NoViewStrategy = (_dec3 = viewStrategy(), _dec3(_class5 = function () {
  function NoViewStrategy(dependencies, dependencyBaseUrl) {
    

    this.dependencies = dependencies || null;
    this.dependencyBaseUrl = dependencyBaseUrl || '';
  }

  NoViewStrategy.prototype.loadViewFactory = function loadViewFactory(viewEngine, compileInstruction, loadContext, target) {
    var entry = this.entry;
    var dependencies = this.dependencies;

    if (entry && entry.factoryIsReady) {
      return Promise.resolve(null);
    }

    this.entry = entry = new __WEBPACK_IMPORTED_MODULE_3_aurelia_loader__["b" /* TemplateRegistryEntry */](this.moduleId || this.dependencyBaseUrl);

    entry.dependencies = [];
    entry.templateIsLoaded = true;

    if (dependencies !== null) {
      for (var i = 0, ii = dependencies.length; i < ii; ++i) {
        var current = dependencies[i];

        if (typeof current === 'string' || typeof current === 'function') {
          entry.addDependency(current);
        } else {
          entry.addDependency(current.from, current.as);
        }
      }
    }

    compileInstruction.associatedModuleId = this.moduleId;

    return viewEngine.loadViewFactory(entry, compileInstruction, loadContext, target);
  };

  return NoViewStrategy;
}()) || _class5);

var TemplateRegistryViewStrategy = (_dec4 = viewStrategy(), _dec4(_class6 = function () {
  function TemplateRegistryViewStrategy(moduleId, entry) {
    

    this.moduleId = moduleId;
    this.entry = entry;
  }

  TemplateRegistryViewStrategy.prototype.loadViewFactory = function loadViewFactory(viewEngine, compileInstruction, loadContext, target) {
    var entry = this.entry;

    if (entry.factoryIsReady) {
      return Promise.resolve(entry.factory);
    }

    compileInstruction.associatedModuleId = this.moduleId;
    return viewEngine.loadViewFactory(entry, compileInstruction, loadContext, target);
  };

  return TemplateRegistryViewStrategy;
}()) || _class6);

var InlineViewStrategy = (_dec5 = viewStrategy(), _dec5(_class7 = function () {
  function InlineViewStrategy(markup, dependencies, dependencyBaseUrl) {
    

    this.markup = markup;
    this.dependencies = dependencies || null;
    this.dependencyBaseUrl = dependencyBaseUrl || '';
  }

  InlineViewStrategy.prototype.loadViewFactory = function loadViewFactory(viewEngine, compileInstruction, loadContext, target) {
    var entry = this.entry;
    var dependencies = this.dependencies;

    if (entry && entry.factoryIsReady) {
      return Promise.resolve(entry.factory);
    }

    this.entry = entry = new __WEBPACK_IMPORTED_MODULE_3_aurelia_loader__["b" /* TemplateRegistryEntry */](this.moduleId || this.dependencyBaseUrl);
    entry.template = __WEBPACK_IMPORTED_MODULE_2_aurelia_pal__["c" /* DOM */].createTemplateFromMarkup(this.markup);

    if (dependencies !== null) {
      for (var i = 0, ii = dependencies.length; i < ii; ++i) {
        var current = dependencies[i];

        if (typeof current === 'string' || typeof current === 'function') {
          entry.addDependency(current);
        } else {
          entry.addDependency(current.from, current.as);
        }
      }
    }

    compileInstruction.associatedModuleId = this.moduleId;
    return viewEngine.loadViewFactory(entry, compileInstruction, loadContext, target);
  };

  return InlineViewStrategy;
}()) || _class7);

var StaticViewStrategy = (_dec6 = viewStrategy(), _dec6(_class8 = function () {
  function StaticViewStrategy(config) {
    

    if (typeof config === 'string' || config instanceof __WEBPACK_IMPORTED_MODULE_2_aurelia_pal__["c" /* DOM */].Element && config.tagName === 'TEMPLATE') {
      config = {
        template: config
      };
    }
    this.template = config.template;
    this.dependencies = config.dependencies || [];
    this.factoryIsReady = false;
    this.onReady = null;
    this.moduleId = 'undefined';
  }

  StaticViewStrategy.prototype.loadViewFactory = function loadViewFactory(viewEngine, compileInstruction, loadContext, target) {
    var _this2 = this;

    if (this.factoryIsReady) {
      return Promise.resolve(this.factory);
    }
    var deps = this.dependencies;
    deps = typeof deps === 'function' ? deps() : deps;
    deps = deps ? deps : [];
    deps = Array.isArray(deps) ? deps : [deps];

    return Promise.all(deps).then(function (dependencies) {
      var container = viewEngine.container;
      var appResources = viewEngine.appResources;
      var viewCompiler = viewEngine.viewCompiler;
      var viewResources = new ViewResources(appResources);

      var resource = void 0;
      var elDeps = [];

      if (target) {
        viewResources.autoRegister(container, target);
      }

      for (var _iterator = dependencies, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
        var _ref;

        if (_isArray) {
          if (_i >= _iterator.length) break;
          _ref = _iterator[_i++];
        } else {
          _i = _iterator.next();
          if (_i.done) break;
          _ref = _i.value;
        }

        var dep = _ref;

        if (typeof dep === 'function') {
          resource = viewResources.autoRegister(container, dep);
          if (resource.elementName !== null) {
            elDeps.push(resource);
          }
        } else if (dep && (typeof dep === 'undefined' ? 'undefined' : _typeof(dep)) === 'object') {
          for (var _key2 in dep) {
            var exported = dep[_key2];
            if (typeof exported === 'function') {
              resource = viewResources.autoRegister(container, exported);
              if (resource.elementName !== null) {
                elDeps.push(resource);
              }
            }
          }
        } else {
          throw new Error('dependency neither function nor object. Received: "' + (typeof dep === 'undefined' ? 'undefined' : _typeof(dep)) + '"');
        }
      }

      return Promise.all(elDeps.map(function (el) {
        return el.load(container, el.target);
      })).then(function () {
        var factory = _this2.template !== null ? viewCompiler.compile(_this2.template, viewResources, compileInstruction) : null;
        _this2.factoryIsReady = true;
        _this2.factory = factory;
        return factory;
      });
    });
  };

  return StaticViewStrategy;
}()) || _class8);

var ViewLocator = (_temp3 = _class9 = function () {
  function ViewLocator() {
    
  }

  ViewLocator.prototype.getViewStrategy = function getViewStrategy(value) {
    if (!value) {
      return null;
    }

    if ((typeof value === 'undefined' ? 'undefined' : _typeof(value)) === 'object' && 'getViewStrategy' in value) {
      var _origin = __WEBPACK_IMPORTED_MODULE_1_aurelia_metadata__["c" /* Origin */].get(value.constructor);

      value = value.getViewStrategy();

      if (typeof value === 'string') {
        value = new RelativeViewStrategy(value);
      }

      viewStrategy.assert(value);

      if (_origin.moduleId) {
        value.makeRelativeTo(_origin.moduleId);
      }

      return value;
    }

    if (typeof value === 'string') {
      value = new RelativeViewStrategy(value);
    }

    if (viewStrategy.validate(value)) {
      return value;
    }

    if (typeof value !== 'function') {
      value = value.constructor;
    }

    if ('$view' in value) {
      var c = value.$view;
      var _view = void 0;
      c = typeof c === 'function' ? c.call(value) : c;
      if (c === null) {
        _view = new NoViewStrategy();
      } else {
        _view = c instanceof StaticViewStrategy ? c : new StaticViewStrategy(c);
      }
      __WEBPACK_IMPORTED_MODULE_1_aurelia_metadata__["a" /* metadata */].define(ViewLocator.viewStrategyMetadataKey, _view, value);
      return _view;
    }

    var origin = __WEBPACK_IMPORTED_MODULE_1_aurelia_metadata__["c" /* Origin */].get(value);
    var strategy = __WEBPACK_IMPORTED_MODULE_1_aurelia_metadata__["a" /* metadata */].get(ViewLocator.viewStrategyMetadataKey, value);

    if (!strategy) {
      if (!origin.moduleId) {
        throw new Error('Cannot determine default view strategy for object.', value);
      }

      strategy = this.createFallbackViewStrategy(origin);
    } else if (origin.moduleId) {
      strategy.moduleId = origin.moduleId;
    }

    return strategy;
  };

  ViewLocator.prototype.createFallbackViewStrategy = function createFallbackViewStrategy(origin) {
    return new ConventionalViewStrategy(this, origin);
  };

  ViewLocator.prototype.convertOriginToViewUrl = function convertOriginToViewUrl(origin) {
    var moduleId = origin.moduleId;
    var id = moduleId.endsWith('.js') || moduleId.endsWith('.ts') ? moduleId.substring(0, moduleId.length - 3) : moduleId;
    return id + '.html';
  };

  return ViewLocator;
}(), _class9.viewStrategyMetadataKey = 'aurelia:view-strategy', _temp3);

function mi(name) {
  throw new Error('BindingLanguage must implement ' + name + '().');
}

var BindingLanguage = function () {
  function BindingLanguage() {
    
  }

  BindingLanguage.prototype.inspectAttribute = function inspectAttribute(resources, elementName, attrName, attrValue) {
    mi('inspectAttribute');
  };

  BindingLanguage.prototype.createAttributeInstruction = function createAttributeInstruction(resources, element, info, existingInstruction) {
    mi('createAttributeInstruction');
  };

  BindingLanguage.prototype.createLetExpressions = function createLetExpressions(resources, element) {
    mi('createLetExpressions');
  };

  BindingLanguage.prototype.inspectTextContent = function inspectTextContent(resources, value) {
    mi('inspectTextContent');
  };

  return BindingLanguage;
}();

var noNodes = Object.freeze([]);

var SlotCustomAttribute = function () {
  SlotCustomAttribute.inject = function inject() {
    return [__WEBPACK_IMPORTED_MODULE_2_aurelia_pal__["c" /* DOM */].Element];
  };

  function SlotCustomAttribute(element) {
    

    this.element = element;
    this.element.auSlotAttribute = this;
  }

  SlotCustomAttribute.prototype.valueChanged = function valueChanged(newValue, oldValue) {};

  return SlotCustomAttribute;
}();

var PassThroughSlot = function () {
  function PassThroughSlot(anchor, name, destinationName, fallbackFactory) {
    

    this.anchor = anchor;
    this.anchor.viewSlot = this;
    this.name = name;
    this.destinationName = destinationName;
    this.fallbackFactory = fallbackFactory;
    this.destinationSlot = null;
    this.projections = 0;
    this.contentView = null;

    var attr = new SlotCustomAttribute(this.anchor);
    attr.value = this.destinationName;
  }

  PassThroughSlot.prototype.renderFallbackContent = function renderFallbackContent(view, nodes, projectionSource, index) {
    if (this.contentView === null) {
      this.contentView = this.fallbackFactory.create(this.ownerView.container);
      this.contentView.bind(this.ownerView.bindingContext, this.ownerView.overrideContext);

      var slots = Object.create(null);
      slots[this.destinationSlot.name] = this.destinationSlot;

      ShadowDOM.distributeView(this.contentView, slots, projectionSource, index, this.destinationSlot.name);
    }
  };

  PassThroughSlot.prototype.passThroughTo = function passThroughTo(destinationSlot) {
    this.destinationSlot = destinationSlot;
  };

  PassThroughSlot.prototype.addNode = function addNode(view, node, projectionSource, index) {
    if (this.contentView !== null) {
      this.contentView.removeNodes();
      this.contentView.detached();
      this.contentView.unbind();
      this.contentView = null;
    }

    if (node.viewSlot instanceof PassThroughSlot) {
      node.viewSlot.passThroughTo(this);
      return;
    }

    this.projections++;
    this.destinationSlot.addNode(view, node, projectionSource, index);
  };

  PassThroughSlot.prototype.removeView = function removeView(view, projectionSource) {
    this.projections--;
    this.destinationSlot.removeView(view, projectionSource);

    if (this.needsFallbackRendering) {
      this.renderFallbackContent(null, noNodes, projectionSource);
    }
  };

  PassThroughSlot.prototype.removeAll = function removeAll(projectionSource) {
    this.projections = 0;
    this.destinationSlot.removeAll(projectionSource);

    if (this.needsFallbackRendering) {
      this.renderFallbackContent(null, noNodes, projectionSource);
    }
  };

  PassThroughSlot.prototype.projectFrom = function projectFrom(view, projectionSource) {
    this.destinationSlot.projectFrom(view, projectionSource);
  };

  PassThroughSlot.prototype.created = function created(ownerView) {
    this.ownerView = ownerView;
  };

  PassThroughSlot.prototype.bind = function bind(view) {
    if (this.contentView) {
      this.contentView.bind(view.bindingContext, view.overrideContext);
    }
  };

  PassThroughSlot.prototype.attached = function attached() {
    if (this.contentView) {
      this.contentView.attached();
    }
  };

  PassThroughSlot.prototype.detached = function detached() {
    if (this.contentView) {
      this.contentView.detached();
    }
  };

  PassThroughSlot.prototype.unbind = function unbind() {
    if (this.contentView) {
      this.contentView.unbind();
    }
  };

  _createClass(PassThroughSlot, [{
    key: 'needsFallbackRendering',
    get: function get() {
      return this.fallbackFactory && this.projections === 0;
    }
  }]);

  return PassThroughSlot;
}();

var ShadowSlot = function () {
  function ShadowSlot(anchor, name, fallbackFactory) {
    

    this.anchor = anchor;
    this.anchor.isContentProjectionSource = true;
    this.anchor.viewSlot = this;
    this.name = name;
    this.fallbackFactory = fallbackFactory;
    this.contentView = null;
    this.projections = 0;
    this.children = [];
    this.projectFromAnchors = null;
    this.destinationSlots = null;
  }

  ShadowSlot.prototype.addNode = function addNode(view, node, projectionSource, index, destination) {
    if (this.contentView !== null) {
      this.contentView.removeNodes();
      this.contentView.detached();
      this.contentView.unbind();
      this.contentView = null;
    }

    if (node.viewSlot instanceof PassThroughSlot) {
      node.viewSlot.passThroughTo(this);
      return;
    }

    if (this.destinationSlots !== null) {
      ShadowDOM.distributeNodes(view, [node], this.destinationSlots, this, index);
    } else {
      node.auOwnerView = view;
      node.auProjectionSource = projectionSource;
      node.auAssignedSlot = this;

      var anchor = this._findAnchor(view, node, projectionSource, index);
      var parent = anchor.parentNode;

      parent.insertBefore(node, anchor);
      this.children.push(node);
      this.projections++;
    }
  };

  ShadowSlot.prototype.removeView = function removeView(view, projectionSource) {
    if (this.destinationSlots !== null) {
      ShadowDOM.undistributeView(view, this.destinationSlots, this);
    } else if (this.contentView && this.contentView.hasSlots) {
      ShadowDOM.undistributeView(view, this.contentView.slots, projectionSource);
    } else {
      var found = this.children.find(function (x) {
        return x.auSlotProjectFrom === projectionSource;
      });
      if (found) {
        var _children = found.auProjectionChildren;

        for (var i = 0, ii = _children.length; i < ii; ++i) {
          var _child = _children[i];

          if (_child.auOwnerView === view) {
            _children.splice(i, 1);
            view.fragment.appendChild(_child);
            i--;ii--;
            this.projections--;
          }
        }

        if (this.needsFallbackRendering) {
          this.renderFallbackContent(view, noNodes, projectionSource);
        }
      }
    }
  };

  ShadowSlot.prototype.removeAll = function removeAll(projectionSource) {
    if (this.destinationSlots !== null) {
      ShadowDOM.undistributeAll(this.destinationSlots, this);
    } else if (this.contentView && this.contentView.hasSlots) {
      ShadowDOM.undistributeAll(this.contentView.slots, projectionSource);
    } else {
      var found = this.children.find(function (x) {
        return x.auSlotProjectFrom === projectionSource;
      });

      if (found) {
        var _children2 = found.auProjectionChildren;
        for (var i = 0, ii = _children2.length; i < ii; ++i) {
          var _child2 = _children2[i];
          _child2.auOwnerView.fragment.appendChild(_child2);
          this.projections--;
        }

        found.auProjectionChildren = [];

        if (this.needsFallbackRendering) {
          this.renderFallbackContent(null, noNodes, projectionSource);
        }
      }
    }
  };

  ShadowSlot.prototype._findAnchor = function _findAnchor(view, node, projectionSource, index) {
    if (projectionSource) {
      var found = this.children.find(function (x) {
        return x.auSlotProjectFrom === projectionSource;
      });
      if (found) {
        if (index !== undefined) {
          var _children3 = found.auProjectionChildren;
          var viewIndex = -1;
          var lastView = void 0;

          for (var i = 0, ii = _children3.length; i < ii; ++i) {
            var current = _children3[i];

            if (current.auOwnerView !== lastView) {
              viewIndex++;
              lastView = current.auOwnerView;

              if (viewIndex >= index && lastView !== view) {
                _children3.splice(i, 0, node);
                return current;
              }
            }
          }
        }

        found.auProjectionChildren.push(node);
        return found;
      }
    }

    return this.anchor;
  };

  ShadowSlot.prototype.projectTo = function projectTo(slots) {
    this.destinationSlots = slots;
  };

  ShadowSlot.prototype.projectFrom = function projectFrom(view, projectionSource) {
    var anchor = __WEBPACK_IMPORTED_MODULE_2_aurelia_pal__["c" /* DOM */].createComment('anchor');
    var parent = this.anchor.parentNode;
    anchor.auSlotProjectFrom = projectionSource;
    anchor.auOwnerView = view;
    anchor.auProjectionChildren = [];
    parent.insertBefore(anchor, this.anchor);
    this.children.push(anchor);

    if (this.projectFromAnchors === null) {
      this.projectFromAnchors = [];
    }

    this.projectFromAnchors.push(anchor);
  };

  ShadowSlot.prototype.renderFallbackContent = function renderFallbackContent(view, nodes, projectionSource, index) {
    if (this.contentView === null) {
      this.contentView = this.fallbackFactory.create(this.ownerView.container);
      this.contentView.bind(this.ownerView.bindingContext, this.ownerView.overrideContext);
      this.contentView.insertNodesBefore(this.anchor);
    }

    if (this.contentView.hasSlots) {
      var slots = this.contentView.slots;
      var projectFromAnchors = this.projectFromAnchors;

      if (projectFromAnchors !== null) {
        for (var slotName in slots) {
          var slot = slots[slotName];

          for (var i = 0, ii = projectFromAnchors.length; i < ii; ++i) {
            var anchor = projectFromAnchors[i];
            slot.projectFrom(anchor.auOwnerView, anchor.auSlotProjectFrom);
          }
        }
      }

      this.fallbackSlots = slots;
      ShadowDOM.distributeNodes(view, nodes, slots, projectionSource, index);
    }
  };

  ShadowSlot.prototype.created = function created(ownerView) {
    this.ownerView = ownerView;
  };

  ShadowSlot.prototype.bind = function bind(view) {
    if (this.contentView) {
      this.contentView.bind(view.bindingContext, view.overrideContext);
    }
  };

  ShadowSlot.prototype.attached = function attached() {
    if (this.contentView) {
      this.contentView.attached();
    }
  };

  ShadowSlot.prototype.detached = function detached() {
    if (this.contentView) {
      this.contentView.detached();
    }
  };

  ShadowSlot.prototype.unbind = function unbind() {
    if (this.contentView) {
      this.contentView.unbind();
    }
  };

  _createClass(ShadowSlot, [{
    key: 'needsFallbackRendering',
    get: function get() {
      return this.fallbackFactory && this.projections === 0;
    }
  }]);

  return ShadowSlot;
}();

var ShadowDOM = (_temp4 = _class10 = function () {
  function ShadowDOM() {
    
  }

  ShadowDOM.getSlotName = function getSlotName(node) {
    if (node.auSlotAttribute === undefined) {
      return ShadowDOM.defaultSlotKey;
    }

    return node.auSlotAttribute.value;
  };

  ShadowDOM.distributeView = function distributeView(view, slots, projectionSource, index, destinationOverride) {
    var nodes = void 0;

    if (view === null) {
      nodes = noNodes;
    } else {
      var childNodes = view.fragment.childNodes;
      var ii = childNodes.length;
      nodes = new Array(ii);

      for (var i = 0; i < ii; ++i) {
        nodes[i] = childNodes[i];
      }
    }

    ShadowDOM.distributeNodes(view, nodes, slots, projectionSource, index, destinationOverride);
  };

  ShadowDOM.undistributeView = function undistributeView(view, slots, projectionSource) {
    for (var slotName in slots) {
      slots[slotName].removeView(view, projectionSource);
    }
  };

  ShadowDOM.undistributeAll = function undistributeAll(slots, projectionSource) {
    for (var slotName in slots) {
      slots[slotName].removeAll(projectionSource);
    }
  };

  ShadowDOM.distributeNodes = function distributeNodes(view, nodes, slots, projectionSource, index, destinationOverride) {
    for (var i = 0, ii = nodes.length; i < ii; ++i) {
      var currentNode = nodes[i];
      var nodeType = currentNode.nodeType;

      if (currentNode.isContentProjectionSource) {
        currentNode.viewSlot.projectTo(slots);

        for (var slotName in slots) {
          slots[slotName].projectFrom(view, currentNode.viewSlot);
        }

        nodes.splice(i, 1);
        ii--;i--;
      } else if (nodeType === 1 || nodeType === 3 || currentNode.viewSlot instanceof PassThroughSlot) {
        if (nodeType === 3 && _isAllWhitespace(currentNode)) {
          nodes.splice(i, 1);
          ii--;i--;
        } else {
          var found = slots[destinationOverride || ShadowDOM.getSlotName(currentNode)];

          if (found) {
            found.addNode(view, currentNode, projectionSource, index);
            nodes.splice(i, 1);
            ii--;i--;
          }
        }
      } else {
        nodes.splice(i, 1);
        ii--;i--;
      }
    }

    for (var _slotName in slots) {
      var slot = slots[_slotName];

      if (slot.needsFallbackRendering) {
        slot.renderFallbackContent(view, nodes, projectionSource, index);
      }
    }
  };

  return ShadowDOM;
}(), _class10.defaultSlotKey = '__au-default-slot-key__', _temp4);

function register(lookup, name, resource, type) {
  if (!name) {
    return;
  }

  var existing = lookup[name];
  if (existing) {
    if (existing !== resource) {
      throw new Error('Attempted to register ' + type + ' when one with the same name already exists. Name: ' + name + '.');
    }

    return;
  }

  lookup[name] = resource;
}

function validateBehaviorName(name, type) {
  if (/[A-Z]/.test(name)) {
    var newName = _hyphenate(name);
    __WEBPACK_IMPORTED_MODULE_0_aurelia_logging__["getLogger"]('templating').warn('\'' + name + '\' is not a valid ' + type + ' name and has been converted to \'' + newName + '\'. Upper-case letters are not allowed because the DOM is not case-sensitive.');
    return newName;
  }
  return name;
}

var conventionMark = '__au_resource__';

var ViewResources = function () {
  ViewResources.convention = function convention(target, existing) {
    var resource = void 0;

    if (existing && conventionMark in existing) {
      return existing;
    }
    if ('$resource' in target) {
      var config = target.$resource;

      if (typeof config === 'string') {
        resource = existing || new HtmlBehaviorResource();
        resource[conventionMark] = true;
        if (!resource.elementName) {
          resource.elementName = validateBehaviorName(config, 'custom element');
        }
      } else {
        if (typeof config === 'function') {
          config = config.call(target);
        }
        if (typeof config === 'string') {
          config = { name: config };
        }

        config = Object.assign({}, config);

        var resourceType = config.type || 'element';

        var _name = config.name;
        switch (resourceType) {
          case 'element':case 'attribute':
            resource = existing || new HtmlBehaviorResource();
            resource[conventionMark] = true;
            if (resourceType === 'element') {
              if (!resource.elementName) {
                resource.elementName = _name ? validateBehaviorName(_name, 'custom element') : _hyphenate(target.name);
              }
            } else {
              if (!resource.attributeName) {
                resource.attributeName = _name ? validateBehaviorName(_name, 'custom attribute') : _hyphenate(target.name);
              }
            }
            if ('templateController' in config) {
              config.liftsContent = config.templateController;
              delete config.templateController;
            }
            if ('defaultBindingMode' in config && resource.attributeDefaultBindingMode !== undefined) {
              config.attributeDefaultBindingMode = config.defaultBindingMode;
              delete config.defaultBindingMode;
            }

            delete config.name;

            Object.assign(resource, config);
            break;
          case 'valueConverter':
            resource = new __WEBPACK_IMPORTED_MODULE_5_aurelia_binding__["a" /* ValueConverterResource */](__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_5_aurelia_binding__["b" /* camelCase */])(_name || target.name));
            break;
          case 'bindingBehavior':
            resource = new __WEBPACK_IMPORTED_MODULE_5_aurelia_binding__["c" /* BindingBehaviorResource */](__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_5_aurelia_binding__["b" /* camelCase */])(_name || target.name));
            break;
          case 'viewEngineHooks':
            resource = new ViewEngineHooksResource();
            break;
        }
      }

      if (resource instanceof HtmlBehaviorResource) {
        var _bindables = typeof config === 'string' ? undefined : config.bindables;
        var currentProps = resource.properties;
        if (Array.isArray(_bindables)) {
          for (var i = 0, ii = _bindables.length; ii > i; ++i) {
            var prop = _bindables[i];
            if (!prop || typeof prop !== 'string' && !prop.name) {
              throw new Error('Invalid bindable property at "' + i + '" for class "' + target.name + '". Expected either a string or an object with "name" property.');
            }
            var newProp = new BindableProperty(prop);

            var existed = false;
            for (var j = 0, jj = currentProps.length; jj > j; ++j) {
              if (currentProps[j].name === newProp.name) {
                existed = true;
                break;
              }
            }
            if (existed) {
              continue;
            }
            newProp.registerWith(target, resource);
          }
        }
      }
    }
    return resource;
  };

  function ViewResources(parent, viewUrl) {
    

    this.bindingLanguage = null;

    this.parent = parent || null;
    this.hasParent = this.parent !== null;
    this.viewUrl = viewUrl || '';
    this.lookupFunctions = {
      valueConverters: this.getValueConverter.bind(this),
      bindingBehaviors: this.getBindingBehavior.bind(this)
    };
    this.attributes = Object.create(null);
    this.elements = Object.create(null);
    this.valueConverters = Object.create(null);
    this.bindingBehaviors = Object.create(null);
    this.attributeMap = Object.create(null);
    this.values = Object.create(null);
    this.beforeCompile = this.afterCompile = this.beforeCreate = this.afterCreate = this.beforeBind = this.beforeUnbind = false;
  }

  ViewResources.prototype._tryAddHook = function _tryAddHook(obj, name) {
    if (typeof obj[name] === 'function') {
      var func = obj[name].bind(obj);
      var counter = 1;
      var callbackName = void 0;

      while (this[callbackName = name + counter.toString()] !== undefined) {
        counter++;
      }

      this[name] = true;
      this[callbackName] = func;
    }
  };

  ViewResources.prototype._invokeHook = function _invokeHook(name, one, two, three, four) {
    if (this.hasParent) {
      this.parent._invokeHook(name, one, two, three, four);
    }

    if (this[name]) {
      this[name + '1'](one, two, three, four);

      var callbackName = name + '2';
      if (this[callbackName]) {
        this[callbackName](one, two, three, four);

        callbackName = name + '3';
        if (this[callbackName]) {
          this[callbackName](one, two, three, four);

          var counter = 4;

          while (this[callbackName = name + counter.toString()] !== undefined) {
            this[callbackName](one, two, three, four);
            counter++;
          }
        }
      }
    }
  };

  ViewResources.prototype.registerViewEngineHooks = function registerViewEngineHooks(hooks) {
    this._tryAddHook(hooks, 'beforeCompile');
    this._tryAddHook(hooks, 'afterCompile');
    this._tryAddHook(hooks, 'beforeCreate');
    this._tryAddHook(hooks, 'afterCreate');
    this._tryAddHook(hooks, 'beforeBind');
    this._tryAddHook(hooks, 'beforeUnbind');
  };

  ViewResources.prototype.getBindingLanguage = function getBindingLanguage(bindingLanguageFallback) {
    return this.bindingLanguage || (this.bindingLanguage = bindingLanguageFallback);
  };

  ViewResources.prototype.patchInParent = function patchInParent(newParent) {
    var originalParent = this.parent;

    this.parent = newParent || null;
    this.hasParent = this.parent !== null;

    if (newParent.parent === null) {
      newParent.parent = originalParent;
      newParent.hasParent = originalParent !== null;
    }
  };

  ViewResources.prototype.relativeToView = function relativeToView(path) {
    return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_4_aurelia_path__["a" /* relativeToFile */])(path, this.viewUrl);
  };

  ViewResources.prototype.registerElement = function registerElement(tagName, behavior) {
    register(this.elements, tagName, behavior, 'an Element');
  };

  ViewResources.prototype.getElement = function getElement(tagName) {
    return this.elements[tagName] || (this.hasParent ? this.parent.getElement(tagName) : null);
  };

  ViewResources.prototype.mapAttribute = function mapAttribute(attribute) {
    return this.attributeMap[attribute] || (this.hasParent ? this.parent.mapAttribute(attribute) : null);
  };

  ViewResources.prototype.registerAttribute = function registerAttribute(attribute, behavior, knownAttribute) {
    this.attributeMap[attribute] = knownAttribute;
    register(this.attributes, attribute, behavior, 'an Attribute');
  };

  ViewResources.prototype.getAttribute = function getAttribute(attribute) {
    return this.attributes[attribute] || (this.hasParent ? this.parent.getAttribute(attribute) : null);
  };

  ViewResources.prototype.registerValueConverter = function registerValueConverter(name, valueConverter) {
    register(this.valueConverters, name, valueConverter, 'a ValueConverter');
  };

  ViewResources.prototype.getValueConverter = function getValueConverter(name) {
    return this.valueConverters[name] || (this.hasParent ? this.parent.getValueConverter(name) : null);
  };

  ViewResources.prototype.registerBindingBehavior = function registerBindingBehavior(name, bindingBehavior) {
    register(this.bindingBehaviors, name, bindingBehavior, 'a BindingBehavior');
  };

  ViewResources.prototype.getBindingBehavior = function getBindingBehavior(name) {
    return this.bindingBehaviors[name] || (this.hasParent ? this.parent.getBindingBehavior(name) : null);
  };

  ViewResources.prototype.registerValue = function registerValue(name, value) {
    register(this.values, name, value, 'a value');
  };

  ViewResources.prototype.getValue = function getValue(name) {
    return this.values[name] || (this.hasParent ? this.parent.getValue(name) : null);
  };

  ViewResources.prototype.autoRegister = function autoRegister(container, impl) {
    var resourceTypeMeta = __WEBPACK_IMPORTED_MODULE_1_aurelia_metadata__["a" /* metadata */].getOwn(__WEBPACK_IMPORTED_MODULE_1_aurelia_metadata__["a" /* metadata */].resource, impl);
    if (resourceTypeMeta) {
      if (resourceTypeMeta instanceof HtmlBehaviorResource) {
        ViewResources.convention(impl, resourceTypeMeta);

        if (resourceTypeMeta.attributeName === null && resourceTypeMeta.elementName === null) {
          HtmlBehaviorResource.convention(impl.name, resourceTypeMeta);
        }
        if (resourceTypeMeta.attributeName === null && resourceTypeMeta.elementName === null) {
          resourceTypeMeta.elementName = _hyphenate(impl.name);
        }
      }
    } else {
      resourceTypeMeta = ViewResources.convention(impl) || HtmlBehaviorResource.convention(impl.name) || __WEBPACK_IMPORTED_MODULE_5_aurelia_binding__["a" /* ValueConverterResource */].convention(impl.name) || __WEBPACK_IMPORTED_MODULE_5_aurelia_binding__["c" /* BindingBehaviorResource */].convention(impl.name) || ViewEngineHooksResource.convention(impl.name);
      if (!resourceTypeMeta) {
        resourceTypeMeta = new HtmlBehaviorResource();
        resourceTypeMeta.elementName = _hyphenate(impl.name);
      }
      __WEBPACK_IMPORTED_MODULE_1_aurelia_metadata__["a" /* metadata */].define(__WEBPACK_IMPORTED_MODULE_1_aurelia_metadata__["a" /* metadata */].resource, resourceTypeMeta, impl);
    }
    resourceTypeMeta.initialize(container, impl);
    resourceTypeMeta.register(this);
    return resourceTypeMeta;
  };

  return ViewResources;
}();

var View = function () {
  function View(container, viewFactory, fragment, controllers, bindings, children, slots) {
    

    this.container = container;
    this.viewFactory = viewFactory;
    this.resources = viewFactory.resources;
    this.fragment = fragment;
    this.firstChild = fragment.firstChild;
    this.lastChild = fragment.lastChild;
    this.controllers = controllers;
    this.bindings = bindings;
    this.children = children;
    this.slots = slots;
    this.hasSlots = false;
    this.fromCache = false;
    this.isBound = false;
    this.isAttached = false;
    this.bindingContext = null;
    this.overrideContext = null;
    this.controller = null;
    this.viewModelScope = null;
    this.animatableElement = undefined;
    this._isUserControlled = false;
    this.contentView = null;

    for (var _key3 in slots) {
      this.hasSlots = true;
      break;
    }
  }

  View.prototype.returnToCache = function returnToCache() {
    this.viewFactory.returnViewToCache(this);
  };

  View.prototype.created = function created() {
    var i = void 0;
    var ii = void 0;
    var controllers = this.controllers;

    for (i = 0, ii = controllers.length; i < ii; ++i) {
      controllers[i].created(this);
    }
  };

  View.prototype.bind = function bind(bindingContext, overrideContext, _systemUpdate) {
    var controllers = void 0;
    var bindings = void 0;
    var children = void 0;
    var i = void 0;
    var ii = void 0;

    if (_systemUpdate && this._isUserControlled) {
      return;
    }

    if (this.isBound) {
      if (this.bindingContext === bindingContext) {
        return;
      }

      this.unbind();
    }

    this.isBound = true;
    this.bindingContext = bindingContext;
    this.overrideContext = overrideContext || __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_5_aurelia_binding__["d" /* createOverrideContext */])(bindingContext);

    this.resources._invokeHook('beforeBind', this);

    bindings = this.bindings;
    for (i = 0, ii = bindings.length; i < ii; ++i) {
      bindings[i].bind(this);
    }

    if (this.viewModelScope !== null) {
      bindingContext.bind(this.viewModelScope.bindingContext, this.viewModelScope.overrideContext);
      this.viewModelScope = null;
    }

    controllers = this.controllers;
    for (i = 0, ii = controllers.length; i < ii; ++i) {
      controllers[i].bind(this);
    }

    children = this.children;
    for (i = 0, ii = children.length; i < ii; ++i) {
      children[i].bind(bindingContext, overrideContext, true);
    }

    if (this.hasSlots) {
      ShadowDOM.distributeView(this.contentView, this.slots);
    }
  };

  View.prototype.addBinding = function addBinding(binding) {
    this.bindings.push(binding);

    if (this.isBound) {
      binding.bind(this);
    }
  };

  View.prototype.unbind = function unbind() {
    var controllers = void 0;
    var bindings = void 0;
    var children = void 0;
    var i = void 0;
    var ii = void 0;

    if (this.isBound) {
      this.isBound = false;
      this.resources._invokeHook('beforeUnbind', this);

      if (this.controller !== null) {
        this.controller.unbind();
      }

      bindings = this.bindings;
      for (i = 0, ii = bindings.length; i < ii; ++i) {
        bindings[i].unbind();
      }

      controllers = this.controllers;
      for (i = 0, ii = controllers.length; i < ii; ++i) {
        controllers[i].unbind();
      }

      children = this.children;
      for (i = 0, ii = children.length; i < ii; ++i) {
        children[i].unbind();
      }

      this.bindingContext = null;
      this.overrideContext = null;
    }
  };

  View.prototype.insertNodesBefore = function insertNodesBefore(refNode) {
    refNode.parentNode.insertBefore(this.fragment, refNode);
  };

  View.prototype.appendNodesTo = function appendNodesTo(parent) {
    parent.appendChild(this.fragment);
  };

  View.prototype.removeNodes = function removeNodes() {
    var fragment = this.fragment;
    var current = this.firstChild;
    var end = this.lastChild;
    var next = void 0;

    while (current) {
      next = current.nextSibling;
      fragment.appendChild(current);

      if (current === end) {
        break;
      }

      current = next;
    }
  };

  View.prototype.attached = function attached() {
    var controllers = void 0;
    var children = void 0;
    var i = void 0;
    var ii = void 0;

    if (this.isAttached) {
      return;
    }

    this.isAttached = true;

    if (this.controller !== null) {
      this.controller.attached();
    }

    controllers = this.controllers;
    for (i = 0, ii = controllers.length; i < ii; ++i) {
      controllers[i].attached();
    }

    children = this.children;
    for (i = 0, ii = children.length; i < ii; ++i) {
      children[i].attached();
    }
  };

  View.prototype.detached = function detached() {
    var controllers = void 0;
    var children = void 0;
    var i = void 0;
    var ii = void 0;

    if (this.isAttached) {
      this.isAttached = false;

      if (this.controller !== null) {
        this.controller.detached();
      }

      controllers = this.controllers;
      for (i = 0, ii = controllers.length; i < ii; ++i) {
        controllers[i].detached();
      }

      children = this.children;
      for (i = 0, ii = children.length; i < ii; ++i) {
        children[i].detached();
      }
    }
  };

  return View;
}();

function getAnimatableElement(view) {
  if (view.animatableElement !== undefined) {
    return view.animatableElement;
  }

  var current = view.firstChild;

  while (current && current.nodeType !== 1) {
    current = current.nextSibling;
  }

  if (current && current.nodeType === 1) {
    return view.animatableElement = current.classList.contains('au-animate') ? current : null;
  }

  return view.animatableElement = null;
}

var ViewSlot = function () {
  function ViewSlot(anchor, anchorIsContainer) {
    var animator = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : Animator.instance;

    

    this.anchor = anchor;
    this.anchorIsContainer = anchorIsContainer;
    this.bindingContext = null;
    this.overrideContext = null;
    this.animator = animator;
    this.children = [];
    this.isBound = false;
    this.isAttached = false;
    this.contentSelectors = null;
    anchor.viewSlot = this;
    anchor.isContentProjectionSource = false;
  }

  ViewSlot.prototype.animateView = function animateView(view) {
    var direction = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'enter';

    var animatableElement = getAnimatableElement(view);

    if (animatableElement !== null) {
      switch (direction) {
        case 'enter':
          return this.animator.enter(animatableElement);
        case 'leave':
          return this.animator.leave(animatableElement);
        default:
          throw new Error('Invalid animation direction: ' + direction);
      }
    }
  };

  ViewSlot.prototype.transformChildNodesIntoView = function transformChildNodesIntoView() {
    var parent = this.anchor;

    this.children.push({
      fragment: parent,
      firstChild: parent.firstChild,
      lastChild: parent.lastChild,
      returnToCache: function returnToCache() {},
      removeNodes: function removeNodes() {
        var last = void 0;

        while (last = parent.lastChild) {
          parent.removeChild(last);
        }
      },
      created: function created() {},
      bind: function bind() {},
      unbind: function unbind() {},
      attached: function attached() {},
      detached: function detached() {}
    });
  };

  ViewSlot.prototype.bind = function bind(bindingContext, overrideContext) {
    var i = void 0;
    var ii = void 0;
    var children = void 0;

    if (this.isBound) {
      if (this.bindingContext === bindingContext) {
        return;
      }

      this.unbind();
    }

    this.isBound = true;
    this.bindingContext = bindingContext = bindingContext || this.bindingContext;
    this.overrideContext = overrideContext = overrideContext || this.overrideContext;

    children = this.children;
    for (i = 0, ii = children.length; i < ii; ++i) {
      children[i].bind(bindingContext, overrideContext, true);
    }
  };

  ViewSlot.prototype.unbind = function unbind() {
    if (this.isBound) {
      var i = void 0;
      var ii = void 0;
      var _children4 = this.children;

      this.isBound = false;
      this.bindingContext = null;
      this.overrideContext = null;

      for (i = 0, ii = _children4.length; i < ii; ++i) {
        _children4[i].unbind();
      }
    }
  };

  ViewSlot.prototype.add = function add(view) {
    if (this.anchorIsContainer) {
      view.appendNodesTo(this.anchor);
    } else {
      view.insertNodesBefore(this.anchor);
    }

    this.children.push(view);

    if (this.isAttached) {
      view.attached();
      return this.animateView(view, 'enter');
    }
  };

  ViewSlot.prototype.insert = function insert(index, view) {
    var children = this.children;
    var length = children.length;

    if (index === 0 && length === 0 || index >= length) {
      return this.add(view);
    }

    view.insertNodesBefore(children[index].firstChild);
    children.splice(index, 0, view);

    if (this.isAttached) {
      view.attached();
      return this.animateView(view, 'enter');
    }
  };

  ViewSlot.prototype.move = function move(sourceIndex, targetIndex) {
    if (sourceIndex === targetIndex) {
      return;
    }

    var children = this.children;
    var view = children[sourceIndex];

    view.removeNodes();
    view.insertNodesBefore(children[targetIndex].firstChild);
    children.splice(sourceIndex, 1);
    children.splice(targetIndex, 0, view);
  };

  ViewSlot.prototype.remove = function remove(view, returnToCache, skipAnimation) {
    return this.removeAt(this.children.indexOf(view), returnToCache, skipAnimation);
  };

  ViewSlot.prototype.removeMany = function removeMany(viewsToRemove, returnToCache, skipAnimation) {
    var _this3 = this;

    var children = this.children;
    var ii = viewsToRemove.length;
    var i = void 0;
    var rmPromises = [];

    viewsToRemove.forEach(function (child) {
      if (skipAnimation) {
        child.removeNodes();
        return;
      }

      var animation = _this3.animateView(child, 'leave');
      if (animation) {
        rmPromises.push(animation.then(function () {
          return child.removeNodes();
        }));
      } else {
        child.removeNodes();
      }
    });

    var removeAction = function removeAction() {
      if (_this3.isAttached) {
        for (i = 0; i < ii; ++i) {
          viewsToRemove[i].detached();
        }
      }

      if (returnToCache) {
        for (i = 0; i < ii; ++i) {
          viewsToRemove[i].returnToCache();
        }
      }

      for (i = 0; i < ii; ++i) {
        var index = children.indexOf(viewsToRemove[i]);
        if (index >= 0) {
          children.splice(index, 1);
        }
      }
    };

    if (rmPromises.length > 0) {
      return Promise.all(rmPromises).then(function () {
        return removeAction();
      });
    }

    return removeAction();
  };

  ViewSlot.prototype.removeAt = function removeAt(index, returnToCache, skipAnimation) {
    var _this4 = this;

    var view = this.children[index];

    var removeAction = function removeAction() {
      index = _this4.children.indexOf(view);
      view.removeNodes();
      _this4.children.splice(index, 1);

      if (_this4.isAttached) {
        view.detached();
      }

      if (returnToCache) {
        view.returnToCache();
      }

      return view;
    };

    if (!skipAnimation) {
      var animation = this.animateView(view, 'leave');
      if (animation) {
        return animation.then(function () {
          return removeAction();
        });
      }
    }

    return removeAction();
  };

  ViewSlot.prototype.removeAll = function removeAll(returnToCache, skipAnimation) {
    var _this5 = this;

    var children = this.children;
    var ii = children.length;
    var i = void 0;
    var rmPromises = [];

    children.forEach(function (child) {
      if (skipAnimation) {
        child.removeNodes();
        return;
      }

      var animation = _this5.animateView(child, 'leave');
      if (animation) {
        rmPromises.push(animation.then(function () {
          return child.removeNodes();
        }));
      } else {
        child.removeNodes();
      }
    });

    var removeAction = function removeAction() {
      if (_this5.isAttached) {
        for (i = 0; i < ii; ++i) {
          children[i].detached();
        }
      }

      if (returnToCache) {
        for (i = 0; i < ii; ++i) {
          var _child3 = children[i];

          if (_child3) {
            _child3.returnToCache();
          }
        }
      }

      _this5.children = [];
    };

    if (rmPromises.length > 0) {
      return Promise.all(rmPromises).then(function () {
        return removeAction();
      });
    }

    return removeAction();
  };

  ViewSlot.prototype.attached = function attached() {
    var i = void 0;
    var ii = void 0;
    var children = void 0;
    var child = void 0;

    if (this.isAttached) {
      return;
    }

    this.isAttached = true;

    children = this.children;
    for (i = 0, ii = children.length; i < ii; ++i) {
      child = children[i];
      child.attached();
      this.animateView(child, 'enter');
    }
  };

  ViewSlot.prototype.detached = function detached() {
    var i = void 0;
    var ii = void 0;
    var children = void 0;

    if (this.isAttached) {
      this.isAttached = false;
      children = this.children;
      for (i = 0, ii = children.length; i < ii; ++i) {
        children[i].detached();
      }
    }
  };

  ViewSlot.prototype.projectTo = function projectTo(slots) {
    var _this6 = this;

    this.projectToSlots = slots;
    this.add = this._projectionAdd;
    this.insert = this._projectionInsert;
    this.move = this._projectionMove;
    this.remove = this._projectionRemove;
    this.removeAt = this._projectionRemoveAt;
    this.removeMany = this._projectionRemoveMany;
    this.removeAll = this._projectionRemoveAll;
    this.children.forEach(function (view) {
      return ShadowDOM.distributeView(view, slots, _this6);
    });
  };

  ViewSlot.prototype._projectionAdd = function _projectionAdd(view) {
    ShadowDOM.distributeView(view, this.projectToSlots, this);

    this.children.push(view);

    if (this.isAttached) {
      view.attached();
    }
  };

  ViewSlot.prototype._projectionInsert = function _projectionInsert(index, view) {
    if (index === 0 && !this.children.length || index >= this.children.length) {
      this.add(view);
    } else {
      ShadowDOM.distributeView(view, this.projectToSlots, this, index);

      this.children.splice(index, 0, view);

      if (this.isAttached) {
        view.attached();
      }
    }
  };

  ViewSlot.prototype._projectionMove = function _projectionMove(sourceIndex, targetIndex) {
    if (sourceIndex === targetIndex) {
      return;
    }

    var children = this.children;
    var view = children[sourceIndex];

    ShadowDOM.undistributeView(view, this.projectToSlots, this);
    ShadowDOM.distributeView(view, this.projectToSlots, this, targetIndex);

    children.splice(sourceIndex, 1);
    children.splice(targetIndex, 0, view);
  };

  ViewSlot.prototype._projectionRemove = function _projectionRemove(view, returnToCache) {
    ShadowDOM.undistributeView(view, this.projectToSlots, this);
    this.children.splice(this.children.indexOf(view), 1);

    if (this.isAttached) {
      view.detached();
    }
    if (returnToCache) {
      view.returnToCache();
    }
  };

  ViewSlot.prototype._projectionRemoveAt = function _projectionRemoveAt(index, returnToCache) {
    var view = this.children[index];

    ShadowDOM.undistributeView(view, this.projectToSlots, this);
    this.children.splice(index, 1);

    if (this.isAttached) {
      view.detached();
    }
    if (returnToCache) {
      view.returnToCache();
    }
  };

  ViewSlot.prototype._projectionRemoveMany = function _projectionRemoveMany(viewsToRemove, returnToCache) {
    var _this7 = this;

    viewsToRemove.forEach(function (view) {
      return _this7.remove(view, returnToCache);
    });
  };

  ViewSlot.prototype._projectionRemoveAll = function _projectionRemoveAll(returnToCache) {
    ShadowDOM.undistributeAll(this.projectToSlots, this);

    var children = this.children;
    var ii = children.length;

    for (var i = 0; i < ii; ++i) {
      if (returnToCache) {
        children[i].returnToCache();
      } else if (this.isAttached) {
        children[i].detached();
      }
    }

    this.children = [];
  };

  return ViewSlot;
}();

var ProviderResolver = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_6_aurelia_dependency_injection__["b" /* resolver */])(_class12 = function () {
  function ProviderResolver() {
    
  }

  ProviderResolver.prototype.get = function get(container, key) {
    var id = key.__providerId__;
    return id in container ? container[id] : container[id] = container.invoke(key);
  };

  return ProviderResolver;
}()) || _class12;

var providerResolverInstance = new ProviderResolver();

function elementContainerGet(key) {
  if (key === __WEBPACK_IMPORTED_MODULE_2_aurelia_pal__["c" /* DOM */].Element) {
    return this.element;
  }

  if (key === BoundViewFactory) {
    if (this.boundViewFactory) {
      return this.boundViewFactory;
    }

    var factory = this.instruction.viewFactory;
    var _partReplacements = this.partReplacements;

    if (_partReplacements) {
      factory = _partReplacements[factory.part] || factory;
    }

    this.boundViewFactory = new BoundViewFactory(this, factory, _partReplacements);
    return this.boundViewFactory;
  }

  if (key === ViewSlot) {
    if (this.viewSlot === undefined) {
      this.viewSlot = new ViewSlot(this.element, this.instruction.anchorIsContainer);
      this.element.isContentProjectionSource = this.instruction.lifting;
      this.children.push(this.viewSlot);
    }

    return this.viewSlot;
  }

  if (key === ElementEvents) {
    return this.elementEvents || (this.elementEvents = new ElementEvents(this.element));
  }

  if (key === CompositionTransaction) {
    return this.compositionTransaction || (this.compositionTransaction = this.parent.get(key));
  }

  if (key === ViewResources) {
    return this.viewResources;
  }

  if (key === TargetInstruction) {
    return this.instruction;
  }

  return this.superGet(key);
}

function createElementContainer(parent, element, instruction, children, partReplacements, resources) {
  var container = parent.createChild();
  var providers = void 0;
  var i = void 0;

  container.element = element;
  container.instruction = instruction;
  container.children = children;
  container.viewResources = resources;
  container.partReplacements = partReplacements;

  providers = instruction.providers;
  i = providers.length;

  while (i--) {
    container._resolvers.set(providers[i], providerResolverInstance);
  }

  container.superGet = container.get;
  container.get = elementContainerGet;

  return container;
}

function hasAttribute(name) {
  return this._element.hasAttribute(name);
}

function getAttribute(name) {
  return this._element.getAttribute(name);
}

function setAttribute(name, value) {
  this._element.setAttribute(name, value);
}

function makeElementIntoAnchor(element, elementInstruction) {
  var anchor = __WEBPACK_IMPORTED_MODULE_2_aurelia_pal__["c" /* DOM */].createComment('anchor');

  if (elementInstruction) {
    var firstChild = element.firstChild;

    if (firstChild && firstChild.tagName === 'AU-CONTENT') {
      anchor.contentElement = firstChild;
    }

    anchor._element = element;

    anchor.hasAttribute = hasAttribute;
    anchor.getAttribute = getAttribute;
    anchor.setAttribute = setAttribute;
  }

  __WEBPACK_IMPORTED_MODULE_2_aurelia_pal__["c" /* DOM */].replaceNode(anchor, element);

  return anchor;
}

function applyInstructions(containers, element, instruction, controllers, bindings, children, shadowSlots, partReplacements, resources) {
  var behaviorInstructions = instruction.behaviorInstructions;
  var expressions = instruction.expressions;
  var elementContainer = void 0;
  var i = void 0;
  var ii = void 0;
  var current = void 0;
  var instance = void 0;

  if (instruction.contentExpression) {
    bindings.push(instruction.contentExpression.createBinding(element.nextSibling));
    element.nextSibling.auInterpolationTarget = true;
    element.parentNode.removeChild(element);
    return;
  }

  if (instruction.shadowSlot) {
    var commentAnchor = __WEBPACK_IMPORTED_MODULE_2_aurelia_pal__["c" /* DOM */].createComment('slot');
    var slot = void 0;

    if (instruction.slotDestination) {
      slot = new PassThroughSlot(commentAnchor, instruction.slotName, instruction.slotDestination, instruction.slotFallbackFactory);
    } else {
      slot = new ShadowSlot(commentAnchor, instruction.slotName, instruction.slotFallbackFactory);
    }

    __WEBPACK_IMPORTED_MODULE_2_aurelia_pal__["c" /* DOM */].replaceNode(commentAnchor, element);
    shadowSlots[instruction.slotName] = slot;
    controllers.push(slot);
    return;
  }

  if (instruction.letElement) {
    for (i = 0, ii = expressions.length; i < ii; ++i) {
      bindings.push(expressions[i].createBinding());
    }
    element.parentNode.removeChild(element);
    return;
  }

  if (behaviorInstructions.length) {
    if (!instruction.anchorIsContainer) {
      element = makeElementIntoAnchor(element, instruction.elementInstruction);
    }

    containers[instruction.injectorId] = elementContainer = createElementContainer(containers[instruction.parentInjectorId], element, instruction, children, partReplacements, resources);

    for (i = 0, ii = behaviorInstructions.length; i < ii; ++i) {
      current = behaviorInstructions[i];
      instance = current.type.create(elementContainer, current, element, bindings);
      controllers.push(instance);
    }
  }

  for (i = 0, ii = expressions.length; i < ii; ++i) {
    bindings.push(expressions[i].createBinding(element));
  }
}

function styleStringToObject(style, target) {
  var attributes = style.split(';');
  var firstIndexOfColon = void 0;
  var i = void 0;
  var current = void 0;
  var key = void 0;
  var value = void 0;

  target = target || {};

  for (i = 0; i < attributes.length; i++) {
    current = attributes[i];
    firstIndexOfColon = current.indexOf(':');
    key = current.substring(0, firstIndexOfColon).trim();
    value = current.substring(firstIndexOfColon + 1).trim();
    target[key] = value;
  }

  return target;
}

function styleObjectToString(obj) {
  var result = '';

  for (var _key4 in obj) {
    result += _key4 + ':' + obj[_key4] + ';';
  }

  return result;
}

function applySurrogateInstruction(container, element, instruction, controllers, bindings, children) {
  var behaviorInstructions = instruction.behaviorInstructions;
  var expressions = instruction.expressions;
  var providers = instruction.providers;
  var values = instruction.values;
  var i = void 0;
  var ii = void 0;
  var current = void 0;
  var instance = void 0;
  var currentAttributeValue = void 0;

  i = providers.length;
  while (i--) {
    container._resolvers.set(providers[i], providerResolverInstance);
  }

  for (var _key5 in values) {
    currentAttributeValue = element.getAttribute(_key5);

    if (currentAttributeValue) {
      if (_key5 === 'class') {
        element.setAttribute('class', currentAttributeValue + ' ' + values[_key5]);
      } else if (_key5 === 'style') {
        var styleObject = styleStringToObject(values[_key5]);
        styleStringToObject(currentAttributeValue, styleObject);
        element.setAttribute('style', styleObjectToString(styleObject));
      }
    } else {
      element.setAttribute(_key5, values[_key5]);
    }
  }

  if (behaviorInstructions.length) {
    for (i = 0, ii = behaviorInstructions.length; i < ii; ++i) {
      current = behaviorInstructions[i];
      instance = current.type.create(container, current, element, bindings);

      if (instance.contentView) {
        children.push(instance.contentView);
      }

      controllers.push(instance);
    }
  }

  for (i = 0, ii = expressions.length; i < ii; ++i) {
    bindings.push(expressions[i].createBinding(element));
  }
}

var BoundViewFactory = function () {
  function BoundViewFactory(parentContainer, viewFactory, partReplacements) {
    

    this.parentContainer = parentContainer;
    this.viewFactory = viewFactory;
    this.factoryCreateInstruction = { partReplacements: partReplacements };
  }

  BoundViewFactory.prototype.create = function create() {
    var view = this.viewFactory.create(this.parentContainer.createChild(), this.factoryCreateInstruction);
    view._isUserControlled = true;
    return view;
  };

  BoundViewFactory.prototype.setCacheSize = function setCacheSize(size, doNotOverrideIfAlreadySet) {
    this.viewFactory.setCacheSize(size, doNotOverrideIfAlreadySet);
  };

  BoundViewFactory.prototype.getCachedView = function getCachedView() {
    return this.viewFactory.getCachedView();
  };

  BoundViewFactory.prototype.returnViewToCache = function returnViewToCache(view) {
    this.viewFactory.returnViewToCache(view);
  };

  _createClass(BoundViewFactory, [{
    key: 'isCaching',
    get: function get() {
      return this.viewFactory.isCaching;
    }
  }]);

  return BoundViewFactory;
}();

var ViewFactory = function () {
  function ViewFactory(template, instructions, resources) {
    

    this.isCaching = false;

    this.template = template;
    this.instructions = instructions;
    this.resources = resources;
    this.cacheSize = -1;
    this.cache = null;
  }

  ViewFactory.prototype.setCacheSize = function setCacheSize(size, doNotOverrideIfAlreadySet) {
    if (size) {
      if (size === '*') {
        size = Number.MAX_VALUE;
      } else if (typeof size === 'string') {
        size = parseInt(size, 10);
      }
    }

    if (this.cacheSize === -1 || !doNotOverrideIfAlreadySet) {
      this.cacheSize = size;
    }

    if (this.cacheSize > 0) {
      this.cache = [];
    } else {
      this.cache = null;
    }

    this.isCaching = this.cacheSize > 0;
  };

  ViewFactory.prototype.getCachedView = function getCachedView() {
    return this.cache !== null ? this.cache.pop() || null : null;
  };

  ViewFactory.prototype.returnViewToCache = function returnViewToCache(view) {
    if (view.isAttached) {
      view.detached();
    }

    if (view.isBound) {
      view.unbind();
    }

    if (this.cache !== null && this.cache.length < this.cacheSize) {
      view.fromCache = true;
      this.cache.push(view);
    }
  };

  ViewFactory.prototype.create = function create(container, createInstruction, element) {
    createInstruction = createInstruction || BehaviorInstruction.normal;

    var cachedView = this.getCachedView();
    if (cachedView !== null) {
      return cachedView;
    }

    var fragment = createInstruction.enhance ? this.template : this.template.cloneNode(true);
    var instructables = fragment.querySelectorAll('.au-target');
    var instructions = this.instructions;
    var resources = this.resources;
    var controllers = [];
    var bindings = [];
    var children = [];
    var shadowSlots = Object.create(null);
    var containers = { root: container };
    var partReplacements = createInstruction.partReplacements;
    var i = void 0;
    var ii = void 0;
    var view = void 0;
    var instructable = void 0;
    var instruction = void 0;

    this.resources._invokeHook('beforeCreate', this, container, fragment, createInstruction);

    if (element && this.surrogateInstruction !== null) {
      applySurrogateInstruction(container, element, this.surrogateInstruction, controllers, bindings, children);
    }

    if (createInstruction.enhance && fragment.hasAttribute('au-target-id')) {
      instructable = fragment;
      instruction = instructions[instructable.getAttribute('au-target-id')];
      applyInstructions(containers, instructable, instruction, controllers, bindings, children, shadowSlots, partReplacements, resources);
    }

    for (i = 0, ii = instructables.length; i < ii; ++i) {
      instructable = instructables[i];
      instruction = instructions[instructable.getAttribute('au-target-id')];
      applyInstructions(containers, instructable, instruction, controllers, bindings, children, shadowSlots, partReplacements, resources);
    }

    view = new View(container, this, fragment, controllers, bindings, children, shadowSlots);

    if (!createInstruction.initiatedByBehavior) {
      view.created();
    }

    this.resources._invokeHook('afterCreate', view);

    return view;
  };

  return ViewFactory;
}();

var nextInjectorId = 0;
function getNextInjectorId() {
  return ++nextInjectorId;
}

var lastAUTargetID = 0;
function getNextAUTargetID() {
  return (++lastAUTargetID).toString();
}

function makeIntoInstructionTarget(element) {
  var value = element.getAttribute('class');
  var auTargetID = getNextAUTargetID();

  element.setAttribute('class', value ? value + ' au-target' : 'au-target');
  element.setAttribute('au-target-id', auTargetID);

  return auTargetID;
}

function makeShadowSlot(compiler, resources, node, instructions, parentInjectorId) {
  var auShadowSlot = __WEBPACK_IMPORTED_MODULE_2_aurelia_pal__["c" /* DOM */].createElement('au-shadow-slot');
  __WEBPACK_IMPORTED_MODULE_2_aurelia_pal__["c" /* DOM */].replaceNode(auShadowSlot, node);

  var auTargetID = makeIntoInstructionTarget(auShadowSlot);
  var instruction = TargetInstruction.shadowSlot(parentInjectorId);

  instruction.slotName = node.getAttribute('name') || ShadowDOM.defaultSlotKey;
  instruction.slotDestination = node.getAttribute('slot');

  if (node.innerHTML.trim()) {
    var fragment = __WEBPACK_IMPORTED_MODULE_2_aurelia_pal__["c" /* DOM */].createDocumentFragment();
    var _child4 = void 0;

    while (_child4 = node.firstChild) {
      fragment.appendChild(_child4);
    }

    instruction.slotFallbackFactory = compiler.compile(fragment, resources);
  }

  instructions[auTargetID] = instruction;

  return auShadowSlot;
}

var defaultLetHandler = BindingLanguage.prototype.createLetExpressions;

var ViewCompiler = (_dec7 = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_6_aurelia_dependency_injection__["c" /* inject */])(BindingLanguage, ViewResources), _dec7(_class14 = function () {
  function ViewCompiler(bindingLanguage, resources) {
    

    this.bindingLanguage = bindingLanguage;
    this.resources = resources;
  }

  ViewCompiler.prototype.compile = function compile(source, resources, compileInstruction) {
    resources = resources || this.resources;
    compileInstruction = compileInstruction || ViewCompileInstruction.normal;
    source = typeof source === 'string' ? __WEBPACK_IMPORTED_MODULE_2_aurelia_pal__["c" /* DOM */].createTemplateFromMarkup(source) : source;

    var content = void 0;
    var part = void 0;
    var cacheSize = void 0;

    if (source.content) {
      part = source.getAttribute('part');
      cacheSize = source.getAttribute('view-cache');
      content = __WEBPACK_IMPORTED_MODULE_2_aurelia_pal__["c" /* DOM */].adoptNode(source.content);
    } else {
      content = source;
    }

    compileInstruction.targetShadowDOM = compileInstruction.targetShadowDOM && __WEBPACK_IMPORTED_MODULE_2_aurelia_pal__["d" /* FEATURE */].shadowDOM;
    resources._invokeHook('beforeCompile', content, resources, compileInstruction);

    var instructions = {};
    this._compileNode(content, resources, instructions, source, 'root', !compileInstruction.targetShadowDOM);

    var firstChild = content.firstChild;
    if (firstChild && firstChild.nodeType === 1) {
      var targetId = firstChild.getAttribute('au-target-id');
      if (targetId) {
        var ins = instructions[targetId];

        if (ins.shadowSlot || ins.lifting || ins.elementInstruction && !ins.elementInstruction.anchorIsContainer) {
          content.insertBefore(__WEBPACK_IMPORTED_MODULE_2_aurelia_pal__["c" /* DOM */].createComment('view'), firstChild);
        }
      }
    }

    var factory = new ViewFactory(content, instructions, resources);

    factory.surrogateInstruction = compileInstruction.compileSurrogate ? this._compileSurrogate(source, resources) : null;
    factory.part = part;

    if (cacheSize) {
      factory.setCacheSize(cacheSize);
    }

    resources._invokeHook('afterCompile', factory);

    return factory;
  };

  ViewCompiler.prototype._compileNode = function _compileNode(node, resources, instructions, parentNode, parentInjectorId, targetLightDOM) {
    switch (node.nodeType) {
      case 1:
        return this._compileElement(node, resources, instructions, parentNode, parentInjectorId, targetLightDOM);
      case 3:
        var expression = resources.getBindingLanguage(this.bindingLanguage).inspectTextContent(resources, node.wholeText);
        if (expression) {
          var marker = __WEBPACK_IMPORTED_MODULE_2_aurelia_pal__["c" /* DOM */].createElement('au-marker');
          var auTargetID = makeIntoInstructionTarget(marker);
          (node.parentNode || parentNode).insertBefore(marker, node);
          node.textContent = ' ';
          instructions[auTargetID] = TargetInstruction.contentExpression(expression);

          while (node.nextSibling && node.nextSibling.nodeType === 3) {
            (node.parentNode || parentNode).removeChild(node.nextSibling);
          }
        } else {
          while (node.nextSibling && node.nextSibling.nodeType === 3) {
            node = node.nextSibling;
          }
        }
        return node.nextSibling;
      case 11:
        var currentChild = node.firstChild;
        while (currentChild) {
          currentChild = this._compileNode(currentChild, resources, instructions, node, parentInjectorId, targetLightDOM);
        }
        break;
      default:
        break;
    }

    return node.nextSibling;
  };

  ViewCompiler.prototype._compileSurrogate = function _compileSurrogate(node, resources) {
    var tagName = node.tagName.toLowerCase();
    var attributes = node.attributes;
    var bindingLanguage = resources.getBindingLanguage(this.bindingLanguage);
    var knownAttribute = void 0;
    var property = void 0;
    var instruction = void 0;
    var i = void 0;
    var ii = void 0;
    var attr = void 0;
    var attrName = void 0;
    var attrValue = void 0;
    var info = void 0;
    var type = void 0;
    var expressions = [];
    var expression = void 0;
    var behaviorInstructions = [];
    var values = {};
    var hasValues = false;
    var providers = [];

    for (i = 0, ii = attributes.length; i < ii; ++i) {
      attr = attributes[i];
      attrName = attr.name;
      attrValue = attr.value;

      info = bindingLanguage.inspectAttribute(resources, tagName, attrName, attrValue);
      type = resources.getAttribute(info.attrName);

      if (type) {
        knownAttribute = resources.mapAttribute(info.attrName);
        if (knownAttribute) {
          property = type.attributes[knownAttribute];

          if (property) {
            info.defaultBindingMode = property.defaultBindingMode;

            if (!info.command && !info.expression) {
              info.command = property.hasOptions ? 'options' : null;
            }

            if (info.command && info.command !== 'options' && type.primaryProperty) {
              var _primaryProperty = type.primaryProperty;
              attrName = info.attrName = _primaryProperty.attribute;

              info.defaultBindingMode = _primaryProperty.defaultBindingMode;
            }
          }
        }
      }

      instruction = bindingLanguage.createAttributeInstruction(resources, node, info, undefined, type);

      if (instruction) {
        if (instruction.alteredAttr) {
          type = resources.getAttribute(instruction.attrName);
        }

        if (instruction.discrete) {
          expressions.push(instruction);
        } else {
          if (type) {
            instruction.type = type;
            this._configureProperties(instruction, resources);

            if (type.liftsContent) {
              throw new Error('You cannot place a template controller on a surrogate element.');
            } else {
              behaviorInstructions.push(instruction);
            }
          } else {
            expressions.push(instruction.attributes[instruction.attrName]);
          }
        }
      } else {
        if (type) {
          instruction = BehaviorInstruction.attribute(attrName, type);
          instruction.attributes[resources.mapAttribute(attrName)] = attrValue;

          if (type.liftsContent) {
            throw new Error('You cannot place a template controller on a surrogate element.');
          } else {
            behaviorInstructions.push(instruction);
          }
        } else if (attrName !== 'id' && attrName !== 'part' && attrName !== 'replace-part') {
          hasValues = true;
          values[attrName] = attrValue;
        }
      }
    }

    if (expressions.length || behaviorInstructions.length || hasValues) {
      for (i = 0, ii = behaviorInstructions.length; i < ii; ++i) {
        instruction = behaviorInstructions[i];
        instruction.type.compile(this, resources, node, instruction);
        providers.push(instruction.type.target);
      }

      for (i = 0, ii = expressions.length; i < ii; ++i) {
        expression = expressions[i];
        if (expression.attrToRemove !== undefined) {
          node.removeAttribute(expression.attrToRemove);
        }
      }

      return TargetInstruction.surrogate(providers, behaviorInstructions, expressions, values);
    }

    return null;
  };

  ViewCompiler.prototype._compileElement = function _compileElement(node, resources, instructions, parentNode, parentInjectorId, targetLightDOM) {
    var tagName = node.tagName.toLowerCase();
    var attributes = node.attributes;
    var expressions = [];
    var expression = void 0;
    var behaviorInstructions = [];
    var providers = [];
    var bindingLanguage = resources.getBindingLanguage(this.bindingLanguage);
    var liftingInstruction = void 0;
    var viewFactory = void 0;
    var type = void 0;
    var elementInstruction = void 0;
    var elementProperty = void 0;
    var i = void 0;
    var ii = void 0;
    var attr = void 0;
    var attrName = void 0;
    var attrValue = void 0;
    var originalAttrName = void 0;
    var instruction = void 0;
    var info = void 0;
    var property = void 0;
    var knownAttribute = void 0;
    var auTargetID = void 0;
    var injectorId = void 0;

    if (tagName === 'slot') {
      if (targetLightDOM) {
        node = makeShadowSlot(this, resources, node, instructions, parentInjectorId);
      }
      return node.nextSibling;
    } else if (tagName === 'template') {
      if (!('content' in node)) {
        throw new Error('You cannot place a template element within ' + node.namespaceURI + ' namespace');
      }
      viewFactory = this.compile(node, resources);
      viewFactory.part = node.getAttribute('part');
    } else {
      type = resources.getElement(node.getAttribute('as-element') || tagName);

      if (tagName === 'let' && !type && bindingLanguage.createLetExpressions !== defaultLetHandler) {
        expressions = bindingLanguage.createLetExpressions(resources, node);
        auTargetID = makeIntoInstructionTarget(node);
        instructions[auTargetID] = TargetInstruction.letElement(expressions);
        return node.nextSibling;
      }
      if (type) {
        elementInstruction = BehaviorInstruction.element(node, type);
        type.processAttributes(this, resources, node, attributes, elementInstruction);
        behaviorInstructions.push(elementInstruction);
      }
    }

    for (i = 0, ii = attributes.length; i < ii; ++i) {
      attr = attributes[i];
      originalAttrName = attrName = attr.name;
      attrValue = attr.value;
      info = bindingLanguage.inspectAttribute(resources, tagName, attrName, attrValue);

      if (targetLightDOM && info.attrName === 'slot') {
        info.attrName = attrName = 'au-slot';
      }

      type = resources.getAttribute(info.attrName);
      elementProperty = null;

      if (type) {
        knownAttribute = resources.mapAttribute(info.attrName);
        if (knownAttribute) {
          property = type.attributes[knownAttribute];

          if (property) {
            info.defaultBindingMode = property.defaultBindingMode;

            if (!info.command && !info.expression) {
              info.command = property.hasOptions ? 'options' : null;
            }

            if (info.command && info.command !== 'options' && type.primaryProperty) {
              var _primaryProperty2 = type.primaryProperty;
              attrName = info.attrName = _primaryProperty2.attribute;

              info.defaultBindingMode = _primaryProperty2.defaultBindingMode;
            }
          }
        }
      } else if (elementInstruction) {
        elementProperty = elementInstruction.type.attributes[info.attrName];
        if (elementProperty) {
          info.defaultBindingMode = elementProperty.defaultBindingMode;
        }
      }

      if (elementProperty) {
        instruction = bindingLanguage.createAttributeInstruction(resources, node, info, elementInstruction);
      } else {
        instruction = bindingLanguage.createAttributeInstruction(resources, node, info, undefined, type);
      }

      if (instruction) {
        if (instruction.alteredAttr) {
          type = resources.getAttribute(instruction.attrName);
        }

        if (instruction.discrete) {
          expressions.push(instruction);
        } else {
          if (type) {
            instruction.type = type;
            this._configureProperties(instruction, resources);

            if (type.liftsContent) {
              instruction.originalAttrName = originalAttrName;
              liftingInstruction = instruction;
              break;
            } else {
              behaviorInstructions.push(instruction);
            }
          } else if (elementProperty) {
            elementInstruction.attributes[info.attrName].targetProperty = elementProperty.name;
          } else {
            expressions.push(instruction.attributes[instruction.attrName]);
          }
        }
      } else {
        if (type) {
          instruction = BehaviorInstruction.attribute(attrName, type);
          instruction.attributes[resources.mapAttribute(attrName)] = attrValue;

          if (type.liftsContent) {
            instruction.originalAttrName = originalAttrName;
            liftingInstruction = instruction;
            break;
          } else {
            behaviorInstructions.push(instruction);
          }
        } else if (elementProperty) {
          elementInstruction.attributes[attrName] = attrValue;
        }
      }
    }

    if (liftingInstruction) {
      liftingInstruction.viewFactory = viewFactory;
      node = liftingInstruction.type.compile(this, resources, node, liftingInstruction, parentNode);
      auTargetID = makeIntoInstructionTarget(node);
      instructions[auTargetID] = TargetInstruction.lifting(parentInjectorId, liftingInstruction);
    } else {
      var skipContentProcessing = false;

      if (expressions.length || behaviorInstructions.length) {
        injectorId = behaviorInstructions.length ? getNextInjectorId() : false;

        for (i = 0, ii = behaviorInstructions.length; i < ii; ++i) {
          instruction = behaviorInstructions[i];
          instruction.type.compile(this, resources, node, instruction, parentNode);
          providers.push(instruction.type.target);
          skipContentProcessing = skipContentProcessing || instruction.skipContentProcessing;
        }

        for (i = 0, ii = expressions.length; i < ii; ++i) {
          expression = expressions[i];
          if (expression.attrToRemove !== undefined) {
            node.removeAttribute(expression.attrToRemove);
          }
        }

        auTargetID = makeIntoInstructionTarget(node);
        instructions[auTargetID] = TargetInstruction.normal(injectorId, parentInjectorId, providers, behaviorInstructions, expressions, elementInstruction);
      }

      if (skipContentProcessing) {
        return node.nextSibling;
      }

      var currentChild = node.firstChild;
      while (currentChild) {
        currentChild = this._compileNode(currentChild, resources, instructions, node, injectorId || parentInjectorId, targetLightDOM);
      }
    }

    return node.nextSibling;
  };

  ViewCompiler.prototype._configureProperties = function _configureProperties(instruction, resources) {
    var type = instruction.type;
    var attrName = instruction.attrName;
    var attributes = instruction.attributes;
    var property = void 0;
    var key = void 0;
    var value = void 0;

    var knownAttribute = resources.mapAttribute(attrName);
    if (knownAttribute && attrName in attributes && knownAttribute !== attrName) {
      attributes[knownAttribute] = attributes[attrName];
      delete attributes[attrName];
    }

    for (key in attributes) {
      value = attributes[key];

      if (value !== null && (typeof value === 'undefined' ? 'undefined' : _typeof(value)) === 'object') {
        property = type.attributes[key];

        if (property !== undefined) {
          value.targetProperty = property.name;
        } else {
          value.targetProperty = key;
        }
      }
    }
  };

  return ViewCompiler;
}()) || _class14);

var ResourceModule = function () {
  function ResourceModule(moduleId) {
    

    this.id = moduleId;
    this.moduleInstance = null;
    this.mainResource = null;
    this.resources = null;
    this.viewStrategy = null;
    this.isInitialized = false;
    this.onLoaded = null;
    this.loadContext = null;
  }

  ResourceModule.prototype.initialize = function initialize(container) {
    var current = this.mainResource;
    var resources = this.resources;
    var vs = this.viewStrategy;

    if (this.isInitialized) {
      return;
    }

    this.isInitialized = true;

    if (current !== undefined) {
      current.metadata.viewStrategy = vs;
      current.initialize(container);
    }

    for (var i = 0, ii = resources.length; i < ii; ++i) {
      current = resources[i];
      current.metadata.viewStrategy = vs;
      current.initialize(container);
    }
  };

  ResourceModule.prototype.register = function register(registry, name) {
    var main = this.mainResource;
    var resources = this.resources;

    if (main !== undefined) {
      main.register(registry, name);
      name = null;
    }

    for (var i = 0, ii = resources.length; i < ii; ++i) {
      resources[i].register(registry, name);
      name = null;
    }
  };

  ResourceModule.prototype.load = function load(container, loadContext) {
    if (this.onLoaded !== null) {
      return this.loadContext === loadContext ? Promise.resolve() : this.onLoaded;
    }

    var main = this.mainResource;
    var resources = this.resources;
    var loads = void 0;

    if (main !== undefined) {
      loads = new Array(resources.length + 1);
      loads[0] = main.load(container, loadContext);
      for (var i = 0, ii = resources.length; i < ii; ++i) {
        loads[i + 1] = resources[i].load(container, loadContext);
      }
    } else {
      loads = new Array(resources.length);
      for (var _i2 = 0, _ii = resources.length; _i2 < _ii; ++_i2) {
        loads[_i2] = resources[_i2].load(container, loadContext);
      }
    }

    this.loadContext = loadContext;
    this.onLoaded = Promise.all(loads);
    return this.onLoaded;
  };

  return ResourceModule;
}();

var ResourceDescription = function () {
  function ResourceDescription(key, exportedValue, resourceTypeMeta) {
    

    if (!resourceTypeMeta) {
      resourceTypeMeta = __WEBPACK_IMPORTED_MODULE_1_aurelia_metadata__["a" /* metadata */].get(__WEBPACK_IMPORTED_MODULE_1_aurelia_metadata__["a" /* metadata */].resource, exportedValue);

      if (!resourceTypeMeta) {
        resourceTypeMeta = new HtmlBehaviorResource();
        resourceTypeMeta.elementName = _hyphenate(key);
        __WEBPACK_IMPORTED_MODULE_1_aurelia_metadata__["a" /* metadata */].define(__WEBPACK_IMPORTED_MODULE_1_aurelia_metadata__["a" /* metadata */].resource, resourceTypeMeta, exportedValue);
      }
    }

    if (resourceTypeMeta instanceof HtmlBehaviorResource) {
      if (resourceTypeMeta.elementName === undefined) {
        resourceTypeMeta.elementName = _hyphenate(key);
      } else if (resourceTypeMeta.attributeName === undefined) {
        resourceTypeMeta.attributeName = _hyphenate(key);
      } else if (resourceTypeMeta.attributeName === null && resourceTypeMeta.elementName === null) {
        HtmlBehaviorResource.convention(key, resourceTypeMeta);
      }
    } else if (!resourceTypeMeta.name) {
      resourceTypeMeta.name = _hyphenate(key);
    }

    this.metadata = resourceTypeMeta;
    this.value = exportedValue;
  }

  ResourceDescription.prototype.initialize = function initialize(container) {
    this.metadata.initialize(container, this.value);
  };

  ResourceDescription.prototype.register = function register(registry, name) {
    this.metadata.register(registry, name);
  };

  ResourceDescription.prototype.load = function load(container, loadContext) {
    return this.metadata.load(container, this.value, loadContext);
  };

  return ResourceDescription;
}();

var ModuleAnalyzer = function () {
  function ModuleAnalyzer() {
    

    this.cache = Object.create(null);
  }

  ModuleAnalyzer.prototype.getAnalysis = function getAnalysis(moduleId) {
    return this.cache[moduleId];
  };

  ModuleAnalyzer.prototype.analyze = function analyze(moduleId, moduleInstance, mainResourceKey) {
    var mainResource = void 0;
    var fallbackValue = void 0;
    var fallbackKey = void 0;
    var resourceTypeMeta = void 0;
    var key = void 0;
    var exportedValue = void 0;
    var resources = [];
    var conventional = void 0;
    var vs = void 0;
    var resourceModule = void 0;

    resourceModule = this.cache[moduleId];
    if (resourceModule) {
      return resourceModule;
    }

    resourceModule = new ResourceModule(moduleId);
    this.cache[moduleId] = resourceModule;

    if (typeof moduleInstance === 'function') {
      moduleInstance = { 'default': moduleInstance };
    }

    if (mainResourceKey) {
      mainResource = new ResourceDescription(mainResourceKey, moduleInstance[mainResourceKey]);
    }

    for (key in moduleInstance) {
      exportedValue = moduleInstance[key];

      if (key === mainResourceKey || typeof exportedValue !== 'function') {
        continue;
      }

      resourceTypeMeta = __WEBPACK_IMPORTED_MODULE_1_aurelia_metadata__["a" /* metadata */].get(__WEBPACK_IMPORTED_MODULE_1_aurelia_metadata__["a" /* metadata */].resource, exportedValue);

      if (resourceTypeMeta) {
        if (resourceTypeMeta instanceof HtmlBehaviorResource) {
          ViewResources.convention(exportedValue, resourceTypeMeta);

          if (resourceTypeMeta.attributeName === null && resourceTypeMeta.elementName === null) {
            HtmlBehaviorResource.convention(key, resourceTypeMeta);
          }

          if (resourceTypeMeta.attributeName === null && resourceTypeMeta.elementName === null) {
            resourceTypeMeta.elementName = _hyphenate(key);
          }
        }

        if (!mainResource && resourceTypeMeta instanceof HtmlBehaviorResource && resourceTypeMeta.elementName !== null) {
          mainResource = new ResourceDescription(key, exportedValue, resourceTypeMeta);
        } else {
          resources.push(new ResourceDescription(key, exportedValue, resourceTypeMeta));
        }
      } else if (viewStrategy.decorates(exportedValue)) {
        vs = exportedValue;
      } else if (exportedValue instanceof __WEBPACK_IMPORTED_MODULE_3_aurelia_loader__["b" /* TemplateRegistryEntry */]) {
        vs = new TemplateRegistryViewStrategy(moduleId, exportedValue);
      } else {
        if (conventional = ViewResources.convention(exportedValue)) {
          if (conventional.elementName !== null && !mainResource) {
            mainResource = new ResourceDescription(key, exportedValue, conventional);
          } else {
            resources.push(new ResourceDescription(key, exportedValue, conventional));
          }
          __WEBPACK_IMPORTED_MODULE_1_aurelia_metadata__["a" /* metadata */].define(__WEBPACK_IMPORTED_MODULE_1_aurelia_metadata__["a" /* metadata */].resource, conventional, exportedValue);
        } else if (conventional = HtmlBehaviorResource.convention(key)) {
          if (conventional.elementName !== null && !mainResource) {
            mainResource = new ResourceDescription(key, exportedValue, conventional);
          } else {
            resources.push(new ResourceDescription(key, exportedValue, conventional));
          }

          __WEBPACK_IMPORTED_MODULE_1_aurelia_metadata__["a" /* metadata */].define(__WEBPACK_IMPORTED_MODULE_1_aurelia_metadata__["a" /* metadata */].resource, conventional, exportedValue);
        } else if (conventional = __WEBPACK_IMPORTED_MODULE_5_aurelia_binding__["a" /* ValueConverterResource */].convention(key) || __WEBPACK_IMPORTED_MODULE_5_aurelia_binding__["c" /* BindingBehaviorResource */].convention(key) || ViewEngineHooksResource.convention(key)) {
          resources.push(new ResourceDescription(key, exportedValue, conventional));
          __WEBPACK_IMPORTED_MODULE_1_aurelia_metadata__["a" /* metadata */].define(__WEBPACK_IMPORTED_MODULE_1_aurelia_metadata__["a" /* metadata */].resource, conventional, exportedValue);
        } else if (!fallbackValue) {
          fallbackValue = exportedValue;
          fallbackKey = key;
        }
      }
    }

    if (!mainResource && fallbackValue) {
      mainResource = new ResourceDescription(fallbackKey, fallbackValue);
    }

    resourceModule.moduleInstance = moduleInstance;
    resourceModule.mainResource = mainResource;
    resourceModule.resources = resources;
    resourceModule.viewStrategy = vs;

    return resourceModule;
  };

  return ModuleAnalyzer;
}();

var logger = __WEBPACK_IMPORTED_MODULE_0_aurelia_logging__["getLogger"]('templating');

function ensureRegistryEntry(loader, urlOrRegistryEntry) {
  if (urlOrRegistryEntry instanceof __WEBPACK_IMPORTED_MODULE_3_aurelia_loader__["b" /* TemplateRegistryEntry */]) {
    return Promise.resolve(urlOrRegistryEntry);
  }

  return loader.loadTemplate(urlOrRegistryEntry);
}

var ProxyViewFactory = function () {
  function ProxyViewFactory(promise) {
    var _this8 = this;

    

    promise.then(function (x) {
      return _this8.viewFactory = x;
    });
  }

  ProxyViewFactory.prototype.create = function create(container, bindingContext, createInstruction, element) {
    return this.viewFactory.create(container, bindingContext, createInstruction, element);
  };

  ProxyViewFactory.prototype.setCacheSize = function setCacheSize(size, doNotOverrideIfAlreadySet) {
    this.viewFactory.setCacheSize(size, doNotOverrideIfAlreadySet);
  };

  ProxyViewFactory.prototype.getCachedView = function getCachedView() {
    return this.viewFactory.getCachedView();
  };

  ProxyViewFactory.prototype.returnViewToCache = function returnViewToCache(view) {
    this.viewFactory.returnViewToCache(view);
  };

  _createClass(ProxyViewFactory, [{
    key: 'isCaching',
    get: function get() {
      return this.viewFactory.isCaching;
    }
  }]);

  return ProxyViewFactory;
}();

var auSlotBehavior = null;

var ViewEngine = (_dec8 = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_6_aurelia_dependency_injection__["c" /* inject */])(__WEBPACK_IMPORTED_MODULE_3_aurelia_loader__["a" /* Loader */], __WEBPACK_IMPORTED_MODULE_6_aurelia_dependency_injection__["a" /* Container */], ViewCompiler, ModuleAnalyzer, ViewResources), _dec8(_class15 = (_temp5 = _class16 = function () {
  function ViewEngine(loader, container, viewCompiler, moduleAnalyzer, appResources) {
    

    this.loader = loader;
    this.container = container;
    this.viewCompiler = viewCompiler;
    this.moduleAnalyzer = moduleAnalyzer;
    this.appResources = appResources;
    this._pluginMap = {};

    if (auSlotBehavior === null) {
      auSlotBehavior = new HtmlBehaviorResource();
      auSlotBehavior.attributeName = 'au-slot';
      __WEBPACK_IMPORTED_MODULE_1_aurelia_metadata__["a" /* metadata */].define(__WEBPACK_IMPORTED_MODULE_1_aurelia_metadata__["a" /* metadata */].resource, auSlotBehavior, SlotCustomAttribute);
    }

    auSlotBehavior.initialize(container, SlotCustomAttribute);
    auSlotBehavior.register(appResources);
  }

  ViewEngine.prototype.addResourcePlugin = function addResourcePlugin(extension, implementation) {
    var name = extension.replace('.', '') + '-resource-plugin';
    this._pluginMap[extension] = name;
    this.loader.addPlugin(name, implementation);
  };

  ViewEngine.prototype.loadViewFactory = function loadViewFactory(urlOrRegistryEntry, compileInstruction, loadContext, target) {
    var _this9 = this;

    loadContext = loadContext || new ResourceLoadContext();

    return ensureRegistryEntry(this.loader, urlOrRegistryEntry).then(function (registryEntry) {
      var url = registryEntry.address;

      if (registryEntry.onReady) {
        if (!loadContext.hasDependency(url)) {
          loadContext.addDependency(url);
          return registryEntry.onReady;
        }

        if (registryEntry.template === null) {
          return registryEntry.onReady;
        }

        return Promise.resolve(new ProxyViewFactory(registryEntry.onReady));
      }

      loadContext.addDependency(url);

      registryEntry.onReady = _this9.loadTemplateResources(registryEntry, compileInstruction, loadContext, target).then(function (resources) {
        registryEntry.resources = resources;

        if (registryEntry.template === null) {
          return registryEntry.factory = null;
        }

        var viewFactory = _this9.viewCompiler.compile(registryEntry.template, resources, compileInstruction);
        return registryEntry.factory = viewFactory;
      });

      return registryEntry.onReady;
    });
  };

  ViewEngine.prototype.loadTemplateResources = function loadTemplateResources(registryEntry, compileInstruction, loadContext, target) {
    var resources = new ViewResources(this.appResources, registryEntry.address);
    var dependencies = registryEntry.dependencies;
    var importIds = void 0;
    var names = void 0;

    compileInstruction = compileInstruction || ViewCompileInstruction.normal;

    if (dependencies.length === 0 && !compileInstruction.associatedModuleId) {
      return Promise.resolve(resources);
    }

    importIds = dependencies.map(function (x) {
      return x.src;
    });
    names = dependencies.map(function (x) {
      return x.name;
    });
    logger.debug('importing resources for ' + registryEntry.address, importIds);

    if (target) {
      var viewModelRequires = __WEBPACK_IMPORTED_MODULE_1_aurelia_metadata__["a" /* metadata */].get(ViewEngine.viewModelRequireMetadataKey, target);
      if (viewModelRequires) {
        var templateImportCount = importIds.length;
        for (var i = 0, ii = viewModelRequires.length; i < ii; ++i) {
          var req = viewModelRequires[i];
          var importId = typeof req === 'function' ? __WEBPACK_IMPORTED_MODULE_1_aurelia_metadata__["c" /* Origin */].get(req).moduleId : __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_4_aurelia_path__["a" /* relativeToFile */])(req.src || req, registryEntry.address);

          if (importIds.indexOf(importId) === -1) {
            importIds.push(importId);
            names.push(req.as);
          }
        }
        logger.debug('importing ViewModel resources for ' + compileInstruction.associatedModuleId, importIds.slice(templateImportCount));
      }
    }

    return this.importViewResources(importIds, names, resources, compileInstruction, loadContext);
  };

  ViewEngine.prototype.importViewModelResource = function importViewModelResource(moduleImport, moduleMember) {
    var _this10 = this;

    return this.loader.loadModule(moduleImport).then(function (viewModelModule) {
      var normalizedId = __WEBPACK_IMPORTED_MODULE_1_aurelia_metadata__["c" /* Origin */].get(viewModelModule).moduleId;
      var resourceModule = _this10.moduleAnalyzer.analyze(normalizedId, viewModelModule, moduleMember);

      if (!resourceModule.mainResource) {
        throw new Error('No view model found in module "' + moduleImport + '".');
      }

      resourceModule.initialize(_this10.container);

      return resourceModule.mainResource;
    });
  };

  ViewEngine.prototype.importViewResources = function importViewResources(moduleIds, names, resources, compileInstruction, loadContext) {
    var _this11 = this;

    loadContext = loadContext || new ResourceLoadContext();
    compileInstruction = compileInstruction || ViewCompileInstruction.normal;

    moduleIds = moduleIds.map(function (x) {
      return _this11._applyLoaderPlugin(x);
    });

    return this.loader.loadAllModules(moduleIds).then(function (imports) {
      var i = void 0;
      var ii = void 0;
      var analysis = void 0;
      var normalizedId = void 0;
      var current = void 0;
      var associatedModule = void 0;
      var container = _this11.container;
      var moduleAnalyzer = _this11.moduleAnalyzer;
      var allAnalysis = new Array(imports.length);

      for (i = 0, ii = imports.length; i < ii; ++i) {
        current = imports[i];
        normalizedId = __WEBPACK_IMPORTED_MODULE_1_aurelia_metadata__["c" /* Origin */].get(current).moduleId;

        analysis = moduleAnalyzer.analyze(normalizedId, current);
        analysis.initialize(container);
        analysis.register(resources, names[i]);

        allAnalysis[i] = analysis;
      }

      if (compileInstruction.associatedModuleId) {
        associatedModule = moduleAnalyzer.getAnalysis(compileInstruction.associatedModuleId);

        if (associatedModule) {
          associatedModule.register(resources);
        }
      }

      for (i = 0, ii = allAnalysis.length; i < ii; ++i) {
        allAnalysis[i] = allAnalysis[i].load(container, loadContext);
      }

      return Promise.all(allAnalysis).then(function () {
        return resources;
      });
    });
  };

  ViewEngine.prototype._applyLoaderPlugin = function _applyLoaderPlugin(id) {
    var index = id.lastIndexOf('.');
    if (index !== -1) {
      var ext = id.substring(index);
      var pluginName = this._pluginMap[ext];

      if (pluginName === undefined) {
        return id;
      }

      return this.loader.applyPluginToUrl(id, pluginName);
    }

    return id;
  };

  return ViewEngine;
}(), _class16.viewModelRequireMetadataKey = 'aurelia:view-model-require', _temp5)) || _class15);

var Controller = function () {
  function Controller(behavior, instruction, viewModel, container) {
    

    this.behavior = behavior;
    this.instruction = instruction;
    this.viewModel = viewModel;
    this.isAttached = false;
    this.view = null;
    this.isBound = false;
    this.scope = null;
    this.container = container;
    this.elementEvents = container.elementEvents || null;

    var observerLookup = behavior.observerLocator.getOrCreateObserversLookup(viewModel);
    var handlesBind = behavior.handlesBind;
    var attributes = instruction.attributes;
    var boundProperties = this.boundProperties = [];
    var properties = behavior.properties;
    var i = void 0;
    var ii = void 0;

    behavior._ensurePropertiesDefined(viewModel, observerLookup);

    for (i = 0, ii = properties.length; i < ii; ++i) {
      properties[i]._initialize(viewModel, observerLookup, attributes, handlesBind, boundProperties);
    }
  }

  Controller.prototype.created = function created(owningView) {
    if (this.behavior.handlesCreated) {
      this.viewModel.created(owningView, this.view);
    }
  };

  Controller.prototype.automate = function automate(overrideContext, owningView) {
    this.view.bindingContext = this.viewModel;
    this.view.overrideContext = overrideContext || __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_5_aurelia_binding__["d" /* createOverrideContext */])(this.viewModel);
    this.view._isUserControlled = true;

    if (this.behavior.handlesCreated) {
      this.viewModel.created(owningView || null, this.view);
    }

    this.bind(this.view);
  };

  Controller.prototype.bind = function bind(scope) {
    var skipSelfSubscriber = this.behavior.handlesBind;
    var boundProperties = this.boundProperties;
    var i = void 0;
    var ii = void 0;
    var x = void 0;
    var observer = void 0;
    var selfSubscriber = void 0;

    if (this.isBound) {
      if (this.scope === scope) {
        return;
      }

      this.unbind();
    }

    this.isBound = true;
    this.scope = scope;

    for (i = 0, ii = boundProperties.length; i < ii; ++i) {
      x = boundProperties[i];
      observer = x.observer;
      selfSubscriber = observer.selfSubscriber;
      observer.publishing = false;

      if (skipSelfSubscriber) {
        observer.selfSubscriber = null;
      }

      x.binding.bind(scope);
      observer.call();

      observer.publishing = true;
      observer.selfSubscriber = selfSubscriber;
    }

    var overrideContext = void 0;
    if (this.view !== null) {
      if (skipSelfSubscriber) {
        this.view.viewModelScope = scope;
      }

      if (this.viewModel === scope.overrideContext.bindingContext) {
        overrideContext = scope.overrideContext;
      } else if (this.instruction.inheritBindingContext) {
        overrideContext = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_5_aurelia_binding__["d" /* createOverrideContext */])(this.viewModel, scope.overrideContext);
      } else {
        overrideContext = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_5_aurelia_binding__["d" /* createOverrideContext */])(this.viewModel);
        overrideContext.__parentOverrideContext = scope.overrideContext;
      }

      this.view.bind(this.viewModel, overrideContext);
    } else if (skipSelfSubscriber) {
      overrideContext = scope.overrideContext;

      if (scope.overrideContext.__parentOverrideContext !== undefined && this.viewModel.viewFactory && this.viewModel.viewFactory.factoryCreateInstruction.partReplacements) {
        overrideContext = Object.assign({}, scope.overrideContext);
        overrideContext.parentOverrideContext = scope.overrideContext.__parentOverrideContext;
      }
      this.viewModel.bind(scope.bindingContext, overrideContext);
    }
  };

  Controller.prototype.unbind = function unbind() {
    if (this.isBound) {
      var _boundProperties = this.boundProperties;
      var _i3 = void 0;
      var _ii2 = void 0;

      this.isBound = false;
      this.scope = null;

      if (this.view !== null) {
        this.view.unbind();
      }

      if (this.behavior.handlesUnbind) {
        this.viewModel.unbind();
      }

      if (this.elementEvents !== null) {
        this.elementEvents.disposeAll();
      }

      for (_i3 = 0, _ii2 = _boundProperties.length; _i3 < _ii2; ++_i3) {
        _boundProperties[_i3].binding.unbind();
      }
    }
  };

  Controller.prototype.attached = function attached() {
    if (this.isAttached) {
      return;
    }

    this.isAttached = true;

    if (this.behavior.handlesAttached) {
      this.viewModel.attached();
    }

    if (this.view !== null) {
      this.view.attached();
    }
  };

  Controller.prototype.detached = function detached() {
    if (this.isAttached) {
      this.isAttached = false;

      if (this.view !== null) {
        this.view.detached();
      }

      if (this.behavior.handlesDetached) {
        this.viewModel.detached();
      }
    }
  };

  return Controller;
}();

var BehaviorPropertyObserver = (_dec9 = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_5_aurelia_binding__["e" /* subscriberCollection */])(), _dec9(_class17 = function () {
  function BehaviorPropertyObserver(taskQueue, obj, propertyName, selfSubscriber, initialValue) {
    

    this.taskQueue = taskQueue;
    this.obj = obj;
    this.propertyName = propertyName;
    this.notqueued = true;
    this.publishing = false;
    this.selfSubscriber = selfSubscriber;
    this.currentValue = this.oldValue = initialValue;
  }

  BehaviorPropertyObserver.prototype.getValue = function getValue() {
    return this.currentValue;
  };

  BehaviorPropertyObserver.prototype.setValue = function setValue(newValue) {
    var oldValue = this.currentValue;

    if (!Object.is(newValue, oldValue)) {
      this.oldValue = oldValue;
      this.currentValue = newValue;

      if (this.publishing && this.notqueued) {
        if (this.taskQueue.flushing) {
          this.call();
        } else {
          this.notqueued = false;
          this.taskQueue.queueMicroTask(this);
        }
      }
    }
  };

  BehaviorPropertyObserver.prototype.call = function call() {
    var oldValue = this.oldValue;
    var newValue = this.currentValue;

    this.notqueued = true;

    if (Object.is(newValue, oldValue)) {
      return;
    }

    if (this.selfSubscriber) {
      this.selfSubscriber(newValue, oldValue);
    }

    this.callSubscribers(newValue, oldValue);
    this.oldValue = newValue;
  };

  BehaviorPropertyObserver.prototype.subscribe = function subscribe(context, callable) {
    this.addSubscriber(context, callable);
  };

  BehaviorPropertyObserver.prototype.unsubscribe = function unsubscribe(context, callable) {
    this.removeSubscriber(context, callable);
  };

  return BehaviorPropertyObserver;
}()) || _class17);

function getObserver(instance, name) {
  var lookup = instance.__observers__;

  if (lookup === undefined) {
    var ctor = Object.getPrototypeOf(instance).constructor;
    var _behavior = __WEBPACK_IMPORTED_MODULE_1_aurelia_metadata__["a" /* metadata */].get(__WEBPACK_IMPORTED_MODULE_1_aurelia_metadata__["a" /* metadata */].resource, ctor);
    if (!_behavior.isInitialized) {
      _behavior.initialize(__WEBPACK_IMPORTED_MODULE_6_aurelia_dependency_injection__["a" /* Container */].instance || new __WEBPACK_IMPORTED_MODULE_6_aurelia_dependency_injection__["a" /* Container */](), instance.constructor);
    }

    lookup = _behavior.observerLocator.getOrCreateObserversLookup(instance);
    _behavior._ensurePropertiesDefined(instance, lookup);
  }

  return lookup[name];
}

var BindableProperty = function () {
  function BindableProperty(nameOrConfig) {
    

    if (typeof nameOrConfig === 'string') {
      this.name = nameOrConfig;
    } else {
      Object.assign(this, nameOrConfig);
    }

    this.attribute = this.attribute || _hyphenate(this.name);
    var defaultBindingMode = this.defaultBindingMode;
    if (defaultBindingMode === null || defaultBindingMode === undefined) {
      this.defaultBindingMode = __WEBPACK_IMPORTED_MODULE_5_aurelia_binding__["f" /* bindingMode */].oneWay;
    } else if (typeof defaultBindingMode === 'string') {
      this.defaultBindingMode = __WEBPACK_IMPORTED_MODULE_5_aurelia_binding__["f" /* bindingMode */][defaultBindingMode] || __WEBPACK_IMPORTED_MODULE_5_aurelia_binding__["f" /* bindingMode */].oneWay;
    }
    this.changeHandler = this.changeHandler || null;
    this.owner = null;
    this.descriptor = null;
  }

  BindableProperty.prototype.registerWith = function registerWith(target, behavior, descriptor) {
    behavior.properties.push(this);
    behavior.attributes[this.attribute] = this;
    this.owner = behavior;

    if (descriptor) {
      this.descriptor = descriptor;
      return this._configureDescriptor(descriptor);
    }

    return undefined;
  };

  BindableProperty.prototype._configureDescriptor = function _configureDescriptor(descriptor) {
    var name = this.name;

    descriptor.configurable = true;
    descriptor.enumerable = true;

    if ('initializer' in descriptor) {
      this.defaultValue = descriptor.initializer;
      delete descriptor.initializer;
      delete descriptor.writable;
    }

    if ('value' in descriptor) {
      this.defaultValue = descriptor.value;
      delete descriptor.value;
      delete descriptor.writable;
    }

    descriptor.get = function () {
      return getObserver(this, name).getValue();
    };

    descriptor.set = function (value) {
      getObserver(this, name).setValue(value);
    };

    descriptor.get.getObserver = function (obj) {
      return getObserver(obj, name);
    };

    return descriptor;
  };

  BindableProperty.prototype.defineOn = function defineOn(target, behavior) {
    var name = this.name;
    var handlerName = void 0;

    if (this.changeHandler === null) {
      handlerName = name + 'Changed';
      if (handlerName in target.prototype) {
        this.changeHandler = handlerName;
      }
    }

    if (this.descriptor === null) {
      Object.defineProperty(target.prototype, name, this._configureDescriptor(behavior, {}));
    }
  };

  BindableProperty.prototype.createObserver = function createObserver(viewModel) {
    var selfSubscriber = null;
    var defaultValue = this.defaultValue;
    var changeHandlerName = this.changeHandler;
    var name = this.name;
    var initialValue = void 0;

    if (this.hasOptions) {
      return undefined;
    }

    if (changeHandlerName in viewModel) {
      if ('propertyChanged' in viewModel) {
        selfSubscriber = function selfSubscriber(newValue, oldValue) {
          viewModel[changeHandlerName](newValue, oldValue);
          viewModel.propertyChanged(name, newValue, oldValue);
        };
      } else {
        selfSubscriber = function selfSubscriber(newValue, oldValue) {
          return viewModel[changeHandlerName](newValue, oldValue);
        };
      }
    } else if ('propertyChanged' in viewModel) {
      selfSubscriber = function selfSubscriber(newValue, oldValue) {
        return viewModel.propertyChanged(name, newValue, oldValue);
      };
    } else if (changeHandlerName !== null) {
      throw new Error('Change handler ' + changeHandlerName + ' was specified but not declared on the class.');
    }

    if (defaultValue !== undefined) {
      initialValue = typeof defaultValue === 'function' ? defaultValue.call(viewModel) : defaultValue;
    }

    return new BehaviorPropertyObserver(this.owner.taskQueue, viewModel, this.name, selfSubscriber, initialValue);
  };

  BindableProperty.prototype._initialize = function _initialize(viewModel, observerLookup, attributes, behaviorHandlesBind, boundProperties) {
    var selfSubscriber = void 0;
    var observer = void 0;
    var attribute = void 0;
    var defaultValue = this.defaultValue;

    if (this.isDynamic) {
      for (var _key6 in attributes) {
        this._createDynamicProperty(viewModel, observerLookup, behaviorHandlesBind, _key6, attributes[_key6], boundProperties);
      }
    } else if (!this.hasOptions) {
      observer = observerLookup[this.name];

      if (attributes !== null) {
        selfSubscriber = observer.selfSubscriber;
        attribute = attributes[this.attribute];

        if (behaviorHandlesBind) {
          observer.selfSubscriber = null;
        }

        if (typeof attribute === 'string') {
          viewModel[this.name] = attribute;
          observer.call();
        } else if (attribute) {
          boundProperties.push({ observer: observer, binding: attribute.createBinding(viewModel) });
        } else if (defaultValue !== undefined) {
          observer.call();
        }

        observer.selfSubscriber = selfSubscriber;
      }

      observer.publishing = true;
    }
  };

  BindableProperty.prototype._createDynamicProperty = function _createDynamicProperty(viewModel, observerLookup, behaviorHandlesBind, name, attribute, boundProperties) {
    var changeHandlerName = name + 'Changed';
    var selfSubscriber = null;
    var observer = void 0;
    var info = void 0;

    if (changeHandlerName in viewModel) {
      if ('propertyChanged' in viewModel) {
        selfSubscriber = function selfSubscriber(newValue, oldValue) {
          viewModel[changeHandlerName](newValue, oldValue);
          viewModel.propertyChanged(name, newValue, oldValue);
        };
      } else {
        selfSubscriber = function selfSubscriber(newValue, oldValue) {
          return viewModel[changeHandlerName](newValue, oldValue);
        };
      }
    } else if ('propertyChanged' in viewModel) {
      selfSubscriber = function selfSubscriber(newValue, oldValue) {
        return viewModel.propertyChanged(name, newValue, oldValue);
      };
    }

    observer = observerLookup[name] = new BehaviorPropertyObserver(this.owner.taskQueue, viewModel, name, selfSubscriber);

    Object.defineProperty(viewModel, name, {
      configurable: true,
      enumerable: true,
      get: observer.getValue.bind(observer),
      set: observer.setValue.bind(observer)
    });

    if (behaviorHandlesBind) {
      observer.selfSubscriber = null;
    }

    if (typeof attribute === 'string') {
      viewModel[name] = attribute;
      observer.call();
    } else if (attribute) {
      info = { observer: observer, binding: attribute.createBinding(viewModel) };
      boundProperties.push(info);
    }

    observer.publishing = true;
    observer.selfSubscriber = selfSubscriber;
  };

  return BindableProperty;
}();

var lastProviderId = 0;

function nextProviderId() {
  return ++lastProviderId;
}

function doProcessContent() {
  return true;
}
function doProcessAttributes() {}

var HtmlBehaviorResource = function () {
  function HtmlBehaviorResource() {
    

    this.elementName = null;
    this.attributeName = null;
    this.attributeDefaultBindingMode = undefined;
    this.liftsContent = false;
    this.targetShadowDOM = false;
    this.shadowDOMOptions = null;
    this.processAttributes = doProcessAttributes;
    this.processContent = doProcessContent;
    this.usesShadowDOM = false;
    this.childBindings = null;
    this.hasDynamicOptions = false;
    this.containerless = false;
    this.properties = [];
    this.attributes = {};
    this.isInitialized = false;
    this.primaryProperty = null;
  }

  HtmlBehaviorResource.convention = function convention(name, existing) {
    var behavior = void 0;

    if (name.endsWith('CustomAttribute')) {
      behavior = existing || new HtmlBehaviorResource();
      behavior.attributeName = _hyphenate(name.substring(0, name.length - 15));
    }

    if (name.endsWith('CustomElement')) {
      behavior = existing || new HtmlBehaviorResource();
      behavior.elementName = _hyphenate(name.substring(0, name.length - 13));
    }

    return behavior;
  };

  HtmlBehaviorResource.prototype.addChildBinding = function addChildBinding(behavior) {
    if (this.childBindings === null) {
      this.childBindings = [];
    }

    this.childBindings.push(behavior);
  };

  HtmlBehaviorResource.prototype.initialize = function initialize(container, target) {
    var proto = target.prototype;
    var properties = this.properties;
    var attributeName = this.attributeName;
    var attributeDefaultBindingMode = this.attributeDefaultBindingMode;
    var i = void 0;
    var ii = void 0;
    var current = void 0;

    if (this.isInitialized) {
      return;
    }

    this.isInitialized = true;
    target.__providerId__ = nextProviderId();

    this.observerLocator = container.get(__WEBPACK_IMPORTED_MODULE_5_aurelia_binding__["g" /* ObserverLocator */]);
    this.taskQueue = container.get(__WEBPACK_IMPORTED_MODULE_7_aurelia_task_queue__["a" /* TaskQueue */]);

    this.target = target;
    this.usesShadowDOM = this.targetShadowDOM && __WEBPACK_IMPORTED_MODULE_2_aurelia_pal__["d" /* FEATURE */].shadowDOM;
    this.handlesCreated = 'created' in proto;
    this.handlesBind = 'bind' in proto;
    this.handlesUnbind = 'unbind' in proto;
    this.handlesAttached = 'attached' in proto;
    this.handlesDetached = 'detached' in proto;
    this.htmlName = this.elementName || this.attributeName;

    if (attributeName !== null) {
      if (properties.length === 0) {
        new BindableProperty({
          name: 'value',
          changeHandler: 'valueChanged' in proto ? 'valueChanged' : null,
          attribute: attributeName,
          defaultBindingMode: attributeDefaultBindingMode
        }).registerWith(target, this);
      }

      current = properties[0];

      if (properties.length === 1 && current.name === 'value') {
        current.isDynamic = current.hasOptions = this.hasDynamicOptions;
        current.defineOn(target, this);
      } else {
        for (i = 0, ii = properties.length; i < ii; ++i) {
          properties[i].defineOn(target, this);
          if (properties[i].primaryProperty) {
            if (this.primaryProperty) {
              throw new Error('Only one bindable property on a custom element can be defined as the default');
            }
            this.primaryProperty = properties[i];
          }
        }

        current = new BindableProperty({
          name: 'value',
          changeHandler: 'valueChanged' in proto ? 'valueChanged' : null,
          attribute: attributeName,
          defaultBindingMode: attributeDefaultBindingMode
        });

        current.hasOptions = true;
        current.registerWith(target, this);
      }
    } else {
      for (i = 0, ii = properties.length; i < ii; ++i) {
        properties[i].defineOn(target, this);
      }

      this._copyInheritedProperties(container, target);
    }
  };

  HtmlBehaviorResource.prototype.register = function register(registry, name) {
    var _this12 = this;

    if (this.attributeName !== null) {
      registry.registerAttribute(name || this.attributeName, this, this.attributeName);

      if (Array.isArray(this.aliases)) {
        this.aliases.forEach(function (alias) {
          registry.registerAttribute(alias, _this12, _this12.attributeName);
        });
      }
    }

    if (this.elementName !== null) {
      registry.registerElement(name || this.elementName, this);
    }
  };

  HtmlBehaviorResource.prototype.load = function load(container, target, loadContext, viewStrategy, transientView) {
    var _this13 = this;

    var options = void 0;

    if (this.elementName !== null) {
      viewStrategy = container.get(ViewLocator).getViewStrategy(viewStrategy || this.viewStrategy || target);
      options = new ViewCompileInstruction(this.targetShadowDOM, true);

      if (!viewStrategy.moduleId) {
        viewStrategy.moduleId = __WEBPACK_IMPORTED_MODULE_1_aurelia_metadata__["c" /* Origin */].get(target).moduleId;
      }

      return viewStrategy.loadViewFactory(container.get(ViewEngine), options, loadContext, target).then(function (viewFactory) {
        if (!transientView || !_this13.viewFactory) {
          _this13.viewFactory = viewFactory;
        }

        return viewFactory;
      });
    }

    return Promise.resolve(this);
  };

  HtmlBehaviorResource.prototype.compile = function compile(compiler, resources, node, instruction, parentNode) {
    if (this.liftsContent) {
      if (!instruction.viewFactory) {
        var _template = __WEBPACK_IMPORTED_MODULE_2_aurelia_pal__["c" /* DOM */].createElement('template');
        var fragment = __WEBPACK_IMPORTED_MODULE_2_aurelia_pal__["c" /* DOM */].createDocumentFragment();
        var cacheSize = node.getAttribute('view-cache');
        var part = node.getAttribute('part');

        node.removeAttribute(instruction.originalAttrName);
        __WEBPACK_IMPORTED_MODULE_2_aurelia_pal__["c" /* DOM */].replaceNode(_template, node, parentNode);
        fragment.appendChild(node);
        instruction.viewFactory = compiler.compile(fragment, resources);

        if (part) {
          instruction.viewFactory.part = part;
          node.removeAttribute('part');
        }

        if (cacheSize) {
          instruction.viewFactory.setCacheSize(cacheSize);
          node.removeAttribute('view-cache');
        }

        node = _template;
      }
    } else if (this.elementName !== null) {
      var _partReplacements2 = {};

      if (this.processContent(compiler, resources, node, instruction) && node.hasChildNodes()) {
        var currentChild = node.firstChild;
        var contentElement = this.usesShadowDOM ? null : __WEBPACK_IMPORTED_MODULE_2_aurelia_pal__["c" /* DOM */].createElement('au-content');
        var nextSibling = void 0;
        var toReplace = void 0;

        while (currentChild) {
          nextSibling = currentChild.nextSibling;

          if (currentChild.tagName === 'TEMPLATE' && (toReplace = currentChild.getAttribute('replace-part'))) {
            _partReplacements2[toReplace] = compiler.compile(currentChild, resources);
            __WEBPACK_IMPORTED_MODULE_2_aurelia_pal__["c" /* DOM */].removeNode(currentChild, parentNode);
            instruction.partReplacements = _partReplacements2;
          } else if (contentElement !== null) {
            if (currentChild.nodeType === 3 && _isAllWhitespace(currentChild)) {
              __WEBPACK_IMPORTED_MODULE_2_aurelia_pal__["c" /* DOM */].removeNode(currentChild, parentNode);
            } else {
              contentElement.appendChild(currentChild);
            }
          }

          currentChild = nextSibling;
        }

        if (contentElement !== null && contentElement.hasChildNodes()) {
          node.appendChild(contentElement);
        }

        instruction.skipContentProcessing = false;
      } else {
        instruction.skipContentProcessing = true;
      }
    } else if (!this.processContent(compiler, resources, node, instruction)) {
      instruction.skipContentProcessing = true;
    }

    return node;
  };

  HtmlBehaviorResource.prototype.create = function create(container, instruction, element, bindings) {
    var viewHost = void 0;
    var au = null;

    instruction = instruction || BehaviorInstruction.normal;
    element = element || null;
    bindings = bindings || null;

    if (this.elementName !== null && element) {
      if (this.usesShadowDOM) {
        viewHost = element.attachShadow(this.shadowDOMOptions);
        container.registerInstance(__WEBPACK_IMPORTED_MODULE_2_aurelia_pal__["c" /* DOM */].boundary, viewHost);
      } else {
        viewHost = element;
        if (this.targetShadowDOM) {
          container.registerInstance(__WEBPACK_IMPORTED_MODULE_2_aurelia_pal__["c" /* DOM */].boundary, viewHost);
        }
      }
    }

    if (element !== null) {
      element.au = au = element.au || {};
    }

    var viewModel = instruction.viewModel || container.get(this.target);
    var controller = new Controller(this, instruction, viewModel, container);
    var childBindings = this.childBindings;
    var viewFactory = void 0;

    if (this.liftsContent) {
      au.controller = controller;
    } else if (this.elementName !== null) {
      viewFactory = instruction.viewFactory || this.viewFactory;
      container.viewModel = viewModel;

      if (viewFactory) {
        controller.view = viewFactory.create(container, instruction, element);
      }

      if (element !== null) {
        au.controller = controller;

        if (controller.view) {
          if (!this.usesShadowDOM && (element.childNodes.length === 1 || element.contentElement)) {
            var contentElement = element.childNodes[0] || element.contentElement;
            controller.view.contentView = { fragment: contentElement };
            contentElement.parentNode && __WEBPACK_IMPORTED_MODULE_2_aurelia_pal__["c" /* DOM */].removeNode(contentElement);
          }

          if (instruction.anchorIsContainer) {
            if (childBindings !== null) {
              for (var _i4 = 0, _ii3 = childBindings.length; _i4 < _ii3; ++_i4) {
                controller.view.addBinding(childBindings[_i4].create(element, viewModel, controller));
              }
            }

            controller.view.appendNodesTo(viewHost);
          } else {
            controller.view.insertNodesBefore(viewHost);
          }
        } else if (childBindings !== null) {
          for (var _i5 = 0, _ii4 = childBindings.length; _i5 < _ii4; ++_i5) {
            bindings.push(childBindings[_i5].create(element, viewModel, controller));
          }
        }
      } else if (controller.view) {
        controller.view.controller = controller;

        if (childBindings !== null) {
          for (var _i6 = 0, _ii5 = childBindings.length; _i6 < _ii5; ++_i6) {
            controller.view.addBinding(childBindings[_i6].create(instruction.host, viewModel, controller));
          }
        }
      } else if (childBindings !== null) {
        for (var _i7 = 0, _ii6 = childBindings.length; _i7 < _ii6; ++_i7) {
          bindings.push(childBindings[_i7].create(instruction.host, viewModel, controller));
        }
      }
    } else if (childBindings !== null) {
      for (var _i8 = 0, _ii7 = childBindings.length; _i8 < _ii7; ++_i8) {
        bindings.push(childBindings[_i8].create(element, viewModel, controller));
      }
    }

    if (au !== null) {
      au[this.htmlName] = controller;
    }

    if (instruction.initiatedByBehavior && viewFactory) {
      controller.view.created();
    }

    return controller;
  };

  HtmlBehaviorResource.prototype._ensurePropertiesDefined = function _ensurePropertiesDefined(instance, lookup) {
    var properties = void 0;
    var i = void 0;
    var ii = void 0;
    var observer = void 0;

    if ('__propertiesDefined__' in lookup) {
      return;
    }

    lookup.__propertiesDefined__ = true;
    properties = this.properties;

    for (i = 0, ii = properties.length; i < ii; ++i) {
      observer = properties[i].createObserver(instance);

      if (observer !== undefined) {
        lookup[observer.propertyName] = observer;
      }
    }
  };

  HtmlBehaviorResource.prototype._copyInheritedProperties = function _copyInheritedProperties(container, target) {
    var _this14 = this;

    var behavior = void 0;
    var derived = target;

    while (true) {
      var proto = Object.getPrototypeOf(target.prototype);
      target = proto && proto.constructor;
      if (!target) {
        return;
      }
      behavior = __WEBPACK_IMPORTED_MODULE_1_aurelia_metadata__["a" /* metadata */].getOwn(__WEBPACK_IMPORTED_MODULE_1_aurelia_metadata__["a" /* metadata */].resource, target);
      if (behavior) {
        break;
      }
    }
    behavior.initialize(container, target);

    var _loop = function _loop(_i9, _ii8) {
      var prop = behavior.properties[_i9];

      if (_this14.properties.some(function (p) {
        return p.name === prop.name;
      })) {
        return 'continue';
      }

      new BindableProperty(prop).registerWith(derived, _this14);
    };

    for (var _i9 = 0, _ii8 = behavior.properties.length; _i9 < _ii8; ++_i9) {
      var _ret = _loop(_i9, _ii8);

      if (_ret === 'continue') continue;
    }
  };

  return HtmlBehaviorResource;
}();

function createChildObserverDecorator(selectorOrConfig, all) {
  return function (target, key, descriptor) {
    var actualTarget = typeof key === 'string' ? target.constructor : target;
    var r = __WEBPACK_IMPORTED_MODULE_1_aurelia_metadata__["a" /* metadata */].getOrCreateOwn(__WEBPACK_IMPORTED_MODULE_1_aurelia_metadata__["a" /* metadata */].resource, HtmlBehaviorResource, actualTarget);

    if (typeof selectorOrConfig === 'string') {
      selectorOrConfig = {
        selector: selectorOrConfig,
        name: key
      };
    }

    if (descriptor) {
      descriptor.writable = true;
      descriptor.configurable = true;
    }

    selectorOrConfig.all = all;
    r.addChildBinding(new ChildObserver(selectorOrConfig));
  };
}

function children(selectorOrConfig) {
  return createChildObserverDecorator(selectorOrConfig, true);
}

function child(selectorOrConfig) {
  return createChildObserverDecorator(selectorOrConfig, false);
}

var ChildObserver = function () {
  function ChildObserver(config) {
    

    this.name = config.name;
    this.changeHandler = config.changeHandler || this.name + 'Changed';
    this.selector = config.selector;
    this.all = config.all;
  }

  ChildObserver.prototype.create = function create(viewHost, viewModel, controller) {
    return new ChildObserverBinder(this.selector, viewHost, this.name, viewModel, controller, this.changeHandler, this.all);
  };

  return ChildObserver;
}();

var noMutations = [];

function trackMutation(groupedMutations, binder, record) {
  var mutations = groupedMutations.get(binder);

  if (!mutations) {
    mutations = [];
    groupedMutations.set(binder, mutations);
  }

  mutations.push(record);
}

function onChildChange(mutations, observer) {
  var binders = observer.binders;
  var bindersLength = binders.length;
  var groupedMutations = new Map();

  for (var _i10 = 0, _ii9 = mutations.length; _i10 < _ii9; ++_i10) {
    var record = mutations[_i10];
    var added = record.addedNodes;
    var removed = record.removedNodes;

    for (var j = 0, jj = removed.length; j < jj; ++j) {
      var _node = removed[j];
      if (_node.nodeType === 1) {
        for (var k = 0; k < bindersLength; ++k) {
          var binder = binders[k];
          if (binder.onRemove(_node)) {
            trackMutation(groupedMutations, binder, record);
          }
        }
      }
    }

    for (var _j = 0, _jj = added.length; _j < _jj; ++_j) {
      var _node2 = added[_j];
      if (_node2.nodeType === 1) {
        for (var _k = 0; _k < bindersLength; ++_k) {
          var _binder = binders[_k];
          if (_binder.onAdd(_node2)) {
            trackMutation(groupedMutations, _binder, record);
          }
        }
      }
    }
  }

  groupedMutations.forEach(function (value, key) {
    if (key.changeHandler !== null) {
      key.viewModel[key.changeHandler](value);
    }
  });
}

var ChildObserverBinder = function () {
  function ChildObserverBinder(selector, viewHost, property, viewModel, controller, changeHandler, all) {
    

    this.selector = selector;
    this.viewHost = viewHost;
    this.property = property;
    this.viewModel = viewModel;
    this.controller = controller;
    this.changeHandler = changeHandler in viewModel ? changeHandler : null;
    this.usesShadowDOM = controller.behavior.usesShadowDOM;
    this.all = all;

    if (!this.usesShadowDOM && controller.view && controller.view.contentView) {
      this.contentView = controller.view.contentView;
    } else {
      this.contentView = null;
    }
  }

  ChildObserverBinder.prototype.matches = function matches(element) {
    if (element.matches(this.selector)) {
      if (this.contentView === null) {
        return true;
      }

      var contentView = this.contentView;
      var assignedSlot = element.auAssignedSlot;

      if (assignedSlot && assignedSlot.projectFromAnchors) {
        var anchors = assignedSlot.projectFromAnchors;

        for (var _i11 = 0, _ii10 = anchors.length; _i11 < _ii10; ++_i11) {
          if (anchors[_i11].auOwnerView === contentView) {
            return true;
          }
        }

        return false;
      }

      return element.auOwnerView === contentView;
    }

    return false;
  };

  ChildObserverBinder.prototype.bind = function bind(source) {
    var viewHost = this.viewHost;
    var viewModel = this.viewModel;
    var observer = viewHost.__childObserver__;

    if (!observer) {
      observer = viewHost.__childObserver__ = __WEBPACK_IMPORTED_MODULE_2_aurelia_pal__["c" /* DOM */].createMutationObserver(onChildChange);

      var options = {
        childList: true,
        subtree: !this.usesShadowDOM
      };

      observer.observe(viewHost, options);
      observer.binders = [];
    }

    observer.binders.push(this);

    if (this.usesShadowDOM) {
      var current = viewHost.firstElementChild;

      if (this.all) {
        var items = viewModel[this.property];
        if (!items) {
          items = viewModel[this.property] = [];
        } else {
          items.splice(0);
        }

        while (current) {
          if (this.matches(current)) {
            items.push(current.au && current.au.controller ? current.au.controller.viewModel : current);
          }

          current = current.nextElementSibling;
        }

        if (this.changeHandler !== null) {
          this.viewModel[this.changeHandler](noMutations);
        }
      } else {
        while (current) {
          if (this.matches(current)) {
            var _value = current.au && current.au.controller ? current.au.controller.viewModel : current;
            this.viewModel[this.property] = _value;

            if (this.changeHandler !== null) {
              this.viewModel[this.changeHandler](_value);
            }

            break;
          }

          current = current.nextElementSibling;
        }
      }
    }
  };

  ChildObserverBinder.prototype.onRemove = function onRemove(element) {
    if (this.matches(element)) {
      var _value2 = element.au && element.au.controller ? element.au.controller.viewModel : element;

      if (this.all) {
        var items = this.viewModel[this.property] || (this.viewModel[this.property] = []);
        var index = items.indexOf(_value2);

        if (index !== -1) {
          items.splice(index, 1);
        }

        return true;
      }

      return false;
    }

    return false;
  };

  ChildObserverBinder.prototype.onAdd = function onAdd(element) {
    if (this.matches(element)) {
      var _value3 = element.au && element.au.controller ? element.au.controller.viewModel : element;

      if (this.all) {
        var items = this.viewModel[this.property] || (this.viewModel[this.property] = []);

        if (this.selector === '*') {
          items.push(_value3);
          return true;
        }

        var index = 0;
        var prev = element.previousElementSibling;

        while (prev) {
          if (this.matches(prev)) {
            index++;
          }

          prev = prev.previousElementSibling;
        }

        items.splice(index, 0, _value3);
        return true;
      }

      this.viewModel[this.property] = _value3;

      if (this.changeHandler !== null) {
        this.viewModel[this.changeHandler](_value3);
      }
    }

    return false;
  };

  ChildObserverBinder.prototype.unbind = function unbind() {
    if (this.viewHost.__childObserver__) {
      this.viewHost.__childObserver__.disconnect();
      this.viewHost.__childObserver__ = null;
      this.viewModel[this.property] = null;
    }
  };

  return ChildObserverBinder;
}();

function remove(viewSlot, previous) {
  return Array.isArray(previous) ? viewSlot.removeMany(previous, true) : viewSlot.remove(previous, true);
}

var SwapStrategies = {
  before: function before(viewSlot, previous, callback) {
    return previous === undefined ? callback() : callback().then(function () {
      return remove(viewSlot, previous);
    });
  },
  with: function _with(viewSlot, previous, callback) {
    return previous === undefined ? callback() : Promise.all([remove(viewSlot, previous), callback()]);
  },
  after: function after(viewSlot, previous, callback) {
    return Promise.resolve(viewSlot.removeAll(true)).then(callback);
  }
};

function tryActivateViewModel(context) {
  if (context.skipActivation || typeof context.viewModel.activate !== 'function') {
    return Promise.resolve();
  }

  return context.viewModel.activate(context.model) || Promise.resolve();
}

var CompositionEngine = (_dec10 = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_6_aurelia_dependency_injection__["c" /* inject */])(ViewEngine, ViewLocator), _dec10(_class18 = function () {
  function CompositionEngine(viewEngine, viewLocator) {
    

    this.viewEngine = viewEngine;
    this.viewLocator = viewLocator;
  }

  CompositionEngine.prototype._swap = function _swap(context, view) {
    var swapStrategy = SwapStrategies[context.swapOrder] || SwapStrategies.after;
    var previousViews = context.viewSlot.children.slice();

    return swapStrategy(context.viewSlot, previousViews, function () {
      return Promise.resolve(context.viewSlot.add(view)).then(function () {
        if (context.currentController) {
          context.currentController.unbind();
        }
      });
    }).then(function () {
      if (context.compositionTransactionNotifier) {
        context.compositionTransactionNotifier.done();
      }
    });
  };

  CompositionEngine.prototype._createControllerAndSwap = function _createControllerAndSwap(context) {
    var _this15 = this;

    return this.createController(context).then(function (controller) {
      if (context.compositionTransactionOwnershipToken) {
        return context.compositionTransactionOwnershipToken.waitForCompositionComplete().then(function () {
          controller.automate(context.overrideContext, context.owningView);

          return _this15._swap(context, controller.view);
        }).then(function () {
          return controller;
        });
      }

      controller.automate(context.overrideContext, context.owningView);

      return _this15._swap(context, controller.view).then(function () {
        return controller;
      });
    });
  };

  CompositionEngine.prototype.createController = function createController(context) {
    var _this16 = this;

    var childContainer = void 0;
    var viewModel = void 0;
    var viewModelResource = void 0;

    var m = void 0;

    return this.ensureViewModel(context).then(tryActivateViewModel).then(function () {
      childContainer = context.childContainer;
      viewModel = context.viewModel;
      viewModelResource = context.viewModelResource;
      m = viewModelResource.metadata;

      var viewStrategy = _this16.viewLocator.getViewStrategy(context.view || viewModel);

      if (context.viewResources) {
        viewStrategy.makeRelativeTo(context.viewResources.viewUrl);
      }

      return m.load(childContainer, viewModelResource.value, null, viewStrategy, true);
    }).then(function (viewFactory) {
      return m.create(childContainer, BehaviorInstruction.dynamic(context.host, viewModel, viewFactory));
    });
  };

  CompositionEngine.prototype.ensureViewModel = function ensureViewModel(context) {
    var childContainer = context.childContainer = context.childContainer || context.container.createChild();

    if (typeof context.viewModel === 'string') {
      context.viewModel = context.viewResources ? context.viewResources.relativeToView(context.viewModel) : context.viewModel;

      return this.viewEngine.importViewModelResource(context.viewModel).then(function (viewModelResource) {
        childContainer.autoRegister(viewModelResource.value);

        if (context.host) {
          childContainer.registerInstance(__WEBPACK_IMPORTED_MODULE_2_aurelia_pal__["c" /* DOM */].Element, context.host);
        }

        context.viewModel = childContainer.viewModel = childContainer.get(viewModelResource.value);
        context.viewModelResource = viewModelResource;
        return context;
      });
    }

    var ctor = context.viewModel.constructor;
    var isClass = typeof context.viewModel === 'function';
    if (isClass) {
      ctor = context.viewModel;
      childContainer.autoRegister(ctor);
    }
    var m = __WEBPACK_IMPORTED_MODULE_1_aurelia_metadata__["a" /* metadata */].getOrCreateOwn(__WEBPACK_IMPORTED_MODULE_1_aurelia_metadata__["a" /* metadata */].resource, HtmlBehaviorResource, ctor);

    m.elementName = m.elementName || 'dynamic-element';

    m.initialize(isClass ? childContainer : context.container || childContainer, ctor);

    context.viewModelResource = { metadata: m, value: ctor };

    if (context.host) {
      childContainer.registerInstance(__WEBPACK_IMPORTED_MODULE_2_aurelia_pal__["c" /* DOM */].Element, context.host);
    }
    childContainer.viewModel = context.viewModel = isClass ? childContainer.get(ctor) : context.viewModel;
    return Promise.resolve(context);
  };

  CompositionEngine.prototype.compose = function compose(context) {
    var _this17 = this;

    context.childContainer = context.childContainer || context.container.createChild();
    context.view = this.viewLocator.getViewStrategy(context.view);

    var transaction = context.childContainer.get(CompositionTransaction);
    var compositionTransactionOwnershipToken = transaction.tryCapture();

    if (compositionTransactionOwnershipToken) {
      context.compositionTransactionOwnershipToken = compositionTransactionOwnershipToken;
    } else {
      context.compositionTransactionNotifier = transaction.enlist();
    }

    if (context.viewModel) {
      return this._createControllerAndSwap(context);
    } else if (context.view) {
      if (context.viewResources) {
        context.view.makeRelativeTo(context.viewResources.viewUrl);
      }

      return context.view.loadViewFactory(this.viewEngine, new ViewCompileInstruction()).then(function (viewFactory) {
        var result = viewFactory.create(context.childContainer);
        result.bind(context.bindingContext, context.overrideContext);

        if (context.compositionTransactionOwnershipToken) {
          return context.compositionTransactionOwnershipToken.waitForCompositionComplete().then(function () {
            return _this17._swap(context, result);
          }).then(function () {
            return result;
          });
        }

        return _this17._swap(context, result).then(function () {
          return result;
        });
      });
    } else if (context.viewSlot) {
      context.viewSlot.removeAll();

      if (context.compositionTransactionNotifier) {
        context.compositionTransactionNotifier.done();
      }

      return Promise.resolve(null);
    }

    return Promise.resolve(null);
  };

  return CompositionEngine;
}()) || _class18);

var ElementConfigResource = function () {
  function ElementConfigResource() {
    
  }

  ElementConfigResource.prototype.initialize = function initialize(container, target) {};

  ElementConfigResource.prototype.register = function register(registry, name) {};

  ElementConfigResource.prototype.load = function load(container, target) {
    var config = new target();
    var eventManager = container.get(__WEBPACK_IMPORTED_MODULE_5_aurelia_binding__["h" /* EventManager */]);
    eventManager.registerElementConfig(config);
  };

  return ElementConfigResource;
}();

function resource(instanceOrConfig) {
  return function (target) {
    var isConfig = typeof instanceOrConfig === 'string' || Object.getPrototypeOf(instanceOrConfig) === Object.prototype;
    if (isConfig) {
      target.$resource = instanceOrConfig;
    } else {
      __WEBPACK_IMPORTED_MODULE_1_aurelia_metadata__["a" /* metadata */].define(__WEBPACK_IMPORTED_MODULE_1_aurelia_metadata__["a" /* metadata */].resource, instanceOrConfig, target);
    }
  };
}

function behavior(override) {
  return function (target) {
    if (override instanceof HtmlBehaviorResource) {
      __WEBPACK_IMPORTED_MODULE_1_aurelia_metadata__["a" /* metadata */].define(__WEBPACK_IMPORTED_MODULE_1_aurelia_metadata__["a" /* metadata */].resource, override, target);
    } else {
      var r = __WEBPACK_IMPORTED_MODULE_1_aurelia_metadata__["a" /* metadata */].getOrCreateOwn(__WEBPACK_IMPORTED_MODULE_1_aurelia_metadata__["a" /* metadata */].resource, HtmlBehaviorResource, target);
      Object.assign(r, override);
    }
  };
}

function customElement(name) {
  return function (target) {
    var r = __WEBPACK_IMPORTED_MODULE_1_aurelia_metadata__["a" /* metadata */].getOrCreateOwn(__WEBPACK_IMPORTED_MODULE_1_aurelia_metadata__["a" /* metadata */].resource, HtmlBehaviorResource, target);
    r.elementName = validateBehaviorName(name, 'custom element');
  };
}

function customAttribute(name, defaultBindingMode, aliases) {
  return function (target) {
    var r = __WEBPACK_IMPORTED_MODULE_1_aurelia_metadata__["a" /* metadata */].getOrCreateOwn(__WEBPACK_IMPORTED_MODULE_1_aurelia_metadata__["a" /* metadata */].resource, HtmlBehaviorResource, target);
    r.attributeName = validateBehaviorName(name, 'custom attribute');
    r.attributeDefaultBindingMode = defaultBindingMode;
    r.aliases = aliases;
  };
}

function templateController(target) {
  var deco = function deco(t) {
    var r = __WEBPACK_IMPORTED_MODULE_1_aurelia_metadata__["a" /* metadata */].getOrCreateOwn(__WEBPACK_IMPORTED_MODULE_1_aurelia_metadata__["a" /* metadata */].resource, HtmlBehaviorResource, t);
    r.liftsContent = true;
  };

  return target ? deco(target) : deco;
}

function bindable(nameOrConfigOrTarget, key, descriptor) {
  var deco = function deco(target, key2, descriptor2) {
    var actualTarget = key2 ? target.constructor : target;
    var r = __WEBPACK_IMPORTED_MODULE_1_aurelia_metadata__["a" /* metadata */].getOrCreateOwn(__WEBPACK_IMPORTED_MODULE_1_aurelia_metadata__["a" /* metadata */].resource, HtmlBehaviorResource, actualTarget);
    var prop = void 0;

    if (key2) {
      nameOrConfigOrTarget = nameOrConfigOrTarget || {};
      nameOrConfigOrTarget.name = key2;
    }

    prop = new BindableProperty(nameOrConfigOrTarget);
    return prop.registerWith(actualTarget, r, descriptor2);
  };

  if (!nameOrConfigOrTarget) {
    return deco;
  }

  if (key) {
    var _target = nameOrConfigOrTarget;
    nameOrConfigOrTarget = null;
    return deco(_target, key, descriptor);
  }

  return deco;
}

function dynamicOptions(target) {
  var deco = function deco(t) {
    var r = __WEBPACK_IMPORTED_MODULE_1_aurelia_metadata__["a" /* metadata */].getOrCreateOwn(__WEBPACK_IMPORTED_MODULE_1_aurelia_metadata__["a" /* metadata */].resource, HtmlBehaviorResource, t);
    r.hasDynamicOptions = true;
  };

  return target ? deco(target) : deco;
}

var defaultShadowDOMOptions = { mode: 'open' };

function useShadowDOM(targetOrOptions) {
  var options = typeof targetOrOptions === 'function' || !targetOrOptions ? defaultShadowDOMOptions : targetOrOptions;

  var deco = function deco(t) {
    var r = __WEBPACK_IMPORTED_MODULE_1_aurelia_metadata__["a" /* metadata */].getOrCreateOwn(__WEBPACK_IMPORTED_MODULE_1_aurelia_metadata__["a" /* metadata */].resource, HtmlBehaviorResource, t);
    r.targetShadowDOM = true;
    r.shadowDOMOptions = options;
  };

  return typeof targetOrOptions === 'function' ? deco(targetOrOptions) : deco;
}

function processAttributes(processor) {
  return function (t) {
    var r = __WEBPACK_IMPORTED_MODULE_1_aurelia_metadata__["a" /* metadata */].getOrCreateOwn(__WEBPACK_IMPORTED_MODULE_1_aurelia_metadata__["a" /* metadata */].resource, HtmlBehaviorResource, t);
    r.processAttributes = function (compiler, resources, node, attributes, elementInstruction) {
      try {
        processor(compiler, resources, node, attributes, elementInstruction);
      } catch (error) {
        __WEBPACK_IMPORTED_MODULE_0_aurelia_logging__["getLogger"]('templating').error(error);
      }
    };
  };
}

function doNotProcessContent() {
  return false;
}

function processContent(processor) {
  return function (t) {
    var r = __WEBPACK_IMPORTED_MODULE_1_aurelia_metadata__["a" /* metadata */].getOrCreateOwn(__WEBPACK_IMPORTED_MODULE_1_aurelia_metadata__["a" /* metadata */].resource, HtmlBehaviorResource, t);
    r.processContent = processor ? function (compiler, resources, node, instruction) {
      try {
        return processor(compiler, resources, node, instruction);
      } catch (error) {
        __WEBPACK_IMPORTED_MODULE_0_aurelia_logging__["getLogger"]('templating').error(error);
        return false;
      }
    } : doNotProcessContent;
  };
}

function containerless(target) {
  var deco = function deco(t) {
    var r = __WEBPACK_IMPORTED_MODULE_1_aurelia_metadata__["a" /* metadata */].getOrCreateOwn(__WEBPACK_IMPORTED_MODULE_1_aurelia_metadata__["a" /* metadata */].resource, HtmlBehaviorResource, t);
    r.containerless = true;
  };

  return target ? deco(target) : deco;
}

function useViewStrategy(strategy) {
  return function (target) {
    __WEBPACK_IMPORTED_MODULE_1_aurelia_metadata__["a" /* metadata */].define(ViewLocator.viewStrategyMetadataKey, strategy, target);
  };
}

function useView(path) {
  return useViewStrategy(new RelativeViewStrategy(path));
}

function inlineView(markup, dependencies, dependencyBaseUrl) {
  return useViewStrategy(new InlineViewStrategy(markup, dependencies, dependencyBaseUrl));
}

function noView(targetOrDependencies, dependencyBaseUrl) {
  var target = void 0;
  var dependencies = void 0;
  if (typeof targetOrDependencies === 'function') {
    target = targetOrDependencies;
  } else {
    dependencies = targetOrDependencies;
    target = undefined;
  }

  var deco = function deco(t) {
    __WEBPACK_IMPORTED_MODULE_1_aurelia_metadata__["a" /* metadata */].define(ViewLocator.viewStrategyMetadataKey, new NoViewStrategy(dependencies, dependencyBaseUrl), t);
  };

  return target ? deco(target) : deco;
}

function view(templateOrConfig) {
  return function (target) {
    target.$view = templateOrConfig;
  };
}

function elementConfig(target) {
  var deco = function deco(t) {
    __WEBPACK_IMPORTED_MODULE_1_aurelia_metadata__["a" /* metadata */].define(__WEBPACK_IMPORTED_MODULE_1_aurelia_metadata__["a" /* metadata */].resource, new ElementConfigResource(), t);
  };

  return target ? deco(target) : deco;
}

function viewResources() {
  for (var _len = arguments.length, resources = Array(_len), _key7 = 0; _key7 < _len; _key7++) {
    resources[_key7] = arguments[_key7];
  }

  return function (target) {
    __WEBPACK_IMPORTED_MODULE_1_aurelia_metadata__["a" /* metadata */].define(ViewEngine.viewModelRequireMetadataKey, resources, target);
  };
}

var TemplatingEngine = (_dec11 = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_6_aurelia_dependency_injection__["c" /* inject */])(__WEBPACK_IMPORTED_MODULE_6_aurelia_dependency_injection__["a" /* Container */], ModuleAnalyzer, ViewCompiler, CompositionEngine), _dec11(_class19 = function () {
  function TemplatingEngine(container, moduleAnalyzer, viewCompiler, compositionEngine) {
    

    this._container = container;
    this._moduleAnalyzer = moduleAnalyzer;
    this._viewCompiler = viewCompiler;
    this._compositionEngine = compositionEngine;
    container.registerInstance(Animator, Animator.instance = new Animator());
  }

  TemplatingEngine.prototype.configureAnimator = function configureAnimator(animator) {
    this._container.unregister(Animator);
    this._container.registerInstance(Animator, Animator.instance = animator);
  };

  TemplatingEngine.prototype.compose = function compose(context) {
    return this._compositionEngine.compose(context);
  };

  TemplatingEngine.prototype.enhance = function enhance(instruction) {
    if (instruction instanceof __WEBPACK_IMPORTED_MODULE_2_aurelia_pal__["c" /* DOM */].Element) {
      instruction = { element: instruction };
    }

    var compilerInstructions = { letExpressions: [] };
    var resources = instruction.resources || this._container.get(ViewResources);

    this._viewCompiler._compileNode(instruction.element, resources, compilerInstructions, instruction.element.parentNode, 'root', true);

    var factory = new ViewFactory(instruction.element, compilerInstructions, resources);
    var container = instruction.container || this._container.createChild();
    var view = factory.create(container, BehaviorInstruction.enhance());

    view.bind(instruction.bindingContext || {}, instruction.overrideContext);

    view.firstChild = view.lastChild = view.fragment;
    view.fragment = __WEBPACK_IMPORTED_MODULE_2_aurelia_pal__["c" /* DOM */].createDocumentFragment();
    view.attached();

    return view;
  };

  return TemplatingEngine;
}()) || _class19);

/***/ }),

/***/ 20:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = ansiHTML

// Reference to https://github.com/sindresorhus/ansi-regex
var _regANSI = /(?:(?:\u001b\[)|\u009b)(?:(?:[0-9]{1,3})?(?:(?:;[0-9]{0,3})*)?[A-M|f-m])|\u001b[A-M]/

var _defColors = {
  reset: ['fff', '000'], // [FOREGROUD_COLOR, BACKGROUND_COLOR]
  black: '000',
  red: 'ff0000',
  green: '209805',
  yellow: 'e8bf03',
  blue: '0000ff',
  magenta: 'ff00ff',
  cyan: '00ffee',
  lightgrey: 'f0f0f0',
  darkgrey: '888'
}
var _styles = {
  30: 'black',
  31: 'red',
  32: 'green',
  33: 'yellow',
  34: 'blue',
  35: 'magenta',
  36: 'cyan',
  37: 'lightgrey'
}
var _openTags = {
  '1': 'font-weight:bold', // bold
  '2': 'opacity:0.5', // dim
  '3': '<i>', // italic
  '4': '<u>', // underscore
  '8': 'display:none', // hidden
  '9': '<del>' // delete
}
var _closeTags = {
  '23': '</i>', // reset italic
  '24': '</u>', // reset underscore
  '29': '</del>' // reset delete
}

;[0, 21, 22, 27, 28, 39, 49].forEach(function (n) {
  _closeTags[n] = '</span>'
})

/**
 * Converts text with ANSI color codes to HTML markup.
 * @param {String} text
 * @returns {*}
 */
function ansiHTML (text) {
  // Returns the text if the string has no ANSI escape code.
  if (!_regANSI.test(text)) {
    return text
  }

  // Cache opened sequence.
  var ansiCodes = []
  // Replace with markup.
  var ret = text.replace(/\033\[(\d+)*m/g, function (match, seq) {
    var ot = _openTags[seq]
    if (ot) {
      // If current sequence has been opened, close it.
      if (!!~ansiCodes.indexOf(seq)) { // eslint-disable-line no-extra-boolean-cast
        ansiCodes.pop()
        return '</span>'
      }
      // Open tag.
      ansiCodes.push(seq)
      return ot[0] === '<' ? ot : '<span style="' + ot + ';">'
    }

    var ct = _closeTags[seq]
    if (ct) {
      // Pop sequence
      ansiCodes.pop()
      return ct
    }
    return ''
  })

  // Make sure tags are closed.
  var l = ansiCodes.length
  ;(l > 0) && (ret += Array(l + 1).join('</span>'))

  return ret
}

/**
 * Customize colors.
 * @param {Object} colors reference to _defColors
 */
ansiHTML.setColors = function (colors) {
  if (typeof colors !== 'object') {
    throw new Error('`colors` parameter must be an Object.')
  }

  var _finalColors = {}
  for (var key in _defColors) {
    var hex = colors.hasOwnProperty(key) ? colors[key] : null
    if (!hex) {
      _finalColors[key] = _defColors[key]
      continue
    }
    if ('reset' === key) {
      if (typeof hex === 'string') {
        hex = [hex]
      }
      if (!Array.isArray(hex) || hex.length === 0 || hex.some(function (h) {
        return typeof h !== 'string'
      })) {
        throw new Error('The value of `' + key + '` property must be an Array and each item could only be a hex string, e.g.: FF0000')
      }
      var defHexColor = _defColors[key]
      if (!hex[0]) {
        hex[0] = defHexColor[0]
      }
      if (hex.length === 1 || !hex[1]) {
        hex = [hex[0]]
        hex.push(defHexColor[1])
      }

      hex = hex.slice(0, 2)
    } else if (typeof hex !== 'string') {
      throw new Error('The value of `' + key + '` property must be a hex string, e.g.: FF0000')
    }
    _finalColors[key] = hex
  }
  _setTags(_finalColors)
}

/**
 * Reset colors.
 */
ansiHTML.reset = function () {
  _setTags(_defColors)
}

/**
 * Expose tags, including open and close.
 * @type {Object}
 */
ansiHTML.tags = {}

if (Object.defineProperty) {
  Object.defineProperty(ansiHTML.tags, 'open', {
    get: function () { return _openTags }
  })
  Object.defineProperty(ansiHTML.tags, 'close', {
    get: function () { return _closeTags }
  })
} else {
  ansiHTML.tags.open = _openTags
  ansiHTML.tags.close = _closeTags
}

function _setTags (colors) {
  // reset all
  _openTags['0'] = 'font-weight:normal;opacity:1;color:#' + colors.reset[0] + ';background:#' + colors.reset[1]
  // inverse
  _openTags['7'] = 'color:#' + colors.reset[1] + ';background:#' + colors.reset[0]
  // dark grey
  _openTags['90'] = 'color:#' + colors.darkgrey

  for (var code in _styles) {
    var color = _styles[code]
    var oriColor = colors[color] || '000'
    _openTags[code] = 'color:#' + oriColor
    code = parseInt(code)
    _openTags[(code + 10).toString()] = 'background:#' + oriColor
  }
}

ansiHTML.reset()


/***/ }),

/***/ 21:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

module.exports = function () {
	return /[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-PRZcf-nqry=><]/g;
};


/***/ }),

/***/ 22:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export cssUrlMatcher */
/* unused harmony export fixupCSSUrls */
/* unused harmony export CSSResource */
/* unused harmony export CSSViewEngineHooks */
/* harmony export (immutable) */ __webpack_exports__["a"] = _createCSSResource;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_aurelia_templating__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_aurelia_loader__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_aurelia_path__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_aurelia_pal__ = __webpack_require__(0);
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
/*eslint new-cap:0, padded-blocks:0*/




// this is almost the same as aurelia-templating-resources/css-resource
// with the exception that it keeps track of the HTMLStyleElement that is being added
var cssUrlMatcher = /url\((?!['"]data)([^)]+)\)/gi;
function fixupCSSUrls(address, css) {
    if (typeof css !== 'string') {
        throw new Error("Failed loading required CSS file: " + address);
    }
    return css.replace(cssUrlMatcher, function (match, p1) {
        var quote = p1.charAt(0);
        if (quote === '\'' || quote === '"') {
            p1 = p1.substr(1, p1.length - 2);
        }
        return 'url(\'' + __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2_aurelia_path__["a" /* relativeToFile */])(p1, address) + '\')';
    });
}
var CSSResource = (function () {
    function CSSResource(address) {
        this.injectedElement = null;
        this.address = address;
        this._scoped = null;
        this._global = false;
        this._alreadyGloballyInjected = false;
    }
    CSSResource.prototype.initialize = function (container, target) {
        this._scoped = new target(this);
    };
    CSSResource.prototype.register = function (registry, name) {
        if (name === 'scoped') {
            registry.registerViewEngineHooks(this._scoped);
        }
        else {
            this._global = true;
        }
    };
    CSSResource.prototype.load = function (container) {
        var _this = this;
        return container.get(__WEBPACK_IMPORTED_MODULE_1_aurelia_loader__["a" /* Loader */])
            .loadText(this.address)
            .catch(function (err) { return null; })
            .then(function (text) {
            if (!text) {
                return;
            }
            text = fixupCSSUrls(_this.address, text);
            if (_this._scoped) {
                _this._scoped.css = text;
            }
            if (_this._global) {
                _this._alreadyGloballyInjected = true;
                _this.injectedElement = __WEBPACK_IMPORTED_MODULE_3_aurelia_pal__["c" /* DOM */].injectStyles(text);
            }
        });
    };
    return CSSResource;
}());

var CSSViewEngineHooks = (function () {
    function CSSViewEngineHooks(owner) {
        this.injectedElements = [];
        this.owner = owner;
        this.css = null;
    }
    CSSViewEngineHooks.prototype.beforeCompile = function (content, resources, instruction) {
        if (instruction.targetShadowDOM) {
            this.injectedElements.push(__WEBPACK_IMPORTED_MODULE_3_aurelia_pal__["c" /* DOM */].injectStyles(this.css, content, true));
        }
        else if (__WEBPACK_IMPORTED_MODULE_3_aurelia_pal__["d" /* FEATURE */].scopedCSS) {
            var styleNode = __WEBPACK_IMPORTED_MODULE_3_aurelia_pal__["c" /* DOM */].injectStyles(this.css, content, true);
            styleNode.setAttribute('scoped', 'scoped');
        }
        else if (!this.owner._alreadyGloballyInjected) {
            this.owner.injectedElement = __WEBPACK_IMPORTED_MODULE_3_aurelia_pal__["c" /* DOM */].injectStyles(this.css);
            this.owner._alreadyGloballyInjected = true;
        }
    };
    return CSSViewEngineHooks;
}());

function _createCSSResource(address) {
    var ViewCSS = (function (_super) {
        __extends(ViewCSS, _super);
        function ViewCSS() {
            return _super.apply(this, arguments) || this;
        }
        return ViewCSS;
    }(CSSViewEngineHooks));
    ViewCSS = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0_aurelia_templating__["w" /* resource */])(new CSSResource(address))
    ], ViewCSS);
    return ViewCSS;
}


/***/ }),

/***/ 23:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export recreateView */
/* unused harmony export cleanupView */
/* harmony export (immutable) */ __webpack_exports__["b"] = rerenderController;
/* harmony export (immutable) */ __webpack_exports__["a"] = rerenderMatchingSlotChildren;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_aurelia_templating__ = __webpack_require__(2);

function recreateView(viewFactory, oldViewContainer) {
    var parentContainer = oldViewContainer.parent || oldViewContainer;
    var targetInstruction = oldViewContainer.get(__WEBPACK_IMPORTED_MODULE_0_aurelia_templating__["u" /* TargetInstruction */]);
    // const targetInstruction = container.get(TargetInstruction) as TargetInstruction;
    var factoryCreateInstruction = targetInstruction.elementInstruction || { partReplacements: null };
    // let factoryCreateInstruction = ({partReplacements: null} as BehaviorInstruction);
    // console.log(`new element instruction`, targetInstruction, factoryCreateInstruction);
    var newContainer = parentContainer.createChild();
    // const newContainer = oldViewContainer;
    var newView = viewFactory.create(newContainer, factoryCreateInstruction);
    newView._isUserControlled = true;
    return newView;
}
function cleanupView(view) {
    var firstChild = view.firstChild;
    var lastChild = view.lastChild;
    var nextSibling = lastChild.nextSibling;
    var parent = firstChild.parentElement;
    var bindingContext = view.bindingContext, overrideContext = view.overrideContext, container = view.container;
    view.removeNodes();
    var wasAttached = view.isAttached;
    if (wasAttached) {
        view.detached();
    }
    var wasBound = view.isBound;
    if (wasBound) {
        view.unbind();
    }
    view._invalidView = true;
    return { nextSibling: nextSibling, parent: parent, wasBound: wasBound, wasAttached: wasAttached, bindingContext: bindingContext, overrideContext: overrideContext, container: container };
}
function rerenderController(e, type, newViewFactory) {
    var oldView = e[type];
    if (!oldView) {
        // view was removed from the controller in a previous run, ignore
        return;
    }
    if (oldView._invalidView) {
        // previously re-rendered, ensure controller is set and skip
        if (oldView._replacementView) {
            e[type] = oldView._replacementView;
        }
        return;
    }
    var _a = cleanupView(oldView), nextSibling = _a.nextSibling, parent = _a.parent, wasBound = _a.wasBound, wasAttached = _a.wasAttached, bindingContext = _a.bindingContext, overrideContext = _a.overrideContext, oldViewContainer = _a.container;
    // create & add view:
    var newView = oldView._replacementView = e[type] = recreateView(newViewFactory || oldView.viewFactory, oldViewContainer);
    if (!newView.isBound && wasBound) {
        newView.bind(bindingContext, overrideContext);
    }
    if (nextSibling) {
        newView.insertNodesBefore(nextSibling);
    }
    else {
        newView.appendNodesTo(parent);
    }
    if (!newView.isAttached && wasAttached) {
        newView.attached();
    }
}
function rerenderMatchingSlotChildren(slot, newViewFactory, originalFactoryTemplate, onlyViews) {
    var previousChildren = slot.children.slice();
    var viewsToReplace = previousChildren.filter(function (view) { return (onlyViews && onlyViews.indexOf(view) >= 0) || (view.viewFactory && view.viewFactory.template === originalFactoryTemplate); });
    var bindingContexts = new Map();
    var overrideContexts = new Map();
    var controllers = new Map();
    viewsToReplace.forEach(function (oldView) {
        // store contexts because they'll be removed when unbound:
        bindingContexts.set(oldView, oldView.bindingContext);
        overrideContexts.set(oldView, oldView.overrideContext);
        controllers.set(oldView, oldView.controller);
        if (oldView.isBound) {
            oldView.unbind();
        }
        oldView._invalidView = true;
    });
    slot.removeMany(viewsToReplace, false, true);
    // recreate removed Views in the same place:
    previousChildren.forEach(function (oldView, index) {
        if (!oldView._invalidView) {
            // don't do anything to non-matching Views
            return;
        }
        var bindingContext = bindingContexts.get(oldView);
        var overrideContext = overrideContexts.get(oldView);
        var controller = controllers.get(oldView);
        var view = recreateView(newViewFactory || oldView.viewFactory, oldView.container);
        // setup _replacementView in case the same view is looped over again
        oldView._replacementView = view;
        if (controller) {
            controller.view = view;
        }
        if (!view.isBound) {
            view.bind(bindingContext, overrideContext);
        }
        // indicies should match up and grow as we iterate up
        slot.insert(index, view);
    });
}


/***/ }),

/***/ 24:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = traverseController;
/* unused harmony export traverseBehaviorResource */
/* unused harmony export traverseViewFactory */
/* unused harmony export traverseViewResources */
/* unused harmony export traverseBehaviorInstruction */
/* unused harmony export traverseViewModel */
/* unused harmony export traverseRouter */
/* unused harmony export traverseRouterView */
/* unused harmony export traverseView */
/* unused harmony export traverseOverrideContext */
/* unused harmony export traverseViewSlot */
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
/**
 *  traverse interesting places in Controller:
 * - behavior.target (class of ViewModel)
 * - behavior.viewFactory (traverse ViewFactory)
 * - behavior.attributes[array] (?)
 *
 * - viewFactory.instructions[ALL-obj].providers[ALL-arr] (original functions/classes, not instances, things like If)
 * - viewFactory.instructions[ALL-obj].viewFactory
 *
 * - viewFactory.resources (ViewResources)
 *      .bindingBehaviors[name] (instances, can fix up .constructor is class)
 *      .valueConverters[name] (instances, can fix up .constructor is class)
 *
 * - boundProperties[array] ??
 * - container //how can we replace instances in container?
 * - container.children[array<ViewSlot>]?
 * - container
 *      .viewModel? (instance)
 *      .viewResources (ViewResources)
 *
 * - instruction (BehaviorInstruction)
 *      .viewFactory
 *      .viewModel (instance)
 *
 * - scope (View)
 *      .bindingContext (instance)
 *      .children[array<ViewSlot>]
 *      .controller (Controller)
 *      .controllers[array<Controller>]
 *      .overrideContext
 *         .bindingContext? (Instance)
 *         .parentOverrideContext
 *               .bindingContext? (and so on...)
 *      .resources (ViewResources)
 *      .viewFactory (ViewFactory)
 * - view (View)
 * - viewModel (instance or RouterView:)
 *      .overrideContext
 *      .router.viewPorts[ALL-obj]. (RouterView)
 *               .overrideContext
 *               .owningView (View)
 *               .view (View)
 *               .viewSlot (ViewSlot)
 *                     .children[array<View>]
 *                     .bindingContext (instance)
 *                     .overrideContext
 **/
function traverseController(classOrFunction, controller, info) {
    var matches = [];
    if (!controller || info.previouslyTraversed.has(controller))
        return matches;
    info.previouslyTraversed.add(controller);
    matches.push.apply(matches, traverseBehaviorResource(classOrFunction, controller.behavior, __assign({}, info, { parentController: controller, immediateParent: controller, propertyInParent: 'behavior' })).concat(traverseBehaviorInstruction(classOrFunction, controller.instruction, __assign({}, info, { parentController: controller, immediateParent: controller, propertyInParent: 'instruction' })), traverseView(classOrFunction, controller.scope, __assign({}, info, { parentController: controller, immediateParent: controller, propertyInParent: 'scope' })), traverseView(classOrFunction, controller.view, __assign({}, info, { parentController: controller, immediateParent: controller, propertyInParent: 'view' })), traverseViewModel(classOrFunction, controller.viewModel, __assign({}, info, { parentController: controller, immediateParent: controller, propertyInParent: 'viewModel' }))));
    return matches;
}
function traverseBehaviorResource(classOrFunction, behavior, info) {
    var matches = [];
    if (!behavior || info.previouslyTraversed.has(behavior))
        return matches;
    info.previouslyTraversed.add(behavior);
    if (behavior.target === classOrFunction) {
        matches.push(__assign({}, info, { immediateParent: behavior, propertyInParent: 'target' }));
    }
    matches.push.apply(matches, traverseViewFactory(classOrFunction, behavior.viewFactory, __assign({}, info, { immediateParent: behavior, propertyInParent: 'viewFactory' })));
    return matches;
}
function traverseViewFactory(classOrFunction, viewFactory, info) {
    var matches = [];
    if (!viewFactory || info.previouslyTraversed.has(viewFactory))
        return matches;
    info.previouslyTraversed.add(viewFactory);
    if (viewFactory.instructions) {
        Object.keys(viewFactory.instructions).forEach(function (instructionKey) {
            var instruction = viewFactory.instructions[instructionKey];
            matches.push.apply(matches, traverseViewFactory(classOrFunction, instruction.viewFactory, __assign({}, info, { immediateParent: instruction, propertyInParent: 'viewFactory' })));
            if (instruction.providers && instruction.providers.length) {
                instruction.providers.forEach(function (providerKey, index) {
                    if (providerKey === classOrFunction) {
                        matches.push(__assign({}, info, { immediateParent: instruction.providers, propertyInParent: index }));
                    }
                });
            }
        });
    }
    if (viewFactory.resources) {
        matches.push.apply(matches, traverseViewResources(classOrFunction, viewFactory.resources, __assign({}, info, { immediateParent: viewFactory, propertyInParent: 'resources' })));
    }
    return matches;
}
function traverseViewResources(classOrFunction, viewResources, info) {
    var matches = [];
    if (!viewResources || info.previouslyTraversed.has(viewResources))
        return matches;
    info.previouslyTraversed.add(viewResources);
    ['bindingBehaviors', 'valueConverters'].forEach(function (type) {
        var viewResourceInstances = viewResources[type];
        if (viewResourceInstances) {
            Object.keys(viewResourceInstances).forEach(function (key) {
                var instance = viewResourceInstances[key];
                if (instance && instance.constructor === classOrFunction) {
                    matches.push(__assign({}, info, { immediateParent: viewResourceInstances, propertyInParent: key, instance: true }));
                }
            });
        }
    });
    matches.push.apply(matches, traverseViewResources(classOrFunction, viewResources.parent, __assign({}, info, { immediateParent: viewResources, propertyInParent: 'parent' })));
    return matches;
}
function traverseBehaviorInstruction(classOrFunction, behaviorInstruction, info) {
    var matches = [];
    if (!behaviorInstruction || info.previouslyTraversed.has(behaviorInstruction))
        return matches;
    info.previouslyTraversed.add(behaviorInstruction);
    matches.push.apply(matches, traverseViewFactory(classOrFunction, behaviorInstruction.viewFactory, __assign({}, info, { immediateParent: behaviorInstruction, propertyInParent: 'viewFactory' })).concat(traverseViewModel(classOrFunction, behaviorInstruction.viewModel, __assign({}, info, { immediateParent: behaviorInstruction, propertyInParent: 'viewModel' }))));
    return matches;
}
function traverseViewModel(classOrFunction, viewModel, info) {
    var matches = [];
    if (!viewModel)
        return matches;
    var duplicate = info.previouslyTraversed.has(viewModel);
    info.previouslyTraversed.add(viewModel);
    if (viewModel.constructor === classOrFunction) {
        matches.push(__assign({}, info, { instance: true, duplicate: duplicate }));
        if (duplicate) {
            return matches;
        }
    }
    matches.push.apply(matches, traverseOverrideContext(classOrFunction, viewModel.overrideContext, __assign({}, info, { immediateParent: viewModel, propertyInParent: 'overrideContext' })).concat(traverseRouter(classOrFunction, viewModel.router, __assign({}, info, { immediateParent: viewModel, propertyInParent: 'router' }))));
    return matches;
}
function traverseRouter(classOrFunction, router, info) {
    var matches = [];
    if (!router || info.previouslyTraversed.has(router))
        return matches;
    info.previouslyTraversed.add(router);
    if (router.viewPorts) {
        Object.keys(router.viewPorts).forEach(function (key) {
            var viewPort = router.viewPorts[key]; // as RouterView;
            matches.push.apply(// as RouterView;
            matches, traverseRouterView(classOrFunction, viewPort, __assign({}, info, { immediateParent: router.viewPorts, propertyInParent: key })));
        });
    }
    return matches;
}
function traverseRouterView(classOrFunction, routerView, info) {
    var matches = [];
    if (!routerView || info.previouslyTraversed.has(routerView))
        return matches;
    info.previouslyTraversed.add(routerView);
    matches.push.apply(matches, traverseOverrideContext(classOrFunction, routerView.overrideContext, __assign({}, info, { immediateParent: routerView, propertyInParent: 'overrideContext' })).concat(traverseView(classOrFunction, routerView.owningView, __assign({}, info, { immediateParent: routerView, propertyInParent: 'owningView' })), traverseView(classOrFunction, routerView.view, __assign({}, info, { immediateParent: routerView, propertyInParent: 'view' })), traverseViewSlot(classOrFunction, routerView.viewSlot, __assign({}, info, { immediateParent: routerView, propertyInParent: 'viewSlot' }))));
    return matches;
}
function traverseView(classOrFunction, view, info) {
    var matches = [];
    if (!view || info.previouslyTraversed.has(view))
        return matches;
    info.previouslyTraversed.add(view);
    matches.push.apply(matches, traverseViewModel(classOrFunction, view.bindingContext, __assign({}, info, { relatedView: view, immediateParent: view, propertyInParent: 'bindingContext' })).concat(traverseController(classOrFunction, view.controller, __assign({}, info, { relatedView: view, immediateParent: view, propertyInParent: 'controller' })), traverseOverrideContext(classOrFunction, view.overrideContext, __assign({}, info, { relatedView: view, immediateParent: view, propertyInParent: 'overrideContext' })), traverseViewResources(classOrFunction, view.resources, __assign({}, info, { relatedView: view, immediateParent: view, propertyInParent: 'resources' })), traverseViewFactory(classOrFunction, view.viewFactory, __assign({}, info, { relatedView: view, immediateParent: view, propertyInParent: 'viewFactory' }))));
    if (view.controllers && view.controllers.length) {
        view.controllers.forEach(function (controller, index) {
            matches.push.apply(matches, traverseController(classOrFunction, controller, __assign({}, info, { relatedView: view, immediateParent: view.controllers, propertyInParent: index })));
        });
    }
    if (view.children && view.children.length) {
        view.children.forEach(function (viewSlot, index) {
            matches.push.apply(matches, traverseViewSlot(classOrFunction, viewSlot, __assign({}, info, { childOfViewSlot: viewSlot, relatedView: view, immediateParent: view.children, propertyInParent: index })));
        });
    }
    return matches;
}
function traverseOverrideContext(classOrFunction, overrideContext, info) {
    var matches = [];
    if (!overrideContext || info.previouslyTraversed.has(overrideContext))
        return matches;
    info.previouslyTraversed.add(overrideContext);
    matches.push.apply(matches, traverseViewModel(classOrFunction, overrideContext.bindingContext, __assign({}, info, { immediateParent: overrideContext, propertyInParent: 'bindingContext' })).concat(traverseOverrideContext(classOrFunction, overrideContext.parentOverrideContext, __assign({}, info, { immediateParent: overrideContext, propertyInParent: 'parentOverrideContext' }))));
    return matches;
}
function traverseViewSlot(classOrFunction, viewSlot, info) {
    var matches = [];
    if (!viewSlot || info.previouslyTraversed.has(viewSlot))
        return matches;
    info.previouslyTraversed.add(viewSlot);
    matches.push.apply(matches, traverseViewModel(classOrFunction, viewSlot.bindingContext, __assign({}, info, { immediateParent: viewSlot, propertyInParent: 'bindingContext' })).concat(traverseOverrideContext(classOrFunction, viewSlot.overrideContext, __assign({}, info, { immediateParent: viewSlot, propertyInParent: 'overrideContext' }))));
    if (viewSlot.children && viewSlot.children.length) {
        viewSlot.children.forEach(function (child, index) {
            matches.push.apply(matches, traverseView(classOrFunction, child, __assign({}, info, { childOfViewSlot: viewSlot, relatedView: child, immediateParent: viewSlot.children, propertyInParent: index })));
        });
    }
    return matches;
}


/***/ }),

/***/ 25:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export getViewSlots */
/* unused harmony export anyMatchingChildren */
/* unused harmony export traverseControllerForTemplates */
/* harmony export (immutable) */ __webpack_exports__["a"] = getElementsToRerender;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_aurelia_templating__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__aurelia_hot_module_reload__ = __webpack_require__(12);


function getViewSlots(view) {
    if (view.children && view.children.length) {
        return view.children.filter(function (viewSlot) {
            return viewSlot instanceof __WEBPACK_IMPORTED_MODULE_0_aurelia_templating__["e" /* ViewSlot */] && viewSlot.children && viewSlot.children.length;
        });
    }
    return [];
}
function anyMatchingChildren(viewSlot, matchingTemplate) {
    return !!viewSlot.children.find(function (view) { return view.viewFactory && view.viewFactory.template === matchingTemplate; });
}
function traverseControllerForTemplates(auController, matchingTemplate) {
    var matchingViewControllers = [];
    var matchingScopeControllers = [];
    var view = (auController.view);
    var scope = (auController.scope);
    var slotsWithMatchingViews = [];
    if (view && view.viewFactory && view.viewFactory.template === matchingTemplate) {
        matchingViewControllers = [auController]; // [view.controller] // whole View and all of its children will be rendered
    }
    else if (scope && scope.controller && scope.viewFactory && scope.viewFactory.template === matchingTemplate) {
        matchingScopeControllers = [scope.controller];
    }
    else {
        var viewViewSlots = view ? getViewSlots(view) : [];
        var scopeViewSlots = scope ? getViewSlots(scope) : [];
        slotsWithMatchingViews = Array.from(new Set(viewViewSlots.concat(scopeViewSlots))).filter(function (slot) { return anyMatchingChildren(slot, matchingTemplate); });
    }
    return {
        matchingViewControllers: matchingViewControllers,
        matchingScopeControllers: matchingScopeControllers,
        slotsWithMatchingViews: slotsWithMatchingViews
    };
}
function getElementsToRerender(template) {
    // get visible elements to re-render:
    var auElements = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__aurelia_hot_module_reload__["getAuElements"])();
    var controllers = auElements.filter(function (el) {
        /* NOTE: viewless components like blur-image do not have el.au.controller set */
        return el.au && el.au.controller && (el.au.controller.view || el.au.controller.scope);
    }).map(function (el) { return el.au.controller; });
    var viewControllers = new Set();
    var scopeControllers = new Set();
    var slots = new Set();
    controllers
        .forEach(function (controller) {
        var _a = traverseControllerForTemplates(controller, template), matchingViewControllers = _a.matchingViewControllers, matchingScopeControllers = _a.matchingScopeControllers, slotsWithMatchingViews = _a.slotsWithMatchingViews;
        matchingViewControllers.forEach(function (controller) { return viewControllers.add(controller); });
        matchingScopeControllers.forEach(function (controller) { return scopeControllers.add(controller); });
        slotsWithMatchingViews.forEach(function (slot) { return slots.add(slot); });
    });
    var toRender = { viewControllers: viewControllers, scopeControllers: scopeControllers, slots: slots };
    return toRender;
}


/***/ }),

/***/ 26:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "TextTemplateLoader", function() { return TextTemplateLoader; });
/* harmony export (immutable) */ __webpack_exports__["ensureOriginOnExports"] = ensureOriginOnExports;
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "WebpackLoader", function() { return WebpackLoader; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_aurelia_metadata__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_aurelia_loader__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_aurelia_pal__ = __webpack_require__(0);
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};



/**
* An implementation of the TemplateLoader interface implemented with text-based loading.
*/
var TextTemplateLoader = /** @class */ (function () {
    function TextTemplateLoader() {
    }
    /**
    * Loads a template.
    * @param loader The loader that is requesting the template load.
    * @param entry The TemplateRegistryEntry to load and populate with a template.
    * @return A promise which resolves when the TemplateRegistryEntry is loaded with a template.
    */
    TextTemplateLoader.prototype.loadTemplate = function (loader, entry) {
        return __awaiter(this, void 0, void 0, function () {
            var text;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, loader.loadText(entry.address)];
                    case 1:
                        text = _a.sent();
                        entry.template = __WEBPACK_IMPORTED_MODULE_2_aurelia_pal__["c" /* DOM */].createTemplateFromMarkup(text);
                        return [2 /*return*/];
                }
            });
        });
    };
    return TextTemplateLoader;
}());

function ensureOriginOnExports(moduleExports, moduleId) {
    var target = moduleExports;
    var key;
    var exportedValue;
    if (target.__useDefault) {
        target = target.default;
    }
    __WEBPACK_IMPORTED_MODULE_0_aurelia_metadata__["c" /* Origin */].set(target, new __WEBPACK_IMPORTED_MODULE_0_aurelia_metadata__["c" /* Origin */](moduleId, 'default'));
    if (typeof target === 'object') {
        for (key in target) {
            exportedValue = target[key];
            if (typeof exportedValue === 'function') {
                __WEBPACK_IMPORTED_MODULE_0_aurelia_metadata__["c" /* Origin */].set(exportedValue, new __WEBPACK_IMPORTED_MODULE_0_aurelia_metadata__["c" /* Origin */](moduleId, key));
            }
        }
    }
    return moduleExports;
}
/**
* A default implementation of the Loader abstraction which works with webpack (extended common-js style).
*/
var WebpackLoader = /** @class */ (function (_super) {
    __extends(WebpackLoader, _super);
    function WebpackLoader() {
        var _this = _super.call(this) || this;
        _this.moduleRegistry = Object.create(null);
        _this.loaderPlugins = Object.create(null);
        _this.modulesBeingLoaded = new Map();
        _this.useTemplateLoader(new TextTemplateLoader());
        _this.addPlugin('template-registry-entry', {
            fetch: function (moduleId) { return __awaiter(_this, void 0, void 0, function () {
                var HmrContext, entry;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            // HMR:
                            if (true) {
                                if (!this.hmrContext) {
                                    HmrContext = __webpack_require__(12).HmrContext;
                                    this.hmrContext = new HmrContext(this);
                                }
                                module.hot.accept(moduleId, function () { return __awaiter(_this, void 0, void 0, function () {
                                    return __generator(this, function (_a) {
                                        switch (_a.label) {
                                            case 0: return [4 /*yield*/, this.hmrContext.handleViewChange(moduleId)];
                                            case 1:
                                                _a.sent();
                                                return [2 /*return*/];
                                        }
                                    });
                                }); });
                            }
                            entry = this.getOrCreateTemplateRegistryEntry(moduleId);
                            if (!!entry.templateIsLoaded) return [3 /*break*/, 2];
                            return [4 /*yield*/, this.templateLoader.loadTemplate(this, entry)];
                        case 1:
                            _a.sent();
                            _a.label = 2;
                        case 2: return [2 /*return*/, entry];
                    }
                });
            }); }
        });
        __WEBPACK_IMPORTED_MODULE_2_aurelia_pal__["a" /* PLATFORM */].eachModule = function (callback) {
            var registry = __webpack_require__.c;
            var cachedModuleIds = Object.getOwnPropertyNames(registry);
            cachedModuleIds
                // Note: we use .some here like a .forEach that can be "break"ed out of.
                // It will stop iterating only when a truthy value is returned.
                // Even though the docs say "true" explicitly, loader-default also goes by truthy
                // and this is to keep it consistent with that.
                .some(function (moduleId) {
                var moduleExports = registry[moduleId].exports;
                if (typeof moduleExports === 'object') {
                    return callback(moduleId, moduleExports);
                }
                return false;
            });
        };
        return _this;
    }
    WebpackLoader.prototype._import = function (address, defaultHMR) {
        if (defaultHMR === void 0) { defaultHMR = true; }
        return __awaiter(this, void 0, void 0, function () {
            var addressParts, moduleId, loaderPlugin, plugin_1, asyncModuleId, callback;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        addressParts = address.split('!');
                        moduleId = addressParts.splice(addressParts.length - 1, 1)[0];
                        loaderPlugin = addressParts.length === 1 ? addressParts[0] : null;
                        if (!loaderPlugin) return [3 /*break*/, 2];
                        plugin_1 = this.loaderPlugins[loaderPlugin];
                        if (!plugin_1) {
                            throw new Error("Plugin " + loaderPlugin + " is not registered in the loader.");
                        }
                        if (module.hot && plugin_1.hot) {
                            module.hot.accept(moduleId, function () { return plugin_1.hot(moduleId); });
                        }
                        return [4 /*yield*/, plugin_1.fetch(moduleId)];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        if (__webpack_require__.m[moduleId]) {
                            if (defaultHMR && module.hot && this.hmrContext) {
                                module.hot.accept(moduleId, function () { return _this.hmrContext.handleModuleChange(moduleId, module.hot); });
                            }
                            return [2 /*return*/, __webpack_require__(moduleId)];
                        }
                        asyncModuleId = "async!" + moduleId;
                        if (!__webpack_require__.m[asyncModuleId]) return [3 /*break*/, 4];
                        if (defaultHMR && module.hot && this.hmrContext) {
                            module.hot.accept(moduleId, function () { return _this.hmrContext.handleModuleChange(moduleId, module.hot); });
                            module.hot.accept(asyncModuleId, function () { return _this.hmrContext.handleModuleChange(moduleId, module.hot); });
                        }
                        callback = __webpack_require__(asyncModuleId);
                        return [4 /*yield*/, new Promise(callback)];
                    case 3: return [2 /*return*/, _a.sent()];
                    case 4: throw new Error("Unable to find module with ID: " + moduleId);
                }
            });
        });
    };
    /**
    * Maps a module id to a source.
    * @param id The module id.
    * @param source The source to map the module to.
    */
    WebpackLoader.prototype.map = function (id, source) { };
    /**
    * Normalizes a module id.
    * @param moduleId The module id to normalize.
    * @param relativeTo What the module id should be normalized relative to.
    * @return The normalized module id.
    */
    WebpackLoader.prototype.normalizeSync = function (moduleId, relativeTo) {
        return moduleId;
    };
    /**
    * Normalizes a module id.
    * @param moduleId The module id to normalize.
    * @param relativeTo What the module id should be normalized relative to.
    * @return The normalized module id.
    */
    WebpackLoader.prototype.normalize = function (moduleId, relativeTo) {
        return Promise.resolve(moduleId);
    };
    /**
    * Instructs the loader to use a specific TemplateLoader instance for loading templates
    * @param templateLoader The instance of TemplateLoader to use for loading templates.
    */
    WebpackLoader.prototype.useTemplateLoader = function (templateLoader) {
        this.templateLoader = templateLoader;
    };
    /**
    * Loads a collection of modules.
    * @param ids The set of module ids to load.
    * @return A Promise for an array of loaded modules.
    */
    WebpackLoader.prototype.loadAllModules = function (ids) {
        var _this = this;
        return Promise.all(ids.map(function (id) { return _this.loadModule(id); }));
    };
    /**
    * Loads a module.
    * @param moduleId The module ID to load.
    * @return A Promise for the loaded module.
    */
    WebpackLoader.prototype.loadModule = function (moduleId, defaultHMR) {
        if (defaultHMR === void 0) { defaultHMR = true; }
        return __awaiter(this, void 0, void 0, function () {
            var existing, beingLoaded, moduleExports;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        existing = this.moduleRegistry[moduleId];
                        if (existing) {
                            return [2 /*return*/, existing];
                        }
                        beingLoaded = this.modulesBeingLoaded.get(moduleId);
                        if (beingLoaded) {
                            return [2 /*return*/, beingLoaded];
                        }
                        beingLoaded = this._import(moduleId, defaultHMR);
                        this.modulesBeingLoaded.set(moduleId, beingLoaded);
                        return [4 /*yield*/, beingLoaded];
                    case 1:
                        moduleExports = _a.sent();
                        this.moduleRegistry[moduleId] = ensureOriginOnExports(moduleExports, moduleId);
                        this.modulesBeingLoaded.delete(moduleId);
                        return [2 /*return*/, moduleExports];
                }
            });
        });
    };
    /**
    * Loads a template.
    * @param url The url of the template to load.
    * @return A Promise for a TemplateRegistryEntry containing the template.
    */
    WebpackLoader.prototype.loadTemplate = function (url) {
        return this.loadModule(this.applyPluginToUrl(url, 'template-registry-entry'), false);
    };
    /**
    * Loads a text-based resource.
    * @param url The url of the text file to load.
    * @return A Promise for text content.
    */
    WebpackLoader.prototype.loadText = function (url) {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.loadModule(url, false)];
                    case 1:
                        result = _a.sent();
                        if (result instanceof Array && result[0] instanceof Array && result.hasOwnProperty('toString')) {
                            // we're dealing with a file loaded using the css-loader:
                            return [2 /*return*/, result.toString()];
                        }
                        return [2 /*return*/, result];
                }
            });
        });
    };
    /**
    * Alters a module id so that it includes a plugin loader.
    * @param url The url of the module to load.
    * @param pluginName The plugin to apply to the module id.
    * @return The plugin-based module id.
    */
    WebpackLoader.prototype.applyPluginToUrl = function (url, pluginName) {
        return pluginName + "!" + url;
    };
    /**
    * Registers a plugin with the loader.
    * @param pluginName The name of the plugin.
    * @param implementation The plugin implementation.
    */
    WebpackLoader.prototype.addPlugin = function (pluginName, implementation) {
        this.loaderPlugins[pluginName] = implementation;
    };
    return WebpackLoader;
}(__WEBPACK_IMPORTED_MODULE_1_aurelia_loader__["a" /* Loader */]));

__WEBPACK_IMPORTED_MODULE_2_aurelia_pal__["a" /* PLATFORM */].Loader = WebpackLoader;


/***/ }),

/***/ 27:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_aurelia_pal__ = __webpack_require__(0);
var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };



if (typeof FEATURE_NO_ES2015 === 'undefined') {

  (function (Object, GOPS) {
    'use strict';

    if (GOPS in Object) return;

    var setDescriptor,
        G = __WEBPACK_IMPORTED_MODULE_0_aurelia_pal__["a" /* PLATFORM */].global,
        id = 0,
        random = '' + Math.random(),
        prefix = '__\x01symbol:',
        prefixLength = prefix.length,
        internalSymbol = '__\x01symbol@@' + random,
        DP = 'defineProperty',
        DPies = 'defineProperties',
        GOPN = 'getOwnPropertyNames',
        GOPD = 'getOwnPropertyDescriptor',
        PIE = 'propertyIsEnumerable',
        gOPN = Object[GOPN],
        gOPD = Object[GOPD],
        create = Object.create,
        keys = Object.keys,
        defineProperty = Object[DP],
        $defineProperties = Object[DPies],
        descriptor = gOPD(Object, GOPN),
        ObjectProto = Object.prototype,
        hOP = ObjectProto.hasOwnProperty,
        pIE = ObjectProto[PIE],
        toString = ObjectProto.toString,
        indexOf = Array.prototype.indexOf || function (v) {
      for (var i = this.length; i-- && this[i] !== v;) {}
      return i;
    },
        addInternalIfNeeded = function addInternalIfNeeded(o, uid, enumerable) {
      if (!hOP.call(o, internalSymbol)) {
        defineProperty(o, internalSymbol, {
          enumerable: false,
          configurable: false,
          writable: false,
          value: {}
        });
      }
      o[internalSymbol]['@@' + uid] = enumerable;
    },
        createWithSymbols = function createWithSymbols(proto, descriptors) {
      var self = create(proto);
      if (descriptors !== null && (typeof descriptors === 'undefined' ? 'undefined' : _typeof(descriptors)) === 'object') {
        gOPN(descriptors).forEach(function (key) {
          if (propertyIsEnumerable.call(descriptors, key)) {
            $defineProperty(self, key, descriptors[key]);
          }
        });
      }
      return self;
    },
        copyAsNonEnumerable = function copyAsNonEnumerable(descriptor) {
      var newDescriptor = create(descriptor);
      newDescriptor.enumerable = false;
      return newDescriptor;
    },
        get = function get() {},
        onlyNonSymbols = function onlyNonSymbols(name) {
      return name != internalSymbol && !hOP.call(source, name);
    },
        onlySymbols = function onlySymbols(name) {
      return name != internalSymbol && hOP.call(source, name);
    },
        propertyIsEnumerable = function propertyIsEnumerable(key) {
      var uid = '' + key;
      return onlySymbols(uid) ? hOP.call(this, uid) && this[internalSymbol] && this[internalSymbol]['@@' + uid] : pIE.call(this, key);
    },
        setAndGetSymbol = function setAndGetSymbol(uid) {
      var descriptor = {
        enumerable: false,
        configurable: true,
        get: get,
        set: function set(value) {
          setDescriptor(this, uid, {
            enumerable: false,
            configurable: true,
            writable: true,
            value: value
          });
          addInternalIfNeeded(this, uid, true);
        }
      };
      defineProperty(ObjectProto, uid, descriptor);
      return source[uid] = defineProperty(Object(uid), 'constructor', sourceConstructor);
    },
        _Symbol = function _Symbol2(description) {
      if (this && this !== G) {
        throw new TypeError('Symbol is not a constructor');
      }
      return setAndGetSymbol(prefix.concat(description || '', random, ++id));
    },
        source = create(null),
        sourceConstructor = { value: _Symbol },
        sourceMap = function sourceMap(uid) {
      return source[uid];
    },
        $defineProperty = function defineProp(o, key, descriptor) {
      var uid = '' + key;
      if (onlySymbols(uid)) {
        setDescriptor(o, uid, descriptor.enumerable ? copyAsNonEnumerable(descriptor) : descriptor);
        addInternalIfNeeded(o, uid, !!descriptor.enumerable);
      } else {
        defineProperty(o, key, descriptor);
      }
      return o;
    },
        $getOwnPropertySymbols = function getOwnPropertySymbols(o) {
      var cof = toString.call(o);
      o = cof === '[object String]' ? o.split('') : Object(o);
      return gOPN(o).filter(onlySymbols).map(sourceMap);
    };

    descriptor.value = $defineProperty;
    defineProperty(Object, DP, descriptor);

    descriptor.value = $getOwnPropertySymbols;
    defineProperty(Object, GOPS, descriptor);

    var cachedWindowNames = (typeof window === 'undefined' ? 'undefined' : _typeof(window)) === 'object' ? Object.getOwnPropertyNames(window) : [];
    var originalObjectGetOwnPropertyNames = Object.getOwnPropertyNames;
    descriptor.value = function getOwnPropertyNames(o) {
      if (toString.call(o) === '[object Window]') {
        try {
          return originalObjectGetOwnPropertyNames(o);
        } catch (e) {
          return [].concat([], cachedWindowNames);
        }
      }
      return gOPN(o).filter(onlyNonSymbols);
    };
    defineProperty(Object, GOPN, descriptor);

    descriptor.value = function defineProperties(o, descriptors) {
      var symbols = $getOwnPropertySymbols(descriptors);
      if (symbols.length) {
        keys(descriptors).concat(symbols).forEach(function (uid) {
          if (propertyIsEnumerable.call(descriptors, uid)) {
            $defineProperty(o, uid, descriptors[uid]);
          }
        });
      } else {
        $defineProperties(o, descriptors);
      }
      return o;
    };
    defineProperty(Object, DPies, descriptor);

    descriptor.value = propertyIsEnumerable;
    defineProperty(ObjectProto, PIE, descriptor);

    descriptor.value = _Symbol;
    defineProperty(G, 'Symbol', descriptor);

    descriptor.value = function (key) {
      var uid = prefix.concat(prefix, key, random);
      return uid in ObjectProto ? source[uid] : setAndGetSymbol(uid);
    };
    defineProperty(_Symbol, 'for', descriptor);

    descriptor.value = function (symbol) {
      return hOP.call(source, symbol) ? symbol.slice(prefixLength * 2, -random.length) : void 0;
    };
    defineProperty(_Symbol, 'keyFor', descriptor);

    descriptor.value = function getOwnPropertyDescriptor(o, key) {
      var descriptor = gOPD(o, key);
      if (descriptor && onlySymbols(key)) {
        descriptor.enumerable = propertyIsEnumerable.call(o, key);
      }
      return descriptor;
    };
    defineProperty(Object, GOPD, descriptor);

    descriptor.value = function (proto, descriptors) {
      return arguments.length === 1 ? create(proto) : createWithSymbols(proto, descriptors);
    };
    defineProperty(Object, 'create', descriptor);

    descriptor.value = function () {
      var str = toString.call(this);
      return str === '[object String]' && onlySymbols(this) ? '[object Symbol]' : str;
    };
    defineProperty(ObjectProto, 'toString', descriptor);

    try {
      setDescriptor = create(defineProperty({}, prefix, {
        get: function get() {
          return defineProperty(this, prefix, { value: false })[prefix];
        }
      }))[prefix] || defineProperty;
    } catch (o_O) {
      setDescriptor = function setDescriptor(o, key, descriptor) {
        var protoDescriptor = gOPD(ObjectProto, key);
        delete ObjectProto[key];
        defineProperty(o, key, descriptor);
        defineProperty(ObjectProto, key, protoDescriptor);
      };
    }
  })(Object, 'getOwnPropertySymbols');

  (function (O, S) {
    var dP = O.defineProperty,
        ObjectProto = O.prototype,
        toString = ObjectProto.toString,
        toStringTag = 'toStringTag',
        descriptor;
    ['iterator', 'match', 'replace', 'search', 'split', 'hasInstance', 'isConcatSpreadable', 'unscopables', 'species', 'toPrimitive', toStringTag].forEach(function (name) {
      if (!(name in Symbol)) {
        dP(Symbol, name, { value: Symbol(name) });
        switch (name) {
          case toStringTag:
            descriptor = O.getOwnPropertyDescriptor(ObjectProto, 'toString');
            descriptor.value = function () {
              var str = toString.call(this),
                  tst = typeof this === 'undefined' || this === null ? undefined : this[Symbol.toStringTag];
              return typeof tst === 'undefined' ? str : '[object ' + tst + ']';
            };
            dP(ObjectProto, 'toString', descriptor);
            break;
        }
      }
    });
  })(Object, Symbol);

  (function (Si, AP, SP) {

    function returnThis() {
      return this;
    }

    if (!AP[Si]) AP[Si] = function () {
      var i = 0,
          self = this,
          iterator = {
        next: function next() {
          var done = self.length <= i;
          return done ? { done: done } : { done: done, value: self[i++] };
        }
      };
      iterator[Si] = returnThis;
      return iterator;
    };

    if (!SP[Si]) SP[Si] = function () {
      var fromCodePoint = String.fromCodePoint,
          self = this,
          i = 0,
          length = self.length,
          iterator = {
        next: function next() {
          var done = length <= i,
              c = done ? '' : fromCodePoint(self.codePointAt(i));
          i += c.length;
          return done ? { done: done } : { done: done, value: c };
        }
      };
      iterator[Si] = returnThis;
      return iterator;
    };
  })(Symbol.iterator, Array.prototype, String.prototype);
}

if (typeof FEATURE_NO_ES2015 === 'undefined') {

  Number.isNaN = Number.isNaN || function (value) {
    return value !== value;
  };

  Number.isFinite = Number.isFinite || function (value) {
    return typeof value === "number" && isFinite(value);
  };
}

if (!String.prototype.endsWith || function () {
  try {
    return !"ab".endsWith("a", 1);
  } catch (e) {
    return true;
  }
}()) {
  String.prototype.endsWith = function (searchString, position) {
    var subjectString = this.toString();
    if (typeof position !== 'number' || !isFinite(position) || Math.floor(position) !== position || position > subjectString.length) {
      position = subjectString.length;
    }
    position -= searchString.length;
    var lastIndex = subjectString.indexOf(searchString, position);
    return lastIndex !== -1 && lastIndex === position;
  };
}

if (!String.prototype.startsWith || function () {
  try {
    return !"ab".startsWith("b", 1);
  } catch (e) {
    return true;
  }
}()) {
  String.prototype.startsWith = function (searchString, position) {
    position = position || 0;
    return this.substr(position, searchString.length) === searchString;
  };
}

if (typeof FEATURE_NO_ES2015 === 'undefined') {

  if (!Array.from) {
    Array.from = function () {
      var toInteger = function toInteger(it) {
        return isNaN(it = +it) ? 0 : (it > 0 ? Math.floor : Math.ceil)(it);
      };
      var toLength = function toLength(it) {
        return it > 0 ? Math.min(toInteger(it), 0x1fffffffffffff) : 0;
      };
      var iterCall = function iterCall(iter, fn, val, index) {
        try {
          return fn(val, index);
        } catch (E) {
          if (typeof iter.return == 'function') iter.return();
          throw E;
        }
      };

      return function from(arrayLike) {
        var O = Object(arrayLike),
            C = typeof this == 'function' ? this : Array,
            aLen = arguments.length,
            mapfn = aLen > 1 ? arguments[1] : undefined,
            mapping = mapfn !== undefined,
            index = 0,
            iterFn = O[Symbol.iterator],
            length,
            result,
            step,
            iterator;
        if (mapping) mapfn = mapfn.bind(aLen > 2 ? arguments[2] : undefined);
        if (iterFn != undefined && !Array.isArray(arrayLike)) {
          for (iterator = iterFn.call(O), result = new C(); !(step = iterator.next()).done; index++) {
            result[index] = mapping ? iterCall(iterator, mapfn, step.value, index) : step.value;
          }
        } else {
          length = toLength(O.length);
          for (result = new C(length); length > index; index++) {
            result[index] = mapping ? mapfn(O[index], index) : O[index];
          }
        }
        result.length = index;
        return result;
      };
    }();
  }

  if (!Array.prototype.find) {
    Object.defineProperty(Array.prototype, 'find', {
      configurable: true,
      writable: true,
      enumerable: false,
      value: function value(predicate) {
        if (this === null) {
          throw new TypeError('Array.prototype.find called on null or undefined');
        }
        if (typeof predicate !== 'function') {
          throw new TypeError('predicate must be a function');
        }
        var list = Object(this);
        var length = list.length >>> 0;
        var thisArg = arguments[1];
        var value;

        for (var i = 0; i < length; i++) {
          value = list[i];
          if (predicate.call(thisArg, value, i, list)) {
            return value;
          }
        }
        return undefined;
      }
    });
  }

  if (!Array.prototype.findIndex) {
    Object.defineProperty(Array.prototype, 'findIndex', {
      configurable: true,
      writable: true,
      enumerable: false,
      value: function value(predicate) {
        if (this === null) {
          throw new TypeError('Array.prototype.findIndex called on null or undefined');
        }
        if (typeof predicate !== 'function') {
          throw new TypeError('predicate must be a function');
        }
        var list = Object(this);
        var length = list.length >>> 0;
        var thisArg = arguments[1];
        var value;

        for (var i = 0; i < length; i++) {
          value = list[i];
          if (predicate.call(thisArg, value, i, list)) {
            return i;
          }
        }
        return -1;
      }
    });
  }
}

if (typeof FEATURE_NO_ES2016 === 'undefined' && !Array.prototype.includes) {
  Object.defineProperty(Array.prototype, 'includes', {
    configurable: true,
    writable: true,
    enumerable: false,
    value: function value(searchElement) {
      var O = Object(this);
      var len = parseInt(O.length) || 0;
      if (len === 0) {
        return false;
      }
      var n = parseInt(arguments[1]) || 0;
      var k;
      if (n >= 0) {
        k = n;
      } else {
        k = len + n;
        if (k < 0) {
          k = 0;
        }
      }
      var currentElement;
      while (k < len) {
        currentElement = O[k];
        if (searchElement === currentElement || searchElement !== searchElement && currentElement !== currentElement) {
          return true;
        }
        k++;
      }
      return false;
    }
  });
}

if (typeof FEATURE_NO_ES2015 === 'undefined') {

  (function () {
    var needsFix = false;

    try {
      var s = Object.keys('a');
      needsFix = s.length !== 1 || s[0] !== '0';
    } catch (e) {
      needsFix = true;
    }

    if (needsFix) {
      Object.keys = function () {
        var hasOwnProperty = Object.prototype.hasOwnProperty,
            hasDontEnumBug = !{ toString: null }.propertyIsEnumerable('toString'),
            dontEnums = ['toString', 'toLocaleString', 'valueOf', 'hasOwnProperty', 'isPrototypeOf', 'propertyIsEnumerable', 'constructor'],
            dontEnumsLength = dontEnums.length;

        return function (obj) {
          if (obj === undefined || obj === null) {
            throw TypeError('Cannot convert undefined or null to object');
          }

          obj = Object(obj);

          var result = [],
              prop,
              i;

          for (prop in obj) {
            if (hasOwnProperty.call(obj, prop)) {
              result.push(prop);
            }
          }

          if (hasDontEnumBug) {
            for (i = 0; i < dontEnumsLength; i++) {
              if (hasOwnProperty.call(obj, dontEnums[i])) {
                result.push(dontEnums[i]);
              }
            }
          }

          return result;
        };
      }();
    }
  })();

  (function (O) {
    if ('assign' in O) {
      return;
    }

    O.defineProperty(O, 'assign', {
      configurable: true,
      writable: true,
      value: function () {
        var gOPS = O.getOwnPropertySymbols,
            pIE = O.propertyIsEnumerable,
            filterOS = gOPS ? function (self) {
          return gOPS(self).filter(pIE, self);
        } : function () {
          return Array.prototype;
        };

        return function assign(where) {
          if (gOPS && !(where instanceof O)) {
            console.warn('problematic Symbols', where);
          }

          function set(keyOrSymbol) {
            where[keyOrSymbol] = arg[keyOrSymbol];
          }

          for (var i = 1, ii = arguments.length; i < ii; ++i) {
            var arg = arguments[i];

            if (arg === null || arg === undefined) {
              continue;
            }

            O.keys(arg).concat(filterOS(arg)).forEach(set);
          }

          return where;
        };
      }()
    });
  })(Object);

  if (!Object.is) {
    Object.is = function (x, y) {
      if (x === y) {
        return x !== 0 || 1 / x === 1 / y;
      } else {
        return x !== x && y !== y;
      }
    };
  }
}

if (typeof FEATURE_NO_ES2015 === 'undefined') {

  (function (global) {
    var i;

    var defineProperty = Object.defineProperty,
        is = function is(a, b) {
      return a === b || a !== a && b !== b;
    };

    if (typeof WeakMap == 'undefined') {
      global.WeakMap = createCollection({
        'delete': sharedDelete,

        clear: sharedClear,

        get: sharedGet,

        has: mapHas,

        set: sharedSet
      }, true);
    }

    if (typeof Map == 'undefined' || typeof new Map().values !== 'function' || !new Map().values().next) {
      var _createCollection;

      global.Map = createCollection((_createCollection = {
        'delete': sharedDelete,

        has: mapHas,

        get: sharedGet,

        set: sharedSet,

        keys: sharedKeys,

        values: sharedValues,

        entries: mapEntries,

        forEach: sharedForEach,

        clear: sharedClear
      }, _createCollection[Symbol.iterator] = mapEntries, _createCollection));
    }

    if (typeof Set == 'undefined' || typeof new Set().values !== 'function' || !new Set().values().next) {
      var _createCollection2;

      global.Set = createCollection((_createCollection2 = {
        has: setHas,

        add: sharedAdd,

        'delete': sharedDelete,

        clear: sharedClear,

        keys: sharedValues,
        values: sharedValues,

        entries: setEntries,

        forEach: sharedForEach
      }, _createCollection2[Symbol.iterator] = sharedValues, _createCollection2));
    }

    if (typeof WeakSet == 'undefined') {
      global.WeakSet = createCollection({
        'delete': sharedDelete,

        add: sharedAdd,

        clear: sharedClear,

        has: setHas
      }, true);
    }

    function createCollection(proto, objectOnly) {
      function Collection(a) {
        if (!this || this.constructor !== Collection) return new Collection(a);
        this._keys = [];
        this._values = [];
        this._itp = [];
        this.objectOnly = objectOnly;

        if (a) init.call(this, a);
      }

      if (!objectOnly) {
        defineProperty(proto, 'size', {
          get: sharedSize
        });
      }

      proto.constructor = Collection;
      Collection.prototype = proto;

      return Collection;
    }

    function init(a) {
      var i;

      if (this.add) a.forEach(this.add, this);else a.forEach(function (a) {
          this.set(a[0], a[1]);
        }, this);
    }

    function sharedDelete(key) {
      if (this.has(key)) {
        this._keys.splice(i, 1);
        this._values.splice(i, 1);

        this._itp.forEach(function (p) {
          if (i < p[0]) p[0]--;
        });
      }

      return -1 < i;
    };

    function sharedGet(key) {
      return this.has(key) ? this._values[i] : undefined;
    }

    function has(list, key) {
      if (this.objectOnly && key !== Object(key)) throw new TypeError("Invalid value used as weak collection key");

      if (key != key || key === 0) for (i = list.length; i-- && !is(list[i], key);) {} else i = list.indexOf(key);
      return -1 < i;
    }

    function setHas(value) {
      return has.call(this, this._values, value);
    }

    function mapHas(value) {
      return has.call(this, this._keys, value);
    }

    function sharedSet(key, value) {
      this.has(key) ? this._values[i] = value : this._values[this._keys.push(key) - 1] = value;
      return this;
    }

    function sharedAdd(value) {
      if (!this.has(value)) this._values.push(value);
      return this;
    }

    function sharedClear() {
      (this._keys || 0).length = this._values.length = 0;
    }

    function sharedKeys() {
      return sharedIterator(this._itp, this._keys);
    }

    function sharedValues() {
      return sharedIterator(this._itp, this._values);
    }

    function mapEntries() {
      return sharedIterator(this._itp, this._keys, this._values);
    }

    function setEntries() {
      return sharedIterator(this._itp, this._values, this._values);
    }

    function sharedIterator(itp, array, array2) {
      var _ref;

      var p = [0],
          done = false;
      itp.push(p);
      return _ref = {}, _ref[Symbol.iterator] = function () {
        return this;
      }, _ref.next = function next() {
        var v,
            k = p[0];
        if (!done && k < array.length) {
          v = array2 ? [array[k], array2[k]] : array[k];
          p[0]++;
        } else {
          done = true;
          itp.splice(itp.indexOf(p), 1);
        }
        return { done: done, value: v };
      }, _ref;
    }

    function sharedSize() {
      return this._values.length;
    }

    function sharedForEach(callback, context) {
      var it = this.entries();
      for (;;) {
        var r = it.next();
        if (r.done) break;
        callback.call(context, r.value[1], r.value[0], this);
      }
    }
  })(__WEBPACK_IMPORTED_MODULE_0_aurelia_pal__["a" /* PLATFORM */].global);
}

if (typeof FEATURE_NO_ES2015 === 'undefined') {

  var bind = Function.prototype.bind;

  if (typeof __WEBPACK_IMPORTED_MODULE_0_aurelia_pal__["a" /* PLATFORM */].global.Reflect === 'undefined') {
    __WEBPACK_IMPORTED_MODULE_0_aurelia_pal__["a" /* PLATFORM */].global.Reflect = {};
  }

  if (typeof Reflect.defineProperty !== 'function') {
    Reflect.defineProperty = function (target, propertyKey, descriptor) {
      if ((typeof target === 'undefined' ? 'undefined' : _typeof(target)) === 'object' ? target === null : typeof target !== 'function') {
        throw new TypeError('Reflect.defineProperty called on non-object');
      }
      try {
        Object.defineProperty(target, propertyKey, descriptor);
        return true;
      } catch (e) {
        return false;
      }
    };
  }

  if (typeof Reflect.construct !== 'function') {
    Reflect.construct = function (Target, args) {
      if (args) {
        switch (args.length) {
          case 0:
            return new Target();
          case 1:
            return new Target(args[0]);
          case 2:
            return new Target(args[0], args[1]);
          case 3:
            return new Target(args[0], args[1], args[2]);
          case 4:
            return new Target(args[0], args[1], args[2], args[3]);
        }
      }

      var a = [null];
      a.push.apply(a, args);
      return new (bind.apply(Target, a))();
    };
  }

  if (typeof Reflect.ownKeys !== 'function') {
    Reflect.ownKeys = function (o) {
      return Object.getOwnPropertyNames(o).concat(Object.getOwnPropertySymbols(o));
    };
  }
}

if (typeof FEATURE_NO_ESNEXT === 'undefined') {

  var emptyMetadata = Object.freeze({});
  var metadataContainerKey = '__metadata__';

  if (typeof Reflect.getOwnMetadata !== 'function') {
    Reflect.getOwnMetadata = function (metadataKey, target, targetKey) {
      if (target.hasOwnProperty(metadataContainerKey)) {
        return (target[metadataContainerKey][targetKey] || emptyMetadata)[metadataKey];
      }
    };
  }

  if (typeof Reflect.defineMetadata !== 'function') {
    Reflect.defineMetadata = function (metadataKey, metadataValue, target, targetKey) {
      var metadataContainer = target.hasOwnProperty(metadataContainerKey) ? target[metadataContainerKey] : target[metadataContainerKey] = {};
      var targetContainer = metadataContainer[targetKey] || (metadataContainer[targetKey] = {});
      targetContainer[metadataKey] = metadataValue;
    };
  }

  if (typeof Reflect.metadata !== 'function') {
    Reflect.metadata = function (metadataKey, metadataValue) {
      return function (target, targetKey) {
        Reflect.defineMetadata(metadataKey, metadataValue, target, targetKey);
      };
    };
  }
}

/***/ }),

/***/ 28:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export State */
/* unused harmony export StaticSegment */
/* unused harmony export DynamicSegment */
/* unused harmony export StarSegment */
/* unused harmony export EpsilonSegment */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return RouteRecognizer; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_aurelia_path__ = __webpack_require__(4);




var State = function () {
  function State(charSpec) {
    

    this.charSpec = charSpec;
    this.nextStates = [];
  }

  State.prototype.get = function get(charSpec) {
    for (var _iterator = this.nextStates, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
      var _ref;

      if (_isArray) {
        if (_i >= _iterator.length) break;
        _ref = _iterator[_i++];
      } else {
        _i = _iterator.next();
        if (_i.done) break;
        _ref = _i.value;
      }

      var child = _ref;

      var isEqual = child.charSpec.validChars === charSpec.validChars && child.charSpec.invalidChars === charSpec.invalidChars;

      if (isEqual) {
        return child;
      }
    }

    return undefined;
  };

  State.prototype.put = function put(charSpec) {
    var state = this.get(charSpec);

    if (state) {
      return state;
    }

    state = new State(charSpec);

    this.nextStates.push(state);

    if (charSpec.repeat) {
      state.nextStates.push(state);
    }

    return state;
  };

  State.prototype.match = function match(ch) {
    var nextStates = this.nextStates;
    var results = [];

    for (var i = 0, l = nextStates.length; i < l; i++) {
      var child = nextStates[i];
      var charSpec = child.charSpec;

      if (charSpec.validChars !== undefined) {
        if (charSpec.validChars.indexOf(ch) !== -1) {
          results.push(child);
        }
      } else if (charSpec.invalidChars !== undefined) {
        if (charSpec.invalidChars.indexOf(ch) === -1) {
          results.push(child);
        }
      }
    }

    return results;
  };

  return State;
}();

var specials = ['/', '.', '*', '+', '?', '|', '(', ')', '[', ']', '{', '}', '\\'];

var escapeRegex = new RegExp('(\\' + specials.join('|\\') + ')', 'g');

var StaticSegment = function () {
  function StaticSegment(string, caseSensitive) {
    

    this.string = string;
    this.caseSensitive = caseSensitive;
  }

  StaticSegment.prototype.eachChar = function eachChar(callback) {
    var s = this.string;
    for (var i = 0, ii = s.length; i < ii; ++i) {
      var ch = s[i];
      callback({ validChars: this.caseSensitive ? ch : ch.toUpperCase() + ch.toLowerCase() });
    }
  };

  StaticSegment.prototype.regex = function regex() {
    return this.string.replace(escapeRegex, '\\$1');
  };

  StaticSegment.prototype.generate = function generate() {
    return this.string;
  };

  return StaticSegment;
}();

var DynamicSegment = function () {
  function DynamicSegment(name, optional) {
    

    this.name = name;
    this.optional = optional;
  }

  DynamicSegment.prototype.eachChar = function eachChar(callback) {
    callback({ invalidChars: '/', repeat: true });
  };

  DynamicSegment.prototype.regex = function regex() {
    return '([^/]+)';
  };

  DynamicSegment.prototype.generate = function generate(params, consumed) {
    consumed[this.name] = true;
    return params[this.name];
  };

  return DynamicSegment;
}();

var StarSegment = function () {
  function StarSegment(name) {
    

    this.name = name;
  }

  StarSegment.prototype.eachChar = function eachChar(callback) {
    callback({ invalidChars: '', repeat: true });
  };

  StarSegment.prototype.regex = function regex() {
    return '(.+)';
  };

  StarSegment.prototype.generate = function generate(params, consumed) {
    consumed[this.name] = true;
    return params[this.name];
  };

  return StarSegment;
}();

var EpsilonSegment = function () {
  function EpsilonSegment() {
    
  }

  EpsilonSegment.prototype.eachChar = function eachChar() {};

  EpsilonSegment.prototype.regex = function regex() {
    return '';
  };

  EpsilonSegment.prototype.generate = function generate() {
    return '';
  };

  return EpsilonSegment;
}();

var RouteRecognizer = function () {
  function RouteRecognizer() {
    

    this.rootState = new State();
    this.names = {};
    this.routes = new Map();
  }

  RouteRecognizer.prototype.add = function add(route) {
    var _this = this;

    if (Array.isArray(route)) {
      route.forEach(function (r) {
        return _this.add(r);
      });
      return undefined;
    }

    var currentState = this.rootState;
    var skippableStates = [];
    var regex = '^';
    var types = { statics: 0, dynamics: 0, stars: 0 };
    var names = [];
    var routeName = route.handler.name;
    var isEmpty = true;
    var segments = parse(route.path, names, types, route.caseSensitive);

    for (var i = 0, ii = segments.length; i < ii; i++) {
      var segment = segments[i];
      if (segment instanceof EpsilonSegment) {
        continue;
      }

      var _addSegment = addSegment(currentState, segment),
          firstState = _addSegment[0],
          nextState = _addSegment[1];

      for (var j = 0, jj = skippableStates.length; j < jj; j++) {
        skippableStates[j].nextStates.push(firstState);
      }

      if (segment.optional) {
        skippableStates.push(nextState);
        regex += '(?:/' + segment.regex() + ')?';
      } else {
        currentState = nextState;
        regex += '/' + segment.regex();
        skippableStates.length = 0;
        isEmpty = false;
      }
    }

    if (isEmpty) {
      currentState = currentState.put({ validChars: '/' });
      regex += '/?';
    }

    var handlers = [{ handler: route.handler, names: names }];

    this.routes.set(route.handler, { segments: segments, handlers: handlers });
    if (routeName) {
      var routeNames = Array.isArray(routeName) ? routeName : [routeName];
      for (var _i2 = 0; _i2 < routeNames.length; _i2++) {
        if (!(routeNames[_i2] in this.names)) {
          this.names[routeNames[_i2]] = { segments: segments, handlers: handlers };
        }
      }
    }

    for (var _i3 = 0; _i3 < skippableStates.length; _i3++) {
      var state = skippableStates[_i3];
      state.handlers = handlers;
      state.regex = new RegExp(regex + '$', route.caseSensitive ? '' : 'i');
      state.types = types;
    }

    currentState.handlers = handlers;
    currentState.regex = new RegExp(regex + '$', route.caseSensitive ? '' : 'i');
    currentState.types = types;

    return currentState;
  };

  RouteRecognizer.prototype.getRoute = function getRoute(nameOrRoute) {
    return typeof nameOrRoute === 'string' ? this.names[nameOrRoute] : this.routes.get(nameOrRoute);
  };

  RouteRecognizer.prototype.handlersFor = function handlersFor(nameOrRoute) {
    var route = this.getRoute(nameOrRoute);
    if (!route) {
      throw new Error('There is no route named ' + nameOrRoute);
    }

    return [].concat(route.handlers);
  };

  RouteRecognizer.prototype.hasRoute = function hasRoute(nameOrRoute) {
    return !!this.getRoute(nameOrRoute);
  };

  RouteRecognizer.prototype.generate = function generate(nameOrRoute, params) {
    var route = this.getRoute(nameOrRoute);
    if (!route) {
      throw new Error('There is no route named ' + nameOrRoute);
    }

    var handler = route.handlers[0].handler;
    if (handler.generationUsesHref) {
      return handler.href;
    }

    var routeParams = Object.assign({}, params);
    var segments = route.segments;
    var consumed = {};
    var output = '';

    for (var i = 0, l = segments.length; i < l; i++) {
      var segment = segments[i];

      if (segment instanceof EpsilonSegment) {
        continue;
      }

      var segmentValue = segment.generate(routeParams, consumed);
      if (segmentValue === null || segmentValue === undefined) {
        if (!segment.optional) {
          throw new Error('A value is required for route parameter \'' + segment.name + '\' in route \'' + nameOrRoute + '\'.');
        }
      } else {
        output += '/';
        output += segmentValue;
      }
    }

    if (output.charAt(0) !== '/') {
      output = '/' + output;
    }

    for (var param in consumed) {
      delete routeParams[param];
    }

    var queryString = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0_aurelia_path__["c" /* buildQueryString */])(routeParams);
    output += queryString ? '?' + queryString : '';

    return output;
  };

  RouteRecognizer.prototype.recognize = function recognize(path) {
    var states = [this.rootState];
    var queryParams = {};
    var isSlashDropped = false;
    var normalizedPath = path;

    var queryStart = normalizedPath.indexOf('?');
    if (queryStart !== -1) {
      var queryString = normalizedPath.substr(queryStart + 1, normalizedPath.length);
      normalizedPath = normalizedPath.substr(0, queryStart);
      queryParams = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0_aurelia_path__["d" /* parseQueryString */])(queryString);
    }

    normalizedPath = decodeURI(normalizedPath);

    if (normalizedPath.charAt(0) !== '/') {
      normalizedPath = '/' + normalizedPath;
    }

    var pathLen = normalizedPath.length;
    if (pathLen > 1 && normalizedPath.charAt(pathLen - 1) === '/') {
      normalizedPath = normalizedPath.substr(0, pathLen - 1);
      isSlashDropped = true;
    }

    for (var i = 0, l = normalizedPath.length; i < l; i++) {
      states = recognizeChar(states, normalizedPath.charAt(i));
      if (!states.length) {
        break;
      }
    }

    var solutions = [];
    for (var _i4 = 0, _l = states.length; _i4 < _l; _i4++) {
      if (states[_i4].handlers) {
        solutions.push(states[_i4]);
      }
    }

    states = sortSolutions(solutions);

    var state = solutions[0];
    if (state && state.handlers) {
      if (isSlashDropped && state.regex.source.slice(-5) === '(.+)$') {
        normalizedPath = normalizedPath + '/';
      }

      return findHandler(state, normalizedPath, queryParams);
    }
  };

  return RouteRecognizer;
}();

var RecognizeResults = function RecognizeResults(queryParams) {
  

  this.splice = Array.prototype.splice;
  this.slice = Array.prototype.slice;
  this.push = Array.prototype.push;
  this.length = 0;
  this.queryParams = queryParams || {};
};

function parse(route, names, types, caseSensitive) {
  var normalizedRoute = route;
  if (route.charAt(0) === '/') {
    normalizedRoute = route.substr(1);
  }

  var results = [];

  var splitRoute = normalizedRoute.split('/');
  for (var i = 0, ii = splitRoute.length; i < ii; ++i) {
    var segment = splitRoute[i];

    var match = segment.match(/^:([^?]+)(\?)?$/);
    if (match) {
      var _match = match,
          _name = _match[1],
          optional = _match[2];

      if (_name.indexOf('=') !== -1) {
        throw new Error('Parameter ' + _name + ' in route ' + route + ' has a default value, which is not supported.');
      }
      results.push(new DynamicSegment(_name, !!optional));
      names.push(_name);
      types.dynamics++;
      continue;
    }

    match = segment.match(/^\*(.+)$/);
    if (match) {
      results.push(new StarSegment(match[1]));
      names.push(match[1]);
      types.stars++;
    } else if (segment === '') {
      results.push(new EpsilonSegment());
    } else {
      results.push(new StaticSegment(segment, caseSensitive));
      types.statics++;
    }
  }

  return results;
}

function sortSolutions(states) {
  return states.sort(function (a, b) {
    if (a.types.stars !== b.types.stars) {
      return a.types.stars - b.types.stars;
    }

    if (a.types.stars) {
      if (a.types.statics !== b.types.statics) {
        return b.types.statics - a.types.statics;
      }
      if (a.types.dynamics !== b.types.dynamics) {
        return b.types.dynamics - a.types.dynamics;
      }
    }

    if (a.types.dynamics !== b.types.dynamics) {
      return a.types.dynamics - b.types.dynamics;
    }

    if (a.types.statics !== b.types.statics) {
      return b.types.statics - a.types.statics;
    }

    return 0;
  });
}

function recognizeChar(states, ch) {
  var nextStates = [];

  for (var i = 0, l = states.length; i < l; i++) {
    var state = states[i];
    nextStates.push.apply(nextStates, state.match(ch));
  }

  return nextStates;
}

function findHandler(state, path, queryParams) {
  var handlers = state.handlers;
  var regex = state.regex;
  var captures = path.match(regex);
  var currentCapture = 1;
  var result = new RecognizeResults(queryParams);

  for (var i = 0, l = handlers.length; i < l; i++) {
    var _handler = handlers[i];
    var _names = _handler.names;
    var _params = {};

    for (var j = 0, m = _names.length; j < m; j++) {
      _params[_names[j]] = captures[currentCapture++];
    }

    result.push({ handler: _handler.handler, params: _params, isDynamic: !!_names.length });
  }

  return result;
}

function addSegment(currentState, segment) {
  var firstState = currentState.put({ validChars: '/' });
  var nextState = firstState;
  segment.eachChar(function (ch) {
    nextState = nextState.put(ch);
  });

  return [firstState, nextState];
}

/***/ }),

/***/ 29:
/***/ (function(module, exports, __webpack_require__) {

module.exports = {
  XmlEntities: __webpack_require__(31),
  Html4Entities: __webpack_require__(30),
  Html5Entities: __webpack_require__(14),
  AllHtmlEntities: __webpack_require__(14)
};


/***/ }),

/***/ 3:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "logLevel", function() { return logLevel; });
/* harmony export (immutable) */ __webpack_exports__["getLogger"] = getLogger;
/* harmony export (immutable) */ __webpack_exports__["addAppender"] = addAppender;
/* harmony export (immutable) */ __webpack_exports__["removeAppender"] = removeAppender;
/* harmony export (immutable) */ __webpack_exports__["getAppenders"] = getAppenders;
/* harmony export (immutable) */ __webpack_exports__["clearAppenders"] = clearAppenders;
/* harmony export (immutable) */ __webpack_exports__["addCustomLevel"] = addCustomLevel;
/* harmony export (immutable) */ __webpack_exports__["removeCustomLevel"] = removeCustomLevel;
/* harmony export (immutable) */ __webpack_exports__["setLevel"] = setLevel;
/* harmony export (immutable) */ __webpack_exports__["getLevel"] = getLevel;
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Logger", function() { return Logger; });


var logLevel = {
  none: 0,
  error: 10,
  warn: 20,
  info: 30,
  debug: 40
};

var loggers = {};
var appenders = [];
var globalDefaultLevel = logLevel.none;

var standardLevels = ['none', 'error', 'warn', 'info', 'debug'];
function isStandardLevel(level) {
  return standardLevels.filter(function (l) {
    return l === level;
  }).length > 0;
}

function appendArgs() {
  return [this].concat(Array.prototype.slice.call(arguments));
}

function logFactory(level) {
  var threshold = logLevel[level];
  return function () {
    if (this.level < threshold) {
      return;
    }

    var args = appendArgs.apply(this, arguments);
    var i = appenders.length;
    while (i--) {
      var _appenders$i;

      (_appenders$i = appenders[i])[level].apply(_appenders$i, args);
    }
  };
}

function logFactoryCustom(level) {
  var threshold = logLevel[level];
  return function () {
    if (this.level < threshold) {
      return;
    }

    var args = appendArgs.apply(this, arguments);
    var i = appenders.length;
    while (i--) {
      var appender = appenders[i];
      if (appender[level] !== undefined) {
        appender[level].apply(appender, args);
      }
    }
  };
}

function connectLoggers() {
  var proto = Logger.prototype;
  for (var _level in logLevel) {
    if (isStandardLevel(_level)) {
      if (_level !== 'none') {
        proto[_level] = logFactory(_level);
      }
    } else {
      proto[_level] = logFactoryCustom(_level);
    }
  }
}

function disconnectLoggers() {
  var proto = Logger.prototype;
  for (var _level2 in logLevel) {
    if (_level2 !== 'none') {
      proto[_level2] = function () {};
    }
  }
}

function getLogger(id) {
  return loggers[id] || new Logger(id);
}

function addAppender(appender) {
  if (appenders.push(appender) === 1) {
    connectLoggers();
  }
}

function removeAppender(appender) {
  appenders = appenders.filter(function (a) {
    return a !== appender;
  });
}

function getAppenders() {
  return [].concat(appenders);
}

function clearAppenders() {
  appenders = [];
  disconnectLoggers();
}

function addCustomLevel(name, value) {
  if (logLevel[name] !== undefined) {
    throw Error('Log level "' + name + '" already exists.');
  }

  if (isNaN(value)) {
    throw Error('Value must be a number.');
  }

  logLevel[name] = value;

  if (appenders.length > 0) {
    connectLoggers();
  } else {
    Logger.prototype[name] = function () {};
  }
}

function removeCustomLevel(name) {
  if (logLevel[name] === undefined) {
    return;
  }

  if (isStandardLevel(name)) {
    throw Error('Built-in log level "' + name + '" cannot be removed.');
  }

  delete logLevel[name];
  delete Logger.prototype[name];
}

function setLevel(level) {
  globalDefaultLevel = level;
  for (var key in loggers) {
    loggers[key].setLevel(level);
  }
}

function getLevel() {
  return globalDefaultLevel;
}

var Logger = function () {
  function Logger(id) {
    

    var cached = loggers[id];
    if (cached) {
      return cached;
    }

    loggers[id] = this;
    this.id = id;
    this.level = globalDefaultLevel;
  }

  Logger.prototype.debug = function debug(message) {};

  Logger.prototype.info = function info(message) {};

  Logger.prototype.warn = function warn(message) {};

  Logger.prototype.error = function error(message) {};

  Logger.prototype.setLevel = function setLevel(level) {
    this.level = level;
  };

  Logger.prototype.isDebugEnabled = function isDebugEnabled() {
    return this.level === logLevel.debug;
  };

  return Logger;
}();

/***/ }),

/***/ 30:
/***/ (function(module, exports) {

var HTML_ALPHA = ['apos', 'nbsp', 'iexcl', 'cent', 'pound', 'curren', 'yen', 'brvbar', 'sect', 'uml', 'copy', 'ordf', 'laquo', 'not', 'shy', 'reg', 'macr', 'deg', 'plusmn', 'sup2', 'sup3', 'acute', 'micro', 'para', 'middot', 'cedil', 'sup1', 'ordm', 'raquo', 'frac14', 'frac12', 'frac34', 'iquest', 'Agrave', 'Aacute', 'Acirc', 'Atilde', 'Auml', 'Aring', 'Aelig', 'Ccedil', 'Egrave', 'Eacute', 'Ecirc', 'Euml', 'Igrave', 'Iacute', 'Icirc', 'Iuml', 'ETH', 'Ntilde', 'Ograve', 'Oacute', 'Ocirc', 'Otilde', 'Ouml', 'times', 'Oslash', 'Ugrave', 'Uacute', 'Ucirc', 'Uuml', 'Yacute', 'THORN', 'szlig', 'agrave', 'aacute', 'acirc', 'atilde', 'auml', 'aring', 'aelig', 'ccedil', 'egrave', 'eacute', 'ecirc', 'euml', 'igrave', 'iacute', 'icirc', 'iuml', 'eth', 'ntilde', 'ograve', 'oacute', 'ocirc', 'otilde', 'ouml', 'divide', 'oslash', 'ugrave', 'uacute', 'ucirc', 'uuml', 'yacute', 'thorn', 'yuml', 'quot', 'amp', 'lt', 'gt', 'OElig', 'oelig', 'Scaron', 'scaron', 'Yuml', 'circ', 'tilde', 'ensp', 'emsp', 'thinsp', 'zwnj', 'zwj', 'lrm', 'rlm', 'ndash', 'mdash', 'lsquo', 'rsquo', 'sbquo', 'ldquo', 'rdquo', 'bdquo', 'dagger', 'Dagger', 'permil', 'lsaquo', 'rsaquo', 'euro', 'fnof', 'Alpha', 'Beta', 'Gamma', 'Delta', 'Epsilon', 'Zeta', 'Eta', 'Theta', 'Iota', 'Kappa', 'Lambda', 'Mu', 'Nu', 'Xi', 'Omicron', 'Pi', 'Rho', 'Sigma', 'Tau', 'Upsilon', 'Phi', 'Chi', 'Psi', 'Omega', 'alpha', 'beta', 'gamma', 'delta', 'epsilon', 'zeta', 'eta', 'theta', 'iota', 'kappa', 'lambda', 'mu', 'nu', 'xi', 'omicron', 'pi', 'rho', 'sigmaf', 'sigma', 'tau', 'upsilon', 'phi', 'chi', 'psi', 'omega', 'thetasym', 'upsih', 'piv', 'bull', 'hellip', 'prime', 'Prime', 'oline', 'frasl', 'weierp', 'image', 'real', 'trade', 'alefsym', 'larr', 'uarr', 'rarr', 'darr', 'harr', 'crarr', 'lArr', 'uArr', 'rArr', 'dArr', 'hArr', 'forall', 'part', 'exist', 'empty', 'nabla', 'isin', 'notin', 'ni', 'prod', 'sum', 'minus', 'lowast', 'radic', 'prop', 'infin', 'ang', 'and', 'or', 'cap', 'cup', 'int', 'there4', 'sim', 'cong', 'asymp', 'ne', 'equiv', 'le', 'ge', 'sub', 'sup', 'nsub', 'sube', 'supe', 'oplus', 'otimes', 'perp', 'sdot', 'lceil', 'rceil', 'lfloor', 'rfloor', 'lang', 'rang', 'loz', 'spades', 'clubs', 'hearts', 'diams'];
var HTML_CODES = [39, 160, 161, 162, 163, 164, 165, 166, 167, 168, 169, 170, 171, 172, 173, 174, 175, 176, 177, 178, 179, 180, 181, 182, 183, 184, 185, 186, 187, 188, 189, 190, 191, 192, 193, 194, 195, 196, 197, 198, 199, 200, 201, 202, 203, 204, 205, 206, 207, 208, 209, 210, 211, 212, 213, 214, 215, 216, 217, 218, 219, 220, 221, 222, 223, 224, 225, 226, 227, 228, 229, 230, 231, 232, 233, 234, 235, 236, 237, 238, 239, 240, 241, 242, 243, 244, 245, 246, 247, 248, 249, 250, 251, 252, 253, 254, 255, 34, 38, 60, 62, 338, 339, 352, 353, 376, 710, 732, 8194, 8195, 8201, 8204, 8205, 8206, 8207, 8211, 8212, 8216, 8217, 8218, 8220, 8221, 8222, 8224, 8225, 8240, 8249, 8250, 8364, 402, 913, 914, 915, 916, 917, 918, 919, 920, 921, 922, 923, 924, 925, 926, 927, 928, 929, 931, 932, 933, 934, 935, 936, 937, 945, 946, 947, 948, 949, 950, 951, 952, 953, 954, 955, 956, 957, 958, 959, 960, 961, 962, 963, 964, 965, 966, 967, 968, 969, 977, 978, 982, 8226, 8230, 8242, 8243, 8254, 8260, 8472, 8465, 8476, 8482, 8501, 8592, 8593, 8594, 8595, 8596, 8629, 8656, 8657, 8658, 8659, 8660, 8704, 8706, 8707, 8709, 8711, 8712, 8713, 8715, 8719, 8721, 8722, 8727, 8730, 8733, 8734, 8736, 8743, 8744, 8745, 8746, 8747, 8756, 8764, 8773, 8776, 8800, 8801, 8804, 8805, 8834, 8835, 8836, 8838, 8839, 8853, 8855, 8869, 8901, 8968, 8969, 8970, 8971, 9001, 9002, 9674, 9824, 9827, 9829, 9830];

var alphaIndex = {};
var numIndex = {};

var i = 0;
var length = HTML_ALPHA.length;
while (i < length) {
    var a = HTML_ALPHA[i];
    var c = HTML_CODES[i];
    alphaIndex[a] = String.fromCharCode(c);
    numIndex[c] = a;
    i++;
}

/**
 * @constructor
 */
function Html4Entities() {}

/**
 * @param {String} str
 * @returns {String}
 */
Html4Entities.prototype.decode = function(str) {
    if (!str || !str.length) {
        return '';
    }
    return str.replace(/&(#?[\w\d]+);?/g, function(s, entity) {
        var chr;
        if (entity.charAt(0) === "#") {
            var code = entity.charAt(1).toLowerCase() === 'x' ?
                parseInt(entity.substr(2), 16) :
                parseInt(entity.substr(1));

            if (!(isNaN(code) || code < -32768 || code > 65535)) {
                chr = String.fromCharCode(code);
            }
        } else {
            chr = alphaIndex[entity];
        }
        return chr || s;
    });
};

/**
 * @param {String} str
 * @returns {String}
 */
Html4Entities.decode = function(str) {
    return new Html4Entities().decode(str);
};

/**
 * @param {String} str
 * @returns {String}
 */
Html4Entities.prototype.encode = function(str) {
    if (!str || !str.length) {
        return '';
    }
    var strLength = str.length;
    var result = '';
    var i = 0;
    while (i < strLength) {
        var alpha = numIndex[str.charCodeAt(i)];
        result += alpha ? "&" + alpha + ";" : str.charAt(i);
        i++;
    }
    return result;
};

/**
 * @param {String} str
 * @returns {String}
 */
Html4Entities.encode = function(str) {
    return new Html4Entities().encode(str);
};

/**
 * @param {String} str
 * @returns {String}
 */
Html4Entities.prototype.encodeNonUTF = function(str) {
    if (!str || !str.length) {
        return '';
    }
    var strLength = str.length;
    var result = '';
    var i = 0;
    while (i < strLength) {
        var cc = str.charCodeAt(i);
        var alpha = numIndex[cc];
        if (alpha) {
            result += "&" + alpha + ";";
        } else if (cc < 32 || cc > 126) {
            result += "&#" + cc + ";";
        } else {
            result += str.charAt(i);
        }
        i++;
    }
    return result;
};

/**
 * @param {String} str
 * @returns {String}
 */
Html4Entities.encodeNonUTF = function(str) {
    return new Html4Entities().encodeNonUTF(str);
};

/**
 * @param {String} str
 * @returns {String}
 */
Html4Entities.prototype.encodeNonASCII = function(str) {
    if (!str || !str.length) {
        return '';
    }
    var strLength = str.length;
    var result = '';
    var i = 0;
    while (i < strLength) {
        var c = str.charCodeAt(i);
        if (c <= 255) {
            result += str[i++];
            continue;
        }
        result += '&#' + c + ';';
        i++;
    }
    return result;
};

/**
 * @param {String} str
 * @returns {String}
 */
Html4Entities.encodeNonASCII = function(str) {
    return new Html4Entities().encodeNonASCII(str);
};

module.exports = Html4Entities;


/***/ }),

/***/ 31:
/***/ (function(module, exports) {

var ALPHA_INDEX = {
    '&lt': '<',
    '&gt': '>',
    '&quot': '"',
    '&apos': '\'',
    '&amp': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&apos;': '\'',
    '&amp;': '&'
};

var CHAR_INDEX = {
    60: 'lt',
    62: 'gt',
    34: 'quot',
    39: 'apos',
    38: 'amp'
};

var CHAR_S_INDEX = {
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    '\'': '&apos;',
    '&': '&amp;'
};

/**
 * @constructor
 */
function XmlEntities() {}

/**
 * @param {String} str
 * @returns {String}
 */
XmlEntities.prototype.encode = function(str) {
    if (!str || !str.length) {
        return '';
    }
    return str.replace(/<|>|"|'|&/g, function(s) {
        return CHAR_S_INDEX[s];
    });
};

/**
 * @param {String} str
 * @returns {String}
 */
 XmlEntities.encode = function(str) {
    return new XmlEntities().encode(str);
 };

/**
 * @param {String} str
 * @returns {String}
 */
XmlEntities.prototype.decode = function(str) {
    if (!str || !str.length) {
        return '';
    }
    return str.replace(/&#?[0-9a-zA-Z]+;?/g, function(s) {
        if (s.charAt(1) === '#') {
            var code = s.charAt(2).toLowerCase() === 'x' ?
                parseInt(s.substr(3), 16) :
                parseInt(s.substr(2));

            if (isNaN(code) || code < -32768 || code > 65535) {
                return '';
            }
            return String.fromCharCode(code);
        }
        return ALPHA_INDEX[s] || s;
    });
};

/**
 * @param {String} str
 * @returns {String}
 */
 XmlEntities.decode = function(str) {
    return new XmlEntities().decode(str);
 };

/**
 * @param {String} str
 * @returns {String}
 */
XmlEntities.prototype.encodeNonUTF = function(str) {
    if (!str || !str.length) {
        return '';
    }
    var strLength = str.length;
    var result = '';
    var i = 0;
    while (i < strLength) {
        var c = str.charCodeAt(i);
        var alpha = CHAR_INDEX[c];
        if (alpha) {
            result += "&" + alpha + ";";
            i++;
            continue;
        }
        if (c < 32 || c > 126) {
            result += '&#' + c + ';';
        } else {
            result += str.charAt(i);
        }
        i++;
    }
    return result;
};

/**
 * @param {String} str
 * @returns {String}
 */
 XmlEntities.encodeNonUTF = function(str) {
    return new XmlEntities().encodeNonUTF(str);
 };

/**
 * @param {String} str
 * @returns {String}
 */
XmlEntities.prototype.encodeNonASCII = function(str) {
    if (!str || !str.length) {
        return '';
    }
    var strLenght = str.length;
    var result = '';
    var i = 0;
    while (i < strLenght) {
        var c = str.charCodeAt(i);
        if (c <= 255) {
            result += str[i++];
            continue;
        }
        result += '&#' + c + ';';
        i++;
    }
    return result;
};

/**
 * @param {String} str
 * @returns {String}
 */
 XmlEntities.encodeNonASCII = function(str) {
    return new XmlEntities().encodeNonASCII(str);
 };

module.exports = XmlEntities;


/***/ }),

/***/ 32:
/***/ (function(module, exports, __webpack_require__) {

// the whatwg-fetch polyfill installs the fetch() function
// on the global object (window or self)
//
// Return that as the export for use in Webpack, Browserify etc.
__webpack_require__(40);
module.exports = self.fetch.bind(self);


/***/ }),

/***/ 33:
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.



// If obj.hasOwnProperty has been overridden, then calling
// obj.hasOwnProperty(prop) will break.
// See: https://github.com/joyent/node/issues/1707
function hasOwnProperty(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}

module.exports = function(qs, sep, eq, options) {
  sep = sep || '&';
  eq = eq || '=';
  var obj = {};

  if (typeof qs !== 'string' || qs.length === 0) {
    return obj;
  }

  var regexp = /\+/g;
  qs = qs.split(sep);

  var maxKeys = 1000;
  if (options && typeof options.maxKeys === 'number') {
    maxKeys = options.maxKeys;
  }

  var len = qs.length;
  // maxKeys <= 0 means that we should not limit keys count
  if (maxKeys > 0 && len > maxKeys) {
    len = maxKeys;
  }

  for (var i = 0; i < len; ++i) {
    var x = qs[i].replace(regexp, '%20'),
        idx = x.indexOf(eq),
        kstr, vstr, k, v;

    if (idx >= 0) {
      kstr = x.substr(0, idx);
      vstr = x.substr(idx + 1);
    } else {
      kstr = x;
      vstr = '';
    }

    k = decodeURIComponent(kstr);
    v = decodeURIComponent(vstr);

    if (!hasOwnProperty(obj, k)) {
      obj[k] = v;
    } else if (isArray(obj[k])) {
      obj[k].push(v);
    } else {
      obj[k] = [obj[k], v];
    }
  }

  return obj;
};

var isArray = Array.isArray || function (xs) {
  return Object.prototype.toString.call(xs) === '[object Array]';
};


/***/ }),

/***/ 34:
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.



var stringifyPrimitive = function(v) {
  switch (typeof v) {
    case 'string':
      return v;

    case 'boolean':
      return v ? 'true' : 'false';

    case 'number':
      return isFinite(v) ? v : '';

    default:
      return '';
  }
};

module.exports = function(obj, sep, eq, name) {
  sep = sep || '&';
  eq = eq || '=';
  if (obj === null) {
    obj = undefined;
  }

  if (typeof obj === 'object') {
    return map(objectKeys(obj), function(k) {
      var ks = encodeURIComponent(stringifyPrimitive(k)) + eq;
      if (isArray(obj[k])) {
        return map(obj[k], function(v) {
          return ks + encodeURIComponent(stringifyPrimitive(v));
        }).join(sep);
      } else {
        return ks + encodeURIComponent(stringifyPrimitive(obj[k]));
      }
    }).join(sep);

  }

  if (!name) return '';
  return encodeURIComponent(stringifyPrimitive(name)) + eq +
         encodeURIComponent(stringifyPrimitive(obj));
};

var isArray = Array.isArray || function (xs) {
  return Object.prototype.toString.call(xs) === '[object Array]';
};

function map (xs, f) {
  if (xs.map) return xs.map(f);
  var res = [];
  for (var i = 0; i < xs.length; i++) {
    res.push(f(xs[i], i));
  }
  return res;
}

var objectKeys = Object.keys || function (obj) {
  var res = [];
  for (var key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) res.push(key);
  }
  return res;
};


/***/ }),

/***/ 35:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.decode = exports.parse = __webpack_require__(33);
exports.encode = exports.stringify = __webpack_require__(34);


/***/ }),

/***/ 36:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var ansiRegex = __webpack_require__(21)();

module.exports = function (str) {
	return typeof str === 'string' ? str.replace(ansiRegex, '') : str;
};


/***/ }),

/***/ 37:
/***/ (function(module, exports, __webpack_require__) {

/*eslint-env browser*/

var clientOverlay = document.createElement('div');
clientOverlay.id = 'webpack-hot-middleware-clientOverlay';
var styles = {
  background: 'rgba(0,0,0,0.85)',
  color: '#e8e8e8',
  lineHeight: '1.6',
  whiteSpace: 'pre',
  fontFamily: 'Menlo, Consolas, monospace',
  fontSize: '13px',
  position: 'fixed',
  zIndex: 9999,
  padding: '10px',
  left: 0,
  right: 0,
  top: 0,
  bottom: 0,
  overflow: 'auto',
  dir: 'ltr',
  textAlign: 'left',
};

var ansiHTML = __webpack_require__(20);
var colors = {
  reset: ['transparent', 'transparent'],
  black: '181818',
  red: 'ff3348',
  green: '3fff4f',
  yellow: 'ffd30e',
  blue: '169be0',
  magenta: 'f840b7',
  cyan: '0ad8e9',
  lightgrey: 'ebe7e3',
  darkgrey: '6d7891',
};

var Entities = __webpack_require__(29).AllHtmlEntities;
var entities = new Entities();

function showProblems(type, lines) {
  clientOverlay.innerHTML = '';
  lines.forEach(function(msg) {
    msg = ansiHTML(entities.encode(msg));
    var div = document.createElement('div');
    div.style.marginBottom = '26px';
    div.innerHTML = problemType(type) + ' in ' + msg;
    clientOverlay.appendChild(div);
  });
  if (document.body) {
    document.body.appendChild(clientOverlay);
  }
}

function clear() {
  if (document.body && clientOverlay.parentNode) {
    document.body.removeChild(clientOverlay);
  }
}

function problemType(type) {
  var problemColors = {
    errors: colors.red,
    warnings: colors.yellow,
  };
  var color = problemColors[type] || colors.red;
  return (
    '<span style="background-color:#' +
    color +
    '; color:#000000; padding:3px 6px; border-radius: 4px;">' +
    type.slice(0, -1).toUpperCase() +
    '</span>'
  );
}

module.exports = function(options) {
  for (var color in options.ansiColors) {
    if (color in colors) {
      colors[color] = options.ansiColors[color];
    }
    ansiHTML.setColors(colors);
  }

  for (var style in options.overlayStyles) {
    styles[style] = options.overlayStyles[style];
  }

  for (var key in styles) {
    clientOverlay.style[key] = styles[key];
  }

  return {
    showProblems: showProblems,
    clear: clear,
  };
};

module.exports.clear = clear;
module.exports.showProblems = showProblems;


/***/ }),

/***/ 38:
/***/ (function(module, exports, __webpack_require__) {

/**
 * Based heavily on https://github.com/webpack/webpack/blob/
 *  c0afdf9c6abc1dd70707c594e473802a566f7b6e/hot/only-dev-server.js
 * Original copyright Tobias Koppers @sokra (MIT license)
 */

/* global window __webpack_hash__ */

if (false) {
  throw new Error('[HMR] Hot Module Replacement is disabled.');
}

var hmrDocsUrl = 'https://webpack.js.org/concepts/hot-module-replacement/'; // eslint-disable-line max-len

var lastHash;
var failureStatuses = { abort: 1, fail: 1 };
var applyOptions = {
  ignoreUnaccepted: true,
  ignoreDeclined: true,
  ignoreErrored: true,
  onUnaccepted: function(data) {
    console.warn(
      'Ignored an update to unaccepted module ' + data.chain.join(' -> ')
    );
  },
  onDeclined: function(data) {
    console.warn(
      'Ignored an update to declined module ' + data.chain.join(' -> ')
    );
  },
  onErrored: function(data) {
    console.error(data.error);
    console.warn(
      'Ignored an error while updating module ' +
        data.moduleId +
        ' (' +
        data.type +
        ')'
    );
  },
};

function upToDate(hash) {
  if (hash) lastHash = hash;
  return lastHash == __webpack_require__.h();
}

module.exports = function(hash, moduleMap, options) {
  var reload = options.reload;
  if (!upToDate(hash) && module.hot.status() == 'idle') {
    if (options.log) console.log('[HMR] Checking for updates on the server...');
    check();
  }

  function check() {
    var cb = function(err, updatedModules) {
      if (err) return handleError(err);

      if (!updatedModules) {
        if (options.warn) {
          console.warn('[HMR] Cannot find update (Full reload needed)');
          console.warn('[HMR] (Probably because of restarting the server)');
        }
        performReload();
        return null;
      }

      var applyCallback = function(applyErr, renewedModules) {
        if (applyErr) return handleError(applyErr);

        if (!upToDate()) check();

        logUpdates(updatedModules, renewedModules);
      };

      var applyResult = module.hot.apply(applyOptions, applyCallback);
      // webpack 2 promise
      if (applyResult && applyResult.then) {
        // HotModuleReplacement.runtime.js refers to the result as `outdatedModules`
        applyResult.then(function(outdatedModules) {
          applyCallback(null, outdatedModules);
        });
        applyResult.catch(applyCallback);
      }
    };

    var result = module.hot.check(false, cb);
    // webpack 2 promise
    if (result && result.then) {
      result.then(function(updatedModules) {
        cb(null, updatedModules);
      });
      result.catch(cb);
    }
  }

  function logUpdates(updatedModules, renewedModules) {
    var unacceptedModules = updatedModules.filter(function(moduleId) {
      return renewedModules && renewedModules.indexOf(moduleId) < 0;
    });

    if (unacceptedModules.length > 0) {
      if (options.warn) {
        console.warn(
          "[HMR] The following modules couldn't be hot updated: " +
            '(Full reload needed)\n' +
            'This is usually because the modules which have changed ' +
            '(and their parents) do not know how to hot reload themselves. ' +
            'See ' +
            hmrDocsUrl +
            ' for more details.'
        );
        unacceptedModules.forEach(function(moduleId) {
          console.warn('[HMR]  - ' + (moduleMap[moduleId] || moduleId));
        });
      }
      performReload();
      return;
    }

    if (options.log) {
      if (!renewedModules || renewedModules.length === 0) {
        console.log('[HMR] Nothing hot updated.');
      } else {
        console.log('[HMR] Updated modules:');
        renewedModules.forEach(function(moduleId) {
          console.log('[HMR]  - ' + (moduleMap[moduleId] || moduleId));
        });
      }

      if (upToDate()) {
        console.log('[HMR] App is up to date.');
      }
    }
  }

  function handleError(err) {
    if (module.hot.status() in failureStatuses) {
      if (options.warn) {
        console.warn('[HMR] Cannot check for update (Full reload needed)');
        console.warn('[HMR] ' + (err.stack || err.message));
      }
      performReload();
      return;
    }
    if (options.warn) {
      console.warn('[HMR] Update check failed: ' + (err.stack || err.message));
    }
  }

  function performReload() {
    if (reload) {
      if (options.warn) console.warn('[HMR] Reloading page');
      window.location.reload();
    }
  }
};


/***/ }),

/***/ 39:
/***/ (function(module, exports) {

module.exports = function(module) {
	if(!module.webpackPolyfill) {
		module.deprecate = function() {};
		module.paths = [];
		// module.parent = undefined by default
		if(!module.children) module.children = [];
		Object.defineProperty(module, "loaded", {
			enumerable: true,
			get: function() {
				return module.l;
			}
		});
		Object.defineProperty(module, "id", {
			enumerable: true,
			get: function() {
				return module.i;
			}
		});
		module.webpackPolyfill = 1;
	}
	return module;
};


/***/ }),

/***/ 4:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = relativeToFile;
/* harmony export (immutable) */ __webpack_exports__["b"] = join;
/* harmony export (immutable) */ __webpack_exports__["c"] = buildQueryString;
/* harmony export (immutable) */ __webpack_exports__["d"] = parseQueryString;
var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

function trimDots(ary) {
  for (var i = 0; i < ary.length; ++i) {
    var part = ary[i];
    if (part === '.') {
      ary.splice(i, 1);
      i -= 1;
    } else if (part === '..') {
      if (i === 0 || i === 1 && ary[2] === '..' || ary[i - 1] === '..') {
        continue;
      } else if (i > 0) {
        ary.splice(i - 1, 2);
        i -= 2;
      }
    }
  }
}

function relativeToFile(name, file) {
  var fileParts = file && file.split('/');
  var nameParts = name.trim().split('/');

  if (nameParts[0].charAt(0) === '.' && fileParts) {
    var normalizedBaseParts = fileParts.slice(0, fileParts.length - 1);
    nameParts.unshift.apply(nameParts, normalizedBaseParts);
  }

  trimDots(nameParts);

  return nameParts.join('/');
}

function join(path1, path2) {
  if (!path1) {
    return path2;
  }

  if (!path2) {
    return path1;
  }

  var schemeMatch = path1.match(/^([^/]*?:)\//);
  var scheme = schemeMatch && schemeMatch.length > 0 ? schemeMatch[1] : '';
  path1 = path1.substr(scheme.length);

  var urlPrefix = void 0;
  if (path1.indexOf('///') === 0 && scheme === 'file:') {
    urlPrefix = '///';
  } else if (path1.indexOf('//') === 0) {
    urlPrefix = '//';
  } else if (path1.indexOf('/') === 0) {
    urlPrefix = '/';
  } else {
    urlPrefix = '';
  }

  var trailingSlash = path2.slice(-1) === '/' ? '/' : '';

  var url1 = path1.split('/');
  var url2 = path2.split('/');
  var url3 = [];

  for (var i = 0, ii = url1.length; i < ii; ++i) {
    if (url1[i] === '..') {
      if (url3.length && url3[url3.length - 1] !== '..') {
        url3.pop();
      } else {
        url3.push(url1[i]);
      }
    } else if (url1[i] === '.' || url1[i] === '') {
      continue;
    } else {
      url3.push(url1[i]);
    }
  }

  for (var _i = 0, _ii = url2.length; _i < _ii; ++_i) {
    if (url2[_i] === '..') {
      if (url3.length && url3[url3.length - 1] !== '..') {
        url3.pop();
      } else {
        url3.push(url2[_i]);
      }
    } else if (url2[_i] === '.' || url2[_i] === '') {
      continue;
    } else {
      url3.push(url2[_i]);
    }
  }

  return scheme + urlPrefix + url3.join('/') + trailingSlash;
}

var encode = encodeURIComponent;
var encodeKey = function encodeKey(k) {
  return encode(k).replace('%24', '$');
};

function buildParam(key, value, traditional) {
  var result = [];
  if (value === null || value === undefined) {
    return result;
  }
  if (Array.isArray(value)) {
    for (var i = 0, l = value.length; i < l; i++) {
      if (traditional) {
        result.push(encodeKey(key) + '=' + encode(value[i]));
      } else {
        var arrayKey = key + '[' + (_typeof(value[i]) === 'object' && value[i] !== null ? i : '') + ']';
        result = result.concat(buildParam(arrayKey, value[i]));
      }
    }
  } else if ((typeof value === 'undefined' ? 'undefined' : _typeof(value)) === 'object' && !traditional) {
    for (var propertyName in value) {
      result = result.concat(buildParam(key + '[' + propertyName + ']', value[propertyName]));
    }
  } else {
    result.push(encodeKey(key) + '=' + encode(value));
  }
  return result;
}

function buildQueryString(params, traditional) {
  var pairs = [];
  var keys = Object.keys(params || {}).sort();
  for (var i = 0, len = keys.length; i < len; i++) {
    var key = keys[i];
    pairs = pairs.concat(buildParam(key, params[key], traditional));
  }

  if (pairs.length === 0) {
    return '';
  }

  return pairs.join('&');
}

function processScalarParam(existedParam, value) {
  if (Array.isArray(existedParam)) {
    existedParam.push(value);
    return existedParam;
  }
  if (existedParam !== undefined) {
    return [existedParam, value];
  }

  return value;
}

function parseComplexParam(queryParams, keys, value) {
  var currentParams = queryParams;
  var keysLastIndex = keys.length - 1;
  for (var j = 0; j <= keysLastIndex; j++) {
    var key = keys[j] === '' ? currentParams.length : keys[j];
    if (j < keysLastIndex) {
      var prevValue = !currentParams[key] || _typeof(currentParams[key]) === 'object' ? currentParams[key] : [currentParams[key]];
      currentParams = currentParams[key] = prevValue || (isNaN(keys[j + 1]) ? {} : []);
    } else {
      currentParams = currentParams[key] = value;
    }
  }
}

function parseQueryString(queryString) {
  var queryParams = {};
  if (!queryString || typeof queryString !== 'string') {
    return queryParams;
  }

  var query = queryString;
  if (query.charAt(0) === '?') {
    query = query.substr(1);
  }

  var pairs = query.replace(/\+/g, ' ').split('&');
  for (var i = 0; i < pairs.length; i++) {
    var pair = pairs[i].split('=');
    var key = decodeURIComponent(pair[0]);
    if (!key) {
      continue;
    }

    var keys = key.split('][');
    var keysLastIndex = keys.length - 1;

    if (/\[/.test(keys[0]) && /\]$/.test(keys[keysLastIndex])) {
      keys[keysLastIndex] = keys[keysLastIndex].replace(/\]$/, '');
      keys = keys.shift().split('[').concat(keys);
      keysLastIndex = keys.length - 1;
    } else {
      keysLastIndex = 0;
    }

    if (pair.length >= 2) {
      var value = pair[1] ? decodeURIComponent(pair[1]) : '';
      if (keysLastIndex) {
        parseComplexParam(queryParams, keys, value);
      } else {
        queryParams[key] = processScalarParam(queryParams[key], value);
      }
    } else {
      queryParams[key] = true;
    }
  }
  return queryParams;
}

/***/ }),

/***/ 40:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (immutable) */ __webpack_exports__["Headers"] = Headers;
/* harmony export (immutable) */ __webpack_exports__["Request"] = Request;
/* harmony export (immutable) */ __webpack_exports__["Response"] = Response;
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DOMException", function() { return DOMException; });
/* harmony export (immutable) */ __webpack_exports__["fetch"] = fetch;
var support = {
  searchParams: 'URLSearchParams' in self,
  iterable: 'Symbol' in self && 'iterator' in Symbol,
  blob:
    'FileReader' in self &&
    'Blob' in self &&
    (function() {
      try {
        new Blob()
        return true
      } catch (e) {
        return false
      }
    })(),
  formData: 'FormData' in self,
  arrayBuffer: 'ArrayBuffer' in self
}

function isDataView(obj) {
  return obj && DataView.prototype.isPrototypeOf(obj)
}

if (support.arrayBuffer) {
  var viewClasses = [
    '[object Int8Array]',
    '[object Uint8Array]',
    '[object Uint8ClampedArray]',
    '[object Int16Array]',
    '[object Uint16Array]',
    '[object Int32Array]',
    '[object Uint32Array]',
    '[object Float32Array]',
    '[object Float64Array]'
  ]

  var isArrayBufferView =
    ArrayBuffer.isView ||
    function(obj) {
      return obj && viewClasses.indexOf(Object.prototype.toString.call(obj)) > -1
    }
}

function normalizeName(name) {
  if (typeof name !== 'string') {
    name = String(name)
  }
  if (/[^a-z0-9\-#$%&'*+.^_`|~]/i.test(name)) {
    throw new TypeError('Invalid character in header field name')
  }
  return name.toLowerCase()
}

function normalizeValue(value) {
  if (typeof value !== 'string') {
    value = String(value)
  }
  return value
}

// Build a destructive iterator for the value list
function iteratorFor(items) {
  var iterator = {
    next: function() {
      var value = items.shift()
      return {done: value === undefined, value: value}
    }
  }

  if (support.iterable) {
    iterator[Symbol.iterator] = function() {
      return iterator
    }
  }

  return iterator
}

function Headers(headers) {
  this.map = {}

  if (headers instanceof Headers) {
    headers.forEach(function(value, name) {
      this.append(name, value)
    }, this)
  } else if (Array.isArray(headers)) {
    headers.forEach(function(header) {
      this.append(header[0], header[1])
    }, this)
  } else if (headers) {
    Object.getOwnPropertyNames(headers).forEach(function(name) {
      this.append(name, headers[name])
    }, this)
  }
}

Headers.prototype.append = function(name, value) {
  name = normalizeName(name)
  value = normalizeValue(value)
  var oldValue = this.map[name]
  this.map[name] = oldValue ? oldValue + ', ' + value : value
}

Headers.prototype['delete'] = function(name) {
  delete this.map[normalizeName(name)]
}

Headers.prototype.get = function(name) {
  name = normalizeName(name)
  return this.has(name) ? this.map[name] : null
}

Headers.prototype.has = function(name) {
  return this.map.hasOwnProperty(normalizeName(name))
}

Headers.prototype.set = function(name, value) {
  this.map[normalizeName(name)] = normalizeValue(value)
}

Headers.prototype.forEach = function(callback, thisArg) {
  for (var name in this.map) {
    if (this.map.hasOwnProperty(name)) {
      callback.call(thisArg, this.map[name], name, this)
    }
  }
}

Headers.prototype.keys = function() {
  var items = []
  this.forEach(function(value, name) {
    items.push(name)
  })
  return iteratorFor(items)
}

Headers.prototype.values = function() {
  var items = []
  this.forEach(function(value) {
    items.push(value)
  })
  return iteratorFor(items)
}

Headers.prototype.entries = function() {
  var items = []
  this.forEach(function(value, name) {
    items.push([name, value])
  })
  return iteratorFor(items)
}

if (support.iterable) {
  Headers.prototype[Symbol.iterator] = Headers.prototype.entries
}

function consumed(body) {
  if (body.bodyUsed) {
    return Promise.reject(new TypeError('Already read'))
  }
  body.bodyUsed = true
}

function fileReaderReady(reader) {
  return new Promise(function(resolve, reject) {
    reader.onload = function() {
      resolve(reader.result)
    }
    reader.onerror = function() {
      reject(reader.error)
    }
  })
}

function readBlobAsArrayBuffer(blob) {
  var reader = new FileReader()
  var promise = fileReaderReady(reader)
  reader.readAsArrayBuffer(blob)
  return promise
}

function readBlobAsText(blob) {
  var reader = new FileReader()
  var promise = fileReaderReady(reader)
  reader.readAsText(blob)
  return promise
}

function readArrayBufferAsText(buf) {
  var view = new Uint8Array(buf)
  var chars = new Array(view.length)

  for (var i = 0; i < view.length; i++) {
    chars[i] = String.fromCharCode(view[i])
  }
  return chars.join('')
}

function bufferClone(buf) {
  if (buf.slice) {
    return buf.slice(0)
  } else {
    var view = new Uint8Array(buf.byteLength)
    view.set(new Uint8Array(buf))
    return view.buffer
  }
}

function Body() {
  this.bodyUsed = false

  this._initBody = function(body) {
    this._bodyInit = body
    if (!body) {
      this._bodyText = ''
    } else if (typeof body === 'string') {
      this._bodyText = body
    } else if (support.blob && Blob.prototype.isPrototypeOf(body)) {
      this._bodyBlob = body
    } else if (support.formData && FormData.prototype.isPrototypeOf(body)) {
      this._bodyFormData = body
    } else if (support.searchParams && URLSearchParams.prototype.isPrototypeOf(body)) {
      this._bodyText = body.toString()
    } else if (support.arrayBuffer && support.blob && isDataView(body)) {
      this._bodyArrayBuffer = bufferClone(body.buffer)
      // IE 10-11 can't handle a DataView body.
      this._bodyInit = new Blob([this._bodyArrayBuffer])
    } else if (support.arrayBuffer && (ArrayBuffer.prototype.isPrototypeOf(body) || isArrayBufferView(body))) {
      this._bodyArrayBuffer = bufferClone(body)
    } else {
      this._bodyText = body = Object.prototype.toString.call(body)
    }

    if (!this.headers.get('content-type')) {
      if (typeof body === 'string') {
        this.headers.set('content-type', 'text/plain;charset=UTF-8')
      } else if (this._bodyBlob && this._bodyBlob.type) {
        this.headers.set('content-type', this._bodyBlob.type)
      } else if (support.searchParams && URLSearchParams.prototype.isPrototypeOf(body)) {
        this.headers.set('content-type', 'application/x-www-form-urlencoded;charset=UTF-8')
      }
    }
  }

  if (support.blob) {
    this.blob = function() {
      var rejected = consumed(this)
      if (rejected) {
        return rejected
      }

      if (this._bodyBlob) {
        return Promise.resolve(this._bodyBlob)
      } else if (this._bodyArrayBuffer) {
        return Promise.resolve(new Blob([this._bodyArrayBuffer]))
      } else if (this._bodyFormData) {
        throw new Error('could not read FormData body as blob')
      } else {
        return Promise.resolve(new Blob([this._bodyText]))
      }
    }

    this.arrayBuffer = function() {
      if (this._bodyArrayBuffer) {
        return consumed(this) || Promise.resolve(this._bodyArrayBuffer)
      } else {
        return this.blob().then(readBlobAsArrayBuffer)
      }
    }
  }

  this.text = function() {
    var rejected = consumed(this)
    if (rejected) {
      return rejected
    }

    if (this._bodyBlob) {
      return readBlobAsText(this._bodyBlob)
    } else if (this._bodyArrayBuffer) {
      return Promise.resolve(readArrayBufferAsText(this._bodyArrayBuffer))
    } else if (this._bodyFormData) {
      throw new Error('could not read FormData body as text')
    } else {
      return Promise.resolve(this._bodyText)
    }
  }

  if (support.formData) {
    this.formData = function() {
      return this.text().then(decode)
    }
  }

  this.json = function() {
    return this.text().then(JSON.parse)
  }

  return this
}

// HTTP methods whose capitalization should be normalized
var methods = ['DELETE', 'GET', 'HEAD', 'OPTIONS', 'POST', 'PUT']

function normalizeMethod(method) {
  var upcased = method.toUpperCase()
  return methods.indexOf(upcased) > -1 ? upcased : method
}

function Request(input, options) {
  options = options || {}
  var body = options.body

  if (input instanceof Request) {
    if (input.bodyUsed) {
      throw new TypeError('Already read')
    }
    this.url = input.url
    this.credentials = input.credentials
    if (!options.headers) {
      this.headers = new Headers(input.headers)
    }
    this.method = input.method
    this.mode = input.mode
    this.signal = input.signal
    if (!body && input._bodyInit != null) {
      body = input._bodyInit
      input.bodyUsed = true
    }
  } else {
    this.url = String(input)
  }

  this.credentials = options.credentials || this.credentials || 'same-origin'
  if (options.headers || !this.headers) {
    this.headers = new Headers(options.headers)
  }
  this.method = normalizeMethod(options.method || this.method || 'GET')
  this.mode = options.mode || this.mode || null
  this.signal = options.signal || this.signal
  this.referrer = null

  if ((this.method === 'GET' || this.method === 'HEAD') && body) {
    throw new TypeError('Body not allowed for GET or HEAD requests')
  }
  this._initBody(body)
}

Request.prototype.clone = function() {
  return new Request(this, {body: this._bodyInit})
}

function decode(body) {
  var form = new FormData()
  body
    .trim()
    .split('&')
    .forEach(function(bytes) {
      if (bytes) {
        var split = bytes.split('=')
        var name = split.shift().replace(/\+/g, ' ')
        var value = split.join('=').replace(/\+/g, ' ')
        form.append(decodeURIComponent(name), decodeURIComponent(value))
      }
    })
  return form
}

function parseHeaders(rawHeaders) {
  var headers = new Headers()
  // Replace instances of \r\n and \n followed by at least one space or horizontal tab with a space
  // https://tools.ietf.org/html/rfc7230#section-3.2
  var preProcessedHeaders = rawHeaders.replace(/\r?\n[\t ]+/g, ' ')
  preProcessedHeaders.split(/\r?\n/).forEach(function(line) {
    var parts = line.split(':')
    var key = parts.shift().trim()
    if (key) {
      var value = parts.join(':').trim()
      headers.append(key, value)
    }
  })
  return headers
}

Body.call(Request.prototype)

function Response(bodyInit, options) {
  if (!options) {
    options = {}
  }

  this.type = 'default'
  this.status = options.status === undefined ? 200 : options.status
  this.ok = this.status >= 200 && this.status < 300
  this.statusText = 'statusText' in options ? options.statusText : 'OK'
  this.headers = new Headers(options.headers)
  this.url = options.url || ''
  this._initBody(bodyInit)
}

Body.call(Response.prototype)

Response.prototype.clone = function() {
  return new Response(this._bodyInit, {
    status: this.status,
    statusText: this.statusText,
    headers: new Headers(this.headers),
    url: this.url
  })
}

Response.error = function() {
  var response = new Response(null, {status: 0, statusText: ''})
  response.type = 'error'
  return response
}

var redirectStatuses = [301, 302, 303, 307, 308]

Response.redirect = function(url, status) {
  if (redirectStatuses.indexOf(status) === -1) {
    throw new RangeError('Invalid status code')
  }

  return new Response(null, {status: status, headers: {location: url}})
}

var DOMException = self.DOMException
try {
  new DOMException()
} catch (err) {
  DOMException = function(message, name) {
    this.message = message
    this.name = name
    var error = Error(message)
    this.stack = error.stack
  }
  DOMException.prototype = Object.create(Error.prototype)
  DOMException.prototype.constructor = DOMException
}

function fetch(input, init) {
  return new Promise(function(resolve, reject) {
    var request = new Request(input, init)

    if (request.signal && request.signal.aborted) {
      return reject(new DOMException('Aborted', 'AbortError'))
    }

    var xhr = new XMLHttpRequest()

    function abortXhr() {
      xhr.abort()
    }

    xhr.onload = function() {
      var options = {
        status: xhr.status,
        statusText: xhr.statusText,
        headers: parseHeaders(xhr.getAllResponseHeaders() || '')
      }
      options.url = 'responseURL' in xhr ? xhr.responseURL : options.headers.get('X-Request-URL')
      var body = 'response' in xhr ? xhr.response : xhr.responseText
      resolve(new Response(body, options))
    }

    xhr.onerror = function() {
      reject(new TypeError('Network request failed'))
    }

    xhr.ontimeout = function() {
      reject(new TypeError('Network request failed'))
    }

    xhr.onabort = function() {
      reject(new DOMException('Aborted', 'AbortError'))
    }

    xhr.open(request.method, request.url, true)

    if (request.credentials === 'include') {
      xhr.withCredentials = true
    } else if (request.credentials === 'omit') {
      xhr.withCredentials = false
    }

    if ('responseType' in xhr && support.blob) {
      xhr.responseType = 'blob'
    }

    request.headers.forEach(function(value, name) {
      xhr.setRequestHeader(name, value)
    })

    if (request.signal) {
      request.signal.addEventListener('abort', abortXhr)

      xhr.onreadystatechange = function() {
        // DONE (success or failure)
        if (xhr.readyState === 4) {
          request.signal.removeEventListener('abort', abortXhr)
        }
      }
    }

    xhr.send(typeof request._bodyInit === 'undefined' ? null : request._bodyInit)
  })
}

fetch.polyfill = true

if (!self.fetch) {
  self.fetch = fetch
  self.Headers = Headers
  self.Request = Request
  self.Response = Response
}


/***/ }),

/***/ 41:
/***/ (function(module, exports, __webpack_require__) {

module.exports = (__webpack_require__(10))(26);

/***/ }),

/***/ 42:
/***/ (function(module, exports, __webpack_require__) {

module.exports = (__webpack_require__(10))(36);

/***/ }),

/***/ 43:
/***/ (function(module, exports, __webpack_require__) {

module.exports = (__webpack_require__(10))(59);

/***/ }),

/***/ 44:
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(17);
__webpack_require__(18);
__webpack_require__(19);
module.exports = __webpack_require__(16);


/***/ }),

/***/ 5:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export _emptyParameters */
/* unused harmony export InvocationHandler */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Container; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "e", function() { return autoinject; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return inject; });
/* unused harmony export invoker */
/* unused harmony export invokeAsFactory */
/* unused harmony export FactoryInvoker */
/* unused harmony export registration */
/* unused harmony export transient */
/* unused harmony export singleton */
/* unused harmony export TransientRegistration */
/* unused harmony export SingletonRegistration */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return resolver; });
/* unused harmony export StrategyResolver */
/* unused harmony export Lazy */
/* unused harmony export All */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "d", function() { return Optional; });
/* unused harmony export Parent */
/* unused harmony export Factory */
/* unused harmony export NewInstance */
/* unused harmony export getDecoratorDependencies */
/* unused harmony export lazy */
/* unused harmony export all */
/* unused harmony export optional */
/* unused harmony export parent */
/* unused harmony export factory */
/* unused harmony export newInstance */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_aurelia_metadata__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_aurelia_pal__ = __webpack_require__(0);



/*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */

function __decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}

function __metadata(metadataKey, metadataValue) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(metadataKey, metadataValue);
}

function isInjectable(potentialTarget) {
    return !!potentialTarget;
}
function autoinject(potentialTarget) {
    var deco = function (target) {
        if (!target.hasOwnProperty('inject')) {
            target.inject = (__WEBPACK_IMPORTED_MODULE_0_aurelia_metadata__["a" /* metadata */].getOwn(__WEBPACK_IMPORTED_MODULE_0_aurelia_metadata__["a" /* metadata */].paramTypes, target) ||
                _emptyParameters).slice();
            if (target.inject && target.inject.length > 0) {
                if (target.inject[target.inject.length - 1] === Object) {
                    target.inject.splice(-1, 1);
                }
            }
        }
    };
    if (isInjectable(potentialTarget)) {
        return deco(potentialTarget);
    }
    return deco;
}
function inject() {
    var rest = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        rest[_i] = arguments[_i];
    }
    return function (target, _key, descriptor) {
        if (typeof descriptor === 'number') {
            autoinject(target);
            if (rest.length === 1) {
                target.inject[descriptor] = rest[0];
            }
            return;
        }
        if (descriptor) {
            var fn = descriptor.value;
            fn.inject = rest;
        }
        else {
            target.inject = rest;
        }
    };
}

var resolver = __WEBPACK_IMPORTED_MODULE_0_aurelia_metadata__["b" /* protocol */].create('aurelia:resolver', function (target) {
    if (!(typeof target.get === 'function')) {
        return 'Resolvers must implement: get(container: Container, key: any): any';
    }
    return true;
});
function isStrategy(actual, expected, state) {
    return actual === expected;
}
var StrategyResolver = (function () {
    function StrategyResolver(strategy, state) {
        this.strategy = strategy;
        this.state = state;
    }
    StrategyResolver.prototype.get = function (container, key) {
        if (isStrategy(this.strategy, 0, this.state)) {
            return this.state;
        }
        if (isStrategy(this.strategy, 1, this.state)) {
            var singleton = container.invoke(this.state);
            this.state = singleton;
            this.strategy = 0;
            return singleton;
        }
        if (isStrategy(this.strategy, 2, this.state)) {
            return container.invoke(this.state);
        }
        if (isStrategy(this.strategy, 3, this.state)) {
            return this.state(container, key, this);
        }
        if (isStrategy(this.strategy, 4, this.state)) {
            return this.state[0].get(container, key);
        }
        if (isStrategy(this.strategy, 5, this.state)) {
            return container.get(this.state);
        }
        throw new Error('Invalid strategy: ' + this.strategy);
    };
    StrategyResolver = __decorate([
        resolver(),
        __metadata("design:paramtypes", [Number, Object])
    ], StrategyResolver);
    return StrategyResolver;
}());
var Lazy = (function () {
    function Lazy(key) {
        this._key = key;
    }
    Lazy_1 = Lazy;
    Lazy.prototype.get = function (container) {
        var _this = this;
        return function () { return container.get(_this._key); };
    };
    Lazy.of = function (key) {
        return new Lazy_1(key);
    };
    var Lazy_1;
    Lazy = Lazy_1 = __decorate([
        resolver(),
        __metadata("design:paramtypes", [Object])
    ], Lazy);
    return Lazy;
}());
var All = (function () {
    function All(key) {
        this._key = key;
    }
    All_1 = All;
    All.prototype.get = function (container) {
        return container.getAll(this._key);
    };
    All.of = function (key) {
        return new All_1(key);
    };
    var All_1;
    All = All_1 = __decorate([
        resolver(),
        __metadata("design:paramtypes", [Object])
    ], All);
    return All;
}());
var Optional = (function () {
    function Optional(key, checkParent) {
        if (checkParent === void 0) { checkParent = true; }
        this._key = key;
        this._checkParent = checkParent;
    }
    Optional_1 = Optional;
    Optional.prototype.get = function (container) {
        if (container.hasResolver(this._key, this._checkParent)) {
            return container.get(this._key);
        }
        return null;
    };
    Optional.of = function (key, checkParent) {
        if (checkParent === void 0) { checkParent = true; }
        return new Optional_1(key, checkParent);
    };
    var Optional_1;
    Optional = Optional_1 = __decorate([
        resolver(),
        __metadata("design:paramtypes", [Object, Boolean])
    ], Optional);
    return Optional;
}());
var Parent = (function () {
    function Parent(key) {
        this._key = key;
    }
    Parent_1 = Parent;
    Parent.prototype.get = function (container) {
        return container.parent ? container.parent.get(this._key) : null;
    };
    Parent.of = function (key) {
        return new Parent_1(key);
    };
    var Parent_1;
    Parent = Parent_1 = __decorate([
        resolver(),
        __metadata("design:paramtypes", [Object])
    ], Parent);
    return Parent;
}());
var Factory = (function () {
    function Factory(key) {
        this._key = key;
    }
    Factory_1 = Factory;
    Factory.prototype.get = function (container) {
        var fn = this._key;
        var resolver = container.getResolver(fn);
        if (resolver && resolver.strategy === 3) {
            fn = resolver.state;
        }
        return function () {
            var rest = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                rest[_i] = arguments[_i];
            }
            return container.invoke(fn, rest);
        };
    };
    Factory.of = function (key) {
        return new Factory_1(key);
    };
    var Factory_1;
    Factory = Factory_1 = __decorate([
        resolver(),
        __metadata("design:paramtypes", [Object])
    ], Factory);
    return Factory;
}());
var NewInstance = (function () {
    function NewInstance(key) {
        var dynamicDependencies = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            dynamicDependencies[_i - 1] = arguments[_i];
        }
        this.key = key;
        this.asKey = key;
        this.dynamicDependencies = dynamicDependencies;
    }
    NewInstance_1 = NewInstance;
    NewInstance.prototype.get = function (container) {
        var dynamicDependencies = this.dynamicDependencies.length > 0
            ? this.dynamicDependencies.map(function (dependency) {
                return dependency['protocol:aurelia:resolver']
                    ? dependency.get(container)
                    : container.get(dependency);
            })
            : undefined;
        var fn = this.key;
        var resolver = container.getResolver(fn);
        if (resolver && resolver.strategy === 3) {
            fn = resolver.state;
        }
        var instance = container.invoke(fn, dynamicDependencies);
        container.registerInstance(this.asKey, instance);
        return instance;
    };
    NewInstance.prototype.as = function (key) {
        this.asKey = key;
        return this;
    };
    NewInstance.of = function (key) {
        var dynamicDependencies = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            dynamicDependencies[_i - 1] = arguments[_i];
        }
        return new (NewInstance_1.bind.apply(NewInstance_1, [void 0, key].concat(dynamicDependencies)))();
    };
    var NewInstance_1;
    NewInstance = NewInstance_1 = __decorate([
        resolver(),
        __metadata("design:paramtypes", [Object, Object])
    ], NewInstance);
    return NewInstance;
}());
function getDecoratorDependencies(target) {
    autoinject(target);
    return target.inject;
}
function lazy(keyValue) {
    return function (target, _key, index) {
        var inject$$1 = getDecoratorDependencies(target);
        inject$$1[index] = Lazy.of(keyValue);
    };
}
function all(keyValue) {
    return function (target, _key, index) {
        var inject$$1 = getDecoratorDependencies(target);
        inject$$1[index] = All.of(keyValue);
    };
}
function optional(checkParentOrTarget) {
    if (checkParentOrTarget === void 0) { checkParentOrTarget = true; }
    var deco = function (checkParent) {
        return function (target, _key, index) {
            var inject$$1 = getDecoratorDependencies(target);
            inject$$1[index] = Optional.of(inject$$1[index], checkParent);
        };
    };
    if (typeof checkParentOrTarget === 'boolean') {
        return deco(checkParentOrTarget);
    }
    return deco(true);
}
function parent(target, _key, index) {
    var inject$$1 = getDecoratorDependencies(target);
    inject$$1[index] = Parent.of(inject$$1[index]);
}
function factory(keyValue) {
    return function (target, _key, index) {
        var inject$$1 = getDecoratorDependencies(target);
        inject$$1[index] = Factory.of(keyValue);
    };
}
function newInstance(asKeyOrTarget) {
    var dynamicDependencies = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        dynamicDependencies[_i - 1] = arguments[_i];
    }
    var deco = function (asKey) {
        return function (target, _key, index) {
            var inject$$1 = getDecoratorDependencies(target);
            inject$$1[index] = NewInstance.of.apply(NewInstance, [inject$$1[index]].concat(dynamicDependencies));
            if (!!asKey) {
                inject$$1[index].as(asKey);
            }
        };
    };
    if (arguments.length >= 1) {
        return deco(asKeyOrTarget);
    }
    return deco();
}

function validateKey(key) {
    if (key === null || key === undefined) {
        throw new Error('key/value cannot be null or undefined. Are you trying to inject/register something that doesn\'t exist with DI?');
    }
}
var _emptyParameters = Object.freeze([]);
__WEBPACK_IMPORTED_MODULE_0_aurelia_metadata__["a" /* metadata */].registration = 'aurelia:registration';
__WEBPACK_IMPORTED_MODULE_0_aurelia_metadata__["a" /* metadata */].invoker = 'aurelia:invoker';
var resolverDecorates = resolver.decorates;
var InvocationHandler = (function () {
    function InvocationHandler(fn, invoker, dependencies) {
        this.fn = fn;
        this.invoker = invoker;
        this.dependencies = dependencies;
    }
    InvocationHandler.prototype.invoke = function (container, dynamicDependencies) {
        return dynamicDependencies !== undefined
            ? this.invoker.invokeWithDynamicDependencies(container, this.fn, this.dependencies, dynamicDependencies)
            : this.invoker.invoke(container, this.fn, this.dependencies);
    };
    return InvocationHandler;
}());
function invokeWithDynamicDependencies(container, fn, staticDependencies, dynamicDependencies) {
    var i = staticDependencies.length;
    var args = new Array(i);
    var lookup;
    while (i--) {
        lookup = staticDependencies[i];
        if (lookup === null || lookup === undefined) {
            throw new Error('Constructor Parameter with index ' +
                i +
                ' cannot be null or undefined. Are you trying to inject/register something that doesn\'t exist with DI?');
        }
        else {
            args[i] = container.get(lookup);
        }
    }
    if (dynamicDependencies !== undefined) {
        args = args.concat(dynamicDependencies);
    }
    return Reflect.construct(fn, args);
}
var classInvoker = {
    invoke: function (container, Type, deps) {
        var instances = deps.map(function (dep) { return container.get(dep); });
        return Reflect.construct(Type, instances);
    },
    invokeWithDynamicDependencies: invokeWithDynamicDependencies
};
function getDependencies(f) {
    if (!f.hasOwnProperty('inject')) {
        return [];
    }
    if (typeof f.inject === 'function') {
        return f.inject();
    }
    return f.inject;
}
var Container = (function () {
    function Container(configuration) {
        if (configuration === undefined) {
            configuration = {};
        }
        this._configuration = configuration;
        this._onHandlerCreated = configuration.onHandlerCreated;
        this._handlers =
            configuration.handlers || (configuration.handlers = new Map());
        this._resolvers = new Map();
        this.root = this;
        this.parent = null;
    }
    Container.prototype.makeGlobal = function () {
        Container.instance = this;
        return this;
    };
    Container.prototype.setHandlerCreatedCallback = function (onHandlerCreated) {
        this._onHandlerCreated = onHandlerCreated;
        this._configuration.onHandlerCreated = onHandlerCreated;
    };
    Container.prototype.registerInstance = function (key, instance) {
        return this.registerResolver(key, new StrategyResolver(0, instance === undefined ? key : instance));
    };
    Container.prototype.registerSingleton = function (key, fn) {
        return this.registerResolver(key, new StrategyResolver(1, fn === undefined ? key : fn));
    };
    Container.prototype.registerTransient = function (key, fn) {
        return this.registerResolver(key, new StrategyResolver(2, fn === undefined ? key : fn));
    };
    Container.prototype.registerHandler = function (key, handler) {
        return this.registerResolver(key, new StrategyResolver(3, handler));
    };
    Container.prototype.registerAlias = function (originalKey, aliasKey) {
        return this.registerResolver(aliasKey, new StrategyResolver(5, originalKey));
    };
    Container.prototype.registerResolver = function (key, resolver$$1) {
        validateKey(key);
        var allResolvers = this._resolvers;
        var result = allResolvers.get(key);
        if (result === undefined) {
            allResolvers.set(key, resolver$$1);
        }
        else if (result.strategy === 4) {
            result.state.push(resolver$$1);
        }
        else {
            allResolvers.set(key, new StrategyResolver(4, [result, resolver$$1]));
        }
        return resolver$$1;
    };
    Container.prototype.autoRegister = function (key, fn) {
        fn = fn === undefined ? key : fn;
        if (typeof fn === 'function') {
            var registration = __WEBPACK_IMPORTED_MODULE_0_aurelia_metadata__["a" /* metadata */].get(__WEBPACK_IMPORTED_MODULE_0_aurelia_metadata__["a" /* metadata */].registration, fn);
            if (registration === undefined) {
                return this.registerResolver(key, new StrategyResolver(1, fn));
            }
            return registration.registerResolver(this, key, fn);
        }
        return this.registerResolver(key, new StrategyResolver(0, fn));
    };
    Container.prototype.autoRegisterAll = function (fns) {
        var i = fns.length;
        while (i--) {
            this.autoRegister(fns[i]);
        }
    };
    Container.prototype.unregister = function (key) {
        this._resolvers.delete(key);
    };
    Container.prototype.hasResolver = function (key, checkParent) {
        if (checkParent === void 0) { checkParent = false; }
        validateKey(key);
        return (this._resolvers.has(key) ||
            (checkParent &&
                this.parent !== null &&
                this.parent.hasResolver(key, checkParent)));
    };
    Container.prototype.getResolver = function (key) {
        return this._resolvers.get(key);
    };
    Container.prototype.get = function (key) {
        validateKey(key);
        if (key === Container) {
            return this;
        }
        if (resolverDecorates(key)) {
            return key.get(this, key);
        }
        var resolver$$1 = this._resolvers.get(key);
        if (resolver$$1 === undefined) {
            if (this.parent === null) {
                return this.autoRegister(key).get(this, key);
            }
            var registration = __WEBPACK_IMPORTED_MODULE_0_aurelia_metadata__["a" /* metadata */].get(__WEBPACK_IMPORTED_MODULE_0_aurelia_metadata__["a" /* metadata */].registration, key);
            if (registration === undefined) {
                return this.parent._get(key);
            }
            return registration.registerResolver(this, key, key).get(this, key);
        }
        return resolver$$1.get(this, key);
    };
    Container.prototype._get = function (key) {
        var resolver$$1 = this._resolvers.get(key);
        if (resolver$$1 === undefined) {
            if (this.parent === null) {
                return this.autoRegister(key).get(this, key);
            }
            return this.parent._get(key);
        }
        return resolver$$1.get(this, key);
    };
    Container.prototype.getAll = function (key) {
        validateKey(key);
        var resolver$$1 = this._resolvers.get(key);
        if (resolver$$1 === undefined) {
            if (this.parent === null) {
                return _emptyParameters;
            }
            return this.parent.getAll(key);
        }
        if (resolver$$1.strategy === 4) {
            var state = resolver$$1.state;
            var i = state.length;
            var results = new Array(i);
            while (i--) {
                results[i] = state[i].get(this, key);
            }
            return results;
        }
        return [resolver$$1.get(this, key)];
    };
    Container.prototype.createChild = function () {
        var child = new Container(this._configuration);
        child.root = this.root;
        child.parent = this;
        return child;
    };
    Container.prototype.invoke = function (fn, dynamicDependencies) {
        try {
            var handler = this._handlers.get(fn);
            if (handler === undefined) {
                handler = this._createInvocationHandler(fn);
                this._handlers.set(fn, handler);
            }
            return handler.invoke(this, dynamicDependencies);
        }
        catch (e) {
            throw new __WEBPACK_IMPORTED_MODULE_1_aurelia_pal__["e" /* AggregateError */]("Error invoking " + fn.name + ". Check the inner error for details.", e, true);
        }
    };
    Container.prototype._createInvocationHandler = function (fn) {
        var dependencies;
        if (fn.inject === undefined) {
            dependencies =
                __WEBPACK_IMPORTED_MODULE_0_aurelia_metadata__["a" /* metadata */].getOwn(__WEBPACK_IMPORTED_MODULE_0_aurelia_metadata__["a" /* metadata */].paramTypes, fn) || _emptyParameters;
        }
        else {
            dependencies = [];
            var ctor = fn;
            while (typeof ctor === 'function') {
                dependencies.push.apply(dependencies, getDependencies(ctor));
                ctor = Object.getPrototypeOf(ctor);
            }
        }
        var invoker = __WEBPACK_IMPORTED_MODULE_0_aurelia_metadata__["a" /* metadata */].getOwn(__WEBPACK_IMPORTED_MODULE_0_aurelia_metadata__["a" /* metadata */].invoker, fn) || classInvoker;
        var handler = new InvocationHandler(fn, invoker, dependencies);
        return this._onHandlerCreated !== undefined
            ? this._onHandlerCreated(handler)
            : handler;
    };
    return Container;
}());

function invoker(value) {
    return function (target) {
        __WEBPACK_IMPORTED_MODULE_0_aurelia_metadata__["a" /* metadata */].define(__WEBPACK_IMPORTED_MODULE_0_aurelia_metadata__["a" /* metadata */].invoker, value, target);
    };
}
function invokeAsFactory(potentialTarget) {
    var deco = function (target) {
        __WEBPACK_IMPORTED_MODULE_0_aurelia_metadata__["a" /* metadata */].define(__WEBPACK_IMPORTED_MODULE_0_aurelia_metadata__["a" /* metadata */].invoker, FactoryInvoker.instance, target);
    };
    return potentialTarget ? deco(potentialTarget) : deco;
}
var FactoryInvoker = (function () {
    function FactoryInvoker() {
    }
    FactoryInvoker.prototype.invoke = function (container, fn, dependencies) {
        var i = dependencies.length;
        var args = new Array(i);
        while (i--) {
            args[i] = container.get(dependencies[i]);
        }
        return fn.apply(undefined, args);
    };
    FactoryInvoker.prototype.invokeWithDynamicDependencies = function (container, fn, staticDependencies, dynamicDependencies) {
        var i = staticDependencies.length;
        var args = new Array(i);
        while (i--) {
            args[i] = container.get(staticDependencies[i]);
        }
        if (dynamicDependencies !== undefined) {
            args = args.concat(dynamicDependencies);
        }
        return fn.apply(undefined, args);
    };
    return FactoryInvoker;
}());
FactoryInvoker.instance = new FactoryInvoker();

function registration(value) {
    return function (target) {
        __WEBPACK_IMPORTED_MODULE_0_aurelia_metadata__["a" /* metadata */].define(__WEBPACK_IMPORTED_MODULE_0_aurelia_metadata__["a" /* metadata */].registration, value, target);
    };
}
function transient(key) {
    return registration(new TransientRegistration(key));
}
function singleton(keyOrRegisterInChild, registerInChild) {
    if (registerInChild === void 0) { registerInChild = false; }
    return registration(new SingletonRegistration(keyOrRegisterInChild, registerInChild));
}
var TransientRegistration = (function () {
    function TransientRegistration(key) {
        this._key = key;
    }
    TransientRegistration.prototype.registerResolver = function (container, key, fn) {
        var existingResolver = container.getResolver(this._key || key);
        return existingResolver === undefined
            ? container.registerTransient((this._key || key), fn)
            : existingResolver;
    };
    return TransientRegistration;
}());
var SingletonRegistration = (function () {
    function SingletonRegistration(keyOrRegisterInChild, registerInChild) {
        if (registerInChild === void 0) { registerInChild = false; }
        if (typeof keyOrRegisterInChild === 'boolean') {
            this._registerInChild = keyOrRegisterInChild;
        }
        else {
            this._key = keyOrRegisterInChild;
            this._registerInChild = registerInChild;
        }
    }
    SingletonRegistration.prototype.registerResolver = function (container, key, fn) {
        var targetContainer = this._registerInChild ? container : container.root;
        var existingResolver = targetContainer.getResolver(this._key || key);
        return existingResolver === undefined
            ? targetContainer.registerSingleton(this._key || key, fn)
            : existingResolver;
    };
    return SingletonRegistration;
}());




/***/ }),

/***/ 6:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export TemplateDependency */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return TemplateRegistryEntry; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Loader; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_aurelia_path__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_aurelia_metadata__ = __webpack_require__(1);
var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();






var TemplateDependency = function TemplateDependency(src, name) {
  

  this.src = src;
  this.name = name;
};

var TemplateRegistryEntry = function () {
  function TemplateRegistryEntry(address) {
    

    this.templateIsLoaded = false;
    this.factoryIsReady = false;
    this.resources = null;
    this.dependencies = null;

    this.address = address;
    this.onReady = null;
    this._template = null;
    this._factory = null;
  }

  TemplateRegistryEntry.prototype.addDependency = function addDependency(src, name) {
    var finalSrc = typeof src === 'string' ? __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0_aurelia_path__["a" /* relativeToFile */])(src, this.address) : __WEBPACK_IMPORTED_MODULE_1_aurelia_metadata__["c" /* Origin */].get(src).moduleId;

    this.dependencies.push(new TemplateDependency(finalSrc, name));
  };

  _createClass(TemplateRegistryEntry, [{
    key: 'template',
    get: function get() {
      return this._template;
    },
    set: function set(value) {
      var address = this.address;
      var requires = void 0;
      var current = void 0;
      var src = void 0;
      var dependencies = void 0;

      this._template = value;
      this.templateIsLoaded = true;

      requires = value.content.querySelectorAll('require');
      dependencies = this.dependencies = new Array(requires.length);

      for (var i = 0, ii = requires.length; i < ii; ++i) {
        current = requires[i];
        src = current.getAttribute('from');

        if (!src) {
          throw new Error('<require> element in ' + address + ' has no "from" attribute.');
        }

        dependencies[i] = new TemplateDependency(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0_aurelia_path__["a" /* relativeToFile */])(src, address), current.getAttribute('as'));

        if (current.parentNode) {
          current.parentNode.removeChild(current);
        }
      }
    }
  }, {
    key: 'factory',
    get: function get() {
      return this._factory;
    },
    set: function set(value) {
      this._factory = value;
      this.factoryIsReady = true;
    }
  }]);

  return TemplateRegistryEntry;
}();

var Loader = function () {
  function Loader() {
    

    this.templateRegistry = {};
  }

  Loader.prototype.map = function map(id, source) {
    throw new Error('Loaders must implement map(id, source).');
  };

  Loader.prototype.normalizeSync = function normalizeSync(moduleId, relativeTo) {
    throw new Error('Loaders must implement normalizeSync(moduleId, relativeTo).');
  };

  Loader.prototype.normalize = function normalize(moduleId, relativeTo) {
    throw new Error('Loaders must implement normalize(moduleId: string, relativeTo: string): Promise<string>.');
  };

  Loader.prototype.loadModule = function loadModule(id) {
    throw new Error('Loaders must implement loadModule(id).');
  };

  Loader.prototype.loadAllModules = function loadAllModules(ids) {
    throw new Error('Loader must implement loadAllModules(ids).');
  };

  Loader.prototype.loadTemplate = function loadTemplate(url) {
    throw new Error('Loader must implement loadTemplate(url).');
  };

  Loader.prototype.loadText = function loadText(url) {
    throw new Error('Loader must implement loadText(url).');
  };

  Loader.prototype.applyPluginToUrl = function applyPluginToUrl(url, pluginName) {
    throw new Error('Loader must implement applyPluginToUrl(url, pluginName).');
  };

  Loader.prototype.addPlugin = function addPlugin(pluginName, implementation) {
    throw new Error('Loader must implement addPlugin(pluginName, implementation).');
  };

  Loader.prototype.getOrCreateTemplateRegistryEntry = function getOrCreateTemplateRegistryEntry(address) {
    return this.templateRegistry[address] || (this.templateRegistry[address] = new TemplateRegistryEntry(address));
  };

  return Loader;
}();

/***/ }),

/***/ 7:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export getArrayObserver */
/* unused harmony export getMapObserver */
/* unused harmony export getSetObserver */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "p", function() { return targetContext; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "k", function() { return sourceContext; });
/* harmony export (immutable) */ __webpack_exports__["b"] = camelCase;
/* harmony export (immutable) */ __webpack_exports__["d"] = createOverrideContext;
/* unused harmony export getContextFor */
/* unused harmony export createScopeForTest */
/* harmony export (immutable) */ __webpack_exports__["s"] = connectable;
/* harmony export (immutable) */ __webpack_exports__["t"] = enqueueBindingConnect;
/* unused harmony export setConnectQueueThreshold */
/* unused harmony export enableConnectQueue */
/* unused harmony export disableConnectQueue */
/* unused harmony export getConnectQueueSize */
/* harmony export (immutable) */ __webpack_exports__["e"] = subscriberCollection;
/* unused harmony export ExpressionObserver */
/* unused harmony export calcSplices */
/* harmony export (immutable) */ __webpack_exports__["l"] = mergeSplice;
/* unused harmony export projectArraySplices */
/* unused harmony export getChangeRecords */
/* unused harmony export ModifyCollectionObserver */
/* unused harmony export CollectionLengthObserver */
/* unused harmony export Expression */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "i", function() { return BindingBehavior; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "j", function() { return ValueConverter; });
/* unused harmony export Assign */
/* unused harmony export Conditional */
/* unused harmony export AccessThis */
/* unused harmony export AccessScope */
/* unused harmony export AccessMember */
/* unused harmony export AccessKeyed */
/* unused harmony export CallScope */
/* unused harmony export CallMember */
/* unused harmony export CallFunction */
/* unused harmony export Binary */
/* unused harmony export Unary */
/* unused harmony export LiteralPrimitive */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "A", function() { return LiteralString; });
/* unused harmony export LiteralTemplate */
/* unused harmony export LiteralArray */
/* unused harmony export LiteralObject */
/* unused harmony export Unparser */
/* unused harmony export ExpressionCloner */
/* unused harmony export cloneExpression */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "f", function() { return bindingMode; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "y", function() { return Parser; });
/* unused harmony export ParserImplementation */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "w", function() { return delegationStrategy; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "h", function() { return EventManager; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "q", function() { return EventSubscriber; });
/* unused harmony export DirtyChecker */
/* unused harmony export DirtyCheckProperty */
/* unused harmony export propertyAccessor */
/* unused harmony export PrimitiveObserver */
/* unused harmony export SetterObserver */
/* unused harmony export XLinkAttributeObserver */
/* unused harmony export dataAttributeAccessor */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "n", function() { return DataAttributeObserver; });
/* unused harmony export StyleObserver */
/* unused harmony export ValueAttributeObserver */
/* unused harmony export CheckedObserver */
/* unused harmony export SelectValueObserver */
/* unused harmony export ClassObserver */
/* unused harmony export hasDeclaredDependencies */
/* unused harmony export declarePropertyDependencies */
/* harmony export (immutable) */ __webpack_exports__["B"] = computedFrom;
/* unused harmony export ComputedExpression */
/* unused harmony export createComputedObserver */
/* unused harmony export elements */
/* unused harmony export presentationElements */
/* unused harmony export presentationAttributes */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "r", function() { return SVGAnalyzer; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "g", function() { return ObserverLocator; });
/* unused harmony export ObjectObservationAdapter */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "u", function() { return BindingExpression; });
/* unused harmony export Binding */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "x", function() { return CallExpression; });
/* unused harmony export Call */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ValueConverterResource; });
/* harmony export (immutable) */ __webpack_exports__["m"] = valueConverter;
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return BindingBehaviorResource; });
/* harmony export (immutable) */ __webpack_exports__["o"] = bindingBehavior;
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "v", function() { return ListenerExpression; });
/* unused harmony export Listener */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "z", function() { return NameExpression; });
/* unused harmony export BindingEngine */
/* unused harmony export observable */
/* unused harmony export connectBindingToSignal */
/* unused harmony export signalBindings */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_aurelia_logging__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_aurelia_pal__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_aurelia_task_queue__ = __webpack_require__(8);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_aurelia_metadata__ = __webpack_require__(1);




var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _dec, _dec2, _class, _dec3, _class2, _dec4, _class3, _dec5, _class5, _dec6, _class7, _dec7, _class8, _dec8, _class9, _dec9, _class10, _class12, _temp, _dec10, _class13, _class14, _temp2;

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }








var targetContext = 'Binding:target';
var sourceContext = 'Binding:source';

var map = Object.create(null);

function camelCase(name) {
  if (name in map) {
    return map[name];
  }
  var result = name.charAt(0).toLowerCase() + name.slice(1).replace(/[_.-](\w|$)/g, function (_, x) {
    return x.toUpperCase();
  });
  map[name] = result;
  return result;
}

function createOverrideContext(bindingContext, parentOverrideContext) {
  return {
    bindingContext: bindingContext,
    parentOverrideContext: parentOverrideContext || null
  };
}

function getContextFor(name, scope, ancestor) {
  var oc = scope.overrideContext;

  if (ancestor) {
    while (ancestor && oc) {
      ancestor--;
      oc = oc.parentOverrideContext;
    }
    if (ancestor || !oc) {
      return undefined;
    }
    return name in oc ? oc : oc.bindingContext;
  }

  while (oc && !(name in oc) && !(oc.bindingContext && name in oc.bindingContext)) {
    oc = oc.parentOverrideContext;
  }
  if (oc) {
    return name in oc ? oc : oc.bindingContext;
  }

  return scope.bindingContext || scope.overrideContext;
}

function createScopeForTest(bindingContext, parentBindingContext) {
  if (parentBindingContext) {
    return {
      bindingContext: bindingContext,
      overrideContext: createOverrideContext(bindingContext, createOverrideContext(parentBindingContext))
    };
  }
  return {
    bindingContext: bindingContext,
    overrideContext: createOverrideContext(bindingContext)
  };
}

var slotNames = [];
var versionSlotNames = [];
var lastSlot = -1;
function ensureEnoughSlotNames(currentSlot) {
  if (currentSlot === lastSlot) {
    lastSlot += 5;
    var ii = slotNames.length = versionSlotNames.length = lastSlot + 1;
    for (var i = currentSlot + 1; i < ii; ++i) {
      slotNames[i] = '_observer' + i;
      versionSlotNames[i] = '_observerVersion' + i;
    }
  }
}
ensureEnoughSlotNames(-1);

function addObserver(observer) {
  var observerSlots = this._observerSlots === undefined ? 0 : this._observerSlots;
  var i = observerSlots;
  while (i-- && this[slotNames[i]] !== observer) {}

  if (i === -1) {
    i = 0;
    while (this[slotNames[i]]) {
      i++;
    }
    this[slotNames[i]] = observer;
    observer.subscribe(sourceContext, this);

    if (i === observerSlots) {
      this._observerSlots = i + 1;
    }
  }

  if (this._version === undefined) {
    this._version = 0;
  }
  this[versionSlotNames[i]] = this._version;
  ensureEnoughSlotNames(i);
}

function observeProperty(obj, propertyName) {
  var observer = this.observerLocator.getObserver(obj, propertyName);
  addObserver.call(this, observer);
}

function observeArray(array) {
  var observer = this.observerLocator.getArrayObserver(array);
  addObserver.call(this, observer);
}

function unobserve(all) {
  var i = this._observerSlots;
  while (i--) {
    if (all || this[versionSlotNames[i]] !== this._version) {
      var observer = this[slotNames[i]];
      this[slotNames[i]] = null;
      if (observer) {
        observer.unsubscribe(sourceContext, this);
      }
    }
  }
}

function connectable() {
  return function (target) {
    target.prototype.observeProperty = observeProperty;
    target.prototype.observeArray = observeArray;
    target.prototype.unobserve = unobserve;
    target.prototype.addObserver = addObserver;
  };
}

var queue = [];
var queued = {};
var nextId = 0;
var minimumImmediate = 100;
var frameBudget = 15;

var isFlushRequested = false;
var immediate = 0;

function flush(animationFrameStart) {
  var length = queue.length;
  var i = 0;
  while (i < length) {
    var binding = queue[i];
    queued[binding.__connectQueueId] = false;
    binding.connect(true);
    i++;

    if (i % 100 === 0 && __WEBPACK_IMPORTED_MODULE_1_aurelia_pal__["a" /* PLATFORM */].performance.now() - animationFrameStart > frameBudget) {
      break;
    }
  }
  queue.splice(0, i);

  if (queue.length) {
    __WEBPACK_IMPORTED_MODULE_1_aurelia_pal__["a" /* PLATFORM */].requestAnimationFrame(flush);
  } else {
    isFlushRequested = false;
    immediate = 0;
  }
}

function enqueueBindingConnect(binding) {
  if (immediate < minimumImmediate) {
    immediate++;
    binding.connect(false);
  } else {
    var id = binding.__connectQueueId;
    if (id === undefined) {
      id = nextId;
      nextId++;
      binding.__connectQueueId = id;
    }

    if (!queued[id]) {
      queue.push(binding);
      queued[id] = true;
    }
  }
  if (!isFlushRequested) {
    isFlushRequested = true;
    __WEBPACK_IMPORTED_MODULE_1_aurelia_pal__["a" /* PLATFORM */].requestAnimationFrame(flush);
  }
}

function setConnectQueueThreshold(value) {
  minimumImmediate = value;
}

function enableConnectQueue() {
  setConnectQueueThreshold(100);
}

function disableConnectQueue() {
  setConnectQueueThreshold(Number.MAX_SAFE_INTEGER);
}

function getConnectQueueSize() {
  return queue.length;
}

function addSubscriber(context, callable) {
  if (this.hasSubscriber(context, callable)) {
    return false;
  }
  if (!this._context0) {
    this._context0 = context;
    this._callable0 = callable;
    return true;
  }
  if (!this._context1) {
    this._context1 = context;
    this._callable1 = callable;
    return true;
  }
  if (!this._context2) {
    this._context2 = context;
    this._callable2 = callable;
    return true;
  }
  if (!this._contextsRest) {
    this._contextsRest = [context];
    this._callablesRest = [callable];
    return true;
  }
  this._contextsRest.push(context);
  this._callablesRest.push(callable);
  return true;
}

function removeSubscriber(context, callable) {
  if (this._context0 === context && this._callable0 === callable) {
    this._context0 = null;
    this._callable0 = null;
    return true;
  }
  if (this._context1 === context && this._callable1 === callable) {
    this._context1 = null;
    this._callable1 = null;
    return true;
  }
  if (this._context2 === context && this._callable2 === callable) {
    this._context2 = null;
    this._callable2 = null;
    return true;
  }
  var callables = this._callablesRest;
  if (callables === undefined || callables.length === 0) {
    return false;
  }
  var contexts = this._contextsRest;
  var i = 0;
  while (!(callables[i] === callable && contexts[i] === context) && callables.length > i) {
    i++;
  }
  if (i >= callables.length) {
    return false;
  }
  contexts.splice(i, 1);
  callables.splice(i, 1);
  return true;
}

var arrayPool1 = [];
var arrayPool2 = [];
var poolUtilization = [];

function callSubscribers(newValue, oldValue) {
  var context0 = this._context0;
  var callable0 = this._callable0;
  var context1 = this._context1;
  var callable1 = this._callable1;
  var context2 = this._context2;
  var callable2 = this._callable2;
  var length = this._contextsRest ? this._contextsRest.length : 0;
  var contextsRest = void 0;
  var callablesRest = void 0;
  var poolIndex = void 0;
  var i = void 0;
  if (length) {
    poolIndex = poolUtilization.length;
    while (poolIndex-- && poolUtilization[poolIndex]) {}
    if (poolIndex < 0) {
      poolIndex = poolUtilization.length;
      contextsRest = [];
      callablesRest = [];
      poolUtilization.push(true);
      arrayPool1.push(contextsRest);
      arrayPool2.push(callablesRest);
    } else {
      poolUtilization[poolIndex] = true;
      contextsRest = arrayPool1[poolIndex];
      callablesRest = arrayPool2[poolIndex];
    }

    i = length;
    while (i--) {
      contextsRest[i] = this._contextsRest[i];
      callablesRest[i] = this._callablesRest[i];
    }
  }

  if (context0) {
    if (callable0) {
      callable0.call(context0, newValue, oldValue);
    } else {
      context0(newValue, oldValue);
    }
  }
  if (context1) {
    if (callable1) {
      callable1.call(context1, newValue, oldValue);
    } else {
      context1(newValue, oldValue);
    }
  }
  if (context2) {
    if (callable2) {
      callable2.call(context2, newValue, oldValue);
    } else {
      context2(newValue, oldValue);
    }
  }
  if (length) {
    for (i = 0; i < length; i++) {
      var callable = callablesRest[i];
      var context = contextsRest[i];
      if (callable) {
        callable.call(context, newValue, oldValue);
      } else {
        context(newValue, oldValue);
      }
      contextsRest[i] = null;
      callablesRest[i] = null;
    }
    poolUtilization[poolIndex] = false;
  }
}

function hasSubscribers() {
  return !!(this._context0 || this._context1 || this._context2 || this._contextsRest && this._contextsRest.length);
}

function hasSubscriber(context, callable) {
  var has = this._context0 === context && this._callable0 === callable || this._context1 === context && this._callable1 === callable || this._context2 === context && this._callable2 === callable;
  if (has) {
    return true;
  }
  var index = void 0;
  var contexts = this._contextsRest;
  if (!contexts || (index = contexts.length) === 0) {
    return false;
  }
  var callables = this._callablesRest;
  while (index--) {
    if (contexts[index] === context && callables[index] === callable) {
      return true;
    }
  }
  return false;
}

function subscriberCollection() {
  return function (target) {
    target.prototype.addSubscriber = addSubscriber;
    target.prototype.removeSubscriber = removeSubscriber;
    target.prototype.callSubscribers = callSubscribers;
    target.prototype.hasSubscribers = hasSubscribers;
    target.prototype.hasSubscriber = hasSubscriber;
  };
}

var ExpressionObserver = (_dec = connectable(), _dec2 = subscriberCollection(), _dec(_class = _dec2(_class = function () {
  function ExpressionObserver(scope, expression, observerLocator, lookupFunctions) {
    

    this.scope = scope;
    this.expression = expression;
    this.observerLocator = observerLocator;
    this.lookupFunctions = lookupFunctions;
  }

  ExpressionObserver.prototype.getValue = function getValue() {
    return this.expression.evaluate(this.scope, this.lookupFunctions);
  };

  ExpressionObserver.prototype.setValue = function setValue(newValue) {
    this.expression.assign(this.scope, newValue);
  };

  ExpressionObserver.prototype.subscribe = function subscribe(context, callable) {
    var _this = this;

    if (!this.hasSubscribers()) {
      this.oldValue = this.expression.evaluate(this.scope, this.lookupFunctions);
      this.expression.connect(this, this.scope);
    }
    this.addSubscriber(context, callable);
    if (arguments.length === 1 && context instanceof Function) {
      return {
        dispose: function dispose() {
          _this.unsubscribe(context, callable);
        }
      };
    }
  };

  ExpressionObserver.prototype.unsubscribe = function unsubscribe(context, callable) {
    if (this.removeSubscriber(context, callable) && !this.hasSubscribers()) {
      this.unobserve(true);
      this.oldValue = undefined;
    }
  };

  ExpressionObserver.prototype.call = function call() {
    var newValue = this.expression.evaluate(this.scope, this.lookupFunctions);
    var oldValue = this.oldValue;
    if (newValue !== oldValue) {
      this.oldValue = newValue;
      this.callSubscribers(newValue, oldValue);
    }
    this._version++;
    this.expression.connect(this, this.scope);
    this.unobserve(false);
  };

  return ExpressionObserver;
}()) || _class) || _class);

function isIndex(s) {
  return +s === s >>> 0;
}

function toNumber(s) {
  return +s;
}

function newSplice(index, removed, addedCount) {
  return {
    index: index,
    removed: removed,
    addedCount: addedCount
  };
}

var EDIT_LEAVE = 0;
var EDIT_UPDATE = 1;
var EDIT_ADD = 2;
var EDIT_DELETE = 3;

function ArraySplice() {}

ArraySplice.prototype = {
  calcEditDistances: function calcEditDistances(current, currentStart, currentEnd, old, oldStart, oldEnd) {
    var rowCount = oldEnd - oldStart + 1;
    var columnCount = currentEnd - currentStart + 1;
    var distances = new Array(rowCount);
    var north = void 0;
    var west = void 0;

    for (var i = 0; i < rowCount; ++i) {
      distances[i] = new Array(columnCount);
      distances[i][0] = i;
    }

    for (var j = 0; j < columnCount; ++j) {
      distances[0][j] = j;
    }

    for (var _i = 1; _i < rowCount; ++_i) {
      for (var _j = 1; _j < columnCount; ++_j) {
        if (this.equals(current[currentStart + _j - 1], old[oldStart + _i - 1])) {
          distances[_i][_j] = distances[_i - 1][_j - 1];
        } else {
          north = distances[_i - 1][_j] + 1;
          west = distances[_i][_j - 1] + 1;
          distances[_i][_j] = north < west ? north : west;
        }
      }
    }

    return distances;
  },

  spliceOperationsFromEditDistances: function spliceOperationsFromEditDistances(distances) {
    var i = distances.length - 1;
    var j = distances[0].length - 1;
    var current = distances[i][j];
    var edits = [];
    while (i > 0 || j > 0) {
      if (i === 0) {
        edits.push(EDIT_ADD);
        j--;
        continue;
      }
      if (j === 0) {
        edits.push(EDIT_DELETE);
        i--;
        continue;
      }
      var northWest = distances[i - 1][j - 1];
      var west = distances[i - 1][j];
      var north = distances[i][j - 1];

      var min = void 0;
      if (west < north) {
        min = west < northWest ? west : northWest;
      } else {
        min = north < northWest ? north : northWest;
      }

      if (min === northWest) {
        if (northWest === current) {
          edits.push(EDIT_LEAVE);
        } else {
          edits.push(EDIT_UPDATE);
          current = northWest;
        }
        i--;
        j--;
      } else if (min === west) {
        edits.push(EDIT_DELETE);
        i--;
        current = west;
      } else {
        edits.push(EDIT_ADD);
        j--;
        current = north;
      }
    }

    edits.reverse();
    return edits;
  },

  calcSplices: function calcSplices(current, currentStart, currentEnd, old, oldStart, oldEnd) {
    var prefixCount = 0;
    var suffixCount = 0;

    var minLength = Math.min(currentEnd - currentStart, oldEnd - oldStart);
    if (currentStart === 0 && oldStart === 0) {
      prefixCount = this.sharedPrefix(current, old, minLength);
    }

    if (currentEnd === current.length && oldEnd === old.length) {
      suffixCount = this.sharedSuffix(current, old, minLength - prefixCount);
    }

    currentStart += prefixCount;
    oldStart += prefixCount;
    currentEnd -= suffixCount;
    oldEnd -= suffixCount;

    if (currentEnd - currentStart === 0 && oldEnd - oldStart === 0) {
      return [];
    }

    if (currentStart === currentEnd) {
      var _splice = newSplice(currentStart, [], 0);
      while (oldStart < oldEnd) {
        _splice.removed.push(old[oldStart++]);
      }

      return [_splice];
    } else if (oldStart === oldEnd) {
      return [newSplice(currentStart, [], currentEnd - currentStart)];
    }

    var ops = this.spliceOperationsFromEditDistances(this.calcEditDistances(current, currentStart, currentEnd, old, oldStart, oldEnd));

    var splice = undefined;
    var splices = [];
    var index = currentStart;
    var oldIndex = oldStart;
    for (var i = 0; i < ops.length; ++i) {
      switch (ops[i]) {
        case EDIT_LEAVE:
          if (splice) {
            splices.push(splice);
            splice = undefined;
          }

          index++;
          oldIndex++;
          break;
        case EDIT_UPDATE:
          if (!splice) {
            splice = newSplice(index, [], 0);
          }

          splice.addedCount++;
          index++;

          splice.removed.push(old[oldIndex]);
          oldIndex++;
          break;
        case EDIT_ADD:
          if (!splice) {
            splice = newSplice(index, [], 0);
          }

          splice.addedCount++;
          index++;
          break;
        case EDIT_DELETE:
          if (!splice) {
            splice = newSplice(index, [], 0);
          }

          splice.removed.push(old[oldIndex]);
          oldIndex++;
          break;
      }
    }

    if (splice) {
      splices.push(splice);
    }
    return splices;
  },

  sharedPrefix: function sharedPrefix(current, old, searchLength) {
    for (var i = 0; i < searchLength; ++i) {
      if (!this.equals(current[i], old[i])) {
        return i;
      }
    }

    return searchLength;
  },

  sharedSuffix: function sharedSuffix(current, old, searchLength) {
    var index1 = current.length;
    var index2 = old.length;
    var count = 0;
    while (count < searchLength && this.equals(current[--index1], old[--index2])) {
      count++;
    }

    return count;
  },

  calculateSplices: function calculateSplices(current, previous) {
    return this.calcSplices(current, 0, current.length, previous, 0, previous.length);
  },

  equals: function equals(currentValue, previousValue) {
    return currentValue === previousValue;
  }
};

var arraySplice = new ArraySplice();

function calcSplices(current, currentStart, currentEnd, old, oldStart, oldEnd) {
  return arraySplice.calcSplices(current, currentStart, currentEnd, old, oldStart, oldEnd);
}

function intersect(start1, end1, start2, end2) {
  if (end1 < start2 || end2 < start1) {
    return -1;
  }

  if (end1 === start2 || end2 === start1) {
    return 0;
  }

  if (start1 < start2) {
    if (end1 < end2) {
      return end1 - start2;
    }

    return end2 - start2;
  }

  if (end2 < end1) {
    return end2 - start1;
  }

  return end1 - start1;
}

function mergeSplice(splices, index, removed, addedCount) {
  var splice = newSplice(index, removed, addedCount);

  var inserted = false;
  var insertionOffset = 0;

  for (var i = 0; i < splices.length; i++) {
    var current = splices[i];
    current.index += insertionOffset;

    if (inserted) {
      continue;
    }

    var intersectCount = intersect(splice.index, splice.index + splice.removed.length, current.index, current.index + current.addedCount);

    if (intersectCount >= 0) {

      splices.splice(i, 1);
      i--;

      insertionOffset -= current.addedCount - current.removed.length;

      splice.addedCount += current.addedCount - intersectCount;
      var deleteCount = splice.removed.length + current.removed.length - intersectCount;

      if (!splice.addedCount && !deleteCount) {
        inserted = true;
      } else {
        var currentRemoved = current.removed;

        if (splice.index < current.index) {
          var prepend = splice.removed.slice(0, current.index - splice.index);
          Array.prototype.push.apply(prepend, currentRemoved);
          currentRemoved = prepend;
        }

        if (splice.index + splice.removed.length > current.index + current.addedCount) {
          var append = splice.removed.slice(current.index + current.addedCount - splice.index);
          Array.prototype.push.apply(currentRemoved, append);
        }

        splice.removed = currentRemoved;
        if (current.index < splice.index) {
          splice.index = current.index;
        }
      }
    } else if (splice.index < current.index) {

      inserted = true;

      splices.splice(i, 0, splice);
      i++;

      var offset = splice.addedCount - splice.removed.length;
      current.index += offset;
      insertionOffset += offset;
    }
  }

  if (!inserted) {
    splices.push(splice);
  }
}

function createInitialSplices(array, changeRecords) {
  var splices = [];

  for (var i = 0; i < changeRecords.length; i++) {
    var record = changeRecords[i];
    switch (record.type) {
      case 'splice':
        mergeSplice(splices, record.index, record.removed.slice(), record.addedCount);
        break;
      case 'add':
      case 'update':
      case 'delete':
        if (!isIndex(record.name)) {
          continue;
        }

        var index = toNumber(record.name);
        if (index < 0) {
          continue;
        }

        mergeSplice(splices, index, [record.oldValue], record.type === 'delete' ? 0 : 1);
        break;
      default:
        console.error('Unexpected record type: ' + JSON.stringify(record));
        break;
    }
  }

  return splices;
}

function projectArraySplices(array, changeRecords) {
  var splices = [];

  createInitialSplices(array, changeRecords).forEach(function (splice) {
    if (splice.addedCount === 1 && splice.removed.length === 1) {
      if (splice.removed[0] !== array[splice.index]) {
        splices.push(splice);
      }

      return;
    }

    splices = splices.concat(calcSplices(array, splice.index, splice.index + splice.addedCount, splice.removed, 0, splice.removed.length));
  });

  return splices;
}

function newRecord(type, object, key, oldValue) {
  return {
    type: type,
    object: object,
    key: key,
    oldValue: oldValue
  };
}

function getChangeRecords(map) {
  var entries = new Array(map.size);
  var keys = map.keys();
  var i = 0;
  var item = void 0;

  while (item = keys.next()) {
    if (item.done) {
      break;
    }

    entries[i] = newRecord('added', map, item.value);
    i++;
  }

  return entries;
}

var ModifyCollectionObserver = (_dec3 = subscriberCollection(), _dec3(_class2 = function () {
  function ModifyCollectionObserver(taskQueue, collection) {
    

    this.taskQueue = taskQueue;
    this.queued = false;
    this.changeRecords = null;
    this.oldCollection = null;
    this.collection = collection;
    this.lengthPropertyName = collection instanceof Map || collection instanceof Set ? 'size' : 'length';
  }

  ModifyCollectionObserver.prototype.subscribe = function subscribe(context, callable) {
    this.addSubscriber(context, callable);
  };

  ModifyCollectionObserver.prototype.unsubscribe = function unsubscribe(context, callable) {
    this.removeSubscriber(context, callable);
  };

  ModifyCollectionObserver.prototype.addChangeRecord = function addChangeRecord(changeRecord) {
    if (!this.hasSubscribers() && !this.lengthObserver) {
      return;
    }

    if (changeRecord.type === 'splice') {
      var index = changeRecord.index;
      var arrayLength = changeRecord.object.length;
      if (index > arrayLength) {
        index = arrayLength - changeRecord.addedCount;
      } else if (index < 0) {
        index = arrayLength + changeRecord.removed.length + index - changeRecord.addedCount;
      }
      if (index < 0) {
        index = 0;
      }
      changeRecord.index = index;
    }

    if (this.changeRecords === null) {
      this.changeRecords = [changeRecord];
    } else {
      this.changeRecords.push(changeRecord);
    }

    if (!this.queued) {
      this.queued = true;
      this.taskQueue.queueMicroTask(this);
    }
  };

  ModifyCollectionObserver.prototype.flushChangeRecords = function flushChangeRecords() {
    if (this.changeRecords && this.changeRecords.length || this.oldCollection) {
      this.call();
    }
  };

  ModifyCollectionObserver.prototype.reset = function reset(oldCollection) {
    this.oldCollection = oldCollection;

    if (this.hasSubscribers() && !this.queued) {
      this.queued = true;
      this.taskQueue.queueMicroTask(this);
    }
  };

  ModifyCollectionObserver.prototype.getLengthObserver = function getLengthObserver() {
    return this.lengthObserver || (this.lengthObserver = new CollectionLengthObserver(this.collection));
  };

  ModifyCollectionObserver.prototype.call = function call() {
    var changeRecords = this.changeRecords;
    var oldCollection = this.oldCollection;
    var records = void 0;

    this.queued = false;
    this.changeRecords = [];
    this.oldCollection = null;

    if (this.hasSubscribers()) {
      if (oldCollection) {
        if (this.collection instanceof Map || this.collection instanceof Set) {
          records = getChangeRecords(oldCollection);
        } else {
          records = calcSplices(this.collection, 0, this.collection.length, oldCollection, 0, oldCollection.length);
        }
      } else {
        if (this.collection instanceof Map || this.collection instanceof Set) {
          records = changeRecords;
        } else {
          records = projectArraySplices(this.collection, changeRecords);
        }
      }

      this.callSubscribers(records);
    }

    if (this.lengthObserver) {
      this.lengthObserver.call(this.collection[this.lengthPropertyName]);
    }
  };

  return ModifyCollectionObserver;
}()) || _class2);

var CollectionLengthObserver = (_dec4 = subscriberCollection(), _dec4(_class3 = function () {
  function CollectionLengthObserver(collection) {
    

    this.collection = collection;
    this.lengthPropertyName = collection instanceof Map || collection instanceof Set ? 'size' : 'length';
    this.currentValue = collection[this.lengthPropertyName];
  }

  CollectionLengthObserver.prototype.getValue = function getValue() {
    return this.collection[this.lengthPropertyName];
  };

  CollectionLengthObserver.prototype.setValue = function setValue(newValue) {
    this.collection[this.lengthPropertyName] = newValue;
  };

  CollectionLengthObserver.prototype.subscribe = function subscribe(context, callable) {
    this.addSubscriber(context, callable);
  };

  CollectionLengthObserver.prototype.unsubscribe = function unsubscribe(context, callable) {
    this.removeSubscriber(context, callable);
  };

  CollectionLengthObserver.prototype.call = function call(newValue) {
    var oldValue = this.currentValue;
    this.callSubscribers(newValue, oldValue);
    this.currentValue = newValue;
  };

  return CollectionLengthObserver;
}()) || _class3);

var arrayProto = Array.prototype;
var pop = arrayProto.pop;
var push = arrayProto.push;
var reverse = arrayProto.reverse;
var shift = arrayProto.shift;
var sort = arrayProto.sort;
var splice = arrayProto.splice;
var unshift = arrayProto.unshift;

if (arrayProto.__au_patched__) {
  __WEBPACK_IMPORTED_MODULE_0_aurelia_logging__["getLogger"]('array-observation').warn('Detected 2nd attempt of patching array from Aurelia binding.' + ' This is probably caused by dependency mismatch between core modules and a 3rd party plugin.' + ' Please see https://github.com/aurelia/cli/pull/906 if you are using webpack.');
} else {
  Reflect.defineProperty(arrayProto, '__au_patched__', { value: 1 });
  arrayProto.pop = function () {
    var notEmpty = this.length > 0;
    var methodCallResult = pop.apply(this, arguments);
    if (notEmpty && this.__array_observer__ !== undefined) {
      this.__array_observer__.addChangeRecord({
        type: 'delete',
        object: this,
        name: this.length,
        oldValue: methodCallResult
      });
    }
    return methodCallResult;
  };

  arrayProto.push = function () {
    var methodCallResult = push.apply(this, arguments);
    if (this.__array_observer__ !== undefined) {
      this.__array_observer__.addChangeRecord({
        type: 'splice',
        object: this,
        index: this.length - arguments.length,
        removed: [],
        addedCount: arguments.length
      });
    }
    return methodCallResult;
  };

  arrayProto.reverse = function () {
    var oldArray = void 0;
    if (this.__array_observer__ !== undefined) {
      this.__array_observer__.flushChangeRecords();
      oldArray = this.slice();
    }
    var methodCallResult = reverse.apply(this, arguments);
    if (this.__array_observer__ !== undefined) {
      this.__array_observer__.reset(oldArray);
    }
    return methodCallResult;
  };

  arrayProto.shift = function () {
    var notEmpty = this.length > 0;
    var methodCallResult = shift.apply(this, arguments);
    if (notEmpty && this.__array_observer__ !== undefined) {
      this.__array_observer__.addChangeRecord({
        type: 'delete',
        object: this,
        name: 0,
        oldValue: methodCallResult
      });
    }
    return methodCallResult;
  };

  arrayProto.sort = function () {
    var oldArray = void 0;
    if (this.__array_observer__ !== undefined) {
      this.__array_observer__.flushChangeRecords();
      oldArray = this.slice();
    }
    var methodCallResult = sort.apply(this, arguments);
    if (this.__array_observer__ !== undefined) {
      this.__array_observer__.reset(oldArray);
    }
    return methodCallResult;
  };

  arrayProto.splice = function () {
    var methodCallResult = splice.apply(this, arguments);
    if (this.__array_observer__ !== undefined) {
      this.__array_observer__.addChangeRecord({
        type: 'splice',
        object: this,
        index: +arguments[0],
        removed: methodCallResult,
        addedCount: arguments.length > 2 ? arguments.length - 2 : 0
      });
    }
    return methodCallResult;
  };

  arrayProto.unshift = function () {
    var methodCallResult = unshift.apply(this, arguments);
    if (this.__array_observer__ !== undefined) {
      this.__array_observer__.addChangeRecord({
        type: 'splice',
        object: this,
        index: 0,
        removed: [],
        addedCount: arguments.length
      });
    }
    return methodCallResult;
  };
}

function _getArrayObserver(taskQueue, array) {
  return ModifyArrayObserver.for(taskQueue, array);
}

var ModifyArrayObserver = function (_ModifyCollectionObse) {
  _inherits(ModifyArrayObserver, _ModifyCollectionObse);

  function ModifyArrayObserver(taskQueue, array) {
    

    return _possibleConstructorReturn(this, _ModifyCollectionObse.call(this, taskQueue, array));
  }

  ModifyArrayObserver.for = function _for(taskQueue, array) {
    if (!('__array_observer__' in array)) {
      Reflect.defineProperty(array, '__array_observer__', {
        value: ModifyArrayObserver.create(taskQueue, array),
        enumerable: false, configurable: false
      });
    }
    return array.__array_observer__;
  };

  ModifyArrayObserver.create = function create(taskQueue, array) {
    return new ModifyArrayObserver(taskQueue, array);
  };

  return ModifyArrayObserver;
}(ModifyCollectionObserver);

var Expression = function () {
  function Expression() {
    

    this.isAssignable = false;
  }

  Expression.prototype.evaluate = function evaluate(scope, lookupFunctions, args) {
    throw new Error('Binding expression "' + this + '" cannot be evaluated.');
  };

  Expression.prototype.assign = function assign(scope, value, lookupFunctions) {
    throw new Error('Binding expression "' + this + '" cannot be assigned to.');
  };

  Expression.prototype.toString = function toString() {
    return typeof FEATURE_NO_UNPARSER === 'undefined' ? _Unparser.unparse(this) : Function.prototype.toString.call(this);
  };

  return Expression;
}();

var BindingBehavior = function (_Expression) {
  _inherits(BindingBehavior, _Expression);

  function BindingBehavior(expression, name, args) {
    

    var _this3 = _possibleConstructorReturn(this, _Expression.call(this));

    _this3.expression = expression;
    _this3.name = name;
    _this3.args = args;
    return _this3;
  }

  BindingBehavior.prototype.evaluate = function evaluate(scope, lookupFunctions) {
    return this.expression.evaluate(scope, lookupFunctions);
  };

  BindingBehavior.prototype.assign = function assign(scope, value, lookupFunctions) {
    return this.expression.assign(scope, value, lookupFunctions);
  };

  BindingBehavior.prototype.accept = function accept(visitor) {
    return visitor.visitBindingBehavior(this);
  };

  BindingBehavior.prototype.connect = function connect(binding, scope) {
    this.expression.connect(binding, scope);
  };

  BindingBehavior.prototype.bind = function bind(binding, scope, lookupFunctions) {
    if (this.expression.expression && this.expression.bind) {
      this.expression.bind(binding, scope, lookupFunctions);
    }
    var behavior = lookupFunctions.bindingBehaviors(this.name);
    if (!behavior) {
      throw new Error('No BindingBehavior named "' + this.name + '" was found!');
    }
    var behaviorKey = 'behavior-' + this.name;
    if (binding[behaviorKey]) {
      throw new Error('A binding behavior named "' + this.name + '" has already been applied to "' + this.expression + '"');
    }
    binding[behaviorKey] = behavior;
    behavior.bind.apply(behavior, [binding, scope].concat(evalList(scope, this.args, binding.lookupFunctions)));
  };

  BindingBehavior.prototype.unbind = function unbind(binding, scope) {
    var behaviorKey = 'behavior-' + this.name;
    binding[behaviorKey].unbind(binding, scope);
    binding[behaviorKey] = null;
    if (this.expression.expression && this.expression.unbind) {
      this.expression.unbind(binding, scope);
    }
  };

  return BindingBehavior;
}(Expression);

var ValueConverter = function (_Expression2) {
  _inherits(ValueConverter, _Expression2);

  function ValueConverter(expression, name, args) {
    

    var _this4 = _possibleConstructorReturn(this, _Expression2.call(this));

    _this4.expression = expression;
    _this4.name = name;
    _this4.args = args;
    _this4.allArgs = [expression].concat(args);
    return _this4;
  }

  ValueConverter.prototype.evaluate = function evaluate(scope, lookupFunctions) {
    var converter = lookupFunctions.valueConverters(this.name);
    if (!converter) {
      throw new Error('No ValueConverter named "' + this.name + '" was found!');
    }

    if ('toView' in converter) {
      return converter.toView.apply(converter, evalList(scope, this.allArgs, lookupFunctions));
    }

    return this.allArgs[0].evaluate(scope, lookupFunctions);
  };

  ValueConverter.prototype.assign = function assign(scope, value, lookupFunctions) {
    var converter = lookupFunctions.valueConverters(this.name);
    if (!converter) {
      throw new Error('No ValueConverter named "' + this.name + '" was found!');
    }

    if ('fromView' in converter) {
      value = converter.fromView.apply(converter, [value].concat(evalList(scope, this.args, lookupFunctions)));
    }

    return this.allArgs[0].assign(scope, value, lookupFunctions);
  };

  ValueConverter.prototype.accept = function accept(visitor) {
    return visitor.visitValueConverter(this);
  };

  ValueConverter.prototype.connect = function connect(binding, scope) {
    var expressions = this.allArgs;
    var i = expressions.length;
    while (i--) {
      expressions[i].connect(binding, scope);
    }
    var converter = binding.lookupFunctions.valueConverters(this.name);
    if (!converter) {
      throw new Error('No ValueConverter named "' + this.name + '" was found!');
    }
    var signals = converter.signals;
    if (signals === undefined) {
      return;
    }
    i = signals.length;
    while (i--) {
      connectBindingToSignal(binding, signals[i]);
    }
  };

  return ValueConverter;
}(Expression);

var Assign = function (_Expression3) {
  _inherits(Assign, _Expression3);

  function Assign(target, value) {
    

    var _this5 = _possibleConstructorReturn(this, _Expression3.call(this));

    _this5.target = target;
    _this5.value = value;
    _this5.isAssignable = true;
    return _this5;
  }

  Assign.prototype.evaluate = function evaluate(scope, lookupFunctions) {
    return this.target.assign(scope, this.value.evaluate(scope, lookupFunctions));
  };

  Assign.prototype.accept = function accept(vistor) {
    vistor.visitAssign(this);
  };

  Assign.prototype.connect = function connect(binding, scope) {};

  Assign.prototype.assign = function assign(scope, value) {
    this.value.assign(scope, value);
    this.target.assign(scope, value);
  };

  return Assign;
}(Expression);

var Conditional = function (_Expression4) {
  _inherits(Conditional, _Expression4);

  function Conditional(condition, yes, no) {
    

    var _this6 = _possibleConstructorReturn(this, _Expression4.call(this));

    _this6.condition = condition;
    _this6.yes = yes;
    _this6.no = no;
    return _this6;
  }

  Conditional.prototype.evaluate = function evaluate(scope, lookupFunctions) {
    return !!this.condition.evaluate(scope, lookupFunctions) ? this.yes.evaluate(scope, lookupFunctions) : this.no.evaluate(scope, lookupFunctions);
  };

  Conditional.prototype.accept = function accept(visitor) {
    return visitor.visitConditional(this);
  };

  Conditional.prototype.connect = function connect(binding, scope) {
    this.condition.connect(binding, scope);
    if (this.condition.evaluate(scope)) {
      this.yes.connect(binding, scope);
    } else {
      this.no.connect(binding, scope);
    }
  };

  return Conditional;
}(Expression);

var AccessThis = function (_Expression5) {
  _inherits(AccessThis, _Expression5);

  function AccessThis(ancestor) {
    

    var _this7 = _possibleConstructorReturn(this, _Expression5.call(this));

    _this7.ancestor = ancestor;
    return _this7;
  }

  AccessThis.prototype.evaluate = function evaluate(scope, lookupFunctions) {
    var oc = scope.overrideContext;
    var i = this.ancestor;
    while (i-- && oc) {
      oc = oc.parentOverrideContext;
    }
    return i < 1 && oc ? oc.bindingContext : undefined;
  };

  AccessThis.prototype.accept = function accept(visitor) {
    return visitor.visitAccessThis(this);
  };

  AccessThis.prototype.connect = function connect(binding, scope) {};

  return AccessThis;
}(Expression);

var AccessScope = function (_Expression6) {
  _inherits(AccessScope, _Expression6);

  function AccessScope(name, ancestor) {
    

    var _this8 = _possibleConstructorReturn(this, _Expression6.call(this));

    _this8.name = name;
    _this8.ancestor = ancestor;
    _this8.isAssignable = true;
    return _this8;
  }

  AccessScope.prototype.evaluate = function evaluate(scope, lookupFunctions) {
    var context = getContextFor(this.name, scope, this.ancestor);
    return context[this.name];
  };

  AccessScope.prototype.assign = function assign(scope, value) {
    var context = getContextFor(this.name, scope, this.ancestor);
    return context ? context[this.name] = value : undefined;
  };

  AccessScope.prototype.accept = function accept(visitor) {
    return visitor.visitAccessScope(this);
  };

  AccessScope.prototype.connect = function connect(binding, scope) {
    var context = getContextFor(this.name, scope, this.ancestor);
    binding.observeProperty(context, this.name);
  };

  return AccessScope;
}(Expression);

var AccessMember = function (_Expression7) {
  _inherits(AccessMember, _Expression7);

  function AccessMember(object, name) {
    

    var _this9 = _possibleConstructorReturn(this, _Expression7.call(this));

    _this9.object = object;
    _this9.name = name;
    _this9.isAssignable = true;
    return _this9;
  }

  AccessMember.prototype.evaluate = function evaluate(scope, lookupFunctions) {
    var instance = this.object.evaluate(scope, lookupFunctions);
    return instance === null || instance === undefined ? instance : instance[this.name];
  };

  AccessMember.prototype.assign = function assign(scope, value) {
    var instance = this.object.evaluate(scope);

    if (instance === null || instance === undefined) {
      instance = {};
      this.object.assign(scope, instance);
    }

    instance[this.name] = value;
    return value;
  };

  AccessMember.prototype.accept = function accept(visitor) {
    return visitor.visitAccessMember(this);
  };

  AccessMember.prototype.connect = function connect(binding, scope) {
    this.object.connect(binding, scope);
    var obj = this.object.evaluate(scope);
    if (obj) {
      binding.observeProperty(obj, this.name);
    }
  };

  return AccessMember;
}(Expression);

var AccessKeyed = function (_Expression8) {
  _inherits(AccessKeyed, _Expression8);

  function AccessKeyed(object, key) {
    

    var _this10 = _possibleConstructorReturn(this, _Expression8.call(this));

    _this10.object = object;
    _this10.key = key;
    _this10.isAssignable = true;
    return _this10;
  }

  AccessKeyed.prototype.evaluate = function evaluate(scope, lookupFunctions) {
    var instance = this.object.evaluate(scope, lookupFunctions);
    var lookup = this.key.evaluate(scope, lookupFunctions);
    return getKeyed(instance, lookup);
  };

  AccessKeyed.prototype.assign = function assign(scope, value) {
    var instance = this.object.evaluate(scope);
    var lookup = this.key.evaluate(scope);
    return setKeyed(instance, lookup, value);
  };

  AccessKeyed.prototype.accept = function accept(visitor) {
    return visitor.visitAccessKeyed(this);
  };

  AccessKeyed.prototype.connect = function connect(binding, scope) {
    this.object.connect(binding, scope);
    var obj = this.object.evaluate(scope);
    if (obj instanceof Object) {
      this.key.connect(binding, scope);
      var key = this.key.evaluate(scope);

      if (key !== null && key !== undefined && !(Array.isArray(obj) && typeof key === 'number')) {
        binding.observeProperty(obj, key);
      }
    }
  };

  return AccessKeyed;
}(Expression);

var CallScope = function (_Expression9) {
  _inherits(CallScope, _Expression9);

  function CallScope(name, args, ancestor) {
    

    var _this11 = _possibleConstructorReturn(this, _Expression9.call(this));

    _this11.name = name;
    _this11.args = args;
    _this11.ancestor = ancestor;
    return _this11;
  }

  CallScope.prototype.evaluate = function evaluate(scope, lookupFunctions, mustEvaluate) {
    var args = evalList(scope, this.args, lookupFunctions);
    var context = getContextFor(this.name, scope, this.ancestor);
    var func = getFunction(context, this.name, mustEvaluate);
    if (func) {
      return func.apply(context, args);
    }
    return undefined;
  };

  CallScope.prototype.accept = function accept(visitor) {
    return visitor.visitCallScope(this);
  };

  CallScope.prototype.connect = function connect(binding, scope) {
    var args = this.args;
    var i = args.length;
    while (i--) {
      args[i].connect(binding, scope);
    }
  };

  return CallScope;
}(Expression);

var CallMember = function (_Expression10) {
  _inherits(CallMember, _Expression10);

  function CallMember(object, name, args) {
    

    var _this12 = _possibleConstructorReturn(this, _Expression10.call(this));

    _this12.object = object;
    _this12.name = name;
    _this12.args = args;
    return _this12;
  }

  CallMember.prototype.evaluate = function evaluate(scope, lookupFunctions, mustEvaluate) {
    var instance = this.object.evaluate(scope, lookupFunctions);
    var args = evalList(scope, this.args, lookupFunctions);
    var func = getFunction(instance, this.name, mustEvaluate);
    if (func) {
      return func.apply(instance, args);
    }
    return undefined;
  };

  CallMember.prototype.accept = function accept(visitor) {
    return visitor.visitCallMember(this);
  };

  CallMember.prototype.connect = function connect(binding, scope) {
    this.object.connect(binding, scope);
    var obj = this.object.evaluate(scope);
    if (getFunction(obj, this.name, false)) {
      var args = this.args;
      var i = args.length;
      while (i--) {
        args[i].connect(binding, scope);
      }
    }
  };

  return CallMember;
}(Expression);

var CallFunction = function (_Expression11) {
  _inherits(CallFunction, _Expression11);

  function CallFunction(func, args) {
    

    var _this13 = _possibleConstructorReturn(this, _Expression11.call(this));

    _this13.func = func;
    _this13.args = args;
    return _this13;
  }

  CallFunction.prototype.evaluate = function evaluate(scope, lookupFunctions, mustEvaluate) {
    var func = this.func.evaluate(scope, lookupFunctions);
    if (typeof func === 'function') {
      return func.apply(null, evalList(scope, this.args, lookupFunctions));
    }
    if (!mustEvaluate && (func === null || func === undefined)) {
      return undefined;
    }
    throw new Error(this.func + ' is not a function');
  };

  CallFunction.prototype.accept = function accept(visitor) {
    return visitor.visitCallFunction(this);
  };

  CallFunction.prototype.connect = function connect(binding, scope) {
    this.func.connect(binding, scope);
    var func = this.func.evaluate(scope);
    if (typeof func === 'function') {
      var args = this.args;
      var i = args.length;
      while (i--) {
        args[i].connect(binding, scope);
      }
    }
  };

  return CallFunction;
}(Expression);

var Binary = function (_Expression12) {
  _inherits(Binary, _Expression12);

  function Binary(operation, left, right) {
    

    var _this14 = _possibleConstructorReturn(this, _Expression12.call(this));

    _this14.operation = operation;
    _this14.left = left;
    _this14.right = right;
    return _this14;
  }

  Binary.prototype.evaluate = function evaluate(scope, lookupFunctions) {
    var left = this.left.evaluate(scope, lookupFunctions);

    switch (this.operation) {
      case '&&':
        return left && this.right.evaluate(scope, lookupFunctions);
      case '||':
        return left || this.right.evaluate(scope, lookupFunctions);
    }

    var right = this.right.evaluate(scope, lookupFunctions);

    switch (this.operation) {
      case '==':
        return left == right;
      case '===':
        return left === right;
      case '!=':
        return left != right;
      case '!==':
        return left !== right;
      case 'instanceof':
        return typeof right === 'function' && left instanceof right;
      case 'in':
        return (typeof right === 'undefined' ? 'undefined' : _typeof(right)) === 'object' && right !== null && left in right;
    }

    if (left === null || right === null || left === undefined || right === undefined) {
      switch (this.operation) {
        case '+':
          if (left !== null && left !== undefined) return left;
          if (right !== null && right !== undefined) return right;
          return 0;
        case '-':
          if (left !== null && left !== undefined) return left;
          if (right !== null && right !== undefined) return 0 - right;
          return 0;
      }

      return null;
    }

    switch (this.operation) {
      case '+':
        return autoConvertAdd(left, right);
      case '-':
        return left - right;
      case '*':
        return left * right;
      case '/':
        return left / right;
      case '%':
        return left % right;
      case '<':
        return left < right;
      case '>':
        return left > right;
      case '<=':
        return left <= right;
      case '>=':
        return left >= right;
      case '^':
        return left ^ right;
    }

    throw new Error('Internal error [' + this.operation + '] not handled');
  };

  Binary.prototype.accept = function accept(visitor) {
    return visitor.visitBinary(this);
  };

  Binary.prototype.connect = function connect(binding, scope) {
    this.left.connect(binding, scope);
    var left = this.left.evaluate(scope);
    if (this.operation === '&&' && !left || this.operation === '||' && left) {
      return;
    }
    this.right.connect(binding, scope);
  };

  return Binary;
}(Expression);

var Unary = function (_Expression13) {
  _inherits(Unary, _Expression13);

  function Unary(operation, expression) {
    

    var _this15 = _possibleConstructorReturn(this, _Expression13.call(this));

    _this15.operation = operation;
    _this15.expression = expression;
    return _this15;
  }

  Unary.prototype.evaluate = function evaluate(scope, lookupFunctions) {
    switch (this.operation) {
      case '!':
        return !this.expression.evaluate(scope, lookupFunctions);
      case 'typeof':
        return _typeof(this.expression.evaluate(scope, lookupFunctions));
      case 'void':
        return void this.expression.evaluate(scope, lookupFunctions);
    }

    throw new Error('Internal error [' + this.operation + '] not handled');
  };

  Unary.prototype.accept = function accept(visitor) {
    return visitor.visitPrefix(this);
  };

  Unary.prototype.connect = function connect(binding, scope) {
    this.expression.connect(binding, scope);
  };

  return Unary;
}(Expression);

var LiteralPrimitive = function (_Expression14) {
  _inherits(LiteralPrimitive, _Expression14);

  function LiteralPrimitive(value) {
    

    var _this16 = _possibleConstructorReturn(this, _Expression14.call(this));

    _this16.value = value;
    return _this16;
  }

  LiteralPrimitive.prototype.evaluate = function evaluate(scope, lookupFunctions) {
    return this.value;
  };

  LiteralPrimitive.prototype.accept = function accept(visitor) {
    return visitor.visitLiteralPrimitive(this);
  };

  LiteralPrimitive.prototype.connect = function connect(binding, scope) {};

  return LiteralPrimitive;
}(Expression);

var LiteralString = function (_Expression15) {
  _inherits(LiteralString, _Expression15);

  function LiteralString(value) {
    

    var _this17 = _possibleConstructorReturn(this, _Expression15.call(this));

    _this17.value = value;
    return _this17;
  }

  LiteralString.prototype.evaluate = function evaluate(scope, lookupFunctions) {
    return this.value;
  };

  LiteralString.prototype.accept = function accept(visitor) {
    return visitor.visitLiteralString(this);
  };

  LiteralString.prototype.connect = function connect(binding, scope) {};

  return LiteralString;
}(Expression);

var LiteralTemplate = function (_Expression16) {
  _inherits(LiteralTemplate, _Expression16);

  function LiteralTemplate(cooked, expressions, raw, tag) {
    

    var _this18 = _possibleConstructorReturn(this, _Expression16.call(this));

    _this18.cooked = cooked;
    _this18.expressions = expressions || [];
    _this18.length = _this18.expressions.length;
    _this18.tagged = tag !== undefined;
    if (_this18.tagged) {
      _this18.cooked.raw = raw;
      _this18.tag = tag;
      if (tag instanceof AccessScope) {
        _this18.contextType = 'Scope';
      } else if (tag instanceof AccessMember || tag instanceof AccessKeyed) {
        _this18.contextType = 'Object';
      } else {
        throw new Error(_this18.tag + ' is not a valid template tag');
      }
    }
    return _this18;
  }

  LiteralTemplate.prototype.getScopeContext = function getScopeContext(scope, lookupFunctions) {
    return getContextFor(this.tag.name, scope, this.tag.ancestor);
  };

  LiteralTemplate.prototype.getObjectContext = function getObjectContext(scope, lookupFunctions) {
    return this.tag.object.evaluate(scope, lookupFunctions);
  };

  LiteralTemplate.prototype.evaluate = function evaluate(scope, lookupFunctions, mustEvaluate) {
    var results = new Array(this.length);
    for (var i = 0; i < this.length; i++) {
      results[i] = this.expressions[i].evaluate(scope, lookupFunctions);
    }
    if (this.tagged) {
      var func = this.tag.evaluate(scope, lookupFunctions);
      if (typeof func === 'function') {
        var context = this['get' + this.contextType + 'Context'](scope, lookupFunctions);
        return func.call.apply(func, [context, this.cooked].concat(results));
      }
      if (!mustEvaluate) {
        return null;
      }
      throw new Error(this.tag + ' is not a function');
    }
    var result = this.cooked[0];
    for (var _i2 = 0; _i2 < this.length; _i2++) {
      result = String.prototype.concat(result, results[_i2], this.cooked[_i2 + 1]);
    }
    return result;
  };

  LiteralTemplate.prototype.accept = function accept(visitor) {
    return visitor.visitLiteralTemplate(this);
  };

  LiteralTemplate.prototype.connect = function connect(binding, scope) {
    for (var i = 0; i < this.length; i++) {
      this.expressions[i].connect(binding, scope);
    }
    if (this.tagged) {
      this.tag.connect(binding, scope);
    }
  };

  return LiteralTemplate;
}(Expression);

var LiteralArray = function (_Expression17) {
  _inherits(LiteralArray, _Expression17);

  function LiteralArray(elements) {
    

    var _this19 = _possibleConstructorReturn(this, _Expression17.call(this));

    _this19.elements = elements;
    return _this19;
  }

  LiteralArray.prototype.evaluate = function evaluate(scope, lookupFunctions) {
    var elements = this.elements;
    var result = [];

    for (var i = 0, length = elements.length; i < length; ++i) {
      result[i] = elements[i].evaluate(scope, lookupFunctions);
    }

    return result;
  };

  LiteralArray.prototype.accept = function accept(visitor) {
    return visitor.visitLiteralArray(this);
  };

  LiteralArray.prototype.connect = function connect(binding, scope) {
    var length = this.elements.length;
    for (var i = 0; i < length; i++) {
      this.elements[i].connect(binding, scope);
    }
  };

  return LiteralArray;
}(Expression);

var LiteralObject = function (_Expression18) {
  _inherits(LiteralObject, _Expression18);

  function LiteralObject(keys, values) {
    

    var _this20 = _possibleConstructorReturn(this, _Expression18.call(this));

    _this20.keys = keys;
    _this20.values = values;
    return _this20;
  }

  LiteralObject.prototype.evaluate = function evaluate(scope, lookupFunctions) {
    var instance = {};
    var keys = this.keys;
    var values = this.values;

    for (var i = 0, length = keys.length; i < length; ++i) {
      instance[keys[i]] = values[i].evaluate(scope, lookupFunctions);
    }

    return instance;
  };

  LiteralObject.prototype.accept = function accept(visitor) {
    return visitor.visitLiteralObject(this);
  };

  LiteralObject.prototype.connect = function connect(binding, scope) {
    var length = this.keys.length;
    for (var i = 0; i < length; i++) {
      this.values[i].connect(binding, scope);
    }
  };

  return LiteralObject;
}(Expression);

function evalList(scope, list, lookupFunctions) {
  var length = list.length;
  var result = [];
  for (var i = 0; i < length; i++) {
    result[i] = list[i].evaluate(scope, lookupFunctions);
  }
  return result;
}

function autoConvertAdd(a, b) {
  if (a !== null && b !== null) {
    if (typeof a === 'string' && typeof b !== 'string') {
      return a + b.toString();
    }

    if (typeof a !== 'string' && typeof b === 'string') {
      return a.toString() + b;
    }

    return a + b;
  }

  if (a !== null) {
    return a;
  }

  if (b !== null) {
    return b;
  }

  return 0;
}

function getFunction(obj, name, mustExist) {
  var func = obj === null || obj === undefined ? null : obj[name];
  if (typeof func === 'function') {
    return func;
  }
  if (!mustExist && (func === null || func === undefined)) {
    return null;
  }
  throw new Error(name + ' is not a function');
}

function getKeyed(obj, key) {
  if (Array.isArray(obj)) {
    return obj[parseInt(key, 10)];
  } else if (obj) {
    return obj[key];
  } else if (obj === null || obj === undefined) {
    return undefined;
  }

  return obj[key];
}

function setKeyed(obj, key, value) {
  if (Array.isArray(obj)) {
    var index = parseInt(key, 10);

    if (obj.length <= index) {
      obj.length = index + 1;
    }

    obj[index] = value;
  } else {
    obj[key] = value;
  }

  return value;
}

var _Unparser = null;


if (typeof FEATURE_NO_UNPARSER === 'undefined') {
  _Unparser = function () {
    function Unparser(buffer) {
      

      this.buffer = buffer;
    }

    Unparser.unparse = function unparse(expression) {
      var buffer = [];
      var visitor = new _Unparser(buffer);

      expression.accept(visitor);

      return buffer.join('');
    };

    Unparser.prototype.write = function write(text) {
      this.buffer.push(text);
    };

    Unparser.prototype.writeArgs = function writeArgs(args) {
      this.write('(');

      for (var i = 0, length = args.length; i < length; ++i) {
        if (i !== 0) {
          this.write(',');
        }

        args[i].accept(this);
      }

      this.write(')');
    };

    Unparser.prototype.visitBindingBehavior = function visitBindingBehavior(behavior) {
      var args = behavior.args;

      behavior.expression.accept(this);
      this.write('&' + behavior.name);

      for (var i = 0, length = args.length; i < length; ++i) {
        this.write(':');
        args[i].accept(this);
      }
    };

    Unparser.prototype.visitValueConverter = function visitValueConverter(converter) {
      var args = converter.args;

      converter.expression.accept(this);
      this.write('|' + converter.name);

      for (var i = 0, length = args.length; i < length; ++i) {
        this.write(':');
        args[i].accept(this);
      }
    };

    Unparser.prototype.visitAssign = function visitAssign(assign) {
      assign.target.accept(this);
      this.write('=');
      assign.value.accept(this);
    };

    Unparser.prototype.visitConditional = function visitConditional(conditional) {
      conditional.condition.accept(this);
      this.write('?');
      conditional.yes.accept(this);
      this.write(':');
      conditional.no.accept(this);
    };

    Unparser.prototype.visitAccessThis = function visitAccessThis(access) {
      if (access.ancestor === 0) {
        this.write('$this');
        return;
      }
      this.write('$parent');
      var i = access.ancestor - 1;
      while (i--) {
        this.write('.$parent');
      }
    };

    Unparser.prototype.visitAccessScope = function visitAccessScope(access) {
      var i = access.ancestor;
      while (i--) {
        this.write('$parent.');
      }
      this.write(access.name);
    };

    Unparser.prototype.visitAccessMember = function visitAccessMember(access) {
      access.object.accept(this);
      this.write('.' + access.name);
    };

    Unparser.prototype.visitAccessKeyed = function visitAccessKeyed(access) {
      access.object.accept(this);
      this.write('[');
      access.key.accept(this);
      this.write(']');
    };

    Unparser.prototype.visitCallScope = function visitCallScope(call) {
      var i = call.ancestor;
      while (i--) {
        this.write('$parent.');
      }
      this.write(call.name);
      this.writeArgs(call.args);
    };

    Unparser.prototype.visitCallFunction = function visitCallFunction(call) {
      call.func.accept(this);
      this.writeArgs(call.args);
    };

    Unparser.prototype.visitCallMember = function visitCallMember(call) {
      call.object.accept(this);
      this.write('.' + call.name);
      this.writeArgs(call.args);
    };

    Unparser.prototype.visitPrefix = function visitPrefix(prefix) {
      this.write('(' + prefix.operation);
      if (prefix.operation.charCodeAt(0) >= 97) {
        this.write(' ');
      }
      prefix.expression.accept(this);
      this.write(')');
    };

    Unparser.prototype.visitBinary = function visitBinary(binary) {
      binary.left.accept(this);
      if (binary.operation.charCodeAt(0) === 105) {
        this.write(' ' + binary.operation + ' ');
      } else {
        this.write(binary.operation);
      }
      binary.right.accept(this);
    };

    Unparser.prototype.visitLiteralPrimitive = function visitLiteralPrimitive(literal) {
      this.write('' + literal.value);
    };

    Unparser.prototype.visitLiteralArray = function visitLiteralArray(literal) {
      var elements = literal.elements;

      this.write('[');

      for (var i = 0, length = elements.length; i < length; ++i) {
        if (i !== 0) {
          this.write(',');
        }

        elements[i].accept(this);
      }

      this.write(']');
    };

    Unparser.prototype.visitLiteralObject = function visitLiteralObject(literal) {
      var keys = literal.keys;
      var values = literal.values;

      this.write('{');

      for (var i = 0, length = keys.length; i < length; ++i) {
        if (i !== 0) {
          this.write(',');
        }

        this.write('\'' + keys[i] + '\':');
        values[i].accept(this);
      }

      this.write('}');
    };

    Unparser.prototype.visitLiteralString = function visitLiteralString(literal) {
      var escaped = literal.value.replace(/'/g, "\'");
      this.write('\'' + escaped + '\'');
    };

    Unparser.prototype.visitLiteralTemplate = function visitLiteralTemplate(literal) {
      var cooked = literal.cooked,
          expressions = literal.expressions;

      var length = expressions.length;
      this.write('`');
      this.write(cooked[0]);
      for (var i = 0; i < length; i++) {
        expressions[i].accept(this);
        this.write(cooked[i + 1]);
      }
      this.write('`');
    };

    return Unparser;
  }();
}

var ExpressionCloner = function () {
  function ExpressionCloner() {
    
  }

  ExpressionCloner.prototype.cloneExpressionArray = function cloneExpressionArray(array) {
    var clonedArray = [];
    var i = array.length;
    while (i--) {
      clonedArray[i] = array[i].accept(this);
    }
    return clonedArray;
  };

  ExpressionCloner.prototype.visitBindingBehavior = function visitBindingBehavior(behavior) {
    return new BindingBehavior(behavior.expression.accept(this), behavior.name, this.cloneExpressionArray(behavior.args));
  };

  ExpressionCloner.prototype.visitValueConverter = function visitValueConverter(converter) {
    return new ValueConverter(converter.expression.accept(this), converter.name, this.cloneExpressionArray(converter.args));
  };

  ExpressionCloner.prototype.visitAssign = function visitAssign(assign) {
    return new Assign(assign.target.accept(this), assign.value.accept(this));
  };

  ExpressionCloner.prototype.visitConditional = function visitConditional(conditional) {
    return new Conditional(conditional.condition.accept(this), conditional.yes.accept(this), conditional.no.accept(this));
  };

  ExpressionCloner.prototype.visitAccessThis = function visitAccessThis(access) {
    return new AccessThis(access.ancestor);
  };

  ExpressionCloner.prototype.visitAccessScope = function visitAccessScope(access) {
    return new AccessScope(access.name, access.ancestor);
  };

  ExpressionCloner.prototype.visitAccessMember = function visitAccessMember(access) {
    return new AccessMember(access.object.accept(this), access.name);
  };

  ExpressionCloner.prototype.visitAccessKeyed = function visitAccessKeyed(access) {
    return new AccessKeyed(access.object.accept(this), access.key.accept(this));
  };

  ExpressionCloner.prototype.visitCallScope = function visitCallScope(call) {
    return new CallScope(call.name, this.cloneExpressionArray(call.args), call.ancestor);
  };

  ExpressionCloner.prototype.visitCallFunction = function visitCallFunction(call) {
    return new CallFunction(call.func.accept(this), this.cloneExpressionArray(call.args));
  };

  ExpressionCloner.prototype.visitCallMember = function visitCallMember(call) {
    return new CallMember(call.object.accept(this), call.name, this.cloneExpressionArray(call.args));
  };

  ExpressionCloner.prototype.visitUnary = function visitUnary(unary) {
    return new Unary(prefix.operation, prefix.expression.accept(this));
  };

  ExpressionCloner.prototype.visitBinary = function visitBinary(binary) {
    return new Binary(binary.operation, binary.left.accept(this), binary.right.accept(this));
  };

  ExpressionCloner.prototype.visitLiteralPrimitive = function visitLiteralPrimitive(literal) {
    return new LiteralPrimitive(literal);
  };

  ExpressionCloner.prototype.visitLiteralArray = function visitLiteralArray(literal) {
    return new LiteralArray(this.cloneExpressionArray(literal.elements));
  };

  ExpressionCloner.prototype.visitLiteralObject = function visitLiteralObject(literal) {
    return new LiteralObject(literal.keys, this.cloneExpressionArray(literal.values));
  };

  ExpressionCloner.prototype.visitLiteralString = function visitLiteralString(literal) {
    return new LiteralString(literal.value);
  };

  ExpressionCloner.prototype.visitLiteralTemplate = function visitLiteralTemplate(literal) {
    return new LiteralTemplate(literal.cooked, this.cloneExpressionArray(literal.expressions), literal.raw, literal.tag && literal.tag.accept(this));
  };

  return ExpressionCloner;
}();

function cloneExpression(expression) {
  var visitor = new ExpressionCloner();
  return expression.accept(visitor);
}

var bindingMode = {
  oneTime: 0,
  toView: 1,
  oneWay: 1,
  twoWay: 2,
  fromView: 3
};

var Parser = function () {
  function Parser() {
    

    this.cache = Object.create(null);
  }

  Parser.prototype.parse = function parse(src) {
    src = src || '';

    return this.cache[src] || (this.cache[src] = new ParserImplementation(src).parseBindingBehavior());
  };

  return Parser;
}();

var fromCharCode = String.fromCharCode;

var ParserImplementation = function () {
  _createClass(ParserImplementation, [{
    key: 'raw',
    get: function get() {
      return this.src.slice(this.start, this.idx);
    }
  }]);

  function ParserImplementation(src) {
    

    this.idx = 0;

    this.start = 0;

    this.src = src;
    this.len = src.length;

    this.tkn = T$EOF;

    this.val = undefined;

    this.ch = src.charCodeAt(0);
  }

  ParserImplementation.prototype.parseBindingBehavior = function parseBindingBehavior() {
    this.nextToken();
    if (this.tkn & T$ExpressionTerminal) {
      this.err('Invalid start of expression');
    }
    var result = this.parseValueConverter();
    while (this.opt(T$Ampersand)) {
      result = new BindingBehavior(result, this.val, this.parseVariadicArgs());
    }
    if (this.tkn !== T$EOF) {
      this.err('Unconsumed token ' + this.raw);
    }
    return result;
  };

  ParserImplementation.prototype.parseValueConverter = function parseValueConverter() {
    var result = this.parseExpression();
    while (this.opt(T$Bar)) {
      result = new ValueConverter(result, this.val, this.parseVariadicArgs());
    }
    return result;
  };

  ParserImplementation.prototype.parseVariadicArgs = function parseVariadicArgs() {
    this.nextToken();
    var result = [];
    while (this.opt(T$Colon)) {
      result.push(this.parseExpression());
    }
    return result;
  };

  ParserImplementation.prototype.parseExpression = function parseExpression() {
    var exprStart = this.idx;
    var result = this.parseConditional();

    while (this.tkn === T$Eq) {
      if (!result.isAssignable) {
        this.err('Expression ' + this.src.slice(exprStart, this.start) + ' is not assignable');
      }
      this.nextToken();
      exprStart = this.idx;
      result = new Assign(result, this.parseConditional());
    }
    return result;
  };

  ParserImplementation.prototype.parseConditional = function parseConditional() {
    var result = this.parseBinary(0);

    if (this.opt(T$Question)) {
      var yes = this.parseExpression();
      this.expect(T$Colon);
      result = new Conditional(result, yes, this.parseExpression());
    }
    return result;
  };

  ParserImplementation.prototype.parseBinary = function parseBinary(minPrecedence) {
    var left = this.parseLeftHandSide(0);

    while (this.tkn & T$BinaryOp) {
      var opToken = this.tkn;
      if ((opToken & T$Precedence) <= minPrecedence) {
        break;
      }
      this.nextToken();
      left = new Binary(TokenValues[opToken & T$TokenMask], left, this.parseBinary(opToken & T$Precedence));
    }
    return left;
  };

  ParserImplementation.prototype.parseLeftHandSide = function parseLeftHandSide(context) {
    var result = void 0;

    primary: switch (this.tkn) {
      case T$Plus:
        this.nextToken();
        return this.parseLeftHandSide(0);
      case T$Minus:
        this.nextToken();
        return new Binary('-', new LiteralPrimitive(0), this.parseLeftHandSide(0));
      case T$Bang:
      case T$TypeofKeyword:
      case T$VoidKeyword:
        var op = TokenValues[this.tkn & T$TokenMask];
        this.nextToken();
        return new Unary(op, this.parseLeftHandSide(0));
      case T$ParentScope:
        {
          do {
            this.nextToken();
            context++;
            if (this.opt(T$Period)) {
              if (this.tkn === T$Period) {
                this.err();
              }
              continue;
            } else if (this.tkn & T$AccessScopeTerminal) {
              result = new AccessThis(context & C$Ancestor);

              context = context & C$ShorthandProp | C$This;
              break primary;
            } else {
              this.err();
            }
          } while (this.tkn === T$ParentScope);
        }

      case T$Identifier:
        {
          result = new AccessScope(this.val, context & C$Ancestor);
          this.nextToken();
          context = context & C$ShorthandProp | C$Scope;
          break;
        }
      case T$ThisScope:
        this.nextToken();
        result = new AccessThis(0);
        context = context & C$ShorthandProp | C$This;
        break;
      case T$LParen:
        this.nextToken();
        result = this.parseExpression();
        this.expect(T$RParen);
        context = C$Primary;
        break;
      case T$LBracket:
        {
          this.nextToken();
          var _elements = [];
          if (this.tkn !== T$RBracket) {
            do {
              _elements.push(this.parseExpression());
            } while (this.opt(T$Comma));
          }
          this.expect(T$RBracket);
          result = new LiteralArray(_elements);
          context = C$Primary;
          break;
        }
      case T$LBrace:
        {
          var keys = [];
          var values = [];
          this.nextToken();
          while (this.tkn !== T$RBrace) {
            if (this.tkn & T$IdentifierOrKeyword) {
              var ch = this.ch,
                  tkn = this.tkn,
                  idx = this.idx;

              keys.push(this.val);
              this.nextToken();
              if (this.opt(T$Colon)) {
                values.push(this.parseExpression());
              } else {
                this.ch = ch;
                this.tkn = tkn;
                this.idx = idx;
                values.push(this.parseLeftHandSide(C$ShorthandProp));
              }
            } else if (this.tkn & T$Literal) {
              keys.push(this.val);
              this.nextToken();
              this.expect(T$Colon);
              values.push(this.parseExpression());
            } else {
              this.err();
            }
            if (this.tkn !== T$RBrace) {
              this.expect(T$Comma);
            }
          }
          this.expect(T$RBrace);
          result = new LiteralObject(keys, values);
          context = C$Primary;
          break;
        }
      case T$StringLiteral:
        result = new LiteralString(this.val);
        this.nextToken();
        context = C$Primary;
        break;
      case T$TemplateTail:
        result = new LiteralTemplate([this.val]);
        this.nextToken();
        context = C$Primary;
        break;
      case T$TemplateContinuation:
        result = this.parseTemplate(0);
        context = C$Primary;
        break;
      case T$NumericLiteral:
        {
          result = new LiteralPrimitive(this.val);
          this.nextToken();

          break;
        }
      case T$NullKeyword:
      case T$UndefinedKeyword:
      case T$TrueKeyword:
      case T$FalseKeyword:
        result = new LiteralPrimitive(TokenValues[this.tkn & T$TokenMask]);
        this.nextToken();
        context = C$Primary;
        break;
      default:
        if (this.idx >= this.len) {
          this.err('Unexpected end of expression');
        } else {
          this.err();
        }
    }

    if (context & C$ShorthandProp) {
      return result;
    }

    var name = this.val;
    while (this.tkn & T$MemberOrCallExpression) {
      switch (this.tkn) {
        case T$Period:
          this.nextToken();
          if (!(this.tkn & T$IdentifierOrKeyword)) {
            this.err();
          }
          name = this.val;
          this.nextToken();

          context = context & C$Primary | (context & (C$This | C$Scope)) << 1 | context & C$Member | (context & C$Keyed) >> 1 | (context & C$Call) >> 2;
          if (this.tkn === T$LParen) {
            continue;
          }
          if (context & C$Scope) {
            result = new AccessScope(name, result.ancestor);
          } else {
            result = new AccessMember(result, name);
          }
          continue;
        case T$LBracket:
          this.nextToken();
          context = C$Keyed;
          result = new AccessKeyed(result, this.parseExpression());
          this.expect(T$RBracket);
          break;
        case T$LParen:
          this.nextToken();
          var args = [];
          while (this.tkn !== T$RParen) {
            args.push(this.parseExpression());
            if (!this.opt(T$Comma)) {
              break;
            }
          }
          this.expect(T$RParen);
          if (context & C$Scope) {
            result = new CallScope(name, args, result.ancestor);
          } else if (context & (C$Member | C$Primary)) {
            result = new CallMember(result, name, args);
          } else {
            result = new CallFunction(result, args);
          }
          context = C$Call;
          break;
        case T$TemplateTail:
          result = new LiteralTemplate([this.val], [], [this.raw], result);
          this.nextToken();
          break;
        case T$TemplateContinuation:
          result = this.parseTemplate(context | C$Tagged, result);
      }
    }

    return result;
  };

  ParserImplementation.prototype.parseTemplate = function parseTemplate(context, func) {
    var cooked = [this.val];
    var raw = context & C$Tagged ? [this.raw] : undefined;
    this.expect(T$TemplateContinuation);
    var expressions = [this.parseExpression()];

    while ((this.tkn = this.scanTemplateTail()) !== T$TemplateTail) {
      cooked.push(this.val);
      if (context & C$Tagged) {
        raw.push(this.raw);
      }
      this.expect(T$TemplateContinuation);
      expressions.push(this.parseExpression());
    }

    cooked.push(this.val);
    if (context & C$Tagged) {
      raw.push(this.raw);
    }
    this.nextToken();
    return new LiteralTemplate(cooked, expressions, raw, func);
  };

  ParserImplementation.prototype.nextToken = function nextToken() {
    while (this.idx < this.len) {
      if (this.ch <= 0x20) {
        this.next();
        continue;
      }
      this.start = this.idx;
      if (this.ch === 0x24 || this.ch >= 0x61 && this.ch <= 0x7A) {
        this.tkn = this.scanIdentifier();
        return;
      }

      if ((this.tkn = CharScanners[this.ch](this)) !== null) {
        return;
      }
    }
    this.tkn = T$EOF;
  };

  ParserImplementation.prototype.next = function next() {
    return this.ch = this.src.charCodeAt(++this.idx);
  };

  ParserImplementation.prototype.scanIdentifier = function scanIdentifier() {
    while (AsciiIdParts.has(this.next()) || this.ch > 0x7F && IdParts[this.ch]) {}

    return KeywordLookup[this.val = this.raw] || T$Identifier;
  };

  ParserImplementation.prototype.scanNumber = function scanNumber(isFloat) {
    if (isFloat) {
      this.val = 0;
    } else {
      this.val = this.ch - 0x30;
      while (this.next() <= 0x39 && this.ch >= 0x30) {
        this.val = this.val * 10 + this.ch - 0x30;
      }
    }

    if (isFloat || this.ch === 0x2E) {
      if (!isFloat) {
        this.next();
      }
      var start = this.idx;
      var value = this.ch - 0x30;
      while (this.next() <= 0x39 && this.ch >= 0x30) {
        value = value * 10 + this.ch - 0x30;
      }
      this.val = this.val + value / Math.pow(10, this.idx - start);
    }

    if (this.ch === 0x65 || this.ch === 0x45) {
      var _start = this.idx;

      this.next();
      if (this.ch === 0x2D || this.ch === 0x2B) {
        this.next();
      }

      if (!(this.ch >= 0x30 && this.ch <= 0x39)) {
        this.idx = _start;
        this.err('Invalid exponent');
      }
      while (this.next() <= 0x39 && this.ch >= 0x30) {}
      this.val = parseFloat(this.src.slice(this.start, this.idx));
    }

    return T$NumericLiteral;
  };

  ParserImplementation.prototype.scanString = function scanString() {
    var quote = this.ch;
    this.next();

    var buffer = void 0;
    var marker = this.idx;

    while (this.ch !== quote) {
      if (this.ch === 0x5C) {
        if (!buffer) {
          buffer = [];
        }

        buffer.push(this.src.slice(marker, this.idx));

        this.next();

        var _unescaped = void 0;

        if (this.ch === 0x75) {
          this.next();

          if (this.idx + 4 < this.len) {
            var hex = this.src.slice(this.idx, this.idx + 4);

            if (!/[A-Z0-9]{4}/i.test(hex)) {
              this.err('Invalid unicode escape [\\u' + hex + ']');
            }

            _unescaped = parseInt(hex, 16);
            this.idx += 4;
            this.ch = this.src.charCodeAt(this.idx);
          } else {
            this.err();
          }
        } else {
          _unescaped = unescape(this.ch);
          this.next();
        }

        buffer.push(fromCharCode(_unescaped));
        marker = this.idx;
      } else if (this.ch === 0 || this.idx >= this.len) {
        this.err('Unterminated quote');
      } else {
        this.next();
      }
    }

    var last = this.src.slice(marker, this.idx);
    this.next();
    var unescaped = last;

    if (buffer !== null && buffer !== undefined) {
      buffer.push(last);
      unescaped = buffer.join('');
    }

    this.val = unescaped;
    return T$StringLiteral;
  };

  ParserImplementation.prototype.scanTemplate = function scanTemplate() {
    var tail = true;
    var result = '';

    while (this.next() !== 0x60) {
      if (this.ch === 0x24) {
        if (this.idx + 1 < this.len && this.src.charCodeAt(this.idx + 1) === 0x7B) {
          this.idx++;
          tail = false;
          break;
        } else {
          result += '$';
        }
      } else if (this.ch === 0x5C) {
        result += fromCharCode(unescape(this.next()));
      } else if (this.ch === 0 || this.idx >= this.len) {
        this.err('Unterminated template literal');
      } else {
        result += fromCharCode(this.ch);
      }
    }

    this.next();
    this.val = result;
    if (tail) {
      return T$TemplateTail;
    }
    return T$TemplateContinuation;
  };

  ParserImplementation.prototype.scanTemplateTail = function scanTemplateTail() {
    if (this.idx >= this.len) {
      this.err('Unterminated template');
    }
    this.idx--;
    return this.scanTemplate();
  };

  ParserImplementation.prototype.err = function err() {
    var message = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'Unexpected token ' + this.raw;
    var column = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.start;

    throw new Error('Parser Error: ' + message + ' at column ' + column + ' in expression [' + this.src + ']');
  };

  ParserImplementation.prototype.opt = function opt(token) {
    if (this.tkn === token) {
      this.nextToken();
      return true;
    }

    return false;
  };

  ParserImplementation.prototype.expect = function expect(token) {
    if (this.tkn === token) {
      this.nextToken();
    } else {
      this.err('Missing expected token ' + TokenValues[token & T$TokenMask], this.idx);
    }
  };

  return ParserImplementation;
}();

function unescape(code) {
  switch (code) {
    case 0x66:
      return 0xC;
    case 0x6E:
      return 0xA;
    case 0x72:
      return 0xD;
    case 0x74:
      return 0x9;
    case 0x76:
      return 0xB;
    default:
      return code;
  }
}

var C$This = 1 << 10;
var C$Scope = 1 << 11;
var C$Member = 1 << 12;
var C$Keyed = 1 << 13;
var C$Call = 1 << 14;
var C$Primary = 1 << 15;
var C$ShorthandProp = 1 << 16;
var C$Tagged = 1 << 17;

var C$Ancestor = (1 << 9) - 1;

var T$TokenMask = (1 << 6) - 1;

var T$PrecShift = 6;

var T$Precedence = 7 << T$PrecShift;

var T$ExpressionTerminal = 1 << 11;

var T$ClosingToken = 1 << 12;

var T$OpeningToken = 1 << 13;

var T$AccessScopeTerminal = 1 << 14;
var T$Keyword = 1 << 15;
var T$EOF = 1 << 16 | T$AccessScopeTerminal | T$ExpressionTerminal;
var T$Identifier = 1 << 17;
var T$IdentifierOrKeyword = T$Identifier | T$Keyword;
var T$Literal = 1 << 18;
var T$NumericLiteral = 1 << 19 | T$Literal;
var T$StringLiteral = 1 << 20 | T$Literal;
var T$BinaryOp = 1 << 21;

var T$UnaryOp = 1 << 22;

var T$MemberExpression = 1 << 23;

var T$MemberOrCallExpression = 1 << 24;
var T$TemplateTail = 1 << 25 | T$MemberOrCallExpression;
var T$TemplateContinuation = 1 << 26 | T$MemberOrCallExpression;

var T$FalseKeyword = 0 | T$Keyword | T$Literal;
var T$TrueKeyword = 1 | T$Keyword | T$Literal;
var T$NullKeyword = 2 | T$Keyword | T$Literal;
var T$UndefinedKeyword = 3 | T$Keyword | T$Literal;
var T$ThisScope = 4 | T$IdentifierOrKeyword;
var T$ParentScope = 5 | T$IdentifierOrKeyword;

var T$LParen = 6 | T$OpeningToken | T$AccessScopeTerminal | T$MemberOrCallExpression;
var T$LBrace = 7 | T$OpeningToken;
var T$Period = 8 | T$MemberExpression | T$MemberOrCallExpression;
var T$RBrace = 9 | T$AccessScopeTerminal | T$ClosingToken | T$ExpressionTerminal;
var T$RParen = 10 | T$AccessScopeTerminal | T$ClosingToken | T$ExpressionTerminal;
var T$Comma = 11 | T$AccessScopeTerminal;
var T$LBracket = 12 | T$OpeningToken | T$AccessScopeTerminal | T$MemberExpression | T$MemberOrCallExpression;
var T$RBracket = 13 | T$ClosingToken | T$ExpressionTerminal;
var T$Colon = 14 | T$AccessScopeTerminal;
var T$Question = 15;

var T$Ampersand = 18 | T$AccessScopeTerminal;
var T$Bar = 19 | T$AccessScopeTerminal;
var T$BarBar = 20 | 1 << T$PrecShift | T$BinaryOp;
var T$AmpersandAmpersand = 21 | 2 << T$PrecShift | T$BinaryOp;
var T$Caret = 22 | 3 << T$PrecShift | T$BinaryOp;
var T$EqEq = 23 | 4 << T$PrecShift | T$BinaryOp;
var T$BangEq = 24 | 4 << T$PrecShift | T$BinaryOp;
var T$EqEqEq = 25 | 4 << T$PrecShift | T$BinaryOp;
var T$BangEqEq = 26 | 4 << T$PrecShift | T$BinaryOp;
var T$Lt = 27 | 5 << T$PrecShift | T$BinaryOp;
var T$Gt = 28 | 5 << T$PrecShift | T$BinaryOp;
var T$LtEq = 29 | 5 << T$PrecShift | T$BinaryOp;
var T$GtEq = 30 | 5 << T$PrecShift | T$BinaryOp;
var T$InKeyword = 31 | 5 << T$PrecShift | T$BinaryOp | T$Keyword;
var T$InstanceOfKeyword = 32 | 5 << T$PrecShift | T$BinaryOp | T$Keyword;
var T$Plus = 33 | 6 << T$PrecShift | T$BinaryOp | T$UnaryOp;
var T$Minus = 34 | 6 << T$PrecShift | T$BinaryOp | T$UnaryOp;
var T$TypeofKeyword = 35 | T$UnaryOp | T$Keyword;
var T$VoidKeyword = 36 | T$UnaryOp | T$Keyword;
var T$Star = 37 | 7 << T$PrecShift | T$BinaryOp;
var T$Percent = 38 | 7 << T$PrecShift | T$BinaryOp;
var T$Slash = 39 | 7 << T$PrecShift | T$BinaryOp;
var T$Eq = 40;
var T$Bang = 41 | T$UnaryOp;

var KeywordLookup = Object.create(null);
KeywordLookup.true = T$TrueKeyword;
KeywordLookup.null = T$NullKeyword;
KeywordLookup.false = T$FalseKeyword;
KeywordLookup.undefined = T$UndefinedKeyword;
KeywordLookup.$this = T$ThisScope;
KeywordLookup.$parent = T$ParentScope;
KeywordLookup.in = T$InKeyword;
KeywordLookup.instanceof = T$InstanceOfKeyword;
KeywordLookup.typeof = T$TypeofKeyword;
KeywordLookup.void = T$VoidKeyword;

var TokenValues = [false, true, null, undefined, '$this', '$parent', '(', '{', '.', '}', ')', ',', '[', ']', ':', '?', '\'', '"', '&', '|', '||', '&&', '^', '==', '!=', '===', '!==', '<', '>', '<=', '>=', 'in', 'instanceof', '+', '-', 'typeof', 'void', '*', '%', '/', '=', '!'];

var codes = {
  AsciiIdPart: [0x24, 0, 0x30, 0x3A, 0x41, 0x5B, 0x5F, 0, 0x61, 0x7B],
  IdStart: [0x24, 0, 0x41, 0x5B, 0x5F, 0, 0x61, 0x7B, 0xAA, 0, 0xBA, 0, 0xC0, 0xD7, 0xD8, 0xF7, 0xF8, 0x2B9, 0x2E0, 0x2E5, 0x1D00, 0x1D26, 0x1D2C, 0x1D5D, 0x1D62, 0x1D66, 0x1D6B, 0x1D78, 0x1D79, 0x1DBF, 0x1E00, 0x1F00, 0x2071, 0, 0x207F, 0, 0x2090, 0x209D, 0x212A, 0x212C, 0x2132, 0, 0x214E, 0, 0x2160, 0x2189, 0x2C60, 0x2C80, 0xA722, 0xA788, 0xA78B, 0xA7AF, 0xA7B0, 0xA7B8, 0xA7F7, 0xA800, 0xAB30, 0xAB5B, 0xAB5C, 0xAB65, 0xFB00, 0xFB07, 0xFF21, 0xFF3B, 0xFF41, 0xFF5B],
  Digit: [0x30, 0x3A],
  Skip: [0, 0x21, 0x7F, 0xA1]
};

function decompress(lookup, set, compressed, value) {
  var rangeCount = compressed.length;
  for (var i = 0; i < rangeCount; i += 2) {
    var start = compressed[i];
    var end = compressed[i + 1];
    end = end > 0 ? end : start + 1;
    if (lookup) {
      var j = start;
      while (j < end) {
        lookup[j] = value;
        j++;
      }
    }
    if (set) {
      for (var ch = start; ch < end; ch++) {
        set.add(ch);
      }
    }
  }
}

function returnToken(token) {
  return function (p) {
    p.next();
    return token;
  };
}
function unexpectedCharacter(p) {
  p.err('Unexpected character [' + fromCharCode(p.ch) + ']');
  return null;
}

var AsciiIdParts = new Set();
decompress(null, AsciiIdParts, codes.AsciiIdPart, true);

var IdParts = new Uint8Array(0xFFFF);
decompress(IdParts, null, codes.IdStart, 1);
decompress(IdParts, null, codes.Digit, 1);

var CharScanners = new Array(0xFFFF);
var ci = 0;
while (ci < 0xFFFF) {
  CharScanners[ci] = unexpectedCharacter;
  ci++;
}

decompress(CharScanners, null, codes.Skip, function (p) {
  p.next();
  return null;
});
decompress(CharScanners, null, codes.IdStart, function (p) {
  return p.scanIdentifier();
});
decompress(CharScanners, null, codes.Digit, function (p) {
  return p.scanNumber(false);
});

CharScanners[0x22] = CharScanners[0x27] = function (p) {
  return p.scanString();
};
CharScanners[0x60] = function (p) {
  return p.scanTemplate();
};

CharScanners[0x21] = function (p) {
  if (p.next() !== 0x3D) {
    return T$Bang;
  }
  if (p.next() !== 0x3D) {
    return T$BangEq;
  }
  p.next();
  return T$BangEqEq;
};

CharScanners[0x3D] = function (p) {
  if (p.next() !== 0x3D) {
    return T$Eq;
  }
  if (p.next() !== 0x3D) {
    return T$EqEq;
  }
  p.next();
  return T$EqEqEq;
};

CharScanners[0x26] = function (p) {
  if (p.next() !== 0x26) {
    return T$Ampersand;
  }
  p.next();
  return T$AmpersandAmpersand;
};

CharScanners[0x7C] = function (p) {
  if (p.next() !== 0x7C) {
    return T$Bar;
  }
  p.next();
  return T$BarBar;
};

CharScanners[0x2E] = function (p) {
  if (p.next() <= 0x39 && p.ch >= 0x30) {
    return p.scanNumber(true);
  }
  return T$Period;
};

CharScanners[0x3C] = function (p) {
  if (p.next() !== 0x3D) {
    return T$Lt;
  }
  p.next();
  return T$LtEq;
};

CharScanners[0x3E] = function (p) {
  if (p.next() !== 0x3D) {
    return T$Gt;
  }
  p.next();
  return T$GtEq;
};

CharScanners[0x25] = returnToken(T$Percent);
CharScanners[0x28] = returnToken(T$LParen);
CharScanners[0x29] = returnToken(T$RParen);
CharScanners[0x2A] = returnToken(T$Star);
CharScanners[0x2B] = returnToken(T$Plus);
CharScanners[0x2C] = returnToken(T$Comma);
CharScanners[0x2D] = returnToken(T$Minus);
CharScanners[0x2F] = returnToken(T$Slash);
CharScanners[0x3A] = returnToken(T$Colon);
CharScanners[0x3F] = returnToken(T$Question);
CharScanners[0x5B] = returnToken(T$LBracket);
CharScanners[0x5D] = returnToken(T$RBracket);
CharScanners[0x5E] = returnToken(T$Caret);
CharScanners[0x7B] = returnToken(T$LBrace);
CharScanners[0x7D] = returnToken(T$RBrace);

var mapProto = Map.prototype;

function _getMapObserver(taskQueue, map) {
  return ModifyMapObserver.for(taskQueue, map);
}

var ModifyMapObserver = function (_ModifyCollectionObse2) {
  _inherits(ModifyMapObserver, _ModifyCollectionObse2);

  function ModifyMapObserver(taskQueue, map) {
    

    return _possibleConstructorReturn(this, _ModifyCollectionObse2.call(this, taskQueue, map));
  }

  ModifyMapObserver.for = function _for(taskQueue, map) {
    if (!('__map_observer__' in map)) {
      Reflect.defineProperty(map, '__map_observer__', {
        value: ModifyMapObserver.create(taskQueue, map),
        enumerable: false, configurable: false
      });
    }
    return map.__map_observer__;
  };

  ModifyMapObserver.create = function create(taskQueue, map) {
    var observer = new ModifyMapObserver(taskQueue, map);

    var proto = mapProto;
    if (proto.set !== map.set || proto.delete !== map.delete || proto.clear !== map.clear) {
      proto = {
        set: map.set,
        delete: map.delete,
        clear: map.clear
      };
    }

    map.set = function () {
      var hasValue = map.has(arguments[0]);
      var type = hasValue ? 'update' : 'add';
      var oldValue = map.get(arguments[0]);
      var methodCallResult = proto.set.apply(map, arguments);
      if (!hasValue || oldValue !== map.get(arguments[0])) {
        observer.addChangeRecord({
          type: type,
          object: map,
          key: arguments[0],
          oldValue: oldValue
        });
      }
      return methodCallResult;
    };

    map.delete = function () {
      var hasValue = map.has(arguments[0]);
      var oldValue = map.get(arguments[0]);
      var methodCallResult = proto.delete.apply(map, arguments);
      if (hasValue) {
        observer.addChangeRecord({
          type: 'delete',
          object: map,
          key: arguments[0],
          oldValue: oldValue
        });
      }
      return methodCallResult;
    };

    map.clear = function () {
      var methodCallResult = proto.clear.apply(map, arguments);
      observer.addChangeRecord({
        type: 'clear',
        object: map
      });
      return methodCallResult;
    };

    return observer;
  };

  return ModifyMapObserver;
}(ModifyCollectionObserver);

var emLogger = __WEBPACK_IMPORTED_MODULE_0_aurelia_logging__["getLogger"]('event-manager');

function findOriginalEventTarget(event) {
  return event.path && event.path[0] || event.deepPath && event.deepPath[0] || event.target;
}

function stopPropagation() {
  this.standardStopPropagation();
  this.propagationStopped = true;
}

function handleCapturedEvent(event) {
  event.propagationStopped = false;
  var target = findOriginalEventTarget(event);

  var orderedCallbacks = [];

  while (target) {
    if (target.capturedCallbacks) {
      var callback = target.capturedCallbacks[event.type];
      if (callback) {
        if (event.stopPropagation !== stopPropagation) {
          event.standardStopPropagation = event.stopPropagation;
          event.stopPropagation = stopPropagation;
        }
        orderedCallbacks.push(callback);
      }
    }
    target = target.parentNode;
  }
  for (var i = orderedCallbacks.length - 1; i >= 0 && !event.propagationStopped; i--) {
    var orderedCallback = orderedCallbacks[i];
    if ('handleEvent' in orderedCallback) {
      orderedCallback.handleEvent(event);
    } else {
      orderedCallback(event);
    }
  }
}

var CapturedHandlerEntry = function () {
  function CapturedHandlerEntry(eventName) {
    

    this.eventName = eventName;
    this.count = 0;
  }

  CapturedHandlerEntry.prototype.increment = function increment() {
    this.count++;

    if (this.count === 1) {
      __WEBPACK_IMPORTED_MODULE_1_aurelia_pal__["c" /* DOM */].addEventListener(this.eventName, handleCapturedEvent, true);
    }
  };

  CapturedHandlerEntry.prototype.decrement = function decrement() {
    if (this.count === 0) {
      emLogger.warn('The same EventListener was disposed multiple times.');
    } else if (--this.count === 0) {
      __WEBPACK_IMPORTED_MODULE_1_aurelia_pal__["c" /* DOM */].removeEventListener(this.eventName, handleCapturedEvent, true);
    }
  };

  return CapturedHandlerEntry;
}();

var DelegateHandlerEntry = function () {
  function DelegateHandlerEntry(eventName, eventManager) {
    

    this.eventName = eventName;
    this.count = 0;
    this.eventManager = eventManager;
  }

  DelegateHandlerEntry.prototype.handleEvent = function handleEvent(event) {
    event.propagationStopped = false;
    var target = findOriginalEventTarget(event);

    while (target && !event.propagationStopped) {
      if (target.delegatedCallbacks) {
        var callback = target.delegatedCallbacks[event.type];
        if (callback) {
          if (event.stopPropagation !== stopPropagation) {
            event.standardStopPropagation = event.stopPropagation;
            event.stopPropagation = stopPropagation;
          }
          if ('handleEvent' in callback) {
            callback.handleEvent(event);
          } else {
            callback(event);
          }
        }
      }

      var parent = target.parentNode;
      var shouldEscapeShadowRoot = this.eventManager.escapeShadowRoot && parent instanceof ShadowRoot;

      target = shouldEscapeShadowRoot ? parent.host : parent;
    }
  };

  DelegateHandlerEntry.prototype.increment = function increment() {
    this.count++;

    if (this.count === 1) {
      __WEBPACK_IMPORTED_MODULE_1_aurelia_pal__["c" /* DOM */].addEventListener(this.eventName, this, false);
    }
  };

  DelegateHandlerEntry.prototype.decrement = function decrement() {
    if (this.count === 0) {
      emLogger.warn('The same EventListener was disposed multiple times.');
    } else if (--this.count === 0) {
      __WEBPACK_IMPORTED_MODULE_1_aurelia_pal__["c" /* DOM */].removeEventListener(this.eventName, this, false);
    }
  };

  return DelegateHandlerEntry;
}();

var DelegationEntryHandler = function () {
  function DelegationEntryHandler(entry, lookup, targetEvent) {
    

    this.entry = entry;
    this.lookup = lookup;
    this.targetEvent = targetEvent;
  }

  DelegationEntryHandler.prototype.dispose = function dispose() {
    if (this.lookup[this.targetEvent]) {
      this.entry.decrement();
      this.lookup[this.targetEvent] = null;
    } else {
      emLogger.warn('Calling .dispose() on already disposed eventListener');
    }
  };

  return DelegationEntryHandler;
}();

var EventHandler = function () {
  function EventHandler(target, targetEvent, callback) {
    

    this.target = target;
    this.targetEvent = targetEvent;
    this.callback = callback;
  }

  EventHandler.prototype.dispose = function dispose() {
    this.target.removeEventListener(this.targetEvent, this.callback);
  };

  return EventHandler;
}();

var DefaultEventStrategy = function () {
  function DefaultEventStrategy(eventManager) {
    

    this.delegatedHandlers = {};
    this.capturedHandlers = {};

    this.eventManager = eventManager;
  }

  DefaultEventStrategy.prototype.subscribe = function subscribe(target, targetEvent, callback, strategy, disposable) {
    var delegatedHandlers = void 0;
    var capturedHandlers = void 0;
    var handlerEntry = void 0;

    if (strategy === delegationStrategy.bubbling) {
      delegatedHandlers = this.delegatedHandlers;
      handlerEntry = delegatedHandlers[targetEvent] || (delegatedHandlers[targetEvent] = new DelegateHandlerEntry(targetEvent, this.eventManager));
      var delegatedCallbacks = target.delegatedCallbacks || (target.delegatedCallbacks = {});
      if (!delegatedCallbacks[targetEvent]) {
        handlerEntry.increment();
      } else {
        emLogger.warn('Overriding previous callback for event listener', { event: targetEvent, callback: callback, previousCallback: delegatedCallbacks[targetEvent] });
      }
      delegatedCallbacks[targetEvent] = callback;

      if (disposable === true) {
        return new DelegationEntryHandler(handlerEntry, delegatedCallbacks, targetEvent);
      }

      return function () {
        handlerEntry.decrement();
        delegatedCallbacks[targetEvent] = null;
      };
    }
    if (strategy === delegationStrategy.capturing) {
      capturedHandlers = this.capturedHandlers;
      handlerEntry = capturedHandlers[targetEvent] || (capturedHandlers[targetEvent] = new CapturedHandlerEntry(targetEvent));
      var capturedCallbacks = target.capturedCallbacks || (target.capturedCallbacks = {});
      if (!capturedCallbacks[targetEvent]) {
        handlerEntry.increment();
      } else {
        emLogger.error('already have a callback for event', { event: targetEvent, callback: callback });
      }
      capturedCallbacks[targetEvent] = callback;

      if (disposable === true) {
        return new DelegationEntryHandler(handlerEntry, capturedCallbacks, targetEvent);
      }

      return function () {
        handlerEntry.decrement();
        capturedCallbacks[targetEvent] = null;
      };
    }

    target.addEventListener(targetEvent, callback);

    if (disposable === true) {
      return new EventHandler(target, targetEvent, callback);
    }

    return function () {
      target.removeEventListener(targetEvent, callback);
    };
  };

  return DefaultEventStrategy;
}();

var delegationStrategy = {
  none: 0,
  capturing: 1,
  bubbling: 2
};

var EventManager = function () {
  function EventManager() {
    var escapeShadowRoot = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

    

    this.elementHandlerLookup = {};
    this.eventStrategyLookup = {};
    this.escapeShadowRoot = escapeShadowRoot;

    this.registerElementConfig({
      tagName: 'input',
      properties: {
        value: ['change', 'input'],
        checked: ['change', 'input'],
        files: ['change', 'input']
      }
    });

    this.registerElementConfig({
      tagName: 'textarea',
      properties: {
        value: ['change', 'input']
      }
    });

    this.registerElementConfig({
      tagName: 'select',
      properties: {
        value: ['change']
      }
    });

    this.registerElementConfig({
      tagName: 'content editable',
      properties: {
        value: ['change', 'input', 'blur', 'keyup', 'paste']
      }
    });

    this.registerElementConfig({
      tagName: 'scrollable element',
      properties: {
        scrollTop: ['scroll'],
        scrollLeft: ['scroll']
      }
    });

    this.defaultEventStrategy = new DefaultEventStrategy(this);
  }

  EventManager.prototype.registerElementConfig = function registerElementConfig(config) {
    var tagName = config.tagName.toLowerCase();
    var properties = config.properties;
    var propertyName = void 0;

    var lookup = this.elementHandlerLookup[tagName] = {};

    for (propertyName in properties) {
      if (properties.hasOwnProperty(propertyName)) {
        lookup[propertyName] = properties[propertyName];
      }
    }
  };

  EventManager.prototype.registerEventStrategy = function registerEventStrategy(eventName, strategy) {
    this.eventStrategyLookup[eventName] = strategy;
  };

  EventManager.prototype.getElementHandler = function getElementHandler(target, propertyName) {
    var tagName = void 0;
    var lookup = this.elementHandlerLookup;

    if (target.tagName) {
      tagName = target.tagName.toLowerCase();

      if (lookup[tagName] && lookup[tagName][propertyName]) {
        return new EventSubscriber(lookup[tagName][propertyName]);
      }

      if (propertyName === 'textContent' || propertyName === 'innerHTML') {
        return new EventSubscriber(lookup['content editable'].value);
      }

      if (propertyName === 'scrollTop' || propertyName === 'scrollLeft') {
        return new EventSubscriber(lookup['scrollable element'][propertyName]);
      }
    }

    return null;
  };

  EventManager.prototype.addEventListener = function addEventListener(target, targetEvent, callbackOrListener, delegate, disposable) {
    return (this.eventStrategyLookup[targetEvent] || this.defaultEventStrategy).subscribe(target, targetEvent, callbackOrListener, delegate, disposable);
  };

  return EventManager;
}();

var EventSubscriber = function () {
  function EventSubscriber(events) {
    

    this.events = events;
    this.element = null;
    this.handler = null;
  }

  EventSubscriber.prototype.subscribe = function subscribe(element, callbackOrListener) {
    this.element = element;
    this.handler = callbackOrListener;

    var events = this.events;
    for (var i = 0, ii = events.length; ii > i; ++i) {
      element.addEventListener(events[i], callbackOrListener);
    }
  };

  EventSubscriber.prototype.dispose = function dispose() {
    if (this.element === null) {
      return;
    }
    var element = this.element;
    var callbackOrListener = this.handler;
    var events = this.events;
    for (var i = 0, ii = events.length; ii > i; ++i) {
      element.removeEventListener(events[i], callbackOrListener);
    }
    this.element = this.handler = null;
  };

  return EventSubscriber;
}();

var DirtyChecker = function () {
  function DirtyChecker() {
    

    this.tracked = [];
    this.checkDelay = 120;
  }

  DirtyChecker.prototype.addProperty = function addProperty(property) {
    var tracked = this.tracked;

    tracked.push(property);

    if (tracked.length === 1) {
      this.scheduleDirtyCheck();
    }
  };

  DirtyChecker.prototype.removeProperty = function removeProperty(property) {
    var tracked = this.tracked;
    tracked.splice(tracked.indexOf(property), 1);
  };

  DirtyChecker.prototype.scheduleDirtyCheck = function scheduleDirtyCheck() {
    var _this22 = this;

    setTimeout(function () {
      return _this22.check();
    }, this.checkDelay);
  };

  DirtyChecker.prototype.check = function check() {
    var tracked = this.tracked;
    var i = tracked.length;

    while (i--) {
      var current = tracked[i];

      if (current.isDirty()) {
        current.call();
      }
    }

    if (tracked.length) {
      this.scheduleDirtyCheck();
    }
  };

  return DirtyChecker;
}();

var DirtyCheckProperty = (_dec5 = subscriberCollection(), _dec5(_class5 = function () {
  function DirtyCheckProperty(dirtyChecker, obj, propertyName) {
    

    this.dirtyChecker = dirtyChecker;
    this.obj = obj;
    this.propertyName = propertyName;
  }

  DirtyCheckProperty.prototype.getValue = function getValue() {
    return this.obj[this.propertyName];
  };

  DirtyCheckProperty.prototype.setValue = function setValue(newValue) {
    this.obj[this.propertyName] = newValue;
  };

  DirtyCheckProperty.prototype.call = function call() {
    var oldValue = this.oldValue;
    var newValue = this.getValue();

    this.callSubscribers(newValue, oldValue);

    this.oldValue = newValue;
  };

  DirtyCheckProperty.prototype.isDirty = function isDirty() {
    return this.oldValue !== this.obj[this.propertyName];
  };

  DirtyCheckProperty.prototype.subscribe = function subscribe(context, callable) {
    if (!this.hasSubscribers()) {
      this.oldValue = this.getValue();
      this.dirtyChecker.addProperty(this);
    }
    this.addSubscriber(context, callable);
  };

  DirtyCheckProperty.prototype.unsubscribe = function unsubscribe(context, callable) {
    if (this.removeSubscriber(context, callable) && !this.hasSubscribers()) {
      this.dirtyChecker.removeProperty(this);
    }
  };

  return DirtyCheckProperty;
}()) || _class5);

var logger = __WEBPACK_IMPORTED_MODULE_0_aurelia_logging__["getLogger"]('property-observation');

var propertyAccessor = {
  getValue: function getValue(obj, propertyName) {
    return obj[propertyName];
  },
  setValue: function setValue(value, obj, propertyName) {
    obj[propertyName] = value;
  }
};

var PrimitiveObserver = function () {
  function PrimitiveObserver(primitive, propertyName) {
    

    this.doNotCache = true;

    this.primitive = primitive;
    this.propertyName = propertyName;
  }

  PrimitiveObserver.prototype.getValue = function getValue() {
    return this.primitive[this.propertyName];
  };

  PrimitiveObserver.prototype.setValue = function setValue() {
    var type = _typeof(this.primitive);
    throw new Error('The ' + this.propertyName + ' property of a ' + type + ' (' + this.primitive + ') cannot be assigned.');
  };

  PrimitiveObserver.prototype.subscribe = function subscribe() {};

  PrimitiveObserver.prototype.unsubscribe = function unsubscribe() {};

  return PrimitiveObserver;
}();

var SetterObserver = (_dec6 = subscriberCollection(), _dec6(_class7 = function () {
  function SetterObserver(taskQueue, obj, propertyName) {
    

    this.taskQueue = taskQueue;
    this.obj = obj;
    this.propertyName = propertyName;
    this.queued = false;
    this.observing = false;
  }

  SetterObserver.prototype.getValue = function getValue() {
    return this.obj[this.propertyName];
  };

  SetterObserver.prototype.setValue = function setValue(newValue) {
    this.obj[this.propertyName] = newValue;
  };

  SetterObserver.prototype.getterValue = function getterValue() {
    return this.currentValue;
  };

  SetterObserver.prototype.setterValue = function setterValue(newValue) {
    var oldValue = this.currentValue;

    if (oldValue !== newValue) {
      if (!this.queued) {
        this.oldValue = oldValue;
        this.queued = true;
        this.taskQueue.queueMicroTask(this);
      }

      this.currentValue = newValue;
    }
  };

  SetterObserver.prototype.call = function call() {
    var oldValue = this.oldValue;
    var newValue = this.currentValue;

    this.queued = false;

    this.callSubscribers(newValue, oldValue);
  };

  SetterObserver.prototype.subscribe = function subscribe(context, callable) {
    if (!this.observing) {
      this.convertProperty();
    }
    this.addSubscriber(context, callable);
  };

  SetterObserver.prototype.unsubscribe = function unsubscribe(context, callable) {
    this.removeSubscriber(context, callable);
  };

  SetterObserver.prototype.convertProperty = function convertProperty() {
    this.observing = true;
    this.currentValue = this.obj[this.propertyName];
    this.setValue = this.setterValue;
    this.getValue = this.getterValue;

    if (!Reflect.defineProperty(this.obj, this.propertyName, {
      configurable: true,
      enumerable: this.propertyName in this.obj ? this.obj.propertyIsEnumerable(this.propertyName) : true,
      get: this.getValue.bind(this),
      set: this.setValue.bind(this)
    })) {
      logger.warn('Cannot observe property \'' + this.propertyName + '\' of object', this.obj);
    }
  };

  return SetterObserver;
}()) || _class7);

var XLinkAttributeObserver = function () {
  function XLinkAttributeObserver(element, propertyName, attributeName) {
    

    this.element = element;
    this.propertyName = propertyName;
    this.attributeName = attributeName;
  }

  XLinkAttributeObserver.prototype.getValue = function getValue() {
    return this.element.getAttributeNS('http://www.w3.org/1999/xlink', this.attributeName);
  };

  XLinkAttributeObserver.prototype.setValue = function setValue(newValue) {
    return this.element.setAttributeNS('http://www.w3.org/1999/xlink', this.attributeName, newValue);
  };

  XLinkAttributeObserver.prototype.subscribe = function subscribe() {
    throw new Error('Observation of a "' + this.element.nodeName + '" element\'s "' + this.propertyName + '" property is not supported.');
  };

  return XLinkAttributeObserver;
}();

var dataAttributeAccessor = {
  getValue: function getValue(obj, propertyName) {
    return obj.getAttribute(propertyName);
  },
  setValue: function setValue(value, obj, propertyName) {
    if (value === null || value === undefined) {
      obj.removeAttribute(propertyName);
    } else {
      obj.setAttribute(propertyName, value);
    }
  }
};

var DataAttributeObserver = function () {
  function DataAttributeObserver(element, propertyName) {
    

    this.element = element;
    this.propertyName = propertyName;
  }

  DataAttributeObserver.prototype.getValue = function getValue() {
    return this.element.getAttribute(this.propertyName);
  };

  DataAttributeObserver.prototype.setValue = function setValue(newValue) {
    if (newValue === null || newValue === undefined) {
      return this.element.removeAttribute(this.propertyName);
    }
    return this.element.setAttribute(this.propertyName, newValue);
  };

  DataAttributeObserver.prototype.subscribe = function subscribe() {
    throw new Error('Observation of a "' + this.element.nodeName + '" element\'s "' + this.propertyName + '" property is not supported.');
  };

  return DataAttributeObserver;
}();

var StyleObserver = function () {
  function StyleObserver(element, propertyName) {
    

    this.element = element;
    this.propertyName = propertyName;

    this.styles = null;
    this.version = 0;
  }

  StyleObserver.prototype.getValue = function getValue() {
    return this.element.style.cssText;
  };

  StyleObserver.prototype._setProperty = function _setProperty(style, value) {
    var priority = '';

    if (value !== null && value !== undefined && typeof value.indexOf === 'function' && value.indexOf('!important') !== -1) {
      priority = 'important';
      value = value.replace('!important', '');
    }
    this.element.style.setProperty(style, value, priority);
  };

  StyleObserver.prototype.setValue = function setValue(newValue) {
    var styles = this.styles || {};
    var style = void 0;
    var version = this.version;

    if (newValue !== null && newValue !== undefined) {
      if (newValue instanceof Object) {
        var value = void 0;
        for (style in newValue) {
          if (newValue.hasOwnProperty(style)) {
            value = newValue[style];
            style = style.replace(/([A-Z])/g, function (m) {
              return '-' + m.toLowerCase();
            });
            styles[style] = version;
            this._setProperty(style, value);
          }
        }
      } else if (newValue.length) {
        var rx = /\s*([\w\-]+)\s*:\s*((?:(?:[\w\-]+\(\s*(?:"(?:\\"|[^"])*"|'(?:\\'|[^'])*'|[\w\-]+\(\s*(?:^"(?:\\"|[^"])*"|'(?:\\'|[^'])*'|[^\)]*)\),?|[^\)]*)\),?|"(?:\\"|[^"])*"|'(?:\\'|[^'])*'|[^;]*),?\s*)+);?/g;
        var pair = void 0;
        while ((pair = rx.exec(newValue)) !== null) {
          style = pair[1];
          if (!style) {
            continue;
          }

          styles[style] = version;
          this._setProperty(style, pair[2]);
        }
      }
    }

    this.styles = styles;
    this.version += 1;

    if (version === 0) {
      return;
    }

    version -= 1;
    for (style in styles) {
      if (!styles.hasOwnProperty(style) || styles[style] !== version) {
        continue;
      }

      this.element.style.removeProperty(style);
    }
  };

  StyleObserver.prototype.subscribe = function subscribe() {
    throw new Error('Observation of a "' + this.element.nodeName + '" element\'s "' + this.propertyName + '" property is not supported.');
  };

  return StyleObserver;
}();

var ValueAttributeObserver = (_dec7 = subscriberCollection(), _dec7(_class8 = function () {
  function ValueAttributeObserver(element, propertyName, handler) {
    

    this.element = element;
    this.propertyName = propertyName;
    this.handler = handler;
    if (propertyName === 'files') {
      this.setValue = function () {};
    }
  }

  ValueAttributeObserver.prototype.getValue = function getValue() {
    return this.element[this.propertyName];
  };

  ValueAttributeObserver.prototype.setValue = function setValue(newValue) {
    newValue = newValue === undefined || newValue === null ? '' : newValue;
    if (this.element[this.propertyName] !== newValue) {
      this.element[this.propertyName] = newValue;
      this.notify();
    }
  };

  ValueAttributeObserver.prototype.notify = function notify() {
    var oldValue = this.oldValue;
    var newValue = this.getValue();

    this.callSubscribers(newValue, oldValue);

    this.oldValue = newValue;
  };

  ValueAttributeObserver.prototype.handleEvent = function handleEvent() {
    this.notify();
  };

  ValueAttributeObserver.prototype.subscribe = function subscribe(context, callable) {
    if (!this.hasSubscribers()) {
      this.oldValue = this.getValue();
      this.handler.subscribe(this.element, this);
    }

    this.addSubscriber(context, callable);
  };

  ValueAttributeObserver.prototype.unsubscribe = function unsubscribe(context, callable) {
    if (this.removeSubscriber(context, callable) && !this.hasSubscribers()) {
      this.handler.dispose();
    }
  };

  return ValueAttributeObserver;
}()) || _class8);

var checkedArrayContext = 'CheckedObserver:array';
var checkedValueContext = 'CheckedObserver:value';

var CheckedObserver = (_dec8 = subscriberCollection(), _dec8(_class9 = function () {
  function CheckedObserver(element, handler, observerLocator) {
    

    this.element = element;
    this.handler = handler;
    this.observerLocator = observerLocator;
  }

  CheckedObserver.prototype.getValue = function getValue() {
    return this.value;
  };

  CheckedObserver.prototype.setValue = function setValue(newValue) {
    if (this.initialSync && this.value === newValue) {
      return;
    }

    if (this.arrayObserver) {
      this.arrayObserver.unsubscribe(checkedArrayContext, this);
      this.arrayObserver = null;
    }

    if (this.element.type === 'checkbox' && Array.isArray(newValue)) {
      this.arrayObserver = this.observerLocator.getArrayObserver(newValue);
      this.arrayObserver.subscribe(checkedArrayContext, this);
    }

    this.oldValue = this.value;
    this.value = newValue;
    this.synchronizeElement();
    this.notify();

    if (!this.initialSync) {
      this.initialSync = true;
      this.observerLocator.taskQueue.queueMicroTask(this);
    }
  };

  CheckedObserver.prototype.call = function call(context, splices) {
    this.synchronizeElement();

    if (!this.valueObserver) {
      this.valueObserver = this.element.__observers__.model || this.element.__observers__.value;
      if (this.valueObserver) {
        this.valueObserver.subscribe(checkedValueContext, this);
      }
    }
  };

  CheckedObserver.prototype.synchronizeElement = function synchronizeElement() {
    var value = this.value;
    var element = this.element;
    var elementValue = element.hasOwnProperty('model') ? element.model : element.value;
    var isRadio = element.type === 'radio';
    var matcher = element.matcher || function (a, b) {
      return a === b;
    };

    element.checked = isRadio && !!matcher(value, elementValue) || !isRadio && value === true || !isRadio && Array.isArray(value) && value.findIndex(function (item) {
      return !!matcher(item, elementValue);
    }) !== -1;
  };

  CheckedObserver.prototype.synchronizeValue = function synchronizeValue() {
    var value = this.value;
    var element = this.element;
    var elementValue = element.hasOwnProperty('model') ? element.model : element.value;
    var index = void 0;
    var matcher = element.matcher || function (a, b) {
      return a === b;
    };

    if (element.type === 'checkbox') {
      if (Array.isArray(value)) {
        index = value.findIndex(function (item) {
          return !!matcher(item, elementValue);
        });
        if (element.checked && index === -1) {
          value.push(elementValue);
        } else if (!element.checked && index !== -1) {
          value.splice(index, 1);
        }

        return;
      }

      value = element.checked;
    } else if (element.checked) {
      value = elementValue;
    } else {
      return;
    }

    this.oldValue = this.value;
    this.value = value;
    this.notify();
  };

  CheckedObserver.prototype.notify = function notify() {
    var oldValue = this.oldValue;
    var newValue = this.value;

    if (newValue === oldValue) {
      return;
    }

    this.callSubscribers(newValue, oldValue);
  };

  CheckedObserver.prototype.handleEvent = function handleEvent() {
    this.synchronizeValue();
  };

  CheckedObserver.prototype.subscribe = function subscribe(context, callable) {
    if (!this.hasSubscribers()) {
      this.handler.subscribe(this.element, this);
    }
    this.addSubscriber(context, callable);
  };

  CheckedObserver.prototype.unsubscribe = function unsubscribe(context, callable) {
    if (this.removeSubscriber(context, callable) && !this.hasSubscribers()) {
      this.handler.dispose();
    }
  };

  CheckedObserver.prototype.unbind = function unbind() {
    if (this.arrayObserver) {
      this.arrayObserver.unsubscribe(checkedArrayContext, this);
      this.arrayObserver = null;
    }
    if (this.valueObserver) {
      this.valueObserver.unsubscribe(checkedValueContext, this);
    }
  };

  return CheckedObserver;
}()) || _class9);

var selectArrayContext = 'SelectValueObserver:array';

var SelectValueObserver = (_dec9 = subscriberCollection(), _dec9(_class10 = function () {
  function SelectValueObserver(element, handler, observerLocator) {
    

    this.element = element;
    this.handler = handler;
    this.observerLocator = observerLocator;
  }

  SelectValueObserver.prototype.getValue = function getValue() {
    return this.value;
  };

  SelectValueObserver.prototype.setValue = function setValue(newValue) {
    if (newValue !== null && newValue !== undefined && this.element.multiple && !Array.isArray(newValue)) {
      throw new Error('Only null or Array instances can be bound to a multi-select.');
    }
    if (this.value === newValue) {
      return;
    }

    if (this.arrayObserver) {
      this.arrayObserver.unsubscribe(selectArrayContext, this);
      this.arrayObserver = null;
    }

    if (Array.isArray(newValue)) {
      this.arrayObserver = this.observerLocator.getArrayObserver(newValue);
      this.arrayObserver.subscribe(selectArrayContext, this);
    }

    this.oldValue = this.value;
    this.value = newValue;
    this.synchronizeOptions();
    this.notify();

    if (!this.initialSync) {
      this.initialSync = true;
      this.observerLocator.taskQueue.queueMicroTask(this);
    }
  };

  SelectValueObserver.prototype.call = function call(context, splices) {
    this.synchronizeOptions();
  };

  SelectValueObserver.prototype.synchronizeOptions = function synchronizeOptions() {
    var value = this.value;
    var isArray = void 0;

    if (Array.isArray(value)) {
      isArray = true;
    }

    var options = this.element.options;
    var i = options.length;
    var matcher = this.element.matcher || function (a, b) {
      return a === b;
    };

    var _loop = function _loop() {
      var option = options.item(i);
      var optionValue = option.hasOwnProperty('model') ? option.model : option.value;
      if (isArray) {
        option.selected = value.findIndex(function (item) {
          return !!matcher(optionValue, item);
        }) !== -1;
        return 'continue';
      }
      option.selected = !!matcher(optionValue, value);
    };

    while (i--) {
      var _ret = _loop();

      if (_ret === 'continue') continue;
    }
  };

  SelectValueObserver.prototype.synchronizeValue = function synchronizeValue() {
    var _this23 = this;

    var options = this.element.options;
    var count = 0;
    var value = [];

    for (var i = 0, ii = options.length; i < ii; i++) {
      var _option = options.item(i);
      if (!_option.selected) {
        continue;
      }
      value.push(_option.hasOwnProperty('model') ? _option.model : _option.value);
      count++;
    }

    if (this.element.multiple) {
      if (Array.isArray(this.value)) {
        var _ret2 = function () {
          var matcher = _this23.element.matcher || function (a, b) {
            return a === b;
          };

          var i = 0;

          var _loop2 = function _loop2() {
            var a = _this23.value[i];
            if (value.findIndex(function (b) {
              return matcher(a, b);
            }) === -1) {
              _this23.value.splice(i, 1);
            } else {
              i++;
            }
          };

          while (i < _this23.value.length) {
            _loop2();
          }

          i = 0;

          var _loop3 = function _loop3() {
            var a = value[i];
            if (_this23.value.findIndex(function (b) {
              return matcher(a, b);
            }) === -1) {
              _this23.value.push(a);
            }
            i++;
          };

          while (i < value.length) {
            _loop3();
          }
          return {
            v: void 0
          };
        }();

        if ((typeof _ret2 === 'undefined' ? 'undefined' : _typeof(_ret2)) === "object") return _ret2.v;
      }
    } else {
      if (count === 0) {
        value = null;
      } else {
        value = value[0];
      }
    }

    if (value !== this.value) {
      this.oldValue = this.value;
      this.value = value;
      this.notify();
    }
  };

  SelectValueObserver.prototype.notify = function notify() {
    var oldValue = this.oldValue;
    var newValue = this.value;

    this.callSubscribers(newValue, oldValue);
  };

  SelectValueObserver.prototype.handleEvent = function handleEvent() {
    this.synchronizeValue();
  };

  SelectValueObserver.prototype.subscribe = function subscribe(context, callable) {
    if (!this.hasSubscribers()) {
      this.handler.subscribe(this.element, this);
    }
    this.addSubscriber(context, callable);
  };

  SelectValueObserver.prototype.unsubscribe = function unsubscribe(context, callable) {
    if (this.removeSubscriber(context, callable) && !this.hasSubscribers()) {
      this.handler.dispose();
    }
  };

  SelectValueObserver.prototype.bind = function bind() {
    var _this24 = this;

    this.domObserver = __WEBPACK_IMPORTED_MODULE_1_aurelia_pal__["c" /* DOM */].createMutationObserver(function () {
      _this24.synchronizeOptions();
      _this24.synchronizeValue();
    });
    this.domObserver.observe(this.element, { childList: true, subtree: true, characterData: true });
  };

  SelectValueObserver.prototype.unbind = function unbind() {
    this.domObserver.disconnect();
    this.domObserver = null;

    if (this.arrayObserver) {
      this.arrayObserver.unsubscribe(selectArrayContext, this);
      this.arrayObserver = null;
    }
  };

  return SelectValueObserver;
}()) || _class10);

var ClassObserver = function () {
  function ClassObserver(element) {
    

    this.element = element;
    this.doNotCache = true;
    this.value = '';
    this.version = 0;
  }

  ClassObserver.prototype.getValue = function getValue() {
    return this.value;
  };

  ClassObserver.prototype.setValue = function setValue(newValue) {
    var nameIndex = this.nameIndex || {};
    var version = this.version;
    var names = void 0;
    var name = void 0;

    if (newValue !== null && newValue !== undefined && newValue.length) {
      names = newValue.split(/\s+/);
      for (var i = 0, length = names.length; i < length; i++) {
        name = names[i];
        if (name === '') {
          continue;
        }
        nameIndex[name] = version;
        this.element.classList.add(name);
      }
    }

    this.value = newValue;
    this.nameIndex = nameIndex;
    this.version += 1;

    if (version === 0) {
      return;
    }

    version -= 1;
    for (name in nameIndex) {
      if (!nameIndex.hasOwnProperty(name) || nameIndex[name] !== version) {
        continue;
      }
      this.element.classList.remove(name);
    }
  };

  ClassObserver.prototype.subscribe = function subscribe() {
    throw new Error('Observation of a "' + this.element.nodeName + '" element\'s "class" property is not supported.');
  };

  return ClassObserver;
}();

function hasDeclaredDependencies(descriptor) {
  return !!(descriptor && descriptor.get && descriptor.get.dependencies);
}

function declarePropertyDependencies(ctor, propertyName, dependencies) {
  var descriptor = Object.getOwnPropertyDescriptor(ctor.prototype, propertyName);
  descriptor.get.dependencies = dependencies;
}

function computedFrom() {
  for (var _len = arguments.length, rest = Array(_len), _key = 0; _key < _len; _key++) {
    rest[_key] = arguments[_key];
  }

  return function (target, key, descriptor) {
    descriptor.get.dependencies = rest;
    return descriptor;
  };
}

var ComputedExpression = function (_Expression19) {
  _inherits(ComputedExpression, _Expression19);

  function ComputedExpression(name, dependencies) {
    

    var _this25 = _possibleConstructorReturn(this, _Expression19.call(this));

    _this25.name = name;
    _this25.dependencies = dependencies;
    _this25.isAssignable = true;
    return _this25;
  }

  ComputedExpression.prototype.evaluate = function evaluate(scope, lookupFunctions) {
    return scope.bindingContext[this.name];
  };

  ComputedExpression.prototype.assign = function assign(scope, value) {
    scope.bindingContext[this.name] = value;
  };

  ComputedExpression.prototype.accept = function accept(visitor) {
    throw new Error('not implemented');
  };

  ComputedExpression.prototype.connect = function connect(binding, scope) {
    var dependencies = this.dependencies;
    var i = dependencies.length;
    while (i--) {
      dependencies[i].connect(binding, scope);
    }
  };

  return ComputedExpression;
}(Expression);

function createComputedObserver(obj, propertyName, descriptor, observerLocator) {
  var dependencies = descriptor.get.dependencies;
  if (!(dependencies instanceof ComputedExpression)) {
    var i = dependencies.length;
    while (i--) {
      dependencies[i] = observerLocator.parser.parse(dependencies[i]);
    }
    dependencies = descriptor.get.dependencies = new ComputedExpression(propertyName, dependencies);
  }

  var scope = { bindingContext: obj, overrideContext: createOverrideContext(obj) };
  return new ExpressionObserver(scope, dependencies, observerLocator);
}

var svgElements = void 0;
var svgPresentationElements = void 0;
var svgPresentationAttributes = void 0;
var svgAnalyzer = void 0;

if (typeof FEATURE_NO_SVG === 'undefined') {
  svgElements = {
    a: ['class', 'externalResourcesRequired', 'id', 'onactivate', 'onclick', 'onfocusin', 'onfocusout', 'onload', 'onmousedown', 'onmousemove', 'onmouseout', 'onmouseover', 'onmouseup', 'requiredExtensions', 'requiredFeatures', 'style', 'systemLanguage', 'target', 'transform', 'xlink:actuate', 'xlink:arcrole', 'xlink:href', 'xlink:role', 'xlink:show', 'xlink:title', 'xlink:type', 'xml:base', 'xml:lang', 'xml:space'],
    altGlyph: ['class', 'dx', 'dy', 'externalResourcesRequired', 'format', 'glyphRef', 'id', 'onactivate', 'onclick', 'onfocusin', 'onfocusout', 'onload', 'onmousedown', 'onmousemove', 'onmouseout', 'onmouseover', 'onmouseup', 'requiredExtensions', 'requiredFeatures', 'rotate', 'style', 'systemLanguage', 'x', 'xlink:actuate', 'xlink:arcrole', 'xlink:href', 'xlink:role', 'xlink:show', 'xlink:title', 'xlink:type', 'xml:base', 'xml:lang', 'xml:space', 'y'],
    altGlyphDef: ['id', 'xml:base', 'xml:lang', 'xml:space'],
    altGlyphItem: ['id', 'xml:base', 'xml:lang', 'xml:space'],
    animate: ['accumulate', 'additive', 'attributeName', 'attributeType', 'begin', 'by', 'calcMode', 'dur', 'end', 'externalResourcesRequired', 'fill', 'from', 'id', 'keySplines', 'keyTimes', 'max', 'min', 'onbegin', 'onend', 'onload', 'onrepeat', 'repeatCount', 'repeatDur', 'requiredExtensions', 'requiredFeatures', 'restart', 'systemLanguage', 'to', 'values', 'xlink:actuate', 'xlink:arcrole', 'xlink:href', 'xlink:role', 'xlink:show', 'xlink:title', 'xlink:type', 'xml:base', 'xml:lang', 'xml:space'],
    animateColor: ['accumulate', 'additive', 'attributeName', 'attributeType', 'begin', 'by', 'calcMode', 'dur', 'end', 'externalResourcesRequired', 'fill', 'from', 'id', 'keySplines', 'keyTimes', 'max', 'min', 'onbegin', 'onend', 'onload', 'onrepeat', 'repeatCount', 'repeatDur', 'requiredExtensions', 'requiredFeatures', 'restart', 'systemLanguage', 'to', 'values', 'xlink:actuate', 'xlink:arcrole', 'xlink:href', 'xlink:role', 'xlink:show', 'xlink:title', 'xlink:type', 'xml:base', 'xml:lang', 'xml:space'],
    animateMotion: ['accumulate', 'additive', 'begin', 'by', 'calcMode', 'dur', 'end', 'externalResourcesRequired', 'fill', 'from', 'id', 'keyPoints', 'keySplines', 'keyTimes', 'max', 'min', 'onbegin', 'onend', 'onload', 'onrepeat', 'origin', 'path', 'repeatCount', 'repeatDur', 'requiredExtensions', 'requiredFeatures', 'restart', 'rotate', 'systemLanguage', 'to', 'values', 'xlink:actuate', 'xlink:arcrole', 'xlink:href', 'xlink:role', 'xlink:show', 'xlink:title', 'xlink:type', 'xml:base', 'xml:lang', 'xml:space'],
    animateTransform: ['accumulate', 'additive', 'attributeName', 'attributeType', 'begin', 'by', 'calcMode', 'dur', 'end', 'externalResourcesRequired', 'fill', 'from', 'id', 'keySplines', 'keyTimes', 'max', 'min', 'onbegin', 'onend', 'onload', 'onrepeat', 'repeatCount', 'repeatDur', 'requiredExtensions', 'requiredFeatures', 'restart', 'systemLanguage', 'to', 'type', 'values', 'xlink:actuate', 'xlink:arcrole', 'xlink:href', 'xlink:role', 'xlink:show', 'xlink:title', 'xlink:type', 'xml:base', 'xml:lang', 'xml:space'],
    circle: ['class', 'cx', 'cy', 'externalResourcesRequired', 'id', 'onactivate', 'onclick', 'onfocusin', 'onfocusout', 'onload', 'onmousedown', 'onmousemove', 'onmouseout', 'onmouseover', 'onmouseup', 'r', 'requiredExtensions', 'requiredFeatures', 'style', 'systemLanguage', 'transform', 'xml:base', 'xml:lang', 'xml:space'],
    clipPath: ['class', 'clipPathUnits', 'externalResourcesRequired', 'id', 'requiredExtensions', 'requiredFeatures', 'style', 'systemLanguage', 'transform', 'xml:base', 'xml:lang', 'xml:space'],
    'color-profile': ['id', 'local', 'name', 'rendering-intent', 'xlink:actuate', 'xlink:arcrole', 'xlink:href', 'xlink:role', 'xlink:show', 'xlink:title', 'xlink:type', 'xml:base', 'xml:lang', 'xml:space'],
    cursor: ['externalResourcesRequired', 'id', 'requiredExtensions', 'requiredFeatures', 'systemLanguage', 'x', 'xlink:actuate', 'xlink:arcrole', 'xlink:href', 'xlink:role', 'xlink:show', 'xlink:title', 'xlink:type', 'xml:base', 'xml:lang', 'xml:space', 'y'],
    defs: ['class', 'externalResourcesRequired', 'id', 'onactivate', 'onclick', 'onfocusin', 'onfocusout', 'onload', 'onmousedown', 'onmousemove', 'onmouseout', 'onmouseover', 'onmouseup', 'requiredExtensions', 'requiredFeatures', 'style', 'systemLanguage', 'transform', 'xml:base', 'xml:lang', 'xml:space'],
    desc: ['class', 'id', 'style', 'xml:base', 'xml:lang', 'xml:space'],
    ellipse: ['class', 'cx', 'cy', 'externalResourcesRequired', 'id', 'onactivate', 'onclick', 'onfocusin', 'onfocusout', 'onload', 'onmousedown', 'onmousemove', 'onmouseout', 'onmouseover', 'onmouseup', 'requiredExtensions', 'requiredFeatures', 'rx', 'ry', 'style', 'systemLanguage', 'transform', 'xml:base', 'xml:lang', 'xml:space'],
    feBlend: ['class', 'height', 'id', 'in', 'in2', 'mode', 'result', 'style', 'width', 'x', 'xml:base', 'xml:lang', 'xml:space', 'y'],
    feColorMatrix: ['class', 'height', 'id', 'in', 'result', 'style', 'type', 'values', 'width', 'x', 'xml:base', 'xml:lang', 'xml:space', 'y'],
    feComponentTransfer: ['class', 'height', 'id', 'in', 'result', 'style', 'width', 'x', 'xml:base', 'xml:lang', 'xml:space', 'y'],
    feComposite: ['class', 'height', 'id', 'in', 'in2', 'k1', 'k2', 'k3', 'k4', 'operator', 'result', 'style', 'width', 'x', 'xml:base', 'xml:lang', 'xml:space', 'y'],
    feConvolveMatrix: ['bias', 'class', 'divisor', 'edgeMode', 'height', 'id', 'in', 'kernelMatrix', 'kernelUnitLength', 'order', 'preserveAlpha', 'result', 'style', 'targetX', 'targetY', 'width', 'x', 'xml:base', 'xml:lang', 'xml:space', 'y'],
    feDiffuseLighting: ['class', 'diffuseConstant', 'height', 'id', 'in', 'kernelUnitLength', 'result', 'style', 'surfaceScale', 'width', 'x', 'xml:base', 'xml:lang', 'xml:space', 'y'],
    feDisplacementMap: ['class', 'height', 'id', 'in', 'in2', 'result', 'scale', 'style', 'width', 'x', 'xChannelSelector', 'xml:base', 'xml:lang', 'xml:space', 'y', 'yChannelSelector'],
    feDistantLight: ['azimuth', 'elevation', 'id', 'xml:base', 'xml:lang', 'xml:space'],
    feFlood: ['class', 'height', 'id', 'result', 'style', 'width', 'x', 'xml:base', 'xml:lang', 'xml:space', 'y'],
    feFuncA: ['amplitude', 'exponent', 'id', 'intercept', 'offset', 'slope', 'tableValues', 'type', 'xml:base', 'xml:lang', 'xml:space'],
    feFuncB: ['amplitude', 'exponent', 'id', 'intercept', 'offset', 'slope', 'tableValues', 'type', 'xml:base', 'xml:lang', 'xml:space'],
    feFuncG: ['amplitude', 'exponent', 'id', 'intercept', 'offset', 'slope', 'tableValues', 'type', 'xml:base', 'xml:lang', 'xml:space'],
    feFuncR: ['amplitude', 'exponent', 'id', 'intercept', 'offset', 'slope', 'tableValues', 'type', 'xml:base', 'xml:lang', 'xml:space'],
    feGaussianBlur: ['class', 'height', 'id', 'in', 'result', 'stdDeviation', 'style', 'width', 'x', 'xml:base', 'xml:lang', 'xml:space', 'y'],
    feImage: ['class', 'externalResourcesRequired', 'height', 'id', 'preserveAspectRatio', 'result', 'style', 'width', 'x', 'xlink:actuate', 'xlink:arcrole', 'xlink:href', 'xlink:role', 'xlink:show', 'xlink:title', 'xlink:type', 'xml:base', 'xml:lang', 'xml:space', 'y'],
    feMerge: ['class', 'height', 'id', 'result', 'style', 'width', 'x', 'xml:base', 'xml:lang', 'xml:space', 'y'],
    feMergeNode: ['id', 'xml:base', 'xml:lang', 'xml:space'],
    feMorphology: ['class', 'height', 'id', 'in', 'operator', 'radius', 'result', 'style', 'width', 'x', 'xml:base', 'xml:lang', 'xml:space', 'y'],
    feOffset: ['class', 'dx', 'dy', 'height', 'id', 'in', 'result', 'style', 'width', 'x', 'xml:base', 'xml:lang', 'xml:space', 'y'],
    fePointLight: ['id', 'x', 'xml:base', 'xml:lang', 'xml:space', 'y', 'z'],
    feSpecularLighting: ['class', 'height', 'id', 'in', 'kernelUnitLength', 'result', 'specularConstant', 'specularExponent', 'style', 'surfaceScale', 'width', 'x', 'xml:base', 'xml:lang', 'xml:space', 'y'],
    feSpotLight: ['id', 'limitingConeAngle', 'pointsAtX', 'pointsAtY', 'pointsAtZ', 'specularExponent', 'x', 'xml:base', 'xml:lang', 'xml:space', 'y', 'z'],
    feTile: ['class', 'height', 'id', 'in', 'result', 'style', 'width', 'x', 'xml:base', 'xml:lang', 'xml:space', 'y'],
    feTurbulence: ['baseFrequency', 'class', 'height', 'id', 'numOctaves', 'result', 'seed', 'stitchTiles', 'style', 'type', 'width', 'x', 'xml:base', 'xml:lang', 'xml:space', 'y'],
    filter: ['class', 'externalResourcesRequired', 'filterRes', 'filterUnits', 'height', 'id', 'primitiveUnits', 'style', 'width', 'x', 'xlink:actuate', 'xlink:arcrole', 'xlink:href', 'xlink:role', 'xlink:show', 'xlink:title', 'xlink:type', 'xml:base', 'xml:lang', 'xml:space', 'y'],
    font: ['class', 'externalResourcesRequired', 'horiz-adv-x', 'horiz-origin-x', 'horiz-origin-y', 'id', 'style', 'vert-adv-y', 'vert-origin-x', 'vert-origin-y', 'xml:base', 'xml:lang', 'xml:space'],
    'font-face': ['accent-height', 'alphabetic', 'ascent', 'bbox', 'cap-height', 'descent', 'font-family', 'font-size', 'font-stretch', 'font-style', 'font-variant', 'font-weight', 'hanging', 'id', 'ideographic', 'mathematical', 'overline-position', 'overline-thickness', 'panose-1', 'slope', 'stemh', 'stemv', 'strikethrough-position', 'strikethrough-thickness', 'underline-position', 'underline-thickness', 'unicode-range', 'units-per-em', 'v-alphabetic', 'v-hanging', 'v-ideographic', 'v-mathematical', 'widths', 'x-height', 'xml:base', 'xml:lang', 'xml:space'],
    'font-face-format': ['id', 'string', 'xml:base', 'xml:lang', 'xml:space'],
    'font-face-name': ['id', 'name', 'xml:base', 'xml:lang', 'xml:space'],
    'font-face-src': ['id', 'xml:base', 'xml:lang', 'xml:space'],
    'font-face-uri': ['id', 'xlink:actuate', 'xlink:arcrole', 'xlink:href', 'xlink:role', 'xlink:show', 'xlink:title', 'xlink:type', 'xml:base', 'xml:lang', 'xml:space'],
    foreignObject: ['class', 'externalResourcesRequired', 'height', 'id', 'onactivate', 'onclick', 'onfocusin', 'onfocusout', 'onload', 'onmousedown', 'onmousemove', 'onmouseout', 'onmouseover', 'onmouseup', 'requiredExtensions', 'requiredFeatures', 'style', 'systemLanguage', 'transform', 'width', 'x', 'xml:base', 'xml:lang', 'xml:space', 'y'],
    g: ['class', 'externalResourcesRequired', 'id', 'onactivate', 'onclick', 'onfocusin', 'onfocusout', 'onload', 'onmousedown', 'onmousemove', 'onmouseout', 'onmouseover', 'onmouseup', 'requiredExtensions', 'requiredFeatures', 'style', 'systemLanguage', 'transform', 'xml:base', 'xml:lang', 'xml:space'],
    glyph: ['arabic-form', 'class', 'd', 'glyph-name', 'horiz-adv-x', 'id', 'lang', 'orientation', 'style', 'unicode', 'vert-adv-y', 'vert-origin-x', 'vert-origin-y', 'xml:base', 'xml:lang', 'xml:space'],
    glyphRef: ['class', 'dx', 'dy', 'format', 'glyphRef', 'id', 'style', 'x', 'xlink:actuate', 'xlink:arcrole', 'xlink:href', 'xlink:role', 'xlink:show', 'xlink:title', 'xlink:type', 'xml:base', 'xml:lang', 'xml:space', 'y'],
    hkern: ['g1', 'g2', 'id', 'k', 'u1', 'u2', 'xml:base', 'xml:lang', 'xml:space'],
    image: ['class', 'externalResourcesRequired', 'height', 'id', 'onactivate', 'onclick', 'onfocusin', 'onfocusout', 'onload', 'onmousedown', 'onmousemove', 'onmouseout', 'onmouseover', 'onmouseup', 'preserveAspectRatio', 'requiredExtensions', 'requiredFeatures', 'style', 'systemLanguage', 'transform', 'width', 'x', 'xlink:actuate', 'xlink:arcrole', 'xlink:href', 'xlink:role', 'xlink:show', 'xlink:title', 'xlink:type', 'xml:base', 'xml:lang', 'xml:space', 'y'],
    line: ['class', 'externalResourcesRequired', 'id', 'onactivate', 'onclick', 'onfocusin', 'onfocusout', 'onload', 'onmousedown', 'onmousemove', 'onmouseout', 'onmouseover', 'onmouseup', 'requiredExtensions', 'requiredFeatures', 'style', 'systemLanguage', 'transform', 'x1', 'x2', 'xml:base', 'xml:lang', 'xml:space', 'y1', 'y2'],
    linearGradient: ['class', 'externalResourcesRequired', 'gradientTransform', 'gradientUnits', 'id', 'spreadMethod', 'style', 'x1', 'x2', 'xlink:arcrole', 'xlink:href', 'xlink:role', 'xlink:title', 'xlink:type', 'xml:base', 'xml:lang', 'xml:space', 'y1', 'y2'],
    marker: ['class', 'externalResourcesRequired', 'id', 'markerHeight', 'markerUnits', 'markerWidth', 'orient', 'preserveAspectRatio', 'refX', 'refY', 'style', 'viewBox', 'xml:base', 'xml:lang', 'xml:space'],
    mask: ['class', 'externalResourcesRequired', 'height', 'id', 'maskContentUnits', 'maskUnits', 'requiredExtensions', 'requiredFeatures', 'style', 'systemLanguage', 'width', 'x', 'xml:base', 'xml:lang', 'xml:space', 'y'],
    metadata: ['id', 'xml:base', 'xml:lang', 'xml:space'],
    'missing-glyph': ['class', 'd', 'horiz-adv-x', 'id', 'style', 'vert-adv-y', 'vert-origin-x', 'vert-origin-y', 'xml:base', 'xml:lang', 'xml:space'],
    mpath: ['externalResourcesRequired', 'id', 'xlink:actuate', 'xlink:arcrole', 'xlink:href', 'xlink:role', 'xlink:show', 'xlink:title', 'xlink:type', 'xml:base', 'xml:lang', 'xml:space'],
    path: ['class', 'd', 'externalResourcesRequired', 'id', 'onactivate', 'onclick', 'onfocusin', 'onfocusout', 'onload', 'onmousedown', 'onmousemove', 'onmouseout', 'onmouseover', 'onmouseup', 'pathLength', 'requiredExtensions', 'requiredFeatures', 'style', 'systemLanguage', 'transform', 'xml:base', 'xml:lang', 'xml:space'],
    pattern: ['class', 'externalResourcesRequired', 'height', 'id', 'patternContentUnits', 'patternTransform', 'patternUnits', 'preserveAspectRatio', 'requiredExtensions', 'requiredFeatures', 'style', 'systemLanguage', 'viewBox', 'width', 'x', 'xlink:actuate', 'xlink:arcrole', 'xlink:href', 'xlink:role', 'xlink:show', 'xlink:title', 'xlink:type', 'xml:base', 'xml:lang', 'xml:space', 'y'],
    polygon: ['class', 'externalResourcesRequired', 'id', 'onactivate', 'onclick', 'onfocusin', 'onfocusout', 'onload', 'onmousedown', 'onmousemove', 'onmouseout', 'onmouseover', 'onmouseup', 'points', 'requiredExtensions', 'requiredFeatures', 'style', 'systemLanguage', 'transform', 'xml:base', 'xml:lang', 'xml:space'],
    polyline: ['class', 'externalResourcesRequired', 'id', 'onactivate', 'onclick', 'onfocusin', 'onfocusout', 'onload', 'onmousedown', 'onmousemove', 'onmouseout', 'onmouseover', 'onmouseup', 'points', 'requiredExtensions', 'requiredFeatures', 'style', 'systemLanguage', 'transform', 'xml:base', 'xml:lang', 'xml:space'],
    radialGradient: ['class', 'cx', 'cy', 'externalResourcesRequired', 'fx', 'fy', 'gradientTransform', 'gradientUnits', 'id', 'r', 'spreadMethod', 'style', 'xlink:arcrole', 'xlink:href', 'xlink:role', 'xlink:title', 'xlink:type', 'xml:base', 'xml:lang', 'xml:space'],
    rect: ['class', 'externalResourcesRequired', 'height', 'id', 'onactivate', 'onclick', 'onfocusin', 'onfocusout', 'onload', 'onmousedown', 'onmousemove', 'onmouseout', 'onmouseover', 'onmouseup', 'requiredExtensions', 'requiredFeatures', 'rx', 'ry', 'style', 'systemLanguage', 'transform', 'width', 'x', 'xml:base', 'xml:lang', 'xml:space', 'y'],
    script: ['externalResourcesRequired', 'id', 'type', 'xlink:actuate', 'xlink:arcrole', 'xlink:href', 'xlink:role', 'xlink:show', 'xlink:title', 'xlink:type', 'xml:base', 'xml:lang', 'xml:space'],
    set: ['attributeName', 'attributeType', 'begin', 'dur', 'end', 'externalResourcesRequired', 'fill', 'id', 'max', 'min', 'onbegin', 'onend', 'onload', 'onrepeat', 'repeatCount', 'repeatDur', 'requiredExtensions', 'requiredFeatures', 'restart', 'systemLanguage', 'to', 'xlink:actuate', 'xlink:arcrole', 'xlink:href', 'xlink:role', 'xlink:show', 'xlink:title', 'xlink:type', 'xml:base', 'xml:lang', 'xml:space'],
    stop: ['class', 'id', 'offset', 'style', 'xml:base', 'xml:lang', 'xml:space'],
    style: ['id', 'media', 'title', 'type', 'xml:base', 'xml:lang', 'xml:space'],
    svg: ['baseProfile', 'class', 'contentScriptType', 'contentStyleType', 'externalResourcesRequired', 'height', 'id', 'onabort', 'onactivate', 'onclick', 'onerror', 'onfocusin', 'onfocusout', 'onload', 'onmousedown', 'onmousemove', 'onmouseout', 'onmouseover', 'onmouseup', 'onresize', 'onscroll', 'onunload', 'onzoom', 'preserveAspectRatio', 'requiredExtensions', 'requiredFeatures', 'style', 'systemLanguage', 'version', 'viewBox', 'width', 'x', 'xml:base', 'xml:lang', 'xml:space', 'y', 'zoomAndPan'],
    switch: ['class', 'externalResourcesRequired', 'id', 'onactivate', 'onclick', 'onfocusin', 'onfocusout', 'onload', 'onmousedown', 'onmousemove', 'onmouseout', 'onmouseover', 'onmouseup', 'requiredExtensions', 'requiredFeatures', 'style', 'systemLanguage', 'transform', 'xml:base', 'xml:lang', 'xml:space'],
    symbol: ['class', 'externalResourcesRequired', 'id', 'onactivate', 'onclick', 'onfocusin', 'onfocusout', 'onload', 'onmousedown', 'onmousemove', 'onmouseout', 'onmouseover', 'onmouseup', 'preserveAspectRatio', 'style', 'viewBox', 'xml:base', 'xml:lang', 'xml:space'],
    text: ['class', 'dx', 'dy', 'externalResourcesRequired', 'id', 'lengthAdjust', 'onactivate', 'onclick', 'onfocusin', 'onfocusout', 'onload', 'onmousedown', 'onmousemove', 'onmouseout', 'onmouseover', 'onmouseup', 'requiredExtensions', 'requiredFeatures', 'rotate', 'style', 'systemLanguage', 'textLength', 'transform', 'x', 'xml:base', 'xml:lang', 'xml:space', 'y'],
    textPath: ['class', 'externalResourcesRequired', 'id', 'lengthAdjust', 'method', 'onactivate', 'onclick', 'onfocusin', 'onfocusout', 'onload', 'onmousedown', 'onmousemove', 'onmouseout', 'onmouseover', 'onmouseup', 'requiredExtensions', 'requiredFeatures', 'spacing', 'startOffset', 'style', 'systemLanguage', 'textLength', 'xlink:arcrole', 'xlink:href', 'xlink:role', 'xlink:title', 'xlink:type', 'xml:base', 'xml:lang', 'xml:space'],
    title: ['class', 'id', 'style', 'xml:base', 'xml:lang', 'xml:space'],
    tref: ['class', 'dx', 'dy', 'externalResourcesRequired', 'id', 'lengthAdjust', 'onactivate', 'onclick', 'onfocusin', 'onfocusout', 'onload', 'onmousedown', 'onmousemove', 'onmouseout', 'onmouseover', 'onmouseup', 'requiredExtensions', 'requiredFeatures', 'rotate', 'style', 'systemLanguage', 'textLength', 'x', 'xlink:arcrole', 'xlink:href', 'xlink:role', 'xlink:title', 'xlink:type', 'xml:base', 'xml:lang', 'xml:space', 'y'],
    tspan: ['class', 'dx', 'dy', 'externalResourcesRequired', 'id', 'lengthAdjust', 'onactivate', 'onclick', 'onfocusin', 'onfocusout', 'onload', 'onmousedown', 'onmousemove', 'onmouseout', 'onmouseover', 'onmouseup', 'requiredExtensions', 'requiredFeatures', 'rotate', 'style', 'systemLanguage', 'textLength', 'x', 'xml:base', 'xml:lang', 'xml:space', 'y'],
    use: ['class', 'externalResourcesRequired', 'height', 'id', 'onactivate', 'onclick', 'onfocusin', 'onfocusout', 'onload', 'onmousedown', 'onmousemove', 'onmouseout', 'onmouseover', 'onmouseup', 'requiredExtensions', 'requiredFeatures', 'style', 'systemLanguage', 'transform', 'width', 'x', 'xlink:actuate', 'xlink:arcrole', 'xlink:href', 'xlink:role', 'xlink:show', 'xlink:title', 'xlink:type', 'xml:base', 'xml:lang', 'xml:space', 'y'],
    view: ['externalResourcesRequired', 'id', 'preserveAspectRatio', 'viewBox', 'viewTarget', 'xml:base', 'xml:lang', 'xml:space', 'zoomAndPan'],
    vkern: ['g1', 'g2', 'id', 'k', 'u1', 'u2', 'xml:base', 'xml:lang', 'xml:space']
  };


  svgPresentationElements = {
    'a': true,
    'altGlyph': true,
    'animate': true,
    'animateColor': true,
    'circle': true,
    'clipPath': true,
    'defs': true,
    'ellipse': true,
    'feBlend': true,
    'feColorMatrix': true,
    'feComponentTransfer': true,
    'feComposite': true,
    'feConvolveMatrix': true,
    'feDiffuseLighting': true,
    'feDisplacementMap': true,
    'feFlood': true,
    'feGaussianBlur': true,
    'feImage': true,
    'feMerge': true,
    'feMorphology': true,
    'feOffset': true,
    'feSpecularLighting': true,
    'feTile': true,
    'feTurbulence': true,
    'filter': true,
    'font': true,
    'foreignObject': true,
    'g': true,
    'glyph': true,
    'glyphRef': true,
    'image': true,
    'line': true,
    'linearGradient': true,
    'marker': true,
    'mask': true,
    'missing-glyph': true,
    'path': true,
    'pattern': true,
    'polygon': true,
    'polyline': true,
    'radialGradient': true,
    'rect': true,
    'stop': true,
    'svg': true,
    'switch': true,
    'symbol': true,
    'text': true,
    'textPath': true,
    'tref': true,
    'tspan': true,
    'use': true
  };

  svgPresentationAttributes = {
    'alignment-baseline': true,
    'baseline-shift': true,
    'clip-path': true,
    'clip-rule': true,
    'clip': true,
    'color-interpolation-filters': true,
    'color-interpolation': true,
    'color-profile': true,
    'color-rendering': true,
    'color': true,
    'cursor': true,
    'direction': true,
    'display': true,
    'dominant-baseline': true,
    'enable-background': true,
    'fill-opacity': true,
    'fill-rule': true,
    'fill': true,
    'filter': true,
    'flood-color': true,
    'flood-opacity': true,
    'font-family': true,
    'font-size-adjust': true,
    'font-size': true,
    'font-stretch': true,
    'font-style': true,
    'font-variant': true,
    'font-weight': true,
    'glyph-orientation-horizontal': true,
    'glyph-orientation-vertical': true,
    'image-rendering': true,
    'kerning': true,
    'letter-spacing': true,
    'lighting-color': true,
    'marker-end': true,
    'marker-mid': true,
    'marker-start': true,
    'mask': true,
    'opacity': true,
    'overflow': true,
    'pointer-events': true,
    'shape-rendering': true,
    'stop-color': true,
    'stop-opacity': true,
    'stroke-dasharray': true,
    'stroke-dashoffset': true,
    'stroke-linecap': true,
    'stroke-linejoin': true,
    'stroke-miterlimit': true,
    'stroke-opacity': true,
    'stroke-width': true,
    'stroke': true,
    'text-anchor': true,
    'text-decoration': true,
    'text-rendering': true,
    'unicode-bidi': true,
    'visibility': true,
    'word-spacing': true,
    'writing-mode': true
  };

  var createElement = function createElement(html) {
    var div = __WEBPACK_IMPORTED_MODULE_1_aurelia_pal__["c" /* DOM */].createElement('div');
    div.innerHTML = html;
    return div.firstChild;
  };

  svgAnalyzer = function () {
    function SVGAnalyzer() {
      

      if (createElement('<svg><altGlyph /></svg>').firstElementChild.nodeName === 'altglyph' && elements.altGlyph) {
        elements.altglyph = elements.altGlyph;
        delete elements.altGlyph;
        elements.altglyphdef = elements.altGlyphDef;
        delete elements.altGlyphDef;
        elements.altglyphitem = elements.altGlyphItem;
        delete elements.altGlyphItem;
        elements.glyphref = elements.glyphRef;
        delete elements.glyphRef;
      }
    }

    SVGAnalyzer.prototype.isStandardSvgAttribute = function isStandardSvgAttribute(nodeName, attributeName) {
      return presentationElements[nodeName] && presentationAttributes[attributeName] || elements[nodeName] && elements[nodeName].indexOf(attributeName) !== -1;
    };

    return SVGAnalyzer;
  }();
}

var elements = svgElements;
var presentationElements = svgPresentationElements;
var presentationAttributes = svgPresentationAttributes;
var SVGAnalyzer = svgAnalyzer || function () {
  function _class11() {
    
  }

  _class11.prototype.isStandardSvgAttribute = function isStandardSvgAttribute() {
    return false;
  };

  return _class11;
}();

var ObserverLocator = (_temp = _class12 = function () {
  function ObserverLocator(taskQueue, eventManager, dirtyChecker, svgAnalyzer, parser) {
    

    this.taskQueue = taskQueue;
    this.eventManager = eventManager;
    this.dirtyChecker = dirtyChecker;
    this.svgAnalyzer = svgAnalyzer;
    this.parser = parser;

    this.adapters = [];
    this.logger = __WEBPACK_IMPORTED_MODULE_0_aurelia_logging__["getLogger"]('observer-locator');
  }

  ObserverLocator.prototype.getObserver = function getObserver(obj, propertyName) {
    var observersLookup = obj.__observers__;
    var observer = void 0;

    if (observersLookup && propertyName in observersLookup) {
      return observersLookup[propertyName];
    }

    observer = this.createPropertyObserver(obj, propertyName);

    if (!observer.doNotCache) {
      if (observersLookup === undefined) {
        observersLookup = this.getOrCreateObserversLookup(obj);
      }

      observersLookup[propertyName] = observer;
    }

    return observer;
  };

  ObserverLocator.prototype.getOrCreateObserversLookup = function getOrCreateObserversLookup(obj) {
    return obj.__observers__ || this.createObserversLookup(obj);
  };

  ObserverLocator.prototype.createObserversLookup = function createObserversLookup(obj) {
    var value = {};

    if (!Reflect.defineProperty(obj, '__observers__', {
      enumerable: false,
      configurable: false,
      writable: false,
      value: value
    })) {
      this.logger.warn('Cannot add observers to object', obj);
    }

    return value;
  };

  ObserverLocator.prototype.addAdapter = function addAdapter(adapter) {
    this.adapters.push(adapter);
  };

  ObserverLocator.prototype.getAdapterObserver = function getAdapterObserver(obj, propertyName, descriptor) {
    for (var i = 0, ii = this.adapters.length; i < ii; i++) {
      var adapter = this.adapters[i];
      var observer = adapter.getObserver(obj, propertyName, descriptor);
      if (observer) {
        return observer;
      }
    }
    return null;
  };

  ObserverLocator.prototype.createPropertyObserver = function createPropertyObserver(obj, propertyName) {
    var descriptor = void 0;
    var handler = void 0;
    var xlinkResult = void 0;

    if (!(obj instanceof Object)) {
      return new PrimitiveObserver(obj, propertyName);
    }

    if (obj instanceof __WEBPACK_IMPORTED_MODULE_1_aurelia_pal__["c" /* DOM */].Element) {
      if (propertyName === 'class') {
        return new ClassObserver(obj);
      }
      if (propertyName === 'style' || propertyName === 'css') {
        return new StyleObserver(obj, propertyName);
      }
      handler = this.eventManager.getElementHandler(obj, propertyName);
      if (propertyName === 'value' && obj.tagName.toLowerCase() === 'select') {
        return new SelectValueObserver(obj, handler, this);
      }
      if (propertyName === 'checked' && obj.tagName.toLowerCase() === 'input') {
        return new CheckedObserver(obj, handler, this);
      }
      if (handler) {
        return new ValueAttributeObserver(obj, propertyName, handler);
      }
      xlinkResult = /^xlink:(.+)$/.exec(propertyName);
      if (xlinkResult) {
        return new XLinkAttributeObserver(obj, propertyName, xlinkResult[1]);
      }
      if (propertyName === 'role' && (obj instanceof __WEBPACK_IMPORTED_MODULE_1_aurelia_pal__["c" /* DOM */].Element || obj instanceof __WEBPACK_IMPORTED_MODULE_1_aurelia_pal__["c" /* DOM */].SVGElement) || /^\w+:|^data-|^aria-/.test(propertyName) || obj instanceof __WEBPACK_IMPORTED_MODULE_1_aurelia_pal__["c" /* DOM */].SVGElement && this.svgAnalyzer.isStandardSvgAttribute(obj.nodeName, propertyName)) {
        return new DataAttributeObserver(obj, propertyName);
      }
    }

    descriptor = Object.getPropertyDescriptor(obj, propertyName);

    if (hasDeclaredDependencies(descriptor)) {
      return createComputedObserver(obj, propertyName, descriptor, this);
    }

    if (descriptor) {
      var existingGetterOrSetter = descriptor.get || descriptor.set;
      if (existingGetterOrSetter) {
        if (existingGetterOrSetter.getObserver) {
          return existingGetterOrSetter.getObserver(obj);
        }

        var adapterObserver = this.getAdapterObserver(obj, propertyName, descriptor);
        if (adapterObserver) {
          return adapterObserver;
        }
        return new DirtyCheckProperty(this.dirtyChecker, obj, propertyName);
      }
    }

    if (obj instanceof Array) {
      if (propertyName === 'length') {
        return this.getArrayObserver(obj).getLengthObserver();
      }

      return new DirtyCheckProperty(this.dirtyChecker, obj, propertyName);
    } else if (obj instanceof Map) {
      if (propertyName === 'size') {
        return this.getMapObserver(obj).getLengthObserver();
      }

      return new DirtyCheckProperty(this.dirtyChecker, obj, propertyName);
    } else if (obj instanceof Set) {
      if (propertyName === 'size') {
        return this.getSetObserver(obj).getLengthObserver();
      }

      return new DirtyCheckProperty(this.dirtyChecker, obj, propertyName);
    }

    return new SetterObserver(this.taskQueue, obj, propertyName);
  };

  ObserverLocator.prototype.getAccessor = function getAccessor(obj, propertyName) {
    if (obj instanceof __WEBPACK_IMPORTED_MODULE_1_aurelia_pal__["c" /* DOM */].Element) {
      if (propertyName === 'class' || propertyName === 'style' || propertyName === 'css' || propertyName === 'value' && (obj.tagName.toLowerCase() === 'input' || obj.tagName.toLowerCase() === 'select') || propertyName === 'checked' && obj.tagName.toLowerCase() === 'input' || propertyName === 'model' && obj.tagName.toLowerCase() === 'input' || /^xlink:.+$/.exec(propertyName)) {
        return this.getObserver(obj, propertyName);
      }
      if (/^\w+:|^data-|^aria-/.test(propertyName) || obj instanceof __WEBPACK_IMPORTED_MODULE_1_aurelia_pal__["c" /* DOM */].SVGElement && this.svgAnalyzer.isStandardSvgAttribute(obj.nodeName, propertyName) || obj.tagName.toLowerCase() === 'img' && propertyName === 'src' || obj.tagName.toLowerCase() === 'a' && propertyName === 'href') {
        return dataAttributeAccessor;
      }
    }
    return propertyAccessor;
  };

  ObserverLocator.prototype.getArrayObserver = function getArrayObserver(array) {
    return _getArrayObserver(this.taskQueue, array);
  };

  ObserverLocator.prototype.getMapObserver = function getMapObserver(map) {
    return _getMapObserver(this.taskQueue, map);
  };

  ObserverLocator.prototype.getSetObserver = function getSetObserver(set) {
    return _getSetObserver(this.taskQueue, set);
  };

  return ObserverLocator;
}(), _class12.inject = [__WEBPACK_IMPORTED_MODULE_2_aurelia_task_queue__["a" /* TaskQueue */], EventManager, DirtyChecker, SVGAnalyzer, Parser], _temp);

var ObjectObservationAdapter = function () {
  function ObjectObservationAdapter() {
    
  }

  ObjectObservationAdapter.prototype.getObserver = function getObserver(object, propertyName, descriptor) {
    throw new Error('BindingAdapters must implement getObserver(object, propertyName).');
  };

  return ObjectObservationAdapter;
}();

var BindingExpression = function () {
  function BindingExpression(observerLocator, targetProperty, sourceExpression, mode, lookupFunctions, attribute) {
    

    this.observerLocator = observerLocator;
    this.targetProperty = targetProperty;
    this.sourceExpression = sourceExpression;
    this.mode = mode;
    this.lookupFunctions = lookupFunctions;
    this.attribute = attribute;
    this.discrete = false;
  }

  BindingExpression.prototype.createBinding = function createBinding(target) {
    return new Binding(this.observerLocator, this.sourceExpression, target, this.targetProperty, this.mode, this.lookupFunctions);
  };

  return BindingExpression;
}();

var Binding = (_dec10 = connectable(), _dec10(_class13 = function () {
  function Binding(observerLocator, sourceExpression, target, targetProperty, mode, lookupFunctions) {
    

    this.observerLocator = observerLocator;
    this.sourceExpression = sourceExpression;
    this.target = target;
    this.targetProperty = targetProperty;
    this.mode = mode;
    this.lookupFunctions = lookupFunctions;
  }

  Binding.prototype.updateTarget = function updateTarget(value) {
    this.targetObserver.setValue(value, this.target, this.targetProperty);
  };

  Binding.prototype.updateSource = function updateSource(value) {
    this.sourceExpression.assign(this.source, value, this.lookupFunctions);
  };

  Binding.prototype.call = function call(context, newValue, oldValue) {
    if (!this.isBound) {
      return;
    }
    if (context === sourceContext) {
      oldValue = this.targetObserver.getValue(this.target, this.targetProperty);
      newValue = this.sourceExpression.evaluate(this.source, this.lookupFunctions);
      if (newValue !== oldValue) {
        this.updateTarget(newValue);
      }
      if (this.mode !== bindingMode.oneTime) {
        this._version++;
        this.sourceExpression.connect(this, this.source);
        this.unobserve(false);
      }
      return;
    }
    if (context === targetContext) {
      if (newValue !== this.sourceExpression.evaluate(this.source, this.lookupFunctions)) {
        this.updateSource(newValue);
      }
      return;
    }
    throw new Error('Unexpected call context ' + context);
  };

  Binding.prototype.bind = function bind(source) {
    if (this.isBound) {
      if (this.source === source) {
        return;
      }
      this.unbind();
    }
    this.isBound = true;
    this.source = source;

    if (this.sourceExpression.bind) {
      this.sourceExpression.bind(this, source, this.lookupFunctions);
    }

    var mode = this.mode;
    if (!this.targetObserver) {
      var method = mode === bindingMode.twoWay || mode === bindingMode.fromView ? 'getObserver' : 'getAccessor';
      this.targetObserver = this.observerLocator[method](this.target, this.targetProperty);
    }

    if ('bind' in this.targetObserver) {
      this.targetObserver.bind();
    }
    if (this.mode !== bindingMode.fromView) {
      var value = this.sourceExpression.evaluate(source, this.lookupFunctions);
      this.updateTarget(value);
    }

    if (mode === bindingMode.oneTime) {
      return;
    } else if (mode === bindingMode.toView) {
      enqueueBindingConnect(this);
    } else if (mode === bindingMode.twoWay) {
      this.sourceExpression.connect(this, source);
      this.targetObserver.subscribe(targetContext, this);
    } else if (mode === bindingMode.fromView) {
      this.targetObserver.subscribe(targetContext, this);
    }
  };

  Binding.prototype.unbind = function unbind() {
    if (!this.isBound) {
      return;
    }
    this.isBound = false;
    if (this.sourceExpression.unbind) {
      this.sourceExpression.unbind(this, this.source);
    }
    this.source = null;
    if ('unbind' in this.targetObserver) {
      this.targetObserver.unbind();
    }
    if (this.targetObserver.unsubscribe) {
      this.targetObserver.unsubscribe(targetContext, this);
    }
    this.unobserve(true);
  };

  Binding.prototype.connect = function connect(evaluate) {
    if (!this.isBound) {
      return;
    }
    if (evaluate) {
      var value = this.sourceExpression.evaluate(this.source, this.lookupFunctions);
      this.updateTarget(value);
    }
    this.sourceExpression.connect(this, this.source);
  };

  return Binding;
}()) || _class13);

var CallExpression = function () {
  function CallExpression(observerLocator, targetProperty, sourceExpression, lookupFunctions) {
    

    this.observerLocator = observerLocator;
    this.targetProperty = targetProperty;
    this.sourceExpression = sourceExpression;
    this.lookupFunctions = lookupFunctions;
  }

  CallExpression.prototype.createBinding = function createBinding(target) {
    return new Call(this.observerLocator, this.sourceExpression, target, this.targetProperty, this.lookupFunctions);
  };

  return CallExpression;
}();

var Call = function () {
  function Call(observerLocator, sourceExpression, target, targetProperty, lookupFunctions) {
    

    this.sourceExpression = sourceExpression;
    this.target = target;
    this.targetProperty = observerLocator.getObserver(target, targetProperty);
    this.lookupFunctions = lookupFunctions;
  }

  Call.prototype.callSource = function callSource($event) {
    var overrideContext = this.source.overrideContext;
    Object.assign(overrideContext, $event);
    overrideContext.$event = $event;
    var mustEvaluate = true;
    var result = this.sourceExpression.evaluate(this.source, this.lookupFunctions, mustEvaluate);
    delete overrideContext.$event;
    for (var prop in $event) {
      delete overrideContext[prop];
    }
    return result;
  };

  Call.prototype.bind = function bind(source) {
    var _this26 = this;

    if (this.isBound) {
      if (this.source === source) {
        return;
      }
      this.unbind();
    }
    this.isBound = true;
    this.source = source;

    if (this.sourceExpression.bind) {
      this.sourceExpression.bind(this, source, this.lookupFunctions);
    }
    this.targetProperty.setValue(function ($event) {
      return _this26.callSource($event);
    });
  };

  Call.prototype.unbind = function unbind() {
    if (!this.isBound) {
      return;
    }
    this.isBound = false;
    if (this.sourceExpression.unbind) {
      this.sourceExpression.unbind(this, this.source);
    }
    this.source = null;
    this.targetProperty.setValue(null);
  };

  return Call;
}();

var ValueConverterResource = function () {
  function ValueConverterResource(name) {
    

    this.name = name;
  }

  ValueConverterResource.convention = function convention(name) {
    if (name.endsWith('ValueConverter')) {
      return new ValueConverterResource(camelCase(name.substring(0, name.length - 14)));
    }
  };

  ValueConverterResource.prototype.initialize = function initialize(container, target) {
    this.instance = container.get(target);
  };

  ValueConverterResource.prototype.register = function register(registry, name) {
    registry.registerValueConverter(name || this.name, this.instance);
  };

  ValueConverterResource.prototype.load = function load(container, target) {};

  return ValueConverterResource;
}();

function valueConverter(nameOrTarget) {
  if (nameOrTarget === undefined || typeof nameOrTarget === 'string') {
    return function (target) {
      __WEBPACK_IMPORTED_MODULE_3_aurelia_metadata__["a" /* metadata */].define(__WEBPACK_IMPORTED_MODULE_3_aurelia_metadata__["a" /* metadata */].resource, new ValueConverterResource(nameOrTarget), target);
    };
  }

  __WEBPACK_IMPORTED_MODULE_3_aurelia_metadata__["a" /* metadata */].define(__WEBPACK_IMPORTED_MODULE_3_aurelia_metadata__["a" /* metadata */].resource, new ValueConverterResource(), nameOrTarget);
}

var BindingBehaviorResource = function () {
  function BindingBehaviorResource(name) {
    

    this.name = name;
  }

  BindingBehaviorResource.convention = function convention(name) {
    if (name.endsWith('BindingBehavior')) {
      return new BindingBehaviorResource(camelCase(name.substring(0, name.length - 15)));
    }
  };

  BindingBehaviorResource.prototype.initialize = function initialize(container, target) {
    this.instance = container.get(target);
  };

  BindingBehaviorResource.prototype.register = function register(registry, name) {
    registry.registerBindingBehavior(name || this.name, this.instance);
  };

  BindingBehaviorResource.prototype.load = function load(container, target) {};

  return BindingBehaviorResource;
}();

function bindingBehavior(nameOrTarget) {
  if (nameOrTarget === undefined || typeof nameOrTarget === 'string') {
    return function (target) {
      __WEBPACK_IMPORTED_MODULE_3_aurelia_metadata__["a" /* metadata */].define(__WEBPACK_IMPORTED_MODULE_3_aurelia_metadata__["a" /* metadata */].resource, new BindingBehaviorResource(nameOrTarget), target);
    };
  }

  __WEBPACK_IMPORTED_MODULE_3_aurelia_metadata__["a" /* metadata */].define(__WEBPACK_IMPORTED_MODULE_3_aurelia_metadata__["a" /* metadata */].resource, new BindingBehaviorResource(), nameOrTarget);
}

var ListenerExpression = function () {
  function ListenerExpression(eventManager, targetEvent, sourceExpression, delegationStrategy, preventDefault, lookupFunctions) {
    

    this.eventManager = eventManager;
    this.targetEvent = targetEvent;
    this.sourceExpression = sourceExpression;
    this.delegationStrategy = delegationStrategy;
    this.discrete = true;
    this.preventDefault = preventDefault;
    this.lookupFunctions = lookupFunctions;
  }

  ListenerExpression.prototype.createBinding = function createBinding(target) {
    return new Listener(this.eventManager, this.targetEvent, this.delegationStrategy, this.sourceExpression, target, this.preventDefault, this.lookupFunctions);
  };

  return ListenerExpression;
}();

var Listener = function () {
  function Listener(eventManager, targetEvent, delegationStrategy, sourceExpression, target, preventDefault, lookupFunctions) {
    

    this.eventManager = eventManager;
    this.targetEvent = targetEvent;
    this.delegationStrategy = delegationStrategy;
    this.sourceExpression = sourceExpression;
    this.target = target;
    this.preventDefault = preventDefault;
    this.lookupFunctions = lookupFunctions;
  }

  Listener.prototype.callSource = function callSource(event) {
    var overrideContext = this.source.overrideContext;
    overrideContext.$event = event;
    var mustEvaluate = true;
    var result = this.sourceExpression.evaluate(this.source, this.lookupFunctions, mustEvaluate);
    delete overrideContext.$event;
    if (result !== true && this.preventDefault) {
      event.preventDefault();
    }
    return result;
  };

  Listener.prototype.handleEvent = function handleEvent(event) {
    this.callSource(event);
  };

  Listener.prototype.bind = function bind(source) {
    if (this.isBound) {
      if (this.source === source) {
        return;
      }
      this.unbind();
    }
    this.isBound = true;
    this.source = source;

    if (this.sourceExpression.bind) {
      this.sourceExpression.bind(this, source, this.lookupFunctions);
    }
    this._handler = this.eventManager.addEventListener(this.target, this.targetEvent, this, this.delegationStrategy, true);
  };

  Listener.prototype.unbind = function unbind() {
    if (!this.isBound) {
      return;
    }
    this.isBound = false;
    if (this.sourceExpression.unbind) {
      this.sourceExpression.unbind(this, this.source);
    }
    this.source = null;
    this._handler.dispose();
    this._handler = null;
  };

  return Listener;
}();

function getAU(element) {
  var au = element.au;

  if (au === undefined) {
    throw new Error('No Aurelia APIs are defined for the element: "' + element.tagName + '".');
  }

  return au;
}

var NameExpression = function () {
  function NameExpression(sourceExpression, apiName, lookupFunctions) {
    

    this.sourceExpression = sourceExpression;
    this.apiName = apiName;
    this.lookupFunctions = lookupFunctions;
    this.discrete = true;
  }

  NameExpression.prototype.createBinding = function createBinding(target) {
    return new NameBinder(this.sourceExpression, NameExpression.locateAPI(target, this.apiName), this.lookupFunctions);
  };

  NameExpression.locateAPI = function locateAPI(element, apiName) {
    switch (apiName) {
      case 'element':
        return element;
      case 'controller':
        return getAU(element).controller;
      case 'view-model':
        return getAU(element).controller.viewModel;
      case 'view':
        return getAU(element).controller.view;
      default:
        var target = getAU(element)[apiName];

        if (target === undefined) {
          throw new Error('Attempted to reference "' + apiName + '", but it was not found amongst the target\'s API.');
        }

        return target.viewModel;
    }
  };

  return NameExpression;
}();

var NameBinder = function () {
  function NameBinder(sourceExpression, target, lookupFunctions) {
    

    this.sourceExpression = sourceExpression;
    this.target = target;
    this.lookupFunctions = lookupFunctions;
  }

  NameBinder.prototype.bind = function bind(source) {
    if (this.isBound) {
      if (this.source === source) {
        return;
      }
      this.unbind();
    }
    this.isBound = true;
    this.source = source;
    if (this.sourceExpression.bind) {
      this.sourceExpression.bind(this, source, this.lookupFunctions);
    }
    this.sourceExpression.assign(this.source, this.target, this.lookupFunctions);
  };

  NameBinder.prototype.unbind = function unbind() {
    if (!this.isBound) {
      return;
    }
    this.isBound = false;
    if (this.sourceExpression.evaluate(this.source, this.lookupFunctions) === this.target) {
      this.sourceExpression.assign(this.source, null, this.lookupFunctions);
    }
    if (this.sourceExpression.unbind) {
      this.sourceExpression.unbind(this, this.source);
    }
    this.source = null;
  };

  return NameBinder;
}();

var LookupFunctions = {
  bindingBehaviors: function bindingBehaviors(name) {
    return null;
  },
  valueConverters: function valueConverters(name) {
    return null;
  }
};

var BindingEngine = (_temp2 = _class14 = function () {
  function BindingEngine(observerLocator, parser) {
    

    this.observerLocator = observerLocator;
    this.parser = parser;
  }

  BindingEngine.prototype.createBindingExpression = function createBindingExpression(targetProperty, sourceExpression) {
    var mode = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : bindingMode.toView;
    var lookupFunctions = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : LookupFunctions;

    return new BindingExpression(this.observerLocator, targetProperty, this.parser.parse(sourceExpression), mode, lookupFunctions);
  };

  BindingEngine.prototype.propertyObserver = function propertyObserver(obj, propertyName) {
    var _this27 = this;

    return {
      subscribe: function subscribe(callback) {
        var observer = _this27.observerLocator.getObserver(obj, propertyName);
        observer.subscribe(callback);
        return {
          dispose: function dispose() {
            return observer.unsubscribe(callback);
          }
        };
      }
    };
  };

  BindingEngine.prototype.collectionObserver = function collectionObserver(collection) {
    var _this28 = this;

    return {
      subscribe: function subscribe(callback) {
        var observer = void 0;
        if (collection instanceof Array) {
          observer = _this28.observerLocator.getArrayObserver(collection);
        } else if (collection instanceof Map) {
          observer = _this28.observerLocator.getMapObserver(collection);
        } else if (collection instanceof Set) {
          observer = _this28.observerLocator.getSetObserver(collection);
        } else {
          throw new Error('collection must be an instance of Array, Map or Set.');
        }
        observer.subscribe(callback);
        return {
          dispose: function dispose() {
            return observer.unsubscribe(callback);
          }
        };
      }
    };
  };

  BindingEngine.prototype.expressionObserver = function expressionObserver(bindingContext, expression) {
    var scope = { bindingContext: bindingContext, overrideContext: createOverrideContext(bindingContext) };
    return new ExpressionObserver(scope, this.parser.parse(expression), this.observerLocator, LookupFunctions);
  };

  BindingEngine.prototype.parseExpression = function parseExpression(expression) {
    return this.parser.parse(expression);
  };

  BindingEngine.prototype.registerAdapter = function registerAdapter(adapter) {
    this.observerLocator.addAdapter(adapter);
  };

  return BindingEngine;
}(), _class14.inject = [ObserverLocator, Parser], _temp2);

var setProto = Set.prototype;

function _getSetObserver(taskQueue, set) {
  return ModifySetObserver.for(taskQueue, set);
}

var ModifySetObserver = function (_ModifyCollectionObse3) {
  _inherits(ModifySetObserver, _ModifyCollectionObse3);

  function ModifySetObserver(taskQueue, set) {
    

    return _possibleConstructorReturn(this, _ModifyCollectionObse3.call(this, taskQueue, set));
  }

  ModifySetObserver.for = function _for(taskQueue, set) {
    if (!('__set_observer__' in set)) {
      Reflect.defineProperty(set, '__set_observer__', {
        value: ModifySetObserver.create(taskQueue, set),
        enumerable: false, configurable: false
      });
    }
    return set.__set_observer__;
  };

  ModifySetObserver.create = function create(taskQueue, set) {
    var observer = new ModifySetObserver(taskQueue, set);

    var proto = setProto;
    if (proto.add !== set.add || proto.delete !== set.delete || proto.clear !== set.clear) {
      proto = {
        add: set.add,
        delete: set.delete,
        clear: set.clear
      };
    }

    set.add = function () {
      var type = 'add';
      var oldSize = set.size;
      var methodCallResult = proto.add.apply(set, arguments);
      var hasValue = set.size === oldSize;
      if (!hasValue) {
        observer.addChangeRecord({
          type: type,
          object: set,
          value: Array.from(set).pop()
        });
      }
      return methodCallResult;
    };

    set.delete = function () {
      var hasValue = set.has(arguments[0]);
      var methodCallResult = proto.delete.apply(set, arguments);
      if (hasValue) {
        observer.addChangeRecord({
          type: 'delete',
          object: set,
          value: arguments[0]
        });
      }
      return methodCallResult;
    };

    set.clear = function () {
      var methodCallResult = proto.clear.apply(set, arguments);
      observer.addChangeRecord({
        type: 'clear',
        object: set
      });
      return methodCallResult;
    };

    return observer;
  };

  return ModifySetObserver;
}(ModifyCollectionObserver);

function observable(targetOrConfig, key, descriptor) {
  function deco(target, key, descriptor, config) {
    var isClassDecorator = key === undefined;
    if (isClassDecorator) {
      target = target.prototype;
      key = typeof config === 'string' ? config : config.name;
    }

    var innerPropertyName = '_' + key;
    var innerPropertyDescriptor = {
      configurable: true,
      enumerable: false,
      writable: true
    };

    var callbackName = config && config.changeHandler || key + 'Changed';

    if (descriptor) {
      if (typeof descriptor.initializer === 'function') {
        innerPropertyDescriptor.value = descriptor.initializer();
      }
    } else {
      descriptor = {};
    }

    if (!('enumerable' in descriptor)) {
      descriptor.enumerable = true;
    }

    delete descriptor.value;
    delete descriptor.writable;
    delete descriptor.initializer;

    Reflect.defineProperty(target, innerPropertyName, innerPropertyDescriptor);

    descriptor.get = function () {
      return this[innerPropertyName];
    };
    descriptor.set = function (newValue) {
      var oldValue = this[innerPropertyName];
      if (newValue === oldValue) {
        return;
      }

      this[innerPropertyName] = newValue;
      Reflect.defineProperty(this, innerPropertyName, { enumerable: false });

      if (this[callbackName]) {
        this[callbackName](newValue, oldValue, key);
      }
    };

    descriptor.get.dependencies = [innerPropertyName];

    if (isClassDecorator) {
      Reflect.defineProperty(target, key, descriptor);
    } else {
      return descriptor;
    }
  }

  if (key === undefined) {
    return function (t, k, d) {
      return deco(t, k, d, targetOrConfig);
    };
  }
  return deco(targetOrConfig, key, descriptor);
}

var signals = {};

function connectBindingToSignal(binding, name) {
  if (!signals.hasOwnProperty(name)) {
    signals[name] = 0;
  }
  binding.observeProperty(signals, name);
}

function signalBindings(name) {
  if (signals.hasOwnProperty(name)) {
    signals[name]++;
  }
}

/***/ }),

/***/ 8:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return TaskQueue; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_aurelia_pal__ = __webpack_require__(0);
var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };





var stackSeparator = '\nEnqueued in TaskQueue by:\n';
var microStackSeparator = '\nEnqueued in MicroTaskQueue by:\n';

function makeRequestFlushFromMutationObserver(flush) {
  var observer = __WEBPACK_IMPORTED_MODULE_0_aurelia_pal__["c" /* DOM */].createMutationObserver(flush);
  var val = 'a';
  var node = __WEBPACK_IMPORTED_MODULE_0_aurelia_pal__["c" /* DOM */].createTextNode('a');
  var values = Object.create(null);
  values.a = 'b';
  values.b = 'a';
  observer.observe(node, { characterData: true });
  return function requestFlush() {
    node.data = val = values[val];
  };
}

function makeRequestFlushFromTimer(flush) {
  return function requestFlush() {
    var timeoutHandle = setTimeout(handleFlushTimer, 0);

    var intervalHandle = setInterval(handleFlushTimer, 50);
    function handleFlushTimer() {
      clearTimeout(timeoutHandle);
      clearInterval(intervalHandle);
      flush();
    }
  };
}

function onError(error, task, longStacks) {
  if (longStacks && task.stack && (typeof error === 'undefined' ? 'undefined' : _typeof(error)) === 'object' && error !== null) {
    error.stack = filterFlushStack(error.stack) + task.stack;
  }

  if ('onError' in task) {
    task.onError(error);
  } else {
    setTimeout(function () {
      throw error;
    }, 0);
  }
}

var TaskQueue = function () {
  function TaskQueue() {
    var _this = this;

    

    this.flushing = false;
    this.longStacks = false;

    this.microTaskQueue = [];
    this.microTaskQueueCapacity = 1024;
    this.taskQueue = [];

    if (__WEBPACK_IMPORTED_MODULE_0_aurelia_pal__["d" /* FEATURE */].mutationObserver) {
      this.requestFlushMicroTaskQueue = makeRequestFlushFromMutationObserver(function () {
        return _this.flushMicroTaskQueue();
      });
    } else {
      this.requestFlushMicroTaskQueue = makeRequestFlushFromTimer(function () {
        return _this.flushMicroTaskQueue();
      });
    }

    this.requestFlushTaskQueue = makeRequestFlushFromTimer(function () {
      return _this.flushTaskQueue();
    });
  }

  TaskQueue.prototype._flushQueue = function _flushQueue(queue, capacity) {
    var index = 0;
    var task = void 0;

    try {
      this.flushing = true;
      while (index < queue.length) {
        task = queue[index];
        if (this.longStacks) {
          this.stack = typeof task.stack === 'string' ? task.stack : undefined;
        }
        task.call();
        index++;

        if (index > capacity) {
          for (var scan = 0, newLength = queue.length - index; scan < newLength; scan++) {
            queue[scan] = queue[scan + index];
          }

          queue.length -= index;
          index = 0;
        }
      }
    } catch (error) {
      onError(error, task, this.longStacks);
    } finally {
      this.flushing = false;
    }
  };

  TaskQueue.prototype.queueMicroTask = function queueMicroTask(task) {
    if (this.microTaskQueue.length < 1) {
      this.requestFlushMicroTaskQueue();
    }

    if (this.longStacks) {
      task.stack = this.prepareQueueStack(microStackSeparator);
    }

    this.microTaskQueue.push(task);
  };

  TaskQueue.prototype.queueTask = function queueTask(task) {
    if (this.taskQueue.length < 1) {
      this.requestFlushTaskQueue();
    }

    if (this.longStacks) {
      task.stack = this.prepareQueueStack(stackSeparator);
    }

    this.taskQueue.push(task);
  };

  TaskQueue.prototype.flushTaskQueue = function flushTaskQueue() {
    var queue = this.taskQueue;
    this.taskQueue = [];
    this._flushQueue(queue, Number.MAX_VALUE);
  };

  TaskQueue.prototype.flushMicroTaskQueue = function flushMicroTaskQueue() {
    var queue = this.microTaskQueue;
    this._flushQueue(queue, this.microTaskQueueCapacity);
    queue.length = 0;
  };

  TaskQueue.prototype.prepareQueueStack = function prepareQueueStack(separator) {
    var stack = separator + filterQueueStack(captureStack());

    if (typeof this.stack === 'string') {
      stack = filterFlushStack(stack) + this.stack;
    }

    return stack;
  };

  return TaskQueue;
}();

function captureStack() {
  var error = new Error();

  if (error.stack) {
    return error.stack;
  }

  try {
    throw error;
  } catch (e) {
    return e.stack;
  }
}

function filterQueueStack(stack) {
  return stack.replace(/^[\s\S]*?\bqueue(Micro)?Task\b[^\n]*\n/, '');
}

function filterFlushStack(stack) {
  var index = stack.lastIndexOf('flushMicroTaskQueue');

  if (index < 0) {
    index = stack.lastIndexOf('flushTaskQueue');
    if (index < 0) {
      return stack;
    }
  }

  index = stack.lastIndexOf('\n', index);

  return index < 0 ? stack : stack.substr(0, index);
}

/***/ }),

/***/ 9:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export json */
/* unused harmony export retryStrategy */
/* unused harmony export RetryInterceptor */
/* unused harmony export HttpClientConfiguration */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return HttpClient; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_aurelia_pal__ = __webpack_require__(0);


function json(body, replacer) {
    return JSON.stringify((body !== undefined ? body : {}), replacer);
}

var retryStrategy = {
    fixed: 0,
    incremental: 1,
    exponential: 2,
    random: 3
};
var defaultRetryConfig = {
    maxRetries: 3,
    interval: 1000,
    strategy: retryStrategy.fixed
};
var RetryInterceptor = (function () {
    function RetryInterceptor(retryConfig) {
        this.retryConfig = Object.assign({}, defaultRetryConfig, retryConfig || {});
        if (this.retryConfig.strategy === retryStrategy.exponential &&
            this.retryConfig.interval <= 1000) {
            throw new Error('An interval less than or equal to 1 second is not allowed when using the exponential retry strategy');
        }
    }
    RetryInterceptor.prototype.request = function (request) {
        var $r = request;
        if (!$r.retryConfig) {
            $r.retryConfig = Object.assign({}, this.retryConfig);
            $r.retryConfig.counter = 0;
        }
        $r.retryConfig.requestClone = request.clone();
        return request;
    };
    RetryInterceptor.prototype.response = function (response, request) {
        delete request.retryConfig;
        return response;
    };
    RetryInterceptor.prototype.responseError = function (error, request, httpClient) {
        var retryConfig = request.retryConfig;
        var requestClone = retryConfig.requestClone;
        return Promise.resolve().then(function () {
            if (retryConfig.counter < retryConfig.maxRetries) {
                var result = retryConfig.doRetry ? retryConfig.doRetry(error, request) : true;
                return Promise.resolve(result).then(function (doRetry) {
                    if (doRetry) {
                        retryConfig.counter++;
                        return new Promise(function (resolve) { return __WEBPACK_IMPORTED_MODULE_0_aurelia_pal__["a" /* PLATFORM */].global.setTimeout(resolve, calculateDelay(retryConfig) || 0); })
                            .then(function () {
                            var newRequest = requestClone.clone();
                            if (typeof (retryConfig.beforeRetry) === 'function') {
                                return retryConfig.beforeRetry(newRequest, httpClient);
                            }
                            return newRequest;
                        })
                            .then(function (newRequest) {
                            return httpClient.fetch(Object.assign(newRequest, { retryConfig: retryConfig }));
                        });
                    }
                    delete request.retryConfig;
                    throw error;
                });
            }
            delete request.retryConfig;
            throw error;
        });
    };
    return RetryInterceptor;
}());
function calculateDelay(retryConfig) {
    var interval = retryConfig.interval, strategy = retryConfig.strategy, minRandomInterval = retryConfig.minRandomInterval, maxRandomInterval = retryConfig.maxRandomInterval, counter = retryConfig.counter;
    if (typeof (strategy) === 'function') {
        return retryConfig.strategy(counter);
    }
    switch (strategy) {
        case (retryStrategy.fixed):
            return retryStrategies[retryStrategy.fixed](interval);
        case (retryStrategy.incremental):
            return retryStrategies[retryStrategy.incremental](counter, interval);
        case (retryStrategy.exponential):
            return retryStrategies[retryStrategy.exponential](counter, interval);
        case (retryStrategy.random):
            return retryStrategies[retryStrategy.random](counter, interval, minRandomInterval, maxRandomInterval);
        default:
            throw new Error('Unrecognized retry strategy');
    }
}
var retryStrategies = [
    function (interval) { return interval; },
    function (retryCount, interval) { return interval * retryCount; },
    function (retryCount, interval) { return retryCount === 1 ? interval : Math.pow(interval, retryCount) / 1000; },
    function (retryCount, interval, minRandomInterval, maxRandomInterval) {
        if (minRandomInterval === void 0) { minRandomInterval = 0; }
        if (maxRandomInterval === void 0) { maxRandomInterval = 60000; }
        return Math.random() * (maxRandomInterval - minRandomInterval) + minRandomInterval;
    }
];

var HttpClientConfiguration = (function () {
    function HttpClientConfiguration() {
        this.baseUrl = '';
        this.defaults = {};
        this.interceptors = [];
    }
    HttpClientConfiguration.prototype.withBaseUrl = function (baseUrl) {
        this.baseUrl = baseUrl;
        return this;
    };
    HttpClientConfiguration.prototype.withDefaults = function (defaults) {
        this.defaults = defaults;
        return this;
    };
    HttpClientConfiguration.prototype.withInterceptor = function (interceptor) {
        this.interceptors.push(interceptor);
        return this;
    };
    HttpClientConfiguration.prototype.useStandardConfiguration = function () {
        var standardConfig = { credentials: 'same-origin' };
        Object.assign(this.defaults, standardConfig, this.defaults);
        return this.rejectErrorResponses();
    };
    HttpClientConfiguration.prototype.rejectErrorResponses = function () {
        return this.withInterceptor({ response: rejectOnError });
    };
    HttpClientConfiguration.prototype.withRetry = function (config) {
        var interceptor = new RetryInterceptor(config);
        return this.withInterceptor(interceptor);
    };
    return HttpClientConfiguration;
}());
function rejectOnError(response) {
    if (!response.ok) {
        throw response;
    }
    return response;
}

var HttpClient = (function () {
    function HttpClient() {
        this.activeRequestCount = 0;
        this.isRequesting = false;
        this.isConfigured = false;
        this.baseUrl = '';
        this.defaults = null;
        this.interceptors = [];
        if (typeof fetch === 'undefined') {
            throw new Error('HttpClient requires a Fetch API implementation, but the current environment doesn\'t support it. You may need to load a polyfill such as https://github.com/github/fetch');
        }
    }
    HttpClient.prototype.configure = function (config) {
        var normalizedConfig;
        if (typeof config === 'object') {
            normalizedConfig = { defaults: config };
        }
        else if (typeof config === 'function') {
            normalizedConfig = new HttpClientConfiguration();
            normalizedConfig.baseUrl = this.baseUrl;
            normalizedConfig.defaults = Object.assign({}, this.defaults);
            normalizedConfig.interceptors = this.interceptors;
            var c = config(normalizedConfig);
            if (HttpClientConfiguration.prototype.isPrototypeOf(c)) {
                normalizedConfig = c;
            }
        }
        else {
            throw new Error('invalid config');
        }
        var defaults = normalizedConfig.defaults;
        if (defaults && Headers.prototype.isPrototypeOf(defaults.headers)) {
            throw new Error('Default headers must be a plain object.');
        }
        var interceptors = normalizedConfig.interceptors;
        if (interceptors && interceptors.length) {
            if (interceptors.filter(function (x) { return RetryInterceptor.prototype.isPrototypeOf(x); }).length > 1) {
                throw new Error('Only one RetryInterceptor is allowed.');
            }
            var retryInterceptorIndex = interceptors.findIndex(function (x) { return RetryInterceptor.prototype.isPrototypeOf(x); });
            if (retryInterceptorIndex >= 0 && retryInterceptorIndex !== interceptors.length - 1) {
                throw new Error('The retry interceptor must be the last interceptor defined.');
            }
        }
        this.baseUrl = normalizedConfig.baseUrl;
        this.defaults = defaults;
        this.interceptors = normalizedConfig.interceptors || [];
        this.isConfigured = true;
        return this;
    };
    HttpClient.prototype.fetch = function (input, init) {
        var _this = this;
        trackRequestStart(this);
        var request = this.buildRequest(input, init);
        return processRequest(request, this.interceptors, this).then(function (result) {
            var response = null;
            if (Response.prototype.isPrototypeOf(result)) {
                response = Promise.resolve(result);
            }
            else if (Request.prototype.isPrototypeOf(result)) {
                request = result;
                response = fetch(result);
            }
            else {
                throw new Error("An invalid result was returned by the interceptor chain. Expected a Request or Response instance, but got [" + result + "]");
            }
            return processResponse(response, _this.interceptors, request, _this);
        })
            .then(function (result) {
            if (Request.prototype.isPrototypeOf(result)) {
                return _this.fetch(result);
            }
            return result;
        })
            .then(function (result) {
            trackRequestEnd(_this);
            return result;
        }, function (error) {
            trackRequestEnd(_this);
            throw error;
        });
    };
    HttpClient.prototype.buildRequest = function (input, init) {
        var defaults = this.defaults || {};
        var request;
        var body;
        var requestContentType;
        var parsedDefaultHeaders = parseHeaderValues(defaults.headers);
        if (Request.prototype.isPrototypeOf(input)) {
            request = input;
            requestContentType = new Headers(request.headers).get('Content-Type');
        }
        else {
            if (!init) {
                init = {};
            }
            body = init.body;
            var bodyObj = body ? { body: body } : null;
            var requestInit = Object.assign({}, defaults, { headers: {} }, init, bodyObj);
            requestContentType = new Headers(requestInit.headers).get('Content-Type');
            request = new Request(getRequestUrl(this.baseUrl, input), requestInit);
        }
        if (!requestContentType) {
            if (new Headers(parsedDefaultHeaders).has('content-type')) {
                request.headers.set('Content-Type', new Headers(parsedDefaultHeaders).get('content-type'));
            }
            else if (body && isJSON(body)) {
                request.headers.set('Content-Type', 'application/json');
            }
        }
        setDefaultHeaders(request.headers, parsedDefaultHeaders);
        if (body && Blob.prototype.isPrototypeOf(body) && body.type) {
            request.headers.set('Content-Type', body.type);
        }
        return request;
    };
    HttpClient.prototype.get = function (input, init) {
        return this.fetch(input, init);
    };
    HttpClient.prototype.post = function (input, body, init) {
        return callFetch(this, input, body, init, 'POST');
    };
    HttpClient.prototype.put = function (input, body, init) {
        return callFetch(this, input, body, init, 'PUT');
    };
    HttpClient.prototype.patch = function (input, body, init) {
        return callFetch(this, input, body, init, 'PATCH');
    };
    HttpClient.prototype.delete = function (input, body, init) {
        return callFetch(this, input, body, init, 'DELETE');
    };
    return HttpClient;
}());
var absoluteUrlRegexp = /^([a-z][a-z0-9+\-.]*:)?\/\//i;
function trackRequestStart(client) {
    client.isRequesting = !!(++client.activeRequestCount);
    if (client.isRequesting) {
        var evt_1 = __WEBPACK_IMPORTED_MODULE_0_aurelia_pal__["c" /* DOM */].createCustomEvent('aurelia-fetch-client-request-started', { bubbles: true, cancelable: true });
        setTimeout(function () { return __WEBPACK_IMPORTED_MODULE_0_aurelia_pal__["c" /* DOM */].dispatchEvent(evt_1); }, 1);
    }
}
function trackRequestEnd(client) {
    client.isRequesting = !!(--client.activeRequestCount);
    if (!client.isRequesting) {
        var evt_2 = __WEBPACK_IMPORTED_MODULE_0_aurelia_pal__["c" /* DOM */].createCustomEvent('aurelia-fetch-client-requests-drained', { bubbles: true, cancelable: true });
        setTimeout(function () { return __WEBPACK_IMPORTED_MODULE_0_aurelia_pal__["c" /* DOM */].dispatchEvent(evt_2); }, 1);
    }
}
function parseHeaderValues(headers) {
    var parsedHeaders = {};
    for (var name_1 in headers || {}) {
        if (headers.hasOwnProperty(name_1)) {
            parsedHeaders[name_1] = (typeof headers[name_1] === 'function') ? headers[name_1]() : headers[name_1];
        }
    }
    return parsedHeaders;
}
function getRequestUrl(baseUrl, url) {
    if (absoluteUrlRegexp.test(url)) {
        return url;
    }
    return (baseUrl || '') + url;
}
function setDefaultHeaders(headers, defaultHeaders) {
    for (var name_2 in defaultHeaders || {}) {
        if (defaultHeaders.hasOwnProperty(name_2) && !headers.has(name_2)) {
            headers.set(name_2, defaultHeaders[name_2]);
        }
    }
}
function processRequest(request, interceptors, http) {
    return applyInterceptors(request, interceptors, 'request', 'requestError', http);
}
function processResponse(response, interceptors, request, http) {
    return applyInterceptors(response, interceptors, 'response', 'responseError', request, http);
}
function applyInterceptors(input, interceptors, successName, errorName) {
    var interceptorArgs = [];
    for (var _i = 4; _i < arguments.length; _i++) {
        interceptorArgs[_i - 4] = arguments[_i];
    }
    return (interceptors || [])
        .reduce(function (chain, interceptor) {
        var successHandler = interceptor[successName];
        var errorHandler = interceptor[errorName];
        return chain.then(successHandler && (function (value) { return successHandler.call.apply(successHandler, [interceptor, value].concat(interceptorArgs)); }) || identity, errorHandler && (function (reason) { return errorHandler.call.apply(errorHandler, [interceptor, reason].concat(interceptorArgs)); }) || thrower);
    }, Promise.resolve(input));
}
function isJSON(str) {
    try {
        JSON.parse(str);
    }
    catch (err) {
        return false;
    }
    return true;
}
function identity(x) {
    return x;
}
function thrower(x) {
    throw x;
}
function callFetch(client, input, body, init, method) {
    if (!init) {
        init = {};
    }
    init.method = method;
    if (body) {
        init.body = body;
    }
    return client.fetch(input, init);
}




/***/ }),

/***/ "app/app":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_aurelia_pal__ = __webpack_require__(0);

class App {
    configureRouter(config, router) {
        config.options.pushState = true;
        config.title = 'Colours Test';
        config.map([
            { route: '', redirect: '/people' },
            { route: 'people/:id', name: 'person', moduleId: 'app/people/edit/person-edit', title: 'Person' },
            { route: 'people', name: 'people', moduleId: 'app/people/list/people-list', title: 'People' }
        ]);
        this.router = router;
    }
}
/* harmony export (immutable) */ __webpack_exports__["App"] = App;



/***/ }),

/***/ "app/app.html":
/***/ (function(module, exports) {

module.exports = "<template>\n  <section class=\"section\">\n    <div class=\"container is-fluid\">\n      <router-view></router-view>\n    </div>\n  </section>\n</template>\n";

/***/ }),

/***/ "app/people/edit/person-edit":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "PersonEdit", function() { return PersonEdit; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_aurelia_framework__ = __webpack_require__("aurelia-framework");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_aurelia_router__ = __webpack_require__(13);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_aurelia_fetch_client__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__models_person__ = __webpack_require__(15);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};




let PersonEdit = class PersonEdit {
    constructor(http, router) {
        this.http = http;
        this.router = router;
        this.colourOptions = [];
        this.colours = [];
        this.inputValueColours = document.getElementsByName("colours").checked;
    }
    async activate(params, routerConfig) {
        this.routerConfig = routerConfig;
        const personResponse = await this.http.fetch(`/people/${params.id}`);
        this.personFetched(await personResponse.json());
        const colourResponse = await this.http.fetch('/colours');
        this.colourOptions = await colourResponse.json();
    }
    personFetched(person) {
        this.person = new __WEBPACK_IMPORTED_MODULE_3__models_person__["a" /* Person */](person);
        this.heading = `Update ${this.person.fullName}`;
        this.routerConfig.navModel.setTitle(`Update ${this.person.fullName}`);
    }
    colourMatcher(favouriteColour, checkBoxColour) {
        return favouriteColour.id === checkBoxColour.id;
    }
    async submit() {
        // TODO: Step 7
        //
        // Implement the submit and save logic.
        // Send a JSON request to the API with the newly updated
        // this.person object. If the response is successful then
        // the user should be navigated to the list page.
        try {
            await this.http.fetch(`/people/${this.person.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(this.person),
            }).then((response) => response.status)
                .then((responseStatus) => {
                if (responseStatus == 200) {
                    this.router.navigate('people');
                }
            });
        }
        catch (Ex) {
            console.log(Ex);
        }
    }
    cancel() {
        this.router.navigate('people');
    }
};
PersonEdit = __decorate([
    __WEBPACK_IMPORTED_MODULE_0_aurelia_framework__["c" /* autoinject */],
    __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_2_aurelia_fetch_client__["a" /* HttpClient */], __WEBPACK_IMPORTED_MODULE_1_aurelia_router__["a" /* Router */]])
], PersonEdit);



/***/ }),

/***/ "app/people/edit/person-edit.html":
/***/ (function(module, exports) {

module.exports = "<template>\n  <h2 class=\"title\">${heading}</h2>\n\n  <form role=\"form\" submit.delegate=\"submit()\">\n\n    <fieldset class=\"box\">\n      <legend>User Details</legend>\n      <div class=\"field\">\n\n        <div class=\"control\">\n          <label class=\"checkbox\">\n            <input type=\"checkbox\" checked.bind=\"person.authorised\" name=\"authorised\" /> Authorised\n          </label>\n        </div>\n\n        <div class=\"control\">\n          <label class=\"checkbox\">\n            <input type=\"checkbox\" checked.bind=\"person.enabled\" name=\"enabled\" /> Enabled\n          </label>\n        </div>\n\n      </div>\n    </fieldset>\n\n    <fieldset class=\"box\">\n      <legend>Favourate Colours</legend>\n      <div class=\"field\">\n\n        <div class=\"control\" repeat.for=\"colour of colourOptions\">\n          <label class=\"checkbox\">\n            <input type=\"checkbox\" model.bind=\"colour\" checked.bind=\"person.colours\" matcher.bind=\"colourMatcher\" name=\"colours\"\n            /> ${colour.name}\n          </label>\n        </div>\n\n      </div>\n\n    </fieldset>\n\n    <div class=\"field is-grouped\">\n\n      <div class=\"control\">\n        <input class=\"button is-link\" type=\"submit\" value=\"Save Changes\" />\n      </div>\n\n      <div class=\"control\">\n        <button class=\"button is-light\" click.delegate=\"cancel()\">Cancel</button>\n      </div>\n\n    </div>\n\n  </form>\n</template>\n";

/***/ }),

/***/ "app/people/list/people-list":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "PeopleList", function() { return PeopleList; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_aurelia_framework__ = __webpack_require__("aurelia-framework");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_aurelia_fetch_client__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__models_person__ = __webpack_require__(15);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



let PeopleList = class PeopleList {
    constructor(http) {
        this.http = http;
        this.heading = 'People';
        this.people = [];
    }
    async activate() {
        const response = await this.http.fetch('/people');
        const people = await response.json();
        this.people = people.map((person) => new __WEBPACK_IMPORTED_MODULE_2__models_person__["a" /* Person */](person));
    }
};
__decorate([
    __WEBPACK_IMPORTED_MODULE_0_aurelia_framework__["b" /* bindable */],
    __metadata("design:type", Array)
], PeopleList.prototype, "people", void 0);
PeopleList = __decorate([
    __WEBPACK_IMPORTED_MODULE_0_aurelia_framework__["c" /* autoinject */],
    __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_aurelia_fetch_client__["a" /* HttpClient */]])
], PeopleList);



/***/ }),

/***/ "app/people/list/people-list.html":
/***/ (function(module, exports) {

module.exports = "<template>\r\n\r\n    <h2 class=\"title\">${heading}</h2>\r\n    <style>\r\n        .red {\r\n            color: red;\r\n        }\r\n\r\n        .green {\r\n            color:green;\r\n        }\r\n    </style>\r\n\r\n    <table class=\"table is-striped is-fullwidth\">\r\n        <thead>\r\n            <tr>\r\n                <th>Name</th>\r\n                <th>Palindrome</th>\r\n                <th>Authorised</th>\r\n                <th>Enabled</th>\r\n                <th>Colours</th>\r\n            </tr>\r\n        </thead>\r\n        <tbody>\r\n\r\n              <!--\r\n              TODO: Step 6\r\n              Add styles to Palindrome, Authorised and Enabled values.\r\n              When the value is Yes the text colour should be Green.\r\n              When the value is No the text colour should be Red.\r\n              -->\r\n              <!--\r\n              use a ternary operator to deturminte the output the functions, if the functions output is true\r\n              show green text or show red text if the output is false\r\n              -->\r\n\r\n\r\n            <tr repeat.for=\"person of people\" person.bind=\"person\">\r\n                <td><a class=\"is-link\" href=\"/people/${person.id}\">${person.fullName}</a></td>\r\n                <td class=\"${person.palindrome ? 'green' : 'red' }\">${person.palindrome ? 'Yes' : 'No'}</td>\r\n                <td class=\"${person.authorised  ? 'green' : 'red'}\">${person.authorised ? 'Yes' : 'No'}</td>\r\n                <td class=\"${person.enabled   ? 'green' : 'red'}\"> ${person.enabled ? 'Yes' : 'No'}</td>\r\n                <td>${person.colours | colourNames }</td>\r\n            </tr>\r\n        </tbody>\r\n    </table>\r\n</template>\r\n";

/***/ }),

/***/ "app/shared/colour-names-value-converter":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
class ColourNamesValueConverter {
    toView(colours) {
        // TODO: Step 4
        //
        // Implement the value converter function.
        // Using the colours parameter, convert the list into a comma
        // separated string of colour names. The names should be sorted
        // alphabetically and there should not be a trailing comma.
        //
        // Example: 'Blue, Green, Red'
        const temp = [];
        //for all colours in colour list add to temp array
        for (const colour of colours) {
            temp.push(colour.name);
        }
        //sort temp and separate string with comma
        temp.sort();
        temp.join(",");
        const sortedColours = temp.toString();
        return sortedColours;
    }
}
/* harmony export (immutable) */ __webpack_exports__["ColourNamesValueConverter"] = ColourNamesValueConverter;



/***/ }),

/***/ "aurelia-event-aggregator":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return EventAggregator; });
/* unused harmony export includeEventsIn */
/* harmony export (immutable) */ __webpack_exports__["configure"] = configure;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_aurelia_logging__ = __webpack_require__(3);




var logger = __WEBPACK_IMPORTED_MODULE_0_aurelia_logging__["getLogger"]('event-aggregator');

var Handler = function () {
  function Handler(messageType, callback) {
    

    this.messageType = messageType;
    this.callback = callback;
  }

  Handler.prototype.handle = function handle(message) {
    if (message instanceof this.messageType) {
      this.callback.call(null, message);
    }
  };

  return Handler;
}();

function invokeCallback(callback, data, event) {
  try {
    callback(data, event);
  } catch (e) {
    logger.error(e);
  }
}

function invokeHandler(handler, data) {
  try {
    handler.handle(data);
  } catch (e) {
    logger.error(e);
  }
}

var EventAggregator = function () {
  function EventAggregator() {
    

    this.eventLookup = {};
    this.messageHandlers = [];
  }

  EventAggregator.prototype.publish = function publish(event, data) {
    var subscribers = void 0;
    var i = void 0;

    if (!event) {
      throw new Error('Event was invalid.');
    }

    if (typeof event === 'string') {
      subscribers = this.eventLookup[event];
      if (subscribers) {
        subscribers = subscribers.slice();
        i = subscribers.length;

        while (i--) {
          invokeCallback(subscribers[i], data, event);
        }
      }
    } else {
      subscribers = this.messageHandlers.slice();
      i = subscribers.length;

      while (i--) {
        invokeHandler(subscribers[i], event);
      }
    }
  };

  EventAggregator.prototype.subscribe = function subscribe(event, callback) {
    var handler = void 0;
    var subscribers = void 0;

    if (!event) {
      throw new Error('Event channel/type was invalid.');
    }

    if (typeof event === 'string') {
      handler = callback;
      subscribers = this.eventLookup[event] || (this.eventLookup[event] = []);
    } else {
      handler = new Handler(event, callback);
      subscribers = this.messageHandlers;
    }

    subscribers.push(handler);

    return {
      dispose: function dispose() {
        var idx = subscribers.indexOf(handler);
        if (idx !== -1) {
          subscribers.splice(idx, 1);
        }
      }
    };
  };

  EventAggregator.prototype.subscribeOnce = function subscribeOnce(event, callback) {
    var sub = this.subscribe(event, function (a, b) {
      sub.dispose();
      return callback(a, b);
    });

    return sub;
  };

  return EventAggregator;
}();

function includeEventsIn(obj) {
  var ea = new EventAggregator();

  obj.subscribeOnce = function (event, callback) {
    return ea.subscribeOnce(event, callback);
  };

  obj.subscribe = function (event, callback) {
    return ea.subscribe(event, callback);
  };

  obj.publish = function (event, data) {
    ea.publish(event, data);
  };

  return ea;
}

function configure(config) {
  config.instance(EventAggregator, includeEventsIn(config.aurelia));
}

/***/ }),

/***/ "aurelia-framework":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Aurelia", function() { return Aurelia; });
/* unused harmony export FrameworkConfiguration */
/* unused harmony export LogManager */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_aurelia_logging__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_aurelia_dependency_injection__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_aurelia_loader__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_aurelia_templating__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_aurelia_pal__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_aurelia_path__ = __webpack_require__(4);
/* harmony namespace reexport (by used) */ __webpack_require__.d(__webpack_exports__, "c", function() { return __WEBPACK_IMPORTED_MODULE_1_aurelia_dependency_injection__["e"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_aurelia_binding__ = __webpack_require__(7);
/* harmony namespace reexport (by used) */ __webpack_require__.d(__webpack_exports__, "d", function() { return __WEBPACK_IMPORTED_MODULE_6_aurelia_binding__["B"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7_aurelia_metadata__ = __webpack_require__(1);
/* unused harmony namespace reexport */
/* harmony namespace reexport (by used) */ __webpack_require__.d(__webpack_exports__, "b", function() { return __WEBPACK_IMPORTED_MODULE_3_aurelia_templating__["p"]; });
/* unused harmony namespace reexport */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8_aurelia_task_queue__ = __webpack_require__(8);
/* unused harmony namespace reexport */
/* unused harmony namespace reexport */
/* unused harmony namespace reexport */
var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };










function preventActionlessFormSubmit() {
  __WEBPACK_IMPORTED_MODULE_4_aurelia_pal__["c" /* DOM */].addEventListener('submit', function (evt) {
    var target = evt.target;
    var action = target.action;

    if (target.tagName.toLowerCase() === 'form' && !action) {
      evt.preventDefault();
    }
  });
}

var Aurelia = function () {
  function Aurelia(loader, container, resources) {
    

    this.loader = loader || new __WEBPACK_IMPORTED_MODULE_4_aurelia_pal__["a" /* PLATFORM */].Loader();
    this.container = container || new __WEBPACK_IMPORTED_MODULE_1_aurelia_dependency_injection__["a" /* Container */]().makeGlobal();
    this.resources = resources || new __WEBPACK_IMPORTED_MODULE_3_aurelia_templating__["a" /* ViewResources */]();
    this.use = new FrameworkConfiguration(this);
    this.logger = __WEBPACK_IMPORTED_MODULE_0_aurelia_logging__["getLogger"]('aurelia');
    this.hostConfigured = false;
    this.host = null;

    this.use.instance(Aurelia, this);
    this.use.instance(__WEBPACK_IMPORTED_MODULE_2_aurelia_loader__["a" /* Loader */], this.loader);
    this.use.instance(__WEBPACK_IMPORTED_MODULE_3_aurelia_templating__["a" /* ViewResources */], this.resources);
  }

  Aurelia.prototype.start = function start() {
    var _this = this;

    if (this._started) {
      return this._started;
    }

    this.logger.info('Aurelia Starting');
    return this._started = this.use.apply().then(function () {
      preventActionlessFormSubmit();

      if (!_this.container.hasResolver(__WEBPACK_IMPORTED_MODULE_3_aurelia_templating__["b" /* BindingLanguage */])) {
        var message = 'You must configure Aurelia with a BindingLanguage implementation.';
        _this.logger.error(message);
        throw new Error(message);
      }

      _this.logger.info('Aurelia Started');
      var evt = __WEBPACK_IMPORTED_MODULE_4_aurelia_pal__["c" /* DOM */].createCustomEvent('aurelia-started', { bubbles: true, cancelable: true });
      __WEBPACK_IMPORTED_MODULE_4_aurelia_pal__["c" /* DOM */].dispatchEvent(evt);
      return _this;
    });
  };

  Aurelia.prototype.enhance = function enhance() {
    var _this2 = this;

    var bindingContext = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var applicationHost = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

    this._configureHost(applicationHost || __WEBPACK_IMPORTED_MODULE_4_aurelia_pal__["c" /* DOM */].querySelectorAll('body')[0]);

    return new Promise(function (resolve) {
      var engine = _this2.container.get(__WEBPACK_IMPORTED_MODULE_3_aurelia_templating__["c" /* TemplatingEngine */]);
      _this2.root = engine.enhance({ container: _this2.container, element: _this2.host, resources: _this2.resources, bindingContext: bindingContext });
      _this2.root.attached();
      _this2._onAureliaComposed();
      resolve(_this2);
    });
  };

  Aurelia.prototype.setRoot = function setRoot() {
    var _this3 = this;

    var root = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
    var applicationHost = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

    var instruction = {};

    if (this.root && this.root.viewModel && this.root.viewModel.router) {
      this.root.viewModel.router.deactivate();
      this.root.viewModel.router.reset();
    }

    this._configureHost(applicationHost);

    var engine = this.container.get(__WEBPACK_IMPORTED_MODULE_3_aurelia_templating__["c" /* TemplatingEngine */]);
    var transaction = this.container.get(__WEBPACK_IMPORTED_MODULE_3_aurelia_templating__["d" /* CompositionTransaction */]);
    delete transaction.initialComposition;

    if (!root) {
      if (this.configModuleId) {
        root = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_5_aurelia_path__["a" /* relativeToFile */])('./app', this.configModuleId);
      } else {
        root = 'app';
      }
    }

    instruction.viewModel = root;
    instruction.container = instruction.childContainer = this.container;
    instruction.viewSlot = this.hostSlot;
    instruction.host = this.host;

    return engine.compose(instruction).then(function (r) {
      _this3.root = r;
      instruction.viewSlot.attached();
      _this3._onAureliaComposed();
      return _this3;
    });
  };

  Aurelia.prototype._configureHost = function _configureHost(applicationHost) {
    if (this.hostConfigured) {
      return;
    }
    applicationHost = applicationHost || this.host;

    if (!applicationHost || typeof applicationHost === 'string') {
      this.host = __WEBPACK_IMPORTED_MODULE_4_aurelia_pal__["c" /* DOM */].getElementById(applicationHost || 'applicationHost');
    } else {
      this.host = applicationHost;
    }

    if (!this.host) {
      throw new Error('No applicationHost was specified.');
    }

    this.hostConfigured = true;
    this.host.aurelia = this;
    this.hostSlot = new __WEBPACK_IMPORTED_MODULE_3_aurelia_templating__["e" /* ViewSlot */](this.host, true);
    this.hostSlot.transformChildNodesIntoView();
    this.container.registerInstance(__WEBPACK_IMPORTED_MODULE_4_aurelia_pal__["c" /* DOM */].boundary, this.host);
  };

  Aurelia.prototype._onAureliaComposed = function _onAureliaComposed() {
    var evt = __WEBPACK_IMPORTED_MODULE_4_aurelia_pal__["c" /* DOM */].createCustomEvent('aurelia-composed', { bubbles: true, cancelable: true });
    setTimeout(function () {
      return __WEBPACK_IMPORTED_MODULE_4_aurelia_pal__["c" /* DOM */].dispatchEvent(evt);
    }, 1);
  };

  return Aurelia;
}();

var logger = __WEBPACK_IMPORTED_MODULE_0_aurelia_logging__["getLogger"]('aurelia');
var extPattern = /\.[^/.]+$/;

function runTasks(config, tasks) {
  var current = void 0;
  var next = function next() {
    current = tasks.shift();
    if (current) {
      return Promise.resolve(current(config)).then(next);
    }

    return Promise.resolve();
  };

  return next();
}

function loadPlugin(fwConfig, loader, info) {
  logger.debug('Loading plugin ' + info.moduleId + '.');
  if (typeof info.moduleId === 'string') {
    fwConfig.resourcesRelativeTo = info.resourcesRelativeTo;

    var id = info.moduleId;

    if (info.resourcesRelativeTo.length > 1) {
      return loader.normalize(info.moduleId, info.resourcesRelativeTo[1]).then(function (normalizedId) {
        return _loadPlugin(normalizedId);
      });
    }

    return _loadPlugin(id);
  } else if (typeof info.configure === 'function') {
    if (fwConfig.configuredPlugins.indexOf(info.configure) !== -1) {
      return Promise.resolve();
    }
    fwConfig.configuredPlugins.push(info.configure);

    return Promise.resolve(info.configure.call(null, fwConfig, info.config || {}));
  }
  throw new Error(invalidConfigMsg(info.moduleId || info.configure, 'plugin'));

  function _loadPlugin(moduleId) {
    return loader.loadModule(moduleId).then(function (m) {
      if ('configure' in m) {
        if (fwConfig.configuredPlugins.indexOf(m.configure) !== -1) {
          return Promise.resolve();
        }
        return Promise.resolve(m.configure(fwConfig, info.config || {})).then(function () {
          fwConfig.configuredPlugins.push(m.configure);
          fwConfig.resourcesRelativeTo = null;
          logger.debug('Configured plugin ' + info.moduleId + '.');
        });
      }

      fwConfig.resourcesRelativeTo = null;
      logger.debug('Loaded plugin ' + info.moduleId + '.');
    });
  }
}

function loadResources(aurelia, resourcesToLoad, appResources) {
  if (Object.keys(resourcesToLoad).length === 0) {
    return Promise.resolve();
  }
  var viewEngine = aurelia.container.get(__WEBPACK_IMPORTED_MODULE_3_aurelia_templating__["f" /* ViewEngine */]);

  return Promise.all(Object.keys(resourcesToLoad).map(function (n) {
    return _normalize(resourcesToLoad[n]);
  })).then(function (loads) {
    var names = [];
    var importIds = [];

    loads.forEach(function (l) {
      names.push(undefined);
      importIds.push(l.importId);
    });

    return viewEngine.importViewResources(importIds, names, appResources);
  });

  function _normalize(load) {
    var moduleId = load.moduleId;
    var ext = getExt(moduleId);

    if (isOtherResource(moduleId)) {
      moduleId = removeExt(moduleId);
    }

    return aurelia.loader.normalize(moduleId, load.relativeTo).then(function (normalized) {
      return {
        name: load.moduleId,
        importId: isOtherResource(load.moduleId) ? addOriginalExt(normalized, ext) : normalized
      };
    });
  }

  function isOtherResource(name) {
    var ext = getExt(name);
    if (!ext) return false;
    if (ext === '') return false;
    if (ext === '.js' || ext === '.ts') return false;
    return true;
  }

  function removeExt(name) {
    return name.replace(extPattern, '');
  }

  function addOriginalExt(normalized, ext) {
    return removeExt(normalized) + '.' + ext;
  }
}

function getExt(name) {
  var match = name.match(extPattern);
  if (match && match.length > 0) {
    return match[0].split('.')[1];
  }
}

function loadBehaviors(config) {
  return Promise.all(config.behaviorsToLoad.map(function (m) {
    return m.load(config.container, m.target);
  })).then(function () {
    config.behaviorsToLoad = null;
  });
}

function assertProcessed(plugins) {
  if (plugins.processed) {
    throw new Error('This config instance has already been applied. To load more plugins or global resources, create a new FrameworkConfiguration instance.');
  }
}

function invalidConfigMsg(cfg, type) {
  return 'Invalid ' + type + ' [' + cfg + '], ' + type + ' must be specified as functions or relative module IDs.';
}

var FrameworkConfiguration = function () {
  function FrameworkConfiguration(aurelia) {
    var _this4 = this;

    

    this.aurelia = aurelia;
    this.container = aurelia.container;

    this.info = [];
    this.processed = false;
    this.preTasks = [];
    this.postTasks = [];

    this.behaviorsToLoad = [];

    this.configuredPlugins = [];
    this.resourcesToLoad = {};
    this.preTask(function () {
      return aurelia.loader.normalize('aurelia-bootstrapper').then(function (name) {
        return _this4.bootstrapperName = name;
      });
    });
    this.postTask(function () {
      return loadResources(aurelia, _this4.resourcesToLoad, aurelia.resources);
    });
  }

  FrameworkConfiguration.prototype.instance = function instance(type, _instance) {
    this.container.registerInstance(type, _instance);
    return this;
  };

  FrameworkConfiguration.prototype.singleton = function singleton(type, implementation) {
    this.container.registerSingleton(type, implementation);
    return this;
  };

  FrameworkConfiguration.prototype.transient = function transient(type, implementation) {
    this.container.registerTransient(type, implementation);
    return this;
  };

  FrameworkConfiguration.prototype.preTask = function preTask(task) {
    assertProcessed(this);
    this.preTasks.push(task);
    return this;
  };

  FrameworkConfiguration.prototype.postTask = function postTask(task) {
    assertProcessed(this);
    this.postTasks.push(task);
    return this;
  };

  FrameworkConfiguration.prototype.feature = function feature(plugin) {
    var config = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    switch (typeof plugin === 'undefined' ? 'undefined' : _typeof(plugin)) {
      case 'string':
        var hasIndex = /\/index$/i.test(plugin);
        var _moduleId = hasIndex || getExt(plugin) ? plugin : plugin + '/index';
        var root = hasIndex ? plugin.substr(0, plugin.length - 6) : plugin;
        this.info.push({ moduleId: _moduleId, resourcesRelativeTo: [root, ''], config: config });
        break;

      case 'function':
        this.info.push({ configure: plugin, config: config || {} });
        break;
      default:
        throw new Error(invalidConfigMsg(plugin, 'feature'));
    }
    return this;
  };

  FrameworkConfiguration.prototype.globalResources = function globalResources(resources) {
    var _this5 = this;

    assertProcessed(this);

    var toAdd = Array.isArray(resources) ? resources : arguments;
    var resource = void 0;
    var resourcesRelativeTo = this.resourcesRelativeTo || ['', ''];

    for (var i = 0, ii = toAdd.length; i < ii; ++i) {
      resource = toAdd[i];
      switch (typeof resource === 'undefined' ? 'undefined' : _typeof(resource)) {
        case 'string':
          var parent = resourcesRelativeTo[0];
          var grandParent = resourcesRelativeTo[1];
          var name = resource;

          if ((resource.startsWith('./') || resource.startsWith('../')) && parent !== '') {
            name = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_5_aurelia_path__["b" /* join */])(parent, resource);
          }

          this.resourcesToLoad[name] = { moduleId: name, relativeTo: grandParent };
          break;
        case 'function':
          var meta = this.aurelia.resources.autoRegister(this.container, resource);
          if (meta instanceof __WEBPACK_IMPORTED_MODULE_3_aurelia_templating__["g" /* HtmlBehaviorResource */] && meta.elementName !== null) {
            if (this.behaviorsToLoad.push(meta) === 1) {
              this.postTask(function () {
                return loadBehaviors(_this5);
              });
            }
          }
          break;
        default:
          throw new Error(invalidConfigMsg(resource, 'resource'));
      }
    }

    return this;
  };

  FrameworkConfiguration.prototype.globalName = function globalName(resourcePath, newName) {
    assertProcessed(this);
    this.resourcesToLoad[resourcePath] = { moduleId: newName, relativeTo: '' };
    return this;
  };

  FrameworkConfiguration.prototype.plugin = function plugin(_plugin, pluginConfig) {
    assertProcessed(this);

    var info = void 0;
    switch (typeof _plugin === 'undefined' ? 'undefined' : _typeof(_plugin)) {
      case 'string':
        info = { moduleId: _plugin, resourcesRelativeTo: [_plugin, ''], config: pluginConfig || {} };
        break;
      case 'function':
        info = { configure: _plugin, config: pluginConfig || {} };
        break;
      default:
        throw new Error(invalidConfigMsg(_plugin, 'plugin'));
    }
    this.info.push(info);
    return this;
  };

  FrameworkConfiguration.prototype._addNormalizedPlugin = function _addNormalizedPlugin(name, config) {
    var _this6 = this;

    var plugin = { moduleId: name, resourcesRelativeTo: [name, ''], config: config || {} };
    this.info.push(plugin);

    this.preTask(function () {
      var relativeTo = [name, _this6.bootstrapperName];
      plugin.moduleId = name;
      plugin.resourcesRelativeTo = relativeTo;
      return Promise.resolve();
    });

    return this;
  };

  FrameworkConfiguration.prototype.defaultBindingLanguage = function defaultBindingLanguage() {
    return this._addNormalizedPlugin('aurelia-templating-binding');
  };

  FrameworkConfiguration.prototype.router = function router() {
    return this._addNormalizedPlugin('aurelia-templating-router');
  };

  FrameworkConfiguration.prototype.history = function history() {
    return this._addNormalizedPlugin('aurelia-history-browser');
  };

  FrameworkConfiguration.prototype.defaultResources = function defaultResources() {
    return this._addNormalizedPlugin('aurelia-templating-resources');
  };

  FrameworkConfiguration.prototype.eventAggregator = function eventAggregator() {
    return this._addNormalizedPlugin('aurelia-event-aggregator');
  };

  FrameworkConfiguration.prototype.basicConfiguration = function basicConfiguration() {
    return this.defaultBindingLanguage().defaultResources().eventAggregator();
  };

  FrameworkConfiguration.prototype.standardConfiguration = function standardConfiguration() {
    return this.basicConfiguration().history().router();
  };

  FrameworkConfiguration.prototype.developmentLogging = function developmentLogging(level) {
    var _this7 = this;

    var logLevel = level ? __WEBPACK_IMPORTED_MODULE_0_aurelia_logging__["logLevel"][level] : undefined;

    if (logLevel === undefined) {
      logLevel = __WEBPACK_IMPORTED_MODULE_0_aurelia_logging__["logLevel"].debug;
    }

    this.preTask(function () {
      return _this7.aurelia.loader.normalize('aurelia-logging-console', _this7.bootstrapperName).then(function (name) {
        return _this7.aurelia.loader.loadModule(name).then(function (m) {
          __WEBPACK_IMPORTED_MODULE_0_aurelia_logging__["addAppender"](new m.ConsoleAppender());
          __WEBPACK_IMPORTED_MODULE_0_aurelia_logging__["setLevel"](logLevel);
        });
      });
    });

    return this;
  };

  FrameworkConfiguration.prototype.apply = function apply() {
    var _this8 = this;

    if (this.processed) {
      return Promise.resolve();
    }

    return runTasks(this, this.preTasks).then(function () {
      var loader = _this8.aurelia.loader;
      var info = _this8.info;
      var current = void 0;

      var next = function next() {
        current = info.shift();
        if (current) {
          return loadPlugin(_this8, loader, current).then(next);
        }

        _this8.processed = true;
        _this8.configuredPlugins = null;
        return Promise.resolve();
      };

      return next().then(function () {
        return runTasks(_this8, _this8.postTasks);
      });
    });
  };

  return FrameworkConfiguration;
}();













var LogManager = __WEBPACK_IMPORTED_MODULE_0_aurelia_logging__;

/***/ }),

/***/ "aurelia-history-browser":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export BrowserHistory */
/* unused harmony export DefaultLinkHandler */
/* unused harmony export LinkHandler */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "configure", function() { return configure; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_aurelia_history__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_aurelia_pal__ = __webpack_require__(0);



/*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */
/* global Reflect, Promise */

var extendStatics = function(d, b) {
    extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return extendStatics(d, b);
};

function __extends(d, b) {
    extendStatics(d, b);
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}

var LinkHandler = (function () {
    function LinkHandler() {
    }
    LinkHandler.prototype.activate = function (history) { };
    LinkHandler.prototype.deactivate = function () { };
    return LinkHandler;
}());
var DefaultLinkHandler = (function (_super) {
    __extends(DefaultLinkHandler, _super);
    function DefaultLinkHandler() {
        var _this = _super.call(this) || this;
        _this.handler = function (e) {
            var _a = DefaultLinkHandler.getEventInfo(e), shouldHandleEvent = _a.shouldHandleEvent, href = _a.href;
            if (shouldHandleEvent) {
                e.preventDefault();
                _this.history.navigate(href);
            }
        };
        return _this;
    }
    DefaultLinkHandler.prototype.activate = function (history) {
        if (history._hasPushState) {
            this.history = history;
            __WEBPACK_IMPORTED_MODULE_1_aurelia_pal__["c" /* DOM */].addEventListener('click', this.handler, true);
        }
    };
    DefaultLinkHandler.prototype.deactivate = function () {
        __WEBPACK_IMPORTED_MODULE_1_aurelia_pal__["c" /* DOM */].removeEventListener('click', this.handler, true);
    };
    DefaultLinkHandler.getEventInfo = function (event) {
        var $event = event;
        var info = {
            shouldHandleEvent: false,
            href: null,
            anchor: null
        };
        var target = DefaultLinkHandler.findClosestAnchor($event.target);
        if (!target || !DefaultLinkHandler.targetIsThisWindow(target)) {
            return info;
        }
        if (hasAttribute(target, 'download')
            || hasAttribute(target, 'router-ignore')
            || hasAttribute(target, 'data-router-ignore')) {
            return info;
        }
        if ($event.altKey || $event.ctrlKey || $event.metaKey || $event.shiftKey) {
            return info;
        }
        var href = target.getAttribute('href');
        info.anchor = target;
        info.href = href;
        var leftButtonClicked = $event.which === 1;
        var isRelative = href && !(href.charAt(0) === '#' || (/^[a-z]+:/i).test(href));
        info.shouldHandleEvent = leftButtonClicked && isRelative;
        return info;
    };
    DefaultLinkHandler.findClosestAnchor = function (el) {
        while (el) {
            if (el.tagName === 'A') {
                return el;
            }
            el = el.parentNode;
        }
    };
    DefaultLinkHandler.targetIsThisWindow = function (target) {
        var targetWindow = target.getAttribute('target');
        var win = __WEBPACK_IMPORTED_MODULE_1_aurelia_pal__["a" /* PLATFORM */].global;
        return !targetWindow ||
            targetWindow === win.name ||
            targetWindow === '_self';
    };
    return DefaultLinkHandler;
}(LinkHandler));
var hasAttribute = function (el, attr) { return el.hasAttribute(attr); };

var BrowserHistory = (function (_super) {
    __extends(BrowserHistory, _super);
    function BrowserHistory(linkHandler) {
        var _this = _super.call(this) || this;
        _this._isActive = false;
        _this._checkUrlCallback = _this._checkUrl.bind(_this);
        _this.location = __WEBPACK_IMPORTED_MODULE_1_aurelia_pal__["a" /* PLATFORM */].location;
        _this.history = __WEBPACK_IMPORTED_MODULE_1_aurelia_pal__["a" /* PLATFORM */].history;
        _this.linkHandler = linkHandler;
        return _this;
    }
    BrowserHistory.prototype.activate = function (options) {
        if (this._isActive) {
            throw new Error('History has already been activated.');
        }
        var $history = this.history;
        var wantsPushState = !!options.pushState;
        this._isActive = true;
        var normalizedOptions = this.options = Object.assign({}, { root: '/' }, this.options, options);
        var rootUrl = this.root = ('/' + normalizedOptions.root + '/').replace(rootStripper, '/');
        var wantsHashChange = this._wantsHashChange = normalizedOptions.hashChange !== false;
        var hasPushState = this._hasPushState = !!(normalizedOptions.pushState && $history && $history.pushState);
        var eventName;
        if (hasPushState) {
            eventName = 'popstate';
        }
        else if (wantsHashChange) {
            eventName = 'hashchange';
        }
        __WEBPACK_IMPORTED_MODULE_1_aurelia_pal__["a" /* PLATFORM */].addEventListener(eventName, this._checkUrlCallback);
        if (wantsHashChange && wantsPushState) {
            var $location = this.location;
            var atRoot = $location.pathname.replace(/[^\/]$/, '$&/') === rootUrl;
            if (!hasPushState && !atRoot) {
                var fragment = this.fragment = this._getFragment(null, true);
                $location.replace(rootUrl + $location.search + '#' + fragment);
                return true;
            }
            else if (hasPushState && atRoot && $location.hash) {
                var fragment = this.fragment = this._getHash().replace(routeStripper, '');
                $history.replaceState({}, __WEBPACK_IMPORTED_MODULE_1_aurelia_pal__["c" /* DOM */].title, rootUrl + fragment + $location.search);
            }
        }
        if (!this.fragment) {
            this.fragment = this._getFragment('');
        }
        this.linkHandler.activate(this);
        if (!normalizedOptions.silent) {
            return this._loadUrl('');
        }
    };
    BrowserHistory.prototype.deactivate = function () {
        var handler = this._checkUrlCallback;
        __WEBPACK_IMPORTED_MODULE_1_aurelia_pal__["a" /* PLATFORM */].removeEventListener('popstate', handler);
        __WEBPACK_IMPORTED_MODULE_1_aurelia_pal__["a" /* PLATFORM */].removeEventListener('hashchange', handler);
        this._isActive = false;
        this.linkHandler.deactivate();
    };
    BrowserHistory.prototype.getAbsoluteRoot = function () {
        var $location = this.location;
        var origin = createOrigin($location.protocol, $location.hostname, $location.port);
        return "" + origin + this.root;
    };
    BrowserHistory.prototype.navigate = function (fragment, _a) {
        var _b = _a === void 0 ? {} : _a, _c = _b.trigger, trigger = _c === void 0 ? true : _c, _d = _b.replace, replace = _d === void 0 ? false : _d;
        var location = this.location;
        if (fragment && absoluteUrl.test(fragment)) {
            location.href = fragment;
            return true;
        }
        if (!this._isActive) {
            return false;
        }
        fragment = this._getFragment(fragment || '');
        if (this.fragment === fragment && !replace) {
            return false;
        }
        this.fragment = fragment;
        var url = this.root + fragment;
        if (fragment === '' && url !== '/') {
            url = url.slice(0, -1);
        }
        if (this._hasPushState) {
            url = url.replace('//', '/');
            this.history[replace ? 'replaceState' : 'pushState']({}, __WEBPACK_IMPORTED_MODULE_1_aurelia_pal__["c" /* DOM */].title, url);
        }
        else if (this._wantsHashChange) {
            updateHash(location, fragment, replace);
        }
        else {
            location.assign(url);
        }
        if (trigger) {
            return this._loadUrl(fragment);
        }
        return true;
    };
    BrowserHistory.prototype.navigateBack = function () {
        this.history.back();
    };
    BrowserHistory.prototype.setTitle = function (title) {
        __WEBPACK_IMPORTED_MODULE_1_aurelia_pal__["c" /* DOM */].title = title;
    };
    BrowserHistory.prototype.setState = function (key, value) {
        var $history = this.history;
        var state = Object.assign({}, $history.state);
        var _a = this.location, pathname = _a.pathname, search = _a.search, hash = _a.hash;
        state[key] = value;
        $history.replaceState(state, null, "" + pathname + search + hash);
    };
    BrowserHistory.prototype.getState = function (key) {
        var state = Object.assign({}, this.history.state);
        return state[key];
    };
    BrowserHistory.prototype.getHistoryIndex = function () {
        var historyIndex = this.getState('HistoryIndex');
        if (historyIndex === undefined) {
            historyIndex = this.history.length - 1;
            this.setState('HistoryIndex', historyIndex);
        }
        return historyIndex;
    };
    BrowserHistory.prototype.go = function (movement) {
        this.history.go(movement);
    };
    BrowserHistory.prototype._getHash = function () {
        return this.location.hash.substr(1);
    };
    BrowserHistory.prototype._getFragment = function (fragment, forcePushState) {
        var rootUrl;
        if (!fragment) {
            if (this._hasPushState || !this._wantsHashChange || forcePushState) {
                var location_1 = this.location;
                fragment = location_1.pathname + location_1.search;
                rootUrl = this.root.replace(trailingSlash, '');
                if (!fragment.indexOf(rootUrl)) {
                    fragment = fragment.substr(rootUrl.length);
                }
            }
            else {
                fragment = this._getHash();
            }
        }
        return '/' + fragment.replace(routeStripper, '');
    };
    BrowserHistory.prototype._checkUrl = function () {
        var current = this._getFragment('');
        if (current !== this.fragment) {
            this._loadUrl('');
        }
    };
    BrowserHistory.prototype._loadUrl = function (fragmentOverride) {
        var fragment = this.fragment = this._getFragment(fragmentOverride);
        return this.options.routeHandler ?
            this.options.routeHandler(fragment) :
            false;
    };
    BrowserHistory.inject = [LinkHandler];
    return BrowserHistory;
}(__WEBPACK_IMPORTED_MODULE_0_aurelia_history__["a" /* History */]));
var routeStripper = /^#?\/*|\s+$/g;
var rootStripper = /^\/+|\/+$/g;
var trailingSlash = /\/$/;
var absoluteUrl = /^([a-z][a-z0-9+\-.]*:)?\/\//i;
function updateHash($location, fragment, replace) {
    if (replace) {
        var href = $location.href.replace(/(javascript:|#).*$/, '');
        $location.replace(href + '#' + fragment);
    }
    else {
        $location.hash = '#' + fragment;
    }
}
function createOrigin(protocol, hostname, port) {
    return protocol + "//" + hostname + (port ? ':' + port : '');
}

function configure(config) {
    var $config = config;
    $config.singleton(__WEBPACK_IMPORTED_MODULE_0_aurelia_history__["a" /* History */], BrowserHistory);
    $config.transient(LinkHandler, DefaultLinkHandler);
}


//# sourceMappingURL=aurelia-history-browser.js.map


/***/ }),

/***/ "aurelia-logging-console":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ConsoleAppender", function() { return ConsoleAppender; });


var ConsoleAppender = function () {
  function ConsoleAppender() {
    
  }

  ConsoleAppender.prototype.debug = function debug(logger) {
    var _console;

    for (var _len = arguments.length, rest = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      rest[_key - 1] = arguments[_key];
    }

    (_console = console).debug.apply(_console, ["DEBUG [" + logger.id + "]"].concat(rest));
  };

  ConsoleAppender.prototype.info = function info(logger) {
    var _console2;

    for (var _len2 = arguments.length, rest = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
      rest[_key2 - 1] = arguments[_key2];
    }

    (_console2 = console).info.apply(_console2, ["INFO [" + logger.id + "]"].concat(rest));
  };

  ConsoleAppender.prototype.warn = function warn(logger) {
    var _console3;

    for (var _len3 = arguments.length, rest = Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
      rest[_key3 - 1] = arguments[_key3];
    }

    (_console3 = console).warn.apply(_console3, ["WARN [" + logger.id + "]"].concat(rest));
  };

  ConsoleAppender.prototype.error = function error(logger) {
    var _console4;

    for (var _len4 = arguments.length, rest = Array(_len4 > 1 ? _len4 - 1 : 0), _key4 = 1; _key4 < _len4; _key4++) {
      rest[_key4 - 1] = arguments[_key4];
    }

    (_console4 = console).error.apply(_console4, ["ERROR [" + logger.id + "]"].concat(rest));
  };

  return ConsoleAppender;
}();

/***/ }),

/***/ "aurelia-pal-browser":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "_PLATFORM", function() { return _PLATFORM; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "_FEATURE", function() { return _FEATURE; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "_DOM", function() { return _DOM; });
/* harmony export (immutable) */ __webpack_exports__["initialize"] = initialize;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_aurelia_pal__ = __webpack_require__(0);
var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };



var _PLATFORM = {
  location: window.location,
  history: window.history,
  addEventListener: function addEventListener(eventName, callback, capture) {
    this.global.addEventListener(eventName, callback, capture);
  },
  removeEventListener: function removeEventListener(eventName, callback, capture) {
    this.global.removeEventListener(eventName, callback, capture);
  },

  performance: window.performance,
  requestAnimationFrame: function requestAnimationFrame(callback) {
    return this.global.requestAnimationFrame(callback);
  }
};

if (typeof FEATURE_NO_IE === 'undefined') {
  var test = function test() {};

  if (test.name === undefined) {
    Object.defineProperty(Function.prototype, 'name', {
      get: function get() {
        var name = this.toString().match(/^\s*function\s*(\S*)\s*\(/)[1];

        Object.defineProperty(this, 'name', { value: name });
        return name;
      }
    });
  }
}

if (typeof FEATURE_NO_IE === 'undefined') {
  if (!('classList' in document.createElement('_')) || document.createElementNS && !('classList' in document.createElementNS('http://www.w3.org/2000/svg', 'g'))) {
    var protoProp = 'prototype';
    var strTrim = String.prototype.trim;
    var arrIndexOf = Array.prototype.indexOf;
    var emptyArray = [];

    var DOMEx = function DOMEx(type, message) {
      this.name = type;
      this.code = DOMException[type];
      this.message = message;
    };

    var checkTokenAndGetIndex = function checkTokenAndGetIndex(classList, token) {
      if (token === '') {
        throw new DOMEx('SYNTAX_ERR', 'An invalid or illegal string was specified');
      }

      if (/\s/.test(token)) {
        throw new DOMEx('INVALID_CHARACTER_ERR', 'String contains an invalid character');
      }

      return arrIndexOf.call(classList, token);
    };

    var ClassList = function ClassList(elem) {
      var trimmedClasses = strTrim.call(elem.getAttribute('class') || '');
      var classes = trimmedClasses ? trimmedClasses.split(/\s+/) : emptyArray;

      for (var i = 0, ii = classes.length; i < ii; ++i) {
        this.push(classes[i]);
      }

      this._updateClassName = function () {
        elem.setAttribute('class', this.toString());
      };
    };

    var classListProto = ClassList[protoProp] = [];

    DOMEx[protoProp] = Error[protoProp];

    classListProto.item = function (i) {
      return this[i] || null;
    };

    classListProto.contains = function (token) {
      token += '';
      return checkTokenAndGetIndex(this, token) !== -1;
    };

    classListProto.add = function () {
      var tokens = arguments;
      var i = 0;
      var ii = tokens.length;
      var token = void 0;
      var updated = false;

      do {
        token = tokens[i] + '';
        if (checkTokenAndGetIndex(this, token) === -1) {
          this.push(token);
          updated = true;
        }
      } while (++i < ii);

      if (updated) {
        this._updateClassName();
      }
    };

    classListProto.remove = function () {
      var tokens = arguments;
      var i = 0;
      var ii = tokens.length;
      var token = void 0;
      var updated = false;
      var index = void 0;

      do {
        token = tokens[i] + '';
        index = checkTokenAndGetIndex(this, token);
        while (index !== -1) {
          this.splice(index, 1);
          updated = true;
          index = checkTokenAndGetIndex(this, token);
        }
      } while (++i < ii);

      if (updated) {
        this._updateClassName();
      }
    };

    classListProto.toggle = function (token, force) {
      token += '';

      var result = this.contains(token);
      var method = result ? force !== true && 'remove' : force !== false && 'add';

      if (method) {
        this[method](token);
      }

      if (force === true || force === false) {
        return force;
      }

      return !result;
    };

    classListProto.toString = function () {
      return this.join(' ');
    };

    Object.defineProperty(Element.prototype, 'classList', {
      get: function get() {
        return new ClassList(this);
      },
      enumerable: true,
      configurable: true
    });
  } else {
    var testElement = document.createElement('_');
    testElement.classList.add('c1', 'c2');

    if (!testElement.classList.contains('c2')) {
      var createMethod = function createMethod(method) {
        var original = DOMTokenList.prototype[method];

        DOMTokenList.prototype[method] = function (token) {
          for (var i = 0, ii = arguments.length; i < ii; ++i) {
            token = arguments[i];
            original.call(this, token);
          }
        };
      };

      createMethod('add');
      createMethod('remove');
    }

    testElement.classList.toggle('c3', false);

    if (testElement.classList.contains('c3')) {
      var _toggle = DOMTokenList.prototype.toggle;

      DOMTokenList.prototype.toggle = function (token, force) {
        if (1 in arguments && !this.contains(token) === !force) {
          return force;
        }

        return _toggle.call(this, token);
      };
    }

    testElement = null;
  }
}

if (typeof FEATURE_NO_IE === 'undefined') {
  var _filterEntries = function _filterEntries(key, value) {
    var i = 0,
        n = _entries.length,
        result = [];
    for (; i < n; i++) {
      if (_entries[i][key] == value) {
        result.push(_entries[i]);
      }
    }
    return result;
  };

  var _clearEntries = function _clearEntries(type, name) {
    var i = _entries.length,
        entry;
    while (i--) {
      entry = _entries[i];
      if (entry.entryType == type && (name === void 0 || entry.name == name)) {
        _entries.splice(i, 1);
      }
    }
  };

  // @license http://opensource.org/licenses/MIT
  if ('performance' in window === false) {
    window.performance = {};
  }

  if ('now' in window.performance === false) {
    var nowOffset = Date.now();

    if (performance.timing && performance.timing.navigationStart) {
      nowOffset = performance.timing.navigationStart;
    }

    window.performance.now = function now() {
      return Date.now() - nowOffset;
    };
  }

  var startOffset = Date.now ? Date.now() : +new Date();
  var _entries = [];
  var _marksIndex = {};

  ;

  if (!window.performance.mark) {
    window.performance.mark = window.performance.webkitMark || function (name) {
      var mark = {
        name: name,
        entryType: "mark",
        startTime: window.performance.now(),
        duration: 0
      };

      _entries.push(mark);
      _marksIndex[name] = mark;
    };
  }

  if (!window.performance.measure) {
    window.performance.measure = window.performance.webkitMeasure || function (name, startMark, endMark) {
      startMark = _marksIndex[startMark].startTime;
      endMark = _marksIndex[endMark].startTime;

      _entries.push({
        name: name,
        entryType: "measure",
        startTime: startMark,
        duration: endMark - startMark
      });
    };
  }

  if (!window.performance.getEntriesByType) {
    window.performance.getEntriesByType = window.performance.webkitGetEntriesByType || function (type) {
      return _filterEntries("entryType", type);
    };
  }

  if (!window.performance.getEntriesByName) {
    window.performance.getEntriesByName = window.performance.webkitGetEntriesByName || function (name) {
      return _filterEntries("name", name);
    };
  }

  if (!window.performance.clearMarks) {
    window.performance.clearMarks = window.performance.webkitClearMarks || function (name) {
      _clearEntries("mark", name);
    };
  }

  if (!window.performance.clearMeasures) {
    window.performance.clearMeasures = window.performance.webkitClearMeasures || function (name) {
      _clearEntries("measure", name);
    };
  }

  _PLATFORM.performance = window.performance;
}

if (typeof FEATURE_NO_IE === 'undefined') {
  var con = window.console = window.console || {};
  var nop = function nop() {};

  if (!con.memory) con.memory = {};
  ('assert,clear,count,debug,dir,dirxml,error,exception,group,' + 'groupCollapsed,groupEnd,info,log,markTimeline,profile,profiles,profileEnd,' + 'show,table,time,timeEnd,timeline,timelineEnd,timeStamp,trace,warn').split(',').forEach(function (m) {
    if (!con[m]) con[m] = nop;
  });

  if (_typeof(con.log) === 'object') {
    'log,info,warn,error,assert,dir,clear,profile,profileEnd'.split(',').forEach(function (method) {
      console[method] = this.bind(console[method], console);
    }, Function.prototype.call);
  }
}

if (typeof FEATURE_NO_IE === 'undefined') {
  if (!window.CustomEvent || typeof window.CustomEvent !== 'function') {
    var _CustomEvent = function _CustomEvent(event, params) {
      params = params || {
        bubbles: false,
        cancelable: false,
        detail: undefined
      };

      var evt = document.createEvent('CustomEvent');
      evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
      return evt;
    };

    _CustomEvent.prototype = window.Event.prototype;
    window.CustomEvent = _CustomEvent;
  }
}

if (Element && !Element.prototype.matches) {
  var proto = Element.prototype;
  proto.matches = proto.matchesSelector || proto.mozMatchesSelector || proto.msMatchesSelector || proto.oMatchesSelector || proto.webkitMatchesSelector;
}

var _FEATURE = {
  shadowDOM: !!HTMLElement.prototype.attachShadow,
  scopedCSS: 'scoped' in document.createElement('style'),
  htmlTemplateElement: function () {
    var d = document.createElement('div');
    d.innerHTML = '<template></template>';
    return 'content' in d.children[0];
  }(),
  mutationObserver: !!(window.MutationObserver || window.WebKitMutationObserver),
  ensureHTMLTemplateElement: function ensureHTMLTemplateElement(t) {
    return t;
  }
};

if (typeof FEATURE_NO_IE === 'undefined') {
  var isSVGTemplate = function isSVGTemplate(el) {
    return el.tagName === 'template' && el.namespaceURI === 'http://www.w3.org/2000/svg';
  };

  var fixSVGTemplateElement = function fixSVGTemplateElement(el) {
    var template = el.ownerDocument.createElement('template');
    var attrs = el.attributes;
    var length = attrs.length;
    var attr = void 0;

    el.parentNode.insertBefore(template, el);

    while (length-- > 0) {
      attr = attrs[length];
      template.setAttribute(attr.name, attr.value);
      el.removeAttribute(attr.name);
    }

    el.parentNode.removeChild(el);

    return fixHTMLTemplateElement(template);
  };

  var fixHTMLTemplateElement = function fixHTMLTemplateElement(template) {
    var content = template.content = document.createDocumentFragment();
    var child = void 0;

    while (child = template.firstChild) {
      content.appendChild(child);
    }

    return template;
  };

  var fixHTMLTemplateElementRoot = function fixHTMLTemplateElementRoot(template) {
    var content = fixHTMLTemplateElement(template).content;
    var childTemplates = content.querySelectorAll('template');

    for (var i = 0, ii = childTemplates.length; i < ii; ++i) {
      var child = childTemplates[i];

      if (isSVGTemplate(child)) {
        fixSVGTemplateElement(child);
      } else {
        fixHTMLTemplateElement(child);
      }
    }

    return template;
  };

  if (!_FEATURE.htmlTemplateElement) {
    _FEATURE.ensureHTMLTemplateElement = fixHTMLTemplateElementRoot;
  }
}

var shadowPoly = window.ShadowDOMPolyfill || null;

var _DOM = {
  Element: Element,
  NodeList: NodeList,
  SVGElement: SVGElement,
  boundary: 'aurelia-dom-boundary',
  addEventListener: function addEventListener(eventName, callback, capture) {
    document.addEventListener(eventName, callback, capture);
  },
  removeEventListener: function removeEventListener(eventName, callback, capture) {
    document.removeEventListener(eventName, callback, capture);
  },
  adoptNode: function adoptNode(node) {
    return document.adoptNode(node);
  },
  createAttribute: function createAttribute(name) {
    return document.createAttribute(name);
  },
  createElement: function createElement(tagName) {
    return document.createElement(tagName);
  },
  createTextNode: function createTextNode(text) {
    return document.createTextNode(text);
  },
  createComment: function createComment(text) {
    return document.createComment(text);
  },
  createDocumentFragment: function createDocumentFragment() {
    return document.createDocumentFragment();
  },
  createTemplateElement: function createTemplateElement() {
    var template = document.createElement('template');
    return _FEATURE.ensureHTMLTemplateElement(template);
  },
  createMutationObserver: function createMutationObserver(callback) {
    return new (window.MutationObserver || window.WebKitMutationObserver)(callback);
  },
  createCustomEvent: function createCustomEvent(eventType, options) {
    return new window.CustomEvent(eventType, options);
  },
  dispatchEvent: function dispatchEvent(evt) {
    document.dispatchEvent(evt);
  },
  getComputedStyle: function getComputedStyle(element) {
    return window.getComputedStyle(element);
  },
  getElementById: function getElementById(id) {
    return document.getElementById(id);
  },
  querySelector: function querySelector(query) {
    return document.querySelector(query);
  },
  querySelectorAll: function querySelectorAll(query) {
    return document.querySelectorAll(query);
  },
  nextElementSibling: function nextElementSibling(element) {
    if (element.nextElementSibling) {
      return element.nextElementSibling;
    }
    do {
      element = element.nextSibling;
    } while (element && element.nodeType !== 1);
    return element;
  },
  createTemplateFromMarkup: function createTemplateFromMarkup(markup) {
    var parser = document.createElement('div');
    parser.innerHTML = markup;

    var temp = parser.firstElementChild;
    if (!temp || temp.nodeName !== 'TEMPLATE') {
      throw new Error('Template markup must be wrapped in a <template> element e.g. <template> <!-- markup here --> </template>');
    }

    return _FEATURE.ensureHTMLTemplateElement(temp);
  },
  appendNode: function appendNode(newNode, parentNode) {
    (parentNode || document.body).appendChild(newNode);
  },
  replaceNode: function replaceNode(newNode, node, parentNode) {
    if (node.parentNode) {
      node.parentNode.replaceChild(newNode, node);
    } else if (shadowPoly !== null) {
      shadowPoly.unwrap(parentNode).replaceChild(shadowPoly.unwrap(newNode), shadowPoly.unwrap(node));
    } else {
      parentNode.replaceChild(newNode, node);
    }
  },
  removeNode: function removeNode(node, parentNode) {
    if (node.parentNode) {
      node.parentNode.removeChild(node);
    } else if (parentNode) {
      if (shadowPoly !== null) {
        shadowPoly.unwrap(parentNode).removeChild(shadowPoly.unwrap(node));
      } else {
        parentNode.removeChild(node);
      }
    }
  },
  injectStyles: function injectStyles(styles, destination, prepend, id) {
    if (id) {
      var oldStyle = document.getElementById(id);
      if (oldStyle) {
        var isStyleTag = oldStyle.tagName.toLowerCase() === 'style';

        if (isStyleTag) {
          oldStyle.innerHTML = styles;
          return;
        }

        throw new Error('The provided id does not indicate a style tag.');
      }
    }

    var node = document.createElement('style');
    node.innerHTML = styles;
    node.type = 'text/css';

    if (id) {
      node.id = id;
    }

    destination = destination || document.head;

    if (prepend && destination.childNodes.length > 0) {
      destination.insertBefore(node, destination.childNodes[0]);
    } else {
      destination.appendChild(node);
    }

    return node;
  }
};

function initialize() {
  if (__WEBPACK_IMPORTED_MODULE_0_aurelia_pal__["b" /* isInitialized */]) {
    return;
  }

  __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0_aurelia_pal__["f" /* initializePAL */])(function (platform, feature, dom) {
    Object.assign(platform, _PLATFORM);
    Object.assign(feature, _FEATURE);
    Object.assign(dom, _DOM);

    Object.defineProperty(dom, 'title', {
      get: function get() {
        return document.title;
      },
      set: function set(value) {
        document.title = value;
      }
    });

    Object.defineProperty(dom, 'activeElement', {
      get: function get() {
        return document.activeElement;
      }
    });

    Object.defineProperty(platform, 'XMLHttpRequest', {
      get: function get() {
        return platform.global.XMLHttpRequest;
      }
    });
  });
}

/***/ }),

/***/ "aurelia-templating-binding":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export AttributeMap */
/* unused harmony export InterpolationBindingExpression */
/* unused harmony export InterpolationBinding */
/* unused harmony export ChildInterpolationBinding */
/* unused harmony export LetExpression */
/* unused harmony export LetBinding */
/* unused harmony export LetInterpolationBindingExpression */
/* unused harmony export LetInterpolationBinding */
/* unused harmony export SyntaxInterpreter */
/* unused harmony export TemplatingBindingLanguage */
/* harmony export (immutable) */ __webpack_exports__["configure"] = configure;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_aurelia_logging__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_aurelia_binding__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_aurelia_templating__ = __webpack_require__(2);
var _class, _temp, _dec, _class2, _dec2, _class3, _class4, _temp2, _class5, _temp3;

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }







var AttributeMap = (_temp = _class = function () {
  function AttributeMap(svg) {
    

    this.elements = Object.create(null);
    this.allElements = Object.create(null);

    this.svg = svg;

    this.registerUniversal('accesskey', 'accessKey');
    this.registerUniversal('contenteditable', 'contentEditable');
    this.registerUniversal('tabindex', 'tabIndex');
    this.registerUniversal('textcontent', 'textContent');
    this.registerUniversal('innerhtml', 'innerHTML');
    this.registerUniversal('scrolltop', 'scrollTop');
    this.registerUniversal('scrollleft', 'scrollLeft');
    this.registerUniversal('readonly', 'readOnly');

    this.register('label', 'for', 'htmlFor');

    this.register('img', 'usemap', 'useMap');

    this.register('input', 'maxlength', 'maxLength');
    this.register('input', 'minlength', 'minLength');
    this.register('input', 'formaction', 'formAction');
    this.register('input', 'formenctype', 'formEncType');
    this.register('input', 'formmethod', 'formMethod');
    this.register('input', 'formnovalidate', 'formNoValidate');
    this.register('input', 'formtarget', 'formTarget');

    this.register('textarea', 'maxlength', 'maxLength');

    this.register('td', 'rowspan', 'rowSpan');
    this.register('td', 'colspan', 'colSpan');
    this.register('th', 'rowspan', 'rowSpan');
    this.register('th', 'colspan', 'colSpan');
  }

  AttributeMap.prototype.register = function register(elementName, attributeName, propertyName) {
    elementName = elementName.toLowerCase();
    attributeName = attributeName.toLowerCase();
    var element = this.elements[elementName] = this.elements[elementName] || Object.create(null);
    element[attributeName] = propertyName;
  };

  AttributeMap.prototype.registerUniversal = function registerUniversal(attributeName, propertyName) {
    attributeName = attributeName.toLowerCase();
    this.allElements[attributeName] = propertyName;
  };

  AttributeMap.prototype.map = function map(elementName, attributeName) {
    if (this.svg.isStandardSvgAttribute(elementName, attributeName)) {
      return attributeName;
    }
    elementName = elementName.toLowerCase();
    attributeName = attributeName.toLowerCase();
    var element = this.elements[elementName];
    if (element !== undefined && attributeName in element) {
      return element[attributeName];
    }
    if (attributeName in this.allElements) {
      return this.allElements[attributeName];
    }

    if (/(?:^data-)|(?:^aria-)|:/.test(attributeName)) {
      return attributeName;
    }
    return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_aurelia_binding__["b" /* camelCase */])(attributeName);
  };

  return AttributeMap;
}(), _class.inject = [__WEBPACK_IMPORTED_MODULE_1_aurelia_binding__["r" /* SVGAnalyzer */]], _temp);

var InterpolationBindingExpression = function () {
  function InterpolationBindingExpression(observerLocator, targetProperty, parts, mode, lookupFunctions, attribute) {
    

    this.observerLocator = observerLocator;
    this.targetProperty = targetProperty;
    this.parts = parts;
    this.mode = mode;
    this.lookupFunctions = lookupFunctions;
    this.attribute = this.attrToRemove = attribute;
    this.discrete = false;
  }

  InterpolationBindingExpression.prototype.createBinding = function createBinding(target) {
    if (this.parts.length === 3) {
      return new ChildInterpolationBinding(target, this.observerLocator, this.parts[1], this.mode, this.lookupFunctions, this.targetProperty, this.parts[0], this.parts[2]);
    }
    return new InterpolationBinding(this.observerLocator, this.parts, target, this.targetProperty, this.mode, this.lookupFunctions);
  };

  return InterpolationBindingExpression;
}();

function validateTarget(target, propertyName) {
  if (propertyName === 'style') {
    __WEBPACK_IMPORTED_MODULE_0_aurelia_logging__["getLogger"]('templating-binding').info('Internet Explorer does not support interpolation in "style" attributes.  Use the style attribute\'s alias, "css" instead.');
  } else if (target.parentElement && target.parentElement.nodeName === 'TEXTAREA' && propertyName === 'textContent') {
    throw new Error('Interpolation binding cannot be used in the content of a textarea element.  Use <textarea value.bind="expression"></textarea> instead.');
  }
}

var InterpolationBinding = function () {
  function InterpolationBinding(observerLocator, parts, target, targetProperty, mode, lookupFunctions) {
    

    validateTarget(target, targetProperty);
    this.observerLocator = observerLocator;
    this.parts = parts;
    this.target = target;
    this.targetProperty = targetProperty;
    this.targetAccessor = observerLocator.getAccessor(target, targetProperty);
    this.mode = mode;
    this.lookupFunctions = lookupFunctions;
  }

  InterpolationBinding.prototype.interpolate = function interpolate() {
    if (this.isBound) {
      var value = '';
      var parts = this.parts;
      for (var i = 0, ii = parts.length; i < ii; i++) {
        value += i % 2 === 0 ? parts[i] : this['childBinding' + i].value;
      }
      this.targetAccessor.setValue(value, this.target, this.targetProperty);
    }
  };

  InterpolationBinding.prototype.updateOneTimeBindings = function updateOneTimeBindings() {
    for (var i = 1, ii = this.parts.length; i < ii; i += 2) {
      var child = this['childBinding' + i];
      if (child.mode === __WEBPACK_IMPORTED_MODULE_1_aurelia_binding__["f" /* bindingMode */].oneTime) {
        child.call();
      }
    }
  };

  InterpolationBinding.prototype.bind = function bind(source) {
    if (this.isBound) {
      if (this.source === source) {
        return;
      }
      this.unbind();
    }
    this.source = source;

    var parts = this.parts;
    for (var i = 1, ii = parts.length; i < ii; i += 2) {
      var binding = new ChildInterpolationBinding(this, this.observerLocator, parts[i], this.mode, this.lookupFunctions);
      binding.bind(source);
      this['childBinding' + i] = binding;
    }

    this.isBound = true;
    this.interpolate();
  };

  InterpolationBinding.prototype.unbind = function unbind() {
    if (!this.isBound) {
      return;
    }
    this.isBound = false;
    this.source = null;
    var parts = this.parts;
    for (var i = 1, ii = parts.length; i < ii; i += 2) {
      var name = 'childBinding' + i;
      this[name].unbind();
    }
  };

  return InterpolationBinding;
}();

var ChildInterpolationBinding = (_dec = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_aurelia_binding__["s" /* connectable */])(), _dec(_class2 = function () {
  function ChildInterpolationBinding(target, observerLocator, sourceExpression, mode, lookupFunctions, targetProperty, left, right) {
    

    if (target instanceof InterpolationBinding) {
      this.parent = target;
    } else {
      validateTarget(target, targetProperty);
      this.target = target;
      this.targetProperty = targetProperty;
      this.targetAccessor = observerLocator.getAccessor(target, targetProperty);
    }
    this.observerLocator = observerLocator;
    this.sourceExpression = sourceExpression;
    this.mode = mode;
    this.lookupFunctions = lookupFunctions;
    this.left = left;
    this.right = right;
  }

  ChildInterpolationBinding.prototype.updateTarget = function updateTarget(value) {
    value = value === null || value === undefined ? '' : value.toString();
    if (value !== this.value) {
      this.value = value;
      if (this.parent) {
        this.parent.interpolate();
      } else {
        this.targetAccessor.setValue(this.left + value + this.right, this.target, this.targetProperty);
      }
    }
  };

  ChildInterpolationBinding.prototype.call = function call() {
    if (!this.isBound) {
      return;
    }

    this.rawValue = this.sourceExpression.evaluate(this.source, this.lookupFunctions);
    this.updateTarget(this.rawValue);

    if (this.mode !== __WEBPACK_IMPORTED_MODULE_1_aurelia_binding__["f" /* bindingMode */].oneTime) {
      this._version++;
      this.sourceExpression.connect(this, this.source);
      if (this.rawValue instanceof Array) {
        this.observeArray(this.rawValue);
      }
      this.unobserve(false);
    }
  };

  ChildInterpolationBinding.prototype.bind = function bind(source) {
    if (this.isBound) {
      if (this.source === source) {
        return;
      }
      this.unbind();
    }
    this.isBound = true;
    this.source = source;

    var sourceExpression = this.sourceExpression;
    if (sourceExpression.bind) {
      sourceExpression.bind(this, source, this.lookupFunctions);
    }

    this.rawValue = sourceExpression.evaluate(source, this.lookupFunctions);
    this.updateTarget(this.rawValue);

    if (this.mode === __WEBPACK_IMPORTED_MODULE_1_aurelia_binding__["f" /* bindingMode */].oneWay) {
      __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_aurelia_binding__["t" /* enqueueBindingConnect */])(this);
    }
  };

  ChildInterpolationBinding.prototype.unbind = function unbind() {
    if (!this.isBound) {
      return;
    }
    this.isBound = false;
    var sourceExpression = this.sourceExpression;
    if (sourceExpression.unbind) {
      sourceExpression.unbind(this, this.source);
    }
    this.source = null;
    this.value = null;
    this.rawValue = null;
    this.unobserve(true);
  };

  ChildInterpolationBinding.prototype.connect = function connect(evaluate) {
    if (!this.isBound) {
      return;
    }
    if (evaluate) {
      this.rawValue = this.sourceExpression.evaluate(this.source, this.lookupFunctions);
      this.updateTarget(this.rawValue);
    }
    this.sourceExpression.connect(this, this.source);
    if (this.rawValue instanceof Array) {
      this.observeArray(this.rawValue);
    }
  };

  return ChildInterpolationBinding;
}()) || _class2);

var LetExpression = function () {
  function LetExpression(observerLocator, targetProperty, sourceExpression, lookupFunctions, toBindingContext) {
    

    this.observerLocator = observerLocator;
    this.sourceExpression = sourceExpression;
    this.targetProperty = targetProperty;
    this.lookupFunctions = lookupFunctions;
    this.toBindingContext = toBindingContext;
  }

  LetExpression.prototype.createBinding = function createBinding() {
    return new LetBinding(this.observerLocator, this.sourceExpression, this.targetProperty, this.lookupFunctions, this.toBindingContext);
  };

  return LetExpression;
}();

var LetBinding = (_dec2 = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_aurelia_binding__["s" /* connectable */])(), _dec2(_class3 = function () {
  function LetBinding(observerLocator, sourceExpression, targetProperty, lookupFunctions, toBindingContext) {
    

    this.observerLocator = observerLocator;
    this.sourceExpression = sourceExpression;
    this.targetProperty = targetProperty;
    this.lookupFunctions = lookupFunctions;
    this.source = null;
    this.target = null;
    this.toBindingContext = toBindingContext;
  }

  LetBinding.prototype.updateTarget = function updateTarget() {
    var value = this.sourceExpression.evaluate(this.source, this.lookupFunctions);
    this.target[this.targetProperty] = value;
  };

  LetBinding.prototype.call = function call(context) {
    if (!this.isBound) {
      return;
    }
    if (context === __WEBPACK_IMPORTED_MODULE_1_aurelia_binding__["k" /* sourceContext */]) {
      this.updateTarget();
      return;
    }
    throw new Error('Unexpected call context ' + context);
  };

  LetBinding.prototype.bind = function bind(source) {
    if (this.isBound) {
      if (this.source === source) {
        return;
      }
      this.unbind();
    }

    this.isBound = true;
    this.source = source;
    this.target = this.toBindingContext ? source.bindingContext : source.overrideContext;

    if (this.sourceExpression.bind) {
      this.sourceExpression.bind(this, source, this.lookupFunctions);
    }

    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_aurelia_binding__["t" /* enqueueBindingConnect */])(this);
  };

  LetBinding.prototype.unbind = function unbind() {
    if (!this.isBound) {
      return;
    }
    this.isBound = false;
    if (this.sourceExpression.unbind) {
      this.sourceExpression.unbind(this, this.source);
    }
    this.source = null;
    this.target = null;
    this.unobserve(true);
  };

  LetBinding.prototype.connect = function connect() {
    if (!this.isBound) {
      return;
    }
    this.updateTarget();
    this.sourceExpression.connect(this, this.source);
  };

  return LetBinding;
}()) || _class3);

var LetInterpolationBindingExpression = function () {
  function LetInterpolationBindingExpression(observerLocator, targetProperty, parts, lookupFunctions, toBindingContext) {
    

    this.observerLocator = observerLocator;
    this.targetProperty = targetProperty;
    this.parts = parts;
    this.lookupFunctions = lookupFunctions;
    this.toBindingContext = toBindingContext;
  }

  LetInterpolationBindingExpression.prototype.createBinding = function createBinding() {
    return new LetInterpolationBinding(this.observerLocator, this.targetProperty, this.parts, this.lookupFunctions, this.toBindingContext);
  };

  return LetInterpolationBindingExpression;
}();

var LetInterpolationBinding = function () {
  function LetInterpolationBinding(observerLocator, targetProperty, parts, lookupFunctions, toBindingContext) {
    

    this.observerLocator = observerLocator;
    this.parts = parts;
    this.targetProperty = targetProperty;
    this.lookupFunctions = lookupFunctions;
    this.toBindingContext = toBindingContext;
    this.target = null;
  }

  LetInterpolationBinding.prototype.bind = function bind(source) {
    if (this.isBound) {
      if (this.source === source) {
        return;
      }
      this.unbind();
    }

    this.isBound = true;
    this.source = source;
    this.target = this.toBindingContext ? source.bindingContext : source.overrideContext;

    this.interpolationBinding = this.createInterpolationBinding();
    this.interpolationBinding.bind(source);
  };

  LetInterpolationBinding.prototype.unbind = function unbind() {
    if (!this.isBound) {
      return;
    }
    this.isBound = false;
    this.source = null;
    this.target = null;
    this.interpolationBinding.unbind();
    this.interpolationBinding = null;
  };

  LetInterpolationBinding.prototype.createInterpolationBinding = function createInterpolationBinding() {
    if (this.parts.length === 3) {
      return new ChildInterpolationBinding(this.target, this.observerLocator, this.parts[1], __WEBPACK_IMPORTED_MODULE_1_aurelia_binding__["f" /* bindingMode */].oneWay, this.lookupFunctions, this.targetProperty, this.parts[0], this.parts[2]);
    }
    return new InterpolationBinding(this.observerLocator, this.parts, this.target, this.targetProperty, __WEBPACK_IMPORTED_MODULE_1_aurelia_binding__["f" /* bindingMode */].oneWay, this.lookupFunctions);
  };

  return LetInterpolationBinding;
}();

var SyntaxInterpreter = (_temp2 = _class4 = function () {
  function SyntaxInterpreter(parser, observerLocator, eventManager, attributeMap) {
    

    this.parser = parser;
    this.observerLocator = observerLocator;
    this.eventManager = eventManager;
    this.attributeMap = attributeMap;
  }

  SyntaxInterpreter.prototype.interpret = function interpret(resources, element, info, existingInstruction, context) {
    if (info.command in this) {
      return this[info.command](resources, element, info, existingInstruction, context);
    }

    return this.handleUnknownCommand(resources, element, info, existingInstruction, context);
  };

  SyntaxInterpreter.prototype.handleUnknownCommand = function handleUnknownCommand(resources, element, info, existingInstruction, context) {
    __WEBPACK_IMPORTED_MODULE_0_aurelia_logging__["getLogger"]('templating-binding').warn('Unknown binding command.', info);
    return existingInstruction;
  };

  SyntaxInterpreter.prototype.determineDefaultBindingMode = function determineDefaultBindingMode(element, attrName, context) {
    var tagName = element.tagName.toLowerCase();

    if (tagName === 'input' && (attrName === 'value' || attrName === 'files') && element.type !== 'checkbox' && element.type !== 'radio' || tagName === 'input' && attrName === 'checked' && (element.type === 'checkbox' || element.type === 'radio') || (tagName === 'textarea' || tagName === 'select') && attrName === 'value' || (attrName === 'textcontent' || attrName === 'innerhtml') && element.contentEditable === 'true' || attrName === 'scrolltop' || attrName === 'scrollleft') {
      return __WEBPACK_IMPORTED_MODULE_1_aurelia_binding__["f" /* bindingMode */].twoWay;
    }

    if (context && attrName in context.attributes && context.attributes[attrName] && context.attributes[attrName].defaultBindingMode >= __WEBPACK_IMPORTED_MODULE_1_aurelia_binding__["f" /* bindingMode */].oneTime) {
      return context.attributes[attrName].defaultBindingMode;
    }

    return __WEBPACK_IMPORTED_MODULE_1_aurelia_binding__["f" /* bindingMode */].oneWay;
  };

  SyntaxInterpreter.prototype.bind = function bind(resources, element, info, existingInstruction, context) {
    var instruction = existingInstruction || __WEBPACK_IMPORTED_MODULE_2_aurelia_templating__["j" /* BehaviorInstruction */].attribute(info.attrName);

    instruction.attributes[info.attrName] = new __WEBPACK_IMPORTED_MODULE_1_aurelia_binding__["u" /* BindingExpression */](this.observerLocator, this.attributeMap.map(element.tagName, info.attrName), this.parser.parse(info.attrValue), info.defaultBindingMode === undefined || info.defaultBindingMode === null ? this.determineDefaultBindingMode(element, info.attrName, context) : info.defaultBindingMode, resources.lookupFunctions);

    return instruction;
  };

  SyntaxInterpreter.prototype.trigger = function trigger(resources, element, info) {
    return new __WEBPACK_IMPORTED_MODULE_1_aurelia_binding__["v" /* ListenerExpression */](this.eventManager, info.attrName, this.parser.parse(info.attrValue), __WEBPACK_IMPORTED_MODULE_1_aurelia_binding__["w" /* delegationStrategy */].none, true, resources.lookupFunctions);
  };

  SyntaxInterpreter.prototype.capture = function capture(resources, element, info) {
    return new __WEBPACK_IMPORTED_MODULE_1_aurelia_binding__["v" /* ListenerExpression */](this.eventManager, info.attrName, this.parser.parse(info.attrValue), __WEBPACK_IMPORTED_MODULE_1_aurelia_binding__["w" /* delegationStrategy */].capturing, true, resources.lookupFunctions);
  };

  SyntaxInterpreter.prototype.delegate = function delegate(resources, element, info) {
    return new __WEBPACK_IMPORTED_MODULE_1_aurelia_binding__["v" /* ListenerExpression */](this.eventManager, info.attrName, this.parser.parse(info.attrValue), __WEBPACK_IMPORTED_MODULE_1_aurelia_binding__["w" /* delegationStrategy */].bubbling, true, resources.lookupFunctions);
  };

  SyntaxInterpreter.prototype.call = function call(resources, element, info, existingInstruction) {
    var instruction = existingInstruction || __WEBPACK_IMPORTED_MODULE_2_aurelia_templating__["j" /* BehaviorInstruction */].attribute(info.attrName);

    instruction.attributes[info.attrName] = new __WEBPACK_IMPORTED_MODULE_1_aurelia_binding__["x" /* CallExpression */](this.observerLocator, info.attrName, this.parser.parse(info.attrValue), resources.lookupFunctions);

    return instruction;
  };

  SyntaxInterpreter.prototype.options = function options(resources, element, info, existingInstruction, context) {
    var instruction = existingInstruction || __WEBPACK_IMPORTED_MODULE_2_aurelia_templating__["j" /* BehaviorInstruction */].attribute(info.attrName);
    var attrValue = info.attrValue;
    var language = this.language;
    var name = null;
    var target = '';
    var current = void 0;
    var i = void 0;
    var ii = void 0;
    var inString = false;
    var inEscape = false;
    var foundName = false;

    for (i = 0, ii = attrValue.length; i < ii; ++i) {
      current = attrValue[i];

      if (current === ';' && !inString) {
        if (!foundName) {
          name = this._getPrimaryPropertyName(resources, context);
        }
        info = language.inspectAttribute(resources, '?', name, target.trim());
        language.createAttributeInstruction(resources, element, info, instruction, context);

        if (!instruction.attributes[info.attrName]) {
          instruction.attributes[info.attrName] = info.attrValue;
        }

        target = '';
        name = null;
      } else if (current === ':' && name === null) {
        foundName = true;
        name = target.trim();
        target = '';
      } else if (current === '\\') {
        target += current;
        inEscape = true;
        continue;
      } else {
        target += current;

        if (name !== null && inEscape === false && current === '\'') {
          inString = !inString;
        }
      }

      inEscape = false;
    }

    if (!foundName) {
      name = this._getPrimaryPropertyName(resources, context);
    }

    if (name !== null) {
      info = language.inspectAttribute(resources, '?', name, target.trim());
      language.createAttributeInstruction(resources, element, info, instruction, context);

      if (!instruction.attributes[info.attrName]) {
        instruction.attributes[info.attrName] = info.attrValue;
      }
    }

    return instruction;
  };

  SyntaxInterpreter.prototype._getPrimaryPropertyName = function _getPrimaryPropertyName(resources, context) {
    var type = resources.getAttribute(context.attributeName);
    if (type && type.primaryProperty) {
      return type.primaryProperty.attribute;
    }
    return null;
  };

  SyntaxInterpreter.prototype['for'] = function _for(resources, element, info, existingInstruction) {
    var parts = void 0;
    var keyValue = void 0;
    var instruction = void 0;
    var attrValue = void 0;
    var isDestructuring = void 0;

    attrValue = info.attrValue;
    isDestructuring = attrValue.match(/^ *[[].+[\]]/);
    parts = isDestructuring ? attrValue.split('of ') : attrValue.split(' of ');

    if (parts.length !== 2) {
      throw new Error('Incorrect syntax for "for". The form is: "$local of $items" or "[$key, $value] of $items".');
    }

    instruction = existingInstruction || __WEBPACK_IMPORTED_MODULE_2_aurelia_templating__["j" /* BehaviorInstruction */].attribute(info.attrName);

    if (isDestructuring) {
      keyValue = parts[0].replace(/[[\]]/g, '').replace(/,/g, ' ').replace(/\s+/g, ' ').trim().split(' ');
      instruction.attributes.key = keyValue[0];
      instruction.attributes.value = keyValue[1];
    } else {
      instruction.attributes.local = parts[0];
    }

    instruction.attributes.items = new __WEBPACK_IMPORTED_MODULE_1_aurelia_binding__["u" /* BindingExpression */](this.observerLocator, 'items', this.parser.parse(parts[1]), __WEBPACK_IMPORTED_MODULE_1_aurelia_binding__["f" /* bindingMode */].oneWay, resources.lookupFunctions);

    return instruction;
  };

  SyntaxInterpreter.prototype['two-way'] = function twoWay(resources, element, info, existingInstruction) {
    var instruction = existingInstruction || __WEBPACK_IMPORTED_MODULE_2_aurelia_templating__["j" /* BehaviorInstruction */].attribute(info.attrName);

    instruction.attributes[info.attrName] = new __WEBPACK_IMPORTED_MODULE_1_aurelia_binding__["u" /* BindingExpression */](this.observerLocator, this.attributeMap.map(element.tagName, info.attrName), this.parser.parse(info.attrValue), __WEBPACK_IMPORTED_MODULE_1_aurelia_binding__["f" /* bindingMode */].twoWay, resources.lookupFunctions);

    return instruction;
  };

  SyntaxInterpreter.prototype['to-view'] = function toView(resources, element, info, existingInstruction) {
    var instruction = existingInstruction || __WEBPACK_IMPORTED_MODULE_2_aurelia_templating__["j" /* BehaviorInstruction */].attribute(info.attrName);

    instruction.attributes[info.attrName] = new __WEBPACK_IMPORTED_MODULE_1_aurelia_binding__["u" /* BindingExpression */](this.observerLocator, this.attributeMap.map(element.tagName, info.attrName), this.parser.parse(info.attrValue), __WEBPACK_IMPORTED_MODULE_1_aurelia_binding__["f" /* bindingMode */].toView, resources.lookupFunctions);

    return instruction;
  };

  SyntaxInterpreter.prototype['from-view'] = function fromView(resources, element, info, existingInstruction) {
    var instruction = existingInstruction || __WEBPACK_IMPORTED_MODULE_2_aurelia_templating__["j" /* BehaviorInstruction */].attribute(info.attrName);

    instruction.attributes[info.attrName] = new __WEBPACK_IMPORTED_MODULE_1_aurelia_binding__["u" /* BindingExpression */](this.observerLocator, this.attributeMap.map(element.tagName, info.attrName), this.parser.parse(info.attrValue), __WEBPACK_IMPORTED_MODULE_1_aurelia_binding__["f" /* bindingMode */].fromView, resources.lookupFunctions);

    return instruction;
  };

  SyntaxInterpreter.prototype['one-time'] = function oneTime(resources, element, info, existingInstruction) {
    var instruction = existingInstruction || __WEBPACK_IMPORTED_MODULE_2_aurelia_templating__["j" /* BehaviorInstruction */].attribute(info.attrName);

    instruction.attributes[info.attrName] = new __WEBPACK_IMPORTED_MODULE_1_aurelia_binding__["u" /* BindingExpression */](this.observerLocator, this.attributeMap.map(element.tagName, info.attrName), this.parser.parse(info.attrValue), __WEBPACK_IMPORTED_MODULE_1_aurelia_binding__["f" /* bindingMode */].oneTime, resources.lookupFunctions);

    return instruction;
  };

  return SyntaxInterpreter;
}(), _class4.inject = [__WEBPACK_IMPORTED_MODULE_1_aurelia_binding__["y" /* Parser */], __WEBPACK_IMPORTED_MODULE_1_aurelia_binding__["g" /* ObserverLocator */], __WEBPACK_IMPORTED_MODULE_1_aurelia_binding__["h" /* EventManager */], AttributeMap], _temp2);

SyntaxInterpreter.prototype['one-way'] = SyntaxInterpreter.prototype['to-view'];

var info = {};

var TemplatingBindingLanguage = (_temp3 = _class5 = function (_BindingLanguage) {
  _inherits(TemplatingBindingLanguage, _BindingLanguage);

  function TemplatingBindingLanguage(parser, observerLocator, syntaxInterpreter, attributeMap) {
    

    var _this = _possibleConstructorReturn(this, _BindingLanguage.call(this));

    _this.parser = parser;
    _this.observerLocator = observerLocator;
    _this.syntaxInterpreter = syntaxInterpreter;
    _this.emptyStringExpression = _this.parser.parse('\'\'');
    syntaxInterpreter.language = _this;
    _this.attributeMap = attributeMap;
    _this.toBindingContextAttr = 'to-binding-context';
    return _this;
  }

  TemplatingBindingLanguage.prototype.inspectAttribute = function inspectAttribute(resources, elementName, attrName, attrValue) {
    var parts = attrName.split('.');

    info.defaultBindingMode = null;

    if (parts.length === 2) {
      info.attrName = parts[0].trim();
      info.attrValue = attrValue;
      info.command = parts[1].trim();

      if (info.command === 'ref') {
        info.expression = new __WEBPACK_IMPORTED_MODULE_1_aurelia_binding__["z" /* NameExpression */](this.parser.parse(attrValue), info.attrName, resources.lookupFunctions);
        info.command = null;
        info.attrName = 'ref';
      } else {
        info.expression = null;
      }
    } else if (attrName === 'ref') {
      info.attrName = attrName;
      info.attrValue = attrValue;
      info.command = null;
      info.expression = new __WEBPACK_IMPORTED_MODULE_1_aurelia_binding__["z" /* NameExpression */](this.parser.parse(attrValue), 'element', resources.lookupFunctions);
    } else {
      info.attrName = attrName;
      info.attrValue = attrValue;
      info.command = null;
      var interpolationParts = this.parseInterpolation(resources, attrValue);
      if (interpolationParts === null) {
        info.expression = null;
      } else {
        info.expression = new InterpolationBindingExpression(this.observerLocator, this.attributeMap.map(elementName, attrName), interpolationParts, __WEBPACK_IMPORTED_MODULE_1_aurelia_binding__["f" /* bindingMode */].oneWay, resources.lookupFunctions, attrName);
      }
    }

    return info;
  };

  TemplatingBindingLanguage.prototype.createAttributeInstruction = function createAttributeInstruction(resources, element, theInfo, existingInstruction, context) {
    var instruction = void 0;

    if (theInfo.expression) {
      if (theInfo.attrName === 'ref') {
        return theInfo.expression;
      }

      instruction = existingInstruction || __WEBPACK_IMPORTED_MODULE_2_aurelia_templating__["j" /* BehaviorInstruction */].attribute(theInfo.attrName);
      instruction.attributes[theInfo.attrName] = theInfo.expression;
    } else if (theInfo.command) {
      instruction = this.syntaxInterpreter.interpret(resources, element, theInfo, existingInstruction, context);
    }

    return instruction;
  };

  TemplatingBindingLanguage.prototype.createLetExpressions = function createLetExpressions(resources, letElement) {
    var expressions = [];
    var attributes = letElement.attributes;

    var attr = void 0;

    var parts = void 0;
    var attrName = void 0;
    var attrValue = void 0;
    var command = void 0;
    var toBindingContextAttr = this.toBindingContextAttr;
    var toBindingContext = letElement.hasAttribute(toBindingContextAttr);
    for (var i = 0, ii = attributes.length; ii > i; ++i) {
      attr = attributes[i];
      attrName = attr.name;
      attrValue = attr.nodeValue;
      parts = attrName.split('.');

      if (attrName === toBindingContextAttr) {
        continue;
      }

      if (parts.length === 2) {
        command = parts[1];
        if (command !== 'bind') {
          __WEBPACK_IMPORTED_MODULE_0_aurelia_logging__["getLogger"]('templating-binding-language').warn('Detected invalid let command. Expected "' + parts[0] + '.bind", given "' + attrName + '"');
          continue;
        }
        expressions.push(new LetExpression(this.observerLocator, __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_aurelia_binding__["b" /* camelCase */])(parts[0]), this.parser.parse(attrValue), resources.lookupFunctions, toBindingContext));
      } else {
        attrName = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_aurelia_binding__["b" /* camelCase */])(attrName);
        parts = this.parseInterpolation(resources, attrValue);
        if (parts === null) {
          __WEBPACK_IMPORTED_MODULE_0_aurelia_logging__["getLogger"]('templating-binding-language').warn('Detected string literal in let bindings. Did you mean "' + attrName + '.bind=' + attrValue + '" or "' + attrName + '=${' + attrValue + '}" ?');
        }
        if (parts) {
          expressions.push(new LetInterpolationBindingExpression(this.observerLocator, attrName, parts, resources.lookupFunctions, toBindingContext));
        } else {
          expressions.push(new LetExpression(this.observerLocator, attrName, new __WEBPACK_IMPORTED_MODULE_1_aurelia_binding__["A" /* LiteralString */](attrValue), resources.lookupFunctions, toBindingContext));
        }
      }
    }
    return expressions;
  };

  TemplatingBindingLanguage.prototype.inspectTextContent = function inspectTextContent(resources, value) {
    var parts = this.parseInterpolation(resources, value);
    if (parts === null) {
      return null;
    }
    return new InterpolationBindingExpression(this.observerLocator, 'textContent', parts, __WEBPACK_IMPORTED_MODULE_1_aurelia_binding__["f" /* bindingMode */].oneWay, resources.lookupFunctions, 'textContent');
  };

  TemplatingBindingLanguage.prototype.parseInterpolation = function parseInterpolation(resources, value) {
    var i = value.indexOf('${', 0);
    var ii = value.length;
    var char = void 0;
    var pos = 0;
    var open = 0;
    var quote = null;
    var interpolationStart = void 0;
    var parts = void 0;
    var partIndex = 0;

    while (i >= 0 && i < ii - 2) {
      open = 1;
      interpolationStart = i;
      i += 2;

      do {
        char = value[i];
        i++;

        if (char === "'" || char === '"') {
          if (quote === null) {
            quote = char;
          } else if (quote === char) {
            quote = null;
          }
          continue;
        }

        if (char === '\\') {
          i++;
          continue;
        }

        if (quote !== null) {
          continue;
        }

        if (char === '{') {
          open++;
        } else if (char === '}') {
          open--;
        }
      } while (open > 0 && i < ii);

      if (open === 0) {
        parts = parts || [];
        if (value[interpolationStart - 1] === '\\' && value[interpolationStart - 2] !== '\\') {
          parts[partIndex] = value.substring(pos, interpolationStart - 1) + value.substring(interpolationStart, i);
          partIndex++;
          parts[partIndex] = this.emptyStringExpression;
          partIndex++;
        } else {
          parts[partIndex] = value.substring(pos, interpolationStart);
          partIndex++;
          parts[partIndex] = this.parser.parse(value.substring(interpolationStart + 2, i - 1));
          partIndex++;
        }
        pos = i;
        i = value.indexOf('${', i);
      } else {
        break;
      }
    }

    if (partIndex === 0) {
      return null;
    }

    parts[partIndex] = value.substr(pos);
    return parts;
  };

  return TemplatingBindingLanguage;
}(__WEBPACK_IMPORTED_MODULE_2_aurelia_templating__["b" /* BindingLanguage */]), _class5.inject = [__WEBPACK_IMPORTED_MODULE_1_aurelia_binding__["y" /* Parser */], __WEBPACK_IMPORTED_MODULE_1_aurelia_binding__["g" /* ObserverLocator */], SyntaxInterpreter, AttributeMap], _temp3);

function configure(config) {
  config.container.registerSingleton(__WEBPACK_IMPORTED_MODULE_2_aurelia_templating__["b" /* BindingLanguage */], TemplatingBindingLanguage);
  config.container.registerAlias(__WEBPACK_IMPORTED_MODULE_2_aurelia_templating__["b" /* BindingLanguage */], TemplatingBindingLanguage);
}

/***/ }),

/***/ "aurelia-templating-resources":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export AbstractRepeater */
/* unused harmony export ArrayRepeatStrategy */
/* unused harmony export AttrBindingBehavior */
/* unused harmony export BindingSignaler */
/* unused harmony export Compose */
/* unused harmony export DebounceBindingBehavior */
/* unused harmony export Else */
/* unused harmony export Focus */
/* unused harmony export FromViewBindingBehavior */
/* unused harmony export HTMLSanitizer */
/* unused harmony export Hide */
/* unused harmony export If */
/* unused harmony export MapRepeatStrategy */
/* unused harmony export NullRepeatStrategy */
/* unused harmony export NumberRepeatStrategy */
/* unused harmony export OneTimeBindingBehavior */
/* unused harmony export OneWayBindingBehavior */
/* unused harmony export Repeat */
/* unused harmony export RepeatStrategyLocator */
/* unused harmony export Replaceable */
/* unused harmony export SanitizeHTMLValueConverter */
/* unused harmony export SelfBindingBehavior */
/* unused harmony export SetRepeatStrategy */
/* unused harmony export Show */
/* unused harmony export SignalBindingBehavior */
/* unused harmony export ThrottleBindingBehavior */
/* unused harmony export ToViewBindingBehavior */
/* unused harmony export TwoWayBindingBehavior */
/* unused harmony export UpdateTriggerBindingBehavior */
/* unused harmony export With */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "configure", function() { return configure$1; });
/* unused harmony export createFullOverrideContext */
/* unused harmony export getItemsSourceExpression */
/* unused harmony export isOneTime */
/* unused harmony export unwrapExpression */
/* unused harmony export updateOneTimeBinding */
/* unused harmony export updateOverrideContext */
/* unused harmony export viewsRequireLifecycle */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_aurelia_dependency_injection__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_aurelia_pal__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_aurelia_task_queue__ = __webpack_require__(8);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_aurelia_templating__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_aurelia_binding__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_aurelia_logging__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_aurelia_loader__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7_aurelia_path__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8_aurelia_metadata__ = __webpack_require__(1);










/*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */
/* global Reflect, Promise */

var extendStatics = function(d, b) {
    extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return extendStatics(d, b);
};

function __extends(d, b) {
    extendStatics(d, b);
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}

function __decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}

var ActivationStrategy;
(function (ActivationStrategy) {
    ActivationStrategy["InvokeLifecycle"] = "invoke-lifecycle";
    ActivationStrategy["Replace"] = "replace";
})(ActivationStrategy || (ActivationStrategy = {}));
var Compose = (function () {
    function Compose(element, container, compositionEngine, viewSlot, viewResources, taskQueue) {
        this.activationStrategy = ActivationStrategy.InvokeLifecycle;
        this.element = element;
        this.container = container;
        this.compositionEngine = compositionEngine;
        this.viewSlot = viewSlot;
        this.viewResources = viewResources;
        this.taskQueue = taskQueue;
        this.currentController = null;
        this.currentViewModel = null;
        this.changes = Object.create(null);
    }
    Compose.inject = function () {
        return [__WEBPACK_IMPORTED_MODULE_1_aurelia_pal__["c" /* DOM */].Element, __WEBPACK_IMPORTED_MODULE_0_aurelia_dependency_injection__["a" /* Container */], __WEBPACK_IMPORTED_MODULE_3_aurelia_templating__["i" /* CompositionEngine */], __WEBPACK_IMPORTED_MODULE_3_aurelia_templating__["e" /* ViewSlot */], __WEBPACK_IMPORTED_MODULE_3_aurelia_templating__["a" /* ViewResources */], __WEBPACK_IMPORTED_MODULE_2_aurelia_task_queue__["a" /* TaskQueue */]];
    };
    Compose.prototype.created = function (owningView) {
        this.owningView = owningView;
    };
    Compose.prototype.bind = function (bindingContext, overrideContext) {
        this.bindingContext = bindingContext;
        this.overrideContext = overrideContext;
        var changes = this.changes;
        changes.view = this.view;
        changes.viewModel = this.viewModel;
        changes.model = this.model;
        if (!this.pendingTask) {
            processChanges(this);
        }
    };
    Compose.prototype.unbind = function () {
        this.changes = Object.create(null);
        this.bindingContext = null;
        this.overrideContext = null;
        var returnToCache = true;
        var skipAnimation = true;
        this.viewSlot.removeAll(returnToCache, skipAnimation);
    };
    Compose.prototype.modelChanged = function (newValue, oldValue) {
        this.changes.model = newValue;
        requestUpdate(this);
    };
    Compose.prototype.viewChanged = function (newValue, oldValue) {
        this.changes.view = newValue;
        requestUpdate(this);
    };
    Compose.prototype.viewModelChanged = function (newValue, oldValue) {
        this.changes.viewModel = newValue;
        requestUpdate(this);
    };
    __decorate([
        __WEBPACK_IMPORTED_MODULE_3_aurelia_templating__["p" /* bindable */]
    ], Compose.prototype, "model", void 0);
    __decorate([
        __WEBPACK_IMPORTED_MODULE_3_aurelia_templating__["p" /* bindable */]
    ], Compose.prototype, "view", void 0);
    __decorate([
        __WEBPACK_IMPORTED_MODULE_3_aurelia_templating__["p" /* bindable */]
    ], Compose.prototype, "viewModel", void 0);
    __decorate([
        __WEBPACK_IMPORTED_MODULE_3_aurelia_templating__["p" /* bindable */]
    ], Compose.prototype, "activationStrategy", void 0);
    __decorate([
        __WEBPACK_IMPORTED_MODULE_3_aurelia_templating__["p" /* bindable */]
    ], Compose.prototype, "swapOrder", void 0);
    Compose = __decorate([
        __WEBPACK_IMPORTED_MODULE_3_aurelia_templating__["q" /* noView */],
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3_aurelia_templating__["n" /* customElement */])('compose')
    ], Compose);
    return Compose;
}());
function isEmpty(obj) {
    for (var _ in obj) {
        return false;
    }
    return true;
}
function tryActivateViewModel(vm, model) {
    if (vm && typeof vm.activate === 'function') {
        return Promise.resolve(vm.activate(model));
    }
}
function createInstruction(composer, instruction) {
    return Object.assign(instruction, {
        bindingContext: composer.bindingContext,
        overrideContext: composer.overrideContext,
        owningView: composer.owningView,
        container: composer.container,
        viewSlot: composer.viewSlot,
        viewResources: composer.viewResources,
        currentController: composer.currentController,
        host: composer.element,
        swapOrder: composer.swapOrder
    });
}
function processChanges(composer) {
    var changes = composer.changes;
    composer.changes = Object.create(null);
    if (needsReInitialization(composer, changes)) {
        var instruction = {
            view: composer.view,
            viewModel: composer.currentViewModel || composer.viewModel,
            model: composer.model
        };
        instruction = Object.assign(instruction, changes);
        instruction = createInstruction(composer, instruction);
        composer.pendingTask = composer.compositionEngine.compose(instruction).then(function (controller) {
            composer.currentController = controller;
            composer.currentViewModel = controller ? controller.viewModel : null;
        });
    }
    else {
        composer.pendingTask = tryActivateViewModel(composer.currentViewModel, changes.model);
        if (!composer.pendingTask) {
            return;
        }
    }
    composer.pendingTask = composer.pendingTask
        .then(function () {
        completeCompositionTask(composer);
    }, function (reason) {
        completeCompositionTask(composer);
        throw reason;
    });
}
function completeCompositionTask(composer) {
    composer.pendingTask = null;
    if (!isEmpty(composer.changes)) {
        processChanges(composer);
    }
}
function requestUpdate(composer) {
    if (composer.pendingTask || composer.updateRequested) {
        return;
    }
    composer.updateRequested = true;
    composer.taskQueue.queueMicroTask(function () {
        composer.updateRequested = false;
        processChanges(composer);
    });
}
function needsReInitialization(composer, changes) {
    var activationStrategy = composer.activationStrategy;
    var vm = composer.currentViewModel;
    if (vm && typeof vm.determineActivationStrategy === 'function') {
        activationStrategy = vm.determineActivationStrategy();
    }
    return 'view' in changes
        || 'viewModel' in changes
        || activationStrategy === ActivationStrategy.Replace;
}

var IfCore = (function () {
    function IfCore(viewFactory, viewSlot) {
        this.viewFactory = viewFactory;
        this.viewSlot = viewSlot;
        this.view = null;
        this.bindingContext = null;
        this.overrideContext = null;
        this.showing = false;
        this.cache = true;
    }
    IfCore.prototype.bind = function (bindingContext, overrideContext) {
        this.bindingContext = bindingContext;
        this.overrideContext = overrideContext;
    };
    IfCore.prototype.unbind = function () {
        if (this.view === null) {
            return;
        }
        this.view.unbind();
        if (!this.viewFactory.isCaching) {
            return;
        }
        if (this.showing) {
            this.showing = false;
            this.viewSlot.remove(this.view, true, true);
        }
        else {
            this.view.returnToCache();
        }
        this.view = null;
    };
    IfCore.prototype._show = function () {
        if (this.showing) {
            if (!this.view.isBound) {
                this.view.bind(this.bindingContext, this.overrideContext);
            }
            return;
        }
        if (this.view === null) {
            this.view = this.viewFactory.create();
        }
        if (!this.view.isBound) {
            this.view.bind(this.bindingContext, this.overrideContext);
        }
        this.showing = true;
        return this.viewSlot.add(this.view);
    };
    IfCore.prototype._hide = function () {
        var _this = this;
        if (!this.showing) {
            return;
        }
        this.showing = false;
        var removed = this.viewSlot.remove(this.view);
        if (removed instanceof Promise) {
            return removed.then(function () {
                _this._unbindView();
            });
        }
        this._unbindView();
    };
    IfCore.prototype._unbindView = function () {
        var cache = this.cache === 'false' ? false : !!this.cache;
        this.view.unbind();
        if (!cache) {
            this.view = null;
        }
    };
    return IfCore;
}());

var If = (function (_super) {
    __extends(If, _super);
    function If() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.cache = true;
        return _this;
    }
    If.prototype.bind = function (bindingContext, overrideContext) {
        _super.prototype.bind.call(this, bindingContext, overrideContext);
        if (this.condition) {
            this._show();
        }
        else {
            this._hide();
        }
    };
    If.prototype.conditionChanged = function (newValue) {
        this._update(newValue);
    };
    If.prototype._update = function (show) {
        var _this = this;
        if (this.animating) {
            return;
        }
        var promise;
        if (this.elseVm) {
            promise = show ? this._swap(this.elseVm, this) : this._swap(this, this.elseVm);
        }
        else {
            promise = show ? this._show() : this._hide();
        }
        if (promise) {
            this.animating = true;
            promise.then(function () {
                _this.animating = false;
                if (_this.condition !== _this.showing) {
                    _this._update(_this.condition);
                }
            });
        }
    };
    If.prototype._swap = function (remove, add) {
        switch (this.swapOrder) {
            case 'before':
                return Promise.resolve(add._show()).then(function () { return remove._hide(); });
            case 'with':
                return Promise.all([remove._hide(), add._show()]);
            default:
                var promise = remove._hide();
                return promise ? promise.then(function () { return add._show(); }) : add._show();
        }
    };
    __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3_aurelia_templating__["p" /* bindable */])({ primaryProperty: true })
    ], If.prototype, "condition", void 0);
    __decorate([
        __WEBPACK_IMPORTED_MODULE_3_aurelia_templating__["p" /* bindable */]
    ], If.prototype, "swapOrder", void 0);
    __decorate([
        __WEBPACK_IMPORTED_MODULE_3_aurelia_templating__["p" /* bindable */]
    ], If.prototype, "cache", void 0);
    If = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3_aurelia_templating__["r" /* customAttribute */])('if'),
        __WEBPACK_IMPORTED_MODULE_3_aurelia_templating__["s" /* templateController */],
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0_aurelia_dependency_injection__["c" /* inject */])(__WEBPACK_IMPORTED_MODULE_3_aurelia_templating__["t" /* BoundViewFactory */], __WEBPACK_IMPORTED_MODULE_3_aurelia_templating__["e" /* ViewSlot */])
    ], If);
    return If;
}(IfCore));

var Else = (function (_super) {
    __extends(Else, _super);
    function Else(viewFactory, viewSlot) {
        var _this = _super.call(this, viewFactory, viewSlot) || this;
        _this._registerInIf();
        return _this;
    }
    Else.prototype.bind = function (bindingContext, overrideContext) {
        _super.prototype.bind.call(this, bindingContext, overrideContext);
        if (this.ifVm.condition) {
            this._hide();
        }
        else {
            this._show();
        }
    };
    Else.prototype._registerInIf = function () {
        var previous = this.viewSlot.anchor.previousSibling;
        while (previous && !previous.au) {
            previous = previous.previousSibling;
        }
        if (!previous || !previous.au.if) {
            throw new Error("Can't find matching If for Else custom attribute.");
        }
        this.ifVm = previous.au.if.viewModel;
        this.ifVm.elseVm = this;
    };
    Else = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3_aurelia_templating__["r" /* customAttribute */])('else'),
        __WEBPACK_IMPORTED_MODULE_3_aurelia_templating__["s" /* templateController */],
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0_aurelia_dependency_injection__["c" /* inject */])(__WEBPACK_IMPORTED_MODULE_3_aurelia_templating__["t" /* BoundViewFactory */], __WEBPACK_IMPORTED_MODULE_3_aurelia_templating__["e" /* ViewSlot */])
    ], Else);
    return Else;
}(IfCore));

var With = (function () {
    function With(viewFactory, viewSlot) {
        this.viewFactory = viewFactory;
        this.viewSlot = viewSlot;
        this.parentOverrideContext = null;
        this.view = null;
    }
    With.prototype.bind = function (bindingContext, overrideContext) {
        this.parentOverrideContext = overrideContext;
        this.valueChanged(this.value);
    };
    With.prototype.valueChanged = function (newValue) {
        var overrideContext = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_4_aurelia_binding__["d" /* createOverrideContext */])(newValue, this.parentOverrideContext);
        var view = this.view;
        if (!view) {
            view = this.view = this.viewFactory.create();
            view.bind(newValue, overrideContext);
            this.viewSlot.add(view);
        }
        else {
            view.bind(newValue, overrideContext);
        }
    };
    With.prototype.unbind = function () {
        var view = this.view;
        this.parentOverrideContext = null;
        if (view) {
            view.unbind();
        }
    };
    With = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3_aurelia_templating__["r" /* customAttribute */])('with'),
        __WEBPACK_IMPORTED_MODULE_3_aurelia_templating__["s" /* templateController */],
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0_aurelia_dependency_injection__["c" /* inject */])(__WEBPACK_IMPORTED_MODULE_3_aurelia_templating__["t" /* BoundViewFactory */], __WEBPACK_IMPORTED_MODULE_3_aurelia_templating__["e" /* ViewSlot */])
    ], With);
    return With;
}());

var oneTime = __WEBPACK_IMPORTED_MODULE_4_aurelia_binding__["f" /* bindingMode */].oneTime;
function updateOverrideContexts(views, startIndex) {
    var length = views.length;
    if (startIndex > 0) {
        startIndex = startIndex - 1;
    }
    for (; startIndex < length; ++startIndex) {
        updateOverrideContext(views[startIndex].overrideContext, startIndex, length);
    }
}
function createFullOverrideContext(repeat, data, index, length, key) {
    var bindingContext = {};
    var overrideContext = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_4_aurelia_binding__["d" /* createOverrideContext */])(bindingContext, repeat.scope.overrideContext);
    if (typeof key !== 'undefined') {
        bindingContext[repeat.key] = key;
        bindingContext[repeat.value] = data;
    }
    else {
        bindingContext[repeat.local] = data;
    }
    updateOverrideContext(overrideContext, index, length);
    return overrideContext;
}
function updateOverrideContext(overrideContext, index, length) {
    var first = (index === 0);
    var last = (index === length - 1);
    var even = index % 2 === 0;
    overrideContext.$index = index;
    overrideContext.$first = first;
    overrideContext.$last = last;
    overrideContext.$middle = !(first || last);
    overrideContext.$odd = !even;
    overrideContext.$even = even;
}
function getItemsSourceExpression(instruction, attrName) {
    return instruction.behaviorInstructions
        .filter(function (bi) { return bi.originalAttrName === attrName; })[0]
        .attributes
        .items
        .sourceExpression;
}
function unwrapExpression(expression) {
    var unwrapped = false;
    while (expression instanceof __WEBPACK_IMPORTED_MODULE_4_aurelia_binding__["i" /* BindingBehavior */]) {
        expression = expression.expression;
    }
    while (expression instanceof __WEBPACK_IMPORTED_MODULE_4_aurelia_binding__["j" /* ValueConverter */]) {
        expression = expression.expression;
        unwrapped = true;
    }
    return unwrapped ? expression : null;
}
function isOneTime(expression) {
    while (expression instanceof __WEBPACK_IMPORTED_MODULE_4_aurelia_binding__["i" /* BindingBehavior */]) {
        if (expression.name === 'oneTime') {
            return true;
        }
        expression = expression.expression;
    }
    return false;
}
function updateOneTimeBinding(binding) {
    if (binding.call && binding.mode === oneTime) {
        binding.call(__WEBPACK_IMPORTED_MODULE_4_aurelia_binding__["k" /* sourceContext */]);
    }
    else if (binding.updateOneTimeBindings) {
        binding.updateOneTimeBindings();
    }
}
function indexOf(array, item, matcher, startIndex) {
    if (!matcher) {
        return array.indexOf(item);
    }
    var length = array.length;
    for (var index = startIndex || 0; index < length; index++) {
        if (matcher(array[index], item)) {
            return index;
        }
    }
    return -1;
}

var ArrayRepeatStrategy = (function () {
    function ArrayRepeatStrategy() {
    }
    ArrayRepeatStrategy.prototype.getCollectionObserver = function (observerLocator, items) {
        return observerLocator.getArrayObserver(items);
    };
    ArrayRepeatStrategy.prototype.instanceChanged = function (repeat, items) {
        var _this = this;
        var $repeat = repeat;
        var itemsLength = items.length;
        if (!items || itemsLength === 0) {
            $repeat.removeAllViews(true, !$repeat.viewsRequireLifecycle);
            return;
        }
        var children = $repeat.views();
        var viewsLength = children.length;
        if (viewsLength === 0) {
            this._standardProcessInstanceChanged($repeat, items);
            return;
        }
        if ($repeat.viewsRequireLifecycle) {
            var childrenSnapshot = children.slice(0);
            var itemNameInBindingContext = $repeat.local;
            var matcher_1 = $repeat.matcher();
            var itemsPreviouslyInViews_1 = [];
            var viewsToRemove = [];
            for (var index = 0; index < viewsLength; index++) {
                var view = childrenSnapshot[index];
                var oldItem = view.bindingContext[itemNameInBindingContext];
                if (indexOf(items, oldItem, matcher_1) === -1) {
                    viewsToRemove.push(view);
                }
                else {
                    itemsPreviouslyInViews_1.push(oldItem);
                }
            }
            var updateViews = void 0;
            var removePromise = void 0;
            if (itemsPreviouslyInViews_1.length > 0) {
                removePromise = $repeat.removeViews(viewsToRemove, true, !$repeat.viewsRequireLifecycle);
                updateViews = function () {
                    for (var index = 0; index < itemsLength; index++) {
                        var item = items[index];
                        var indexOfView = indexOf(itemsPreviouslyInViews_1, item, matcher_1, index);
                        var view = void 0;
                        if (indexOfView === -1) {
                            var overrideContext = createFullOverrideContext($repeat, items[index], index, itemsLength);
                            $repeat.insertView(index, overrideContext.bindingContext, overrideContext);
                            itemsPreviouslyInViews_1.splice(index, 0, undefined);
                        }
                        else if (indexOfView === index) {
                            view = children[indexOfView];
                            itemsPreviouslyInViews_1[indexOfView] = undefined;
                        }
                        else {
                            view = children[indexOfView];
                            $repeat.moveView(indexOfView, index);
                            itemsPreviouslyInViews_1.splice(indexOfView, 1);
                            itemsPreviouslyInViews_1.splice(index, 0, undefined);
                        }
                        if (view) {
                            updateOverrideContext(view.overrideContext, index, itemsLength);
                        }
                    }
                    _this._inPlaceProcessItems($repeat, items);
                };
            }
            else {
                removePromise = $repeat.removeAllViews(true, !$repeat.viewsRequireLifecycle);
                updateViews = function () { return _this._standardProcessInstanceChanged($repeat, items); };
            }
            if (removePromise instanceof Promise) {
                removePromise.then(updateViews);
            }
            else {
                updateViews();
            }
        }
        else {
            this._inPlaceProcessItems($repeat, items);
        }
    };
    ArrayRepeatStrategy.prototype._standardProcessInstanceChanged = function (repeat, items) {
        for (var i = 0, ii = items.length; i < ii; i++) {
            var overrideContext = createFullOverrideContext(repeat, items[i], i, ii);
            repeat.addView(overrideContext.bindingContext, overrideContext);
        }
    };
    ArrayRepeatStrategy.prototype._inPlaceProcessItems = function (repeat, items) {
        var itemsLength = items.length;
        var viewsLength = repeat.viewCount();
        while (viewsLength > itemsLength) {
            viewsLength--;
            repeat.removeView(viewsLength, true, !repeat.viewsRequireLifecycle);
        }
        var local = repeat.local;
        for (var i = 0; i < viewsLength; i++) {
            var view = repeat.view(i);
            var last = i === itemsLength - 1;
            var middle = i !== 0 && !last;
            var bindingContext = view.bindingContext;
            var overrideContext = view.overrideContext;
            if (bindingContext[local] === items[i]
                && overrideContext.$middle === middle
                && overrideContext.$last === last) {
                continue;
            }
            bindingContext[local] = items[i];
            overrideContext.$middle = middle;
            overrideContext.$last = last;
            repeat.updateBindings(view);
        }
        for (var i = viewsLength; i < itemsLength; i++) {
            var overrideContext = createFullOverrideContext(repeat, items[i], i, itemsLength);
            repeat.addView(overrideContext.bindingContext, overrideContext);
        }
    };
    ArrayRepeatStrategy.prototype.instanceMutated = function (repeat, array, splices) {
        var _this = this;
        if (repeat.__queuedSplices) {
            for (var i = 0, ii = splices.length; i < ii; ++i) {
                var _a = splices[i], index = _a.index, removed = _a.removed, addedCount = _a.addedCount;
                __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_4_aurelia_binding__["l" /* mergeSplice */])(repeat.__queuedSplices, index, removed, addedCount);
            }
            repeat.__array = array.slice(0);
            return;
        }
        var maybePromise = this._runSplices(repeat, array.slice(0), splices);
        if (maybePromise instanceof Promise) {
            var queuedSplices_1 = repeat.__queuedSplices = [];
            var runQueuedSplices_1 = function () {
                if (!queuedSplices_1.length) {
                    repeat.__queuedSplices = undefined;
                    repeat.__array = undefined;
                    return;
                }
                var nextPromise = _this._runSplices(repeat, repeat.__array, queuedSplices_1) || Promise.resolve();
                queuedSplices_1 = repeat.__queuedSplices = [];
                nextPromise.then(runQueuedSplices_1);
            };
            maybePromise.then(runQueuedSplices_1);
        }
    };
    ArrayRepeatStrategy.prototype._runSplices = function (repeat, array, splices) {
        var _this = this;
        var removeDelta = 0;
        var rmPromises = [];
        for (var i = 0, ii = splices.length; i < ii; ++i) {
            var splice = splices[i];
            var removed = splice.removed;
            for (var j = 0, jj = removed.length; j < jj; ++j) {
                var viewOrPromise = repeat.removeView(splice.index + removeDelta + rmPromises.length, true);
                if (viewOrPromise instanceof Promise) {
                    rmPromises.push(viewOrPromise);
                }
            }
            removeDelta -= splice.addedCount;
        }
        if (rmPromises.length > 0) {
            return Promise.all(rmPromises).then(function () {
                var spliceIndexLow = _this._handleAddedSplices(repeat, array, splices);
                updateOverrideContexts(repeat.views(), spliceIndexLow);
            });
        }
        var spliceIndexLow = this._handleAddedSplices(repeat, array, splices);
        updateOverrideContexts(repeat.views(), spliceIndexLow);
        return undefined;
    };
    ArrayRepeatStrategy.prototype._handleAddedSplices = function (repeat, array, splices) {
        var spliceIndex;
        var spliceIndexLow;
        var arrayLength = array.length;
        for (var i = 0, ii = splices.length; i < ii; ++i) {
            var splice = splices[i];
            var addIndex = spliceIndex = splice.index;
            var end = splice.index + splice.addedCount;
            if (typeof spliceIndexLow === 'undefined' || spliceIndexLow === null || spliceIndexLow > splice.index) {
                spliceIndexLow = spliceIndex;
            }
            for (; addIndex < end; ++addIndex) {
                var overrideContext = createFullOverrideContext(repeat, array[addIndex], addIndex, arrayLength);
                repeat.insertView(addIndex, overrideContext.bindingContext, overrideContext);
            }
        }
        return spliceIndexLow;
    };
    return ArrayRepeatStrategy;
}());

var MapRepeatStrategy = (function () {
    function MapRepeatStrategy() {
    }
    MapRepeatStrategy.prototype.getCollectionObserver = function (observerLocator, items) {
        return observerLocator.getMapObserver(items);
    };
    MapRepeatStrategy.prototype.instanceChanged = function (repeat, items) {
        var _this = this;
        var removePromise = repeat.removeAllViews(true, !repeat.viewsRequireLifecycle);
        if (removePromise instanceof Promise) {
            removePromise.then(function () { return _this._standardProcessItems(repeat, items); });
            return;
        }
        this._standardProcessItems(repeat, items);
    };
    MapRepeatStrategy.prototype._standardProcessItems = function (repeat, items) {
        var index = 0;
        var overrideContext;
        items.forEach(function (value, key) {
            overrideContext = createFullOverrideContext(repeat, value, index, items.size, key);
            repeat.addView(overrideContext.bindingContext, overrideContext);
            ++index;
        });
    };
    MapRepeatStrategy.prototype.instanceMutated = function (repeat, map, records) {
        var key;
        var i;
        var ii;
        var overrideContext;
        var removeIndex;
        var addIndex;
        var record;
        var rmPromises = [];
        var viewOrPromise;
        for (i = 0, ii = records.length; i < ii; ++i) {
            record = records[i];
            key = record.key;
            switch (record.type) {
                case 'update':
                    removeIndex = this._getViewIndexByKey(repeat, key);
                    viewOrPromise = repeat.removeView(removeIndex, true, !repeat.viewsRequireLifecycle);
                    if (viewOrPromise instanceof Promise) {
                        rmPromises.push(viewOrPromise);
                    }
                    overrideContext = createFullOverrideContext(repeat, map.get(key), removeIndex, map.size, key);
                    repeat.insertView(removeIndex, overrideContext.bindingContext, overrideContext);
                    break;
                case 'add':
                    addIndex = repeat.viewCount() <= map.size - 1 ? repeat.viewCount() : map.size - 1;
                    overrideContext = createFullOverrideContext(repeat, map.get(key), addIndex, map.size, key);
                    repeat.insertView(map.size - 1, overrideContext.bindingContext, overrideContext);
                    break;
                case 'delete':
                    if (record.oldValue === undefined) {
                        return;
                    }
                    removeIndex = this._getViewIndexByKey(repeat, key);
                    viewOrPromise = repeat.removeView(removeIndex, true, !repeat.viewsRequireLifecycle);
                    if (viewOrPromise instanceof Promise) {
                        rmPromises.push(viewOrPromise);
                    }
                    break;
                case 'clear':
                    repeat.removeAllViews(true, !repeat.viewsRequireLifecycle);
                    break;
                default:
                    continue;
            }
        }
        if (rmPromises.length > 0) {
            Promise.all(rmPromises).then(function () {
                updateOverrideContexts(repeat.views(), 0);
            });
        }
        else {
            updateOverrideContexts(repeat.views(), 0);
        }
    };
    MapRepeatStrategy.prototype._getViewIndexByKey = function (repeat, key) {
        var i;
        var ii;
        var child;
        for (i = 0, ii = repeat.viewCount(); i < ii; ++i) {
            child = repeat.view(i);
            if (child.bindingContext[repeat.key] === key) {
                return i;
            }
        }
        return undefined;
    };
    return MapRepeatStrategy;
}());

var NullRepeatStrategy = (function () {
    function NullRepeatStrategy() {
    }
    NullRepeatStrategy.prototype.instanceChanged = function (repeat, items) {
        repeat.removeAllViews(true);
    };
    NullRepeatStrategy.prototype.getCollectionObserver = function (observerLocator, items) {
    };
    return NullRepeatStrategy;
}());

var NumberRepeatStrategy = (function () {
    function NumberRepeatStrategy() {
    }
    NumberRepeatStrategy.prototype.getCollectionObserver = function () {
        return null;
    };
    NumberRepeatStrategy.prototype.instanceChanged = function (repeat, value) {
        var _this = this;
        var removePromise = repeat.removeAllViews(true, !repeat.viewsRequireLifecycle);
        if (removePromise instanceof Promise) {
            removePromise.then(function () { return _this._standardProcessItems(repeat, value); });
            return;
        }
        this._standardProcessItems(repeat, value);
    };
    NumberRepeatStrategy.prototype._standardProcessItems = function (repeat, value) {
        var childrenLength = repeat.viewCount();
        var i;
        var ii;
        var overrideContext;
        var viewsToRemove;
        value = Math.floor(value);
        viewsToRemove = childrenLength - value;
        if (viewsToRemove > 0) {
            if (viewsToRemove > childrenLength) {
                viewsToRemove = childrenLength;
            }
            for (i = 0, ii = viewsToRemove; i < ii; ++i) {
                repeat.removeView(childrenLength - (i + 1), true, !repeat.viewsRequireLifecycle);
            }
            return;
        }
        for (i = childrenLength, ii = value; i < ii; ++i) {
            overrideContext = createFullOverrideContext(repeat, i, i, ii);
            repeat.addView(overrideContext.bindingContext, overrideContext);
        }
        updateOverrideContexts(repeat.views(), 0);
    };
    return NumberRepeatStrategy;
}());

var SetRepeatStrategy = (function () {
    function SetRepeatStrategy() {
    }
    SetRepeatStrategy.prototype.getCollectionObserver = function (observerLocator, items) {
        return observerLocator.getSetObserver(items);
    };
    SetRepeatStrategy.prototype.instanceChanged = function (repeat, items) {
        var _this = this;
        var removePromise = repeat.removeAllViews(true, !repeat.viewsRequireLifecycle);
        if (removePromise instanceof Promise) {
            removePromise.then(function () { return _this._standardProcessItems(repeat, items); });
            return;
        }
        this._standardProcessItems(repeat, items);
    };
    SetRepeatStrategy.prototype._standardProcessItems = function (repeat, items) {
        var index = 0;
        var overrideContext;
        items.forEach(function (value) {
            overrideContext = createFullOverrideContext(repeat, value, index, items.size);
            repeat.addView(overrideContext.bindingContext, overrideContext);
            ++index;
        });
    };
    SetRepeatStrategy.prototype.instanceMutated = function (repeat, set, records) {
        var value;
        var i;
        var ii;
        var overrideContext;
        var removeIndex;
        var record;
        var rmPromises = [];
        var viewOrPromise;
        for (i = 0, ii = records.length; i < ii; ++i) {
            record = records[i];
            value = record.value;
            switch (record.type) {
                case 'add':
                    var size = Math.max(set.size - 1, 0);
                    overrideContext = createFullOverrideContext(repeat, value, size, set.size);
                    repeat.insertView(size, overrideContext.bindingContext, overrideContext);
                    break;
                case 'delete':
                    removeIndex = this._getViewIndexByValue(repeat, value);
                    viewOrPromise = repeat.removeView(removeIndex, true, !repeat.viewsRequireLifecycle);
                    if (viewOrPromise instanceof Promise) {
                        rmPromises.push(viewOrPromise);
                    }
                    break;
                case 'clear':
                    repeat.removeAllViews(true, !repeat.viewsRequireLifecycle);
                    break;
                default:
                    continue;
            }
        }
        if (rmPromises.length > 0) {
            Promise.all(rmPromises).then(function () {
                updateOverrideContexts(repeat.views(), 0);
            });
        }
        else {
            updateOverrideContexts(repeat.views(), 0);
        }
    };
    SetRepeatStrategy.prototype._getViewIndexByValue = function (repeat, value) {
        var i;
        var ii;
        var child;
        for (i = 0, ii = repeat.viewCount(); i < ii; ++i) {
            child = repeat.view(i);
            if (child.bindingContext[repeat.local] === value) {
                return i;
            }
        }
        return undefined;
    };
    return SetRepeatStrategy;
}());

var RepeatStrategyLocator = (function () {
    function RepeatStrategyLocator() {
        this.matchers = [];
        this.strategies = [];
        this.addStrategy(function (items) { return items === null || items === undefined; }, new NullRepeatStrategy());
        this.addStrategy(function (items) { return items instanceof Array; }, new ArrayRepeatStrategy());
        this.addStrategy(function (items) { return items instanceof Map; }, new MapRepeatStrategy());
        this.addStrategy(function (items) { return items instanceof Set; }, new SetRepeatStrategy());
        this.addStrategy(function (items) { return typeof items === 'number'; }, new NumberRepeatStrategy());
    }
    RepeatStrategyLocator.prototype.addStrategy = function (matcher, strategy) {
        this.matchers.push(matcher);
        this.strategies.push(strategy);
    };
    RepeatStrategyLocator.prototype.getStrategy = function (items) {
        var matchers = this.matchers;
        for (var i = 0, ii = matchers.length; i < ii; ++i) {
            if (matchers[i](items)) {
                return this.strategies[i];
            }
        }
        return null;
    };
    return RepeatStrategyLocator;
}());

var lifecycleOptionalBehaviors = ['focus', 'if', 'else', 'repeat', 'show', 'hide', 'with'];
function behaviorRequiresLifecycle(instruction) {
    var t = instruction.type;
    var name = t.elementName !== null ? t.elementName : t.attributeName;
    return lifecycleOptionalBehaviors.indexOf(name) === -1 && (t.handlesAttached || t.handlesBind || t.handlesCreated || t.handlesDetached || t.handlesUnbind)
        || t.viewFactory && viewsRequireLifecycle(t.viewFactory)
        || instruction.viewFactory && viewsRequireLifecycle(instruction.viewFactory);
}
function targetRequiresLifecycle(instruction) {
    var behaviors = instruction.behaviorInstructions;
    if (behaviors) {
        var i = behaviors.length;
        while (i--) {
            if (behaviorRequiresLifecycle(behaviors[i])) {
                return true;
            }
        }
    }
    return instruction.viewFactory && viewsRequireLifecycle(instruction.viewFactory);
}
function viewsRequireLifecycle(viewFactory) {
    if ('_viewsRequireLifecycle' in viewFactory) {
        return viewFactory._viewsRequireLifecycle;
    }
    viewFactory._viewsRequireLifecycle = false;
    if (viewFactory.viewFactory) {
        viewFactory._viewsRequireLifecycle = viewsRequireLifecycle(viewFactory.viewFactory);
        return viewFactory._viewsRequireLifecycle;
    }
    if (viewFactory.template.querySelector('.au-animate')) {
        viewFactory._viewsRequireLifecycle = true;
        return true;
    }
    for (var id in viewFactory.instructions) {
        if (targetRequiresLifecycle(viewFactory.instructions[id])) {
            viewFactory._viewsRequireLifecycle = true;
            return true;
        }
    }
    viewFactory._viewsRequireLifecycle = false;
    return false;
}

var AbstractRepeater = (function () {
    function AbstractRepeater(options) {
        Object.assign(this, {
            local: 'items',
            viewsRequireLifecycle: true
        }, options);
    }
    AbstractRepeater.prototype.viewCount = function () {
        throw new Error('subclass must implement `viewCount`');
    };
    AbstractRepeater.prototype.views = function () {
        throw new Error('subclass must implement `views`');
    };
    AbstractRepeater.prototype.view = function (index) {
        throw new Error('subclass must implement `view`');
    };
    AbstractRepeater.prototype.matcher = function () {
        throw new Error('subclass must implement `matcher`');
    };
    AbstractRepeater.prototype.addView = function (bindingContext, overrideContext) {
        throw new Error('subclass must implement `addView`');
    };
    AbstractRepeater.prototype.insertView = function (index, bindingContext, overrideContext) {
        throw new Error('subclass must implement `insertView`');
    };
    AbstractRepeater.prototype.moveView = function (sourceIndex, targetIndex) {
        throw new Error('subclass must implement `moveView`');
    };
    AbstractRepeater.prototype.removeAllViews = function (returnToCache, skipAnimation) {
        throw new Error('subclass must implement `removeAllViews`');
    };
    AbstractRepeater.prototype.removeViews = function (viewsToRemove, returnToCache, skipAnimation) {
        throw new Error('subclass must implement `removeView`');
    };
    AbstractRepeater.prototype.removeView = function (index, returnToCache, skipAnimation) {
        throw new Error('subclass must implement `removeView`');
    };
    AbstractRepeater.prototype.updateBindings = function (view) {
        throw new Error('subclass must implement `updateBindings`');
    };
    return AbstractRepeater;
}());

var Repeat = (function (_super) {
    __extends(Repeat, _super);
    function Repeat(viewFactory, instruction, viewSlot, viewResources, observerLocator, strategyLocator) {
        var _this = _super.call(this, {
            local: 'item',
            viewsRequireLifecycle: viewsRequireLifecycle(viewFactory)
        }) || this;
        _this.viewFactory = viewFactory;
        _this.instruction = instruction;
        _this.viewSlot = viewSlot;
        _this.lookupFunctions = viewResources.lookupFunctions;
        _this.observerLocator = observerLocator;
        _this.key = 'key';
        _this.value = 'value';
        _this.strategyLocator = strategyLocator;
        _this.ignoreMutation = false;
        _this.sourceExpression = getItemsSourceExpression(_this.instruction, 'repeat.for');
        _this.isOneTime = isOneTime(_this.sourceExpression);
        _this.viewsRequireLifecycle = viewsRequireLifecycle(viewFactory);
        return _this;
    }
    Repeat_1 = Repeat;
    Repeat.prototype.call = function (context, changes) {
        this[context](this.items, changes);
    };
    Repeat.prototype.bind = function (bindingContext, overrideContext) {
        this.scope = { bindingContext: bindingContext, overrideContext: overrideContext };
        this.matcherBinding = this._captureAndRemoveMatcherBinding();
        this.itemsChanged();
    };
    Repeat.prototype.unbind = function () {
        this.scope = null;
        this.items = null;
        this.matcherBinding = null;
        this.viewSlot.removeAll(true, true);
        this._unsubscribeCollection();
    };
    Repeat.prototype._unsubscribeCollection = function () {
        if (this.collectionObserver) {
            this.collectionObserver.unsubscribe(this.callContext, this);
            this.collectionObserver = null;
            this.callContext = null;
        }
    };
    Repeat.prototype.itemsChanged = function () {
        var _this = this;
        this._unsubscribeCollection();
        if (!this.scope) {
            return;
        }
        var items = this.items;
        this.strategy = this.strategyLocator.getStrategy(items);
        if (!this.strategy) {
            throw new Error("Value for '" + this.sourceExpression + "' is non-repeatable");
        }
        if (!this.isOneTime && !this._observeInnerCollection()) {
            this._observeCollection();
        }
        this.ignoreMutation = true;
        this.strategy.instanceChanged(this, items);
        this.observerLocator.taskQueue.queueMicroTask(function () {
            _this.ignoreMutation = false;
        });
    };
    Repeat.prototype._getInnerCollection = function () {
        var expression = unwrapExpression(this.sourceExpression);
        if (!expression) {
            return null;
        }
        return expression.evaluate(this.scope, null);
    };
    Repeat.prototype.handleCollectionMutated = function (collection, changes) {
        if (!this.collectionObserver) {
            return;
        }
        if (this.ignoreMutation) {
            return;
        }
        this.strategy.instanceMutated(this, collection, changes);
    };
    Repeat.prototype.handleInnerCollectionMutated = function (collection, changes) {
        var _this = this;
        if (!this.collectionObserver) {
            return;
        }
        if (this.ignoreMutation) {
            return;
        }
        this.ignoreMutation = true;
        var newItems = this.sourceExpression.evaluate(this.scope, this.lookupFunctions);
        this.observerLocator.taskQueue.queueMicroTask(function () { return _this.ignoreMutation = false; });
        if (newItems === this.items) {
            this.itemsChanged();
        }
        else {
            this.items = newItems;
        }
    };
    Repeat.prototype._observeInnerCollection = function () {
        var items = this._getInnerCollection();
        var strategy = this.strategyLocator.getStrategy(items);
        if (!strategy) {
            return false;
        }
        this.collectionObserver = strategy.getCollectionObserver(this.observerLocator, items);
        if (!this.collectionObserver) {
            return false;
        }
        this.callContext = 'handleInnerCollectionMutated';
        this.collectionObserver.subscribe(this.callContext, this);
        return true;
    };
    Repeat.prototype._observeCollection = function () {
        var items = this.items;
        this.collectionObserver = this.strategy.getCollectionObserver(this.observerLocator, items);
        if (this.collectionObserver) {
            this.callContext = 'handleCollectionMutated';
            this.collectionObserver.subscribe(this.callContext, this);
        }
    };
    Repeat.prototype._captureAndRemoveMatcherBinding = function () {
        var viewFactory = this.viewFactory.viewFactory;
        if (viewFactory) {
            var template = viewFactory.template;
            var instructions = viewFactory.instructions;
            if (Repeat_1.useInnerMatcher) {
                return extractMatcherBindingExpression(instructions);
            }
            if (template.children.length > 1) {
                return undefined;
            }
            var repeatedElement = template.firstElementChild;
            if (!repeatedElement.hasAttribute('au-target-id')) {
                return undefined;
            }
            var repeatedElementTargetId = repeatedElement.getAttribute('au-target-id');
            return extractMatcherBindingExpression(instructions, repeatedElementTargetId);
        }
        return undefined;
    };
    Repeat.prototype.viewCount = function () { return this.viewSlot.children.length; };
    Repeat.prototype.views = function () { return this.viewSlot.children; };
    Repeat.prototype.view = function (index) { return this.viewSlot.children[index]; };
    Repeat.prototype.matcher = function () {
        var matcherBinding = this.matcherBinding;
        return matcherBinding
            ? matcherBinding.sourceExpression.evaluate(this.scope, matcherBinding.lookupFunctions)
            : null;
    };
    Repeat.prototype.addView = function (bindingContext, overrideContext) {
        var view = this.viewFactory.create();
        view.bind(bindingContext, overrideContext);
        this.viewSlot.add(view);
    };
    Repeat.prototype.insertView = function (index, bindingContext, overrideContext) {
        var view = this.viewFactory.create();
        view.bind(bindingContext, overrideContext);
        this.viewSlot.insert(index, view);
    };
    Repeat.prototype.moveView = function (sourceIndex, targetIndex) {
        this.viewSlot.move(sourceIndex, targetIndex);
    };
    Repeat.prototype.removeAllViews = function (returnToCache, skipAnimation) {
        return this.viewSlot.removeAll(returnToCache, skipAnimation);
    };
    Repeat.prototype.removeViews = function (viewsToRemove, returnToCache, skipAnimation) {
        return this.viewSlot.removeMany(viewsToRemove, returnToCache, skipAnimation);
    };
    Repeat.prototype.removeView = function (index, returnToCache, skipAnimation) {
        return this.viewSlot.removeAt(index, returnToCache, skipAnimation);
    };
    Repeat.prototype.updateBindings = function (view) {
        var $view = view;
        var j = $view.bindings.length;
        while (j--) {
            updateOneTimeBinding($view.bindings[j]);
        }
        j = $view.controllers.length;
        while (j--) {
            var k = $view.controllers[j].boundProperties.length;
            while (k--) {
                var binding = $view.controllers[j].boundProperties[k].binding;
                updateOneTimeBinding(binding);
            }
        }
    };
    var Repeat_1;
    Repeat.useInnerMatcher = true;
    __decorate([
        __WEBPACK_IMPORTED_MODULE_3_aurelia_templating__["p" /* bindable */]
    ], Repeat.prototype, "items", void 0);
    __decorate([
        __WEBPACK_IMPORTED_MODULE_3_aurelia_templating__["p" /* bindable */]
    ], Repeat.prototype, "local", void 0);
    __decorate([
        __WEBPACK_IMPORTED_MODULE_3_aurelia_templating__["p" /* bindable */]
    ], Repeat.prototype, "key", void 0);
    __decorate([
        __WEBPACK_IMPORTED_MODULE_3_aurelia_templating__["p" /* bindable */]
    ], Repeat.prototype, "value", void 0);
    Repeat = Repeat_1 = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3_aurelia_templating__["r" /* customAttribute */])('repeat'),
        __WEBPACK_IMPORTED_MODULE_3_aurelia_templating__["s" /* templateController */],
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0_aurelia_dependency_injection__["c" /* inject */])(__WEBPACK_IMPORTED_MODULE_3_aurelia_templating__["t" /* BoundViewFactory */], __WEBPACK_IMPORTED_MODULE_3_aurelia_templating__["u" /* TargetInstruction */], __WEBPACK_IMPORTED_MODULE_3_aurelia_templating__["e" /* ViewSlot */], __WEBPACK_IMPORTED_MODULE_3_aurelia_templating__["a" /* ViewResources */], __WEBPACK_IMPORTED_MODULE_4_aurelia_binding__["g" /* ObserverLocator */], RepeatStrategyLocator)
    ], Repeat);
    return Repeat;
}(AbstractRepeater));
var extractMatcherBindingExpression = function (instructions, targetedElementId) {
    var instructionIds = Object.keys(instructions);
    for (var i = 0; i < instructionIds.length; i++) {
        var instructionId = instructionIds[i];
        if (targetedElementId !== undefined && instructionId !== targetedElementId) {
            continue;
        }
        var expressions = instructions[instructionId].expressions;
        if (expressions) {
            for (var ii = 0; ii < expressions.length; ii++) {
                if (expressions[ii].targetProperty === 'matcher') {
                    var matcherBindingExpression = expressions[ii];
                    expressions.splice(ii, 1);
                    return matcherBindingExpression;
                }
            }
        }
    }
};

var aureliaHideClassName = 'aurelia-hide';
var aureliaHideClass = "." + aureliaHideClassName + " { display:none !important; }";
function injectAureliaHideStyleAtHead() {
    __WEBPACK_IMPORTED_MODULE_1_aurelia_pal__["c" /* DOM */].injectStyles(aureliaHideClass);
}
function injectAureliaHideStyleAtBoundary(domBoundary) {
    if (__WEBPACK_IMPORTED_MODULE_1_aurelia_pal__["d" /* FEATURE */].shadowDOM && domBoundary && !domBoundary.hasAureliaHideStyle) {
        domBoundary.hasAureliaHideStyle = true;
        __WEBPACK_IMPORTED_MODULE_1_aurelia_pal__["c" /* DOM */].injectStyles(aureliaHideClass, domBoundary);
    }
}

var Show = (function () {
    function Show(element, animator, domBoundary) {
        this.element = element;
        this.animator = animator;
        this.domBoundary = domBoundary;
    }
    Show.inject = function () {
        return [__WEBPACK_IMPORTED_MODULE_1_aurelia_pal__["c" /* DOM */].Element, __WEBPACK_IMPORTED_MODULE_3_aurelia_templating__["v" /* Animator */], __WEBPACK_IMPORTED_MODULE_0_aurelia_dependency_injection__["d" /* Optional */].of(__WEBPACK_IMPORTED_MODULE_1_aurelia_pal__["c" /* DOM */].boundary, true)];
    };
    Show.prototype.created = function () {
        injectAureliaHideStyleAtBoundary(this.domBoundary);
    };
    Show.prototype.valueChanged = function (newValue) {
        var element = this.element;
        var animator = this.animator;
        if (newValue) {
            animator.removeClass(element, aureliaHideClassName);
        }
        else {
            animator.addClass(element, aureliaHideClassName);
        }
    };
    Show.prototype.bind = function (bindingContext) {
        this.valueChanged(this.value);
    };
    Show = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3_aurelia_templating__["r" /* customAttribute */])('show')
    ], Show);
    return Show;
}());

var Hide = (function () {
    function Hide(element, animator, domBoundary) {
        this.element = element;
        this.animator = animator;
        this.domBoundary = domBoundary;
    }
    Hide.inject = function () {
        return [__WEBPACK_IMPORTED_MODULE_1_aurelia_pal__["c" /* DOM */].Element, __WEBPACK_IMPORTED_MODULE_3_aurelia_templating__["v" /* Animator */], __WEBPACK_IMPORTED_MODULE_0_aurelia_dependency_injection__["d" /* Optional */].of(__WEBPACK_IMPORTED_MODULE_1_aurelia_pal__["c" /* DOM */].boundary, true)];
    };
    Hide.prototype.created = function () {
        injectAureliaHideStyleAtBoundary(this.domBoundary);
    };
    Hide.prototype.valueChanged = function (newValue) {
        if (newValue) {
            this.animator.addClass(this.element, aureliaHideClassName);
        }
        else {
            this.animator.removeClass(this.element, aureliaHideClassName);
        }
    };
    Hide.prototype.bind = function (bindingContext) {
        this.valueChanged(this.value);
    };
    Hide.prototype.value = function (value) {
        throw new Error('Method not implemented.');
    };
    Hide = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3_aurelia_templating__["r" /* customAttribute */])('hide')
    ], Hide);
    return Hide;
}());

var SCRIPT_REGEX = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi;
var needsToWarn = true;
var HTMLSanitizer = (function () {
    function HTMLSanitizer() {
    }
    HTMLSanitizer.prototype.sanitize = function (input) {
        if (needsToWarn) {
            needsToWarn = false;
            __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_5_aurelia_logging__["getLogger"])('html-sanitizer')
                .warn("CAUTION: The default HTMLSanitizer does NOT provide security against a wide variety of sophisticated XSS attacks,\nand should not be relied on for sanitizing input from unknown sources.\nPlease see https://aurelia.io/docs/binding/basics#element-content for instructions on how to use a secure solution like DOMPurify or sanitize-html.");
        }
        return input.replace(SCRIPT_REGEX, '');
    };
    return HTMLSanitizer;
}());

var SanitizeHTMLValueConverter = (function () {
    function SanitizeHTMLValueConverter(sanitizer) {
        this.sanitizer = sanitizer;
    }
    SanitizeHTMLValueConverter.prototype.toView = function (untrustedMarkup) {
        if (untrustedMarkup === null || untrustedMarkup === undefined) {
            return null;
        }
        return this.sanitizer.sanitize(untrustedMarkup);
    };
    SanitizeHTMLValueConverter = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_4_aurelia_binding__["m" /* valueConverter */])('sanitizeHTML'),
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0_aurelia_dependency_injection__["c" /* inject */])(HTMLSanitizer)
    ], SanitizeHTMLValueConverter);
    return SanitizeHTMLValueConverter;
}());

var Replaceable = (function () {
    function Replaceable(viewFactory, viewSlot) {
        this.viewFactory = viewFactory;
        this.viewSlot = viewSlot;
        this.view = null;
    }
    Replaceable.prototype.bind = function (bindingContext, overrideContext) {
        if (this.view === null) {
            this.view = this.viewFactory.create();
            this.viewSlot.add(this.view);
        }
        this.view.bind(bindingContext, overrideContext);
    };
    Replaceable.prototype.unbind = function () {
        this.view.unbind();
    };
    Replaceable = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3_aurelia_templating__["r" /* customAttribute */])('replaceable'),
        __WEBPACK_IMPORTED_MODULE_3_aurelia_templating__["s" /* templateController */],
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0_aurelia_dependency_injection__["c" /* inject */])(__WEBPACK_IMPORTED_MODULE_3_aurelia_templating__["t" /* BoundViewFactory */], __WEBPACK_IMPORTED_MODULE_3_aurelia_templating__["e" /* ViewSlot */])
    ], Replaceable);
    return Replaceable;
}());

var Focus = (function () {
    function Focus(element, taskQueue) {
        this.element = element;
        this.taskQueue = taskQueue;
        this.isAttached = false;
        this.needsApply = false;
    }
    Focus.inject = function () {
        return [__WEBPACK_IMPORTED_MODULE_1_aurelia_pal__["c" /* DOM */].Element, __WEBPACK_IMPORTED_MODULE_2_aurelia_task_queue__["a" /* TaskQueue */]];
    };
    Focus.prototype.valueChanged = function (newValue) {
        if (this.isAttached) {
            this._apply();
        }
        else {
            this.needsApply = true;
        }
    };
    Focus.prototype._apply = function () {
        var _this = this;
        if (this.value) {
            this.taskQueue.queueMicroTask(function () {
                if (_this.value) {
                    _this.element.focus();
                }
            });
        }
        else {
            this.element.blur();
        }
    };
    Focus.prototype.attached = function () {
        this.isAttached = true;
        if (this.needsApply) {
            this.needsApply = false;
            this._apply();
        }
        this.element.addEventListener('focus', this);
        this.element.addEventListener('blur', this);
    };
    Focus.prototype.detached = function () {
        this.isAttached = false;
        this.element.removeEventListener('focus', this);
        this.element.removeEventListener('blur', this);
    };
    Focus.prototype.handleEvent = function (e) {
        if (e.type === 'focus') {
            this.value = true;
        }
        else if (__WEBPACK_IMPORTED_MODULE_1_aurelia_pal__["c" /* DOM */].activeElement !== this.element) {
            this.value = false;
        }
    };
    Focus = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3_aurelia_templating__["r" /* customAttribute */])('focus', __WEBPACK_IMPORTED_MODULE_4_aurelia_binding__["f" /* bindingMode */].twoWay)
    ], Focus);
    return Focus;
}());

var cssUrlMatcher = /url\((?!['"]data)([^)]+)\)/gi;
function fixupCSSUrls(address, css) {
    if (typeof css !== 'string') {
        throw new Error("Failed loading required CSS file: " + address);
    }
    return css.replace(cssUrlMatcher, function (match, p1) {
        var quote = p1.charAt(0);
        if (quote === '\'' || quote === '"') {
            p1 = p1.substr(1, p1.length - 2);
        }
        return 'url(\'' + __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_7_aurelia_path__["a" /* relativeToFile */])(p1, address) + '\')';
    });
}
var CSSResource = (function () {
    function CSSResource(address) {
        this.address = address;
        this._scoped = null;
        this._global = false;
        this._alreadyGloballyInjected = false;
    }
    CSSResource.prototype.initialize = function (container, Target) {
        this._scoped = new Target(this);
    };
    CSSResource.prototype.register = function (registry, name) {
        if (name === 'scoped') {
            registry.registerViewEngineHooks(this._scoped);
        }
        else {
            this._global = true;
        }
    };
    CSSResource.prototype.load = function (container) {
        var _this = this;
        return container.get(__WEBPACK_IMPORTED_MODULE_6_aurelia_loader__["a" /* Loader */])
            .loadText(this.address)
            .catch(function (err) { return null; })
            .then(function (text) {
            text = fixupCSSUrls(_this.address, text);
            _this._scoped.css = text;
            if (_this._global) {
                _this._alreadyGloballyInjected = true;
                __WEBPACK_IMPORTED_MODULE_1_aurelia_pal__["c" /* DOM */].injectStyles(text);
            }
        });
    };
    return CSSResource;
}());
var CSSViewEngineHooks = (function () {
    function CSSViewEngineHooks(owner) {
        this.owner = owner;
        this.css = null;
    }
    CSSViewEngineHooks.prototype.beforeCompile = function (content, resources, instruction) {
        if (instruction.targetShadowDOM) {
            __WEBPACK_IMPORTED_MODULE_1_aurelia_pal__["c" /* DOM */].injectStyles(this.css, content, true);
        }
        else if (__WEBPACK_IMPORTED_MODULE_1_aurelia_pal__["d" /* FEATURE */].scopedCSS) {
            var styleNode = __WEBPACK_IMPORTED_MODULE_1_aurelia_pal__["c" /* DOM */].injectStyles(this.css, content, true);
            styleNode.setAttribute('scoped', 'scoped');
        }
        else if (this._global && !this.owner._alreadyGloballyInjected) {
            __WEBPACK_IMPORTED_MODULE_1_aurelia_pal__["c" /* DOM */].injectStyles(this.css);
            this.owner._alreadyGloballyInjected = true;
        }
    };
    return CSSViewEngineHooks;
}());
function _createCSSResource(address) {
    var ViewCSS = (function (_super) {
        __extends(ViewCSS, _super);
        function ViewCSS() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        ViewCSS = __decorate([
            __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3_aurelia_templating__["w" /* resource */])(new CSSResource(address))
        ], ViewCSS);
        return ViewCSS;
    }(CSSViewEngineHooks));
    return ViewCSS;
}

var AttrBindingBehavior = (function () {
    function AttrBindingBehavior() {
    }
    AttrBindingBehavior.prototype.bind = function (binding, source) {
        binding.targetObserver = new __WEBPACK_IMPORTED_MODULE_4_aurelia_binding__["n" /* DataAttributeObserver */](binding.target, binding.targetProperty);
    };
    AttrBindingBehavior.prototype.unbind = function (binding, source) {
    };
    AttrBindingBehavior = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_4_aurelia_binding__["o" /* bindingBehavior */])('attr')
    ], AttrBindingBehavior);
    return AttrBindingBehavior;
}());

var modeBindingBehavior = {
    bind: function (binding, source, lookupFunctions) {
        binding.originalMode = binding.mode;
        binding.mode = this.mode;
    },
    unbind: function (binding, source) {
        binding.mode = binding.originalMode;
        binding.originalMode = null;
    }
};
var OneTimeBindingBehavior = (function () {
    function OneTimeBindingBehavior() {
        this.mode = __WEBPACK_IMPORTED_MODULE_4_aurelia_binding__["f" /* bindingMode */].oneTime;
    }
    OneTimeBindingBehavior = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_8_aurelia_metadata__["d" /* mixin */])(modeBindingBehavior),
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_4_aurelia_binding__["o" /* bindingBehavior */])('oneTime')
    ], OneTimeBindingBehavior);
    return OneTimeBindingBehavior;
}());
var OneWayBindingBehavior = (function () {
    function OneWayBindingBehavior() {
        this.mode = __WEBPACK_IMPORTED_MODULE_4_aurelia_binding__["f" /* bindingMode */].toView;
    }
    OneWayBindingBehavior = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_8_aurelia_metadata__["d" /* mixin */])(modeBindingBehavior),
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_4_aurelia_binding__["o" /* bindingBehavior */])('oneWay')
    ], OneWayBindingBehavior);
    return OneWayBindingBehavior;
}());
var ToViewBindingBehavior = (function () {
    function ToViewBindingBehavior() {
        this.mode = __WEBPACK_IMPORTED_MODULE_4_aurelia_binding__["f" /* bindingMode */].toView;
    }
    ToViewBindingBehavior = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_8_aurelia_metadata__["d" /* mixin */])(modeBindingBehavior),
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_4_aurelia_binding__["o" /* bindingBehavior */])('toView')
    ], ToViewBindingBehavior);
    return ToViewBindingBehavior;
}());
var FromViewBindingBehavior = (function () {
    function FromViewBindingBehavior() {
        this.mode = __WEBPACK_IMPORTED_MODULE_4_aurelia_binding__["f" /* bindingMode */].fromView;
    }
    FromViewBindingBehavior = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_8_aurelia_metadata__["d" /* mixin */])(modeBindingBehavior),
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_4_aurelia_binding__["o" /* bindingBehavior */])('fromView')
    ], FromViewBindingBehavior);
    return FromViewBindingBehavior;
}());
var TwoWayBindingBehavior = (function () {
    function TwoWayBindingBehavior() {
        this.mode = __WEBPACK_IMPORTED_MODULE_4_aurelia_binding__["f" /* bindingMode */].twoWay;
    }
    TwoWayBindingBehavior = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_8_aurelia_metadata__["d" /* mixin */])(modeBindingBehavior),
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_4_aurelia_binding__["o" /* bindingBehavior */])('twoWay')
    ], TwoWayBindingBehavior);
    return TwoWayBindingBehavior;
}());

function throttle(newValue) {
    var _this = this;
    var state = this.throttleState;
    var elapsed = +new Date() - state.last;
    if (elapsed >= state.delay) {
        clearTimeout(state.timeoutId);
        state.timeoutId = null;
        state.last = +new Date();
        this.throttledMethod(newValue);
        return;
    }
    state.newValue = newValue;
    if (state.timeoutId === null) {
        state.timeoutId = setTimeout(function () {
            state.timeoutId = null;
            state.last = +new Date();
            _this.throttledMethod(state.newValue);
        }, state.delay - elapsed);
    }
}
var ThrottleBindingBehavior = (function () {
    function ThrottleBindingBehavior() {
    }
    ThrottleBindingBehavior.prototype.bind = function (binding, source, delay) {
        if (delay === void 0) { delay = 200; }
        var methodToThrottle = 'updateTarget';
        if (binding.callSource) {
            methodToThrottle = 'callSource';
        }
        else if (binding.updateSource && binding.mode === __WEBPACK_IMPORTED_MODULE_4_aurelia_binding__["f" /* bindingMode */].twoWay) {
            methodToThrottle = 'updateSource';
        }
        binding.throttledMethod = binding[methodToThrottle];
        binding.throttledMethod.originalName = methodToThrottle;
        binding[methodToThrottle] = throttle;
        binding.throttleState = {
            delay: delay,
            last: 0,
            timeoutId: null
        };
    };
    ThrottleBindingBehavior.prototype.unbind = function (binding, source) {
        var methodToRestore = binding.throttledMethod.originalName;
        binding[methodToRestore] = binding.throttledMethod;
        binding.throttledMethod = null;
        clearTimeout(binding.throttleState.timeoutId);
        binding.throttleState = null;
    };
    ThrottleBindingBehavior = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_4_aurelia_binding__["o" /* bindingBehavior */])('throttle')
    ], ThrottleBindingBehavior);
    return ThrottleBindingBehavior;
}());

var unset = {};
function debounceCallSource(event) {
    var _this = this;
    var state = this.debounceState;
    clearTimeout(state.timeoutId);
    state.timeoutId = setTimeout(function () { return _this.debouncedMethod(event); }, state.delay);
}
function debounceCall(context, newValue, oldValue) {
    var _this = this;
    var state = this.debounceState;
    clearTimeout(state.timeoutId);
    if (context !== state.callContextToDebounce) {
        state.oldValue = unset;
        this.debouncedMethod(context, newValue, oldValue);
        return;
    }
    if (state.oldValue === unset) {
        state.oldValue = oldValue;
    }
    state.timeoutId = setTimeout(function () {
        var _oldValue = state.oldValue;
        state.oldValue = unset;
        _this.debouncedMethod(context, newValue, _oldValue);
    }, state.delay);
}
var DebounceBindingBehavior = (function () {
    function DebounceBindingBehavior() {
    }
    DebounceBindingBehavior.prototype.bind = function (binding, source, delay) {
        if (delay === void 0) { delay = 200; }
        var isCallSource = binding.callSource !== undefined;
        var methodToDebounce = isCallSource ? 'callSource' : 'call';
        var debouncer = isCallSource ? debounceCallSource : debounceCall;
        var mode = binding.mode;
        var callContextToDebounce = mode === __WEBPACK_IMPORTED_MODULE_4_aurelia_binding__["f" /* bindingMode */].twoWay || mode === __WEBPACK_IMPORTED_MODULE_4_aurelia_binding__["f" /* bindingMode */].fromView ? __WEBPACK_IMPORTED_MODULE_4_aurelia_binding__["p" /* targetContext */] : __WEBPACK_IMPORTED_MODULE_4_aurelia_binding__["k" /* sourceContext */];
        binding.debouncedMethod = binding[methodToDebounce];
        binding.debouncedMethod.originalName = methodToDebounce;
        binding[methodToDebounce] = debouncer;
        binding.debounceState = {
            callContextToDebounce: callContextToDebounce,
            delay: delay,
            timeoutId: 0,
            oldValue: unset
        };
    };
    DebounceBindingBehavior.prototype.unbind = function (binding, source) {
        var methodToRestore = binding.debouncedMethod.originalName;
        binding[methodToRestore] = binding.debouncedMethod;
        binding.debouncedMethod = null;
        clearTimeout(binding.debounceState.timeoutId);
        binding.debounceState = null;
    };
    DebounceBindingBehavior = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_4_aurelia_binding__["o" /* bindingBehavior */])('debounce')
    ], DebounceBindingBehavior);
    return DebounceBindingBehavior;
}());

function findOriginalEventTarget(event) {
    return (event.path && event.path[0]) || (event.deepPath && event.deepPath[0]) || event.target;
}
function handleSelfEvent(event) {
    var target = findOriginalEventTarget(event);
    if (this.target !== target) {
        return;
    }
    this.selfEventCallSource(event);
}
var SelfBindingBehavior = (function () {
    function SelfBindingBehavior() {
    }
    SelfBindingBehavior.prototype.bind = function (binding, source) {
        if (!binding.callSource || !binding.targetEvent) {
            throw new Error('Self binding behavior only supports event.');
        }
        binding.selfEventCallSource = binding.callSource;
        binding.callSource = handleSelfEvent;
    };
    SelfBindingBehavior.prototype.unbind = function (binding, source) {
        binding.callSource = binding.selfEventCallSource;
        binding.selfEventCallSource = null;
    };
    SelfBindingBehavior = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_4_aurelia_binding__["o" /* bindingBehavior */])('self')
    ], SelfBindingBehavior);
    return SelfBindingBehavior;
}());

var BindingSignaler = (function () {
    function BindingSignaler() {
        this.signals = {};
    }
    BindingSignaler.prototype.signal = function (name) {
        var bindings = this.signals[name];
        if (!bindings) {
            return;
        }
        var i = bindings.length;
        while (i--) {
            bindings[i].call(__WEBPACK_IMPORTED_MODULE_4_aurelia_binding__["k" /* sourceContext */]);
        }
    };
    return BindingSignaler;
}());

var SignalBindingBehavior = (function () {
    function SignalBindingBehavior(bindingSignaler) {
        this.signals = bindingSignaler.signals;
    }
    SignalBindingBehavior.inject = function () { return [BindingSignaler]; };
    SignalBindingBehavior.prototype.bind = function (binding, source) {
        var names = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            names[_i - 2] = arguments[_i];
        }
        if (!binding.updateTarget) {
            throw new Error('Only property bindings and string interpolation bindings can be signaled.  Trigger, delegate and call bindings cannot be signaled.');
        }
        var signals = this.signals;
        if (names.length === 1) {
            var name_1 = names[0];
            var bindings = signals[name_1] || (signals[name_1] = []);
            bindings.push(binding);
            binding.signalName = name_1;
        }
        else if (names.length > 1) {
            var i = names.length;
            while (i--) {
                var name_2 = names[i];
                var bindings = signals[name_2] || (signals[name_2] = []);
                bindings.push(binding);
            }
            binding.signalName = names;
        }
        else {
            throw new Error('Signal name is required.');
        }
    };
    SignalBindingBehavior.prototype.unbind = function (binding, source) {
        var signals = this.signals;
        var name = binding.signalName;
        binding.signalName = null;
        if (Array.isArray(name)) {
            var names = name;
            var i = names.length;
            while (i--) {
                var n = names[i];
                var bindings = signals[n];
                bindings.splice(bindings.indexOf(binding), 1);
            }
        }
        else {
            var bindings = signals[name];
            bindings.splice(bindings.indexOf(binding), 1);
        }
    };
    SignalBindingBehavior = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_4_aurelia_binding__["o" /* bindingBehavior */])('signal')
    ], SignalBindingBehavior);
    return SignalBindingBehavior;
}());

var eventNamesRequired = 'The updateTrigger binding behavior requires at least one event name argument: eg <input value.bind="firstName & updateTrigger:\'blur\'">';
var notApplicableMessage = 'The updateTrigger binding behavior can only be applied to two-way/ from-view bindings on input/select elements.';
var UpdateTriggerBindingBehavior = (function () {
    function UpdateTriggerBindingBehavior() {
    }
    UpdateTriggerBindingBehavior.prototype.bind = function (binding, source) {
        var events = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            events[_i - 2] = arguments[_i];
        }
        if (events.length === 0) {
            throw new Error(eventNamesRequired);
        }
        if (binding.mode !== __WEBPACK_IMPORTED_MODULE_4_aurelia_binding__["f" /* bindingMode */].twoWay && binding.mode !== __WEBPACK_IMPORTED_MODULE_4_aurelia_binding__["f" /* bindingMode */].fromView) {
            throw new Error(notApplicableMessage);
        }
        var targetObserver = binding.observerLocator.getObserver(binding.target, binding.targetProperty);
        if (!targetObserver.handler) {
            throw new Error(notApplicableMessage);
        }
        binding.targetObserver = targetObserver;
        targetObserver.originalHandler = binding.targetObserver.handler;
        var handler = new __WEBPACK_IMPORTED_MODULE_4_aurelia_binding__["q" /* EventSubscriber */](events);
        targetObserver.handler = handler;
    };
    UpdateTriggerBindingBehavior.prototype.unbind = function (binding, source) {
        var targetObserver = binding.targetObserver;
        targetObserver.handler.dispose();
        targetObserver.handler = targetObserver.originalHandler;
        targetObserver.originalHandler = null;
    };
    UpdateTriggerBindingBehavior = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_4_aurelia_binding__["o" /* bindingBehavior */])('updateTrigger')
    ], UpdateTriggerBindingBehavior);
    return UpdateTriggerBindingBehavior;
}());

function _createDynamicElement(_a) {
    var name = _a.name, viewUrl = _a.viewUrl, bindableNames = _a.bindableNames, useShadowDOMmode = _a.useShadowDOMmode;
    var DynamicElement = (function () {
        function DynamicElement() {
        }
        DynamicElement.prototype.bind = function (bindingContext) {
            this.$parent = bindingContext;
        };
        DynamicElement = __decorate([
            __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3_aurelia_templating__["n" /* customElement */])(name),
            __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3_aurelia_templating__["o" /* useView */])(viewUrl)
        ], DynamicElement);
        return DynamicElement;
    }());
    for (var i = 0, ii = bindableNames.length; i < ii; ++i) {
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3_aurelia_templating__["p" /* bindable */])(bindableNames[i])(DynamicElement);
    }
    switch (useShadowDOMmode) {
        case 'open':
            __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3_aurelia_templating__["x" /* useShadowDOM */])({ mode: 'open' })(DynamicElement);
            break;
        case 'closed':
            __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3_aurelia_templating__["x" /* useShadowDOM */])({ mode: 'closed' })(DynamicElement);
            break;
        case '':
            __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3_aurelia_templating__["x" /* useShadowDOM */])(DynamicElement);
            break;
        case null:
            break;
        default:
            __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_5_aurelia_logging__["getLogger"])('aurelia-html-only-element')
                .warn("Expected 'use-shadow-dom' value to be \"close\", \"open\" or \"\", received " + useShadowDOMmode);
            break;
    }
    return DynamicElement;
}

function getElementName(address) {
    return /([^\/^\?]+)\.html/i.exec(address)[1].toLowerCase();
}
function configure(config) {
    var viewEngine = config.container.get(__WEBPACK_IMPORTED_MODULE_3_aurelia_templating__["f" /* ViewEngine */]);
    var loader = config.aurelia.loader;
    viewEngine.addResourcePlugin('.html', {
        'fetch': function (viewUrl) {
            return loader.loadTemplate(viewUrl).then(function (registryEntry) {
                var _a;
                var bindableNames = registryEntry.template.getAttribute('bindable');
                var useShadowDOMmode = registryEntry.template.getAttribute('use-shadow-dom');
                var name = getElementName(viewUrl);
                if (bindableNames) {
                    bindableNames = bindableNames.split(',').map(function (x) { return x.trim(); });
                    registryEntry.template.removeAttribute('bindable');
                }
                else {
                    bindableNames = [];
                }
                return _a = {}, _a[name] = _createDynamicElement({ name: name, viewUrl: viewUrl, bindableNames: bindableNames, useShadowDOMmode: useShadowDOMmode }), _a;
            });
        }
    });
}

function configure$1(config) {
    injectAureliaHideStyleAtHead();
    config.globalResources(Compose, If, Else, With, Repeat, Show, Hide, Replaceable, Focus, SanitizeHTMLValueConverter, OneTimeBindingBehavior, OneWayBindingBehavior, ToViewBindingBehavior, FromViewBindingBehavior, TwoWayBindingBehavior, ThrottleBindingBehavior, DebounceBindingBehavior, SelfBindingBehavior, SignalBindingBehavior, UpdateTriggerBindingBehavior, AttrBindingBehavior);
    configure(config);
    var viewEngine = config.container.get(__WEBPACK_IMPORTED_MODULE_3_aurelia_templating__["f" /* ViewEngine */]);
    var styleResourcePlugin = {
        fetch: function (address) {
            var _a;
            return _a = {}, _a[address] = _createCSSResource(address), _a;
        }
    };
    ['.css', '.less', '.sass', '.scss', '.styl'].forEach(function (ext) { return viewEngine.addResourcePlugin(ext, styleResourcePlugin); });
}


//# sourceMappingURL=aurelia-templating-resources.js.map


/***/ }),

/***/ "aurelia-templating-router":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export RouteHref */
/* unused harmony export RouterView */
/* unused harmony export TemplatingRouteLoader */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "configure", function() { return configure; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_aurelia_router__ = __webpack_require__(13);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_aurelia_metadata__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_aurelia_path__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_aurelia_templating__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_aurelia_dependency_injection__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_aurelia_binding__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_aurelia_pal__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7_aurelia_logging__ = __webpack_require__(3);









/*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */
/* global Reflect, Promise */

var extendStatics = function(d, b) {
    extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return extendStatics(d, b);
};

function __extends(d, b) {
    extendStatics(d, b);
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}

var EmptyLayoutViewModel = /** @class */ (function () {
    function EmptyLayoutViewModel() {
    }
    return EmptyLayoutViewModel;
}());
/**
 * Implementation of Aurelia Router ViewPort. Responsible for loading route, composing and swapping routes views
 */
var RouterView = /** @class */ (function () {
    function RouterView(element, container, viewSlot, router, viewLocator, compositionTransaction, compositionEngine) {
        this.element = element;
        this.container = container;
        this.viewSlot = viewSlot;
        this.router = router;
        this.viewLocator = viewLocator;
        this.compositionTransaction = compositionTransaction;
        this.compositionEngine = compositionEngine;
        // add this <router-view/> to router view ports lookup based on name attribute
        // when this router is the root router-view
        // also trigger AppRouter registerViewPort extra flow
        this.router.registerViewPort(this, this.element.getAttribute('name'));
        // Each <router-view/> process its instruction as a composition transaction
        // there are differences between intial composition and subsequent compositions
        // also there are differences between root composition and child <router-view/> composition
        // mark the first composition transaction with a property initialComposition to distinguish it
        // when the root <router-view/> gets new instruction for the first time
        if (!('initialComposition' in compositionTransaction)) {
            compositionTransaction.initialComposition = true;
            this.compositionTransactionNotifier = compositionTransaction.enlist();
        }
    }
    /**@internal */
    RouterView.inject = function () {
        return [__WEBPACK_IMPORTED_MODULE_6_aurelia_pal__["c" /* DOM */].Element, __WEBPACK_IMPORTED_MODULE_4_aurelia_dependency_injection__["a" /* Container */], __WEBPACK_IMPORTED_MODULE_3_aurelia_templating__["e" /* ViewSlot */], __WEBPACK_IMPORTED_MODULE_0_aurelia_router__["a" /* Router */], __WEBPACK_IMPORTED_MODULE_3_aurelia_templating__["h" /* ViewLocator */], __WEBPACK_IMPORTED_MODULE_3_aurelia_templating__["d" /* CompositionTransaction */], __WEBPACK_IMPORTED_MODULE_3_aurelia_templating__["i" /* CompositionEngine */]];
    };
    RouterView.prototype.created = function (owningView) {
        this.owningView = owningView;
    };
    RouterView.prototype.bind = function (bindingContext, overrideContext) {
        // router needs to get access to view model of current route parent
        // doing it in generic way via viewModel property on container
        this.container.viewModel = bindingContext;
        this.overrideContext = overrideContext;
    };
    /**
     * Implementation of `aurelia-router` ViewPort interface, responsible for templating related part in routing Pipeline
     */
    RouterView.prototype.process = function ($viewPortInstruction, waitToSwap) {
        var _this = this;
        // have strong typings without exposing it in public typings, this is to ensure maximum backward compat
        var viewPortInstruction = $viewPortInstruction;
        var component = viewPortInstruction.component;
        var childContainer = component.childContainer;
        var viewModel = component.viewModel;
        var viewModelResource = component.viewModelResource;
        var metadata = viewModelResource.metadata;
        var config = component.router.currentInstruction.config;
        var viewPortConfig = config.viewPorts ? (config.viewPorts[viewPortInstruction.name] || {}) : {};
        childContainer.get(RouterViewLocator)._notify(this);
        // layoutInstruction is our layout viewModel
        var layoutInstruction = {
            viewModel: viewPortConfig.layoutViewModel || config.layoutViewModel || this.layoutViewModel,
            view: viewPortConfig.layoutView || config.layoutView || this.layoutView,
            model: viewPortConfig.layoutModel || config.layoutModel || this.layoutModel,
            router: viewPortInstruction.component.router,
            childContainer: childContainer,
            viewSlot: this.viewSlot
        };
        // viewport will be a thin wrapper around composition engine
        // to process instruction/configuration from users
        // preparing all information related to a composition process
        // first by getting view strategy of a ViewPortComponent View
        var viewStrategy = this.viewLocator.getViewStrategy(component.view || viewModel);
        if (viewStrategy && component.view) {
            viewStrategy.makeRelativeTo(__WEBPACK_IMPORTED_MODULE_1_aurelia_metadata__["c" /* Origin */].get(component.router.container.viewModel.constructor).moduleId);
        }
        // using metadata of a custom element view model to load appropriate view-factory instance
        return metadata
            .load(childContainer, viewModelResource.value, null, viewStrategy, true)
            // for custom element, viewFactory typing is always ViewFactory
            // for custom attribute, it will be HtmlBehaviorResource
            .then(function (viewFactory) {
            // if this is not the first time that this <router-view/> is composing its instruction
            // try to capture ownership of the composition transaction
            // child <router-view/> will not be able to capture, since root <router-view/> typically captures
            // the ownership token
            if (!_this.compositionTransactionNotifier) {
                _this.compositionTransactionOwnershipToken = _this.compositionTransaction.tryCapture();
            }
            if (layoutInstruction.viewModel || layoutInstruction.view) {
                viewPortInstruction.layoutInstruction = layoutInstruction;
            }
            var viewPortComponentBehaviorInstruction = __WEBPACK_IMPORTED_MODULE_3_aurelia_templating__["j" /* BehaviorInstruction */].dynamic(_this.element, viewModel, viewFactory);
            viewPortInstruction.controller = metadata.create(childContainer, viewPortComponentBehaviorInstruction);
            if (waitToSwap) {
                return null;
            }
            _this.swap(viewPortInstruction);
        });
    };
    RouterView.prototype.swap = function ($viewPortInstruction) {
        var _this = this;
        // have strong typings without exposing it in public typings, this is to ensure maximum backward compat
        var viewPortInstruction = $viewPortInstruction;
        var viewPortController = viewPortInstruction.controller;
        var layoutInstruction = viewPortInstruction.layoutInstruction;
        var previousView = this.view;
        // Final step of swapping a <router-view/> ViewPortComponent
        var work = function () {
            var swapStrategy = __WEBPACK_IMPORTED_MODULE_3_aurelia_templating__["k" /* SwapStrategies */][_this.swapOrder] || __WEBPACK_IMPORTED_MODULE_3_aurelia_templating__["k" /* SwapStrategies */].after;
            var viewSlot = _this.viewSlot;
            swapStrategy(viewSlot, previousView, function () { return Promise.resolve(viewSlot.add(_this.view)); }).then(function () {
                _this._notify();
            });
        };
        // Ensure all users setups have been completed
        var ready = function (owningView_or_layoutView) {
            viewPortController.automate(_this.overrideContext, owningView_or_layoutView);
            var transactionOwnerShipToken = _this.compositionTransactionOwnershipToken;
            // if this router-view is the root <router-view/> of a normal startup via aurelia.setRoot
            // attemp to take control of the transaction
            // if ownership can be taken
            // wait for transaction to complete before swapping
            if (transactionOwnerShipToken) {
                return transactionOwnerShipToken
                    .waitForCompositionComplete()
                    .then(function () {
                    _this.compositionTransactionOwnershipToken = null;
                    return work();
                });
            }
            // otherwise, just swap
            return work();
        };
        // If there is layout instruction, new to compose layout before processing ViewPortComponent
        // layout controller/view/view-model is composed using composition engine APIs
        if (layoutInstruction) {
            if (!layoutInstruction.viewModel) {
                // createController chokes if there's no viewmodel, so create a dummy one
                // but avoid using a POJO as it creates unwanted metadata in Object constructor
                layoutInstruction.viewModel = new EmptyLayoutViewModel();
            }
            // using composition engine to create compose layout
            return this.compositionEngine
                // first create controller from layoutInstruction
                // and treat it as CompositionContext
                // then emulate slot projection with ViewPortComponent view
                .createController(layoutInstruction)
                .then(function (layoutController) {
                var layoutView = layoutController.view;
                __WEBPACK_IMPORTED_MODULE_3_aurelia_templating__["l" /* ShadowDOM */].distributeView(viewPortController.view, layoutController.slots || layoutView.slots);
                // when there is a layout
                // view hierarchy is: <router-view/> owner view -> layout view -> ViewPortComponent view
                layoutController.automate(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_5_aurelia_binding__["d" /* createOverrideContext */])(layoutInstruction.viewModel), _this.owningView);
                layoutView.children.push(viewPortController.view);
                return layoutView || layoutController;
            })
                .then(function (newView) {
                _this.view = newView;
                return ready(newView);
            });
        }
        // if there is no layout, then get ViewPortComponent view ready as view property
        // and process controller/swapping
        // when there is no layout
        // view hierarchy is: <router-view/> owner view -> ViewPortComponent view
        this.view = viewPortController.view;
        return ready(this.owningView);
    };
    /**
     * Notify composition transaction that this router has finished processing
     * Happens when this <router-view/> is the root router-view
     * @internal
     */
    RouterView.prototype._notify = function () {
        var notifier = this.compositionTransactionNotifier;
        if (notifier) {
            notifier.done();
            this.compositionTransactionNotifier = null;
        }
    };
    /**
     * @internal Actively avoid using decorator to reduce the amount of code generated
     *
     * There is no view to compose by default in a router view
     * This custom element is responsible for composing its own view, based on current config
     */
    RouterView.$view = null;
    /**
     * @internal Actively avoid using decorator to reduce the amount of code generated
     */
    RouterView.$resource = {
        name: 'router-view',
        bindables: ['swapOrder', 'layoutView', 'layoutViewModel', 'layoutModel', 'inherit-binding-context']
    };
    return RouterView;
}());
/**
* Locator which finds the nearest RouterView, relative to the current dependency injection container.
*/
var RouterViewLocator = /** @class */ (function () {
    /**
    * Creates an instance of the RouterViewLocator class.
    */
    function RouterViewLocator() {
        var _this = this;
        this.promise = new Promise(function (resolve) { return _this.resolve = resolve; });
    }
    /**
    * Finds the nearest RouterView instance.
    * @returns A promise that will be resolved with the located RouterView instance.
    */
    RouterViewLocator.prototype.findNearest = function () {
        return this.promise;
    };
    /**@internal */
    RouterViewLocator.prototype._notify = function (routerView) {
        this.resolve(routerView);
    };
    return RouterViewLocator;
}());

/**@internal exported for unit testing */
var EmptyClass = /** @class */ (function () {
    function EmptyClass() {
    }
    return EmptyClass;
}());
__WEBPACK_IMPORTED_MODULE_3_aurelia_templating__["m" /* inlineView */]('<template></template>')(EmptyClass);
/**
 * Default implementation of `RouteLoader` used for loading component based on a route config
 */
var TemplatingRouteLoader = /** @class */ (function (_super) {
    __extends(TemplatingRouteLoader, _super);
    function TemplatingRouteLoader(compositionEngine) {
        var _this = _super.call(this) || this;
        _this.compositionEngine = compositionEngine;
        return _this;
    }
    /**
     * Resolve a view model from a RouteConfig
     * Throws when there is neither "moduleId" nor "viewModel" property
     * @internal
     */
    TemplatingRouteLoader.prototype.resolveViewModel = function (router, config) {
        return new Promise(function (resolve, reject) {
            var viewModel;
            if ('moduleId' in config) {
                var moduleId = config.moduleId;
                if (moduleId === null) {
                    viewModel = EmptyClass;
                }
                else {
                    // this requires container of router has passes a certain point
                    // where a view model has been setup on the container
                    // it will fail in enhance scenario because no viewport has been registered
                    moduleId = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2_aurelia_path__["a" /* relativeToFile */])(moduleId, __WEBPACK_IMPORTED_MODULE_1_aurelia_metadata__["c" /* Origin */].get(router.container.viewModel.constructor).moduleId);
                    if (/\.html/i.test(moduleId)) {
                        viewModel = createDynamicClass(moduleId);
                    }
                    else {
                        viewModel = moduleId;
                    }
                }
                return resolve(viewModel);
            }
            // todo: add if ('viewModel' in config) to support static view model resolution
            reject(new Error('Invalid route config. No "moduleId" found.'));
        });
    };
    /**
     * Create child container based on a router container
     * Also ensures that child router are properly constructed in the newly created child container
     * @internal
     */
    TemplatingRouteLoader.prototype.createChildContainer = function (router) {
        var childContainer = router.container.createChild();
        childContainer.registerSingleton(RouterViewLocator);
        childContainer.getChildRouter = function () {
            var childRouter;
            childContainer.registerHandler(__WEBPACK_IMPORTED_MODULE_0_aurelia_router__["a" /* Router */], function () { return childRouter || (childRouter = router.createChild(childContainer)); });
            return childContainer.get(__WEBPACK_IMPORTED_MODULE_0_aurelia_router__["a" /* Router */]);
        };
        return childContainer;
    };
    /**
     * Load corresponding component of a route config of a navigation instruction
     */
    TemplatingRouteLoader.prototype.loadRoute = function (router, config, _navInstruction) {
        var _this = this;
        return this
            .resolveViewModel(router, config)
            .then(function (viewModel) { return _this.compositionEngine.ensureViewModel({
            viewModel: viewModel,
            childContainer: _this.createChildContainer(router),
            view: config.view || config.viewStrategy,
            router: router
        }); });
    };
    /**@internal */
    TemplatingRouteLoader.inject = [__WEBPACK_IMPORTED_MODULE_3_aurelia_templating__["i" /* CompositionEngine */]];
    return TemplatingRouteLoader;
}(__WEBPACK_IMPORTED_MODULE_0_aurelia_router__["b" /* RouteLoader */]));
/**@internal exported for unit testing */
function createDynamicClass(moduleId) {
    var name = /([^\/^\?]+)\.html/i.exec(moduleId)[1];
    var DynamicClass = /** @class */ (function () {
        function DynamicClass() {
        }
        DynamicClass.prototype.bind = function (bindingContext) {
            this.$parent = bindingContext;
        };
        return DynamicClass;
    }());
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3_aurelia_templating__["n" /* customElement */])(name)(DynamicClass);
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3_aurelia_templating__["o" /* useView */])(moduleId)(DynamicClass);
    return DynamicClass;
}

var logger = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_7_aurelia_logging__["getLogger"])('route-href');
/**
 * Helper custom attribute to help associate an element with a route by name
 */
var RouteHref = /** @class */ (function () {
    function RouteHref(router, element) {
        this.router = router;
        this.element = element;
        this.attribute = 'href';
    }
    /*@internal */
    RouteHref.inject = function () {
        return [__WEBPACK_IMPORTED_MODULE_0_aurelia_router__["a" /* Router */], __WEBPACK_IMPORTED_MODULE_6_aurelia_pal__["c" /* DOM */].Element];
    };
    RouteHref.prototype.bind = function () {
        this.isActive = true;
        this.processChange();
    };
    RouteHref.prototype.unbind = function () {
        this.isActive = false;
    };
    RouteHref.prototype.attributeChanged = function (value, previous) {
        if (previous) {
            this.element.removeAttribute(previous);
        }
        return this.processChange();
    };
    RouteHref.prototype.processChange = function () {
        var _this = this;
        return this.router
            .ensureConfigured()
            .then(function () {
            if (!_this.isActive) {
                // returning null to avoid Bluebird warning
                return null;
            }
            var element = _this.element;
            var href = _this.router.generate(_this.route, _this.params);
            if (element.au.controller) {
                element.au.controller.viewModel[_this.attribute] = href;
            }
            else {
                element.setAttribute(_this.attribute, href);
            }
            // returning null to avoid Bluebird warning
            return null;
        })
            .catch(function (reason) {
            logger.error(reason);
        });
    };
    /**
     * @internal Actively avoid using decorator to reduce the amount of code generated
     */
    RouteHref.$resource = {
        type: 'attribute',
        name: 'route-href',
        bindables: [
            { name: 'route', changeHandler: 'processChange', primaryProperty: true },
            { name: 'params', changeHandler: 'processChange' },
            'attribute'
        ] // type definition of Aurelia templating is wrong
    };
    return RouteHref;
}());

function configure(config) {
    config
        .singleton(__WEBPACK_IMPORTED_MODULE_0_aurelia_router__["b" /* RouteLoader */], TemplatingRouteLoader)
        .singleton(__WEBPACK_IMPORTED_MODULE_0_aurelia_router__["a" /* Router */], __WEBPACK_IMPORTED_MODULE_0_aurelia_router__["c" /* AppRouter */])
        .globalResources(RouterView, RouteHref);
    config.container.registerAlias(__WEBPACK_IMPORTED_MODULE_0_aurelia_router__["a" /* Router */], __WEBPACK_IMPORTED_MODULE_0_aurelia_router__["c" /* AppRouter */]);
}


//# sourceMappingURL=aurelia-templating-router.js.map


/***/ }),

/***/ "boot":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["configure"] = configure;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_isomorphic_fetch__ = __webpack_require__(32);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_isomorphic_fetch___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_isomorphic_fetch__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_aurelia_pal__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_aurelia_fetch_client__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_bulma_css_bulma_css__ = __webpack_require__(42);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_bulma_css_bulma_css___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_bulma_css_bulma_css__);




function configure(aurelia) {
    const http = new __WEBPACK_IMPORTED_MODULE_2_aurelia_fetch_client__["a" /* HttpClient */]();
    http.configure(config => {
        config
            .useStandardConfiguration()
            .withDefaults({ headers: { 'Accept': 'application/json' } })
            .withBaseUrl('/api');
    });
    aurelia.use
        .instance(__WEBPACK_IMPORTED_MODULE_2_aurelia_fetch_client__["a" /* HttpClient */], http)
        .standardConfiguration()
        .globalResources('app/shared/colour-names-value-converter');
    if (true) {
        aurelia.use.developmentLogging();
    }
    new __WEBPACK_IMPORTED_MODULE_2_aurelia_fetch_client__["a" /* HttpClient */]().configure(config => {
        const baseUrl = document.getElementsByTagName('base')[0].href;
        config.withBaseUrl(baseUrl);
    });
    aurelia.start().then(() => aurelia.setRoot('app/app'));
}


/***/ })

/******/ });
//# sourceMappingURL=app.js.map