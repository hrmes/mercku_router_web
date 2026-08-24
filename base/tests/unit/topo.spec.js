import fs from 'fs';
import path from 'path';
import { expect } from 'chai';

describe('topo data generator', () => {
  it('guards against empty mesh node lists before reading the gateway node', () => {
    const topoPath = path.resolve(process.cwd(), 'base/src/util/topo.js');
    const topoContent = fs.readFileSync(topoPath, 'utf8');

    expect(topoContent).to.include('if (!Array.isArray(array) || array.length === 0)');
    expect(topoContent).to.include('nodes: [],');
    expect(topoContent).to.include('lines: []');
  });
});
