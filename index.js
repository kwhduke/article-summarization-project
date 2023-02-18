import Head from "next/head";
import { useState } from "react";
import styles from "./index.module.css";
const {Configuration, OpenAIApi} = require('openai');
const abstracts = require('../src/abstracts.json');

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);
const MAX_TOKENS = 1000;

export default function Home() {
  const [userInput, setuserInput] = useState("");
  const [result, setResult] = useState();

  async function onSubmit(event) {
    event.preventDefault();
    try {
      // console.log(userInput)
      const textToSummarize = getTextToSummarize(userInput);
      const summarization = await createSummarization(textToSummarize);
      setResult(summarization);
      // console.log(summarization);
    } catch (error) {
      // console.log(error)
      handleError(error);
    }
    // try {
    //   const response = await fetch("/api/generate", {
    //     method: "POST",
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //     body: JSON.stringify({ input: userInput }),
    //   });

    //   const data = await response.json();
    //   if (response.status !== 200) {
    //     throw data.error || new Error(`Request failed with status ${response.status}`);
    //   }
    //   console.log("End String", data);
    //   setResult(data.result);
    //   setuserInput("");
    // } catch(error) {
    //   // Consider implementing your own error handling logic here
    //   console.error(error);
    //   alert(error.message);
    // }
  }
  
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
    } else {
      console.log(error.message);
    }
  };

  return (
    <div>
      <Head>
        <title>OpenAI Quickstart</title>
        <link rel="icon" href="/dog.png" />
      </Head>

      <main className={styles.main}>
        <img src="/dog.png" className={styles.icon} />               
        <form onSubmit={onSubmit}>
          <input
            type="text"
            name="animal"
            placeholder="1=Biology, 2=Economics, 3=history"
            value={userInput}
            onChange={(e) => setuserInput(e.target.value)}
          />
          <input type="submit" value="Click to generate summary"/>
        </form>
        <div className={styles.result}>{result}</div>
      </main>
    </div>
  );
}

