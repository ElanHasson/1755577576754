import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import Mermaid from '../../components/Mermaid';

export default function Slide() {
  const markdown = `**Interference: latte art for probabilities**
- Quantum pours (phases) make amplitudes add or cancel—like latte art enhancing or washing out shapes
- Hadamard (H) splits one flavor into a balanced blend; recombining with the right phase amplifies targets
- H then H returns to the start: constructive on the correct path, destructive on the rest
- Algorithms like Grover choreograph pours to boost the right answer and suppress wrong ones

\`\`\`python
# Interference mini-circuits (Qiskit)
from qiskit import QuantumCircuit

# 1) H then H: back to |0> via destructive/constructive interference
qc_interf_reset = QuantumCircuit(1, 1)
qc_interf_reset.h(0)
qc_interf_reset.h(0)
qc_interf_reset.measure(0, 0)

# 2) Change the phase in between: flip the outcome
# Using Z rotates the phase so H-Z-H ≈ X, which flips |0> to |1>
qc_interf_flip = QuantumCircuit(1, 1)
qc_interf_flip.h(0)
qc_interf_flip.z(0)
qc_interf_flip.h(0)
qc_interf_flip.measure(0, 0)
\`\`\`

**Entanglement: the mystery twin cats**
- Prepare together (H then CNOT) to share one description; measure one and the other is instantly predictable in our information
- Correlations stronger than any classical recipe—Bell pairs are the simplest example
- Not faster-than-light messaging: outcomes are random until we compare notes
- Noise “smears the art”: disturbance breaks correlations (decoherence)

\`\`\`python
# Bell pair (twin cats): H then CNOT, measure both
from qiskit import QuantumCircuit
bell = QuantumCircuit(2, 2)
bell.h(0)
bell.cx(0, 1)
bell.measure([0, 1], [0, 1])
\`\`\`

\`\`\`mermaid
flowchart TD
A["Hadamard 'split'"] --> B["Phase choices (pour patterns)"]
B --> C["Constructive interference: target amplified"]
B --> D["Destructive interference: wrong paths cancel"]
E["Prepare twin cats: H then CNOT"] --> F["Shared state (Bell pair)"]
F --> G["Measure cat A"]
G --> H["Cat B outcome correlated"]
H --> I["No faster-than-light messages"]
\`\`\``;
  
  return (
    <div className="slide markdown-slide">
      <h1>Latte Art Interference and the Mystery Twin Cats: Interference and Entanglement</h1>
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