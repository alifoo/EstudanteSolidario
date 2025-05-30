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