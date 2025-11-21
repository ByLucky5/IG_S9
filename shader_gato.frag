#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform float u_time;

void main(){
    vec2 uv = gl_FragCoord.xy / u_resolution.xy;
    uv = uv*2.0 - 1.0;
    uv.x *= u_resolution.x / u_resolution.y;

    float pixelSize = 0.02;
    vec2 p = floor(uv / pixelSize) * pixelSize + pixelSize*0.5;

    vec2 bg = gl_FragCoord.xy / u_resolution;

    // Distorsión animada
    bg += 0.03 * sin(bg * 10.0 + u_time * 1.5);
    bg += 0.02 * sin(bg * 25.0 + u_time * 3.5);

    // Patrón cuadriculado distorsionado, azul-rosa
    vec2 g = fract(bg * 12.0);
    float cell = step(.1,g.x)*step(.1,g.y)*step(g.x,.9)*step(g.y,.9);
    vec3 color = mix(vec3(1.0), vec3(g*0.6 + 0.4,1.0), cell * 0.5);

    // Lienzo blanco
    float squareSize = 1.3;
    if(abs(uv.x) < squareSize*0.5 && abs(uv.y) < squareSize*0.5){
        color = vec3(1.0);
    }
    
    // --- Círculo gris base (cara) ---
    float r = length(p);
    float circleRadius = 0.5;
    color = (r < circleRadius) ? mix(color, vec3(0.7), 1.0) : color;

    // --- Mancha blanca en la barbilla ---
    vec2 chinCenter = vec2(0.0, -0.5);
    float chinRadius = 0.5;
    if(length(p - chinCenter) < chinRadius && (p.y - chinCenter.y) > 0.0)
        color = vec3(1.0);

    // --- Borde negro de la cara ---
    float edgeThickness = 0.03;
    if(r > circleRadius - edgeThickness && r < circleRadius)
        color = vec3(0.0);

    // --- Bigotes ---
    float whiskerWidth = 0.012;
    float whiskerLength = 0.22;
    float spacing = 0.06;
    for(int i=-1; i<=1; i++){
        float yOffset = float(i) * spacing;
        if(abs(p.y - yOffset) < whiskerWidth && p.x > -circleRadius - whiskerLength/2.0 && p.x < -circleRadius + whiskerLength/2.0)
            color = vec3(0.0);
        if(abs(p.y - yOffset) < whiskerWidth && p.x < circleRadius + whiskerLength/2.0 && p.x > circleRadius - whiskerLength/2.0)
            color = vec3(0.0);
    }

    // --- Ojos ---
    vec2 eyeL = p - vec2(-0.15, 0.12);
    vec2 eyeR = p - vec2(0.15, 0.12);
    float eyeSize = 0.07;
    if(length(eyeL) < eyeSize) color = vec3(0.0);
    if(length(eyeR) < eyeSize) color = vec3(0.0);

    float pupilOffset = 0.02;
    vec2 eyeLhigh = eyeL - vec2(-pupilOffset, pupilOffset);
    vec2 eyeRhigh = eyeR - vec2(-pupilOffset, pupilOffset);
    float shineSize = 0.03;
    if(length(eyeLhigh) < shineSize) color = vec3(1.0);
    if(length(eyeRhigh) < shineSize) color = vec3(1.0);

    // --- Nariz ---
    vec2 nose = p - vec2(0.0, -0.03);
    float noseSize = 0.06;
    if(length(nose) < noseSize) color = vec3(1.0,0.55,0.6);

    // --- Boca ---
    vec2 mouthL = p - vec2(-0.03, -0.19);
    vec2 mouthR = p - vec2(0.03, -0.19);
    float mouthSize = 0.035;
    if(length(mouthL) < mouthSize && p.y < nose.y) color = vec3(0.0);
    if(length(mouthR) < mouthSize && p.y < nose.y) color = vec3(0.0);

    // --- Orejas ---
    float earHeight = 0.20;
    float earBase = 0.09;
    float earYOffset = -0.07 + pixelSize;
    float earXOffset = 0.01 - pixelSize;

    vec2 earL = p - vec2(-0.25 - earXOffset, 0.45 + earYOffset);
    if(earL.y > 0.0 && earL.y < earHeight && abs(earL.x) < (earBase+0.01)*(earHeight - earL.y)/earHeight)
        color = vec3(0.0);
    if(earL.y > 0.04 && earL.y < earHeight-0.04 && abs(earL.x) < (earBase-0.03)*(earHeight - earL.y)/earHeight)
        color = vec3(1.0,0.55,0.6);

    vec2 earR = p - vec2(0.25 + earXOffset, 0.45 + earYOffset);
    if(earR.y > 0.0 && earR.y < earHeight && abs(earR.x) < (earBase+0.01)*(earHeight - earR.y)/earHeight)
        color = vec3(0.0);
    if(earR.y > 0.04 && earR.y < earHeight-0.04 && abs(earR.x) < (earBase-0.03)*(earHeight - earR.y)/earHeight)
        color = vec3(1.0,0.55,0.6);

    gl_FragColor = vec4(color,1.0);
}

