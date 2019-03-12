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
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/index.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/database.ts":
/*!*************************!*\
  !*** ./src/database.ts ***!
  \*************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var firebase_admin__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! firebase-admin */ \"firebase-admin\");\n/* harmony import */ var firebase_admin__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(firebase_admin__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var firebase_functions__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! firebase-functions */ \"firebase-functions\");\n/* harmony import */ var firebase_functions__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(firebase_functions__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var serialize_error__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! serialize-error */ \"serialize-error\");\n/* harmony import */ var serialize_error__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(serialize_error__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var _enums__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./enums */ \"./src/enums.ts\");\nfunction _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }\n\nfunction _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }\n\nfunction asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }\n\nfunction _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, \"next\", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, \"throw\", err); } _next(undefined); }); }; }\n\n/**\n * @file Sets up Firebase\n * @author Andreas Schjønhaug\n */\n\n\n\n\n\n// Only initialise the app once\nif (!firebase_admin__WEBPACK_IMPORTED_MODULE_0___default.a.apps.length) {\n  firebase_admin__WEBPACK_IMPORTED_MODULE_0___default.a.initializeApp(firebase_functions__WEBPACK_IMPORTED_MODULE_1__[\"config\"]().firebase);\n} else {\n  firebase_admin__WEBPACK_IMPORTED_MODULE_0___default.a.app();\n}\n\nconst db = firebase_admin__WEBPACK_IMPORTED_MODULE_0___default.a.firestore();\n\nconst database = (() => {\n  const updateTranscript =\n  /*#__PURE__*/\n  function () {\n    var _ref = _asyncToGenerator(function* (id, transcript) {\n      return db.doc(`transcripts/${id}`).set(_objectSpread({}, transcript), {\n        merge: true\n      });\n    });\n\n    return function updateTranscript(_x, _x2) {\n      return _ref.apply(this, arguments);\n    };\n  }();\n\n  const setStep =\n  /*#__PURE__*/\n  function () {\n    var _ref2 = _asyncToGenerator(function* (transcriptId, step) {\n      const transcript = {\n        process: {\n          step\n        }\n      };\n\n      if (step === _enums__WEBPACK_IMPORTED_MODULE_3__[\"Step\"].Transcoding || step === _enums__WEBPACK_IMPORTED_MODULE_3__[\"Step\"].Saving) {\n        transcript.process.percent = 0;\n      } else if (step === _enums__WEBPACK_IMPORTED_MODULE_3__[\"Step\"].Done) {\n        transcript.process.percent = firebase_admin__WEBPACK_IMPORTED_MODULE_0___default.a.firestore.FieldValue.delete();\n      }\n\n      return updateTranscript(transcriptId, transcript);\n    });\n\n    return function setStep(_x3, _x4) {\n      return _ref2.apply(this, arguments);\n    };\n  }();\n\n  const setPercent =\n  /*#__PURE__*/\n  function () {\n    var _ref3 = _asyncToGenerator(function* (transcriptId, percent) {\n      const transcript = {\n        process: {\n          percent\n        }\n      };\n      return updateTranscript(transcriptId, transcript);\n    });\n\n    return function setPercent(_x5, _x6) {\n      return _ref3.apply(this, arguments);\n    };\n  }();\n\n  const addResult =\n  /*#__PURE__*/\n  function () {\n    var _ref4 = _asyncToGenerator(function* (transcriptId, result, percent) {\n      // Batch\n      const batch = db.batch(); // Add result\n\n      const resultsRef = `transcripts/${transcriptId}/results`;\n      const resultId = db.collection(resultsRef).doc().id;\n      const resultReference = db.doc(`${resultsRef}/${resultId}`);\n      batch.create(resultReference, result); // Set percent\n\n      const transcriptReference = db.doc(`transcripts/${transcriptId}`);\n      batch.update(transcriptReference, {\n        \"process.percent\": percent\n      }); // Commit\n\n      return batch.commit();\n    });\n\n    return function addResult(_x7, _x8, _x9) {\n      return _ref4.apply(this, arguments);\n    };\n  }();\n\n  const setDuration =\n  /*#__PURE__*/\n  function () {\n    var _ref5 = _asyncToGenerator(function* (transcriptId, seconds) {\n      const transcript = {\n        metadata: {\n          audioDuration: seconds\n        }\n      };\n      return updateTranscript(transcriptId, transcript);\n    });\n\n    return function setDuration(_x10, _x11) {\n      return _ref5.apply(this, arguments);\n    };\n  }();\n\n  const errorOccured =\n  /*#__PURE__*/\n  function () {\n    var _ref6 = _asyncToGenerator(function* (transcriptId, error) {\n      const serializedError = serialize_error__WEBPACK_IMPORTED_MODULE_2___default()(error); // Firestore does not support undefined values, remove them if present.\n\n      Object.keys(serializedError).forEach(key => serializedError[key] === undefined && delete serializedError[key]);\n      const transcript = {\n        process: {\n          error: serializedError\n        }\n      };\n      return updateTranscript(transcriptId, transcript);\n    });\n\n    return function errorOccured(_x12, _x13) {\n      return _ref6.apply(this, arguments);\n    };\n  }();\n\n  const getResults =\n  /*#__PURE__*/\n  function () {\n    var _ref7 = _asyncToGenerator(function* (transcriptId) {\n      const querySnapshot = yield db.collection(`transcripts/${transcriptId}/results`).orderBy(\"startTime\").get();\n      const results = Array();\n      querySnapshot.forEach(doc => {\n        const result = doc.data();\n        results.push(result);\n      });\n      return results;\n    });\n\n    return function getResults(_x14) {\n      return _ref7.apply(this, arguments);\n    };\n  }();\n\n  const getStep =\n  /*#__PURE__*/\n  function () {\n    var _ref8 = _asyncToGenerator(function* (id) {\n      const doc = yield db.doc(`transcripts/${id}`).get();\n      const transcript = doc.data();\n      return transcript.process.step;\n    });\n\n    return function getStep(_x15) {\n      return _ref8.apply(this, arguments);\n    };\n  }();\n\n  const setPlaybackGsUrl =\n  /*#__PURE__*/\n  function () {\n    var _ref9 = _asyncToGenerator(function* (id, url) {\n      const transcript = {\n        playbackGsUrl: url\n      };\n      return updateTranscript(id, transcript);\n    });\n\n    return function setPlaybackGsUrl(_x16, _x17) {\n      return _ref9.apply(this, arguments);\n    };\n  }();\n\n  const getTranscript =\n  /*#__PURE__*/\n  function () {\n    var _ref10 = _asyncToGenerator(function* (transcriptId) {\n      const doc = yield db.doc(`transcripts/${transcriptId}`).get();\n      return doc.data();\n    });\n\n    return function getTranscript(_x18) {\n      return _ref10.apply(this, arguments);\n    };\n  }();\n\n  const deleteTranscript =\n  /*#__PURE__*/\n  function () {\n    var _ref11 = _asyncToGenerator(function* (transcriptId) {\n      // Delete the results collection\n      const resultsPath = `/transcripts/${transcriptId}/results`;\n      yield deleteCollection(resultsPath, 10); // Delete the document\n\n      return db.doc(`transcripts/${transcriptId}`).delete();\n    });\n\n    return function deleteTranscript(_x19) {\n      return _ref11.apply(this, arguments);\n    };\n  }();\n\n  const deleteCollection =\n  /*#__PURE__*/\n  function () {\n    var _ref12 = _asyncToGenerator(function* (collectionPath, batchSize) {\n      const collectionRef = db.collection(collectionPath);\n      const query = collectionRef.orderBy(\"__name__\").limit(batchSize);\n      return new Promise((resolve, reject) => {\n        deleteQueryBatch(query, batchSize, resolve, reject);\n      });\n    });\n\n    return function deleteCollection(_x20, _x21) {\n      return _ref12.apply(this, arguments);\n    };\n  }();\n\n  const deleteQueryBatch = (query, batchSize, resolve, reject) => {\n    query.get().then(snapshot => {\n      // When there are no documents left, we are done\n      if (snapshot.size === 0) {\n        return 0;\n      } // Delete documents in a batch\n\n\n      const batch = db.batch();\n      snapshot.docs.forEach(doc => {\n        batch.delete(doc.ref);\n      });\n      return batch.commit().then(() => {\n        return snapshot.size;\n      });\n    }).then(numDeleted => {\n      if (numDeleted === 0) {\n        resolve();\n        return;\n      } // Recurse on the next process tick, to avoid\n      // exploding the stack.\n\n\n      process.nextTick(() => {\n        deleteQueryBatch(query, batchSize, resolve, reject);\n      });\n    }).catch(reject);\n  };\n\n  return {\n    addResult,\n    deleteTranscript,\n    errorOccured,\n    setDuration,\n    setStep,\n    setPercent,\n    getStep,\n    getResults,\n    setPlaybackGsUrl,\n    getTranscript\n  };\n})();\n\n/* harmony default export */ __webpack_exports__[\"default\"] = (database);\n\n//# sourceURL=webpack:///./src/database.ts?");

