import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { isToolEnabled, matchesAny } from '../src/filter.ts';

const readTool = { name: 'hetzner_list_servers', readOnly: true };
const writeTool = { name: 'hetzner_delete_server', readOnly: false };

describe('filter', () => {
    it('matches wildcards', () => {
        assert.equal(matchesAny('hetzner_list_servers', ['hetzner_list_*']), true);
        assert.equal(matchesAny('hetzner_get_server', ['hetzner_list_*']), false);
        assert.equal(matchesAny('hetzner_get_pricing', ['*pricing']), true);
    });

    it('drops write tools in read-only mode', () => {
        const options = { readOnly: true, allow: [], deny: [] };
        assert.equal(isToolEnabled(readTool, options), true);
        assert.equal(isToolEnabled(writeTool, options), false);
    });

    it('keeps write tools when read-only is off', () => {
        assert.equal(isToolEnabled(writeTool, { readOnly: false, allow: [], deny: [] }), true);
    });

    it('applies allow and deny lists', () => {
        assert.equal(isToolEnabled(readTool, { readOnly: true, allow: ['hetzner_get_*'], deny: [] }), false);
        assert.equal(isToolEnabled(readTool, { readOnly: true, allow: [], deny: ['hetzner_list_servers'] }), false);
        assert.equal(isToolEnabled(readTool, { readOnly: true, allow: ['hetzner_list_*'], deny: ['*_servers'] }), false);
    });
});
