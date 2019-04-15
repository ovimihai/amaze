function setCookie(cname, cvalue, exminutes) {
    var d = new Date();
    d.setTime(d.getTime() + (exminutes * 60 * 1000));
    var expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname, default_value) {
    var default_value = default_value | "";
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return default_value;
}

var max_time = 15 * 60;
var expire_minutes = 2 * 60;
var update_timer;
var reset_code = [];

function getRemainingTime() {
    var current_time = Math.floor(new Date().getTime() / 1000);
    var timer = getCookie('timer', 0);
    if (timer == 0) {
        setCookie('timer', current_time, expire_minutes);
        remaining_time = max_time;
    } else {
        var passed_time = current_time - timer;
        var remaining_time = max_time - passed_time;
    }
    return remaining_time;
}

function start() {
    addListeners();
    var remaining_time = getRemainingTime();
    if (remaining_time < 0) {
        clear_drawing();
    } else {
        reset();
    }
    update_timer = setInterval(showTimer, 1000);
}

function showTimer() {
    var time = getRemainingTime();
    if (time <= 0) {
        clearInterval(update_timer);
        document.getElementById('time').innerHTML = '00:00';
        return;
    }
    var min = Math.floor(time / 60);
    var sec = time - min * 60;
    var str_time = min.toString() + ':' + String("0" + sec).slice(-2) ;
    document.getElementById('time').innerHTML = str_time;
}

function updateLevel() {
    var current_level = document.getElementById('level').value;
    dimensions = levels[current_level];
    reset_code.push(current_level)
    reset_code = reset_code.slice(-3);
    var time = getRemainingTime();
    if ((reset_code.length == 3)
        && reset_code[0] == 'normal'
        && reset_code[1] == 'hard'
        && reset_code[2] == 'easy') {
        reset();
        resetTimer();
    }
    if (time > 0) {
        reset();
    }
}


function resetTimer() {
    var time = Math.floor(new Date().getTime() / 1000);
    setCookie('timer', time, expire_minutes);
}

window.onload = start;