const express = require("express");
const app = express();
const bodyParser = require("body-parser");

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.json());
app.use(bodyParser.urlencoded({extended: true}));

const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const monthDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
const age = {
  years: 0,
  months: 0,
  days: 0,
  totalMonths: 0,
  totalDays: 0,
  totalHours: 0,
  totalMinutes: 0,
  daysUntilBirthday: 0
};

app.get("/", function(req, res) {
  res.render("index", {age: age, hasBirthday: false});
});
app.post("/calculateAge", function(req, res) {
  resetAge();
  let today = new Date();
  let birthYear = 0;
  let birthMonth = 0;
  let birthDate = 0;
  if(isNumber(req.body.theYear) && isNumber(req.body.theMonth) && isNumber(req.body.theDate)) {
    birthYear = Number(req.body.theYear);
    birthMonth = Number(req.body.theMonth);
    birthDate = Number(req.body.theDate);
  }
  let yearsSinceBirthYear = today.getFullYear() - birthYear;
  let monthsSinceBirthMonth = today.getMonth() - birthMonth;
  let daysSinceBirthDate = today.getDate() - birthDate;
  let totalMonths = 0;
  let totalDays = 0;
  let totalHours = 0;
  let totalMinutes = 0;
  let daysUntilBirthday = 0;
  let birthdayHasPassed = false;
  let isLeapYear = false;

  if(today.getFullYear() % 4 == 0) {
	   isLeapYear = true;
  }
  if(monthsSinceBirthMonth == 0) {
    birthdayHasPassed = (today.getDate() - birthDate) >= 0;
  } else {
    birthdayHasPassed = monthsSinceBirthMonth > 0;
  }
  if(!birthdayHasPassed) {
    yearsSinceBirthYear--;
  }
  if(daysSinceBirthDate < 0) {
    daysSinceBirthDate = 31 - (birthDate - today.getDate());
  }

  // days until birthday
  if(monthsSinceBirthMonth == 0) {
    if(birthdayHasPassed) {
      daysUntilBirthday = 365 - (today.getDate() - birthDate);
    } else {
      daysUntilBirthday = birthDate - today.getDate();
    }
  } else {
    // daysUntilBirthday = 0
    daysUntilBirthday += monthDays[today.getMonth()] - today.getDate(); // days remaining this month
    if(isLeapYear && today.getMonth() == 1) {
      daysUntilBirthday++;  // add the extra day in a leap year
    }
    if(birthdayHasPassed) {
      let yearCounter = today.getFullYear();
      // add the remaining days left in the year
      for(let i = today.getMonth() + 1; i < months.length; i++) {
        if((yearCounter%4) == 0 && today.getMonth() == 1) {
          daysUntilBirthday++;
        }
        daysUntilBirthday += monthDays[i];
        yearCounter++;
      }
      yearCounter = today.getFullYear();
      // add the days from jan 1st until the month before birthday month
      for(let i = 0; i < birthMonth; i++) {
        if((yearCounter%4) == 0 && today.getMonth() == 1) {
          daysUntilBirthday++;
        }
        daysUntilBirthday += monthDays[i];
        yearCounter++;
      }
    } else {
      // birthday has not passed
      // add the days until the month before the birthday month is reached
      let yearCounter = today.getFullYear();
      for(let i = today.getMonth() + 1; i < birthMonth; i++) {
        if((yearCounter%4) == 0 && today.getMonth() == 1) {
          daysUntilBirthday++;
        }
        daysUntilBirthday += monthDays[i];
      }
    }
    daysUntilBirthday += birthDate;
  } // end daysUntilBirthday calculation

  // monthsSinceBirthMonth is the number of months that have passed since the last birthday
  if(monthsSinceBirthMonth > 0 && birthDate > today.getDate()) {
    monthsSinceBirthMonth--;
  } else if(monthsSinceBirthMonth == 0 && birthDate > today.getDate()) {
    monthsSinceBirthMonth = 11;
  } else if(monthsSinceBirthMonth < 0) {
    monthsSinceBirthMonth = 12 - (birthMonth - today.getMonth());
  }

  totalMonths = yearsSinceBirthYear * 12 + monthsSinceBirthMonth;
  totalDays = yearsSinceBirthYear * 365;
  if(birthdayHasPassed) {
    // add days since birthday
    totalDays += today.getDate();
    totalDays += monthDays[birthMonth] - birthDate;
    for(let i = birthMonth + 1; i < today.getMonth(); i++) {
      totalDays += monthDays[i];
    }
  } else {
    // add days until birthday
    totalDays += monthDays[birthMonth] - birthDate;
    for(let i = birthMonth + 1; i < 12; i++) {
      totalDays += monthDays[i];
    }
    for(let i = 0; i < today.getMonth(); i++) {
      totalDays += monthDays[i];
    }
    totalDays += today.getDate();
  }
  // add extra leap year days
  for(let i = birthYear; i < today.getFullYear(); i++) {
    if(i%4 == 0) {
      totalDays++;
    }
  }
  totalHours = totalDays * 24;
  totalMinutes = totalHours * 60;

  age.years = yearsSinceBirthYear;
  age.months = monthsSinceBirthMonth;
  age.days = daysSinceBirthDate;
  age.totalMonths = totalMonths.toLocaleString();
  age.totalDays = totalDays.toLocaleString();
  age.totalHours = totalHours.toLocaleString();
  age.totalMinutes = totalMinutes.toLocaleString();
  age.daysUntilBirthday = daysUntilBirthday;
  res.render("index", {age: age, hasBirthday: true, month: months[birthMonth], date: birthDate, year: birthYear});
}); // end calculateAge

function resetAge() {
  age.years = 0;
  age.months = 0;
  age.days = 0;
  age.totalMonths = 0;
  age.totalDays = 0;
  age.totalHours = 0;
  age.totalMinutes = 0;
  age.daysUntilBirthday = 0;
}
function isNumber(str) {
  if(typeof str != "string") return false;
  return !isNaN(str) && !isNaN(parseFloat(str));
}

let port = process.env.PORT;
if(port == "" || port == null) {
  port = "3000";
}
app.listen(port, function(req, res) {
  console.log("Server running on port: " + port);
});
