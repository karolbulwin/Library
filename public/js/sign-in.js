(function signIn() {
  document.querySelector('form[name=signInForm]').addEventListener('submit', function form(e) {
    e.preventDefault();
    const xhr = new XMLHttpRequest();
    const formData = new FormData(this);
    const data = {};

    // eslint-disable-next-line prefer-const
    for (let input of formData) {
      data[input[0]] = input[1];
    }

    xhr.onload = () => {
      const res = JSON.parse(xhr.response);
      if (res.message === 'Incorrect username.') {
        document.querySelector('#username').value = '';
        document.querySelector('#invalid-user').innerText = res.message;
        document.querySelector('#username').onclick = () => {
          document.querySelector('#invalid-user').innerText = '';
        };
      }
      if (res.message === 'Incorrect password.') {
        document.querySelector('#password').value = '';
        document.querySelector('#invalid-password').innerText = res.message;
        document.querySelector('#password').onclick = () => {
          document.querySelector('#invalid-password').innerText = '';
        };
      }
      if (res.message === 'logedIn') {
        window.location.replace(res.url);
      }
    };

    xhr.open('POST', '/auth/signIn', true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify(data));
  });
}());
