import React, { ChangeEvent, useRef, useState } from 'react';
import { TreeItem, TreeView } from '@mui/x-tree-view';

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import IconButton from '@mui/material/IconButton';
import AddBoxIcon from '@mui/icons-material/AddBox';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { Button } from '@mui/material';

function FileSystemNavigator() {
  // 폴더에 이미지 URL 리스트를 포함시킵니다.
  const [nodes, setNodes] = useState({
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

  const [editingNodeId, setEditingNodeId] = useState(null);
  const [nextNodeId, setNextNodeId] = useState(4); // Initial next ID
  const [selectedNode, setSelectedNode] = useState(null);

  // 폴더 추가
  const handleAddNode = (
    parentId: string | number,
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
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
  const handleRemoveNode = (
    nodeId: any,
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    event.stopPropagation();
    const removeNodeAndChildren = (
      id: string | number,
      nodes: {
        [x: string]: any;
        1?: {
          id: string;
          name: string;
          children: string[];
          parentId: null;
          imageUrls: string[];
        };
        2?: {
          id: string;
          name: string;
          children: never[];
          parentId: string;
          imageUrls: string[];
        };
      },
    ) => {
      const { [id]: _, ...remainingNodes } = nodes;
      nodes[id].children.forEach((childId: any) =>
        removeNodeAndChildren(childId, remainingNodes),
      );
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
  const handleEditNodeStart = (
    nodeId: React.SetStateAction<null>,
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    event.stopPropagation();
    setEditingNodeId(nodeId);
  };

  // 폴더 이름 수정 end
  const handleEditNodeEnd = (
    event: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement, Element>,
    nodeId: string | number,
  ) => {
    const { value } = event.target;
    setNodes((prev) => ({
      ...prev,
      [nodeId]: { ...prev[nodeId], name: value },
    }));
    setEditingNodeId(null);
  };

  // 드래그 시작
  const handleDragStart = (
    event: React.DragEvent<HTMLLIElement>,
    nodeId: any,
  ) => {
    event.dataTransfer.setData('node/id', nodeId);
  };

  // 드래그 완료
  const handleDragOver = (event: { preventDefault: () => void }) => {
    event.preventDefault();
  };

  // 드롭
  const handleDrop = (
    event: React.DragEvent<HTMLLIElement>,
    targetNodeId: string | number,
  ) => {
    event.preventDefault();
    const nodeId = event.dataTransfer.getData('node/id');
    if (
      !nodeId ||
      nodeId === targetNodeId ||
      nodes[nodeId].parentId === targetNodeId
    ) {
      return;
    }

    // Move node logic here
    const newNodes = { ...nodes };
    // Remove from old parent
    if (newNodes[nodeId].parentId) {
      const siblings = newNodes[newNodes[nodeId].parentId].children.filter(
        (id: any) => id !== nodeId,
      );
      newNodes[newNodes[nodeId].parentId].children = siblings;
    }
    // Add to new parent
    newNodes[targetNodeId].children.push(nodeId);
    newNodes[nodeId].parentId = targetNodeId;

    setNodes(newNodes);
  };

  //
  const fileInputRef = useRef(null);

  // 선택 된 노드
  const [selectedNodeId, setSelectedNodeId] = useState(null); // 선택된 노드의 ID를 저장

  // 해당 Depth 폴더에 이미지 데이터 삽입
  // + 해당 로직에 썸네일 크기로 이미지 변환 작업 추가 예정
  const handleImageUpload = (event: { target: { files: any[] } }) => {
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
  const handleNodeSelect = (event: any, nodeId: React.SetStateAction<null>) => {
    setSelectedNodeId(nodeId);
  };

  // 폴더 루트 View
  const renderTree = (nodeId: number) => {
    const node = nodes[nodeId];
    return (
      <TreeItem
        key={node.id}
        nodeId={node.id}
        label={
          editingNodeId === node.id ? (
            <TextField
              defaultValue={node.name}
              onBlur={(event) => handleEditNodeEnd(event, node.id)}
              onClick={(event) => event.stopPropagation()}
              autoFocus
            />
          ) : (
            <div onClick={() => setSelectedNode(nodes[nodeId])}>
              {node.name}
              <IconButton
                size="small"
                onClick={(event) => handleAddNode(node.id, event)}
              >
                <AddBoxIcon />
              </IconButton>
              <IconButton
                size="small"
                onClick={(event) => handleEditNodeStart(node.id, event)}
              >
                <EditIcon />
              </IconButton>
              <IconButton
                size="small"
                onClick={(event) => handleRemoveNode(node.id, event)}
              >
                <DeleteIcon />
              </IconButton>
            </div>
          )
        }
        onDragStart={(event) => handleDragStart(event, node.id)}
        onDragOver={handleDragOver}
        onDrop={(event) => handleDrop(event, node.id)}
        draggable
      >
        {node.children.map((childId: number) => renderTree(childId))}
      </TreeItem>
    );
  };

  // Feature: 최상위 노드로 폴더 업로드 성공
  const handleFolderUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    // 기존 nodes를 복사하여 시작합니다.
    const newNodes: { [key: string]: FileNode } = { ...nodes };
    const fileReaders: Promise<void>[] = [];

    Array.from(files).forEach((file) => {
      if (file.name === '.DS_Store') return;

      const path = file.webkitRelativePath;
      const folders = path.split('/');
      let parentId: string | null = null;

      // 폴더 경로만 처리하기 위해 마지막 파일/이미지명 제외
      const folderPath = folders.slice(0, folders.length - 1);

      folderPath.forEach((folder: any, index: number) => {
        const id = folderPath.slice(0, index + 1).join('/');

        if (!newNodes[id]) {
          newNodes[id] = {
            id,
            name: folder,
            children: [],
            parentId: parentId,
            imageUrls: [],
          };
        } else {
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
        const fileReaderPromise = new Promise<void>((resolve) => {
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
    <Box className="Background">
      {/* // 폴더트리 */}

      <Box className="FolderTree">
        <Box className="FolderTreeHeader">
          <Button variant="contained" component="label">
            Upload Image
            <input
              type="file"
              hidden
              accept="image/*"
              onChange={handleImageUpload}
              ref={fileInputRef}
            />
          </Button>
          <Button variant="contained" component="label">
            Upload Folder
            <input
              type="file"
              hidden
              ref={fileInputRef}
              onChange={handleFolderUpload}
              webkitdirectory="true"
              directory="true"
              // webkitdirectory={true}
              // directory={true}
              multiple
              as="input"
            />
          </Button>
        </Box>
        <TreeView
          defaultCollapseIcon={<ExpandMoreIcon />}
          defaultExpandIcon={<ChevronRightIcon />}
          onSelect={handleNodeSelect}
        >
          {Object.keys(nodes).map(
            (nodeId) => nodes[nodeId].parentId === null && renderTree(nodeId),
          )}
        </TreeView>
      </Box>
      {/* // 선택 된 폴더 데이터 뷰 */}

      {selectedNode && (
        <Box mt={2} className="FolderView">
          <Box className="FolderViewHeader">
            <Typography variant="h6">{selectedNode?.name}</Typography>
          </Box>
          <Box>
            {selectedNode?.imageUrls.map(
              (
                imageUrl: string | undefined,
                index: React.Key | null | undefined,
              ) => (
                <img
                  key={index}
                  src={imageUrl}
                  alt={`Image ${index}`}
                  style={{
                    maxHeight: '125px',
                    maxWidth: '125px',
                    margin: '10px',
                  }}
                />
              ),
            )}
          </Box>
        </Box>
      )}

      {/* <div className="JsonList">
          <pre>{JSON.stringify(nodes, null, 2)}</pre>
        </div> */}
      <Box className="JsonData">
        <div className="JsonList">
          <text>폴더 트리 JSON</text>

          <pre>
            {JSON.stringify(
              nodes,
              (key, value) => {
                if (key === 'imageUrls') return '[Images]';
                return value;
              },
              2,
            )}
          </pre>
        </div>
        {/* <Box>
          <FileSystem />
        </Box> */}
      </Box>
    </Box>
  );
}

export default FileSystemNavigator;

// "main": "./src/main/main.ts",
