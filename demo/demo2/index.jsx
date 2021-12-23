import React from '../../src/react'
import ReactDom from '../../src/react-dom'

// 函数组件，通过打包编译(createElement)为虚拟DOM
const Children = (props) => {
    return <div>{props.name}{props.children}</div>
}
const App = () => {
    return <Children name={1}>2</Children>
}

ReactDom.render(
    <App />,
    document.getElementById('root')
)

