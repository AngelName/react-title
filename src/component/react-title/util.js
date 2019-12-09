import { useState, useCallback, useEffect } from "react";

// 拦截的标签
const Header = ["H1", "H2", "H3", "H4", "H5", "H6"];

// hook

//获取容器数据
export function useContainerRef(node) {
  let [header, setHeader] = useState([]);
  let [flatHeader, setFlatHeader] = useState([]);
  useEffect(() => {
    if (node !== null) {
      let els = node.children;

      const [tree, flatTree] = LoopHeader(els);
      setHeader(tree);
      setFlatHeader(flatTree);
    }
  }, [node]);

  return [header, flatHeader];
}

// 获取唯一id
export function getUniqueId(length = 5) {
  let id = "";
  for (let i = 0; i < length; i++) {
    id += String.fromCharCode(parseInt(Math.random() * 26 + 97));
  }
  return id;
}

// 返回refNode 节点 和 回调方法
export function useRefEl() {
  let [refNode, setRefNode] = useState(null);
  const ref = useCallback(node => {
    if (node !== null) {
      setRefNode(node);
    }
  }, []);
  return [refNode, ref];
}

// helper function

// 提取标签的数字当作权重
function extractNumber(str) {
  return str[str.length - 1] || "";
}

// 生成header 的树
function LoopHeader(els) {
  const tree = [];
  const flatTree = [];
  Array.from(els).forEach(item => {
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
      const { top } = item.getBoundingClientRect();
      const { scrollTop } = document.documentElement;
      flatTree.push({ id: item.id, top: scrollTop + top });
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
  return [tree, flatTree];
}

// 由下到上的遍历树
function loopNode(tree, callBack) {
  if (Array.isArray(tree)) {
    for (let i = tree.length - 1; i >= 0; i--) {
      loopNode(tree[i].children, callBack);
      callBack(tree[i]);
    }
  }
}

// 防抖
export function debounce(fn, time) {
  let timer = null;
  return function() {
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      fn(...arguments);
    }, time);
  };
}

// 节流 不知道对不对但是可以用
export function throttle(fn, time) {
  let completed = true;
  let timer = null;
  return function() {
    if (completed) {
      if (timer) {
        clearTimeout(timer);
        timer = null;
      }
      completed = false;
      timer = setTimeout(() => {
        fn(...arguments);
        completed = true;
      }, time);
    }
  };
}
