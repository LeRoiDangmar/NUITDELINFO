import { useState, useRef } from "react";
import { motion } from "framer-motion";

interface InclusiveGameProps {
  onComplete: () => void;
}

interface Node {
  id: string;
  label: string;
  emoji: string;
  x: number;
  y: number;
  connected: boolean;
}

const initialNodes: Node[] = [
  { id: 'eleve', label: 'Élève', emoji: '👨‍🎓', x: 20, y: 20, connected: false },
  { id: 'prof', label: 'Prof', emoji: '👩‍🏫', x: 80, y: 20, connected: false },
  { id: 'tech', label: 'Technicien', emoji: '🔧', x: 20, y: 80, connected: false },
  { id: 'parent', label: 'Parent', emoji: '👪', x: 80, y: 80, connected: false },
  { id: 'center', label: 'NIRD', emoji: '🌐', x: 50, y: 50, connected: true },
];

const InclusiveGame = ({ onComplete }: InclusiveGameProps) => {
  const [nodes, setNodes] = useState<Node[]>(initialNodes);
  const [connections, setConnections] = useState<string[]>([]);
  const [started, setStarted] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const gameAreaRef = useRef<HTMLDivElement>(null);

  const handleNodeClick = (nodeId: string) => {
    if (completed) return;

    if (!selectedNode) {
      setSelectedNode(nodeId);
    } else if (selectedNode === nodeId) {
      setSelectedNode(null);
    } else {
      // Create connection
      const connectionKey = [selectedNode, nodeId].sort().join('-');
      
      if (!connections.includes(connectionKey)) {
        // Check if one of them is center
        if (selectedNode === 'center' || nodeId === 'center') {
          const otherNode = selectedNode === 'center' ? nodeId : selectedNode;
          
          setConnections(prev => [...prev, connectionKey]);
          setNodes(prev => prev.map(n => 
            n.id === otherNode ? { ...n, connected: true } : n
          ));
          
          // Check if all connected
          const newConnectedCount = nodes.filter(n => n.connected).length + 1;
          if (newConnectedCount >= nodes.length) {
            setCompleted(true);
          }
        }
      }
      
      setSelectedNode(null);
    }
  };

  if (!started) {
    return (
      <div className="text-center py-8">
        <div className="text-4xl mb-4">🌐</div>
        <h3 className="text-sm text-screen mb-4">RÉSEAU INCLUSIF</h3>
        <p className="text-[10px] text-muted-foreground mb-6 leading-relaxed">
          Connectez tous les acteurs au centre NIRD !<br />
          Cliquez sur deux nœuds pour les relier.<br />
          Élèves, Profs, Techniciens, Parents... tous ensemble !
        </p>
        <button
          onClick={() => setStarted(true)}
          className="win95-button text-[10px]"
        >
          ▶ JOUER
        </button>
      </div>
    );
  }

  if (completed) {
    return (
      <div className="text-center py-8">
        <div className="text-4xl mb-4">🎉</div>
        <h3 className="text-sm text-screen mb-2">RÉSEAU CRÉÉ !</h3>
        <p className="text-[10px] text-screen mb-6 italic">
          "Un numérique pour tous, construit par tous."
        </p>
        <button onClick={onComplete} className="win95-button text-[10px]">
          CONTINUER
        </button>
      </div>
    );
  }

  const connectedCount = nodes.filter(n => n.connected).length;

  return (
    <div>
      {/* HUD */}
      <div className="flex justify-between mb-2 text-[10px]">
        <span className="text-screen">Connectés: {connectedCount}/{nodes.length}</span>
        <span className="text-muted-foreground">
          {selectedNode ? 'Cliquez sur un autre nœud' : 'Sélectionnez un nœud'}
        </span>
      </div>

      {/* Game area */}
      <div
        ref={gameAreaRef}
        className="relative bg-terminal-light h-64 overflow-hidden pixel-border-inset"
      >
        {/* Draw connections */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          {connections.map(conn => {
            const [id1, id2] = conn.split('-');
            const node1 = nodes.find(n => n.id === id1);
            const node2 = nodes.find(n => n.id === id2);
            if (!node1 || !node2) return null;
            
            return (
              <line
                key={conn}
                x1={`${node1.x}%`}
                y1={`${node1.y}%`}
                x2={`${node2.x}%`}
                y2={`${node2.y}%`}
                stroke="hsl(200, 80%, 50%)"
                strokeWidth="3"
                strokeDasharray="5,5"
              />
            );
          })}
        </svg>

        {/* Nodes */}
        {nodes.map(node => (
          <motion.button
            key={node.id}
            className={`absolute transform -translate-x-1/2 -translate-y-1/2 p-2 rounded transition-all ${
              selectedNode === node.id
                ? 'ring-4 ring-screen scale-110'
                : node.connected
                ? 'ring-2 ring-forest-light'
                : ''
            }`}
            style={{ left: `${node.x}%`, top: `${node.y}%` }}
            onClick={() => handleNodeClick(node.id)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="text-3xl">{node.emoji}</div>
            <div className="text-[8px] text-foreground mt-1 whitespace-nowrap">
              {node.label}
            </div>
          </motion.button>
        ))}
      </div>

      <p className="text-[8px] text-muted-foreground text-center mt-2">
        Cliquez sur NIRD 🌐 puis sur un acteur pour le connecter
      </p>
    </div>
  );
};

export default InclusiveGame;
