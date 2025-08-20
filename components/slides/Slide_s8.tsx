import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import Mermaid from '../../components/Mermaid';

export default function Slide() {
  const markdown = `- Noise = café smells and heat leaks: decoherence muddles delicate quantum “flavor”
- Scaling is tricky: more qubits ⇒ more crosstalk/routing; quality beats raw count
- Two tools: error mitigation (today) and error correction (encode 1 logical in many physical)
- Progress: bigger codes → lower logical error, but overhead remains thousands:1
- Near term: shallow, hybrid circuits; long term: fault-tolerant subroutines
\`\`\`python
# Tiny noise demo (Qiskit)
from qiskit import QuantumCircuit
from qiskit_aer import AerSimulator
from qiskit_aer.noise import NoiseModel, depolarizing_error
qc = QuantumCircuit(1,1)
qc.h(0); qc.measure(0,0)
noise = NoiseModel()
noise.add_all_qubit_quantum_error(depolarizing_error(0.02, 1), ['h'])
sim = AerSimulator(noise_model=noise)
print(sim.run(qc, shots=1000).result().get_counts())
\`\`\`
\`\`\`mermaid
flowchart TD
Noise["Noise -> 'flavor' leaks"]
Deco["Decoherence: 'coffee cools'"]
Scale["Scaling: more cups, more crosstalk"]
Mit["Error mitigation (today)"]
EC["Error correction (logical qubits, surface codes)"]
Noise --> Deco -->|limits depth| Mit
Scale -->|quality > quantity| Mit
Deco --> EC
Scale --> EC
\`\`\``;
  
  return (
    <div className="slide markdown-slide">
      <h1>Reality Check: Noise, Scaling, and Paths to Error Correction</h1>
      <ReactMarkdown 
        remarkPlugins={[remarkGfm]}
        components={{
          code({node, inline, className, children, ...props}: any) {
            const match = /language-(\w+)/.exec(className || '');
            const language = match ? match[1] : '';
            
            // Handle inline code
            if (inline) {
              return (
                <code className={className} {...props}>
                  {children}
                </code>
              );
            }
            
            // Handle mermaid diagrams
            if (language === 'mermaid') {
              return (
                <Mermaid chart={String(children).replace(/\n$/, '')} />
              );
            }
            
            // Handle code blocks with syntax highlighting
            if (language) {
              return (
                <SyntaxHighlighter
                  language={language}
                  style={atomDark}
                  showLineNumbers={true}
                  PreTag="div"
                  {...props}
                >
                  {String(children).replace(/\n$/, '')}
                </SyntaxHighlighter>
              );
            }
            
            // Default code block without highlighting
            return (
              <pre>
                <code className={className} {...props}>
                  {children}
                </code>
              </pre>
            );
          }
        }}
      >
        {markdown}
      </ReactMarkdown>
    </div>
  );
}