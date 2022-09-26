function drawGrid(ctx, w, h, step) {
    for (var x=0;x<=w;x+=step) {
            ctx.beginPath();
            ctx.strokeStyle = 'rgb(0,0,0)';
            ctx.lineWidth = step / 10;
            ctx.moveTo(x, 0);
            ctx.lineTo(x, h);
            ctx.stroke(); 
    }
    for (var y=0;y<=h;y+=step) {
            ctx.strokeStyle = 'rgb(0,0,0)';
            ctx.lineWidth = step / 10;
            ctx.beginPath(); 
            ctx.moveTo(0, y);
            ctx.lineTo(w, y);
            ctx.stroke(); 
    }
};

module.exports = {
    drawGrid
}