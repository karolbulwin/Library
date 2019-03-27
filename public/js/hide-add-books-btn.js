(function hideAddBooksButton() {
  if (document.querySelectorAll('#all-books > div').length > 0) {
    document.querySelector('#add-books-sample').classList.add('hidden');
  }
}());
