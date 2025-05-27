export function toggleMenu(){
  const menu = document.getElementById('menu');
  menu.classList.toggle('show');
}

export function loginPopUp(){
  const profile = document.getElementById('profile');
  const login = document.getElementById('login');
  login.classList.add('show');
  profile.classList.add('show');
}
