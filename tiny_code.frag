#ifdef GL_ES
precision mediump float;
#endif
uniform vec2 u_resolution;uniform float u_time;
void main(){
 vec2 uv=gl_FragCoord.xy/u_resolution;
 uv+=0.02*sin(uv*20.+u_time*4.);
 vec2 g=fract(uv*10.);
 float e=step(.1,g.x)*step(.1,g.y)*step(g.x,.9)*step(g.y,.9);
 vec3 c=mix(vec3(0),vec3(g,1.),e);
 gl_FragColor=vec4(c,1.);
}
