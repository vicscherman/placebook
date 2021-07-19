import React from 'react'

import './MainHeader.css'

//again special props. Children refers to whatever is in between the opening and closing tags of the component
//good to use for a wrapper
const MainHeader = props => {
  return <header className="main-header">
    {props.children}
  </header>

}

export default MainHeader