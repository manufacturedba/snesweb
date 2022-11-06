import { copyFileSync } from 'fs';

const src = 'remote_config_defaults.json';
const dest = 'remote_config.json';

copyFileSync(src, dest);
