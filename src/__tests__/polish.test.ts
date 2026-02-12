import { test } from 'node:test';
import assert from 'node:assert';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const PAGE_PATH = join(process.cwd(), 'src/app/page.tsx');
const HERO_PATH = join(process.cwd(), 'src/components/Hero.tsx');
const ABOUT_PATH = join(process.cwd(), 'src/components/About.tsx');
const CONTACT_PATH = join(process.cwd(), 'src/components/Contact.tsx');
const LAB01_PATH = join(process.cwd(), 'src/components/Lab01Card.tsx');

test('Final Polish: Main Page contains all key sections', () => {
  const content = readFileSync(PAGE_PATH, 'utf8');
  assert.ok(content.includes('<Hero />'), 'Hero section missing');
  assert.ok(content.includes('<About />'), 'About section missing');
  assert.ok(content.includes('<Lab01Card />'), 'Lab01Card missing');
  assert.ok(content.includes('<Contact />'), 'Contact section missing');
});

test('Final Polish: Hero component has responsive font sizes', () => {
  const content = readFileSync(HERO_PATH, 'utf8');
  assert.ok(content.includes('text-4xl'), 'Base font size missing');
  assert.ok(content.includes('sm:text-6xl'), 'SM breakpoint font size missing');
  assert.ok(content.includes('lg:text-7xl'), 'LG breakpoint font size missing');
});

test('Final Polish: About component uses responsive layout', () => {
  const content = readFileSync(ABOUT_PATH, 'utf8');
  assert.ok(content.includes('flex-col'), 'Base layout should be column');
  assert.ok(content.includes('lg:flex-row'), 'LG layout should be row');
});

test('Final Polish: Project grid is responsive', () => {
  const content = readFileSync(PAGE_PATH, 'utf8');
  assert.ok(content.includes('grid-cols-1'), 'Mobile grid cols missing');
  assert.ok(content.includes('md:grid-cols-2'), 'Tablet grid cols missing');
  assert.ok(content.includes('lg:grid-cols-3'), 'Desktop grid cols missing');
});

test('Final Polish: Image component has optimized sizes attribute', () => {
  const content = readFileSync(ABOUT_PATH, 'utf8');
  assert.ok(content.includes('sizes='), 'Image missing sizes attribute');
  assert.ok(content.includes('100vw'), 'Image missing mobile size spec');
  assert.ok(content.includes('45vw'), 'Image missing desktop size spec');
});
