import React from "react";
import './index.css';

export const Field = ({onClick, className, children}) =>
    <div
        onClick={onClick}
        className={className}
    >
      {children}
    </div>