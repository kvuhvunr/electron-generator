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
import FolderTreeTest from './FolderTreeTest';

function FileSystemNavigator() {
  // 폴더에 이미지 URL 리스트를 포함시킵니다.
  // const [nodes, setNodes] = useState<any>({
  //   '1': {
  //     id: '1',
  //     name: 'Applications',
  //     children: ['2'],
  //     parentId: null,
  //     imageUrls: ['https://via.placeholder.com/128'],
  //   },
  //   '2': {
  //     id: '2',
  //     name: 'Calendar',
  //     children: [],
  //     parentId: '1',
  //     imageUrls: ['https://via.placeholder.com/128'],
  //   },
  // });

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

  // 해당 Depth 폴더에 이미지 데이터 삽입
  // + 해당 로직에 썸네일 크기로 이미지 변환 작업 추가 예정
  // const handleImageUpload = (event: { target: { files: any[] } }) => {
  //   const file = event.target.files[0];
  //   if (!file) {
  //     return;
  //   }

  //   const reader = new FileReader();
  //   reader.onload = (loadEvent: any) => {
  //     const newImageUrl = loadEvent.target.result;
  //     if (selectedNodeId && newImageUrl) {
  //       setNodes((prevNodes: any) => {
  //         const updatedNodes = { ...prevNodes };
  //         const selectedNode: any = updatedNodes[selectedNodeId];
  //         if (selectedNode) {
  //           selectedNode.imageUrls = [...selectedNode.imageUrls, newImageUrl];
  //         }
  //         return updatedNodes;
  //       });
  //     }
  //   };
  //   reader.readAsDataURL(file);
  // };

  // const handleImageUpload = (event: { target: { files: any[] } }) => {
  //   const file = event.target.files[0];
  //   if (!file) {
  //     return;
  //   }

  //   // 파일 확장자 확인
  //   const fileExtension = file.name.split('.').pop().toLowerCase();

  //   const reader = new FileReader();
  //   reader.onload = (loadEvent: any) => {
  //     // PNG 파일인 경우 Base64 데이터를 사용, 그렇지 않은 경우 placeholder URL 사용
  //     const newImageUrl =
  //       fileExtension === 'png'
  //         ? loadEvent.target.result
  //         : 'https://via.placeholder.com/128';
  //     if (selectedNodeId && newImageUrl) {
  //       setNodes((prevNodes: any) => {
  //         const updatedNodes = { ...prevNodes };
  //         const selectedNode: any = updatedNodes[selectedNodeId];
  //         if (selectedNode) {
  //           selectedNode.imageUrls = [...selectedNode.imageUrls, newImageUrl];
  //         }
  //         return updatedNodes;
  //       });
  //     }
  //   };

  //   // PNG 파일인 경우에만 FileReader를 사용하여 파일을 읽음
  //   if (fileExtension === 'png') {
  //     reader.readAsDataURL(file);
  //   } else {
  //     // PNG가 아닌 경우에는 reader.onload를 직접 호출하여 placeholder URL을 설정
  //     reader.onload({ target: { result: 'https://via.placeholder.com/128' } });
  //   }
  // };

  // const handleImageUpload = (event: { target: { files: any[] } }) => {
  //   const file = event.target.files[0];
  //   if (!file) {
  //     return;
  //   }

  //   // 파일 확장자 확인
  //   const fileExtension = file.name.split('.').pop().toLowerCase();

  //   if (fileExtension === 'png') {
  //     const reader = new FileReader();
  //     reader.onload = (loadEvent: any) => {
  //       const newImageUrl = loadEvent.target.result;
  //       if (selectedNodeId) {
  //         setNodes((prevNodes: any) => {
  //           const updatedNodes = { ...prevNodes };
  //           const selectedNode = updatedNodes[selectedNodeId];
  //           if (selectedNode) {
  //             selectedNode.imageUrls = [...selectedNode.imageUrls, newImageUrl];
  //           }
  //           return updatedNodes;
  //         });
  //       }
  //     };
  //     reader.readAsDataURL(file);
  //   } else {
  //     // PNG가 아닌 경우, 직접 placeholder URL을 추가
  //     if (selectedNodeId) {
  //       setNodes((prevNodes: any) => {
  //         const updatedNodes = { ...prevNodes };
  //         const selectedNode = updatedNodes[selectedNodeId];
  //         if (selectedNode) {
  //           selectedNode.imageUrls = [
  //             ...selectedNode.imageUrls,
  //             'https://via.placeholder.com/150',
  //           ];
  //         }
  //         return updatedNodes;
  //       });
  //     }
  //   }
  // };

  // 이미지 업로드 버튼 / 썸네일 없느 로직
  // const handleImageUpload= (
  //   // files?: any,
  //   event?: { target: { files: any[] } },
  // ) => {
  //   const file = event.target.files[0];
  //   if (!file) {
  //     return;
  //   }

  //   // 지원하는 이미지 파일 확장자 목록
  //   const supportedExtensions = [
  //     'png',
  //     'jpg',
  //     'gif',
  //     'bmp',
  //     'tiff',
  //     'psd',
  //     'psb',
  //     'webp',
  //     'ico',
  //     'anigif',
  //   ];

  //   // 파일 확장자 확인
  //   const fileExtension = file.name.split('.').pop()?.toLowerCase();

  //   // 확장자가 지원 목록에 있는지 확인
  //   const isSupportedImage = supportedExtensions.includes(fileExtension || '');

  //   const reader = new FileReader();
  //   reader.onload = (loadEvent: any) => {
  //     const newImageUrl = isSupportedImage
  //       ? loadEvent.target.result
  //       : 'https://via.placeholder.com/128';
  //     if (selectedNodeId) {
  //       setNodes((prevNodes: any) => {
  //         const updatedNodes = { ...prevNodes };
  //         const fnSelectedNode = updatedNodes[selectedNodeId];
  //         if (fnSelectedNode) {
  //           fnSelectedNode.imageUrls = [
  //             ...fnSelectedNode.imageUrls,
  //             newImageUrl,
  //           ];
  //         }
  //         return updatedNodes;
  //       });
  //     }
  //   };

  //   if (isSupportedImage) {
  //     reader.readAsDataURL(file);
  //   } else {
  //     // 지원하지 않는 확장자의 경우 직접 placeholder URL 추가
  //     setNodes((prevNodes: any) => {
  //       const updatedNodes = { ...prevNodes };
  //       const fnSelectedNode = updatedNodes[selectedNodeId];
  //       if (fnSelectedNode) {
  //         fnSelectedNode.imageUrls.push('https://via.placeholder.com/128');
  //       }
  //       return updatedNodes;
  //     });
  //   }
  // };

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

  // 이미지 드롭다운 메인뷰 + 썸네일 로직
  // const handleDropImageUploadView = useCallback(
  //   async (files: FileList) => {
  //     const file = files[0];
  //     if (!file) {
  //       return;
  //     }

  //     const supportedExtensions = [
  //       'png',
  //       'jpg',
  //       'gif',
  //       'bmp',
  //       'tiff',
  //       'psd',
  //       'psb',
  //       'webp',
  //       'ico',
  //       'anigif',
  //     ];

  //     const fileExtension = file.name.split('.').pop()?.toLowerCase();
  //     const isSupportedImage = supportedExtensions.includes(
  //       fileExtension || '',
  //     );

  //     if (isSupportedImage) {
  //       try {
  //         // 원본 이미지 URL 생성
  //         const originalImageUrl = await readFileAsDataURL(file);
  //         // 썸네일 이미지 URL 생성
  //         const thumbnailImageUrl = await createThumbnail(file);

  //         // selectedNodeId가 존재하면 해당 노드에 이미지 객체 업데이트
  //         if (selectedNodeId) {
  //           setNodes((prevNodes) => {
  //             const updatedNodes = { ...prevNodes };
  //             const fnSelectedNode = updatedNodes[selectedNodeId];
  //             if (fnSelectedNode) {
  //               const imageObject = {
  //                 original: originalImageUrl,
  //                 thumbnail: thumbnailImageUrl,
  //               };
  //               fnSelectedNode.imageUrls = [
  //                 ...fnSelectedNode.imageUrls,
  //                 imageObject,
  //               ];
  //             }
  //             return updatedNodes;
  //           });
  //         }
  //       } catch (error) {
  //         console.error('Image processing failed', error);
  //       }
  //     } else {
  //       // 지원하지 않는 확장자의 경우 placeholder URL 추가
  //       const placeholderImageObject = {
  //         original: 'https://via.placeholder.com/128',
  //         thumbnail: 'https://via.placeholder.com/128',
  //       };
  //       setNodes((prevNodes: any) => {
  //         const updatedNodes = { ...prevNodes };
  //         const fnSelectedNode = updatedNodes[selectedNodeId];
  //         if (fnSelectedNode) {
  //           fnSelectedNode.imageUrls = [
  //             ...fnSelectedNode.imageUrls,
  //             placeholderImageObject,
  //           ];
  //         }
  //         return updatedNodes;
  //       });
  //     }
  //   },
  //   [setNodes, selectedNodeId],
  // );

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

  // readFileAsDataURL 함수와 createThumbnail 함수는 이전과 동일하게 정의됩니다.

  // 이미지 업로드 드래그앤드롭 메인뷰
  // const handleDropImageUploadView = useCallback(
  //   (files: FileList) => {
  //     console.log(files[0]);
  //     const file = files[0];
  //     if (!file) {
  //       return;
  //     }

  //     // 지원하는 이미지 파일 확장자 목록
  //     const supportedExtensions = [
  //       'png',
  //       'jpg',
  //       'gif',
  //       'bmp',
  //       'tiff',
  //       'psd',
  //       'psb',
  //       'webp',
  //       'ico',
  //       'anigif',
  //     ];

  //     // 파일 확장자 확인
  //     const fileExtension = file.name.split('.').pop()?.toLowerCase();

  //     // 확장자가 지원 목록에 있는지 확인
  //     const isSupportedImage = supportedExtensions.includes(
  //       fileExtension || '',
  //     );

  //     const reader = new FileReader();
  //     reader.onload = (loadEvent: any) => {
  //       const newImageUrl = isSupportedImage
  //         ? loadEvent.target.result
  //         : 'https://via.placeholder.com/128';
  //       if (selectedNodeId) {
  //         setNodes((prevNodes: any) => {
  //           const updatedNodes = { ...prevNodes };
  //           const fnSelectedNode = updatedNodes[selectedNodeId];
  //           if (fnSelectedNode) {
  //             fnSelectedNode.imageUrls = [
  //               ...fnSelectedNode.imageUrls,
  //               newImageUrl,
  //             ];
  //           }
  //           return updatedNodes;
  //         });
  //       }
  //     };

  //     if (isSupportedImage) {
  //       reader.readAsDataURL(file);
  //     } else {
  //       // 지원하지 않는 확장자의 경우 직접 placeholder URL 추가
  //       setNodes((prevNodes: any) => {
  //         const updatedNodes = { ...prevNodes };
  //         const fnSelectedNode = updatedNodes[selectedNodeId];
  //         if (fnSelectedNode) {
  //           fnSelectedNode.imageUrls.push('https://via.placeholder.com/128');
  //         }
  //         return updatedNodes;
  //       });
  //     }
  //     // (이미지 업로드 로직 구현 부분)
  //     // 이 부분에 위에서 제공한 handleImageUpload 로직을 넣습니다.
  //   },
  //   [setNodes, selectedNodeId],
  // );

  // 이미지 업로드 드래그앤드롭 폴더트리 / 썸네일 로직 전
  // const handleDropImageUploadTree = useCallback(
  //   (files: FileList, nodeId: any) => {
  //     console.log(files[0]);
  //     const file = files[0];
  //     if (!file) {
  //       return;
  //     }

  //     // 지원하는 이미지 파일 확장자 목록
  //     const supportedExtensions = [
  //       'png',
  //       'jpg',
  //       'gif',
  //       'bmp',
  //       'tiff',
  //       'psd',
  //       'psb',
  //       'webp',
  //       'ico',
  //       'anigif',
  //     ];

  //     // 파일 확장자 확인
  //     const fileExtension = file.name.split('.').pop()?.toLowerCase();

  //     // 확장자가 지원 목록에 있는지 확인
  //     const isSupportedImage = supportedExtensions.includes(
  //       fileExtension || '',
  //     );

  //     const reader = new FileReader();
  //     reader.onload = (loadEvent: any) => {
  //       const newImageUrl = isSupportedImage
  //         ? loadEvent.target.result
  //         : 'https://via.placeholder.com/128';
  //       if (nodeId) {
  //         setNodes((prevNodes: any) => {
  //           const updatedNodes = { ...prevNodes };
  //           const fnSelectedNode = updatedNodes[nodeId];
  //           if (fnSelectedNode) {
  //             fnSelectedNode.imageUrls = [
  //               ...fnSelectedNode.imageUrls,
  //               newImageUrl,
  //             ];
  //           }
  //           return updatedNodes;
  //         });
  //       }
  //     };

  //     if (isSupportedImage) {
  //       reader.readAsDataURL(file);
  //     } else {
  //       // 지원하지 않는 확장자의 경우 직접 placeholder URL 추가
  //       setNodes((prevNodes: any) => {
  //         const updatedNodes = { ...prevNodes };
  //         const fnSelectedNode = updatedNodes[nodeId];
  //         if (fnSelectedNode) {
  //           fnSelectedNode.imageUrls.push('https://via.placeholder.com/128');
  //         }
  //         return updatedNodes;
  //       });
  //     }
  //     // (이미지 업로드 로직 구현 부분)
  //     // 이 부분에 위에서 제공한 handleImageUpload 로직을 넣습니다.
  //   },
  //   [setNodes],
  // );

  // 드롭다운 이미지 트리 로직

  // const handleDropImageUploadTree = useCallback(
  //   async (files: FileList, nodeId: any) => {
  //     const file = files[0];
  //     if (!file) {
  //       return;
  //     }

  //     const supportedExtensions = [
  //       'png',
  //       'jpg',
  //       'gif',
  //       'bmp',
  //       'tiff',
  //       'psd',
  //       'psb',
  //       'webp',
  //       'ico',
  //       'anigif',
  //     ];

  //     const fileExtension = file.name.split('.').pop()?.toLowerCase();
  //     const isSupportedImage = supportedExtensions.includes(
  //       fileExtension || '',
  //     );

  //     if (isSupportedImage) {
  //       // 원본 이미지 URL 생성
  //       const originalImageUrl = await readFileAsDataURL(file);
  //       // 썸네일 이미지 URL 생성 (여기에서는 썸네일 생성 함수를 가정합니다)
  //       const thumbnailImageUrl = await createThumbnail(file);

  //       if (nodeId) {
  //         setNodes((prevNodes: any) => {
  //           const updatedNodes = { ...prevNodes };
  //           const fnSelectedNode = updatedNodes[nodeId];
  //           if (fnSelectedNode) {
  //             const imageObject = {
  //               original: originalImageUrl,
  //               thumbnail: thumbnailImageUrl,
  //             };
  //             fnSelectedNode.imageUrls = [
  //               ...fnSelectedNode.imageUrls,
  //               imageObject,
  //             ];
  //           }
  //           return updatedNodes;
  //         });
  //       }
  //     } else {
  //       // 지원하지 않는 확장자의 경우 placeholder URL 사용
  //       const placeholderUrl = 'https://via.placeholder.com/128';
  //       updateNodeImageUrls(nodeId, {
  //         original: placeholderUrl,
  //         thumbnail: placeholderUrl,
  //       });
  //     }
  //   },
  //   [setNodes],
  // );

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

  // const readFileAsDataURL = (file) =>
  //   new Promise((resolve, reject) => {
  //     const reader = new FileReader();
  //     reader.onload = () => resolve(reader.result);
  //     reader.onerror = (error) => reject(error);
  //     reader.readAsDataURL(file);
  //   });

  // // 가정: 썸네일 생성 함수
  // const createThumbnail = async (file) => {
  //   // 여기에서 썸네일 생성 로직 구현
  //   // 예를 들어, 간단히 원본 이미지 URL을 반환하거나, 썸네일을 실제로 생성하여 반환
  //   return readFileAsDataURL(file); // 단순화를 위해 원본 이미지 URL 반환
  // };

  // const updateNodeImageUrls = (nodeId, imageObject) => {
  //   setNodes((prevNodes) => {
  //     const updatedNodes = { ...prevNodes };
  //     const fnSelectedNode = updatedNodes[nodeId];
  //     if (fnSelectedNode) {
  //       fnSelectedNode.imageUrls = [...fnSelectedNode.imageUrls, imageObject];
  //     }
  //     return updatedNodes;
  //   });
  // };

  // Depth 노드 선택
  const handleNodeSelect = (event: any, nodeId: React.SetStateAction<null>) => {
    setSelectedNodeId(nodeId);
  };

  // 임시코드
  // 폴더 루트 reader View
  // const renderTree = (nodeId: number) => {
  //   const node = nodes[nodeId];
  //   return (
  //     <TreeItem
  //       key={node.id}
  //       nodeId={node.id}
  //       label={
  //         editingNodeId === node.id ? (
  //           <TextField
  //             defaultValue={node.name}
  //             onBlur={(event) => handleEditNodeEnd(event, node.id)}
  //             onClick={(event) => event.stopPropagation()}
  //             autoFocus
  //           />
  //         ) : (
  //           <div role="button" onClick={() => setSelectedNode(nodes[nodeId])}>
  //             {node.name}
  //             <IconButton
  //               size="small"
  //               // style={{
  //               //   height: '12px',
  //               //   width: '12px',
  //               // }}
  //               onClick={(event) => handleAddNode(node.id, event)}
  //             >
  //               <AddBoxIcon
  //                 style={{
  //                   height: '17px',
  //                   width: '17px',
  //                 }}
  //               />
  //             </IconButton>
  //             <IconButton
  //               size="small"
  //               onClick={(event) => handleEditNodeStart(node.id, event)}
  //             >
  //               <EditIcon
  //                 style={{
  //                   height: '17px',
  //                   width: '17px',
  //                 }}
  //               />
  //             </IconButton>
  //             <IconButton
  //               size="small"
  //               onClick={(event) => handleRemoveNode(node.id, event)}
  //             >
  //               <DeleteIcon
  //                 style={{
  //                   height: '17px',
  //                   width: '17px',
  //                 }}
  //               />
  //             </IconButton>
  //           </div>
  //         )
  //       }
  //       onDragStart={(event) => handleDragStart(event, node.id)}
  //       onDragOver={handleDragOver}
  //       onDrop={(event) => handleDrop(event, node.id)}
  //       draggable
  //     >
  //       {node.children.map((childId: number) => renderTree(childId))}
  //     </TreeItem>
  //   );
  // };

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

  // 폴더 업로드 성공, 이미지 데이터도 부모 요소 image urls 값에 적용 완료
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

  // Feature:최상위 노드로 폴더 업로드 성공
  // const handleFolderUpload = async (event: ChangeEvent<HTMLInputElement>) => {
  //   const files = event.target.files;
  //   if (!files) return;

  //   // 기존 nodes를 복사하여 시작합니다.
  //   const newNodes: { [key: string]: FileNode } = { ...nodes };
  //   const fileReaders: Promise<void>[] = [];

  //   Array.from(files).forEach((file) => {
  //     if (file.name === '.DS_Store') return;

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
  //       } else {
  //         // 이미 존재하는 노드의 경우, children 및 imageUrls을 유지하면서 업데이트
  //         // 필요한 경우 여기서 추가 로직을 구현할 수 있습니다. (예: 중복 처리)
  //       }

  //       if (parentId && !newNodes[parentId].children.includes(id)) {
  //         newNodes[parentId].children.push(id);
  //       }

  //       parentId = id;
  //     });

  //     // 이미지 파일 처리
  //     if (file.type.startsWith('image/') && parentId) {
  //       const reader = new FileReader();
  //       const fileReaderPromise = new Promise<void>((resolve) => {
  //         reader.onload = (loadEvent) => {
  //           const result = loadEvent.target?.result;
  //           if (typeof result === 'string') {
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

  // Feature: 하위 폴더
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

  //     folders.forEach((folder: any, index: number) => {
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

  // readFileAsDataURL 함수 구현
  // async function readFileAsDataURL(file: File): Promise<string> {
  //   return new Promise((resolve, reject) => {
  //     const reader = new FileReader();
  //     reader.onload = () => resolve(reader.result as string);
  //     reader.onerror = reject;
  //     reader.readAsDataURL(file);
  //   });
  // }

  // // createThumbnail 함수 구현 (여기서는 예시로 원본 URL을 반환)
  // async function createThumbnail(file: File): Promise<string> {
  //   // 실제로는 썸네일 생성 로직 구현 필요
  //   return readFileAsDataURL(file);
  // }

  // const handleFolderUpload = async (event: ChangeEvent<HTMLInputElement>) => {
  //   const files = event.target.files;
  //   // console.log(files);
  //   console.log(event.target.files);
  //   if (!files) return;

  //   const newNodes: { [key: string]: FileNode } = { ...nodes };
  //   const fileReaders: Promise<void>[] = [];

  //   Array.from(files).forEach((file) => {
  //     if (file.name === '.DS_Store') return; // .DS_Store 파일 제외

  //     const path = file.webkitRelativePath;
  //     const folders = path.split('/');
  //     let parentId: string | null = selectedNodeId; // 선택된 노드 ID를 부모 ID로 초기화

  //     // 이미지 파일의 경우, 부모 폴더 ID를 올바르게 설정하기 위한 변수
  //     let imageParentId: string | null = parentId;

  //     // 선택된 노드가 있으면, 그 노드의 경로를 기준으로 새 경로를 구성
  //     const basePath = selectedNodeId ? `${selectedNodeId}/` : '';

  //     folders.forEach((folder, index) => {
  //       const isLast = index === folders.length - 1;
  //       const id = basePath + folders.slice(0, index + 1).join('/');

  //       // 폴더 노드 추가 로직 (이미지 파일 처리 전에 parentId 설정)
  //       if (!isLast) {
  //         if (!newNodes[id]) {
  //           newNodes[id] = {
  //             id,
  //             name: folder,
  //             children: [],
  //             parentId,
  //             imageUrls: [],
  //           };
  //         }

  //         if (parentId && !newNodes[parentId].children.includes(id)) {
  //           newNodes[parentId].children.push(id);
  //         }

  //         parentId = id; // 폴더 노드에 대한 parentId 업데이트
  //       } else {
  //         // 이미지 파일의 경우, 바로 이전 폴더를 부모로 설정
  //         imageParentId = parentId;
  //       }
  //     });

  //     if (file.type.startsWith('image/') && imageParentId) {
  //       // 지원하는 이미지 파일 확장자 목록
  //       const supportedExtensions = [
  //         'png',
  //         'jpg',
  //         'gif',
  //         'bmp',
  //         'tiff',
  //         'psd',
  //         'psb',
  //         'webp',
  //         'ico',
  //         'anigif',
  //       ];

  //       // 파일 확장자 확인
  //       const fileExtension = file.name.split('.').pop()?.toLowerCase();

  //       // 확장자가 지원 목록에 있는지 확인
  //       const isSupportedImage = supportedExtensions.includes(
  //         fileExtension || '',
  //       );

  //       const reader = new FileReader();
  //       const fileReaderPromise = new Promise<void>((resolve) => {
  //         reader.onload = (loadEvent) => {
  //           // 지원하는 확장자인 경우 Base64 데이터를 사용, 그렇지 않은 경우 placeholder URL
  //           const imageUrl = isSupportedImage
  //             ? loadEvent.target?.result
  //             : 'https://via.placeholder.com/150';
  //           if (typeof imageUrl === 'string' && newNodes[imageParentId]) {
  //             newNodes[imageParentId].imageUrls.push(imageUrl);
  //           }
  //           resolve();
  //         };

  //         // 지원하는 이미지 확장자인 경우에만 파일을 읽음
  //         if (isSupportedImage) {
  //           reader.readAsDataURL(file);
  //         } else {
  //           // 지원하지 않는 확장자의 경우 즉시 placeholder 이미지 URL을 추가
  //           resolve();
  //         }
  //       });

  //       fileReaders.push(fileReaderPromise);

  //       // 지원하지 않는 확장자일 경우, FileReader를 사용하지 않고도 Promise를 resolve
  //       if (!isSupportedImage) {
  //         reader.onload({
  //           target: { result: 'https://via.placeholder.com/128' },
  //         });
  //       }
  //     }
  //   });

  //   Promise.all(fileReaders).then(() => {
  //     setNodes(newNodes);
  //   });
  // };

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

  // 드래그 앤 드롭된 아이템 처리
  // const handleDropTest = (event: React.DragEvent<HTMLDivElement>) => {
  //   event.preventDefault();
  //   event.stopPropagation();

  //   // const  = event.target.files;
  //   // console.log();
  //   // console.log(event.target.files);
  //   console.log(event.dataTransfer.items);
  //   const items = event.dataTransfer.items;
  //   // console.log(event.dataTransfer.items);
  //   if (items) {
  //     const directoryReaders: Promise<void>[] = [];

  //     for (let i = 0; i < items.length; i++) {
  //       const item = items[i].webkitGetAsEntry();
  //       if (item) {
  //         directoryReaders.push(readDirectoryEntry(item));
  //       }
  //     }

  //     Promise.all(directoryReaders).then(() => {
  //       console.log('모든 폴더와 파일이 처리되었습니다.');
  //       // 여기서 상태 업데이트 등의 추가 작업을 수행합니다.
  //     });
  //   }
  // };

  // // DirectoryEntry 또는 FileEntry 처리
  // const readDirectoryEntry = (entry, basePath = '') => {
  //   return new Promise<void>((resolve) => {
  //     if (entry.isFile) {
  //       entry.file((file) => {
  //         // 여기서 파일 처리 로직을 수행합니다.
  //         // 예: 파일이 이미지인 경우 상태 업데이트
  //         // console.log(file);
  //         resolve();
  //       });
  //     } else if (entry.isDirectory) {
  //       const dirReader = entry.createReader();
  //       dirReader.readEntries((entries) => {
  //         const directoryPromises = [];
  //         for (const entry of entries) {
  //           const path = `${basePath}${entry.name}`;
  //           directoryPromises.push(readDirectoryEntry(entry, path + '/'));
  //         }
  //         Promise.all(directoryPromises).then(() => resolve());
  //       });
  //     }
  //   });
  // };

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

  // const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
  //   event.preventDefault();
  //   event.stopPropagation();

  //   const { files } = event.dataTransfer;
  //   if (files && files.length > 0) {
  //     let isFolderUpload = false;

  //     // 폴더 업로드 감지
  //     for (let i = 0; i < files.length; i++) {
  //       if (files[i].webkitRelativePath) {
  //         isFolderUpload = true;
  //         break;
  //       }
  //     }

  //     if (isFolderUpload) {
  //       console.log('폴더가 업로드되었습니다.');
  //       // 폴더 업로드 처리 로직
  //     } else {
  //       console.log('파일이 업로드되었습니다.');
  //       handleDropImageUploadView(files);

  //       // 단일 파일 업로드 처리 로직
  //     }

  //     // 파일 또는 폴더 업로드 처리 함수 호출
  //     // handleDropImageUploadView(files);
  //   }
  // };
  // [handleDropImageUploadView],
  // );

  // const handleDrop = useCallback((event: React.DragEvent<HTMLDivElement>) => {
  //   event.preventDefault();
  //   event.stopPropagation();

  //   const items = event.dataTransfer.items;

  //   if (items) {
  //     for (let i = 0; i < items.length; i++) {
  //       const item = items[i].webkitGetAsEntry();
  //       if (item) {
  //         processEntry(item);
  //       }
  //     }
  //   }
  // }, []);

  // const processEntry = (entry) => {
  //   if (entry.isFile) {
  //     // 파일 처리
  //     console.log('파일');
  //     entry.file((file) => {
  //       // console.log(file);

  //       // 여기에서 파일을 처리합니다.
  //       // 예를 들어, 이미지 파일이라면 Data URL로 읽기
  //       if (file.type.startsWith('image/')) {
  //         const reader = new FileReader();
  //         reader.onload = (e) => {
  //           // console.log(e.target.result); // Base64 이미지 데이터
  //         };
  //         reader.readAsDataURL(file);
  //       }
  //     });
  //   } else if (entry.isDirectory) {
  //     console.log('폴더');
  //     console.log(r)
  //     // handleFolderUploadView(entry);
  //     // 디렉토리 처리, 디렉토리 내용 읽기
  //     // const dirReader = entry.createReader();
  //     // dirReader.readEntries((entries) => {
  //     //   for (let i = 0; i < entries.length; i++) {
  //     //     processEntry(entries[i]);
  //     //   }
  //     // });
  //   }
  // };

  // const handleDropTest = useCallback(
  //   (event: React.DragEvent<HTMLDivElement>) => {
  //     event.preventDefault();
  //     event.stopPropagation();

  //     const { files } = event.dataTransfer;
  //     if (files && files.length > 0) {
  //       // handleDropImageUploadView(files);
  //       handleDrop(files);
  //     }
  //   },
  //   [handleDropImageUploadView, handleFolderUploadView, handleDrop],
  // );

  // 드래그앤드롭 드롭
  // const handleDrop = useCallback(
  //   (event: React.DragEvent<HTMLDivElement>) => {
  //     event.preventDefault();
  //     event.stopPropagation();

  //     const { files } = event.dataTransfer;
  //     if (files && files.length > 0) {
  //       handleDropImageUploadView(files);
  //       // handleFolderUploadView(files);
  //     }
  //   },
  //   [handleDropImageUploadView, handleFolderUploadView],
  // );

  // // 드래그앤드롭 드래그
  // const handleDragOver = useCallback(
  //   (event: React.DragEvent<HTMLDivElement>) => {
  //     event.preventDefault();
  //     event.stopPropagation();
  //   },
  //   [],
  // );

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

  const renderTree = (nodeId: number) => {
    const node = nodes[nodeId];
    return (
      <TreeItem
        draggable
        onDrop={(e: React.DragEvent<HTMLDivElement>) => {
          handleDropTree(e, node.id);
          console.log(node.id);
        }}
        onDragOver={(e: React.DragEvent<HTMLDivElement>) => {
          handleDragOverTree(e);
          console.log(node.id);
        }}
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
  console.log(selectedNode?.imageUrls[0].thumbnail);
  return (
    // BG
    <Box className="Background">
      <FolderTreeTest />
    </Box>
  );
}

export default FileSystemNavigator;

// {/* // 폴더트리 */}

// <Box className="FolderTree">
// <Box className="FolderTreeHeader">
//   <Button variant="contained" component="label">
//     Upload Image
//     <input
//       type="file"
//       hidden
//       accept="image/*"
//       onChange={handleImageUpload}
//       ref={fileInputRef}
//     />
//   </Button>
//   <Button variant="contained" component="label">
//     Upload Folder
//     <input
//       type="file"
//       hidden
//       ref={fileInputRef}
//       onChange={handleFolderUpload}
//       webkitdirectory="true"
//       directory="true"
//       multiple
//     />
//   </Button>
// </Box>
// <TreeView
//   defaultCollapseIcon={<ExpandMoreIcon />}
//   defaultExpandIcon={<ChevronRightIcon />}
//   onNodeSelect={handleNodeSelect}
//   // 해당 부분 tree view 드랍
//   // draggable
//   // onDrop={handleDrop}
//   // onDragOver={handleDragOver}
// >
//   {Object.keys(nodes).map(
//     (nodeId) => nodes[nodeId].parentId === null && renderTree(nodeId),
//   )}
// </TreeView>
// </Box>
// {/* // 선택 된 폴더 데이터 뷰 */}

// {/* {selectedNode && ( */}
// <Box
// mt={2}
// className="FolderView"
// onDrop={handleDrop}
// // onDrop={handleDropTest}

// onDragOver={handleDragOver}
// // onDragOver={(event) => event.preventDefault()}
// >
// <Box className="FolderViewHeader">
//   {selectedNode && (
//     <Typography variant="h6">{selectedNode.name}</Typography>
//   )}
// </Box>
// {/* <Box draggable>
//   {selectedNode?.imageUrls?.map(
//     (
//       imageUrl: string | undefined,
//       index: React.Key | null | undefined,
//     ) => (
//       <img
//         // eslint-disable-next-line react/no-array-index-key
//         key={index}
//         src={imageUrl}
//         alt={`${index}`}
//         style={{
//           maxHeight: '125px',
//           maxWidth: '125px',
//           margin: '10px',
//         }}
//       />
//     ),
//   )}
// </Box> */}
// <Box draggable>
//   {selectedNode?.imageUrls?.map((imageObject, index) => (
//     <img
//       key={index}
//       src={imageObject.thumbnail} // 썸네일 이미지 URL 사용
//       alt={`Thumbnail ${index}`}
//       style={{
//         maxHeight: '125px',
//         maxWidth: '125px',
//         margin: '10px',
//         cursor: 'pointer',
//       }}
//     />
//   ))}
// </Box>
// </Box>
// {/* )} */}

// {/* <div className="JsonList">
//   <pre>{JSON.stringify(nodes, null, 2)}</pre>
// </div> */}
// <Box className="JsonData">
// <div className="JsonList">
//   <text>폴더 트리 JSON</text>

//   <pre>
//     {JSON.stringify(
//       nodes,
//       (key, value) => {
//         if (key === 'imageUrls') return '[Images]';
//         return value;
//       },
//       2,
//     )}
//   </pre>
// </div>
// {/* <Box>
//   <FileSystem />
// </Box> */}
// </Box>
