export function toggleMenu(){
  const menu = document.getElementById('menu');
  menu.classList.toggle('show');
}

export function loginPopUp(){
  const loginPopUp = document.getElementById('div-login');
  const overlay = document.getElementById('overlay');
  loginPopUp.classList.add('show');
  overlay.classList.add('show');
}

export function exitLoginPopup(){
  const loginPopUp = document.getElementById('div-login');
  const overlay = document.getElementById('overlay');
  const signinPopUp = document.getElementById('div-signup');
  loginPopUp.classList.remove('show');
  overlay.classList.remove('show');
  signinPopUp.classList.remove('show');
}

export function signinPopUp(){
  const loginPopUp = document.getElementById('div-login');
  const signinPopUp = document.getElementById('div-signup');
  loginPopUp.classList.remove('show');
  signinPopUp.classList.add('show');
}

export function teste(){
  const login = document.getElementById("login");
  const profile = document.getElementById("profile");
  login.classList.add('hide');
  profile.classList.add('show');
}

export function createWorkPopUp(){
  const overlay = document.getElementById('overlay');
  const divWork = document.getElementById('div-createWork');
  overlay.classList.add('show');
  divWork.style.display= "block";
}

export function removeWorkPopUp(){
  const overlay = document.getElementById('overlay');
  const divWork = document.getElementById('div-createWork');
  overlay.classList.remove('show');
  divWork.style.display= "none";
}