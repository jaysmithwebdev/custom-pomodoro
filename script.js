// SETUP ///////////////////////////////////////////////////////////////////////

const startPauseButton = document.querySelector("#play-pause");
const resetButton = document.querySelector("#reset");
const workTimeSlider = document.querySelector("#wtime");
const shortBreakSlider = document.querySelector("#sbreak");
const repsSlider = document.querySelector("#reps");
const longBrealSlider = document.querySelector("#lbreak");
const workTimeDisplay = document.querySelector("#wt");
const shortBreakDisplay = document.querySelector("#sb");
const repsDisplay = document.querySelector("#rp");
const longBreakDisplay = document.querySelector("#lb");

// INITIAL/DEFAULT SETTINGS VALUES

let running = false;
let buttonText = "START";
let workTime = 20;
let shortBreak = 5;
let reps = 4;
let longBreak = 20;
let times = []
let positionInTimes = 0;
let timeRemaining = workTime;
let totalSeconds = timeRemaining * 60;
let currentPeriod = "Work";
let nextPeriod = "Short Break";
let countDownInterval;

// UPDATE SETTINGS FROM USER INPUT

function updateSettingsValues (setting, newValue) {
    if (setting == workTimeDisplay) {
        workTime = newValue;
    } else if (setting == shortBreakDisplay) {
        shortBreak = newValue;
    } else if (setting == repsDisplay) {
        reps = newValue;
    } else if (setting == longBreakDisplay) {
        longBreak = newValue;
    }

    if (setting == workTimeDisplay && currentPeriod == "Work") {
        timeRemaining = newValue;  
        totalSeconds = newValue * 60;
        document.querySelector("#time-remaining").innerHTML = newValue + ":00";
    } else if (setting == shortBreakDisplay && currentPeriod == "Short Break") {
        timeRemaining = newValue;
        totalSeconds = newValue * 60;
        document.querySelector("#time-remaining").innerHTML = newValue + ":00";

    } else if (setting == longBreakDisplay && currentPeriod == "Long Break") {
        timeRemaining = newValue;
        totalSeconds = newValue * 60;
        document.querySelector("#time-remaining").innerHTML = newValue + ":00";

    }
        
 }

// ANIMATIONS //////////////////////////////////////////////////////////////////

function timerFlash () {

    let flashCount = 0;

    let flashInterval = setInterval(function() {
        if (flashCount < 6) {
            if (flashCount % 2 == 0) {
                document.querySelector(".timer-container").style.backgroundColor = "white";
                flashCount++;
            } else {
                document.querySelector(".timer-container").style.backgroundColor = "lightblue";
                flashCount++;
            }
        } else {
            clearInterval(flashInterval);
        }
    }, 500);

    //loop back to tracking rep number and calling count down of next time period
    repTracker();
}

function changeSettingsDisplay(settingDisplay, value) {
    let output = ""
    if (settingDisplay == repsDisplay) {
        output = value + " Work Periods";
    } else {
        output = value + ":00";
    }
    settingDisplay.innerHTML = output;
    updateSettingsValues(settingDisplay, value)
}

function countDown(countDownTime) {

    document.querySelector(".task").innerHTML = currentPeriod;
    document.querySelector("#next-up").innerHTML = nextPeriod;

    let minutes = 0;
    let seconds = 0;

    countDownInterval = setInterval(function() {
        if (countDownTime > 0) {
            countDownTime -= 1;
            minutes = Math.floor(countDownTime / 60);
            seconds = countDownTime % 60;
            if (seconds < 10) {
                seconds = "0" + seconds;
            }
            document.querySelector("#time-remaining").innerHTML = minutes + ":" + seconds;
        }

        if (countDownTime == 0) {
            clearInterval(countDownInterval);
            timerFlash();
        }
    }, 1000);
}

function repTracker() {

    totalSeconds = times[positionInTimes] * 60;
    
    //prep the correct names for the time period ready for count down to display them
    if (positionInTimes % 2 == 0 && positionInTimes < (times.length - 2)) {
            currentPeriod = "Work";
            nextPeriod = "Short Break";
    } else if (positionInTimes % 2 == 0 && positionInTimes == (times.length - 2)) {
        currentPeriod = "Work";
        nextPeriod = "Long Break";
    } else if (positionInTimes % 2 == 1 && positionInTimes < (times.length - 1)) {
        currentPeriod = "Short Break";
        nextPeriod = "Work";
    } else if (positionInTimes % 2 == 1 && positionInTimes == (times.length - 1)) {
        currentPeriod = "Long Break";
        nextPeriod = "Work";
    }

    //advance rep number, loop back to 0 if at end ready for next iteration
    if (positionInTimes == (times.length - 1)) {
        positionInTimes = 0;
    } else {
        positionInTimes++; 
    }

    //call count down for current time period    
    countDown(totalSeconds);
}

// BUTTON ACTIONS //////////////////////////////////////////////////////////////

function startPause () {
    
    if (running == false) {
        //disable inputs while running
        document.querySelector("#wtime").disabled = true;
        document.querySelector("#sbreak").disabled = true;
        document.querySelector("#reps").disabled = true;
        document.querySelector("#lbreak").disabled = true;
        running = true;
        document.querySelector("#play-pause").innerHTML = "RESET";
        //populate the list of times
        for (let i = 0; i < (reps - 1); i++) {
            times.push(workTime);
            times.push(shortBreak);
        }
        times.push(workTime);
        times.push(longBreak);
    } else {
        running = false;        
        document.querySelector("#play-pause").innerHTML = "START";
        reset();
        return;
    }

    repTracker();
}

function reset () {
    clearInterval(countDownInterval);
    running = false;
    currentPeriod = "Work";
    nextPeriod = "Short Break";
    positionInTimes = 0;
    timeRemaining = workTime;
    totalSeconds = workTime * 60;
    document.querySelector("#time-remaining").innerHTML = workTime + ":00";
    document.querySelector("#wtime").disabled = false;
    document.querySelector("#sbreak").disabled = false;
    document.querySelector("#reps").disabled = false;
    document.querySelector("#lbreak").disabled = false;

}

function workTimeUpdate() {
    if (running == false) {
       newValue = document.querySelector("#wtime").value;
        displayToChange = document.querySelector("#wt");
        changeSettingsDisplay(displayToChange, newValue); 
    }
}

function shortBreakUpdate() {
    if (running == false) {
        newValue = document.querySelector("#sbreak").value;
        displayToChange = document.querySelector("#sb");
        changeSettingsDisplay(displayToChange, newValue); 
    }
}

function repsUpdate() {
    if (running == false) {
        newValue = document.querySelector("#reps").value;
        displayToChange = document.querySelector("#rp");
        changeSettingsDisplay(displayToChange, newValue);  
    }
}

function longBreakUpdate() {
    if (running == false) {
        newValue = document.querySelector("#lbreak").value;
        displayToChange = document.querySelector("#lb");
        changeSettingsDisplay(displayToChange, newValue); 
    }
}
