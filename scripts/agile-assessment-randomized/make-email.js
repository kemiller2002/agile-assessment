const fs = require("fs");
const path = require("path");

const emailTemplate = `You have been selected to participate in an important survey that focuses on agile development within the NPT Team. Your insight and experiences are invaluable to us, and we are keen to hear your thoughts on this subject.

We would like to assure you that your participation in this survey will be completely anonymous; individual responses will not be shared with anyone other than the survey administrator. Our goal is to gain a deeper understanding of our agile practices to improve and streamline our processes, and your candid feedback will be instrumental in achieving this.

The survey consists of a series of questions that should take no more than 30 minutes of your time. To access the survey, please use the following link: [Insert Survey Link Here]. 

Please complete the survey by the end of the day on April 2, 2024.

We respect your time and expertise and hope that you will be able to contribute to this initiative. Your input will directly influence the continued success and evolution of agile development in our team.

Should you have any questions or need further clarification, feel free to reach out to me directly.

Thank you in advance for your valuable participation.

Warm regards,

Kevin Miller
Director of Engineering`;

function reducer(s, i) {
  return i(s);
}

function separateEmailAddresses(emails) {
  return [(x) => x.split(" ")].reduce(reducer, emails);
}

function zip(...arrays) {
  // Find the length of the shortest array
  const minLength = Math.min(...arrays.map((arr) => arr.length));

  // Combine the arrays
  return new Array(minLength).fill().map((_, i) => {
    return arrays.map((array) => array[i]);
  });
}

function createObjectFromArray(input) {
  return { emailAddress: input[0], url: input[1] };
}

function pairTemplate(template, emailAndUrl) {
  const { emailAddress, url } = emailAndUrl;

  const emailBody = template.replace("[Insert Survey Link Here]", url);

  const emailHeader = "iPhi NPT Agile Survey";

  return { ...emailAndUrl, emailBody, emailHeader };
}

function fillFullTemplate(template, data) {
  return [
    (x) => x.replace("[To]", data.emailAddress),
    (x) => x.replace("[Subject]", "Agile Practices Survey"),
    (x) => x.replace("[Message Body]", data.emailBody),
    (x) => ({
      fullEmail: x,
      emailFileName: data.emailAddress.split("@")[0] + ".eml",
    }),
  ].reduce(reducer, template);
}

function run(emailTemplate, input, output, emailFullTemplate, outputFolder) {
  const pairTemplateWithTemplate = (x) => pairTemplate(emailTemplate, x);
  const emailTemplateToFillIn = fs.readFileSync(emailFullTemplate, {
    encoding: "utf-8",
  });

  const fillFullSelectedTemplate = (x) =>
    fillFullTemplate(emailTemplateToFillIn, x);

  const writeToFile = (fileName, data) => {
    fs.writeFileSync(path.join(__dirname, "emails", fileName), data);
    return true;
  };

  const updated = [
    (x) => fs.readFileSync(x, { encoding: "utf-8" }),
    JSON.parse,
    (x) => ({ ...x, separateEmails: separateEmailAddresses(x.emails) }),
    (x) => ({ ...x, pairedEmailAndUrl: zip(x.separateEmails, x.urls) }),
    (x) => ({
      ...x,
      emailUrlEntries: x.pairedEmailAndUrl.map(createObjectFromArray),
    }),
    (x) => ({
      ...x,
      emailTemplateWithData: x.emailUrlEntries.map(pairTemplateWithTemplate),
    }),
    (x) => ({
      ...x,
      filledEmails: x.emailTemplateWithData.map(fillFullSelectedTemplate),
    }),
    (x) => ({
      ...x,
      filleEmailOutput: x.filledEmails.map((y) =>
        writeToFile(y.emailFileName, y.fullEmail)
      ),
    }),
    JSON.stringify,
  ].reduce(reducer, input);

  fs.writeFileSync(output, updated);
}

const input = path.join(__dirname, "SendoutList.json");
const output = input.replace(".json", ".output.json");
const emailFullTemplate = path.join(
  __dirname,
  "iPhi - NPT Agile Survey - Final.eml"
);

const outputFolder = path.join(__dirname, "emails");
run(emailTemplate, input, output, emailFullTemplate, outputFolder);
