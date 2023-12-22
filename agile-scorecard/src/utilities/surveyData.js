export function getInstrument({ get }, fileName) {
  return get(`./surveys/${fileName}`).then((x) => x.data);
}

export function getInstrumentListing({ get }, url) {
  return get(url).then((x) => x.data);
}
