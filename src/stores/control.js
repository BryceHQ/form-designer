/*
 * base class
 */
class Control {
  constructor(name, parent, data) {
    this.type = 'Control';
    this.name = name;
    this.parent = parent;
    this.data = data || {};
    if (parent) {
      parent.addChild(this);
    }
  }
  getChildren() {
      if (this.children) {
        return this.children;
      }
      this.children = [];
      return this.children;
    }
    /*
     * child 可以为数组也可以为单个元素
     */
  addChild(child, index) {
    if (!child) return;
    if (child.length) {
      if (typeof index === 'number') {
        var args = [index, 0];
        args = args.concat(child);
        Array.prototype.splice.apply(this.getChildren(), args);
      } else {
        this.children = this.getChildren().concat(child);
      }
      var me = this;
      child.forEach(c => c.parent = me);
    } else {
      if (typeof index === 'number') {
        this.getChildren().splice(index, 0, child);
      } else {
        this.getChildren().push(child);
      }
      child.parent = this;
    }
  }
  removeChild(child) {
    var children = this.getChildren();
    var index = children.indexOf(child);
    if (~index) {
      children.splice(index, 1);
    }
    if (children.length === 0 && this.parent) {
      this.parent.removeChild(this);
    }
    child.parent = null;
  }
  remove() {
    if (!this.parent) return;
    this.parent.removeChild(this);
    this.parent = null;
  }
  setData(data) {
    this.data = data;
  }
  getData() {
    return this.data;
  }
  getIndex() {
    if (!this.parent) return;
    return this.parent.getChildren().indexOf(this);
  }

  toReactComponent() {

  }

  getType() {
    return this.type;
  }
}


export default Control;