/***/ }),

/***/ "./src/deleteTranscript/index.ts":
/*!***************************************!*\
  !*** ./src/deleteTranscript/index.ts ***!
  \***************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var firebase_functions__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! firebase-functions */ \"firebase-functions\");\n/* harmony import */ var firebase_functions__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(firebase_functions__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var path__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! path */ \"path\");\n/* harmony import */ var path__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(path__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var universal_analytics__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! universal-analytics */ \"universal-analytics\");\n/* harmony import */ var universal_analytics__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(universal_analytics__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var _database__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../database */ \"./src/database.ts\");\n/* harmony import */ var _transcription_storage__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../transcription/storage */ \"./src/transcription/storage.ts\");\nfunction asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }\n\nfunction _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, \"next\", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, \"throw\", err); } _next(undefined); }); }; }\n\n\n\n\n\n\n\nfunction deleteTranscript(_x, _x2) {\n  return _deleteTranscript.apply(this, arguments);\n}\n\nfunction _deleteTranscript() {\n  _deleteTranscript = _asyncToGenerator(function* (data, context) {\n    // ----------------\n    // Google analytics\n    // ----------------\n    const accountId = firebase_functions__WEBPACK_IMPORTED_MODULE_0__[\"config\"]().analytics.account_id;\n\n    if (!accountId) {\n      console.warn(\"Google Analytics account ID missing\");\n    }\n\n    const visitor = universal_analytics__WEBPACK_IMPORTED_MODULE_2___default()(accountId);\n\n    try {\n      // Check that transcript id is present\n      const transcriptId = data.transcriptId;\n\n      if (!transcriptId) {\n        throw new Error(\"Transcript id missing\");\n      }\n\n      const transcript = yield _database__WEBPACK_IMPORTED_MODULE_3__[\"default\"].getTranscript(transcriptId); // Setting user id\n\n      visitor.set(\"uid\", transcript.userId); // Authentication / user information is automatically added to the request\n\n      if (!context.auth) {\n        throw new Error(\"Authentication missing\");\n      }\n\n      const userId = context.auth.uid; // Check that the user owns the transcript\n\n      if (transcript.userId !== userId) {\n        throw new Error(\"User does not own the transcript\");\n      } // Step 1: Delete the transcript from database\n\n\n      yield _database__WEBPACK_IMPORTED_MODULE_3__[\"default\"].deleteTranscript(transcriptId); // Step 2: Delete the media files\n\n      const prefix = path__WEBPACK_IMPORTED_MODULE_1___default.a.join(path__WEBPACK_IMPORTED_MODULE_1___default.a.join(\"media\", userId), transcriptId); // Prefix will be /media/userId/transcriptId\n      // Using this as a prefix, we will be able to delete\n      // Prefix will be /media/userId/transcriptId-original\n      // Prefix will be /media/userId/transcriptId-playback.m4a\n      // Prefix will be /media/userId/transcriptId-transcribed.flac\n\n      yield _transcription_storage__WEBPACK_IMPORTED_MODULE_4__[\"bucket\"].deleteFiles({\n        prefix\n      });\n\n      if (transcript.process && transcript.process.step) {\n        visitor.event(\"transcription\", \"deleted\", transcript.process.step).send();\n      }\n\n      return {\n        success: true\n      };\n    } catch (error) {\n      // Log error to console\n      console.error(error); // Log error to Google Analytics\n\n      visitor.exception(error.message, true).send();\n      return {\n        success: false\n      };\n    }\n  });\n  return _deleteTranscript.apply(this, arguments);\n}\n\n/* harmony default export */ __webpack_exports__[\"default\"] = (deleteTranscript);\n\n//# sourceURL=webpack:///./src/deleteTranscript/index.ts?");

/***/ }),

/***/ "./src/enums.ts":
/*!**********************!*\
  !*** ./src/enums.ts ***!
  \**********************/
/*! exports provided: Step, InteractionType, MicrophoneDistance, OriginalMediaType, RecordingDeviceType, AudioEncoding */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"Step\", function() { return Step; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"InteractionType\", function() { return InteractionType; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"MicrophoneDistance\", function() { return MicrophoneDistance; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"OriginalMediaType\", function() { return OriginalMediaType; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"RecordingDeviceType\", function() { return RecordingDeviceType; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"AudioEncoding\", function() { return AudioEncoding; });\nlet Step; // Use case categories that the audio recognition request can be described by.\n\n(function (Step) {\n  Step[\"Uploading\"] = \"UPLOADING\";\n  Step[\"Transcoding\"] = \"TRANSCODING\";\n  Step[\"Transcribing\"] = \"TRANSCRIBING\";\n  Step[\"Saving\"] = \"SAVING\";\n  Step[\"Done\"] = \"DONE\";\n})(Step || (Step = {}));\n\nlet InteractionType;\n\n(function (InteractionType) {\n  InteractionType[\"Unspecified\"] = \"INTERACTION_TYPE_UNSPECIFIED\";\n  InteractionType[\"Discussion\"] = \"DISCUSSION\";\n  InteractionType[\"Presentaton\"] = \"PRESENTATION\";\n  InteractionType[\"PhoneCall\"] = \"PHONE_CALL\";\n  InteractionType[\"Voicemail\"] = \"VOICEMAIL\";\n  InteractionType[\"ProfessionallyProduced\"] = \"PROFESSIONALLY_PRODUCED\";\n  InteractionType[\"VoiceSearch\"] = \"VOICE_SEARCH\";\n  InteractionType[\"VoiceCommand\"] = \"VOICE_COMMAND\";\n  InteractionType[\"Dictation\"] = \"DICTATION\";\n})(InteractionType || (InteractionType = {}));\n\n// Enumerates the types of capture settings describing an audio file.\nlet MicrophoneDistance;\n\n(function (MicrophoneDistance) {\n  MicrophoneDistance[\"Unspecified\"] = \"MICROPHONE_DISTANCE_UNSPECIFIED\";\n  MicrophoneDistance[\"Nearfield\"] = \"NEARFIELD\";\n  MicrophoneDistance[\"Midfield\"] = \"MIDFIELD\";\n  MicrophoneDistance[\"Farfield\"] = \"FARFIELD\";\n})(MicrophoneDistance || (MicrophoneDistance = {}));\n\n// The original media the speech was recorded on.\nlet OriginalMediaType;\n\n(function (OriginalMediaType) {\n  OriginalMediaType[\"Unspecified\"] = \"ORIGINAL_MEDIA_TYPE_UNSPECIFIED\";\n  OriginalMediaType[\"Audio\"] = \"AUDIO\";\n  OriginalMediaType[\"Video\"] = \"VIDEO\";\n})(OriginalMediaType || (OriginalMediaType = {}));\n\n// The type of device the speech was recorded with.\nlet RecordingDeviceType;\n\n(function (RecordingDeviceType) {\n  RecordingDeviceType[\"Unspecified\"] = \"RECORDING_DEVICE_TYPE_UNSPECIFIED\";\n  RecordingDeviceType[\"Smartphone\"] = \"SMARTPHONE\";\n  RecordingDeviceType[\"PC\"] = \"PC\";\n  RecordingDeviceType[\"PhoneLine\"] = \"PHONE_LINE\";\n  RecordingDeviceType[\"Vehicle\"] = \"VEHICLE\";\n  RecordingDeviceType[\"OtherOutdoorDevice\"] = \"OTHER_OUTDOOR_DEVICE\";\n  RecordingDeviceType[\"OtherIndoorDevice\"] = \"OTHER_INDOOR_DEVICE\";\n})(RecordingDeviceType || (RecordingDeviceType = {}));\n\n// The encoding of the audio data sent in the request.\nlet AudioEncoding;\n\n(function (AudioEncoding) {\n  AudioEncoding[\"Unspecified\"] = \"ENCODING_UNSPECIFIED\";\n  AudioEncoding[\"Linear16\"] = \"LINEAR16\";\n  AudioEncoding[\"Flac\"] = \"FLAC\";\n  AudioEncoding[\"Mulaw\"] = \"MULAW\";\n  AudioEncoding[\"Amr\"] = \"AMR\";\n  AudioEncoding[\"AmrWb\"] = \"AMR_WB\";\n  AudioEncoding[\"OggOpus\"] = \"OGG_OPUS\";\n  AudioEncoding[\"SpeedxWithHeaderByte\"] = \"SPEEX_WITH_HEADER_BYTE\";\n})(AudioEncoding || (AudioEncoding = {}));\n\n//# sourceURL=webpack:///./src/enums.ts?");

