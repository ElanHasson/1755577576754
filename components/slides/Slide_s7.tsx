import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useEffect, useRef } from 'react';
import mermaid from 'mermaid';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

export default function Slide() {
  const markdown = `- **Chemistry & materials (near-term wins):** Think better coffee filters—quantum helps model small molecules and material fragments for catalysts and batteries using hybrid methods (VQE) with error mitigation
- **Optimization & logistics (pilots today):** Plan café delivery routes or staff shifts—formulate as cost functions and try QAOA/annealing; combine with classical heuristics; results are problem-dependent
- **Security (act now):** Shor would break RSA/ECC at scale later; today we migrate to post‑quantum cryptography—NIST-picked ML‑KEM (Kyber) for key exchange and ML‑DSA (Dilithium) for signatures; defend against “harvest now, decrypt later”
- **How it really runs today:** Hybrid loop—propose recipe, run on qubits, taste (measure), tweak with a classical optimizer; works on simulators and select cloud devices
- **Reality check:** We’re in the NISQ era—noisy hardware, small problems; measure utility against solid classical baselines and use error mitigation
\`\`\`python
# Hybrid “chef + taster” loop (Python-like pseudocode)
params = init()
for step in range(50):
    # propose a quantum circuit with current params
    circuit = build_ansatz(params)
    # run on simulator or cloud backend; get energy or route cost
    value, gradients = run_and_measure(circuit)
    # classical optimizer updates the recipe
    params = update(params, gradients)
print("Best measured value:", value)
\`\`\`
\`\`\`mermaid
flowchart TD
A["Choose parameters (theta)"] --> B["Run quantum circuit"]
B --> C["Measure energy/cost"]
C --> D["Classical optimizer updates theta"]
D --> E{"Converged?"}
E -->|No| A
E -->|Yes| F["Use result (molecule/route)"]
\`\`\``;
  const mermaidRef = useRef(0);
  
  useEffect(() => {
    mermaid.initialize({ 
      startOnLoad: true,
      theme: 'dark',
      themeVariables: {
        primaryColor: '#667eea',
        primaryTextColor: '#fff',
        primaryBorderColor: '#7c3aed',
        lineColor: '#5a67d8',
        secondaryColor: '#764ba2',
        tertiaryColor: '#667eea',
        background: '#1a202c',
        mainBkg: '#2d3748',
        secondBkg: '#4a5568',
        tertiaryBkg: '#718096',
        textColor: '#fff',
        nodeTextColor: '#fff',
      }
    });
    
    // Find and render mermaid diagrams
    const renderDiagrams = async () => {
      const diagrams = document.querySelectorAll('.language-mermaid');
      for (let i = 0; i < diagrams.length; i++) {
        const element = diagrams[i];
        const graphDefinition = element.textContent;
        const id = `mermaid-${mermaidRef.current++}`;
        
        try {
          const { svg } = await mermaid.render(id, graphDefinition);
          element.innerHTML = svg;
          element.classList.remove('language-mermaid');
          element.classList.add('mermaid-rendered');
        } catch (error) {
          console.error('Mermaid rendering error:', error);
        }
      }
    };
    
    renderDiagrams();
  }, [markdown]);
  
  return (
    <div className="slide markdown-slide">
      <h1>What Quantum Helps With Today: Chemistry, Optimization, and Security</h1>
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
                <pre className="language-mermaid">
                  <code>{String(children).replace(/\n$/, '')}</code>
                </pre>
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