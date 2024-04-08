import { HandleType } from '@reactflow/core';

export interface INode {
    id: string,
    name: string,
    type: "group"|"script",
    nodeVersion?: string|number|null,
    author?: string,
    description?: string,
    inputs?: IParams[],
    outputs?: IParams[],
    originalNodeId?: string|null,
    environmentId?: string|null,
    isEndpoint?: boolean|null,
    script?: string|null,
    version?: string|number|null
}

export interface INodeRepository extends INode {
    selectedId: string,
    versions: Array<any>
}

export interface IParams {
    id: string,
    type: HandleType,
    name: string
  }