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

  console.log(elements, vals)

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
          else {return `${val[n]}${val[n + 1]} is not an element1`};
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
        else {return `${val[n]} is not an element2`;};
          }
        
    }              
  }

  let errors = []
  console.log("1")
  for (let i = 1; i < 7; i++) {
    let tempval = "val" + i;
    let e = listelements(vals[tempval], checkNumber(i));
    if (e) {
        document.getElementById("resultaat").innerText = e;
        break;
    }
    e = listelements(vals[tempval], tempval);
    if (e) {
        document.getElementById("resultaat").innerText = e;
        break;
    }
  }
  document.getElementById("resultaat").innerText = JSON.stringify(elements);
  console.log(elements)
  n = 0
  const keysE = Object.keys(elements.entry)
  const keysO = Object.keys(elements.output)


  
  if (keysE.length !== keysO.length) {
    document.getElementById("resultaat").innerText = "there are elements on one side and not on the other side";

  }
  console.log(keysE)
  for (let i = 0; i - 1 < keysE.length; i++) {
    let e = checkEntry(keysE[i]);
    if (e) {
      document.getElementById("resultaat").innerText = e; break;
    }
  }

  document.getElementById("resultaat").innerText = JSON.stringify(elements);

  function checkEntry (key) {
    console.log("checkEntry key:", key);
    console.log("elements:", elements);
    let n = 1;
    let val = undefined;
    let notWork = 1;
  
    const left = elements.entry[key] || 0;
    const right = elements.output[key] || 0;
    let dif = left - right;
    
    if (dif === 0) {
      return
    }
    if (dif > 0) {        
      while (notWork < 10) {
        for (let i = 0; i < 3; i++) {
          val = "val" + (n + 3);
          if (!elements[val]) {continue};
          if (key in elements[val]) {
            if (left / (elements.output[key] * notWork) % 1 == 0) {
              elements[val][key + "amount"] = left / (elements[val][key] * notWork);
              let valKeys = Object.keys(elements[val])
              valKeys = valKeys.filter(k => k !== key)
              elements.output[key] = elements.output[key] * elements[val][key + "amount"]
              return;
            }
            else {n++; continue;}
          }      
        }  
        n = 1;
        notWork++;
      }
    } 
    else { console.log(elements, dif)
      while (notWork < 10) {
        for (let i = 0; i < 3; i++) {
          val = "val" + n;

          if (key in elements[val]) {
            if (right / (elements[val][key] * notWork) % 1 == 0) {
              elements[val][key + "amoumt"] = right / (elements[val][key] * notWork);
              let valKeys = Object.keys(elements[val])
              valKeys = valKeys.filter(k => k !== key)
              elements.output[key] = elements.output[key] * elements[val][key + "amount"] 
              return;
            }
            else {n++; continue;}
          }      
        }  
        n = 1;
        notWork++;
      }
      return "Not possible"
    }
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

