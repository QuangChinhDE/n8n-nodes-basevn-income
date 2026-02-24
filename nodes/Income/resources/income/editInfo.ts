import type { IDataObject, IExecuteFunctions, INodeExecutionData, INodeProperties } from 'n8n-workflow';
import { incomeApiRequest } from '../../shared/transport';
import { cleanBody } from '../../shared/utils';

export const description: INodeProperties[] = [
{
displayName: 'Income Type Token',
name: 'incomeTypeToken',
type: 'string',
typeOptions: { password: true },
required: true,
displayOptions: { show: { resource: ['income'], operation: ['editInfo'] } },
default: '',
},
{
displayName: 'Creator Username',
name: 'creator_username',
type: 'string',
required: true,
displayOptions: { show: { resource: ['income'], operation: ['editInfo'] } },
default: '',
},
{
displayName: 'UUID',
name: 'uuid',
type: 'string',
required: true,
displayOptions: { show: { resource: ['income'], operation: ['editInfo'] } },
default: '',
},
{
displayName: 'Additional Fields',
name: 'additionalFields',
type: 'collection',
default: {},
displayOptions: { show: { resource: ['income'], operation: ['editInfo'] } },
options: [
{ displayName: 'Income Since', name: 'income_since', type: 'string', default: '' },
{ displayName: 'Income Name', name: 'income_name', type: 'string', default: '' },
{ displayName: 'Income Followers', name: 'income_followers', type: 'string', default: '' },
{ displayName: 'Income Content', name: 'income_content', type: 'string', default: '' },
{ displayName: 'Transform Files Keys', name: 'transform_files_keys', type: 'string', default: '' },
{ displayName: 'Transform Categories Keys', name: 'transform_categories_keys', type: 'string', default: '' },
],
},
];

export async function execute(this: IExecuteFunctions, index: number): Promise<INodeExecutionData[]> {
const incomeTypeToken = this.getNodeParameter('incomeTypeToken', index) as string;
const creatorUsername = this.getNodeParameter('creator_username', index) as string;
const uuid = this.getNodeParameter('uuid', index) as string;
const additionalFields = this.getNodeParameter('additionalFields', index, {}) as IDataObject;

const body = cleanBody({ creator_username: creatorUsername, uuid, ...additionalFields });
const endpoint = `/webhook/income/soft.update/${incomeTypeToken}`;
const response = await incomeApiRequest.call(this, 'POST', endpoint, body);

return [{ json: response, pairedItem: index }];
}
