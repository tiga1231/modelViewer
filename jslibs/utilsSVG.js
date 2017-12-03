utils = {}

utils.makeListOfObject = function(img){
  //assuming the image is 2D
  var res = [];
  for (var i = 0; i < img.length; i++) {
    for (var j = 0; j < img[i].length; j++) {
      var obj = {
        i:i,
        j:j,
        value:img[i][j]
      }
      res.push(obj);
    }
  }
  return res;
}

utils.img = function(sel, img, pixelSize=1, colorscale='auto'){
  var p = pixelSize;//rename it as a shorcut
  //var img = sel.data();
  if(math.size(img).length == 1){
    var n = img.length;
    var s = utils.squarify(n);
    var rows = s[0];
    var cols = s[1];

    for (var i = 0; i < rows*cols-n; i++) {
      img.push(NaN);
    }
    img = math.reshape(img, [rows, cols]);
  }

  if(colorscale=='auto'){

    var n = math.prod(math.size(img));
    var flat = math.reshape(img, [n]);
    img = utils.makeListOfObject(img);

    var extent = d3.extent(flat);
    var color = ['#f7f7f7','#0571b0'];

    if(extent[0] < 0){
      console.log('using bivariate colormap');
      color = [
        d3.hcl('#ca0020'),
        d3.hcl('#f7f7f7'),
        d3.hcl('#0571b0')
      ];

      var max = d3.max(extent, d=>Math.abs(d));
      extent = [-max, 0, max];
    }else{
      extent = [0, extent[1]];
    }

    var sc = d3.scaleLinear()
    .domain(extent)
    .range(color);

  }else{
    var sc = colorscale;
  }

  sel.selectAll('.pixel')
  .data(img)
  .enter()
  .append('rect')
  .attr('class', 'pixel');

  sel.selectAll('.pixel')
  .attr('x', d=>d.j*p)
  .attr('y', d=>d.i*p)
  .attr('width', p)
  .attr('height', p)
  .attr('fill', d=>sc(d.value));

}

utils.squarify = function(n){
  if(n>6){
      var cols = Math.floor(Math.sqrt(n))*2;
      var rows = Math.ceil(n / cols);
    }else{
      var cols = n;
      var rows = 1;
    }
    return [rows, cols]
}


utils.drawLayer = function(sel, imgs, pixelSize=1, padding=10, colorscale='auto'){
  
  if(math.size(imgs).length==3){
    var n = imgs.length;
    var s = utils.squarify(n);
    var rows = s[0];
    var cols = s[1];

    var size = math.size(imgs[0]);

    sel.selectAll('.img')
      .data(d3.range(n))
      .enter()
      .append('g')
      .attr('class', 'img');

    sel.selectAll('.img')
      .data(imgs)
      .attr('transform', function(d,i){
        return 'translate('
        + (  (i%cols)*(size[0]*pixelSize+padding)  )
        +','
        + (  Math.floor(i/cols) *(size[1]*pixelSize+padding)  )
        +')';
      })
      .each(function(d,i){
        utils.img(d3.select(this), imgs[i], pixelSize, colorscale);
      });
    }


}
