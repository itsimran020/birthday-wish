let highestZ = 1;

let holdingPaper = false;
let rotating = false;

// add page

document.getElementById("blackout-btn").addEventListener("click", function () {
  // Blackout overlay
  document.getElementById("blackout-overlay").classList.add("active");
  // Wait for blackout animation (adjust if needed, e.g., 1 second)
  setTimeout(function () {
    // Replace page content with new HTML
    document.body.innerHTML = `
<section id="video">
    <video id="myvideo" autoplay src="./video.mp4" style="position: absolute;top:0;left:0;width:100%;height:100%;object-fit: cover;pointer-events: none;"></video>
</section>
        `;
    // Optionally re-apply your styles (if <head> is removed)
    const style = document.createElement("style");
    style.textContent = `
*{
margin: 0;
padding: 0;
box-sizing: border-box;
}
#video{
position: relative;
width: 100vw;
height: 100vh;
overflow: hidden;
}
#myvideo{
position: absolute;
top: 0;
left:0 ;
width: 100%;
height: 100%;
object-fit: cover;
pointer-events: none;
}
        `;
    document.head.appendChild(style);
  }); // adjust timing to match your blackout effect
});

//

class Paper {
  holdingPaper = false;
  mouseTouchX = 0;
  mouseTouchY = 0;
  mouseX = 0;
  mouseY = 0;
  prevMouseX = 0;
  prevMouseY = 0;
  velX = 0;
  velY = 0;
  rotation = Math.random() * 30 - 15;
  currentPaperX = 0;
  currentPaperY = 0;
  rotating = false;

  init(paper) {
    document.addEventListener("mousemove", (e) => {
      if (!this.rotating) {
        this.mouseX = e.clientX;
        this.mouseY = e.clientY;

        this.velX = this.mouseX - this.prevMouseX;
        this.velY = this.mouseY - this.prevMouseY;
      }

      const dirX = e.clientX - this.mouseTouchX;
      const dirY = e.clientY - this.mouseTouchY;
      const dirLength = Math.sqrt(dirX * dirX + dirY * dirY);
      const dirNormalizedX = dirX / dirLength;
      const dirNormalizedY = dirY / dirLength;

      const angle = Math.atan2(dirNormalizedY, dirNormalizedX);
      let degrees = (180 * angle) / Math.PI;
      degrees = (360 + Math.round(degrees)) % 360;
      if (this.rotating) {
        this.rotation = degrees;
      }

      if (this.holdingPaper) {
        if (!this.rotating) {
          this.currentPaperX += this.velX;
          this.currentPaperY += this.velY;
        }
        this.prevMouseX = this.mouseX;
        this.prevMouseY = this.mouseY;

        paper.style.transform = `translateX(${this.currentPaperX}px) translateY(${this.currentPaperY}px) rotateZ(${this.rotation}deg)`;
      }
    });

    paper.addEventListener("mousedown", (e) => {
      if (this.holdingPaper) return;
      this.holdingPaper = true;

      paper.style.zIndex = highestZ;
      highestZ += 1;

      if (e.button === 0) {
        this.mouseTouchX = this.mouseX;
        this.mouseTouchY = this.mouseY;
        this.prevMouseX = this.mouseX;
        this.prevMouseY = this.mouseY;
      }
      if (e.button === 2) {
        this.rotating = true;
      }
    });
    window.addEventListener("mouseup", () => {
      this.holdingPaper = false;
      this.rotating = false;
    });
  }
}

const papers = Array.from(document.querySelectorAll(".paper"));

papers.forEach((paper) => {
  const p = new Paper();
  p.init(paper);
});

document.getElementById("blackout-btn").addEventListener("click", function () {
  document.getElementById("blackout-overlay").classList.add("active");
});


