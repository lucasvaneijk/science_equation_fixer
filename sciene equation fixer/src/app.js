console.log("works");
const elementsList = ["H", "He", "Li", "Be", "B", "C", "N", "O", "F", "Ne", "Na", "Mg", "Al", "Si", "P", "S", "Cl", "Ar", "K", "Ca", "Sc", "Ti", "V", "Cr", "Mn", "Fe", "Co", "Ni", "Cu", "Zn", "Ga", "Ge", "As", "Se", "Br", "Kr", "Rb", "Sr", "Y", "Zr", "Nb", "Mo", "Tc", "Ru", "Rh", "Pd", "Ag", "Cd", "In", "Sn", "Sb", "Te", "I", "Xe", "Cs", "Ba", "La", "Ce", "Pr", "Nd", "Pm", "Sm", "Eu", "Gd", "Tb", "Dy", "Ho", "Er", "Tm", "Yb", "Lu", "Hf", "Ta", "W", "Re", "Os", "Ir", "Pt", "Au", "Hg", "Pb", "Bi", "Po", "At", "Rn", "Fr", "Ra", "Ac", "Th", "Pa", "U", "Np", "Pu", "Am", "Cm", "Bk", "Cf", "Es", "Fm", "Md", "No", "Lr", "Rf", "Db", "Sg", "Bh", "Hs", "Mt", "Ds", "Rg", "Cn", "Nh", "Fl", "Mc", "Lv", "Ts", "Og"]
const elementsListOneCaracter = ["H", "B", "C", "N", "O", "F", "P", "S", "K", "V", "Y", "I", "U", "W"]
document.getElementById("send").addEventListener("click", () => {

  let elements = {}
  const vals = {
    val1: document.getElementById("inputOne").value,
    val2: document.getElementById("inputTwo").value,
    val3: document.getElementById("inputThree").value,

    val4: document.getElementById("outputOne").value,
    val5: document.getElementById("outputTwo").value,
    val6: document.getElementById("outputThree").value,
  }



  function listelements (val, state) {
    let n = 0;
    if (!elements[state]) {
      elements[state] = {};
    };
  
    while (n < val.length) {
      if (val[n] + val[n + 1] in elements[state]) {
        if (isDigit(val[n + 2])) {
          if (isDigit(val[n + 3])) {
            elements[state][val[n] + val[n + 1]] += Number(`${val[n + 2]}${val[n + 3]}`);
              n += 4; continue;
            }
            elements[state][val[n] + val[n + 1]] += Number(val[n + 2]);
            n += 3; continue;
          }
          elements[state][val[n] + val[n + 1]] += 1;
          n += 2; continue;
        }
      if (val[n] in elements[state]) {
        if (isDigit(val[n + 1])) {
          if (isDigit(val[n + 2])) {
            elements[state][val[n]] += Number(`${val[n + 1]}${val[n + 2]}`);
            n += 3; continue;
          }
          elements[state][val[n]] += Number(val[n + 1]);
          n += 2; continue;
        }
        elements[state][val[n]] += 1;
        n += 1; continue;
      }
      else {
        if (isLowerCase(val[n + 1])) {        
          if (elementsList.includes(val[n] + val[n + 1])) {                
            if (isDigit(val[n + 2])) {
              if (isDigit(val[n + 3])) {            
                elements[state][val[n] + val[n + 1]] = Number(`${val[n + 2]}${val[n + 3]}`);
                n += 4; continue;
              }
              elements[state][val[n] + val[n + 1]] = Number(val[n + 2]);
              n += 3; continue;          
            }
        else {
          elements[state][val[n] + val[n + 1]] = 1;
          n += 2; continue;
        }    
          } 
          else {return `${val[n]}${val[n + 1]} is not an element`, NaN};
        };
    
        if (elementsListOneCaracter.includes(val[n])) {   
          if (isDigit(val[n + 1])) {
            if (isDigit(val[n + 2])) {
              elements[state][val[n]] = Number(`${val[n + 1]}${val[n + 2]}`);
              n += 3; continue;
            }
            elements[state][val[n]] = Number(val[n + 1]);
            n += 2; continue;
          }
          else {elements[state][val[n]] = 1; n += 1; continue;}          
        }
        else {return `${val[n]} is not an element`, NaN};
          }
        
    }              
    return elements[state]
  }

  let molecules = [];
  let leftcount = 0;
  for (let i = 1; i < 7; i++) {
    let tempval = "val" + i;
    if (vals[tempval] !== "") {
      if (i <= 3) {leftcount++;}
      molecules.push(listelements(vals[tempval], tempval));
    }
  }

  let element = getAllElements(molecules)
  console.log(element, molecules)
  let matrix = buildMatrix(molecules, leftcount)
  matrix = gaussianElimination(matrix)
  console.log(matrix)
  let result = solve(matrix)
  console.log("result: " , result)
  console.log(result.includes(NaN))
  if (result.includes(NaN) || result.includes(0)) {
    document.getElementById("resultaat").innerText = "deze vergelijking werkt niet!"
  }
  else {
    result = scaleToIntegers(result)
    console.log("result: " + result)
  }
  if (result.includes(NaN) || result.includes(0)) {
    document.getElementById("resultaat").innerText = "deze vergelijking werkt niet!"
  }
  else {
    document.getElementById("resultaat").innerText = formatResults(result, vals)
    console.log(formatResults(result, vals)) 
  }
  
  function getAllElements(molecules) {
    let set = new Set();

    for (let mol of molecules) {
      for (let el in mol) {
        set.add(el);
      }
    }

    return [...set];
  }

  function buildMatrix(molecules, leftCount) {
    const elements_2 = getAllElements(molecules);
    let matrix = [];

    for (let el of elements_2) {
      let row = [];

      for (let i = 0; i < molecules.length; i++) {
        let value = molecules[i][el] || 0;

        if (i >= leftCount) value *= -1;

        row.push(value);
      }

      matrix.push(row);
    }

    return matrix;
  }

});

