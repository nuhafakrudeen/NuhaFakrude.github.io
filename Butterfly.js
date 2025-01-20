class Butterfly {
    constructor() {
      this.type = 'butterfly';
      this.position = [0.0, 0.0]; // Center position in WebGL coordinates
      this.bodyColor = [0.0, 0.0, 0.0, 1.0]; // Black color for the body
      this.wingColor = [1.0, 0.547, 0.0, 1.0]; // Orange color for wings (Monarch)
      this.whiteColor = [1.0, 1.0, 1.0, 1.0]; // White color for accents
      this.size = 1.0; // Increase size to make wings larger
    }
  
    render() {
      const [x, y] = this.position;
      const wingSize = this.size;
  
      // Draw body (segmented for more detail)
      this.drawBody(x, y, this.size * 0.1, this.size);
  
      // Draw left wing
      this.drawWing(x - this.size * 0.05, y, wingSize, true);
  
      // Draw right wing
      this.drawWing(x + this.size * 0.05, y, wingSize, false);
  
      // Draw antenna
      this.drawAntennae(x, y + this.size * 0.6, this.size * 0.3);
    }
  
    drawBody(centerX, centerY, width, height) {
      // Set body color
      gl.uniform4f(u_FragColor, ...this.bodyColor);
  
      const segments = 10; // More segments for body detail
      const segmentHeight = height / segments;
  
      for (let i = 0; i < segments; i++) {
        const topY = centerY + height / 2 - i * segmentHeight;
        const bottomY = topY - segmentHeight;
        const segmentWidth = width * (1 - i / segments);
  
        // Each segment made of two triangles
        drawTriangle([
          centerX, topY, // Top-center
          centerX - segmentWidth / 2, bottomY, // Bottom-left
          centerX + segmentWidth / 2, bottomY, // Bottom-right
        ]);
      }
    }
  
    drawWing(centerX, centerY, size, isLeft) {
      const scaleX = isLeft ? -1 : 1;
  
      // Set wing color (orange for Monarch)
      gl.uniform4f(u_FragColor, ...this.wingColor);
  
      const triangles = [
        // Top wing sections
        [
          centerX, centerY, // Connection to body
          centerX + scaleX * size * 1.2, centerY + size * 0.05, // Top outer point
          centerX + scaleX * size * 1.0, centerY + size * 1.6, // Midpoint
        ],
        [
          centerX, centerY, // Connection to body
          centerX + scaleX * size * 0.7, centerY + size * 1.6, // Midpoint
          centerX + scaleX * size * 0.8, centerY + size * 0.03, // Inner top
        ],
  
        // Bottom wing sections
        [
          centerX, centerY, // Connection to body
          centerX + scaleX * size * 1.2, centerY - size * 1.2, // Bottom outer point
          centerX + scaleX * size * 0.15, centerY - size * 0.06, // Midpoint
        ],
        [
          centerX + scaleX * size * 0.2, centerY - size * 0.2, // Bottom outer point
          centerX + scaleX * size * 0.5, centerY - size * 1.7, // Outer edge
          centerX + scaleX * size * 0.2, centerY - size * 0.6, // Midpoint
        ],
        [
          centerX, centerY, // Connection to body
          centerX + scaleX * size * 0.05, centerY - size * 0.6, // Midpoint
          centerX + scaleX * size * 1.1, centerY - size * 0.3, // Inner bottom
        ],
      ];
  
      // Draw the detailed wing sections
      for (const triangle of triangles) {
        drawTriangle(triangle);
      }
  
      // Add white accents on wings for the Monarch pattern
      gl.uniform4f(u_FragColor, ...this.whiteColor); // White color
  
      // Add white details (small spots or lines)
      this.drawWingDetails(centerX, centerY, size, scaleX);
    }
  
    drawWingDetails(centerX, centerY, size, scaleX) {
        // White spots for the top wing
        drawTriangle([
            centerX + scaleX * size * 0.7, centerY + size * 0.13, // Inner point
            centerX + scaleX * size * 0.1, centerY + size * 0.08, // Outer point
            centerX + scaleX * size * 0.6, centerY + size * 1.3, // Opposite point
        ]);
        // White spots for the bottom wing
        drawTriangle([
            centerX + scaleX * size * 0.9, centerY - size * 0.3, // Inner point
            centerX + scaleX * size * 0.06, centerY - size * 0.09, // Outer point
            centerX + scaleX * size * 0.08, centerY - size * 0.55, // Opposite point
        ]);
    }   
  
    drawAntennae(centerX, topY, length) {
        // Set antennae color
        gl.uniform4f(u_FragColor, ...this.bodyColor);
    
        // Left antenna
        drawTriangle([
          centerX - 0.05, topY, // Top of left antenna
          centerX - 0.03, topY - length * 0.8, // Inner curve
          centerX - 0.08, topY - length * 0.5, // Outer curve
        ]);
    
        // Right antenna
        drawTriangle([
          centerX + 0.05, topY, // Top of right antenna
          centerX + 0.03, topY - length * 0.8, // Inner curve
          centerX + 0.08, topY - length * 0.5, // Outer curve
        ]);
      }
  }

  function drawMonarchButterfly() {
    let butterfly = new MonarchButterfly();
    butterfly.position = [0.0, 0.0]; // Center of canvas
    butterfly.size = 1.0; 
    butterfly.color = [0.0, 0.0, 0.0, 1.0]; // Black
    g_shapesList.push(butterfly);
    renderAllShapes();
  }
  
  function drawTriangle(vertices) {
    const n = 3; // Number of vertices
  
    // Create a buffer object
    const vertexBuffer = gl.createBuffer();
    if (!vertexBuffer) {
      console.log('Failed to create the buffer object');
      return;
    }
  
    // Bind the buffer object to target
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.DYNAMIC_DRAW);
  
    // Assign the buffer object to a_Position variable
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(a_Position);
  
    // Draw the triangle
    gl.drawArrays(gl.TRIANGLES, 0, n);
  }
  