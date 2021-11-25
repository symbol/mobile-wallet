export default class DataSet {
    constructor({ name, fetchFunction, errorMessage }) {
        if (typeof name !== 'string')
            throw Error('Failed to construct Pagination. Name is not provided');
        if (typeof fetchFunction !== 'function')
            throw Error(
                'Cannot create Pagination. Fetch function is not provided'
            );

        this.name = name;
        this.fetchFunction = fetchFunction;
        this.store = {};

        this.initialized = false;
        this.isLoading = true;
        this.isError = false;
        this.errorMessage = errorMessage || '';
        this.errorDescription = '';
        this.data = {};
    }

    static empty() {
        return {
            data: {},
            fetch: () => {},
            reset: () => {},
        };
    }

    /** Set Store context and namespace (module) name
     *
     */
    setStore = (store, namespace) => {
        this.store = store;
        this.namespace = namespace;
        this.store.commit({
            type: `${this.namespace}/setDataManager_${this.name}`,
            payload: this,
        });
        return this;
    };

    /** Uninitialize DataSet
     *
     */
    uninitialize = () => {
        this.initialized = false;
        this.isLoading = false;
        this.isError = false;
        this.data = {};
    };

    /** Initialize and fetch data
     *
     */
    initialFetch = () => {
        if (!this.initialized) {
            const r = this.reset();
            this.initialized = true;
            return r;
        }
    };

    /** Fetch data
     *
     */
    fetch = async () => {
        this.errorDescription = '';
        this.isError = false;
        this.isLoading = true;
        this.store.commit({
            type: `${this.namespace}/setDataManager_${this.name}`,
            payload: this,
        });

        try {
            this.data = await this.fetchFunction(this.store);
        } catch (e) {
            console.error(e);
            this.errorDescription = e.message;
            this.isError = true;
        }
        this.isLoading = false;

        this.store.commit({
            type: `${this.namespace}/setDataManager_${this.name}`,
            payload: this,
        });
        return this;
    };

    /** Reset and fetch data
     *
     */
    reset = async () => {
        this.errorDescription = '';
        this.isError = false;
        return this.fetch();
    };
}
