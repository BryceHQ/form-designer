/*
* 此文件夹下的文件是我修改的外部模块
* react-onclickoutside@^4.8.0
*/
/**
 * A mixin for handling (effectively) onClickOutside for React components.
 * Note that we're not intercepting any events in this approach, and we're
 * not using double events for capturing and discarding in layers or wrappers.
 *
 * The idea is that components define function
 *
 *   handleClickOutside: function() { ... }
 *
 * If no such function is defined, an error will be thrown, as this means
 * either it still needs to be written, or the component should not be using
 * this mixing since it will not exhibit onClickOutside behaviour.
 *
 */
(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['react-dom'], function(reactDom) {
      return factory(root, reactDom);
    });
  } else if (typeof exports === 'object') {
    // Node. Note that this does not work with strict
    // CommonJS, but only CommonJS-like environments
    // that support module.exports
    module.exports = factory(root, require('react-dom'));
  } else {
    // Browser globals (root is window)
    root.OnClickOutside = factory(root, ReactDOM);
  }
}(this, function (root, ReactDOM) {
  "use strict";

  // Use a parallel array because we can't use
  // objects as keys, they get toString-coerced
  var registeredComponents = [];
  var handlers = [];

  var IGNORE_CLASS = 'ignore-react-onclickoutside';

  var isSourceFound = function(source, localNode, ignoreClass) {
    if (source === localNode) {
      return true;
    }
    return checkClass(source, ignoreClass);
  };
  var checkClass = function(elem, className){
    // SVG <use/> elements do not technically reside in the rendered DOM, so
    // they do not have classList directly, but they offer a link to their
    // corresponding element, which can have classList. This extra check is for
    // that case.
    // See: http://www.w3.org/TR/SVG11/struct.html#InterfaceSVGUseElement
    // Discussion: https://github.com/Pomax/react-onclickoutside/pull/17

    if (elem.correspondingElement) {
      elem = elem.correspondingElement;
    }
    // if(elem.classList){
    //   return elem.classList.contains(ignoreClass);
    // }

    var cla = elem.getAttribute('class');
    if(cla){
      var classArr = cla.split(' ');
      if(classArr.length > 0){
        return ~classArr.indexOf(className);
      }
    }
    return false;
  };

  return {
    componentDidMount: function() {
      if(typeof this.handleClickOutside !== "function")
        throw new Error("Component lacks a handleClickOutside(event) function for processing outside click events.");

      var fn = this.__outsideClickHandler = (function(localNode, eventHandler, ignoreClass) {
        return function(evt) {
          if ( evt.stopPropagation ) {
      			evt.stopPropagation();
      		}

      		// Support: IE
      		// Set the cancelBubble property of the original event to true
      		evt.cancelBubble = true;

          var source = evt.target;
          if(!source){
            source = evt.srcElement || document;
          }
          var found = false;
          // If source=local then this event came from "somewhere"
          // inside and should be ignored. We could handle this with
          // a layered approach, too, but that requires going back to
          // thinking in terms of Dom node nesting, running counter
          // to React's "you shouldn't care about the DOM" philosophy.
          while(source.parentNode) {
            found = isSourceFound(source, localNode, ignoreClass);
            if(found) return;
            source = source.parentNode;
          }
          // If element is in detached DOM, consider it not clicked
          // outside as it can't be known whether it was outside.
          if(source !== document) return;
          eventHandler(evt);
        }
      }(ReactDOM.findDOMNode(this), this.handleClickOutside, this.props.outsideClickIgnoreClass || IGNORE_CLASS));

      var pos = registeredComponents.length;
      registeredComponents.push(this);
      handlers[pos] = fn;

      // If there is a truthy disableOnClickOutside property for this
      // component, don't immediately start listening for outside events.
      if (!this.props.disableOnClickOutside) {
        this.enableOnClickOutside();
      }
    },

    componentWillUnmount: function() {
      this.disableOnClickOutside();
      this.__outsideClickHandler = false;
      var pos = registeredComponents.indexOf(this);
      if( pos>-1) {
        if (handlers[pos]) {
          // clean up so we don't leak memory
          handlers.splice(pos, 1);
          registeredComponents.splice(pos, 1);
        }
      }
    },

    /**
     * Can be called to explicitly enable event listening
     * for clicks and touches outside of this element.
     */
    enableOnClickOutside: function() {
      var fn = this.__outsideClickHandler;
      if (typeof document !== "undefined") {
        this.listen(document, "mousedown", fn);
        this.listen(document, "touchstart", fn);
      }
    },

    /**
     * Can be called to explicitly disable event listening
     * for clicks and touches outside of this element.
     */
    disableOnClickOutside: function() {
      var fn = this.__outsideClickHandler;
      if (typeof document !== "undefined") {
        this.unlisten(document, "mousedown", fn);
        this.unlisten(document, "touchstart", fn);
      }
    },

    listen: function(elem, type, handle) {
      if (elem.addEventListener)
        elem.addEventListener(type, handle, false);
      else if (elem.attachEvent)
        elem.attachEvent("on" + type, handle);
    },

    unlisten: function(elem, type, handle) {
      if (elem.removeEventListener)
        elem.removeEventListener(type, handle, false);
      else if (elem.detachEvent)
        elem.detachEvent("on" + type, handle);
    }
  };

}));
