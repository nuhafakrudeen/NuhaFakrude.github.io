//student name: Nuha Fakrudeen
//student email: nfakrude@ucsc.edu
//notes to grader: n/a

let canvas, ctx;
function main(){
    //Retreieve <canvas> element
    canvas = document.getElementById('example');
    if(!canvas){
        console.log('Failed to retrieve the <canvas> element');
        return;
    }

    //Get the rendering context for 2DCG
    ctx = canvas.getContext('2d');
    if(!ctx){
        console.log('Failed to retrieve rednering context for canvas');
        return;
    }

    //black background
    ctx.fillStyle = 'black'; //set black color
    ctx.fillRect(0,0,400,400); //fill a rectangle with the color

    //draw vector button
    const drawButton = document.getElementById('draw-button');
    drawButton.addEventListener('click', handleDrawEvent);
    
    //operation button
    const operationButton = document.getElementById('operation-button');
    operationButton.addEventListener('click', handleDrawOperationEvent)
}

function drawVector(v,color){
    //set origin to center
    var originX = 400/2;
    var originY = 400/2;

    //scale for visualization
    var scaledX = v.elements[0] * 20;
    var scaledY = v.elements[1] * 20;

    //draw
    ctx.beginPath();
    ctx.moveTo(originX, originY);
    ctx.lineTo(originX + scaledX, originY - scaledY);
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.stroke();
}

function handleDrawEvent(){
    //clear canvas
    ctx.fillStyle = 'black';
    ctx.fillRect(0,0,400,400);

    //read values from user input
    const x = parseFloat(document.getElementById('x-coordinate').value);
    const y = parseFloat(document.getElementById('y-coordinate').value);

    const x1 = parseFloat(document.getElementById('x-coordinate2').value);
    const y1 = parseFloat(document.getElementById('y-coordinate2').value);

    //create vector
    const v1 = new Vector3([x,y,0]);
    const v2 = new Vector3([x1,y1,0]);

    //draw vector
    drawVector(v1, 'red');
    drawVector(v2, 'blue');
}

function handleDrawOperationEvent(){
    //clear canvas
    ctx.fillStyle = 'black';
    ctx.fillRect(0,0,400,400);

    //read values from user input
    const x = parseFloat(document.getElementById('x-coordinate').value);
    const y = parseFloat(document.getElementById('y-coordinate').value);

    const x1 = parseFloat(document.getElementById('x-coordinate2').value);
    const y1 = parseFloat(document.getElementById('y-coordinate2').value);

    //create vector
    const v1 = new Vector3([x,y,0]);
    const v2 = new Vector3([x1,y1,0]);

    //draw vector
    drawVector(v1, 'red');
    drawVector(v2, 'blue');

    // get selected operation and scalar
    const operation = document.getElementById('operation').value;
    const scalar = parseFloat(document.getElementById('scalar').value);

    //initialize vectors
    let v3, v4;

    // perform selected operation
    if (operation === 'add') {
        v3 = v1.add(v2); // v3 = v1 + v2
        drawVector(v3, 'green');
    } else if (operation === 'sub') {
        v3 = v1.sub(v2); // v3 = v1 - v2
        drawVector(v3, 'green');
    } else if (operation === 'mul') {
        v3 = v1.mul(scalar); // v3 = v1 * scalar
        v4 = v2.mul(scalar); // v4 = v2 * scalar
        drawVector(v3, 'green');
        drawVector(v4, 'green');
    } else if (operation === 'div') {
        v3 = v1.div(scalar); // v3 = v1 / scalar
        v4 = v2.div(scalar); // v4 = v2 / scalar
        drawVector(v3, 'green');
        drawVector(v4, 'green');
    }else if (operation === 'mag') {
        const mag1 = v1.magnitude();
        const mag2 = v2.magnitude();
        console.log(`Magnitude v1: ${mag1}`);
        console.log(`Magnitude v2: ${mag2}`);
    } else if (operation === 'norm') {
        const norm1 = v1.normalize();
        const norm2 = v2.normalize();
        drawVector(norm1, 'green');
        drawVector(norm2, 'green');
    } else if (operation === 'angleBetween') {
        const angle = angleBetween(v1, v2);
    } else if (operation === 'area') {
        const area = areaTriangle(v1, v2);
    }
}

function angleBetween(v1, v2) {
    // calc dot product
    const dotProduct = Vector3.dot(v1, v2);

    // get magnitudes
    const mag1 = v1.magnitude();
    const mag2 = v2.magnitude();

    // calc cosine
    const cosTheta = dotProduct / (mag1 * mag2);

    //ensure range
    const angleRad = Math.acos(Math.max(-1, Math.min(1, cosTheta))); 

    // convert to degrees
    const angleDeg = angleRad * (180 / Math.PI);

    // log in console
    console.log(`Angle: ${angleDeg}`);

    return angleDeg;
}

function areaTriangle(v1, v2) {
    // calc cross product
    const crossProd = Vector3.cross(v1, v2);

    // get magnitude of cross product vector
    const magni = crossProd.magnitude();

    // Area of triangle
    const areaOfTriangle = magni / 2;

    // log in console
    console.log(`Area: ${areaOfTriangle}`);

    return areaOfTriangle;
}

