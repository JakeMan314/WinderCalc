  // Document Setup and Event Listeners
  document.addEventListener('DOMContentLoaded', function() {
    const widthInput = document.getElementById('widthInput');
    const heightInput = document.getElementById('heightInput');
    widthInput.addEventListener('keypress', function(event) {
      if (event.key === 'Enter') {
        event.preventDefault();
        calculate();
      }
    });
    heightInput.addEventListener('keypress', function(event) {
      if (event.key === 'Enter') {
        event.preventDefault();
        calculate();
      }
    });
  });


  async function fetchConfig() {
    try {
      const response = await fetch('config.json');
      const data = await response.json();

      version = data.setup.version;
      const versionElement = document.getElementById('version');
      versionElement.innerHTML = version;
 
      return data;
    } catch (error) {
      console.error('Error Fetching Config:', error);
      throw error; // Re-throw the error to handle it outside this function if needed
    }
  }

  async function loadSetup() {
    try {
      let jsonData = await fetchConfig();
      anglecalc(jsonData)
      updatePastInchOptions(jsonData);
      return jsonData;

      
    } catch (error) {
      // Handle any errors that occurred during fetching or processing
      console.error('Async Fetch Error:', error);
    }
  }
  clearing();
  loadSetup(); //called on page load to setup the initial values

  // Async Setup Functions needed
  // fetchConfig
  // calculate
  // winderSetup Needs: anglecalc, updatepastinchoptions, calculate
  // nosingsetup Needs: updatepastinchoptions, calculate

  async function winderSetup() {
    try {
      let jsonData = await fetchConfig();
      anglecalc(jsonData)
      updatePastInchOptions(jsonData);
      calculate(jsonData);
      return jsonData;
    } catch (error) {
      // Handle any errors that occurred during fetching or processing
      console.error('Async Fetch Error:', error);
    }
  }

  async function nosingSetup() {
    try {
      let jsonData = await fetchConfig();
        //update the pastinch options and run the calculate function | this is for the nosing checkbox
        updatePastInchOptions(jsonData);
        calculate(jsonData);
  return jsonData;
    } catch (error) {
      // Handle any errors that occurred during fetching or processing
      console.error('Fetch Error:', error);
    }
  }

  function updatePastInchOptions(jsonData) {
  const winderType = document.getElementById("winderType").value;
  const pastInchSelect = document.getElementById("pastInch");
  //THIS IS SHITTY CODE WOW, im basically just catching errors here
  let pastInchOptions;
  try {
    const nosing = document.getElementById('nosingCheckbox').checked;
    if (nosing) {
      pastInchOptions = jsonData.winders[winderType].nosingangles?.pastinch;
    } else {
      pastInchOptions = jsonData.winders[winderType].angles?.pastinch;
    }
  }
  catch(err) {
    console.log("ERROR", err.message);
    anglecalc(jsonData);
    return;
  }
  pastInchSelect.innerHTML = '';
  if (pastInchOptions === undefined) {
    console.warn(`No pastInch options found for winderType: ${winderType}`);
    const defaultOption = document.createElement("option");
    defaultOption.value = 0;
    defaultOption.textContent = "No Options Available";
    pastInchSelect.appendChild(defaultOption);
    anglecalc(jsonData);
    return;
  }
  const defaultOption = document.createElement("option");
  defaultOption.value = "2";
  defaultOption.textContent = "2\"";
  pastInchSelect.appendChild(defaultOption);
  anglecalc(jsonData);
  Object.keys(pastInchOptions).forEach(option => {
    const optionElement = document.createElement("option");
    optionElement.value = option;
    optionElement.textContent = option + "\"";
    pastInchSelect.appendChild(optionElement);

});
}

  function anglecalc(jsonData) {  
  const inchfind = document.getElementById('pastInch').value;
  const winderType = document.getElementById('winderType').value;
  const nosing = document.getElementById('nosingCheckbox').checked;
  if (nosing) {
    if (inchfind == 0 || inchfind == 2) {
      var AngleObject = {
      "a": jsonData.winders[winderType].nosingangles.a,
      "b": jsonData.winders[winderType].nosingangles.b
  };
  }
  else {
    var AngleObject = {
      "a": jsonData.winders[winderType].nosingangles.pastinch[inchfind].a,
      "b": jsonData.winders[winderType].nosingangles.pastinch[inchfind].b
  };
  }
}
else {
  if (inchfind == 0 || inchfind == 2) {
    var AngleObject = {
    "a": jsonData.winders[winderType].angles.a,
    "b": jsonData.winders[winderType].angles.b
};
}
else {
  var AngleObject = {
    "a": jsonData.winders[winderType].angles.pastinch[inchfind].a,
    "b": jsonData.winders[winderType].angles.pastinch[inchfind].b
};
}
}

 // Display angles in the div with id 'angles'
 document.getElementById('angles').innerHTML = `A: ${AngleObject.a}&deg;<br>B: ${AngleObject.b}&deg;`;
return AngleObject;
}

  function toggleDirection(direction) {
    const leftButton = document.getElementById('leftButton');
    const rightButton = document.getElementById('rightButton');

    if (direction === 'left') {
      leftButton.classList.add('active');
      rightButton.classList.remove('active');
    } else if (direction === 'right') {
      rightButton.classList.add('active');
      leftButton.classList.remove('active');
    }
  }

  function toggleAdvancedMenu() {
    var advancedMenu = document.getElementById("advancedMenu");
    var toggleButton = document.getElementById("toggleAdvancedMenu");
    if (advancedMenu.style.display === "block") {
      advancedMenu.style.display = "none";
      toggleButton.classList.remove("active");
    } else {
      advancedMenu.style.display = "block";
      toggleButton.classList.add("active");
    }
  }

  function clearing() {
    //Clear all inputs
    //input clearing
    const textInputs = document.querySelectorAll('input[type="text"]');
    textInputs.forEach(function(input) {
      input.value = '';
    });
    //fraction clearing
    const widthFraction = document.getElementById('widthFraction');
    widthFraction.selectedIndex = 0;
    const heightFraction = document.getElementById('heightFraction');
    heightFraction.selectedIndex = 0;
    //nosing clearing
    const nosing = document.getElementById('nosingCheckbox');
    nosing.checked = false;
    //checkbox clearing
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach(function(checkbox) {
      checkbox.checked = false;
    });
    //result clearing 
    const resultElement = document.getElementById('result');
    resultElement.innerHTML = '';
  }

  function overshoot() {
    // add code here to calculate overshoot
    // if s3 > width, then s3 -= width
    // then s3 * tan(a) = sx (double check this, is it actually that angle?
    // its overshot if greater than width, then it adds sx/s2 to boards
  }

  function stickover(angle, board) {
    //this function uses the angle and boards to calculate the exact mark of the edge of the board, from here i can add sticks to the s1 and s3
    const over = board / Math.cos(angle * (Math.PI / 180));
    const half = over / 2;
    console.log("Over:", over);
    return over;
  }

  function checkbox(width, hypotenuse2, hypotenuse3, stepsq, checkboxes, stick) {
    if (checkboxes.NS) {
      width -= stick; 
      hypotenuse2 -= 3;
      hypotenuse3 -= 3;
      stepsq -= stick;
    }
    if (checkboxes.NSL) {
      width -= stick; 
    }
    if (checkboxes.NSR) {
      width -= stick;
      hypotenuse2 -= 3; 
    }
    if (checkboxes.NSB) {
      hypotenuse3 -= 3; 
      stepsq -= stick;
    }   
    return {
      width: width,
      hypotenuse2: hypotenuse2,
      hypotenuse3: hypotenuse3,
      stepsq: stepsq
    };
  }

  async function calculate() {
    try {
      let jsonData = await fetchConfig();
      //variable setup
    const winderType = document.getElementById('winderType').value;
    let width = parseFloat(document.getElementById('widthInput').value);
    let height = parseFloat(document.getElementById('heightInput').value);
    const widthFraction = document.getElementById('widthFraction').value;
    const heightFraction = document.getElementById('heightFraction').value;
    const nosing = document.getElementById('nosingCheckbox').checked;
    const NS = document.getElementById('NS');
    const NSL = document.getElementById('NSL');
    const NSR = document.getElementById('NSR');
    const NSB = document.getElementById('NSB');
    const AngleObject = anglecalc(jsonData);
    if (widthFraction !== "") {
      width += eval(widthFraction);
    }
    if (heightFraction !== "") {
      height += eval(heightFraction);
    }

    //new json setup for arguments all in one object
    var JsonObject = {
      "width": width,
      "height": height,
      "winderType": winderType,
      "checkboxes": {
        "NS": NS.checked,
        "NSL": NSL.checked,
        "NSR": NSR.checked,
        "NSB": NSB.checked,
      },
      "nosing": nosing,
      "nosingwidth": jsonData.setup.nosingwidth,
      "stick": jsonData.setup.stick,
      "hangar": jsonData.setup.hangar,
      "board": jsonData.setup.board,
      "angles": AngleObject,
      "shifts": jsonData.winders[winderType].shifts
  };
    console.log("Final Object:", JsonObject);
   
    switch(winderType) {
      case '2StepHanger':
      calculate2StepHanger(JsonObject);
      break;
      case '3StepHanger':
      calculate3StepHanger(JsonObject);
      break;
      case '2StepDOT':
      calculate2StepDOT(JsonObject);
      break;
      case '3StepDOT':
      calculate3StepDOT(JsonObject);
      break;
      case '2Step3_5Post':
      calculate2Step3_5Post(JsonObject);
      break;
      case '3Step3_5Post':
      calculate3Step3_5Post(JsonObject);
      break;
      case '2Step5_5Post':
      calculate2Step5_5Post(JsonObject);
      break;
      case '3Step5_5Post':
      calculate3Step5_5Post(JsonObject);
      break;
      case '2StepWrap':
      calculate2StepWrap(JsonObject);
      break;
      case '3StepWrap':
      calculate3StepWrap(JsonObject);
      break;
      default:
      console.error(`Unsupported winder type: ${winderType}`);
    }
    
    } catch (error) {
      // Handle any errors that occurred during fetching or processing
      console.error('Fetch Error:', error);
    }
    
  }

  function calculate2StepHanger(JsonObject) {
    // Core Math Calculations
    size[0] -= 0.5;
    const s1 = size[0] * Math.tan(angles[0] * (Math.PI / 180));
    const s3 = size[1] * Math.tan(angles[0] * (Math.PI / 180));
    const w2 = Math.sqrt(Math.pow(size[0], 2) + Math.pow(s1, 2));

    if (s3 > size[0]) {
      console.log('s3 is greater than size[0]');
      s3 -= size[0]
      const sx = s3 * Math.tan(angles[0] * (Math.PI / 180));

    }
    
    
    //New Shift Arithmatic
    //everything is added Var + Shift (with possible negative shift)
    width = size[0] + (options[2] * 2) + options[3];
    step1 = s1 + shifts.s1;
    hypotenuse2 = w2 + shifts.h2;
    step2 = null;
    stepx = null;
    hypotenuse3 = null;
    step3 = s3 + shifts.s3;
    stepsq = size[1] + shifts.sq;
    
    
    // Checkbox Arithmetic
    if (NS.checked) {
      width -= 6.5; 
      hypotenuse2 -= 3;
    }
    if (NSL.checked) {
      width -= 3.25; 
    }
    if (NSR.checked) {
      width -= 3.25;
      hypotenuse2 -= 3; 
    }
    if (NSB.checked) {
      hypotenuse2 -= 3; 
    }
    createResult(width, step1, hypotenuse2, step2, stepx, hypotenuse3, step3, stepsq);
  }
  
  function calculate3StepHanger(JsonObject) {
    
    // Core Math Calculations
    JsonObject.width -= JsonObject.hangar;
    const s1 = JsonObject.width * Math.tan(JsonObject.angles.a * (Math.PI / 180));
    const s3 = JsonObject.height * Math.tan(JsonObject.angles.b * (Math.PI / 180)); 
    const s2 = JsonObject.height - s1;
    const sx = JsonObject.width - s3;
    const w2 = Math.sqrt(Math.pow(JsonObject.width, 2) + Math.pow(s1, 2));
    const w3 = Math.sqrt(Math.pow(JsonObject.height, 2) + Math.pow(s3, 2));
    const sticka = stickover(JsonObject.angles.a, JsonObject.board);
    const stickb = stickover(JsonObject.angles.b, JsonObject.board);
    
    // Shift Arithmetic
    width = JsonObject.width + (JsonObject.stick * 2) + JsonObject.hangar;
    step1 = s1 - JsonObject.board + sticka + JsonObject.shifts.s1;
    hypotenuse2 = w2 + JsonObject.shifts.h2;
    step2 = s2 - JsonObject.shifts.s2;
    stepx = sx + stickb + JsonObject.shifts.sx;
    hypotenuse3 = w3 + JsonObject.shifts.h3;
    step3 = s3 - stickb + JsonObject.shifts.s3;
    let stepsq; //needed so checkbox doesnt act on it
    stick = (JsonObject.stick * 2);

    //checkbox function
    ({ width, hypotenuse2, hypotenuse3 } = checkbox(width, hypotenuse2, hypotenuse3, stepsq, JsonObject.checkboxes, JsonObject.stick));

    createResult(width, step1, hypotenuse2, step2, stepx, hypotenuse3, step3);
  }

  function calculate2StepDOT(JsonObject) {
    // Core Math Calculations
    const s1 = size[0] * Math.tan(angles[0] * (Math.PI / 180));
    const s3 = size[1] * Math.tan(angles[1] * (Math.PI / 180));
    const w2 = Math.sqrt(Math.pow(size[0], 2) + Math.pow(s1, 2));
    
    //New Shift Arithmatic
    //everything is added Var + Shift (with possible negative shift)
    width = size[0] + shifts.width;
    step1 = s1 + shifts.s1;
    hypotenuse2 = w2 + shifts.h2;
    step2 = null;
    stepx = null;
    hypotenuse3 = null;
    step3 = s3 + shifts.s3;
    stepsq = size[1] + shifts.sq;
    
    
    // Checkbox Arithmetic
    if (NS.checked) {
      width -= 6.5; 
      hypotenuse2 -= 3;
    }
    if (NSL.checked) {
      width -= 3.25; 
    }
    if (NSR.checked) {
      width -= 3.25;
      hypotenuse2 -= 3; 
    }
    if (NSB.checked) {
      stepsq -= 3.25; 
    }
    createResult(width, step1, hypotenuse2, step2, stepx, hypotenuse3, step3, stepsq);
  }
  
  function calculate3StepDOT(JsonObject) {
    
    // Core Math Calculations
    // Inside Triangle Setup Calculations
    const offseta = Math.cos(JsonObject.angles.a * (Math.PI / 180)) * JsonObject.nosingwidth; //distance from nosing to top of board vert
    const offsetb = Math.cos(JsonObject.angles.a * (Math.PI / 180)) * JsonObject.nosingwidth; //distance from nosing to top of board vert
    const s1 = JsonObject.width * Math.tan(JsonObject.angles.a * (Math.PI / 180));
    const s3 = JsonObject.height * Math.tan(JsonObject.angles.b * (Math.PI / 180)); 
    const s2 = JsonObject.height - s1;
    const sx = JsonObject.width - s3;
    const w2 = Math.sqrt(Math.pow(JsonObject.width, 2) + Math.pow(s1, 2));
    const w3 = Math.sqrt(Math.pow(JsonObject.height, 2) + Math.pow(s3, 2));
    const sticka = stickover(JsonObject.angles.a, JsonObject.board);
    const stickb = stickover(JsonObject.angles.b, JsonObject.board);
    
    // Shift Arithmetic
    width = JsonObject.width + JsonObject.stick + JsonObject.shifts.post; //done
    step1 = s1  + offseta - JsonObject.board + sticka; + JsonObject.shifts.post + JsonObject.shifts.s1; //done
    hypotenuse2 = w2 + JsonObject.shifts.h2; //done?
    step2 = s2 - offsetb + JsonObject.shifts.post - JsonObject.shifts.s2; //done
    stepx = sx - JsonObject.board + stickb + JsonObject.shifts.sx; //done
    hypotenuse3 = w3 + JsonObject.shifts.h3; //done (but offset confusing me, need to check)
    step3 = s3 - stickb + JsonObject.shifts.post - JsonObject.board + JsonObject.shifts.s3; //done
    stepsq = JsonObject.height + JsonObject.shifts.post + JsonObject.stick - JsonObject.board; //done
    stick = JsonObject.stick;

    //checkbox function
    ({ width, hypotenuse2, hypotenuse3, stepsq } = checkbox(width, hypotenuse2, hypotenuse3, stepsq, JsonObject.checkboxes, stick));

    
    createResult(width, step1, hypotenuse2, step2, stepx, hypotenuse3, step3, stepsq);
  }
  
  function calculate3Step3_5Post(JsonObject) {
      
    // Core Math Calculations
    // Inside Triangle Setup Calculations
    const offseta = Math.cos(JsonObject.angles.a * (Math.PI / 180)) * JsonObject.nosingwidth; //distance from nosing to top of board vert
    const offsetb = Math.cos(JsonObject.angles.a * (Math.PI / 180)) * JsonObject.nosingwidth; //distance from nosing to top of board vert
    const s1 = JsonObject.width * Math.tan(JsonObject.angles.a * (Math.PI / 180));
    const s3 = JsonObject.height * Math.tan(JsonObject.angles.b * (Math.PI / 180)); 
    const s2 = JsonObject.height - s1;
    const sx = JsonObject.width - s3;
    const w2 = Math.sqrt(Math.pow(JsonObject.width, 2) + Math.pow(s1, 2));
    const w3 = Math.sqrt(Math.pow(JsonObject.height, 2) + Math.pow(s3, 2));
    const sticka = stickover(JsonObject.angles.a, JsonObject.board);
    const stickb = stickover(JsonObject.angles.b, JsonObject.board);

    // Shift Arithmetic
    width = JsonObject.width + JsonObject.stick + JsonObject.shifts.post; //done
    step1 = s1 + offseta - JsonObject.board + sticka + JsonObject.shifts.post + JsonObject.shifts.s1; //done
    hypotenuse2 = w2 + JsonObject.shifts.h2; //done?
    step2 = s2 - offsetb + JsonObject.shifts.post - JsonObject.shifts.s2; //done
    stepx = sx - JsonObject.board + stickb + JsonObject.shifts.sx; //done
    hypotenuse3 = w3 + JsonObject.shifts.h3; //done (but offset confusing me, need to check)
    step3 = s3 - stickb + JsonObject.shifts.post - JsonObject.board + JsonObject.shifts.s3; //done
    stepsq = JsonObject.height + JsonObject.shifts.post + JsonObject.stick - JsonObject.board; //done
    stick = JsonObject.stick;

    //checkbox function
    ({ width, hypotenuse2, hypotenuse3, stepsq } = checkbox(width, hypotenuse2, hypotenuse3, stepsq, JsonObject.checkboxes, stick));

    
    createResult(width, step1, hypotenuse2, step2, stepx, hypotenuse3, step3, stepsq);
  }
  
  function calculate3Step5_5Post(JsonObject) {
    
    const s1 = JsonObject.width * Math.tan(JsonObject.angles.a * (Math.PI / 180));
    const s3 = JsonObject.height * Math.tan(JsonObject.angles.b * (Math.PI / 180)); 
    const s2 = JsonObject.height - s1;
    const sx = JsonObject.width - s3;
    const w2 = Math.sqrt(Math.pow(JsonObject.width, 2) + Math.pow(s1, 2));
    const w3 = Math.sqrt(Math.pow(JsonObject.height, 2) + Math.pow(s3, 2));
    const sticka = stickover(JsonObject.angles.a, JsonObject.board);
    const stickb = stickover(JsonObject.angles.b, JsonObject.board);
    
    // Shift Arithmetic
    width = JsonObject.width + JsonObject.stick + JsonObject.shifts.post;
    step1 = s1 - JsonObject.board + sticka + JsonObject.shifts.s1;
    hypotenuse2 = w2 + JsonObject.shifts.h2;
    step2 = s2 - JsonObject.shifts.s2;
    stepx = sx + stickb + JsonObject.shifts.sx;
    hypotenuse3 = w3 + JsonObject.shifts.h3;
    step3 = s3 - stickb + JsonObject.shifts.s3 + JsonObject.shifts.post - JsonObject.board;
    stepsq = JsonObject.height + JsonObject.stick;
    stick = JsonObject.stick;

    //checkbox function
    ({ width, hypotenuse2, hypotenuse3, stepsq } = checkbox(width, hypotenuse2, hypotenuse3, stepsq, JsonObject.checkboxes, stick));

    createResult(width, step1, hypotenuse2, step2, stepx, hypotenuse3, step3, stepsq);
  }
  
  function calculate3StepWrap(JsonObject) {
    
    // Core Math Calculations
    const s1 = size[0] * Math.tan(angles[0] * (Math.PI / 180));
    const s3 = size[1] * Math.tan(angles[1] * (Math.PI / 180)); 
    const s2 = size[1] - s1;
    const sx = size[0] - s3;
    const w2 = Math.sqrt(Math.pow(size[0], 2) + Math.pow(s1, 2));
    const w3 = Math.sqrt(Math.pow(size[1], 2) + Math.pow(s3, 2));
    
    // Shift Arithmetic
    width = size[0] + shifts.width;
    step1 = s1 + shifts.s1;
    hypotenuse2 = w2 + shifts.h2;
    step2 = s2 + shifts.s2;
    stepx = sx + shifts.sx;
    hypotenuse3 = w3 + shifts.h3;
    step3 = s3 + shifts.s3;
    stepsq = size[1] + shifts.sq;
    
    
    // Checkbox Arithmetic
    if (NS.checked) {
      width -= 3.25; 
      hypotenuse2 -= 3;
      hypotenuse3 -= 3;
      stepsq -= 3.25;
    }
    if (NSL.checked) {
      width -= 3.25; 
    }
    if (NSR.checked) {
      width -= 3.25;
      hypotenuse2 -= 3; 
    }
    if (NSB.checked) {
      hypotenuse3 -= 3; 
      stepsq -= 3.25;
    }
    createResult(width, step1, hypotenuse2, step2, stepx, hypotenuse3, step3, stepsq);
  }
  
  function createResult(width, step1, hypotenuse2, step2, stepx, hypotenuse3, step3, stepsq) {
    const roundToQuarter = (value) => Math.round(value * 4) / 4; // Rounding to quarter inch
    // Function to convert decimal to fraction
    function toFraction(decimal) {
      const whole = Math.floor(decimal);
      const fraction = decimal - whole;
      if (fraction === 0) {
        return `${whole}`;
      }
      
      const tolerance = 1.0e-6;
      let h1 = 1;
      let h2 = 0;
      let k1 = 0;
      let k2 = 1;
      let b = fraction;
      
      // Continued fraction approximation
      do {
        const a = Math.floor(b);
        let aux = h1;
        h1 = a * h1 + h2;
        h2 = aux;
        aux = k1;
        k1 = a * k1 + k2;
        k2 = aux;
        b = 1 / (b - a);
      } while (Math.abs(fraction - h1 / k1) > fraction * tolerance);
      
      if (whole === 0) {
        return `<sup>${h1}</sup>&frasl;<sub>${k1}</sub>`;
      } else {
        return `${whole} <sup>${h1}</sup>&frasl;<sub>${k1}</sub>`;
      }
    }
    const winderType = document.getElementById('winderType').value;
   
    let resultobj = {
      width: width,
      s1: step1,
      h2: hypotenuse2,
      s2: step2,
      sx: stepx,
      h3: hypotenuse3,
      s3: step3,
      sq: stepsq
    };
    
    function displayResults(resultobj) {
      let result = '';
      
      for (let key in resultobj) {
        if (resultobj[key] !== undefined && resultobj[key] !== null && !isNaN(resultobj[key])
        ) {
          result += `<div class="result-item"><b>${key}:</b> ${toFraction(roundToQuarter(resultobj[key]))}</div><br>`;
        }
      }
      
      return result;
    }
    
    let result = displayResults({ width: width, s1: step1, h2: hypotenuse2, s2: step2, sx: stepx, h3: hypotenuse3, s3: step3, sq: stepsq});
    const resultElement = document.getElementById('result');
    resultElement.innerHTML = result;
    
    
    
  }
  
  
  
  