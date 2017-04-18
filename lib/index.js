'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _inputmaskCore = require('inputmask-core');

var _inputmaskCore2 = _interopRequireDefault(_inputmaskCore);

var KEYCODE_Z = 90;
var KEYCODE_Y = 89;

function isUndo(e) {
  return (e.ctrlKey || e.metaKey) && e.keyCode === (e.shiftKey ? KEYCODE_Y : KEYCODE_Z);
}

function isRedo(e) {
  return (e.ctrlKey || e.metaKey) && e.keyCode === (e.shiftKey ? KEYCODE_Z : KEYCODE_Y);
}

function getSelection(el) {
  var start, end, rangeEl, clone;

  if (el.selectionStart !== undefined) {
    start = el.selectionStart;
    end = el.selectionEnd;
  } else {
    try {
      el.focus();
      rangeEl = el.createTextRange();
      clone = rangeEl.duplicate();

      rangeEl.moveToBookmark(document.selection.createRange().getBookmark());
      clone.setEndPoint('EndToStart', rangeEl);

      start = clone.text.length;
      end = start + rangeEl.text.length;
    } catch (e) {/* not focused or not visible */}
  }

  return { start: start, end: end };
}

function setSelection(el, selection) {
  var rangeEl;

  try {
    if (el.selectionStart !== undefined) {
      el.focus();
      el.setSelectionRange(selection.start, selection.end);
    } else {
      el.focus();
      rangeEl = el.createTextRange();
      rangeEl.collapse(true);
      rangeEl.moveStart('character', selection.start);
      rangeEl.moveEnd('character', selection.end - selection.start);
      rangeEl.select();
    }
  } catch (e) {/* not focused or not visible */}
}

