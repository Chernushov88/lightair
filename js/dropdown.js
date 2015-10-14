var cookieName = "lightair-lang-cookie";
var expire = 90;

window.addEvent("domready", function() {
    var isCookieSet = getCookie(cookieName);
    var csp = checkIfStartPage();
    if ((isCookieSet != null && isCookieSet !="") || (!csp)){
        //window.location.assign(isCookieSet);
    }
    else if(typeof geoip_country_code == 'function'){
        var country= geoip_country_code();
        var selectedURL = "";
        
        if(country == "SE") {
            selectedURL = "http://www.lightair.se";
        }
        else if(country == "CN") {
          selectedURL = "http://www.lightair.com/cn/";
        } 
        else if(country == "FR") {
          selectedURL = "http://www.lightair.com/fr/";
        }
        else if(country == "JP") {
          selectedURL = "http://www.lightair.com/jp/";
        }
        
        if(selectedURL != ""){
            setCookieMinutes(cookieName, selectedURL, expire); 
            window.location.assign(selectedURL);
        }
        else{
            setCookieMinutes(cookieName, "http://www.lightair.com/", expire); 
        }
    }
    
});

function openDir() {
    var selected = $('goto').getSelected();
    setCookieMinutes(cookieName, selected[0].value, expire); 
    window.location.assign(selected[0].value);
} 

function getCookie(c_name){
    var i,x,y,ARRcookies=document.cookie.split(";");
    for (i=0;i<ARRcookies.length;i++){
      x=ARRcookies[i].substr(0,ARRcookies[i].indexOf("="));
      y=ARRcookies[i].substr(ARRcookies[i].indexOf("=")+1);
      x=x.replace(/^\s+|\s+$/g,"");
      if (x==c_name){
        return unescape(y);
      }
    }
}

function setCookieMinutes(name, value, minutes) {
    var date = new Date();
    date.setTime(date.getTime()+(minutes*60*1000));
    var expires = "; expires="+date.toGMTString()+";path=/";

    document.cookie = name+"="+value+expires;
}

function checkIfStartPage(){
    var url = document.URL;
    var urls = ["http://www.lightair.com/", "http://www.lightair.se/", "http://www.lightair.com/cn/",
        "http://www.lightair.com/fr/", "http://www.lightair.com/jp/", "http://www.lightair.com/show.php", 
        "http://lightair.com/", "http://lightair.se/", "http://lightair.com/cn/", "http://lightair.com/fr/", 
        "http://lightair.com/jp/", "http://lightair.com/show.php"];
    return (urls.indexOf(url) > -1);
}