/***/ }),

/***/ "./src/exportTranscript/docx.ts":
/*!**************************************!*\
  !*** ./src/exportTranscript/docx.ts ***!
  \**************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var docx__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! docx */ \"docx\");\n/* harmony import */ var docx__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(docx__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _nanoSecondsToFormattedTime__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./nanoSecondsToFormattedTime */ \"./src/exportTranscript/nanoSecondsToFormattedTime.ts\");\nfunction _objectValues(obj) {\n  var values = [];\n  var keys = Object.keys(obj);\n\n  for (var k = 0; k < keys.length; k++) values.push(obj[keys[k]]);\n\n  return values;\n}\n\nfunction asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }\n\nfunction _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, \"next\", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, \"throw\", err); } _next(undefined); }); }; }\n\n\n\n\nfunction docx(_x, _x2, _x3) {\n  return _docx.apply(this, arguments);\n}\n\nfunction _docx() {\n  _docx = _asyncToGenerator(function* (transcript, results, response) {\n    const doc = new docx__WEBPACK_IMPORTED_MODULE_0__[\"Document\"]();\n    const tabStop = 1000;\n\n    _objectValues(results).map((result, i) => {\n      const metaParagraph = new docx__WEBPACK_IMPORTED_MODULE_0__[\"Paragraph\"]().leftTabStop(tabStop);\n      let speakerName = \"\";\n\n      if (transcript.speakerNames !== undefined && result.speaker !== undefined) {\n        speakerName = transcript.speakerNames[result.speaker];\n      }\n\n      const speakerNameRun = new docx__WEBPACK_IMPORTED_MODULE_0__[\"TextRun\"](speakerName).bold();\n      let transcriptStartTime = 0;\n\n      if (transcript.metadata && transcript.metadata.startTime) {\n        transcriptStartTime = transcript.metadata.startTime;\n      }\n\n      const formattedStartTime = Object(_nanoSecondsToFormattedTime__WEBPACK_IMPORTED_MODULE_1__[\"default\"])(transcriptStartTime, result.startTime || 0, true, true);\n      const timeRun = new docx__WEBPACK_IMPORTED_MODULE_0__[\"TextRun\"](formattedStartTime).bold().tab();\n      metaParagraph.addRun(speakerNameRun);\n      metaParagraph.addRun(timeRun);\n      doc.addParagraph(metaParagraph);\n      const textParagraph = new docx__WEBPACK_IMPORTED_MODULE_0__[\"Paragraph\"]();\n      const words = result.words.filter(word => !(word.deleted && word.deleted === true)) // Only words that are not deleted\n      .map(word => word.word).join(\" \");\n      const text = new docx__WEBPACK_IMPORTED_MODULE_0__[\"TextRun\"](words);\n      textParagraph.indent({\n        left: tabStop\n      });\n      textParagraph.addRun(text);\n      doc.addParagraph(textParagraph);\n      doc.addParagraph(new docx__WEBPACK_IMPORTED_MODULE_0__[\"Paragraph\"]());\n    });\n\n    const packer = new docx__WEBPACK_IMPORTED_MODULE_0__[\"Packer\"]();\n    const b64string = yield packer.toBase64String(doc);\n    response.setHeader(\"Content-Disposition\", `attachment; filename=${transcript.name}.docx`);\n    response.send(Buffer.from(b64string, \"base64\"));\n  });\n  return _docx.apply(this, arguments);\n}\n\n/* harmony default export */ __webpack_exports__[\"default\"] = (docx);\n\n//# sourceURL=webpack:///./src/exportTranscript/docx.ts?");

/***/ }),

/***/ "./src/exportTranscript/index.ts":
/*!***************************************!*\
  !*** ./src/exportTranscript/index.ts ***!
  \***************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var firebase_functions__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! firebase-functions */ \"firebase-functions\");\n/* harmony import */ var firebase_functions__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(firebase_functions__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var serialize_error__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! serialize-error */ \"serialize-error\");\n/* harmony import */ var serialize_error__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(serialize_error__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var universal_analytics__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! universal-analytics */ \"universal-analytics\");\n/* harmony import */ var universal_analytics__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(universal_analytics__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var _database__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../database */ \"./src/database.ts\");\n/* harmony import */ var _docx__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./docx */ \"./src/exportTranscript/docx.ts\");\n/* harmony import */ var _xmp__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./xmp */ \"./src/exportTranscript/xmp.ts\");\nfunction asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }\n\nfunction _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, \"next\", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, \"throw\", err); } _next(undefined); }); }; }\n\n\n\n\n\n\n\n\nfunction exportTranscript(_x, _x2) {\n  return _exportTranscript.apply(this, arguments);\n}\n\nfunction _exportTranscript() {\n  _exportTranscript = _asyncToGenerator(function* (request, response) {\n    // ----------------\n    // Google analytics\n    // ----------------\n    const accountId = firebase_functions__WEBPACK_IMPORTED_MODULE_0__[\"config\"]().analytics.account_id;\n\n    if (!accountId) {\n      console.warn(\"Google Analytics account ID missing\");\n    }\n\n    const visitor = universal_analytics__WEBPACK_IMPORTED_MODULE_2___default()(accountId);\n\n    try {\n      const id = request.query.id;\n\n      if (!id) {\n        throw new Error(\"Transcript id missing\");\n      }\n\n      const transcript = yield _database__WEBPACK_IMPORTED_MODULE_3__[\"default\"].getTranscript(id); // Setting user id\n\n      visitor.set(\"uid\", transcript.userId);\n      const results = yield _database__WEBPACK_IMPORTED_MODULE_3__[\"default\"].getResults(id);\n      const type = request.query.type;\n\n      if (type === \"docx\") {\n        yield Object(_docx__WEBPACK_IMPORTED_MODULE_4__[\"default\"])(transcript, results, response);\n        visitor.event(\"transcript\", \"exported\", type).send();\n      } else if (type === \"xmp\") {\n        Object(_xmp__WEBPACK_IMPORTED_MODULE_5__[\"default\"])(transcript, results, response);\n        visitor.event(\"transcript\", \"exported\", type).send();\n      } else {\n        throw new Error(`Unknown type: ${type}`);\n      }\n    } catch (error) {\n      // Log error to console\n      console.error(error); // Log error to Google Analytics\n\n      visitor.exception(error.message, true).send();\n      response.status(500).send(serialize_error__WEBPACK_IMPORTED_MODULE_1___default()(error));\n    }\n  });\n  return _exportTranscript.apply(this, arguments);\n}\n\n/* harmony default export */ __webpack_exports__[\"default\"] = (exportTranscript);\n\n//# sourceURL=webpack:///./src/exportTranscript/index.ts?");

/***/ }),