var MaskedInput = (function (_React$Component) {
  _inherits(MaskedInput, _React$Component);

  function MaskedInput(props) {
    _classCallCheck(this, MaskedInput);

    _get(Object.getPrototypeOf(MaskedInput.prototype), 'constructor', this).call(this, props);

    this._onChange = this._onChange.bind(this);
    this._onKeyDown = this._onKeyDown.bind(this);
    this._onPaste = this._onPaste.bind(this);
    this._onKeyPress = this._onKeyPress.bind(this);
  }

  _createClass(MaskedInput, [{
    key: 'componentWillMount',
    value: function componentWillMount() {
      var options = {
        pattern: this.props.mask,
        value: this.props.value,
        formatCharacters: this.props.formatCharacters
      };
      if (this.props.placeholderChar) {
        options.placeholderChar = this.props.placeholderChar;
      }
      this.mask = new _inputmaskCore2['default'](options);
    }
  }, {
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      if (this.props.mask !== nextProps.mask && this.props.value !== nextProps.mask) {
        // if we get a new value and a new mask at the same time
        // check if the mask.value is still the initial value
        // - if so use the nextProps value
        // - otherwise the `this.mask` has a value for us (most likely from paste action)
        if (this.mask.getValue() === this.mask.emptyValue) {
          this.mask.setPattern(nextProps.mask, { value: nextProps.value });
        } else {
          this.mask.setPattern(nextProps.mask, { value: this.mask.getRawValue() });
        }
      } else if (this.props.mask !== nextProps.mask) {
        this.mask.setPattern(nextProps.mask, { value: this.mask.getRawValue() });
      } else if (this.props.value !== nextProps.value) {
        this.mask.setValue(nextProps.value);
      }
    }
  }, {
    key: 'componentWillUpdate',
    value: function componentWillUpdate(nextProps, nextState) {
      if (nextProps.mask !== this.props.mask) {
        this._updatePattern(nextProps);
      }
    }
  }, {
    key: 'componentDidUpdate',
    value: function componentDidUpdate(prevProps) {
      if (prevProps.mask !== this.props.mask && this.mask.selection.start) {
        this._updateInputSelection();
      }
    }
  }, {
    key: '_updatePattern',
    value: function _updatePattern(props) {
      this.mask.setPattern(props.mask, {
        value: this.mask.getRawValue(),
        selection: getSelection(this.input)
      });
    }
  }, {
    key: '_updateMaskSelection',
    value: function _updateMaskSelection() {
      this.mask.selection = getSelection(this.input);
    }
  }, {
    key: '_updateInputSelection',
    value: function _updateInputSelection() {
      setSelection(this.input, this.mask.selection);
    }
  }, {
    key: '_onChange',
    value: function _onChange(e) {
      // console.log('onChange', JSON.stringify(getSelection(this.input)), e.target.value)

      var maskValue = this.mask.getValue();
      if (e.target.value !== maskValue) {
        // Cut or delete operations will have shortened the value
        if (e.target.value.length < maskValue.length) {
          var sizeDiff = maskValue.length - e.target.value.length;
          this._updateMaskSelection();
          this.mask.selection.end = this.mask.selection.start + sizeDiff;
          this.mask.backspace();
        }
        var value = this._getDisplayValue();
        e.target.value = value;
        if (value) {
          this._updateInputSelection();
        }
      }
      if (this.props.onChange) {
        this.props.onChange(e);
      }
    }
  }, {
    key: '_onKeyDown',
    value: function _onKeyDown(e) {
      // console.log('onKeyDown', JSON.stringify(getSelection(this.input)), e.key, e.target.value)

      if (isUndo(e)) {
        e.preventDefault();
        if (this.mask.undo()) {
          e.target.value = this._getDisplayValue();
          this._updateInputSelection();
          if (this.props.onChange) {
            this.props.onChange(e);
          }
        }
        return;
      } else if (isRedo(e)) {
        e.preventDefault();
        if (this.mask.redo()) {
          e.target.value = this._getDisplayValue();
          this._updateInputSelection();
          if (this.props.onChange) {
            this.props.onChange(e);
          }
        }
        return;
      }

      if (e.key === 'Backspace') {
        e.preventDefault();
        this._updateMaskSelection();
        if (this.mask.backspace()) {
          var value = this._getDisplayValue();
          e.target.value = value;
          if (value) {
            this._updateInputSelection();
          }
          if (this.props.onChange) {
            this.props.onChange(e);
          }
        }
      }
    }
  }, {
    key: '_onKeyPress',
    value: function _onKeyPress(e) {
      // console.log('onKeyPress', JSON.stringify(getSelection(this.input)), e.key, e.target.value)

      // Ignore modified key presses
      // Ignore enter key to allow form submission
      if (e.metaKey || e.altKey || e.ctrlKey || e.key === 'Enter') {
        return;
      }

      e.preventDefault();
      this._updateMaskSelection();
      if (this.mask.input(e.key || e.data)) {
        e.target.value = this.mask.getValue();
        this._updateInputSelection();
        if (this.props.onChange) {
          this.props.onChange(e);
        }
      }
    }
  }, {
    key: '_onPaste',
    value: function _onPaste(e) {
      // console.log('onPaste', JSON.stringify(getSelection(this.input)), e.clipboardData.getData('Text'), e.target.value)

      e.preventDefault();
      this._updateMaskSelection();
      // getData value needed for IE also works in FF & Chrome
      if (this.mask.paste(e.clipboardData.getData('Text'))) {
        e.target.value = this.mask.getValue();
        // Timeout needed for IE
        setTimeout(this._updateInputSelection, 0);
        if (this.props.onChange) {
          this.props.onChange(e);
        }
      }
    }
  }, {
    key: '_getDisplayValue',
    value: function _getDisplayValue() {
      var value = this.mask.getValue();
      return value === this.mask.emptyValue ? '' : value;
    }
  }, {
    key: '_keyPressPropName',
    value: function _keyPressPropName() {
      if (typeof navigator !== 'undefined') {
        return navigator.userAgent.match(/Android/i) ? 'onBeforeInput' : 'onKeyPress';
      }
      return 'onKeyPress';
    }
  }, {
    key: '_getEventHandlers',
    value: function _getEventHandlers() {
      return _defineProperty({
        onChange: this._onChange,
        onKeyDown: this._onKeyDown,
        onPaste: this._onPaste
      }, this._keyPressPropName(), this._onKeyPress);
    }
  }, {
    key: 'focus',
    value: function focus() {
      this.input.focus();
    }
  }, {
    key: 'blur',
    value: function blur() {
      this.input.blur();
    }
  }, {
    key: 'render',
    value: function render() {
      var _this = this;

      var ref = function ref(r) {
        _this.input = r;
      };
      var maxLength = this.mask.pattern.length;
      var value = this._getDisplayValue();
      var eventHandlers = this._getEventHandlers();
      var _props = this.props;
      var _props$size = _props.size;
      var size = _props$size === undefined ? maxLength : _props$size;
      var _props$placeholder = _props.placeholder;
      var placeholder = _props$placeholder === undefined ? this.mask.emptyValue : _props$placeholder;
      var _props2 = this.props;
      var placeholderChar = _props2.placeholderChar;
      var formatCharacters = _props2.formatCharacters;

      var cleanedProps = _objectWithoutProperties(_props2, ['placeholderChar', 'formatCharacters']);

      // eslint-disable-line
      var inputProps = _extends({}, cleanedProps, eventHandlers, { ref: ref, maxLength: maxLength, value: value, size: size, placeholder: placeholder });
      return _react2['default'].createElement('input', inputProps);
    }
  }]);

  return MaskedInput;
})(_react2['default'].Component);

MaskedInput.propTypes = {
  mask: _propTypes2['default'].string.isRequired,

  formatCharacters: _propTypes2['default'].object,
  placeholderChar: _propTypes2['default'].string
};

MaskedInput.defaultProps = {
  value: ''
};

exports['default'] = MaskedInput;
module.exports = exports['default'];