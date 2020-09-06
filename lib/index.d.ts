import Async, { AsyncOptions } from 'async-mobx';
declare type AjaxQueryType = string | number | boolean;
export declare type AjaxQuery = AjaxQueryType | AjaxQueryType[];
export declare type AjaxQueryObject = Record<string, AjaxQuery>;
export declare type AjaxData = Record<string, string | number>;
export declare type AjaxOptions<D extends AjaxData = AjaxData, Q extends AjaxQueryObject = AjaxQueryObject> = RequestInit & Omit<AsyncOptions, 'request'> & {
    data?: D;
    query?: Q;
    type?: 'json' | 'text' | 'blob' | 'arrayBuffer' | 'formData';
};
declare class Ajax<D extends AjaxData = AjaxData, Q extends AjaxQueryObject = AjaxQueryObject> extends Async {
    query: Q;
    data: D;
    answer: Response;
    constructor(url: string, options?: AjaxOptions<D, Q>);
}
export default Ajax;
