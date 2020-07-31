export function addLoading(domElement) {
  const loading = document.createElement('div');
  loading.innerText = 'LOADING...';
  document.body.insertBefore(loading, domElement);
}

export function removeLoading() {
  document.body.removeChild(document.body.firstChild);
}
