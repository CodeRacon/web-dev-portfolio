import { readFileSync } from 'node:fs';

function fail(message) {
  console.error(`RED: ${message}`);
  process.exit(1);
}

const portfolioTemplate = readFileSync(
  'src/app/main/portfolio/portfolio.component.html',
  'utf8'
);
const portfolioStyles = readFileSync(
  'src/app/main/portfolio/portfolio.component.scss',
  'utf8'
);
const scrollDirective = readFileSync(
  'src/app/shared/common/scroll-animation.directive.ts',
  'utf8'
);

const workCardBlock = portfolioTemplate.match(
  /<article[\s\S]*?class="work-card"[\s\S]*?>/
);

if (!workCardBlock) {
  fail('could not find the portfolio work-card block');
}

if (!workCardBlock[0].includes('[animateOnce]="true"')) {
  fail('work-card does not explicitly opt into animateOnce');
}

if (!/\.work-card\s*{[\s\S]*opacity:\s*0;/.test(portfolioStyles)) {
  fail('work-card is no longer using the expected hidden-before-animation base state');
}

if (
  !/\.work-animated\s*{[\s\S]*opacity:\s*1;[\s\S]*transform:\s*translateY\(0\);/.test(
    portfolioStyles
  )
) {
  fail('work-animated is missing explicit visible end-state styles');
}

if (!/@Input\(\)\s+animateOnce\s*=\s*true;/.test(scrollDirective)) {
  fail('scroll animation directive no longer defaults animateOnce to true');
}

if (
  !/else if \(!this\.animateOnce \|\| !this\.hasAnimated\)/.test(scrollDirective)
) {
  fail(
    'scroll animation directive no longer preserves animated elements after first reveal'
  );
}

if (
  !/if \(this\.animateOnce && this\.hasAnimated\) \{[\s\S]*?return;[\s\S]*?\}/.test(
    scrollDirective
  )
) {
  fail('scroll animation directive does not skip retriggering animateOnce elements');
}

if (!/if \(this\.animateOnce\) \{[\s\S]*?this\.subscription\.unsubscribe\(\);/.test(scrollDirective)) {
  fail('scroll animation directive does not stop observing after animateOnce reveal');
}

console.log(
  'GREEN: portfolio work-card scroll animation keeps hidden cards visible after first reveal'
);
