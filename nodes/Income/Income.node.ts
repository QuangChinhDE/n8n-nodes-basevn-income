import {
	NodeConnectionTypes,
	type IExecuteFunctions,
	type INodeExecutionData,
	type INodeType,
	type INodeTypeDescription,
} from 'n8n-workflow';

import * as inflow from './resources/inflow';
import * as income from './resources/income';

export class Income implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'BaseVN - App Income',
		name: 'income',
		icon: 'file:../../icons/income.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Interact with BaseVN - App Income',
		defaults: {
			name: 'BaseVN - App Income',
		},
		usableAsTool: true,
		inputs: [NodeConnectionTypes.Main],
		outputs: [NodeConnectionTypes.Main],
		credentials: [
			{
				name: 'incomeApi',
				required: true,
			},
		],
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Inflow',
						value: 'inflow',
						description: 'Operations on inflows',
					},
					{
						name: 'Income',
						value: 'income',
						description: 'Operations on incomes',
					},
				],
				default: 'inflow',
			},
			...inflow.description,
			...income.description,
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];
		const resource = this.getNodeParameter('resource', 0) as string;
		const operation = this.getNodeParameter('operation', 0) as string;

		for (let i = 0; i < items.length; i++) {
			try {
				let responseData: INodeExecutionData[] = [];

				if (resource === 'inflow') {
					if (operation === 'create') {
						responseData = await inflow.create.execute.call(this, i);
					} else if (operation === 'get') {
						responseData = await inflow.get.execute.call(this, i);
					} else if (operation === 'getAll') {
						responseData = await inflow.getAll.execute.call(this, i);
					} else if (operation === 'getLastUpdate') {
						responseData = await inflow.getLastUpdate.execute.call(this, i);
					}
				} else if (resource === 'income') {
					if (operation === 'create') {
						responseData = await income.create.execute.call(this, i);
					} else if (operation === 'get') {
						responseData = await income.get.execute.call(this, i);
					} else if (operation === 'getAll') {
						responseData = await income.getAll.execute.call(this, i);
					} else if (operation === 'getLastUpdate') {
						responseData = await income.getLastUpdate.execute.call(this, i);
					} else if (operation === 'editInfo') {
						responseData = await income.editInfo.execute.call(this, i);
					} else if (operation === 'editItems') {
						responseData = await income.editItems.execute.call(this, i);
					} else if (operation === 'editDeductions') {
						responseData = await income.editDeductions.execute.call(this, i);
					} else if (operation === 'cancel') {
						responseData = await income.cancel.execute.call(this, i);
					} else if (operation === 'markInvoiced') {
						responseData = await income.markInvoiced.execute.call(this, i);
					}
				}

				if (responseData && responseData.length > 0) {
					returnData.push(...responseData);
				}
			} catch (error) {
				if (this.continueOnFail()) {
					returnData.push({
						json: {
							error: (error as Error).message,
						},
						pairedItem: i,
					});
					continue;
				}
				throw error;
			}
		}

		return [returnData];
	}
}
