(function(){
	
	const API_KEY_WEATHER="4bf441c39bebf932933d20904fea2cb2"
	const API_KEY_TIME='7f88235bd2874cc6bf6231540182205'
	const API_URL_WEATHER="http://api.openweathermap.org/data/2.5/weather?appid="+API_KEY_WEATHER+"&";
	const API_URL_TIME="http://api.worldweatheronline.com/premium/v1/tz.ashx?format=json&key="+API_KEY_TIME+"&q=";
	const IMG_WEATHER="http://openweathermap.org/img/w/"
	var cityWeather={}
	cityWeather.zone
	cityWeather.icon
	cityWeather.temp
	cityWeather.temp_max
	cityWeather.temp_min
	cityWeather.main

	var today = new Date()
	var timeNow=today.toLocaleTimeString()
	var cities=[]
	var ciudad = $("[data-input='cityAdd']");
	var buscar = $("[data-button='add']");
	var verCiudades=$("[data-record-cities]");

	$(buscar).on('click',getNewCity);
	$(buscar).on('keypress',function(event){
		if(event.which==13){
			getNewCity();
		}
	})

	$(verCiudades).on('click',getRecordCities);

	if(navigator.geolocation){
		navigator.geolocation.getCurrentPosition(getCoords,errorFound)
	}
	else{
		alert('Este navegador es obsoleto, considere actualizarlo')
	}
	
	function errorFound(error){
		alert('Ha ocurrido un error'+error.code)
	}

	function getCoords(position){
		var lat = position.coords.latitude
		var lon = position.coords.longitude

		$.getJSON(API_URL_WEATHER+'lat='+lat+"&lon="+lon,getCurrentWeather);
		$.getJSON(API_URL_TIME)
	}
	function getCurrentWeather(data){
		cityWeather={};
		cityWeather.zone=data.name;
		cityWeather.icon=IMG_WEATHER+data.weather[0].icon+".png";//para obtner la url de la imagen se puede hacer uso del formato de la url en html y copiarla
		cityWeather.temp=data.main.temp-273.15;
		cityWeather.temp_max=data.main.temp_max-273.15;
		cityWeather.temp_min=data.main.temp_min-273.15;
		cityWeather.main=data.weather[0].main;
		renderTemp(cityWeather)	
	}

	function activateTemplate(id){
		var temp=document.querySelector(id)
		return document.importNode(temp.content,true)
	}

	function renderTemp(cityWeather,horaLocal){
		var timeRender;
		if(horaLocal){
			timeRender=horaLocal.split(" ")[1];
		}else{
			timeRender=timeNow;
		}
		var clone=activateTemplate("#template--city")
		clone.querySelector("[data-icon]").src=cityWeather.icon
		clone.querySelector("[data-city]").innerHTML=cityWeather.zone
		clone.querySelector("[data-temp='current']").innerHTML=Math.round(cityWeather.temp)+" °C"
		clone.querySelector("[data-temp='max']").innerHTML="MAX: "+Math.round(cityWeather.temp_max)+" °C"
		clone.querySelector("[data-temp='min']").innerHTML="MIN: "+Math.round(cityWeather.temp_min)+" °C"
		clone.querySelector("[data-time]").innerHTML=timeRender;
		$('.loader').hide();
		$(".container").children('#contenido').append(clone)
	}	

	function getNewCity(event){
		event.preventDefault()
		 $.getJSON(API_URL_WEATHER+'q='+$(ciudad).val(),renderNewCity)
	}

	function renderNewCity(data){
		$.getJSON(API_URL_TIME+$(ciudad).val(),function(response){
		cityWeather={}
		cityWeather.zone=data.name;
		cityWeather.icon=IMG_WEATHER+data.weather[0].icon+".png";//para obtner la url de la imagen se puede hacer uso del formato de la url en html y copiarla
		cityWeather.temp=data.main.temp-273.15;
		cityWeather.temp_max=data.main.temp_max-273.15;
		cityWeather.temp_min=data.main.temp_min-273.15;
		cityWeather.main=data.weather[0].main;
	
		renderTemp(cityWeather,response.data.time_zone[0].localtime)
		
		cities.push(cityWeather)
		localStorage.setItem("cities",JSON.stringify(cities))

		})
	}

	function getRecordCities(event){
		event.preventDefault();
	
		function renderCities(cities){
			cities.forEach( function(city) {
				renderTemp(city)
			});
		}
		var cities= JSON.parse(localStorage.getItem("cities"));
		renderCities(cities);
	}

})()

