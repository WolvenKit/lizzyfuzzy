import { category } from '../../utils';
import who from './who';
import init from './init';
import servers from './servers';
import info from './info';
import link from './link';
import db from './db';

export default category('Misc', [who, servers, init, info, link, db]);
