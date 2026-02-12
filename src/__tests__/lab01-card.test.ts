import { test } from 'node:test';
import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';

test('lab01-card: implementation contains technical details', () => {
  const cardPath = path.resolve('src/components/Lab01Card.tsx');
  const cardContent = fs.readFileSync(cardPath, 'utf-8');
  
  assert.ok(cardContent.includes('Lab-01'), 'Card should contain project name Lab-01');
  assert.ok(cardContent.includes('AI'), 'Card should contain tag AI');
  assert.ok(cardContent.includes('Automation'), 'Card should contain tag Automation');
  assert.ok(cardContent.includes('Engineering'), 'Card should contain tag Engineering');
  assert.ok(cardContent.includes('autonomous systems'), 'Card should describe autonomous systems');
});

test('lab01-card: uses framer-motion for animations', () => {
  const cardPath = path.resolve('src/components/Lab01Card.tsx');
  const cardContent = fs.readFileSync(cardPath, 'utf-8');
  
  assert.ok(cardContent.includes('import { motion } from "framer-motion"'), 'Card should import motion from framer-motion');
  assert.ok(cardContent.includes('<motion.div'), 'Card should use motion components');
  assert.ok(cardContent.includes('whileHover'), 'Card should have hover animations');
});

test('lab01-card: has enterprise engineering aesthetic', () => {
  const cardPath = path.resolve('src/components/Lab01Card.tsx');
  const cardContent = fs.readFileSync(cardPath, 'utf-8');
  
  assert.ok(cardContent.includes('border-grid-strong'), 'Card should use theme grid borders');
  assert.ok(cardContent.includes('bg-neutral-900'), 'Card should use dark neutral background');
  assert.ok(cardContent.includes('font-mono'), 'Card should use monospaced font for technical identifiers');
  assert.ok(cardContent.includes('border-t border-l border-accent/20'), 'Card should have engineering corner accents');
});

test('page: layout uses Lab01Card component', () => {
  const pagePath = path.resolve('src/app/page.tsx');
  const pageContent = fs.readFileSync(pagePath, 'utf-8');
  
  assert.ok(pageContent.includes('<Lab01Card />'), 'Main page should include the Lab01Card component');
  assert.ok(pageContent.includes('import { Lab01Card } from "@/components/Lab01Card"'), 'Main page should import Lab01Card');
});
