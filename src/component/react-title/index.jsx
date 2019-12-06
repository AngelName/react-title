import React, { useState, useEffect } from "react";
import "./index.css";
import { useContainerRef, useRefEl, debounce, throttle } from "./util";
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
  function intercept(key, flag) {
    if (flag) {
      window.location.hash = key;
    } else {
      window.history.pushState({}, "", window.location.origin + `/#${key}`);
    }
    setActiveKey(key);
  }
  return [activeKey, intercept];
};
function ReactTitle({ el, className }) {
  const [header, flatHeader] = useContainerRef(el);
  const [activeKey, setActiveKey] = useActiveKey();

  const view = loopTree(header);

  useEffect(() => {
    const a = debounce(y => {
      if (flatHeader.length <= 0) return;

      if (flatHeader[0] && y <= flatHeader[0].top) {
        console.log(y, flatHeader[0], flatHeader);

        setActiveKey(flatHeader[0].id);
        return;
      }
      if (
        flatHeader[flatHeader.length - 1] &&
        y >= flatHeader[flatHeader.length - 1].top
      ) {
        setActiveKey(flatHeader[flatHeader.length - 1].id);
        return;
      }
      for (let i = 0; i < flatHeader.length; i++) {
        let prev = flatHeader[i];
        let next = flatHeader[i + 1] || prev;
        if (prev.top <= y && next.top >= y) {
          // console.log(prev, next);
          setActiveKey(prev.id);
          return;
        }
      }
    }, 500);
    document.addEventListener(
      "scroll",
      event => {
        try {
          let y = event.target.scrollingElement.scrollTop;
          a(y, flatHeader);
        } catch (err) {
          console.warn("也许这里有更好的解决办法", err);
        }
      },
      true
    );

    return document.removeEventListener("scroll", a);
  }, [flatHeader, setActiveKey]);

  return (
    <div className={`${className} bxer-react-title`} onScroll={() => {}}>
      <ActiveKey.Provider value={activeKey}>
        <div
          onClick={event => {
            setActiveKey(event.target.dataset.id, true);
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