/***/ "./src/exportTranscript/nanoSecondsToFormattedTime.ts":
/*!************************************************************!*\
  !*** ./src/exportTranscript/nanoSecondsToFormattedTime.ts ***!
  \************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"default\", function() { return nanoSecondsToFormattedTime; });\nfunction nanoSecondsToFormattedTime(startTime, nanoSeconds, showHours, showCentiSeconds) {\n  const s = (startTime + nanoSeconds) * 1e-9;\n  const hours = Math.floor(s / 3600);\n  const minutes = Math.floor(s % 3600 / 60);\n  const seconds = Math.floor(s % 3600 % 60);\n  const centiSeconds = Math.floor(s % 1 * 100);\n  const hDisplay = showHours ? hours > 9 ? `${hours}:` : `0${hours}:` : \"\";\n  const mDisplay = minutes > 9 ? `${minutes}:` : `0${minutes}:`;\n  const sDisplay = seconds > 9 ? `${seconds}` : `0${seconds}`;\n  const csDisplay = showCentiSeconds ? centiSeconds > 9 ? `:${centiSeconds}` : `:0${centiSeconds}` : \"\";\n  return hDisplay + mDisplay + sDisplay + csDisplay;\n}\n\n//# sourceURL=webpack:///./src/exportTranscript/nanoSecondsToFormattedTime.ts?");

/***/ }),

/***/ "./src/exportTranscript/xmp.ts":
/*!*************************************!*\
  !*** ./src/exportTranscript/xmp.ts ***!
  \*************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var xmlbuilder__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! xmlbuilder */ \"xmlbuilder\");\n/* harmony import */ var xmlbuilder__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(xmlbuilder__WEBPACK_IMPORTED_MODULE_0__);\n\n\nfunction xmp(transcript, results, response) {\n  const fps = 25;\n  const markers = results.map(result => {\n    const words = result.words.filter(word => !(word.deleted && word.deleted === true)) // Only words that are not deleted\n    .map(word => word.word).join(\" \");\n    const startTime = (result.startTime || 0) * 1e-9;\n    const duration = result.words[result.words.length - 1].endTime * 1e-9 - startTime;\n    const marker = {\n      \"@rdf:parseType\": \"Resource\",\n      \"xmpDM:comment\": words,\n      \"xmpDM:duration\": duration * fps,\n      \"xmpDM:startTime\": startTime * fps\n    };\n\n    if (transcript.speakerNames !== undefined && result.speaker !== undefined) {\n      marker[\"xmpDM:name\"] = transcript.speakerNames[result.speaker];\n    }\n\n    return marker;\n  });\n  const data = {\n    \"x:xmpmeta\": {\n      \"@xmlns:x\": \"adobe:ns:meta/\",\n      \"rdf:RDF\": {\n        \"@xmlns:rdf\": \"http://www.w3.org/1999/02/22-rdf-syntax-ns#\",\n        \"rdf:Description\": {\n          \"@xmlns:xmpDM\": \"http://ns.adobe.com/xmp/1.0/DynamicMedia/\",\n          \"xmpDM:Tracks\": {\n            \"rdf:Bag\": {\n              \"rdf:li\": {\n                \"@rdf:parseType\": \"Resource\",\n                \"xmpDM:frameRate\": `f${fps}`,\n                \"xmpDM:markers\": {\n                  \"rdf:Seq\": {\n                    \"rdf:li\": markers\n                  }\n                },\n                \"xmpDM:trackName\": \"Comment\",\n                \"xmpDM:trackType\": \"Comment\"\n              }\n            }\n          }\n        }\n      }\n    }\n  };\n  const xml = xmlbuilder__WEBPACK_IMPORTED_MODULE_0___default.a.create(data, {\n    encoding: \"utf-8\"\n  }).end({\n    pretty: true\n  });\n  response.setHeader(\"Content-Disposition\", `attachment; filename=${transcript.name}.${transcript.metadata ? transcript.metadata.fileExtension : \"\"}.xmp`);\n  response.send(Buffer.from(xml));\n}\n\n/* harmony default export */ __webpack_exports__[\"default\"] = (xmp);\n\n//# sourceURL=webpack:///./src/exportTranscript/xmp.ts?");

/***/ }),

/***/ "./src/index.ts":
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var firebase_functions__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! firebase-functions */ \"firebase-functions\");\n/* harmony import */ var firebase_functions__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(firebase_functions__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _deleteTranscript__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./deleteTranscript */ \"./src/deleteTranscript/index.ts\");\n/* harmony import */ var _exportTranscript__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./exportTranscript */ \"./src/exportTranscript/index.ts\");\n/* harmony import */ var _transcription__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./transcription */ \"./src/transcription/index.ts\");\n/**\n * @file Google Cloud function\n * @author Andreas Schjønhaug\n */\n\n\n\n // --------------------\n// Create transcription\n// --------------------\n\nexports.transcription = firebase_functions__WEBPACK_IMPORTED_MODULE_0__[\"region\"](\"europe-west1\").runWith({\n  memory: \"2GB\",\n  timeoutSeconds: 540\n}).firestore.document(\"transcripts/{transcriptId}\").onCreate(_transcription__WEBPACK_IMPORTED_MODULE_3__[\"default\"]); // --------------------\n// Delete transcription\n// --------------------\n\nexports.deleteTranscript = firebase_functions__WEBPACK_IMPORTED_MODULE_0__[\"region\"](\"europe-west1\").runWith({\n  memory: \"2GB\",\n  timeoutSeconds: 540\n}).https.onCall(_deleteTranscript__WEBPACK_IMPORTED_MODULE_1__[\"default\"]); // ------\n// Export\n// ------\n\nexports.exportTranscript = firebase_functions__WEBPACK_IMPORTED_MODULE_0__[\"region\"](\"europe-west1\").https.onRequest(_exportTranscript__WEBPACK_IMPORTED_MODULE_2__[\"default\"]); // Catch unhandled rejections\n\nprocess.on(\"unhandledRejection\", (reason, promise) => {\n  console.error(new Error(`Unhandled Rejection at: Promise: ${promise} with reason: ${reason.stack || reason}`));\n});\n\n//# sourceURL=webpack:///./src/index.ts?");

/***/ }),

/***/ "./src/sendEmail/index.ts":
/*!********************************!*\
  !*** ./src/sendEmail/index.ts ***!
  \********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _sendgrid_mail__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @sendgrid/mail */ \"@sendgrid/mail\");\n/* harmony import */ var _sendgrid_mail__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_sendgrid_mail__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var firebase_functions__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! firebase-functions */ \"firebase-functions\");\n/* harmony import */ var firebase_functions__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(firebase_functions__WEBPACK_IMPORTED_MODULE_1__);\nfunction asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }\n\nfunction _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, \"next\", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, \"throw\", err); } _next(undefined); }); }; }\n\n\n\n\nfunction sendEmail(_x) {\n  return _sendEmail.apply(this, arguments);\n}\n\nfunction _sendEmail() {\n  _sendEmail = _asyncToGenerator(function* (mailData) {\n    const sendgrid = firebase_functions__WEBPACK_IMPORTED_MODULE_1__[\"config\"]().sendgrid;\n\n    if (sendgrid === undefined || sendgrid.apiKey === undefined || sendgrid.name === undefined || sendgrid.email === undefined) {\n      console.warn(\"Sendgrid not set up, skipping e-mail\");\n      return;\n    }\n\n    _sendgrid_mail__WEBPACK_IMPORTED_MODULE_0___default.a.setApiKey(sendgrid.apiKey);\n    const from = {\n      email: sendgrid.email,\n      name: sendgrid.name\n    };\n    mailData.from = from;\n    yield _sendgrid_mail__WEBPACK_IMPORTED_MODULE_0___default.a.send(mailData);\n  });\n  return _sendEmail.apply(this, arguments);\n}\n\n/* harmony default export */ __webpack_exports__[\"default\"] = (sendEmail);\n\n//# sourceURL=webpack:///./src/sendEmail/index.ts?");

/***/ }),

/***/ "./src/transcription/helpers.ts":
/*!**************************************!*\
  !*** ./src/transcription/helpers.ts ***!
  \**************************************/
/*! exports provided: hoursMinutesSecondsToSeconds */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"hoursMinutesSecondsToSeconds\", function() { return hoursMinutesSecondsToSeconds; });\nfunction hoursMinutesSecondsToSeconds(duration) {\n  const [hours, minutes, seconds] = duration.split(\":\"); // minutes are worth 60 seconds. Hours are worth 60 minutes.\n\n  return Number(hours) * 60 * 60 + Number(minutes) * 60 + Number(seconds);\n}\n\n//# sourceURL=webpack:///./src/transcription/helpers.ts?");

