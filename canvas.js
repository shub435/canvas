var canvas = document.querySelector("canvas");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
let allRects = [];
let clickedRect = [];
let pointsToJoin = [];

class Rectangle {
  constructor(xcord, ycord, width, height) {
    this.x = xcord;
    this.y = ycord;
    this.w = width;
    this.h = height;
    this.c = canvas.getContext("2d");
    this.c.fillStyle = "#fff";
    this.c.fillRect(this.x, this.y, this.w, this.h);

    this.c.fillStyle = "#000";
    this.c.fillRect(this.x + window.innerWidth / 22 - 5, this.y - 40, 10, 40);
    this.c.font = "bold 10pt verdana";
    this.c.textAlign = "center";
    this.text = `[${(this.x + this.w / 2).toFixed(2)},${(
      this.y +
      this.h / 2
    ).toFixed(2)}]`;
    this.c.fillText(this.text, this.x + this.w / 2, this.y + this.h / 2);
  }
}

window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  init();
});
function init() {
  let w = window.innerWidth / 11;
  let h = window.innerHeight / 11;
  let x = window.innerWidth / 2 - window.innerWidth / 20 - 10;
  let y = 60;
  let newRect = new Rectangle(x, y, w, h);
  allRects.push(newRect);
  console.log(allRects);

  canvas.onmousemove = function (e) {
    var rect = this.getBoundingClientRect(),
      x = e.clientX - rect.left,
      y = e.clientY - rect.top,
      i = 0,
      r;
    var c = canvas.getContext("2d");
    c.clearRect(0, 0, canvas.width, canvas.height);
    while ((r = allRects[i++])) {
      c.beginPath();

      c.rect(r.x, r.y, r.w, r.h);

      if (c.isPointInPath(x, y)) {
        c.fillStyle = "#696969";
        onHoveredRect = allRects.indexOf(r);
      } else {
        c.fillStyle = "#fff";
        onHoveredRect = null;
      }
      c.fill();

      c.fillStyle = "#000000";
      c.fillRect(r.x + window.innerWidth / 22 - 5, r.y - 40, 10, 40);
      c.fillRect(
        r.x + window.innerWidth / 22 - 5,
        r.y + 120,
        10,
        clickedRect.includes(allRects.indexOf(r)) ? -28 : 0
      );

      c.fillStyle = "black";
      c.font = "bold 10pt Verdana";
      c.textAlign = "center";
      text = `[${(r.x + r.w / 2).toFixed(2)}, ${(r.y + r.h / 2).toFixed(2)}]`;
      c.fillText(r.text, r.x + r.w / 2, r.y + r.h / 2);

      pointsToJoin.forEach((cors) => {
        c.fillRect(cors[0] + r.w / 2, cors[1] - 2, 200, 10);
      });
    }
  };
  function collides(rects, x, y) {
    var isCollision = false;
    for (let i = 0; i < rects.length; i++) {
      var left = rects[i].x,
        right = rects[i].x + rects[i].w;
      var top = rects[i].y,
        bottom = rects[i].y + rects[i].h;
      if (right >= x && left <= x && bottom >= y && top <= y) {
        isCollision = rects[i];
      }
    }
    return isCollision;
  }

  canvas.addEventListener(
    "click",
    (e) => {
      console.log("click", e.offsetX + "  " + e.offsetY);
      var rect = collides(allRects, e.offsetX, e.offsetY);
      if (rect) {
        console.log("collision : ", rect.x + " " + rect.y);
        nodeClicked = allRects.indexOf(rect);
        addRects(nodeClicked, rect);
      } else {
        console.log("No collision");
      }
    },
    false
  );

  function addRects(nodeNumber, rect) {
    const cleaner = canvas.getContext("2d");
    cleaner.clearRect(0, 0, canvas.width, canvas.height);
    let number = document.querySelector("#inp-btn").value;
    console.log("node clicked :-", nodeClicked);
    clickedRect.push(nodeNumber);
    console.log(clickedRect);
    xpos_to_plot = [];
    if (number % 2 == 0) {
      let xpos = rect.x - rect.w / 2 - (rect.w + 20) * ((number - 2) / 2) - 10;
      for (let i = 0; i < number; i++) {
        xpos_to_plot.push(xpos);
        xpos += rect.w + 20;
      }
    } else {
      let xpos = rect.x - (rect.w + 20) * ((number - 1) / 2);
      for (let i = 0; i < number; i++) {
        xpos_to_plot.push(xpos);
        xpos += rect.w + 20;
      }
    }

    //Plot the nodes according to the positions in xpos_to_plot list
    for (let i = 0; i < number; i++) {
      let newRect = new Rectangle(
        xpos_to_plot[i],
        rect.y + rect.h * 2 - 25,
        rect.w,
        rect.h
      );
      allRects.push(newRect);
      if (i < number - 1) {
        pointsToJoin.push([xpos_to_plot[i], rect.y + 120]);
      }
    }

    console.log(allRects);
  }
}

init();
