function setRouteEvents() {
    var aboutMeItem = document.getElementById("aboutMe");
    var homeItem = document.getElementById("home");
    var aboutSiteItem = document.getElementById("aboutSite");
    var itemArr = [aboutMeItem, homeItem, aboutSiteItem];
    var reset = function() {
        for (var i = 0; i < itemArr.length; i++) {
            itemArr[i].classList.remove("selected");
        }
    }
    for (var i = 0; i < itemArr.length; i++) {
        itemArr[i].addEventListener('click', function(){
            reset();
            this.classList.add("selected");
        });
    }
}

// setRouteEvents();

/* Obsolete Functions
function setRouteEvents2(){
    var routeArr = document.getElementsByClassName("route");
    for (var i = 0; i < routeArr.length; i++) {
        routeArr[i].addEventListener('click', function(){
            for (var j = 0; j < routeArr.length; j++) {
                routeArr[j].classList.remove("selected");
            } 
            this.classList.add("selected"); 
        });
    }
}
*/