/***/ }),

/***/ "./src/transcription/index.ts":
/*!************************************!*\
  !*** ./src/transcription/index.ts ***!
  \************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var firebase_admin__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! firebase-admin */ \"firebase-admin\");\n/* harmony import */ var firebase_admin__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(firebase_admin__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var firebase_functions__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! firebase-functions */ \"firebase-functions\");\n/* harmony import */ var firebase_functions__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(firebase_functions__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var universal_analytics__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! universal-analytics */ \"universal-analytics\");\n/* harmony import */ var universal_analytics__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(universal_analytics__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var _database__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../database */ \"./src/database.ts\");\n/* harmony import */ var _enums__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../enums */ \"./src/enums.ts\");\n/* harmony import */ var _sendEmail__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../sendEmail */ \"./src/sendEmail/index.ts\");\n/* harmony import */ var _persistence__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./persistence */ \"./src/transcription/persistence.ts\");\n/* harmony import */ var _transcoding__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./transcoding */ \"./src/transcription/transcoding.ts\");\n/* harmony import */ var _transcribe__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./transcribe */ \"./src/transcription/transcribe.ts\");\nfunction asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }\n\nfunction _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, \"next\", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, \"throw\", err); } _next(undefined); }); }; }\n\n\n\n\n\n\n\n\n\n\n\nfunction transcription(_x) {\n  return _transcription.apply(this, arguments);\n}\n\nfunction _transcription() {\n  _transcription = _asyncToGenerator(function* (documentSnapshot\n  /*, eventContext*/\n  ) {\n    console.log(documentSnapshot.id, \"Start\"); // ----------------\n    // Google analytics\n    // ----------------\n\n    const accountId = firebase_functions__WEBPACK_IMPORTED_MODULE_1__[\"config\"]().analytics.account_id;\n\n    if (!accountId) {\n      console.warn(\"Google Analytics account ID missing\");\n    }\n\n    const visitor = universal_analytics__WEBPACK_IMPORTED_MODULE_2___default()(accountId);\n\n    try {\n      const startDate = Date.now();\n      const transcriptId = documentSnapshot.id; // Because of indempotency, we need to fetch the transcript from\n      // the server and check if it's already in process\n\n      const step = yield _database__WEBPACK_IMPORTED_MODULE_3__[\"default\"].getStep(transcriptId);\n\n      if (step !== _enums__WEBPACK_IMPORTED_MODULE_4__[\"Step\"].Uploading) {\n        console.warn(\"Transcript already processed, returning\");\n        return;\n      } // Check for mandatory fields\n\n\n      const transcript = documentSnapshot.data();\n\n      if (transcript === undefined) {\n        throw Error(\"Transcript missing\");\n      } else if (transcript.userId === undefined) {\n        throw Error(\"User id missing\");\n      } else if (transcript.metadata === undefined) {\n        throw Error(\"Metadata missing\");\n      } else if (transcript.metadata.languageCodes === undefined) {\n        throw Error(\"Language codes missing\");\n      } else if (transcript.metadata.originalMimeType === undefined) {\n        throw Error(\"Original mime type missing\");\n      } // Setting user id\n\n\n      visitor.set(\"uid\", transcript.userId); // Setting custom dimensions\n\n      visitor.set(\"cd1\", transcript.metadata.languageCodes.join(\",\"));\n      visitor.set(\"cd2\", transcript.metadata.originalMimeType);\n\n      if (transcript.metadata.industryNaicsCodeOfAudio) {\n        visitor.set(\"cd3\", transcript.metadata.industryNaicsCodeOfAudio);\n      }\n\n      if (transcript.metadata.interactionType) {\n        visitor.set(\"cd4\", transcript.metadata.interactionType);\n      }\n\n      if (transcript.metadata.microphoneDistance) {\n        visitor.set(\"cd5\", transcript.metadata.microphoneDistance);\n      }\n\n      if (transcript.metadata.originalMediaType) {\n        visitor.set(\"cd6\", transcript.metadata.originalMediaType);\n      }\n\n      if (transcript.metadata.recordingDeviceName) {\n        visitor.set(\"cd7\", transcript.metadata.recordingDeviceName);\n      }\n\n      if (transcript.metadata.recordingDeviceType) {\n        visitor.set(\"cd8\", transcript.metadata.recordingDeviceType);\n      } // Setting custom metrics\n\n\n      visitor.set(\"cm1\", transcript.metadata.audioTopic ? transcript.metadata.audioTopic.split(\" \").length : 0);\n      visitor.set(\"cm2\", transcript.metadata.speechContexts ? transcript.metadata.speechContexts[0].phrases.length : 0); // -----------------\n      // Step 1: Transcode\n      // -----------------\n\n      yield _database__WEBPACK_IMPORTED_MODULE_3__[\"default\"].setStep(transcriptId, _enums__WEBPACK_IMPORTED_MODULE_4__[\"Step\"].Transcoding);\n      const {\n        audioDuration,\n        gsUri\n      } = yield Object(_transcoding__WEBPACK_IMPORTED_MODULE_7__[\"transcode\"])(transcriptId, transcript.userId);\n      visitor.set(\"cm3\", Math.round(audioDuration));\n      const transcodedDate = Date.now();\n      const transcodedDuration = transcodedDate - startDate;\n      visitor.set(\"cm5\", Math.round(transcodedDuration / 1000));\n      visitor.event(\"transcription\", \"transcoded\", transcriptId).send();\n      visitor.timing(\"transcription\", \"transcoding\", Math.round(transcodedDuration), transcriptId).send();\n      console.log(transcriptId, \"Transcoded duration\", transcodedDuration); // ------------------\n      // Step 2: Transcribe\n      // ------------------\n\n      yield _database__WEBPACK_IMPORTED_MODULE_3__[\"default\"].setStep(transcriptId, _enums__WEBPACK_IMPORTED_MODULE_4__[\"Step\"].Transcribing);\n      const speechRecognitionResults = yield Object(_transcribe__WEBPACK_IMPORTED_MODULE_8__[\"transcribe\"])(transcriptId, transcript, gsUri);\n      let numberOfWords = 0;\n      let accumulatedConfidence = 0;\n\n      for (const speechRecognitionResult of speechRecognitionResults) {\n        // Accumulating number of words\n        if (speechRecognitionResult.alternatives.length > 0) {\n          numberOfWords += speechRecognitionResult.alternatives[0].words.length; // Logging confidence to GA\n\n          accumulatedConfidence += speechRecognitionResult.alternatives[0].confidence * speechRecognitionResult.alternatives[0].words.length;\n        }\n      }\n\n      console.log(transcriptId, \"Number of words\", numberOfWords); // If there are no transcribed words, we cancel the process here.\n\n      if (numberOfWords === 0) {\n        const error = new Error(\"Fant ingen ord i lydfilen\");\n        yield _database__WEBPACK_IMPORTED_MODULE_3__[\"default\"].errorOccured(documentSnapshot.id, error);\n        return;\n      }\n\n      visitor.set(\"cm4\", numberOfWords); // Calculating average confidence per word\n      // Confidence will have high precision, i.e. 0.9290443658828735\n      // We round it to two digits and log it as an integer, i.e. 9290,\n      // since GA only supports decimal numbers for currency.\n\n      const confidence = Math.round(accumulatedConfidence / numberOfWords * 100 * 100);\n      visitor.set(\"cm9\", confidence);\n      console.log(transcriptId, \"Confidence\", confidence);\n      const transcribedDate = Date.now();\n      const transcribedDuration = transcribedDate - transcodedDate;\n      visitor.set(\"cm6\", Math.round(transcribedDuration / 1000));\n      visitor.event(\"transcription\", \"transcribed\", transcriptId).send();\n      visitor.timing(\"transcription\", \"transcribing\", Math.round(transcribedDuration), transcriptId).send();\n      console.log(transcriptId, \"Transcribed duration\", transcribedDuration); // ------------\n      // Step 3: Save\n      // ------------\n\n      yield _database__WEBPACK_IMPORTED_MODULE_3__[\"default\"].setStep(transcriptId, _enums__WEBPACK_IMPORTED_MODULE_4__[\"Step\"].Saving);\n      yield Object(_persistence__WEBPACK_IMPORTED_MODULE_6__[\"saveResult\"])(speechRecognitionResults, transcriptId);\n      const savedDate = Date.now();\n      const savedDuration = savedDate - transcribedDate;\n      console.log(transcriptId, \"Saved duration\", savedDuration);\n      visitor.set(\"cm7\", Math.round(savedDuration / 1000));\n      visitor.event(\"transcription\", \"saved\", transcriptId).send();\n      visitor.timing(\"transcription\", \"saving\", Math.round(savedDuration), transcriptId).send(); // Done\n\n      const processDuration = savedDate - startDate;\n      visitor.set(\"cm8\", Math.round(processDuration / 1000));\n      visitor.event(\"transcription\", \"done\", transcriptId, Math.round(audioDuration)).send();\n      yield _database__WEBPACK_IMPORTED_MODULE_3__[\"default\"].setStep(transcriptId, _enums__WEBPACK_IMPORTED_MODULE_4__[\"Step\"].Done); // -------------------\n      // Step 4: Send e-mail\n      // -------------------\n\n      const domainname = firebase_functions__WEBPACK_IMPORTED_MODULE_1__[\"config\"]().webserver.domainname;\n\n      if (domainname === undefined) {\n        throw new Error(\"Domain name missing from config\");\n      } // Get user\n\n\n      const userRecord = yield firebase_admin__WEBPACK_IMPORTED_MODULE_0___default.a.auth().getUser(transcript.userId);\n      const {\n        email,\n        displayName\n      } = userRecord;\n\n      if (email === undefined) {\n        throw new Error(\"E-mail missing from user\");\n      }\n\n      const mailData = {\n        from: {\n          email: \"Will be populated in sendEmail(..)\",\n          name: \"Will be populated in sendEmail(..)\"\n        },\n        subject: `${transcript.name} er ferdig transkribert`,\n        text: `Filen ${transcript.name} er ferdig transkribert. Du finner den på ${domainname}/transcripts/${transcriptId} `,\n        to: {\n          email,\n          name: displayName\n        }\n      };\n      yield Object(_sendEmail__WEBPACK_IMPORTED_MODULE_5__[\"default\"])(mailData);\n      visitor.event(\"email\", \"transcription done\", transcriptId).send();\n    } catch (error) {\n      // Log error to console\n      console.error(error); // Log error to Google Analytics\n\n      visitor.exception(error.message, true).send(); // Log error to database\n\n      yield _database__WEBPACK_IMPORTED_MODULE_3__[\"default\"].errorOccured(documentSnapshot.id, error);\n      throw error;\n    }\n  });\n  return _transcription.apply(this, arguments);\n}\n\n/* harmony default export */ __webpack_exports__[\"default\"] = (transcription);\n\n//# sourceURL=webpack:///./src/transcription/index.ts?");

