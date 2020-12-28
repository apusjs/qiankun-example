export async function query(): Promise<any> {
  return fetch('/api/cgi/ActiveServer')
    .then(function(response) {
      if (response.status !== 200) {
        throw new Error("apps!");
      }
      return response.json();
    }).catch((e) => {console.error(e)})
}

