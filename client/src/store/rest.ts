export enum Endpoints {
  Browse = 1,
  Read = 1 << 1,
  Add = 1 << 2,
  Edit = 1 << 3,
  Destroy = 1 << 4,
  All = Browse | Read | Add | Edit | Destroy
}

export interface Identifiable {
  id: string;
}

export interface IModel extends Identifiable {}

export interface IApiConfig<TRequest> {
  allowed?: Endpoints;
  singular?: boolean;
  requestToId?: (request: TRequest) => string;
}

export interface IApi<TModel extends IModel, TRequest = TModel> {
  resource: string;
  singular: boolean;
  allowed: Endpoints;
  requestToId: (request: TRequest) => string;

  browse(subresource?: string, query?: string): Promise<TModel[]>;
  read(idOrSlug: string): Promise<TModel>;
  add(request: TRequest): Promise<TModel>;
  edit(request: TRequest): Promise<TModel>;
  destroy(resource: TModel): Promise<boolean>;
}

/**
 * Defines an API for communicating with a REST API over a set of
 * endpoints. This is typed: indexable models, with an option for
 * slightly different requests, as needed.
 */
export class Api<TModel extends IModel, TRequest = TModel>
  implements IApi<TModel, TRequest> {
  resource: string;
  singular: boolean;
  allowed: Endpoints;
  requestToId: (request: TRequest) => string;

  constructor(resource: string, config: IApiConfig<TRequest> = {}) {
    this.resource = resource;
    this.allowed = config.allowed || Endpoints.All;
    this.singular = config.singular || false;
    this.requestToId =
      config.requestToId ||
      ((request: TRequest) => {
        const modelized = (request as unknown) as TModel;
        return modelized.id;
      });
  }

  endpoint(...rest: string[]) {
    const identifiers = this.singular ? [] : rest;
    return [this.resource, ...identifiers].join('/');
  }

  async browse(subresource?: string, query?: string) {
    this.verifyEndpointAllowed(Endpoints.Browse);
    const res = await fetch(this.endpoint(subresource || ''));
    return this.verifyResponse<TModel[]>(res);
  }

  async read(idOrSlug: string) {
    this.verifyEndpointAllowed(Endpoints.Read);
    const res = await fetch(this.endpoint(idOrSlug));
    return this.verifyResponse<TModel>(res);
  }

  // NOTE: using this for login seems dubious, as this will need to
  // send credentials for non-login requests.
  async add(request: TRequest) {
    this.verifyEndpointAllowed(Endpoints.Add);
    const res = await fetch(this.resource, {
      method: 'POST',
      body: JSON.stringify(request),
      headers: { 'content-type': 'application/json' },
      credentials: 'include'
    });
    return this.verifyResponse<TModel>(res);
  }

  async edit(request: TRequest) {
    this.verifyEndpointAllowed(Endpoints.Edit);
    const res = await fetch(this.endpoint(this.requestToId(request)), {
      method: 'PUT',
      body: JSON.stringify(request),
      headers: { 'content-type': 'application/json' },
      credentials: 'include'
    });
    return this.verifyResponse<TModel>(res);
  }

  async destroy(resource: TModel) {
    this.verifyEndpointAllowed(Endpoints.Destroy);
    const res = await fetch(this.endpoint(resource.id), {
      method: 'DELETE',
      credentials: 'include'
    });
    return this.verifyResponse<boolean>(res);
  }

  verifyEndpointAllowed(endpoint: Endpoints) {
    if ((this.allowed & endpoint) === 0) {
      throw new Error(
        `resource ${this.resource} does not allow access to endpoint ${endpoint}`
      );
    }
  }

  async verifyResponse<TResult>(res: Response) {
    if (res.status < 200 || res.status >= 300) {
      console.error(res);
      throw new Error(`Bad Request: ${res.statusText}`);
    } else if (res.status === 204) {
      return (true as unknown) as TResult;
    }
    return (await res.json()) as TResult;
  }
}