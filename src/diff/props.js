// 处理 props 属性
export function diffProps(newVNode, oldVNode) {
    const newProps = newVNode.props
    const oldProps = oldVNode?.props ?? {};
    for (let key in oldProps) {
        if (!(key in newProps)) {
            setProperty(newVNode._currentDom, key, null, oldProps[key])
        }
    }
    for (let key in newProps) {
        setProperty(newVNode._currentDom, key, newProps[key], oldProps[key])
    }
}

// on开头的表示是事件类型
const eventReg = /on[\w]/;

// 设置属性
function setProperty(dom, name, newValue, oldValue) {
    if (['key', 'ref', 'children'].includes(name)) {
        return;
    }
    if (eventReg.test(name)) {
        setEvent(dom, name, newValue, oldValue)
        return
    }
    if (name === 'style') {
        if (oldValue) {
            for (let i in oldValue) {
                if (!(newValue && i in newValue)) {
                    setStyle(dom.style, i, '');
                }
            }
        }
        if (newValue) {
            for (let i in newValue) {
                if (!oldValue || newValue[i] !== oldValue[i]) {
                    setStyle(dom.style, i, newValue[i]);
                }
            }
        }
        return;
    }
    if (name === 'className') {
        dom.className = newValue || ''
    } else if (newValue === null) {
        dom.removeAttribute(name)
    } else {
        dom.setAttribute(name, newValue);
    }
}
// 设置事件
// 如果健名是以on开头的表示是事件类型，则调用setEvent处理。在这个函数里面，如果newValue为空就需要删除对应的事件，
// 不然就添加。添加的时候会把对应的事件函数和事件名称保存到dom的_listeners属性里，然后对应的事件监听函数是固定的函数，
// 触发事件时会从dom的_listeners里取真正的监听函数来执行
function setEvent(dom, name, newValue, oldValue) {
    name = name.toLocaleLowerCase().slice(2);
    if (newValue) {
        if (!oldValue) dom.addEventListener(name, eventProxy);
        (dom._listeners || (dom._listeners = {}))[name] = newValue;
    } else {
        dom.removeEventListener(name, eventProxy);
    }
}
// 设置样式
function setStyle(style, name, value) {
    if (typeof value === 'number') {
        style[name] = value + 'px';
    } else if ([undefined, null].includes(value)) {
        style[name] = '';
    } else {
        style[name] = value;
    }
}

function eventProxy(e) {
    this._listeners[e.type](e);
}
