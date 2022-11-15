const angler = document.getElementById("angle");
const handler = document.getElementById("handler");
const direction = document.getElementById("direction");
const circle = document.getElementById("angleDraw");
const angleText = document.getElementById("angleText");
const shape = document.getElementById("shape");
const play = document.getElementById("play");
const shapeMovingPlate = document.querySelector(".moving-Shape");
const whatBtn = document.getElementById("what");
const ok =document.getElementById("ok");
let sec = document.querySelector("#sec");
let outShape = document.getElementById("out-shape");
let directionValue = document.getElementById("dir-value");
let distance = parseInt(document.getElementById("distance-value").value);
let plateCoord = shapeMovingPlate.getBoundingClientRect();
let shapeCoord = outShape.getBoundingClientRect();
let totalAngleLineDraw = 24;
let orginX = 90;
let orginY = 90;
let angleLineX1 = 135;
let angleLineX2 = 142;
let angleLineY1 = orginY;
let angleLineY2 = orginY;
let positionX = 0;
let positionY = 0;
let shapeX = shapeCoord.left - plateCoord.left;
let shapeY = shapeCoord.top - plateCoord.top;
let x = 0;
let y = 0;
let x1 = 0;
let y1 = 0;
let isDrag = false;
let isKeyUp = false;
let isOnChange = false;

const showDefinition=()=>{
    let definition =document.getElementById("definition");
    console.log(definition.style);
    definition.style.display="block";
}
const hideDefinition=()=>{
    let definition =document.getElementById("definition");
    console.log(definition.style);
    definition.style.display="none";
}



const coordinate = (angle) => {
    positionX = distance * Math.cos((angle / 180) * Math.PI).toFixed(4);
    // Screen Y position is oppsite of normal graph
    // so. Y position must convert to normal graph
    positionY = (distance * Math.sin((angle / 180) * Math.PI).toFixed(4)) * -1;

}


// Every time needs update new position of shape
// after moving one position to another
const newPosition =(newAngle,setSpeed)=>{
    let newSpeed=(setSpeed/20)*(distance/100);
    outShape.style.transition=`all ${newSpeed}s ease-in`;
    shapeX = outShape.offsetLeft + positionX;
    shapeY = outShape.offsetTop + positionY;
    outShape.style.left = `${shapeX}px`;
    outShape.style.top = `${shapeY}px`;
    shape.style.transform = `rotate(${-newAngle}deg)`;
}




// Angle Draw every 15 degrees
const angleElementDraw = () => {
    for (let i = 1; i <= totalAngleLineDraw; i++) {
        let lineRotate = i * 360 / totalAngleLineDraw;
        //0,90,180,270 already have a line
        // so ignore all these angle
        // to draw a line
        if (lineRotate % 90 === 0) {
            i++;
            lineRotate = i * 360 / totalAngleLineDraw;
        }
        let angleElement = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        //set line point 
        angleElement.setAttribute('x1', angleLineX1);
        angleElement.setAttribute('y1', angleLineY1);
        angleElement.setAttribute('x2', angleLineX2);
        angleElement.setAttribute('y2', angleLineY2);

        //every time draw line from (120,75) to (127,75) in svg
        // than rotated this line from origin (75,75)
        angleElement.setAttribute('transform', `rotate(${lineRotate} ${orginX},${orginY})`);
        angleElement.setAttribute('stroke', '#ffffff');
        angleElement.setAttribute('stroke-opacity', '0.4');
        angleElement.setAttribute('stroke-width', '2');
        document.querySelector('#angle').appendChild(angleElement);
    }


}



