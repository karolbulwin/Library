(function signUp() {
  document.querySelector('form[name=signUpForm]').addEventListener('submit', function form(e) {
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
      if (res.msg === 'dup key') {
        const feedback = document.querySelector('#feedback').innerText;
        document.querySelector('#username').value = '';
        document.querySelector('#feedback').innerText = 'Change your username! It is occupied!';
        document.querySelector('#username').onclick = () => {
          document.querySelector('#feedback').innerText = feedback;
        };
      }
      if (res.msg === 'created') {
        window.location.replace(res.url);
      }
    };

    xhr.open('POST', '/auth/signUp', true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify(data));
  });
}());
