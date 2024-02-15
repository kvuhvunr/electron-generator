"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const x_tree_view_1 = require("@mui/x-tree-view");
const ExpandMore_1 = __importDefault(require("@mui/icons-material/ExpandMore"));
const ChevronRight_1 = __importDefault(require("@mui/icons-material/ChevronRight"));
const IconButton_1 = __importDefault(require("@mui/material/IconButton"));
const AddBox_1 = __importDefault(require("@mui/icons-material/AddBox"));
const Delete_1 = __importDefault(require("@mui/icons-material/Delete"));
const Edit_1 = __importDefault(require("@mui/icons-material/Edit"));
const TextField_1 = __importDefault(require("@mui/material/TextField"));
const Typography_1 = __importDefault(require("@mui/material/Typography"));
const Box_1 = __importDefault(require("@mui/material/Box"));
const material_1 = require("@mui/material");
function FileSystemNavigator() {
    // 폴더에 이미지 URL 리스트를 포함시킵니다.
    const [nodes, setNodes] = (0, react_1.useState)({
        '1': {
            id: '1',
            name: 'Applications',
            children: ['2'],
            parentId: null,
            imageUrls: ['https://via.placeholder.com/150'],
        },
        '2': {
            id: '2',
            name: 'Calendar',
            children: [],
            parentId: '1',
            imageUrls: ['https://via.placeholder.com/150'],
        },
    });
    const [editingNodeId, setEditingNodeId] = (0, react_1.useState)(null);
    const [nextNodeId, setNextNodeId] = (0, react_1.useState)(4); // Initial next ID
    const [selectedNode, setSelectedNode] = (0, react_1.useState)(null);
    // 폴더 추가
    const handleAddNode = (parentId, event) => {
        event.stopPropagation();
        const newNodeId = nextNodeId.toString();
        const newNodes = {
            ...nodes,
            [newNodeId]: {
                id: newNodeId,
                name: 'New Folder',
                children: [],
                parentId,
                imageUrls: [],
            },
        };
        if (parentId) {
            newNodes[parentId].children = [...newNodes[parentId].children, newNodeId];
        }
        setNodes(newNodes);
        setNextNodeId((prevId) => prevId + 1);
    };
    // 폴더 삭제
    const handleRemoveNode = (nodeId, event) => {
        event.stopPropagation();
        const removeNodeAndChildren = (id, nodes) => {
            const { [id]: _, ...remainingNodes } = nodes;
            nodes[id].children.forEach((childId) => removeNodeAndChildren(childId, remainingNodes));
            return remainingNodes;
        };
        const newNodes = removeNodeAndChildren(nodeId, nodes);
        Object.keys(newNodes).forEach((key) => {
            const index = newNodes[key].children.indexOf(nodeId);
            if (index > -1) {
                newNodes[key].children.splice(index, 1);
            }
        });
        setNodes(newNodes);
        if (selectedNode && selectedNode.id === nodeId) {
            setSelectedNode(null);
        }
    };
    // 폴더 이름 수정 input
    const handleEditNodeStart = (nodeId, event) => {
        event.stopPropagation();
        setEditingNodeId(nodeId);
    };
    // 폴더 이름 수정 end
    const handleEditNodeEnd = (event, nodeId) => {
        const { value } = event.target;
        setNodes((prev) => ({
            ...prev,
            [nodeId]: { ...prev[nodeId], name: value },
        }));
        setEditingNodeId(null);
    };
    // 드래그 시작
    const handleDragStart = (event, nodeId) => {
        event.dataTransfer.setData('node/id', nodeId);
    };
    // 드래그 완료
    const handleDragOver = (event) => {
        event.preventDefault();
    };
    // 드롭
    const handleDrop = (event, targetNodeId) => {
        event.preventDefault();
        const nodeId = event.dataTransfer.getData('node/id');
        if (!nodeId ||
            nodeId === targetNodeId ||
            nodes[nodeId].parentId === targetNodeId) {
            return;
        }
        // Move node logic here
        const newNodes = { ...nodes };
        // Remove from old parent
        if (newNodes[nodeId].parentId) {
            const siblings = newNodes[newNodes[nodeId].parentId].children.filter((id) => id !== nodeId);
            newNodes[newNodes[nodeId].parentId].children = siblings;
        }
        // Add to new parent
        newNodes[targetNodeId].children.push(nodeId);
        newNodes[nodeId].parentId = targetNodeId;
        setNodes(newNodes);
    };
    //
    const fileInputRef = (0, react_1.useRef)(null);
    // 선택 된 노드
    const [selectedNodeId, setSelectedNodeId] = (0, react_1.useState)(null); // 선택된 노드의 ID를 저장
    // 해당 Depth 폴더에 이미지 데이터 삽입
    // + 해당 로직에 썸네일 크기로 이미지 변환 작업 추가 예정
    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        if (!file) {
            return;
        }
        const reader = new FileReader();
        reader.onload = (loadEvent) => {
            const newImageUrl = loadEvent.target.result;
            if (selectedNodeId && newImageUrl) {
                setNodes((prevNodes) => {
                    const updatedNodes = { ...prevNodes };
                    const selectedNode = updatedNodes[selectedNodeId];
                    if (selectedNode) {
                        selectedNode.imageUrls = [...selectedNode.imageUrls, newImageUrl];
                    }
                    return updatedNodes;
                });
            }
        };
        reader.readAsDataURL(file);
    };
    // 폴더 선택
    const handleNodeSelect = (event, nodeId) => {
        setSelectedNodeId(nodeId);
    };
    // 폴더 루트 View
    const renderTree = (nodeId) => {
        const node = nodes[nodeId];
        return ((0, jsx_runtime_1.jsx)(x_tree_view_1.TreeItem, { nodeId: node.id, label: editingNodeId === node.id ? ((0, jsx_runtime_1.jsx)(TextField_1.default, { defaultValue: node.name, onBlur: (event) => handleEditNodeEnd(event, node.id), onClick: (event) => event.stopPropagation(), autoFocus: true })) : ((0, jsx_runtime_1.jsxs)("div", { onClick: () => setSelectedNode(nodes[nodeId]), children: [node.name, (0, jsx_runtime_1.jsx)(IconButton_1.default, { size: "small", onClick: (event) => handleAddNode(node.id, event), children: (0, jsx_runtime_1.jsx)(AddBox_1.default, {}) }), (0, jsx_runtime_1.jsx)(IconButton_1.default, { size: "small", onClick: (event) => handleEditNodeStart(node.id, event), children: (0, jsx_runtime_1.jsx)(Edit_1.default, {}) }), (0, jsx_runtime_1.jsx)(IconButton_1.default, { size: "small", onClick: (event) => handleRemoveNode(node.id, event), children: (0, jsx_runtime_1.jsx)(Delete_1.default, {}) })] })), onDragStart: (event) => handleDragStart(event, node.id), onDragOver: handleDragOver, onDrop: (event) => handleDrop(event, node.id), draggable: true, children: node.children.map((childId) => renderTree(childId)) }, node.id));
    };
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
    // const handleFolderUpload = (event: ChangeEvent<HTMLInputElement>) => {
    //   const files = event.target.files;
    //   if (!files) return;
    //   const newNodes: { [key: string]: FileNode } = {};
    //   Array.from(files).forEach((file) => {
    //     const path = file.webkitRelativePath;
    //     const folders = path.split('/');
    //     let parentId: string | null = null;
    //     folders.forEach((folder, index) => {
    //       const isLast = index === folders.length - 1;
    //       const id = folders.slice(0, index + 1).join('/');
    //       if (!newNodes[id]) {
    //         newNodes[id] = {
    //           id,
    //           name: folder,
    //           children: [],
    //           parentId,
    //           imageUrls: isLast ? ['https://via.placeholder.com/150'] : [],
    //         };
    //       }
    //       if (parentId && !newNodes[parentId].children.includes(id)) {
    //         newNodes[parentId].children.push(id);
    //       }
    //       parentId = id; // Set current folder as the parent for the next iteration
    //     });
    //   });
    //   setNodes(newNodes);
    // };
    // const handleFolderUpload = (event: ChangeEvent<HTMLInputElement>) => {
    //   const files = event.target.files;
    //   if (!files) return;
    //   const newNodes: { [key: string]: FileNode } = {};
    //   Array.from(files).forEach((file) => {
    //     // .DS_Store 파일 제외
    //     if (file.name === '.DS_Store') return;
    //     const path = file.webkitRelativePath;
    //     const folders = path.split('/');
    //     let parentId: string | null = null;
    //     folders.forEach((folder, index) => {
    //       const isLast = index === folders.length - 1;
    //       const id = folders.slice(0, index + 1).join('/');
    //       // 폴더 이름이 .DS_Store일 경우 해당 폴더를 처리하지 않음
    //       if (folder === '.DS_Store') return;
    //       if (!newNodes[id]) {
    //         newNodes[id] = {
    //           id,
    //           name: folder,
    //           children: [],
    //           parentId,
    //           imageUrls: isLast ? ['https://via.placeholder.com/150'] : [],
    //         };
    //       }
    //       if (parentId && !newNodes[parentId].children.includes(id)) {
    //         newNodes[parentId].children.push(id);
    //       }
    //       parentId = id; // Set current folder as the parent for the next iteration
    //     });
    //   });
    //   setNodes(newNodes);
    // };
    // 이미지 파일을 view까지 옮기는데 성공
    // const handleFolderUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    //   const files = event.target.files;
    //   if (!files) return;
    //   const newNodes: { [key: string]: FileNode } = {};
    //   const fileReaders: Promise<void>[] = []; // 파일 읽기 작업을 위한 프로미스 배열
    //   Array.from(files).forEach((file) => {
    //     if (file.name === '.DS_Store') return; // .DS_Store 파일 제외
    //     const path = file.webkitRelativePath;
    //     const folders = path.split('/');
    //     let parentId: string | null = null;
    //     folders.forEach((folder, index) => {
    //       const isLast = index === folders.length - 1;
    //       const id = folders.slice(0, index + 1).join('/');
    //       if (!newNodes[id]) {
    //         newNodes[id] = {
    //           id,
    //           name: folder,
    //           children: [],
    //           parentId,
    //           imageUrls: [],
    //         };
    //       }
    //       if (parentId && !newNodes[parentId].children.includes(id)) {
    //         newNodes[parentId].children.push(id);
    //       }
    //       // 마지막 요소이고, 이미지 파일일 경우
    //       if (isLast && file.type.startsWith('image/')) {
    //         const reader = new FileReader();
    //         const fileReaderPromise = new Promise<void>((resolve) => {
    //           reader.onload = (loadEvent) => {
    //             const result = loadEvent.target?.result;
    //             if (typeof result === 'string') {
    //               // Base64 데이터 확인
    //               newNodes[id].imageUrls.push(result);
    //             }
    //             resolve();
    //           };
    //           reader.readAsDataURL(file);
    //         });
    //         fileReaders.push(fileReaderPromise);
    //       }
    //       parentId = id; // 다음 반복을 위한 부모 ID 설정
    //     });
    //   });
    //   // 모든 파일이 읽힌 후에 상태 업데이트
    //   Promise.all(fileReaders).then(() => {
    //     setNodes(newNodes);
    //   });
    // };
    // Feature: 폴더 업로드 성공, 이미지 데이터도 부모 요소 image urls 값에 적용 완료
    // const handleFolderUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    //   const files = event.target.files;
    //   if (!files) return;
    //   const newNodes: { [key: string]: FileNode } = {};
    //   const fileReaders: Promise<void>[] = []; // 파일 읽기 작업을 위한 프로미스 배열
    //   Array.from(files).forEach((file) => {
    //     if (file.name === '.DS_Store') return; // .DS_Store 파일 제외
    //     const path = file.webkitRelativePath;
    //     const folders = path.split('/');
    //     let parentId: string | null = null;
    //     // 폴더 경로만 처리하기 위해 마지막 파일/이미지명 제외
    //     const folderPath = folders.slice(0, folders.length - 1);
    //     folderPath.forEach((folder, index) => {
    //       const id = folderPath.slice(0, index + 1).join('/');
    //       if (!newNodes[id]) {
    //         newNodes[id] = {
    //           id,
    //           name: folder,
    //           children: [],
    //           parentId: parentId,
    //           imageUrls: [],
    //         };
    //       }
    //       if (parentId && !newNodes[parentId].children.includes(id)) {
    //         newNodes[parentId].children.push(id);
    //       }
    //       parentId = id; // 다음 반복을 위한 부모 ID 설정
    //     });
    //     // 이미지 파일 처리
    //     if (file.type.startsWith('image/') && parentId) {
    //       const reader = new FileReader();
    //       const fileReaderPromise = new Promise<void>((resolve) => {
    //         reader.onload = (loadEvent) => {
    //           const result = loadEvent.target?.result;
    //           if (typeof result === 'string') {
    //             // Base64 데이터 확인
    //             newNodes[parentId].imageUrls.push(result);
    //           }
    //           resolve();
    //         };
    //         reader.readAsDataURL(file);
    //       });
    //       fileReaders.push(fileReaderPromise);
    //     }
    //   });
    //   // 모든 파일이 읽힌 후에 상태 업데이트
    //   Promise.all(fileReaders).then(() => {
    //     setNodes(newNodes);
    //   });
    // };
    // Feature: 최상위 노드로 폴더 업로드 성공
    const handleFolderUpload = async (event) => {
        const files = event.target.files;
        if (!files)
            return;
        // 기존 nodes를 복사하여 시작합니다.
        const newNodes = { ...nodes };
        const fileReaders = [];
        Array.from(files).forEach((file) => {
            if (file.name === '.DS_Store')
                return;
            const path = file.webkitRelativePath;
            const folders = path.split('/');
            let parentId = null;
            // 폴더 경로만 처리하기 위해 마지막 파일/이미지명 제외
            const folderPath = folders.slice(0, folders.length - 1);
            folderPath.forEach((folder, index) => {
                const id = folderPath.slice(0, index + 1).join('/');
                if (!newNodes[id]) {
                    newNodes[id] = {
                        id,
                        name: folder,
                        children: [],
                        parentId: parentId,
                        imageUrls: [],
                    };
                }
                else {
                    // 이미 존재하는 노드의 경우, children 및 imageUrls을 유지하면서 업데이트
                    // 필요한 경우 여기서 추가 로직을 구현할 수 있습니다. (예: 중복 처리)
                }
                if (parentId && !newNodes[parentId].children.includes(id)) {
                    newNodes[parentId].children.push(id);
                }
                parentId = id;
            });
            console.log(parentId);
            // 이미지 파일 처리
            if (file.type.startsWith('image/') && parentId) {
                const reader = new FileReader();
                const fileReaderPromise = new Promise((resolve) => {
                    reader.onload = (loadEvent) => {
                        const result = loadEvent.target?.result;
                        if (typeof result === 'string') {
                            newNodes[parentId].imageUrls.push(result);
                        }
                        resolve();
                    };
                    reader.readAsDataURL(file);
                });
                fileReaders.push(fileReaderPromise);
            }
        });
        Promise.all(fileReaders).then(() => {
            setNodes(newNodes);
        });
    };
    // const handleFolderUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    //   const files = event.target.files;
    //   if (!files) return;
    //   // 기존 nodes를 복사하여 시작합니다.
    //   const newNodes: { [key: string]: FileNode } = { ...nodes };
    //   const fileReaders: Promise<void>[] = [];
    //   Array.from(files).forEach((file) => {
    //     if (file.name === '.DS_Store') return; // .DS_Store 파일 제외
    //     const path = file.webkitRelativePath;
    //     const folders = path.split('/');
    //     let parentId: string | null = selectedNodeId; // 선택된 노드 ID를 부모 ID로 초기화
    //     // 선택된 노드가 있으면, 그 노드의 경로를 기준으로 새 경로를 구성
    //     const basePath = selectedNodeId ? `${selectedNodeId}/` : '';
    //     folders.forEach((folder, index) => {
    //       const isLast = index === folders.length - 1;
    //       const id = basePath + folders.slice(0, index + 1).join('/');
    //       // 새 노드 추가 로직 (이미지 파일은 제외하고 처리)
    //       if (!newNodes[id] && !isLast) {
    //         newNodes[id] = {
    //           id,
    //           name: folder,
    //           children: [],
    //           parentId,
    //           imageUrls: [],
    //         };
    //         if (
    //           parentId &&
    //           newNodes[parentId] &&
    //           !newNodes[parentId].children.includes(id)
    //         ) {
    //           newNodes[parentId].children.push(id);
    //         }
    //       }
    //       parentId = id; // 다음 반복을 위한 부모 ID 설정
    //     });
    //     // 이미지 파일 처리
    //     if (file.type.startsWith('image/') && parentId) {
    //       const reader = new FileReader();
    //       const fileReaderPromise = new Promise<void>((resolve) => {
    //         reader.onload = (loadEvent) => {
    //           const result = loadEvent.target?.result;
    //           if (typeof result === 'string' && newNodes[parentId]) {
    //             newNodes[parentId].imageUrls.push(result);
    //           }
    //           resolve();
    //         };
    //         reader.readAsDataURL(file);
    //       });
    //       fileReaders.push(fileReaderPromise);
    //     }
    //   });
    //   Promise.all(fileReaders).then(() => {
    //     setNodes(newNodes);
    //   });
    // };
    // Feature: 하위 폴더, 이미지 저장 안됌
    // const handleFolderUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    //   const files = event.target.files;
    //   if (!files) return;
    //   // 기존 nodes를 복사하여 시작합니다.
    //   const newNodes: { [key: string]: FileNode } = { ...nodes };
    //   const fileReaders: Promise<void>[] = [];
    //   Array.from(files).forEach((file) => {
    //     if (file.name === '.DS_Store') return; // .DS_Store 파일 제외
    //     const path = file.webkitRelativePath;
    //     const folders = path.split('/');
    //     let parentId: string | null = selectedNodeId; // 선택된 노드 ID를 부모 ID로 초기화
    //     // 선택된 노드가 있으면, 그 노드의 경로를 기준으로 새 경로를 구성
    //     const basePath = selectedNodeId ? `${selectedNodeId}/` : '';
    //     folders.forEach((folder, index) => {
    //       const isLast = index === folders.length - 1;
    //       const id = basePath + folders.slice(0, index + 1).join('/');
    //       // 새 노드 추가 로직 (이미지 파일은 제외하고 처리)
    //       if (!newNodes[id] && !isLast) {
    //         newNodes[id] = {
    //           id,
    //           name: folder,
    //           children: [],
    //           parentId,
    //           imageUrls: [],
    //         };
    //         if (
    //           parentId &&
    //           newNodes[parentId] &&
    //           !newNodes[parentId].children.includes(id)
    //         ) {
    //           newNodes[parentId].children.push(id);
    //         }
    //       }
    //       parentId = id; // 다음 반복을 위한 부모 ID 설정
    //     });
    //     // 이미지 파일 처리
    //     if (file.type.startsWith('image/') && parentId) {
    //       const reader = new FileReader();
    //       const fileReaderPromise = new Promise<void>((resolve) => {
    //         reader.onload = (loadEvent) => {
    //           const result = loadEvent.target?.result;
    //           console.log('result: ', result);
    //           console.log(typeof result === 'string');
    //           console.log(newNodes);
    //           console.log(newNodes.parentId);
    //           console.log(parentId);
    //           // parentId 의 값이 뭐가 이상함
    //           if (typeof result === 'string' && newNodes[parentId]) {
    //             console.log('push 부분 접근: ', result);
    //             newNodes[parentId].imageUrls.push(result);
    //           }
    //           resolve();
    //         };
    //         reader.readAsDataURL(file);
    //       });
    //       fileReaders.push(fileReaderPromise);
    //     }
    //   });
    //   Promise.all(fileReaders).then(() => {
    //     setNodes(newNodes);
    //   });
    // };
    console.log(nodes);
    return (
    // BG
    (0, jsx_runtime_1.jsxs)(Box_1.default, { className: "Background", children: [(0, jsx_runtime_1.jsxs)(Box_1.default, { className: "FolderTree", children: [(0, jsx_runtime_1.jsxs)(Box_1.default, { className: "FolderTreeHeader", children: [(0, jsx_runtime_1.jsxs)(material_1.Button, { variant: "contained", component: "label", children: ["Upload Image", (0, jsx_runtime_1.jsx)("input", { type: "file", hidden: true, accept: "image/*", onChange: handleImageUpload, ref: fileInputRef })] }), (0, jsx_runtime_1.jsxs)(material_1.Button, { variant: "contained", component: "label", children: ["Upload Folder", (0, jsx_runtime_1.jsx)("input", { type: "file", hidden: true, ref: fileInputRef, onChange: handleFolderUpload, webkitdirectory: "true", directory: "true", multiple: true })] })] }), (0, jsx_runtime_1.jsx)(x_tree_view_1.TreeView, { defaultCollapseIcon: (0, jsx_runtime_1.jsx)(ExpandMore_1.default, {}), defaultExpandIcon: (0, jsx_runtime_1.jsx)(ChevronRight_1.default, {}), onNodeSelect: handleNodeSelect, children: Object.keys(nodes).map((nodeId) => nodes[nodeId].parentId === null && renderTree(nodeId)) })] }), selectedNode && ((0, jsx_runtime_1.jsxs)(Box_1.default, { mt: 2, className: "FolderView", children: [(0, jsx_runtime_1.jsx)(Box_1.default, { className: "FolderViewHeader", children: (0, jsx_runtime_1.jsx)(Typography_1.default, { variant: "h6", children: selectedNode.name }) }), (0, jsx_runtime_1.jsx)(Box_1.default, { children: selectedNode?.imageUrls?.map((imageUrl, index) => ((0, jsx_runtime_1.jsx)("img", { src: imageUrl, alt: `Image ${index}`, style: {
                                maxHeight: '125px',
                                maxWidth: '125px',
                                margin: '10px',
                            } }, index))) })] })), (0, jsx_runtime_1.jsx)(Box_1.default, { className: "JsonData", children: (0, jsx_runtime_1.jsxs)("div", { className: "JsonList", children: [(0, jsx_runtime_1.jsx)("text", { children: "\uD3F4\uB354 \uD2B8\uB9AC JSON" }), (0, jsx_runtime_1.jsx)("pre", { children: JSON.stringify(nodes, (key, value) => {
                                if (key === 'imageUrls')
                                    return '[Images]';
                                return value;
                            }, 2) })] }) })] }));
}
exports.default = FileSystemNavigator;
//# sourceMappingURL=FolderTree.js.map