import React, { useState, useEffect, useRef } from "react";
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
  const mainRef = useRef(null);

  const view = loopTree(header);

  useEffect(() => {
    const updateReactTitle = debounce(y => {
      if (mainRef != null) {
        const { scrollTop, scrollHeight } = document.documentElement;
        const { current } = mainRef;
        const liheight = 28;
        if (flatHeader.length <= 0) return;

        if (flatHeader[0] && y <= flatHeader[0].top) {
          current.scrollTop = 0;
          setActiveKey(flatHeader[0].id);
          return;
        }
        if (
          flatHeader[flatHeader.length - 1] &&
          y >= flatHeader[flatHeader.length - 1].top
        ) {
          current.scrollTop = flatHeader.length - 1 * liheight;
          setActiveKey(flatHeader[flatHeader.length - 1].id);
          return;
        }
        for (let i = 0; i < flatHeader.length; i++) {
          let prev = flatHeader[i];
          let next = flatHeader[i + 1] || prev;
          if (prev.top <= y && next.top >= y) {
            current.scrollTop = i * liheight;
            setActiveKey(next.id);
            return;
          }
        }
      }
    }, 500);
    document.addEventListener(
      "scroll",
      event => {
        if (!event.target.id) {
          const { scrollTop, scrollHeight } = document.documentElement;
          updateReactTitle(scrollTop, flatHeader);
        }
      },
      true
    );
    return document.removeEventListener("scroll", updateReactTitle);
  }, [flatHeader, setActiveKey]);

  return (
    <div
      id="react-box"
      className={`${className} bxer-react-title`}
      ref={mainRef}
    >
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
