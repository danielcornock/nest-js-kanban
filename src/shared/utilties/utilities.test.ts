import * as util from './utilities';
import * as pf from './promisifiedFn';

export const promisifySpy = jest.spyOn(pf, 'promisifiedFn');

jest.spyOn(util, 'promisify').mockReturnValue(pf.promisifiedFn);
