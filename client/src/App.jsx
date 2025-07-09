import { useState } from 'react'
import './App.css'

function App() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [prompts, setPrompts] = useState([]);
  const [loading, setLoading] = useState(false);

  const generatePrompt = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/generate-prompt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userInput: input, desiredOutput: output })
      });
      const data = await res.json();
      setPrompts(data.prompts);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  return (
    <div className="App">
      <div className="prompt-generator">
      <h1>Effective Prompt Generator</h1>
      <textarea placeholder="Enter input/context..." value={input} onChange={e => setInput(e.target.value)} />
      <textarea placeholder="Expected output..." value={output} onChange={e => setOutput(e.target.value)} />
      <button onClick={generatePrompt} disabled={loading}>
        {loading ? 'Generating...' : 'Generate Prompt'}
      </button>
      <div>
        {prompts.map((p, i) => <li className="list-items" key={i}><span>{p}</span></li>)}
      </div>
      </div>
    </div>
  );
}

export default App;
