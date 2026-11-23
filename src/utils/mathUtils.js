// Utility functions for UniCalc

/**
 * Format number with precision setting
 */
export function formatPrecision(val, precision = 4) {
  if (val === null || val === undefined || isNaN(val)) return '—';
  if (!isFinite(val)) return val > 0 ? 'Infinity' : '-Infinity';
  
  if (precision === 'auto' || precision === -1) {
    // Up to 8 decimals without trailing zeros
    const num = Number(val);
    if (Math.abs(num) < 1e-6 && num !== 0) return num.toExponential(4);
    if (Math.abs(num) >= 1e12) return num.toExponential(4);
    return parseFloat(num.toFixed(8)).toString();
  }
  
  const num = Number(val);
  if (Math.abs(num) < 1e-6 && num !== 0) return num.toExponential(precision);
  if (Math.abs(num) >= 1e12) return num.toExponential(precision);
  return parseFloat(num.toFixed(precision)).toString();
}

/**
 * Safe factorial
 */
export function factorial(n) {
  if (n < 0 || !Number.isInteger(n)) return NaN;
  if (n === 0 || n === 1) return 1;
  if (n > 170) return Infinity; // JS Number max
  let res = 1;
  for (let i = 2; i <= n; i++) {
    res *= i;
  }
  return res;
}

/**
 * BigInt factorial for exact representation
 */
export function bigFactorial(n) {
  if (n < 0 || !Number.isInteger(n)) return null;
  if (n > 500) return 'Too large to compute (>500!)';
  let res = 1n;
  for (let i = 2n; i <= BigInt(n); i++) {
    res *= i;
  }
  return res.toString();
}

/**
 * Permutation nPr
 */
export function permutation(n, r) {
  if (n < 0 || r < 0 || r > n) return 0;
  return factorial(n) / factorial(n - r);
}

/**
 * Combination nCr
 */
export function combination(n, r) {
  if (n < 0 || r < 0 || r > n) return 0;
  return factorial(n) / (factorial(r) * factorial(n - r));
}

/**
 * GCD / HCF of two numbers
 */
export function gcd(a, b) {
  a = Math.abs(Math.round(a));
  b = Math.abs(Math.round(b));
  while (b) {
    const t = b;
    b = a % b;
    a = t;
  }
  return a;
}

/**
 * Euclidean steps for GCD
 */
export function euclideanSteps(a, b) {
  a = Math.abs(Math.round(a));
  b = Math.abs(Math.round(b));
  if (a < b) [a, b] = [b, a];
  const steps = [];
  while (b > 0) {
    const q = Math.floor(a / b);
    const r = a % b;
    steps.push({ a, b, quotient: q, remainder: r, text: `${a} = (${b} × ${q}) + ${r}` });
    a = b;
    b = r;
  }
  return { gcd: a, steps };
}

/**
 * LCM of two numbers
 */
export function lcm(a, b) {
  if (a === 0 || b === 0) return 0;
  return Math.abs(Math.round(a * b)) / gcd(a, b);
}

/**
 * GCD of an array of numbers
 */
export function gcdMultiple(arr) {
  if (!arr.length) return 0;
  return arr.reduce((acc, curr) => gcd(acc, curr));
}

/**
 * LCM of an array of numbers
 */
export function lcmMultiple(arr) {
  if (!arr.length) return 0;
  return arr.reduce((acc, curr) => lcm(acc, curr));
}

/**
 * Prime factors of a number
 */
export function primeFactors(n) {
  n = Math.abs(Math.round(n));
  if (n < 2) return [];
  const factors = [];
  let d = 2;
  while (d * d <= n) {
    while (n % d === 0) {
      factors.push(d);
      n /= d;
    }
    d++;
  }
  if (n > 1) factors.push(n);
  return factors;
}

/**
 * Grouped prime factors with exponents (e.g., 2^3 * 3^1)
 */
export function primeFactorsWithExponents(n) {
  const factors = primeFactors(n);
  const counts = {};
  factors.forEach(f => {
    counts[f] = (counts[f] || 0) + 1;
  });
  return Object.entries(counts).map(([base, exp]) => ({
    base: Number(base),
    exp,
    str: exp > 1 ? `${base}^${exp}` : `${base}`
  }));
}

/**
 * Check if prime
 */
export function isPrime(n) {
  n = Math.round(n);
  if (n <= 1) return false;
  if (n <= 3) return true;
  if (n % 2 === 0 || n % 3 === 0) return false;
  for (let i = 5; i * i <= n; i += 6) {
    if (n % i === 0 || n % (i + 2) === 0) return false;
  }
  return true;
}

/**
 * All divisors of a number
 */
export function getDivisors(n) {
  n = Math.abs(Math.round(n));
  if (n === 0) return [];
  const divs = [];
  for (let i = 1; i * i <= n; i++) {
    if (n % i === 0) {
      divs.push(i);
      if (i * i !== n) divs.push(n / i);
    }
  }
  return divs.sort((a, b) => a - b);
}

/**
 * Convert decimal to fraction
 */
export function decimalToFraction(val) {
  if (isNaN(val)) return { num: 0, den: 1, str: '0' };
  const sign = val < 0 ? -1 : 1;
  val = Math.abs(val);

  // Check simple integer
  if (Number.isInteger(val)) {
    return { num: sign * val, den: 1, str: `${sign * val}` };
  }

  // Continued fraction expansion to find best rational approximation
  const tolerance = 1.0e-9;
  let h1 = 1, h2 = 0, k1 = 0, k2 = 1;
  let b = val;
  do {
    const a = Math.floor(b);
    let aux = h1;
    h1 = a * h1 + h2;
    h2 = aux;
    aux = k1;
    k1 = a * k1 + k2;
    k2 = aux;
    b = 1 / (b - a);
  } while (Math.abs(val - h1 / k1) > val * tolerance && k1 < 1000000);

  const num = sign * h1;
  const den = k1;
  const g = gcd(num, den);
  const sNum = num / g;
  const sDen = den / g;

  return {
    num: sNum,
    den: sDen,
    str: `${sNum}/${sDen}`
  };
}

/**
 * Evaluate standard math expression with BODMAS safely
 */
export function evaluateExpression(expr) {
  try {
    // Clean string
    let sanitized = expr
      .replace(/×/g, '*')
      .replace(/÷/g, '/')
      .replace(/−/g, '-')
      .replace(/\^/g, '**')
      .replace(/π/g, 'Math.PI')
      .replace(/\be\b/g, 'Math.E');

    // Only allow safe characters: digits, operators, parens, Math functions
    const allowedPattern = /^[0-9+\-*/().,%*\sMathPIEsincoatanexpqrlg_]+$/;
    if (!allowedPattern.test(sanitized)) {
      throw new Error("Invalid characters in expression");
    }

    // Function constructor safer than eval
    const fn = new Function(`return (${sanitized})`);
    const res = fn();
    if (isNaN(res)) return 'Error';
    return res;
  } catch (err) {
    return 'Error';
  }
}
