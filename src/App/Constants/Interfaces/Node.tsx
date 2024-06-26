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
    endpointType?: 'GET'|'POST',
    script?: string|null,
    version?: string|number|null
}

export interface INodeRepository extends INode {
    selectedId: string,
    environmentName?: string|null,
    versions: Array<INodeVersion>
}

export interface INodeVersion extends INode {
    version?: string,
    original?: boolean,
    environmentName?: string,
}

export interface IParams {
    id: string,
    type: HandleType,
    name: string
  }

export interface IIoItem { 
    datatype: string, 
    id: string, 
    name: string,
    required?: boolean,
    orderNumber?: number,
    defaultValue?: string|null,
}