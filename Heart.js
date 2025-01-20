class Heart {
    constructor() {
      this.type = "heart";
      this.position = [0.0, 0.0]; // Default position
      this.color = [1.0, 0.0, 0.0, 1.0]; // Default color
      this.size = 5.0; // Default size
    }
  
    render() {
      let [x, y] = this.position;
      let size = this.size / 200.0; // Scale size for the canvas
      let vertices = this.generateVertices(x, y, size);
  
      // Pass vertices to WebGL
      let n = vertices.length / 2; // Number of vertices
      let vertexBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
  
      gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);
      gl.enableVertexAttribArray(a_Position);
  
      gl.uniform4f(u_FragColor, this.color[0], this.color[1], this.color[2], this.color[3]);
      gl.drawArrays(gl.TRIANGLE_FAN, 0, n);
    }
  
    generateVertices(cx, cy, size) {
      const vertices = [];
      const segments = 100; // Smoothness of the heart shape
  
      // Generate heart shape 
      for (let i = 0; i <= segments; i++) {
        const t = (i / segments) * 2 * Math.PI; 
        const x = size * (2 * Math.sin(t) ** 3) + cx;
        const y = size * (15 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t)) / 16 + cy;
        vertices.push(x, y);
      }
  
      return vertices;
    }
  }
  