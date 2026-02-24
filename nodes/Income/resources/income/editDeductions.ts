import type { IDataObject, IExecuteFunctions, INodeExecutionData, INodeProperties } from 'n8n-workflow';
import { incomeApiRequest } from '../../shared/transport';
import { cleanBody } from '../../shared/utils';

export const description: INodeProperties[] = [
{
displayName: 'Username',
name: 'username',
type: 'string',
required: true,
displayOptions: { show: { resource: ['income'], operation: ['editDeductions'] } },
default: '',
},
{
displayName: 'Income ID',
name: 'id',
type: 'number',
required: true,
displayOptions: { show: { resource: ['income'], operation: ['editDeductions'] } },
default: 0,
},
{
displayName: 'Additional Fields',
name: 'additionalFields',
type: 'collection',
default: {},
displayOptions: { show: { resource: ['income'], operation: ['editDeductions'] } },
options: [
{ displayName: 'Custom Deduction Lines', name: 'custom_deduction_lines', type: 'string', default: '', description: 'Base64 encoded deduction lines data' },
{ displayName: 'Fee Record Date', name: 'fee_record_date', type: 'string', default: '' },
],
},
];

export async function execute(this: IExecuteFunctions, index: number): Promise<INodeExecutionData[]> {
const username = this.getNodeParameter('username', index) as string;
const id = this.getNodeParameter('id', index) as number;
const additionalFields = this.getNodeParameter('additionalFields', index, {}) as IDataObject;

const body = cleanBody({ username, id, ...additionalFields });
const endpoint = '/income/adjust.deductions';
const response = await incomeApiRequest.call(this, 'POST', endpoint, body);

return [{ json: response, pairedItem: index }];
}
