import React from '../react'
import {diffChildren} from './children'
import {diffProps} from "./props";

// 处理虚拟节点
export function diff(newVNode, oldVNode) {
    const newType = newVNode.type;
    const newProps = newVNode.props;

    if (typeof newType === 'function') {
        // 类组件 、函数组件
        newVNode._component = oldVNode && oldVNode._component ? oldVNode._component : newVNode._component;
        if (!newVNode._component) {
            if ('prototype' in newType && newType.prototype.render) {
                //类组件
                newVNode._component = new newType(newProps)
            } else {
                //函数组件
                newVNode._component = new React.Component(newProps)
                newVNode._component.render = newType
            }
            newVNode._component.componentWillMount && newVNode._component.componentWillMount();
        }
        // setState 时执行
        if (newVNode._component._nextState !== null) {
            newVNode._component.state = newVNode._component._nextState;
            newVNode._component._nextState = null;
        }
        newVNode._component._vNode = newVNode;                  // 首次渲染将对应的虚拟节点保存到实例中
        newVNode._currentDom = newVNode._parentDom;
        newProps.children = newVNode._component.render(newProps);
        diffChildren(newVNode, oldVNode)
    } else if (typeof newType === 'string') {
        // 字符型元素
        if (oldVNode && oldVNode._currentDom) {
            newVNode._currentDom = oldVNode._currentDom;
        } else {
            newVNode._currentDom = document.createElement(newType);
            newVNode._parentDom.appendChild(newVNode._currentDom)
        }
        diffProps(newVNode, oldVNode)
        diffChildren(newVNode, oldVNode)
    } else if (['string', 'number'].includes(typeof newProps)) {
        // 文本
        if (oldVNode && oldVNode._currentDom) {
            newVNode._currentDom = oldVNode._currentDom;
            newVNode._currentDom.data !== String(newProps) && (newVNode._currentDom.data = newProps);
        } else {
            newVNode._currentDom = document.createTextNode(newProps)
            newVNode._parentDom.appendChild(newVNode._currentDom)
        }
    }
}
