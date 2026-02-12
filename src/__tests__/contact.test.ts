import { test } from 'node:test';
import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';

test('contact: implementation contains required components', () => {
  const contactPath = path.resolve('src/components/Contact.tsx');
  const contactContent = fs.readFileSync(contactPath, 'utf-8');
  
  assert.ok(contactContent.includes('Initiate'), 'Contact should contain the section headline part');
  assert.ok(contactContent.includes('Communication_Bridge'), 'Contact should contain the technical label');
});

test('contact: has telegram link', () => {
  const contactPath = path.resolve('src/components/Contact.tsx');
  const contactContent = fs.readFileSync(contactPath, 'utf-8');
  
  assert.ok(contactContent.includes('href="https://t.me/'), 'Contact should contain a Telegram link');
  assert.ok(contactContent.includes('target="_blank"'), 'Link should open in a new tab');
});

test('page: layout uses Contact component', () => {
  const pagePath = path.resolve('src/app/page.tsx');
  const pageContent = fs.readFileSync(pagePath, 'utf-8');
  
  assert.ok(pageContent.includes('<Contact />'), 'Main page should include the Contact component');
});
