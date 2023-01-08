import { useState, useEffect } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import Naga from '../assets/NAGA.png';
import One from '../assets/one.png';
import Two from '../assets/two.png';
import Three from '../assets/three.png';




const Home = () => {

  const maxRetries = 20;

  const [input, setInput] = useState('');
  const [img, setImg] = useState('');
  const [retry, setRetry] = useState(0);
  const [retryCount, setRetryCount] = useState(maxRetries);
  // Add isGenerating state
  const [isGenerating, setIsGenerating] = useState(false);
  const [finalPrompt, setFinalPrompt] = useState('');


  const onChange = (event) => {
    setInput(event.target.value);
  };


  // Add generateAction
  const generateAction = async () => {
    console.log('Generating...');

    if (isGenerating && retry === 0) return;

    setIsGenerating(true);

    if (retry > 0) {
      setRetryCount((prevState) => {
        if (prevState === 0) {
          return 0;
        } else {
          return prevState - 1;
        }
      });

      setRetry(0);
    }



    const finalInput = input.replace(/raza/gi, 'abraza');

    const response = await fetch('/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'image/jpeg',
      },
      body: JSON.stringify({ input: finalInput }),
    });

    const data = await response.json();

    if (response.status === 503) {
      setRetry(data.estimated_time);
      return;
    }

    if (!response.ok) {
      console.log(`Error: ${data.error}`);
      setIsGenerating(false);
      return;
    }

    // Set final prompt here
    setFinalPrompt(input);
    // Remove content from input box
    setInput('');
    setImg(data.image);
    setIsGenerating(false);
  };


  useEffect(() => {
    const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
    const runRetry = async () => {
      if (retryCount === 0) {
        console.log(`Model still loading after ${maxRetries} retries. Try request again in 5 minutes.`);
        setRetryCount(maxRetries);
        return;
      }

      console.log(`Trying again in ${retry} seconds.`);

      await sleep(retry * 1000);

      await generateAction();
    };

    if (retry === 0) {
      return;
    }

    runRetry();
  }, [retry]);



  return (
    <div className="root">




      <Head>
        <title>AI picture generator | Naga Apparel</title>
      </Head>
      <div className="root">
        <Head>
          <title>AI picture generator | Naga Apparel</title>
        </Head>
        <div className="container">
          <div className="header">
            <div className="header-title">


              <h1 className=""><Image src={Naga} alt="buildspace logo" className="logo logo2" />NAGA Image Generator </h1>
            </div>
            <div className="header-subtitle">
              <h2>
                Turn me into anyone you want! Type in your prompt 😎
              </h2>

            </div>
            <div className="prompt-container">
              <input className="prompt-box" value={input} onChange={onChange} />
              <div className="prompt-buttons">
                <a
                  className={
                    isGenerating ? 'generate-button loading' : 'generate-button'
                  }
                  onClick={generateAction}
                >
                  <div className="generate">
                    {isGenerating ? (
                      <span className="loader"></span>
                    ) : (
                      <p>Generate</p>
                    )}
                  </div>
                </a>
              </div>



              <div className="newcontainer">
                <Image src={One} alt="Naga Art" className="onesd" />
                <Image src={Two} alt="Naga Art" className="onesd" />

                <Image src={Three} alt="Naga Art" className="onesd" />

              </div>
               


            </div>

          </div>
          {/* Add output container */}
          {img && (
            <div className="output-content">
              <Image src={img} width={512} height={512} alt={finalPrompt} />
              {/* Add prompt here */}
              <p>{finalPrompt}</p>
            </div>
          )}

        </div>




        <div className="badge-container grow">
          <a
            href="https://naga-apparel.com"
            target="_blank"
            rel="noreferrer"
          >
            <div className="badge">
              <Image src={Naga} alt="buildspace logo" />
              <p>build by Naga Apparel</p>
            </div>
          </a>
        </div>
      </div>
    </div>
  );
};

export default Home;
