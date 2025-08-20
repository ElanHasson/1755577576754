import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import Mermaid from '../../components/Mermaid';

export default function Slide() {
  const markdown = `- Bits vs qubits: a café light is either off or on; a qubit can be a smooth mocha blend of both
- Superposition: before you taste, the blend carries "0" and "1" flavors with tunable weights
- Measurement: one sip fixes a flavor this time, but repeats reveal the underlying blend
- Gates = barista steps: a Hadamard makes a 50/50 mocha; recipes shape probabilities via interference
- Why care: blending and sculpting probabilities is the secret sauce behind quantum speedups
\`\`\`mermaid
flowchart TD
A["Light switch: 0 or 1"] --> B["Mocha blend: superposition (0 and 1)"]
B --> C["Sip = measurement → definite 0 or 1"]
C --> D["Repeat sips → probability pattern"]
D --> E["Gates choreograph flavors: interference"]
\`\`\`
\`\`\`python
# Qiskit demo: create a 50/50 "mocha" with a Hadamard, then taste it
from qiskit import QuantumCircuit, Aer, execute

qc = QuantumCircuit(1, 1)
qc.h(0)           # blend |0> into (|0> + |1>)/√2
qc.measure(0, 0)  # take a sip

backend = Aer.get_backend('qasm_simulator')
result = execute(qc, backend, shots=1000).result()
print(result.get_counts())  # ~{'0': 500, '1': 500}
\`\`\``;
  
  return (
    <div className="slide markdown-slide">
      <h1>From Light Switches to Mocha Blends: Bits and Qubits in Plain Language</h1>
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