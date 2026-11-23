// Formula Library dataset with explanations, examples, variable definitions, and related tool links

export const FORMULA_DATABASE = [
  // 1. Algebra
  {
    id: 'alg_quad',
    category: 'Algebra',
    title: 'Quadratic Formula',
    formula: 'x = (-b ± √(b² - 4ac)) / (2a)',
    description: 'Finds the roots of any standard quadratic equation ax² + bx + c = 0.',
    variables: [
      { name: 'a', desc: 'Coefficient of x² (a ≠ 0)' },
      { name: 'b', desc: 'Coefficient of x' },
      { name: 'c', desc: 'Constant term' },
      { name: 'D = b² - 4ac', desc: 'Discriminant (D > 0: two real roots, D = 0: one root, D < 0: complex roots)' }
    ],
    example: 'For 2x² - 4x - 6 = 0: a=2, b=-4, c=-6. D = 16 - 4(2)(-6) = 64. x = (4 ± 8)/4 => x = 3 or x = -1.',
    targetTool: 'math_tools'
  },
  {
    id: 'alg_sq_sum',
    category: 'Algebra',
    title: 'Square of Sum (a + b)²',
    formula: '(a + b)² = a² + 2ab + b²',
    description: 'Expands the square of a binomial sum.',
    variables: [
      { name: 'a', desc: 'First term' },
      { name: 'b', desc: 'Second term' }
    ],
    example: '(3 + 4)² = 3² + 2(3)(4) + 4² = 9 + 24 + 16 = 49.',
    targetTool: 'basic'
  },
  {
    id: 'alg_diff_sq',
    category: 'Algebra',
    title: 'Difference of Squares',
    formula: 'a² - b² = (a - b)(a + b)',
    description: 'Factors the difference between two perfect squares.',
    variables: [
      { name: 'a', desc: 'First term' },
      { name: 'b', desc: 'Second term' }
    ],
    example: '9² - 4² = (9 - 4)(9 + 4) = 5 × 13 = 65.',
    targetTool: 'basic'
  },

  // 2. Geometry
  {
    id: 'geom_pythagoras',
    category: 'Geometry',
    title: 'Pythagorean Theorem',
    formula: 'a² + b² = c²  ⇒  c = √(a² + b²)',
    description: 'Relates the lengths of the legs (a, b) and hypotenuse (c) in any right-angled triangle.',
    variables: [
      { name: 'a', desc: 'Length of perpendicular leg' },
      { name: 'b', desc: 'Length of base leg' },
      { name: 'c', desc: 'Hypotenuse (longest side opposite 90°)' }
    ],
    example: 'If a = 3 and b = 4, then c = √(3² + 4²) = √(9 + 16) = √25 = 5.',
    targetTool: 'mensuration_2d'
  },
  {
    id: 'geom_poly_angle',
    category: 'Geometry',
    title: 'Sum of Interior Angles of Polygon',
    formula: 'Sum = (n - 2) × 180°',
    description: 'Computes the total degrees of all interior angles inside an n-sided simple polygon.',
    variables: [
      { name: 'n', desc: 'Number of sides of the polygon (n ≥ 3)' }
    ],
    example: 'For a hexagon (n = 6): Sum = (6 - 2) × 180° = 4 × 180° = 720°.',
    targetTool: 'mensuration_2d'
  },

  // 3. Mensuration 2D
  {
    id: 'mens_circ',
    category: 'Mensuration',
    title: 'Circle Area and Circumference',
    formula: 'Area = πr²  |  Circumference = 2πr',
    description: 'Calculates the space enclosed and boundary length of a circle of radius r.',
    variables: [
      { name: 'r', desc: 'Radius of the circle' },
      { name: 'π', desc: 'Mathematical constant ≈ 3.14159' }
    ],
    example: 'For r = 7 cm: Area ≈ 22/7 × 7² = 154 cm². Circumference ≈ 2 × 22/7 × 7 = 44 cm.',
    targetTool: 'mensuration_2d'
  },
  {
    id: 'mens_heron',
    category: 'Mensuration',
    title: "Heron's Triangle Formula",
    formula: 'Area = √(s(s - a)(s - b)(s - c))',
    description: 'Computes triangle area when only the three side lengths a, b, c are known.',
    variables: [
      { name: 'a, b, c', desc: 'Lengths of the three sides' },
      { name: 's', desc: 'Semi-perimeter: s = (a + b + c) / 2' }
    ],
    example: 'Sides 5, 6, 7: s = 9. Area = √(9 × 4 × 3 × 2) = √216 ≈ 14.70.',
    targetTool: 'mensuration_2d'
  },

  // 4. Mensuration 3D
  {
    id: 'mens_cyl',
    category: 'Mensuration',
    title: 'Cylinder Volume & Surface Area',
    formula: 'V = πr²h  |  CSA = 2πrh  |  TSA = 2πr(r + h)',
    description: 'Measures capacity and total outer surface area of a circular cylinder.',
    variables: [
      { name: 'r', desc: 'Base radius' },
      { name: 'h', desc: 'Height of the cylinder' }
    ],
    example: 'For r = 3, h = 10: V = π(9)(10) = 90π ≈ 282.74. TSA = 2π(3)(13) = 78π ≈ 245.04.',
    targetTool: 'mensuration_3d'
  },
  {
    id: 'mens_sph',
    category: 'Mensuration',
    title: 'Sphere Volume & Surface Area',
    formula: 'V = (4/3)πr³  |  TSA = 4πr²',
    description: 'Computes volume and outer boundary surface area of a 3D sphere.',
    variables: [
      { name: 'r', desc: 'Radius of the sphere' }
    ],
    example: 'For r = 6: V = 4/3 × π × 216 = 288π ≈ 904.78. TSA = 4 × π × 36 = 144π ≈ 452.39.',
    targetTool: 'mensuration_3d'
  },

  // 5. Trigonometry
  {
    id: 'trig_pyth',
    category: 'Trigonometry',
    title: 'Fundamental Pythagorean Identity',
    formula: 'sin²(θ) + cos²(θ) = 1',
    description: 'Core relationship between sine and cosine for any angle θ.',
    variables: [
      { name: 'θ', desc: 'Angle in degrees or radians' }
    ],
    example: 'For θ = 30°: sin(30°) = 0.5, cos(30°) = √3/2 ≈ 0.866. 0.5² + (√3/2)² = 0.25 + 0.75 = 1.',
    targetTool: 'scientific'
  },
  {
    id: 'trig_double',
    category: 'Trigonometry',
    title: 'Double Angle Formulas',
    formula: 'sin(2θ) = 2sin(θ)cos(θ)  |  cos(2θ) = cos²(θ) - sin²(θ)',
    description: 'Expresses trigonometric functions of 2θ in terms of functions of θ.',
    variables: [
      { name: 'θ', desc: 'Base angle' }
    ],
    example: 'If θ = 45°: sin(90°) = 2 sin(45°) cos(45°) = 2 × (1/√2) × (1/√2) = 1.',
    targetTool: 'scientific'
  },

  // 6. Arithmetic (AP / GP)
  {
    id: 'arith_ap',
    category: 'Arithmetic',
    title: 'Arithmetic Progression (AP)',
    formula: 'aₙ = a + (n - 1)d  |  Sₙ = (n/2)[2a + (n - 1)d]',
    description: 'nth term and sum of first n terms of an arithmetic sequence with constant step d.',
    variables: [
      { name: 'a', desc: 'First term' },
      { name: 'd', desc: 'Common difference (step)' },
      { name: 'n', desc: 'Number of terms' },
      { name: 'Sₙ', desc: 'Sum of n terms' }
    ],
    example: 'For a = 2, d = 3, n = 5: Terms = 2, 5, 8, 11, 14. a₅ = 14. S₅ = (5/2)(4 + 12) = 40.',
    targetTool: 'math_tools'
  },
  {
    id: 'arith_gp',
    category: 'Arithmetic',
    title: 'Geometric Progression (GP)',
    formula: 'aₙ = a · rⁿ⁻¹  |  Sₙ = a(rⁿ - 1) / (r - 1)  (r ≠ 1)',
    description: 'nth term and sum of first n terms with constant common ratio r.',
    variables: [
      { name: 'a', desc: 'First term' },
      { name: 'r', desc: 'Common ratio' },
      { name: 'n', desc: 'Number of terms' }
    ],
    example: 'For a = 3, r = 2, n = 4: Terms = 3, 6, 12, 24. S₄ = 3(16 - 1)/(2 - 1) = 45.',
    targetTool: 'math_tools'
  },

  // 7. Percentage
  {
    id: 'pct_pct',
    category: 'Percentage',
    title: 'Percentage of a Value',
    formula: 'Value = (P / 100) × Total',
    description: 'Calculates P percent of an amount.',
    variables: [
      { name: 'P', desc: 'Percentage rate' },
      { name: 'Total', desc: 'Base value' }
    ],
    example: '25% of 800 = (25 / 100) × 800 = 200.',
    targetTool: 'percentage'
  },
  {
    id: 'pct_chg',
    category: 'Percentage',
    title: 'Percentage Change / Increase / Decrease',
    formula: '% Change = ((New - Old) / |Old|) × 100',
    description: 'Calculates the relative percentage growth or drop between two states.',
    variables: [
      { name: 'Old', desc: 'Initial baseline value' },
      { name: 'New', desc: 'Final resulting value' }
    ],
    example: 'Old = 50, New = 75: ((75 - 50)/50) × 100 = 50% increase.',
    targetTool: 'percentage'
  },

  // 8. Profit & Loss
  {
    id: 'pnl_profit',
    category: 'Profit & Loss',
    title: 'Profit & Loss Percentage',
    formula: 'Profit % = (Profit / CP) × 100  |  Loss % = (Loss / CP) × 100',
    description: 'Measures financial return or loss normalized by Cost Price (CP).',
    variables: [
      { name: 'CP', desc: 'Cost Price' },
      { name: 'SP', desc: 'Selling Price' },
      { name: 'Profit', desc: 'SP - CP (when SP > CP)' },
      { name: 'Loss', desc: 'CP - SP (when CP > SP)' }
    ],
    example: 'CP = $200, SP = $250. Profit = $50. Profit % = (50/200) × 100 = 25%.',
    targetTool: 'profit_loss'
  },

  // 9. Simple & Compound Interest
  {
    id: 'fin_si',
    category: 'Interest',
    title: 'Simple Interest Formula',
    formula: 'SI = (P × R × T) / 100  |  Amount = P + SI',
    description: 'Interest calculated solely on the principal sum over time.',
    variables: [
      { name: 'P', desc: 'Principal amount invested or borrowed' },
      { name: 'R', desc: 'Annual interest rate (%)' },
      { name: 'T', desc: 'Time period in years' }
    ],
    example: 'P = $10,000, R = 5%, T = 3 yrs. SI = (10000 × 5 × 3)/100 = $1,500. Total = $11,500.',
    targetTool: 'simple_interest'
  },
  {
    id: 'fin_ci',
    category: 'Interest',
    title: 'Compound Interest Formula',
    formula: 'A = P(1 + r/n)^(nt)  |  CI = A - P',
    description: 'Interest calculated on initial principal plus accumulated interest from previous periods.',
    variables: [
      { name: 'P', desc: 'Principal amount' },
      { name: 'r', desc: 'Annual decimal interest rate (R / 100)' },
      { name: 'n', desc: 'Compounding frequency per year (1=annual, 4=quarterly, 12=monthly)' },
      { name: 't', desc: 'Time period in years' }
    ],
    example: 'P = $1,000, R = 10% (r=0.10), t = 2 yrs, compounded semi-annually (n=2). A = 1000(1 + 0.05)⁴ = 1000(1.2155) = $1,215.51.',
    targetTool: 'compound_interest'
  },

  // 10. Statistics
  {
    id: 'stat_var',
    category: 'Statistics',
    title: 'Variance & Standard Deviation',
    formula: 's² = Σ(xᵢ - μ)² / N  |  σ = √(s²)',
    description: 'Measures dispersion and variability of data points around the mean μ.',
    variables: [
      { name: 'xᵢ', desc: 'Individual data points' },
      { name: 'μ', desc: 'Mean of the data set' },
      { name: 'N', desc: 'Total number of values' },
      { name: 'σ', desc: 'Standard deviation' }
    ],
    example: 'Data [2, 4, 6]: Mean = 4. Differences squared: (2-4)²=4, (4-4)²=0, (6-4)²=4. Variance = 8/3 ≈ 2.67. Std Dev = √2.67 ≈ 1.63.',
    targetTool: 'math_tools'
  },

  // 11. Probability
  {
    id: 'prob_basic',
    category: 'Probability',
    title: 'Classical Probability & Union Rule',
    formula: 'P(A) = n(A) / n(S)  |  P(A ∪ B) = P(A) + P(B) - P(A ∩ B)',
    description: 'Probability of event A occurring from sample space S, and union of two events.',
    variables: [
      { name: 'n(A)', desc: 'Number of favorable outcomes' },
      { name: 'n(S)', desc: 'Total number of possible outcomes' },
      { name: 'P(A ∩ B)', desc: 'Probability of both A and B occurring together' }
    ],
    example: 'Rolling an even number on a 6-sided die: n(A) = 3 (2,4,6), n(S) = 6. P(Even) = 3/6 = 0.5 (50%).',
    targetTool: 'math_tools'
  },

  // 12. Number System
  {
    id: 'num_poly',
    category: 'Number System',
    title: 'Positional Polynomial Base Representation',
    formula: 'N₁₀ = dₖ·Bᵏ + ... + d₁·B¹ + d₀·B⁰',
    description: 'Converts any base-B numeral (dₖ...d₀) into base-10 decimal.',
    variables: [
      { name: 'B', desc: 'Radix / Base (2 for binary, 8 for octal, 16 for hex)' },
      { name: 'dᵢ', desc: 'Digit at position i' }
    ],
    example: 'Binary (1011)₂ to decimal: 1×2³ + 0×2² + 1×2¹ + 1×2⁰ = 8 + 0 + 2 + 1 = 11₁₀.',
    targetTool: 'number_system'
  }
];
