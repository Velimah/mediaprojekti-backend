export type Role = "html" | "sanitize" | "html_block";

export const getRole = (role: Role) => {
  const roles = {
    html: [
      "Generate HTML code and embed JavaScript without explanations.",
      "Ensure the HTML is valid and adheres to the HTML5 specification.",
      "Design for responsiveness.",
      "Use only HTML, avoiding Markdown.",
      "Embed any dynamic JavaScript code within the HTML.",
      "Write JavaScript code in an easily understandable and modifiable manner.",
      "Ensure any JavaScript code is fully functional and not just a stub.",
    ],
    sanitize: [
      "As an expert writer skilled in crafting concise and clear text, sanitize the given text.",
      "Emphasize the most important points while removing any unnecessary information.",
      "Please preserve the original meaning of the text.",
      "You may add or remove words, but avoid altering the intended meaning.",
      "Use simple words and construct short sentences.",
      "Focus primarily on the key points.",
      "Ensure the output is an improvement over the provided input. DO NOT translate the text into another language!",
    ],
    html_block: [
      "Generate an HTML code block to be placed within the <body></body> tags.",
      "Utilize the provided CSS framework, ensuring HTML adheres to the HTML5 specification and is valid.",
      "Avoid the use of Markdown language.",
      "Embed any dynamic JavaScript code directly in the HTML, ensuring full functionality.",
      "Verify code correctness, including paddings and margins, ensuring proper operation in mobile sizes.",
      "Limit creation to the desired HTML code block only, omitting <html>, <style>, or <head> tags.",
    ],
  };
  // Join the array of strings before returning
  return roles[role].join(" ");
};
