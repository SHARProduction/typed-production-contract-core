import test from 'node:test';
import assert from 'node:assert/strict';
import {normalizeContract,validateContract,diffContracts} from '../src/index.mjs';
const valid={contractVersion:'1.0.0',projectId:'synthetic-demo',deliverables:[{id:'master',format:'MOV',rightsStatus:'cleared',scope:['web']}],approvals:[{role:'producer',status:'approved'}]};
test('normalizes contract fields deterministically',()=>{const out=normalizeContract(valid);assert.equal(out.deliverables[0].format,'mov');assert.equal(out.deliverables[0].rightsStatus,'CLEARED');});
test('accepts a cleared synthetic contract',()=>assert.equal(validateContract(valid).valid,true));
test('blocks non-cleared rights',()=>{const x=structuredClone(valid);x.deliverables[0].rightsStatus='unknown';assert.equal(validateContract(x).valid,false);assert.ok(validateContract(x).codes.includes('RIGHTS_NOT_CLEARED'));});
test('diff identifies a changed deliverable',()=>{const x=structuredClone(valid);x.deliverables[0].format='mp4';assert.deepEqual(diffContracts(valid,x).changed,['master']);});