/***/ }),

/***/ "./src/transcription/persistence.ts":
/*!******************************************!*\
  !*** ./src/transcription/persistence.ts ***!
  \******************************************/
/*! exports provided: saveResult */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"saveResult\", function() { return saveResult; });\n/* harmony import */ var _database__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../database */ \"./src/database.ts\");\nfunction asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }\n\nfunction _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, \"next\", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, \"throw\", err); } _next(undefined); }); }; }\n\n/**\n * @file Saves transcrips to database\n * @author Andreas Schjønhaug\n */\n\nfunction saveResult(_x, _x2) {\n  return _saveResult.apply(this, arguments);\n}\n\nfunction _saveResult() {\n  _saveResult = _asyncToGenerator(function* (speechRecognitionResults, transcriptId) {\n    for (const index of speechRecognitionResults.keys()) {\n      const recognitionResult = speechRecognitionResults[index].alternatives[0];\n      const words = recognitionResult.words.map(wordInfo => {\n        let startTime = 0;\n\n        if (wordInfo.startTime) {\n          if (wordInfo.startTime.seconds) {\n            startTime = parseInt(wordInfo.startTime.seconds, 10) * 1e9;\n          }\n\n          if (wordInfo.startTime.nanos) {\n            startTime += wordInfo.startTime.nanos;\n          }\n        }\n\n        let endTime = 0;\n\n        if (wordInfo.endTime) {\n          if (wordInfo.endTime.seconds) {\n            endTime = parseInt(wordInfo.endTime.seconds, 10) * 1e9;\n          }\n\n          if (wordInfo.endTime.nanos) {\n            endTime += wordInfo.endTime.nanos;\n          }\n        }\n\n        const word = {\n          confidence: wordInfo.confidence,\n          endTime,\n          startTime,\n          word: wordInfo.word\n        };\n        return word;\n      }); // Transform startTime and endTime's seconds and nanos\n\n      const result = {\n        startTime: words[0].startTime,\n        words\n      };\n      const percent = Math.round((index + 1) / speechRecognitionResults.length * 100);\n      yield _database__WEBPACK_IMPORTED_MODULE_0__[\"default\"].addResult(transcriptId, result, percent);\n      console.log(transcriptId, `Prosent lagret: ${percent}%`);\n    }\n  });\n  return _saveResult.apply(this, arguments);\n}\n\n//# sourceURL=webpack:///./src/transcription/persistence.ts?");

/***/ }),

/***/ "./src/transcription/storage.ts":
/*!**************************************!*\
  !*** ./src/transcription/storage.ts ***!
  \**************************************/
/*! exports provided: bucketName, bucket */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"bucketName\", function() { return bucketName; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"bucket\", function() { return bucket; });\n/* harmony import */ var firebase_admin__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! firebase-admin */ \"firebase-admin\");\n/* harmony import */ var firebase_admin__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(firebase_admin__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var firebase_functions__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! firebase-functions */ \"firebase-functions\");\n/* harmony import */ var firebase_functions__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(firebase_functions__WEBPACK_IMPORTED_MODULE_1__);\n/**\n * @file Sets up Storage\n * @author Andreas Schjønhaug\n */\n\n // Only initialise the app once\n\nif (!firebase_admin__WEBPACK_IMPORTED_MODULE_0___default.a.apps.length) {\n  firebase_admin__WEBPACK_IMPORTED_MODULE_0___default.a.initializeApp(firebase_functions__WEBPACK_IMPORTED_MODULE_1__[\"config\"]().firebase);\n} else {\n  firebase_admin__WEBPACK_IMPORTED_MODULE_0___default.a.app();\n}\n\nconst storage = firebase_admin__WEBPACK_IMPORTED_MODULE_0___default.a.storage(); // Getting the bucket reference from Google Cloud Runtime Configuration API\n\nconst bucketName = firebase_functions__WEBPACK_IMPORTED_MODULE_1__[\"config\"]().bucket.name;\n\nif (bucketName === undefined) {\n  throw Error(\"Environment variable 'bucket.name' not set up\");\n}\n\nconst bucket = storage.bucket(bucketName);\n\n//# sourceURL=webpack:///./src/transcription/storage.ts?");

/***/ }),

/***/ "./src/transcription/transcoding.ts":
/*!******************************************!*\
  !*** ./src/transcription/transcoding.ts ***!
  \******************************************/
