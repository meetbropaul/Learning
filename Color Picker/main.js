const selectColor = document.getElementById('selectColor');
const userInputColor = document.getElementById('userInputColor');
const slider = document.getElementById('slider');
const lighten = document.getElementById('lighten');
const toggleButton = document.getElementById('toggleButton');
const darken = document.getElementById('darken');
const sliderValue = document.getElementById('sliderValue');
const inputColor = document.getElementById('inputColor');
const alteredColor = document.getElementById('alteredColor');
const inputColorName = document.getElementById('inputColorName');
const alteredColorName = document.getElementById('alteredColorName');
const btnCopy = document.getElementById('btnCopy');
const inputColorLabel = document.getElementById('inputColorLabel');
const alteredColorLabel = document.getElementById('alteredColorLabel');

function updateUserInput() {
  userInputColor.value = selectColor.value;
  inputColor.style.backgroundColor = selectColor.value;
  let mycolor = toHSL(userInputColor.value);
  inputColorName.innerHTML = mycolor;
  inputColorLabel.innerHTML =
    mycolor + ' ' + toRGB(mycolor) + ' ' + toHex(mycolor);
  inputColorLabel.style.color = mycolor;
  alteredColorName.innerHTML = '';
  alteredColor.style.backgroundColor = '';
  alteredColorLabel.innerHTML = '';
  alteredColorLabel.style.color = '';
}

function updateSelectColor() {
  selectColor.value = userInputColor.value;
  inputColor.style.backgroundColor = userInputColor.value;
  // inputColorName.innerHTML = toHSL(userInputColor.value);
  let mycolor = toHSL(userInputColor.value);
  inputColorName.innerHTML = mycolor;
  inputColorLabel.innerHTML =
    mycolor + ' ' + toRGB(mycolor) + ' ' + toHex(mycolor);
  inputColorLabel.style.color = mycolor;
  alteredColorName.innerHTML = '';
  alteredColor.style.backgroundColor = '';
  alteredColorLabel.innerHTML = '';
  alteredColorLabel.style.color = '';
}

function updateSliderValue() {
  let startColor = alteredColorName.innerHTML;
  startColor = startColor ? startColor : inputColorName.innerHTML;
  if (startColor) {
    const c = startColor.match(/[0-9]+/g);
    slider.value = toggleButton.checked ? c[1] : c[2];
    sliderValue.innerHTML = slider.value;
  }
}

function clearUserInput() {
  userInputColor.value = '';
  selectColor.value = '#ffffff';
  inputColor.style.backgroundColor = '#ffffff';
  alteredColor.style.backgroundColor = '#ffffff';
  inputColorName.innerHTML = '';
  inputColorLabel.innerHTML = '';
  alteredColorName.innerHTML = '';
  alteredColorLabel.innerHTML = '';
  btnCopy.innerHTML = inputColorName.innerHTML ? 'Copy' : 'Select';
}

function toHSL(hex) {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);

  var r = parseInt(result[1], 16);
  var g = parseInt(result[2], 16);
  var b = parseInt(result[3], 16);

  (r /= 255), (g /= 255), (b /= 255);
  var max = Math.max(r, g, b),
    min = Math.min(r, g, b);
  var h,
    s,
    l = (max + min) / 2;

  if (max == min) {
    h = s = 0; // achromatic
  } else {
    var d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }

  s = s * 100;
  s = Math.round(s);
  l = l * 100;
  l = Math.round(l);
  h = Math.round(360 * h);

  var colorInHSL = 'hsl(' + h + ', ' + s + '%, ' + l + '%)';

  return colorInHSL;
}

function modifyHSL(hsl) {
  const c = hsl.match(/[0-9]+/g);
  h = c[0];
  s = c[1];
  l = c[2];

  if (toggleButton.checked) {
    s = slider.value;
  } else {
    l = slider.value;
  }

  var colorInHSL = 'hsl(' + h + ', ' + s + '%, ' + l + '%)';

  return colorInHSL;
}

function show() {
  // update slider value
  sliderValue.innerHTML = slider.value;

  var hsl, startColor;

  startColor = alteredColorName.innerHTML;
  if (startColor) {
    hsl = modifyHSL(startColor);
  } else {
    hsl = modifyHSL(inputColorName.innerHTML);
  }

  alteredColor.style.backgroundColor = hsl;
  alteredColorName.innerHTML = hsl;
  alteredColorLabel.innerHTML = hsl + ' ' + toRGB(hsl) + ' ' + toHex(hsl);
  alteredColorLabel.style.color = hsl;
}

function btnUpdate() {
  btnCopy.innerHTML = inputColorName.innerHTML ? 'Copy' : 'Select';
}

function toRGB(hsl) {
  // Extracting the h,s,l from the hsl(h,s,l) string

  const cy = hsl.match(/[0-9]+/g);
  h = cy[0];
  s = cy[1];
  l = cy[2];

  // Must be fractions of 1
  s /= 100;
  l /= 100;

  let c = (1 - Math.abs(2 * l - 1)) * s,
    x = c * (1 - Math.abs(((h / 60) % 2) - 1)),
    m = l - c / 2,
    r = 0,
    g = 0,
    b = 0;

  if (0 <= h && h < 60) {
    r = c;
    g = x;
    b = 0;
  } else if (60 <= h && h < 120) {
    r = x;
    g = c;
    b = 0;
  } else if (120 <= h && h < 180) {
    r = 0;
    g = c;
    b = x;
  } else if (180 <= h && h < 240) {
    r = 0;
    g = x;
    b = c;
  } else if (240 <= h && h < 300) {
    r = x;
    g = 0;
    b = c;
  } else if (300 <= h && h < 360) {
    r = c;
    g = 0;
    b = x;
  }
  r = Math.round((r + m) * 255);
  g = Math.round((g + m) * 255);
  b = Math.round((b + m) * 255);

  return 'rgb(' + r + ', ' + g + ', ' + b + ')';
}

function toHex(hsl) {
  // Extracting the h,s,l from the hsl(h,s,l) string

  const cy = hsl.match(/[0-9]+/g);
  h = cy[0];
  s = cy[1];
  l = cy[2];

  // Must be fractions of 1

  s /= 100;
  l /= 100;

  let c = (1 - Math.abs(2 * l - 1)) * s,
    x = c * (1 - Math.abs(((h / 60) % 2) - 1)),
    m = l - c / 2,
    r = 0,
    g = 0,
    b = 0;

  if (0 <= h && h < 60) {
    r = c;
    g = x;
    b = 0;
  } else if (60 <= h && h < 120) {
    r = x;
    g = c;
    b = 0;
  } else if (120 <= h && h < 180) {
    r = 0;
    g = c;
    b = x;
  } else if (180 <= h && h < 240) {
    r = 0;
    g = x;
    b = c;
  } else if (240 <= h && h < 300) {
    r = x;
    g = 0;
    b = c;
  } else if (300 <= h && h < 360) {
    r = c;
    g = 0;
    b = x;
  }
  // Having obtained RGB, convert channels to hex
  r = Math.round((r + m) * 255).toString(16);
  g = Math.round((g + m) * 255).toString(16);
  b = Math.round((b + m) * 255).toString(16);

  // Prepend 0s, if necessary
  if (r.length == 1) r = '0' + r;
  if (g.length == 1) g = '0' + g;
  if (b.length == 1) b = '0' + b;

  return 'hex(#' + r + g + b + ')';
}
