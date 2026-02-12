import { test } from 'node:test';
import assert from 'node:assert';
import pkg from '../../package.json' with { type: 'json' };

test('project-init: dependencies are present', () => {
  assert.ok(pkg.dependencies['next'], 'next should be installed');
  assert.ok(pkg.dependencies['framer-motion'], 'framer-motion should be installed');
  assert.ok(pkg.dependencies['lucide-react'], 'lucide-react should be installed');
  assert.ok(pkg.devDependencies['tailwindcss'], 'tailwindcss should be installed');
});

test('project-init: next version is 15', () => {
  assert.ok(pkg.dependencies['next'].startsWith('^15') || pkg.dependencies['next'].startsWith('15'), 'should be Next.js 15');
});
