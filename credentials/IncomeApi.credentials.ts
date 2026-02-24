import type {
	Icon,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class IncomeApi implements ICredentialType {
	name = 'incomeApi';

	displayName = 'BaseVN - App Income API';

	icon: Icon = 'file:../icons/income.svg';

	documentationUrl = 'https://income.{domain}/extapi/v1';

	properties: INodeProperties[] = [
		{
			displayName: 'Domain',
			name: 'domain',
			type: 'string',
			default: '',
			placeholder: 'example.base.vn',
			description: 'Your Base.vn domain (e.g., example.base.vn)',
			required: true,
		},
		{
			displayName: 'Access Token',
			name: 'accessToken',
			type: 'string',
			typeOptions: { password: true },
			default: '',
			description: 'Access token from Base Account (v2)',
			required: true,
		},
	];

	test: ICredentialTestRequest = {
		request: {
			baseURL: '=https://income.{{$credentials.domain}}/extapi/v1',
			url: '/test',
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
			},
			body: {
				access_token_v2: '={{$credentials.accessToken}}',
			},
		},
	};
}
