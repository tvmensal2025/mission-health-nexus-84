import React from 'react';

interface Personagem3DProps {
  genero: 'masculino' | 'feminino';
  altura?: number;
  peso?: number;
  className?: string;
  style?: React.CSSProperties;
  controls?: {
    rotation?: { x: number; y: number; z: number };
    zoom?: number;
    position?: { x: number; y: number };
    autoRotate?: boolean;
  };
}

const PersonagemCorporal3D: React.FC<Personagem3DProps> = ({ 
  genero, 
  altura, 
  peso, 
  className = "",
  style = {},
  controls = {}
}) => {
  // IDs dos modelos do Sketchfab
  const modelIds = {
    feminino: 'fe2c95ec93714e729becd46b2c37d3bb',
    masculino: 'ebae6cc235c144cea4d46b3105f868a6'
  };

  const modelId = modelIds[genero];
  
  // Aplicar controles personalizados
  const rotation = controls.rotation || { x: 0, y: 0, z: 0 };
  const zoom = controls.zoom || 1;
  const position = controls.position || { x: 0, y: 0 };
  const autoRotate = controls.autoRotate !== false; // default true
  
  // URL do Sketchfab com parâmetros para remover UI e logos + controles customizados
  const sketchfabUrl = `https://sketchfab.com/models/${modelId}/embed?` + 
    'ui_controls=0&' +           // Remove controles da UI
    'ui_infos=0&' +              // Remove informações
    'ui_stop=0&' +               // Remove botão de parar
    'ui_watermark=0&' +          // Remove marca d'água
    'ui_help=0&' +               // Remove ajuda
    'ui_settings=0&' +           // Remove configurações
    'ui_vr=0&' +                 // Remove VR
    'ui_fullscreen=0&' +         // Remove fullscreen
    'ui_annotations=0&' +        // Remove anotações
    'ui_loading=0&' +            // Remove loading
    'ui_inspector=0&' +          // Remove inspetor
    'autostart=1&' +             // Inicia automaticamente
    `autospin=${autoRotate ? '0.2' : '0'}&` +  // Rotação automática baseada no controle
    'camera=0&' +                // Câmera fixa
    `camera_pitch=${rotation.x}&` +  // Rotação X
    `camera_yaw=${rotation.y}&` +    // Rotação Y
    `zoom=${zoom}`;                  // Zoom

  return (
    <div className={`relative ${className}`} style={{
      ...style,
      transform: `translate(${position.x}px, ${position.y}px) scale(${zoom})`
    }}>
      {/* Medidas corporais */}
      {altura && (
        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-xs font-medium text-gray-700 z-10">
          {altura} cm
        </div>
      )}
      
      {peso && (
        <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-xs font-medium text-gray-700 z-10">
          {peso.toFixed(1)} kg
        </div>
      )}
      
      {/* iframe do modelo 3D */}
      <iframe
        title={`Modelo 3D ${genero}`}
        src={sketchfabUrl}
        frameBorder="0"
        allowFullScreen
        allow="autoplay; fullscreen; xr-spatial-tracking"
        className="w-full h-full rounded-lg"
        style={{ 
          minHeight: '300px',
          background: 'transparent'
        }}
      />
      
      {/* Overlay transparente para capturar eventos se necessário */}
      <div className="absolute inset-0 pointer-events-none" />
    </div>
  );
};

export default PersonagemCorporal3D;