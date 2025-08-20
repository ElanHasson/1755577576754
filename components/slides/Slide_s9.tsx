import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import Mermaid from '../../components/Mermaid';

export default function Slide() {
  const markdown = `- **Key takeaways:** Quantum's special sauce is superposition, interference, and entanglement; measurement collapses possibilities; decoherence is the coffee cooling; quantum is not faster for everything
- **Try it now:** Simulators (Qiskit Aer, Cirq, PennyLane); Cloud access (IBM Quantum, AWS Braket, Azure Quantum)
- **Mini activities:** One-qubit H superposition; Bell twin cats; 2-qubit Grover; compare ideal vs noisy runs
- **Resources and next steps:** Docs and intro courses; PQC readiness with NIST standards; share and remix classroom notebooks

\`\`\`python
# Bell pair demo with Qiskit Aer
from qiskit import QuantumCircuit
from qiskit_aer import AerSimulator

qc = QuantumCircuit(2)
qc.h(0)          # create superposition
qc.cx(0, 1)      # entangle: Bell state
qc.measure_all()

sim = AerSimulator()
result = sim.run(qc, shots=1024).result()
counts = result.get_counts()
print(counts)    # expect mostly '00' and '11'
\`\`\`

\`\`\`mermaid
flowchart LR
Start[Open a simulator]
Demos[Run quick demos: H, Bell, mini-Grover]
Noise[Compare ideal vs noisy runs]
Resources[Explore docs and course kits]
Share[Share class-ready notebooks]
Start --> Demos --> Noise --> Resources --> Share
\`\`\``;
  
  return (
    <div className="slide markdown-slide">
      <h1>Key Takeaways and Where to Play Next: Simulators, Activities, and Resources</h1>
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