/* Antispam.js
Your task is to write an antispam function that takes a list of different mails and returns clean list of letters with no spam in it.
We know that the text contains the space address of a sender, ':' and a code-phrase in square brakets. Code-phrase is any text, but the address should look like this: galaxy/planetary-system/planet. The name of the galaxy is 2-8 capital letters long, has a hyphen and 2-8 digits after that. Planetary system contains only capital letters and hyphens, too, but it cannot contain two hyphens in a row or at the beginning or end of the name. Planet is a row of unique capital letters. Spam code-phrase is usually marked with a pair @. 
If the space address doesn't comply by the rules, just delete it. If there's a spam message in the code-phrase, don't delete the letter, just mark the message with pair <spam></spam> tag.

*/
////// INPUT
[
  "GALAXY-42/SYSTEM/PLANET:{}",
  "GALAXY-42/SYSTEM/PLANET:{Code}",
  "GALAXY-42/System/PLANET:{Code}",
  "GALAXY-42/SYSTEM/PLANET{Code}",
  "LONGGALAXY-42/SYSTEM/PLANET:{Code}",
  "GALAXY-4/SYSTEM/PLANET:{Code}",
  "GALAXY-4815162342/SYSTEM/PLANET:{Code}",
  "GALAXY-42/THE-SOLAR-SYSTEM/PLANET:{Code}",
  "GALAXY-42/-SYSTEM/PLANET:{Code}",
  "GALAXY-42/SYSTEM1/PLANET:{Code}",
  "GALAXY-42/SYS--TEM/PLANET:{Code}",
  "GALAXY-42/LANGUAGE/JAVA:{Code}",
  "GALAXY-42/LANGUAGE/SCALA:{Code}",
  "GALAXY-42/LANGUAGE/JS:{Code}",
  "GALAXY-42/LANGUAGE/PYTHON:{Code}",
  "GALAXY-42/SYSTEM/PLANET:{Simple text... @null == undefined@}",
  "GALAXY-42/SYSTEM/PLANET:{@typeof null@@typeof typeof null@}",
][
  ////// OUTPUT
  ("GALAXY-42/SYSTEM/PLANET:{}",
  "GALAXY-42/SYSTEM/PLANET:{Code}",
  "GALAXY-42/THE-SOLAR-SYSTEM/PLANET:{Code}",
  "GALAXY-42/LANGUAGE/JS:{Code}",
  "GALAXY-42/LANGUAGE/PYTHON:{Code}",
  "GALAXY-42/SYSTEM/PLANET:{Simple text... <spam>null == undefined</spam>}",
  "GALAXY-42/SYSTEM/PLANET:{<spam>typeof null</spam><spam>typeof typeof null</spam>}")
];

////// SOLUTION

module.exports = function (input) {
  function replaceAll(string) {
    let ats = string.split("@").length - 1;
    if (ats > 1 && ats % 2 === 0) {
      let counter = 0;
      for (let i = 0; i < string.length; i++) {
        if (string[i] === "@") {
          counter += 1;
          string =
            counter % 2 === 0
              ? string.replace("@", "</spam>")
              : string.replace("@", "<spam>");
        }
      }
      return string;
    }
  }
  let map = input.map((email) => {
    let spl = email.split("/");
    if (!/(^[A-Z]{2,8})\-([0-9]{2,8})$/.test(spl[0])) return "";
    if (!/(?!.*([-])\1{1})(^(?!-))(^[A-Z-]+$)/.test(spl[1])) return "";
    if (!/.*[^\-]$/.test(spl[1])) return "";
    let planet = spl[2].split(":");
    if (planet.length < 2) return "";
    if (/^.*(.).*\1.*$/.test(planet[0])) return "";
    if (planet[1].includes("@"))
      return `${spl[0]}/${spl[1]}/${planet[0]}:${replaceAll(planet[1])}`;
    return email;
  });
  return map.filter(Boolean);
};
