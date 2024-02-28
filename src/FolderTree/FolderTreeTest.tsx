import React, { ChangeEvent, useCallback, useRef, useState } from 'react';
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

function FolderTreeTest() {
  const [nodes, setNodes] = useState<any>({
    '1': {
      id: '1',
      name: 'Applications',
      children: ['2'],
      parentId: null,
      // 이미지 객체에 원본과 썸네일 URL을 포함
      imageUrls: [
        {
          original: 'https://via.placeholder.com/128',
          thumbnail: 'https://via.placeholder.com/128',
        },
      ],
    },
    '2': {
      id: '2',
      name: 'Calendar',
      children: [],
      parentId: '1',
      // 이미지 객체에 원본과 썸네일 URL을 포함
      imageUrls: [
        {
          original: 'https://via.placeholder.com/128',
          thumbnail: 'https://via.placeholder.com/128',
        },
      ],
    },
  });

  const [editingNodeId, setEditingNodeId] = useState<any>(null);
  const [nextNodeId, setNextNodeId] = useState<any>(4); // Initial next ID
  const [selectedNode, setSelectedNode] = useState<any>(null);

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
    setNextNodeId((prevId: number) => prevId + 1);
  };

  // 폴더 삭제
  const handleRemoveNode = (
    nodeId: any,
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    event.stopPropagation();
    const removeNodeAndChildren = (
      id: string | number,
      nodes: { [x: string]: any },
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
    nodeId: any,
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
    setNodes((prev: { [x: string]: any }) => ({
      ...prev,
      [nodeId]: { ...prev[nodeId], name: value },
    }));
    setEditingNodeId(null);
  };

  //
  const fileInputRef = useRef(null);

  // 선택 된 노드
  const [selectedNodeId, setSelectedNodeId] = useState(null); // 선택된 노드의 ID를 저장

  // 이미지 업로드 + 썸네일 로직
  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) {
      return;
    }

    // 지원하는 이미지 파일 확장자 목록
    const supportedExtensions = [
      'png',
      'jpg',
      'gif',
      'bmp',
      'tiff',
      'psd',
      'psb',
      'webp',
      'ico',
      'anigif',
    ];

    // 파일 확장자 확인
    const fileExtension = file.name.split('.').pop()?.toLowerCase();

    // 확장자가 지원 목록에 있는지 확인
    const isSupportedImage = supportedExtensions.includes(fileExtension || '');

    if (isSupportedImage) {
      const originalImageUrl = await readFileAsDataURL(file);
      const thumbnailImageUrl = await createThumbnail(file);

      if (selectedNodeId) {
        setNodes((prevNodes) => {
          const updatedNodes = { ...prevNodes };
          const fnSelectedNode = updatedNodes[selectedNodeId];
          if (fnSelectedNode) {
            const imageObject = {
              original: originalImageUrl,
              thumbnail: thumbnailImageUrl,
            };
            fnSelectedNode.imageUrls = [
              ...fnSelectedNode.imageUrls,
              imageObject,
            ];
          }
          return updatedNodes;
        });
      }
    } else {
      // 지원하지 않는 확장자의 경우 직접 placeholder URL 추가
      const placeholderImage = 'https://via.placeholder.com/128';
      updateNodeImageUrls(selectedNodeId, {
        original: placeholderImage,
        thumbnail: placeholderImage,
      });
    }
  };

  const readFileAsDataURL = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.onerror = (e) => reject(e);
      reader.readAsDataURL(file);
    });
  };

  const createThumbnail = (file) => {
    return new Promise(async (resolve, reject) => {
      try {
        const imageBitmap = await createImageBitmap(file);
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const maxSize = 128;
        const ratio = maxSize / Math.max(imageBitmap.width, imageBitmap.height);
        canvas.width = imageBitmap.width * ratio;
        canvas.height = imageBitmap.height * ratio;

        ctx.drawImage(imageBitmap, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL());
      } catch (error) {
        reject(error);
      }
    });
  };

  const updateNodeImageUrls = (nodeId, imageObject) => {
    setNodes((prevNodes) => {
      const updatedNodes = { ...prevNodes };
      const fnSelectedNode = updatedNodes[nodeId];
      if (fnSelectedNode) {
        fnSelectedNode.imageUrls = [...fnSelectedNode.imageUrls, imageObject];
      }
      return updatedNodes;
    });
  };

  // 다중이미지 드롭다운 메인뷰 썸네일
  const handleDropImageUploadView = useCallback(
    async (files: FileList) => {
      const supportedExtensions = [
        'png',
        'jpg',
        'gif',
        'bmp',
        'tiff',
        'psd',
        'psb',
        'webp',
        'ico',
        'anigif',
      ];

      const imageProcessingPromises = Array.from(files).map(async (file) => {
        const fileExtension = file.name.split('.').pop()?.toLowerCase();
        const isSupportedImage = supportedExtensions.includes(
          fileExtension || '',
        );

        if (!isSupportedImage) {
          return {
            original: 'https://via.placeholder.com/128',
            thumbnail: 'https://via.placeholder.com/128',
          };
        }

        try {
          // 원본 이미지 URL 생성
          const originalImageUrl = await readFileAsDataURL(file);
          // 썸네일 이미지 URL 생성
          const thumbnailImageUrl = await createThumbnail(file);
          return { original: originalImageUrl, thumbnail: thumbnailImageUrl };
        } catch (error) {
          console.error('Image processing failed', error);
          return {
            original: 'https://via.placeholder.com/128',
            thumbnail: 'https://via.placeholder.com/128',
          };
        }
      });

      Promise.all(imageProcessingPromises).then((imageObjects) => {
        if (selectedNodeId) {
          setNodes((prevNodes) => {
            const updatedNodes = { ...prevNodes };
            const fnSelectedNode = updatedNodes[selectedNodeId];
            if (fnSelectedNode) {
              fnSelectedNode.imageUrls = [
                ...fnSelectedNode.imageUrls,
                ...imageObjects, // 모든 이미지 객체 추가
              ];
            }
            return updatedNodes;
          });
        }
      });
    },
    [setNodes, selectedNodeId],
  );

  const handleDropImageUploadTree = useCallback(
    async (files: FileList, nodeId: any) => {
      const supportedExtensions = [
        'png',
        'jpg',
        'gif',
        'bmp',
        'tiff',
        'psd',
        'psb',
        'webp',
        'ico',
        'anigif',
      ];

      const imageProcessingPromises = Array.from(files).map(async (file) => {
        const fileExtension = file.name.split('.').pop()?.toLowerCase();
        const isSupportedImage = supportedExtensions.includes(
          fileExtension || '',
        );

        if (!isSupportedImage) {
          return {
            original: 'https://via.placeholder.com/128',
            thumbnail: 'https://via.placeholder.com/128',
          };
        }

        try {
          // 원본 이미지 URL 생성
          const originalImageUrl = await readFileAsDataURL(file);
          // 썸네일 이미지 URL 생성
          const thumbnailImageUrl = await createThumbnail(file);
          return { original: originalImageUrl, thumbnail: thumbnailImageUrl };
        } catch (error) {
          console.error('Image processing failed', error);
          return {
            original: 'https://via.placeholder.com/128',
            thumbnail: 'https://via.placeholder.com/128',
          };
        }
      });

      Promise.all(imageProcessingPromises).then((imageObjects) => {
        if (nodeId) {
          setNodes((prevNodes) => {
            const updatedNodes = { ...prevNodes };
            const fnSelectedNode = updatedNodes[nodeId];
            if (fnSelectedNode) {
              fnSelectedNode.imageUrls = [
                ...fnSelectedNode.imageUrls,
                ...imageObjects,
              ];
            }
            return updatedNodes;
          });
        }
      });
    },
    [setNodes],
  );

  // Depth 노드 선택
  const handleNodeSelect = (event: any, nodeId: React.SetStateAction<null>) => {
    setSelectedNodeId(nodeId);
  };

  // 폴더 업로드 버튼

  const handleFolderUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    const newNodes: { [key: string]: FileNode } = { ...nodes };
    const imageProcessingPromises: Promise<void>[] = [];

    Array.from(files).forEach((file) => {
      if (file.name === '.DS_Store') return; // .DS_Store 파일 제외

      const path = file.webkitRelativePath;
      const folders = path.split('/');
      let parentId: string | null = selectedNodeId; // 선택된 노드 ID를 부모 ID로 초기화
      let imageParentId: string | null = parentId; // 이미지 파일의 경우, 부모 폴더 ID 설정

      const basePath = selectedNodeId ? `${selectedNodeId}/` : '';
      folders.forEach((folder, index) => {
        const isLast = index === folders.length - 1;
        const id = basePath + folders.slice(0, index + 1).join('/');

        if (!isLast) {
          if (!newNodes[id]) {
            newNodes[id] = {
              id,
              name: folder,
              children: [],
              parentId,
              imageUrls: [],
            };
          }
          if (parentId && !newNodes[parentId].children.includes(id)) {
            newNodes[parentId].children.push(id);
          }
          parentId = id;
        } else {
          imageParentId = parentId;
        }
      });

      if (file.type.startsWith('image/') && imageParentId) {
        const fileReaderPromise = createImageObject(file).then(
          (imageObject) => {
            if (newNodes[imageParentId]) {
              newNodes[imageParentId].imageUrls.push(imageObject);
            }
          },
        );
        imageProcessingPromises.push(fileReaderPromise);
      }
    });

    Promise.all(imageProcessingPromises).then(() => {
      setNodes(newNodes);
    });
  };

  async function createImageObject(file: File) {
    const supportedExtensions = [
      'png',
      'jpg',
      'gif',
      'bmp',
      'tiff',
      'psd',
      'psb',
      'webp',
      'ico',
      'anigif',
    ];
    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    const isSupportedImage = supportedExtensions.includes(fileExtension || '');

    if (!isSupportedImage) {
      return {
        original: 'https://via.placeholder.com/150',
        thumbnail: 'https://via.placeholder.com/128',
      };
    }

    const originalImageUrl = await readFileAsDataURL(file);
    const thumbnailImageUrl = await createThumbnail(file); // 가정: 썸네일 생성 함수
    return { original: originalImageUrl, thumbnail: thumbnailImageUrl };
  }

  const handleFolderUploadView = async (
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    const files = event.target.files;
    if (!files) return;

    const newNodes: { [key: string]: FileNode } = { ...nodes };
    const fileReaders: Promise<void>[] = [];

    Array.from(files).forEach((file) => {
      if (file.name === '.DS_Store') return; // .DS_Store 파일 제외

      const path = file.webkitRelativePath;
      const folders = path.split('/');
      let parentId: string | null = selectedNodeId; // 선택된 노드 ID를 부모 ID로 초기화

      // 이미지 파일의 경우, 부모 폴더 ID를 올바르게 설정하기 위한 변수
      let imageParentId: string | null = parentId;

      // 선택된 노드가 있으면, 그 노드의 경로를 기준으로 새 경로를 구성
      const basePath = selectedNodeId ? `${selectedNodeId}/` : '';

      folders.forEach((folder, index) => {
        const isLast = index === folders.length - 1;
        const id = basePath + folders.slice(0, index + 1).join('/');

        // 폴더 노드 추가 로직 (이미지 파일 처리 전에 parentId 설정)
        if (!isLast) {
          if (!newNodes[id]) {
            newNodes[id] = {
              id,
              name: folder,
              children: [],
              parentId,
              imageUrls: [],
            };
          }

          if (parentId && !newNodes[parentId].children.includes(id)) {
            newNodes[parentId].children.push(id);
          }

          parentId = id; // 폴더 노드에 대한 parentId 업데이트
        } else {
          // 이미지 파일의 경우, 바로 이전 폴더를 부모로 설정
          imageParentId = parentId;
        }
      });

      if (file.type.startsWith('image/') && imageParentId) {
        // 지원하는 이미지 파일 확장자 목록
        const supportedExtensions = [
          'png',
          'jpg',
          'gif',
          'bmp',
          'tiff',
          'psd',
          'psb',
          'webp',
          'ico',
          'anigif',
        ];

        // 파일 확장자 확인
        const fileExtension = file.name.split('.').pop()?.toLowerCase();

        // 확장자가 지원 목록에 있는지 확인
        const isSupportedImage = supportedExtensions.includes(
          fileExtension || '',
        );

        const reader = new FileReader();
        const fileReaderPromise = new Promise<void>((resolve) => {
          reader.onload = (loadEvent) => {
            // 지원하는 확장자인 경우 Base64 데이터를 사용, 그렇지 않은 경우 placeholder URL
            const imageUrl = isSupportedImage
              ? loadEvent.target?.result
              : 'https://via.placeholder.com/150';
            if (typeof imageUrl === 'string' && newNodes[imageParentId]) {
              newNodes[imageParentId].imageUrls.push(imageUrl);
            }
            resolve();
          };

          // 지원하는 이미지 확장자인 경우에만 파일을 읽음
          if (isSupportedImage) {
            reader.readAsDataURL(file);
          } else {
            // 지원하지 않는 확장자의 경우 즉시 placeholder 이미지 URL을 추가
            resolve();
          }
        });

        fileReaders.push(fileReaderPromise);

        // 지원하지 않는 확장자일 경우, FileReader를 사용하지 않고도 Promise를 resolve
        if (!isSupportedImage) {
          reader.onload({
            target: { result: 'https://via.placeholder.com/128' },
          });
        }
      }
    });

    Promise.all(fileReaders).then(() => {
      setNodes(newNodes);
    });
  };

  function traverseEntry(entry, path = '') {
    if (entry.isFile) {
      entry.file((file) => {
        console.log(`File: ${path}${file.name}`);
        // 여기에서 파일 정보를 사용하여 폴더 트리 정보를 구성할 수 있습니다.
      });
    } else if (entry.isDirectory) {
      const dirReader = entry.createReader();
      dirReader.readEntries((entries) => {
        entries.forEach((entry) => {
          traverseEntry(entry, `${path}${entry.name}/`);
        });
      });
    }
  }

  function handleDropTest(event) {
    event.preventDefault();
    const items = event.dataTransfer.items;
    if (items) {
      for (let i = 0; i < items.length; i++) {
        const entry = items[i].webkitGetAsEntry();
        if (entry) {
          traverseEntry(entry);
        }
      }
    }
  }

  const handleFolderUploadTree = async (
    event: ChangeEvent<HTMLInputElement>,
    nodeId: any,
  ) => {
    const files = event.target.files;
    if (!files) return;

    const newNodes: { [key: string]: FileNode } = { ...nodes };
    const fileReaders: Promise<void>[] = [];

    Array.from(files).forEach((file) => {
      if (file.name === '.DS_Store') return; // .DS_Store 파일 제외

      const path = file.webkitRelativePath;
      const folders = path.split('/');
      let parentId: string | null = nodeId; // 선택된 노드 ID를 부모 ID로 초기화

      // 이미지 파일의 경우, 부모 폴더 ID를 올바르게 설정하기 위한 변수
      let imageParentId: string | null = parentId;

      // 선택된 노드가 있으면, 그 노드의 경로를 기준으로 새 경로를 구성
      const basePath = nodeId ? `${nodeId}/` : '';

      folders.forEach((folder, index) => {
        const isLast = index === folders.length - 1;
        const id = basePath + folders.slice(0, index + 1).join('/');

        // 폴더 노드 추가 로직 (이미지 파일 처리 전에 parentId 설정)
        if (!isLast) {
          if (!newNodes[id]) {
            newNodes[id] = {
              id,
              name: folder,
              children: [],
              parentId,
              imageUrls: [],
            };
          }

          if (parentId && !newNodes[parentId].children.includes(id)) {
            newNodes[parentId].children.push(id);
          }

          parentId = id; // 폴더 노드에 대한 parentId 업데이트
        } else {
          // 이미지 파일의 경우, 바로 이전 폴더를 부모로 설정
          imageParentId = parentId;
        }
      });

      if (file.type.startsWith('image/') && imageParentId) {
        // 지원하는 이미지 파일 확장자 목록
        const supportedExtensions = [
          'png',
          'jpg',
          'gif',
          'bmp',
          'tiff',
          'psd',
          'psb',
          'webp',
          'ico',
          'anigif',
        ];

        // 파일 확장자 확인
        const fileExtension = file.name.split('.').pop()?.toLowerCase();

        // 확장자가 지원 목록에 있는지 확인
        const isSupportedImage = supportedExtensions.includes(
          fileExtension || '',
        );

        const reader = new FileReader();
        const fileReaderPromise = new Promise<void>((resolve) => {
          reader.onload = (loadEvent) => {
            // 지원하는 확장자인 경우 Base64 데이터를 사용, 그렇지 않은 경우 placeholder URL
            const imageUrl = isSupportedImage
              ? loadEvent.target?.result
              : 'https://via.placeholder.com/150';
            if (typeof imageUrl === 'string' && newNodes[imageParentId]) {
              newNodes[imageParentId].imageUrls.push(imageUrl);
            }
            resolve();
          };

          // 지원하는 이미지 확장자인 경우에만 파일을 읽음
          if (isSupportedImage) {
            reader.readAsDataURL(file);
          } else {
            // 지원하지 않는 확장자의 경우 즉시 placeholder 이미지 URL을 추가
            resolve();
          }
        });

        fileReaders.push(fileReaderPromise);

        // 지원하지 않는 확장자일 경우, FileReader를 사용하지 않고도 Promise를 resolve
        if (!isSupportedImage) {
          reader.onload({
            target: { result: 'https://via.placeholder.com/128' },
          });
        }
      }
    });

    Promise.all(fileReaders).then(() => {
      setNodes(newNodes);
    });
  };

  const handleDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      event.stopPropagation();

      const { files } = event.dataTransfer;
      if (files && files.length > 0) {
        handleDropImageUploadView(files);

        // handleFolderUploadView(files);
      }
    },
    [
      handleDropImageUploadView,
      // , handleFolderUploadView
    ],
  );

  // 드래그앤드롭 드래그
  const handleDragOver = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      event.stopPropagation();
    },
    [],
  );

  const handleDropTree = useCallback(
    (event: React.DragEvent<HTMLDivElement>, nodeId: any) => {
      event.preventDefault();
      event.stopPropagation();

      const { files } = event.dataTransfer;
      console.log(files);
      if (files && files.length > 0) {
        handleDropImageUploadTree(files, nodeId);
      }
    },
    [handleDropImageUploadTree],
  );

  // 드래그앤드롭 드래그
  const handleDragOverTree = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      event.stopPropagation();
    },
    [],
  );

  // const handleDropOnNode = (event, targetNodeId) => {
  //   event.preventDefault();
  //   const dragData = JSON.parse(event.dataTransfer.getData('application/json'));
  //   const { nodeId: sourceNodeId, imageIndex } = dragData;

  //   if (sourceNodeId === targetNodeId) {
  //     // 같은 노드 내에서의 드랍은 처리하지 않음
  //     return;
  //   }

  //   // 이미지 객체를 소스 노드에서 제거하고 타겟 노드에 추가하는 로직 구현
  //   const imageObject = nodes[sourceNodeId].imageUrls.splice(imageIndex, 1)[0];
  //   if (imageObject) {
  //     const updatedNodes = { ...nodes };
  //     if (!updatedNodes[targetNodeId].imageUrls) {
  //       updatedNodes[targetNodeId].imageUrls = [];
  //     }
  //     updatedNodes[targetNodeId].imageUrls.push(imageObject);
  //     setNodes(updatedNodes);
  //   }
  // };

  const handleDropOnNode = (event, targetNodeId) => {
    event.preventDefault();
    const data = event.dataTransfer.getData('application/json');

    // JSON 데이터가 있는 경우에만 처리
    if (data) {
      const dragData = JSON.parse(data);
      const { nodeId: sourceNodeId, imageIndex } = dragData;

      if (sourceNodeId === targetNodeId) {
        // 같은 노드 내에서의 드랍은 처리하지 않음
        return;
      }

      const imageObject = nodes[sourceNodeId].imageUrls.splice(
        imageIndex,
        1,
      )[0];
      if (imageObject) {
        const updatedNodes = { ...nodes };
        if (!updatedNodes[targetNodeId].imageUrls) {
          updatedNodes[targetNodeId].imageUrls = [];
        }
        updatedNodes[targetNodeId].imageUrls.push(imageObject);
        setNodes(updatedNodes);
      }
    } else {
      // 여기에서 로컬 이미지 파일을 처리하는 로직을 추가할 수 있습니다.
      // 예: handleDropImageUploadTree(event.dataTransfer.files, targetNodeId);
    }
  };

  const handleDragStartImage = (event, nodeId, imageIndex) => {
    const dragData = { nodeId, imageIndex };
    event.dataTransfer.setData('application/json', JSON.stringify(dragData));
  };

  const renderTree = (nodeId: number) => {
    const node = nodes[nodeId];
    return (
      <TreeItem
        draggable
        onDragOver={(event) => {
          event.preventDefault(); // 드랍 영역으로 설정
          handleDragOverTree(event); // 기존 드래그 오버 로직 처리
          console.log(node.id); // 추가적으로 필요한 로직이 있다면 여기에 작성
        }}
        onDrop={(event) => {
          handleDropOnNode(event, node.id); // 새로 추가하려는 드랍 처리 로직
          handleDropTree(event, node.id); // 기존의 드랍 처리 로직
          console.log(node.id); // 드랍 이벤트 발생 시 필요한 추가적인 로직
        }}
        // onDragOver={(event) => event.preventDefault()} // 드랍 영역으로 설정
        // onDrop={(event) => handleDropOnNode(event, node.id)}

        // onDrop={(e: React.DragEvent<HTMLDivElement>) => {
        //   handleDropTree(e, node.id);
        //   console.log(node.id);
        // }}
        // onDragOver={(e: React.DragEvent<HTMLDivElement>) => {
        //   handleDragOverTree(e);
        //   console.log(node.id);
        // }}

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
            <div
              // className="TreeItem"
              role="button"
              onClick={() => setSelectedNode(nodes[nodeId])}
              // style={{ background: 'black' }}
            >
              {node.name}
              <IconButton
                size="small"
                // style={{
                //   height: '12px',
                //   width: '12px',
                // }}
                onClick={(event) => handleAddNode(node.id, event)}
              >
                <AddBoxIcon
                  style={{
                    height: '17px',
                    width: '17px',
                  }}
                />
              </IconButton>
              <IconButton
                size="small"
                onClick={(event) => handleEditNodeStart(node.id, event)}
              >
                <EditIcon
                  style={{
                    height: '17px',
                    width: '17px',
                  }}
                />
              </IconButton>
              <IconButton
                size="small"
                onClick={(event) => handleRemoveNode(node.id, event)}
              >
                <DeleteIcon
                  style={{
                    height: '17px',
                    width: '17px',
                  }}
                />
              </IconButton>
            </div>
          )
        }
        // onDragStart={(event) => handleDragStart(event, node.id)}
        // onDragOver={handleDragOver}
        // onDrop={(event) => handleDrop(event, node.id)}
        // draggable
      >
        {node.children.map((childId: number) => renderTree(childId))}
      </TreeItem>
    );
  };

  console.log(nodes);
  // console.log(selectedNode?.imageUrls[0].thumbnail);
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
              multiple
            />
          </Button>
        </Box>
        <TreeView
          defaultCollapseIcon={<ExpandMoreIcon />}
          defaultExpandIcon={<ChevronRightIcon />}
          onNodeSelect={handleNodeSelect}
          // 해당 부분 tree view 드랍
          // draggable
          // onDrop={handleDrop}
          // onDragOver={handleDragOver}
        >
          {Object.keys(nodes).map(
            (nodeId) => nodes[nodeId].parentId === null && renderTree(nodeId),
          )}
        </TreeView>
      </Box>
      {/* // 선택 된 폴더 데이터 뷰 */}

      {/* {selectedNode && ( */}
      <Box
        mt={2}
        className="FolderView"
        onDrop={handleDrop}
        // onDrop={handleDropTest}

        onDragOver={handleDragOver}
        // onDragOver={(event) => event.preventDefault()}
      >
        <Box className="FolderViewHeader">
          {selectedNode && (
            <Typography variant="h6">{selectedNode.name}</Typography>
          )}
        </Box>

        <Box draggable>
          {selectedNode?.imageUrls?.map((imageObject, index) => (
            <img
              key={index}
              src={imageObject.thumbnail}
              alt={`Thumbnail ${index}`}
              style={{
                maxHeight: '125px',
                maxWidth: '125px',
                margin: '10px',
                cursor: 'pointer',
              }}
              draggable
              onDragStart={(event) =>
                handleDragStartImage(event, selectedNode.id, index)
              }
            />
          ))}
        </Box>
      </Box>
      {/* )} */}

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
      </Box>
    </Box>
  );
}

export default FolderTreeTest;
