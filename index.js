var current=""

var isTransition=false
document.body.addEventListener("transitionend",function(){
	isTransition=false
})

var homeText=document.getElementById("content").innerHTML

var loadIframe=function(name,callback){
	if(name==""){
		document.getElementById("canvas").src=""
	}else{
		document.getElementById("canvas").src="canvas/"+name+"/index.html"
	}
	var runCallback=function(){
		callback()
		document.getElementById("canvas").removeEventListener("load",runCallback)
	}.bind(this)
	document.getElementById("canvas").addEventListener("load",runCallback)
}

var fillData=function(name,callback){
	if(name==""){
		document.getElementById("content").innerHTML=homeText
		loadIframe(name,callback)
	}else{
		var http=new XMLHttpRequest()
		http.addEventListener("load",function(){
			document.getElementById("content").innerHTML=http.responseText
			loadIframe(name,callback)
		}.bind(this))
		http.open("GET","canvas/"+name+"/description.html")
		http.send()
	}
}

var goToBoard=function(name){
	document.body.classList.remove("loading")
	if(current!=""){
		document.getElementById("item-"+current).classList.remove("current")
	}
	document.body.classList.add("loading")
	isTransition=true
	if(isTransition){
		var delayedLoad=function(){
			fillData(name,function(){
				isTransition=true
				document.body.classList.remove("loading")
				if(name!=""){
					document.getElementById("item-"+name).classList.add("current")
				}
				current=name
			})
			document.getElementById("content-overlay").removeEventListener("transitionend",delayedLoad)
		}.bind(this)
		document.getElementById("content-overlay").addEventListener("transitionend",delayedLoad)
	}else{
		fillData(path,function(){
			isTransition=true
			document.body.classList.remove("loading")
			if(name!=""){
				document.getElementById("item-"+name).classList.add("current")
			}
			current=name
		})
	}
}.bind(this)

var jumpFunctionGenerator=function(name){
	return function(){
		goToBoard(name)
	}.bind(this)
}.bind(this)

var show=function(data){
	document.getElementById("title").addEventListener("click",jumpFunctionGenerator(""))
	data.forEach(function(name){
		document.getElementById("list").insertAdjacentHTML("beforeend","<a href=\"#"+name+"\"><li class=\"item button\" id=\"item-"+name+"\">"+name+"</li></a>")
		document.getElementById("item-"+name).addEventListener("click",jumpFunctionGenerator(name))
	})
	var hash=location.hash
	if(hash.length>=1){
		if(hash[0]=="#"){
			hash=hash.slice(1)
		}
	}
	goToBoard(hash)
}

var http=new XMLHttpRequest()
http.addEventListener("load",function(){show(JSON.parse(http.response))})
http.open("GET","canvas/data.json")
http.send()