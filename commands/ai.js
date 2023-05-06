require("dotenv").config();
const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  organization: process.env.openaiORG,
  apiKey: process.env.openaiAPI,
});

const openai = new OpenAIApi(configuration);

const getResponse = async (message) => {
  try {
    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: message.content,
      max_tokens: 100,
    });
    console.log(response);

    return response.data.choices[0].text;
  } catch (error) {
    console.log(error);
    return "There's an error occured while generating response.";
  }
};

module.exports = { getResponse };
