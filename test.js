/*
	読み込んだデータは、JavaScriptのsplit()を使って分割はできません。
	d3.csv()で読み込まれたデータは文字列ではなくオブジェクトとして、
	生成されるからです。なので下記のように for････inを使いデータと
	ラベルを読み出して配列に格納する。
*/
d3.csv("test.csv",function(error,data){
 
	var arrData   = [];
	var labelName = [];
 
	for(var i in data[0]){
 
	/*
		data[0]は、ヘッダーの行に続く最初データを示す０を指定します。
		複数行ある場合は、行数分のfor()を使います。
	*/
		arrData.push( data[0][i] ); //横一行をまとめて代入
		labelName.push(i);          //ラベルを入れる
	}
 
	var svgEle = document.getElementById("graph");
	
	
	//	IDgraphのプロパティwidthの値を変数svgWidthに代入する
	var svgWidth = 
	window.getComputedStyle(svgEle, null).getPropertyValue("width");
 
	//	IDgraphのプロパティheightの値を変数svgHeightに代入する
	var svgHeight = 
	window.getComputedStyle(svgEle, null).getPropertyValue("height");
 
	
	//	上記で取得した値には数値「px」が付いているので「px」を削除
	svgWidth  = parseFloat( svgWidth );
	svgHeight = parseFloat( svgHeight );
 
	var svgWidth  = 320  //svg要素の幅
	var svgHeight = 320; //svg要素の高さ
	var xOffset = 40;    //Ｘ座標のずれ具合
	var yOffset = 10;    //Ｙ座標のずれ具合
	var bar;             //棒グラフの棒の要素を格納
 
	var maxNum = 300;
	var barWidth = 20;
	var barMargin = 5;
 
	//棒グラフを描画
	bar = d3.select("#graph")
		.selectAll("rect")
		.data(arrData);
 
	bar.enter()
	.append("rect")
	.attr("class", "fillPink")
 
	//アニメーションの初期値０を設定
	.attr("height",0) 
 
	.attr("width",barWidth)
	.attr("x",function(d,i){
		return i * (barWidth + barMargin) + xOffset;
	})
	
	.attr("y", svgHeight - yOffset )  //グラフの一番下に座標を設定
 
	/*
		棒グラフにマウスを乗せた時の処理はここで行う
	*/
	.on("mouseover",function(){
		d3.select(this)
		.style("fill","green")
	})
 
	/*
		棒グラフからマウスが離れた時の処理はここで行う
	*/
	.on("mouseout",function(){
		d3.select(this)
		.style("fill","pink")
	})
 
	.transition()   //アニメーションをする
	.duration(1200) //アニメーションする時間
 
	/*
		縦棒グラフの左側から
		アニメーションを開始するように設定する
	*/
	.delay(function(d,i){
		return i * 120;
	})
	.attr("y",function(d,i){  //Y座標を指定
		return svgHeight - d - yOffset; //Y座標を計算
	})
	.attr("height",function(d,i){
		return d;
	})
 
 
	//棒グラフの数値を描画する
	bar.enter()              //text要素を指定
	.append("text")          //text要素を追加
	.attr("class","barNum")  //CSSクラスを指定
	.attr("x",function(d,i){ //Ｘ座標を指定
		return i * (barWidth + barMargin) + 10 + xOffset;  //棒グラフの表示間隔に合わせる
	})
	.attr("y", svgHeight -5 - yOffset )//Ｙ座標を指定
	.text(function(d,i){     //データを表示
		return d;
	});
 
	//目盛り表示の為の縮尺表示
	var yScale = d3.scale.linear()
				.domain([0,maxNum])
				.range([maxNum,0]);
 
	d3.select("#graph")
	.append("g")
	.attr("class","axis")
	.attr("transform", "translate(" + xOffset + ", " + ((svgHeight - 300)- yOffset) + ")")
	.call(
		d3.svg.axis()
		.scale(yScale)
		.orient("left")
		
	/*	.ticks(20)
		.tickValues( [10.50,30.36,50,100,200,300] )
		.tickFormat(d3.format(".2f"))
	*/	
	);
 
	//横方向の線を表示する
	d3.select("#graph")
	.append("rect")
	.attr("class","axisX")
	.attr("width",300)
	.attr("height",1)
	.attr("transform","translate(" + xOffset + ", " + (svgHeight - yOffset ) + ")" );
 
	//棒のラベルを表示する
	bar.enter()
	.append("text")
	.attr("class","barName")
	.attr("x",function(d,i){
		return i * 25 + 10 + xOffset;
	})
	.attr("y", svgHeight - yOffset + 15 )
 
	.text(function(d,i){
		//CSVファイルから読み込んだラベル名を表示
		return labelName[i];
	});
 
});