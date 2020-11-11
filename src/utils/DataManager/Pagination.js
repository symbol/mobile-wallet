const PAGE_SIZE = 15;

export default class Pagination {
	constructor({ name, fetchFunction, pageInfo = {}, errorMessage }) {
		if (typeof name !== 'string')
			throw Error('Failed to construct Pagination. Name is not provided');
		if (typeof fetchFunction !== 'function')
			throw Error('Cannot create Pagination. Fetch function is not provided');
		if (pageInfo === null || typeof pageInfo !== 'object')
			throw Error('Cannot create Pagination. "pageInfo" is not an "object"');

		this.name = name;
		this.fetchFunction = fetchFunction;
		this.pageInfo = {
			pageNumber: pageInfo.pageNumber || 1,
			pageSize: pageInfo.pageSize || PAGE_SIZE
		};
		this.store = {};

		this.addLatestItem = this.addLatestItem.bind(this);
		this.initialized = false;
		this.isLoading = true;
		this.isError = false;
		this.errorMessage = errorMessage || '';
		this.errorDescription = '';
	}

	static empty() {
		return {
			data: [],
			canFetchNext: false,
			canFetchPrevious: false,
			fetchNext: () => { },
			fetchPrevious: () => { },
			reset: () => { }
		};
	}

	get data() {
		return this?.pageInfo?.data || [];
	}

	get canFetchPrevious() {
		return this.pageInfo.pageNumber > 1 && this.isLoading === false;
	}

	get canFetchNext() {
		return !this.pageInfo.isLastPage && this.isLoading === false;
	}

	get isLive() {
		return this.pageInfo.pageNumber === 1 || false;
	}

	get pageNumber() {
		return this.pageInfo.pageNumber || 1;
	}

	get pageSize() {
		return this.pageInfo.pageSize;
	}

	/** Store context
   *
   */
	setStore = (store, namespace) => {
		this.store = store;
		this.namespace = namespace;
		this.store.commit({type: `${this.namespace}/setDataManager_${this.name}`, payload: this});
		return this;
	}

	/**
	 * Set timeline data
	 * @param data
	 */
	setData = (data) => {
		this.pageInfo.data = data;
		return this;
	}

	/** Uninitialize Pagination
   *
   */
	uninitialize = () => {
		this.initialized = false;
		this.pageInfo.pageNumber = 1;
		this.isLoading = false;
		this.isError = false;
	}

	/** Initialize and fetch data
   *
   */
	initialFetch = () => {
		if (!this.initialized) {
			this.reset();
			this.initialized = true;
			return this.fetch();
		}
	}

	/** Fetch data
   *
   */
	fetch = async () => {
		this.isLoading = true;
		this.store.commit({type: `${this.namespace}/setDataManager_${this.name}`, payload: this});

		try {
			this.pageInfo = await this.fetchFunction(this.pageInfo, this.store);
		}
		catch (e) {
			console.error(e);
			this.errorDescription = e.message;
			this.isError = true;
		}
		this.isLoading = false;

		this.store.commit({type: `${this.namespace}/setDataManager_${this.name}`, payload: this});
		return this;
	}

	/** Fetch next page of data
   *
   */
	fetchNext = async () => {
		if (this.canFetchNext) {
			this.store.commit({type: `${this.namespace}/setDataManager_${this.name}`, payload: this});
			this.pageInfo.pageNumber++;
			await this.fetch();
		}
		else
			console.error('[Pagination]: cannot fetch next');
		this.isLoading = false;

		this.store.commit({type: `${this.namespace}/setDataManager_${this.name}`, payload: this});
		return this;
	}

	/** Fetch previous page of data
   *
   */
	fetchPrevious = async () => {
		if (this.canFetchPrevious) {
			this.store.commit({type: `${this.namespace}/setDataManager_${this.name}`, payload: this});
			this.pageInfo.pageNumber--;
			await this.fetch();
		}
		else
			return this.reset();

		this.store.commit({type: `${this.namespace}/setDataManager_${this.name}`, payload: this});
		return this;
	}

	/** Fetch data with specific page configuration
   *
   */
	fetchPage = async (pageInfo) => {
		if (
			pageInfo !== null &&
            typeof pageInfo !== 'undefined'
		) {
			this.store.commit({type: `${this.namespace}/setDataManager_${this.name}`, payload: this});
			if (this.pageInfo === null || typeof this.pageInfo !== 'object') {
				for (const key in pageInfo)
					this.pageInfo[key] = pageInfo[key];
			}
			await this.fetch();
		}
		else
			console.error(`[Pagination]: failed to fetchWithCriteria 'pageInfo' is not an object`);

		this.store.commit({type: `${this.namespace}/setDataManager_${this.name}`, payload: this});
		return this;
	}

	/** Reset Pagination and fetch data
   *
   */
	reset = async (pageNumber = 1) => {
		this.pageInfo.pageNumber = pageNumber;
		this.errorDescription = '';
		return this.fetch();
	}

	// Add latest item to current.
	addLatestItem = (item, keyName) => {
		if (this.isLive) {
			if (this.data?.length && this.data[0][keyName] === item[keyName])
				console.error('[Pagination]: attempted to add duplicate item as a latest item');
			else {
				const data = [item, ...this.data];

				data.pop();

				const newTimeline = [].concat.apply([], data);

				this.setData(newTimeline);
				this.store.commit({type: `${this.namespace}/setDataManager_${this.name}`, payload: this});
				return this;
			}
		}
	}
}
