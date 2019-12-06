import React, { useState } from "react";
import "./index.css";
import { useContainerRef, useRefEl, debounce } from "./util";
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
const useActiveKey = () => {
  const [activeKey, setActiveKey] = useState("");
  function intercept(key) {
    window.location.hash = key;
    setActiveKey(key);
  }
  return [activeKey, intercept];
};
function ReactTitle({ el, className }) {
  const [header, flatHeader] = useContainerRef(el);
  const [activeKey, setActiveKey] = useActiveKey();
  const view = loopTree(header);

  const handleWhell = debounce(event => {
    const index = flatHeader.indexOf(activeKey);
    if (index === -1) {
      setActiveKey(flatHeader[0]);
    } else {
      setActiveKey(flatHeader[index + 1]);
    }
  }, 500);

  return (
    <div className={className} onScroll={() => {}}>
      <ActiveKey.Provider value={activeKey}>
        <div
          onClick={event => {
            setActiveKey(event.target.dataset.id);
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
