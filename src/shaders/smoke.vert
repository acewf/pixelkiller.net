#version 300 es
precision mediump float;

in vec4 a_position;
out vec2 v_position;

void main(){
  v_position=(a_position.xy+1.)*.5;
  v_position.y=1.-v_position.y;
  
  // v_position.y=1.-v_position.y;
  gl_Position=a_position;
}
