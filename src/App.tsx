import { useState } from 'react';
import { AzureOpenAI } from "openai";
import './App.css';

const endpoint = "https://hackathonaistu9265075225.openai.azure.com/";
const apiVersion = "2024-02-15-preview";
const deployment = "gpt-4"; //This must match your deployment name.

const remoteRequest = async (messages: Msg[], apiKey: string): Promise<string> => {
  const client = new AzureOpenAI({ endpoint, apiKey, apiVersion, deployment, dangerouslyAllowBrowser: true });
  const remoteMessages = [
    { role: "system", content: "Zbierasz dane do formularza PCC-3. Potrzebne dane to: PESEL (liczba 11 cyfr), przedmiot sprzedaży (minimum 3 słowa), kwota sprzedaży w PLN. Pytaj po kolei o każdą daną. Po otrzymaniu odpowiedzi natychmiast ją waliduj i nie przechodź do kolejnej danej jeśli poprzednia jest niepoprawna. Nie akceptuj odpowiedzi w stylu: nie wiem, nie interesuj się. Przestań rozmawiać natychmiast po uzyskaniu wszystkich potrzebnych danych i zwróć je w formacie JSON: { \"PESEL\": {PESEL}, \"object\": {przedmiot sprzedaży}, \"price\": {kwota sprzedaży w PLN} }" },
    ...messages
  ]
  
  const result = await client.chat.completions.create({
    messages: remoteMessages
  });

  let response = ""; 
  for (const choice of result.choices) {
    response += choice.message.content;
  }
  return response;
};

type Msg = {
  role: "user" | "assistant";
  content: string;
};

function App() {
  const [prompt, setPrompt] = useState<string>("Brother");
  const [messages, setMessages] = useState<Msg[]>([]);
  const [showPrompt, setShowPrompt] = useState<boolean>(true);
  const [apiKey, setApiKey] = useState<string>("");

  const displayMessages: Msg[] = [
    { role: "assistant", content: "Witam, pomogę Ci wypełnić formularz PCC. Opisz swoją sprawę najlepiej jak umiesz." },
     ...messages
  ]


  const handleChange =  (event: React.ChangeEvent<HTMLInputElement>) => {
    setPrompt(event.target.value);
  }

  const handleAPIKeyChange =  (event: React.ChangeEvent<HTMLInputElement>) => {
    setApiKey(event.target.value);
  }

  const handleSend = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setShowPrompt(false);

    const newMessages = [...messages];
    newMessages.push({ role: "user", content: prompt});
    setMessages(newMessages);

    const response = await remoteRequest(messages, apiKey);
    newMessages.push({ role: "assistant", content: response});
    setMessages(newMessages);
    
    setPrompt("");
    setShowPrompt(true);
  }

  const isButtonDisabled = prompt.length < 1;

  return (
    <div className="app-container">
      Azure Open AI api key: <input value={apiKey} type="text" onChange={handleAPIKeyChange}></input>
      <div className="chat-window">
        { displayMessages.map((m: Msg, index: number) => <div key={index} className={`dialog-cloud ${m.role as string}`}>{m.content}</div>) }
        { showPrompt ?  
          <div>
            <input type="text" value={prompt} onChange={handleChange} />
            <form onSubmit={handleSend} >
              <button type="submit" disabled={isButtonDisabled}>Wyślij</button>
            </form>
          </div>
          :
          <div>Waiting...</div>
        }
      </div>
    </div>
  )
}

export default App
