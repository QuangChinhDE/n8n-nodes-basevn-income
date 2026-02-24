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
displayOptions: { show: { resource: ['income'], operation: ['markInvoiced'] } },
default: '',
},
{
displayName: 'Creator Username',
name: 'creator_username',
type: 'string',
required: true,
displayOptions: { show: { resource: ['income'], operation: ['markInvoiced'] } },
default: '',
},
{
displayName: 'UUID',
name: 'uuid',
type: 'string',
required: true,
displayOptions: { show: { resource: ['income'], operation: ['markInvoiced'] } },
default: '',
},
{
displayName: 'Additional Fields',
name: 'additionalFields',
type: 'collection',
default: {},
displayOptions: { show: { resource: ['income'], operation: ['markInvoiced'] } },
options: [
{ displayName: 'Income Since', name: 'income_since', type: 'string', default: '' },
{ displayName: 'Custom File Hoa Don', name: 'custom_file_hoa_don', type: 'string', default: '' },
{ displayName: 'Custom Tinh Trang Xuat Hoa Don', name: 'custom_tinh_trang_xuat_hoa_don', type: 'string', default: '' },
],
},
];

export async function execute(this: IExecuteFunctions, index: number): Promise<INodeExecutionData[]> {
const incomeTypeToken = this.getNodeParameter('incomeTypeToken', index) as string;
const creatorUsername = this.getNodeParameter('creator_username', index) as string;
const uuid = this.getNodeParameter('uuid', index) as string;
const additionalFields = this.getNodeParameter('additionalFields', index, {}) as IDataObject;

const body = cleanBody({ creator_username: creatorUsername, uuid, ...additionalFields });
const endpoint = `/webhook/income/mark.invoiced/${incomeTypeToken}`;
const response = await incomeApiRequest.call(this, 'POST', endpoint, body);

return [{ json: response, pairedItem: index }];
}
