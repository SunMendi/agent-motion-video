import React from 'react';
import {Composition} from 'remotion';
import {MainVideo} from '../video/MainVideo';
import project from '../video/project.json';
import {SetupSmoke} from './SetupSmoke';
import './workspace.compiled.css';

/** Separate entry point keeps current-video CSS and context out of legacy compositions. */
export const WorkspaceRoot: React.FC = () => (
  <>
    <Composition
      id="current-video"
      component={MainVideo}
      durationInFrames={project.durationInFrames}
      fps={project.fps}
      width={project.width}
      height={project.height}
    />
    <Composition id="workspace-setup" component={SetupSmoke} durationInFrames={30} fps={30} width={640} height={640} />
  </>
);