/*! exports provided: transcode */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"transcode\", function() { return transcode; });\n/* harmony import */ var ffmpeg_static__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ffmpeg-static */ \"ffmpeg-static\");\n/* harmony import */ var ffmpeg_static__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(ffmpeg_static__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var fluent_ffmpeg__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! fluent-ffmpeg */ \"fluent-ffmpeg\");\n/* harmony import */ var fluent_ffmpeg__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(fluent_ffmpeg__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var fs__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! fs */ \"fs\");\n/* harmony import */ var fs__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(fs__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var os__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! os */ \"os\");\n/* harmony import */ var os__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(os__WEBPACK_IMPORTED_MODULE_3__);\n/* harmony import */ var path__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! path */ \"path\");\n/* harmony import */ var path__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(path__WEBPACK_IMPORTED_MODULE_4__);\n/* harmony import */ var _database__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../database */ \"./src/database.ts\");\n/* harmony import */ var _helpers__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./helpers */ \"./src/transcription/helpers.ts\");\n/* harmony import */ var _storage__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./storage */ \"./src/transcription/storage.ts\");\nfunction asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }\n\nfunction _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, \"next\", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, \"throw\", err); } _next(undefined); }); }; }\n\n/**\n * @file Converts uploaded audio to mono channel using FFmpeg\n * @author Andreas Schjønhaug\n */\n\n\n\n\n\n\n\n\nlet audioDuration;\n\n/**\n * Utility method to convert audio to mono channel using FFMPEG.\n *\n * Command line equivalent:\n * ffmpeg -i input -y -ac 1 -vn -f flac output\n *\n */\nfunction reencodeToFlacMono(_x, _x2, _x3) {\n  return _reencodeToFlacMono.apply(this, arguments);\n}\n/**\n * Utility method to convert audio to MP4.\n *\n * Command line equivalent:\n * ffmpeg -i input -y -ac 2 -vn -f mp4 output.m4a\n *\n */\n\n\nfunction _reencodeToFlacMono() {\n  _reencodeToFlacMono = _asyncToGenerator(function* (tempFilePath, targetTempFilePath, transcriptId) {\n    return new Promise((resolve, reject) => {\n      fluent_ffmpeg__WEBPACK_IMPORTED_MODULE_1___default()(tempFilePath).setFfmpegPath(ffmpeg_static__WEBPACK_IMPORTED_MODULE_0___default.a.path).audioChannels(1).noVideo().format(\"flac\")\n      /*DEBUG\n      .on(\"start\", commandLine => {\n        console.log(\"flac: Spawned Ffmpeg with command: \" + commandLine)\n      })*/\n      .on(\"error\", err => {\n        reject(err);\n      }).on(\"end\", () => {\n        resolve();\n      }).on(\"codecData\",\n      /*#__PURE__*/\n      function () {\n        var _ref = _asyncToGenerator(function* (data) {\n          // Saving duration to database\n          audioDuration = Object(_helpers__WEBPACK_IMPORTED_MODULE_6__[\"hoursMinutesSecondsToSeconds\"])(data.duration);\n\n          try {\n            yield _database__WEBPACK_IMPORTED_MODULE_5__[\"default\"].setDuration(transcriptId, audioDuration);\n          } catch (error) {\n            console.log(transcriptId, \"Error in transcoding on('codecData')\", error);\n          }\n        });\n\n        return function (_x8) {\n          return _ref.apply(this, arguments);\n        };\n      }()).save(targetTempFilePath);\n    });\n  });\n  return _reencodeToFlacMono.apply(this, arguments);\n}\n\nfunction reencodeToM4a(_x4, _x5) {\n  return _reencodeToM4a.apply(this, arguments);\n}\n/**\n * When an audio is uploaded in the Storage bucket we generate a mono channel audio automatically using\n * node-fluent-ffmpeg.\n */\n\n\nfunction _reencodeToM4a() {\n  _reencodeToM4a = _asyncToGenerator(function* (input, output) {\n    return new Promise((resolve, reject) => {\n      fluent_ffmpeg__WEBPACK_IMPORTED_MODULE_1___default()(input).setFfmpegPath(ffmpeg_static__WEBPACK_IMPORTED_MODULE_0___default.a.path).audioChannels(2).noVideo().format(\"mp4\")\n      /* DEBUG\n      .on(\"start\", commandLine => {\n        console.log(\"mp4: Spawned Ffmpeg with command: \" + commandLine)\n      })*/\n      .on(\"error\", err => {\n        reject(err);\n      }).on(\"end\", () => {\n        resolve();\n      }).save(output);\n    });\n  });\n  return _reencodeToM4a.apply(this, arguments);\n}\n\nfunction transcode(_x6, _x7) {\n  return _transcode.apply(this, arguments);\n}\n\nfunction _transcode() {\n  _transcode = _asyncToGenerator(function* (transcriptId, userId) {\n    // -----------------------------------\n    // 1. Check that we have an audio file\n    // -----------------------------------\n    const mediaPath = path__WEBPACK_IMPORTED_MODULE_4___default.a.join(\"media\", userId);\n    const file = _storage__WEBPACK_IMPORTED_MODULE_7__[\"bucket\"].file(path__WEBPACK_IMPORTED_MODULE_4___default.a.join(mediaPath, `${transcriptId}-original`));\n    const [fileMetadata] = yield file.getMetadata();\n    const contentType = fileMetadata.contentType; // Exit if this is triggered on a file that is not audio.\n\n    if (contentType === undefined || !contentType.startsWith(\"audio/\") && !contentType.startsWith(\"video/\") && contentType !== \"application/mxf\") {\n      throw Error(\"Uploaded file is not an audio or video file\");\n    } // ------------------------------\n    // 2. Download file and transcode\n    // ------------------------------\n\n\n    const tempFilePath = path__WEBPACK_IMPORTED_MODULE_4___default.a.join(os__WEBPACK_IMPORTED_MODULE_3___default.a.tmpdir(), transcriptId);\n    yield file.download({\n      destination: tempFilePath\n    }); // Transcode to m4a\n\n    const playbackFileName = `${transcriptId}-playback.m4a`;\n    const playbackTempFilePath = path__WEBPACK_IMPORTED_MODULE_4___default.a.join(os__WEBPACK_IMPORTED_MODULE_3___default.a.tmpdir(), playbackFileName);\n    yield reencodeToM4a(tempFilePath, playbackTempFilePath);\n    const playbackStorageFilePath = path__WEBPACK_IMPORTED_MODULE_4___default.a.join(mediaPath, playbackFileName);\n    const [playbackFile] = yield _storage__WEBPACK_IMPORTED_MODULE_7__[\"bucket\"].upload(playbackTempFilePath, {\n      destination: playbackStorageFilePath,\n      resumable: false\n    });\n    const playbackGsUrl = \"gs://\" + path__WEBPACK_IMPORTED_MODULE_4___default.a.join(_storage__WEBPACK_IMPORTED_MODULE_7__[\"bucketName\"], mediaPath, playbackFileName);\n    yield _database__WEBPACK_IMPORTED_MODULE_5__[\"default\"].setPlaybackGsUrl(transcriptId, playbackGsUrl); // Transcode to FLAC mono\n\n    const transcribeFileName = `${transcriptId}-transcribed.flac`;\n    const transcribeTempFilePath = path__WEBPACK_IMPORTED_MODULE_4___default.a.join(os__WEBPACK_IMPORTED_MODULE_3___default.a.tmpdir(), transcribeFileName);\n    yield reencodeToFlacMono(tempFilePath, transcribeTempFilePath, transcriptId);\n    const targetStorageFilePath = path__WEBPACK_IMPORTED_MODULE_4___default.a.join(mediaPath, transcribeFileName);\n    yield _storage__WEBPACK_IMPORTED_MODULE_7__[\"bucket\"].upload(transcribeTempFilePath, {\n      destination: targetStorageFilePath,\n      resumable: false\n    }); // Once the audio has been uploaded delete the local file to free up disk space.\n\n    fs__WEBPACK_IMPORTED_MODULE_2___default.a.unlinkSync(tempFilePath);\n    fs__WEBPACK_IMPORTED_MODULE_2___default.a.unlinkSync(playbackTempFilePath);\n    fs__WEBPACK_IMPORTED_MODULE_2___default.a.unlinkSync(transcribeTempFilePath);\n    return {\n      audioDuration,\n      gsUri: `gs://${_storage__WEBPACK_IMPORTED_MODULE_7__[\"bucketName\"]}/${targetStorageFilePath}`\n    };\n  });\n  return _transcode.apply(this, arguments);\n}\n\n//# sourceURL=webpack:///./src/transcription/transcoding.ts?");

/***/ }),

/***/ "./src/transcription/transcribe.ts":
/*!*****************************************!*\
  !*** ./src/transcription/transcribe.ts ***!
  \*****************************************/
