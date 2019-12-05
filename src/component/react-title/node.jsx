import React from "react";
import "./index.css";
import ActiveKey from "./activeKeyContext";
export default function Node({ item, children }) {
  return (
    <ul className="bxer-list">
      <li className="bxer-node">
        <ActiveKey.Consumer>
          {activeKey => (
            <div
              className={`bxer-content  ${
                activeKey === item.id ? "bxer-active" : ""
              }`}
              data-id={item.id}
            >
              <span className="bxer-label"></span>
              {item.text}
            </div>
          )}
        </ActiveKey.Consumer>
        {children}
      </li>
    </ul>
  );
}
