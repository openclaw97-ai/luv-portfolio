import { test } from 'node:test';
import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';

test('about: implementation contains bio text snippets', () => {
  const aboutPath = path.resolve('src/components/About.tsx');
  const aboutContent = fs.readFileSync(aboutPath, 'utf-8');
  
  assert.ok(aboutContent.includes('specializing in the intersection of autonomous robotics'), 'About should contain parts of the bio');
  assert.ok(aboutContent.includes('high-performance computing'), 'About should mention high-performance computing');
  assert.ok(aboutContent.includes('resilient, self-healing architectures'), 'About should mention resilient architectures');
});

test('about: uses next/image for optimized photo rendering', () => {
  const aboutPath = path.resolve('src/components/About.tsx');
  const aboutContent = fs.readFileSync(aboutPath, 'utf-8');
  
  assert.ok(aboutContent.includes('import Image from "next/image"'), 'About should import Image from next/image');
  assert.ok(aboutContent.includes('<Image'), 'About should use the Image component');
});

test('about: has engineering aesthetic accents', () => {
  const aboutPath = path.resolve('src/components/About.tsx');
  const aboutContent = fs.readFileSync(aboutPath, 'utf-8');
  
  assert.ok(aboutContent.includes('font-mono'), 'About should use monospace font for technical labels');
  assert.ok(aboutContent.includes('border-t'), 'About should have border accents');
});

test('page: layout uses About component', () => {
  const pagePath = path.resolve('src/app/page.tsx');
  const pageContent = fs.readFileSync(pagePath, 'utf-8');
  
  assert.ok(pageContent.includes('<About />'), 'Main page should include the About component');
  assert.ok(pageContent.includes('import { About } from "@/components/About"'), 'Main page should import About');
});