/*! exports provided: transcribe */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"transcribe\", function() { return transcribe; });\n/* harmony import */ var _google_cloud_speech__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @google-cloud/speech */ \"@google-cloud/speech\");\n/* harmony import */ var _google_cloud_speech__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_google_cloud_speech__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _database__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../database */ \"./src/database.ts\");\nfunction asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }\n\nfunction _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, \"next\", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, \"throw\", err); } _next(undefined); }); }; }\n\n/**\n * @file Transcripts audio with Google Speech\n * @author Andreas Schjønhaug\n */\n\n\nconst client = new _google_cloud_speech__WEBPACK_IMPORTED_MODULE_0___default.a.v1p1beta1.SpeechClient();\n\nfunction trans(_x, _x2) {\n  return _trans.apply(this, arguments);\n}\n\nfunction _trans() {\n  _trans = _asyncToGenerator(function* (operation, transcriptId) {\n    return new Promise((resolve, reject) => {\n      operation.on(\"complete\", (longRunningRecognizeResponse\n      /*, longRunningRecognizeMetadata, finalApiResponse*/\n      ) => {\n        // Adding a listener for the \"complete\" event starts polling for the\n        // completion of the operation.\n        const speechRecognitionResults = longRunningRecognizeResponse.results;\n        resolve(speechRecognitionResults);\n      }).on(\"progress\",\n      /*#__PURE__*/\n      function () {\n        var _ref = _asyncToGenerator(function* (longRunningRecognizeMetadata\n        /*, apiResponse*/\n        ) {\n          // Adding a listener for the \"progress\" event causes the callback to be\n          // called on any change in metadata when the operation is polled.\n          const percent = longRunningRecognizeMetadata.progressPercent;\n\n          if (percent !== undefined) {\n            try {\n              yield _database__WEBPACK_IMPORTED_MODULE_1__[\"default\"].setPercent(transcriptId, percent);\n            } catch (error) {\n              console.log(transcriptId, \"Error in on.('progress')\");\n              console.error(transcriptId, error);\n            }\n          }\n\n          console.log(transcriptId, \"progressPercent\", longRunningRecognizeMetadata.progressPercent\n          /*, apiResponse*/\n          );\n        });\n\n        return function (_x6) {\n          return _ref.apply(this, arguments);\n        };\n      }()).on(\"error\", error => {\n        // Adding a listener for the \"error\" event handles any errors found during polling.\n        reject(error);\n      });\n    });\n  });\n  return _trans.apply(this, arguments);\n}\n\nfunction transcribe(_x3, _x4, _x5) {\n  return _transcribe.apply(this, arguments);\n}\n\nfunction _transcribe() {\n  _transcribe = _asyncToGenerator(function* (transcriptId, transcript, uri) {\n    if (!transcript.metadata || !transcript.metadata.languageCodes || transcript.metadata.languageCodes.length === 0) {\n      throw new Error(\"Language codes missing\");\n    }\n\n    const languageCode = transcript.metadata.languageCodes.shift();\n    const enableAutomaticPunctuation = languageCode === \"en-US\"; // Only working for en-US at the moment\n\n    const recognitionMetadata = {\n      audioTopic: transcript.metadata.audioTopic,\n      // An arbitrary description of the subject matter discussed in the audio file. Examples include \"Guided tour of New York City,\" \"court trial hearing,\" or \"live interview between 2 people.\"\n      industryNaicsCodeOfAudio: transcript.metadata.industryNaicsCodeOfAudio,\n      // The industry vertical of the audio file, as a 6-digit NAICS code.\n      interactionType: transcript.metadata.interactionType,\n      // The use case of the audio.\n      microphoneDistance: transcript.metadata.microphoneDistance,\n      // The distance of the microphone from the speaker.\n      originalMediaType: transcript.metadata.originalMediaType,\n      // The original media of the audio, either audio or video.\n      originalMimeType: transcript.metadata.originalMimeType,\n      // The MIME type of the original audio file. Examples include audio/m4a, audio/x-alaw-basic, audio/mp3, audio/3gpp, or other audio file MIME type.\n      recordingDeviceName: transcript.metadata.recordingDeviceName,\n      // The device used to make the recording. This arbitrary string can include names like 'Pixel XL', 'VoIP', 'Cardioid Microphone', or other value.\n      recordingDeviceType: transcript.metadata.recordingDeviceType // The kind of device used to capture the audio, including smartphones, PC microphones, vehicles, etc.\n\n    };\n    const recognitionRequest = {\n      audio: {\n        uri\n      },\n      config: {\n        enableAutomaticPunctuation,\n        enableWordConfidence: true,\n        enableWordTimeOffsets: true,\n        languageCode,\n        metadata: recognitionMetadata,\n        model: \"default\",\n        speechContexts: transcript.metadata.speechContexts,\n        useEnhanced: false\n      }\n    };\n\n    if (transcript.metadata.languageCodes.length > 0) {\n      recognitionRequest.config.alternativeLanguageCodes = transcript.metadata.languageCodes;\n    }\n\n    console.log(transcriptId, \"Start transcribing\", recognitionRequest); // Detects speech in the audio file. This creates a recognition job that you\n    // can wait for now, or get its result later.\n\n    const responses = yield client.longRunningRecognize(recognitionRequest);\n    const operation = responses[0];\n    console.log(transcriptId, \"operation\", operation);\n    const speechRecognitionResults = yield trans(operation, transcriptId);\n    return speechRecognitionResults;\n  });\n  return _transcribe.apply(this, arguments);\n}\n\n//# sourceURL=webpack:///./src/transcription/transcribe.ts?");

/***/ }),

/***/ "@google-cloud/speech":
/*!***************************************!*\
  !*** external "@google-cloud/speech" ***!
  \***************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"@google-cloud/speech\");\n\n//# sourceURL=webpack:///external_%22@google-cloud/speech%22?");

/***/ }),

/***/ "@sendgrid/mail":
/*!*********************************!*\
  !*** external "@sendgrid/mail" ***!
  \*********************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"@sendgrid/mail\");\n\n//# sourceURL=webpack:///external_%22@sendgrid/mail%22?");

/***/ }),

/***/ "docx":
/*!***********************!*\
  !*** external "docx" ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"docx\");\n\n//# sourceURL=webpack:///external_%22docx%22?");

/***/ }),

/***/ "ffmpeg-static":
/*!********************************!*\
  !*** external "ffmpeg-static" ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"ffmpeg-static\");\n\n//# sourceURL=webpack:///external_%22ffmpeg-static%22?");

/***/ }),

/***/ "firebase-admin":
/*!*********************************!*\
  !*** external "firebase-admin" ***!
  \*********************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"firebase-admin\");\n\n//# sourceURL=webpack:///external_%22firebase-admin%22?");

/***/ }),

/***/ "firebase-functions":
/*!*************************************!*\
  !*** external "firebase-functions" ***!
  \*************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"firebase-functions\");\n\n//# sourceURL=webpack:///external_%22firebase-functions%22?");

/***/ }),

/***/ "fluent-ffmpeg":
/*!********************************!*\
  !*** external "fluent-ffmpeg" ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"fluent-ffmpeg\");\n\n//# sourceURL=webpack:///external_%22fluent-ffmpeg%22?");

/***/ }),

/***/ "fs":
/*!*********************!*\
  !*** external "fs" ***!
  \*********************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"fs\");\n\n//# sourceURL=webpack:///external_%22fs%22?");

/***/ }),

/***/ "os":
/*!*********************!*\
  !*** external "os" ***!
  \*********************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"os\");\n\n//# sourceURL=webpack:///external_%22os%22?");

/***/ }),

/***/ "path":
/*!***********************!*\
  !*** external "path" ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"path\");\n\n//# sourceURL=webpack:///external_%22path%22?");

/***/ }),

/***/ "serialize-error":
/*!**********************************!*\
  !*** external "serialize-error" ***!
  \**********************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"serialize-error\");\n\n//# sourceURL=webpack:///external_%22serialize-error%22?");

/***/ }),

/***/ "universal-analytics":
/*!**************************************!*\
  !*** external "universal-analytics" ***!
  \**************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"universal-analytics\");\n\n//# sourceURL=webpack:///external_%22universal-analytics%22?");

/***/ }),

/***/ "xmlbuilder":
/*!*****************************!*\
  !*** external "xmlbuilder" ***!
  \*****************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"xmlbuilder\");\n\n//# sourceURL=webpack:///external_%22xmlbuilder%22?");

/***/ })

/******/ });