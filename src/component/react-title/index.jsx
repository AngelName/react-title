import React, { useState } from "react";
import "./index.css";
import { useContainerRef, useRefEl } from "./util";
import Node from "./node";
import ActiveKey from "./activeKeyContext";

function loopTree(tree) {
  return tree.map(item => {
    if (item.children) {
      return (
        <Node key={item.id} item={item}>
          {loopTree(item.children)}
        </Node>
      );
    } else {
      return <Node item={item} key={item.id} />;
    }
  });
}

function ReactTitle({ el, className }) {
  const [header] = useContainerRef(el);
  const [activeKey, setActiveKey] = useState("");
  const view = loopTree(header);

  return (
    <div className={className}>
      <ActiveKey.Provider value={activeKey}>
        <div
          onClick={event => {
            setActiveKey(event.target.dataset.id);
            window.location.hash = event.target.dataset.id;
            console.log(event.target.id, event.target.dataset.id);
          }}
          className="bxer-box"
          style={{ width: "200px" }}
        >
          {view}
        </div>
      </ActiveKey.Provider>
    </div>
  );
}
export { useRefEl };
export default ReactTitle;
