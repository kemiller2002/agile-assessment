export function getChecklist({ get }, fileName) {
  return get(`./surveys/${fileName}`).then((x) => x.data);
}
