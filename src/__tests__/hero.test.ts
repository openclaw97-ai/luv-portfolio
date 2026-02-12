import { test } from 'node:test';
import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';

test('hero: implementation contains required headline', () => {
  const heroPath = path.resolve('src/components/Hero.tsx');
  const heroContent = fs.readFileSync(heroPath, 'utf-8');
  
  assert.ok(heroContent.includes('Building the Future of Autonomous Systems'), 'Hero should contain the exact headline');
});

test('hero: uses framer-motion for animations', () => {
  const heroPath = path.resolve('src/components/Hero.tsx');
  const heroContent = fs.readFileSync(heroPath, 'utf-8');
  
  assert.ok(heroContent.includes('import { motion } from "framer-motion"'), 'Hero should use framer-motion');
  assert.ok(heroContent.includes('<motion.'), 'Hero should use motion components');
});

test('page: layout uses Hero component', () => {
  const pagePath = path.resolve('src/app/page.tsx');
  const pageContent = fs.readFileSync(pagePath, 'utf-8');
  
  assert.ok(pageContent.includes('<Hero />'), 'Main page should include the Hero component');
  assert.ok(pageContent.includes('import { Hero } from "@/components/Hero"'), 'Main page should import Hero');
});
