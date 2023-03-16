"use strict";
const { Configuration, OpenAIApi } = require('openai');
const dotenv = require('dotenv');
const promptLibrary = require('prompt');
const abstracts = require('../src/abstracts.json');
// OpenAI requests + responses are limited to 1000 tokens.
// I think I can increase this to 2048, but I'm not sure.
const MAX_TOKENS = 1000;
var Category;
(function (Category) {
    Category["Biology"] = "Biology";
    Category["Computer_Science"] = "Computer Science";
    Category["Economics"] = "Economics";
})(Category || (Category = {}));
dotenv.config();
const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);
const main = async () => {
    try {
        const userChoice = await promptUserAndGetChoice();
        const textToSummarize = getTextToSummarize(userChoice);
        const summarization = await createSummarization(textToSummarize);
        console.log(summarization);
    }
    catch (error) {
        handleError(error);
    }
};
const promptUserAndGetChoice = async () => {
    const schema = {
        properties: {
            category: {
                type: 'string',
                description: `Please enter a category:
        1: Biology
        2: Computer Science
        3: Economics
      `,
                required: true,
                before: (value) => {
                    switch (value) {
                        case '1':
                            return Category.Biology;
                        case '2':
                            return Category.Computer_Science;
                        case '3':
                            return Category.Economics;
                        default:
                            throw new Error(`Invalid category: ${value}, try one of (1, 2, 3)`);
                    }
                },
            },
        },
    };
    promptLibrary.start();
    const { category } = await promptLibrary.get(schema);
    return category;
};
const getTextToSummarize = (category) => {
    const abstractsWithCategory = abstracts.filter((abstract) => abstract.category === category);
    const index = Math.floor(Math.random() * abstractsWithCategory.length);
    const randomAbstract = abstractsWithCategory[index];
    return randomAbstract.text;
};
const createSummarization = async (textToSummarize) => {
    const summarizePrefix = 'Summarize the topic and findings to a 15-year-old year old in an engaging way in 2-3 sentences:\n\n';
    // create a completion and get response from
    // completion.data.choices[0].text
    const prompt = `${summarizePrefix}${textToSummarize}`;
    const model = 'text-davinci-003';
    console.log(`asking for completion using model (${model}) for text:\n\n${prompt}\n\n`);
    const completion = await openai.createCompletion({
        model,
        prompt,
        max_tokens: MAX_TOKENS,
    });
    return completion.data.choices[0].text;
};
const handleError = (error) => {
    if (error.response) {
        console.log(error.response.status);
        console.log(error.response.data);
    }
    else {
        console.log(error.message);
    }
};
main();
