// Unit conversion dictionary and conversion logic

export const UNIT_CATEGORIES = {
  length: {
    name: 'Length',
    baseUnit: 'm',
    units: {
      mm: { name: 'Millimeter (mm)', factor: 0.001 },
      cm: { name: 'Centimeter (cm)', factor: 0.01 },
      m: { name: 'Meter (m)', factor: 1 },
      km: { name: 'Kilometer (km)', factor: 1000 },
      inch: { name: 'Inch (in)', factor: 0.0254 },
      ft: { name: 'Foot (ft)', factor: 0.3048 },
      yd: { name: 'Yard (yd)', factor: 0.9144 },
      mi: { name: 'Mile (mi)', factor: 1609.344 },
      nmi: { name: 'Nautical Mile (NM)', factor: 1852 }
    }
  },
  weight: {
    name: 'Weight / Mass',
    baseUnit: 'kg',
    units: {
      mg: { name: 'Milligram (mg)', factor: 0.000001 },
      g: { name: 'Gram (g)', factor: 0.001 },
      kg: { name: 'Kilogram (kg)', factor: 1 },
      tonne: { name: 'Metric Tonne (t)', factor: 1000 },
      oz: { name: 'Ounce (oz)', factor: 0.028349523125 },
      lb: { name: 'Pound (lb)', factor: 0.45359237 },
      st: { name: 'Stone (st)', factor: 6.35029318 }
    }
  },
  temperature: {
    name: 'Temperature',
    baseUnit: 'C',
    customConvert: (val, from, to) => {
      // Convert from source to Celsius
      let c;
      if (from === 'C') c = val;
      else if (from === 'F') c = (val - 32) * (5 / 9);
      else if (from === 'K') c = val - 273.15;
      else if (from === 'R') c = (val - 491.67) * (5 / 9);

      // Convert Celsius to destination
      if (to === 'C') return c;
      if (to === 'F') return (c * 9 / 5) + 32;
      if (to === 'K') return c + 273.15;
      if (to === 'R') return (c + 273.15) * 1.8;
      return c;
    },
    units: {
      C: { name: 'Celsius (°C)' },
      F: { name: 'Fahrenheit (°F)' },
      K: { name: 'Kelvin (K)' },
      R: { name: 'Rankine (°R)' }
    }
  },
  area: {
    name: 'Area',
    baseUnit: 'sq_m',
    units: {
      sq_mm: { name: 'Square Millimeter (mm²)', factor: 1e-6 },
      sq_cm: { name: 'Square Centimeter (cm²)', factor: 1e-4 },
      sq_m: { name: 'Square Meter (m²)', factor: 1 },
      sq_km: { name: 'Square Kilometer (km²)', factor: 1e6 },
      ha: { name: 'Hectare (ha)', factor: 10000 },
      acre: { name: 'Acre (ac)', factor: 4046.8564224 },
      sq_ft: { name: 'Square Foot (ft²)', factor: 0.09290304 },
      sq_yd: { name: 'Square Yard (yd²)', factor: 0.83612736 }
    }
  },
  volume: {
    name: 'Volume',
    baseUnit: 'l',
    units: {
      ml: { name: 'Milliliter (mL)', factor: 0.001 },
      l: { name: 'Liter (L)', factor: 1 },
      cu_cm: { name: 'Cubic Centimeter (cm³ / cc)', factor: 0.001 },
      cu_m: { name: 'Cubic Meter (m³)', factor: 1000 },
      gal_us: { name: 'Gallon (US)', factor: 3.785411784 },
      gal_uk: { name: 'Gallon (UK)', factor: 4.54609 },
      pt_us: { name: 'Pint (US)', factor: 0.473176473 },
      fl_oz_us: { name: 'Fluid Ounce (US fl oz)', factor: 0.0295735295625 }
    }
  },
  time: {
    name: 'Time',
    baseUnit: 's',
    units: {
      ms: { name: 'Millisecond (ms)', factor: 0.001 },
      s: { name: 'Second (s)', factor: 1 },
      min: { name: 'Minute (min)', factor: 60 },
      hr: { name: 'Hour (hr)', factor: 3600 },
      day: { name: 'Day (d)', factor: 86400 },
      week: { name: 'Week (wk)', factor: 604800 },
      month: { name: 'Month (avg 30.4375 d)', factor: 2629800 },
      year: { name: 'Year (365 d)', factor: 31536000 }
    }
  },
  speed: {
    name: 'Speed',
    baseUnit: 'mps',
    units: {
      mps: { name: 'Meter/Second (m/s)', factor: 1 },
      kmph: { name: 'Kilometer/Hour (km/h)', factor: 1 / 3.6 },
      mph: { name: 'Miles/Hour (mph)', factor: 0.44704 },
      knot: { name: 'Knot (kn)', factor: 0.514444 },
      fps: { name: 'Foot/Second (ft/s)', factor: 0.3048 }
    }
  },
  pressure: {
    name: 'Pressure',
    baseUnit: 'pa',
    units: {
      pa: { name: 'Pascal (Pa)', factor: 1 },
      kpa: { name: 'Kilopascal (kPa)', factor: 1000 },
      bar: { name: 'Bar', factor: 100000 },
      psi: { name: 'Pounds/sq inch (psi)', factor: 6894.757293 },
      atm: { name: 'Standard Atmosphere (atm)', factor: 101325 },
      torr: { name: 'Torr / mmHg', factor: 133.322368 }
    }
  },
  energy: {
    name: 'Energy',
    baseUnit: 'j',
    units: {
      j: { name: 'Joule (J)', factor: 1 },
      kj: { name: 'Kilojoule (kJ)', factor: 1000 },
      cal: { name: 'Calorie (cal)', factor: 4.184 },
      kcal: { name: 'Kilocalorie (kcal)', factor: 4184 },
      wh: { name: 'Watt-hour (Wh)', factor: 3600 },
      kwh: { name: 'Kilowatt-hour (kWh)', factor: 3.6e6 },
      btu: { name: 'BTU', factor: 1055.06 },
      ev: { name: 'Electronvolt (eV)', factor: 1.602176634e-19 }
    }
  },
  power: {
    name: 'Power',
    baseUnit: 'w',
    units: {
      w: { name: 'Watt (W)', factor: 1 },
      kw: { name: 'Kilowatt (kW)', factor: 1000 },
      mw: { name: 'Megawatt (MW)', factor: 1e6 },
      hp: { name: 'Mechanical Horsepower (hp)', factor: 745.699872 },
      hp_m: { name: 'Metric Horsepower (PS)', factor: 735.49875 }
    }
  },
  force: {
    name: 'Force',
    baseUnit: 'n',
    units: {
      n: { name: 'Newton (N)', factor: 1 },
      kn: { name: 'Kilonewton (kN)', factor: 1000 },
      dyn: { name: 'Dyne (dyn)', factor: 1e-5 },
      lbf: { name: 'Pound-force (lbf)', factor: 4.448222 },
      kgf: { name: 'Kilogram-force (kgf)', factor: 9.80665 }
    }
  },
  frequency: {
    name: 'Frequency',
    baseUnit: 'hz',
    units: {
      hz: { name: 'Hertz (Hz)', factor: 1 },
      khz: { name: 'Kilohertz (kHz)', factor: 1000 },
      mhz: { name: 'Megahertz (MHz)', factor: 1e6 },
      ghz: { name: 'Gigahertz (GHz)', factor: 1e9 },
      rpm: { name: 'Revolutions/min (RPM)', factor: 1 / 60 }
    }
  },
  angle: {
    name: 'Angle',
    baseUnit: 'deg',
    units: {
      deg: { name: 'Degree (°)', factor: 1 },
      rad: { name: 'Radian (rad)', factor: 180 / Math.PI },
      grad: { name: 'Gradian (grad)', factor: 0.9 },
      arcmin: { name: 'Arcminute (\')', factor: 1 / 60 },
      arcsec: { name: 'Arcsecond (\")', factor: 1 / 3600 }
    }
  },
  fuel_economy: {
    name: 'Fuel Economy',
    baseUnit: 'kml',
    customConvert: (val, from, to) => {
      // kml to others
      let kml;
      if (from === 'kml') kml = val;
      else if (from === 'lp100km') kml = val === 0 ? 0 : 100 / val;
      else if (from === 'mpg_us') kml = val * 0.425144;
      else if (from === 'mpg_uk') kml = val * 0.354006;

      if (to === 'kml') return kml;
      if (to === 'lp100km') return kml === 0 ? 0 : 100 / kml;
      if (to === 'mpg_us') return kml / 0.425144;
      if (to === 'mpg_uk') return kml / 0.354006;
      return kml;
    },
    units: {
      kml: { name: 'Kilometers per Liter (km/L)' },
      lp100km: { name: 'Liters per 100 km (L/100km)' },
      mpg_us: { name: 'Miles per Gallon US (MPG US)' },
      mpg_uk: { name: 'Miles per Gallon UK (MPG UK)' }
    }
  },
  data_speed: {
    name: 'Data Transfer Speed',
    baseUnit: 'bps',
    units: {
      bps: { name: 'Bits per second (bps)', factor: 1 },
      kbps: { name: 'Kilobits per second (Kbps)', factor: 1000 },
      mbps: { name: 'Megabits per second (Mbps)', factor: 1e6 },
      gbps: { name: 'Gigabits per second (Gbps)', factor: 1e9 },
      tbps: { name: 'Terabits per second (Tbps)', factor: 1e12 },
      b_s: { name: 'Bytes per second (B/s)', factor: 8 },
      kb_s: { name: 'Kilobytes per second (KB/s)', factor: 8000 },
      mb_s: { name: 'Megabytes per second (MB/s)', factor: 8e6 },
      gb_s: { name: 'Gigabytes per second (GB/s)', factor: 8e9 }
    }
  }
};

/**
 * Universal unit conversion function
 */
export function convertUnit(val, categoryKey, fromUnit, toUnit) {
  const cat = UNIT_CATEGORIES[categoryKey];
  if (!cat) return 0;
  if (fromUnit === toUnit) return val;

  if (cat.customConvert) {
    return cat.customConvert(val, fromUnit, toUnit);
  }

  const fromFactor = cat.units[fromUnit]?.factor ?? 1;
  const toFactor = cat.units[toUnit]?.factor ?? 1;

  // Convert to base unit then to target unit
  const inBase = val * fromFactor;
  return inBase / toFactor;
}
