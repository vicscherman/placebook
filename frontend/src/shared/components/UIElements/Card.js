import React from 'react';

import './Card.css';

//card is gonna wrap some info inside that it's not aware of ahead of time. props.children means it will wrap whatever we put inside it.

const Card = props => {
  return (
    <div className={`card ${props.className}`} style={props.style}>
     {props.children}
    </div>
  );
};

export default Card;