function isCapital (str) {
  return typeof str === 'string' && str === str.toUpperCase() && str !== str.toLowerCase();
};

function isLowerCase (str) {
  return typeof str === 'string' && str === str.toLowerCase() && str !== str.toUpperCase();
};

function isDigit (char) {
  return /^\d$/.test(char)
};

function checkNumber (i, state) {
  if (state) {
    let out = i < 4 ? "entry" + i : "output" + (i - 3);
    return out
  }
  else {let out = i < 4 ? "entry" : "output"; return out}
}

function gaussianElimination(matrix) {
  let m = matrix.length;
  let n = matrix[0].length;

  for (let i = 0; i < m; i++) {

    let pivot = matrix[i][i];
    if (pivot === 0) { 
      for (let k = i + 1; k < m; k++) {
        if (matrix[k][i] !== 0) {
          [matrix[i], matrix[k]] = [matrix[k], matrix[i]];
          pivot = matrix[i][i];
          break;
       }
      }
    };
    for (let j = i; j < n; j++) {
      matrix[i][j] /= pivot;
    }

    for (let k = i + 1; k < m; k++) {
      let factor = matrix[k][i];

      for (let j = i; j < n; j++) {
        matrix[k][j] -= factor * matrix[i][j];
      }
    }
  }

  return matrix;
}

function solve(matrix) {
  let rows = matrix.length;
  let cols = matrix[0].length;

  let result = new Array(cols).fill(0);

  result[cols - 1] = 1;

  for (let i = rows - 1; i >= 0; i--) {
    let sum = 0;

    for (let j = i + 1; j < cols; j++) {
      sum += matrix[i][j] * result[j];
    }


    if (matrix[i][i] === 0) {
      result[i] = 1;
    } else {
      result[i] = -sum / matrix[i][i];
    }

  }

  return result;
}
function scaleToIntegers(arr) {
  let factor = 1;
  console.log("scaleToIntegers")
  while (!arr.every(x => Number.isInteger(Number((x * factor).toFixed(6))))) {
    factor++;
  }

  return arr.map(x => Number((x * factor).toFixed(6)));
}
function formatResults(thing, vals) {
  let result = "";
  let amount = 0;
  for (let i = 1; i < 7; i++) {
    if (vals["val" + i] !== "") {
      result = result + thing[amount] + vals["val" + i]
      amount++
      if (i !== 3 && i !== 6 && vals["val" + (i + 1)] !== "") {
        result = result +  " + "
      }
    }
    if (i === 3) {
      result = result + " -> "
    }
  }

  return result;
}