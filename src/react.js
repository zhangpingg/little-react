import {diff} from "./diff";

function createElement(type, props, ...children) {
    // 把children塞到props中
    const newProps = {
        ...(props || {}),
        children
    }
    delete newProps.key
    return createVNode(type, newProps, props.key)
}
// 调用 createVNode 来创建一个虚拟节点
function createVNode(type, props, key) {
    return {
        type,
        props,
        key,
        _component: null,					// 组件实例
        _currentDom: null,					// 当前虚拟节点的真实dom
        _parentDom: null					// 当前虚拟节点的真实dom的父节点
    }
}


class Component {
    state = {}
    _nextState = null                   // 下次渲染时的状态
    _vNode = null                       // 对应的虚拟节点

    setState(partialState) {
        this._nextState = {
            ...this.state,
            ...partialState
        }
        enqueueRender(this)
    }
}
function enqueueRender(component) {
    // 在首次渲染时对应的实例里保存了他的虚拟节点，所以可以通过 component._vNode 来拿到对应的虚拟节点
    setTimeout(() => {
        diff(component._vNode, {
            ...component._vNode,
            props: {...component._vNode.props}
        })
    }, 0)
}

export default {
    createElement,
    createVNode,
    Component
}
