"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const Box_1 = __importDefault(require("@mui/material/Box"));
// import Typography from '@mui/material/Typography';
const Button_1 = __importDefault(require("@mui/material/Button"));
function FileSystem() {
    const [nodes, setNodes] = (0, react_1.useState)({});
    const fileInputRef = (0, react_1.useRef)(null);
    // const handleFolderUpload = (event: { target: { files: any } }) => {
    //   const files = event?.target?.files;
    //   const newNodes = {};
    //   Array.from(files).forEach((file) => {
    //     const path = file?.webkitRelativePath;
    //     const folders = path.split('/');
    //     let currentPath = '';
    //     folders.reduce(
    //       (
    //         acc: {
    //           [x: string]: {
    //             children: any;
    //             id: string;
    //             name: any;
    //             type: string;
    //             parentId: any;
    //           };
    //           id: any;
    //         },
    //         folder: string | number,
    //         index: number,
    //       ) => {
    //         currentPath += (currentPath ? '/' : '') + folder;
    //         if (index < folders.length - 1) {
    //           if (!acc[folder]) {
    //             acc[folder] = {
    //               id: currentPath,
    //               name: folder,
    //               children: {},
    //               parentId: acc.id || null,
    //             };
    //           }
    //           return acc[folder].children;
    //         } else {
    //           acc[folder] = {
    //             id: currentPath,
    //             name: folder,
    //             type: 'file',
    //             parentId: acc.id || null,
    //           };
    //         }
    //         return acc;
    //       },
    //       newNodes,
    //     );
    //   });
    //   setNodes(newNodes);
    // };
    const handleFolderUpload = (event) => {
        const files = event.target.files;
        if (!files)
            return;
        const newNodes = {};
        Array.from(files).forEach((file) => {
            // .DS_Store 파일 제외
            if (file.name === '.DS_Store')
                return;
            const path = file.webkitRelativePath;
            const folders = path.split('/');
            let parentId = null;
            folders.forEach((folder, index) => {
                const isLast = index === folders.length - 1;
                const id = folders.slice(0, index + 1).join('/');
                // 폴더 이름이 .DS_Store일 경우 해당 폴더를 처리하지 않음
                if (folder === '.DS_Store')
                    return;
                if (!newNodes[id]) {
                    newNodes[id] = {
                        id,
                        name: folder,
                        children: [],
                        parentId,
                        imageUrls: isLast ? ['https://via.placeholder.com/150'] : [],
                    };
                }
                if (parentId && !newNodes[parentId].children.includes(id)) {
                    newNodes[parentId].children.push(id);
                }
                parentId = id; // Set current folder as the parent for the next iteration
            });
        });
        setNodes(newNodes);
    };
    return ((0, jsx_runtime_1.jsxs)(Box_1.default, { style: {
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
            // maxWidth: '125px',
            // margin: '10px',
        }, children: [(0, jsx_runtime_1.jsxs)(Button_1.default, { variant: "contained", component: "label", children: ["Upload Folder", (0, jsx_runtime_1.jsx)("input", { type: "file", hidden: true, ref: fileInputRef, onChange: handleFolderUpload, webkitdirectory: "true", directory: "true", multiple: true })] }), (0, jsx_runtime_1.jsx)("div", { className: "JsonList", children: (0, jsx_runtime_1.jsx)("pre", { children: JSON.stringify(nodes, null, 2) }) })] }));
}
exports.default = FileSystem;
//# sourceMappingURL=FileSystem.js.map