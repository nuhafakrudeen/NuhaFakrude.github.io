class Triangle {
    constructor() {
      this.type = 'triangle';
      this.position = [0.0, 0.0, 0.0];
      this.color = [1.0, 1.0, 1.0, 1.0];
      this.size = 5.0;
    }
  
    render() {
      const xy = this.position;
      const rgba = this.color;
      const size = this.size;
  
      // Pass the color to the shader
      gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
  
      // Pass the size to the shader
      gl.uniform1f(u_size, size);
  
      // Calculate the equilateral triangle vertices
      const d = this.size / 200.0; // Scale the size to fit the canvas
      const height = (Math.sqrt(3) / 2) * d; // Height of an equilateral triangle
  
      const vertices = [
        xy[0], xy[1], // Bottom-left corner
        xy[0] + d, xy[1], // Bottom-right corner
        xy[0] + d / 2, xy[1] + height, // Top corner
      ];
  
      // Draw the equilateral triangle
      drawTriangle(vertices);
    }
  }
  
  function drawTriangle(vertices) {
    const n = 3; // The number of vertices
  
    // Create a buffer object
    const vertexBuffer = gl.createBuffer();
    if (!vertexBuffer) {
      console.log('Failed to create the buffer object');
      return -1;
    }
  
    // Bind the buffer object to target
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  
    // Write the vertices into the buffer object
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.DYNAMIC_DRAW);
  
    // Assign the buffer object to a_Position variable
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);
  
    // Enable the assignment to a_Position variable
    gl.enableVertexAttribArray(a_Position);
  
    // Draw the triangle
    gl.drawArrays(gl.TRIANGLES, 0, n);
  }
  

  

