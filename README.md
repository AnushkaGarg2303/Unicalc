# UniCalc – Ultimate 3D Glassmorphism Calculator Suite

UniCalc is a comprehensive, modern, all-in-one web calculator suite featuring **22 distinct calculation engines**, a tactile **3D Glassmorphism design** with realistic button push depth, Web Audio API mechanical sound effects, step-by-step mathematical solutions, formula references, and responsive mobile/desktop interfaces.

Built using **React**, **Tailwind CSS**, and **Vite**.

---

## ✨ Features Overview

### 1. Basic Calculator
- Standard arithmetic: Addition, Subtraction, Multiplication, Division
- BODMAS / PEMDAS algebraic order of operations with parentheses `( )`
- Powers `xʸ`, Square `x²`, Cube `x³`
- Square root `√x`, Cube root `∛x`
- Reciprocal `1/x`, Modulus `%`, and Factorial `n!`
- Full calculation history and instant keyboard support

### 2. Scientific Calculator
- Trigonometry: `sin`, `cos`, `tan`
- Inverse Trigonometry: `asin`, `acos`, `atan`
- Hyperbolic Functions: `sinh`, `cosh`, `tanh`
- Logarithms: `log₁₀`, natural `ln`
- Exponential: `eˣ`
- Constants: `π` (Pi), `e` (Euler's number)
- Permutations `nPr` and Combinations `nCr`
- Degree (`DEG`) and Radian (`RAD`) modes
- Absolute value `|x|`, Floor `⌊x⌋`, and Ceiling `⌈x⌉`

### 3. Simple Interest (SI)
- Calculate Simple Interest, Principal, Annual Rate, or Time
- Final total maturity amount calculation
- Visual percentage ratio breakdown between Principal and Interest

### 4. Compound Interest (CI)
- Compound Interest & Final maturity balance calculation
- Compounding frequencies: Annual ($n=1$), Half-Yearly ($n=2$), Quarterly ($n=4$), Monthly ($n=12$), and Daily ($n=365$)
- **SI vs CI Comparative Analysis**: Side-by-side comparison showing compounding advantage

### 5. Profit & Loss Calculator
- Profit / Loss calculation & percentage relative to Cost Price
- Find Selling Price (SP) from Cost Price (CP) & %
- Reverse solver: Find Cost Price (CP) from Selling Price (SP) & %
- **Multi-Item Inventory Ledger**: Add multiple products to evaluate aggregate portfolio margin

### 6. Discount Calculator
- Single discount amount and final selling price
- Successive / Chain discounts ($d_1\% + d_2\% + d_3\%$) with single equivalent flat rate
- **Deal Comparison**: Compare Deal A vs Deal B on the same marked price

### 7. Percentage Calculator
- Basic: Calculate $X\%$ of $Y$
- Percentage Increase / Decrease from $A$ to $B$
- Percentage Difference and Absolute Change
- Reverse Percentage: If $Y$ represents $P\%$, calculate the $100\%$ base
- Marks Percentage with assigned grade ($A+$, $A$, $B$, etc.) and academic division
- Multi-Subject Exam Result Grade Sheet

### 8. Mensuration – 2D Shapes (16 Shapes)
1. Square
2. Rectangle
3. Triangle (Base & Height)
4. Equilateral Triangle
5. Isosceles Triangle
6. Scalene Triangle (Heron's Formula)
7. Right-Angled Triangle (Pythagorean)
8. Circle
9. Semicircle
10. Quadrant
11. Parallelogram
12. Rhombus
13. Trapezium
14. Kite
15. Sector of Circle
16. Annulus (Ring)
*Includes interactive SVG shape diagrams, Area, Perimeter/Circumference, and Diagonals.*

### 9. Mensuration – 3D Shapes (11 Shapes)
1. Cube
2. Cuboid
3. Cylinder
4. Hollow Cylinder
5. Cone
6. Frustum of Cone
7. Sphere
8. Hemisphere
9. Prism
10. Pyramid (Square Base)
11. Frustum of Pyramid
*Includes 3D wireframe visuals, Volume capacity, Curved Surface Area (CSA), and Total Surface Area (TSA).*

### 10. Data Storage Converter
- Units: Bit, Nibble, Byte, KB, MB, GB, TB, PB, EB, ZB, YB
- Dual standards: Binary (IEC base 2: 1024) and Decimal (SI base 10: 1000)
- Real-time cross-conversion matrix across all 11 storage units
- **Network File Transfer Time Estimator**: Predicts download/upload duration based on bandwidth

### 11. Universal Unit Converter (15 Categories)
1. Length (mm, cm, m, km, inch, foot, yard, mile, nautical mile)
2. Weight / Mass (mg, g, kg, tonne, pound, ounce, stone)
3. Temperature (Celsius, Fahrenheit, Kelvin, Rankine)
4. Area (mm², cm², m², km², ha, acre, sq ft, sq yd)
5. Volume (mL, L, cm³, m³, gallon US/UK, pint, fluid ounce)
6. Time (ms, second, minute, hour, day, week, month, year)
7. Speed (m/s, km/h, mph, knot, ft/s)
8. Pressure (Pa, kPa, bar, psi, atm, torr)
9. Energy (Joule, kJ, calorie, kcal, Wh, kWh, BTU, eV)
10. Power (Watt, kW, MW, hp, metric PS)
11. Force (Newton, kN, dyne, lbf, kgf)
12. Frequency (Hz, kHz, MHz, GHz, RPM)
13. Angle (Degree, Radian, Gradian, Arcminute, Arcsecond)
14. Fuel Economy (km/L, L/100km, MPG US, MPG UK)
15. Data Transfer Speed (bps, Kbps, Mbps, Gbps, B/s, KB/s, MB/s, GB/s)

### 12. Ratio & Proportion Calculator
- Ratio simplification (e.g. `24:36:48` $\to$ `2:3:4`)
- Ratio comparison ($A:B$ vs $C:D$)
- Divide total amount into multiple proportional shares
- Missing proportion solver ($A:B = C:X$)
- Continued proportion / Mean proportional ($B = \sqrt{A \cdot C}$)

### 13. Average Calculator
- Simple arithmetic mean, median, min, max, and total sum
- Weighted average $\frac{\sum w \cdot x}{\sum w}$
- Missing score solver: What score is needed to achieve a target average?
- Combined average of two demographic groups

### 14. HCF & LCM Calculator
- HCF / GCD and LCM for two or more numbers
- Prime factorization breakdown with exponent notation
- List of common factors & multiples
- Step-by-step Euclidean division algorithm

### 15. Fraction Calculator
- Arithmetic: Addition, Subtraction, Multiplication, Division
- Automatic GCD reduction to lowest terms
- Mixed fraction $\leftrightarrow$ Improper fraction conversion
- Decimal to exact fraction with rational approximations

### 16. Number System Converter
- Conversions between: Binary (2), Octal (8), Decimal (10), Hexadecimal (16)
- Custom base conversion (Radix 2 through 36)
- Step-by-step polynomial expansion & repeated division methods

### 17. Age & Date Calculator
- Exact chronological age in Years, Months, Days, and Hours
- Date difference interval and total days
- Add or subtract days to find past/future dates
- Days countdown to next birthday or deadline
- Day of the week finder for any Gregorian date
- Working days / business days calculator (excluding weekends)
- Leap year rule checker

### 18. Time Calculator
- HH:MM:SS duration addition and subtraction
- Working hours calculator with break deductions and wage estimator
- Hours $\leftrightarrow$ Minutes $\leftrightarrow$ Seconds conversions

### 19. BMI Calculator
- Body Mass Index calculation with WHO classification
- Metric (cm, kg) and Imperial (ft/in, lbs) support
- Color spectrum gauge visualizer
- Healthy weight range and goal guidance

### 20. Additional Mathematics Tools & Statistics
- Prime, Composite, and Even/Odd number tester
- Divisibility rule verification for divisors 2 through 13
- Perfect square and cube checker
- Exact BigInt factorials for large $n!$
- Arithmetic Progression (AP) and Geometric Progression (GP) nth term & sum
- Probability and odds in favor / against
- Descriptive statistics: Mean, Median, Mode, Variance, Population & Sample Standard Deviation, Range

### 21. Universal Formula Library
- Curated reference covering Algebra, Geometry, Mensuration, Trigonometry, Arithmetic, Interest, and Probability
- Full descriptions, variable breakdowns, and worked examples
- Direct "Calculate Using This Formula" deep links into the respective tools

### 22. Common UI & Platform Features
- **3D Glassmorphism UI**: Frosted glass panels, ambient colored glow, and specular top borders
- **Depth Effect Buttons**: Realistic physical button push active states with tactile drop shadows
- **Web Audio API**: Optional mechanical click sound effects on button presses
- **Themes**: Premium Dark Mode and crisp Light Mode with persistent state
- **Global Search (`⌘K` / `Ctrl+K`)**: Instant search across all 22 tools and ~80 sub-calculators
- **Calculation History (`⌘H`)**: Drawer with copy, delete, JSON export, and clear
- **Step-by-Step Solutions**: Collapsible mathematical proofs and working for every calculation
- **Export & Print**: Clean print stylesheets and formatted text summaries
- **Precision Selector**: Switch between 2, 4, 6, 8 decimals or Auto
- **Keyboard Shortcuts**: Full numeric and operator keyboard mapping

---

## 🚀 Running the Project

### Development
```bash
npm install
npm run dev
```

### Production Build
```bash
npm run build
npm run preview
```
