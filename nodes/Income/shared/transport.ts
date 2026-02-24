import type { IExecuteFunctions, IHttpRequestMethods, IDataObject } from 'n8n-workflow';

/**
 * Make an API request to BaseVN - App Income
 * All requests use POST method and form-urlencoded content type
 */
export async function incomeApiRequest(
	this: IExecuteFunctions,
	method: IHttpRequestMethods,
	endpoint: string,
	body: IDataObject = {},
): Promise<IDataObject> {
	const credentials = await this.getCredentials('incomeApi');
	const domain = credentials.domain as string;
	const accessToken = credentials.accessToken as string;

	// Add access_token_v2 to body (required by API)
	const requestBody = {
		access_token_v2: accessToken,
		...body,
	};

	const options = {
		method,
		url: `https://income.${domain}/extapi/v1${endpoint}`,
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
		},
		body: requestBody,
	};

	return await this.helpers.httpRequest(options);
}

/**
 * Make an API request with pagination support
 */
export async function incomeApiRequestWithPagination(
	this: IExecuteFunctions,
	endpoint: string,
	body: IDataObject = {},
	propertyName: string = 'data',
): Promise<IDataObject[]> {
	let page = 0;
	const returnData: IDataObject[] = [];
	let responseData: IDataObject;

	do {
		const requestBody = { ...body, page };
		responseData = await incomeApiRequest.call(this, 'POST', endpoint, requestBody);

		if (responseData[propertyName] && Array.isArray(responseData[propertyName])) {
			returnData.push(...(responseData[propertyName] as IDataObject[]));
		}

		page++;
	} while (
		responseData[propertyName] &&
		Array.isArray(responseData[propertyName]) &&
		(responseData[propertyName] as IDataObject[]).length > 0
	);

	return returnData;
}
