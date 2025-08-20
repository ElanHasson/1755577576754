import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import Mermaid from '../../components/Mermaid';

export default function Slide() {
  const markdown = `- Build an entangled "twin cats" pair with Hadamard (H) + CNOT
- Measure many runs: you see 00 and 11; 01/10 vanish in the ideal case
- Each cat alone looks 50/50 random; together they are perfectly correlated
- **Correlation ≠ communication**: measuring one updates our information, not the other's physics
- On real hardware, small 01/10 counts appear due to noise (decoherence)
\`\`\`python
# Qiskit demo: Bell pair (twin cats) correlations
from qiskit import QuantumCircuit, Aer, execute
qc = QuantumCircuit(2, 2)
qc.h(0); qc.cx(0, 1)
qc.measure([0, 1], [0, 1])
backend = Aer.get_backend('qasm_simulator')
counts = execute(qc, backend, shots=1024).result().get_counts()
print(counts)  # Expect ~{'00': ~512, '11': ~512}
\`\`\`
\`\`\`mermaid
flowchart LR
A["Start: |00>"] --> B["H on qubit 0 -> (|0>+|1>)/√2 ⊗ |0>"]
B --> C["CNOT 0→1 -> (|00>+|11>)/√2"]
C --> D["Measure many shots"]
D --> E["Correlated outcomes: 00 or 11"]
D --> F["Singles: each ~50/50"]
\`\`\``;
  
  return (
    <div className="slide markdown-slide">
      <h1>Twin Cats Bell Pair: Correlations Without Messaging</h1>
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