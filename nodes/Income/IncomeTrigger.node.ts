import type {
	IHookFunctions,
	IWebhookFunctions,
	INodeType,
	INodeTypeDescription,
	IWebhookResponseData,
	IDataObject,
} from 'n8n-workflow';

export class IncomeTrigger implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Income Trigger',
		name: 'incomeTrigger',
		icon: 'file:../../icons/income.svg',
		group: ['trigger'],
		version: 1,
		description: 'Handle BaseVN - App Income webhook events',
		defaults: {
			name: 'Income Trigger',
		},
		inputs: [],
		outputs: ['main'],
		credentials: [
			{
				name: 'incomeApi',
				required: true,
			},
		],
		webhooks: [
			{
				name: 'default',
				httpMethod: 'POST',
				responseMode: 'onReceived',
				path: 'webhook',
			},
		],
		properties: [
			{
				displayName: 'Event',
				name: 'event',
				type: 'options',
				options: [
					{
						name: 'All Events',
						value: '*',
						description: 'Trigger on all Income events',
					},
					// Additional event types will be added based on API documentation
				],
				default: '*',
				description: 'The event to listen to',
			},
		],
		usableAsTool: true,
	};

	webhookMethods = {
		default: {
			async checkExists(this: IHookFunctions): Promise<boolean> {
				return true;
			},
			async create(this: IHookFunctions): Promise<boolean> {
				return true;
			},
			async delete(this: IHookFunctions): Promise<boolean> {
				return true;
			},
		},
	};

	async webhook(this: IWebhookFunctions): Promise<IWebhookResponseData> {
		const bodyData = this.getBodyData() as IDataObject;
		const event = this.getNodeParameter('event') as string;

		// If specific event is selected, filter by event type
		if (event !== '*' && bodyData.event !== event) {
			return {
				workflowData: [],
			};
		}

		return {
			workflowData: [this.helpers.returnJsonArray(bodyData)],
		};
	}
}
