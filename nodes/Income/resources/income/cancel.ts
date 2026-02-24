import type { IExecuteFunctions, INodeExecutionData, INodeProperties } from 'n8n-workflow';
import { incomeApiRequest } from '../../shared/transport';
import { cleanBody } from '../../shared/utils';

export const description: INodeProperties[] = [
{
displayName: 'Income Type Token',
name: 'incomeTypeToken',
type: 'string',
typeOptions: { password: true },
required: true,
displayOptions: { show: { resource: ['income'], operation: ['cancel'] } },
default: '',
},
{
displayName: 'Creator Username',
name: 'creator_username',
type: 'string',
required: true,
displayOptions: { show: { resource: ['income'], operation: ['cancel'] } },
default: '',
},
{
displayName: 'UUID',
name: 'uuid',
type: 'string',
required: true,
displayOptions: { show: { resource: ['income'], operation: ['cancel'] } },
default: '',
},
{
displayName: 'Income Since',
name: 'income_since',
type: 'string',
displayOptions: { show: { resource: ['income'], operation: ['cancel'] } },
default: '',
},
];

export async function execute(this: IExecuteFunctions, index: number): Promise<INodeExecutionData[]> {
const incomeTypeToken = this.getNodeParameter('incomeTypeToken', index) as string;
const creatorUsername = this.getNodeParameter('creator_username', index) as string;
const uuid = this.getNodeParameter('uuid', index) as string;
const incomeSince = this.getNodeParameter('income_since', index, '') as string;

const body = cleanBody({ 
creator_username: creatorUsername, 
uuid, 
...(incomeSince && { income_since: incomeSince })
});

const endpoint = `/webhook/income/cancel/${incomeTypeToken}`;
const response = await incomeApiRequest.call(this, 'POST', endpoint, body);

return [{ json: response, pairedItem: index }];
}