// Shape rotate  with angle.
//This functiion Draw the angle marks with handle
const angleDraw = (a) => {


    //  Radius of angle circle.
    const radius = 25;
    const circumference = 2 * Math.PI * radius;


    //    Second, calculate dash array. We need dash array containing only two parts -
    //    visible dash, and invisible dash.
    //    Visible dash should have length of the chosen angle. Full circle is 360 degrees,
    //    and this 360 degrees does also equal the entire circumference. We want just a part of
    //    this entire circle to be visible - (angle / 360 degrees) returns a percentage value
    //    (between 0.0 and 1.0) of how much circumference should be visible.
    //    Hence, we then multiply (angle / 360) times the entire circumference.
    const strokeOffset = circumference;
    const strokeDasharray = (a / 360) * circumference;

    // Set circle radius
    circle.setAttribute('r', radius);
    // Create dash array of two elements (combined they must equal the entire circumference).
    // First has the length of visible portion. Second, the remaining part.
    circle.setAttribute('stroke-dasharray', [
        strokeDasharray,
        circumference - strokeDasharray
    ]);
    //Rotate circle to start from the right to the left.
    //anti clockwises
    circle.setAttribute('stroke-dashoffset', strokeOffset);
    circle.style.transform = `rotate(${-a}deg)`;
    a = Math.floor(a);
    // show angle text
    angleText.innerHTML = `${a}&deg`;
    // shape position and rotate with new angle
    outShape.style.left = `${shapeX}px`;
    outShape.style.top = `${shapeY}px`;
    shape.style.transform = `rotate(${-a}deg)`;

}


// New speed value get from proprity
const speed=()=>{
    let secValue = parseFloat(document.querySelector("#sec").value);
    return secValue;

}

// after press run button  
const shapeMoving = (e) => {
    let newAngle = parseInt(document.getElementById("dir-value").value);
    let setSpeed = speed();
    distance = 0;
    distance = parseInt(document.getElementById("distance-value").value);
    
    coordinate(newAngle);
    newPosition(newAngle,setSpeed);


}





const findAngle = () => {
    let theta = 0;
    if (isKeyUp || isOnChange) {
        theta = document.getElementById("dir-value").value;
        theta = parseInt(theta);
        isKeyUp = false;
        isOnChange = false;
        return theta;
    }
    let dx = x1 - x;

    // cause screen Y Oppsite of Normal graph
    let dy = y - y1;

    // range (-PI, PI]
    theta = Math.atan2(dy, dx);

    // rads to degs, range (-180, 180]
    theta *= 180 / Math.PI;
    if (theta < 0) {
        // For 360 angle
        theta += 360;
    }
    return theta;
}





const changeAngleWithKey = () => {
    let angle = findAngle();
    handler.style.transform = `rotate(${-angle}deg)`;
    angleDraw(angle);


    //Display on Direction value
    directionValue.value = Math.floor(angle);
}



// after click finding angle between two points
const changeAngle = (e) => {
    // Center of svg x=0 or orginX=0 (pointerX - orginX)
    x1 = e.offsetX - orginX;

    // Center of svg Y=0 or orginY=0 (pointerY - orginY)
    y1 = e.offsetY - orginY;
    let angle = findAngle();
    handler.style.transform = `rotate(${-angle}deg)`;
    angleDraw(angle);

    //Display on Direction value
    directionValue.value = Math.floor(angle);

}


// angle change up and down key
const onChangeAngleWithKey = () => {
    isOnChange = true;
    let angle = findAngle();
    handler.style.transform = `rotate(${-angle}deg)`;
    angleDraw(angle);

    //Display on Direction value
    directionValue.value = Math.floor(angle);
}



const press = (e) => {
    if (e.key === "Enter") {
        isKeyUp = true;
        changeAngleWithKey();
    }

}

// From here to downwards all function for handle
const stopDrag = (e) => {
    isDrag = false;
    changeAngle(e);
}


const drag = (e) => {
    if (!isDrag) {
        return;
    }
    changeAngle(e);
}


const start = (e) => {
    isDrag = true;
    drag(e);

}


// start function
const load = () => {
    coordinate(directionValue.value);
    angleElementDraw();
    angler.onclick = changeAngle;
    angler.onmousemove = drag;
    angler.onmouseup = stopDrag;
    direction.onmousedown = start;
    direction.onmousemove = drag;
    direction.onmouseup = stopDrag;
    directionValue.onkeypress = press;
    directionValue.onchange = onChangeAngleWithKey;
    play.onclick = shapeMoving;
    whatBtn.onclick=showDefinition;
    ok.onclick=hideDefinition;
}
window.onload = load;