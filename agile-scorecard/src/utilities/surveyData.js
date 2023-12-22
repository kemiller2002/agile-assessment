export function getInstrument({ get }, fileName) {
  return get(`./surveys/${fileName}`).then((x) => x.data);
}
