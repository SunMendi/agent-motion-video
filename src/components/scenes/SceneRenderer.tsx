import React from 'react';
import { Scene } from '../../types/scene';

// Scene groups
import { Scene01, Scene02, Scene03, Scene04, Scene05, Scene06 } from './Scene01To06';
import { Scene07, Scene08, Scene09 } from './Scene07To09';
import { Scene10, Scene11, Scene12, Scene13, Scene14 } from './Scene10To14';
import { Scene15, Scene16, Scene17 } from './Scene15To17';
import {
  Scene18, Scene19, Scene20, Scene21, Scene22,
  Scene23, Scene24, Scene25, Scene26, Scene27,
} from './Scene18To27';
import { Scene28, Scene29, Scene30, Scene31, Scene32 } from './Scene28To32';

interface SceneRendererProps {
  scene: Scene;
}

export const SceneRenderer: React.FC<SceneRendererProps> = ({ scene }) => {
  const renderSceneContent = () => {
    switch (scene.scene_number) {
      case 1: return <Scene01 scene={scene} />;
      case 2: return <Scene02 scene={scene} />;
      case 3: return <Scene03 scene={scene} />;
      case 4: return <Scene04 scene={scene} />;
      case 5: return <Scene05 scene={scene} />;
      case 6: return <Scene06 scene={scene} />;
      case 7: return <Scene07 scene={scene} />;
      case 8: return <Scene08 scene={scene} />;
      case 9: return <Scene09 scene={scene} />;
      case 10: return <Scene10 scene={scene} />;
      case 11: return <Scene11 scene={scene} />;
      case 12: return <Scene12 scene={scene} />;
      case 13: return <Scene13 scene={scene} />;
      case 14: return <Scene14 scene={scene} />;
      case 15: return <Scene15 scene={scene} />;
      case 16: return <Scene16 scene={scene} />;
      case 17: return <Scene17 scene={scene} />;
      case 18: return <Scene18 scene={scene} />;
      case 19: return <Scene19 scene={scene} />;
      case 20: return <Scene20 scene={scene} />;
      case 21: return <Scene21 scene={scene} />;
      case 22: return <Scene22 scene={scene} />;
      case 23: return <Scene23 scene={scene} />;
      case 24: return <Scene24 scene={scene} />;
      case 25: return <Scene25 scene={scene} />;
      case 26: return <Scene26 scene={scene} />;
      case 27: return <Scene27 scene={scene} />;
      case 28: return <Scene28 scene={scene} />;
      case 29: return <Scene29 scene={scene} />;
      case 30: return <Scene30 scene={scene} />;
      case 31: return <Scene31 scene={scene} />;
      case 32: return <Scene32 scene={scene} />;
      default: return null;
    }
  };

  return (
    <div className="w-full h-full relative overflow-hidden flex flex-col justify-center items-center">
      {renderSceneContent()}
    </div>
  );
};
