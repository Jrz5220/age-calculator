const today = new Date();
const birthdayForm = document.getElementById("birthday-form");
const monthHas31Days = [true, false, true, false, true, false, true, true, false, true, false, true];

birthdayForm.theMonth.addEventListener("click", () => {
  let monthSelected = birthdayForm.theMonth.selectedIndex;
  birthdayForm.theDate.length = 28;
  if(monthSelected !== 1) {
    birthdayForm.theDate.options[28] = new Option(29, 29, false, false);
    birthdayForm.theDate.options[29] = new Option(30, 30, false, false);
    if(monthHas31Days[monthSelected]) {
      birthdayForm.theDate.options[30] = new Option(31, 31, false, false);
    }
  }
  if(today.getFullYear()%4 == 0 && monthSelected == 1) {
    birthdayForm.theDate.options[28] = new Option(29, 29, false, false);
  }
});

document.getElementById("copyright-year").innerHTML = today.getFullYear();
