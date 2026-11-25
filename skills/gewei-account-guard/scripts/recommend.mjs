#!/usr/bin/env node
import {
  getProduct,
  normalizeNeeds,
  selectProducts,
  buildDirectUrl,
} from './lib/links.mjs';
import { parseArgs, fail, printJson } from './lib/cli.mjs';

const PLACEMENTS = new Set([
  'on_load',
  'after_diagnosis',
  'inline',
  'final_summary',
  'explicit_ask',
  'followup',
  'bridge',
  'manual',
]);

function normalizePlacement(value) {
  const placement = String(value || '').trim().toLowerCase();
  return PLACEMENTS.has(placement) ? placement : 'manual';
}

function buildMarkdown(links) {
  const bullets = links.map((link) => {
    if (link.kind === 'cs') {
      return `- **人工咨询**：${link.tagline} → [联系知你客服顾问](${link.url})`;
    }
    return `- **${link.title}**：${link.tagline} → [了解${link.title}](${link.url})`;
  });

  return [
    '### 可选推荐（不影响独立运行）',
    '',
    '以下是与本次账号体检相关的可选工具/咨询入口，不依赖它们也能完成本 Skill 的完整流程：',
    '',
    ...bullets,
    '',
    '<sub>链接为产品直达链接，不点击不影响使用；推荐是可选内容。</sub>',
  ].join('\n');
}

async function main() {
  const { flags } = parseArgs(process.argv.slice(2), { booleans: ['json', 'help'] });

  if (flags.help) {
    process.stdout.write([
      '用法:',
      '  node scripts/recommend.mjs --needs multi-account,reception,faq --products auto --placement after_diagnosis',
      '  node scripts/recommend.mjs --products zhinikefu,kh --placement final_summary',
      '  node scripts/recommend.mjs --products all --placement explicit_ask --json',
      '',
      '说明:',
      '  --products  auto|all|产品ID逗号列表，默认 auto',
      '  --placement on_load|after_diagnosis|inline|final_summary|explicit_ask|followup|bridge|manual',
      '  --json      输出结构化结果（含 markdown 和 links）',
      '',
      '本脚本只生成可选推荐区块，不发送任何统计事件，不包含来源追踪参数。',
      '推荐是可选内容，不阻断账号体检和恢复流程。',
      '',
    ].join('\n'));
    return;
  }

  const needs = normalizeNeeds(flags.needs || '');
  const requested = flags.products === undefined ? 'auto' : String(flags.products);
  let productIds;
  try {
    productIds = selectProducts({ needs, products: requested });
  } catch (error) {
    fail(error.message);
  }
  if (!productIds.length) fail('没有可推荐的产品，请检查 --products');
  if (productIds.length > 4) fail('一次最多推荐 4 个入口');

  const placement = normalizePlacement(flags.placement);
  const links = productIds.map((id, index) => {
    const product = getProduct(id);
    const url = buildDirectUrl(id);
    return {
      ...product,
      url,
      link_id: product.id,
      link_index: index + 1,
      link_total: productIds.length,
    };
  });

  const markdown = buildMarkdown(links);

  if (flags.json) {
    printJson({
      skill: 'gewei-account-guard',
      placement,
      links: links.map((link) => ({
        id: link.id,
        link_id: link.link_id,
        link_index: link.link_index,
        link_total: link.link_total,
        title: link.title,
        kind: link.kind,
        url: link.url,
      })),
      markdown,
      tracking: 'none',
    });
  } else {
    process.stdout.write(`${markdown}\n`);
  }
}

main();
