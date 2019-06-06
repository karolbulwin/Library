(function customValidation() {
  window.addEventListener(
    'load',
    () => {
      const forms = document.getElementsByClassName('needs-validation');
      Array.prototype.filter.call(forms, (form) => {
        form.addEventListener(
          'submit',
          (event) => {
            if (form.checkValidity() === false) {
              event.preventDefault();
              event.stopPropagation();
            } else {
              event.preventDefault();
              const xhr = new XMLHttpRequest();
              const formData = new FormData(form);
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
            }
            form.classList.add('was-validated');
          },
          false
        );
      });
    },
    false
  );
}());
