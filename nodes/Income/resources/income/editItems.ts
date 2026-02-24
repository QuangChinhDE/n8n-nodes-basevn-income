import type { IExecuteFunctions, INodeExecutionData, INodeProperties } from 'n8n-workflow';
import { incomeApiRequest } from '../../shared/transport';
import { cleanBody } from '../../shared/utils';

export const description: INodeProperties[] = [
{
displayName: 'Username',
name: 'username',
type: 'string',
required: true,
displayOptions: { show: { resource: ['income'], operation: ['editItems'] } },
default: '',
},
{
displayName: 'Income ID',
name: 'id',
type: 'number',
required: true,
displayOptions: { show: { resource: ['income'], operation: ['editItems'] } },
default: 0,
},
{
displayName: 'Custom Item Lines',
name: 'custom_item_lines',
type: 'string',
displayOptions: { show: { resource: ['income'], operation: ['editItems'] } },
default: '',
description: 'Base64 encoded item lines data',
},
];

export async function execute(this: IExecuteFunctions, index: number): Promise<INodeExecutionData[]> {
const username = this.getNodeParameter('username', index) as string;
const id = this.getNodeParameter('id', index) as number;
const customItemLines = this.getNodeParameter('custom_item_lines', index, '') as string;

const body = cleanBody({ username, id, custom_item_lines: customItemLines });
const endpoint = '/income/adjust.items';
const response = await incomeApiRequest.call(this, 'POST', endpoint, body);

return [{ json: response, pairedItem: index }];
}
