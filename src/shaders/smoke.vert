precision mediump float;

attribute vec2 a_position;
varying vec2 v_position;

void main(){
  v_position=(a_position+1.)*.5;
  // v_position.y=1.-v_position.y;
  gl_Position=vec4(a_position,0.,1.);
}
