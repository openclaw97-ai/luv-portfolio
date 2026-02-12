import { test } from 'node:test';
import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';

test('theme: globals.css contains engineering theme definitions', () => {
  const cssPath = path.resolve('src/app/globals.css');
  const cssContent = fs.readFileSync(cssPath, 'utf-8');
  
  assert.ok(cssContent.includes('--color-background: #050505'), 'Background color should be deep black');
  assert.ok(cssContent.includes('--color-grid: #111111'), 'Grid color should be defined');
  assert.ok(cssContent.includes('.bg-grid-pattern'), 'Grid pattern class should be defined');
});

test('layout: root layout contains grid layer', () => {
  const layoutPath = path.resolve('src/app/layout.tsx');
  const layoutContent = fs.readFileSync(layoutPath, 'utf-8');
  
  assert.ok(layoutContent.includes('bg-grid-pattern'), 'Layout should include the grid pattern');
  assert.ok(layoutContent.includes('dark'), 'Layout should have dark class');
});
