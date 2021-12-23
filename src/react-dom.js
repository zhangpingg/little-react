import {diff} from "./diff";

/** 渲染虚拟DOM为真实DOM，并挂载到页面上 */
function render(element, container) {
    // 处理虚拟节点
    diff({
        ...element,
        _parentDom: container
    })
}

export default {
    render
}
