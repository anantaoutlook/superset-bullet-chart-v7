"use strict";

exports.__esModule = true;
exports.default = SupersetBulletChartV7;

var _react = _interopRequireWildcard(require("react"));

var _core = require("@superset-ui/core");

var _templateObject;

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _taggedTemplateLiteralLoose(strings, raw) { if (!raw) { raw = strings.slice(0); } strings.raw = raw; return strings; }

// The following Styles component is a <div> element, which has been styled using Emotion
// For docs, visit https://emotion.sh/docs/styled
// Theming variables are provided for your use via a ThemeProvider
// imported from @superset-ui/core. For variables available, please visit
// https://github.com/apache-superset/superset-ui/blob/master/packages/superset-ui-core/src/style/index.ts
var Styles = _core.styled.div(_templateObject || (_templateObject = _taggedTemplateLiteralLoose(["\n  background-color: ", ";\n  padding: ", "px;\n  border-radius: ", "px;\n  height: ", "px;\n  width: ", "px;\n\n  h3 {\n    /* You can use your props to control CSS! */\n    margin-top: 0;\n    margin-bottom: ", "px;\n    font-size: ", "px;\n    font-weight: ", ";\n  }\n\n  pre {\n    height: ", "px;\n  }\n"])), _ref => {
  var {
    theme
  } = _ref;
  return theme.colors.secondary.light2;
}, _ref2 => {
  var {
    theme
  } = _ref2;
  return theme.gridUnit * 4;
}, _ref3 => {
  var {
    theme
  } = _ref3;
  return theme.gridUnit * 2;
}, _ref4 => {
  var {
    height
  } = _ref4;
  return height;
}, _ref5 => {
  var {
    width
  } = _ref5;
  return width;
}, _ref6 => {
  var {
    theme
  } = _ref6;
  return theme.gridUnit * 3;
}, _ref7 => {
  var {
    theme,
    headerFontSize
  } = _ref7;
  return theme.typography.sizes[headerFontSize];
}, _ref8 => {
  var {
    theme,
    boldText
  } = _ref8;
  return theme.typography.weights[boldText ? 'bold' : 'normal'];
}, _ref9 => {
  var {
    theme,
    headerFontSize,
    height
  } = _ref9;
  return height - theme.gridUnit * 12 - theme.typography.sizes[headerFontSize];
});
/**
 * ******************* WHAT YOU CAN BUILD HERE *******************
 *  In essence, a chart is given a few key ingredients to work with:
 *  * Data: provided via `props.data`
 *  * A DOM element
 *  * FormData (your controls!) provided as props by transformProps.ts
 */


function SupersetBulletChartV7(props) {
  // height and width are the height and width of the DOM element as it exists in the dashboard.
  // There is also a `data` prop, which is, of course, your DATA 🎉
  var {
    data,
    height,
    width
  } = props;
  var rootElem = /*#__PURE__*/(0, _react.createRef)(); // Often, you just want to get a hold of the DOM and go nuts.
  // Here, you can do that with createRef, and the useEffect hook.

  (0, _react.useEffect)(() => {
    var root = rootElem.current;
    console.log('Plugin element', root);
  });
  console.log('Plugin props', props);
  return /*#__PURE__*/_react.default.createElement(Styles, {
    ref: rootElem,
    boldText: props.boldText,
    headerFontSize: props.headerFontSize,
    height: height,
    width: width
  }, /*#__PURE__*/_react.default.createElement("h3", null, props.headerText), /*#__PURE__*/_react.default.createElement("pre", null, "$", JSON.stringify(data, null, 2)));
}