#version 300 es
precision mediump float;
precision highp sampler3D;

uniform float u_time;
in vec2 v_position;
uniform sampler3D u_texture0;
uniform vec2 u_resolution;

float Speed=.02;
vec3 Light=vec3(0.,1.9,0.);
out vec4 color;

float Map(vec3 Position,vec2 uv)
{
  vec3 inTextPos=Position*2.-u_time*Speed;
  vec3 texPos=texture(u_texture0,inTextPos).xyz;
  vec3 P=(Position*.5+texPos*.015);
  P.y+=u_time*.05;
  P.x-=u_time*.005;
  
  float C=texture(u_texture0,P).r;
  C*=uv.y;
  C=C*.5+pow(.2,1.-(uv.x*.1));
  C=C*1.1+.1*pow(texture(u_texture0,P*5.1).a,4.);
  return max((C-.42)*sqrt((Position.z-.1)/.42),0.)/1.;
}

void main(){
  vec2 coord=v_position.xy;
  vec2 uv=(v_position.xy*2.)-1.;
  vec2 pos=uv-vec2(.5);
  vec3 R=vec3(pos,1);
  vec3 P=vec3(.2,-.8,0);
  vec4 C=vec4(0);
  vec3 blue=vec3(.33,.53,.85);
  
  for(float I=.2;I<.35;I+=.01)
  {
    float M1=Map(P+R*I,uv);
    float M2=.1;//Map(P+R*I+Light*.01,uv);
    vec4 point=vec4((.7+blue*(exp(-M2*6.)-M1)),1);
    C+=point*M1*(1.-C.a);
    if(C.a>.9)break;
  }
  vec3 black=vec3(.0,.0,.0);
  vec4 col=C+vec4(vec3(.0,.0,.0)+R.y*.1,C.a);
  
  color=col;
}