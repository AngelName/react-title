import React, { useState, useCallback, useEffect } from "react";
import "./index.css";

const ActiveKey = React.createContext();

const Header = ["H1", "H2", "H3", "H4", "H5", "H6"];
function extractNumber(str) {
  return str[str.length - 1] || "";
}

function loopNode(tree, callBack) {
  if (Array.isArray(tree)) {
    for (let i = tree.length - 1; i >= 0; i--) {
      loopNode(tree[i].children, callBack);
      callBack(tree[i]);
    }
  }
}
function getUniqueId(length = 5) {
  let id = "";
  for (let i = 0; i < length; i++) {
    id += String.fromCharCode(parseInt(Math.random() * 26 + 97));
  }
  return id;
}

function LoopHeader(els, type) {
  const tree = [];
  Array.from(els).map(item => {
    const { tagName } = item;
    if (Header.includes(tagName)) {
      const currentNumber = extractNumber(tagName);
      item.id = getUniqueId();
      const newNode = {
        type: tagName,
        n: currentNumber,
        text: item.textContent,
        id: item.id
      };
      if (tree.length === 0) {
        tree.push(newNode);
      } else {
        let flag = false;
        loopNode(tree, titem => {
          if (currentNumber > titem.n && !flag) {
            flag = true;
            if (!titem.children) {
              titem.children = [];
            }
            titem.children.push(newNode);
          }
        });
        if (!flag) {
          tree.push(newNode);
        }
      }
    }
  });
  return tree;
}
export function useRefEl() {
  let [refNode, setRefNode] = useState(null);
  const ref = useCallback(node => {
    if (node !== null) {
      setRefNode(node);
    }
  }, []);
  return [refNode, ref];
}

export function useContainerRef(node) {
  let [header, setHeader] = useState([]);
  useEffect(() => {
    if (node !== null) {
      let els = node.children;
      const data = LoopHeader(els);
      setHeader(data);
    }
  }, [node]);

  return [header];
}

function Node({ item, children, onClick }) {
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

function loopTree(tree) {
  return tree.map(item => {
    if (item.children) {
      return (
        <Node key={item.id} item={item} onClick={console.log}>
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

export default ReactTitle;
