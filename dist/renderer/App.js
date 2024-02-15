"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_router_dom_1 = require("react-router-dom");
// import icon from '../../assets/icon.svg';
require("./App.css");
// import { TreeItem, TreeView } from '@mui/x-tree-view';
const FolderTree_1 = __importDefault(require("../FolderTree/FolderTree"));
// import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
// import ChevronRightIcon from '@mui/icons-material/ChevronRight';
function Hello() {
    return ((0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("div", { className: "Hello" }), (0, jsx_runtime_1.jsx)("div", { className: "Hello", children: (0, jsx_runtime_1.jsx)("div", { className: "Tree", children: (0, jsx_runtime_1.jsx)(FolderTree_1.default, {}) }) })] }));
}
function App() {
    return ((0, jsx_runtime_1.jsx)(react_router_dom_1.MemoryRouter, { children: (0, jsx_runtime_1.jsx)(react_router_dom_1.Routes, { children: (0, jsx_runtime_1.jsx)(react_router_dom_1.Route, { path: "/", element: (0, jsx_runtime_1.jsx)(Hello, {}) }) }) }));
}
exports.default = App;
//# sourceMappingURL=App.js.map