import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import Mermaid from '../../components/Mermaid';

export default function Slide() {
  const markdown = `- Measurement fixes a fuzzy blend into a definite sip; probabilities come from how the qubit was mixed
- You can’t taste without changing it: one sip collapses the superposition to 0 or 1
- Decoherence is the room stealing flavor: cooling and bumps scramble phase and reduce interference
- We buy time with insulation, quick recipes, and mitigation; still, shorter circuits beat the clock
- Key times: T1 (energy relax) cools the cup, T2 (phase memory) smears the pattern
\`\`\`python
# Quick taste-test: superposition vs noisy sips (Qiskit)
from qiskit import QuantumCircuit
from qiskit_aer import Aer
from qiskit_aer.noise import NoiseModel, phase_damping_error

qc = QuantumCircuit(1, 1)
qc.h(0); qc.measure(0, 0)
sim = Aer.get_backend('aer_simulator')
ideal = sim.run(qc, shots=2000).result().get_counts()

noise = NoiseModel()
noise.add_all_qubit_quantum_error(phase_damping_error(0.5), ['id','h'])
noisy = sim.run(qc, shots=2000, noise_model=noise).result().get_counts()
print('ideal ~50/50:', ideal)
print('with decoherence:', noisy)
\`\`\`
\`\`\`mermaid
flowchart LR
A["Fresh blend: superposition"] --> B["Sip: measurement"]
B --> C["Definite taste: 0 or 1"]
A --> D["Environment: air, bumps"]
D --> E["Cooling & spills: decoherence"]
E --> F["Lost phases: weaker interference"]
F --> C
G["Insulate & hurry: error mitigation"] --> A
G --> C
\`\`\``;
  
  return (
    <div className="slide markdown-slide">
      <h1>Sips, Spills, and Cooling Cups: Measurement and Decoherence</h1>
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