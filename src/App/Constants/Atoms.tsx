import { atom } from "recoil";

export default {
    editNodeType: atom({
        key: 'editNodeType',
        default: 'child'
    }),
    currFlowNode: atom({
        key: 'currFlowNode',
        default: {
            id: null, 
            name: null,
            inputs: [],
            outputs: [],
            script: null,
            author: null,
            originalNodeId: null,
            versionList: [],
            description: '',
            version: '0.0.1',
            nodeType: 'group',
        }
    }),
    currentNode: atom({
        key: 'currentNode',
        default: { 
            id: null, 
            name: null,
            inputs: [],
            outputs: [],
            script: null,
            author: null,
            originalNodeId: null,
            versionList: [],
            description: '',
            version: '0.0.1',
            nodeType: 'script',
          }
    }),
    isEditorModalOpen: atom({
        key: 'isEditorModalOpen',
        default: false
    }),
    isLibraryModalOpen: atom({
        key: 'isLibraryModalOpen',
        default: false
    }),
    isResultModalOpen: atom({
        key: 'isResultModalOpen',
        default: false
    }),
    lastNodeResult: atom({
        key: 'lastNodeResult',
        default: {}
    }),
    contextMenu: atom({
        key: 'contextMenu',
        default: { 
            id: '',
            node: null,
            top: 0,
            left: 0,
            right: 0,
            bottom: 0
          }
    }),
};