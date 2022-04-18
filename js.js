const informacao = {
    canvas:document.getElementById('space'),
    ctx:document.getElementById('space').getContext('2d'),
    corpos:[],
}

let meioX = informacao.canvas.width/2
let meioY = informacao.canvas.height/2

function novoCorpo(nome,massa,x,y,r,cor,visivel=false,fixo=false,velo={ax:0,ay:0,vx:0,vy:0}){
    informacao.corpos[`${nome}`] = {
        nome,
        massa,
        visivel,
        fixo,
        x,
        y,
        r,
        cor,
        velo
    }
    refletir(x,y,r,cor)
}

novoCorpo('Sol',100,-1600,0,200,'orange',false,true,{ax:0,ay:0,vx:-1,vy:-2})
novoCorpo('Terra',55,1200,0,70,'darkblue',false,true)

novoCorpo('Lua1',10,1200,200,20,'gray',false,false,{ax:0,ay:0,vx:10,vy:0})
novoCorpo('Lua2',40,1200,1000,20,'gray',false,false,{ax:0,ay:0,vx:-6,vy:0})

simular()

function simular(){
    desenhar()

    requestAnimationFrame(()=>{
        simular()
    })
}

function refletir(x,y,r,cor){
    let ctx = informacao.ctx
    ctx.fillStyle = cor 
    ctx.beginPath()
    ctx.ellipse(x+meioX, -y+meioY, r, r, 0, 0, 7)
    ctx.fill()
}

function text(w,h,r,x=w,y=h){
    informacao.ctx.fillStyle = 'white'
    informacao.ctx.font = "100px Arial";
    informacao.ctx.fillText(`( ${w} , ${h} )`, x+meioX-r/1.4, -y+meioY+r/7);
}

function mover(corpo){

    let velo = corpo.velo
    velo.vx += velo.ax
    velo.vy += velo.ay
    corpo.x += velo.vx
    corpo.y += velo.vy
}

function desenhar(){
    let canvas = informacao.canvas
    informacao.ctx.clearRect(0,0,canvas.width,canvas.height)
    for(let id in informacao.corpos){
        let corpo = informacao.corpos[id]
        if(!corpo.fixo) atualizar(corpo)
        refletir(corpo.x,corpo.y,corpo.r,corpo.cor)
        if(corpo.visivel) legenda(corpo)
    }
}

function legenda(corpo){
    text(corpo.x,corpo.y,corpo.r)
    text(corpo.velo.vx,corpo.velo.vy,corpo.r,corpo.x+150,corpo.y+150)
    text(corpo.velo.ax,corpo.velo.ay,corpo.r,corpo.x+150,corpo.y+250)
}

function atualizar(corpoA){
    for(let id in informacao.corpos){
        let corpoB = informacao.corpos[id]
        
        mover(corpoA)

        if(corpoB.nome == corpoA.nome) continue 

        calAceleracao(corpoA,corpoB)
    }
}

function calAceleracao(corpoA,corpoB){

    let G = 50
    let d = distancia(corpoA.x,corpoA.y,corpoB.x,corpoB.y)

    if(d <= (corpoA.r+corpoB.r)) return colisao(corpoA)

    let f = forca(corpoA.massa,corpoB.massa,d,G)

    let ca = distancia(corpoA.x,corpoB.y,corpoB.x,corpoB.y)
    let co = distancia(corpoA.x,corpoA.y,corpoA.x,corpoB.y)
    let h =  Math.sqrt((ca**2)+(co**2))

    let ay = f*(co/h)
    let ax = f*(ca/h)

    if(corpoA.x - corpoB.x > 0) ax *= -1
    if(corpoA.y - corpoB.y > 0) ay *= -1

    corpoA.velo.ax = ax
    corpoA.velo.ay = ay

    //console.log( corpoA.nome,' => ',corpoB.nome, ' == ' ,d,corpoA.velo.vx,' ',corpoA.velo.vy )
}

function colisao(corpoA){
    corpoA.velo.ax = 0
    corpoA.velo.ay = 0
    corpoA.velo.vx = 0
    corpoA.velo.vy = 0
}

function distancia(x1,y1,x2,y2){
    return Math.sqrt((x2-x1)**2+(y2-y1)**2)
}

function forca(m1,m2,d,G){ return G*((m1*m2)/(d*d)) }

function a_cos(a){
    return Math.cos(a/(180/Math.PI))
}

function a_sin(a){
    return Math.sin(a/(180/Math.PI))
}

function random(min, max) {
	min = Math.ceil(min);
  	max = Math.floor(max);
  	return Math.floor(Math.random() * (max - min + 1)) + min;
}